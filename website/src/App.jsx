import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { Solutions } from './pages/Solutions';
import { Roles } from './pages/Roles';
import { Compliance } from './pages/Compliance';
import { Demo } from './pages/Demo';
import { Contact } from './pages/Contact';
import { GuestAccess } from './pages/GuestAccess';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import './index.css';
import './enterprise.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/guest-access" element={<GuestAccess />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
