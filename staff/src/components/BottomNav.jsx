import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, CheckSquare } from 'lucide-react';
import { useStaffDemo } from '../context/DemoContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useStaffDemo();

  const NAV_ITEMS = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/map', label: 'Map', icon: Map },
    ...(state.activeIncident ? [{ path: '/incident', label: 'Playbook', icon: CheckSquare }] : []),
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      backgroundColor: 'var(--bg-elevated)',
      borderTop: '1px solid var(--border-default)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 0 8px 0',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--status-info)' : 'var(--text-secondary)',
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.7,
              transition: 'all 0.2s'
            }}
          >
            <Icon size={24} style={{ marginBottom: 4 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
}
