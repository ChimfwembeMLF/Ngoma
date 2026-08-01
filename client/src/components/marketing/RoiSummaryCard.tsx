import React from 'react';

interface RoiSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: React.ReactNode;
  isPositive?: boolean;
}

export const RoiSummaryCard: React.FC<RoiSummaryCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  isPositive = true,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400">{icon}</div>
      </div>
      <div className="mt-4">
        <h4 className="text-2xl font-extrabold tracking-tight text-slate-100">{value}</h4>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <div className={`text-xs font-bold mt-2 flex items-center space-x-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span>{isPositive ? '▲' : '▼'} {trend}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoiSummaryCard;
