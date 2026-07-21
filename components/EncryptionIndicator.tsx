import React, { useEffect, useState } from 'react';
import { AlertTriangle, Database, RefreshCw } from 'lucide-react';
import { getLocalStorageInfo, LocalStorageInfo } from '../utils/alertStorage';

const EncryptionIndicator: React.FC = () => {
  const [info, setInfo] = useState<LocalStorageInfo>(() => getLocalStorageInfo());
  const [checkedAt, setCheckedAt] = useState<Date>(() => new Date());

  const refresh = () => {
    setInfo(getLocalStorageInfo());
    setCheckedAt(new Date());
  };

  useEffect(() => {
    window.addEventListener('alerts_updated', refresh);
    return () => window.removeEventListener('alerts_updated', refresh);
  }, []);

  return (
    <section className="border border-[#2A2A2A] bg-card-dark p-6" aria-labelledby="local-storage-heading">
      <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2A] pb-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
            <Database className="size-5" />
          </span>
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Current implementation</p>
            <h2 id="local-storage-heading" className="mt-1 text-sm font-black uppercase text-white">Browser-local storage</h2>
          </div>
        </div>
        <span className="border border-red-500/30 bg-red-500/10 px-2 py-1 font-mono text-[8px] font-bold uppercase tracking-wider text-red-300">Not encrypted</span>
      </div>

      <div className="my-5 flex gap-3 border border-primary/30 bg-primary/5 p-4">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-[11px] leading-relaxed text-slate-300">This prototype stores demo alerts and preferences in this browser. Anyone with access to the browser profile may be able to read them. Do not enter sensitive information.</p>
      </div>

      <dl className="grid grid-cols-2 gap-px overflow-hidden border border-[#2A2A2A] bg-[#2A2A2A] font-mono text-[9px]">
        <div className="bg-[#141414] p-3"><dt className="uppercase text-slate-600">Storage</dt><dd className="mt-1 font-semibold text-slate-300">{info.storageType}</dd></div>
        <div className="bg-[#141414] p-3"><dt className="uppercase text-slate-600">Protection</dt><dd className="mt-1 font-semibold text-red-300">{info.protection}</dd></div>
        <div className="bg-[#141414] p-3"><dt className="uppercase text-slate-600">Demo alerts</dt><dd className="mt-1 font-semibold text-slate-300">{info.itemCount}</dd></div>
        <div className="bg-[#141414] p-3"><dt className="uppercase text-slate-600">Approx. size</dt><dd className="mt-1 font-semibold text-slate-300">{info.approximateBytes} bytes</dd></div>
      </dl>

      <button type="button" onClick={refresh} className="mt-4 flex h-11 w-full items-center justify-center gap-2 border border-[#2A2A2A] bg-[#1E1E1E] text-[9px] font-black uppercase tracking-[0.16em] text-slate-300 hover:border-primary hover:text-primary">
        <RefreshCw className="size-3.5" /> Refresh local status
      </button>
      <p className="mt-3 text-center font-mono text-[8px] uppercase tracking-wider text-slate-700">Checked {checkedAt.toLocaleTimeString()}</p>
    </section>
  );
};

export default EncryptionIndicator;
