import { Activity, Brain, FileText, KeyRound, QrCode, Route, ShieldAlert, Smartphone } from 'lucide-react';

const capabilities = [
  {
    icon: KeyRound,
    title: 'Google-first access',
    text: 'Admin, staff, and guest apps start with Google sign-in before any production workflow opens.',
  },
  {
    icon: QrCode,
    title: 'QR token sessions',
    text: 'Guest QR codes map to venue zones and create short-lived signed sessions before SOS actions are available.',
  },
  {
    icon: Activity,
    title: 'Firestore real-time model',
    text: 'Live incident state, SOS feed, zone status, and timeline updates are designed around Firestore listeners.',
  },
  {
    icon: Brain,
    title: 'AI-assisted decisions',
    text: 'Staff tips, guest instructions, admin suggestions, and post-incident reports are separated by role.',
  },
  {
    icon: Route,
    title: 'Zone-specific routing',
    text: 'Each zone stores its own route, assembly point, wardens, risk profile, and printed QR identity.',
  },
  {
    icon: FileText,
    title: 'Compliance reporting',
    text: 'Resolved incidents produce timeline-backed reports while preserving the platform liability boundary.',
  },
];

export function Platform() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Platform</span>
          <h1>Structured response from first scan to final report.</h1>
          <p>
            CrisisSync follows the architecture in `agent.md`: Firestore-only live state, signed guest sessions, prebuilt venue templates, role-based surfaces, and simulated camera anomaly support for the MVP demo.
          </p>
        </div>

        <div className="process-rail">
          <ProcessStep number="01" title="Venue setup" text="Admin selects a template, reviews zones, assigns wardens, configures playbooks, acknowledges compliance, and publishes QR cards." />
          <ProcessStep number="02" title="Guest scan" text="Guest signs in, opens the camera scanner, scans the venue QR code, and lands in the zone-specific safety session." />
          <ProcessStep number="03" title="Incident response" text="SOS and staff reports feed the command board while wardens update zone status and checklist completion." />
          <ProcessStep number="04" title="Escalation and report" text="Escalation rules, AI suggestions, broadcasts, and post-incident reporting remain visible to the appropriate role." />
        </div>

        <div className="card-grid card-grid--three">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <article className="info-card" key={item.title}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>

        <div className="notice-panel">
          <ShieldAlert size={24} />
          <div>
            <h2>MVP camera boundary</h2>
            <p>
              Real CCTV integration is a Phase 2 hardware path. The current demo uses clearly labeled simulated anomaly events so the workflow can be evaluated without venue camera dependencies.
            </p>
          </div>
          <Smartphone size={24} />
        </div>
      </div>
    </section>
  );
}

function ProcessStep({ number, title, text }) {
  return (
    <article className="process-step">
      <span>{number}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
