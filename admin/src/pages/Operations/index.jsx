import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { AlertTriangle, Bell, CheckCircle2, ClipboardList, FileText, MapPinned, QrCode, Radio, Users } from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { ZoneCard } from '../../components/ZoneGrid/ZoneCard';

const playbooks = [
  { type: 'fire', label: 'Fire / Smoke', owner: 'Duty manager', route: 'Notify affected zone, adjacent zone, lobby, then full venue.', message: 'Avoid lifts. Move to the nearest marked stairwell and follow staff instructions.' },
  { type: 'medical', label: 'Medical Emergency', owner: 'Security desk', route: 'Alert nearest first-aid responder, floor warden, and front desk.', message: 'Clear space around the affected person. Keep pathways open for responders.' },
  { type: 'security', label: 'Security Threat', owner: 'Security lead', route: 'Silent alert to security team, duty manager, and affected-zone wardens.', message: 'Move away from the area calmly. Follow staff directions.' },
  { type: 'flooding', label: 'Flooding / Leak', owner: 'Facilities', route: 'Alert facilities, affected zone, adjacent electrical rooms.', message: 'Avoid standing water and move toward dry marked exits.' },
];

const sampleTasks = [
  'Acknowledge zone alert within 90 seconds',
  'Sweep assigned rooms and service pockets',
  'Guide guests to safe route; do not use lifts',
  'Report headcount and blockers to command',
];

