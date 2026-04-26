import { useDemo } from '../../context/DemoContext';
import { ZoneCard } from '../../components/ZoneGrid/ZoneCard';
import { AICommandPanel } from '../../components/AICommandPanel';
import { SimulatedAnomalyPanel } from '../../components/SimulatedAnomalyPanel';
import { BroadcastBar } from '../../components/BroadcastControls';
import { IncidentControls } from './IncidentControls';
import { StatsStrip } from './StatsStrip';
import { countSOSForZone } from '../../services/utils';

export function CommandPage() {
  const { state, actions } = useDemo();
  const { activeIncident, zones, zoneStatuses, alertFeed } = state;

  return (
    <div className="page-enter">
      {/* Incident Controls — Start / Resolve */}
      <IncidentControls />

      {activeIncident && activeIncident.status === 'active' && (
        <>
          {/* Stats Strip */}
          <StatsStrip />

          {/* Zone Grid */}
          <section aria-label="Zone status grid">
            <div className="section-header">
              <div>
                <h2 className="section-header__title">Zone Status</h2>
                <p className="section-header__subtitle">
                  {zones.length} zones · Real-time warden status
                </p>
              </div>
            </div>

            <div className="zone-grid" role="list">
              {zones.map(zone => (
                <ZoneCard
                  key={zone.zoneId}
                  zone={zone}
                  status={zoneStatuses[zone.zoneId]}
                  sosCount={countSOSForZone(alertFeed, zone.zoneId)}
                />
              ))}
            </div>
          </section>

          {/* AI + Camera Panels */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <AICommandPanel />
            <SimulatedAnomalyPanel />
          </div>

          {/* Broadcast Controls */}
          <BroadcastBar />
        </>
      )}

      {/* No Incident State */}
      {!activeIncident && (
        <div className="empty-state">
          <div className="empty-state__icon">🛡️</div>
          <h2 className="empty-state__title">All Clear</h2>
          <p className="empty-state__description">
            No active incidents. The command board will activate when an incident is started or a guest SOS triggers one.
          </p>
        </div>
      )}

      {/* Resolved State */}
      {activeIncident && activeIncident.status === 'resolved' && (
        <div className="empty-state">
          <div className="empty-state__icon">✅</div>
          <h2 className="empty-state__title">Incident Resolved</h2>
          <p className="empty-state__description">
            The incident has been resolved. View the post-incident report in Analytics.
          </p>
          <button
            className="btn btn--ghost"
            style={{ marginTop: 'var(--space-4)' }}
            onClick={actions.reset}
          >
            Return to Standby
          </button>
        </div>
      )}
    </div>
  );
}
