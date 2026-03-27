require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { runDevOS } = require('./claude');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/ai-command', async (req, res) => {
  const { command } = req.body;
  try {
    const result = await runDevOS(command);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
