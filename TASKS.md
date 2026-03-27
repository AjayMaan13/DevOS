# DevOS — Task Breakdown by Phase

> Granular implementation checklist. Work top-to-bottom within each phase. Do not start Phase N+1 until all checkboxes in Phase N are ticked and the checkpoint passes.

---

## Phase 1 — Project Scaffolding
**Goal:** Both servers running locally with zero errors before any feature code is written.

### 1.1 Directory Structure
- [ ] Create root folder `devos/`
- [ ] Create `devos/client/` subfolder
- [ ] Create `devos/server/` subfolder

### 1.2 Frontend Bootstrap
- [ ] Inside `client/`, run `npx create-react-app .` to initialize the React app
- [ ] After CRA finishes, install `@monaco-editor/react` as a dependency
- [ ] Install `axios` as a dependency
- [ ] Verify `client/package.json` lists both `@monaco-editor/react` and `axios` under `dependencies`

### 1.3 Backend Bootstrap
- [ ] Inside `server/`, run `npm init -y` to create `package.json`
- [ ] Install `express` as a dependency
- [ ] Install `cors` as a dependency
- [ ] Install `dotenv` as a dependency
- [ ] Install `@anthropic-ai/sdk` as a dependency
- [ ] Verify all four packages appear in `server/package.json` under `dependencies`

### 1.4 Environment Variables
- [ ] Create `server/.env` file
- [ ] Add `ANTHROPIC_API_KEY=placeholder`
- [ ] Add `NOTION_MCP_URL=placeholder`
- [ ] Add `GMAIL_MCP_URL=placeholder`
- [ ] Add `GCAL_MCP_URL=placeholder`
- [ ] Create `server/.env.example` with the same four keys but no values (for the README setup step)
- [ ] Add `server/.env` to `.gitignore` (create `.gitignore` at project root if it does not exist)

### 1.5 Express Entry Point
- [ ] Create `server/index.js`
- [ ] At the top, call `require('dotenv').config()` before anything else
- [ ] Import `express` and `cors`
- [ ] Instantiate the app with `const app = express()`
- [ ] Apply `app.use(cors())` middleware
- [ ] Apply `app.use(express.json())` middleware
- [ ] Define `GET /health` route that returns `res.json({ ok: true })`
- [ ] Call `app.listen(3001, ...)` with a console.log confirming the port
- [ ] Do not define any other routes in this file yet

### 1.6 Smoke Test
- [ ] Start the Express server: `node index.js` inside `server/`
- [ ] Confirm terminal shows the startup log on port 3001
- [ ] Hit `localhost:3001/health` in a browser or curl and confirm `{"ok":true}` is returned
- [ ] Start the React dev server: `npm start` inside `client/`
- [ ] Confirm `localhost:3000` shows the default Create React App welcome screen
- [ ] Confirm no console errors in either terminal

**Checkpoint:** Both servers are running. `/health` returns `{"ok":true}`. React shows default CRA screen.

---

## Phase 2 — Frontend Layout (Static Shell)
**Goal:** Complete UI visible with hardcoded data. No backend calls yet.

### 2.1 Clean the CRA Boilerplate
- [ ] Delete everything inside `client/src/`
- [ ] Create `client/src/index.js`
- [ ] Create `client/src/App.jsx`
- [ ] Create `client/src/index.css`
- [ ] Create `client/src/components/` folder
- [ ] Create `client/src/components/CommandBar.jsx`
- [ ] Create `client/src/components/PlanPanel.jsx`
- [ ] Create `client/src/components/EmailPanel.jsx`
- [ ] Create `client/src/components/CodeEditor.jsx`

### 2.2 index.js
- [ ] Import React and ReactDOM
- [ ] Import `./index.css`
- [ ] Import `App` from `./App`
- [ ] Render `<App />` into the `root` div

### 2.3 App.jsx — State
- [ ] Import `useState` from React
- [ ] Declare `command` state (string, initial value `''`)
- [ ] Declare `loading` state (boolean, initial value `false`)
- [ ] Declare `output` state (object or null, initial value `null`)

