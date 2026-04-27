import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { useDemo } from '../../context/DemoContext';
import { VENUE_TYPES, ZONE_TYPES, RISK_PROFILES, STAFF_ROLES } from '@shared/constants';
import { CheckCircle, ChevronRight, AlertTriangle, Users, MapPin, FileText, Shield, QrCode } from 'lucide-react';

const WIZARD_STEPS = [
  { id: 'venue', label: 'Venue Details', icon: MapPin },
  { id: 'zones', label: 'Zone Configuration', icon: MapPin },
  { id: 'playbooks', label: 'Playbooks', icon: FileText },
  { id: 'staff', label: 'Staff Assignment', icon: Users },
  { id: 'compliance', label: 'Compliance', icon: Shield },
  { id: 'qr', label: 'QR Codes', icon: QrCode },
];

export function SetupPage() {
  const { state } = useDemo();
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="page-enter">
      <div className="section-header">
        <div>
          <h1 className="section-header__title">Venue Setup</h1>
          <p className="section-header__subtitle">
            Configure your venue, zones, playbooks, and staff before going live.
          </p>
        </div>
      </div>

      <div className="wizard">
        {/* Step Progress */}
        <div className="wizard__steps" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemax={WIZARD_STEPS.length}>
          {WIZARD_STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`wizard__step ${i < currentStep ? 'wizard__step--complete' : ''} ${i === currentStep ? 'wizard__step--active' : ''}`}
            />
          ))}
        </div>

        {/* Step Labels */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          {WIZARD_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: i === currentStep ? 600 : 400,
                  color: i === currentStep ? 'var(--text-primary)' : i < currentStep ? 'var(--status-clear)' : 'var(--text-muted)',
                  background: i === currentStep ? 'var(--bg-elevated)' : 'transparent',
                  border: `1px solid ${i === currentStep ? 'var(--border-default)' : 'transparent'}`,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {i < currentStep ? <CheckCircle size={14} /> : <Icon size={14} />}
                {step.label}
              </button>
            );
          })}
        </div>

        {/* Step Content */}
        {currentStep === 0 && <VenueStep venue={state.venue} />}
        {currentStep === 1 && <ZonesStep zones={state.zones} />}
        {currentStep === 2 && <PlaybooksStep />}
        {currentStep === 3 && <StaffStep staff={state.staff} zones={state.zones} />}
        {currentStep === 4 && <ComplianceStep venue={state.venue} />}
        {currentStep === 5 && <QRStep zones={state.zones} venue={state.venue} />}

        {/* Navigation */}
        <div className="wizard__actions">
          <button
            className="btn btn--ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Back
          </button>
          <button
            className="btn btn--primary"
            onClick={() => setCurrentStep(Math.min(WIZARD_STEPS.length - 1, currentStep + 1))}
          >
            {currentStep === WIZARD_STEPS.length - 1 ? (
              <>
                <CheckCircle size={14} /> Go Live
              </>
            ) : (
              <>
                Next <ChevronRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function VenueStep({ venue }) {
  return (
    <div>
      <h2 className="wizard__title">Venue Details</h2>
      <p className="wizard__description">Basic information about your venue. This data is used for guest-facing comms and incident reports.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="venue-name">Venue Name</label>
          <input id="venue-name" className="form-input" defaultValue={venue.name} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="venue-type">Venue Type</label>
            <select id="venue-type" className="form-select" defaultValue={venue.type}>
              {VENUE_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
            <span className="form-hint">Template zones + playbooks will be pre-loaded based on venue type.</span>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="venue-tz">Timezone</label>
            <input id="venue-tz" className="form-input" defaultValue={venue.timezone} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="venue-addr">Address</label>
          <input id="venue-addr" className="form-input" defaultValue={venue.address} />
        </div>
      </div>
    </div>
  );
}

function ZonesStep({ zones }) {
  return (
    <div>
      <h2 className="wizard__title">Zone Configuration</h2>
      <p className="wizard__description">Review and edit zones. These were pre-loaded from the hotel template. Each zone needs an exit route and assembly point.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {zones.map(zone => (
          <details
            key={zone.zoneId}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
            }}
          >
            <summary style={{
              padding: 'var(--space-3) var(--space-4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              fontSize: 'var(--text-md)',
              fontWeight: 600,
            }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: zone.riskProfile === 'high' ? 'var(--severity-3)' : zone.riskProfile === 'medium' ? 'var(--severity-1)' : 'var(--status-clear)',
              }} />
              {zone.name}
              <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {zone.type} · {zone.riskProfile} risk
              </span>
            </summary>
            <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select className="form-select" defaultValue={zone.type}>
                    {ZONE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input className="form-input" type="number" defaultValue={zone.capacity} />
                </div>
                <div className="form-group">
                  <label className="form-label">Risk Profile</label>
                  <select className="form-select" defaultValue={zone.riskProfile}>
                    {RISK_PROFILES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Exit Route</label>
                <textarea className="form-textarea" defaultValue={zone.exitRoute} />
              </div>
              <div className="form-group">
                <label className="form-label">Assembly Point</label>
                <input className="form-input" defaultValue={zone.assemblyPoint} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" defaultValue={zone.notes} />
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function PlaybooksStep() {
  return (
    <div>
      <h2 className="wizard__title">Playbook Configuration</h2>
      <p className="wizard__description">Review pre-configured crisis playbooks. Each playbook defines guest messages, zone notification order, and warden checklists.</p>

      {['Fire', 'Medical', 'Security'].map(type => (
        <div key={type} style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-3)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--text-md)' }}>
              {type === 'Fire' ? '🔥' : type === 'Medical' ? '🚑' : '🚨'}
            </span>
            <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 600 }}>{type} Playbook</h3>
            <span style={{
              marginLeft: 'auto',
              fontSize: 'var(--text-xs)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--status-clear-bg)',
              color: 'var(--status-clear)',
              fontWeight: 600,
            }}>
              CONFIGURED
            </span>
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <strong style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Level 1:</strong> Staff are investigating a report near your area. Please remain calm.
            </div>
            <div style={{ marginBottom: 'var(--space-2)' }}>
              <strong style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Level 2:</strong> An incident is active. Stay in your room. Await staff instructions.
            </div>
            <div>
              <strong style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Level 3:</strong> EVACUATE NOW. Use the stairwell — do not use lifts.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StaffStep({ staff, zones }) {
  return (
    <div>
      <h2 className="wizard__title">Staff Assignment</h2>
      <p className="wizard__description">Assign wardens to zones and shifts. Each zone needs at least one warden per shift.</p>

      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Zone</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Shift</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)', fontSize: 'var(--text-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(s => {
              const zone = zones.find(z => s.assignedZones.includes(z.zoneId));
              return (
                <tr key={s.staffId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-secondary)' }}>
                    {STAFF_ROLES[s.role]?.label || s.role}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-secondary)' }}>
                    {zone?.name || '—'}
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-secondary)' }}>{s.currentShift}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      fontSize: 'var(--text-xs)', fontWeight: 600,
                      color: s.isOnDuty ? 'var(--status-clear)' : 'var(--text-muted)',
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.isOnDuty ? 'var(--status-clear)' : 'var(--status-neutral)' }} />
                      {s.isOnDuty ? 'On Duty' : 'Off Duty'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComplianceStep({ venue }) {
  return (
    <div>
      <h2 className="wizard__title">Compliance Acknowledgment</h2>
      <p className="wizard__description">You must acknowledge the following before your venue can go live.</p>

      <div className="compliance-notice">
        <div className="compliance-notice__title">
          <AlertTriangle size={16} />
          Compliance & Liability Notice
        </div>
        <div className="compliance-notice__text">
          <p>CrisisSync is an <strong>emergency coordination and communication platform</strong> for venue staff. It is <strong>not</strong> a replacement for:</p>
          <ul style={{ margin: 'var(--space-3) 0', paddingLeft: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <li>Legally mandated fire safety systems (fire panels, alarms, sprinklers)</li>
            <li>Emergency services dispatch (always call 112 / local fire brigade / ambulance / police)</li>
            <li>Certified fire safety officers or legally required evacuation wardens</li>
            <li>Building compliance inspections or occupancy certificates</li>
          </ul>
          <p>Venues using CrisisSync remain fully responsible for their legal fire safety obligations.</p>
        </div>
        <label style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          marginTop: 'var(--space-4)', padding: 'var(--space-3)',
          background: 'var(--bg-overlay)', borderRadius: 'var(--radius-md)',
          cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500,
        }}>
          <input type="checkbox" defaultChecked={venue.complianceAcknowledged} />
          I acknowledge that CrisisSync does not replace legally mandated safety systems.
        </label>
      </div>
    </div>
  );
}

function QRStep({ zones, venue }) {
  const [qrImages, setQrImages] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function buildCodes() {
      const entries = await Promise.all(zones.map(async (zone) => {
        const guestUrl = `${window.location.origin.replace('admin', 'guest')}/demo/${zone.qrToken || zone.zoneId}`;
        const dataUrl = await QRCode.toDataURL(guestUrl, {
          margin: 2,
          width: 176,
          errorCorrectionLevel: 'M',
          color: { dark: '#111827', light: '#ffffff' },
        });
        return [zone.zoneId, { dataUrl, guestUrl }];
      }));
      if (!cancelled) setQrImages(Object.fromEntries(entries));
    }
    buildCodes();
    return () => { cancelled = true; };
  }, [zones]);

  return (
    <div>
      <h2 className="wizard__title">QR Code Generation</h2>
      <p className="wizard__description">Print QR cards for each zone. Guests scan these to access the emergency PWA.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
        {zones.map(zone => (
          <div
            key={zone.zoneId}
            style={{
              background: 'white',
              color: '#1a1a24',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              border: '1px solid var(--border-default)',
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', marginBottom: 2 }}>{venue.name}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: '#666', marginBottom: 'var(--space-4)' }}>{zone.name}</div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
              {qrImages[zone.zoneId]?.dataUrl ? (
                <img
                  src={qrImages[zone.zoneId].dataUrl}
                  alt={`Scannable guest QR code for ${zone.name}`}
                  style={{ width: 96, height: 96, borderRadius: 'var(--radius-sm)', border: '6px solid white' }}
                />
              ) : (
                <div style={{
                  width: 96, height: 96,
                  background: '#f3f4f6',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#111827', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                }}>
                  Generating
                </div>
              )}
              <div>
                <div style={{ fontSize: '8pt', fontWeight: 700, marginBottom: 4 }}>In an emergency:</div>
                <div style={{ fontSize: '7pt', color: '#555', lineHeight: 1.6 }}>
                  1. Scan this QR code<br />
                  2. Tap the SOS button<br />
                  3. Follow the instructions
                </div>
              </div>
            </div>
            <div style={{ fontSize: '6pt', color: '#aaa', marginTop: 'var(--space-3)' }}>
              Exit: {zone.exitRoute?.slice(0, 60)}…
            </div>
            <div style={{ fontSize: '6pt', color: '#666', marginTop: 4, wordBreak: 'break-all' }}>
              {qrImages[zone.zoneId]?.guestUrl}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
