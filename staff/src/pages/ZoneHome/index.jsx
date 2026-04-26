import { useLocation, useNavigate } from 'react-router-dom';
import { useStaffDemo } from '../../context/DemoContext';
import { TopBar } from '../../components/TopBar';
import { AlertFeed } from '../../components/AlertFeed';
import { useEffect } from 'react';
import '../../components/AlertFeed.css';

export function ZoneHome({ demoMode = false }) {
  const { state, actions } = useStaffDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/demo') ? '/demo' : '';

  useEffect(() => {
    if (state.activeIncident) {
      navigate(`${basePath}/incident`);
    }
  }, [basePath, state.activeIncident, navigate]);

  return (
    <>
      <TopBar />
      <div className="main-content" style={{ display: 'flex', gap: 'var(--space-4)', height: 'calc(100vh - 60px)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="empty-state">
            <div className="empty-state__icon" style={{ color: 'var(--status-clear)' }}>🛡️</div>
            <h2 className="empty-state__title">Zone Clear</h2>
            <p className="empty-state__desc">
              No active incidents in your assigned zones. You will be notified automatically if an emergency occurs.
            </p>
          </div>

          {/* Demo Button to simulate an incident trigger from the admin */}
          {demoMode && <div style={{ marginTop: 'auto' }}>
            <button 
              className="btn btn--ghost btn--block"
              onClick={() => actions.setIncident({ crisisType: 'fire', severity: 2 })}
            >
              Activate demo incident
            </button>
            <button 
              className="btn btn--ghost btn--block"
              onClick={() => actions.addSOS({
                zoneId: state.staffUser?.assignedZoneId || 'zone-floor7',
                crisisType: 'medical',
                urgency: 'high',
                affectedCount: 'few'
              })}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Simulate Guest SOS
            </button>
          </div>}
        </div>

        {/* Alert Feed Sidebar */}
        <div style={{ width: '320px', flexShrink: 0 }}>
          <AlertFeed />
        </div>
      </div>
    </>
  );
}