### 2.4 App.jsx — handleCommand (static placeholder for now)
- [ ] Define `handleCommand(value)` function
- [ ] Inside it, set `loading` to `true`
- [ ] Set a hardcoded `output` object with:
  - `plan`: a multiline string with 3–4 fake bullet points
  - `email`: a fake email draft string
  - `code`: a short JS code snippet string (e.g., `// TODO: implement task\nconsole.log('hello')`)
- [ ] Set `loading` back to `false`
- [ ] Note: this function will be replaced in Phase 3 — keep it simple

### 2.5 App.jsx — Render
- [ ] Return a `<div className="app">` wrapper
- [ ] Inside it, render `<header><h1>DevOS</h1></header>`
- [ ] Render `<CommandBar onSubmit={handleCommand} loading={loading} />`
- [ ] Conditionally render (only when `output !== null`) a `<div className="panels">` containing:
  - `<PlanPanel plan={output.plan} />`
  - `<EmailPanel email={output.email} />`
  - `<CodeEditor code={output.code} />`

### 2.6 CommandBar.jsx
- [ ] Accept props: `onSubmit`, `loading`
- [ ] Declare local `value` state (string, initial `''`)
- [ ] Render a `<div className="command-bar">`
- [ ] Inside it, render a `<input>` with:
  - `type="text"`
  - `value={value}`
  - `onChange` updating local state
  - `onKeyDown` that calls `onSubmit(value)` when `event.key === 'Enter'` and input is not empty
  - `disabled={loading}`
  - `placeholder="Type a command..."`
- [ ] Render a `<button>` that:
  - calls `onSubmit(value)` on click (guard against empty value)
  - shows text `"Thinking..."` when `loading` is true, otherwise `"Run"`
  - is `disabled={loading}`

### 2.7 PlanPanel.jsx
- [ ] Accept prop: `plan`
- [ ] Render `<div className="panel">`
- [ ] Render `<h3>Today's Plan</h3>`
- [ ] If `plan` is truthy, render `<pre>{plan}</pre>`
- [ ] If `plan` is falsy, render `<p>No plan yet.</p>`

### 2.8 EmailPanel.jsx
- [ ] Accept prop: `email`
- [ ] Render `<div className="panel">`
- [ ] Render `<h3>Email Draft</h3>`
- [ ] If `email` is truthy, render `<pre>{email}</pre>`
- [ ] If `email` is falsy, render `<p>No email yet.</p>`

### 2.9 CodeEditor.jsx
- [ ] Accept prop: `code`
- [ ] Import `Editor` from `@monaco-editor/react`
- [ ] Render `<div className="panel">`
- [ ] Render `<h3>Generated Code</h3>`
- [ ] Render `<Editor>` with these exact props:
  - `height="300px"`
  - `language="javascript"`
  - `theme="vs-dark"`
  - `value={code || '// Code will appear here'}`
  - `options={{ readOnly: true, minimap: { enabled: false } }}`

### 2.10 Smoke Test
- [ ] Save all files and confirm the React dev server hot-reloads without errors
- [ ] Open `localhost:3000`
- [ ] Type anything in the command bar and press Enter
- [ ] Confirm all three panels appear with the hardcoded placeholder content
- [ ] Confirm the Monaco editor renders without a blank screen or console error
- [ ] Confirm the Run button shows "Thinking..." briefly if you added the loading simulation (optional)

**Checkpoint:** All three panels appear on command submit. Monaco renders. No console errors.

---

## Phase 3 — Backend AI Route
**Goal:** Real Claude API call with all three MCP servers. Frontend wired to backend.

### 3.1 Create claude.js
- [ ] Create `server/claude.js`
- [ ] Import `Anthropic` from `@anthropic-ai/sdk`
- [ ] Export a single async function `runDevOS(command)`

### 3.2 Anthropic Client
- [ ] Inside `runDevOS`, instantiate: `const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`

### 3.3 System Prompt
- [ ] Define the system prompt string with all of the following instructions to Claude:
  - It is DevOS, an AI work assistant for a software engineer
  - It has access to three MCP tools: Notion, Gmail, and Google Calendar
  - It must use all three tools to gather real context before responding — not optional
  - Read Notion tasks to understand what work is pending and which task is highest priority
  - Check Gmail for any urgent or relevant emails related to ongoing work
  - Check Google Calendar for today's meetings and identify free time blocks
  - Based on all three sources, produce exactly: a daily plan (bullet list), one email draft (relevant to current work context), and starter JavaScript code (for the highest priority Notion coding task)
  - Return ONLY a raw JSON object — no markdown fences, no prose, no preamble, no explanation
  - The JSON object must have exactly three string fields: `plan`, `email`, `code`

