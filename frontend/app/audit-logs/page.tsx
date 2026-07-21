"use client";
import React, { useState } from 'react';
import { ClipboardList, Search, Filter, LogIn, Edit, FileText, AlertTriangle, Trash2, Bot, X, Shield, Eye } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChatInterface from '../components/ChatInterface';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const kpis = [
  { title: 'Audit Events Today', value: '2,841', change: '+4.2%', isPositive: false, icon: 'ClipboardList' },
  { title: 'Unique Officers Active', value: '28', change: '-1', isPositive: true, icon: 'Users' },
  { title: 'Failed Login Attempts', value: '4', change: '0 flags', isPositive: true, icon: 'Shield' },
  { title: 'Case Modifications', value: '138', change: '+22', isPositive: false, icon: 'Edit' },
];

type LogEntry = {
  id: string; officer: string; action: string; target: string;
  ip: string; timestamp: string; type: 'login' | 'edit' | 'view' | 'delete' | 'alert';
};

const allLogs: LogEntry[] = [
  { id: 'LOG-0841', officer: 'ACP K. Varma', action: 'Login successful', target: 'Platform Auth', ip: '192.168.1.12', timestamp: '2026-07-20 23:41:02', type: 'login' },
  { id: 'LOG-0840', officer: 'Insp. R. Rathore', action: 'Modified investigation timeline', target: 'FIR-2026-8891', ip: '192.168.1.18', timestamp: '2026-07-20 23:38:45', type: 'edit' },
  { id: 'LOG-0839', officer: 'Sub-Insp. A. Sharma', action: 'Viewed offender dossier', target: 'OFF-0041 (V. Sharma)', ip: '192.168.1.24', timestamp: '2026-07-20 23:35:10', type: 'view' },
  { id: 'LOG-0838', officer: 'Cyber Analyst T. Rao', action: 'Exported CSV report', target: 'RPT-2026-0088', ip: '10.0.0.9', timestamp: '2026-07-20 23:31:22', type: 'edit' },
  { id: 'LOG-0837', officer: 'Unknown', action: 'Failed login attempt', target: 'Platform Auth', ip: '203.122.41.91', timestamp: '2026-07-20 23:28:00', type: 'alert' },
  { id: 'LOG-0836', officer: 'ACP V. Reddy', action: 'Archived financial case', target: 'FIN-0098', ip: '192.168.1.31', timestamp: '2026-07-20 23:20:14', type: 'delete' },
  { id: 'LOG-0835', officer: 'Insp. T. Deshmukh', action: 'Added evidence item', target: 'FIR-2026-8889', ip: '192.168.1.18', timestamp: '2026-07-20 22:59:32', type: 'edit' },
  { id: 'LOG-0834', officer: 'Insp. R. Rathore', action: 'Dispatched patrol unit', target: 'ALT-901', ip: '192.168.1.18', timestamp: '2026-07-20 22:45:00', type: 'edit' },
  { id: 'LOG-0833', officer: 'Sub-Insp. M. Ali', action: 'Viewed case evidence', target: 'FIR-2026-8887', ip: '192.168.1.42', timestamp: '2026-07-20 22:30:11', type: 'view' },
  { id: 'LOG-0832', officer: 'ACP K. Varma', action: 'Generated monthly report', target: 'RPT-2026-0089', ip: '192.168.1.12', timestamp: '2026-07-20 22:10:00', type: 'edit' },
];

const actionTypeStyles: Record<string, { icon: any; badge: string; label: string }> = {
  login: { icon: LogIn, badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'Login' },
  edit: { icon: Edit, badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Edit' },
  view: { icon: Eye, badge: 'bg-slate-700/40 text-slate-400 border-slate-700', label: 'View' },
  delete: { icon: Trash2, badge: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Delete' },
  alert: { icon: AlertTriangle, badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Alert' },
};

export default function AuditLogsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filtered = allLogs.filter(l => {
    const matchSearch = l.officer.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.target.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || l.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 mb-1">SECURITY AUDIT SYSTEM</span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Platform Audit Logs & Officer Activity</h1>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Filters */}
            <div className="panel-surface flex flex-col gap-3 p-4 md:flex-row md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by officer name, action, or target..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none">
                  <option value="all">All Event Types</option>
                  <option value="login">Login Events</option>
                  <option value="edit">Case Edits</option>
                  <option value="view">View Events</option>
                  <option value="delete">Delete Actions</option>
                  <option value="alert">Security Alerts</option>
                </select>
              </div>
            </div>

            {/* Audit Log Timeline */}
            <div className="panel-surface p-5">
              <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-4">Event Stream ({filtered.length} records)</h3>

              <div className="space-y-2">
                {filtered.map(log => {
                  const meta = actionTypeStyles[log.type];
                  const Icon = meta.icon;
                  return (
                    <div key={log.id} className={`flex items-start space-x-3 p-3.5 rounded-lg border transition hover:bg-slate-800/30 ${log.type === 'alert' ? 'border-orange-500/20 bg-orange-500/5' : 'border-slate-800 bg-slate-950/40'}`}>
                      <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${meta.badge}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span className="text-xs font-semibold text-white">{log.officer}</span>
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${meta.badge} shrink-0`}>{meta.label}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-600 shrink-0">{log.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{log.action}</p>
                        <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-600 font-mono">
                          <span>Target: <span className="text-blue-400">{log.target}</span></span>
                          <span>•</span>
                          <span>IP: {log.ip}</span>
                          <span>•</span>
                          <span>{log.id}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filtered.length === 0 && (
                  <div className="text-center text-slate-600 text-xs py-10">No audit events match the current filter.</div>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={() => setIsChatOpen(true)} className="flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl border border-blue-400/30 transition transform hover:-translate-y-0.5 text-sm">
            <Bot className="w-5 h-5 text-blue-200" /><span>Ask Crime AI</span>
          </button>
        </div>
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <div className="flex items-center space-x-2"><Bot className="w-5 h-5 text-blue-400" /><h3 className="font-bold text-white text-sm">Crime Intelligence Assistant</h3></div>
                <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1 hover:bg-slate-800 rounded"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-hidden p-4 bg-slate-950"><ChatInterface /></div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
