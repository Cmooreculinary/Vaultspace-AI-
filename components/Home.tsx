import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EncryptionIndicator from './EncryptionIndicator';
import DocumentStats from './DocumentStats';
import CloudSyncIndicator from './CloudSyncIndicator';
import AuditLogs from './AuditLogs';
import { getActiveProfile, UserProfile } from '../utils/profileHelper';

// High-quality generated minimal flat-style category icons
import familyIcon from '../src/assets/images/vault_category_family_1784563703555.jpg';
import adultIcon from '../src/assets/images/vault_category_adult_1784563715723.jpg';
import operatorIcon from '../src/assets/images/vault_category_operator_1784563727640.jpg';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(getActiveProfile());
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingestionResult, setIngestionResult] = useState<string | null>(null);

  useEffect(() => {
    // Listen for profile updates
    const handleProfileUpdate = () => {
      setProfile(getActiveProfile());
    };
    window.addEventListener('vaultspace_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('vaultspace_profile_updated', handleProfileUpdate);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('family') || query.includes('archive') || query.includes('home')) navigate('/vault/family');
    else if (query.includes('adult') || query.includes('consulting') || query.includes('work')) navigate('/vault/adult');
    else if (query.includes('operator') || query.includes('tactical') || query.includes('terminal')) navigate('/vault/operator');
    else navigate('/alert');
  };

  const runTestIngestion = () => {
    setIsProcessing(true);
    setIngestionResult(null);

    window.setTimeout(() => {
      setIngestionResult(
        `Local demo complete for ${profile.name}. Suggested tasks: review the sample work request and file the sample family attachment. No network request was sent.`
      );
      setIsProcessing(false);
    }, 450);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6 animate-in fade-in duration-500 bg-background-dark min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between pt-6 pb-2 sticky top-0 bg-background-dark/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-12 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-lg overflow-hidden">
            <span className="material-symbols-outlined text-3xl">psychology</span>
          </div>
          <div className="text-left">
            <h2 className="font-display text-2xl uppercase tracking-wide text-white">{profile.name}</h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">DEMO PROFILE: {profile.alias}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/alert')}
          className="size-11 flex items-center justify-center bg-card-dark border border-slate-800 rounded-2xl text-white relative hover:bg-slate-800 transition-all active:scale-90"
        >
          <span className="sr-only">Open alerts</span>
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full ring-2 ring-background-dark animate-pulse"></span>
        </button>
      </header>

      {/* Intelligent Command Bar */}
      <form onSubmit={handleSearch} className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center text-slate-500 group-focus-within:text-primary transition-colors">
          <span className="material-symbols-outlined">smart_toy</span>
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-14 bg-card-dark border border-slate-800 rounded-2xl pl-12 pr-12 text-white placeholder-slate-500 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-xl font-medium text-sm"
          placeholder="Go to family, work, operator, or alerts…"
          aria-label="Navigate VaultSpace demo"
        />
        <button type="submit" className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </form>

      <div className="space-y-1 px-1 text-left">
        <h1 className="font-display text-4xl uppercase tracking-wide text-white leading-tight">VaultSpace Workbench</h1>
        <p className="text-xs font-semibold text-slate-400 leading-snug">
          {profile.role} • Browser-local product prototype. Do not enter sensitive data.
        </p>
      </div>

      {/* Real-time Cloud Synchronization status indicator */}
      <CloudSyncIndicator />

      {/* Encryption Indicator */}
      <EncryptionIndicator />

      {/* Storage and Document Analytics */}
      <DocumentStats />

      {/* Vault Tier System */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Demo Workspaces</h3>
          <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-widest">{profile.alias} LOCAL</span>
        </div>

        {/* Tier 1: Family */}
        <article
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-primary/50 hover:bg-slate-800/50 transition-all shadow-xl flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={familyIcon} 
              alt="Family Archive" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Demo Workspace 01</span>
              </div>
              <h4 className="text-xl font-black text-white">Family Archive</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Explore sample household folders and record-organizing interactions. No documents are uploaded or protected.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <span className="font-mono text-[8px] uppercase tracking-widest text-slate-600">Sample records only</span>
              <button onClick={() => navigate('/vault/family')} className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-primary group-hover:border-primary transition-all">
                Explore <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </article>

        {/* Tier 2: Adult / Professional */}
        <article
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-primary/50 hover:bg-slate-800/50 transition-all shadow-xl flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={adultIcon} 
              alt="Professional Vault" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Demo Workspace 02</span>
              </div>
              <h4 className="text-xl font-black text-white">Consulting & Keynotes</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Explore sample schedules, notes, draft records, and work-file interactions.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">Sample Data</span>
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">Local Only</span>
              </div>
              <button onClick={() => navigate('/vault/adult')} className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-primary group-hover:border-primary transition-all">
                Explore <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </article>

        {/* Tier 3: Operator Vault */}
        <article
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-primary/50 hover:bg-slate-800/50 transition-all shadow-xl flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={operatorIcon} 
              alt="Operator Terminal" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0D0D0D] via-[#0D0D0D]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Demo Workspace 03</span>
              </div>
              <h4 className="text-xl font-black text-white">Operator Console</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Explore concept controls, a WebAuthn browser prompt lab, and non-operational command simulations.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">NO BACKEND</span>
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">DEVICE DEMO</span>
              </div>
              <button onClick={() => navigate('/vault/operator')} className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-primary group-hover:border-primary transition-all">
                Explore <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </article>

      </div>

      {/* Access Audit Feed */}
      <AuditLogs />

      {/* Workflow - Ingestion Test Section */}
      <div className="mt-6 pt-10 border-t border-slate-800 space-y-6 pb-20">
        <div className="flex items-center justify-between px-1 text-left">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">Local Sorting Demonstration</h3>
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">No AI Connected</span>
        </div>
        <div className="rounded-2xl bg-card-dark p-8 border border-slate-800 relative overflow-hidden shadow-2xl group hover:border-primary/30 transition-colors">
          <div className="flex flex-col gap-6 relative z-10 text-left">
            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Simulation: Test Data Flow</span>
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
              </div>
              <p className="text-sm font-medium text-slate-400 leading-relaxed text-left mb-6">
                Run a fixed, browser-only sorting example. It sends no email, file, prompt, or other data across the network.
              </p>
              
              <button 
                onClick={runTestIngestion}
                disabled={isProcessing}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                  isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-primary text-black hover:bg-orange-500 shadow-xl shadow-primary/20 active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-lg">electric_bolt</span>
                )}
                {isProcessing ? "Running Local Rules..." : "Run Local Example"}
              </button>
            </div>

            {ingestionResult && (
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Local Example Result</span>
                </div>
                <p className="text-xs text-slate-300 italic leading-relaxed">{ingestionResult}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate('/vault/family')} className="flex-1 h-9 rounded-xl bg-slate-800 text-[9px] font-black uppercase tracking-widest hover:bg-slate-700">View Family</button>
                  <button onClick={() => navigate('/vault/adult')} className="flex-1 h-9 rounded-xl bg-slate-800 text-[9px] font-black uppercase tracking-widest hover:bg-slate-700">View Work</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
