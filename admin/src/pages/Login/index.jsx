import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AuthContext';
import { ShieldAlert, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { loginWithEmail, registerWithEmail, authError, clearError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register'

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const fn = mode === 'register' ? registerWithEmail : loginWithEmail;
      const result = await fn(email, password);
      navigate(result.setupComplete ? '/command' : '/onboarding', { replace: true });
    } catch {
      // Error is set in context
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    clearError();
    setMode(mode === 'login' ? 'register' : 'login');
  }

  return (
    <div className="login-screen">
      <div className="login-panel">
        <div className="login-icon">
          <ShieldAlert size={28} />
        </div>
        <h1 className="login-title">CrisisSync Admin</h1>
        <p className="login-subtitle">
          {mode === 'login'
            ? 'Sign in to access the command center. New admins will be routed to venue setup.'
            : 'Create an admin account. You will complete venue onboarding after registration.'
          }
        </p>

        {authError && (
          <div className="login-error" role="alert">
            <AlertTriangle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@company.com"
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="login-field">
            <label htmlFor="admin-password">Password</label>
            <div className="login-password-wrap">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Minimum 6 characters' : 'Enter password'}
                required
                minLength={6}
                autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            {loading
              ? 'Processing...'
              : mode === 'login' ? 'Sign In' : 'Create Account'
            }
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="login-switch">
          {mode === 'login' ? (
            <span>New organization? <button type="button" onClick={switchMode}>Create admin account</button></span>
          ) : (
            <span>Already have an account? <button type="button" onClick={switchMode}>Sign in</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
