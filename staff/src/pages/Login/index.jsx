import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffDemo } from '../../context/DemoContext';
import { InstallAppButton } from '../../components/InstallAppButton';
import { auth } from '../../../../shared/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ShieldCheck, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';

export function Login({ basePath = '' }) {
  const { actions } = useStaffDemo();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const profileComplete = actions.login(result.user);
      navigate(profileComplete ? `${basePath}/` : `${basePath}/onboarding`, { replace: true });
    } catch (err) {
      const msg = err.code === 'auth/user-not-found' ? 'No staff account found with this email.'
        : err.code === 'auth/wrong-password' ? 'Incorrect password.'
        : err.code === 'auth/invalid-credential' ? 'Invalid email or password.'
        : err.code === 'auth/too-many-requests' ? 'Too many attempts. Please wait.'
        : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ width: 56, height: 56, background: 'var(--severity-3-bg)', border: '1px solid var(--severity-3-border)', color: 'var(--severity-3)', borderRadius: 'var(--radius-lg)', margin: '0 auto var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>Staff Login</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sign in with your staff credentials to access the zone dashboard</p>
      </div>

      <div style={{ width: '100%', maxWidth: 360 }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--severity-3-bg)', border: '1px solid var(--severity-3-border)', borderRadius: 'var(--radius-md)', marginBottom: '16px', fontSize: '0.75rem', color: 'var(--severity-3)' }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="staff-email" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email address</label>
            <input
              id="staff-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="staff@company.com"
              required
              autoComplete="email"
              autoFocus
              style={{ background: 'var(--bg-dark)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px 16px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label htmlFor="staff-password" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="staff-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
                autoComplete="current-password"
                style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '12px 44px 12px 16px', color: 'var(--text-primary)', fontSize: '0.875rem', outline: 'none' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn--primary btn--block"
            style={{ background: 'var(--text-primary)', color: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontWeight: 700, borderRadius: 'var(--radius-md)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ marginTop: '16px' }}>
          <InstallAppButton />
        </div>
      </div>
    </div>
  );
}
