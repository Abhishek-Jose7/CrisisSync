import { Camera, Maximize2, Radio } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';

const cameraByType = {
  lobby: 'Main entry, reception desk, east emergency exit',
  kitchen: 'Cook line, service corridor, rear exit',
  floor: 'Lift lobby, guest corridor, stairwell B',
  parking: 'Pedestrian walkway, Gate A, ramp entrance',
  pool: 'Pool deck, rooftop fire door',
  restaurant: 'Dining hall, terrace exit, service station',
  spa: 'Spa reception, gym corridor',
  conference: 'Registration desk, hall exits, main plaza',
};

export function CCTVPage() {
  const { state } = useDemo();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>CCTV Monitor</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{state.venue?.name || 'Venue'} camera areas</div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.24)', fontWeight: 700, fontSize: '0.8125rem' }}>
          <Radio size={16} />
          Live demo feeds
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {state.zones.map((zone, index) => (
          <article key={zone.zoneId} style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.08)', background: 'var(--bg-card)' }}>
            <div style={{ position: 'relative', aspectRatio: '16 / 9', background: `linear-gradient(135deg, rgba(${30 + index * 14}, ${70 + index * 8}, ${90 + index * 10}, 0.85), rgba(6, 10, 20, 0.95))`, display: 'grid', placeItems: 'center' }}>
              <Camera size={42} style={{ color: 'rgba(255,255,255,0.72)' }} />
              <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6, alignItems: 'center', color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
                LIVE
              </div>
              <button aria-label={`Expand ${zone.name} CCTV feed`} style={{ position: 'absolute', right: 10, top: 10, width: 34, height: 34, borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.24)', color: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
                <Maximize2 size={16} />
              </button>
            </div>
            <div style={{ padding: 'var(--space-4)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 6 }}>{zone.name}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.5 }}>{cameraByType[zone.type] || 'Primary zone camera feed'}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
