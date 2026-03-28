# DevOS

> AI-powered command center for software engineers. One prompt. Live context from Notion, Gmail, and Google Calendar.

![DevOS Screenshot](./screenshot.png)

## What It Does

DevOS is a local AI assistant that reads your actual work context — not a generic chatbot making things up. Type one natural language command and it simultaneously reads your Notion tasks, Gmail inbox, and Google Calendar. Claude synthesizes everything into a daily plan, an email draft, a priority explainer that tells you *why* a specific task matters most right now, and writes the plan back to your Notion workspace automatically.

## How It Works

1. You type a command in the React frontend (`localhost:3000`)
2. Frontend POSTs to an Express backend on port 3001
3. Backend makes a live call to Notion MCP — fetching your real tasks from your workspace
4. Claude receives Notion data plus email and calendar context
5. Claude returns a JSON object with four fields: `plan`, `email`, `reasoning`, and `code`
6. Frontend renders each field in its own panel, with a live greeting and date header

## Tech Stack

- **Frontend** — React, plain CSS (dark terminal aesthetic)
- **Backend** — Node.js, Express
- **AI** — Anthropic Claude API (`claude-haiku-4-5-20251001`)
- **Live data** — Notion MCP (`mcp.notion.com/mcp`)
- **Write-back** — Notion REST API (creates "Today's Plan" page after each run)

## Prerequisites

1. Node.js 18+
2. An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)
3. A Notion workspace with at least one task or page
4. Notion integration connected in your Claude.ai settings

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ajaymaan13/devos
   cd devos
   ```

2. Install client dependencies:
   ```bash
   cd client && npm install
   ```

3. Install server dependencies:
   ```bash
   cd ../server && npm install
   ```

4. Copy the env file and fill in your values:
   ```bash
   cp server/.env.example server/.env
   ```

   Required values in `server/.env`:
   ```
   ANTHROPIC_API_KEY=your-key-here
   NOTION_MCP_URL=https://mcp.notion.com/mcp
   ```

   Optional (enables Notion write-back):
   ```
   NOTION_API_KEY=your-notion-integration-secret
   NOTION_PARENT_PAGE_ID=the-page-id-where-plans-are-created
   ```

5. Open two terminals:

   **Terminal 1 — client:**
   ```bash
   cd client && npm start
   ```

   **Terminal 2 — server:**
   ```bash
   cd server && node index.js
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Usage

Type a command like:

```
Plan my day and start my top Notion task
```

Or click one of the suggestion chips below the command bar:
- **Plan my day**
- **What's most urgent?**
- **Draft a standup update**

Press Enter or click **Run**. Claude reads your Notion workspace, cross-references your email and calendar context, and returns in 15–25 seconds with:

- **Today's Plan** — prioritised bullet list for the day
- **Email Draft** — a ready-to-send reply to the most urgent email
- **Why This Matters** — Claude's reasoning for why task X is highest priority right now, grounded in your actual meetings and inbox
- **Notion write-back** — a "Today's Plan" page is automatically created in your Notion workspace (if `NOTION_API_KEY` is configured)

## Built For

The [Notion AI Challenge](https://dev.to/challenges/notion-2026-03-04) — powered by Notion MCP + Anthropic Claude.
