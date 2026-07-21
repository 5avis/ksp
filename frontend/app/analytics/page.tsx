"use client";
import React, { useState } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts';
import { Bot, X, Filter } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChartContainer from '../components/ChartContainer';
import ChatInterface from '../components/ChatInterface';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const monthlyTrend = [
  { month: 'Jan', violent: 120, property: 340, cyber: 180, financial: 90 },
  { month: 'Feb', violent: 132, property: 310, cyber: 210, financial: 105 },
  { month: 'Mar', violent: 101, property: 290, cyber: 250, financial: 130 },
  { month: 'Apr', violent: 145, property: 380, cyber: 280, financial: 160 },
  { month: 'May', violent: 160, property: 420, cyber: 310, financial: 190 },
  { month: 'Jun', violent: 138, property: 390, cyber: 350, financial: 210 },
  { month: 'Jul', violent: 155, property: 430, cyber: 390, financial: 240 },
];

const districtData = [
  { district: 'Central Metro', cases: 842 },
  { district: 'North District', cases: 610 },
  { district: 'South West', cases: 530 },
  { district: 'Cyber Cell East', cases: 410 },
  { district: 'Port Zone', cases: 370 },
  { district: 'Financial Cell', cases: 290 },
];

const categoryPie = [
  { name: 'Violent Crime', value: 28 },
  { name: 'Property Crime', value: 35 },
  { name: 'Cyber Fraud', value: 18 },
  { name: 'Financial Crime', value: 10 },
  { name: 'Drug Trafficking', value: 9 },
];
const PIE_COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#a855f7'];

const radarData = [
  { category: 'Violent', A: 120, B: 88 }, { category: 'Property', A: 98, B: 130 },
  { category: 'Cyber', A: 86, B: 100 }, { category: 'Financial', A: 99, B: 80 },
  { category: 'Narcotics', A: 85, B: 90 }, { category: 'Organized', A: 65, B: 75 },
];

const kpis = [
  { title: 'Total Crimes (YTD)', value: '14,289', change: '+5.2%', isPositive: false, icon: 'AlertTriangle' },
  { title: 'Resolved Cases', value: '11,203', change: '+3.6%', isPositive: true, icon: 'CheckCircle' },
  { title: 'Cyber Crime YoY', value: '+38.4%', change: 'Highest Growth', isPositive: false, icon: 'TrendingUp' },
  { title: 'Crime Rate Index', value: '84.6', change: '-2.1 pts', isPositive: true, icon: 'BarChart2' },
];

const TOOLTIP_STYLE = {
  contentStyle: { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' },
};

export default function AnalyticsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('7months');

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400 border border-blue-700/50 mb-1">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  ANALYTICS ENGINE ACTIVE
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">Crime Analytics & Statistical Intelligence</h1>
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="7months">Last 7 Months</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="ytd">Year to Date</option>
                </select>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Row 1: Multi-domain trend line chart */}
            <ChartContainer title="Multi-Domain Crime Vector Trends" subtitle="Tracking violent, property, cyber, and financial crime indices over time">
              <div className="h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip {...TOOLTIP_STYLE} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Line type="monotone" name="Violent" dataKey="violent" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Property" dataKey="property" stroke="#f97316" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Cyber Fraud" dataKey="cyber" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" name="Financial" dataKey="financial" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            {/* Row 2: District bar + Category pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartContainer title="District-wise Case Volume Comparison" subtitle="Total registered FIRs by policing district">
                <div className="h-64 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} horizontal={false} />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis type="category" dataKey="district" stroke="#94a3b8" fontSize={10} tickLine={false} width={110} />
                      <Tooltip {...TOOLTIP_STYLE} />
                      <Bar dataKey="cases" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>

              <ChartContainer title="Crime Category Distribution" subtitle="Proportional breakdown of all registered crime types">
                <div className="h-64 pt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryPie} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={3}>
                        {categoryPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                      </Pie>
                      <Tooltip {...TOOLTIP_STYLE} formatter={(val: any) => [`${val}%`, '']} />
                      <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartContainer>
            </div>

            {/* Row 3: Radar chart */}
            <ChartContainer title="YoY Crime Category Radar Comparison" subtitle="Current year vs prior year crime category index scores">
              <div className="h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={100}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                    <Radar name="Current Year" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Radar name="Prior Year" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.15} />
                    <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                    <Tooltip {...TOOLTIP_STYLE} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

          </main>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={() => setIsChatOpen(true)} className="flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl border border-blue-400/30 transition transform hover:-translate-y-0.5 group text-sm">
            <Bot className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span>Ask Crime AI</span>
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
