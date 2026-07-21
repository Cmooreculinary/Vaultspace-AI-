import React, { useEffect, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { AuditLog, getAuditLogs } from '../utils/auditLogger';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(getAuditLogs);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const load = () => setLogs(getAuditLogs());
    window.addEventListener('audit_logs_updated', load);
    return () => window.removeEventListener('audit_logs_updated', load);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return logs;
    return logs.filter((log) => `${log.event} ${log.details} ${log.operator}`.toLowerCase().includes(needle));
  }, [logs, query]);

  const clearLogs = () => {
    if (!window.confirm('Clear the browser-local activity history?')) return;
    localStorage.removeItem('vault_audit_logs');
    setLogs(getAuditLogs());
  };

  return (
    <section className="border border-[#2A2A2A] bg-card-dark p-5" aria-labelledby="activity-log-heading">
      <div className="flex items-start justify-between gap-4 border-b border-[#2A2A2A] pb-4">
        <div>
          <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Browser only</p>
          <h2 id="activity-log-heading" className="mt-1 text-sm font-black uppercase text-white">Local activity history</h2>
          <p className="mt-1 text-[9px] text-slate-500">For demo feedback only. This is not a security or compliance audit trail.</p>
        </div>
        <button type="button" onClick={clearLogs} className="grid size-9 shrink-0 place-items-center border border-[#2A2A2A] text-slate-500 hover:border-red-500 hover:text-red-400" aria-label="Clear local activity history">
          <Trash2 className="size-3.5" />
        </button>
      </div>

      <label className="mt-4 flex h-11 items-center gap-3 border border-[#2A2A2A] bg-black/30 px-3">
        <Search className="size-3.5 text-slate-600" />
        <span className="sr-only">Filter local activity</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter local activity…" className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-[10px] text-white placeholder:text-slate-700 focus:ring-0" />
      </label>

      <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <p className="border border-dashed border-[#2A2A2A] p-6 text-center text-[10px] text-slate-600">No matching activity.</p>
        ) : filtered.map((log) => (
          <article key={log.id} className="border border-[#2A2A2A] bg-black/20 p-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[10px] font-bold text-slate-200">{log.event}</h3>
              <time className="shrink-0 font-mono text-[8px] text-slate-700" dateTime={log.timestamp}>{new Date(log.timestamp).toLocaleString()}</time>
            </div>
            <p className="mt-2 text-[9px] leading-relaxed text-slate-500">{log.details}</p>
            <p className="mt-2 font-mono text-[8px] uppercase tracking-wider text-slate-700">{log.operator} · {log.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AuditLogs;
