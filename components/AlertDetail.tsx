import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getAlerts, 
  saveAlerts, 
  getLocalStorageInfo,
  LocalStorageInfo,
  AlertItem, 
  createAlert 
} from '../utils/alertStorage';
import { 
  Shield, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle, 
  Trash2, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Database, 
  Plus, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { addAuditLog } from '../utils/auditLogger';

const AlertDetail: React.FC = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string>('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<LocalStorageInfo | null>(null);
  
  // Form state for manual quick alert entry
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrgency, setNewUrgency] = useState<'high' | 'medium' | 'low'>('medium');
  const [newCategory, setNewCategory] = useState('Personal Task');

  const loadAlertData = () => {
    const list = getAlerts();
    setAlerts(list);
    setStorageInfo(getLocalStorageInfo());
    setSelectedAlertId((current) => (
      current && list.some((item) => item.id === current) ? current : list[0]?.id ?? ''
    ));
  };

  useEffect(() => {
    loadAlertData();

    // Listen for updates from voice assistant or other pages
    window.addEventListener('alerts_updated', loadAlertData);
    return () => {
      window.removeEventListener('alerts_updated', loadAlertData);
    };
  }, []);

  const triggerAction = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const handleToggleComplete = (id: string) => {
    const updated = alerts.map(item => {
      if (item.id === id) {
        const nextState = !item.isCompleted;
        addAuditLog(
          nextState ? 'Alert Marked Completed' : 'Alert Restored',
          `Task: "${item.title}" status changed in browser-local storage.`,
          nextState ? 'success' : 'info'
        );
        return { ...item, isCompleted: nextState };
      }
      return item;
    });
    setAlerts(updated);
    saveAlerts(updated);
    triggerAction("LOCAL TASK STATUS UPDATED");
  };

  const handleDeleteAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("CONFIRM COMMAND: Wipe this alert item permanently?")) {
      const target = alerts.find(a => a.id === id);
      const updated = alerts.filter(item => item.id !== id);
      setAlerts(updated);
      saveAlerts(updated);
      
      addAuditLog(
        'Alert Item Deleted',
        `Archived or removed alert: "${target?.title || id}".`,
        'warning'
      );

      if (selectedAlertId === id) {
        setSelectedAlertId(updated[0]?.id || '');
      }
      triggerAction("LOCAL ITEM REMOVED");
    }
  };

  const handleCreateManualAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createAlert(newTitle, newDesc || 'Manually created demo task.', newUrgency, newCategory);
    
    // reset form
    setNewTitle('');
    setNewDesc('');
    setNewUrgency('medium');
    setNewCategory('Personal Task');
    setShowAddForm(false);
    
    loadAlertData();
    triggerAction("NEW ALERT REGISTERED");
  };

  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || alerts[0];

  return (
    <div className="flex flex-col h-full bg-background-dark min-h-screen animate-in fade-in pb-16">
      
      {/* Dynamic Action Notification Banner */}
      {actionMessage && (
        <div className="fixed top-20 left-4 right-4 z-[100] py-4 px-6 rounded-2xl bg-primary text-white font-black text-[10px] tracking-[0.3em] text-center shadow-2xl animate-in slide-in-from-top-full">
          {actionMessage}
        </div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-50 bg-background-dark/95 backdrop-blur-md border-b border-white/5">
        <button 
          onClick={() => navigate('/')} 
          className="size-11 flex items-center justify-center rounded-2xl bg-card-dark border border-slate-800 hover:bg-slate-800 transition-all active:scale-95"
        >
          <ArrowLeft className="size-5 text-white" />
        </button>
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-slate-300">Maestro Proactive Hub</h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="size-11 flex items-center justify-center rounded-2xl bg-primary hover:bg-orange-500 transition-all text-black active:scale-95"
          title="Add New Alert"
        >
          <Plus className="size-5" />
        </button>
      </header>

      {/* Form to insert new tasks quickly */}
      {showAddForm && (
        <div className="p-4 bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top duration-300">
          <form onSubmit={handleCreateManualAlert} className="space-y-4 max-w-sm mx-auto">
            <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">Create Browser-Local Alert</h4>
            
            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Title / Reminder</label>
              <input 
                type="text" 
                placeholder="e.g. Renew my passport" 
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full h-10 bg-black border border-slate-800 rounded-xl px-3 text-xs text-white placeholder-slate-650"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Details</label>
              <textarea 
                placeholder="Add additional tactical instructions..." 
                value={newDesc}
                onChange={e => setNewDesc(e.target.value)}
                className="w-full h-16 bg-black border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-650 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Urgency</label>
                <select 
                  value={newUrgency} 
                  onChange={(event) => setNewUrgency(event.target.value as AlertItem['urgency'])}
                  className="w-full h-10 bg-black border border-slate-800 rounded-xl px-2 text-xs text-slate-300"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Category</label>
                <input 
                  type="text" 
                  placeholder="e.g. Family Care, Consulting" 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full h-10 bg-black border border-slate-800 rounded-xl px-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                className="flex-1 h-10 bg-primary hover:bg-orange-500 rounded-xl text-[10px] font-black uppercase tracking-wider text-black"
              >
              Save Alert
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 h-10 bg-slate-800 rounded-xl text-[10px] text-slate-450 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <main className="flex-1 p-4 space-y-6">

        {/* Dynamic Alerts List Scroller */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Browser-Local Alerts</h3>
            <span className="text-[9px] font-mono font-bold text-slate-400">COUNT: {alerts.length}</span>
          </div>

          <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2">
            {alerts.length > 0 ? (
              alerts.map((item) => {
                const isActive = item.id === selectedAlertId;
                return (
                  <article
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedAlertId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        setSelectedAlertId(item.id);
                      }
                    }}
                    aria-pressed={isActive}
                    className={`p-4 rounded-3xl border text-left min-w-[200px] max-w-[220px] shrink-0 transition-all relative ${
                      isActive 
                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/10' 
                        : 'bg-card-dark border-slate-850 hover:border-slate-750 text-slate-300'
                    } ${item.isCompleted ? 'opacity-55' : ''}`}
                  >
                    <div className="flex justify-between items-start gap-1 mb-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : item.urgency === 'high' 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.category}
                      </span>
                      {item.isCompleted && (
                        <ShieldCheck className="size-3.5 text-primary shrink-0" />
                      )}
                    </div>
                    
                    <h4 className="font-black text-xs uppercase tracking-tight line-clamp-1">{item.title}</h4>
                    <p className={`text-[10px] mt-1 line-clamp-2 ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[8px] font-mono opacity-80">{item.time}</span>
                      <button 
                        onClick={(e) => handleDeleteAlert(item.id, e)}
                        className={`p-1.5 rounded-lg transition-colors ${isActive ? 'hover:bg-white/10 text-white/80' : 'hover:bg-slate-900 text-slate-650 hover:text-red-400'}`}
                        title="Delete Alert"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="w-full text-center py-10 border border-dashed border-slate-850 rounded-3xl">
                <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">No Alerts Pending</p>
                <p className="text-[10px] text-slate-500 mt-1 leading-normal">Ask Maestro via voice to remind you!</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Alert Detailed Card view */}
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <span className="size-2 rounded-full bg-primary"></span>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Alert Details</h3>
            </div>

            <div className={`rounded-3xl overflow-hidden bg-card-dark border border-slate-805 shadow-2xl transition-all duration-300 ${selectedAlert.isCompleted ? 'opacity-65 grayscale' : ''}`}>
              
              {/* Dynamic Header Image Seeded by ID */}
              <div className="h-32 relative bg-[linear-gradient(135deg,#1E1E1E_0%,#0D0D0D_65%,#261208_100%)] border-b border-[#2A2A2A]">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_80%_20%,#EC5B13_0,transparent_35%)]"></div>
                <div className="absolute bottom-4 left-4">
                  <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg ring-1 ring-white/20 ${
                    selectedAlert.urgency === 'high' ? 'bg-red-500 text-white' : 'bg-slate-900 text-slate-300'
                  }`}>
                    {selectedAlert.urgency === 'high' ? <AlertTriangle className="size-3 text-white" /> : <Shield className="size-3" />}
                    {selectedAlert.urgency.toUpperCase()} URGENCY
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <h1 className="text-xl md:text-2xl font-black leading-tight mb-2 tracking-tight text-white uppercase">
                    {selectedAlert.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-bold bg-slate-900/80 text-slate-400 border border-slate-800">
                      <Calendar className="size-3 text-primary" /> {selectedAlert.date}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-bold bg-slate-900/80 text-slate-400 border border-slate-800">
                      <Clock className="size-3 text-primary" /> {selectedAlert.time}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/25">
                      {selectedAlert.category}
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs md:text-sm leading-relaxed font-semibold text-left">
                  {selectedAlert.description}
                </p>

                {/* Cyberpunk Meta stats */}
                <div className="pt-2 border-t border-slate-850 flex justify-between text-[8px] font-mono font-bold text-slate-600 uppercase">
                  <span>Local ID: {selectedAlert.id}</span>
                  <span>Storage: THIS BROWSER</span>
                </div>
              </div>
            </div>

            {/* Intelligent Micro-Actions context menu */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Sparkles className="size-3.5 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Prototype Actions</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button 
                  onClick={() => triggerAction("ONLINE SYNC IS NOT CONNECTED")}
                  className="flex items-center justify-between p-4 rounded-2xl bg-primary text-black hover:bg-orange-500 transition-all shadow-lg text-left"
                >
                  <div>
                    <span className="text-[8px] font-black tracking-widest block uppercase opacity-85">Unavailable in demo</span>
                    <span className="text-xs font-black uppercase tracking-tight block mt-0.5">Online Sync</span>
                  </div>
                  <ChevronRight className="size-4" />
                </button>

                <button 
                  onClick={() => triggerAction("ITEM IS STORED LOCALLY WITHOUT ENCRYPTION")}
                  className="flex items-center justify-between p-4 rounded-2xl bg-card-dark border border-slate-850 hover:border-slate-750 text-slate-300 transition-all text-left"
                >
                  <div>
                    <span className="text-[8px] font-black tracking-widest block uppercase text-slate-500">Current storage</span>
                    <span className="text-xs font-black uppercase tracking-tight text-white block mt-0.5">Unencrypted Local Data</span>
                  </div>
                  <ChevronRight className="size-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Resolve & Toggle controls */}
            <div className="grid grid-cols-2 gap-4 pt-3">
              <button
                onClick={() => handleToggleComplete(selectedAlert.id)}
                className={`h-14 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  selectedAlert.isCompleted 
                    ? 'bg-slate-900 border-slate-800 text-slate-500' 
                    : 'bg-primary/5 border-primary/20 text-primary hover:bg-primary/10'
                }`}
              >
                <CheckCircle className="size-4" />
                {selectedAlert.isCompleted ? 'Restore Task' : 'Mark Resolved'}
              </button>

              <button
                onClick={(e) => handleDeleteAlert(selectedAlert.id, e)}
                className="h-14 rounded-2xl bg-red-950/15 border border-red-500/20 text-red-500 hover:bg-red-950/25 transition-all text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Trash2 className="size-4" />
                Delete Record
              </button>
            </div>
          </div>
        )}

        {/* Browser-local storage disclosure */}
        {storageInfo && (
          <div className="rounded-2xl bg-card-dark border border-slate-850 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <Database className="size-4" />
                </div>
                <div className="text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Browser-Local Storage</h4>
                  <p className="text-[8px] font-mono text-slate-500 font-bold">NO CLOUD BACKUP CONNECTED</p>
                </div>
              </div>
              <span className="text-[8px] font-black bg-red-500/10 text-red-300 border border-red-500/25 px-2.5 py-1 rounded-full flex items-center gap-1">
                NOT ENCRYPTED
              </span>
            </div>

            <div className="space-y-3 font-mono text-[9px] text-left">
              <div className="flex justify-between items-center bg-black/45 p-3 rounded-xl border border-slate-900/60">
                <span className="text-slate-500">LAST SAVED</span>
                <span className="text-slate-300 font-bold">{storageInfo.lastSavedAt ? new Date(storageInfo.lastSavedAt).toLocaleTimeString() : 'Not yet saved'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black/25 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-center">
                  <span className="text-slate-500 text-[8px] uppercase">Storage Type</span>
                  <span className="text-slate-300 font-bold uppercase mt-0.5">LOCALSTORAGE</span>
                </div>
                <div className="bg-black/25 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-center">
                  <span className="text-slate-500 text-[8px] uppercase">Approximate Size</span>
                  <span className="text-slate-300 font-bold mt-0.5">{storageInfo.approximateBytes} BYTES</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-850/50 text-[9px] leading-relaxed text-primary">
                Do not store passwords, identity documents, financial records, health information, or other sensitive data in this prototype.
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AlertDetail;
