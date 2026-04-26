import { useGuestDemo } from '../../context/DemoContext';
import { Globe, ShieldCheck, ChevronRight, ShieldAlert, Navigation, Users, Phone } from 'lucide-react';
import { BottomNav } from '../../components/BottomNav';

export function EvacuationMode() {
  const { state, actions } = useGuestDemo();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', background: '#f9f9f9', margin: 'calc(-1 * var(--space-4))', padding: 'var(--space-4)', paddingBottom: 80 }}>
      {/* Background Mountain/Sky graphic mock */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(to bottom, #d9e2ec 0%, #f9f9f9 100%)', opacity: 0.5, zIndex: 0 }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>10:24</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 12px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '0.75rem', fontWeight: 600 }}>
             <Globe size={14} /> English <ChevronRight size={14} />
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>We're here to keep you safe.</h1>
          <p style={{ fontSize: '1rem', color: '#475467' }}>Help is one tap away.</p>
        </div>

        {/* Giant SOS BUTTON */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
          <button onClick={() => actions.sendSos('help')} style={{ 
            width: '180px', height: '180px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 0 0 12px rgba(239, 68, 68, 0.15), 0 16px 32px rgba(239, 68, 68, 0.4)',
            color: 'white', fontSize: '3rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s'
          }}>
            SOS
          </button>
          <div style={{ marginTop: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: '#475467' }}>Tap for Help</div>
        </div>

        {/* Active Alert Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: 'var(--space-4)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-danger)' }}><ShieldAlert size={24} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Active Alert in your area</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#101828' }}>Fire reported in Floor 1</div>
              <div style={{ fontSize: '0.75rem', color: '#475467', marginTop: '2px' }}>Please follow instructions below.</div>
            </div>
            <ChevronRight size={18} color="var(--color-danger)" />
          </div>

          <MenuLink icon={<ShieldCheck size={20} color="#3b82f6" />} title="What to do" subtitle="Step-by-step safety instructions" />
          <MenuLink icon={<Navigation size={20} color="#10b981" />} title="Evacuation Guide" subtitle="Find your way to safety" />
          <MenuLink icon={<Users size={20} color="#8b5cf6" />} title="Assembly Point" subtitle="Where to go after evacuation" />
          <MenuLink icon={<Phone size={20} color="#f59e0b" />} title="Emergency Numbers" subtitle="Important contacts" />

        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', marginBottom: 'var(--space-4)', fontSize: '0.75rem', color: '#98a2b3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          Powered by CrisisSync <ShieldCheck size={14} />
        </div>

      </div>
      
      <BottomNav />
    </div>
  );
}

function MenuLink({ icon, title, subtitle }) {
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
       <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
       </div>
       <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#101828' }}>{title}</div>
          <div style={{ fontSize: '0.75rem', color: '#667085' }}>{subtitle}</div>
       </div>
       <ChevronRight size={18} color="#98a2b3" />
    </div>
  );
}
