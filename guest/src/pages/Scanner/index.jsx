import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Keyboard, QrCode, ShieldCheck } from 'lucide-react';

function extractToken(rawValue) {
  const value = rawValue.trim();
  if (!value) return '';

  try {
    const url = new URL(value);
    const queryToken = url.searchParams.get('token');
    if (queryToken) return queryToken;
    const parts = url.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || value;
  } catch {
    return value;
  }
}

export function Scanner({ basePath = '' }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [manualValue, setManualValue] = useState('');
  const [cameraStatus, setCameraStatus] = useState('Starting camera scanner...');

  useEffect(() => {
    let cancelled = false;
    let frameId = null;

    async function startScanner() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        if (!('BarcodeDetector' in window)) {
          setCameraStatus('Camera is active. Manual token entry is available on this browser.');
          return;
        }

        const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
        setCameraStatus('Point your camera at a CrisisSync QR code.');

        const scan = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              const token = extractToken(codes[0].rawValue);
              if (token) {
                navigate(`${basePath}/zone/${token}`, { replace: true });
                return;
              }
            }
          } catch {
            setCameraStatus('Scanner is ready. Hold the QR code steady inside the frame.');
          }
          frameId = window.requestAnimationFrame(scan);
        };

        frameId = window.requestAnimationFrame(scan);
      } catch {
        setCameraStatus('Camera permission is needed to scan. You can also enter the QR token manually.');
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      if (frameId) window.cancelAnimationFrame(frameId);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [basePath, navigate]);

  function submitManual(event) {
    event.preventDefault();
    const token = extractToken(manualValue);
    if (token) navigate(`${basePath}/zone/${token}`, { replace: true });
  }

  return (
    <div className="scanner-screen">
      <div className="scanner-header">
        <ShieldCheck size={22} />
        <span>CrisisSync Guest</span>
      </div>

      <div className="scanner-frame">
        <video ref={videoRef} muted playsInline aria-label="QR camera scanner" />
        <div className="scanner-frame__target">
          <QrCode size={42} />
        </div>
      </div>

      <div className="scanner-copy">
        <Camera size={22} />
        <h1>Scan your zone QR code</h1>
        <p>{cameraStatus}</p>
      </div>

      <form className="manual-token" onSubmit={submitManual}>
        <label>
          <Keyboard size={17} />
          Manual QR token
        </label>
        <div>
          <input
            value={manualValue}
            onChange={(event) => setManualValue(event.target.value)}
            placeholder="floor7-ghi789"
          />
          <button type="submit">Open</button>
        </div>
      </form>
    </div>
  );
}
