import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { FilePieChart, Info, Layers3 } from 'lucide-react';

interface ChartDatum {
  name: string;
  value: number;
  color: string;
  description: string;
}

interface TooltipPayloadItem {
  payload: ChartDatum;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

const WORKSPACE_DATA: ChartDatum[] = [
  { name: 'Family samples', value: 8, color: '#EC5B13', description: 'Sample household records and media cards' },
  { name: 'Work samples', value: 6, color: '#8A8A8A', description: 'Sample notes, schedules, and document cards' },
  { name: 'Operator samples', value: 5, color: '#B54212', description: 'Sample console records and concept controls' },
];

const FORMAT_DATA: ChartDatum[] = [
  { name: 'Media labels', value: 6, color: '#EC5B13', description: 'Non-functional JPG, MOV, and MP4 examples' },
  { name: 'Document labels', value: 7, color: '#A7A7A7', description: 'Non-functional PDF, DOCX, and note examples' },
  { name: 'Operator labels', value: 6, color: '#B54212', description: 'Non-functional console and data examples' },
];

const ChartTooltip: React.FC<ChartTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="max-w-52 border border-[#2A2A2A] bg-[#0D0D0D]/95 p-3 shadow-2xl">
      <p className="text-[10px] font-black uppercase tracking-wider text-white">{data.name}</p>
      <p className="mt-1 font-mono text-[9px] text-primary">{data.value} SAMPLE RECORDS</p>
      <p className="mt-2 text-[9px] leading-relaxed text-slate-500">{data.description}</p>
    </div>
  );
};

const DocumentStats: React.FC = () => {
  const [view, setView] = useState<'workspaces' | 'formats'>('workspaces');
  const data = view === 'workspaces' ? WORKSPACE_DATA : FORMAT_DATA;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="relative overflow-hidden border border-[#2A2A2A] bg-card-dark p-6" aria-labelledby="sample-analytics-heading">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="grid size-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary"><FilePieChart className="size-5" /></span>
          <div><p className="font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-primary">Static prototype data</p><h2 id="sample-analytics-heading" className="mt-1 text-sm font-black uppercase text-white">Sample Record Mix</h2></div>
        </div>
        <div className="flex border border-[#2A2A2A] bg-black p-1">
          <button type="button" onClick={() => setView('workspaces')} className={`grid size-8 place-items-center ${view === 'workspaces' ? 'bg-primary text-black' : 'text-slate-600 hover:text-white'}`} aria-label="Show sample workspaces"><Layers3 className="size-3.5" /></button>
          <button type="button" onClick={() => setView('formats')} className={`grid size-8 place-items-center ${view === 'formats' ? 'bg-primary text-black' : 'text-slate-600 hover:text-white'}`} aria-label="Show sample format labels"><FilePieChart className="size-3.5" /></button>
        </div>
      </div>

      <div className="flex gap-3 border border-[#2A2A2A] bg-black/20 p-3"><Info className="mt-0.5 size-4 shrink-0 text-primary" /><p className="text-[9px] leading-relaxed text-slate-500">These numbers describe hard-coded interface samples. They do not represent uploaded, stored, protected, or analyzed user files.</p></div>

      <div className="relative h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={56} outerRadius={78} paddingAngle={5} dataKey="value" nameKey="name">
              {data.map((entry) => <Cell key={entry.name} fill={entry.color} stroke="#141414" strokeWidth={3} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><span className="font-mono text-[8px] uppercase tracking-wider text-slate-600">Total Samples</span><strong className="mt-1 block font-display text-4xl font-normal text-white">{total}</strong></div></div>
      </div>

      <div className="grid grid-cols-3 gap-px border border-[#2A2A2A] bg-[#2A2A2A]">
        {data.map((item) => (
          <div key={item.name} className="min-w-0 bg-[#141414] p-3"><span className="mb-2 block size-2" style={{ backgroundColor: item.color }} /><span className="block truncate text-[8px] font-bold uppercase tracking-wider text-slate-500">{item.name}</span><strong className="mt-1 block font-mono text-xs text-white">{item.value}</strong></div>
        ))}
      </div>
    </section>
  );
};

export default DocumentStats;
