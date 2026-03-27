const Anthropic = require('@anthropic-ai/sdk');

const MODEL = 'claude-haiku-4-5-20251001';

async function callMCP(client, mcpServer, task) {
  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: task }],
    mcp_servers: [mcpServer],
    tools: [{ type: 'mcp_toolset', mcp_server_name: mcpServer.name }],
    betas: ['mcp-client-2025-11-20'],
  });

  // Return the last text block (after tool calls complete)
  const textBlocks = response.content.filter(b => b.type === 'text');
  return textBlocks.length ? textBlocks[textBlocks.length - 1].text : '';
}

async function runDevOS(command) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const notionServer = { type: 'url', url: process.env.NOTION_MCP_URL, name: 'notion', authorization_token: process.env.NOTION_TOKEN };
    const gmailServer  = { type: 'url', url: process.env.GMAIL_MCP_URL,  name: 'gmail',  authorization_token: process.env.GMAIL_TOKEN };
    const gcalServer   = { type: 'url', url: process.env.GCAL_MCP_URL,   name: 'gcal',   authorization_token: process.env.GCAL_TOKEN };

    // Three small focused calls — sequential for reliability
    const today = new Date().toISOString().split('T')[0];

    const notionData = await callMCP(client, notionServer, 'Use the notion-view tool on this URL: view://fff90ed6-9e88-4fe5-8ea5-fe80a6fed970 to list tasks. Return the top 1 task with: task name, status, and due date. If view tool is unavailable, fetch https://www.notion.so/4e46bf8589de4649a8012e80f284f9b3 and list any tasks found.');
    const gmailData  = await callMCP(client, gmailServer,  'Get the 3 most recent unread emails. Return only: sender name, subject line, and one sentence summary each.');
    const gcalData   = await callMCP(client, gcalServer,   `Today is ${today}. List all calendar events for today (${today}) only. Return event name and time for each. If none, say "No events today".`);

    console.log('[notion]', notionData);
    console.log('[gmail]',  gmailData);
    console.log('[gcal]',   gcalData);

    // Synthesis call — no MCP, just combine the data into JSON
    const synthesis = await client.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Based on this data, return ONLY a raw JSON object with fields plan, email, code. No markdown, no extra text.

NOTION TOP TASK: ${notionData}

GMAIL (3 emails): ${gmailData}

GCAL TODAY: ${gcalData}

USER COMMAND: ${command}

JSON format: {"plan":"bullet list plan for today","email":"short relevant email draft","code":"starter JS code for the Notion task"}`,
      }],
    });

    const rawText = synthesis.content[0].text;
    console.log('[raw synthesis]', rawText);

    // Extract first complete JSON object
    let depth = 0, jsonEnd = -1;
    for (let i = 0; i < rawText.length; i++) {
      if (rawText[i] === '{') depth++;
      else if (rawText[i] === '}') { depth--; if (depth === 0) { jsonEnd = i; break; } }
    }
    const jsonStr = jsonEnd !== -1 ? rawText.slice(rawText.indexOf('{'), jsonEnd + 1) : rawText;
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
