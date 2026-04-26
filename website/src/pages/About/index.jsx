import { Shield, Clock, Users, Radio, FileText, MapPinned } from 'lucide-react';

const facts = [
  { icon: Shield, title: 'Not a replacement for emergency services', text: 'CrisisSync coordinates venue teams. It does not replace fire panels, emergency dispatch (911), or certified safety officers. Venues retain full legal responsibility.' },
  { icon: Clock, title: 'Built for the 90-second decision window', text: 'When a fire alarm triggers, the first 90 seconds determine outcomes. CrisisSync closes the communication gap between detection and coordinated response.' },
  { icon: Users, title: 'Three roles, three apps, one system', text: 'Admin configures. Staff responds. Guests receive guidance. Each operates in a purpose-built application with appropriate data boundaries and access controls.' },
  { icon: Radio, title: 'Real-time incident coordination', text: 'Zone statuses, SOS feeds, and warden acknowledgments stream live. AI assists with situational awareness. Escalation chains activate automatically on timeout.' },
  { icon: MapPinned, title: 'Zone-specific guest safety', text: 'Guests scan a QR code and receive exit routes, assembly points, and emergency instructions specific to their exact zone — not generic broadcasts.' },
  { icon: FileText, title: 'Compliance-ready incident records', text: 'Every incident produces a timestamped timeline with zone statuses, warden actions, SOS logs, and AI insights for post-incident review and compliance reporting.' },
];

export function About() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">About CrisisSync</span>
          <h1>Enterprise emergency coordination for live venues.</h1>
          <p>
            CrisisSync is a structured response system designed for hotels, hospitals, malls, corporate buildings, and event venues. It closes the operational gap between incident detection and coordinated staff response while providing guests with zone-specific safety guidance.
          </p>
        </div>

        <div className="card-grid card-grid--two" style={{ marginBottom: '48px' }}>
          {facts.map((fact) => {
            const Icon = fact.icon;
            return (
              <article className="info-card" key={fact.title}>
                <Icon size={22} />
                <h3>{fact.title}</h3>
                <p>{fact.body || fact.text}</p>
              </article>
            );
          })}
        </div>

        <div className="notice-panel">
          <div>
            <h2>Technology stack</h2>
            <p>
              React (Admin + Guest PWA) · React (Staff PWA) · Firebase Firestore · Cloud Functions · Gemini AI · Google Maps SDK. Firestore-only architecture — no Realtime Database. All real-time updates via onSnapshot listeners.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
