"use client";
import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Bot, Network, ShieldAlert, CheckCircle2, Clock, MapPin, ExternalLink, X } from 'lucide-react';

// Imported existing components
import AppLayout from './components/AppLayout';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import StatisticCard from './components/StatisticCard';
import TrendCard from './components/TrendCard';
import InsightCard from './components/InsightCard';
import AlertCard from './components/AlertCard';
import ChartContainer from './components/ChartContainer';
import MapContainer from './components/MapContainer';
import TableContainer from './components/TableContainer';
import ChatInterface from './components/ChatInterface';

// --- MOCK DATA ---

const kpiData = [
  { title: 'Total FIRs', value: '14,289', change: '+5.2%', isPositive: false, icon: 'FileText' },
  { title: 'Pending Investigations', value: '1,842', change: '-2.4%', isPositive: true, icon: 'Clock' },
  { title: 'Repeat Offenders', value: '642', change: '+12.1%', isPositive: false, icon: 'Users' },
  { title: 'High Priority Alerts', value: '38', change: '+4', isPositive: false, icon: 'AlertTriangle' },
  { title: 'Organized Crime Groups', value: '24', change: '0%', isPositive: true, icon: 'Shield' },
  { title: 'Crime Hotspots', value: '18', change: '-3', isPositive: true, icon: 'MapPin' },
  { title: 'Financial Crime Cases', value: '892', change: '+18.4%', isPositive: false, icon: 'DollarSign' },
  { title: 'Case Resolution Rate', value: '78.4%', change: '+3.6%', isPositive: true, icon: 'CheckCircle' },
];

const crimeTrendData = [
  { month: 'Jan', violent: 120, property: 340, cyber: 180, financial: 90 },
  { month: 'Feb', violent: 132, property: 310, cyber: 210, financial: 105 },
  { month: 'Mar', violent: 101, property: 290, cyber: 250, financial: 130 },
  { month: 'Apr', violent: 145, property: 380, cyber: 280, financial: 160 },
  { month: 'May', violent: 160, property: 420, cyber: 310, financial: 190 },
  { month: 'Jun', violent: 138, property: 390, cyber: 350, financial: 210 },
  { month: 'Jul', violent: 155, property: 430, cyber: 390, financial: 240 },
];

const aiInsights = [
  {
    id: 1,
    title: 'Vehicle Theft Increased',
    description: 'Anomalous 24% spike in two-wheeler thefts detected across Sector 4 and North District over the last 48 hours.',
    confidence: 94,
    timestamp: '10 mins ago',
    type: 'warning' as const,
  },
  {
    id: 2,
    title: 'Gang Activity Detected',
    description: 'Cross-referencing encrypted comms and CCTV suggests Syndicate-B restructuring near industrial zones.',
    confidence: 88,
    timestamp: '25 mins ago',
    type: 'critical' as const,
  },
  {
    id: 3,
    title: 'Crime Hotspot Prediction',
    description: 'High probability (82%) of snatching incidents predicted in Downtown Transit Hub between 18:00 and 22:00.',
    confidence: 82,
    timestamp: '1 hour ago',
    type: 'prediction' as const,
  },
  {
    id: 4,
    title: 'Repeat Offender Detected',
    description: 'Facial recognition match (99.1%) for parole violator Vikram "Vicky" Sharma at Metro Station Gate 3.',
    confidence: 99,
    timestamp: '2 hours ago',
    type: 'alert' as const,
  },
];

const liveAlerts = [
  {
    id: 'ALT-901',
    type: 'Gang Activity',
    severity: 'Critical' as const,
    location: 'Zone 4, Industrial Wasteland',
    time: '2 mins ago',
    description: 'Armed gathering reported by automated acoustic gunshot sensor.',
  },
  {
    id: 'ALT-902',
    type: 'Cyber Fraud',
    severity: 'High' as const,
    location: 'Server Node / Cyber Cell D-2',
    time: '14 mins ago',
    description: 'Mass phishing campaign targeting state pension accounts actively draining funds.',
  },
  {
    id: 'ALT-903',
    type: 'Kidnapping',
    severity: 'Critical' as const,
    location: 'Highway Toll Plaza, North Exit',
    time: '31 mins ago',
    description: 'Black SUV (MH-04-AB-1234) flagged in distress alert. Intercept vectors calculated.',
  },
  {
    id: 'ALT-904',
    type: 'Robbery',
    severity: 'Medium' as const,
    location: 'National Bank, West branch',
    time: '45 mins ago',
    description: 'Silent vault alarm triggered. Patrol Unit 14 dispatched.',
  },
];

