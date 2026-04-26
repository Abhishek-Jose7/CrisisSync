import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { CommandPage } from './pages/Command';
import { SetupPage } from './pages/Setup';
import { AnalyticsPage } from './pages/Analytics';
import { DemoProvider } from './context/DemoContext';
import './index.css';

export default function App() {
  return (
    <DemoProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/command" replace />} />
            <Route path="/command" element={<CommandPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </DemoProvider>
  );
}
