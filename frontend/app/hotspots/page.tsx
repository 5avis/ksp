"use client";
import React, { useState } from 'react';
import { ShieldAlert, MapPin, Bot, Layers, Compass, Crosshair, CheckCircle, Clock } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import MapContainer from '../components/MapContainer';
import TableContainer from '../components/TableContainer';
import ChatInterface from '../components/ChatInterface';

const hotspotKPIs = [
  { title: 'Active Hotspots', value: '18', change: '-2', isPositive: true, icon: 'MapPin' },
  { title: 'Patrol Vectors Mobilized', value: '12 / 16', change: '+3', isPositive: true, icon: 'Shield' },
  { title: 'Avg Response Time', value: '6.4 mins', change: '-1.2m', isPositive: true, icon: 'Clock' },
  { title: 'Density Index Score', value: '84.6', change: '+5.4%', isPositive: false, icon: 'AlertTriangle' },
];

const hotspotList = [
  { id: 'HZ-104', zone: 'Sector 4, Industrial Area', risk: 'Critical', activity: 'High frequency two-wheeler theft', coordinates: '12.9716° N, 77.5946° E', status: '2 Patrols Active' },
  { id: 'HZ-109', zone: 'Downtown Transit Hub', risk: 'High', activity: 'Predicted chain snatching (18:00 - 22:00)', coordinates: '12.9279° N, 77.6271° E', status: '1 Patrol En Route' },
  { id: 'HZ-112', zone: 'Port Zone Outer Dockyard', risk: 'High', activity: 'Unusual shipping container activity', coordinates: '13.0827° N, 80.2707° E', status: 'Monitoring CCTV' },
  { id: 'HZ-120', zone: 'Highway Toll Plaza North', risk: 'Medium', activity: 'Vehicle tracking flagged (SUV MH-04)', coordinates: '12.8315° N, 77.6712° E', status: 'Intercept Planned' },
  { id: 'HZ-122', zone: 'Koramangala Commercial Strip', risk: 'Medium', activity: 'Public nuisance & noise spikes', coordinates: '12.9352° N, 77.6244° E', status: 'Routine Patrol' },
];

