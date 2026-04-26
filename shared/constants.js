// CrisisSync — Shared Constants
// Single source of truth for enums, labels, and configuration

export const CRISIS_TYPES = [
  { value: 'fire', label: 'Fire', icon: '🔥', severity: 3 },
  { value: 'medical', label: 'Medical Emergency', icon: '🚑', severity: 3 },
  { value: 'security', label: 'Security Threat', icon: '🚨', severity: 3 },
  { value: 'flood', label: 'Flooding / Water', icon: '💧', severity: 2 },
  { value: 'power', label: 'Power Outage', icon: '⚡', severity: 1 },
  { value: 'gas_leak', label: 'Gas Leak', icon: '☁️', severity: 3 },
  { value: 'crowd_surge', label: 'Crowd Surge', icon: '👥', severity: 3 },
  { value: 'lift', label: 'Lift Entrapment', icon: '🛗', severity: 2 },
  { value: 'suspicious_package', label: 'Suspicious Package', icon: '📦', severity: 2 },
  { value: 'other', label: 'Other', icon: '⚠️', severity: 1 },
];

export const SEVERITY_LEVELS = {
  1: { label: 'Level 1 — Monitor', shortLabel: 'L1', color: '#EF9F27', bg: 'rgba(239, 159, 39, 0.12)' },
  2: { label: 'Level 2 — Respond', shortLabel: 'L2', color: '#E07020', bg: 'rgba(224, 112, 32, 0.12)' },
  3: { label: 'Level 3 — Evacuate', shortLabel: 'L3', color: '#E24B4A', bg: 'rgba(226, 75, 74, 0.12)' },
};

export const ZONE_TYPES = [
  'floor', 'kitchen', 'lobby', 'pool', 'parking',
  'bar', 'dining', 'stage', 'gym', 'rooftop', 'cowork', 'other'
];

export const RISK_PROFILES = ['low', 'medium', 'high'];

export const STAFF_ROLES = {
  admin: { label: 'Admin', level: 4 },
  dutyManager: { label: 'Duty Manager', level: 3 },
  seniorWarden: { label: 'Senior Warden', level: 2 },
  warden: { label: 'Warden', level: 1 },
};

export const ZONE_STATUS_LABELS = {
  notified: { label: 'Notified', color: '#EF9F27', icon: '📢' },
  acknowledged: { label: 'Acknowledged', color: '#378ADD', icon: '✓' },
  active: { label: 'Active', color: '#378ADD', icon: '⚡' },
  zone_clear: { label: 'Zone Clear', color: '#1D9E75', icon: '✅' },
  person_needs_help: { label: 'Person Needs Help', color: '#E24B4A', icon: '🆘' },
  request_backup: { label: 'Backup Requested', color: '#E24B4A', icon: '📞' },
  no_warden: { label: 'No Warden', color: '#888780', icon: '—' },
};

export const INCIDENT_TRIGGERS = {
  guestSOS: 'Guest SOS',
  staffReport: 'Staff Report',
  systemAutomatic: 'System Auto',
};

export const VENUE_TYPES = ['hotel', 'mall', 'restaurant', 'event', 'cowork'];

export const SHIFTS = ['morning', 'evening', 'night'];
