import React from 'react';
import * as Icons from 'lucide-react';

interface StatisticCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export default function StatisticCard({ title, value, change, isPositive, icon }: StatisticCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  return (
    <div className="panel-surface panel-surface-hover group flex flex-col justify-between p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{title}</span>
        <div className={`rounded-xl border p-2.5 transition-transform duration-200 group-hover:scale-110 ${
          isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
        }`}>
          <IconComponent className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-2xl font-semibold tracking-tight text-white">{value}</span>
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium shadow-[0_10px_25px_-18px_rgba(15,23,42,0.9)] ${
          isPositive ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' : 'border-red-500/20 bg-red-500/10 text-red-400'
        }`}>
          {change}
        </span>
      </div>
    </div>
  );
}
