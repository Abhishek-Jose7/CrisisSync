import { useDemo } from '../../context/DemoContext';
import { getStatusColor } from '../../services/utils';

export function StatsStrip() {
  const { state } = useDemo();
  const { zoneStatuses, alertFeed, activeIncident, zones } = state;

  const statusValues = Object.values(zoneStatuses);
  const acknowledged = statusValues.filter(s => s.acknowledgedAt).length;
  const cleared = statusValues.filter(s => s.statusLabel === 'zone_clear').length;
  const needsHelp = statusValues.filter(s => s.statusLabel === 'person_needs_help' || s.statusLabel === 'request_backup').length;
  const avgCompletion = statusValues.length > 0
    ? Math.round(statusValues.reduce((sum, s) => sum + (s.checklistCompletion || 0), 0) / statusValues.length)
    : 0;

  return (
    <section className="stats-strip" aria-label="Incident statistics">
      <div className="stat-card">
        <div className="stat-card__label">SOS Alerts</div>
        <div className="stat-card__value" style={{ color: alertFeed.length > 0 ? 'var(--severity-3)' : 'var(--text-primary)' }}>
          {alertFeed.length}
        </div>
        <div className="stat-card__note">Total guest reports</div>
      </div>

      <div className="stat-card">
        <div className="stat-card__label">Wardens Ack'd</div>
        <div className="stat-card__value" style={{ color: acknowledged < zones.length ? 'var(--severity-1)' : 'var(--status-clear)' }}>
          {acknowledged}/{zones.length}
        </div>
        <div className="stat-card__note">
          {zones.length - acknowledged > 0
            ? `${zones.length - acknowledged} awaiting acknowledgment`
            : 'All acknowledged'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__label">Zones Clear</div>
        <div className="stat-card__value" style={{ color: 'var(--status-clear)' }}>
          {cleared}/{zones.length}
        </div>
        <div className="stat-card__note">
          {needsHelp > 0
            ? <span style={{ color: 'var(--severity-3)' }}>{needsHelp} zone(s) need help</span>
            : 'No zones reporting distress'}
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card__label">Avg. Tasks</div>
        <div className="stat-card__value">{avgCompletion}%</div>
        <div className="stat-card__note">Average checklist completion</div>
      </div>

      <div className="stat-card">
        <div className="stat-card__label">Severity</div>
        <div className="stat-card__value" style={{
          color: activeIncident?.currentSeverity === 3 ? 'var(--severity-3)'
            : activeIncident?.currentSeverity === 2 ? 'var(--severity-2)'
            : 'var(--severity-1)',
        }}>
          L{activeIncident?.currentSeverity || '—'}
        </div>
        <div className="stat-card__note">{activeIncident?.crisisType?.toUpperCase()}</div>
      </div>
    </section>
  );
}
