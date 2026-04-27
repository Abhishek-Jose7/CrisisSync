import { FileText, MapPin, Shield, AlertTriangle, BookOpen, Download, ExternalLink } from 'lucide-react';

const DEMO_RESOURCES = [
  {
    id: 'r-001',
    category: 'Safety Protocols',
    icon: Shield,
    items: [
      { title: 'Fire Evacuation Procedure', desc: 'Standard evacuation flow for all zones including lift lockdown, stairwell priority, and assembly point assignments.', type: 'PDF' },
      { title: 'Medical Emergency Response', desc: 'First aid protocol, AED locations, and ambulance staging procedures for Grand Orchid Hotel.', type: 'PDF' },
      { title: 'Security Threat Protocol', desc: 'Silent alert procedures, zone containment, and guest communication during security events.', type: 'PDF' },
      { title: 'Gas Leak / Chemical Spill', desc: 'Kitchen gas shutoff procedures, ventilation protocol, and evacuation triggers for chemical incidents.', type: 'PDF' },
    ],
  },
  {
    id: 'r-002',
    category: 'Floor Plans & Maps',
    icon: MapPin,
    items: [
      { title: 'Ground Floor — Lobby & Reception', desc: 'Emergency exits, AED location at reception, fire extinguisher positions, and assembly point route.', type: 'MAP' },
      { title: 'Floor 7 — Guest Rooms', desc: 'Room layout, stairwell positions (7A, 7B), fire hose reels, and refuge areas.', type: 'MAP' },
      { title: 'Basement — Parking Structure', desc: 'Pedestrian walkways, vehicle ramps (do not use during evacuation), and Level 0 exit routes.', type: 'MAP' },
      { title: 'Rooftop — Pool & Terrace', desc: 'Fire door to Stairwell C, defibrillator location at poolside guard station.', type: 'MAP' },
    ],
  },
  {
    id: 'r-003',
    category: 'Warden Checklists',
    icon: BookOpen,
    items: [
      { title: 'Floor Warden — Fire Response', desc: '4-step checklist: Room sweep → Guest direction → Headcount → Status report to command.', type: 'CHECKLIST' },
      { title: 'Kitchen Warden — Fire + Gas', desc: 'Gas shutoff → Equipment power down → Staff evacuation → Zone seal confirmation.', type: 'CHECKLIST' },
      { title: 'Lobby Warden — Crowd Control', desc: 'Guest flow management → Exit routing → Mobility-impaired assistance → Assembly point headcount.', type: 'CHECKLIST' },
      { title: 'Senior Warden — Multi-zone Overview', desc: 'Cross-zone status collection → Escalation triggers → Command handoff protocol.', type: 'CHECKLIST' },
    ],
  },
  {
    id: 'r-004',
    category: 'Compliance & Training',
    icon: AlertTriangle,
    items: [
      { title: 'Compliance Acknowledgment', desc: 'CrisisSync does not replace legally mandated fire safety systems. Read the full liability boundary.', type: 'LEGAL' },
      { title: 'Warden Training Manual', desc: 'Role expectations, communication protocol, escalation chain, and post-incident reporting duties.', type: 'PDF' },
      { title: 'Last Fire Drill Report', desc: 'Previous drill performance: 42s avg acknowledgment, all zones cleared in 4m 12s.', type: 'REPORT' },
    ],
  },
];

export function ResourcesPage() {
  return (
    <div className="main-content" style={{ padding: 'var(--space-4)', overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <FileText size={20} style={{ color: '#a78bfa' }} />
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Resources</h1>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Floor blueprints, safety protocols, and warden checklists for Grand Orchid Hotel</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {DEMO_RESOURCES.map(section => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <SectionIcon size={16} style={{ color: 'var(--severity-info)' }} />
                <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>{section.category}</h2>
                <span style={{ fontSize: '0.625rem', background: 'rgba(255,255,255,0.06)', padding: '1px 8px', borderRadius: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>{section.items.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
                {section.items.map(item => (
                  <div key={item.title} style={{
                    background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
                    padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', lineHeight: 1.3 }}>{item.title}</span>
                      <span style={{
                        fontSize: '0.5625rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.04em',
                        background: item.type === 'MAP' ? 'rgba(16,185,129,0.12)' : item.type === 'CHECKLIST' ? 'rgba(251,191,36,0.12)' : item.type === 'LEGAL' ? 'rgba(239,68,68,0.12)' : 'rgba(129,140,248,0.12)',
                        color: item.type === 'MAP' ? '#10b981' : item.type === 'CHECKLIST' ? '#fbbf24' : item.type === 'LEGAL' ? '#ef4444' : '#a78bfa',
                      }}>{item.type}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--severity-info)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        <ExternalLink size={12} /> Open
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
