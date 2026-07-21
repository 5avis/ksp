import React from 'react';

interface ChartContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function ChartContainer({ title, subtitle, children }: ChartContainerProps) {
  return (
    <div className="panel-surface panel-surface-hover flex h-full flex-col p-5">
      <div className="border-b border-slate-800/80 pb-3">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        {children}
      </div>
    </div>
  );
}
