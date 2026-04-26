import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, MessageSquare, Users, FileText } from 'lucide-react';
import { useStaffDemo } from '../context/DemoContext';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const NAV_ITEMS = [
    { path: '/incident', label: 'Home', icon: Home },
    { path: '/map', label: 'Map', icon: Map },
    { path: '/comms', label: 'Comms', icon: MessageSquare },
    { path: '/contacts', label: 'Contacts', icon: Users },
    { path: '/resources', label: 'Resources', icon: FileText },
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      display: 'flex',
      backgroundColor: '#0a0a0c',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 1000,
      padding: '8px 16px'
    }}>
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path || (item.path === '/incident' && location.pathname === '/');
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
              padding: '8px 0',
              background: 'transparent',
              border: 'none',
              color: isActive ? '#f59e0b' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              gap: '4px'
            }}
          >
            <Icon size={22} />
            <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  );
}
