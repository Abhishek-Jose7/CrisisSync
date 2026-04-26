import { useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { LayoutDashboard, Settings, BarChart3, User } from 'lucide-react';

const NAV_ITEMS = [
  { path: '/command', label: 'Command', icon: LayoutDashboard },
  { path: '/setup', label: 'Setup', icon: Settings },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useDemo();
  const adminUser = state.staff.find(s => s.role === 'admin');

  return (
    <nav className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar__section">
        <div className="sidebar__label">Operations</div>
        <ul className="sidebar__nav">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="sidebar__link-icon" size={18} />
                  <span>{item.label}</span>

                  {item.path === '/command' && state.activeIncident && (
                    <span className="sidebar__badge sidebar__badge--danger" aria-label="Active incident">
                      LIVE
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar__spacer" />

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__avatar" aria-hidden="true">
            {adminUser?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {adminUser?.name || 'Admin'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {adminUser?.role || 'admin'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
