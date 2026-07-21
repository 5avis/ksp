import React from 'react';

interface TableContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function TableContainer({ title, subtitle, children }: TableContainerProps) {
  return (
    <div className="panel-surface panel-surface-hover flex h-full flex-col p-5">
      <div className="border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
