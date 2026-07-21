import React, { useState, useEffect } from 'react';
import WebAuthnAuth from './WebAuthnAuth';
import { PROFILE_PRESETS, DEFAULT_PROFILE, getActiveProfile, setActiveProfile, completeOnboarding, UserProfile } from '../utils/profileHelper';
import { ArrowRight, ShieldAlert } from 'lucide-react';
import { addAuditLog } from '../utils/auditLogger';

interface LandingProps {
  onEnter: () => void;
}

const Landing: React.FC<LandingProps> = ({ onEnter }) => {
  const [showBiometric, setShowBiometric] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<UserProfile>(PROFILE_PRESETS[0]);
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isLockedDown, setIsLockedDown] = useState(() => {
    return localStorage.getItem('vault_locked_down') === 'true';
  });

  useEffect(() => {
    // Sync current profile to selectedPreset
    const current = getActiveProfile();
    const found = PROFILE_PRESETS.find(p => p.name === current.name);
    if (found) {
      setSelectedPreset(found);
      setUseCustom(false);
    } else if (current.name !== DEFAULT_PROFILE.name) {
      setCustomName(current.name);
      setCustomRole(current.role);
      setCustomAlias(current.alias);
      setUseCustom(true);
    }
  }, []);

  const handleSecuritySpecs = () => {
    alert("VaultSpace deployment demo:\n- Data remains in this browser's local storage\n- Passkey screens demonstrate the intended workflow\n- No production encryption, identity service, or cloud synchronization is connected\n\nDo not store sensitive information in this demo.");
  };

  const handleSkipAndUse = () => {
    setActiveProfile(DEFAULT_PROFILE);
    completeOnboarding();
    addAuditLog('Demo profile skipped', 'Default browser-local demo profile selected.', 'info');
    onEnter();
  };

  const handleSaveProfileAndUnlock = () => {
    if (useCustom) {
      const customProfile = {
        name: customName.trim() || 'Custom Operator',
        role: customRole.trim() || 'Tactical Specialist',
        alias: customAlias.trim() || 'OPERATOR_C',
        themeColor: 'orange' as const
      };
      setActiveProfile(customProfile);
      addAuditLog('Demo profile configured', `Local demo profile created for ${customProfile.name}.`, 'info');
    } else {
      setActiveProfile(selectedPreset);
      addAuditLog('Demo profile selected', `Local demo profile selected: ${selectedPreset.name}.`, 'info');
    }
    completeOnboarding();
    setShowBiometric(true);
  };

  if (showBiometric) {
    return (
      <WebAuthnAuth 
        onSuccess={onEnter} 
        onCancel={() => setShowBiometric(false)}
        actionType="authenticate"
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-[#0D0D0D] flex flex-col justify-between p-6 md:p-10 text-center animate-in fade-in duration-700 overflow-y-auto">
      
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-primary" />
          <span className="text-[9px] font-black uppercase text-primary tracking-[0.2em] font-mono">Demo mode - browser-local data only</span>
        </div>
        <button 
          onClick={handleSkipAndUse}
          className="px-4 h-9 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95"
        >
          Skip All & Use <ArrowRight className="size-3" />
        </button>
      </div>

      {/* Main Hub Container */}
      <div className="max-w-md mx-auto w-full flex flex-col items-center justify-center my-auto space-y-8 py-6">
        
        {/* Lock Animation Button */}
        <div className="group relative">
          <div className="absolute -inset-1 rounded-full bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all duration-500"></div>
          <button 
            onClick={() => setShowOnboarding(true)}
            className="relative size-20 rounded-full bg-slate-950 border border-slate-800 hover:border-primary/50 flex items-center justify-center transition-all cursor-pointer group shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            aria-label="Configure and enter the VaultSpace demo"
          >
            <span className="material-symbols-outlined text-primary text-4xl font-light group-hover:scale-110 transition-transform">
              folder_open
            </span>
          </button>
        </div>

        {/* Brand */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none uppercase">
            VaultSpace
          </h1>
          <p className="text-primary text-xs font-black tracking-[0.3em] uppercase">
            Deployment Prototype
          </p>
          <p className="mx-auto max-w-sm text-[10px] font-semibold leading-relaxed text-slate-400">
            Do not store sensitive information. Production encryption, identity, and cloud synchronization are not connected.
          </p>
          {isLockedDown && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 bg-red-950/40 border border-red-500/20 rounded-full text-[9px] font-mono font-bold text-red-400 uppercase tracking-wider animate-pulse">
              <span className="size-1.5 rounded-full bg-red-500 animate-ping"></span>
              Emergency SOS Active Lockdown
            </div>
          )}
        </div>

        {/* Onboarding Profile Selection Menu */}
        {showOnboarding ? (
          <div className="w-full bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-5 animate-in slide-in-from-bottom-6 duration-300">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-primary uppercase tracking-widest">Configure Demo Profile</h3>
              <p className="text-[9px] text-slate-400">Choose a sample profile or create a browser-local display profile.</p>
            </div>

            {/* Selector Toggles */}
            <div className="grid grid-cols-3 gap-2">
              {PROFILE_PRESETS.map((preset) => {
                const isSelected = !useCustom && selectedPreset.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedPreset(preset);
                      setUseCustom(false);
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between h-20 relative active:scale-95 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary text-white'
                        : 'bg-black/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {preset.themeColor === 'orange' ? 'person' : preset.themeColor === 'steel' ? 'work' : 'folder_shared'}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-tight block truncate w-full">{preset.name.split(' ')[0]}</span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 size-2 rounded-full bg-primary"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Toggle custom view */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className={`text-[9px] font-black uppercase tracking-wider transition-colors ${useCustom ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {useCustom ? '← Use Presets' : 'Custom Profile Setup'}
              </button>
            </div>

            {/* Custom Input Form */}
            {useCustom ? (
              <div className="space-y-3 pt-2 text-left animate-in fade-in duration-200">
                <div className="space-y-1">
                  <label className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Profile Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full h-10 bg-black/60 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-600 font-semibold focus:border-primary focus:ring-0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Role / Specialty</label>
                    <input
                      type="text"
                      placeholder="e.g. Security Chief"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="w-full h-10 bg-black/60 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-600 focus:border-primary focus:ring-0"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Display Alias</label>
                    <input
                      type="text"
                      placeholder="e.g. AGENT_007"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      className="w-full h-10 bg-black/60 border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-600 focus:border-primary focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black/35 border border-slate-850 p-4 rounded-2xl text-left font-mono text-[9px] text-slate-400 space-y-1.5 animate-in fade-in duration-200">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">Preset Title</span>
                  <span className="text-primary font-black uppercase">{selectedPreset.alias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">Assigned Persona</span>
                  <span className="text-white font-bold">{selectedPreset.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase">Profile Role</span>
                  <span className="text-slate-300">{selectedPreset.role}</span>
                </div>
              </div>
            )}

            {/* Proceed Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleSaveProfileAndUnlock}
                className="flex-1 h-12 bg-primary hover:bg-orange-500 rounded-xl text-black font-black uppercase tracking-wider text-[10px] transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Save & Try Device Prompt
              </button>
              <button
                onClick={() => setShowOnboarding(false)}
                className="px-4 h-12 bg-slate-800 rounded-xl text-[10px] text-slate-400 hover:text-white"
              >
                Back
              </button>
            </div>

          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xs mx-auto px-4 font-semibold">
              A browser-local concept for organizing work, family records, reminders, and operator workflows.
            </p>

            <div className="flex flex-col gap-2.5 w-full max-w-xs mx-auto">
              <button
                onClick={() => setShowOnboarding(true)}
                className="h-14 bg-primary hover:bg-orange-500 text-black font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95 shadow-2xl shadow-primary/25 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">fingerprint</span>
                Enter VaultSpace Demo
              </button>

              <button
                onClick={handleSkipAndUse}
                className="h-12 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-750 text-slate-400 hover:text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                Quick Skip & Enter
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Specs */}
      <div className="w-full flex flex-col items-center gap-2">
        <button 
          onClick={handleSecuritySpecs}
          className="text-slate-600 hover:text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] transition-colors"
        >
          View Demo Limitations
        </button>
        <span className="text-[7px] text-slate-700 uppercase tracking-widest font-mono font-bold">
          VaultSpace prototype • No production security connected
        </span>
      </div>

    </div>
  );
};

export default Landing;
