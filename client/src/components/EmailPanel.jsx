function EmailPanel({ email }) {
  return (
    <div className="panel">
      <h3>Email Draft</h3>
      {email ? <pre>{email}</pre> : <p>No email yet.</p>}
    </div>
  );
}

export default EmailPanel;
