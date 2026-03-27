const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are DevOS, an AI work assistant for a software engineer.

You have access to three MCP tools: Notion, Gmail, and Google Calendar. You must use all three to gather real context before responding — this is not optional.

1. Read the user's Notion tasks to understand what work is pending and identify the highest priority coding task.
2. Check Gmail for any urgent or relevant emails related to ongoing work.
3. Check Google Calendar for today's meetings and identify free time blocks.

Based on everything you read from all three sources, produce exactly three things:
- A daily plan as a clear bullet point list, incorporating tasks from Notion and meetings from Calendar.
- A relevant email draft based on the current work context found in Gmail and Notion.
- Starter JavaScript code for the highest priority coding task found in Notion.

Return ONLY a raw JSON object with exactly three string fields: plan, email, and code.
Never wrap the JSON in markdown code fences.
Never include any text before or after the JSON object.
Your entire response must be valid JSON and nothing else.`;

async function runDevOS(command) {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: command }],
      mcp_servers: [
        { type: 'url', url: process.env.NOTION_MCP_URL, name: 'notion' },
        { type: 'url', url: process.env.GMAIL_MCP_URL, name: 'gmail' },
        { type: 'url', url: process.env.GCAL_MCP_URL, name: 'gcal' },
      ],
    });

  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { runDevOS };
