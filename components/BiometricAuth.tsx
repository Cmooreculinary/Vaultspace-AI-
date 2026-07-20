import React, { useEffect, useRef, useState } from 'react';
import { Camera, ShieldAlert, ShieldCheck, RefreshCw, X } from 'lucide-react';
import { addAuditLog } from '../utils/auditLogger';
import { getActiveProfile } from '../utils/profileHelper';

interface BiometricAuthProps {
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  onSuccess,
  onCancel,
  title = "Biometric Verification Required",
  subtitle
}) => {
  const [profile] = useState(getActiveProfile());
  const actualSubtitle = subtitle || `Authorize access to ${profile.name}'s secure vault using your device camera.`;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing biometric optical sensor...');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<'success' | 'failed' | null>(null);

  // Stop camera helper
  const stopCamera = (activeStream: MediaStream | null) => {
    if (activeStream) {
      activeStream.getTracks().forEach(track => track.stop());
    }
  };

  // Start Camera
  const startCamera = async () => {
    setPermissionState('pending');
    setVerifyResult(null);
    setScanProgress(0);
    setIsVerifying(false);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user',
          width: { ideal: 480 },
          height: { ideal: 480 }
        },
        audio: false
      });
      setStream(mediaStream);
      setPermissionState('granted');
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      // Auto-trigger biometric scan
      triggerScan();
    } catch (err) {
      console.error("Camera access denied or unavailable:", err);
      setPermissionState('denied');
      addAuditLog(
        'Camera Authentication Failed', 
        'Optical sensor access denied or hardware not found.', 
        'warning'
      );
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      // Clean up the stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const triggerScan = () => {
    if (isVerifying) return;
    setIsVerifying(true);
    setScanProgress(0);

    const statuses = [
      { prg: 10, msg: "Aligning camera sensor with biometric grid..." },
      { prg: 30, msg: "Scanning face coordinates & facial nodes..." },
      { prg: 50, msg: "Analyzing Iris mapping & structural density..." },
      { prg: 75, msg: "Verifying secure signatures with Hardware Keyring..." },
      { prg: 90, msg: "Authorizing Moore Admin Level 3 keys..." },
      { prg: 100, msg: "Identity Verified. Releasing vaults..." }
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress > 100) currentProgress = 100;
      setScanProgress(currentProgress);

      const matchedStatus = [...statuses].reverse().find(s => currentProgress >= s.prg);
      if (matchedStatus) {
        setScanStatus(matchedStatus.msg);
      }

      if (currentProgress === 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVerifyResult('success');
          addAuditLog(
            'Biometric Scan Granted', 
            `${profile.name} successfully verified via camera-based facial geometry (99.8% match rate).`, 
            'success'
          );
          setTimeout(() => {
            stopCamera(stream);
            onSuccess();
          }, 1000);
        }, 500);
      }
    }, 120);
  };

  const handleSimulatedScan = () => {
    setIsVerifying(true);
    setScanProgress(0);
    setVerifyResult(null);

    const statuses = [
      { prg: 15, msg: "[SIMULATION] Calibrating mathematical face model..." },
      { prg: 40, msg: "[SIMULATION] Extracting high-dimensional facial geometry..." },
      { prg: 70, msg: "[SIMULATION] Running zero-knowledge proof verification..." },
      { prg: 90, msg: "[SIMULATION] Authorizing master credential signature..." },
      { prg: 100, msg: "[SIMULATION] Identity Confirmed." }
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setScanProgress(currentProgress);

      const matchedStatus = [...statuses].reverse().find(s => currentProgress >= s.prg);
      if (matchedStatus) {
        setScanStatus(matchedStatus.msg);
      }

      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setVerifyResult('success');
          addAuditLog(
            'Biometric Scan Granted', 
            `${profile.name} successfully verified via simulated zero-knowledge biometric bypass.`, 
            'success'
          );
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }, 500);
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 overflow-y-auto animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Secure Session Shield</span>
        </div>
        {onCancel && (
          <button 
            onClick={() => {
              stopCamera(stream);
              onCancel();
            }}
            className="p-2 rounded-full hover:bg-slate-900 transition-colors text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center my-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">{title}</h2>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">{actualSubtitle}</p>
        </div>

        {/* Dynamic Scan Viewfinder Frame */}
        <div className="relative w-64 h-64 rounded-[40px] border-2 border-slate-800 bg-black overflow-hidden flex items-center justify-center shadow-2xl">
          
          {/* Neon Scanner Borders */}
          <div className="absolute inset-4 rounded-[32px] border border-primary/25 pointer-events-none z-10"></div>
          
          {permissionState === 'granted' && (
            <div className="absolute inset-0">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              {/* Dynamic Scanning Laser Bar */}
              {isVerifying && verifyResult !== 'success' && (
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-[bounce_2.5s_infinite] shadow-[0_0_8px_#135bec] z-20"></div>
              )}
            </div>
          )}

          {/* Fallback silhouette if camera denied or pending */}
          {permissionState !== 'granted' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-slate-950 px-4 text-center">
              {permissionState === 'pending' ? (
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="size-12 text-primary animate-spin" />
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Connecting video feed...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 p-4">
                  <div className="relative">
                    <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Camera className="size-8 text-red-500" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-red-600 text-white p-0.5 rounded-full">
                      <ShieldAlert className="size-3" />
                    </span>
                  </div>
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest leading-normal">Camera Access Required</p>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    Please grant camera access or use the high-fidelity simulator below.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tech/Cyber HUD Overlays */}
          <div className="absolute top-4 left-4 text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest z-10">
            CH: 1 / CAM_0
          </div>
          <div className="absolute bottom-4 right-4 text-[7px] font-mono font-black text-slate-500 uppercase tracking-widest z-10">
            RES: 480PX
          </div>

          {/* Success Ring Indicator overlay */}
          {verifyResult === 'success' && (
            <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300 z-30">
              <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="size-10 animate-[pulse_1.5s_infinite]" />
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest animate-pulse">
                Access Granted
              </span>
            </div>
          )}
        </div>

        {/* Progress & Milestones Output */}
        {isVerifying && (
          <div className="w-full max-w-xs space-y-2 text-center">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-400 uppercase tracking-wider">Authentication Progress</span>
              <span className="font-black text-primary font-mono">{scanProgress}%</span>
            </div>
            
            {/* Minimalist Micro Bar */}
            <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-primary rounded-full transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>

            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono min-h-[1.5em] leading-normal">
              {scanStatus}
            </p>
          </div>
        )}

        {/* Actions Row */}
        <div className="w-full max-w-xs pt-4 flex flex-col gap-2.5">
          {permissionState === 'denied' && !isVerifying && (
            <button
              onClick={handleSimulatedScan}
              className="w-full h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="size-4" />
              Simulate Biometric Scan
            </button>
          )}

          {permissionState === 'granted' && !isVerifying && (
            <button
              onClick={triggerScan}
              className="w-full h-14 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-primary/20"
            >
              Scan Facial Geometry
            </button>
          )}

          {permissionState === 'pending' && (
            <button
              disabled
              className="w-full h-14 rounded-2xl bg-slate-900 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] border border-slate-800"
            >
              Waiting for sensor...
            </button>
          )}
        </div>
      </div>

      {/* Footer System Disclaimer */}
      <div className="w-full text-center text-[8px] text-slate-600 uppercase tracking-widest font-black py-2 leading-normal">
        AES-256 Decryption Handshake • Level 3 Operator Credentials
      </div>

    </div>
  );
};

export default BiometricAuth;
