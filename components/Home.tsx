import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
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

  const runTestIngestion = async () => {
    setIsProcessing(true);
    setIngestionResult(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const testEmail = `
        From: principal-director@secure-consulting-node.com
        Subject: Urgent: Performance Assessment - ${profile.name} & Analytics Report
        Hi ${profile.name.split(' ')[0]}, 
        We have the latest system diagnostic data for the high-performance team squad. Can you analyze 
        the organizational dynamics and provide your specialized assessment? Also, please file the new 
        clip into the family archive for secure review.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this email for a consulting expert named ${profile.name} (Role: ${profile.role}). 
        Extract key action items and suggest 2 tasks for the VaultSpace app.
        Keep it brief, tactical, and professional.`,
      });

      setIngestionResult(response.text || "Ingestion complete. Items sorted.");
    } catch (error) {
      console.error("AI Processing Error:", error);
      setIngestionResult("Error: Secure connection to Maestro AI failed. Using local backup categorization.");
    } finally {
      setIsProcessing(false);
    }
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
            <h2 className="text-xl font-black tracking-tight uppercase font-sans text-white">{profile.name}</h2>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">VAULT ACCESS: {profile.alias}</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/alert')}
          className="size-11 flex items-center justify-center bg-card-dark border border-slate-800 rounded-2xl text-white relative hover:bg-slate-800 transition-all active:scale-90"
        >
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
          placeholder="Ask Maestro: 'Find family files' or 'Consulting notes'..."
        />
        <button type="submit" className="absolute inset-y-0 right-4 flex items-center text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">mic</span>
        </button>
      </form>

      <div className="space-y-1 px-1 text-left">
        <h1 className="text-2xl font-black tracking-tight text-white leading-tight md:text-3xl">Elite Mindset Vault</h1>
        <p className="text-xs font-semibold text-slate-400 leading-snug">
          {profile.role} • High-Performance Frameworks & Encrypted Personal Ledger.
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
          <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Secure Access Tiers</h3>
          <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase tracking-widest">{profile.alias} VERIFIED</span>
        </div>

        {/* Tier 1: Family */}
        <div
          onClick={() => navigate('/vault/family')}
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 transition-all cursor-pointer shadow-xl active:scale-[0.98] flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={familyIcon} 
              alt="Family Archive" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Tier 1 • Secure</span>
              </div>
              <h4 className="text-xl font-black text-white">Family Archive</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Protected personal folders, private diaries, local sync vaults, and household archives.
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-card-dark bg-slate-800 overflow-hidden shadow-lg" style={{backgroundImage: `url('https://picsum.photos/seed/family-rec-${i}/100/100')`, backgroundSize: 'cover'}}></div>
                ))}
              </div>
              <button className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                Unlock <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Adult / Professional */}
        <div
          onClick={() => navigate('/vault/adult')}
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50 transition-all cursor-pointer shadow-xl active:scale-[0.98] flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={adultIcon} 
              alt="Professional Vault" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">Tier 2 • Professional</span>
              </div>
              <h4 className="text-xl font-black text-white">Consulting & Keynotes</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Speaking engagement schedules, secure client contracts, high-performance coaching logs, and master drafts.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">128 Docs</span>
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">Drafts V5</span>
              </div>
              <button className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-blue-500 group-hover:border-blue-500 transition-all">
                Access <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 3: Operator Vault */}
        <div
          onClick={() => navigate('/vault/operator')}
          className="group relative overflow-hidden rounded-3xl bg-card-dark border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/50 transition-all cursor-pointer shadow-xl active:scale-[0.98] flex flex-col md:flex-row"
        >
          {/* Category Flat Icon Banner */}
          <div className="w-full md:w-40 h-40 md:h-auto relative overflow-hidden shrink-0">
            <img 
              src={operatorIcon} 
              alt="Operator Terminal" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0e17] via-[#0a0e17]/25 to-transparent"></div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between text-left">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Tier 3 • Operator</span>
              </div>
              <h4 className="text-xl font-black text-white">Operator Console</h4>
              <p className="text-xs font-semibold text-slate-400 mt-2 leading-relaxed">
                Cryptographic security control, air-gapped backup ledgers, WebAuthn keys, and terminal diagnostics.
              </p>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">AIR-GAPPED</span>
                <span className="px-3 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest bg-slate-900 text-slate-500 border border-slate-800">FIDO2 SECURE</span>
              </div>
              <button className="h-10 px-5 rounded-xl bg-slate-900 border border-slate-800 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group-hover:bg-amber-500 group-hover:border-amber-500 transition-all">
                Control <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Access Audit Feed */}
      <AuditLogs />

      {/* Workflow - Ingestion Test Section */}
      <div className="mt-6 pt-10 border-t border-slate-800 space-y-6 pb-20">
        <div className="flex items-center justify-between px-1 text-left">
          <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">AI Ingestion Pipeline</h3>
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">Maestro v3.0 Flash</span>
        </div>
        <div className="rounded-[40px] bg-card-dark p-8 border border-slate-800 relative overflow-hidden shadow-2xl group hover:border-primary/30 transition-colors">
          <div className="flex flex-col gap-6 relative z-10 text-left">
            <div className="bg-black/40 rounded-3xl p-6 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Simulation: Test Data Flow</span>
                <span className="material-symbols-outlined text-primary">dynamic_feed</span>
              </div>
              <p className="text-sm font-medium text-slate-400 leading-relaxed text-left mb-6">
                Send consulting requests or family photos to:
                <code className="block bg-slate-800 px-3 py-2 rounded-xl text-primary font-bold mt-3 border border-primary/20 text-xs">secure@vaultspace-consulting.ai</code>
              </p>
              
              <button 
                onClick={runTestIngestion}
                disabled={isProcessing}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${
                  isProcessing ? 'bg-slate-800 text-slate-500' : 'bg-primary text-white hover:bg-blue-600 shadow-xl shadow-primary/20 active:scale-95'
                }`}
              >
                {isProcessing ? (
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-lg">electric_bolt</span>
                )}
                {isProcessing ? "Maestro is Thinking..." : "Trigger Test Ingestion"}
              </button>
            </div>

            {ingestionResult && (
              <div className="p-5 rounded-3xl bg-primary/5 border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">Maestro Summary</span>
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
