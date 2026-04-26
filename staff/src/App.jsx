import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StaffDemoProvider, useStaffDemo } from './context/DemoContext';
import { Login } from './pages/Login';
import { StaffOnboarding } from './pages/Onboarding';
import { ZoneHome } from './pages/ZoneHome';
import { Incident } from './pages/Incident';
import { MapView } from './pages/MapView';
import { PlaceholderView } from './pages/PlaceholderView';
import { BottomNav } from './components/BottomNav';
import './index.css';
import './field-response.css';

function RequireAuth({ children, basePath = '', requireProfile = true, demoMode = false }) {
  const { state, actions } = useStaffDemo();
  
  // Bypass authentication in demo mode
  if (demoMode) {
    if (!state.staffUser) {
      // Auto-login with demo user
      actions.login({
        uid: 'demo-staff-001',
        email: 'demo@staff.com',
        displayName: 'Demo Staff Member',
      });
    }
    if (requireProfile && !state.staffUser?.profileComplete) {
      // Auto-complete onboarding for demo
      actions.completeOnboarding({
        name: 'Demo Staff Member',
        role: 'warden',
        assignedZoneId: 'zone-floor7',
        currentShift: 'evening',
      });
    }
    return children;
  }
  
  if (!state.staffUser) return <Navigate to={`${basePath}/login`} replace />;
  if (requireProfile && !state.staffUser.profileComplete) return <Navigate to={`${basePath}/onboarding`} replace />;
  return children;
}

function AppRoutes({ basePath = '', demoMode = false }) {
  const { state } = useStaffDemo();
  return (
    <div className="app-layout">
      <Routes>
        <Route path="login" element={<Login basePath={basePath} />} />
        <Route path="onboarding" element={<RequireAuth basePath={basePath} requireProfile={false} demoMode={demoMode}><StaffOnboarding basePath={basePath} /></RequireAuth>} />
        <Route index element={<RequireAuth basePath={basePath} demoMode={demoMode}><ZoneHome demoMode={demoMode} /></RequireAuth>} />
        <Route path="incident" element={<RequireAuth basePath={basePath} demoMode={demoMode}><Incident /></RequireAuth>} />
        <Route path="map" element={<RequireAuth basePath={basePath} demoMode={demoMode}><MapView /></RequireAuth>} />
        <Route path="comms" element={<RequireAuth basePath={basePath} demoMode={demoMode}><PlaceholderView title="Communications" icon="💬" description="Secure warden broadcast channel" /></RequireAuth>} />
        <Route path="contacts" element={<RequireAuth basePath={basePath} demoMode={demoMode}><PlaceholderView title="Contacts" icon="👥" description="Emergency personnel directory" /></RequireAuth>} />
        <Route path="resources" element={<RequireAuth basePath={basePath} demoMode={demoMode}><PlaceholderView title="Resources" icon="📄" description="Floor blueprints and safety protocols" /></RequireAuth>} />
      </Routes>
      {state.staffUser?.profileComplete && <BottomNav basePath={basePath} />}
    </div>
  );
}

function StaffShell({ basePath = '', mode = 'main', demoMode = false }) {
  return (
    <StaffDemoProvider mode={mode}>
      <AppRoutes basePath={basePath} demoMode={demoMode} />
    </StaffDemoProvider>
  );
}

function MainApp() {
  return (
    <Routes>
      <Route path="/demo/*" element={<StaffShell basePath="/demo" mode="demo" demoMode />} />
      <Route path="/*" element={<StaffShell />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}
