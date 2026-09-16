'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

// Setoran Sampah Data
const setoranData = [
  { name: '16 Agu', value: 18.2 },
  { name: '17 Agu', value: 22.7 },
  { name: '18 Agu', value: 19.5 },
  { name: '19 Agu', value: 24.8 },
  { name: '20 Agu', value: 21.1 },
  { name: '21 Agu', value: 25.3 },
  { name: '22 Agu', value: 26.6 },
];

// Komposisi Jenis Sampah
const komposisiData = [
  { name: 'Plastik', value: 45.6, percentage: '28,9%' },
  { name: 'Kertas', value: 40.1, percentage: '25,4%' },
  { name: 'Organik', value: 28.8, percentage: '18,2%' },
  { name: 'Kaca', value: 21.3, percentage: '13,5%' },
  { name: 'Logam', value: 12.4, percentage: '7,8%' },
  { name: 'Lainnya', value: 9.8, percentage: '6,2%' },
];

const KOMPOSISI_COLORS = ['#3b82f6', '#f59e0b', '#22c55e', '#6366f1', '#64748b', '#94a3b8'];

// Poin Data
const poinData = [
  { name: '16 Agu', value: 48 },
  { name: '17 Agu', value: 56 },
  { name: '18 Agu', value: 42 },
  { name: '19 Agu', value: 68 },
  { name: '20 Agu', value: 51 },
  { name: '21 Agu', value: 59 },
  { name: '22 Agu', value: 78 },
];

// Custom tooltip for bar chart
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-gray-900 px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-bold text-white">{payload[0].value}</p>
      </div>
    );
  }
  return null;
}

// Custom rounded bar shape
function RoundedBar(props: { x?: number; y?: number; width?: number; height?: number; fill?: string }) {
  const { x = 0, y = 0, width = 0, height = 0, fill } = props;
  const radius = 4;
  if (height <= 0) return null;
  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} rx={radius} ry={radius} />
  );
}

export function SetoranChart() {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-3 sm:p-4 lg:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800">Grafik Setoran Sampah (kg)</h3>
        <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap">
          7 Hari Terakhir
          <ChevronDown className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
        </button>
      </div>

      <div className="h-[150px] sm:h-[180px] lg:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={setoranData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="setoranGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                <stop offset="100%" stopColor="#16a34a" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(22, 163, 74, 0.05)' }} />
            <Bar dataKey="value" fill="url(#setoranGradient)" shape={<RoundedBar />} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-8 mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Total Berat</p>
          <p className="text-sm sm:text-base font-bold text-gray-800">186,4 kg</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Rata-rata per Hari</p>
          <p className="text-sm sm:text-base font-bold text-gray-800">26,6 kg</p>
        </div>
      </div>
    </div>
  );
}

export function KomposisiChart() {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-3 sm:p-4 lg:p-5 shadow-sm">
      <div className="mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800">Komposisi Jenis Sampah (kg)</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <div className="h-[140px] sm:h-[160px] lg:h-[180px] w-[140px] sm:w-[160px] lg:w-[180px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={komposisiData}
                cx="50%"
                cy="50%"
                innerRadius={35}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {komposisiData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={KOMPOSISI_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1">
          {komposisiData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
              <span
                className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: KOMPOSISI_COLORS[index] }}
              />
              <span className="text-gray-600 flex-1 min-w-0">{item.name}</span>
              <span className="font-semibold text-gray-800 whitespace-nowrap text-[9px] sm:text-[10px]">{item.value} kg ({item.percentage})</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-3 border-t border-gray-100">
        <p className="text-[10px] sm:text-xs text-gray-400">
          Total: <span className="font-bold text-gray-800">158,2 kg</span>
        </p>
      </div>
    </div>
  );
}

export function PoinChart() {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200/80 p-3 sm:p-4 lg:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
        <h3 className="text-xs sm:text-sm font-bold text-gray-800">
          Poin Diberikan <span className="text-gray-400 font-normal text-[10px] sm:text-xs">(7 Hari Terakhir)</span>
        </h3>
        <button className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 sm:px-2.5 py-1 sm:py-1.5 text-[11px] sm:text-xs text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap">
          7 Hari Terakhir
          <ChevronDown className="h-2.5 sm:h-3 w-2.5 sm:w-3" />
        </button>
      </div>

      <div className="h-[150px] sm:h-[180px] lg:h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={poinData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="poinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
            <Bar dataKey="value" fill="url(#poinGradient)" shape={<RoundedBar />} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 lg:gap-8 mt-2 sm:mt-3 lg:mt-4 pt-2 sm:pt-3 lg:pt-3 border-t border-gray-100">
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Total Poin</p>
          <p className="text-sm sm:text-base font-bold text-gray-800">362 poin</p>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs text-gray-400 mb-0.5">Rata-rata per Hari</p>
          <p className="text-sm sm:text-base font-bold text-gray-800">51,7 poin</p>
        </div>
      </div>
    </div>
  );
}
