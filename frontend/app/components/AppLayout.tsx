import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#020617] text-slate-100 font-sans antialiased">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(124,58,237,0.12),transparent_24%),radial-gradient(circle_at_center,rgba(16,185,129,0.08),transparent_30%)]">
        {children}
      </div>
    </div>
  );
}
