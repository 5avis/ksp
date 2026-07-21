"use client";
import React, { useState } from 'react';
import {
  Search, CheckCircle2, Clock, AlertCircle, FileText, Users, Camera,
  Fingerprint, MessageSquare, Bot, X, Plus, ChevronDown
} from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChatInterface from '../components/ChatInterface';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const cases = [
  { id: 'FIR-2026-8891', crime: 'Armed Robbery', district: 'Central Metro', status: 'Active Investigation', severity: 'High', date: '2026-07-20' },
  { id: 'FIR-2026-8890', crime: 'Cyber Extortion', district: 'Cyber Cell East', status: 'Forensics Review', severity: 'Critical', date: '2026-07-20' },
  { id: 'FIR-2026-8889', crime: 'Vehicle Theft', district: 'North District', status: 'Suspect Identified', severity: 'Medium', date: '2026-07-19' },
  { id: 'FIR-2026-8888', crime: 'Narcotics Trafficking', district: 'Port Zone', status: 'Charge Sheet Filed', severity: 'Critical', date: '2026-07-19' },
  { id: 'FIR-2026-8887', crime: 'Assault & Battery', district: 'South West', status: 'Court Proceedings', severity: 'Low', date: '2026-07-18' },
];

const timelines: Record<string, { stage: string; detail: string; date: string; status: string }[]> = {
  'FIR-2026-8891': [
    { stage: 'FIR Registered', detail: 'Case officially logged in Crime & Criminal Tracking Network (CCTN).', date: 'July 20, 08:30 AM', status: 'completed' },
    { stage: 'Scene Evidence', detail: 'CCTV recovered from 4 intersections; bullet casing ballistic analysis pending.', date: 'July 20, 11:15 AM', status: 'completed' },
    { stage: 'Witness Statements', detail: 'Primary statement from bank guard and 2 civilian witnesses recorded.', date: 'July 20, 02:00 PM', status: 'completed' },
    { stage: 'Forensics Analysis', detail: 'AI fingerprint enhancement matched to Syndicate-B database partially.', date: 'In Progress', status: 'active' },
    { stage: 'Arrest', detail: 'SWAT team deployed to suspected hideout in Sector 18.', date: 'Pending', status: 'pending' },
    { stage: 'Charge Sheet', detail: 'Drafting prosecution dossier under BNSS Section 309.', date: 'Pending', status: 'pending' },
    { stage: 'Court Proceedings', detail: 'Fast-track sessions court assignment pending arrest.', date: 'Pending', status: 'pending' },
  ],
  'FIR-2026-8890': [
    { stage: 'FIR Registered', detail: 'Cyber extortion complaint filed against unknown IP.', date: 'July 20, 09:00 AM', status: 'completed' },
    { stage: 'IP Tracing', detail: 'Routing through 3 VPN layers traced to eastern European server.', date: 'July 20, 01:00 PM', status: 'completed' },
    { stage: 'Forensics', detail: 'Malware signature analysis running on seized device.', date: 'In Progress', status: 'active' },
    { stage: 'Interpol Alert', detail: 'International cooperation request filed.', date: 'Pending', status: 'pending' },
  ],
};

const evidence: Record<string, { id: string; type: string; desc: string; icon: any }[]> = {
  'FIR-2026-8891': [
    { id: 'EV-001', type: 'CCTV Footage', desc: '4 camera recordings, 2h 15m total. Timestamps: 08:12–10:27 AM.', icon: Camera },
    { id: 'EV-002', type: 'Ballistic Sample', desc: '.38 cal brass casing; rifling analysis match pending lab.', icon: Fingerprint },
    { id: 'EV-003', type: 'Witness Statement', desc: 'Sworn statement from security officer on duty.', icon: MessageSquare },
    { id: 'EV-004', type: 'Financial Records', desc: 'Bank transaction logs showing pre-crime recon withdrawals.', icon: FileText },
  ],
  'FIR-2026-8890': [
    { id: 'EV-005', type: 'Malware Sample', desc: 'Trojan.Spy variant recovered from victim device.', icon: FileText },
    { id: 'EV-006', type: 'Server Logs', desc: 'Encrypted request chain with TOR exit node metadata.', icon: Fingerprint },
  ],
};