### 3.4 API Call
- [ ] Call `await client.messages.create(...)` with:
  - `model: 'claude-sonnet-4-20250514'`
  - `max_tokens: 2000`
  - `system: <system prompt string>`
  - `messages: [{ role: 'user', content: command }]`
  - `mcp_servers: [...]` array with three objects:
    - `{ type: 'url', url: process.env.NOTION_MCP_URL, name: 'notion' }`
    - `{ type: 'url', url: process.env.GMAIL_MCP_URL, name: 'gmail' }`
    - `{ type: 'url', url: process.env.GCAL_MCP_URL, name: 'gcal' }`
- [ ] Store the result in a `response` variable

### 3.5 Parse and Return
- [ ] Find the text block: `const textBlock = response.content.find(b => b.type === 'text')`
- [ ] Log the raw text to console before parsing: `console.log('[raw]', textBlock.text)`
- [ ] Parse: `const parsed = JSON.parse(textBlock.text)`
- [ ] Return `parsed`

### 3.6 Error Handling in claude.js
- [ ] Wrap the entire function body in `try { ... } catch (err) { throw new Error(err.message) }`
- [ ] This ensures the original error message propagates to the route handler

### 3.7 Wire the Route in index.js
- [ ] At the top of `server/index.js`, require `runDevOS` from `./claude.js`
- [ ] Add `POST /ai-command` route:
  - Extract `command` from `req.body`
  - Call `const result = await runDevOS(command)` inside an async handler
  - On success: `res.json(result)`
  - On failure: `console.error(err)` then `res.status(500).json({ error: err.message })`

### 3.8 Fill in Real .env Values
- [ ] Replace `ANTHROPIC_API_KEY=placeholder` with your real API key
- [ ] Replace `NOTION_MCP_URL=placeholder` with `https://mcp.notion.com/mcp`
- [ ] Replace `GMAIL_MCP_URL=placeholder` with `https://gmail.mcp.claude.com/mcp`
- [ ] Replace `GCAL_MCP_URL=placeholder` with `https://gcal.mcp.claude.com/mcp`
- [ ] Restart the Express server after editing `.env`

### 3.9 Replace Hardcoded handleCommand in App.jsx
- [ ] Remove the hardcoded output object from `handleCommand`
- [ ] Set `loading` to `true` at the start
- [ ] Use `fetch('http://localhost:3001/ai-command', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: value }) })`
- [ ] Await the response
- [ ] Await `response.json()` to get the data
- [ ] Call `setOutput(data)` on success
- [ ] On any error, log it and set output to `{ plan: 'Error — check the console.', email: 'Error — check the console.', code: '// Error — check the console.' }`
- [ ] Always set `loading` to `false` in a `finally` block

### 3.10 End-to-End Smoke Test
- [ ] Restart both servers (client and server)
- [ ] Open `localhost:3000`
- [ ] Type: `Plan my day and start my top Notion task`
- [ ] Click Run
- [ ] Confirm button shows "Thinking..." and input is disabled
- [ ] Wait 10–20 seconds
- [ ] Confirm all three panels populate with real content (not placeholders)
- [ ] Confirm the server terminal logged the raw JSON text from Claude
- [ ] Confirm no 500 errors in the server terminal

**Checkpoint:** Real Notion tasks, Gmail, and Calendar data flows through Claude and appears in all three panels.

---

## Phase 4 — Styling
**Goal:** Clean dark terminal aesthetic using only `index.css`.

