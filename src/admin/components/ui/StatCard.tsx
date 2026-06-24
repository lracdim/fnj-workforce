import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  accent?: boolean;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp = true, accent = false }: StatCardProps) {
  return (
    <div className={`rounded-xl border p-6 flex flex-col gap-4 ${accent ? 'bg-[#0E5C3F] border-[#073D29]' : 'bg-white border-[#E4E0D8]'}`}>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? 'text-white/60' : 'text-[#6B7280]'}`}>
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ? 'bg-white/10' : 'bg-[#F9F8F5]'}`}>
          <Icon size={18} className={accent ? 'text-white' : 'text-[#0E5C3F]'} />
        </div>
      </div>
      <div>
        <span className={`text-3xl font-black leading-none ${accent ? 'text-white' : 'text-[#16201C]'}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-xs ml-2 font-medium ${accent ? 'text-white/60' : trendUp ? 'text-green-600' : 'text-red-500'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
    </div>
  );
}