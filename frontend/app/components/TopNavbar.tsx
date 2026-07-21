import React from 'react';
import { Search, Bell, Activity, Wifi } from 'lucide-react';

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[linear-gradient(90deg,rgba(2,6,23,0.96),rgba(2,6,23,0.88))] px-4 backdrop-blur-xl sm:px-6">
      <div className="relative w-full max-w-xs sm:w-64">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
          <Search className="h-4 w-4" />
        </span>
        <input
          type="text"
          placeholder="Search suspects, FIRs..."
          className="w-full rounded-xl border border-slate-800/80 bg-slate-900/70 py-2 pl-9 pr-4 text-xs text-slate-300 placeholder-slate-500 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
        <div className="hidden items-center space-x-1.5 rounded-full border border-slate-800/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.9))] px-3 py-1 font-mono text-[11px] text-slate-400 shadow-[0_10px_25px_-18px_rgba(16,185,129,0.5)] md:flex">
          <Wifi className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
          <span>GRID SYNC: ONLINE</span>
        </div>

        <button className="relative rounded-lg border border-slate-800/80 bg-slate-900/70 p-1.5 text-slate-400 transition hover:border-slate-700 hover:bg-slate-800 hover:text-slate-200" type="button" aria-label="Notifications">
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 animate-ping"></span>
        </button>

        <div className="flex items-center space-x-1 rounded-lg border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold font-mono text-blue-400 shadow-[0_10px_24px_-18px_rgba(37,99,235,0.6)]">
          <Activity className="h-3 w-3" />
          <span>CPU: 18%</span>
        </div>
      </div>
    </header>
  );
}