### 4.1 CSS Reset
- [ ] At the very top of `index.css`, add: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`

### 4.2 Body and Base
- [ ] Set `body { background: #0f0f0f; color: #f0f0f0; font-family: monospace; }`

### 4.3 App Wrapper
- [ ] `.app { max-width: 1100px; margin: 0 auto; padding: 2rem; }`

### 4.4 Heading
- [ ] `h1 { font-size: 2rem; color: #7ee787; margin-bottom: 1.5rem; }`

### 4.5 Command Bar Layout
- [ ] `.command-bar { display: flex; gap: 0.5rem; margin-bottom: 2rem; }`

### 4.6 Command Bar Input
- [ ] `.command-bar input { flex: 1; padding: 0.75rem 1rem; background: #1a1a1a; border: 1px solid #333; color: #f0f0f0; font-size: 1rem; border-radius: 6px; }`
- [ ] `.command-bar input:disabled { opacity: 0.6; }`

### 4.7 Command Bar Button
- [ ] `.command-bar button { padding: 0.75rem 1.5rem; background: #7ee787; color: #000; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }`
- [ ] `.command-bar button:hover { background: #9ef0a0; }`
- [ ] `.command-bar button:disabled { opacity: 0.5; cursor: default; }`

### 4.8 Panels Grid
- [ ] `.panels { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }`

### 4.9 Individual Panel
- [ ] `.panel { background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 8px; padding: 1rem; }`

### 4.10 Panel Headings
- [ ] `.panel h3 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7ee787; margin-bottom: 0.75rem; }`

### 4.11 Panel Pre Text
- [ ] `.panel pre { white-space: pre-wrap; font-size: 0.9rem; line-height: 1.6; color: #cccccc; }`

### 4.12 Code Editor Full Width
- [ ] Add `className="panel code-editor-panel"` to the wrapper div in `CodeEditor.jsx`
- [ ] `.code-editor-panel { grid-column: 1 / -1; }`

### 4.13 Visual Verification
- [ ] Confirm the app background is near-black (`#0f0f0f`)
- [ ] Confirm the heading `DevOS` is green (`#7ee787`)
- [ ] Confirm the command bar input fills the available width
- [ ] Confirm the Run button is green with black text
- [ ] Confirm PlanPanel and EmailPanel sit side-by-side in a two-column grid
- [ ] Confirm CodeEditor spans the full width below both panels
- [ ] Confirm panel text is readable (off-white `#cccccc`)
- [ ] Confirm no layout overflow or horizontal scroll at 1100px wide

**Checkpoint:** App looks like a clean dark terminal. All panels legible. Monaco editor is full-width.

---

## Phase 5 — Error Handling
**Goal:** App handles failures gracefully without crashing or silently swallowing errors.

### 5.1 Add Error State to App.jsx
- [ ] Add `const [error, setError] = useState(null)` as the fourth piece of state

### 5.2 Render Error Message
- [ ] Below `<CommandBar>` and above the panels `<div>`, add: `{error && <p className="error-message">{error}</p>}`
- [ ] Add to `index.css`: `.error-message { color: #ff6b6b; margin-bottom: 1rem; }`

### 5.3 Clear Error on Success
- [ ] At the start of a successful API response path in `handleCommand`, call `setError(null)`

### 5.4 Network Error Case
- [ ] Wrap the entire `fetch(...)` block in `try/catch`
- [ ] In the `catch` block, call `setError('Could not reach the server. Is it running on port 3001?')`
- [ ] Do not update `output` in the catch block

### 5.5 Non-2xx Response Case
- [ ] After `await fetch(...)`, check `if (!response.ok)`
- [ ] If not ok, parse the error body: `const errData = await response.json()`
- [ ] Call `setError(errData.error || 'An unknown server error occurred.')`
- [ ] Return early — do not attempt to parse as success

### 5.6 Backend: Validate Parsed JSON Shape
- [ ] In `server/claude.js`, after `const parsed = JSON.parse(textBlock.text)`, add:
  ```js
  if (!parsed.plan || !parsed.email || !parsed.code) {
    throw new Error('Claude returned an unexpected response format.')
  }
  ```
- [ ] This catches prose responses where Claude ignores the JSON instruction

### 5.7 Backend: Log Raw Response
- [ ] Confirm the `console.log('[raw]', textBlock.text)` line exists before `JSON.parse` (added in Phase 3)
- [ ] If missing, add it now

### 5.8 CommandBar Disabled State
- [ ] Verify `input` has `disabled={loading}` (done in Phase 2)
- [ ] Verify `button` has `disabled={loading}` (done in Phase 2)
- [ ] Verify CSS `.command-bar input:disabled { opacity: 0.6; }` is present (done in Phase 4)

### 5.9 Verify Error Flow End-to-End
- [ ] Stop the Express server (`Ctrl+C`)
- [ ] In the browser, type a command and press Run
- [ ] Confirm the error message `"Could not reach the server. Is it running on port 3001?"` appears in red below the command bar
- [ ] Confirm the panels do not appear (output state unchanged)
- [ ] Restart the Express server
- [ ] Submit a command again
- [ ] Confirm the error clears and the panels populate normally

**Checkpoint:** Server-down error shows clearly in the UI. Restarting recovers the app to normal operation.

---

## Phase 6 — README
**Goal:** Complete README.md at the project root that lets a new user set up and run DevOS from scratch.

### 6.1 Create README.md
- [ ] Create `devos/README.md`

### 6.2 Section: What It Is
- [ ] Write one short paragraph describing DevOS as a personal AI command center for software engineers
- [ ] Mention it reads from Notion, Gmail, and Google Calendar simultaneously
- [ ] Mention it returns a daily plan, email draft, and generated code from a single natural language command

### 6.3 Section: How It Works
- [ ] Describe the data flow in plain English (no code):
  1. User types a command in the React frontend
  2. Frontend POSTs to the Express backend
  3. Backend calls Claude API with three MCP servers attached
  4. Claude reads live data from Notion, Gmail, and Calendar
  5. Claude returns a JSON object with three fields
  6. Frontend renders each field in its own panel

### 6.4 Section: Prerequisites
- [ ] List these four requirements:
  1. Node.js 18+ installed
  2. An Anthropic API key (get one at console.anthropic.com)
  3. A Notion workspace with at least one task database
  4. Gmail and Google Calendar integrations connected in Claude.ai settings

### 6.5 Section: Setup
- [ ] Write numbered steps:
  1. Clone the repo
  2. `cd client && npm install`
  3. `cd ../server && npm install`
  4. Copy `server/.env.example` to `server/.env` and fill in all four values
  5. Open two terminal windows
  6. Terminal 1: `cd client && npm start`
  7. Terminal 2: `cd server && node index.js`

### 6.6 Section: Usage
- [ ] Tell the user to open `localhost:3000`
- [ ] Give the example command: `Plan my day and start my top Notion task`
- [ ] Mention pressing Enter or clicking Run
- [ ] Mention the response takes 10–20 seconds while Claude reads all three sources

### 6.7 Section: MCP Auth Note
- [ ] Warn that Gmail and Google Calendar MCP URLs require active OAuth sessions from Claude.ai
- [ ] Explain: if those panels return empty or Claude says it cannot access them, the user must connect those integrations at `claude.ai/settings` first
- [ ] Note that Notion MCP also requires the integration to be authorized

### 6.8 Review README
- [ ] Read through the full README as if you were a new user who has never seen this project
- [ ] Confirm every step is actionable and nothing is assumed without explanation
- [ ] Confirm the `.env` values section matches the actual variable names used in the code

**Checkpoint:** README is complete, accurate, and sufficient for a new user to set up the project independently.

---

## Final Integration Check

Before considering the project done, run through this full end-to-end checklist:

- [ ] Both servers start without errors from a clean terminal
- [ ] `localhost:3001/health` returns `{"ok":true}`
- [ ] `localhost:3000` loads the dark DevOS UI without console errors
- [ ] Submitting a real command populates all three panels with real data from Notion, Gmail, and Calendar
- [ ] The Monaco editor renders the code panel at full width with syntax highlighting
- [ ] Killing the backend shows the error message in the UI without crashing the frontend
- [ ] Restarting the backend and submitting again works normally
- [ ] No console errors in either terminal during a successful run
- [ ] `.env` is listed in `.gitignore` and will not be committed

---

## Constraints Reminder (Do Not Build These)

| Prohibited | Reason |
|---|---|
| User auth | Out of scope |
| Database / storage | Out of scope |
| Monaco editable mode | Read-only only |
| Multiple pages / routing | Single-page tool |
| Write-back to Notion/Gmail/Calendar | Read-only only |
| More than 3 MCP servers | Spec limit |
| Tailwind / MUI / shadcn / any CSS lib | Plain CSS only |
| Tests | Out of scope |
| Loading spinner | Button state is sufficient |
