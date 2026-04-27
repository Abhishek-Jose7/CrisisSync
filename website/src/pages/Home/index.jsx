import { AlertTriangle, ArrowRight, Bell, Building2, CheckCircle2, Clock, Flame, MapPinned, Radio, Shield, ShieldCheck, Siren, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { roleLinks } from '../../siteConfig';

const metrics = [
  { value: '42s', label: 'avg warden ack time' },
  { value: '8', label: 'live hotel zones' },
  { value: '6', label: 'SOS context types' },
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
      <section className="hero hero--ops">
        <div className="container ops-hero-grid">
          <div className="hero__content">
            <span className="eyebrow eyebrow--coral"><Siren size={14} /> Venue incident command, live in minutes</span>
            <h1>CrisisSync</h1>
            <p className="hero__lead">
              A zone-based emergency operating layer for venues — guest SOS triage, staff tasking, admin command, QR access, broadcasts, and post-incident records in one linked response chain.
            </p>
            <div className="hero__actions">
              <a className="btn btn-primary" href={roleLinks.admin.production} target="_blank" rel="noreferrer">
                Create Admin Account <ArrowRight size={16} />
              </a>
              <Link className="btn btn-outline" to="/demo">
                Open Live Demo
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

          <div className="command-board" aria-label="Live command preview">
            <div className="command-board__top">
              <div>
                <span>Grand Orchid Hotel</span>
                <strong>Fire response active</strong>
              </div>
              <span className="live-pill"><Zap size={13} /> LIVE</span>
            </div>
            <div className="command-board__map">
              {['Lobby', 'Kitchen', 'Floor 7', 'Parking', 'Pool', 'Restaurant'].map((zone, index) => (
                <div key={zone} className={`map-cell ${index === 2 ? 'is-hot' : index === 1 ? 'is-warning' : ''}`}>
                  <span>{zone}</span>
                  <small>{index === 2 ? 'SOS x2' : index === 1 ? 'Check gas' : 'Clear'}</small>
                </div>
              ))}
            </div>
            <div className="triage-card">
              <div className="triage-card__icon"><Flame size={20} /></div>
              <div>
                <strong>Guest SOS requires context first</strong>
                <span>Fire · immediate danger · a few people · Floor 7</span>
              </div>
              <CheckCircle2 size={18} />
            </div>
            <div className="ops-feed-mini">
              <FeedLine icon={AlertTriangle} title="Warden acknowledged Floor 7" meta="18 sec ago" />
              <FeedLine icon={Radio} title="Broadcast sent to guest devices" meta="Use Stairwell B" />
              <FeedLine icon={Bell} title="Medical team staged at Gate B" meta="Command action" />
            </div>
          </div>
        </div>
      </section>

      {/* ACCESS PATHS */}
      <section className="section section--surface">
        <div className="container split">
          <div>
            <span className="eyebrow eyebrow--teal">Connected role surfaces</span>
            <h2>Admin, staff, and guests see different screens, but work the same incident.</h2>
            <p>
              Each role operates in its own application with appropriate data boundaries. The admin configures, staff respond, and guests receive guidance — all through separate, purpose-built surfaces.
            </p>
          </div>
          <div className="access-grid">
            <AccessLink icon={Building2} title="Admin command" text="Create venue, print QR cards, broadcast instructions, and control severity." href={roleLinks.admin.production} />
            <AccessLink icon={ShieldCheck} title="Staff response" text="Open assigned-zone tasks, update status, and acknowledge command messages." href={roleLinks.staff.production} />
            <AccessLink icon={MapPinned} title="Guest QR safety" text="Scan QR, choose emergency type, confirm details, and receive route guidance." href={roleLinks.guest.production} />
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

      <section className="section section--warm">
        <div className="container response-flow">
          <div>
            <span className="eyebrow eyebrow--coral">SOS without false alarms</span>
            <h2>Emergency reports collect context before alerting command.</h2>
            <p>Guests choose the crisis type, whether they are in immediate danger, and how many people are affected. CrisisSync turns that into severity, playbook routing, staff notifications, and a clean audit trail.</p>
          </div>
          <div className="flow-stack">
            {['Fire, medical, security, flooding, power, or other', 'Immediate danger or reporting only', 'Just me, a few people, or many people', 'Final confirmation before sending'].map((item, index) => (
              <div className="flow-step" key={item}>
                <strong>0{index + 1}</strong>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--compact">
        <div className="container callout-band">
          <div>
            <Clock size={20} style={{ color: 'var(--accent-indigo)' }} />
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

function FeedLine({ icon: Icon, title, meta }) {
  return (
    <div className="feed-line">
      <Icon size={16} />
      <span>{title}</span>
      <small>{meta}</small>
    </div>
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
