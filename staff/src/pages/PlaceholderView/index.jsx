export function PlaceholderView({ title, icon, description }) {
  return (
    <>
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 'var(--space-4)', paddingBottom: 100 }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>{icon}</div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: 'white' }}>{title}</h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{description}</p>
      </div>
    </>
  );
}