const officers: Record<string, { name: string; rank: string; badge: string; role: string }[]> = {
  'FIR-2026-8891': [
    { name: 'Insp. R. Rathore', rank: 'Inspector', badge: 'B-4421', role: 'Lead Investigator' },
    { name: 'Sub-Insp. A. Patel', rank: 'Sub-Inspector', badge: 'B-5890', role: 'Forensics Liaison' },
    { name: 'ACP K. Varma', rank: 'ACP', badge: 'A-0012', role: 'Supervisor' },
  ],
  'FIR-2026-8890': [
    { name: 'Sub-Insp. A. Sharma', rank: 'Sub-Inspector', badge: 'B-6610', role: 'Lead Investigator' },
    { name: 'Cyber Analyst T. Rao', rank: 'Technical Expert', badge: 'CE-099', role: 'Forensic Analyst' },
  ],
};

const kpis = [
  { title: 'Total Active Cases', value: '1,842', change: '-2.4%', isPositive: true, icon: 'FileText' },
  { title: 'Awaiting Charge Sheet', value: '312', change: '+8', isPositive: false, icon: 'Clock' },
  { title: 'Evidence Items Logged', value: '9,240', change: '+142', isPositive: true, icon: 'Database' },
  { title: 'Avg. Resolution (days)', value: '28.4', change: '-3.2', isPositive: true, icon: 'CheckCircle' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  'Active Investigation': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Forensics Review': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Suspect Identified': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Charge Sheet Filed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Court Proceedings': 'bg-slate-700/60 text-slate-300 border-slate-700',
};

const severityColors: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low: 'bg-slate-700/40 text-slate-400 border-slate-700',
};

