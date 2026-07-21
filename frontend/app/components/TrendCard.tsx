import React from 'react';

interface TrendCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export default function TrendCard({ title, value, change, isPositive }: TrendCardProps) {
  return (
    <div className="panel-surface panel-surface-hover p-5">
      <span className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">{title}</span>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-xl font-semibold text-white">{value}</span>
        <span className={`text-xs font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}
