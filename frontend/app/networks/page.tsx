"use client";
import React, { useState, useCallback } from 'react';
import ReactFlow, {
  Background, Controls, Node, Edge, NodeMouseHandler, useNodesState, useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Network, Search, Bot, X, ExternalLink, Users, Car, Package } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import StatisticCard from '../components/StatisticCard';
import ChatInterface from '../components/ChatInterface';

// ─── Mock Node Data ──────────────────────────────────────────────────────────
const nodeDetails: Record<string, { type: string; desc: string; links: string[]; risk: string }> = {
  'n1': { type: 'Accused', desc: 'R. "Bhai" Singh — Primary syndicate leader. Known associates: 12. Prior convictions: 3.', links: ['Armed robbery (2019)', 'Money laundering (2021)', 'Current: FIR-2026-8891'], risk: 'Critical' },
  'n2': { type: 'Phone', desc: '+91 98XXX-XXXXX registered to shell entity. Location last pinged: Sector 18 warehouse, 02:14 AM.', links: ['Call logs shared with n3'], risk: 'High' },
  'n3': { type: 'Bank Account', desc: 'Shell Account #4492 — National Bank West. Balance: ₹48.2L. Transaction history flagged.', links: ['Wire transfer to Diamond Jewellers (n6)'], risk: 'Critical' },
  'n4': { type: 'Vehicle', desc: 'Black SUV MH-04-AB-1234. ANPR flagged at 3 crime scenes. Insurance: Lapsed.', links: ['Spotted at FIR-8891 scene', 'Highway toll scan: July 20'], risk: 'High' },
  'n5': { type: 'Location', desc: 'Warehouse Sector-18. Known Syndicate-B staging area. Last raided: 2023.', links: ['Linked to Phone n2'], risk: 'High' },
  'n6': { type: 'Victim', desc: 'Diamond Jewellers — Central Metro. Robbery report filed July 20. Loss: ₹1.2Cr.', links: ['FIR-2026-8891'], risk: 'Low' },
  'n7': { type: 'Evidence', desc: 'CCTV, ballistics, financial records tagged to FIR-2026-8891.', links: ['Linked to Location n5', 'Victim n6'], risk: 'Low' },
};

