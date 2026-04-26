import { AlertTriangle, FileWarning, ShieldAlert } from 'lucide-react';

const boundaries = [
  'Does not replace legally mandated fire panels, alarms, sprinklers, or evacuation systems.',
  'Does not dispatch emergency services. Venues must still call local emergency numbers (911, 112, 999, etc.).',
  'Does not replace certified fire safety officers, legally required evacuation wardens, or building inspections.',
  'Does not guarantee response times, evacuation outcomes, or life-safety outcomes under any circumstances.',
  'Does not process, store, or transmit personally identifiable guest information. QR sessions use non-reversible token hashing.',
  'Does not certify venue compliance with local, national, or international safety regulations.',
];

export function Compliance() {
  return (
    <section className="page-shell">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Compliance & Liability</span>
          <h1>Operational coordination with defined liability boundaries.</h1>
          <p>
            CrisisSync helps venue teams coordinate faster, communicate clearly, and maintain incident timelines. It is not a certified life-safety system. Venues using CrisisSync retain full responsibility for their legal safety obligations.
          </p>
        </div>

        <div className="compliance-layout">
          <div className="warning-card">
            <AlertTriangle size={28} />
            <h2>Required legal notice</h2>
            <p>
              CrisisSync is an emergency coordination and communication platform for venue staff. It is not a replacement for legally mandated fire safety systems, emergency services dispatch, certified safety officers, or building compliance inspections. Venues remain fully responsible for all legal fire safety obligations.
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.8125rem' }}>
              This notice appears during Admin onboarding (Step 7), in every venue's settings screen, and in post-incident reports.
            </p>
          </div>
          <div className="boundary-list">
            {boundaries.map((item) => (
              <div className="boundary-item" key={item}>
                <ShieldAlert size={18} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="notice-panel" style={{ marginTop: '24px' }}>
          <div>
            <FileWarning size={20} />
            <h2>Where this notice appears</h2>
            <p>
              The compliance boundary is displayed during Admin onboarding (Step 7 — Compliance Acknowledgment), in the admin settings panel, in every post-incident AI-generated report, and on the guest-facing terms notice. Admin users must explicitly acknowledge this notice before the venue can go live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
