import { ShieldCheck, QrCode, MapPin } from 'lucide-react';
import { InstallAppButton } from '../../components/InstallAppButton';

export function GuestLogin({ basePath = '' }) {
  return (
    <div className="guest-auth">
      <div className="guest-auth__panel">
        <div className="guest-auth__icon">
          <ShieldCheck size={30} />
        </div>
        <h1>Guest Safety Access</h1>
        <p>Scan the QR code in your area to access zone-specific emergency information, exit routes, and the SOS button.</p>
        
        <div className="qr-instruction-card">
          <QrCode size={48} style={{ color: 'var(--accent-blue, #3d8de9)', opacity: 0.6 }} />
          <div>
            <strong>Look for the CrisisSync QR code</strong>
            <span>Located near exits, lobbies, and common areas</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
          <InfoRow icon={<MapPin size={16} />} text="Each QR code is specific to your zone" />
          <InfoRow icon={<ShieldCheck size={16} />} text="No account or sign-up required" />
          <InfoRow icon={<QrCode size={16} />} text="Session is active for 4 hours after scan" />
        </div>

        <div className="scanner-hint">
          <strong>No QR code available?</strong>
          <span>Ask venue staff for assistance or visit the front desk.</span>
        </div>
        
        <InstallAppButton />
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: '#555' }}>
      <span style={{ color: '#3d8de9', flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
