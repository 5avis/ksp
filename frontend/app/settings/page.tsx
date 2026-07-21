"use client";
import React, { useState } from 'react';
import { Settings, User, Shield, Bell, Globe, Key, Cpu, Database, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';

type Section = 'profile' | 'roles' | 'notifications' | 'security' | 'api';

const sectionItems: { id: Section; label: string; icon: any }[] = [
  { id: 'profile', label: 'User Profile', icon: User },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'notifications', label: 'Notification Settings', icon: Bell },
  { id: 'security', label: 'Security', icon: Key },
  { id: 'api', label: 'API Configuration', icon: Cpu },
];

const roleMatrix = [
  { resource: 'View Dashboard', Admin: true, Inspector: true, Analyst: true, Viewer: true },
  { resource: 'Manage FIR Registry', Admin: true, Inspector: true, Analyst: false, Viewer: false },
  { resource: 'Dispatch Emergency', Admin: true, Inspector: true, Analyst: false, Viewer: false },
  { resource: 'View Offender Profiles', Admin: true, Inspector: true, Analyst: true, Viewer: true },
  { resource: 'Modify Evidence', Admin: true, Inspector: true, Analyst: false, Viewer: false },
  { resource: 'Generate Reports', Admin: true, Inspector: true, Analyst: true, Viewer: false },
  { resource: 'View Audit Logs', Admin: true, Inspector: false, Analyst: false, Viewer: false },
  { resource: 'API Configuration', Admin: true, Inspector: false, Analyst: false, Viewer: false },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({ name: 'Officer Rathore', email: 'rathore@crimeintel.gov.in', division: 'Central Division', badge: 'B-4421', role: 'Inspector' });

  // Notification toggles
  const [notifications, setNotifications] = useState({ emergencyAlerts: true, caseUpdates: true, systemHealth: false, weeklyReport: true, loginAlerts: true, forecastAlerts: false });

  // API state
  const [apiHost, setApiHost] = useState('http://localhost:8000');
  const [modelSelection, setModelSelection] = useState('CRIME-BERT-v4');
  const [temperature, setTemperature] = useState(0.2);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopNavbar />
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="border-b border-slate-800 pb-5 mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & Configuration</h1>
              <p className="text-xs text-slate-400 mt-1">Manage your profile, permissions, security, and platform configurations.</p>
            </div>

            <div className="flex gap-6">
              {/* Sidebar Nav */}
              <div className="w-52 shrink-0">
                <div className="panel-surface space-y-0.5 p-2">
                  {sectionItems.map(s => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveSection(s.id)}
                        className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition text-xs font-medium ${activeSection === s.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'}`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* PROFILE */}
                {activeSection === 'profile' && (
                  <div className="panel-surface space-y-6 p-6">
                    <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">User Profile</h2>
                    <div className="flex items-center space-x-5">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-xl">IO</div>
                      <div>
                        <p className="text-base font-bold text-white">{profile.name}</p>
                        <p className="text-xs text-slate-400">{profile.role} • Badge: {profile.badge}</p>
                        <p className="text-xs text-blue-400 mt-0.5">{profile.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', field: 'name' as const },
                        { label: 'Email Address', field: 'email' as const },
                        { label: 'Division', field: 'division' as const },
                        { label: 'Badge Number', field: 'badge' as const },
                      ].map(({ label, field }) => (
                        <div key={field} className="space-y-1.5">
                          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">{label}</label>
                          <input
                            value={profile[field]}
                            onChange={e => setProfile(p => ({ ...p, [field]: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSave} className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">
                      <Save className="w-3.5 h-3.5" />
                      <span>{saved ? 'Saved!' : 'Save Profile'}</span>
                      {saved && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </div>
                )}

                {/* ROLES */}
                {activeSection === 'roles' && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Role Permission Matrix</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase text-[10px]">
                            <th className="py-2 px-3 text-left">Resource</th>
                            {['Admin', 'Inspector', 'Analyst', 'Viewer'].map(r => <th key={r} className="py-2 px-3 text-center">{r}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                          {roleMatrix.map(row => (
                            <tr key={row.resource} className="hover:bg-slate-800/20 transition">
                              <td className="py-2.5 px-3 text-slate-300 font-medium">{row.resource}</td>
                              {(['Admin', 'Inspector', 'Analyst', 'Viewer'] as const).map(role => (
                                <td key={role} className="py-2.5 px-3 text-center">
                                  {(row as any)[role]
                                    ? <span className="text-emerald-400 text-base">✓</span>
                                    : <span className="text-slate-700 text-base">✗</span>}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 text-xs text-slate-400">
                      Role assignments are managed by the platform administrator. Contact <span className="text-blue-400">admin@crimeintel.gov.in</span> to request role changes.
                    </div>
                  </div>
                )}

                {/* NOTIFICATIONS */}
                {activeSection === 'notifications' && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Notification Preferences</h2>
                    <div className="space-y-3">
                      {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
                        const labels: Record<string, string> = {
                          emergencyAlerts: 'Emergency Dispatch Alerts',
                          caseUpdates: 'Case Status Updates',
                          systemHealth: 'System Health Warnings',
                          weeklyReport: 'Weekly Summary Reports',
                          loginAlerts: 'Login & Security Alerts',
                          forecastAlerts: 'Crime Forecast Alerts',
                        };
                        const descs: Record<string, string> = {
                          emergencyAlerts: 'Get notified for all Priority 1 and Priority 2 dispatch events.',
                          caseUpdates: 'Receive updates when assigned cases change status.',
                          systemHealth: 'Alerts for database disconnects and server issues.',
                          weeklyReport: 'Automated Monday morning platform performance digest.',
                          loginAlerts: 'Email alerts for any login from an unrecognized IP.',
                          forecastAlerts: 'AI-generated risk forecasts sent daily at 07:00 AM.',
                        };
                        return (
                          <div key={key} className="flex items-start justify-between p-4 bg-slate-950/60 border border-slate-850 rounded-lg hover:border-slate-700 transition">
                            <div>
                              <p className="text-xs font-semibold text-white">{labels[key]}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{descs[key]}</p>
                            </div>
                            <button
                              onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                              className={`ml-4 w-10 h-5 rounded-full transition-colors shrink-0 relative ${val ? 'bg-blue-600' : 'bg-slate-700'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    <button onClick={handleSave} className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">
                      <Save className="w-3.5 h-3.5" />
                      <span>{saved ? 'Saved!' : 'Save Preferences'}</span>
                    </button>
                  </div>
                )}

                {/* SECURITY */}
                {activeSection === 'security' && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
                    <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">Security Settings</h2>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            defaultValue="••••••••"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                          />
                          <button onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">New Password</label>
                        <input type="password" placeholder="Enter new password..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Confirm New Password</label>
                        <input type="password" placeholder="Confirm new password..." className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="bg-slate-950/60 border border-slate-850 rounded-lg p-3 space-y-1.5 text-[11px] text-slate-500">
                      <div className="flex items-center space-x-2"><CheckCircle className="w-3 h-3 text-emerald-400" /><span>Two-Factor Authentication: <span className="text-emerald-400">Enabled</span></span></div>
                      <div className="flex items-center space-x-2"><CheckCircle className="w-3 h-3 text-emerald-400" /><span>Last Login: 2026-07-20 23:41 from 192.168.1.18</span></div>
                      <div className="flex items-center space-x-2"><CheckCircle className="w-3 h-3 text-emerald-400" /><span>Session Timeout: 8 hours</span></div>
                    </div>
                    <button onClick={handleSave} className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">
                      <Save className="w-3.5 h-3.5" /><span>Update Password</span>
                    </button>
                  </div>
                )}

                {/* API CONFIG */}
                {activeSection === 'api' && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5">
                    <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">API & Model Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Backend API Host</label>
                        <input value={apiHost} onChange={e => setApiHost(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block">Active Inference Model</label>
                        <select value={modelSelection} onChange={e => setModelSelection(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          <option value="CRIME-BERT-v4">CRIME-BERT-v4</option>
                          <option value="LangGraph-Orchestrator-3.5">LangGraph Orchestrator 3.5</option>
                          <option value="QuickML-XAI-Engine">QuickML XAI Engine</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide flex justify-between">
                        <span>Temperature: {temperature}</span>
                        <span className="text-[10px] text-slate-600">{temperature < 0.4 ? 'Deterministic' : temperature < 0.7 ? 'Balanced' : 'Creative'}</span>
                      </label>
                      <input type="range" min={0} max={1} step={0.1} value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))} className="w-full h-1.5 accent-blue-500 cursor-pointer" />
                    </div>
                    <div className="space-y-2 border-t border-slate-800 pt-4">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Database Connection Status</p>
                      {[{ name: 'PostgreSQL (FIR Records)', status: 'CONNECTED' }, { name: 'Neo4j (Criminal Linkage)', status: 'CONNECTED' }, { name: 'Qdrant Vector DB', status: 'CONNECTED' }, { name: 'Zoho QuickML SDK', status: 'CONNECTED' }].map(db => (
                        <div key={db.name} className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-850 rounded-lg text-xs">
                          <span className="text-slate-400">{db.name}</span>
                          <span className="font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">{db.status}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleSave} className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition">
                      <Save className="w-3.5 h-3.5" /><span>{saved ? 'Saved!' : 'Save Configuration'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </AppLayout>
  );
}
