import { useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../context/DemoContext';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { FeedPanel } from './FeedPanel';

export function AppLayout({ children }) {
  const { state } = useDemo();
  const location = useLocation();
  const showFeed = location.pathname === '/command' && state.activeIncident;

  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content" role="main">
          {children}
        </main>
        {showFeed && <FeedPanel />}
      </div>
    </div>
  );
}
