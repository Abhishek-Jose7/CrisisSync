import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ShieldCheck, Map, Users, FileText, QrCode, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AuthContext';

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAdminAuth();

  const STEPS = [
    { id: 1, title: "Organization", icon: <Building2 size={20} /> },
    { id: 2, title: "Venue", icon: <Map size={20} /> },
    { id: 3, title: "Zones", icon: <ShieldCheck size={20} /> },
    { id: 4, title: "Staff", icon: <Users size={20} /> },
    { id: 5, title: "Playbooks", icon: <FileText size={20} /> },
    { id: 6, title: "QR Codes", icon: <QrCode size={20} /> },
    { id: 7, title: "Compliance", icon: <ShieldCheck size={20} /> },
    { id: 8, title: "Go Live", icon: <CheckCircle size={20} /> },
  ];

  const handleNext = () => setStep(Math.min(step + 1, 8));
  const handleBack = () => setStep(Math.max(step - 1, 1));
  const handleFinish = () => {
    completeOnboarding();
    navigate('/command', { replace: true });
  };

  return (
    <div style={{ padding: 'var(--space-8)', display: 'flex', flexDirection: 'column', minHeight: '100%', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)' }}>
      
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>CrisisSync Onboarding</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {user?.email ? `${user.email} is creating a new admin workspace.` : 'Configure your enterprise emergency coordination infrastructure.'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-8)', flexWrap: 'wrap', justifyContent: 'center' }}>
        {STEPS.map((s, index) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', 
              background: step === s.id ? 'var(--severity-info)' : (step > s.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)'),
              color: step === s.id ? 'white' : (step > s.id ? 'var(--severity-info)' : 'var(--text-secondary)'),
              fontWeight: 600, fontSize: '0.75rem'
            }}>
              {s.icon} <span style={{ display: step === s.id || step > s.id ? 'inline' : 'none' }}>{s.title}</span>
            </div>
            {index < STEPS.length - 1 && <ArrowRight size={16} color="var(--border-strong)" />}
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <div style={{ maxWidth: '600px', width: '100%' }}>
          
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Select Organization Type</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <OrgCard title="Hotel / Resort" icon="🏨" />
                <OrgCard title="Shopping Mall" icon="🛍️" />
                <OrgCard title="Hospital" icon="🏥" />
                <OrgCard title="Corporate Office" icon="🏢" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Venue Setup</h2>
              <input type="text" placeholder="Venue Name (e.g. Grand Orchid)" className="form-input" style={inputStyle} />
              <input type="text" placeholder="Full Address" className="form-input" style={inputStyle} />
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Zone Builder</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Preloading zones for "Hotel / Resort"...</p>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                ✔️ Floor 1 (Lobby) <br/>
                ✔️ Floor 2-10 (Guest Rooms) <br/>
                ✔️ Basement (Parking) <br/>
                ✔️ Roof (Maintenance) <br/>
              </div>
              <button style={btnOutlineStyle}>+ Add Custom Zone</button>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Staff Assignment</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Invite your shift managers and floor wardens.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="email" placeholder="Warden Email" style={{...inputStyle, flex: 1}} />
                <button style={btnPrimaryStyle}>Invite</button>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                👤 John Doe (Duty Manager)<br/>
                👤 Jane Smith (Floor 1 Warden)
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Playbooks</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Configure autonomous escalation sequences.</p>
              <div style={{ border: '1px solid var(--border-strong)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Level 3 (Evacuation) Auto-Triggers</span>
                <input type="checkbox" defaultChecked />
              </div>
              <div style={{ border: '1px solid var(--border-strong)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Silent Admin Timeout (Notify Duty Manager)</span>
                <select style={{ background: 'var(--bg-dark)', color: 'white', border: 'none', outline: 'none' }}><option>90 Seconds</option></select>
              </div>
            </div>
          )}

          {step === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>QR Generation Complete</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Print these cards and place them in their respective zones for Guests.</p>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
               <QrCode size={120} color="var(--text-primary)" />
              </div>
              <button style={btnOutlineStyle}>Download 14 URL QR PDFs</button>
            </div>
          )}

          {step === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Compliance Acknowledgment</h2>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--severity-3)', padding: '16px', borderRadius: '8px', fontSize: '0.875rem' }}>
                WARNING: CrisisSync is an operational support tool. It does not replace legally mandated fire panels, emergency service calls (e.g. 911), or physically certified wardens. You must adhere to building compliance laws.
              </div>
              <label style={{ display: 'flex', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" /> <span style={{ fontSize: '0.875rem' }}>I acknowledge and accept the operational liabilities.</span>
              </label>
            </div>
          )}

          {step === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', textAlign: 'center', padding: '32px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>System Ready</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Your emergency coordination network is now live and actively monitoring.</p>
            </div>
          )}

        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-strong)' }}>
        {step > 1 ? <button onClick={handleBack} style={btnOutlineStyle}><ArrowLeft size={16} /> Back</button> : <div></div>}
        {step < 8 ? <button onClick={handleNext} style={btnPrimaryStyle}>Next <ArrowRight size={16} /></button> : <button onClick={handleFinish} style={{...btnPrimaryStyle, background: '#10b981'}}>Enter Command Center</button>}
      </div>

    </div>
  );
}

function OrgCard({ title, icon }) {
  const [active, setActive] = useState(false);
  return (
    <div 
      onClick={() => setActive(!active)}
      style={{ 
        border: `2px solid ${active ? 'var(--severity-info)' : 'var(--border-strong)'}`, 
        background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        padding: '24px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
        transition: 'all 0.2s'
      }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontWeight: 600 }}>{title}</div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: 'var(--bg-dark)',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  color: 'white',
  outline: 'none'
};

const btnPrimaryStyle = {
  padding: '12px 24px',
  background: 'var(--text-primary)',
  color: 'var(--bg-dark)',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const btnOutlineStyle = {
  padding: '12px 24px',
  background: 'transparent',
  color: 'var(--text-primary)',
  border: '1px solid var(--border-strong)',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};
