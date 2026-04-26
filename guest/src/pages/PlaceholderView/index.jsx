export function PlaceholderView({ title, icon, description }) {
  return (
    <div style={{ padding: 'var(--space-4)', height: '100vh', display: 'flex', flexDirection: 'column', color: 'white', background: 'var(--bg-card)' }}>
      <button onClick={() => window.history.back()} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '8px', color: 'white', cursor: 'pointer', alignSelf: 'flex-start', marginBottom: '32px' }}>
        ← Back
      </button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>{title}</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </div>
  );
}
