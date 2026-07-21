"use client";
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DollarSign, AlertTriangle, Bot, X, Search, Building2, CreditCard, ArrowRight } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChartContainer from '../components/ChartContainer';
import TableContainer from '../components/TableContainer';
import ChatInterface from '../components/ChatInterface';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const kpis = [
  { title: 'Suspicious Transactions', value: '2,481', change: '+18.4%', isPositive: false, icon: 'AlertTriangle' },
  { title: 'Total Illicit Flow Est.', value: '₹482 Cr', change: '+12.1%', isPositive: false, icon: 'DollarSign' },
  { title: 'Shell Companies Flagged', value: '38', change: '+5', isPositive: false, icon: 'Building2' },
  { title: 'Accounts Frozen', value: '14', change: '+2', isPositive: true, icon: 'CreditCard' },
];

const moneyFlowTrend = [
  { month: 'Jan', flow: 28 }, { month: 'Feb', flow: 34 }, { month: 'Mar', flow: 44 },
  { month: 'Apr', flow: 52 }, { month: 'May', flow: 68 }, { month: 'Jun', flow: 74 }, { month: 'Jul', flow: 82 },
];

const transactions = [
  { id: 'TXN-9901', amount: '₹18,40,000', from: 'Shell Acc #4492', to: 'Overseas Wire — Dubai', date: '2026-07-20', status: 'Flagged', risk: 'Critical' },
  { id: 'TXN-9889', amount: '₹4,20,000', from: 'B. Kumar Pvt Ltd', to: 'Shell Acc #4492', date: '2026-07-19', status: 'Under Review', risk: 'High' },
  { id: 'TXN-9876', amount: '₹9,80,000', from: 'Narco Fund Bearer', to: 'Port Import Invoice', date: '2026-07-18', status: 'Flagged', risk: 'Critical' },
  { id: 'TXN-9855', amount: '₹1,10,000', from: 'Anonymous Cash Deposit', to: 'Temp Account #8891', date: '2026-07-17', status: 'Monitoring', risk: 'Medium' },
  { id: 'TXN-9840', amount: '₹62,000', from: 'Property Holdings GHI', to: 'X Corp (Singapore)', date: '2026-07-16', status: 'Under Review', risk: 'High' },
];

const shellCompanies = [
  { name: 'TechGlobe Solutions Pvt Ltd', regNo: 'CIN-001928', director: 'R. "Bhai" Singh (nominee)', links: 'Shell Acc #4492, FIR-8891', risk: 'Critical' },
  { name: 'B. Kumar Pvt Ltd', regNo: 'CIN-004412', director: 'B. Kumar (alias Raman)', links: 'TXN-9889', risk: 'High' },
  { name: 'Property Holdings GHI', regNo: 'CIN-009120', director: 'Unknown Beneficiary', links: 'X Corp Singapore', risk: 'High' },
];

const bankAccounts = [
  { account: '****4492', bank: 'National Bank West', type: 'Shell', balance: '₹48.2L', status: 'Frozen', linked: 'R. Singh' },
  { account: '****8891', bank: 'Central Cooperative', type: 'Temp', balance: '₹1.1L', status: 'Monitoring', linked: 'Anonymous' },
  { account: '****1203', bank: 'Port Finance Hub', type: 'Corporate', balance: '₹9.8L', status: 'Under Review', linked: 'Narco Fund Bearer' },
];

const riskBadge: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const statusBadge: Record<string, string> = {
  Flagged: 'bg-red-500/10 text-red-400 border-red-500/20',
  'Under Review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Monitoring: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Frozen: 'bg-red-600/20 text-red-300 border-red-600/20',
};

export default function FinancialPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'transactions' | 'shells' | 'accounts'>('transactions');

  const filteredTxns = transactions.filter(t =>
    t.id.toLowerCase().includes(search.toLowerCase()) ||
    t.from.toLowerCase().includes(search.toLowerCase()) ||
    t.to.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-700/50 mb-1">
                <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                FINANCIAL INTELLIGENCE UNIT
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Financial Crime & Money Laundering Tracker</h1>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Money Flow Trend */}
            <ChartContainer title="Illicit Money Flow Trend (Crore INR)" subtitle="Monthly estimated volume of suspicious financial transactions detected">
              <div className="h-52 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moneyFlowTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit=" Cr" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }} formatter={(v: any) => [`₹${v} Cr`, 'Illicit Flow']} />
                    <Line type="monotone" dataKey="flow" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            {/* Tabs: Transactions / Shells / Accounts */}
            <div className="panel-surface space-y-4 p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex border-b border-slate-800 w-full">
                  {(['transactions', 'shells', 'accounts'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition ${activeTab === tab ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
                      {tab === 'shells' ? 'Shell Companies' : tab === 'accounts' ? 'Bank Accounts' : 'Suspicious Transactions'}
                    </button>
                  ))}
                  <div className="flex-1 flex justify-end items-center pb-1">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="bg-slate-950 border border-slate-800 rounded pl-7 pr-3 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36" />
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                {activeTab === 'transactions' && (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                          <th className="py-2 px-3">TXN ID</th>
                          <th className="py-2 px-3">Amount</th>
                          <th className="py-2 px-3">From</th>
                          <th className="py-2 px-3"></th>
                          <th className="py-2 px-3">To</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Status</th>
                          <th className="py-2 px-3">Risk</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {filteredTxns.map(t => (
                          <tr key={t.id} className="hover:bg-slate-800/30 transition cursor-pointer">
                            <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{t.id}</td>
                            <td className="py-3 px-3 font-semibold text-white">{t.amount}</td>
                            <td className="py-3 px-3 text-slate-400 max-w-[120px] truncate">{t.from}</td>
                            <td className="py-3 px-1"><ArrowRight className="w-3 h-3 text-slate-600" /></td>
                            <td className="py-3 px-3 text-slate-400 max-w-[120px] truncate">{t.to}</td>
                            <td className="py-3 px-3 text-slate-500 font-mono text-[10px]">{t.date}</td>
                            <td className="py-3 px-3"><span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${statusBadge[t.status]}`}>{t.status}</span></td>
                            <td className="py-3 px-3"><span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${riskBadge[t.risk]}`}>{t.risk}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Shell Companies */}
                {activeTab === 'shells' && (
                  <div className="w-full space-y-3">
                    {shellCompanies.map(s => (
                      <div key={s.regNo} className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-slate-700 transition">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3">
                            <Building2 className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-white">{s.name}</p>
                              <p className="text-[11px] text-slate-500 font-mono mt-0.5">CIN: {s.regNo}</p>
                              <p className="text-[11px] text-slate-400 mt-1">Director: {s.director}</p>
                              <p className="text-[11px] text-blue-400 mt-0.5">Links: {s.links}</p>
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${riskBadge[s.risk]}`}>{s.risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bank Accounts */}
                {activeTab === 'accounts' && (
                  <div className="w-full space-y-3">
                    {bankAccounts.map(a => (
                      <div key={a.account} className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg hover:border-slate-700 transition flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="w-4 h-4 text-slate-500 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-white font-mono">{a.account}</p>
                            <p className="text-[11px] text-slate-400">{a.bank} · {a.type}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Linked to: {a.linked}</p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs font-semibold text-white">{a.balance}</p>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${statusBadge[a.status]}`}>{a.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
