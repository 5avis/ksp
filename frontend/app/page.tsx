"use client";
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-900 text-white p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-3xl font-bold text-blue-400 mb-4">
          🛡️ Intelligent Crime Analytics Platform
        </h1>
        <p className="text-slate-400">Powered by Avita 8 Gen 256 & LangGraph</p>
      </div>

      <div className="w-full max-w-4xl mt-8">
        <ChatInterface />
      </div>

      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-slate-500 text-sm mt-8">
        <p>Secure • Explainable • Multilingual (English/Kannada)</p>
      </footer>
    </main>
  );
}
