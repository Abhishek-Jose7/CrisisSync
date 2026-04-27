import { ArrowRight, Bell, CheckCircle2, ClipboardList, MapPinned, QrCode, Radio, ShieldAlert, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  { number: '01', title: 'Venue onboarding', text: 'Admin selects organization type (hotel, hospital, mall, etc). System preloads realistic zone templates. Admin reviews zones, assigns wardens, configures playbooks, sets escalation timeouts, and acknowledges compliance.' },
  { number: '02', title: 'QR deployment', text: 'System generates zone-specific QR codes. Each QR maps to a single venue zone with its own exit route, assembly point, and warden assignment. Print and deploy to physical zones.' },
  { number: '03', title: 'Guest access via QR', text: 'Guest scans zone QR → system creates a signed session (4-hour TTL) → guest sees zone-specific safety info, SOS button, exit routes, and assembly point. No login required.' },
  { number: '04', title: 'Incident triggers', text: 'Guest SOS, staff report, or system detection triggers an incident. Severity model scores signals + context. Wardens are notified. Command holder takes control.' },
  { number: '05', title: 'Zone response', text: 'Each warden sees their zone checklist, AI tips, and status actions. They acknowledge, work through tasks, and report zone status. Admin sees all zones on the command board.' },
  { number: '06', title: 'Escalation chain', text: 'If admin is silent for 90s → duty manager notified. If both silent for 3min → senior warden takes command and autonomous playbook activates. No communication gap.' },
  { number: '07', title: 'Guest guidance', text: 'Based on severity level, guests receive appropriate instructions: Level 1 = reassurance, Level 2 = shelter instructions, Level 3 = full evacuation with specific routes. AI translates to guest\'s language.' },
  { number: '08', title: 'Resolution & report', text: 'Incident is marked resolved. System generates a timeline-backed post-incident report with zone statuses, warden actions, SOS logs, and AI-generated insights for compliance review.' },
];

const flow = [
  { icon: QrCode, title: 'Scan zone QR', meta: 'guest' },
  { icon: ShieldAlert, title: 'Answer SOS context', meta: 'triage' },
  { icon: Bell, title: 'Notify exact staff', meta: 'routing' },
  { icon: ClipboardList, title: 'Complete zone tasks', meta: 'response' },
];

export function HowItWorks() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">How It Works</span>
          <h1>From venue setup to incident resolution.</h1>
          <p>
            CrisisSync follows a deterministic workflow: venue configuration → QR deployment → incident detection → zone-level response → escalation → resolution → reporting. Each step is designed for the operational reality of hospitality and healthcare venues.
          </p>
        </div>

        <div className="mini-flow" style={{ marginBottom: 32 }}>
          {flow.map((item) => {
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

        <div className="process-rail">
          {steps.slice(0, 4).map((step) => (
            <article className="process-step" key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>

        <div className="card-grid card-grid--four" style={{ marginBottom: '40px' }}>
          {[
            { icon: Radio, title: 'Live command', text: 'Admins see severity, SOS context, affected zones, and acknowledgments.' },
            { icon: Users, title: 'Staff action', text: 'Wardens update status and checklist progress from their PWA.' },
            { icon: MapPinned, title: 'Guest guidance', text: 'Guests receive route and assembly guidance tied to their QR zone.' },
            { icon: CheckCircle2, title: 'Audit trail', text: 'Every action becomes a timestamped incident record.' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <article className="info-card" key={card.title}>
                <Icon size={22} />
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            );
          })}
        </div>

        <div className="callout-band">
          <div>
            <h2>See it in action.</h2>
            <p>Demo environments are preloaded with the Grand Orchid Hotel — 5 zones, 7 staff members, and fully interactive incident scenarios.</p>
          </div>
          <Link className="btn btn-primary" to="/demo">
            Open Demo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
