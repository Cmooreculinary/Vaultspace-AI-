import React, { useState, useEffect } from 'react';
import { Cloud, CloudCheck, RefreshCw, Server, Shield, HelpCircle, HardDrive } from 'lucide-react';

const CloudSyncIndicator: React.FC = () => {
  const [syncState, setSyncState] = useState<'SYNCED' | 'SYNCING' | 'VERIFYING'>('SYNCED');
  const [lastSyncTime, setLastSyncTime] = useState('Just now');
  const [peerNodes, setPeerNodes] = useState(3);
  const [isOpen, setIsOpen] = useState(false);
  const [handshakeLog, setHandshakeLog] = useState<string[]>([]);
  const [syncProgress, setSyncProgress] = useState(100);

  // Periodic automatic sync simulation to make the dashboard feel alive & dynamic
  useEffect(() => {
    const interval = setInterval(() => {
      triggerSync();
    }, 45000); // Auto-syncs every 45s

    return () => clearInterval(interval);
  }, []);

  const triggerSync = () => {
    if (syncState !== 'SYNCED') return;
    
    setSyncState('SYNCING');
    setSyncProgress(15);
    setHandshakeLog(['Initiating zero-knowledge handshakes...', 'Allocating secure cloud routing channels...']);

    // Progression of sync
    setTimeout(() => {
      setSyncProgress(45);
      setHandshakeLog(prev => [...prev, 'Establishing quantum-resistant TLS tunnels...']);
    }, 800);

    setTimeout(() => {
      setSyncProgress(80);
      setSyncState('VERIFYING');
      setHandshakeLog(prev => [...prev, 'Encrypting data payload locally via AES-GCM-256...', 'Comparing blockchain integrity hashes...']);
    }, 1800);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncState('SYNCED');
      setLastSyncTime('Just now');
      setHandshakeLog(prev => [...prev, '✓ Secure cloud-sync verified. All Tiers locked.']);
    }, 2800);
  };

  return (
    <div id="realtimesync-pill-wrapper" className="relative">
      {/* Minimalist Apple-Style Pulsing Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 rounded-2xl bg-slate-900/45 hover:bg-slate-850/60 border border-slate-800/60 hover:border-slate-700/50 transition-all duration-300 flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-2">
          {/* Pulsing Status Indicator Dot */}
          <span className="relative flex h-2.5 w-2.5">
            {syncState === 'SYNCING' ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </>
            ) : syncState === 'VERIFYING' ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </>
            ) : (
              <>
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </>
            )}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
            {syncState === 'SYNCING' && 'Synchronizing...'}
            {syncState === 'VERIFYING' && 'Verifying Integrity...'}
            {syncState === 'SYNCED' && 'Cloud Protection Sealed'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-300 transition-colors">
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            {syncState === 'SYNCED' ? lastSyncTime : `${syncProgress}%`}
          </span>
          <span className={`material-symbols-outlined text-sm ${syncState !== 'SYNCED' ? 'animate-spin text-primary' : 'text-slate-400'}`}>
            {syncState === 'SYNCED' ? 'cloud_done' : 'sync'}
          </span>
        </div>
      </button>

      {/* Elegant dropdown micro-details drawer (minimalist Apple inspired details pane) */}
      {isOpen && (
        <div className="absolute top-13 left-0 right-0 z-50 rounded-3xl bg-slate-950/95 border border-slate-800/80 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-800/40">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
              <Cloud className="size-3.5 text-primary" /> Secure Storage Sync
            </h4>
            <span className="text-[8px] font-black uppercase bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full">
              Real-time TLS 1.3
            </span>
          </div>

          <div className="space-y-3">
            {/* Sync Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Progress</span>
                <span>{syncProgress}%</span>
              </div>
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${syncProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Metrics Bento Row */}
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Server className="size-3 text-slate-500" />
                  <span className="text-slate-400 font-bold">Sync Nodes</span>
                </div>
                <span className="font-mono font-bold text-white">{peerNodes} Peers</span>
              </div>

              <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/30 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield className="size-3 text-emerald-500" />
                  <span className="text-slate-400 font-bold">ZKP Protocol</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">AES-GCM</span>
              </div>
            </div>

            {/* In-progress active log output */}
            {handshakeLog.length > 0 && (
              <div className="bg-black/40 p-2.5 rounded-xl border border-slate-900 font-mono text-[8px] text-slate-400 space-y-1 max-h-20 overflow-y-auto hide-scrollbar">
                {handshakeLog.map((log, index) => (
                  <p key={index} className={log.startsWith('✓') ? 'text-emerald-400 font-semibold' : ''}>
                    {log}
                  </p>
                ))}
              </div>
            )}

            {/* Action Footer */}
            <div className="flex gap-2">
              <button
                onClick={triggerSync}
                disabled={syncState !== 'SYNCED'}
                className="flex-1 h-9 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-wider hover:bg-blue-600 disabled:bg-slate-900 disabled:text-slate-500 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`size-3 ${syncState !== 'SYNCED' ? 'animate-spin' : ''}`} />
                Sync Cloud Now
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-wider hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudSyncIndicator;
