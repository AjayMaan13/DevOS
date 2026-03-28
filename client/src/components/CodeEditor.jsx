function CodeEditor({ code }) {
  return (
    <div className="panel code-editor-panel">
      <h3>Generated Code</h3>
      {code ? <pre>{code}</pre> : <p>No code yet.</p>}
    </div>
  );
}

export default CodeEditor;
