import { useDemo } from '../context/DemoContext';
import { CRISIS_TYPES } from '@shared/constants';
import { formatRelativeTime } from '../services/utils';

export function FeedPanel() {
  const { state } = useDemo();

  return (
    <aside className="feed-panel" role="complementary" aria-label="Alert feed">
      {/* SOS Alert Feed */}
      <div className="feed-panel__header">
        <div className="feed-panel__title">
          SOS Alerts
          {state.alertFeed.length > 0 && (
            <span className="feed-panel__count">{state.alertFeed.length}</span>
          )}
        </div>
      </div>
      <div className="feed-panel__body">
        {state.alertFeed.length === 0 ? (
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <div className="empty-state__icon">📭</div>
            <div className="empty-state__title" style={{ fontSize: 'var(--text-sm)' }}>No SOS alerts</div>
            <div className="empty-state__description" style={{ fontSize: 'var(--text-xs)' }}>
              Guest SOS submissions will appear here in real time.
            </div>
          </div>
        ) : (
          state.alertFeed.map(sos => {
            const crisisInfo = CRISIS_TYPES.find(c => c.value === sos.crisisType);
            const zone = state.zones.find(z => z.zoneId === sos.zoneId);
            return (
              <article key={sos.sosId} className="alert-item alert-item--new" role="alert">
                <div className="alert-item__header">
                  <span className="alert-item__icon">{crisisInfo?.icon || '⚠️'}</span>
                  <span className="alert-item__type">{crisisInfo?.label || sos.crisisType}</span>
                  <span className="alert-item__time">{formatRelativeTime(sos.timestamp)}</span>
                </div>
                <div className="alert-item__body">
                  {sos.urgency === 'need_help' ? 'Needs help NOW' : 'Safe, reporting'} · {sos.affectedCount === 'many' ? 'Many people' : sos.affectedCount === 'few' ? 'A few people' : 'Just one'}
                </div>
                <div className="alert-item__zone">
                  📍 {zone?.name || sos.zoneId}
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Timeline */}
      <div className="feed-panel__header" style={{ marginTop: 'auto' }}>
        <div className="feed-panel__title">Timeline</div>
      </div>
      <div className="feed-panel__body" style={{ maxHeight: '280px' }}>
        {state.timeline.length === 0 ? (
          <div style={{ padding: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            No events yet
          </div>
        ) : (
          <div className="timeline">
            {[...state.timeline].reverse().map(event => (
              <div key={event.eventId} className="timeline__item">
                <span className="timeline__time">
                  {formatRelativeTime(event.timestamp)}
                </span>
                <span
                  className="timeline__dot"
                  style={{
                    background: event.eventType.includes('sos') ? '#E24B4A'
                      : event.eventType.includes('resolved') ? '#1D9E75'
                      : event.eventType.includes('severity') ? '#E07020'
                      : '#378ADD',
                  }}
                />
                <span className="timeline__content">
                  <span className="timeline__actor">{event.actor}</span>{' '}
                  {event.description}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
