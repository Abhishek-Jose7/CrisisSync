import { useStaffDemo } from '../context/DemoContext';

export function TopBar() {
  const { state } = useStaffDemo();
  const { staffUser, activeIncident } = state;

  return (
    <header className="topbar safe-area-pt">
      <div className="topbar__title">
        <span>{staffUser?.assignedZoneId === 'zone-floor7' ? 'Floor 7' : 'Assigned Zone'}</span>
        <span className="topbar__subtitle">{staffUser?.name || 'Warden'}</span>
      </div>
      
      {activeIncident ? (
        <div className="topbar__status" style={{ background: 'var(--severity-3-bg)', color: 'var(--severity-3)' }}>
          LIVE INCIDENT
        </div>
      ) : (
        <div className="topbar__status" style={{ background: 'var(--status-clear-bg)', color: 'var(--status-clear)' }}>
          STANDBY
        </div>
      )}
    </header>
  );
}
