import React from 'react';
import { AlertCircle, AlertTriangle, ChevronRight, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { RiskAlert } from '../types';

interface RiskStressPanelProps {
  alerts: RiskAlert[];
  onTriggerAction: (modalType: 'ar_aging' | 'vendor_ledger' | 'stress_test' | 'policy_guidelines') => void;
}

export const RiskStressPanel: React.FC<RiskStressPanelProps> = ({
  alerts,
  onTriggerAction,
}) => {
  return (
    <section id="risk-stress-points-panel" className="bg-white dark:bg-[#0f172a] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#002045] dark:text-white tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>AI Risk Signals & Stress Points</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Real-time pattern detection cross-referencing ledger entries with industry benchmarks
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
          {alerts.length} Active Triggers
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const isHigh = alert.severity === 'High';
          return (
            <div
              key={alert.id}
              className={`p-3.5 rounded-lg border transition-all ${
                isHigh
                  ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 hover:border-red-400'
                  : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 hover:border-amber-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {isHigh ? (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{alert.title}</span>
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                          isHigh
                            ? 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-200'
                            : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1 leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200/60 dark:border-slate-800 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-gray-500 dark:text-slate-400 block">
                      Financial Drag
                    </span>
                    <span className="font-mono text-xs font-bold text-red-600 dark:text-red-400">
                      {alert.impactMetric}
                    </span>
                  </div>

                  <button
                    onClick={() => alert.actionModal && onTriggerAction(alert.actionModal)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:border-[#1960a3] dark:hover:border-blue-400 text-xs font-bold text-[#002045] dark:text-blue-300 rounded hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <span>{alert.actionText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
