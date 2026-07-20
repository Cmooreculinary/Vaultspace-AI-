import React, { useState, useEffect } from 'react';

const EncryptionIndicator: React.FC = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [sessionKey, setSessionKey] = useState('0x4F9A...C812');
  const [lastRotated, setLastRotated] = useState('10m ago');
  const [integrityScore, setIntegrityScore] = useState(100);

  // Generate rotating mock session keys for visual realism and high performance "live" feel
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = '0123456789ABCDEF';
      let key = '0x';
      for (let i = 0; i < 4; i++) {
        key += hex[Math.floor(Math.random() * 16)];
      }
      key += '...';
      for (let i = 0; i < 4; i++) {
        key += hex[Math.floor(Math.random() * 16)];
      }
      setSessionKey(key);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleAudit = () => {
    if (isAuditing) return;
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditLogs(['Initializing military-grade system audit...', 'Verifying AES-256-GCM hardware hooks...']);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setAuditProgress(currentProgress);

      if (currentProgress === 30) {
        setAuditLogs(prev => [...prev, 'Auditing Tier 1 (Moore Family) files [8 items]...']);
      } else if (currentProgress === 60) {
        setAuditLogs(prev => [...prev, 'Auditing Tier 2 (Professional/Consulting) files [6 items]...']);
      } else if (currentProgress === 80) {
        setAuditLogs(prev => [...prev, 'Evaluating RSA-4096 signature bounds...']);
      } else if (currentProgress === 100) {
        setAuditLogs(prev => [...prev, '✓ Integrity verification successful. 14 items secure.']);
        clearInterval(interval);
        setTimeout(() => {
          setIsAuditing(false);
          setIntegrityScore(100);
        }, 1500);
      }
    }, 250);
  };

  const handleRotateKeys = () => {
    if (isRotating) return;
    setIsRotating(true);
    setLastRotated('Rotating...');
    
    setTimeout(() => {
      setIsRotating(false);
      setLastRotated('Just now');
      const hex = '0123456789ABCDEF';
      let key = '0x';
      for (let i = 0; i < 4; i++) {
        key += hex[Math.floor(Math.random() * 16)];
      }
      key += '...';
      for (let i = 0; i < 4; i++) {
        key += hex[Math.floor(Math.random() * 16)];
      }
      setSessionKey(key);
    }, 1200);
  };

  return (
    <div id="vault-encryption-dashboard-widget" className="relative overflow-hidden rounded-[32px] bg-card-dark p-6 border border-slate-800 shadow-2xl transition-all duration-300 hover:border-primary/40">
      {/* Background radial accent to give depth without glowing colors */}
      <div className="absolute -right-16 -top-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      {/* Top Header Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <span className={`material-symbols-outlined text-xl ${isRotating ? 'animate-spin' : ''}`}>
              shield_lock
            </span>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Vault Storage Encryption</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Active & Sealed</span>
            </div>
          </div>
        </div>

        {/* Military-Grade Badge */}
        <div className="flex flex-col items-end">
          <span className="inline-flex items-center gap-1 text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-[11px] font-black">verified</span>
            Military-Grade
          </span>
          <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mt-1">AES-256-GCM / Hardware Locked</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-800/60 my-4"></div>

      {/* Live Specs Bento Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Metric 1 */}
        <div className="p-3 bg-black/30 rounded-2xl border border-slate-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Active Cipher</span>
            <span className="material-symbols-outlined text-xs text-primary">terminal</span>
          </div>
          <p className="text-sm font-black text-white mt-1.5 font-mono tracking-wide">AES-256-GCM</p>
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight mt-0.5">FIPS 140-3 Compliant</p>
        </div>

        {/* Metric 2 */}
        <div className="p-3 bg-black/30 rounded-2xl border border-slate-800/50 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Session Token</span>
            <span className="material-symbols-outlined text-xs text-slate-600">vpn_key</span>
          </div>
          <p className="text-sm font-black text-emerald-400 mt-1.5 font-mono tracking-widest">{sessionKey}</p>
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-tight mt-0.5">Autorotates 60s</p>
        </div>
      </div>

      {/* Encryption Metrics Panel */}
      <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/50 space-y-3">
        <div className="flex justify-between items-center text-[10px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Vault integrity status</span>
          <span className="font-black text-emerald-400 font-mono text-sm">{integrityScore}%</span>
        </div>
        
        {/* Bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${integrityScore}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Protected assets: 14</span>
          <span>Last Re-key: {lastRotated}</span>
        </div>
      </div>

      {/* Audit Log / Simulated output */}
      {isAuditing && (
        <div className="mt-4 p-3 bg-black/60 rounded-2xl border border-slate-800/80 font-mono text-[9px] text-slate-400 space-y-1.5 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/60 pb-1 mb-1">
            <span className="uppercase font-black">INTEGRITY AUDIT IN PROGRESS...</span>
            <span className="text-primary font-bold">{auditProgress}%</span>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto hide-scrollbar">
            {auditLogs.map((log, idx) => (
              <p key={idx} className={`${log.startsWith('✓') ? 'text-emerald-400 font-bold' : ''}`}>
                {log}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={handleAudit}
          disabled={isAuditing}
          className={`h-11 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1.5 ${
            isAuditing 
            ? 'bg-slate-850 border-slate-800 text-slate-500' 
            : 'bg-slate-900 border-slate-800 text-white hover:border-primary/50 hover:bg-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-sm">verified_user</span>
          {isAuditing ? 'Auditing...' : 'Audit Security'}
        </button>

        <button
          onClick={handleRotateKeys}
          disabled={isRotating}
          className="h-11 rounded-xl bg-slate-900 border border-slate-800 text-white text-[9px] font-black uppercase tracking-widest hover:border-primary/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
        >
          <span className={`material-symbols-outlined text-sm ${isRotating ? 'animate-spin text-primary' : ''}`}>
            sync_lock
          </span>
          Rotate Keys
        </button>
      </div>
    </div>
  );
};

export default EncryptionIndicator;
