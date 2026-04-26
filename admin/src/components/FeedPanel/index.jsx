import { useDemo } from '../context/DemoContext';

export function FeedPanel() {
  let state = { alertFeed: [] };
  try {
    const demo = useDemo();
    if(demo?.state) state = demo.state;
  } catch {}

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, overflowY: 'auto' }}>
      
      {/* Example Items from Mockup */}
      <FeedItem 
        icon="🔥" type="Smoke Detected" location="Floor 1 • Service Area" time="2 MIN AGO" color="var(--severity-3)" 
      />
      <FeedItem 
        icon="🆘" type="SOS from Guest" location="Room 105 • 2 people" time="4 MIN AGO" color="var(--severity-3)" badge="SOS" 
      />
      <FeedItem 
        icon="⏱️" type="Warden Check-in Overdue" location="Floor 2 • Zone 201-210" time="6 MIN AGO" color="var(--severity-2)" 
      />
      <FeedItem 
        icon="👁️" type="CCTV: Crowd Detected" location="Lobby Area" time="7 MIN AGO" color="var(--severity-info)" 
      />
      <FeedItem 
        icon="🚨" type="Fire Panel Triggered" location="Floor 1 • Near Kitchen" time="10 MIN AGO" color="var(--severity-3)" 
      />
      
      {/* Live Data */}
      {state.alertFeed.map(alert => (
        <FeedItem 
          key={alert.id}
          icon="🔔" 
          type={`${alert.crisisType.toUpperCase()} SOS`}
          location={`Zone: ${alert.zoneId}`}
          time="JUST NOW"
          color="var(--severity-3)"
        />
      ))}
    </div>
  );
}

function FeedItem({ icon, type, location, time, color, badge }) {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
      <div style={{ 
        width: 24, height: 24, borderRadius: '4px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' 
      }}>
        {badge || icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>{time}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{type}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{location}</div>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>&gt;</div>
    </div>
  );
}
