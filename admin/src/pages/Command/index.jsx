import { FeedPanel } from '../../components/FeedPanel';

export function CommandPage() {
  return (
    <>
        {/* Top Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Command Center</h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Hotel Grand View</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>☁️ 24°C</div>
            <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Mon, 12 May 2025</div>
              <div style={{ fontWeight: 600 }}>10:24 AM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1f2937' }}></div>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Global Alert Banner */}
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🚨</span>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--severity-3)', textTransform: 'uppercase', fontWeight: 700 }}>Active Incident</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>FIRE — LEVEL 2 <span style={{ color: 'var(--severity-3)' }}>HIGH</span></div>
            </div>
          </div>
          <button style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', color: 'white', cursor: 'pointer' }}>View Details</button>
        </div>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
          <MetricCard title="ACTIVE INCIDENTS" value="2" subtitle="View all" />
          <MetricCard title="OVERALL SEVERITY" value={<><span style={{ color: 'var(--severity-2)' }}>LEVEL 2</span><br/><span style={{ fontSize: '1rem' }}>HIGH</span></>} />
          <MetricCard title="ZONES AFFECTED" value="4 / 18" subtitle="View zones" />
          <MetricCard title="WARDENS ONLINE" value={<><span style={{ color: '#10b981' }}>15</span> / 22</>} subtitle="View staff" />
        </div>

        {/* Main Grid View */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-4)', flex: 1, minHeight: 0 }}>
          {/* Left Side: Map & Escalation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Zone Overview</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>Floor 1</span>
                  <span>🗺️ 3D Map</span>
                </div>
              </div>
              <div style={{ flex: 1, background: '#11141a', position: 'relative', overflow: 'hidden' }}>
                 {/* Map Placeholder matching Mockup */}
                 <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   [ Tactical Map View Rendering... ]
                 </div>
              </div>
            </div>

            {/* AI Insights & Timeline Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)' }}>
                 <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>AI SITUATIONAL INSIGHTS <span style={{ color: 'var(--severity-info)' }}>BETA</span></h3>
                 <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>Smoke is spreading towards Staircase B. Recommend isolating elevators on this floor and guiding guests to Staircase A.</p>
                 <a href="#" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textDecoration: 'underline', display: 'block', marginTop: 'var(--space-2)' }}>View AI Suggestions</a>
              </div>
              <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>INCIDENT TIMELINE</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>View Full Timeline</span>
                 </div>
                 <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <div><span style={{ color: 'var(--severity-3)' }}>10:20 AM</span> - Fire Panel Triggered</div>
                   <div><span style={{ color: 'var(--severity-2)' }}>10:22 AM</span> - Smoke Detected</div>
                   <div><span style={{ color: 'var(--severity-info)' }}>10:23 AM</span> - SOS from Room 105</div>
                 </div>
              </div>
            </div>
            
          </div>

          {/* Right Side: Feed */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Alert Feed</h3>
              <a href="#" style={{ color: 'var(--severity-info)', fontSize: '0.75rem', textDecoration: 'none' }}>View All</a>
            </div>
            
            <FeedPanel />
          </div>
        </div>

    </>
  );
}

function MetricCard({ title, value, subtitle }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--severity-info)', marginTop: '8px' }}>{subtitle}</div>}
    </div>
  );
}
