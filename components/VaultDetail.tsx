
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BiometricAuth from './BiometricAuth';

interface VaultItem {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  icon: string;
  category: string;
  preview?: string;
  security?: string;
  description?: string;
}

interface VaultDetailProps {
  tier: 'FAMILY' | 'ADULT';
}

const VAULT_DATA: Record<string, VaultItem[]> = {
  FAMILY: [
    { id: 'f1', name: "Nikki - Anniversary 2023", type: 'JPG', size: '5.4 MB', modified: '2h ago', icon: 'favorite', category: 'Nikki', preview: 'https://picsum.photos/seed/anniversary/800/600', description: 'Celebrating 25 years in the mountains.' },
    { id: 'f2', name: "Brennan - Soccer States", type: 'MOV', size: '1.2 GB', modified: '1d ago', icon: 'sports_soccer', category: 'Brennan', preview: 'https://picsum.photos/seed/soccer/800/600', description: 'Winning goal from the championship match.' },
    { id: 'f3', name: "Cullen - Graduation Photo", type: 'JPG', size: '8.2 MB', modified: '3h ago', icon: 'school', category: 'Cullen', preview: 'https://picsum.photos/seed/grad/800/600', description: 'Cullen receiving his diploma with high honors.' },
    { id: 'f4', name: "Tyler - College Essay", type: 'PDF', size: '1.2 MB', modified: '5d ago', icon: 'description', category: 'Tyler', description: 'Draft of Tyler\'s admissions essay regarding team dynamics.' },
    { id: 'f5', name: "Ian - Birthday Vlog", type: 'MP4', size: '420 MB', modified: 'Yesterday', icon: 'cake', category: 'Ian', preview: 'https://picsum.photos/seed/bday/800/600', description: 'Ian opening his first set of golf clubs.' },
    { id: 'f6', name: "Family Holiday 2023", type: 'JPG', size: '15 MB', modified: '2w ago', icon: 'home', category: 'Family', preview: 'https://picsum.photos/seed/holiday/800/600', description: 'The whole crew: Bill, Nikki, and the boys in Colorado.' },
    { id: 'f7', name: "Nikki - Beach Trip", type: 'JPG', size: '4.1 MB', modified: '1m ago', icon: 'beach_access', category: 'Nikki', preview: 'https://picsum.photos/seed/beach/800/600', description: 'Summer vacation at the coast.' },
    { id: 'f8', name: "Brennan - Training Drills", type: 'MOV', size: '800 MB', modified: '2d ago', icon: 'fitness_center', category: 'Brennan', preview: 'https://picsum.photos/seed/training/800/600', description: 'New high-intensity interval drills.' },
  ],
  ADULT: [
    { id: 'a1', name: "Manuscript: The Winning Mindset", type: 'DOCX', size: '4.2 MB', modified: '1h ago', icon: 'book_2', category: 'Author', security: 'Restricted', description: 'Latest draft for the upcoming book on team building in professional sports.' },
    { id: 'a2', name: "Consulting Protocol: Team Unity", type: 'PDF', size: '1.8 MB', modified: 'Yesterday', icon: 'groups', category: 'Consulting', security: 'Top Secret', description: 'Proprietary framework for repairing dysfunctional corporate teams.' },
    { id: 'a3', name: "Speaking Keynote: Elite Teams", type: 'PPTX', size: '45 MB', modified: '3d ago', icon: 'present_to_all', category: 'Speaker', security: 'Secure', description: 'Visuals for the upcoming conference keynote on performance psychology.' },
    { id: 'a4', name: "Athlete Assessment: Confidential", type: 'XLSX', size: '250 KB', modified: '1h ago', icon: 'psychology', category: 'Consulting', security: 'Top Secret', description: 'Sensitive psych profiles for the 2024 draft class.' },
    { id: 'a5', name: "Speaker Agreement: Global Summit", type: 'PDF', size: '2.1 MB', modified: '1w ago', icon: 'history_edu', category: 'Legal', security: 'Restricted', description: 'Signed contract for the Leadership Summit in London.' },
    { id: 'a6', name: "Financial Strategy 2024", type: 'XLSX', size: '1.1 MB', modified: '5d ago', icon: 'account_balance', category: 'Legal', security: 'Top Secret', description: 'Long-term financial planning for Moore Consulting.' },
  ]
};

