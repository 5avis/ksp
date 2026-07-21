"use client";
import React, { useState } from 'react';
import { Search, Layers, MapPin, Shield, AlertTriangle, Crosshair, Bot, X, Radio } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import MapContainer from '../components/MapContainer';
import ChatInterface from '../components/ChatInterface';

const kpis = [
  { title: 'Active Crime Zones', value: '18', change: '-2', isPositive: true, icon: 'MapPin' },
  { title: 'Police Stations', value: '14 Online', change: '100%', isPositive: true, icon: 'Shield' },
  { title: 'Active Patrol Units', value: '12 / 16', change: '+3', isPositive: true, icon: 'Users' },
  { title: 'CCTV Nodes Active', value: '524 / 600', change: '87.3%', isPositive: true, icon: 'Eye' },
];

const crimeMarkers = [
  { id: 'm1', label: 'Zone 4 - Gang Activity', risk: 'Critical', top: '28%', left: '35%', activity: '2 patrols dispatched', type: 'crime' },
  { id: 'm2', label: 'Transit Hub - Snatching', risk: 'High', top: '55%', left: '20%', activity: 'Patrol en route', type: 'crime' },
  { id: 'm3', label: 'Port Outer Dockyard', risk: 'High', top: '70%', left: '58%', activity: 'CCTV monitoring', type: 'crime' },
  { id: 'm4', label: 'North Toll Plaza', risk: 'Medium', top: '18%', left: '60%', activity: 'Intercept planned', type: 'crime' },
  { id: 'm5', label: 'South West Market', risk: 'Low', top: '75%', left: '40%', activity: 'Routine patrol', type: 'crime' },
];

const stationMarkers = [
  { id: 'ps1', label: 'North District HQ', units: '8/12', top: '22%', left: '18%' },
  { id: 'ps2', label: 'Cyber Cell East', units: '5/5', top: '55%', left: '72%' },
  { id: 'ps3', label: 'Port Zone Station', units: '6/8', top: '80%', left: '65%' },
];

const riskColors: Record<string, string> = {
  Critical: 'border-red-500 bg-red-600/30 text-red-400',
  High: 'border-orange-500 bg-orange-600/30 text-orange-400',
  Medium: 'border-amber-500 bg-amber-600/30 text-amber-400',
  Low: 'border-slate-600 bg-slate-700/30 text-slate-400',
};

