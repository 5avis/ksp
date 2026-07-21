"use client";
import React, { useState } from 'react';
import { Bot, Sparkles, Shield, Zap, Brain, ChevronRight } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import ChatInterface from '../components/ChatInterface';

const capabilities = [
  { icon: Brain, title: 'Predictive Analysis', desc: 'Forecast crime hotspots using ML pattern recognition', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: Shield, title: 'Suspect Profiling', desc: 'Cross-reference criminal records and behavioral patterns', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  { icon: Zap, title: 'Real-time Alerts', desc: 'Instant contextual intelligence on live incidents', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { icon: Sparkles, title: 'Evidence Correlation', desc: 'Link forensic evidence across multiple case files', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
];

const sampleQueries = [
  'Analyze crime trends in Sector 4 for the past 30 days',
  'List all repeat offenders associated with narcotics trafficking',
  'What are the predicted high-risk zones for this weekend?',
  'Summarize FIR-2026-8891 with evidence links',
  'Compare vehicle theft rates between North and South districts',
  'Identify shell companies linked to money laundering in Port Zone',
];

export default function AiAssistantPage() {
  const [started, setStarted] = useState(false);

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNavbar />
          <div className="flex-1 flex overflow-hidden">
            {!started ? (
              /* Landing / Welcome state */
              <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Crime Intelligence Assistant</h1>
                    <p className="text-slate-400 mt-2 text-sm max-w-xl mx-auto leading-relaxed">
                      Powered by <span className="text-blue-400 font-semibold">CRIME-BERT-v4</span> and <span className="text-purple-400 font-semibold">LangGraph Orchestrator</span>. Ask anything about cases, offenders, hotspots, or request tactical analysis.
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span><span>Model Online</span></span>
                    <span>•</span>
                    <span>14,289 Case Files Indexed</span>
                    <span>•</span>
                    <span>Response: ~1.2s</span>
                  </div>
                </div>

                {/* Capability Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl">
                  {capabilities.map((cap) => (
                    <div key={cap.title} className={`panel-surface panel-surface-hover flex flex-col space-y-2 p-4 ${cap.bg}`}>
                      <cap.icon className={`h-5 w-5 ${cap.color}`} />
                      <p className="text-xs font-bold text-white">{cap.title}</p>
                      <p className="text-[11px] leading-relaxed text-slate-400">{cap.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Sample queries */}
                <div className="w-full max-w-3xl space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Try asking...</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sampleQueries.map((q) => (
                      <button
                        key={q}
                        onClick={() => setStarted(true)}
                        className="group flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left text-xs text-slate-400 transition hover:border-blue-500/30 hover:bg-slate-900 hover:text-slate-200"
                      >
                        <span className="leading-relaxed">{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStarted(true)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-xl shadow-blue-500/25 transition text-sm"
                >
                  Start Intelligence Session →
                </button>
              </div>
            ) : (
              /* Chat mode */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/50 px-6 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Crime Intelligence Assistant</p>
                      <p className="text-[10px] text-slate-500 font-mono">CRIME-BERT-v4 • LangGraph Orchestrator • Active Session</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStarted(false)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition px-3 py-1.5 hover:bg-slate-800 rounded"
                  >
                    New Session
                  </button>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                  <ChatInterface />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
