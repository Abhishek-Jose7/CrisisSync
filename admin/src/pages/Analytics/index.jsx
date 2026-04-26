import { useDemo } from '../../context/DemoContext';
import { formatTime } from '../../services/utils';
import { FileText } from 'lucide-react';

export function AnalyticsPage() {
  const { state } = useDemo();
  const { activeIncident, timeline, zoneStatuses, alertFeed, zones } = state;
  const hasData = timeline.length > 0;

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-header__title">Analytics & Reports</h1>
          <p className="section-header__subtitle">Post-incident analysis, response metrics, and AI-generated reports.</p>
        </div>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <div className="empty-state__icon">📊</div>
          <h2 className="empty-state__title">No Incident Data</h2>
          <p className="empty-state__description">
            Run an incident from the Command page to generate analytics. Post-incident reports are generated automatically when an incident is resolved.
          </p>
        </div>
      ) : (
        <>
          {/* Metrics Summary */}
          <section className="stats-strip" aria-label="Incident metrics">
            <div className="stat-card">
              <div className="stat-card__label">Total SOS</div>
              <div className="stat-card__value" style={{ color: 'var(--severity-3)' }}>{alertFeed.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Timeline Events</div>
              <div className="stat-card__value">{timeline.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Zones Monitored</div>
              <div className="stat-card__value">{zones.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__label">Max Severity</div>
              <div className="stat-card__value" style={{
                color: activeIncident?.currentSeverity === 3 ? 'var(--severity-3)'
                  : activeIncident?.currentSeverity === 2 ? 'var(--severity-2)'
                  : 'var(--severity-1)',
              }}>
                L{activeIncident?.currentSeverity || '—'}
              </div>
            </div>
          </section>

          {/* Zone Performance */}
          <section aria-label="Zone performance">
            <div className="section-header">
              <h2 className="section-header__title">Zone Performance</h2>
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {['Zone', 'Status', 'Warden', 'Ack Time', 'Tasks'].map(h => (
                      <th key={h} style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zones.map(zone => {
                    const status = zoneStatuses[zone.zoneId];
                    const ackTime = status?.acknowledgedAt && status?.notifiedAt
                      ? Math.round((new Date(status.acknowledgedAt).getTime() - new Date(status.notifiedAt).getTime()) / 1000)
                      : null;
                    return (
                      <tr key={zone.zoneId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500 }}>{zone.name}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <span style={{
                            fontSize: 'var(--text-xs)', fontWeight: 600, padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: status?.statusLabel === 'zone_clear' ? 'var(--status-clear-bg)' : 'var(--status-warning-bg)',
                            color: status?.statusLabel === 'zone_clear' ? 'var(--status-clear)' : 'var(--status-warning)',
                          }}>
                            {status?.statusLabel || 'unknown'}
                          </span>
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-secondary)' }}>{status?.wardenName || '—'}</td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)', color: ackTime === null ? 'var(--severity-3)' : ackTime > 60 ? 'var(--severity-1)' : 'var(--status-clear)' }}>
                          {ackTime !== null ? `${ackTime}s` : 'NEVER'}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'var(--font-mono)' }}>{status?.checklistCompletion || 0}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* AI Report Preview */}
          <section aria-label="AI post-incident report">
            <div className="section-header">
              <h2 className="section-header__title">AI Post-Incident Report</h2>
              <span className="ai-panel__badge" style={{ marginLeft: 'var(--space-2)' }}>GEMINI</span>
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
            }}>
              {activeIncident?.status === 'resolved' ? (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
                    Executive Summary
                  </h3>
                  <p>A {activeIncident.crisisType} incident was reported at {state.venue.name}. The incident reached Level {activeIncident.currentSeverity} severity and involved {alertFeed.length} guest SOS alerts across {Object.keys(zoneStatuses).length} zones. The incident was resolved and all zones reported final status.</p>

                  <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)', marginTop: 'var(--space-5)', marginBottom: 'var(--space-3)' }}>
                    Recommendations
                  </h3>
                  <ul style={{ paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <li>Review warden acknowledgment procedures for zones with delayed response.</li>
                    <li>Conduct refresher training on checklist completion during active incidents.</li>
                    <li>Verify backup warden assignments are current for all shifts.</li>
                  </ul>
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  <FileText size={32} style={{ opacity: 0.3, marginBottom: 'var(--space-3)' }} />
                  <p>Post-incident report will be generated automatically when the incident is resolved.</p>
                </div>
              )}
            </div>
          </section>

          {/* Full Timeline */}
          <section aria-label="Full incident timeline">
            <div className="section-header">
              <h2 className="section-header__title">Full Timeline</h2>
            </div>
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}>
              <div className="timeline">
                {timeline.map(event => (
                  <div key={event.eventId} className="timeline__item">
                    <span className="timeline__time">{formatTime(event.timestamp)}</span>
                    <span className="timeline__dot" style={{
                      background: event.eventType.includes('sos') ? '#E24B4A'
                        : event.eventType.includes('resolved') ? '#1D9E75'
                        : event.eventType.includes('severity') ? '#E07020'
                        : event.eventType.includes('acknowledged') ? '#378ADD'
                        : '#888780',
                    }} />
                    <span className="timeline__content">
                      <span className="timeline__actor">{event.actor}:</span> {event.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
