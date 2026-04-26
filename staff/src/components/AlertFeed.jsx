import { AlertTriangle, Users, Clock } from 'lucide-react';
import { useStaffDemo } from '../context/DemoContext';

export function AlertFeed() {
  const { state } = useStaffDemo();
  const { alertFeed } = state;

  const getCrisisIcon = (crisisType) => {
    const icons = {
      fire: '🔥',
      medical: '🏥',
      security: '🛡️',
      flooding: '🌊',
      power: '⚡',
      other: '⚠️'
    };
    return icons[crisisType] || '⚠️';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      high: 'var(--severity-3)',
      medium: 'var(--severity-2)',
      low: 'var(--severity-1)'
    };
    return colors[urgency] || 'var(--severity-2)';
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds
    
    if (diff < 60) return 'JUST NOW';
    if (diff < 3600) return `${Math.floor(diff / 60)} MIN AGO`;
    return `${Math.floor(diff / 3600)} HOURS AGO`;
  };

  return (
    <div className="alert-feed">
      <div className="alert-feed__header">
        <h3 className="alert-feed__title">
          SOS Alerts
          {alertFeed.length > 0 && (
            <span className="alert-feed__count">{alertFeed.length}</span>
          )}
        </h3>
      </div>
      
      <div className="alert-feed__body">
        {alertFeed.length === 0 ? (
          <div className="alert-feed__empty">
            <AlertTriangle size={24} />
            <p>No SOS alerts</p>
            <small>Guest emergency reports will appear here</small>
          </div>
        ) : (
          <div className="alert-list">
            {alertFeed.map(alert => (
              <div 
                key={alert.sosId} 
                className="alert-item"
                style={{ borderLeftColor: getUrgencyColor(alert.urgency) }}
              >
                <div className="alert-item__header">
                  <span className="alert-item__icon">
                    {getCrisisIcon(alert.crisisType)}
                  </span>
                  <span className="alert-item__crisis">
                    {alert.crisisType.toUpperCase()}
                  </span>
                  <span className="alert-item__time">
                    <Clock size={12} />
                    {formatTime(alert.timestamp)}
                  </span>
                </div>
                
                <div className="alert-item__content">
                  <div className="alert-item__location">
                    Zone: {alert.zoneId}
                  </div>
                  <div className="alert-item__details">
                    <span className="alert-item__urgency" style={{ color: getUrgencyColor(alert.urgency) }}>
                      {alert.urgency.toUpperCase()} PRIORITY
                    </span>
                    <span className="alert-item__affected">
                      <Users size={12} />
                      {alert.affectedCount} affected
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
