import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { Building2, ShieldCheck, Map, Users, FileText, QrCode, CheckCircle, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';
import { createStaffInvite, makeId, makeQrToken, venueDocIdFor } from '../../services/firestoreData';

const ORG_TYPES = [
  { id: 'hotel', label: 'Hotel / Resort', icon: '🏨' },
  { id: 'mall', label: 'Shopping Mall', icon: '🛍️' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'hospital', label: 'Hospital', icon: '🏥' },
  { id: 'event', label: 'Event Venue', icon: '🎪' },
  { id: 'corporate', label: 'Corporate Building', icon: '🏢' },
  { id: 'cowork', label: 'Co-working Space', icon: '💼' },
  { id: 'other', label: 'Other', icon: '🏗️' },
];

const ZONE_TEMPLATES = {
  hotel: [
    { name: 'Ground Floor Lobby', type: 'lobby', capacity: 80, risk: 'medium', exit: 'Use main entrance or east emergency exit', assembly: 'Car park entrance, ground level' },
    { name: 'Floor 1-5 (Guest Rooms)', type: 'floor', capacity: 120, risk: 'medium', exit: 'Take Stairwell A or B at each corridor end', assembly: 'Car park entrance, Level 0, Gate A' },
    { name: 'Floor 6-10 (Guest Rooms)', type: 'floor', capacity: 120, risk: 'medium', exit: 'Take Stairwell B at corridor end. Do not use lifts.', assembly: 'Car park entrance, Level 0, Gate B' },
    { name: 'Kitchen', type: 'kitchen', capacity: 15, risk: 'high', exit: 'Exit via kitchen back door to service corridor', assembly: 'Service yard, north entrance' },
    { name: 'Basement Parking', type: 'parking', capacity: 200, risk: 'low', exit: 'Follow green pedestrian walkways to Level 0', assembly: 'Street level, Gate A' },
    { name: 'Rooftop Pool', type: 'pool', capacity: 30, risk: 'medium', exit: 'Exit through rooftop fire door to Stairwell C', assembly: 'Car park entrance, Level 0, Gate A' },
  ],
  mall: [
    { name: 'Main Atrium', type: 'lobby', capacity: 300, risk: 'high', exit: 'Use nearest emergency exit doors on all sides', assembly: 'External parking lot, Zone A' },
    { name: 'Food Court', type: 'dining', capacity: 200, risk: 'high', exit: 'Exit via food court emergency doors on north and south', assembly: 'External parking lot, Zone B' },
    { name: 'Store Wing A', type: 'floor', capacity: 150, risk: 'medium', exit: 'Follow green exit signs to Wing A emergency stairwell', assembly: 'External parking lot, Zone A' },
    { name: 'Store Wing B', type: 'floor', capacity: 150, risk: 'medium', exit: 'Follow green exit signs to Wing B emergency stairwell', assembly: 'External parking lot, Zone C' },
    { name: 'Basement Parking', type: 'parking', capacity: 400, risk: 'medium', exit: 'Follow pedestrian walkways to ground level exits', assembly: 'Street level assembly area' },
    { name: 'Cinema Complex', type: 'other', capacity: 250, risk: 'high', exit: 'Use illuminated exit signs in each screen', assembly: 'External parking lot, Zone D' },
  ],
  hospital: [
    { name: 'Emergency Block', type: 'other', capacity: 60, risk: 'high', exit: 'Exit via emergency block main entrance', assembly: 'Hospital front courtyard' },
    { name: 'ICU', type: 'other', capacity: 20, risk: 'high', exit: 'Follow ICU evacuation protocol to safe ward', assembly: 'Designated ICU refuge area' },
    { name: 'Ward A', type: 'floor', capacity: 40, risk: 'medium', exit: 'Use ward corridor to Stairwell 1', assembly: 'Hospital courtyard, Section A' },
    { name: 'Ward B', type: 'floor', capacity: 40, risk: 'medium', exit: 'Use ward corridor to Stairwell 2', assembly: 'Hospital courtyard, Section B' },
    { name: 'OPD', type: 'lobby', capacity: 100, risk: 'medium', exit: 'Exit via OPD main entrance', assembly: 'OPD parking area' },
    { name: 'Operating Theaters', type: 'other', capacity: 15, risk: 'high', exit: 'Follow surgical evacuation protocol', assembly: 'Designated surgical refuge' },
  ],
  restaurant: [
    { name: 'Kitchen', type: 'kitchen', capacity: 10, risk: 'high', exit: 'Exit via kitchen back door', assembly: 'Rear parking area' },
    { name: 'Dining Hall', type: 'dining', capacity: 80, risk: 'medium', exit: 'Use main entrance or side emergency exit', assembly: 'Street-side assembly point' },
    { name: 'Outdoor Seating', type: 'other', capacity: 30, risk: 'low', exit: 'Move away from building to street', assembly: 'Street-side assembly point' },
    { name: 'Storage & Prep', type: 'other', capacity: 5, risk: 'medium', exit: 'Exit via service door to alley', assembly: 'Rear parking area' },
  ],
  event: [
    { name: 'Main Stage Area', type: 'stage', capacity: 500, risk: 'high', exit: 'Use designated sector exits', assembly: 'External assembly Zone A' },
    { name: 'VIP Lounge', type: 'other', capacity: 50, risk: 'medium', exit: 'Exit via VIP corridor to Gate C', assembly: 'VIP parking area' },
    { name: 'General Admission', type: 'floor', capacity: 1000, risk: 'high', exit: 'Follow sector stewards to nearest gate', assembly: 'External assembly Zone B' },
    { name: 'Backstage', type: 'other', capacity: 30, risk: 'medium', exit: 'Exit via backstage loading area', assembly: 'Backstage parking' },
    { name: 'Concession Area', type: 'dining', capacity: 100, risk: 'medium', exit: 'Use concession corridor to Gate B', assembly: 'External assembly Zone A' },
  ],
  corporate: [
    { name: 'Lobby & Reception', type: 'lobby', capacity: 40, risk: 'low', exit: 'Use main entrance doors', assembly: 'Building front courtyard' },
    { name: 'Office Floors 1-5', type: 'floor', capacity: 200, risk: 'low', exit: 'Use Stairwell A or B', assembly: 'Building courtyard, Zone A' },
    { name: 'Office Floors 6-10', type: 'floor', capacity: 200, risk: 'low', exit: 'Use Stairwell B or C', assembly: 'Building courtyard, Zone B' },
    { name: 'Server Room', type: 'other', capacity: 5, risk: 'high', exit: 'Exit via server room door to corridor', assembly: 'Building front courtyard' },
    { name: 'Parking Structure', type: 'parking', capacity: 150, risk: 'medium', exit: 'Follow pedestrian exits to ground level', assembly: 'Street level assembly' },
    { name: 'Cafeteria', type: 'dining', capacity: 80, risk: 'medium', exit: 'Use cafeteria emergency exit', assembly: 'Building courtyard, Zone A' },
  ],
  cowork: [
    { name: 'Hot Desk Area', type: 'cowork', capacity: 60, risk: 'low', exit: 'Use main entrance or fire exit at rear', assembly: 'Building entrance area' },
    { name: 'Private Offices', type: 'floor', capacity: 20, risk: 'low', exit: 'Exit to main corridor, then nearest stairwell', assembly: 'Building entrance area' },
    { name: 'Meeting Rooms', type: 'other', capacity: 30, risk: 'low', exit: 'Exit to corridor, follow exit signs', assembly: 'Building entrance area' },
    { name: 'Common Area & Pantry', type: 'other', capacity: 20, risk: 'low', exit: 'Use nearest exit door', assembly: 'Building entrance area' },
  ],
  other: [
    { name: 'Zone A', type: 'other', capacity: 50, risk: 'medium', exit: 'Use nearest emergency exit', assembly: 'Main assembly point' },
    { name: 'Zone B', type: 'other', capacity: 50, risk: 'medium', exit: 'Use nearest emergency exit', assembly: 'Main assembly point' },
  ],
};

const STAFF_TEMPLATES = {
  hotel: [
    { name: 'Priya Kapoor', role: 'admin', zone: '—' },
    { name: 'Anil Mehta', role: 'dutyManager', zone: '—' },
    { name: 'Ravi Sharma', role: 'warden', zone: 'Floor 6-10' },
    { name: 'Meena Patel', role: 'warden', zone: 'Kitchen' },
    { name: 'Suresh Nair', role: 'seniorWarden', zone: 'Lobby' },
    { name: 'Deepa Joshi', role: 'warden', zone: 'Parking' },
    { name: 'Vikram Singh', role: 'warden', zone: 'Rooftop Pool' },
  ],
  mall: [
    { name: 'Arjun Reddy', role: 'admin', zone: '—' },
    { name: 'Kavita Shah', role: 'dutyManager', zone: '—' },
    { name: 'Rahul Verma', role: 'seniorWarden', zone: 'Main Atrium' },
    { name: 'Sita Devi', role: 'warden', zone: 'Food Court' },
    { name: 'Mohan Das', role: 'warden', zone: 'Wing A' },
    { name: 'Lakshmi Bai', role: 'warden', zone: 'Wing B' },
  ],
  hospital: [
    { name: 'Dr. Anand Kumar', role: 'admin', zone: '—' },
    { name: 'Sister Fatima', role: 'dutyManager', zone: '—' },
    { name: 'Rajesh Pillai', role: 'seniorWarden', zone: 'Emergency Block' },
    { name: 'Neha Gupta', role: 'warden', zone: 'Ward A' },
    { name: 'Amita Rao', role: 'warden', zone: 'Ward B' },
    { name: 'Prakash Jain', role: 'warden', zone: 'OPD' },
  ],
};

const ROLE_LABELS = { admin: 'Admin', dutyManager: 'Duty Manager', warden: 'Warden', seniorWarden: 'Senior Warden' };

const DEFAULT_PLAYBOOKS = [
  {
    playbookId: 'fire',
    crisisType: 'fire',
    label: 'Fire / Smoke',
    level1Message: 'Staff are investigating a fire or smoke report near your area. Stay alert and wait for instructions.',
    level2Message: 'A fire incident is active. Move away from smoke and follow staff instructions.',
    level3Message: 'EVACUATE NOW. Use stairs only. Do not use lifts.',
    wardenChecklist: ['Check source if safe', 'Move guests to nearest stairwell', 'Close doors behind you', 'Report headcount to command'],
  },
  {
    playbookId: 'medical',
    crisisType: 'medical',
    label: 'Medical Emergency',
    level1Message: 'A medical response is being coordinated nearby. Keep pathways clear.',
    level2Message: 'Medical staff are responding. Keep the affected area clear and follow staff directions.',
    level3Message: 'Urgent medical response active. Clear route for responders immediately.',
    wardenChecklist: ['Locate affected person', 'Keep crowd clear', 'Call first-aid responder', 'Update command with status'],
  },
  {
    playbookId: 'security',
    crisisType: 'security',
    label: 'Security Threat',
    level1Message: 'Security is investigating a report. Stay calm and avoid the area.',
    level2Message: 'Security incident active. Move away calmly and follow staff instructions.',
    level3Message: 'Immediate security threat. Leave the area now if safe to do so.',
    wardenChecklist: ['Move guests away from threat', 'Avoid confrontation', 'Secure access points', 'Report safe route to command'],
  },
];

const STEPS = [
  { id: 0, title: 'Org Type', icon: <Building2 size={16} /> },
  { id: 1, title: 'Details', icon: <Building2 size={16} /> },
  { id: 2, title: 'Venue', icon: <Map size={16} /> },
  { id: 3, title: 'Zones', icon: <ShieldCheck size={16} /> },
  { id: 4, title: 'Staff', icon: <Users size={16} /> },
  { id: 5, title: 'Playbooks', icon: <FileText size={16} /> },
  { id: 6, title: 'QR Codes', icon: <QrCode size={16} /> },
  { id: 7, title: 'Compliance', icon: <AlertTriangle size={16} /> },
  { id: 8, title: 'Go Live', icon: <CheckCircle size={16} /> },
];

export function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [zones, setZones] = useState([]);
  const [staff, setStaff] = useState([]);
  const [playbooks, setPlaybooks] = useState(DEFAULT_PLAYBOOKS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('warden');
  const [inviteZone, setInviteZone] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [qrImages, setQrImages] = useState({});
  const [complianceChecked, setComplianceChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAdminAuth();

  useEffect(() => {
    if (!selectedOrg) return;
    const templateZones = (ZONE_TEMPLATES[selectedOrg] || ZONE_TEMPLATES.other).map((zone) => ({
      zoneId: makeId('zone'),
      name: zone.name,
      type: zone.type,
      capacity: zone.capacity,
      riskProfile: zone.risk,
      exitRoute: zone.exit,
      assemblyPoint: zone.assembly,
      notes: '',
      qrToken: makeQrToken(zone.name),
    }));
    setZones(templateZones);
    setInviteZone(templateZones[0]?.zoneId || '');
    setStaff([]);
    setPlaybooks(DEFAULT_PLAYBOOKS);
  }, [selectedOrg]);

  useEffect(() => {
    let cancelled = false;
    async function buildCodes() {
      const guestBase = import.meta.env.VITE_GUEST_URL || window.location.origin.replace('admin', 'guest');
      const entries = await Promise.all(zones.map(async (zone) => {
        const url = `${guestBase.replace(/\/$/, '')}/zone/${zone.qrToken}`;
        const dataUrl = await QRCode.toDataURL(url, { width: 180, margin: 2, errorCorrectionLevel: 'M' });
        return [zone.zoneId, { dataUrl, url }];
      }));
      if (!cancelled) setQrImages(Object.fromEntries(entries));
    }
    if (zones.length) buildCodes();
    return () => { cancelled = true; };
  }, [zones]);

  const handleNext = () => {
    if (step === 0 && !selectedOrg) return;
    setStep(Math.min(step + 1, 8));
  };
  const handleBack = () => setStep(Math.max(step - 1, 0));
  const handleFinish = async () => {
    setSaving(true);
    const setupPayload = {
      venue: {
        name: venueName || `${orgLabel} Venue`,
        type: selectedOrg,
        address: venueAddress,
        timezone,
        complianceAcknowledged: complianceChecked,
        settings: {
          warden_ack_timeout_seconds: 90,
          admin_command_timeout_seconds: 90,
          full_escalation_timeout_seconds: 180,
          level3_requires_human_confirm: true,
        },
      },
      zones,
      staff,
      playbooks,
    };
    await completeOnboarding(selectedOrg, setupPayload);
    navigate('/command', { replace: true });
    setSaving(false);
  };

  const orgLabel = ORG_TYPES.find(o => o.id === selectedOrg)?.label || 'organization';
  const venueId = user?.uid ? venueDocIdFor(user.uid) : null;

  function updateZone(zoneId, patch) {
    setZones(prev => prev.map(zone => zone.zoneId === zoneId ? { ...zone, ...patch } : zone));
  }

  function addCustomZone() {
    const zone = {
      zoneId: makeId('zone'),
      name: 'New Custom Zone',
      type: 'other',
      capacity: 25,
      riskProfile: 'medium',
      exitRoute: 'Use nearest marked emergency exit.',
      assemblyPoint: 'Main assembly point',
      notes: '',
      qrToken: makeQrToken('New Custom Zone'),
    };
    setZones(prev => [...prev, zone]);
    setInviteZone(zone.zoneId);
  }

  async function handleInvite() {
    if (!inviteEmail || !venueId) return;
    const member = {
      staffId: makeId('staff'),
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      assignedZones: inviteZone ? [inviteZone] : [],
      currentShift: 'evening',
      isOnDuty: false,
      inviteStatus: 'pending',
    };
    setStaff(prev => [...prev, member]);
    if (!user?.isLocalFallback) {
      const invite = await createStaffInvite({
        venueId,
        staffId: member.staffId,
        email: inviteEmail,
        name: member.name,
        role: inviteRole,
        assignedZones: member.assignedZones,
        shift: 'evening',
      });
      setInviteLink(invite.inviteUrl);
    } else {
      setInviteLink('Invite will sync when Firebase is configured and this admin uses a Firebase account.');
    }
    setInviteEmail('');
    setInviteName('');
  }

  function updatePlaybook(playbookId, patch) {
    setPlaybooks(prev => prev.map(book => book.playbookId === playbookId ? { ...book, ...patch } : book));
  }

  return (
    <div className="onboarding-screen">
      <div className="onboarding-container">
        {/* Header */}
        <div className="onboarding-header">
          <h1>CrisisSync Onboarding</h1>
          <p>
            {user?.email ? `${user.email} — ` : ''}
            {selectedOrg ? `Configuring ${orgLabel}` : 'Select your organization type to begin.'}
          </p>
        </div>

        {/* Step Indicators */}
        <div className="onboarding-steps">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`onboarding-step-indicator ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}
            >
              {s.icon}
              <span className="onboarding-step-label">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="onboarding-content">
          {step === 0 && (
            <div className="onboarding-step-body">
              <h2>Select Organization Type</h2>
              <p className="step-desc">This determines your zone templates, playbook defaults, and staff role structure.</p>
              <div className="org-type-grid">
                {ORG_TYPES.map((org) => (
                  <button
                    key={org.id}
                    className={`org-type-card ${selectedOrg === org.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOrg(org.id)}
                    type="button"
                  >
                    <span className="org-type-icon">{org.icon}</span>
                    <span className="org-type-label">{org.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="onboarding-step-body">
              <h2>Organization Details</h2>
              <p className="step-desc">Basic information about your {orgLabel.toLowerCase()}.</p>
              <div className="onboarding-form">
                <div className="onboarding-field">
                  <label>Organization Name</label>
                  <input type="text" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder={`e.g. Grand Orchid ${orgLabel}`} />
                </div>
                <div className="onboarding-field">
                  <label>Primary Contact Email</label>
                  <input type="email" value={user?.email || ''} readOnly style={{ opacity: 0.6 }} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="onboarding-step-body">
              <h2>Venue Setup</h2>
              <p className="step-desc">Physical location and operational details.</p>
              <div className="onboarding-form">
                <div className="onboarding-field">
                  <label>Venue Name</label>
                  <input type="text" value={venueName} onChange={e => setVenueName(e.target.value)} placeholder={`e.g. ${orgLabel} Main Branch`} />
                </div>
                <div className="onboarding-field">
                  <label>Full Address</label>
                  <input type="text" value={venueAddress} onChange={e => setVenueAddress(e.target.value)} placeholder="123 Marine Drive, Mumbai 400002" />
                </div>
                <div className="onboarding-field">
                  <label>Timezone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-step-body">
              <h2>Zone Builder</h2>
              <p className="step-desc">Preloaded zones for <strong>{orgLabel}</strong>. Review and customize as needed.</p>
              <div className="zone-template-list">
                {zones.map((zone) => (
                  <div key={zone.zoneId} className="zone-template-item">
                    <div className="zone-template-info">
                      <input value={zone.name} onChange={e => updateZone(zone.zoneId, { name: e.target.value })} className="inline-input" aria-label="Zone name" />
                      <span className="zone-meta">
                        <select value={zone.type} onChange={e => updateZone(zone.zoneId, { type: e.target.value })} aria-label="Zone type">
                          <option value="lobby">lobby</option>
                          <option value="floor">floor</option>
                          <option value="kitchen">kitchen</option>
                          <option value="parking">parking</option>
                          <option value="dining">dining</option>
                          <option value="other">other</option>
                        </select>
                        <input type="number" min="1" value={zone.capacity} onChange={e => updateZone(zone.zoneId, { capacity: Number(e.target.value) })} aria-label="Capacity" />
                        <select value={zone.riskProfile} onChange={e => updateZone(zone.zoneId, { riskProfile: e.target.value })} aria-label="Risk profile">
                          <option value="low">low risk</option>
                          <option value="medium">medium risk</option>
                          <option value="high">high risk</option>
                        </select>
                      </span>
                    </div>
                    <div className="zone-template-detail">
                      <label><strong>Exit</strong><input value={zone.exitRoute} onChange={e => updateZone(zone.zoneId, { exitRoute: e.target.value })} /></label>
                      <label><strong>Assembly</strong><input value={zone.assemblyPoint} onChange={e => updateZone(zone.zoneId, { assemblyPoint: e.target.value })} /></label>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-add-zone" onClick={addCustomZone}>+ Add Custom Zone</button>
            </div>
          )}

          {step === 4 && (
            <div className="onboarding-step-body">
              <h2>Staff Assignment</h2>
              <p className="step-desc">Invite staff and assign each person to a role, zone, and shift. No dummy staff is added to real venues.</p>
              <div className="staff-template-list">
                {staff.length === 0 && <p className="step-desc">No staff invited yet. Add your first warden or manager below.</p>}
                {staff.map((s) => (
                  <div key={s.staffId} className="staff-template-item">
                    <div className="staff-avatar">{s.name.charAt(0)}</div>
                    <div>
                      <strong>{s.name}</strong>
                      <span className="staff-meta">{ROLE_LABELS[s.role]} · {zones.find(z => z.zoneId === s.assignedZones?.[0])?.name || 'No zone'} · {s.inviteStatus || 'draft'}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="invite-row">
                <input type="text" placeholder="Name" className="invite-input" value={inviteName} onChange={e => setInviteName(e.target.value)} />
                <input type="email" placeholder="warden@company.com" className="invite-input" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                <select className="invite-input" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <select className="invite-input" value={inviteZone} onChange={e => setInviteZone(e.target.value)}>
                  <option value="">Command-wide</option>
                  {zones.map(zone => <option key={zone.zoneId} value={zone.zoneId}>{zone.name}</option>)}
                </select>
                <button type="button" className="invite-btn" onClick={handleInvite}>Invite</button>
              </div>
              {inviteLink && <div className="invite-link" role="status">Invite link: <span>{inviteLink}</span></div>}
            </div>
          )}

          {step === 5 && (
            <div className="onboarding-step-body">
              <h2>Playbook Configuration</h2>
              <p className="step-desc">Escalation rules and autonomous response settings.</p>
              <div className="playbook-list">
                {playbooks.map((book) => (
                  <div className="playbook-editor" key={book.playbookId}>
                    <input className="inline-input" value={book.label} onChange={e => updatePlaybook(book.playbookId, { label: e.target.value })} />
                    <label>Level 1<input value={book.level1Message} onChange={e => updatePlaybook(book.playbookId, { level1Message: e.target.value })} /></label>
                    <label>Level 2<input value={book.level2Message} onChange={e => updatePlaybook(book.playbookId, { level2Message: e.target.value })} /></label>
                    <label>Level 3<input value={book.level3Message} onChange={e => updatePlaybook(book.playbookId, { level3Message: e.target.value })} /></label>
                    <label>Checklist<textarea value={book.wardenChecklist.join('\n')} onChange={e => updatePlaybook(book.playbookId, { wardenChecklist: e.target.value.split('\n').filter(Boolean) })} /></label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="onboarding-step-body" style={{ textAlign: 'center' }}>
              <h2>QR Code Generation</h2>
              <p className="step-desc">
                {zones.length} zone-specific QR codes will be generated for your {orgLabel.toLowerCase()}.
              </p>
              <div className="qr-preview-grid">
                {zones.map((zone) => (
                  <div key={zone.zoneId} className="qr-preview-card">
                    {qrImages[zone.zoneId]?.dataUrl ? (
                      <img src={qrImages[zone.zoneId].dataUrl} alt={`Scannable QR for ${zone.name}`} className="qr-image" />
                    ) : (
                      <div className="qr-placeholder"><QrCode size={48} /></div>
                    )}
                    <strong>{zone.name}</strong>
                    <code className="qr-token">{zone.qrToken}</code>
                    <small className="qr-url">{qrImages[zone.zoneId]?.url}</small>
                  </div>
                ))}
              </div>
              <button type="button" className="download-qr-btn">
                Download {zones.length} QR Code PDFs
              </button>
            </div>
          )}

          {step === 7 && (
            <div className="onboarding-step-body">
              <h2>Compliance Acknowledgment</h2>
              <div className="compliance-warning">
                <AlertTriangle size={24} />
                <div>
                  <strong>Required Legal Notice</strong>
                  <p>
                    CrisisSync is an emergency coordination and communication platform for venue staff. It is <strong>not</strong> a replacement for: legally mandated fire safety systems (fire panels, alarms, sprinklers), emergency services dispatch (always call local emergency numbers), certified fire safety officers or legally required evacuation wardens, or building compliance inspections or occupancy certificates.
                  </p>
                  <p>
                    Venues using CrisisSync remain fully responsible for their legal fire safety obligations.
                  </p>
                </div>
              </div>
              <label className="compliance-checkbox">
                <input type="checkbox" checked={complianceChecked} onChange={e => setComplianceChecked(e.target.checked)} />
                <span>I acknowledge and accept the operational boundaries and liability limitations of CrisisSync.</span>
              </label>
            </div>
          )}

          {step === 8 && (
            <div className="onboarding-step-body" style={{ textAlign: 'center', padding: '48px 0' }}>
              <div className="go-live-icon">
                <CheckCircle size={40} />
              </div>
              <h2>System Ready</h2>
              <p className="step-desc">
                Your {orgLabel.toLowerCase()} emergency coordination network is configured and ready.
                {zones.length} zones, {staff.length} staff invitations, and {playbooks.length} editable playbooks are ready to save to Firebase.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 ? (
            <button onClick={handleBack} className="onboarding-nav-btn secondary" type="button">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 8 ? (
            <button
              onClick={handleNext}
              className="onboarding-nav-btn primary"
              type="button"
              disabled={step === 0 && !selectedOrg}
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="onboarding-nav-btn finish"
              type="button"
              disabled={!complianceChecked || saving}
            >
              {saving ? 'Saving to Firebase...' : 'Enter Command Center'} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlaybookRow({ label, value, toggle }) {
  return (
    <div className="playbook-row">
      <span>{label}</span>
      {toggle ? (
        <div className="toggle-switch"><input type="checkbox" defaultChecked /><span className="toggle-slider" /></div>
      ) : (
        <strong>{value}</strong>
      )}
    </div>
  );
}
