import { ArrowRight, Building2, Flame, HeartPulse, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orgTypes } from '../../siteConfig';

const solutionDetails = {
  hotel: {
    zones: ['Lobby', 'Guest Room Floors (1-20)', 'Kitchen', 'Basement Parking', 'Rooftop Pool', 'Conference Rooms', 'Spa & Wellness'],
    scenarios: ['Kitchen fire', 'Room emergency', 'Lobby crowd surge', 'Power outage', 'Medical emergency'],
    staffRoles: ['Front Desk Manager', 'Floor Wardens', 'Kitchen Safety Officer', 'Security Lead', 'Housekeeping Supervisor'],
  },
  mall: {
    zones: ['Food Court', 'Anchor Store Wings', 'Basement Parking', 'Main Atrium', 'Loading Dock', 'Cinema Complex', 'Escalator Lobbies'],
    scenarios: ['Fire in food court', 'Crowd surge', 'Structural concern', 'Suspicious package', 'Medical emergency'],
    staffRoles: ['Mall Operations Manager', 'Wing Wardens', 'Parking Coordinator', 'Security Leads', 'Tenant Liaison'],
  },
  hospital: {
    zones: ['Emergency Block', 'ICU', 'Wards (A-F)', 'OPD', 'Pharmacy', 'Operating Theaters', 'Administration Wing'],
    scenarios: ['Fire in ward', 'Mass casualty intake', 'Power failure', 'Gas leak', 'Security threat'],
    staffRoles: ['Duty Medical Officer', 'Ward Supervisors', 'Emergency Coordinator', 'Facilities Manager', 'Security Head'],
  },
  restaurant: {
    zones: ['Kitchen', 'Dining Hall', 'Outdoor Seating', 'Storage', 'Reception', 'Restrooms'],
    scenarios: ['Kitchen fire', 'Gas leak', 'Customer medical emergency', 'Power outage', 'Flooding'],
    staffRoles: ['Restaurant Manager', 'Kitchen Head', 'Floor Staff Lead', 'Bar Manager'],
  },
  event: {
    zones: ['Main Stage', 'Audience Seating', 'VIP Lounge', 'Backstage', 'Parking', 'Entry Gates', 'Concession Area'],
    scenarios: ['Crowd surge', 'Stage collapse', 'Fire', 'Weather emergency', 'Medical emergency'],
    staffRoles: ['Event Director', 'Sector Wardens', 'Gate Coordinators', 'Medical Team Lead', 'Security Chief'],
  },
  corporate: {
    zones: ['Office Floors (1-15)', 'Lobby', 'Server Room', 'Parking Structure', 'Cafeteria', 'Conference Center'],
    scenarios: ['Fire alarm', 'Power failure', 'Security threat', 'Gas leak', 'Structural concern'],
    staffRoles: ['Facilities Manager', 'Floor Fire Wardens', 'IT Emergency Lead', 'Security Manager', 'Receptionist Lead'],
  },
  cowork: {
    zones: ['Hot Desks', 'Private Offices', 'Meeting Rooms', 'Common Area', 'Pantry', 'Reception'],
    scenarios: ['Fire', 'Medical emergency', 'Power outage', 'Security incident'],
    staffRoles: ['Community Manager', 'Floor Warden', 'Facilities Coordinator', 'Front Desk Lead'],
  },
  other: {
    zones: ['Configurable zones based on venue structure'],
    scenarios: ['All crisis types supported', 'Custom playbooks'],
    staffRoles: ['Admin', 'Duty Manager', 'Wardens', 'Senior Wardens'],
  },
};

export function Solutions() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Solutions by Organization Type</span>
          <h1>Configured for your venue type from day one.</h1>
          <p>
            CrisisSync preloads realistic zone templates, staff roles, and playbook configurations based on your organization type. Every deployment starts with industry-appropriate defaults.
          </p>
        </div>

        <div className="org-grid" style={{ marginBottom: '48px' }}>
          {orgTypes.map((org) => (
            <div className="org-card" key={org.id}>
              <span className="org-card__icon">{org.icon}</span>
              <span className="org-card__label">{org.label}</span>
              <span className="org-card__desc">{org.desc}</span>
            </div>
          ))}
        </div>

        <div className="card-grid card-grid--three" style={{ marginBottom: 32 }}>
          {[
            { icon: Flame, title: 'Fire and smoke', text: 'Kitchen, floor, panel, and smoke-observation workflows.' },
            { icon: HeartPulse, title: 'Medical response', text: 'First-aid routing, responder staging, and clear guest guidance.' },
            { icon: ShieldAlert, title: 'Security threats', text: 'Silent staff alerts and zone containment instructions.' },
          ].map((scenario) => {
            const Icon = scenario.icon;
            return (
              <article className="scenario-card" key={scenario.title}>
                <div className="scenario-card__icon"><Icon size={24} /></div>
                <div>
                  <h3>{scenario.title}</h3>
                  <p>{scenario.text}</p>
                </div>
              </article>
            );
          })}
        </div>

        {Object.entries(solutionDetails).filter(([key]) => ['hotel', 'mall', 'hospital'].includes(key)).map(([key, detail]) => {
          const org = orgTypes.find(o => o.id === key);
          return (
            <div className="info-card" key={key} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '0.75fr 1fr', gap: '24px', alignItems: 'start' }}>
                <div>
                  <Building2 size={22} />
                  <h3 style={{ marginTop: 12 }}>{org.icon} {org.label}</h3>
                  <p>{org.desc}</p>
                </div>
                <div>
                  <div className="tag-row">
                    {[...detail.zones.slice(0, 5), ...detail.scenarios.slice(0, 3), ...detail.staffRoles.slice(0, 3)].map(item => <span key={item}>{item}</span>)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="callout-band" style={{ marginTop: '32px' }}>
          <div>
            <h2>Ready to configure your venue?</h2>
            <p>Admin onboarding starts with organization type selection and preloads the appropriate zone structure, playbooks, and staff roles.</p>
          </div>
          <Link className="btn btn-primary" to="/contact">
            Request Demo <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
