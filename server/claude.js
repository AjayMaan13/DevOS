const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-haiku-4-5-20251001';

const FAKE_GMAIL = `Email 1 — From: Sarah Chen | Subject: Re: API integration PR review
Summary: Asking if you can review her pull request before EOD, it's blocking the team.

Email 2 — From: GitHub | Subject: [DevOS] CI pipeline failed on main
Summary: The latest push broke the build, tests failing on Node 18.

Email 3 — From: Manager | Subject: Quick sync tomorrow?
Summary: Wants a 15-min standup at 10am to discuss sprint progress.`;

const FAKE_GCAL = `9:00 AM  — Team standup (30 min)
10:00 AM — 1:1 with manager (15 min)
2:00 PM  — Sprint planning (1 hour)
Free blocks: 11:00 AM–2:00 PM, 3:00 PM–5:00 PM`;

async function runDevOS(command) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    // --- Real Notion MCP call ---
    let notionData = 'No Notion tasks found.';
    try {
      const notionResponse = await client.beta.messages.create({
        model: MODEL,
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: 'Search Notion for my tasks. Return the top 3 with: task name, status, and priority.'
        }],
        mcp_servers: [{ type: 'url', url: process.env.NOTION_MCP_URL, name: 'notion' }],
        tools: [{ type: 'mcp_toolset', mcp_server_name: 'notion' }],
        betas: ['mcp-client-2025-11-20'],
      });
      const textBlocks = notionResponse.content.filter(b => b.type === 'text');
      if (textBlocks.length) notionData = textBlocks[textBlocks.length - 1].text;
    } catch (e) {
      console.log('[notion error — using fallback]', e.message);
      notionData = 'Task: DevOS backend integration — Status: In Progress — Priority: High';
    }

    console.log('[notion]', notionData);

    // --- Synthesis call: Notion (real) + Gmail + GCal (realistic) ---
    const synthesis = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are DevOS, an AI command center for a software engineer.

NOTION TASKS (live):
${notionData}

GMAIL — 3 recent emails:
${FAKE_GMAIL}

GOOGLE CALENDAR — today:
${FAKE_GCAL}

USER COMMAND: ${command}

Based on all three sources, return ONLY a raw JSON object. No markdown fences, no explanation, no preamble.
Exact format: {"plan":"bullet list of today's priorities","email":"short draft reply to most urgent email","code":"starter JS for the top Notion coding task"}`
      }],
    });

    const rawText = synthesis.content[0].text;
    console.log('[raw synthesis]', rawText);

    // Extract JSON safely
    let depth = 0, jsonEnd = -1;
    for (let i = 0; i < rawText.length; i++) {
      if (rawText[i] === '{') depth++;
      else if (rawText[i] === '}') {
        depth--;
        if (depth === 0) { jsonEnd = i; break; }
      }
    }
    const jsonStr = jsonEnd !== -1
      ? rawText.slice(rawText.indexOf('{'), jsonEnd + 1)
      : rawText;

    const parsed = JSON.parse(jsonStr);

    if (!parsed.plan || !parsed.email || !parsed.code) {
      throw new Error('Claude returned an unexpected response format.');
    }

    return parsed;

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { runDevOS };
