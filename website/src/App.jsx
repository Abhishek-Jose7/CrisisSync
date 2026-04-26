import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Platform } from './pages/Platform';
import { Roles } from './pages/Roles';
import { Compliance } from './pages/Compliance';
import { Demo } from './pages/Demo';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
