import React, { useState, useMemo } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { Sidebar, NavView } from './components/Sidebar';
import { ClientHeader } from './components/ClientHeader';
import { FinancialMetricsBento } from './components/FinancialMetricsBento';
import { CashFlowVisualizer } from './components/CashFlowVisualizer';
import { RiskStressPanel } from './components/RiskStressPanel';
import { AdvisoryNextBestAction } from './components/AdvisoryNextBestAction';
import { AdvisoryCopilot } from './components/AdvisoryCopilot';

// Modals
import { ARAgingModal } from './components/modals/ARAgingModal';
import { StressTestModal } from './components/modals/StressTestModal';
import { VendorLedgerModal } from './components/modals/VendorLedgerModal';
import { ExportReportModal } from './components/modals/ExportReportModal';
import { ScheduleReviewModal } from './components/modals/ScheduleReviewModal';
import { CitationViewerModal } from './components/modals/CitationViewerModal';
import { NewAnalysisModal } from './components/modals/NewAnalysisModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { EditClientModal } from './components/modals/EditClientModal';

// Views
import { PortfolioInsightsView } from './components/views/PortfolioInsightsView';
import { ProductCatalogView } from './components/views/ProductCatalogView';
import { ReportsView } from './components/views/ReportsView';

// Data & Types
import {
  MOCK_CLIENTS,
  CLIENT_RISK_ALERTS,
  CLIENT_ADVISORY_RECOMMENDATIONS,
  CASH_FLOW_DATA_GVO,
  BANK_PRODUCTS,
} from './data/mockClients';
import { ClientProfile, ChatMessage, Citation, AdvisoryRecommendation, RiskAlert } from './types';
import { Users, BrainCircuit, Package, BarChart3, X, CheckCircle2 } from 'lucide-react';
import { formatINR } from './utils/formatters';

