import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Camera, ShieldCheck } from 'lucide-react';
import { auth } from '../../../../shared/firebase/config';
import { useGuestDemo } from '../../context/DemoContext';
import { InstallAppButton } from '../../components/InstallAppButton';

export function GuestLogin({ basePath = '' }) {
  const navigate = useNavigate();
  const { actions } = useGuestDemo();
  const [loading, setLoading] = useState(false);

  async function signIn(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      actions.loginGuest(result.user);
      navigate(`${basePath}/scan`, { replace: true });
    } catch (error) {
      console.error(error);
      alert('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="guest-auth">
      <div className="guest-auth__panel">
        <div className="guest-auth__icon">
          <ShieldCheck size={30} />
        </div>
        <h1>Guest safety access</h1>
        <p>Sign in with Google first. Then scan the venue QR code to open the correct zone instructions.</p>
        <button className="btn btn--danger" onClick={signIn} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
        <div className="scanner-hint">
          <Camera size={18} />
          Camera scanner opens after sign-in.
        </div>
        <InstallAppButton />
      </div>
    </div>
  );
}