const CATEGORY_MAP: Record<string, { id: string, label: string, icon: string }[]> = {
  FAMILY: [
    { id: 'All', label: 'All Items', icon: 'dashboard' },
    { id: 'Nikki', label: 'Nikki', icon: 'favorite' },
    { id: 'Brennan', label: 'Brennan', icon: 'sports_soccer' },
    { id: 'Cullen', label: 'Cullen', icon: 'school' },
    { id: 'Tyler', label: 'Tyler', icon: 'history_edu' },
    { id: 'Ian', label: 'Ian', icon: 'golf_course' },
  ],
  ADULT: [
    { id: 'All', label: 'All Items', icon: 'dashboard' },
    { id: 'Author', label: 'Author', icon: 'book_2' },
    { id: 'Consulting', label: 'Consulting', icon: 'psychology' },
    { id: 'Speaker', label: 'Speaker', icon: 'present_to_all' },
    { id: 'Legal', label: 'Legal/Finance', icon: 'policy' },
  ]
};

const VaultDetail: React.FC<VaultDetailProps> = ({ tier }) => {
  const navigate = useNavigate();
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState<VaultItem | null>(null);
  const isAdult = tier === 'ADULT';

  const categories = CATEGORY_MAP[tier];

  const filteredItems = useMemo(() => {
    let data = VAULT_DATA[tier] || [];
    
    if (selectedCategory !== 'All') {
      data = data.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description?.toLowerCase().includes(q)
      );
    }
    
    return data;
  }, [tier, selectedCategory, searchQuery]);

  const recentItems = filteredItems.slice(0, 4);
  const fileItems = filteredItems.slice(4);

  if (!isVerified) {
    return (
      <BiometricAuth 
        onSuccess={() => setIsVerified(true)} 
        onCancel={() => navigate('/')} 
        title={`Accessing ${isAdult ? 'Professional' : 'Family'} Vault`}
        subtitle={`Facial verification required. Please authorize camera scanner to verify Level ${isAdult ? '2' : '1'} decryption keys.`}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background-dark min-h-screen animate-in fade-in duration-500">
      <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-background-dark/95 backdrop-blur-xl border-b border-white/5">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-card-dark border border-slate-800 hover:bg-slate-800 transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-white">arrow_back_ios_new</span>
        </button>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black uppercase tracking-tight">{isAdult ? 'Prof Vault' : 'Family Vault'}</h1>
            <span className={`material-symbols-outlined text-[18px] ${isAdult ? 'text-primary' : 'text-emerald-500'} animate-pulse`}>
              {isAdult ? 'psychology' : 'groups'}
            </span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Secure Moore-Access Directory</p>
        </div>
        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-card-dark border border-slate-800 hover:bg-slate-800 transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div className="flex w-full items-center rounded-2xl bg-card-dark border border-slate-800 h-14 px-4 gap-3 group transition-all focus-within:border-primary/50">
          <span className="material-symbols-outlined text-slate-500">search</span>
          <input 
            className="flex-1 bg-transparent border-none text-sm font-medium text-white placeholder-slate-600 focus:ring-0" 
            placeholder="Search Dr. Moore's files..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 h-10 rounded-xl border transition-all whitespace-nowrap text-xs font-bold uppercase tracking-wider ${
                selectedCategory === cat.id 
                ? 'bg-primary border-primary text-white' 
                : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Priority Objects ({filteredItems.length})</h3>
          
          {recentItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {recentItems.map((item) => (
                <div key={item.id} onClick={() => setActiveItem(item)} className="bg-card-dark rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:border-primary/50 transition-all cursor-pointer active:scale-95 group">
                  <div className="h-32 w-full bg-slate-900 flex items-center justify-center relative">
                    {item.preview ? (
                      <img src={item.preview} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="" />
                    ) : (
                      <span className="material-symbols-outlined text-5xl text-slate-700">{item.icon}</span>
                    )}
                    {item.security === 'Top Secret' && (
                      <div className="absolute top-2 right-2 p-1.5 bg-rose-500/20 rounded-lg backdrop-blur-md">
                        <span className="material-symbols-outlined text-[14px] text-rose-500">lock</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-black text-[11px] text-white truncate leading-tight">{item.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[8px] font-black uppercase text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">{item.type}</span>
                      <span className="text-[9px] font-bold text-slate-600">{item.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-600 space-y-3">
              <span className="material-symbols-outlined text-6xl">find_in_page</span>
              <p className="font-black text-[10px] uppercase tracking-widest">No matching tactical assets</p>
            </div>
          )}
        </div>

        {fileItems.length > 0 && (
          <div className="space-y-4 pb-24">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Archive Items</h3>
            <div className="space-y-3">
              {fileItems.map((file) => (
                <div key={file.id} onClick={() => setActiveItem(file)} className="flex items-center gap-4 p-4 rounded-3xl bg-card-dark border border-slate-800 hover:bg-slate-800/50 transition-all cursor-pointer group active:scale-[0.98]">
                  <div className="size-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-primary">
                    <span className="material-symbols-outlined">{file.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate tracking-wide">{file.name}</p>
                    <p className="text-[10px] font-bold text-slate-500">{file.category} • {file.size}</p>
                  </div>
                  <span className="material-symbols-outlined text-slate-600 group-hover:text-primary transition-colors">visibility</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background-dark animate-in slide-in-from-bottom-full duration-500">
          <header className="flex items-center justify-between p-4 border-b border-white/5">
            <button onClick={() => setActiveItem(null)} className="size-10 flex items-center justify-center rounded-xl bg-card-dark border border-slate-800"><span className="material-symbols-outlined">close</span></button>
            <h4 className="text-sm font-black uppercase tracking-widest truncate max-w-[200px]">{activeItem.name}</h4>
            <div className="w-10"></div>
          </header>
          <main className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="aspect-[4/3] rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center shadow-2xl">
              {activeItem.preview ? <img src={activeItem.preview} className="w-full h-full object-cover" alt="" /> : <span className="material-symbols-outlined text-8xl text-slate-700">{activeItem.icon}</span>}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Moore-Vault Metadata</h3>
                {activeItem.security && (
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    activeItem.security === 'Top Secret' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-primary/10 border-primary/20 text-primary'
                  }`}>
                    {activeItem.security}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{activeItem.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-card-dark rounded-2xl border border-slate-800">
                  <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Modified</span>
                  <span className="text-xs font-bold text-white">{activeItem.modified}</span>
                </div>
                <div className="p-4 bg-card-dark rounded-2xl border border-slate-800">
                  <span className="text-[8px] font-black text-slate-500 uppercase block mb-1">Size</span>
                  <span className="text-xs font-bold text-white">{activeItem.size}</span>
                </div>
              </div>
            </div>
          </main>
          <footer className="p-6 border-t border-white/5 grid grid-cols-2 gap-4 bg-background-dark/80 backdrop-blur-md">
            <button className="h-14 rounded-2xl bg-slate-800 font-black uppercase text-[10px] tracking-widest text-white active:scale-95 transition-all">Export Doc</button>
            <button className="h-14 rounded-2xl bg-primary font-black uppercase text-[10px] tracking-widest text-white shadow-xl active:scale-95 transition-all">Secure Open</button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default VaultDetail;