const initialNodes: Node[] = [
  { id: 'n1', type: 'input', data: { label: '🔴 Accused: R. "Bhai" Singh' }, position: { x: 280, y: 30 }, style: { background: '#7f1d1d', color: '#fef2f2', border: '1px solid #ef4444', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', padding: '8px 12px' } },
  { id: 'n2', data: { label: '📱 Phone: +91-98XXX-XXXXX' }, position: { x: 60, y: 150 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px', padding: '6px 10px' } },
  { id: 'n3', data: { label: '🏦 Shell Account #4492' }, position: { x: 280, y: 150 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px', padding: '6px 10px' } },
  { id: 'n4', data: { label: '🚗 SUV: MH-04-AB-1234' }, position: { x: 500, y: 150 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #475569', borderRadius: '8px', fontSize: '11px', padding: '6px 10px' } },
  { id: 'n5', data: { label: '📍 Warehouse, Sector-18' }, position: { x: 160, y: 290 }, style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #3b82f6', borderRadius: '8px', fontSize: '11px', padding: '6px 10px' } },
  { id: 'n6', data: { label: '🟡 Victim: Diamond Jewellers' }, position: { x: 380, y: 290 }, style: { background: '#713f12', color: '#fef08a', border: '1px solid #eab308', borderRadius: '8px', fontSize: '11px', padding: '6px 10px' } },
  { id: 'n7', type: 'output', data: { label: '📁 Evidence #FIR-2026-8891' }, position: { x: 280, y: 420 }, style: { background: '#065f46', color: '#d1fae5', border: '1px solid #10b981', borderRadius: '8px', fontWeight: 'bold', fontSize: '11px', padding: '8px 12px' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: 'n1', target: 'n2', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-3', source: 'n1', target: 'n3', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e1-4', source: 'n1', target: 'n4', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-5', source: 'n2', target: 'n5', style: { stroke: '#64748b' } },
  { id: 'e3-6', source: 'n3', target: 'n6', label: 'Wire Transfer', style: { stroke: '#ef4444' }, labelStyle: { fill: '#ef4444', fontSize: 10 } },
  { id: 'e4-6', source: 'n4', target: 'n6', label: 'At Scene', style: { stroke: '#f97316' }, labelStyle: { fill: '#f97316', fontSize: 10 } },
  { id: 'e5-7', source: 'n5', target: 'n7', style: { stroke: '#10b981' } },
  { id: 'e6-7', source: 'n6', target: 'n7', style: { stroke: '#10b981' } },
];

const kpis = [
  { title: 'Mapped Crime Groups', value: '24', change: '0 new', isPositive: true, icon: 'Network' },
  { title: 'Entity Nodes Indexed', value: '1,204', change: '+38', isPositive: false, icon: 'Users' },
  { title: 'Linkage Edges Active', value: '3,842', change: '+124', isPositive: false, icon: 'GitBranch' },
  { title: 'Highest Risk Cluster', value: 'Syndicate-B', change: 'Critical', isPositive: false, icon: 'AlertTriangle' },
];

const riskBadge: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low: 'bg-slate-700/40 text-slate-400 border-slate-700',
};

export default function NetworksPage() {
  const [nodes] = useNodesState(initialNodes);
  const [edges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(prev => prev === node.id ? null : node.id);
  }, []);

  const detail = selectedNode ? nodeDetails[selectedNode] : null;

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-950 text-purple-400 border border-purple-700/50 mb-1">
                <span className="w-1.5 h-1.5 mr-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                GRAPH DATABASE CONNECTED
              </span>
              <h1 className="text-2xl font-bold text-white tracking-tight">Criminal Network Relationship Graph</h1>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k, i) => <StatisticCard key={i} {...k} />)}
            </div>

            {/* Graph + Node Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graph canvas — takes 2 cols */}
              <div className="panel-surface flex flex-col space-y-3 p-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Network className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Syndicate-B Entity Linkage Graph</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                      <input
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search nodes..."
                        className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 w-40"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full h-[460px] rounded-lg overflow-hidden border border-slate-800 relative">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodeClick={onNodeClick}
                    fitView
                    proOptions={{ hideAttribution: true }}
                  >
                    <Background color="#334155" gap={20} size={1} />
                    <Controls />
                  </ReactFlow>
                  <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-mono text-slate-400 pointer-events-none">
                    GRAPH: SYNDICATE-B · 7 NODES · 8 EDGES
                  </div>
                </div>
              </div>

              {/* Node Detail Panel */}
              <div className="panel-surface flex flex-col p-5">
                {!detail ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                    <Network className="w-10 h-10 text-slate-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Select a Node</p>
                      <p className="text-xs text-slate-600 mt-1">Click any node on the graph to view entity details, linkages, and risk assessment.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-pulse-once flex flex-col h-full">
                    <div className="border-b border-slate-800 pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-purple-400">NODE: {selectedNode}</span>
                        <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded border ${riskBadge[detail.risk]}`}>{detail.risk}</span>
                      </div>
                      <p className="text-sm font-bold text-white">{detail.type}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Entity Details</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{detail.desc}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Case Linkages</p>
                      <div className="space-y-1.5">
                        {detail.links.map((l, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-850">
                            <span className="text-blue-400 mt-0.5 shrink-0">→</span>
                            <span>{l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                      <button onClick={() => alert(`Opening full dossier for node ${selectedNode}...`)} className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center space-x-1.5">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Full Entity Report</span>
                      </button>
                      <button onClick={() => setSelectedNode(null)} className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold rounded-lg transition">
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Entity type legend */}
            <div className="panel-surface p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Entity Type Legend</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                {[{ icon: Users, label: 'Accused / Suspects', color: 'text-red-400' }, { icon: Car, label: 'Vehicles', color: 'text-slate-400' }, { icon: Package, label: 'Weapons / Assets', color: 'text-orange-400' }].map(t => (
                  <div key={t.label} className="flex items-center space-x-2 bg-slate-950/60 border border-slate-800 rounded px-3 py-1.5">
                    <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span>{t.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* FAB */}
        <div className="fixed bottom-6 right-6 z-50">
          <button onClick={() => setIsChatOpen(true)} className="flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl border border-blue-400/30 transition transform hover:-translate-y-0.5 text-sm">
            <Bot className="w-5 h-5 text-blue-200" />
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