const recentFIRs = [
  { fir: 'FIR-2026-8891', crime: 'Armed Robbery', district: 'Central Metro', officer: 'Insp. R. Rathore', status: 'Active Investigation', date: '2026-07-20' },
  { fir: 'FIR-2026-8890', crime: 'Cyber Extortion', district: 'Cyber Cell East', officer: 'Sub-Insp. A. Sharma', status: 'Forensics Review', date: '2026-07-20' },
  { fir: 'FIR-2026-8889', crime: 'Vehicle Theft', district: 'North District', officer: 'Insp. T. Deshmukh', status: 'Suspect Identified', date: '2026-07-19' },
  { fir: 'FIR-2026-8888', crime: 'Narcotics Trafficking', district: 'Port Zone', officer: 'ACP K. Varma', status: 'Charge Sheet Filed', date: '2026-07-19' },
  { fir: 'FIR-2026-8887', crime: 'Assault & Battery', district: 'South West', officer: 'Insp. M. Ali', status: 'Court Proceedings', date: '2026-07-18' },
];

const timelineSteps = [
  { stage: 'FIR Registered', detail: 'Case #8891 officially logged in Crime & Criminal Tracking Network.', date: 'July 20, 08:30 AM', status: 'completed' },
  { stage: 'Evidence', detail: 'CCTV footage recovered from 4 traffic intersections; bullet casing ballistic match pending.', date: 'July 20, 11:15 AM', status: 'completed' },
  { stage: 'Witness', detail: 'Primary statement recorded from bank security guard and 2 civilian bystanders.', date: 'July 20, 02:00 PM', status: 'completed' },
  { stage: 'Forensics', detail: 'AI fingerprint enhancement identified partial match to Syndicate-B database.', date: 'In Progress', status: 'active' },
  { stage: 'Arrest', detail: 'Special Weapons Tactical team deployed to suspected hideout in Sector 18.', date: 'Pending', status: 'pending' },
  { stage: 'Charge Sheet', detail: 'Drafting preliminary prosecution dossier under BNSS Section 309.', date: 'Pending', status: 'pending' },
  { stage: 'Court', detail: 'Fast-track sessions court assignment pending arrest confirmation.', date: 'Pending', status: 'pending' },
];

