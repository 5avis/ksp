"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield, LayoutDashboard, Map, FileText, Settings, Users, AlertTriangle,
  Bot, BarChart3, Network, DollarSign, TrendingUp, FileBarChart,
  ClipboardList, Search, ChevronLeft, ChevronRight
} from 'lucide-react';

const navGroups = [
  {
    label: 'Operations',
    items: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Case Investigation', path: '/investigations', icon: Search },
      { name: 'Crime Map', path: '/map', icon: Map },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { name: 'AI Crime Assistant', path: '/ai-assistant', icon: Bot },
      { name: 'Crime Analytics', path: '/analytics', icon: BarChart3 },
      { name: 'Criminal Networks', path: '/networks', icon: Network },
      { name: 'Offender Profiles', path: '/offenders', icon: Users },
      { name: 'Financial Crime', path: '/financial', icon: DollarSign },
      { name: 'Crime Forecasting', path: '/forecasting', icon: TrendingUp },
    ],
  },
  {
    label: 'Registry',
    items: [
      { name: 'FIR Registry', path: '/fir-registry', icon: FileText },
      { name: 'Hotspot Map', path: '/hotspots', icon: AlertTriangle },
      { name: 'Emergencies', path: '/emergencies', icon: AlertTriangle },
    ],
  },
  {
    label: 'Administration',
    items: [
      { name: 'Reports', path: '/reports', icon: FileBarChart },
      { name: 'Audit Logs', path: '/audit-logs', icon: ClipboardList },
      { name: 'Settings', path: '/settings', icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} hidden h-full shrink-0 flex-col border-r border-slate-800/80 bg-[linear-gradient(180deg,rgba(2,6,23,0.98),rgba(2,6,23,0.88))] backdrop-blur-xl transition-all duration-300 md:flex`}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-4">
        {!collapsed && (
          <div className="flex min-w-0 items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/10">
              <Shield className="h-4.5 w-4.5 text-blue-400" />
            </div>
            <span className="truncate font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-200">
              Crime Intel
            </span>
          </div>
        )}
        {collapsed && <Shield className="mx-auto h-4.5 w-4.5 text-blue-400" />}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="shrink-0 rounded-lg border border-slate-800 bg-slate-900/70 p-1 text-slate-500 transition hover:border-slate-700 hover:text-slate-200"
          title={collapsed ? 'Expand' : 'Collapse'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          type="button"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <span className="mb-2 block px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.35em] text-slate-500/80">
                {group.label}
              </span>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    title={collapsed ? item.name : undefined}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} rounded-xl border px-2.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? 'border-blue-500/30 bg-blue-500/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15),0_0_0_1px_rgba(37,99,235,0.08)]'
                        : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/70 hover:text-slate-200 hover:shadow-[0_8px_20px_-16px_rgba(37,99,235,0.55)]'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-slate-800/80 p-3">
          <div className="flex items-center space-x-2.5 rounded-xl border border-slate-800/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.9))] px-2.5 py-2.5 shadow-[0_12px_30px_-20px_rgba(37,99,235,0.6)]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-400">
              IO
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold text-slate-200">Officer Rathore</p>
              <p className="truncate font-mono text-[9px] text-slate-500">Central Division</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
