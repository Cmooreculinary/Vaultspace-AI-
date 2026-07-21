import React, { useEffect, useRef, useState } from 'react';
import { ShieldAlert, Terminal, Trash2 } from 'lucide-react';

interface LockdownOverlayProps {
  onComplete: () => void;
}

const RESET_STEPS = [
  'Starting VaultSpace browser-data reset…',
  'Removing local demo profiles and preferences…',
  'Removing local alerts and activity history…',
  'Removing locally saved credential identifiers…',
  'Leaving unrelated browser storage untouched…',
  'VaultSpace demo data reset complete.',
];

function removeVaultSpaceData(): void {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && (key.startsWith('vaultspace_') || key.startsWith('vault_'))) keys.push(key);
  }
  for (const key of keys) localStorage.removeItem(key);
}

const LockdownOverlay: React.FC<LockdownOverlayProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    const timers = RESET_STEPS.map((step, index) => window.setTimeout(() => {
      setLogs((current) => [...current, step]);
    }, 120 + index * 260));

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 5, 100));
    }, 75);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    removeVaultSpaceData();
    const timer = window.setTimeout(onComplete, 650);
    return () => window.clearTimeout(timer);
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-[500] flex flex-col overflow-hidden bg-[#0D0D0D] p-6 font-mono text-red-400">
      <header className="relative z-10 flex items-center justify-between border-b border-red-900/40 pb-4">
        <div className="flex items-center gap-2"><ShieldAlert className="size-5" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Local Data Reset</span></div>
        <span className="border border-red-900/50 px-2 py-1 text-[8px] font-bold uppercase tracking-wider">This browser only</span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center gap-7">
        <span className="grid size-20 place-items-center border border-red-500/50 bg-red-500/5"><Trash2 className="size-8" /></span>
        <div className="text-center"><h1 className="font-display text-4xl uppercase tracking-wide text-white">Clearing Demo Data</h1><p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-red-300">VaultSpace keys are being removed from localStorage</p></div>
        <div className="w-full"><div className="h-2 overflow-hidden border border-red-900/40 bg-red-950/20"><div className="h-full bg-red-600 transition-all" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex justify-between text-[8px] font-bold"><span>RESET PROGRESS</span><span>{progress}%</span></div></div>
        <div className="h-44 w-full overflow-y-auto border border-red-950/60 bg-black p-4 text-[9px]">
          <div className="mb-3 flex items-center gap-2 border-b border-red-950/60 pb-2"><Terminal className="size-3" /><strong>LOCAL_RESET</strong></div>
          <div className="space-y-2">{logs.map((log) => <p key={log} className={log.endsWith('complete.') ? 'font-bold text-primary' : 'text-red-300/80'}>{log}</p>)}</div>
        </div>
      </main>

      <p className="relative z-10 text-center text-[8px] uppercase tracking-[0.18em] text-slate-700">This action does not wipe device storage, remote accounts, or unrelated site data.</p>
    </div>
  );
};

export default LockdownOverlay;