export default function HotspotsPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />

          <main className="flex-1 p-6 space-y-8 max-w-7xl mx-auto w-full">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    GIS SERVICE ONLINE
                  </span>
                  <span className="text-xs text-slate-400">| Last synced with GPS Core: Just now</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                  Tactical GIS & Hotspot Analytics Map
                </h1>
              </div>
            </div>

            {/* SECTION 1: Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotspotKPIs.map((kpi, idx) => (
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

            {/* SECTION 2: Map & Detail List */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 span): Big Map */}
              <div className="lg:col-span-2 flex flex-col">
                <MapContainer
                  title="Interactive Geofence & Deployment Canvas"
                  subtitle="Visualizing live crime reports overlaid on coordinate grids"
                >
                  <div className="relative w-full h-[500px] bg-slate-950 rounded-lg overflow-hidden border border-slate-800/80 flex items-center justify-center">
                    {/* Simulated Map Background Grid */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'radial-gradient(#38bdf8 1px, transparent 1px), radial-gradient(#38bdf8 1px, #020617 1px)',
                        backgroundSize: '40px 40px',
                        backgroundPosition: '0 0, 20px 20px',
                      }}
                    ></div>

                    {/* Glowing hot zones */}
                    <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Vector lines representing patrol paths */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                      <path d="M 150 120 L 250 170 L 300 350 L 400 320" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                      <path d="M 450 180 L 350 280 L 500 420" stroke="#10b981" strokeWidth="2.5" strokeDasharray="6 4" fill="none" />
                    </svg>

                    <div className="relative z-10 w-full h-full p-6 flex flex-col justify-between pointer-events-none">
                      {/* Top Overlay controls */}
                      <div className="flex justify-between items-start pointer-events-auto">
                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg p-3 space-y-1.5 shadow-xl">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Visual Filters</span>
                          <div className="flex flex-col space-y-1 text-xs text-slate-300">
                            <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="rounded bg-slate-800" /> <span>Heat Density Overlay</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" defaultChecked className="rounded bg-slate-800" /> <span>Live Patrol Vectors</span></label>
                            <label className="flex items-center space-x-2"><input type="checkbox" className="rounded bg-slate-800" /> <span>CCTV Feeds</span></label>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
                          <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-350 shadow-md flex items-center space-x-1.5">
                            <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                            <span>GPS CORE LOCK: 12.9716° N</span>
                          </div>
                          {selectedZone && (
                            <div className="bg-slate-900/95 border border-blue-500/50 rounded p-2.5 text-xs text-white max-w-xs shadow-xl animate-fade-in">
                              <p className="font-bold text-blue-400">{selectedZone}</p>
                              <p className="text-[10px] text-slate-400 mt-1">Patrol Team #8 dispatched. Sector frequency: 446.025 MHz.</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Map Pins */}
                      <div className="absolute inset-0 pointer-events-auto">
                        {hotspotList.map((spot, i) => (
                          <div
                            key={spot.id}
                            onClick={() => setSelectedZone(`${spot.id}: ${spot.zone}`)}
                            className={`absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2`}
                            style={{
                              top: `${20 + (i * 15)}%`,
                              left: `${25 + (i * 12)}%`,
                            }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg hover:scale-110 transition ${
                              spot.risk === 'Critical'
                                ? 'bg-red-650/30 border-red-500 animate-bounce'
                                : spot.risk === 'High'
                                ? 'bg-orange-500/30 border-orange-500'
                                : 'bg-amber-500/30 border-amber-500'
                            }`}>
                              <MapPin className={`w-4 h-4 ${
                                spot.risk === 'Critical' ? 'text-red-400' : 'text-orange-400'
                              }`} />
                            </div>
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 text-white text-[10px] rounded p-2 shadow-2xl z-20 whitespace-nowrap">
                              <p className="font-bold">{spot.zone}</p>
                              <p className="text-slate-400">{spot.activity}</p>
                              <p className="text-blue-400 mt-0.5">{spot.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom Legend */}
                      <div className="flex justify-between items-end pointer-events-auto">
                        <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded px-3 py-1.5 text-[10px] text-slate-450 flex items-center space-x-3 shadow-xl">
                          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-500"></span><span>Critical</span></span>
                          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500/50 border border-orange-500"></span><span>High</span></span>
                          <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/50 border border-amber-500"></span><span>Medium</span></span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedZone(null);
                            alert("Recalibrating satellite mapping telemetry...");
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-[10px] px-3 py-1.5 rounded transition shadow-lg flex items-center space-x-1.5"
                        >
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>Recalibrate Map</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </MapContainer>
              </div>

              {/* Right Column: Hotspot Details Table */}
              <div className="flex flex-col">
                <TableContainer
                  title="Geospatial Threat Index"
                  subtitle="Detailed parameters for active hotspot buffers"
                >
                  <div className="space-y-4 overflow-y-auto max-h-[500px] mt-4 pr-1">
                    {hotspotList.map((spot) => (
                      <div
                        key={spot.id}
                        onClick={() => setSelectedZone(`${spot.id}: ${spot.zone}`)}
                        className={`p-4 bg-slate-900/40 border border-slate-800 rounded-lg hover:border-blue-500/40 cursor-pointer transition flex flex-col space-y-2`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-blue-400">{spot.id}</span>
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold ${
                            spot.risk === 'Critical'
                              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                              : spot.risk === 'High'
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {spot.risk}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-snug">{spot.zone}</h4>
                        <p className="text-[11px] text-slate-400 leading-normal">{spot.activity}</p>
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
                          <span>{spot.coordinates}</span>
                          <span className="text-slate-350">{spot.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TableContainer>
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

        {/* Chat Interface Drawer */}
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
