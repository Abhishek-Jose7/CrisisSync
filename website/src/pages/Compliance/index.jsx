import { AlertTriangle, FileWarning, ShieldAlert } from 'lucide-react';

const boundaries = [
  'Does not replace legally mandated fire panels, alarms, sprinklers, or evacuation systems.',
  'Does not dispatch emergency services. Venues must still call the local emergency number.',
  'Does not replace certified fire safety officers, required wardens, or building inspections.',
  'Does not guarantee response times, evacuation outcomes, or life-safety outcomes.',
];

export function Compliance() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Compliance</span>
          <h1>Operational support with clear liability boundaries.</h1>
          <p>
            CrisisSync helps venue teams coordinate faster, communicate clearly, and keep incident timelines. It is not a certified life-safety system.
          </p>
        </div>

        <div className="compliance-layout">
          <div className="warning-card">
            <AlertTriangle size={32} />
            <h2>Required notice</h2>
            <p>
              Venues using CrisisSync remain fully responsible for their legal fire safety obligations, emergency service calls, inspections, and certified staff coverage.
            </p>
          </div>
          <div className="boundary-list">
            {boundaries.map((item) => (
              <div className="boundary-item" key={item}>
                <ShieldAlert size={20} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="notice-panel">
          <FileWarning size={24} />
          <div>
            <h2>Where this notice appears</h2>
            <p>
              The same boundary is shown during Admin onboarding and should remain visible in venue settings, matching the project instructions in `agent.md`.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
