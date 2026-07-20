
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BiometricAuth from './BiometricAuth';
import { getActiveProfile } from '../utils/profileHelper';

const COMMANDS = [
  'DECRYPT_FILE',
  'SYNC_OFFSITE_BACKUP',
  'ROTATE_ENCRYPTION_KEYS',
  'AUDIT_ACCESS_LOGS',
  'WIPE_REMOTE_SESSIONS',
  'GRANT_EMERGENCY_ACCESS',
  'VERIFY_CHECKSUMS',
  'INIT_PURGE_PROTOCOL',
  'SECURE_EXPORT_JSON',
  'STATUS_REPORT'
];

interface ExecutionFeedback {
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: string;
}

const TACTICAL_ASSETS = [
  { name: 'TEAM_BUILDING_ALGO_V4', label: 'BIO-LOCKED', info: 'SECURE DATA • 1.2 MB', icon: 'groups', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'ELITE_MINDSET_MANUSCRIPT', label: 'AUTHOR_ONLY', info: 'MARKDOWN • 8.4 MB', icon: 'menu_book', color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'CONSULTING_CONTRACTS_NDA', label: 'RESTRICTED', info: 'PDF • 4.1 MB', icon: 'policy', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'SPORTS_PSYCH_ELITE_DB', label: 'TOP SECRET', info: 'SQLITE • 142 MB', icon: 'database', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { name: 'SYSTEM_RECOVERY_KEY_ADMIN', label: 'AIR-GAPPED', info: 'BINARY • 2 KB', icon: 'key', color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

const OperatorVault: React.FC = () => {
  const navigate = useNavigate();
  const [profile] = useState(getActiveProfile());
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<ExecutionFeedback | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [mfaStatus, setMfaStatus] = useState<'IDLE' | 'PENDING' | 'ACTIVE'>('IDLE');
  const [showMfaBiometric, setShowMfaBiometric] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inputValue.trim().length > 0) {
      const filtered = COMMANDS.filter(cmd => 
        cmd.toLowerCase().includes(inputValue.toLowerCase()) && 
        cmd.toLowerCase() !== inputValue.toLowerCase()
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toUpperCase();
    if (!cleanCmd) return;

    setIsProcessing(true);
    setSuggestions([]);
    setInputValue('');

    timerRef.current = setTimeout(() => {
      setIsProcessing(false);
      const isValid = COMMANDS.includes(cleanCmd);
      
      if (cleanCmd === 'INIT_PURGE_PROTOCOL') {
        setFeedback({
          message: `FATAL: PURGE PROTOCOL REQUIRES MASTER BIO-KEY VERIFICATION BY ${profile.name.toUpperCase()}.`,
          type: 'error',
          timestamp: new Date().toLocaleTimeString()
        });
      } else if (isValid) {
        setFeedback({
          message: `SUCCESS: ${cleanCmd} EXECUTED UNDER Dynamic clearance.`,
          type: 'success',
          timestamp: new Date().toLocaleTimeString()
        });
      } else {
        setFeedback({
          message: `ERROR: COMMAND "${cleanCmd}" NOT AUTHORIZED IN THIS CONTEXT.`,
          type: 'error',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }, 1500);
  };

  const handleSuggestionClick = (cmd: string) => {
    setInputValue(cmd);
    setSuggestions([]);
    executeCommand(cmd);
  };

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setFeedback({ message: 'INITIATING CONSULTING HUB SYNC...', type: 'info', timestamp: new Date().toLocaleTimeString() });
    setTimeout(() => {
      setIsSyncing(false);
      setFeedback({ message: 'GLOBAL SYNC COMPLETE. PERFORMANCE DATA ENCRYPTED.', type: 'success', timestamp: new Date().toLocaleTimeString() });
    }, 3000);
  };

  const handleMfaInit = () => {
    setMfaStatus('PENDING');
    setShowMfaBiometric(true);
    setFeedback({ message: 'AWAITING BIOMETRIC CAMERA AUTHENTICATION...', type: 'info', timestamp: new Date().toLocaleTimeString() });
  };

  const handleWipeSession = () => {
    if (confirm(`WARNING: PROCEED WITH EMERGENCY CONSOLE WIPE, ${profile.name.toUpperCase()}?`)) {
      localStorage.removeItem('vault_entered');
      window.location.reload();
    }
  };

  const filteredAssets = TACTICAL_ASSETS.filter(asset => 
    asset.name.toLowerCase().includes(inputValue.toLowerCase()) || 
    asset.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] min-h-screen text-slate-300 font-mono selection:bg-primary selection:text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0a0e17]/90 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors">
          <span className="material-symbols-outlined text-white">grid_view</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.3em]">
            <span className="text-primary animate-pulse">{profile.name.toUpperCase()}</span>
            <span className="text-slate-700">//</span>
            <span>STRATEGY CONSOLE</span>
          </div>
          <h1 className="text-sm font-black uppercase text-white tracking-[0.15em]">Level 3 <span className="text-primary">Vault</span></h1>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="size-10 flex items-center justify-center text-primary"
        >
          <span className="material-symbols-outlined fill-current">security</span>
        </button>
      </header>

      <div className="p-4 space-y-6 pb-32">
        {/* Real-time Status */}
        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full animate-pulse ${mfaStatus === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-primary shadow-[0_0_8px_#135bec]'}`}></span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${mfaStatus === 'ACTIVE' ? 'text-emerald-500' : 'text-primary'}`}>
                  {mfaStatus === 'ACTIVE' ? 'MFA: ENFORCED' : 'MFA: REQUIRED'}
                </span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">OWNER: {profile.name.toUpperCase()}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">AUTH TYPE: OATH-TOTP</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">IP: 192.168.1.SEC</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[8px] font-black text-slate-700 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">U-X-09</span>
              <span className="material-symbols-outlined text-slate-800">fingerprint</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">
              {isProcessing ? 'DECRYPTING DATA PACKETS...' : `SECURE UPTIME: 42:11:09`}
            </span>
          </div>
        </div>

        {/* Command Search */}
        <div className="space-y-2 relative">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Terminal Access</label>
            <span className="text-[9px] text-primary font-bold">{isProcessing ? 'BUSY' : 'READY'}</span>
          </div>
          <div className="flex gap-2">
            <div className={`flex-1 flex items-center bg-black border ${isFocused ? 'border-primary shadow-[0_0_10px_rgba(19,91,236,0.3)]' : 'border-slate-800'} rounded-xl px-4 gap-3 h-14 transition-all`}>
              {isProcessing ? (
                <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-primary text-xl">keyboard_arrow_right</span>
              )}
              <input 
                className="bg-transparent border-none focus:ring-0 text-white text-sm placeholder-slate-700 flex-1 font-mono tracking-wider disabled:opacity-50" 
                placeholder={isProcessing ? "PROCESSING..." : "ENTER TACTICAL COMMAND..."}
                value={inputValue}
                disabled={isProcessing}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && executeCommand(inputValue)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
            </div>
          </div>

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && isFocused && (
            <div className="absolute left-0 right-0 bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl z-50 animate-in slide-in-from-bottom-2">
              {suggestions.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleSuggestionClick(cmd)}
                  className="w-full text-left px-4 py-3 text-[10px] font-black hover:bg-primary hover:text-white border-b border-slate-800 last:border-none transition-colors"
                >
                  {cmd}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
            feedback.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
            feedback.type === 'error' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' :
            'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black tracking-widest uppercase">{feedback.type} // {feedback.timestamp}</span>
              <button onClick={() => setFeedback(null)} className="material-symbols-outlined text-sm">close</button>
            </div>
            <p className="text-xs font-bold leading-relaxed">{feedback.message}</p>
          </div>
        )}

        {/* Tactical Assets */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Master Performance Assets</h3>
            <span className="text-[10px] text-slate-600">{filteredAssets.length} ITEMS LOADED</span>
          </div>
          
          {filteredAssets.length > 0 ? filteredAssets.map((asset, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-800 bg-card-dark hover:border-primary/40 transition-all cursor-pointer group active:scale-[0.98]"
              onClick={() => setFeedback({ message: `DECRYPTING ${asset.name}. ACCESS LOGGED.`, type: 'info', timestamp: new Date().toLocaleTimeString() })}
            >
              <div className={`size-12 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-800 group-hover:border-primary/50 transition-colors ${asset.color}`}>
                <span className="material-symbols-outlined">{asset.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white tracking-widest group-hover:text-primary transition-colors">{asset.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-current ${asset.color} ${asset.bg}`}>
                    {asset.label}
                  </span>
                  <span className="text-[9px] text-slate-500 font-bold">{asset.info}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-800 text-[18px] group-hover:text-primary transition-colors">verified_user</span>
            </div>
          )) : (
            <div className="py-10 text-center border border-dashed border-slate-800 rounded-xl">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No assets matching query</p>
            </div>
          )}
        </div>

        {/* Global Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleGlobalSync}
            disabled={isSyncing}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-primary/50 text-white transition-all active:scale-95 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-primary ${isSyncing ? 'animate-spin' : ''}`}>sync_lock</span>
            <span className="text-[10px] font-black uppercase tracking-widest">{isSyncing ? 'Syncing...' : 'Strategy Sync'}</span>
          </button>
          <button 
            onClick={handleWipeSession}
            className="flex flex-col items-center justify-center gap-2 py-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-white transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-rose-500">lock_reset</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Wipe Access</span>
          </button>
        </div>

        <button 
          onClick={handleMfaInit}
          disabled={mfaStatus === 'ACTIVE' || mfaStatus === 'PENDING'}
          className={`w-full flex items-center justify-center gap-3 py-5 rounded-full transition-all shadow-2xl uppercase text-xs tracking-[0.3em] font-black ${
            mfaStatus === 'ACTIVE' 
              ? 'bg-emerald-500 text-white opacity-80 cursor-default shadow-emerald-500/20'
              : mfaStatus === 'PENDING'
              ? 'bg-primary/50 text-white animate-pulse'
              : 'bg-primary text-white shadow-primary/30 hover:shadow-primary/50 active:scale-[0.98]'
          }`}
        >
          {mfaStatus === 'PENDING' ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>BIO-AUTHENTICATING...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl">{mfaStatus === 'ACTIVE' ? 'verified' : 'fingerprint'}</span>
              <span>{mfaStatus === 'ACTIVE' ? 'MFA ACTIVE' : 'Initialize Multi-Factor'}</span>
            </>
          )}
        </button>
      </div>

      {showMfaBiometric && (
        <BiometricAuth 
          onSuccess={() => {
            setMfaStatus('ACTIVE');
            setShowMfaBiometric(false);
            setFeedback({ 
              message: `BIO-LINK SECURE. MULTI-FACTOR ACTIVE. WELCOME BACK, ${profile.name.toUpperCase()}.`, 
              type: 'success', 
              timestamp: new Date().toLocaleTimeString() 
            });
          }}
          onCancel={() => {
            setShowMfaBiometric(false);
            setMfaStatus('IDLE');
            setFeedback({ 
              message: 'AUTHENTICATION CANCELLED BY OPERATOR.', 
              type: 'error', 
              timestamp: new Date().toLocaleTimeString() 
            });
          }}
          title="Level 3 Bio-Signature Scan"
          subtitle="Scanning face coordinates and irises to authorize Master Admin Level 3 Keys."
        />
      )}
    </div>
  );
};

export default OperatorVault;
