import { useState } from 'react';
import CommandBar from './components/CommandBar';
import PlanPanel from './components/PlanPanel';
import EmailPanel from './components/EmailPanel';

function App() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  async function handleCommand(value) {
    setLoading(true);
    try {
      setError(null);
      const response = await fetch('http://localhost:3001/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: value }),
      });
      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'An unknown server error occurred.');
        return;
      }
      const data = await response.json();
      setOutput(data);
    } catch (err) {
      setError('Could not reach the server. Is it running on port 3001?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>DevOS</h1>
      </header>
      <p className="subtitle">// AI command center — Notion · Gmail · Calendar</p>
      <CommandBar onSubmit={handleCommand} loading={loading} />
      {error && <p className="error-message">{error}</p>}
      {output !== null && (
        <div className="panels">
          <PlanPanel plan={output.plan} />
          <EmailPanel email={output.email} />
        </div>
      )}
    </div>
  );
}

export default App;
