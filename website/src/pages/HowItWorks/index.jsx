import { ArrowRight } from 'lucide-react';
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

        <div className="card-grid card-grid--two" style={{ marginBottom: '40px' }}>
          {steps.map((step) => (
            <article className="info-card" key={step.number}>
              <span style={{ color: 'var(--status-safe)', fontWeight: 800, fontSize: '0.8125rem' }}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
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
