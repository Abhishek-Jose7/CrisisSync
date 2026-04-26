import { useDemo } from '../../context/DemoContext';
import { formatElapsed } from '../../services/utils';
import { SEVERITY_LEVELS } from '@shared/constants';
import { Shield, AlertTriangle } from 'lucide-react';

export function TopBar() {
  const { state } = useDemo();
  const incident = state.activeIncident;
  const severity = incident ? SEVERITY_LEVELS[incident.currentSeverity] : null;

  return (
    <header className="topbar" role="banner">
      <div className="topbar__brand">
        <div className="topbar__logo" aria-hidden="true">CS</div>
        <span className="topbar__title">CrisisSync</span>
      </div>

      <div className="topbar__divider" aria-hidden="true" />

      <span className="topbar__venue">{state.venue.name}</span>

      <div className="topbar__spacer" />

      <div className="topbar__incident" role="status" aria-live="polite">
        {incident && incident.status === 'active' ? (
          <>
            <div className="topbar__incident-badge topbar__incident-badge--active">
              <AlertTriangle size={12} />
              <span>{incident.crisisType.toUpperCase()} — ACTIVE</span>
            </div>
            <span
              className="severity-badge"
              style={{
                background: severity?.bg,
                color: severity?.color,
                border: `1px solid ${severity?.color}33`,
              }}
            >
              {severity?.shortLabel}
            </span>
            <span className="topbar__timer">
              {formatElapsed(incident.triggeredAt)}
            </span>
          </>
        ) : (
          <div className="topbar__incident-badge topbar__incident-badge--clear">
            <Shield size={12} />
            <span>ALL CLEAR</span>
          </div>
        )}
      </div>
    </header>
  );
}
