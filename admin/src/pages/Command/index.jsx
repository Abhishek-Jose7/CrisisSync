import { FeedPanel } from '../../components/FeedPanel';
import { useDemo } from '../../context/DemoContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, Users, MapPin, Activity, Play, Flame, Zap, HeartPulse, ShieldAlert, Droplets } from 'lucide-react';

export function CommandPage() {
  const { state, actions } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/demo') ? '/demo' : '';
  const active = state.activeIncident?.status === 'active';
  const onDuty = state.staff?.filter(s => s.isOnDuty).length || 0;
  const affected = state.activeIncident?.affectedZones?.length || 0;
  const [showDrillModal, setShowDrillModal] = useState(false);

  if (!state.loading && (!state.zones || state.zones.length === 0)) {
    return (
      <div className="ops-page">
        <div className="ops-panel" style={{ maxWidth: 760 }}>
          <div className="ops-panel__head"><h2>No venue data yet</h2><span>Production workspace</span></div>
          <p className="ops-muted">Complete onboarding to create your venue, zones, staff invitations, playbooks, and QR codes in Firestore.</p>
          <button className="btn btn--primary" onClick={() => navigate('/settings')}>Configure venue</button>
        </div>
      </div>
    );
  }

  function handleStartDrill(crisisType, severity, zoneId) {
    actions.startIncident({
      crisisType,
      severity,
      triggeredByZoneId: zoneId || 'zone-floor7',
      triggeredBy: 'adminDrill',
    });
    actions.broadcast({
      type: 'drill_started',
      message: `${crisisType.toUpperCase()} drill started. Staff and guests should follow posted instructions.`,
    });
    setShowDrillModal(false);
  }

  function handleResolve() {
    actions.resolveIncident();
    actions.broadcast({
      type: 'drill_resolved',
      message: 'Drill resolved. Staff and guests may return to normal operations.',
    });
  }

  return (
    <>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Command Center</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{state.venue?.name || 'Venue'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <LiveClock />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>PK</div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Priya Kapoor</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Alert Banner */}
      <div style={{ background: active ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', border: `1px solid ${active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16,185,129,0.3)'}`, borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {active ? <AlertTriangle size={24} style={{ color: 'var(--severity-3)' }} /> : <Shield size={24} style={{ color: 'var(--status-clear)' }} />}
          <div>
            <div style={{ fontSize: '0.75rem', color: active ? 'var(--severity-3)' : 'var(--status-clear)', textTransform: 'uppercase', fontWeight: 700 }}>{active ? 'Active Incident' : 'All Clear'}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{active ? `${state.activeIncident.crisisType.toUpperCase()} — LEVEL ${state.activeIncident.currentSeverity}` : 'No active incident'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {active ? (
            <>
              <button onClick={() => navigate(`${basePath}/incidents`)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', color: 'white', cursor: 'pointer', fontSize: '0.8125rem' }}>View Details</button>
              <button onClick={handleResolve} style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', color: '#10b981', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>Stop Drill</button>
            </>
          ) : (
            <button onClick={() => setShowDrillModal(true)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', padding: '8px 16px', borderRadius: 'var(--radius-sm)', color: '#ef4444', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600 }}>
              <Play size={14} style={{ marginRight: '6px' }} /> Start Drill
            </button>
          )}
        </div>
      </div>

      {state.broadcastMessage && (
        <div style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.28)', borderRadius: 'var(--radius-md)', padding: '10px 14px', color: '#93c5fd', fontSize: '0.875rem', fontWeight: 700 }}>
          Broadcast sent: {state.broadcastMessage}
        </div>
      )}

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
        <MetricCard title="ACTIVE INCIDENTS" value={active ? 1 : 0} subtitle="View all" onClick={() => navigate(`${basePath}/incidents`)} />
        <MetricCard title="OVERALL SEVERITY" value={active ? <><span style={{ color: 'var(--severity-2)' }}>LEVEL {state.activeIncident.currentSeverity}</span></> : 'CLEAR'} />
        <MetricCard title="ZONES AFFECTED" value={`${affected} / ${state.zones.length}`} subtitle="View zones" onClick={() => navigate(`${basePath}/zones`)} />
        <MetricCard title="WARDENS ONLINE" value={<><span style={{ color: '#10b981' }}>{onDuty}</span> / {state.staff.length}</>} subtitle="View staff" onClick={() => navigate(`${basePath}/staff`)} />
      </div>

      {/* Main Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 'var(--space-4)', flex: 1, minHeight: 0 }}>
        {/* Left Side: Zone Grid & Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Zone Overview Grid */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Zone Overview</h3>
              <button onClick={() => navigate(`${basePath}/zones`)} style={{ background: 'none', border: 'none', color: 'var(--severity-info)', fontSize: '0.75rem', cursor: 'pointer' }}>View All Zones →</button>
            </div>
            <div style={{ flex: 1, padding: 'var(--space-3)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', alignContent: 'start' }}>
              {state.zones.slice(0, 8).map(zone => {
                const status = state.zoneStatuses[zone.zoneId];
                const isAffected = state.activeIncident?.affectedZones?.includes(zone.zoneId);
                const sosCount = state.alertFeed.filter(a => a.zoneId === zone.zoneId).length;
                const statusColor = !active ? '#10b981'
                  : (status?.statusLabel === 'clear' || status?.statusLabel === 'zone_clear') ? '#10b981'
                  : status?.statusLabel === 'acknowledged' ? '#3b82f6'
                  : (status?.statusLabel === 'person_needs_help' || status?.statusLabel === 'request_backup') ? '#ef4444'
                  : isAffected ? '#f59e0b' : '#6b7280';

                return (
                  <button key={zone.zoneId} onClick={() => navigate(`${basePath}/zones`)} style={{
                    background: isAffected ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isAffected ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '8px', padding: '12px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', flexDirection: 'column', gap: '6px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'white' }}>{zone.name}</span>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 6px ${statusColor}` }} />
                    </div>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>
                      {active ? (status?.statusLabel?.replace(/_/g, ' ') || 'standby') : 'clear'}{sosCount > 0 ? ` · SOS ×${sosCount}` : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Insights & Timeline Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>AI SITUATIONAL INSIGHTS <span style={{ color: '#a78bfa' }}>BETA</span></h3>
              {state.aiSuggestions.length > 0 ? (
                state.aiSuggestions.slice(0, 2).map(s => (
                  <p key={s.id} style={{ fontSize: '0.8125rem', lineHeight: 1.6, marginBottom: '8px', color: 'var(--text-secondary)' }}>
                    <span style={{ color: s.urgency === 'high' ? '#ef4444' : s.urgency === 'medium' ? '#f59e0b' : '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.6875rem' }}>{s.urgency} </span>
                    {s.text}
                  </p>
                ))
              ) : (
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>No active AI suggestions. Start an incident to see real-time analysis.</p>
              )}
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>INCIDENT TIMELINE</h3>
                <button onClick={() => navigate(`${basePath}/reports`)} style={{ background: 'none', border: 'none', fontSize: '0.75rem', color: 'var(--severity-info)', cursor: 'pointer' }}>View Full →</button>
              </div>
              <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: 120, overflow: 'auto' }}>
                {state.timeline.length > 0 ? (
                  state.timeline.slice(-5).reverse().map(entry => (
                    <div key={entry.eventId} style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ color: entry.eventType.includes('incident') ? '#ef4444' : entry.eventType.includes('sos') ? '#f59e0b' : '#3b82f6', whiteSpace: 'nowrap' }}>
                        {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ color: 'var(--text-secondary)' }}>{entry.description}</span>
                    </div>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>No timeline events. Events will appear when an incident starts.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Feed */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.05)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Alert Feed</h3>
            <button onClick={() => navigate(`${basePath}/incidents`)} style={{ background: 'none', border: 'none', color: 'var(--severity-info)', fontSize: '0.75rem', textDecoration: 'none', cursor: 'pointer' }}>View All →</button>
          </div>
          <FeedPanel />
        </div>
      </div>

      {/* Drill Modal */}
      {showDrillModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowDrillModal(false)}>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '24px', width: 420, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '16px' }}>Start Emergency Drill</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>Select the type of drill to activate. This will set all zones to "notified" and begin the incident timeline.</p>
            <div style={{ display: 'grid', gap: '8px' }}>
              {[
                { type: 'fire', label: 'Fire Drill', icon: Flame, color: '#ef4444', severity: 3, zone: 'zone-floor7' },
                { type: 'medical', label: 'Medical Emergency', icon: HeartPulse, color: '#f59e0b', severity: 2, zone: 'zone-restaurant' },
                { type: 'security', label: 'Security Threat', icon: ShieldAlert, color: '#8b5cf6', severity: 2, zone: 'zone-lobby' },
                { type: 'flooding', label: 'Flooding', icon: Droplets, color: '#3b82f6', severity: 1, zone: 'zone-parking' },
              ].map(drill => {
                const Icon = drill.icon;
                return (
                  <button key={drill.type} onClick={() => handleStartDrill(drill.type, drill.severity, drill.zone)} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: 'white', cursor: 'pointer', textAlign: 'left',
                  }}>
                    <Icon size={20} style={{ color: drill.color }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{drill.label}</div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>Level {drill.severity} · {state.zones.find(z => z.zoneId === drill.zone)?.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowDrillModal(false)} style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem' }}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontSize: '0.875rem', textAlign: 'right' }}>
      <div style={{ color: 'var(--text-secondary)' }}>{time.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
      <div style={{ fontWeight: 600 }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, onClick }) {
  return (
    <div onClick={onClick} style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
      {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--severity-info)', marginTop: '8px' }}>{subtitle} →</div>}
    </div>
  );
}
