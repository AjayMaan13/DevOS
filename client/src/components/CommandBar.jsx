import { useState } from 'react';

const SUGGESTIONS = [
  'Plan my day',
  "What's most urgent?",
  'Draft a standup update',
];

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

  function handleSuggestion(text) {
    setValue(text);
    onSubmit(text);
  }

  return (
    <div>
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
      {!loading && (
        <div className="suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="suggestion-chip" onClick={() => handleSuggestion(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommandBar;
