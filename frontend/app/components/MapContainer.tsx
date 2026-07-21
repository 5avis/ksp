import React from 'react';

interface MapContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function MapContainer({ title, subtitle, children }: MapContainerProps) {
  return (
    <div className="panel-surface panel-surface-hover flex h-full flex-col p-5">
      <div className="mb-4 border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
