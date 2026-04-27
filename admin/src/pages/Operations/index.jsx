import { useMemo, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle2, ClipboardList, FileText, MapPinned, Radio, Users } from 'lucide-react';
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
  const incidents = useMemo(() => {
    const active = state.activeIncident?.status === 'active' ? [state.activeIncident] : [];
    return [
      ...active,
      { incidentId: 'incident-demo-closed-1', crisisType: 'medical', currentSeverity: 2, status: 'resolved', triggeredAt: new Date(Date.now() - 6 * 3600000), triggeredByZoneId: 'zone-restaurant' },
      { incidentId: 'incident-demo-closed-2', crisisType: 'power', currentSeverity: 1, status: 'resolved', triggeredAt: new Date(Date.now() - 28 * 3600000), triggeredByZoneId: 'zone-conference' },
    ];
  }, [state.activeIncident]);

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
  const { state } = useDemo();
  return (
    <PageShell icon={MapPinned} eyebrow="Zones and QR sessions" title="Operational zone map">
      <div className="ops-grid ops-grid--three">
        <SummaryTile label="Configured zones" value={state.zones.length} tone="info" note="All mapped to QR tokens" />
        <SummaryTile label="High-risk zones" value={state.zones.filter(z => z.riskProfile === 'high').length} tone="warning" note="Kitchen playbook priority" />
        <SummaryTile label="Warden coverage" value={`${state.staff.filter(s => s.isOnDuty && s.assignedZones.length).length}/${state.zones.length}`} tone="success" note="Evening shift" />
      </div>
      <div className="ops-zone-grid">
        {state.zones.map(zone => (
          <ZoneCard key={zone.zoneId} zone={zone} status={state.zoneStatuses[zone.zoneId]} sosCount={state.alertFeed.filter(a => a.zoneId === zone.zoneId).length} />
        ))}
      </div>
    </PageShell>
  );
}

export function StaffPage() {
  const { state } = useDemo();
  const [filter, setFilter] = useState('active');
  const visibleStaff = state.staff.filter(member => filter === 'all' || member.isOnDuty);

  return (
    <PageShell icon={Users} eyebrow="Active staff demo" title="Staff coverage and assignments"
      action={<div className="ops-segment"><button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button></div>}>
      <div className="ops-grid ops-grid--four">
        <SummaryTile label="On duty now" value={state.staff.filter(s => s.isOnDuty).length} tone="success" />
        <SummaryTile label="Wardens" value={state.staff.filter(s => s.role.includes('warden')).length} tone="info" />
        <SummaryTile label="Duty managers" value={state.staff.filter(s => s.role === 'dutyManager').length} tone="warning" />
        <SummaryTile label="Uncovered zones" value="0" tone="success" />
      </div>
      <div className="ops-staff-grid">
        {visibleStaff.map(member => {
          const zones = state.zones.filter(zone => member.assignedZones.includes(zone.zoneId)).map(z => z.name).join(', ') || 'Command-wide';
          return (
            <article className="ops-staff-card" key={member.staffId}>
              <div className="ops-avatar">{member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</div>
              <div>
                <strong>{member.name}</strong>
                <span>{member.role} · {member.currentShift}</span>
                <small>{zones}</small>
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
  return (
    <PageShell icon={ClipboardList} eyebrow="Response logic" title="Playbooks and staff checklists">
      <div className="ops-playbook-grid">
        {playbooks.map(book => (
          <article className="ops-panel" key={book.type}>
            <div className="ops-panel__head"><h2>{book.label}</h2><span>{book.owner}</span></div>
            <p className="ops-muted">{book.route}</p>
            <div className="ops-message"><Radio size={14} /> Guest broadcast: {book.message}</div>
            <ul className="ops-checklist">
              {sampleTasks.map(task => <li key={task}><CheckCircle2 size={14} /> {task}</li>)}
            </ul>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export function ReportsPage() {
  const { state } = useDemo();
  const rows = [
    { title: 'Fire drill response report', status: 'Ready', owner: 'Priya Kapoor', time: 'Today, 08:40' },
    { title: 'Medical assist incident autopsy', status: 'Ready', owner: 'Anil Mehta', time: 'Yesterday, 18:10' },
    { title: 'Evening shift readiness audit', status: 'Drafting', owner: 'System', time: 'Live' },
  ];
  return (
    <PageShell icon={FileText} eyebrow="Compliance records" title="Reports and post-incident audits">
      <div className="ops-grid ops-grid--three">
        <SummaryTile label="Timeline entries" value={state.timeline.length} tone="info" />
        <SummaryTile label="Resolved incidents" value="2" tone="success" />
        <SummaryTile label="Open actions" value="3" tone="warning" />
      </div>
      <div className="ops-panel">
        <div className="ops-panel__head"><h2>Generated reports</h2><span>Export-ready demo records</span></div>
        <div className="ops-table">
          {rows.map(row => (
            <div className="ops-row" key={row.title}>
              <div><strong>{row.title}</strong><small>{row.owner}</small></div>
              <span className={`ops-badge ${row.status === 'Ready' ? 'is-safe' : 'is-warning'}`}>{row.status}</span>
              <span>{row.time}</span>
              <button className="btn btn--ghost btn--sm">Preview</button>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
