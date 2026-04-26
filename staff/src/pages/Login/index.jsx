import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStaffDemo } from '../../context/DemoContext';

export function Login() {
  const { actions } = useStaffDemo();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pin.length === 4) {
      actions.login();
      navigate('/');
    }
  }

  return (
    <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div style={{ width: 64, height: 64, background: 'var(--severity-3)', borderRadius: 'var(--radius-lg)', margin: '0 auto var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '24px' }}>CS</div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>Staff Login</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Enter 4-digit PIN to access warden dashboard</p>
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320 }}>
        <input 
          type="password" 
          inputMode="numeric" 
          pattern="[0-9]*" 
          maxLength="4"
          placeholder="••••"
          className="form-input" 
          style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5em' }}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button 
          type="submit" 
          className="btn btn--primary btn--block"
          disabled={pin.length !== 4}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
