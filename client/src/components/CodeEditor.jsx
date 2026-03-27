import Editor from '@monaco-editor/react';

function CodeEditor({ code }) {
  return (
    <div className="panel code-editor-panel">
      <h3>Generated Code</h3>
      <Editor
        height="300px"
        language="javascript"
        theme="vs-dark"
        value={code || '// Code will appear here'}
        options={{ readOnly: true, minimap: { enabled: false } }}
      />
    </div>
  );
}

export default CodeEditor;
