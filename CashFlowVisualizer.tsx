import React, { useState } from 'react';
import { TrendingUp, Sparkles, SlidersHorizontal, Info, ChevronRight, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CashFlowPoint } from '../types';
import { formatK, formatINR } from '../utils/formatters';

interface CashFlowVisualizerProps {
  data: CashFlowPoint[];
  isStressApplied: boolean;
  onToggleStress: () => void;
  onOpenStressModal: () => void;
}

export const CashFlowVisualizer: React.FC<CashFlowVisualizerProps> = ({
  data,
  isStressApplied,
  onToggleStress,
  onOpenStressModal,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<CashFlowPoint | null>(null);

  // Dynamic max amount calculation for responsive graph scaling
  const maxAmount = Math.max(
    ...data.map((d) =>
      Math.max(
        d.historicalInflow || 0,
        d.historicalOutflow || 0,
        d.predictedInflow || 0,
        d.predictedOutflow || 0,
        d.stressedInflow || 0,
        d.stressedOutflow || 0,
        280
      )
    )
  );

  return (
    <section
      id="cash-flow-visualizer-section"
      className="bg-white dark:bg-[#0f172a] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs transition-colors"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-[#002045] dark:text-white tracking-tight">
              Cash Flow Forecast & Stress Scenarios
            </h2>
            <span className="text-[10px] font-mono uppercase bg-blue-100 dark:bg-blue-950/60 text-[#1960a3] dark:text-blue-400 font-bold px-2 py-0.5 rounded">
              INR ₹ / Predictive Model
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Historical ledger trends integrated with 6-month predictive cash inflows and outflows
          </p>
        </div>

        {/* Stress Toggle & Modal Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleStress}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer ${
              isStressApplied
                ? 'bg-red-600 text-white shadow-red-200 dark:shadow-none'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isStressApplied ? 'Stress Applied (-20%)' : 'Simulate Stress'}</span>
          </button>

          <button
            onClick={onOpenStressModal}
            className="p-1.5 border border-gray-300 dark:border-slate-700 hover:border-[#1960a3] dark:hover:border-blue-400 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            title="Custom What-If Stress Sliders"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend & Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4 pb-3 border-b border-gray-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#1960a3] dark:bg-blue-500"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Inflows (Revenue ₹)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500"></span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">Outflows (COGS & OpEx ₹)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm border-2 border-dashed border-[#1960a3] dark:border-blue-400"></span>
            <span className="text-gray-500 dark:text-slate-400">AI Predictive Horizon</span>
          </div>
        </div>

        {isStressApplied && (
          <div className="text-[11px] font-mono text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded border border-red-200 dark:border-red-800 flex items-center gap-1">
            <span>⚠️ -20% Seasonal Inflow Dip Active</span>
          </div>
        )}
      </div>

      {/* Bar Chart Visualization */}
      <div className="relative h-60 w-full flex items-end justify-between gap-1.5 sm:gap-3 pt-6 pb-2">
        {data.map((point) => {
          const inflow = isStressApplied
            ? point.stressedInflow || point.predictedInflow || point.historicalInflow || 0
            : point.historicalInflow || point.predictedInflow || 0;

          const outflow = isStressApplied
            ? point.stressedOutflow || point.predictedOutflow || point.historicalOutflow || 0
            : point.historicalOutflow || point.predictedOutflow || 0;

          const inflowHeightPct = Math.min(100, Math.round((inflow / maxAmount) * 100));
          const outflowHeightPct = Math.min(100, Math.round((outflow / maxAmount) * 100));
          const isPredicted = !point.isHistorical;

          return (
            <div
              key={point.month}
              onMouseEnter={() => setHoveredPoint(point)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
            >
              {/* Event Badge on Top */}
              {point.events && (
                <div className="absolute -top-3 z-10 hidden sm:block">
                  <span className="text-[9px] font-mono font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                    ⚠️ Dip
                  </span>
                </div>
              )}

              {/* Inflow & Outflow Bars Group */}
              <div className="w-full flex items-end justify-center gap-1 h-44 pb-1">
                {/* Inflow Bar (Blue) */}
                <div
                  style={{ height: `${Math.max(6, inflowHeightPct)}%` }}
                  className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                    isPredicted
                      ? 'bg-[#1960a3]/70 dark:bg-blue-600/70 border-t-2 border-dashed border-[#1960a3] dark:border-blue-400 group-hover:bg-[#1960a3]'
                      : 'bg-[#1960a3] dark:bg-blue-500 group-hover:brightness-110'
                  }`}
                />

                {/* Outflow Bar (Rose/Red) */}
                <div
                  style={{ height: `${Math.max(6, outflowHeightPct)}%` }}
                  className={`w-1/2 rounded-t-sm transition-all duration-300 ${
                    isPredicted
                      ? 'bg-rose-400/70 dark:bg-rose-600/70 border-t-2 border-dashed border-rose-500 group-hover:bg-rose-500'
                      : 'bg-rose-500 dark:bg-rose-500 group-hover:brightness-110'
                  }`}
                />
              </div>

              {/* Month Label */}
              <span
                className={`text-[10px] font-mono mt-1 ${
                  isPredicted
                    ? 'text-[#1960a3] dark:text-blue-400 font-bold'
                    : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                {point.month.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hover Information Strip */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        {hoveredPoint ? (
          <>
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#002045] dark:text-white">
                {hoveredPoint.label} ({hoveredPoint.isHistorical ? 'Audited Ledger' : 'AI Predictive Horizon'})
              </span>
              <span className="text-gray-400 dark:text-slate-600">•</span>
              <span className="text-[#1960a3] dark:text-blue-400 font-mono font-semibold">
                Inflow: {formatK(hoveredPoint.historicalInflow || hoveredPoint.predictedInflow || 0, true)}
              </span>
              <span className="text-rose-600 dark:text-rose-400 font-mono font-semibold">
                Outflow: {formatK(hoveredPoint.historicalOutflow || hoveredPoint.predictedOutflow || 0, true)}
              </span>
            </div>
            <div className="text-gray-600 dark:text-slate-400 font-mono text-[11px]">
              Net Cash Flow:{' '}
              <strong
                className={
                  (hoveredPoint.historicalInflow || hoveredPoint.predictedInflow || 0) >=
                  (hoveredPoint.historicalOutflow || hoveredPoint.predictedOutflow || 0)
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-600 dark:text-rose-400'
                }
              >
                {formatK(
                  (hoveredPoint.historicalInflow || hoveredPoint.predictedInflow || 0) -
                    (hoveredPoint.historicalOutflow || hoveredPoint.predictedOutflow || 0),
                  true
                )}
              </strong>
            </div>
          </>
        ) : (
          <div className="text-gray-500 dark:text-slate-400 flex items-center justify-between w-full">
            <span>Hover over any monthly bar to inspect detailed receipts, vendor payables, and net trajectory.</span>
            <span className="text-[#1960a3] dark:text-blue-400 font-semibold hidden md:inline">
              Historical Ledger (Jan–Jul) &rarr; Predictive AI Forecast (Aug–Dec)
            </span>
          </div>
        )}
      </div>
    </section>
  );
};
