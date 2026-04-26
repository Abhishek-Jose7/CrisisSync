import { ArrowRight, BadgeCheck, BellRing, Building2, MapPinned, RadioTower, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/hero.png';
import { roleLinks } from '../../siteConfig';

const metrics = [
  { value: '3', label: 'Independent role apps' },
  { value: '90s', label: 'Command timeout path' },
  { value: 'QR', label: 'Signed guest sessions' },
];

const platformCards = [
  {
    icon: BellRing,
    title: 'Guest SOS without open writes',
    body: 'Guests enter through a QR token and signed session flow, so alerts stay zone-bound and rate-limited.',
  },
  {
    icon: UsersRound,
    title: 'Warden tasks by zone',
    body: 'Staff see assigned zones, status actions, checklists, maps, and response guidance without admin-only controls.',
  },
  {
    icon: RadioTower,
    title: 'Admin command center',
    body: 'Admins configure venue templates, publish QR codes, run incidents, track timelines, and close reports.',
  },
];

export function Home() {
  return (
    <>
      <section className="hero" style={{ '--hero-image': `url(${heroImage})` }}>
        <div className="hero__media" aria-hidden="true" />
        <div className="container hero__content">
          <span className="eyebrow">Emergency coordination for live venues</span>
          <h1>CrisisSync</h1>
          <p className="hero__lead">
            A structured response system for hotels, malls, hospitals, offices, and event venues. Admins configure the venue, staff coordinate the response, and guests get QR-based guidance in the right zone.
          </p>
          <div className="hero__actions">
            <a className="btn btn-primary" href={roleLinks.admin.production} target="_blank" rel="noreferrer">
              Start Admin Setup <ArrowRight size={18} />
            </a>
            <Link className="btn btn-outline" to="/roles">
              Open Role Portals
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

      <section className="section section--surface">
        <div className="container split">
          <div>
            <span className="eyebrow">Production access</span>
            <h2>One public website. Three independent deployed apps.</h2>
            <p>
              The main website only routes users to the correct production portal. Demo links live on a separate page and use `/demo` URLs, so a guest simulation never lands inside the real onboarding flow.
            </p>
          </div>
          <div className="access-grid">
            <AccessLink icon={Building2} title="Admin" text="Google sign-in, venue onboarding, QR setup, command dashboard." href={roleLinks.admin.production} />
            <AccessLink icon={ShieldCheck} title="Staff" text="Google sign-in, staff onboarding, zone assignment, incident tools." href={roleLinks.staff.production} />
            <AccessLink icon={MapPinned} title="Guest" text="Google sign-in, camera scanner, QR token session, zone guidance." href={roleLinks.guest.production} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">How it works</span>
            <h2>Built around the actual incident chain.</h2>
            <p>Every role has a narrower surface than the one above it, which keeps the system fast under pressure.</p>
          </div>
          <div className="card-grid card-grid--three">
            {platformCards.map((card) => {
              const Icon = card.icon;
              return (
                <article className="info-card" key={card.title}>
                  <Icon size={28} />
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--compact">
        <div className="container callout-band">
          <div>
            <BadgeCheck size={24} />
            <h2>Demo stays separate from production.</h2>
            <p>Use the demo page for seeded Admin, Staff, and Guest experiences with distinct URLs for each role and guest zone.</p>
          </div>
          <Link className="btn btn-primary" to="/demo">
            View Demo URLs <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function AccessLink({ icon: Icon, title, text, href }) {
  return (
    <a className="access-link" href={href} target="_blank" rel="noreferrer">
      <Icon size={22} />
      <span>
        <strong>{title}</strong>
        <small>{text}</small>
      </span>
      <ArrowRight size={18} />
    </a>
  );
}
