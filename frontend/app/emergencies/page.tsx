"use client";
import React, { useState } from 'react';
import { ShieldAlert, Bot, Bell, Volume2, Wifi, Send } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import AlertCard from '../components/AlertCard';
import ChatInterface from '../components/ChatInterface';

const emergencyKPIs = [
  { title: 'Emergency Queue', value: '38 Alerts', change: '+4 Today', isPositive: false, icon: 'AlertTriangle' },
  { title: 'SWAT deployments', value: '2 Active', change: '+1', isPositive: false, icon: 'Shield' },
  { title: 'Acoustic Gunshot Alarms', value: '1 Signal', change: 'En Route', isPositive: false, icon: 'Volume2' },
  { title: 'Dispatcher Status', value: 'Active', change: '8 Dispatchers', isPositive: true, icon: 'CheckCircle' },
];

const initialAlerts = [
  { id: 'ALT-901', type: 'Gang Activity', severity: 'Critical' as const, location: 'Zone 4, Industrial Wasteland', time: '2 mins ago', description: 'Armed gathering reported by automated acoustic gunshot sensor.' },
  { id: 'ALT-902', type: 'Cyber Fraud', severity: 'High' as const, location: 'Server Node / Cyber Cell D-2', time: '14 mins ago', description: 'Mass phishing campaign targeting state pension accounts actively draining funds.' },
  { id: 'ALT-903', type: 'Kidnapping', severity: 'Critical' as const, location: 'Highway Toll Plaza, North Exit', time: '31 mins ago', description: 'Black SUV (MH-04-AB-1234) flagged in distress alert. Intercept vectors calculated.' },
  { id: 'ALT-904', type: 'Robbery', severity: 'Medium' as const, location: 'National Bank, West branch', time: '45 mins ago', description: 'Silent vault alarm triggered. Patrol Unit 14 dispatched.' },
  { id: 'ALT-905', type: 'Assault Report', severity: 'High' as const, location: 'Central Commercial Plaza', time: '1 hour ago', description: '911 call reporting active physical altercation outside Metro Gate 1.' },
  { id: 'ALT-906', type: 'Vandalism', severity: 'Medium' as const, location: 'Sector 12 Public Park', time: '2 hours ago', description: 'CCTV analytics detected unauthorized graffiti and damage to infrastructure.' },
];

export default function EmergenciesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  const handleDispatch = (alertId: string) => {
    console.log(`Dispatching unit for emergency ${alertId}`);
    const alert = alerts.find(a => a.id === alertId);
    setDispatchToast(`🚨 Mobilizing response teams for ${alert?.type || 'emergency'} at ${alert?.location || 'scene'}.`);
    
    // Simulate removing from queue or updating status
    setTimeout(() => {
      setDispatchToast(null);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    }, 4000);
  };

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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-700/50">
                    <span className="w-1.5 h-1.5 mr-1.5 bg-red-500 rounded-full animate-ping"></span>
                    PRIORITY DISPATCH DISCIPLINE
                  </span>
                  <span className="text-xs text-slate-400">| Acoustic gunshot sensors: 100% operational</span>
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
                  Tactical Emergency Queue & Dispatch Control
                </h1>
              </div>
            </div>

            {/* SECTION 1: Metrics */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyKPIs.map((kpi, idx) => (
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

            {/* SECTION 2: Queue Content */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column (2 span): Main emergencies list */}
              <div className="lg:col-span-2 flex flex-col space-y-4">
                <div className="panel-surface p-5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-red-400" />
                      <h3 className="font-semibold text-white">Pending Dispatch Emergency Queue</h3>
                    </div>
                    <span className="text-xs text-slate-450 font-mono">{alerts.length} ALERTS ACTIVE</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alerts.map((alert) => (
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
                    {alerts.length === 0 && (
                      <div className="col-span-full py-12 text-center text-slate-500 text-xs border border-dashed border-slate-850 rounded-lg">
                        All emergency dispatches processed and resolved. No items currently in queue.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Acoustic Threat Detection telemetry & Logs */}
              <div className="panel-surface flex flex-col justify-between p-5">
                <div>
                  <div className="border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center space-x-2 text-blue-400">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                      <h3 className="font-semibold text-white">Acoustic Threat Stream</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Real-time decibel & frequency spikes</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-3 bg-slate-950 rounded border border-slate-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-red-400 flex items-center">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5 animate-ping"></span>
                          GUNSHOT MATCH (94.8%)
                        </span>
                        <span className="text-[9px] font-mono text-slate-500">23:38:12</span>
                      </div>
                      <p className="text-[11px] text-slate-350">Acoustic node #802 (Sector 4) recorded 138dB transient sound matching muzzle signature. Triangulating coordinates...</p>
                    </div>

                    <div className="p-3 bg-slate-950/60 rounded border border-slate-850 space-y-2 opacity-70">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-slate-400">DECIBEL SPIKE (88.1%)</span>
                        <span className="text-[9px] font-mono text-slate-500">22:45:00</span>
                      </div>
                      <p className="text-[11px] text-slate-400">Node #814 (Transit Hub) logged 104dB frequency spike. Potential civil assembly. Vector patterns normal.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Acoustic Network status:</span>
                    <span className="text-emerald-400 flex items-center">
                      <Wifi className="w-3.5 h-3.5 mr-1" />
                      ONLINE
                    </span>
                  </div>
                  <button
                    onClick={() => alert("Acoustic calibration initialized...")}
                    className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-350 border border-slate-850 hover:border-slate-800 rounded-lg text-xs font-semibold font-mono transition"
                  >
                    CALIBRATE SENSOR GRIDS
                  </button>
                </div>
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

        {/* Dispatch Toast */}
        {dispatchToast && (
          <div className="fixed bottom-24 right-6 z-50 bg-slate-900 border-2 border-blue-500 text-white rounded-lg px-5 py-3.5 shadow-2xl flex items-center space-x-3 animate-bounce">
            <span className="text-xl">🚀</span>
            <span className="text-xs font-medium font-mono tracking-tight">{dispatchToast}</span>
          </div>
        )}

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
