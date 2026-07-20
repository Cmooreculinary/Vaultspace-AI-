import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  ShieldCheck, 
  FolderLock, 
  Info,
  Layers,
  Database,
  FileHeart,
  Briefcase,
  AlertOctagon
} from 'lucide-react';

// Unified mock data for stored assets in Dr. Moore's Elite Mindset Vault
const DISTRIBUTION_DATA = [
  { name: 'Family Archive', value: 8, size: '2.4 GB', color: '#10b981', desc: 'Photos, videos & admission essays' },
  { name: 'Professional', value: 6, size: '55.2 MB', color: '#3b82f6', desc: 'Keynotes, contracts & manuscripts' },
  { name: 'Tactical Assets', value: 5, size: '155.8 MB', color: '#f43f5e', desc: 'Algorithms, psych profiles & keys' },
];

const SECURITY_STRENGTH_DATA = [
  { 
    name: 'Family Archive', 
    strength: 85, 
    encryption: 'AES-256', 
    mfa: 'SMS / Authenticator',
    integrity: 100,
    status: 'OPTIMAL'
  },
  { 
    name: 'Professional', 
    strength: 95, 
    encryption: 'AES-256 + RSA-4096', 
    mfa: 'Dr. Moore Passphrase',
    integrity: 100,
    status: 'SECURE'
  },
  { 
    name: 'Tactical Assets', 
    strength: 100, 
    encryption: 'AES-GCM + Bio-Locked', 
    mfa: 'Alpha-1 Master Key',
    integrity: 100,
    status: 'AIR-GAPPED'
  },
];

const FILE_TYPE_DISTRIBUTION = [
  { name: 'Media (MOV/JPG/MP4)', value: 6, color: '#10b981' },
  { name: 'Documents (PDF/DOCX)', value: 5, color: '#3b82f6' },
  { name: 'Keynotes (PPTX)', value: 1, color: '#a855f7' },
  { name: 'Psych Profiles & DBs', value: 4, color: '#f43f5e' },
  { name: 'System Recovery/Keys', value: 3, color: '#eab308' },
];

const DocumentStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'distribution' | 'security' | 'types'>('distribution');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  // Custom tooltip component for dark-mode interface
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3.5 rounded-2xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-black text-white uppercase tracking-wider mb-1">{data.name}</p>
          <div className="space-y-1">
            {data.value !== undefined && (
              <p className="text-[10px] text-slate-400 font-medium">
                Items: <span className="font-bold text-white font-mono">{data.value}</span>
              </p>
            )}
            {data.size && (
              <p className="text-[10px] text-slate-400 font-medium">
                Volume: <span className="font-bold text-primary font-mono">{data.size}</span>
              </p>
            )}
            {data.strength !== undefined && (
              <p className="text-[10px] text-slate-400 font-medium">
                Security Quotient: <span className="font-bold text-emerald-400 font-mono">{data.strength}%</span>
              </p>
            )}
            {data.encryption && (
              <p className="text-[10px] text-slate-400 font-medium">
                Cipher: <span className="font-bold text-slate-300 font-mono text-[9px]">{data.encryption}</span>
              </p>
            )}
            {data.desc && (
              <p className="text-[9px] text-slate-500 italic mt-1 border-t border-slate-900 pt-1">
                {data.desc}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="recharts-document-vault-dashboard" className="rounded-[32px] bg-card-dark p-6 border border-slate-800 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-slate-700">
      <div className="absolute -left-16 -bottom-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Storage Analytics</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-0.5">Real-time telemetry</p>
            </div>
          </div>

          <div className="flex bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('distribution')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ${
                activeTab === 'distribution' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Category Distribution"
            >
              <Layers className="size-4" />
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ml-1 ${
                activeTab === 'types' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Document Formats"
            >
              <PieIcon className="size-4" />
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`p-1.5 rounded-lg transition-all flex items-center justify-center ml-1 ${
                activeTab === 'security' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Security Analysis"
            >
              <BarChart3 className="size-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Labeling based on active chart */}
        <div className="bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/50 flex items-start gap-2.5">
          <Info className="size-4 text-primary mt-0.5 shrink-0" />
          <div className="text-[10px] leading-relaxed text-slate-400">
            {activeTab === 'distribution' && (
              <span>Displays the allocation of resources across the primary secure directories. <strong>Moore Family Archive</strong> currently occupies the highest document volume count.</span>
            )}
            {activeTab === 'types' && (
              <span>Displays high-performance media files, speaking keynotes, psychological assessments, and military-grade database schemas.</span>
            )}
            {activeTab === 'security' && (
              <span>Security Index evaluates active cryptographic bounds. Tier 3 <strong>Tactical Assets</strong> are bio-locked and reach optimal 100% threshold score.</span>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Container */}
      <div className="w-full flex items-center justify-center h-52 relative">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'distribution' ? (
            <PieChart>
              <Pie
                data={DISTRIBUTION_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={6}
                dataKey="value"
                onMouseEnter={(data) => setHoveredSlice(data.name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {DISTRIBUTION_DATA.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={hoveredSlice === null || hoveredSlice === entry.name ? 1 : 0.4}
                    stroke="#1c2433" 
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : activeTab === 'types' ? (
            <PieChart>
              <Pie
                data={FILE_TYPE_DISTRIBUTION}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(data) => setHoveredSlice(data.name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                {FILE_TYPE_DISTRIBUTION.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={hoveredSlice === null || hoveredSlice === entry.name ? 1 : 0.4}
                    stroke="#1c2433" 
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-300"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          ) : (
            <BarChart
              data={SECURITY_STRENGTH_DATA}
              margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
            >
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={9} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="#475569" 
                fontSize={9} 
                fontWeight="bold"
                tickLine={false} 
                axisLine={false} 
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 12 }} />
              <Bar 
                dataKey="strength" 
                radius={[10, 10, 0, 0]} 
                maxBarSize={45}
              >
                {SECURITY_STRENGTH_DATA.map((entry, index) => {
                  let barColor = '#3b82f6';
                  if (entry.name === 'Family Archive') barColor = '#10b981';
                  if (entry.name === 'Tactical Assets') barColor = '#f43f5e';
                  return <Cell key={`bar-cell-${index}`} fill={barColor} />;
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>

        {/* Center label for Donut charts */}
        {(activeTab === 'distribution' || activeTab === 'types') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Assets</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5">
              {activeTab === 'distribution' ? '19' : '19'}
            </span>
            <span className="text-[8px] font-bold text-emerald-500 uppercase mt-0.5">Dr. Bill Moore</span>
          </div>
        )}
      </div>

      {/* Legend / Metrics List */}
      <div className="mt-4 space-y-2">
        {activeTab === 'distribution' && (
          <div className="grid grid-cols-3 gap-2">
            {DISTRIBUTION_DATA.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40 flex flex-col"
                onMouseEnter={() => setHoveredSlice(item.name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider truncate">{item.name.split(' ')[0]}</span>
                </div>
                <span className="text-xs font-black text-white font-mono mt-1">{item.value} Files</span>
                <span className="text-[8px] font-bold text-slate-500 uppercase mt-0.5">{item.size}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'types' && (
          <div className="grid grid-cols-2 gap-2 max-h-24 overflow-y-auto hide-scrollbar">
            {FILE_TYPE_DISTRIBUTION.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-800/40 flex items-center justify-between"
                onMouseEnter={() => setHoveredSlice(item.name)}
                onMouseLeave={() => setHoveredSlice(null)}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider truncate">{item.name}</span>
                </div>
                <span className="text-[10px] font-black text-white font-mono ml-2">{item.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-1.5">
            {SECURITY_STRENGTH_DATA.map((item, idx) => (
              <div key={idx} className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderLock className={`size-4 ${idx === 0 ? 'text-emerald-500' : idx === 1 ? 'text-primary' : 'text-rose-500'}`} />
                  <div>
                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Active Directory</span>
                    <h5 className="text-[10px] font-black text-white uppercase tracking-wider">{item.name}</h5>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">Cipher Method</span>
                    <span className="text-[9px] font-bold text-slate-300 font-mono uppercase">{item.encryption}</span>
                  </div>
                  <div className="bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800 text-center min-w-14">
                    <span className="text-[10px] font-black text-emerald-400 font-mono block">{item.strength}%</span>
                    <span className="text-[6px] font-black text-slate-500 uppercase tracking-widest block">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentStats;
