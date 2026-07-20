import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuditLogs from './AuditLogs';
import { PROFILE_PRESETS, getActiveProfile, setActiveProfile, UserProfile } from '../utils/profileHelper';
import { addAuditLog } from '../utils/auditLogger';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfileState] = useState<UserProfile>(getActiveProfile());
  const [speakingRate, setSpeakingRate] = useState(1.4);

  // Emergency state
  const [lockdownStage, setLockdownStage] = useState<'IDLE' | 'COUNTDOWN' | 'WIPING' | 'DONE'>('IDLE');
  const [countdown, setCountdown] = useState(3);
  const [wipeLogs, setWipeLogs] = useState<string[]>([]);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  const handleProfileSelect = (preset: UserProfile) => {
    setActiveProfile(preset);
    setProfileState(preset);
    addAuditLog('Profile Updated', `Switched active profile to ${preset.name} (${preset.alias})`, 'success');
  };

  const handleAbort = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setLockdownStage('IDLE');
    setCountdown(3);
    setWipeLogs([]);
  };

  const executeInstantWipe = () => {
    localStorage.clear();
    setLockdownStage('DONE');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleEmergencyLockdown = () => {
    if (lockdownStage !== 'IDLE') return;
    
    setLockdownStage('COUNTDOWN');
    setCountdown(3);
    setWipeLogs(['Initiating tactical lock down sequence...']);

    let timeLeft = 3;
    countdownTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      if (timeLeft === 0) {
        if (countdownTimerRef.current) {
          clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
        }
        startWipingSequence();
      }
    }, 1000);
  };

  const startWipingSequence = () => {
    setLockdownStage('WIPING');
    const logs = [
      'Revoking active session tokens...',
      'Shredding on-device encryption keys...',
      'Clearing encrypted offline databases...',
      'Flushing volatile memory keyrings...',
      'Purging local identity records...',
      '✓ Storage wiped. Vault is sealed.'
    ];

    let currentLogIdx = 0;
    const logInterval = setInterval(() => {
      if (currentLogIdx < logs.length) {
        setWipeLogs(prev => [...prev, logs[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(logInterval);
        localStorage.clear();
        setTimeout(() => {
          setLockdownStage('DONE');
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }, 500);
      }
    }, 250);
  };

  const handleSignOut = () => {
    localStorage.removeItem('vault_entered');
    window.location.reload();
  };

  return (
    <div className="flex flex-col h-full bg-background-dark min-h-screen text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-dark/95 backdrop-blur-md border-b border-slate-800">
        <button onClick={() => navigate('/')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-lg font-bold text-white uppercase tracking-tight">Security Ops Settings</h2>
        <button onClick={() => navigate('/')} className="text-primary font-bold">Done</button>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32 text-left">
        
        {/* Toggle Profile choices */}
        <section className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Identity Profiles Toggle</h3>
          <div className="bg-card-dark rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
                <span className="material-symbols-outlined text-4xl">
                  {profile.themeColor === 'emerald' ? 'shield_person' : profile.themeColor === 'blue' ? 'admin_panel_settings' : 'supervisor_account'}
                </span>
              </div>
              <div>
                <p className="font-black text-lg text-white">{profile.name}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{profile.role} • {profile.alias}</p>
              </div>
            </div>

            {/* Presets Choices list */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
              {PROFILE_PRESETS.map((preset) => {
                const isActive = profile.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    onClick={() => handleProfileSelect(preset)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                      isActive 
                        ? 'bg-primary/20 border-primary text-white font-black' 
                        : 'bg-black/30 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest">{preset.name.split(' ')[0]}</span>
                    <span className="text-[7px] text-slate-500 uppercase tracking-tighter block">{preset.alias}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-start gap-3">
              <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
              <p className="text-[10px] text-slate-500 leading-tight font-medium">Bio-metrics linked to active secure hub. Encryption signature matched with {profile.alias} hardware token.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">AI Assistant: Maestro</h3>
          <div className="bg-card-dark rounded-2xl border border-slate-800 divide-y divide-slate-800 shadow-lg">
            <div className="p-4 space-y-3">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assistant Persona</p>
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button className="px-5 h-9 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Professional Executive</button>
                <button className="px-5 h-9 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Performance Coach</button>
                <button className="px-5 h-9 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Tactical Sync</button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Processing Speed</span>
                <span className="text-primary font-black text-sm">{speakingRate}x</span>
              </div>
              <input
                type="range" min="0.5" max="2.5" step="0.1" value={speakingRate}
                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none accent-primary cursor-pointer"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Access Control Group</h3>
          <div className="bg-card-dark rounded-2xl border border-slate-800 p-5 shadow-lg">
             <div className="flex items-center justify-between mb-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500">{profile.name.split(' ')[0]}'s Trust Ring:</p>
                <span className="text-[9px] font-black text-slate-700">4 DELEGATE NODES</span>
             </div>
             <div className="space-y-4">
                {[
                  { name: 'Backup Hub Delta', role: 'Full Shared Sync', icon: 'favorite' },
                  { name: 'Offline Storage Node', role: 'Archival Only', icon: 'database' },
                  { name: 'FIDO2 Hardware Token', role: 'Hardware Enclave', icon: 'key' },
                  { name: 'Maestro Core AI', role: 'Zero Knowledge Delegate', icon: 'smart_toy' },
                ].map(member => (
                  <div key={member.name} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-700 text-[18px] group-hover:text-primary transition-colors">{member.icon}</span>
                      <span className="text-sm font-bold text-slate-300">{member.name}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-600 border border-slate-800 px-3 py-1 rounded-lg uppercase tracking-widest">{member.role}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Real-time Audit Logs Console */}
        <section className="space-y-3">
          <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest ml-1">Cryptographic Operations log</h3>
          <AuditLogs />
        </section>

        <section className="space-y-3">
          <h3 className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">Emergency Protocols</h3>
          <div className="bg-card-dark rounded-2xl border border-red-950/40 p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 rounded-full bg-red-500/5 blur-xl pointer-events-none"></div>
            
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-2xl mt-0.5 animate-pulse">warning</span>
              <div>
                <h4 className="text-xs font-black uppercase text-red-400 tracking-wider">Tactical Quick Wipe</h4>
                <p className="text-[10px] text-slate-500 leading-tight font-medium mt-1">
                  Instantly purge all local tokens, decrypted caches, and credentials. This initiates a zero-knowledge hardware lockdown.
                </p>
              </div>
            </div>

            {lockdownStage === 'IDLE' && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleEmergencyLockdown}
                  className="h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/20"
                >
                  <span className="material-symbols-outlined text-sm">emergency_home</span>
                  Lockdown (3s)
                </button>

                <button
                  onClick={executeInstantWipe}
                  className="h-12 rounded-xl bg-slate-900 border border-slate-800 text-red-500 hover:bg-slate-850 text-[10px] font-black uppercase tracking-widest transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">backspace</span>
                  Quick Wipe
                </button>
              </div>
            )}

            {lockdownStage === 'COUNTDOWN' && (
              <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl flex flex-col items-center gap-3 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-xs font-black text-red-400 uppercase tracking-widest">CRITICAL SECURE WIPING PENDING</span>
                </div>
                <div className="text-4xl font-black text-white font-mono">{countdown}</div>
                <button
                  onClick={handleAbort}
                  className="w-full h-11 rounded-lg bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  ABORT SYSTEM PURGE
                </button>
              </div>
            )}

            {(lockdownStage === 'WIPING' || lockdownStage === 'DONE') && (
              <div className="p-4 bg-black/60 border border-slate-800 rounded-xl space-y-3 font-mono text-[9px]">
                <div className="flex items-center justify-between text-red-500 border-b border-slate-800/60 pb-1.5">
                  <span className="uppercase font-black flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                    Wiping volatile memory...
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-400">
                  {wipeLogs.map((log, idx) => (
                    <p key={idx} className={log.startsWith('✓') ? 'text-emerald-400 font-bold' : ''}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="pt-2">
          <button 
            onClick={handleSignOut}
            className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black uppercase tracking-widest text-xs border border-red-500/20 active:scale-[0.98] transition-all hover:bg-red-500/20 shadow-2xl shadow-red-500/10"
          >
            Revoke {profile.name.split(' ')[0]} Identity Token
          </button>
          <div className="mt-8 flex flex-col items-center gap-1 opacity-40">
            <p className="text-center text-[10px] text-slate-600 font-black tracking-[0.3em] uppercase">VaultSpace Systems v2.5</p>
            <p className="text-[8px] text-slate-700 font-bold uppercase tracking-widest">Build Hash: 0xBAADF00D</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
