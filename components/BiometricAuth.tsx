import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, ShieldAlert, X } from 'lucide-react';
import { addAuditLog } from '../utils/auditLogger';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onCancel,
  title = 'Camera Preview Demo',
  subtitle = 'Preview the intended device-check step without performing identity recognition.',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<'idle' | 'requesting' | 'preview' | 'error'>('idle');
  const [message, setMessage] = useState('Camera access has not been requested.');

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  useEffect(() => stopCamera, []);

  const requestCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('error');
      setMessage('Camera preview is unavailable in this browser context.');
      return;
    }

    setStatus('requesting');
    setMessage('Waiting for browser camera permission…');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus('preview');
      setMessage('Camera preview is active. No image is recorded, uploaded, analyzed, or matched.');
      addAuditLog('Camera preview opened', 'Local camera preview opened for the prototype. No biometric recognition was performed.', 'info');
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Camera permission was not granted.';
      setStatus('error');
      setMessage(reason);
      addAuditLog('Camera preview unavailable', reason, 'warning');
    }
  };

  const continueDemo = () => {
    stopCamera();
    addAuditLog('Demo checkpoint continued', 'User continued past the camera-preview concept. No identity was verified.', 'warning');
    onSuccess();
  };

  const cancel = () => {
    stopCamera();
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[400] overflow-y-auto bg-[#0D0D0D]/98 px-6 py-8 text-white backdrop-blur-xl">
      <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-6">
        <div className="flex items-start justify-between border-b border-[#2A2A2A] pb-5">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-primary">Prototype checkpoint</p>
            <h2 className="mt-2 font-display text-4xl uppercase tracking-wide">{title}</h2>
            <p className="mt-2 max-w-sm text-[11px] leading-relaxed text-slate-400">{subtitle}</p>
          </div>
          <button onClick={cancel} className="grid size-10 shrink-0 place-items-center border border-[#2A2A2A] bg-[#141414]" aria-label="Close camera preview">
            <X className="size-4" />
          </button>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border border-[#2A2A2A] bg-black">
          <video ref={videoRef} muted playsInline className={`h-full w-full object-cover ${status === 'preview' ? 'block' : 'hidden'}`} />
          {status !== 'preview' && (
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                {status === 'error' ? <CameraOff className="mx-auto size-10 text-red-400" /> : <Camera className="mx-auto size-10 text-slate-600" />}
                <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-slate-500">{status === 'requesting' ? 'Requesting permission' : 'Camera off'}</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-2 font-mono text-[8px] uppercase tracking-wider text-slate-300">
            Local preview only
          </div>
        </div>

        <div className="border border-primary/30 bg-primary/5 p-4">
          <div className="flex gap-3">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold text-primary">No biometric authentication occurs.</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">A video preview cannot prove identity. Production access control requires an approved identity service and server-side verification.</p>
            </div>
          </div>
        </div>

        <p className={`border p-4 text-[11px] leading-relaxed ${status === 'error' ? 'border-red-500/30 bg-red-500/5 text-red-200' : 'border-[#2A2A2A] bg-[#141414] text-slate-300'}`} role="status" aria-live="polite">
          {message}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => void requestCamera()} disabled={status === 'requesting' || status === 'preview'} className="h-12 border border-primary bg-primary/10 px-4 text-[10px] font-black uppercase tracking-[0.14em] text-primary disabled:opacity-50">
            {status === 'preview' ? 'Preview active' : 'Open camera preview'}
          </button>
          <button type="button" onClick={continueDemo} className="h-12 bg-primary px-4 text-[10px] font-black uppercase tracking-[0.14em] text-black hover:bg-orange-500">
            Continue demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BiometricAuth;
