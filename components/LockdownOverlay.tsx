import React, { useState, useEffect } from 'react';
import { ShieldAlert, Terminal, Lock } from 'lucide-react';

interface LockdownOverlayProps {
  onComplete: () => void;
}

const LockdownOverlay: React.FC<LockdownOverlayProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [stage, setStage] = useState<'shredding' | 'sealing' | 'complete'>('shredding');

  const steps = [
    { text: '⚠️ [EMERGENCY SOS] INITIATED BY NAV MODULE...', delay: 100 },
    { text: '🔒 [REVOKE] Invalidating active user session...', delay: 300 },
    { text: '💥 [SHRED] Scrambling local memory caches & encryption keys...', delay: 600 },
    { text: '🛡️ [SEAL] Activating zero-knowledge storage silos...', delay: 1000 },
    { text: '📡 [NETWORK] Isolating synchronization tunnel interfaces...', delay: 1300 },
    { text: '🧬 [BIOMETRIC] De-linking facial geometry cache...', delay: 1600 },
    { text: '✅ [SUCCESS] VaultSpace completely sealed and hidden.', delay: 1900 },
  ];

  useEffect(() => {
    // Log animations
    steps.forEach((step) => {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, step.text]);
      }, step.delay);
      return () => clearTimeout(timer);
    });

    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage('complete');
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (stage === 'complete') {
      const timer = setTimeout(() => {
        onComplete();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 z-[300] bg-[#070202] text-red-500 flex flex-col justify-between p-6 select-none animate-in fade-in duration-500 overflow-hidden font-mono">
      {/* Background Red Strobe/Pulse */}
      <div className="absolute inset-0 bg-red-950/10 animate-pulse pointer-events-none" />

      {/* Header Warning */}
      <div className="flex items-center justify-between border-b border-red-900/30 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-5 text-red-500 animate-bounce" />
          <span className="text-[10px] font-black tracking-[0.25em] uppercase text-red-400">Tactical SOS Lockout Active</span>
        </div>
        <span className="text-[9px] font-black text-red-600 border border-red-950 px-2 py-0.5 rounded uppercase tracking-widest">
          LEVEL-3 SEC
        </span>
      </div>

      {/* Main Terminal Activity */}
      <div className="flex-1 my-auto flex flex-col items-center justify-center space-y-8 max-w-sm mx-auto w-full relative z-10">
        {/* Glowing Red Icon */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-red-500/10 blur-xl animate-pulse"></div>
          <div className="size-20 rounded-full border border-red-500/50 flex items-center justify-center bg-black shadow-[0_0_30px_rgba(239,68,68,0.2)]">
            <Lock className="size-8 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Warning label */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-white uppercase tracking-tight">SHREDDING DATA CORES</h2>
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-[0.15em]">
            Zero-knowledge container isolated
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-2">
          <div className="h-2 bg-red-950/40 rounded-full overflow-hidden border border-red-900/20">
            <div 
              className="h-full bg-red-600 transition-all duration-100 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-bold text-red-400">
            <span>SECURE WIPING PROG</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Scrolling Terminal Logs */}
        <div className="w-full bg-black/80 border border-red-950/40 p-4 rounded-2xl h-44 overflow-y-auto text-left space-y-1.5 text-[9px] hide-scrollbar">
          <div className="flex items-center gap-1.5 text-red-500 border-b border-red-950 pb-1.5 mb-2">
            <Terminal className="size-3" />
            <span className="font-black text-xs">SHRED_DAEMON_v2.5</span>
          </div>
          {logs.map((log, idx) => (
            <p key={idx} className={log.startsWith('✅') ? 'text-emerald-400 font-black' : 'text-red-400/80'}>
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="text-center text-[8px] text-red-950/60 uppercase tracking-[0.25em] font-bold relative z-10 py-2">
        CRITICAL ERROR: VAULT ENCLAVE FORCE SHUTDOWN • CORES UNREACHABLE
      </div>
    </div>
  );
};

export default LockdownOverlay;
