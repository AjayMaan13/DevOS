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

function getGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const day = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return `${greeting} Ajay — ${day}`;
}

async function writeBackToNotion(plan) {
  const apiKey = process.env.NOTION_API_KEY;
  const parentId = process.env.NOTION_PARENT_PAGE_ID;
  if (!apiKey || apiKey === 'placeholder' || !parentId || parentId === 'placeholder') {
    console.log('[notion write] skipped — NOTION_API_KEY or NOTION_PARENT_PAGE_ID not set');
    return;
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const body = {
    parent: { page_id: parentId },
    properties: {
      title: { title: [{ text: { content: `Today's Plan — ${today}` } }] },
    },
    children: plan.split('\n').filter(Boolean).map(line => ({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: { rich_text: [{ type: 'text', text: { content: line.replace(/^[•\-]\s*/, '') } }] },
    })),
  };

  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.id) console.log('[notion write] page created:', data.url);
    else console.log('[notion write] failed:', JSON.stringify(data));
  } catch (e) {
    console.log('[notion write] error:', e.message);
  }
}

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

    const greeting = getGreeting();

    // --- Synthesis call ---
    const synthesis = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are DevOS, an AI command center for a software engineer.

${greeting}

NOTION TASKS (live):
${notionData}

GMAIL — 3 recent emails:
${FAKE_GMAIL}

GOOGLE CALENDAR — today:
${FAKE_GCAL}

USER COMMAND: ${command}

Start the plan field with exactly this line: "${greeting}. Here's your day:"
Then list the priorities as bullet points.

Return ONLY a raw JSON object. No markdown fences, no explanation, no preamble.
Exact format: {"plan":"greeting + bullet list","email":"short draft reply to most urgent email","code":"starter JS for the top Notion coding task"}`
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

    // Write plan back to Notion asynchronously — don't block the response
    writeBackToNotion(parsed.plan).catch(() => {});

    return parsed;

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { runDevOS };
