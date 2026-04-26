import { ArrowRight, Building2, Clock, MapPinned, Radio, Shield, ShieldCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { roleLinks } from '../../siteConfig';

const metrics = [
  { value: '3', label: 'Independent role apps' },
  { value: '90s', label: 'Escalation timeout' },
  { value: 'QR', label: 'Zone-bound sessions' },
];

const capabilities = [
  {
    icon: Radio,
    title: 'Real-time incident command',
    body: 'Zone statuses, SOS feeds, warden acknowledgments, and AI suggestions stream live through Firestore listeners. No polling, no refresh.',
  },
  {
    icon: Users,
    title: 'Role-separated operations',
    body: 'Admins configure and command. Staff coordinate zones. Guests receive zone-specific safety guidance. Each role has its own app, its own surface, its own data boundary.',
  },
  {
    icon: Shield,
    title: 'Validated-anonymous SOS',
    body: 'Guests submit SOS through signed sessions validated by zone QR tokens. Rate-limited, zone-bound, and spam-resistant. No open write paths.',
  },
];

export function Home() {
  return (
    <>
      {/* HERO — enterprise, not marketing */}
      <section className="hero">
        <div className="container hero__content">
          <span className="eyebrow">Enterprise Venue Emergency Coordination</span>
          <h1>CrisisSync</h1>
          <p className="hero__lead">
            Structured emergency response infrastructure for hotels, hospitals, malls, corporate buildings, and event venues. Configure zones, assign wardens, deploy QR-based guest access, and coordinate incidents in real time.
          </p>
          <div className="hero__actions">
            <a className="btn btn-primary" href={roleLinks.admin.production} target="_blank" rel="noreferrer">
              Admin Onboarding <ArrowRight size={16} />
            </a>
            <Link className="btn btn-outline" to="/how-it-works">
              How It Works
            </Link>
          </div>
          <div className="hero__metrics" aria-label="Platform highlights">
            {metrics.map((metric) => (
              <div key={metric.label} className="metric-tile">
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCESS PATHS */}
      <section className="section section--surface">
        <div className="container split">
          <div>
            <span className="eyebrow">Role-based access</span>
            <h2>Three independent deployed applications. One coordination system.</h2>
            <p>
              Each role operates in its own application with appropriate data boundaries. The admin configures, staff respond, and guests receive guidance — all through separate, purpose-built surfaces.
            </p>
          </div>
          <div className="access-grid">
            <AccessLink icon={Building2} title="Admin" text="Email login → venue onboarding → zone setup → QR deployment → command center." href={roleLinks.admin.production} />
            <AccessLink icon={ShieldCheck} title="Staff" text="Email login → role assignment → zone dashboard → incident response tools." href={roleLinks.staff.production} />
            <AccessLink icon={MapPinned} title="Guest" text="QR scan → zone session → SOS button → exit routes → assembly point." href={roleLinks.guest.production} />
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Core capabilities</span>
            <h2>Built around the actual incident response chain.</h2>
            <p>Every role has a narrower surface than the one above it. This keeps the system fast under pressure and reduces cognitive load during emergencies.</p>
          </div>
          <div className="card-grid card-grid--three">
            {capabilities.map((card) => {
              const Icon = card.icon;
              return (
                <article className="info-card" key={card.title}>
                  <Icon size={24} />
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--compact">
        <div className="container callout-band">
          <div>
            <Clock size={20} />
            <h2>Test the full system without setup.</h2>
            <p>Demo environments for Admin, Staff, and Guest roles are preloaded with realistic venue data — Grand Orchid Hotel with 5 zones, 7 staff, and configurable incident scenarios.</p>
          </div>
          <Link className="btn btn-primary" to="/demo">
            Open Demo Environment <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

function AccessLink({ icon: Icon, title, text, href }) {
  return (
    <a className="access-link" href={href} target="_blank" rel="noreferrer">
      <Icon size={20} />
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowRight size={16} />
    </a>
  );
}
