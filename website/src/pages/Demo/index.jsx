import { ArrowRight, Building2, MapPinned, MonitorPlay, Users } from 'lucide-react';
import { guestDemoZones, roleLinks } from '../../siteConfig';

const demoLinks = [
  {
    icon: Building2,
    title: 'Admin Command Center',
    url: roleLinks.admin.demo,
    text: 'Seeded venue data, zone grid, live alert feed, AI insights panel, incident timeline, and simulated camera events. Grand Orchid Hotel with 5 zones and 7 staff.',
  },
  {
    icon: Users,
    title: 'Staff Warden View',
    url: roleLinks.staff.demo,
    text: 'Floor 7 warden dashboard with assigned zone checklist, AI safety tips, zone status strip, and quick status actions. Role-based routing demo.',
  },
  {
    icon: MapPinned,
    title: 'Guest Safety Interface',
    url: roleLinks.guest.demo,
    text: 'Floor 7 guest zone session with venue info, exit route, assembly point, SOS button, and evacuation mode. Panic-proof emergency card design.',
  },
];

export function Demo() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Demo Environment</span>
          <h1>Test the full system with preloaded data.</h1>
          <p>
            Each demo route loads with realistic seeded data from the Grand Orchid Hotel. No setup required. Demo routes use /demo paths and are fully separate from production access.
          </p>
        </div>

        <div className="card-grid card-grid--three" style={{ marginBottom: '32px' }}>
          {demoLinks.map((demo) => {
            const Icon = demo.icon;
            return (
              <article className="info-card info-card--action" key={demo.title}>
                <Icon size={24} />
                <h2>{demo.title}</h2>
                <p>{demo.text}</p>
                <a className="text-link" href={demo.url} target="_blank" rel="noreferrer">
                  Open demo <ArrowRight size={14} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="demo-zone-panel">
          <div>
            <MonitorPlay size={22} />
            <h2>Guest zone demo URLs</h2>
            <p>Each URL carries a different QR token, resolving to a different zone with unique exit routes and assembly points.</p>
          </div>
          <div className="demo-zone-list">
            {guestDemoZones.map((zone) => (
              <a key={zone.token} href={zone.url} target="_blank" rel="noreferrer">
                <div>
                  <strong>{zone.name}</strong>
                  <span>{zone.zone}</span>
                </div>
                <code>{zone.token}</code>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
