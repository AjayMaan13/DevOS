const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are DevOS, a work assistant for a software engineer.

Use all three MCP tools to gather context:
- Notion: fetch up to 5 tasks, identify the top priority coding task
- Gmail: fetch up to 3 recent relevant emails only
- Google Calendar: fetch today's events only

Then return ONLY this JSON (no markdown, no extra text):
{"plan":"bullet list of today's plan","email":"one short email draft","code":"starter JS code for top Notion task"}`;

async function runDevOS(command) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.beta.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: command },
        { role: 'assistant', content: '{' },
      ],
      mcp_servers: [
        { type: 'url', url: process.env.NOTION_MCP_URL, name: 'notion', authorization_token: process.env.NOTION_TOKEN },
        { type: 'url', url: process.env.GMAIL_MCP_URL, name: 'gmail', authorization_token: process.env.GMAIL_TOKEN },
        { type: 'url', url: process.env.GCAL_MCP_URL, name: 'gcal', authorization_token: process.env.GCAL_TOKEN },
      ],
      tools: [
        { type: 'mcp_toolset', mcp_server_name: 'notion' },
        { type: 'mcp_toolset', mcp_server_name: 'gmail' },
        { type: 'mcp_toolset', mcp_server_name: 'gcal' },
      ],
      betas: ['mcp-client-2025-11-20'],
    });

    const textBlock = response.content.find(b => b.type === 'text');
    const rawText = '{' + textBlock.text;
    console.log('[raw]', rawText);
    const parsed = JSON.parse(rawText);
    return parsed;

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { runDevOS };
