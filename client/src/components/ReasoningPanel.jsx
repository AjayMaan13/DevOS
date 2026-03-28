function ReasoningPanel({ reasoning }) {
  return (
    <div className="panel reasoning-panel">
      <h3>Why This Matters</h3>
      <pre>{reasoning}</pre>
    </div>
  );
}

export default ReasoningPanel;
