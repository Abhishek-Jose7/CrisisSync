import { ArrowRight, Building2, Camera, MonitorPlay, UsersRound } from 'lucide-react';
import { guestDemoZones, roleLinks } from '../../siteConfig';

const demoLinks = [
  {
    icon: Building2,
    title: 'Admin demo',
    url: roleLinks.admin.demo,
    text: 'Seeded command center, setup data, incident timeline, simulated camera events.',
  },
  {
    icon: UsersRound,
    title: 'Staff demo',
    url: roleLinks.staff.demo,
    text: 'Warden view with assigned zone, checklist, map, and incident status actions.',
  },
  {
    icon: Camera,
    title: 'Guest Floor 7 demo',
    url: roleLinks.guest.demo,
    text: 'Zone-specific guest session that starts from a different demo URL.',
  },
];

export function Demo() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Demo environment</span>
          <h1>Separate URLs for each demo user.</h1>
          <p>
            Demo routes use `/demo` and seeded fixture data. Production buttons use `/login`, `/scan`, and onboarding paths in the individually deployed apps.
          </p>
        </div>

        <div className="card-grid card-grid--three">
          {demoLinks.map((demo) => {
            const Icon = demo.icon;
            return (
              <article className="info-card info-card--action" key={demo.title}>
                <Icon size={28} />
                <h2>{demo.title}</h2>
                <p>{demo.text}</p>
                <a className="text-link" href={demo.url} target="_blank" rel="noreferrer">
                  Open demo <ArrowRight size={16} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="demo-zone-panel">
          <div>
            <MonitorPlay size={24} />
            <h2>Guest zone demo URLs</h2>
            <p>Each QR-like demo URL carries a different token so the guest app can resolve a different zone.</p>
          </div>
          <div className="demo-zone-list">
            {guestDemoZones.map((zone) => (
              <a key={zone.token} href={zone.url} target="_blank" rel="noreferrer">
                <strong>{zone.name}</strong>
                <span>{zone.zone}</span>
                <code>{zone.token}</code>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
