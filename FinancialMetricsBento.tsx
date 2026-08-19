import React from 'react';
import { ShieldCheck, Flame, Hourglass, TrendingUp, TrendingDown, HelpCircle, ChevronRight, Activity } from 'lucide-react';
import { FinancialKPIs } from '../types';
import { formatK, formatINR } from '../utils/formatters';

interface FinancialMetricsBentoProps {
  kpis: FinancialKPIs;
  onInspectMetric?: (metricName: string) => void;
}

export const FinancialMetricsBento: React.FC<FinancialMetricsBentoProps> = ({
  kpis,
  onInspectMetric,
}) => {
  return (
    <section id="key-financial-ratios-bento" className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {/* 1. Quick Ratio Card */}
      <div
        onClick={() => onInspectMetric?.('Quick Ratio')}
        className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-[#1960a3] dark:hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold">
            Quick Ratio (Acid Test)
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-[#002045] dark:text-white tracking-tight">
            {kpis.quickRatio.toFixed(2)}x
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>Exceeds {kpis.quickRatioBenchmark}x Benchmark</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-1.5">
          <span>Target &gt; 1.1x</span>
          <span className="text-[#1960a3] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Details →</span>
        </div>
      </div>

      {/* 2. Monthly Burn Rate Card in Rupees */}
      <div
        onClick={() => onInspectMetric?.('Monthly Burn Rate')}
        className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-[#1960a3] dark:hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold">
            Monthly Net Burn
          </span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-[#002045] dark:text-white tracking-tight">
            {formatK(kpis.monthlyBurnRate, true)}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-1">
            <span>+{kpis.burnRateQoQ}% QoQ Cash Drag</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-1.5">
          <span>Operating Cost Drag</span>
          <span className="text-[#1960a3] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Audit →</span>
        </div>
      </div>

      {/* 3. Runway Months Card */}
      <div
        onClick={() => onInspectMetric?.('Cash Runway')}
        className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-[#1960a3] dark:hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold">
            Cash Runway
          </span>
          <Hourglass className="w-4 h-4 text-[#1960a3] dark:text-blue-400" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-[#002045] dark:text-white tracking-tight">
            {kpis.runwayMonths} Mos
          </div>
          <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span>{kpis.cashBufferDays} Days Buffer Liquidity</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-1.5">
          <span>Target &gt; 9.0 Mos</span>
          <span className="text-[#1960a3] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Simulate →</span>
        </div>
      </div>

      {/* 4. Debt Service Coverage Ratio (DSCR) */}
      <div
        onClick={() => onInspectMetric?.('DSCR Ratio')}
        className="bg-white dark:bg-[#0f172a] p-4 rounded-xl border border-gray-200 dark:border-slate-800 shadow-2xs hover:border-[#1960a3] dark:hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-500 dark:text-slate-400 font-semibold">
            DSCR Solvency Ratio
          </span>
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl md:text-3xl font-bold text-[#002045] dark:text-white tracking-tight">
            {kpis.dscr.toFixed(2)}x
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
            <span>Covenant Compliant (&gt; {kpis.dscrBenchmark}x)</span>
          </div>
        </div>
        <div className="text-[10px] text-gray-400 dark:text-slate-500 mt-2 flex items-center justify-between border-t border-gray-100 dark:border-slate-800 pt-1.5">
          <span>Bank Standard Check</span>
          <span className="text-[#1960a3] dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Policies →</span>
        </div>
      </div>
    </section>
  );
};
