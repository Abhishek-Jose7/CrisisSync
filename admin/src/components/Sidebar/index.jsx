import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { icon: 'CMD', label: 'Command Center', path: '/command' },
  { icon: 'INC', label: 'Incidents', path: '/incidents' },
  { icon: 'MAP', label: 'Zones', path: '/zones' },
  { icon: 'STF', label: 'Staff', path: '/staff' },
  { icon: 'PBK', label: 'Playbooks', path: '/playbooks' },
  { icon: 'RPT', label: 'Reports', path: '/reports' },
  { icon: 'ANL', label: 'Analytics', path: '/analytics' },
  { icon: 'CAM', label: 'CCTV', path: '/cctv' },
  { icon: 'SET', label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/demo') ? '/demo' : '';
  const go = (path) => navigate(`${basePath}${path}`);

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
        <div style={{ width: 32, height: 32, background: 'var(--severity-info-bg)', color: 'var(--severity-info)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
          CS
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'white' }}>CrisisSync</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 var(--space-2)' }}>
        {items.map(item => (
          <SidebarItem
            key={item.path}
            {...item}
            basePath={basePath}
            currentPath={location.pathname}
            onClick={() => go(item.path)}
          />
        ))}
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

function SidebarItem({ icon, label, path, basePath, currentPath, onClick }) {
  const active = currentPath === `${basePath}${path}`;
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
      <span style={{ width: 28, fontSize: '0.62rem', fontWeight: 900, color: active ? 'var(--severity-info)' : 'var(--text-muted)' }}>{icon}</span>
      {label}
    </button>
  );
}
