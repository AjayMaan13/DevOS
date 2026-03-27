function PlanPanel({ plan }) {
  return (
    <div className="panel">
      <h3>Today's Plan</h3>
      {plan ? <pre>{plan}</pre> : <p>No plan yet.</p>}
    </div>
  );
}

export default PlanPanel;
