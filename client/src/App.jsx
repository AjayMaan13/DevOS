import { useState } from 'react';
import CommandBar from './components/CommandBar';
import PlanPanel from './components/PlanPanel';
import EmailPanel from './components/EmailPanel';
import CodeEditor from './components/CodeEditor';

function App() {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  function handleCommand(value) {
    setLoading(true);
    setOutput({
      plan: '• Review pull requests\n• Fix auth bug in user service\n• Write unit tests for payment module\n• Sync with design team at 3pm',
      email: 'Hi Sarah,\n\nJust wanted to follow up on the API integration we discussed yesterday. I have made some progress on the auth bug and should have a fix ready by EOD.\n\nLet me know if you need anything in the meantime.\n\nBest,\nAJ',
      code: '// Fix: auth token expiry in user service\nfunction refreshAuthToken(userId) {\n  const token = generateToken(userId);\n  cache.set(`auth:${userId}`, token, { ttl: 3600 });\n  return token;\n}',
    });
    setLoading(false);
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
