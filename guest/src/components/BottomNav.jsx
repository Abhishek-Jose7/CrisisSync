import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Map, Info } from 'lucide-react';
import { useGuestDemo } from '../context/DemoContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGuestDemo();

  const NAV_ITEMS = [
    { path: '/', label: state.activeIncident ? 'Evacuate' : 'Safe Zone', icon: ShieldAlert },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/guide', label: 'Guide', icon: Info },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      backgroundColor: state.activeIncident ? 'var(--color-danger-dark)' : 'var(--bg-card)',
      borderTop: `1px solid ${state.activeIncident ? 'rgba(255,255,255,0.1)' : 'var(--border-default)'}`,
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        let colorIdle = state.activeIncident ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)';
        let colorActive = state.activeIncident ? '#ffffff' : 'var(--color-danger)';
        
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
              color: isActive ? colorActive : colorIdle,
              cursor: 'pointer',
              opacity: isActive ? 1 : 0.8,
              transition: 'all 0.2s'
            }}
          >
            <Icon size={24} style={{ marginBottom: 4 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
}
