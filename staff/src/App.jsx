import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StaffDemoProvider, useStaffDemo } from './context/DemoContext';
import { Login } from './pages/Login';
import { ZoneHome } from './pages/ZoneHome';
import { Incident } from './pages/Incident';
import { MapView } from './pages/MapView';
import { PlaceholderView } from './pages/PlaceholderView';
import { BottomNav } from './components/BottomNav';
import './index.css';

function RequireAuth({ children }) {
  let state = { staffUser: null };
  try {
    const demo = useStaffDemo();
    state = demo.state;
  } catch {
    // production mode: mock or actual auth enforcement goes here
    state = { staffUser: { id: "prod_user" } }; // Allow UI routing demonstration in production without Firebase yet
  }
  if (!state.staffUser) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  let state = { staffUser: { id: "prod_user" } };
  try {
    const demo = useStaffDemo();
    state = demo.state;
  } catch {}
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><ZoneHome /></RequireAuth>} />
        <Route path="/incident" element={<RequireAuth><Incident /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><MapView /></RequireAuth>} />
        <Route path="/comms" element={<RequireAuth><PlaceholderView title="Communications" icon="💬" description="Secure warden broadcast channel" /></RequireAuth>} />
        <Route path="/contacts" element={<RequireAuth><PlaceholderView title="Contacts" icon="👥" description="Emergency personnel directory" /></RequireAuth>} />
        <Route path="/resources" element={<RequireAuth><PlaceholderView title="Resources" icon="📄" description="Floor blueprints and safety protocols" /></RequireAuth>} />
      </Routes>
      {state.staffUser && <BottomNav />}
    </div>
  );
}

function MainApp() {
  return (
    <Routes>
      <Route path="/demo/*" element={
        <StaffDemoProvider>
          <AppRoutes />
        </StaffDemoProvider>
      } />
      <Route path="/*" element={
        <AppRoutes />
      } />
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
