import React from 'react';
import { ArrowLeft, Download, Calendar, ShieldCheck, AlertTriangle, AlertCircle, Edit3 } from 'lucide-react';
import { ClientProfile } from '../types';

interface ClientHeaderProps {
  client: ClientProfile;
  onBackToClients?: () => void;
  onExportReport: () => void;
  onScheduleReview: () => void;
  onEditClient?: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  onBackToClients,
  onExportReport,
  onScheduleReview,
  onEditClient,
}) => {
  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Risk Tier: Low
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Risk Tier: Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-3.5 h-3.5" />
            Risk Tier: Elevated
          </span>
        );
    }
  };

  return (
    <header id="client-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-4 transition-colors">
      <div>
        <button
          onClick={onBackToClients}
          className="flex items-center gap-1.5 text-xs font-mono uppercase text-gray-500 dark:text-slate-400 hover:text-[#002045] dark:hover:text-white mb-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Portfolio Overview</span>
        </button>
        
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] dark:text-white tracking-tight">
            {client.name}
          </h1>
          {onEditClient && (
            <button
              onClick={onEditClient}
              className="p-1.5 text-gray-400 hover:text-[#1960a3] dark:hover:text-blue-400 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Client Profile & Financial KPIs"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-slate-300 mt-1.5">
          <span className="font-medium">{client.industry}</span>
          <span className="text-gray-300 dark:text-slate-700">•</span>
          <span>Client since {client.clientSince}</span>
          <span className="text-gray-300 dark:text-slate-700">•</span>
          {getRiskBadge(client.riskTier)}
          <span className="text-gray-300 dark:text-slate-700">•</span>
          <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 px-2 py-0.5 rounded font-mono font-semibold">
            Turnover: {client.annualRevenue}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          id="btn-export-report"
          onClick={onExportReport}
          className="px-3.5 py-2 border border-[#1960a3] dark:border-blue-500 text-[#1960a3] dark:text-blue-300 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 font-semibold text-xs md:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Memo</span>
        </button>
        <button
          id="btn-schedule-review"
          onClick={onScheduleReview}
          className="px-4 py-2 bg-[#002045] dark:bg-blue-600 text-white rounded-lg font-bold text-xs md:text-sm hover:bg-[#1a365d] dark:hover:bg-blue-700 flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Review</span>
        </button>
      </div>
    </header>
  );
};
