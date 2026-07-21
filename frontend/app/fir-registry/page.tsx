"use client";
import React, { useState } from 'react';
import { Search, Filter, Bot, ExternalLink, ShieldAlert, CheckCircle, FileText, Download } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import TableContainer from '../components/TableContainer';
import ChatInterface from '../components/ChatInterface';

const firKPIs = [
  { title: 'Total Registered FIRs', value: '14,289', change: '+5.2%', isPositive: false, icon: 'FileText' },
  { title: 'Pending Charge Sheets', value: '912', change: '-4.6%', isPositive: true, icon: 'Clock' },
  { title: 'Under Investigation', value: '1,842', change: '-2.4%', isPositive: true, icon: 'Users' },
  { title: 'Evidence Match Index', value: '94.2%', change: '+3.1%', isPositive: true, icon: 'CheckCircle' },
];

const initialFIRs = [
  { fir: 'FIR-2026-8891', crime: 'Armed Robbery', district: 'Central Metro', officer: 'Insp. R. Rathore', status: 'Active Investigation', date: '2026-07-20', severity: 'High' },
  { fir: 'FIR-2026-8890', crime: 'Cyber Extortion', district: 'Cyber Cell East', officer: 'Sub-Insp. A. Sharma', status: 'Forensics Review', date: '2026-07-20', severity: 'Critical' },
  { fir: 'FIR-2026-8889', crime: 'Vehicle Theft', district: 'North District', officer: 'Insp. T. Deshmukh', status: 'Suspect Identified', date: '2026-07-19', severity: 'Medium' },
  { fir: 'FIR-2026-8888', crime: 'Narcotics Trafficking', district: 'Port Zone', officer: 'ACP K. Varma', status: 'Charge Sheet Filed', date: '2026-07-19', severity: 'Critical' },
  { fir: 'FIR-2026-8887', crime: 'Assault & Battery', district: 'South West', officer: 'Insp. M. Ali', status: 'Court Proceedings', date: '2026-07-18', severity: 'Low' },
  { fir: 'FIR-2026-8886', crime: 'Corporate Embezzlement', district: 'Financial Crime Cell', officer: 'ACP V. Reddy', status: 'Active Investigation', date: '2026-07-17', severity: 'High' },
  { fir: 'FIR-2026-8885', crime: 'IP Spoofing & Phishing', district: 'Cyber Cell East', officer: 'Sub-Insp. A. Sharma', status: 'Forensics Review', date: '2026-07-16', severity: 'Medium' },
  { fir: 'FIR-2026-8884', crime: 'Illegal Assembly', district: 'South West', officer: 'Insp. M. Ali', status: 'Case Solved', date: '2026-07-15', severity: 'Low' },
];

export default function FirRegistryPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFIR, setSelectedFIR] = useState<any>(null);

  const filteredFIRs = initialFIRs.filter(fir => {
    const matchesSearch = fir.fir.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fir.crime.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fir.officer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || fir.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />

          <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-700/50">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    REGISTRY ONLINE
                  </span>
                  <span className="text-xs text-slate-400">| National Crime Database Sync: 99.9%</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                  National FIR Registry & Case Logs
                </h1>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => alert("Downloading registry dump...")}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition shadow-sm flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Registry (CSV)</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {firKPIs.map((kpi, idx) => (
                <StatisticCard
                  key={idx}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  isPositive={kpi.isPositive}
                  icon={kpi.icon}
                />
              ))}
            </section>

            {/* SECTION 2: Advanced Search & Filter */}
            <section className="panel-surface space-y-4 p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by FIR #, crime classification, or investigating officer..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span>STATUS:</span>
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="All">All Case Statuses</option>
                    <option value="Active Investigation">Active Investigation</option>
                    <option value="Forensics Review">Forensics Review</option>
                    <option value="Suspect Identified">Suspect Identified</option>
                    <option value="Charge Sheet Filed">Charge Sheet Filed</option>
                    <option value="Court Proceedings">Court Proceedings</option>
                    <option value="Case Solved">Case Solved</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 3: Main Table Registry */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 flex flex-col">
                <TableContainer
                  title="Filterable Case Registry Records"
                  subtitle={`Displaying ${filteredFIRs.length} records matching current filters`}
                >
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase bg-slate-900/50">
                          <th className="py-3 px-4 font-semibold">FIR #</th>
                          <th className="py-3 px-4 font-semibold">Classification</th>
                          <th className="py-3 px-4 font-semibold">District</th>
                          <th className="py-3 px-4 font-semibold">Officer</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                        {filteredFIRs.map((row) => (
                          <tr
                            key={row.fir}
                            onClick={() => setSelectedFIR(row)}
                            className={`hover:bg-slate-850/40 cursor-pointer transition-colors ${
                              selectedFIR?.fir === row.fir ? 'bg-blue-600/5 border-l-2 border-l-blue-500' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4 font-mono font-medium text-blue-400">{row.fir}</td>
                            <td className="py-3.5 px-4 font-medium text-white">{row.crime}</td>
                            <td className="py-3.5 px-4 text-slate-400">{row.district}</td>
                            <td className="py-3.5 px-4 text-slate-300">{row.officer}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                                  row.status === 'Active Investigation'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : row.status === 'Charge Sheet Filed'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : row.status === 'Suspect Identified'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : row.status === 'Case Solved'
                                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{row.date}</td>
                          </tr>
                        ))}
                        {filteredFIRs.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                              No records match the current filter criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TableContainer>
              </div>

              {/* Side Detail Card */}
              <div className="panel-surface flex flex-col justify-between p-5">
                {selectedFIR ? (
                  <div className="space-y-5 animate-fade-in flex flex-col h-full justify-between">
                    <div>
                      <div className="border-b border-slate-800 pb-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-400">{selectedFIR.fir}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            selectedFIR.severity === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            selectedFIR.severity === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {selectedFIR.severity} Priority
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base mt-2">{selectedFIR.crime}</h3>
                        <p className="text-xs text-slate-550 font-mono mt-0.5">Registered: {selectedFIR.date}</p>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Jurisdiction:</span>
                          <span className="text-slate-300 font-semibold">{selectedFIR.district}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Officer Assigned:</span>
                          <span className="text-slate-350">{selectedFIR.officer}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Current Progress:</span>
                          <span className="text-slate-300 font-semibold">{selectedFIR.status}</span>
                        </div>
                        <div className="pt-3 border-t border-slate-800 space-y-1.5">
                          <span className="text-slate-500 font-semibold block">Case Summary Brief:</span>
                          <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-850">
                            Telemetry indicates potential linkage with local syndicates. Surveillance logs and forensics review are ongoing. Subpoena requests for network headers submitted.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Opening official dossier window for ${selectedFIR.fir}`)}
                      className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Open Dossier Details</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                    <FileText className="w-10 h-10 text-slate-600 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-400">No FIR Selected</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-normal max-w-[200px] mx-auto">
                        Click on any FIR row in the database registry to view full intelligence briefings and details.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>

        {/* FLOATING BUTTON: Ask Crime AI */}
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl border border-blue-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <Bot className="w-6 h-6 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide font-semibold">Ask Crime AI</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </button>
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsChatOpen(false)}
            ></div>

            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">Crime Intelligence Assistant</h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded font-mono text-base"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-hidden p-6 bg-slate-950 flex flex-col">
                <ChatInterface />
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