export default function MapPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [layers, setLayers] = useState({ heatmap: true, stations: true, crimeZones: true, cctv: false, patrols: true });
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [filterRisk, setFilterRisk] = useState('All');

  const toggleLayer = (key: keyof typeof layers) => setLayers(l => ({ ...l, [key]: !l[key] }));

  const visibleCrimeMarkers = crimeMarkers.filter(m =>
    (filterRisk === 'All' || m.risk === filterRisk) &&
    m.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-700/50 mb-1">
                  <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  GIS CORE ONLINE
                </span>
                <h1 className="text-2xl font-bold text-white tracking-tight">Live Crime Intelligence Map</h1>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search crime zones..."
                    className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
                  />
                </div>
                <select
                  value={filterRisk}
                  onChange={e => setFilterRisk(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Map + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Map takes 3 cols */}
              <div className="lg:col-span-3">
                <MapContainer title="Real-Time Crime Heatmap & Deployment Canvas" subtitle="GIS overlay with live incident markers, patrol vectors, and CCTV grid">
                  <div className="relative w-full h-[500px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800 mt-3">
                    {/* Grid BG */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #020617 1px)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 20px 20px' }}></div>

                    {/* Heatmap glow zones */}
                    {layers.heatmap && (
                      <>
                        <div className="absolute top-1/4 left-1/3 w-56 h-56 bg-red-600/25 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
                        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      </>
                    )}

                    {/* Patrol vector SVG */}
                    {layers.patrols && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                        <path d="M 120 100 L 240 180 L 300 340 L 380 310" stroke="#3b82f6" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                        <path d="M 440 170 L 350 270 L 490 410" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" fill="none" />
                        <circle cx="120" cy="100" r="4" fill="#3b82f6" />
                        <circle cx="380" cy="310" r="4" fill="#3b82f6" />
                        <circle cx="440" cy="170" r="4" fill="#10b981" />
                      </svg>
                    )}

                    {/* Crime Zone Markers */}
                    {layers.crimeZones && visibleCrimeMarkers.map(m => (
                      <div
                        key={m.id}
                        className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                        style={{ top: m.top, left: m.left }}
                        onClick={() => setSelectedMarker(selectedMarker === m.id ? null : m.id)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg hover:scale-110 transition ${riskColors[m.risk]} ${m.risk === 'Critical' ? 'animate-bounce' : ''}`}>
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </div>
                        {selectedMarker === m.id && (
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-white text-[10px] rounded-lg p-3 shadow-2xl z-20 w-48">
                            <p className="font-bold text-white mb-1">{m.label}</p>
                            <p className={`text-[9px] font-mono mb-1 ${riskColors[m.risk].split(' ')[2]}`}>RISK: {m.risk}</p>
                            <p className="text-slate-400">{m.activity}</p>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Police Station Markers */}
                    {layers.stations && stationMarkers.map(ps => (
                      <div key={ps.id} className="absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2" style={{ top: ps.top, left: ps.left }}>
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30 hover:scale-110 transition">
                          <Shield className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[10px] rounded p-2 shadow-xl z-20 whitespace-nowrap">
                          <p className="font-bold">{ps.label}</p>
                          <p className="text-slate-400">Units: {ps.units}</p>
                        </div>
                      </div>
                    ))}

                    {/* Overlay Controls */}
                    <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-lg p-3 space-y-1.5 shadow-xl">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Map Layers</span>
                      {Object.entries({ Heatmap: 'heatmap', 'Crime Zones': 'crimeZones', 'Police Stations': 'stations', 'Patrols': 'patrols', 'CCTV Grid': 'cctv' }).map(([label, key]) => (
                        <label key={key} className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer hover:text-white transition">
                          <input
                            type="checkbox"
                            checked={layers[key as keyof typeof layers]}
                            onChange={() => toggleLayer(key as keyof typeof layers)}
                            className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-0 w-3 h-3"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>

                    {/* GPS badge */}
                    <div className="absolute top-3 right-3 z-10 bg-slate-900/90 backdrop-blur border border-slate-700 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-300 shadow-md flex items-center space-x-1.5">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>GPS: 12.9716°N, 77.5946°E</span>
                    </div>

                    {/* Bottom Legend */}
                    <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-between items-end">
                      <div className="bg-slate-900/90 backdrop-blur border border-slate-700 rounded px-3 py-1.5 text-[10px] text-slate-400 flex items-center space-x-3">
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500/60 border border-red-500"></span><span>Critical</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500/60 border border-orange-500"></span><span>High</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 border border-amber-500"></span><span>Medium</span></span>
                        <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/60 border border-blue-500"></span><span>Station</span></span>
                      </div>
                      <button onClick={() => setSelectedMarker(null)} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 text-[10px] px-3 py-1.5 rounded transition flex items-center space-x-1.5">
                        <Crosshair className="w-3 h-3" />
                        <span>Reset View</span>
                      </button>
                    </div>
                  </div>
                </MapContainer>
              </div>

              {/* Right Panel: Zone list */}
              <div className="panel-surface flex flex-col space-y-3 p-4 lg:col-span-1">
                <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Active Threat Zones</h3>
                <div className="space-y-2 overflow-y-auto flex-1">
                  {visibleCrimeMarkers.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMarker(m.id)}
                      className={`w-full text-left p-3 rounded-lg border hover:border-slate-700 transition ${selectedMarker === m.id ? 'border-blue-500/40 bg-blue-600/5' : 'border-slate-800 bg-slate-950/40'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${riskColors[m.risk]}`}>{m.risk}</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-snug">{m.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.activity}</p>
                    </button>
                  ))}
                  {visibleCrimeMarkers.length === 0 && (
                    <div className="text-center text-slate-600 text-xs py-8">No zones match current filters.</div>
                  )}
                </div>
              </div>
            </div>
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