function PageShell({ icon: Icon, eyebrow, title, children, action }) {
  return (
    <section className="ops-page">
      <header className="ops-header">
        <div>
          <span className="ops-eyebrow"><Icon size={14} /> {eyebrow}</span>
          <h1>{title}</h1>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function SummaryTile({ label, value, tone = 'info', note }) {
  return (
    <article className={`ops-tile ops-tile--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

export function IncidentsPage() {
  const { state, actions } = useDemo();
  const isDemo = typeof window !== 'undefined' && window.location.pathname.startsWith('/demo');
  const incidents = useMemo(() => {
    const active = state.activeIncident?.status === 'active' ? [state.activeIncident] : [];
    const historical = isDemo ? [
      { incidentId: 'incident-demo-closed-1', crisisType: 'medical', currentSeverity: 2, status: 'resolved', triggeredAt: new Date(Date.now() - 6 * 3600000), triggeredByZoneId: 'zone-restaurant' },
      { incidentId: 'incident-demo-closed-2', crisisType: 'power', currentSeverity: 1, status: 'resolved', triggeredAt: new Date(Date.now() - 28 * 3600000), triggeredByZoneId: 'zone-conference' },
    ] : [];
    return [...active, ...historical];
  }, [state.activeIncident, isDemo]);

  return (
    <PageShell icon={AlertTriangle} eyebrow="Incident ledger" title="Active and historical incidents"
      action={<button className="btn btn--danger" onClick={() => actions.startIncident({ crisisType: 'fire', severity: 3, triggeredByZoneId: 'zone-floor7', triggeredBy: 'guestSOS' })}><Bell size={14} /> Start Fire Drill</button>}>
      <div className="ops-grid ops-grid--four">
        <SummaryTile label="Open incidents" value={state.activeIncident?.status === 'active' ? 1 : 0} tone="critical" note="Command monitored" />
        <SummaryTile label="Guest SOS today" value={state.alertFeed.length} tone="warning" note="Context captured" />
        <SummaryTile label="Mean ack time" value="42s" tone="success" note="Under 90s target" />
        <SummaryTile label="Reports ready" value="2" tone="info" note="Audit exportable" />
      </div>
      <div className="ops-panel">
        <div className="ops-panel__head"><h2>Incident timeline</h2><span>Firestore-style live feed</span></div>
        <div className="ops-table">
          {incidents.map((incident) => {
            const zone = state.zones.find(z => z.zoneId === incident.triggeredByZoneId);
            return (
              <div className="ops-row" key={incident.incidentId}>
                <div><strong>{incident.crisisType.toUpperCase()}</strong><small>{zone?.name || incident.triggeredByZoneId}</small></div>
                <span className={`ops-badge ${incident.status === 'active' ? 'is-critical' : 'is-safe'}`}>{incident.status}</span>
                <span>Level {incident.currentSeverity}</span>
                <span>{new Date(incident.triggeredAt).toLocaleString()}</span>
                <button className="btn btn--ghost btn--sm" onClick={() => actions.addSOS({ zoneId: zone?.zoneId || 'zone-floor7', crisisType: incident.crisisType, urgency: 'reporting', affectedCount: 3 })}>Add SOS</button>
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}

export function ZonesPage() {
  const { state, actions } = useDemo();
  const [qrImages, setQrImages] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function build() {
      const guestBase = (import.meta.env.VITE_GUEST_URL || window.location.origin.replace('admin', 'guest')).replace(/\/$/, '');
      const isDemo = window.location.pathname.startsWith('/demo');
      const entries = await Promise.all(state.zones.map(async (zone) => {
        const url = `${guestBase}${isDemo ? '/demo' : '/zone'}/${zone.qrToken || zone.zoneId}`;
        const dataUrl = await QRCode.toDataURL(url, { width: 280, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#000000', light: '#ffffff' } });
        return [zone.zoneId, { dataUrl, url }];
      }));
      if (!cancelled) setQrImages(Object.fromEntries(entries));
    }
    if (state.zones.length) build();
    return () => { cancelled = true; };
  }, [state.zones]);

  function getAssignedWarden(zoneId) {
    return state.staff.find(s => s.assignedZones.includes(zoneId));
  }

  function handleWardenChange(zoneId, staffId) {
    // Unassign old warden from this zone
    const oldWarden = getAssignedWarden(zoneId);
    if (oldWarden) {
      actions.updateStaffMember({ staffId: oldWarden.staffId, patch: { assignedZones: oldWarden.assignedZones.filter(z => z !== zoneId) } });
    }
    // Assign new warden
    if (staffId) {
      const newWarden = state.staff.find(s => s.staffId === staffId);
      if (newWarden) {
        actions.updateStaffMember({ staffId, patch: { assignedZones: [...new Set([...newWarden.assignedZones, zoneId])] } });
      }
    }
  }

  const uncoveredCount = state.zones.filter(z => !getAssignedWarden(z.zoneId)).length;

  return (
    <PageShell icon={MapPinned} eyebrow="Zones and QR sessions" title="Operational zone map">
      <div className="ops-grid ops-grid--four">
        <SummaryTile label="Configured zones" value={state.zones.length} tone="info" note="All mapped to QR tokens" />
        <SummaryTile label="High-risk zones" value={state.zones.filter(z => z.riskProfile === 'high').length} tone="warning" note="Kitchen playbook priority" />
        <SummaryTile label="Warden coverage" value={`${state.staff.filter(s => s.isOnDuty && s.assignedZones.length).length}/${state.zones.length}`} tone="success" note="Evening shift" />
        <SummaryTile label="Uncovered zones" value={uncoveredCount} tone={uncoveredCount > 0 ? 'critical' : 'success'} note={uncoveredCount > 0 ? 'Assign wardens below' : 'All zones covered'} />
      </div>
      <div className="ops-zone-grid">
        {state.zones.map(zone => {
          const warden = getAssignedWarden(zone.zoneId);
          const availableStaff = state.staff.filter(s => s.role !== 'admin' && (s.assignedZones.length === 0 || s.assignedZones.includes(zone.zoneId)));
          return (
            <div key={zone.zoneId} className="ops-zone-with-qr">
              <ZoneCard zone={zone} status={state.zoneStatuses[zone.zoneId]} sosCount={state.alertFeed.filter(a => a.zoneId === zone.zoneId).length} />

              {/* Warden Assignment */}
              <div style={{ padding: '10px 12px', background: warden ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${warden ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: warden ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', fontWeight: 800, color: warden ? '#10b981' : '#ef4444' }}>
                  {warden ? warden.name.split(' ').map(n => n[0]).join('') : '?'}
                </div>
                <select
                  value={warden?.staffId || ''}
                  onChange={e => handleWardenChange(zone.zoneId, e.target.value)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: 'white', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}
                  aria-label={`Assign warden for ${zone.name}`}
                >
                  <option value="">— No warden assigned —</option>
                  {state.staff.filter(s => s.role !== 'admin').map(s => (
                    <option key={s.staffId} value={s.staffId}>{s.name} ({s.role}) {s.assignedZones.length > 0 && !s.assignedZones.includes(zone.zoneId) ? '(busy)' : ''}</option>
                  ))}
                </select>
              </div>

              {/* QR Code - Much bigger */}
              <div className="ops-qr-strip">
                {qrImages[zone.zoneId]?.dataUrl ? <img src={qrImages[zone.zoneId].dataUrl} alt={`Scannable QR for ${zone.name}`} /> : <QrCode size={60} />}
                <div>
                  <code style={{ display: 'block', marginBottom: '4px' }}>{zone.qrToken}</code>
                  <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)' }}>{qrImages[zone.zoneId]?.url || 'generating...'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

export function StaffPage() {
  const { state, actions } = useDemo();
  const [filter, setFilter] = useState('active');
  const visibleStaff = state.staff.filter(member => filter === 'all' || member.isOnDuty);
  const uncoveredZones = state.zones.filter(z => !state.staff.some(s => s.assignedZones.includes(z.zoneId)));

  return (
    <PageShell icon={Users} eyebrow="Active staff" title="Staff coverage and assignments"
      action={<div className="ops-segment"><button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button></div>}>
      <div className="ops-grid ops-grid--four">
        <SummaryTile label="On duty now" value={state.staff.filter(s => s.isOnDuty).length} tone="success" />
        <SummaryTile label="Wardens" value={state.staff.filter(s => s.role.includes('warden')).length} tone="info" />
        <SummaryTile label="Duty managers" value={state.staff.filter(s => s.role === 'dutyManager').length} tone="warning" />
        <SummaryTile label="Uncovered zones" value={uncoveredZones.length} tone={uncoveredZones.length > 0 ? 'critical' : 'success'} note={uncoveredZones.length > 0 ? uncoveredZones.map(z => z.name).join(', ') : 'All covered'} />
      </div>
      <div className="ops-staff-grid">
        {visibleStaff.map(member => {
          const assignedZoneNames = state.zones.filter(zone => member.assignedZones.includes(zone.zoneId)).map(z => z.name);
          return (
            <article className="ops-staff-card" key={member.staffId}>
              <div className="ops-avatar">{member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</div>
              <div style={{ minWidth: 0 }}>
                <strong>{member.name}</strong>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <select value={member.role} onChange={e => actions.updateStaffMember({ staffId: member.staffId, patch: { role: e.target.value } })} aria-label={`Role for ${member.name}`}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: 'white', padding: '3px 6px', fontSize: '0.6875rem' }}>
                    <option value="admin">Admin</option>
                    <option value="dutyManager">Duty Manager</option>
                    <option value="seniorWarden">Senior Warden</option>
                    <option value="warden">Warden</option>
                  </select>
                  <select value={member.assignedZones?.[0] || ''} onChange={e => actions.updateStaffMember({ staffId: member.staffId, patch: { assignedZones: e.target.value ? [e.target.value] : [] } })} aria-label={`Zone for ${member.name}`}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', color: 'white', padding: '3px 6px', fontSize: '0.6875rem', flex: 1, minWidth: '120px' }}>
                    <option value="">No zone (Command-wide)</option>
                    {state.zones.map(zone => <option key={zone.zoneId} value={zone.zoneId}>{zone.name}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {assignedZoneNames.length > 0 ? assignedZoneNames.map(name => (
                    <span key={name} style={{ fontSize: '0.625rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.12)', color: '#10b981', fontWeight: 700 }}>{name}</span>
                  )) : (
                    <span style={{ fontSize: '0.625rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(245,158,11,0.12)', color: '#f59e0b', fontWeight: 700 }}>Command-wide</span>
                  )}
                </div>
              </div>
              <span className={`ops-badge ${member.isOnDuty ? 'is-safe' : ''}`}>{member.isOnDuty ? 'Active' : 'Off duty'}</span>
            </article>
          );
        })}
      </div>
    </PageShell>
  );
}

export function PlaybooksPage() {
  const { state, actions } = useDemo();
  const editablePlaybooks = state.playbooks?.length ? state.playbooks : playbooks;
  return (
    <PageShell icon={ClipboardList} eyebrow="Response logic" title="Playbooks and staff checklists">
      <div className="ops-playbook-grid">
        {editablePlaybooks.map(book => (
          <article className="ops-panel" key={book.type}>
            <div className="ops-panel__head">
              <input className="ops-edit-input" value={book.label} onChange={e => actions.updatePlaybook({ playbookId: book.playbookId || book.type, patch: { label: e.target.value } })} />
              <span>{book.owner || book.crisisType}</span>
            </div>
            <textarea className="ops-edit-area" value={book.route || book.level2Message || ''} onChange={e => actions.updatePlaybook({ playbookId: book.playbookId || book.type, patch: { route: e.target.value, level2Message: e.target.value } })} aria-label={`${book.label} routing`} />
            <div className="ops-message"><Radio size={14} /> Guest broadcast: {book.message || book.level3Message}</div>
            <ul className="ops-checklist">
              {(book.wardenChecklist || sampleTasks).map(task => <li key={task}><CheckCircle2 size={14} /> {task}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function ReportsPage() {
  const { state } = useDemo();
  const isDemo = typeof window !== 'undefined' && window.location.pathname.startsWith('/demo');
  const rows = isDemo ? [
    { title: 'Fire drill response report', status: 'Ready', owner: 'Priya Kapoor', time: 'Today, 08:40' },
    { title: 'Medical assist incident autopsy', status: 'Ready', owner: 'Anil Mehta', time: 'Yesterday, 18:10' },
    { title: 'Evening shift readiness audit', status: 'Drafting', owner: 'System', time: 'Live' },
  ] : [];
  return (
    <PageShell icon={FileText} eyebrow="Compliance records" title="Reports and post-incident audits">
      <div className="ops-grid ops-grid--three">
        <SummaryTile label="Timeline entries" value={state.timeline.length} tone="info" />
        <SummaryTile label="Resolved incidents" value={isDemo ? '2' : '0'} tone="success" />
        <SummaryTile label="Open actions" value={isDemo ? '3' : '0'} tone="warning" />
      </div>
      <div className="ops-panel">
        <div className="ops-panel__head"><h2>Generated reports</h2><span>{isDemo ? 'Demo records' : 'No reports yet'}</span></div>
        <div className="ops-table">
          {rows.length > 0 ? rows.map(row => (
            <div className="ops-row" key={row.title}>
              <div><strong>{row.title}</strong><small>{row.owner}</small></div>
              <span className={`ops-badge ${row.status === 'Ready' ? 'is-safe' : 'is-warning'}`}>{row.status}</span>
              <span>{row.time}</span>
              <button className="btn btn--ghost btn--sm">Preview</button>
            </div>
          )) : (
            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
              Reports will be generated automatically after incidents are resolved.
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
