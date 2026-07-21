import React, { useState } from 'react';
import { CloudOff, Info, ServerOff } from 'lucide-react';

const CloudSyncIndicator: React.FC = () => {
  const [showRequirements, setShowRequirements] = useState(false);

  return (
    <section className="border border-[#2A2A2A] bg-card-dark p-6" aria-labelledby="cloud-status-heading">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center border border-slate-700 bg-[#1E1E1E] text-slate-500">
            <CloudOff className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Cloud status</p>
            <h2 id="cloud-status-heading" className="mt-1 text-sm font-black uppercase text-white">Not connected</h2>
          </div>
        </div>
        <span className="border border-slate-700 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-slate-500">Offline demo</span>
      </div>

      <div className="my-5 grid grid-cols-3 gap-px border border-[#2A2A2A] bg-[#2A2A2A] text-center font-mono text-[8px] uppercase tracking-wider">
        <div className="bg-[#141414] p-3"><span className="block text-slate-600">Account</span><strong className="mt-1 block text-slate-400">None</strong></div>
        <div className="bg-[#141414] p-3"><span className="block text-slate-600">Uploads</span><strong className="mt-1 block text-slate-400">Disabled</strong></div>
        <div className="bg-[#141414] p-3"><span className="block text-slate-600">Backups</span><strong className="mt-1 block text-slate-400">None</strong></div>
      </div>

      <button type="button" onClick={() => setShowRequirements((value) => !value)} className="flex h-11 w-full items-center justify-center gap-2 border border-[#2A2A2A] bg-[#1E1E1E] text-[9px] font-black uppercase tracking-[0.16em] text-slate-300 hover:border-primary hover:text-primary">
        <Info className="size-3.5" /> {showRequirements ? 'Hide requirements' : 'Production requirements'}
      </button>

      {showRequirements && (
        <div className="mt-4 border border-[#2A2A2A] bg-black/30 p-4">
          <div className="flex gap-3">
            <ServerOff className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-[10px] leading-relaxed text-slate-400">Cloud synchronization requires an approved backend, authenticated accounts, authorization rules, encrypted transport, durable storage, key management, recovery controls, monitoring, and a security review.</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default CloudSyncIndicator;
