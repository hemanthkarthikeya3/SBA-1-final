import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, ExternalLink, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { AdvisoryRecommendation } from '../types';

interface AdvisoryNextBestActionProps {
  recommendations: AdvisoryRecommendation[];
  onOpenProductModal: (productName: string) => void;
  onScheduleClientPitch: (rec: AdvisoryRecommendation) => void;
}

export const AdvisoryNextBestAction: React.FC<AdvisoryNextBestActionProps> = ({
  recommendations,
  onOpenProductModal,
  onScheduleClientPitch,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPitch = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="advisory-next-best-action-panel" className="bg-white dark:bg-[#0f172a] rounded-xl p-4 md:p-6 border border-gray-200 dark:border-slate-800 shadow-2xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#002045] dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1960a3] dark:text-blue-400 shrink-0" />
            <span>Next-Best-Action Advisory Strategy (Non-Pushy / Value-First)</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            Prescriptive solutions aligned with RBI guidelines, MSME cash flow preservation, and responsible banking
          </p>
        </div>
        <span className="text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
          Explainable AI Recommendations
        </span>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isExpanded = expandedId === rec.id;
          return (
            <div
              key={rec.id}
              className="border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/60 transition-all hover:border-[#1960a3]/50 dark:hover:border-blue-500/50"
            >
              {/* Header Bar */}
              <div className="p-4 bg-gray-50/70 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1960a3]/10 dark:bg-blue-900/40 text-[#1960a3] dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {rec.suitabilityScore}%
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase bg-blue-100 dark:bg-blue-950 text-[#1960a3] dark:text-blue-300 px-2 py-0.2 rounded font-bold">
                        {rec.category}
                      </span>
                      <h3 className="font-bold text-sm text-[#002045] dark:text-white">{rec.title}</h3>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-slate-300 mt-1">{rec.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    className="px-3 py-1.5 border border-gray-300 dark:border-slate-700 hover:border-[#1960a3] dark:hover:border-blue-400 text-xs font-semibold text-gray-700 dark:text-slate-200 rounded flex items-center gap-1 bg-white dark:bg-slate-800 transition-colors"
                  >
                    <span>{isExpanded ? 'Hide Justification' : 'View AI Reasoning'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onScheduleClientPitch(rec)}
                    className="px-3.5 py-1.5 bg-[#002045] dark:bg-blue-600 hover:bg-[#1a365d] dark:hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>Use Pitch Memo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Explainability Section */}
              {isExpanded && (
                <div className="p-4 md:p-5 space-y-4 bg-white dark:bg-[#0f172a] text-xs">
                  {/* Client Value Pitch */}
                  <div className="p-3 bg-blue-50/50 dark:bg-slate-850 rounded-lg border border-blue-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-[#002045] dark:text-blue-300 uppercase tracking-wider text-[10px]">
                        Suggested Relationship Manager Script / Email Angle
                      </span>
                      <button
                        onClick={() => handleCopyPitch(rec.id, rec.clientPitch)}
                        className="text-gray-500 dark:text-slate-400 hover:text-[#1960a3] dark:hover:text-blue-300 text-[11px] flex items-center gap-1"
                      >
                        {copiedId === rec.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy Script</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="italic text-gray-800 dark:text-slate-200 leading-relaxed">
                      "{rec.clientPitch}"
                    </p>
                  </div>

                  {/* 4 Pillars of Explainability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {/* Underlying Data Signals */}
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
                      <span className="font-bold text-gray-800 dark:text-slate-200 block mb-2">
                        1. Grounded Ledger Signals
                      </span>
                      <ul className="space-y-1 text-gray-600 dark:text-slate-300">
                        {rec.whyThisRecommendation.underlyingSignals.map((sig, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#1960a3] dark:text-blue-400 font-bold">•</span>
                            <span>{sig}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bank Underwriting Policy Match */}
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
                      <span className="font-bold text-gray-800 dark:text-slate-200 block mb-2">
                        2. Credit & Product Policy Alignment
                      </span>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                        {rec.whyThisRecommendation.policyMatch}
                      </p>
                    </div>

                    {/* Risk Mitigation */}
                    <div className="p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800">
                      <span className="font-bold text-gray-800 dark:text-slate-200 block mb-2">
                        3. Risk Mitigation & Cash Defense
                      </span>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                        {rec.whyThisRecommendation.riskMitigationFactor}
                      </p>
                    </div>

                    {/* Responsible Banking Check */}
                    <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-bold text-emerald-900 dark:text-emerald-300">
                          4. Responsible Banking Guardrail
                        </span>
                      </div>
                      <p className="text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                        {rec.whyThisRecommendation.responsibleBankingCheck}
                      </p>
                    </div>
                  </div>

                  {/* Product Specification Bar */}
                  {rec.suggestedProduct && (
                    <div className="p-3 bg-slate-900 text-white rounded-lg flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block">
                          Suggested Facility Product
                        </span>
                        <span className="font-bold text-sm text-white">
                          {rec.suggestedProduct.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Rate / Fee:</span>
                          <span className="text-emerald-400 font-bold">{rec.suggestedProduct.rateOrFee}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Max Sanction:</span>
                          <span className="text-white font-bold">{rec.suggestedProduct.maxFacility}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">SLA:</span>
                          <span className="text-blue-300 font-bold">{rec.suggestedProduct.timeToDeploy}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenProductModal(rec.suggestedProduct!.name)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>Full Sheet</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
