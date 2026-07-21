import React from 'react';
import { MapPin, Clock, Send } from 'lucide-react';

interface AlertCardProps {
  title: string;
  severity: 'Critical' | 'High' | 'Medium';
  location: string;
  time: string;
  description: string;
  onDispatch: () => void;
}

export default function AlertCard({ title, severity, location, time, description, onDispatch }: AlertCardProps) {
  let severityBadge = '';
  switch (severity) {
    case 'Critical':
      severityBadge = 'border border-red-500/30 bg-red-500/20 text-red-400';
      break;
    case 'High':
      severityBadge = 'border border-orange-500/30 bg-orange-500/20 text-orange-400';
      break;
    case 'Medium':
      severityBadge = 'border border-amber-500/30 bg-amber-500/20 text-amber-400';
      break;
  }

  return (
    <div className="panel-surface panel-surface-hover group relative flex flex-col space-y-3 overflow-hidden p-4">
      {severity === 'Critical' && (
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-red-600/5 blur-xl transition-transform duration-500 group-hover:scale-125"></div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-500">
            <span className="flex items-center">
              <MapPin className="mr-1 h-3 w-3 text-slate-400" />
              {location}
            </span>
            <span className="flex items-center">
              <Clock className="mr-1 h-3 w-3 text-slate-400" />
              {time}
            </span>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${severityBadge}`}>
          {severity}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-slate-400">{description}</p>

      <div className="flex justify-end pt-1">
        <button
          onClick={onDispatch}
          className="flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold font-mono text-slate-300 transition hover:border-blue-500/40 hover:bg-blue-600 hover:text-white"
          type="button"
        >
          <Send className="h-3 w-3" />
          <span>DISPATCH UNIT</span>
        </button>
      </div>
    </div>
  );
}
