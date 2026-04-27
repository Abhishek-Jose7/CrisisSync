import { useLocation } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Users, Star } from 'lucide-react';

const DEMO_CONTACTS = [
  { id: 'c-001', name: 'Priya Kapoor', role: 'Admin / Incident Commander', phone: '+91-98201-23456', email: 'priya.kapoor@grandorchid.com', zone: 'Command-wide', isOnDuty: true, priority: true },
  { id: 'c-002', name: 'Anil Mehta', role: 'Duty Manager', phone: '+91-98201-23457', email: 'anil.mehta@grandorchid.com', zone: 'Command-wide', isOnDuty: true, priority: true },
  { id: 'c-003', name: 'Suresh Nair', role: 'Senior Warden', phone: '+91-98201-23460', email: 'suresh.nair@grandorchid.com', zone: 'Ground Floor Lobby', isOnDuty: true },
  { id: 'c-004', name: 'Ravi Sharma', role: 'Warden', phone: '+91-98201-23458', email: 'ravi.sharma@grandorchid.com', zone: 'Floor 7', isOnDuty: true },
  { id: 'c-005', name: 'Meena Patel', role: 'Warden', phone: '+91-98201-23459', email: 'meena.patel@grandorchid.com', zone: 'Kitchen', isOnDuty: true },
  { id: 'c-006', name: 'Deepa Joshi', role: 'Warden', phone: '+91-98201-23461', email: 'deepa.joshi@grandorchid.com', zone: 'Basement Parking', isOnDuty: true },
  { id: 'c-007', name: 'Vikram Singh', role: 'Warden', phone: '+91-98201-23462', email: 'vikram.singh@grandorchid.com', zone: 'Rooftop Pool', isOnDuty: true },
  { id: 'c-008', name: 'Amit Kumar', role: 'Warden', phone: '+91-98201-23463', email: 'amit.kumar@grandorchid.com', zone: 'Fine Dining Restaurant', isOnDuty: true },
  { id: 'c-009', name: 'Rohit Gupta', role: 'Senior Warden', phone: '+91-98201-23465', email: 'rohit.gupta@grandorchid.com', zone: 'Conference Center', isOnDuty: true },
  { id: 'c-010', name: 'Nisha Verma', role: 'Warden', phone: '+91-98201-23464', email: 'nisha.verma@grandorchid.com', zone: 'Wellness Spa & Gym', isOnDuty: false },
];

const EMERGENCY_NUMBERS = [
  { label: 'Fire Department', number: '101', note: 'Mumbai Fire Brigade' },
  { label: 'Ambulance', number: '108', note: 'Emergency Medical Service' },
  { label: 'Police Control', number: '100', note: 'Mumbai Police' },
  { label: 'Hotel Security Desk', number: 'Ext. 9911', note: 'Internal' },
];

export function ContactsPage() {
  const location = useLocation();
  const isDemo = location.pathname.startsWith('/demo');
  const contacts = isDemo ? DEMO_CONTACTS : [];
  const emergencyNumbers = isDemo ? EMERGENCY_NUMBERS : [];

  if (!isDemo && contacts.length === 0) {
    return (
      <div className="main-content" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 80px)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Users size={40} />
        <h3 style={{ color: 'var(--text-secondary)', fontWeight: 600, margin: '12px 0 4px' }}>No contacts loaded</h3>
        <p style={{ fontSize: '0.8125rem' }}>Your organization's contact directory will appear here once your admin sets up the venue.</p>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ padding: 'var(--space-4)', overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Users size={20} style={{ color: '#10b981' }} />
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Emergency Contacts</h1>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Personnel directory for Grand Orchid Hotel · Evening shift</p>
      </div>

      {/* Emergency Numbers */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ef4444', marginBottom: '10px' }}>Emergency Services</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
          {emergencyNumbers.map(num => (
            <a key={num.label} href={`tel:${num.number}`} style={{
              display: 'flex', flexDirection: 'column', gap: '4px', padding: '14px',
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)',
              borderRadius: '8px', textDecoration: 'none', color: 'white',
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{num.number}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{num.label}</span>
              <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{num.note}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Staff Directory */}
      <h2 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '10px' }}>Staff Directory</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {contacts.map(contact => (
          <div key={contact.id} style={{
            display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '14px', alignItems: 'center',
            padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', opacity: contact.isOnDuty ? 1 : 0.5,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: contact.priority ? 'rgba(239,68,68,0.15)' : 'rgba(55,138,221,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700,
              color: contact.priority ? '#ef4444' : '#3b82f6',
            }}>
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white' }}>{contact.name}</span>
                {contact.priority && <Star size={12} style={{ color: '#f59e0b' }} />}
                {!contact.isOnDuty && <span style={{ fontSize: '0.625rem', padding: '1px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>Off duty</span>}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{contact.role}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={10} /> {contact.zone}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href={`tel:${contact.phone}`} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', color: '#10b981' }}>
                <Phone size={16} />
              </a>
              <a href={`mailto:${contact.email}`} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(55,138,221,0.12)', border: '1px solid rgba(55,138,221,0.2)', display: 'flex', color: '#3b82f6' }}>
                <Mail size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
