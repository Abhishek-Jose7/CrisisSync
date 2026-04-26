import { ArrowRight, Building2, MapPinned, ShieldCheck, UserCheck, Users } from 'lucide-react';
import { roleLinks } from '../../siteConfig';

const roles = [
  {
    icon: Building2,
    title: 'Admin Portal',
    href: roleLinks.admin.production,
    action: 'Access Admin Portal',
    items: [
      'Email + password login',
      'Organization type selection',
      '8-step venue onboarding wizard',
      'Zone builder with preloaded templates',
      'Staff invitation and assignment',
      'Playbook and escalation configuration',
      'QR code generation and export',
      'Live incident command center',
    ],
  },
  {
    icon: Users,
    title: 'Staff Access',
    href: roleLinks.staff.production,
    action: 'Access Staff Portal',
    items: [
      'Email + password login',
      'Role-based routing (Warden / Senior Warden / Duty Manager)',
      'Zone-specific incident dashboard',
      'Checklist completion and status updates',
      'AI-assisted safety tips',
      'Multi-zone coordination for senior staff',
      'Map view with exit routes',
    ],
  },
  {
    icon: MapPinned,
    title: 'Guest Access',
    href: roleLinks.guest.production,
    action: 'View Guest Experience',
    items: [
      'No login required — QR scan only',
      'Zone-specific safety information',
      'Exit routes and assembly points',
      'One-tap SOS with structured input',
      'Live incident severity updates',
      'Multilingual AI-generated instructions',
      'Panic-proof emergency interface',
    ],
  },
];

export function Roles() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Access Portals</span>
          <h1>Each role operates in its own deployed application.</h1>
          <p>
            Admin, Staff, and Guest apps are independently deployed with separate data boundaries and access controls. The website routes users to the correct portal for their role.
          </p>
        </div>

        <div className="role-grid">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <article className="role-card" key={role.title}>
                <div className="role-card__icon"><Icon size={24} /></div>
                <h2>{role.title}</h2>
                <ul>
                  {role.items.map((item) => (
                    <li key={item}><ShieldCheck size={14} /> {item}</li>
                  ))}
                </ul>
                <a className="btn btn-primary" href={role.href} target="_blank" rel="noreferrer">
                  {role.action} <ArrowRight size={16} />
                </a>
              </article>
            );
          })}
        </div>

        <div className="timeline-panel">
          <div>
            <UserCheck size={20} />
            <h2>Access flow</h2>
            <p>
              Admins complete venue onboarding before accessing the command center. Staff confirm role, zone, and shift assignment. Guests access their zone directly via QR code — no authentication required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
