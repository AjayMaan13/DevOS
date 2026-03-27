import { useState } from 'react';

function CommandBar({ onSubmit, loading }) {
  const [value, setValue] = useState('');

  function handleKeyDown(e) {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value);
    }
  }

  function handleClick() {
    if (value.trim()) {
      onSubmit(value);
    }
  }

  return (
    <div className="command-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Type a command..."
      />
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Thinking...' : 'Run'}
      </button>
    </div>
  );
}

export default CommandBar;
