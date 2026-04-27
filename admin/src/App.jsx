import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CommandPage } from './pages/Command';
import { SetupPage } from './pages/Setup';
import { AnalyticsPage } from './pages/Analytics';
import { IncidentsPage, ZonesPage, StaffPage, PlaybooksPage, ReportsPage } from './pages/Operations';
import { DemoProvider } from './context/DemoContext';
import { AdminAuthProvider, useAdminAuth } from './context/AuthContext';
import './index.css';
import './tactical.css';

import { AppLayout } from './components/AppLayout';
import { OnboardingPage } from './pages/Onboarding';
import { Login as AdminLogin } from './pages/Login';

function WorkspaceRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="command" replace />} />
      <Route path="command" element={<CommandPage />} />
      <Route path="incident" element={<IncidentsPage />} />
      <Route path="incidents" element={<IncidentsPage />} />
      <Route path="zone" element={<ZonesPage />} />
      <Route path="zones" element={<ZonesPage />} />
      <Route path="staff" element={<StaffPage />} />
      <Route path="playbook" element={<PlaybooksPage />} />
      <Route path="playbooks" element={<PlaybooksPage />} />
      <Route path="report" element={<ReportsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="setting" element={<SetupPage />} />
      <Route path="settings" element={<SetupPage />} />
      <Route path="*" element={<Navigate to="command" replace />} />
    </Routes>
  );
}

function LoadingScreen({ label = 'Preparing CrisisSync...' }) {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      {label}
    </div>
  );
}

function RequireAdmin({ children, requireSetup = true }) {
  const { user, loading, setupComplete } = useAdminAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (requireSetup && !setupComplete) return <Navigate to="/onboarding" replace />;

  return children;
}

function ProductionWorkspace() {
  return (
    <RequireAdmin>
      <DemoProvider seedDemo={false}>
        <AppLayout>
          <WorkspaceRoutes />
        </AppLayout>
      </DemoProvider>
    </RequireAdmin>
  );
}

function DemoWorkspace() {
  return (
      <DemoProvider>
      <AppLayout>
        <WorkspaceRoutes />
      </AppLayout>
    </DemoProvider>
  );
}

function AppShell() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/onboarding" element={<RequireAdmin requireSetup={false}><OnboardingPage /></RequireAdmin>} />
      <Route path="/demo/*" element={<DemoWorkspace />} />
      <Route path="/*" element={<ProductionWorkspace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppShell />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