export default function App() {
  const [clients, setClients] = useState<ClientProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-clients');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // fallback
        }
      }
    }
    return MOCK_CLIENTS;
  });

  const [selectedClientId, setSelectedClientId] = useState<string>(MOCK_CLIENTS[0].id);
  const [currentView, setCurrentView] = useState<NavView>('clients');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStressApplied, setIsStressApplied] = useState(false);

  // Selected client memo
  const selectedClient = useMemo(() => {
    return clients.find((c) => c.id === selectedClientId) || clients[0] || MOCK_CLIENTS[0];
  }, [clients, selectedClientId]);

  // Persist clients in localStorage
  const saveClients = (updated: ClientProfile[]) => {
    setClients(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app-clients', JSON.stringify(updated));
    }
  };

  // Modals state
  const [activeModal, setActiveModal] = useState<
    | 'ar_aging'
    | 'stress_test'
    | 'vendor_ledger'
    | 'working_capital'
    | 'export_report'
    | 'schedule_review'
    | 'new_analysis'
    | 'command_palette'
    | 'edit_client'
    | 'help'
    | 'notifications'
    | null
  >(null);

  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);

  // Copilot messages state in Rupees (₹)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'copilot',
      timestamp: '10:42 AM',
      text: `I've analyzed ${selectedClient.name}'s financial ledger and transaction patterns in Indian Rupees (₹). Would you like a breakdown of the overdue receivables (₹${(selectedClient.arAging.days31to60 / 100000).toFixed(1)} Lakhs), or simulate cash runway under Q3 seasonal stress?`,
    },
    {
      id: 'msg-2',
      sender: 'rm',
      timestamp: '10:45 AM',
      text: 'Summarize the supply chain cost drivers and compare against prior year. Are there specific vendors pushing up our working capital burn?',
    },
    {
      id: 'msg-3',
      sender: 'copilot',
      timestamp: '10:46 AM',
      text: `Q2 logistics and materials spend increased by **8.4% YoY overall**.\n\nThe primary driver is a **12% increase** in cold-chain freight from *EcoTransit Solutions* (₹4,86,000 vs ₹4,34,000 prior year). Packaging and agricultural raw materials remained stable.\n\n**Advisory Recommendation**: Introduce our Commercial Fleet Fuel Hedging Program to protect operating margins without increasing borrowing debt.`,
      citations: [
        {
          id: 'cite-ecotransit-main',
          title: 'EcoTransit Solutions Logistics Ledger.pdf',
          type: 'ledger',
          snippet:
            'EcoTransit Solutions Q2 Freight spend: ₹4,86,000 (+12.0% YoY vs ₹4,34,000). Expedited refrigerated transport routes with diesel surcharges.',
        },
      ],
    },
  ]);
  const [isCopilotLoading, setIsCopilotLoading] = useState(false);

  // Dynamic alerts generator if client is uploaded / custom
  const currentAlerts: RiskAlert[] = useMemo(() => {
    if (CLIENT_RISK_ALERTS[selectedClient.id]) {
      return CLIENT_RISK_ALERTS[selectedClient.id];
    }
    // Generate dynamic risk alerts based on actual client KPIs
    const dynamic: RiskAlert[] = [];
    const overdue = selectedClient.arAging.days31to60 + selectedClient.arAging.days61to90;

    if (overdue > 0) {
      dynamic.push({
        id: 'alert-dyn-ar',
        type: 'delayed_ar',
        title: `Overdue Receivables Concentration: ${formatINR(overdue)}`,
        description: `${selectedClient.arAging.invoices.length} invoices are past due terms. Traps operating liquidity and widens DSO.`,
        severity: 'Medium',
        impactMetric: `₹${(overdue / 100000).toFixed(1)}L Delayed`,
        actionText: 'Inspect Aging Ledger',
        actionModal: 'ar_aging',
      });
    }

    if (selectedClient.financialKPIs.runwayMonths < 10) {
      dynamic.push({
        id: 'alert-dyn-runway',
        type: 'working_capital',
        title: `Tight Cash Buffer: ${selectedClient.financialKPIs.runwayMonths} Months Operating Runway`,
        description: `Net monthly burn of ₹${selectedClient.financialKPIs.monthlyBurnRate}k leaves limited room for macro or seasonal delays.`,
        severity: 'High',
        impactMetric: `${selectedClient.financialKPIs.runwayMonths} Mos Runway`,
        actionText: 'Run Stress Scenario',
        actionModal: 'stress_test',
      });
    }

    dynamic.push({
      id: 'alert-dyn-supply',
      type: 'supplier_cost',
      title: `Supply Chain Cost Audit`,
      description: `Monitored ${selectedClient.vendorCostDrivers?.length || 3} primary vendors. Review spend volatility across key operational categories.`,
      severity: 'Low',
      impactMetric: `+8.4% YoY Trend`,
      actionText: 'View Cost Drivers',
      actionModal: 'vendor_ledger',
    });

    return dynamic;
  }, [selectedClient]);

  // Dynamic recommendations
  const currentRecommendations: AdvisoryRecommendation[] = useMemo(() => {
    if (CLIENT_ADVISORY_RECOMMENDATIONS[selectedClient.id]) {
      return CLIENT_ADVISORY_RECOMMENDATIONS[selectedClient.id];
    }
    return [
      {
        id: 'rec-dyn-treds',
        title: 'TReDS / Selective Receivables Acceleration',
        category: 'Receivables Acceleration',
        suitabilityScore: 96,
        summary: `Advance 90% against ₹${(selectedClient.arAging.days31to60 / 100000).toFixed(1)}L in outstanding buyer invoices to eliminate payment delays.`,
        keyBenefit: 'Frees up delayed working capital immediately without balance sheet borrowing.',
        clientPitch: `We can unlock up to 90% of your verified corporate receivables within 24 hours at a transparent 1.15% discount rate.`,
        whyThisRecommendation: {
          underlyingSignals: [
            `₹${(selectedClient.arAging.days31to60 / 100000).toFixed(1)} Lakhs in 31-60d invoices`,
            'Corporate debtor with strong credit rating',
          ],
          policyMatch: 'MSME Receivables Policy §4.2 (Eligible for 90% advance)',
          riskMitigationFactor: 'Non-recourse financing protects balance sheet health.',
          responsibleBankingCheck: 'Transparent 1.15% discount with zero hidden maintenance fees.',
        },
        suggestedProduct: {
          name: 'TReDS Invoice Discounting Facility',
          rateOrFee: '1.15% per 30 days',
          maxFacility: '₹35 Lakhs',
          timeToDeploy: '24-48 Hours',
        },
      },
      {
        id: 'rec-dyn-sweep',
        title: 'Automated Insured Cash Sweep (ICS Yield Maximizer)',
        category: 'Treasury Yield',
        suitabilityScore: 92,
        summary:
          'Earn 6.85% p.a. yield on excess working float while maintaining 100% daily liquidity for payroll.',
        keyBenefit: 'Earn overnight sovereign yield on idle operating checking balances.',
        clientPitch: `Automatically sweep end-of-day balances above ₹5,00,000 into multi-bank liquid accounts yielding 6.85% p.a.`,
        whyThisRecommendation: {
          underlyingSignals: [
            'Consistent operating cash buffer above minimum threshold',
            'Zero existing yield on primary current account',
          ],
          policyMatch: 'Commercial Treasury Liquidity Guidelines §2.1',
          riskMitigationFactor: '100% daily liquidity with automatic back-sweeps for debit clearances.',
          responsibleBankingCheck: 'Zero lockup penalties or transaction fees.',
        },
        suggestedProduct: {
          name: 'Commercial ICS Treasury Sweep',
          rateOrFee: '6.85% p.a.',
          maxFacility: 'Unlimited',
          timeToDeploy: 'Immediate',
        },
      },
    ];
  }, [selectedClient]);

  // Handle Copilot Chat submission
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'rm',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsCopilotLoading(true);

    try {
      const response = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          client: selectedClient,
          conversationHistory: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      const copilotMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'copilot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: data.text || 'I have completed the requested financial analysis in INR.',
        citations: data.citations || [],
        suggestedFollowUps: data.suggestedFollowUps,
      };
      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      console.error(err);
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'copilot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Analysis complete for ${selectedClient.name}: Quick Ratio is ${selectedClient.financialKPIs.quickRatio}x and current runway is ${selectedClient.financialKPIs.runwayMonths} months in Indian Rupees (₹). No covenant breaches detected.`,
        },
      ]);
    } finally {
      setIsCopilotLoading(false);
    }
  };

  const handleDraftClientEmail = (_rec: AdvisoryRecommendation) => {
    setActiveModal('export_report');
  };

  const handleAskCopilotAboutRec = (rec: AdvisoryRecommendation) => {
    handleSendMessage(`Explain the credit underwriting and suitability matching for ${rec.title} for ${selectedClient.name}.`);
  };

  const handleApplyStress = () => {
    setIsStressApplied(true);
  };

  // Filter clients based on top search bar
  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q)
    );
  }, [clients, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f7fafc] dark:bg-[#070b14] text-[#181c1e] dark:text-slate-100 font-sans antialiased transition-colors duration-200">
      {/* Top Navigation Bar */}
      <TopNavbar
        clients={filteredClients}
        selectedClient={selectedClient}
        onSelectClient={(c) => {
          setSelectedClientId(c.id);
          setCurrentView('clients');
        }}
        onOpenHelp={() => setActiveModal('help')}
        onOpenNotifications={() => setActiveModal('notifications')}
        onOpenNewAnalysis={() => setActiveModal('new_analysis')}
        onOpenCommandPalette={() => setActiveModal('command_palette')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Side Navigation Bar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenNewAnalysis={() => setActiveModal('new_analysis')}
        onOpenSettings={() => setActiveModal('help')}
        onOpenSupport={() => setActiveModal('help')}
      />

      {/* Main Content Layout */}
      <main
        id="main-canvas"
        className="md:ml-[280px] pt-16 md:pt-20 p-4 md:p-8 max-w-[1500px] mx-auto min-h-screen flex flex-col lg:flex-row gap-6 pb-24 md:pb-8"
      >
        {/* View Routing */}
        {currentView === 'clients' && (
          <>
            {/* Dashboard Content (Left Side) */}
            <div className="flex-1 flex flex-col gap-6">
              {/* Header Section */}
              <ClientHeader
                client={selectedClient}
                onBackToClients={() => setCurrentView('insights')}
                onExportReport={() => setActiveModal('export_report')}
                onScheduleReview={() => setActiveModal('schedule_review')}
                onEditClient={() => setActiveModal('edit_client')}
              />

              {/* Key Financial Ratios Bento Row in Rupees (₹) */}
              <FinancialMetricsBento
                kpis={selectedClient.financialKPIs}
                onInspectMetric={(metric) => handleSendMessage(`Break down the historical trend for ${metric}.`)}
              />

              {/* Cash Flow Visualizer Section */}
              <CashFlowVisualizer
                data={CASH_FLOW_DATA_GVO}
                isStressApplied={isStressApplied}
                onToggleStress={() => setIsStressApplied(!isStressApplied)}
                onOpenStressModal={() => setActiveModal('stress_test')}
              />

              {/* Proactive Risk & Stress Detection Panel */}
              <RiskStressPanel
                alerts={currentAlerts}
                onOpenModal={(modalType) => setActiveModal(modalType as any)}
              />

              {/* Responsible Advisory Next-Best-Actions */}
              <AdvisoryNextBestAction
                recommendations={currentRecommendations}
                onDraftClientEmail={handleDraftClientEmail}
                onAskCopilotAboutRec={handleAskCopilotAboutRec}
              />
            </div>

            {/* AI Advisory Copilot (Right Sticky Sidebar) */}
            <AdvisoryCopilot
              client={selectedClient}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isCopilotLoading}
              onOpenCitation={(cite) => setSelectedCitation(cite)}
            />
          </>
        )}

        {currentView === 'insights' && (
          <div className="flex-1">
            <PortfolioInsightsView
              clients={clients}
              onSelectClient={(c) => {
                setSelectedClientId(c.id);
                setCurrentView('clients');
              }}
            />
          </div>
        )}

        {currentView === 'products' && (
          <div className="flex-1">
            <ProductCatalogView
              products={BANK_PRODUCTS}
              onOpenProductInCopilot={(p) => {
                setCurrentView('clients');
                handleSendMessage(`Check if ${selectedClient.name} is eligible for ${p.name} under current credit parameters.`);
              }}
            />
          </div>
        )}

        {currentView === 'reports' && (
          <div className="flex-1">
            <ReportsView
              clients={clients}
              onOpenReportModal={(c) => {
                setSelectedClientId(c.id);
                setActiveModal('export_report');
              }}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#0f172a] border-t border-gray-200 dark:border-slate-800 flex justify-around items-center h-16 z-50 md:hidden pb-safe shadow-lg transition-colors">
        <button
          onClick={() => setCurrentView('clients')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'clients' ? 'text-[#1960a3] dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span>Clients</span>
        </button>
        <button
          onClick={() => setCurrentView('insights')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'insights' ? 'text-[#1960a3] dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <BrainCircuit className="w-5 h-5 mb-1" />
          <span>Insights</span>
        </button>
        <button
          onClick={() => setCurrentView('products')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'products' ? 'text-[#1960a3] dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <Package className="w-5 h-5 mb-1" />
          <span>Products</span>
        </button>
        <button
          onClick={() => setCurrentView('reports')}
          className={`flex flex-col items-center justify-center w-full h-full text-xs font-medium ${
            currentView === 'reports' ? 'text-[#1960a3] dark:text-blue-400 font-bold' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-1" />
          <span>Reports</span>
        </button>
      </nav>

      {/* Modals & Dialogs */}
      <ARAgingModal
        client={selectedClient}
        isOpen={activeModal === 'ar_aging'}
        onClose={() => setActiveModal(null)}
        onSelectSolution={() => {
          setActiveModal(null);
          handleSendMessage(`How quickly can we deploy TReDS non-recourse receivables acceleration for ${selectedClient.name}?`);
        }}
      />

      <StressTestModal
        client={selectedClient}
        isOpen={activeModal === 'stress_test'}
        onClose={() => setActiveModal(null)}
        onApplyStress={handleApplyStress}
      />

      <VendorLedgerModal
        client={selectedClient}
        isOpen={activeModal === 'vendor_ledger'}
        onClose={() => setActiveModal(null)}
        onSelectSolution={() => {
          setActiveModal(null);
          handleSendMessage(`Draft a margin-protection advisory plan addressing the recent vendor cost increases for ${selectedClient.name}.`);
        }}
      />

      <ExportReportModal
        client={selectedClient}
        isOpen={activeModal === 'export_report'}
        onClose={() => setActiveModal(null)}
      />

      <ScheduleReviewModal
        client={selectedClient}
        isOpen={activeModal === 'schedule_review'}
        onClose={() => setActiveModal(null)}
        onConfirmSchedule={(details) => {
          handleSendMessage(`Scheduled review with ${selectedClient.name} on ${details.date} at ${details.time}. Agenda: ${details.agenda}`);
        }}
      />

      <NewAnalysisModal
        isOpen={activeModal === 'new_analysis'}
        onClose={() => setActiveModal(null)}
        onClientCreated={(newClient) => {
          const updated = [newClient, ...clients.filter((c) => c.id !== newClient.id)];
          saveClients(updated);
          setSelectedClientId(newClient.id);
          setCurrentView('clients');
        }}
      />

      <EditClientModal
        client={selectedClient}
        isOpen={activeModal === 'edit_client'}
        onClose={() => setActiveModal(null)}
        onSaveClient={(updatedClient) => {
          const updated = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
          saveClients(updated);
        }}
      />

      <CommandPaletteModal
        isOpen={activeModal === 'command_palette'}
        onClose={() => setActiveModal(null)}
        clients={clients}
        onSelectClient={(c) => {
          setSelectedClientId(c.id);
          setCurrentView('clients');
        }}
        onSelectView={(v) => setCurrentView(v)}
        onOpenNewAnalysis={() => setActiveModal('new_analysis')}
        onOpenStressTest={() => setActiveModal('stress_test')}
        onOpenExport={() => setActiveModal('export_report')}
        onOpenScheduleReview={() => setActiveModal('schedule_review')}
      />

      <CitationViewerModal
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Methodology Guide Modal */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] rounded-xl max-w-lg w-full p-6 border border-gray-200 dark:border-slate-800 shadow-2xl text-xs space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#002045] dark:text-white">
                About Advisory AI & Responsible MSME Banking (₹ INR)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
              <strong>Advisory AI</strong> equips Commercial & MSME Relationship Managers with proactive, explainable, and responsible decision support in Indian Rupees (₹). Rather than pushing hard-coded credit sales, it identifies cash flow anomalies, vendor cost surges, and seasonal troughs early.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-lg text-emerald-900 dark:text-emerald-200 font-mono">
              <div className="font-bold mb-1">Core Banking Guardrails:</div>
              • DSCR &gt; 1.25x minimum compliance check<br />
              • Non-predatory fee transparency & TReDS invoice discounting<br />
              • Grounded ledger and policy citation verification (zero hallucination)
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#002045] dark:bg-blue-600 text-white rounded font-bold hover:bg-[#1a365d] dark:hover:bg-blue-700 shadow-2xs"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] rounded-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-800 shadow-2xl text-xs space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-[#002045] dark:text-white">Active Risk & Advisory Alerts ({currentAlerts.length})</h3>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {currentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg text-gray-800 dark:text-slate-200 space-y-1"
                >
                  <div className="font-bold text-[#002045] dark:text-white flex items-center justify-between">
                    <span>{alert.title}</span>
                    <span className="text-[10px] font-mono uppercase bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-slate-400">{alert.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-1.5 bg-[#002045] dark:bg-blue-600 text-white rounded font-bold hover:bg-[#1a365d] dark:hover:bg-blue-700 shadow-2xs"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
