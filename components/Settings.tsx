import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, LogOut, Trash2, UserRound } from 'lucide-react';
import AuditLogs from './AuditLogs';
import { PROFILE_PRESETS, getActiveProfile, setActiveProfile, UserProfile } from '../utils/profileHelper';
import { addAuditLog } from '../utils/auditLogger';

function clearVaultSpaceData(): void {
  const keys: string[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && (key.startsWith('vaultspace_') || key.startsWith('vault_'))) keys.push(key);
  }
  for (const key of keys) localStorage.removeItem(key);
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfileState] = useState<UserProfile>(getActiveProfile);
  const [speakingRate, setSpeakingRate] = useState(() => {
    const stored = Number(localStorage.getItem('vaultspace_speaking_rate'));
    return Number.isFinite(stored) && stored >= 0.5 && stored <= 2 ? stored : 1;
  });

  const handleProfileSelect = (preset: UserProfile) => {
    setActiveProfile(preset);
    setProfileState(preset);
    addAuditLog('Demo profile updated', `Browser-local profile changed to ${preset.name}.`, 'info');
  };

  const updateSpeakingRate = (value: number) => {
    setSpeakingRate(value);
    localStorage.setItem('vaultspace_speaking_rate', String(value));
  };

  const signOut = () => {
    localStorage.removeItem('vault_entered');
    window.location.reload();
  };

  const clearData = () => {
    const confirmed = window.confirm('Delete all VaultSpace demo profiles, alerts, activity history, and local credential IDs from this browser? This cannot be undone.');
    if (!confirmed) return;
    clearVaultSpaceData();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background-dark pb-32 text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#2A2A2A] bg-background-dark/95 p-4 backdrop-blur-md">
        <button onClick={() => navigate('/')} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414] text-white" aria-label="Return home"><ArrowLeft className="size-4" /></button>
        <div className="text-center"><p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Browser prototype</p><h1 className="font-display text-2xl uppercase tracking-wider text-white">Settings</h1></div>
        <button onClick={() => navigate('/')} className="text-[9px] font-black uppercase tracking-wider text-primary">Done</button>
      </header>

      <main className="space-y-6 p-4">
        <section className="border border-primary/30 bg-primary/5 p-4">
          <div className="flex gap-3"><AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" /><div><h2 className="text-xs font-bold text-primary">Demo data is not encrypted.</h2><p className="mt-1 text-[10px] leading-relaxed text-slate-400">Profiles, alerts, preferences, and activity history remain in this browser until you clear them. Do not enter sensitive information.</p></div></div>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Demo Profile</h2>
          <div className="border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="flex items-center gap-4 border-b border-[#2A2A2A] pb-4">
              <span className="grid size-12 place-items-center border border-primary/30 bg-primary/10 text-primary"><UserRound className="size-5" /></span>
              <div><p className="font-display text-2xl uppercase tracking-wide text-white">{profile.name}</p><p className="font-mono text-[8px] uppercase tracking-wider text-slate-500">{profile.role} · {profile.alias}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {PROFILE_PRESETS.map((preset) => (
                <button key={preset.name} type="button" onClick={() => handleProfileSelect(preset)} className={`min-h-16 border p-2 text-center ${profile.name === preset.name ? 'border-primary bg-primary/10 text-primary' : 'border-[#2A2A2A] bg-black/20 text-slate-500 hover:border-slate-600'}`}>
                  <span className="block text-[9px] font-black uppercase">{preset.name.split(' ')[0]}</span><span className="mt-1 block truncate font-mono text-[7px]">{preset.alias}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Voice Playback Preference</h2>
          <div className="border border-[#2A2A2A] bg-[#141414] p-5">
            <div className="mb-3 flex justify-between"><label htmlFor="speaking-rate" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rate</label><output className="font-mono text-xs font-bold text-primary">{speakingRate.toFixed(1)}×</output></div>
            <input id="speaking-rate" type="range" min="0.5" max="2" step="0.1" value={speakingRate} onChange={(event) => updateSpeakingRate(Number(event.target.value))} className="h-1.5 w-full cursor-pointer appearance-none bg-slate-800 accent-primary" />
            <p className="mt-3 text-[9px] leading-relaxed text-slate-600">Saved locally. The current prototype does not connect a production voice service.</p>
          </div>
        </section>

        <AuditLogs />

        <section className="space-y-3">
          <h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-red-400">Local Data Controls</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={signOut} className="flex min-h-20 items-center gap-3 border border-[#2A2A2A] bg-[#141414] p-4 text-left hover:border-primary"><LogOut className="size-5 shrink-0 text-primary" /><span><strong className="block text-[10px] uppercase tracking-wider text-white">End demo session</strong><small className="mt-1 block text-[9px] text-slate-600">Keeps local demo data.</small></span></button>
            <button type="button" onClick={clearData} className="flex min-h-20 items-center gap-3 border border-red-500/30 bg-red-500/5 p-4 text-left hover:border-red-500"><Trash2 className="size-5 shrink-0 text-red-400" /><span><strong className="block text-[10px] uppercase tracking-wider text-red-300">Clear all demo data</strong><small className="mt-1 block text-[9px] text-slate-600">Permanent in this browser.</small></span></button>
          </div>
        </section>

        <p className="pb-4 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-slate-700">VaultSpace browser-local deployment prototype</p>
      </main>
    </div>
  );
};

export default Settings;
