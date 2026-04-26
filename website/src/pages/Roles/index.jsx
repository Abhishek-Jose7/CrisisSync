import { ArrowRight, Building2, Camera, ClipboardCheck, ShieldCheck, UserCheck, UsersRound } from 'lucide-react';
import { roleLinks } from '../../siteConfig';

const roles = [
  {
    icon: Building2,
    title: 'Admin portal',
    href: roleLinks.admin.production,
    action: 'Sign in as Admin',
    items: ['Google sign-in', 'New venue onboarding', 'Zone and staff setup', 'Playbooks, QR cards, and command center'],
  },
  {
    icon: UsersRound,
    title: 'Staff PWA',
    href: roleLinks.staff.production,
    action: 'Sign in as Staff',
    items: ['Google sign-in', 'Staff profile onboarding', 'Assigned zone and shift', 'Incident checklist, map, and status updates'],
  },
  {
    icon: Camera,
    title: 'Guest PWA',
    href: roleLinks.guest.production,
    action: 'Sign in as Guest',
    items: ['Google sign-in', 'Camera scanner first', 'QR token validation', 'Zone guidance, SOS, route, and assembly point'],
  },
];

export function Roles() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Role access</span>
          <h1>Each role opens its own deployed app.</h1>
          <p>
            The public website does not impersonate the Admin, Staff, or Guest products. It sends people to the right independent app, where Google sign-in and onboarding happen inside that role surface.
          </p>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <article className="role-card" key={role.title}>
                <div className="role-card__icon"><Icon size={26} /></div>
                <h2>{role.title}</h2>
                <ul>
                  {role.items.map((item) => (
                    <li key={item}><ShieldCheck size={16} /> {item}</li>
                  ))}
                </ul>
                <a className="btn btn-primary" href={role.href} target="_blank" rel="noreferrer">
                  {role.action} <ArrowRight size={18} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="timeline-panel">
          <ClipboardCheck size={24} />
          <div>
            <h2>New user path</h2>
            <p>
              Admins complete the full venue setup before command access. Staff confirm zone, role, and shift before entering the PWA. Guests authenticate, scan a QR code, and then land in the matching venue zone session.
            </p>
          </div>
          <UserCheck size={24} />
        </div>
      </div>
    </section>
  );
}
