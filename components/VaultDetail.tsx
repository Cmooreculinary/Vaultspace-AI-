import React, { useMemo, useState } from 'react';
import { ArrowLeft, FileWarning, Search, Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VaultItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  icon: string;
  category: string;
  description: string;
}

interface VaultDetailProps {
  tier: 'FAMILY' | 'ADULT';
}

const VAULT_DATA: Record<VaultDetailProps['tier'], VaultItem[]> = {
  FAMILY: [
    { id: 'family-photo', name: 'Sample Family Photo', type: 'JPG LABEL', size: 'DEMO', modified: 'Sample', icon: 'photo', category: 'Media', description: 'Static metadata showing how a family photo card could appear.' },
    { id: 'home-video', name: 'Sample Home Video', type: 'MP4 LABEL', size: 'DEMO', modified: 'Sample', icon: 'videocam', category: 'Media', description: 'Static metadata showing how a home-video card could appear.' },
    { id: 'household-list', name: 'Household Checklist', type: 'NOTE LABEL', size: 'DEMO', modified: 'Sample', icon: 'checklist', category: 'Records', description: 'Static metadata showing a household task document.' },
    { id: 'school-record', name: 'School Record Example', type: 'PDF LABEL', size: 'DEMO', modified: 'Sample', icon: 'school', category: 'Records', description: 'Static metadata only. No student record is stored.' },
    { id: 'trip-plan', name: 'Trip Plan Example', type: 'NOTE LABEL', size: 'DEMO', modified: 'Sample', icon: 'map', category: 'Planning', description: 'Static metadata showing how a planning record could appear.' },
    { id: 'maintenance-note', name: 'Maintenance Note', type: 'NOTE LABEL', size: 'DEMO', modified: 'Sample', icon: 'home_repair_service', category: 'Planning', description: 'Static metadata showing a household maintenance note.' },
  ],
  ADULT: [
    { id: 'outline', name: 'Keynote Outline Example', type: 'DOCX LABEL', size: 'DEMO', modified: 'Sample', icon: 'description', category: 'Drafts', description: 'Static metadata showing how a presentation outline could appear.' },
    { id: 'workshop', name: 'Workshop Notes Example', type: 'PDF LABEL', size: 'DEMO', modified: 'Sample', icon: 'groups', category: 'Notes', description: 'Static metadata showing how workshop notes could appear.' },
    { id: 'schedule', name: 'Speaking Schedule Example', type: 'CAL LABEL', size: 'DEMO', modified: 'Sample', icon: 'calendar_month', category: 'Planning', description: 'Static metadata showing how a schedule record could appear.' },
    { id: 'contract-list', name: 'Contract Checklist Example', type: 'NOTE LABEL', size: 'DEMO', modified: 'Sample', icon: 'fact_check', category: 'Planning', description: 'Static metadata only. No legal agreement is stored.' },
    { id: 'research', name: 'Research Notes Example', type: 'TXT LABEL', size: 'DEMO', modified: 'Sample', icon: 'science', category: 'Notes', description: 'Static metadata showing how research notes could appear.' },
    { id: 'draft-index', name: 'Draft Index Example', type: 'TABLE LABEL', size: 'DEMO', modified: 'Sample', icon: 'table_chart', category: 'Drafts', description: 'Static metadata showing how a draft index could appear.' },
  ],
};

