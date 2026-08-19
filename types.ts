export type RiskTier = 'Low' | 'Moderate' | 'Elevated' | 'High';

export interface ClientProfile {
  id: string;
  name: string;
  industry: string;
  clientSince: number;
  riskTier: RiskTier;
  annualRevenue: string;
  employees: number;
  contactPerson: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  relationshipManager: string;
  accountNumbers: {
    operatingChecking: string;
    treasuryMoneyMarket: string;
    activeCreditLine?: string;
  };
  tags: string[];
  businessDescription: string;
  financialKPIs: FinancialKPIs;
  arAging: ARAgingData;
  vendorCostDrivers: VendorCostDriver[];
}

export interface FinancialKPIs {
  quickRatio: number;
  quickRatioYoY: number;
  quickRatioBenchmark: number;
  monthlyBurnRate: number; // in INR thousands (e.g. 42k)
  burnRateQoQ: number; // percentage
  runwayMonths: number;
  operatingMargin: number; // percentage
  operatingMarginTrend: 'up' | 'flat' | 'down';
  operatingMarginBenchmark: number;
  dscr: number; // Debt Service Coverage Ratio
  dscrBenchmark: number;
  cashBufferDays: number;
  averageMonthlyRevenue: number; // in INR
}

export interface CashFlowPoint {
  month: string;
  label: string;
  isHistorical: boolean;
  historicalInflow?: number; // in INR thousands (₹k)
  historicalOutflow?: number; // in INR thousands (₹k)
  predictedInflow?: number; // in INR thousands (₹k)
  predictedOutflow?: number; // in INR thousands (₹k)
  netCash: number; // in INR thousands (₹k)
  predictedNetCash?: number;
  stressedInflow?: number;
  stressedOutflow?: number;
  events?: string;
}

export interface ARAgingData {
  current: number; // 0-30 days (₹)
  days31to60: number; // (₹)
  days61to90: number; // (₹)
  days90Plus: number; // (₹)
  totalOutstanding: number; // (₹)
  invoices: ARInvoice[];
}

export interface ARInvoice {
  id: string;
  debtor: string;
  invoiceDate: string;
  dueDate: string;
  daysOverdue: number;
  amount: number;
  status: 'Current' | 'Overdue (31-60d)' | 'Critical (>60d)';
  notes: string;
}

export interface VendorCostDriver {
  vendor: string;
  category: string;
  q2Cost: number;
  q2CostPriorYear: number;
  pctChange: number;
  impactLevel: 'High' | 'Moderate' | 'Low';
  notes: string;
}

export interface RiskAlert {
  id: string;
  type: 'delayed_ar' | 'seasonal_dip' | 'supplier_cost' | 'working_capital';
  title: string;
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  impactMetric: string;
  debtorOrVendor?: string;
  actionText: string;
  actionModal: 'ar_aging' | 'stress_test' | 'vendor_ledger' | 'working_capital';
}

export interface AdvisoryRecommendation {
  id: string;
  title: string;
  category: 'Liquidity & Cash Buffer' | 'Receivables Acceleration' | 'Cost Optimization' | 'Treasury Yield' | 'Growth Financing';
  suitabilityScore: number; // 0-100%
  summary: string;
  keyBenefit: string;
  clientPitch: string;
  whyThisRecommendation: {
    underlyingSignals: string[];
    policyMatch: string;
    riskMitigationFactor: string;
    responsibleBankingCheck: string;
  };
  suggestedProduct: {
    name: string;
    rateOrFee: string;
    maxFacility: string;
    timeToDeploy: string;
  };
}

export interface Citation {
  id: string;
  title: string;
  type: 'ledger' | 'policy' | 'invoice' | 'market_benchmark';
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'copilot' | 'rm';
  timestamp: string;
  text: string;
  citations?: Citation[];
  suggestedFollowUps?: string[];
  isGenerating?: boolean;
}

export interface BankingProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  idealCustomerProfile: string;
  interestRateRange: string;
  creditRequirements: string;
  turnaroundTime: string;
  keyFeatureList: string[];
}
