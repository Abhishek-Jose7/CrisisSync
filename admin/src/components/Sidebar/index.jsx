import { useNavigate, useLocation } from 'react-router-dom';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="admin-sidebar" style={{
      width: '240px',
      background: '#0d1117',
      borderRight: '1px solid #1f2937',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--space-4) 0',
      height: '100vh',
    }}>
      <div style={{ padding: '0 var(--space-4)', marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 32, height: 32, background: 'var(--severity-info-bg)', color: 'var(--severity-info)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          🛡️
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>CrisisSync</div>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 var(--space-2)' }}>
        <SidebarItem icon="⚡" label="Command Center" path="/command" currentPath={location.pathname} onClick={() => navigate('/command')} />
        <SidebarItem icon="🚨" label="Incidents" path="/incidents" currentPath={location.pathname} onClick={() => navigate('/incidents')} />
        <SidebarItem icon="🗺️" label="Zones" path="/zones" currentPath={location.pathname} onClick={() => navigate('/zones')} />
        <SidebarItem icon="👥" label="Staff" path="/staff" currentPath={location.pathname} onClick={() => navigate('/staff')} />
        <SidebarItem icon="📋" label="Playbooks" path="/playbooks" currentPath={location.pathname} onClick={() => navigate('/playbooks')} />
        <SidebarItem icon="📄" label="Reports" path="/reports" currentPath={location.pathname} onClick={() => navigate('/reports')} />
        <SidebarItem icon="📈" label="Analytics" path="/analytics" currentPath={location.pathname} onClick={() => navigate('/analytics')} />
        <SidebarItem icon="⚙️" label="Settings" path="/settings" currentPath={location.pathname} onClick={() => navigate('/settings')} />
      </nav>

      <div style={{ marginTop: 'auto', padding: '0 var(--space-4)' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>System Status</div>
          <div style={{ fontSize: '0.875rem', color: 'white' }}>All Systems Operational</div>
        </div>
        <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>Need Help?</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--severity-3)' }}>Emergency Support</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>+91 98765 43210</div>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, path, currentPath, onClick }) {
  const active = currentPath === path;
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '10px 16px',
      background: active ? 'rgba(55, 138, 221, 0.1)' : 'transparent',
      border: 'none',
      borderLeft: `3px solid ${active ? 'var(--severity-info)' : 'transparent'}`,
      color: active ? 'white' : 'var(--text-secondary)',
      cursor: 'pointer',
      textAlign: 'left',
      borderRadius: '4px',
      fontWeight: active ? 600 : 500,
      fontSize: '0.875rem'
    }}>
      <span>{icon}</span>
      {label}
    </button>
  );
}