// React Flow Mock Nodes & Edges for Criminal Network Preview
const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: '🔴 Accused: R. "Bhai" Singh' }, position: { x: 250, y: 20 }, style: { background: '#7f1d1d', color: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' } },
  { id: '2', data: { label: '📱 Phone: +91 98XXX-XXXXX' }, position: { x: 80, y: 120 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px' } },
  { id: '3', data: { label: '🏦 Bank: Shell Account #4492' }, position: { x: 250, y: 120 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px' } },
  { id: '4', data: { label: '🚗 Vehicle: SUV MH-04-AB-1234' }, position: { x: 420, y: 120 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '12px' } },
  { id: '5', data: { label: '📍 Location: Warehouse Sec-18' }, position: { x: 160, y: 220 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #3b82f6', borderRadius: '8px', fontSize: '12px' } },
  { id: '6', data: { label: '🟡 Victim: Diamond Jewellers' }, position: { x: 350, y: 220 }, style: { background: '#713f12', color: '#fef08a', border: '1px solid #eab308', borderRadius: '8px', fontSize: '12px' } },
  { id: '7', type: 'output', data: { label: '📁 Evidence: Ballistics & CCTV #8891' }, position: { x: 250, y: 320 }, style: { background: '#065f46', color: '#d1fae5', border: '1px solid #10b981', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-4', source: '1', target: '4', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-5', source: '2', target: '5', style: { stroke: '#64748b' } },
  { id: 'e3-6', source: '3', target: '6', label: 'Wire Transfer', style: { stroke: '#ef4444' } },
  { id: 'e4-6', source: '4', target: '6', label: 'Spotted at scene', style: { stroke: '#ef4444' } },
  { id: 'e5-7', source: '5', target: '7', style: { stroke: '#10b981' } },
  { id: 'e6-7', source: '6', target: '7', style: { stroke: '#10b981' } },
];

export default function Dashboard() {
  const [nodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const handleDispatch = (alertId: string) => {
    console.log(`Dispatching unit for alert ${alertId}`);
    const alert = liveAlerts.find(a => a.id === alertId);
    setDispatchToast(`🚨 Mobilizing response teams for ${alert?.type || 'emergency'} at ${alert?.location || 'scene'}.`);
    setTimeout(() => {
      setDispatchToast(null);
    }, 4000);
  };

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Navbar */}
          <TopNavbar />

          <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-700/50">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    DEFCON-2 ACTIVE
                  </span>
                  <span className="text-xs text-slate-400">| National Crime Grid Sync: 99.9%</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
                  AI Crime Intelligence & Tactical Dispatch
                </h1>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-3">
                <button 
                  onClick={() => alert("Dossier exported to local server.")} 
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Export Dossier
                </button>
                <button 
                  onClick={() => alert("Creating new tactical operation...")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-blue-600/20 flex items-center space-x-2"
                >
                  <span>New Tactical Operation</span>
                </button>
              </div>
            </div>

            {/* SECTION 1: Responsive 8 KPI cards */}
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 font-mono">
                Real-Time Operational Telemetry
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiData.map((kpi, idx) => (
                  <StatisticCard
                    key={idx}
                    title={kpi.title}
                    value={kpi.value}
                    change={kpi.change}
                    isPositive={kpi.isPositive}
                    icon={kpi.icon}
                  />
                ))}
              </div>
            </section>

            {/* SECTION 2: Left - Crime Trend Line Chart, Right - AI Crime Insights */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 span): Recharts Line Chart inside ChartContainer */}
              <div className="lg:col-span-2 flex flex-col">
                <ChartContainer
                  title="Multi-Domain Crime Vector Trends (6-Month Telemetry)"
                  subtitle="Aggregating violent, property, cyber, and financial crime indices"
                >
                  <div className="h-[360px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={crimeTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                            color: '#f8fafc',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#cbd5e1' }} />
                        <Line
                          type="monotone"
                          name="Violent Crime"
                          dataKey="violent"
                          stroke="#ef4444"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#ef4444' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Property Crime"
                          dataKey="property"
                          stroke="#f97316"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#f97316' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Cyber Fraud"
                          dataKey="cyber"
                          stroke="#3b82f6"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#3b82f6' }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          name="Financial / Money Laundering"
                          dataKey="financial"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#10b981' }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </ChartContainer>
              </div>

              {/* Right Column: AI Crime Insights using InsightCard */}
              <div className="flex flex-col space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    <h3 className="font-semibold text-white">AI Crime Insights</h3>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono">
                    MODEL: CRIME-BERT-v4
                  </span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
                  {aiInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      title={insight.title}
                      description={insight.description}
                      confidence={insight.confidence}
                      timestamp={insight.timestamp}
                      type={insight.type}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: Left - Crime Hotspot Map, Right - Live Alerts */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 span): Crime Hotspot Map */}
              <div className="lg:col-span-2 flex flex-col">
                <MapContainer
                  title="Live Crime Hotspot & Tactical Deployment Map"
                  subtitle="Heatmap overlays, police stations, active crime zones, and patrol vectors"
                >
                  <div className="relative w-full h-[420px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
                    {/* Simulated Map Background Grid & Topography */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #020617 1px)',
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 20px 20px',
                      }}
                    ></div>

                    {/* Heatmap Zones */}
                    <div className="absolute top-1/4 left-1/3 w-48 h-48 bg-red-600/30 rounded-full blur-2xl pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/2 right-1/3 w-36 h-36 bg-blue-600/20 rounded-full blur-xl pointer-events-none"></div>

                    {/* Simulated Map Overlay Content */}
                    <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between pointer-events-none">
                      {/* Top Controls Overlay */}
                      <div className="flex justify-between items-start pointer-events-auto">
                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-3 space-y-2 shadow-xl">
                          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Map Layers</div>
                          <div className="flex items-center space-x-3 text-xs text-slate-400">
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-0" />
                              <span className="text-red-400 font-medium">Heatmap</span>
                            </label>
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-0" />
                              <span className="text-blue-400 font-medium">Police Stations (14)</span>
                            </label>
                            <label className="flex items-center space-x-1.5 cursor-pointer">
                              <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-0" />
                              <span className="text-amber-400 font-medium">Crime Zones (6)</span>
                            </label>
                          </div>
                        </div>

                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 shadow-xl flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>GPS SATELLITE LOCK: 28.6139° N, 77.2090° E</span>
                        </div>
                      </div>

                      {/* Mock Markers on Map */}
                      <div className="absolute inset-0 pointer-events-auto">
                        {/* Police Station Marker 1 */}
                        <div className="absolute top-[30%] left-[25%] group cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition">
                            <span className="text-xs font-bold text-blue-400">PS</span>
                          </div>
                          <div className="absolute left-10 top-0 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-xs rounded p-2 shadow-xl whitespace-nowrap z-20">
                            <p className="font-bold">North District HQ</p>
                            <p className="text-slate-400">Units Available: 8 / 12</p>
                          </div>
                        </div>

                        {/* Police Station Marker 2 */}
                        <div className="absolute top-[65%] left-[70%] group cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition">
                            <span className="text-xs font-bold text-blue-400">PS</span>
                          </div>
                          <div className="absolute left-10 top-0 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-xs rounded p-2 shadow-xl whitespace-nowrap z-20">
                            <p className="font-bold">Cyber Cell East</p>
                            <p className="text-slate-400">Units Available: 5 / 5</p>
                          </div>
                        </div>

                        {/* Active Crime Zone Marker 1 */}
                        <div className="absolute top-[35%] left-[40%] group cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-8 rounded-full bg-red-600/30 border-2 border-red-500 flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce">
                            <ShieldAlert className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="absolute left-10 top-0 hidden group-hover:block bg-slate-900 border border-red-500/50 text-white text-xs rounded p-2 shadow-xl whitespace-nowrap z-20">
                            <p className="font-bold text-red-400">CRIME ZONE: Sector 4</p>
                            <p className="text-slate-300">High frequency vehicle theft & gang activity</p>
                            <p className="text-xs text-slate-400 mt-1">Status: 2 Patrols En Route</p>
                          </div>
                        </div>

                        {/* Active Crime Zone Marker 2 */}
                        <div className="absolute top-[70%] left-[30%] group cursor-pointer transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-8 rounded-full bg-amber-600/30 border-2 border-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/50">
                            <span className="text-xs font-bold text-amber-400">!</span>
                          </div>
                          <div className="absolute left-10 top-0 hidden group-hover:block bg-slate-900 border border-amber-500/50 text-white text-xs rounded p-2 shadow-xl whitespace-nowrap z-20">
                            <p className="font-bold text-amber-400">CRIME ZONE: Transit Hub</p>
                            <p className="text-slate-300">Snatching hotspot predicted</p>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Legend Overlay */}
                      <div className="flex justify-between items-end pointer-events-auto">
                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded px-3 py-1.5 text-xs text-slate-400 flex items-center space-x-4 shadow-xl">
                          <div className="flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500"></span>
                            <span>High Intensity Zone</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-amber-500/50 border border-amber-500"></span>
                            <span>Medium Risk</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="w-3 h-3 rounded-full bg-blue-500/50 border border-blue-500"></span>
                            <span>Police Outpost</span>
                          </div>
                        </div>
                        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs px-3 py-1.5 rounded transition shadow-lg">
                          Center Map
                        </button>
                      </div>
                    </div>
                  </div>
                </MapContainer>
              </div>

              {/* Right Column: Live Alerts using AlertCard */}
              <div className="flex flex-col space-y-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <h3 className="font-semibold text-white">Live Emergency Alerts</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">PRIORITY QUEUE</span>
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                  {liveAlerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      title={alert.type}
                      severity={alert.severity}
                      location={alert.location}
                      time={alert.time}
                      description={alert.description}
                      onDispatch={() => handleDispatch(alert.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 4: Left - Recent FIR Table, Right - Investigation Timeline */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 span): Recent FIR Table using TableContainer */}
              <div className="lg:col-span-2 flex flex-col">
                <TableContainer
                  title="Recent FIR Registry & Case Tracking"
                  subtitle="Live feed from National Crime Tracking Database"
                >
                  <div className="overflow-x-auto mt-3">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase bg-slate-900/50">
                          <th className="py-3 px-4 font-semibold">FIR #</th>
                          <th className="py-3 px-4 font-semibold">Crime Classification</th>
                          <th className="py-3 px-4 font-semibold">District</th>
                          <th className="py-3 px-4 font-semibold">Investigating Officer</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                          <th className="py-3 px-4 font-semibold">Date Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                        {recentFIRs.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors cursor-pointer" onClick={() => alert(`Details for ${row.fir} loaded in investigative board.`)}>
                            <td className="py-3.5 px-4 font-mono font-medium text-blue-400">{row.fir}</td>
                            <td className="py-3.5 px-4 font-medium text-white">{row.crime}</td>
                            <td className="py-3.5 px-4 text-slate-400">{row.district}</td>
                            <td className="py-3.5 px-4 text-slate-300">{row.officer}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                  row.status === 'Active Investigation'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                    : row.status === 'Charge Sheet Filed'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : row.status === 'Suspect Identified'
                                    ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                                    : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">{row.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TableContainer>
              </div>

              {/* Right Column: Investigation Timeline */}
              <div className="flex flex-col bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
                <div className="border-b border-slate-800 pb-3 mb-4">
                  <h3 className="font-semibold text-white">Investigation Timeline</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Active Case Progression: FIR-2026-8891</p>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 overflow-y-auto max-h-[400px] pr-2">
                  {timelineSteps.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';

                    return (
                      <div key={idx} className="relative group">
                        {/* Timeline Node Indicator */}
                        <div
                          className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-slate-950 ${
                            isCompleted
                              ? 'border-emerald-500 text-emerald-400'
                              : isActive
                              ? 'border-blue-500 text-blue-400 animate-pulse'
                              : 'border-slate-700 text-slate-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3 fill-emerald-500/20" />
                          ) : isActive ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                          )}
                        </div>

                        {/* Timeline Content */}
                        <div className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-sm font-semibold ${
                                isCompleted ? 'text-slate-200' : isActive ? 'text-blue-400 font-bold' : 'text-slate-500'
                              }`}
                            >
                              {step.stage}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">{step.date}</span>
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 5: Criminal Network Preview (Small React Flow graph) */}
            <section className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-purple-400" />
                    <h3 className="font-semibold text-white text-lg">Criminal Network Preview</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Entity linkage graph: Accused, Victims, Associated Vehicles, Phones, Financial Shells, and Evidence
                  </p>
                </div>
                <button onClick={() => alert("Opening full graphic analysis interface...")} className="inline-flex items-center space-x-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-purple-600/20 whitespace-nowrap">
                  <span>Open Network Analysis</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Small React Flow Graph Container */}
              <div className="w-full h-[380px] bg-slate-950 border border-slate-800/80 rounded-lg overflow-hidden relative">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  attributionPosition="bottom-right"
                  proOptions={{ hideAttribution: true }}
                >
                  <Background color="#334155" gap={20} size={1} />
                  <Controls className="bg-slate-900 border-slate-700 fill-slate-300" />
                </ReactFlow>
                <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded text-xs text-slate-400 font-mono pointer-events-none z-10 font-mono">
                  GRAPH ID: SYNDICATE-B-LINKAGE | NODES: 7 | EDGES: 8
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* FLOATING BUTTON: Ask Crime AI (Bottom Right) */}
        <div className="fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-3 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl shadow-blue-500/30 border border-blue-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <Bot className="w-6 h-6 text-blue-200 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide font-semibold">Ask Crime AI</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </button>
        </div>

        {/* Tactical Dispatch Toast Notification */}
        {dispatchToast && (
          <div className="fixed bottom-24 right-6 z-50 bg-slate-900 border-2 border-blue-500 text-white rounded-lg px-5 py-3.5 shadow-2xl flex items-center space-x-3 animate-bounce">
            <span className="text-xl">🚀</span>
            <span className="text-xs font-medium font-mono tracking-tight">{dispatchToast}</span>
          </div>
        )}

        {/* Chat Interface Drawer */}
        {isChatOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsChatOpen(false)}
            ></div>

            {/* Drawer Panel */}
            <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-blue-400" />
                  <h3 className="font-bold text-white text-base">Crime Intelligence Assistant</h3>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded"
                >
                  <X className="w-5 h-5" />
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