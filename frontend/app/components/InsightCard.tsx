import React from 'react';
import { ShieldAlert, AlertTriangle, Brain, Flame } from 'lucide-react';

interface InsightCardProps {
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
  type: 'warning' | 'critical' | 'prediction' | 'alert';
}

export default function InsightCard({ title, description, confidence, timestamp, type }: InsightCardProps) {
  let badgeColor = '';
  let IconComponent = Brain;

  switch (type) {
    case 'critical':
      badgeColor = 'border border-red-500/30 bg-red-500/15 text-red-400';
      IconComponent = Flame;
      break;
    case 'warning':
      badgeColor = 'border border-amber-500/30 bg-amber-500/15 text-amber-400';
      IconComponent = AlertTriangle;
      break;
    case 'prediction':
      badgeColor = 'border border-blue-500/30 bg-blue-500/15 text-blue-400';
      IconComponent = Brain;
      break;
    case 'alert':
      badgeColor = 'border border-purple-500/30 bg-purple-500/15 text-purple-400';
      IconComponent = ShieldAlert;
      break;
  }

  return (
    <div className="panel-surface panel-surface-hover flex flex-col space-y-2.5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <IconComponent className={`h-4 w-4 ${
            type === 'critical' ? 'text-red-400' :
            type === 'warning' ? 'text-amber-400' :
            type === 'prediction' ? 'text-blue-400' : 'text-purple-400'
          }`} />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{title}</span>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${badgeColor}`}>
          {type}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-400">{description}</p>

      <div className="flex items-center justify-between pt-1 font-mono text-[11px]">
        <div className="flex w-2/3 items-center space-x-2">
          <span className="text-slate-500">Confidence:</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className={`h-full rounded-full ${
                confidence >= 90 ? 'bg-emerald-500' :
                confidence >= 80 ? 'bg-blue-500' : 'bg-amber-500'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
          <span className="font-semibold text-slate-300">{confidence}%</span>
        </div>
        <span className="text-slate-500">{timestamp}</span>
      </div>
    </div>
  );
}
