import { useState } from 'react';
import CommandBar from './components/CommandBar';
import PlanPanel from './components/PlanPanel';
import EmailPanel from './components/EmailPanel';
import CodeEditor from './components/CodeEditor';

function App() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  async function handleCommand(value) {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/ai-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: value }),
      });
      const data = await response.json();
      setOutput(data);
    } catch (err) {
      console.error(err);
      setOutput({
        plan: 'Error — check the console.',
        email: 'Error — check the console.',
        code: '// Error — check the console.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>DevOS</h1>
      </header>
      <CommandBar onSubmit={handleCommand} loading={loading} />
      {output !== null && (
        <div className="panels">
          <PlanPanel plan={output.plan} />
          <EmailPanel email={output.email} />
          <CodeEditor code={output.code} />
        </div>
      )}
    </div>
  );
}

export default App;
