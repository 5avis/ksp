"use client";
import React, { useState } from 'react';
import { Search, Bot, UserCheck, Eye, ShieldAlert, MapPin, AlertCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChatInterface from '../components/ChatInterface';

const offenderKPIs = [
  { title: 'Warrant Watchlist', value: '142', change: '+12', isPositive: false, icon: 'AlertTriangle' },
  { title: 'Currently In Custody', value: '482', change: '+4', isPositive: true, icon: 'Shield' },
  { title: 'Parole Violators', value: '18', change: '-2', isPositive: true, icon: 'Clock' },
  { title: 'Facial Matches Today', value: '5 Logs', change: '100% ver.', isPositive: true, icon: 'CheckCircle' },
];

const offendersList = [
  { id: 'OFF-0041', name: 'Vikram Sharma', alias: 'Vicky', crime: 'Cyber Extortion & Fraud', status: 'Parole Violator', location: 'Metro Station Gate 3', match: '99.1%', initial: 'VS', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'OFF-0109', name: 'R. Singh', alias: 'Bhai', crime: 'Organized Armed Syndicate', status: 'At Large', location: 'Warehouse Sector 18', match: '94.6%', initial: 'RS', gradient: 'from-red-500 to-rose-600' },
  { id: 'OFF-0220', name: 'Ankita Sen', alias: 'Shadow', crime: 'High-Tech Money Laundering', status: 'At Large', location: 'Financial District D-1', match: '88.2%', initial: 'AS', gradient: 'from-cyan-500 to-blue-500' },
  { id: 'OFF-0078', name: 'Mohammed Ali', alias: 'Haji', crime: 'Smuggling & Contraband', status: 'In Custody', location: 'Port Detention Center', match: 'N/A', initial: 'MA', gradient: 'from-slate-500 to-slate-700' },
  { id: 'OFF-0112', name: 'K. Deshmukh', alias: 'Racer', crime: 'Organized Vehicle Theft', status: 'Under Parole', location: 'North District Suburbs', match: '82.4%', initial: 'KD', gradient: 'from-amber-500 to-orange-500' },
  { id: 'OFF-0314', name: 'Siddharth Rao', alias: 'Techie', crime: 'Infrastructure Cyber Intrusion', status: 'At Large', location: 'Unknown (IP Spoofed)', match: '78.5%', initial: 'SR', gradient: 'from-emerald-500 to-teal-500' },
];

export default function OffendersPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOffenders = offendersList.filter(off => {
    const matchesSearch = off.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          off.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          off.crime.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || off.status === filterStatus;
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950 text-purple-400 border border-purple-700/50">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                    DOSSIER ARCHIVES ACTIVE
                  </span>
                  <span className="text-xs text-slate-400">| Facial Recognition nodes: 124 connected</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                  Repeat Offender Records & Profiles
                </h1>
              </div>
            </div>

            {/* SECTION 1: Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offenderKPIs.map((kpi, idx) => (
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

            {/* SECTION 2: Filters */}
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
                    placeholder="Search by offender name, alias, primary crime classification..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                <div className="flex items-center space-x-3 shrink-0">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="At Large">At Large</option>
                    <option value="In Custody">In Custody</option>
                    <option value="Parole Violator">Parole Violator</option>
                    <option value="Under Parole">Under Parole</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 3: Offender Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffenders.map((off) => (
                <div
                  key={off.id}
                  className="panel-surface panel-surface-hover group relative flex flex-col justify-between space-y-4 overflow-hidden p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${off.gradient} flex items-center justify-center font-bold text-white text-base shadow-inner group-hover:scale-105 transition-transform`}>
                        {off.initial}
                      </div>
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <h4 className="font-bold text-white text-sm">{off.name}</h4>
                          <span className="text-[11px] text-slate-500">({off.alias})</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-550 block mt-0.5">{off.id}</span>
                      </div>
                    </div>

                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                      off.status === 'At Large'
                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                        : off.status === 'Parole Violator'
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                        : off.status === 'In Custody'
                        ? 'bg-slate-800 text-slate-400 border-transparent'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {off.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Primary Classification:</span>
                      <span className="text-slate-300 font-medium">{off.crime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Last Spotted Area:</span>
                      <span className="text-slate-350 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-500" />
                        {off.location}
                      </span>
                    </div>
                    {off.match !== 'N/A' && (
                      <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850 mt-1">
                        <span className="text-[11px] text-slate-500 flex items-center">
                          <UserCheck className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
                          Facial Match Confidence
                        </span>
                        <span className="font-mono text-[11px] font-bold text-emerald-400">{off.match}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => alert(`Opening criminal background dossier for ${off.name}`)}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-semibold font-mono transition flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VERIFY DOSSIER</span>
                  </button>
                </div>
              ))}
              {filteredOffenders.length === 0 && (
                <div className="col-span-full bg-slate-900/20 border border-slate-800 border-dashed rounded-xl p-12 text-center text-slate-500 text-xs">
                  No offenders match the query filter.
                </div>
              )}
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
