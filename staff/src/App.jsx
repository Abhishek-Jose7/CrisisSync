import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StaffDemoProvider, useStaffDemo } from './context/DemoContext';
import { Login } from './pages/Login';
import { ZoneHome } from './pages/ZoneHome';
import { Incident } from './pages/Incident';
import { MapView } from './pages/MapView';
import { BottomNav } from './components/BottomNav';
import './index.css';

function RequireAuth({ children }) {
  const { state } = useStaffDemo();
  if (!state.staffUser) return <Navigate to="/login" replace />;
  return children;
}

function MainApp() {
  const { state } = useStaffDemo();
  return (
    <div className="app-layout">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RequireAuth><ZoneHome /></RequireAuth>} />
        <Route path="/incident" element={<RequireAuth><Incident /></RequireAuth>} />
        <Route path="/map" element={<RequireAuth><MapView /></RequireAuth>} />
      </Routes>
      {state.staffUser && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <StaffDemoProvider>
      <BrowserRouter>
        <MainApp />
      </BrowserRouter>
    </StaffDemoProvider>
  );
}
