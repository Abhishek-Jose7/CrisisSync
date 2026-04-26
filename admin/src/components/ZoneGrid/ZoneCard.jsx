import { useDemo } from '../../context/DemoContext';
import { getStatusColor, getStatusModifier, formatStatusLabel, formatRelativeTime } from '../../services/utils';
import { CheckCircle, AlertCircle, Clock, BarChart } from 'lucide-react';

export function ZoneCard({ zone, status, sosCount }) {
  const { actions } = useDemo();
  const statusLabel = status?.statusLabel || 'no_warden';
  const statusColor = getStatusColor(statusLabel);
  const modifier = getStatusModifier(statusLabel);

  function handleStatusOverride(e) {
    const newStatus = e.target.value;
    if (!newStatus) return;
    actions.updateZoneStatus({ zoneId: zone.zoneId, statusLabel: newStatus });
    e.target.value = '';
  }

  function handleAcknowledge() {
    actions.acknowledgeZone({ zoneId: zone.zoneId });
  }

  return (
    <article
      className={`zone-card ${modifier ? `zone-card--${modifier}` : ''}`}
      style={{ '--zone-status-color': statusColor }}
      role="listitem"
      aria-label={`${zone.name} — ${formatStatusLabel(statusLabel)}`}
    >
      {/* Header */}
      <div className="zone-card__header">
        <div>
          <div className="zone-card__name">{zone.name}</div>
          <div className="zone-card__type">{zone.type} · Cap {zone.capacity}</div>
        </div>
        <span
          className="zone-card__status"
          style={{ background: `${statusColor}18`, color: statusColor }}
          role="status"
        >
          {formatStatusLabel(statusLabel)}
        </span>
      </div>

      {/* Meta */}
      <div className="zone-card__meta">
        <div className="zone-card__meta-row">
          <span className="zone-card__meta-label">
            <AlertCircle size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
            SOS Alerts
          </span>
          <span className="zone-card__meta-value" style={{ color: sosCount > 0 ? 'var(--severity-3)' : 'var(--text-secondary)' }}>
            {sosCount || 0}
          </span>
        </div>

        <div className="zone-card__meta-row">
          <span className="zone-card__meta-label">
            <BarChart size={11} style={{ marginRight: 4, verticalAlign: -1 }} />
            Tasks
          </span>
          <span className="zone-card__meta-value">
            {status?.checklistCompletion || 0}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="zone-card__progress">
          <div
            className="zone-card__progress-bar"
            style={{
              width: `${status?.checklistCompletion || 0}%`,
              background: (status?.checklistCompletion || 0) >= 100 ? 'var(--status-clear)' : statusColor,
            }}
            role="progressbar"
            aria-valuenow={status?.checklistCompletion || 0}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </div>

      {/* Warden */}
      <div className="zone-card__warden">
        <span
          className="zone-card__warden-dot"
          style={{
            background: status?.wardenName
              ? (status.acknowledgedAt ? 'var(--status-clear)' : 'var(--severity-1)')
              : 'var(--status-neutral)',
          }}
        />
        <span>{status?.wardenName || 'No warden assigned'}</span>
      </div>

      {/* Ack state */}
      <div className="zone-card__ack">
        {status?.acknowledgedAt ? (
          <span style={{ color: 'var(--status-clear)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <CheckCircle size={10} />
            Acknowledged {formatRelativeTime(status.acknowledgedAt)} ago
          </span>
        ) : status?.notifiedAt ? (
          <span style={{ color: 'var(--severity-1)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={10} />
            Notified — awaiting acknowledgment
          </span>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Not notified</span>
        )}
      </div>

      {/* Actions */}
      <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        {!status?.acknowledgedAt && status?.notifiedAt && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={handleAcknowledge}
            style={{ fontSize: 'var(--text-xs)' }}
          >
            Force Ack
          </button>
        )}
        <select
          className="form-select"
          onChange={handleStatusOverride}
          defaultValue=""
          aria-label={`Override status for ${zone.name}`}
          style={{ fontSize: 'var(--text-xs)', padding: '2px 6px', flex: 1 }}
        >
          <option value="">Override status…</option>
          <option value="zone_clear">Zone Clear</option>
          <option value="active">Active</option>
          <option value="person_needs_help">Person Needs Help</option>
          <option value="request_backup">Request Backup</option>
        </select>
      </div>
    </article>
  );
}