const VaultDetail: React.FC<VaultDetailProps> = ({ tier }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<VaultItem | null>(null);
  const title = tier === 'ADULT' ? 'Work Samples' : 'Family Samples';
  const categories = ['All', ...new Set(VAULT_DATA[tier].map((item) => item.category))];

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return VAULT_DATA[tier].filter((item) => {
      const categoryMatches = selectedCategory === 'All' || item.category === selectedCategory;
      const queryMatches = !query || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }, [tier, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background-dark pb-28 text-slate-300">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#2A2A2A] bg-background-dark/95 p-4 backdrop-blur-xl">
        <button onClick={() => navigate('/')} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414] text-white" aria-label="Return home"><ArrowLeft className="size-4" /></button>
        <div className="text-center"><p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Static interface data</p><h1 className="font-display text-2xl uppercase tracking-wider text-white">{title}</h1></div>
        <button onClick={() => navigate('/settings')} className="grid size-10 place-items-center border border-[#2A2A2A] bg-[#141414] text-slate-400" aria-label="Open settings"><Settings className="size-4" /></button>
      </header>

      <main className="space-y-6 p-4">
        <section className="flex gap-3 border border-primary/30 bg-primary/5 p-4"><FileWarning className="mt-0.5 size-5 shrink-0 text-primary" /><p className="text-[10px] leading-relaxed text-slate-400">Every record on this screen is hard-coded sample metadata. No file exists behind these cards, and no content is uploaded, encrypted, or backed up.</p></section>

        <label className="flex h-12 items-center gap-3 border border-[#2A2A2A] bg-[#141414] px-4"><Search className="size-4 text-slate-600" /><span className="sr-only">Search sample records</span><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="min-w-0 flex-1 border-0 bg-transparent p-0 text-xs text-white placeholder:text-slate-700 focus:ring-0" /></label>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`h-9 shrink-0 border px-4 text-[9px] font-black uppercase tracking-wider ${selectedCategory === category ? 'border-primary bg-primary text-black' : 'border-[#2A2A2A] bg-[#141414] text-slate-500'}`}>{category}</button>)}
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between"><h2 className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">Sample Records</h2><span className="font-mono text-[8px] text-slate-700">{filteredItems.length} shown</span></div>
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item) => (
              <button key={item.id} type="button" onClick={() => setActiveItem(item)} className="overflow-hidden border border-[#2A2A2A] bg-[#141414] text-left hover:border-primary">
                <span className="grid h-28 place-items-center border-b border-[#2A2A2A] bg-[linear-gradient(135deg,#1E1E1E,#0D0D0D)]"><span className="material-symbols-outlined text-4xl text-primary/70">{item.icon}</span></span>
                <span className="block p-4"><strong className="block truncate text-[10px] text-white">{item.name}</strong><span className="mt-2 flex justify-between font-mono text-[7px] uppercase text-slate-600"><span>{item.type}</span><span>{item.category}</span></span></span>
              </button>
            ))}
          </div>
          {filteredItems.length === 0 && <p className="border border-dashed border-[#2A2A2A] p-10 text-center text-[10px] text-slate-600">No sample records match.</p>}
        </section>
      </main>

      {activeItem && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#0D0D0D] p-6">
          <div className="mx-auto flex min-h-full max-w-md flex-col justify-center gap-5">
            <div className="flex items-start justify-between border-b border-[#2A2A2A] pb-4"><div><p className="font-mono text-[8px] uppercase tracking-wider text-primary">Sample metadata</p><h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-white">{activeItem.name}</h2></div><button onClick={() => setActiveItem(null)} className="grid size-10 shrink-0 place-items-center border border-[#2A2A2A] bg-[#141414]" aria-label="Close sample record"><X className="size-4" /></button></div>
            <div className="grid aspect-[4/3] place-items-center border border-[#2A2A2A] bg-[linear-gradient(135deg,#1E1E1E,#0D0D0D)]"><span className="material-symbols-outlined text-7xl text-primary/70">{activeItem.icon}</span></div>
            <p className="text-sm leading-relaxed text-slate-300">{activeItem.description}</p>
            <dl className="grid grid-cols-3 gap-px border border-[#2A2A2A] bg-[#2A2A2A] font-mono text-[8px]"><div className="bg-[#141414] p-3"><dt className="text-slate-600">TYPE</dt><dd className="mt-1 text-slate-300">{activeItem.type}</dd></div><div className="bg-[#141414] p-3"><dt className="text-slate-600">SIZE</dt><dd className="mt-1 text-slate-300">{activeItem.size}</dd></div><div className="bg-[#141414] p-3"><dt className="text-slate-600">STATE</dt><dd className="mt-1 text-slate-300">{activeItem.modified}</dd></div></dl>
            <button type="button" onClick={() => setActiveItem(null)} className="h-12 bg-primary text-[10px] font-black uppercase tracking-[0.16em] text-black">Return to samples</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaultDetail;
