export function TopBar() {
  return (
    <header className="topbar">
      <div style={{ padding: '0 var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ color: 'var(--text-secondary)' }}>10:24</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>📶</span> <span>🔋</span>
        </div>
      </div>
    </header>
  );
}
