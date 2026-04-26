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

function RequireAuth({ children, basePath = '', requireProfile = true }) {
  const { state } = useStaffDemo();
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
        <Route path="onboarding" element={<RequireAuth basePath={basePath} requireProfile={false}><StaffOnboarding basePath={basePath} /></RequireAuth>} />
        <Route index element={<RequireAuth basePath={basePath}><ZoneHome demoMode={demoMode} /></RequireAuth>} />
        <Route path="incident" element={<RequireAuth basePath={basePath}><Incident /></RequireAuth>} />
        <Route path="map" element={<RequireAuth basePath={basePath}><MapView /></RequireAuth>} />
        <Route path="comms" element={<RequireAuth basePath={basePath}><PlaceholderView title="Communications" icon="💬" description="Secure warden broadcast channel" /></RequireAuth>} />
        <Route path="contacts" element={<RequireAuth basePath={basePath}><PlaceholderView title="Contacts" icon="👥" description="Emergency personnel directory" /></RequireAuth>} />
        <Route path="resources" element={<RequireAuth basePath={basePath}><PlaceholderView title="Resources" icon="📄" description="Floor blueprints and safety protocols" /></RequireAuth>} />
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
