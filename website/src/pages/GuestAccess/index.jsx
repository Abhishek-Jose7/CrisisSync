import { AlertTriangle, ArrowRight, CheckCircle2, Flame, MapPinned, Users } from 'lucide-react';
import { guestDemoZones, roleLinks } from '../../siteConfig';

export function GuestAccess() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Guest Access</span>
          <h1>Emergency safety guidance without friction.</h1>
          <p>
            Guests never create accounts. In production, they scan a zone-specific QR code. For demo and testing, select a zone below to experience the guest safety interface.
          </p>
        </div>

        <div className="mini-flow" style={{ marginBottom: 32 }}>
          {[
            { icon: Flame, title: 'Choose crisis type', meta: 'fire / medical / other' },
            { icon: AlertTriangle, title: 'Declare immediate danger', meta: 'priority' },
            { icon: Users, title: 'Count affected people', meta: 'severity' },
            { icon: CheckCircle2, title: 'Confirm before sending', meta: 'reduce false alarms' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div className="mini-flow__item" key={item.title}>
                <Icon size={18} />
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </div>
            );
          })}
        </div>

        <div className="split" style={{ marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>How guest access works</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              <StepBlock number="1" title="QR Scan" text="Guest scans the QR code placed in their zone (hotel room, restaurant table, hospital ward, mall food court)." />
              <StepBlock number="2" title="Zone Session" text="System validates the token, creates a signed session (4-hour TTL), and loads zone-specific safety information." />
              <StepBlock number="3" title="Safety Information" text="Guest sees venue name, zone name, exit route, assembly point, and an SOS button. No forms, no accounts, no friction." />
              <StepBlock number="4" title="Emergency Mode" text="If an incident activates, the guest receives real-time severity updates, AI-generated instructions, and evacuation guidance — all specific to their zone." />
            </div>
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Try guest access now</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
              Select a demo zone to open the guest safety interface. Each zone loads with different exit routes, assembly points, and safety information.
            </p>
            <div className="demo-zone-list">
              {guestDemoZones.map((zone) => (
                <a key={zone.token} href={zone.url} target="_blank" rel="noreferrer">
                  <div>
                    <strong>{zone.name}</strong>
                    <span>{zone.zone}</span>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="notice-panel">
          <div>
            <MapPinned size={20} />
            <h2>Production guest access</h2>
            <p>
              In production, guests access CrisisSync only through zone-specific QR codes deployed physically in the venue. There is no account creation, no login page, and no app download required. The QR code is the only entry point.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepBlock({ number, title, text }) {
  return (
    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--status-active-bg)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0,
      }}>
        {number}
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: '2px' }}>{title}</div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}
