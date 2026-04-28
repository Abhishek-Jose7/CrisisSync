import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

function detectIOS() {
  const ua = window.navigator.userAgent;
  const webkit = !!ua.match(/WebKit/i);
  const isSafari = webkit && !ua.match(/CriOS/i);
  return Boolean(isSafari && ua.match(/Mobile/i));
}

function detectInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function InstallAppButton({ compact = false }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS] = useState(detectIOS);
  const [isInstalled, setIsInstalled] = useState(detectInstalled);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      alert("To install on iOS: tap the 'Share' icon at the bottom, then scroll down and tap 'Add to Home Screen'.");
    } else {
      alert("App can be installed natively via your browser menu 'Add to Home Screen'.");
    }
  };

  if (isInstalled) return null;

  return (
    <button 
      onClick={handleInstallClick} 
      className={compact ? 'install-pwa-button install-pwa-button--compact' : 'install-pwa-button'}
      style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 24px', background: 'var(--text-primary)', color: 'var(--bg-dark)',
        border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer',
        fontSize: '0.875rem', width: compact ? 'auto' : '100%', justifyContent: 'center',
        marginTop: compact ? 0 : '16px'
      }}
    >
      <Download size={16} /> {compact ? 'Install' : 'Install Official PWA'}
    </button>
  );
}