// ─── Component ───────────────────────────────────────────────────────────────
export default function InvestigationsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<string[]>(['Initial scene walkthrough notes logged by Insp. Rathore at 10:00 AM.']);
  const [activeTab, setActiveTab] = useState<'timeline' | 'evidence' | 'officers' | 'notes'>('timeline');

  const filtered = cases.filter(c =>
    c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.crime.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const selected = cases.find(c => c.id === selectedId);

  const addNote = () => {
    if (note.trim()) {
      setNotes(prev => [...prev, note.trim()]);
      setNote('');
    }
  };

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5">
              <div className="flex items-center space-x-2 mb-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-700/50">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  CASE MANAGEMENT SYSTEM
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Case Investigation Board</h1>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Main layout: case list + detail panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Case List */}
              <div className="panel-surface flex flex-col lg:col-span-1">
                <div className="p-4 border-b border-slate-800">
                  <h3 className="font-semibold text-white text-sm mb-3">Case Files</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search cases..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
                  {filtered.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedId(c.id); setActiveTab('timeline'); }}
                      className={`w-full text-left p-4 hover:bg-slate-800/40 transition ${selectedId === c.id ? 'bg-blue-600/5 border-l-2 border-l-blue-500' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs font-bold text-blue-400">{c.id}</p>
                          <p className="font-semibold text-white text-sm mt-0.5">{c.crime}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{c.district}</p>
                        </div>
                        <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${severityColors[c.severity]}`}>{c.severity}</span>
                      </div>
                      <span className={`mt-2 inline-flex text-[10px] px-1.5 py-0.5 rounded border ${statusColors[c.status]}`}>{c.status}</span>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-xs">No matching cases found.</div>
                  )}
                </div>
              </div>

              {/* Detail Panel */}
              <div className="panel-surface flex flex-col lg:col-span-2">
                {!selected ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <FileText className="w-10 h-10 text-slate-700" />
                    <div>
                      <p className="text-slate-400 font-semibold text-sm">No Case Selected</p>
                      <p className="text-slate-600 text-xs mt-1">Select a case from the list to view investigation details.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Detail Header */}
                    <div className="p-5 border-b border-slate-800">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{selected.id}</span>
                            <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${severityColors[selected.severity]}`}>{selected.severity}</span>
                          </div>
                          <h2 className="text-lg font-bold text-white mt-1">{selected.crime}</h2>
                          <p className="text-xs text-slate-400">{selected.district} • Registered: {selected.date}</p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded border ${statusColors[selected.status]}`}>{selected.status}</span>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-slate-800 px-4 shrink-0">
                      {(['timeline', 'evidence', 'officers', 'notes'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-4 py-3 text-xs font-semibold capitalize transition border-b-2 ${
                            activeTab === tab
                              ? 'border-blue-500 text-blue-400'
                              : 'border-transparent text-slate-500 hover:text-slate-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                      {/* Timeline Tab */}
                      {activeTab === 'timeline' && (
                        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                          {(timelines[selected.id] ?? []).map((step, i) => (
                            <div key={i} className="relative">
                              <div className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center bg-slate-950 ${
                                step.status === 'completed' ? 'border-emerald-500' :
                                step.status === 'active' ? 'border-blue-500 animate-pulse' : 'border-slate-700'
                              }`}>
                                {step.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />}
                                {step.status === 'active' && <Clock className="w-2.5 h-2.5 text-blue-400" />}
                                {step.status === 'pending' && <div className="w-1.5 h-1.5 rounded-full bg-slate-700"></div>}
                              </div>
                              <div>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-bold ${step.status === 'active' ? 'text-blue-400' : step.status === 'completed' ? 'text-white' : 'text-slate-500'}`}>{step.stage}</span>
                                  <span className="text-[10px] font-mono text-slate-500">{step.date}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{step.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Evidence Tab */}
                      {activeTab === 'evidence' && (
                        <div className="space-y-3">
                          {(evidence[selected.id] ?? []).map(ev => (
                            <div key={ev.id} className="flex items-start space-x-3 p-4 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-700 transition">
                              <div className="p-2 bg-slate-800 rounded-lg shrink-0">
                                <ev.icon className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-white">{ev.type}</span>
                                  <span className="text-[9px] font-mono text-slate-500">{ev.id}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{ev.desc}</p>
                              </div>
                            </div>
                          ))}
                          {!(evidence[selected.id]?.length) && (
                            <div className="text-center text-slate-600 text-xs py-8">No evidence logged for this case yet.</div>
                          )}
                        </div>
                      )}

                      {/* Officers Tab */}
                      {activeTab === 'officers' && (
                        <div className="space-y-3">
                          {(officers[selected.id] ?? []).map(o => (
                            <div key={o.badge} className="flex items-center space-x-4 p-4 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-700 transition">
                              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                                {o.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-white">{o.name}</p>
                                <p className="text-[11px] text-slate-400">{o.role} • Badge: {o.badge}</p>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-400 rounded">{o.rank}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Notes Tab */}
                      {activeTab === 'notes' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            {notes.map((n, i) => (
                              <div key={i} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg text-xs text-slate-300 leading-relaxed">
                                <span className="text-[10px] font-mono text-slate-600 block mb-1">Note #{i + 1}</span>
                                {n}
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <input
                              value={note}
                              onChange={e => setNote(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && addNote()}
                              placeholder="Add an investigation note..."
                              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              onClick={addNote}
                              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </main>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={() => setIsChatOpen(true)} className="flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl border border-blue-400/30 transition transform hover:-translate-y-0.5 group text-sm">
            <Bot className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span>Ask Crime AI</span>
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span></span>
          </button>
        </div>

        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsChatOpen(false)}></div>
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
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
