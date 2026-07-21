import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BiometricAuth from './BiometricAuth';
import { getActiveProfile } from '../utils/profileHelper';

const COMMANDS = [
  'OPEN_SAMPLE',
  'FILTER_SAMPLE_RECORDS',
  'VIEW_LOCAL_ACTIVITY',
  'CHECK_BROWSER_STORAGE',
  'SHOW_PRODUCTION_GAPS',
] as const;

interface ExecutionFeedback {
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

const SAMPLE_ASSETS = [
  { name: 'TEAM_WORKSHOP_NOTES', label: 'SAMPLE', info: 'TEXT • DEMO', icon: 'groups' },
  { name: 'KEYNOTE_OUTLINE', label: 'SAMPLE', info: 'MARKDOWN • DEMO', icon: 'menu_book' },
  { name: 'CONTRACT_CHECKLIST', label: 'SAMPLE', info: 'PDF CONCEPT • DEMO', icon: 'policy' },
  { name: 'PERFORMANCE_TRACKER', label: 'SAMPLE', info: 'TABLE CONCEPT • DEMO', icon: 'table_chart' },
];

const OperatorVault: React.FC = () => {
  const navigate = useNavigate();
  const [profile] = useState(getActiveProfile);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<ExecutionFeedback | null>(null);
  const [showCameraPreview, setShowCameraPreview] = useState(false);
  const [cameraPreviewed, setCameraPreviewed] = useState(false);
  const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  const suggestions = useMemo(() => {
    const query = inputValue.trim().toUpperCase();
    if (!query) return COMMANDS;
    return COMMANDS.filter((command) => command.includes(query));
  }, [inputValue]);

  const filteredAssets = useMemo(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) return SAMPLE_ASSETS;
    return SAMPLE_ASSETS.filter((asset) => `${asset.name} ${asset.label}`.toLowerCase().includes(query));
  }, [inputValue]);

  const executeCommand = (rawCommand: string) => {
    const command = rawCommand.trim().toUpperCase();
    if (!command) return;
    setIsProcessing(true);
    setInputValue('');

    timerRef.current = window.setTimeout(() => {
      setIsProcessing(false);
      const timestamp = new Date().toLocaleTimeString();
      if (!COMMANDS.includes(command as (typeof COMMANDS)[number])) {
        setFeedback({ message: `Unknown demo command: ${command}`, type: 'error', timestamp });
        return;
      }

      if (command === 'VIEW_LOCAL_ACTIVITY') {
        navigate('/settings');
        return;
      }

      const messages: Record<(typeof COMMANDS)[number], string> = {
        OPEN_SAMPLE: 'Sample record opened in concept mode. No file was decrypted or downloaded.',
        FILTER_SAMPLE_RECORDS: 'Sample record filter completed in this browser.',
        VIEW_LOCAL_ACTIVITY: 'Opening browser-local activity history.',
        CHECK_BROWSER_STORAGE: 'Demo data uses unencrypted browser localStorage. Do not store sensitive information.',
        SHOW_PRODUCTION_GAPS: 'Production requires backend identity, authorization, encryption, key management, storage, recovery, monitoring, and security review.',
      };
      setFeedback({ message: messages[command as (typeof COMMANDS)[number]], type: 'info', timestamp });
    }, 350);
  };

  const signOut = () => {
    localStorage.removeItem('vault_entered');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32 font-mono text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#2A2A2A] bg-background-dark/95 p-4 backdrop-blur-md">
        <button onClick={() => navigate('/')} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414]" aria-label="Return home">
          <span className="material-symbols-outlined text-white">grid_view</span>
        </button>
        <div className="text-center">
          <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-primary">{profile.name} // Prototype</p>
          <h1 className="font-display text-2xl uppercase tracking-wider text-white">Operator Workbench</h1>
        </div>
        <button onClick={() => navigate('/settings')} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414] text-primary" aria-label="Open settings">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <main className="space-y-6 p-4">
        <section className="border border-primary/30 bg-primary/5 p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Non-operational concept console</p>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-400">Commands below demonstrate interface behavior only. They do not access files, accounts, remote systems, encryption keys, or cloud services.</p>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="operator-command" className="text-[9px] font-black uppercase tracking-widest text-slate-500">Demo command</label>
            <span className="text-[8px] font-bold uppercase tracking-wider text-primary">{isProcessing ? 'Running' : 'Ready'}</span>
          </div>
          <form onSubmit={(event) => { event.preventDefault(); executeCommand(inputValue); }} className="flex h-14 border border-[#2A2A2A] bg-black">
            <span className="grid w-12 place-items-center text-primary">&gt;</span>
            <input id="operator-command" value={inputValue} onChange={(event) => setInputValue(event.target.value.toUpperCase())} disabled={isProcessing} placeholder="TYPE A DEMO COMMAND…" className="min-w-0 flex-1 border-0 bg-transparent px-0 text-xs text-white placeholder:text-slate-700 focus:ring-0" />
            <button type="submit" disabled={!inputValue.trim() || isProcessing} className="border-l border-[#2A2A2A] px-4 text-[9px] font-black uppercase tracking-wider text-primary disabled:text-slate-700">Run</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((command) => (
              <button key={command} type="button" onClick={() => executeCommand(command)} className="border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-[8px] font-semibold tracking-wider text-slate-400 hover:border-primary hover:text-primary">{command}</button>
            ))}
          </div>
        </section>

        {feedback && (
          <section className={`border p-4 ${feedback.type === 'error' ? 'border-red-500/30 bg-red-500/5 text-red-200' : 'border-primary/30 bg-primary/5 text-slate-300'}`} role="status" aria-live="polite">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[10px] leading-relaxed">{feedback.message}</p>
              <time className="shrink-0 text-[8px] text-slate-600">{feedback.timestamp}</time>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Sample Records</h2>
            <span className="text-[8px] text-slate-700">{filteredAssets.length} shown</span>
          </div>
          {filteredAssets.map((asset) => (
            <button key={asset.name} type="button" onClick={() => setFeedback({ message: `${asset.name} selected. This is sample metadata; no file exists behind this card.`, type: 'info', timestamp: new Date().toLocaleTimeString() })} className="flex w-full items-center gap-4 border border-[#2A2A2A] bg-[#141414] p-4 text-left hover:border-primary">
              <span className="grid size-11 shrink-0 place-items-center border border-[#2A2A2A] bg-black text-primary"><span className="material-symbols-outlined">{asset.icon}</span></span>
              <span className="min-w-0 flex-1"><strong className="block truncate text-[10px] tracking-wider text-white">{asset.name}</strong><span className="mt-1 block text-[8px] text-slate-600">{asset.info}</span></span>
              <span className="border border-primary/30 bg-primary/10 px-2 py-1 text-[7px] font-bold text-primary">{asset.label}</span>
            </button>
          ))}
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setShowCameraPreview(true)} className="min-h-20 border border-primary/30 bg-primary/5 p-4 text-left hover:border-primary">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">{cameraPreviewed ? 'Preview completed' : 'Camera preview lab'}</span>
            <span className="mt-2 block text-[9px] leading-relaxed text-slate-500">Demonstrates a local camera preview. It does not verify identity.</span>
          </button>
          <button type="button" onClick={signOut} className="min-h-20 border border-red-500/30 bg-red-500/5 p-4 text-left hover:border-red-500">
            <span className="text-[9px] font-black uppercase tracking-widest text-red-400">End demo session</span>
            <span className="mt-2 block text-[9px] leading-relaxed text-slate-500">Returns to the landing screen without deleting saved demo data.</span>
          </button>
        </section>
      </main>

      {showCameraPreview && (
        <BiometricAuth
          onSuccess={() => { setCameraPreviewed(true); setShowCameraPreview(false); }}
          onCancel={() => setShowCameraPreview(false)}
          title="Camera Preview Lab"
          subtitle="Preview the intended checkpoint interface without identity recognition or access control."
        />
      )}
    </div>
  );
};

export default OperatorVault;
