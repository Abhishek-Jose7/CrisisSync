import { useGuestDemo } from '../../context/DemoContext';
import { Globe, ShieldCheck, ChevronRight, ShieldAlert, Navigation, Users, Phone, LayoutDashboard } from 'lucide-react';
import { BottomNav } from '../../components/BottomNav';
import { InstallAppButton } from '../../components/InstallAppButton';
import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export function EvacuationMode({ basePath = '' }) {
  const { state, actions } = useGuestDemo();
  const navigate = useNavigate();
  const location = useLocation();
  const demoToken = basePath === '/demo' ? `/${state.qrToken || location.pathname.split('/')[2] || 'floor7-ghi789'}` : '';
  const routePrefix = `${basePath}${demoToken}`;

  useEffect(() => {
    if (!state.sessionId && basePath === '/demo') {
      actions.startSession(location.pathname.split('/')[2] || 'floor7-ghi789');
    }
  }, [actions, basePath, location.pathname, state.sessionId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', background: '#f9f9f9', margin: 'calc(-1 * var(--space-4))', padding: 'var(--space-4)', paddingBottom: 80 }}>
      {/* Background Mountain/Sky graphic mock */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '400px', background: 'linear-gradient(to bottom, #d9e2ec 0%, #f9f9f9 100%)', opacity: 0.5, zIndex: 0 }}></div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <LiveClock />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '4px 12px', borderRadius: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '0.75rem', fontWeight: 600 }}>
             <Globe size={14} /> English <ChevronRight size={14} />
          </div>
        </div>

        {/* Text */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#101828', marginBottom: '8px' }}>We're here to keep you safe.</h1>
          <p style={{ fontSize: '1rem', color: '#475467' }}>{state.zoneName || 'Your zone'} guidance is active.</p>
        </div>

        {/* Giant SOS BUTTON */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-12)' }}>
          <button onClick={() => actions.sendSos('help')} style={{ 
            width: '180px', height: '180px', borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'radial-gradient(circle, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 0 0 12px rgba(239, 68, 68, 0.15), 0 16px 32px rgba(239, 68, 68, 0.4)',
            color: 'white', fontSize: '3rem', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.1s'
          }}>
            {state.sosSent ? 'SENT' : 'SOS'}
          </button>
          <div style={{ marginTop: 'var(--space-4)', fontSize: '0.875rem', fontWeight: 600, color: '#475467' }}>
            {state.sosSent ? 'Staff have been notified' : 'Tap for Help'}
          </div>
          {state.sosSent && (
            <button
              onClick={() => navigate(routePrefix || '/')}
              style={{
                marginTop: '12px',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                background: '#ffffff',
                color: '#1d4ed8',
                borderRadius: '14px',
                minHeight: 46,
                padding: '0 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(29, 78, 216, 0.08)'
              }}
            >
              <LayoutDashboard size={18} />
              Back to dashboard
            </button>
          )}
        </div>

        {/* Active Alert Nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: 'var(--space-4)', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ color: 'var(--color-danger)' }}><ShieldAlert size={24} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-danger)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '4px' }}>Active Alert in your area</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#101828' }}>Fire reported near {state.zoneName || 'your zone'}</div>
              <div style={{ fontSize: '0.75rem', color: '#475467', marginTop: '2px' }}>Please follow instructions below.</div>
            </div>
            <ChevronRight size={18} color="var(--color-danger)" />
          </div>

          <MenuLink onClick={() => navigate(`${routePrefix}/guide?mode=what-to-do`)} icon={<ShieldCheck size={20} color="#3b82f6" />} title="What to do" subtitle="Immediate actions for this alert" />
          <MenuLink onClick={() => navigate(`${routePrefix}/guide`)} icon={<Navigation size={20} color="#10b981" />} title="Evacuation Guide" subtitle="Find your way to safety" />
          <MenuLink onClick={() => navigate(`${routePrefix}/assembly`)} icon={<Users size={20} color="#8b5cf6" />} title="Assembly Point" subtitle="Where to go after evacuation" />
          <MenuLink icon={<Phone size={20} color="#f59e0b" />} title="Emergency Numbers" subtitle="Important contacts" />

        </div>

        {/* Install Button directly embedded correctly below the links */}
        <div style={{ marginTop: '24px' }}>
          <InstallAppButton />
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', marginBottom: 'var(--space-4)', fontSize: '0.75rem', color: '#98a2b3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          Powered by CrisisSync <ShieldCheck size={14} />
        </div>

      </div>
      
      <BottomNav />
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  return <div style={{ fontWeight: 600, fontSize: '1.25rem' }}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>;
}

function MenuLink({ icon, title, subtitle, onClick }) {
  return (
    <div onClick={onClick} style={{ cursor: 'pointer', background: 'white', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
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
