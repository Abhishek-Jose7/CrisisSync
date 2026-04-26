import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { CommandPage } from './pages/Command';
import { SetupPage } from './pages/Setup';
import { AnalyticsPage } from './pages/Analytics';
import { PlaceholderView } from './pages/PlaceholderView';
import { DemoProvider } from './context/DemoContext';
import './index.css';

import { AppLayout } from './components/AppLayout';

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/command" replace />} />
            <Route path="/command" element={<CommandPage />} />
            <Route path="/incidents" element={<PlaceholderView title="Incidents Overview" icon="🚨" description="Log of all historic and active incidents globally." />} />
            <Route path="/zones" element={<PlaceholderView title="Zone Management" icon="🗺️" description="Configure floorplans, checkpoints, and risk limits." />} />
            <Route path="/staff" element={<PlaceholderView title="Staff Directory" icon="👥" description="Assign shifts and permission hierarchies." />} />
            <Route path="/playbooks" element={<PlaceholderView title="Playbook Editor" icon="📋" description="Define deterministic AI-guidance triggers." />} />
            <Route path="/reports" element={<PlaceholderView title="Compliance Reports" icon="📄" description="Auto-generated incident autopsy reports." />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SetupPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </DemoProvider>
  );
}
