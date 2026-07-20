import React, { useState, useEffect } from 'react';
import { getAuditLogs, AuditLog, addAuditLog } from '../utils/auditLogger';
import { Shield, Search, Terminal, Trash2, Calendar, HardDrive, RefreshCw } from 'lucide-react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'success' | 'warning' | 'error' | 'info'>('all');

  const loadLogs = () => {
    setLogs(getAuditLogs());
  };

  useEffect(() => {
    loadLogs();
    
    // Listen for live update events
    window.addEventListener('audit_logs_updated', loadLogs);
    return () => {
      window.removeEventListener('audit_logs_updated', loadLogs);
    };
  }, []);

  const handleClear = () => {
    if (confirm("CONFIRM COMMAND: Clear volatile cryptographic access log keyring? This cannot be undone.")) {
      localStorage.removeItem('vault_audit_logs');
      addAuditLog(
        'Logs Purged', 
        'Administrative session cleared access logs database cache.', 
        'warning'
      );
      loadLogs();
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.event.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.operator.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || log.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div id="recharts-audit-logs-console" className="rounded-[32px] bg-card-dark p-6 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-700">
      <div className="absolute -right-16 -bottom-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

      {/* Top Title/Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Terminal className="size-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Access Audit Feed</h3>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-0.5">FIPS compliant ledger</p>
          </div>
        </div>

        <button 
          onClick={handleClear}
          className="p-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-slate-500 hover:text-red-400"
          title="Flush Logs Cache"
        >
          <Trash2 className="size-4" />
        </button>
      </div>

      {/* Filters & Search Input Row */}
      <div className="space-y-3 mb-4">
        {/* Search Bar */}
        <div className="flex items-center bg-slate-900 border border-slate-850 rounded-xl px-3 h-10 gap-2.5">
          <Search className="size-3.5 text-slate-500 shrink-0" />
          <input 
            type="text" 
            placeholder="FILTER SECURITY AUDITS..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-white font-mono text-[9px] placeholder-slate-750 flex-1 tracking-wider uppercase"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
          {(['all', 'success', 'warning', 'error', 'info'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                filter === lvl 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Logs Streams */}
      <div className="space-y-2.5 max-h-72 overflow-y-auto hide-scrollbar border border-slate-850/50 rounded-2xl p-3 bg-black/30">
        {filteredLogs.length > 0 ? (
          filteredLogs.map((log) => (
            <div 
              key={log.id} 
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-850 bg-slate-900/40 hover:border-slate-800 transition-colors"
            >
              {/* Event Badge Dot */}
              <span className={`size-2 rounded-full shrink-0 mt-1.5 ${
                log.status === 'success' ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' :
                log.status === 'warning' ? 'bg-amber-500 shadow-[0_0_6px_#f59e0b]' :
                log.status === 'error' ? 'bg-rose-500 shadow-[0_0_6px_#ef4444]' :
                'bg-blue-400'
              }`}></span>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h5 className="text-[10px] font-black text-white uppercase tracking-wide truncate">{log.event}</h5>
                  <span className="text-[8px] font-mono text-slate-500 font-bold shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                
                <p className="text-[9px] font-medium text-slate-400 leading-relaxed text-left">
                  {log.details}
                </p>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-850/30 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  <span className="truncate">Op: {log.operator}</span>
                  <span>•</span>
                  <span>Enclave: Secured</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center border border-dashed border-slate-850 rounded-xl">
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">No matching logs found</p>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex items-center justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-1">
        <span>Protected Nodes: AES-256</span>
        <span>Total Records: {logs.length}</span>
      </div>
    </div>
  );
};

export default AuditLogs;
