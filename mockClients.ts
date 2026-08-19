import { ClientProfile, CashFlowPoint, BankingProduct, AdvisoryRecommendation, RiskAlert } from '../types';

export const BANK_PRODUCTS: BankingProduct[] = [
  {
    id: 'prod-wcl',
    name: 'Secured Working Capital Cash Credit / OD Facility (CC/OD)',
    category: 'Liquidity & Credit',
    description: 'Revolving working capital facility linked to operating current account for seasonal liquidity, payroll bridges, and inventory pre-purchasing.',
    idealCustomerProfile: 'B2B, MSME & Retail businesses with seasonal revenue swings or >30-day AR conversion cycles.',
    interestRateRange: 'Repo Linked Benchmark (RBLR) + 1.25% to 2.25% p.a.',
    creditRequirements: 'Minimum 2 years operating history, DSCR >= 1.25x, Quick Ratio >= 1.1x, Udyam registered.',
    turnaroundTime: '3-5 business days',
    keyFeatureList: [
      'Automated sweep linkage with operating account to minimize interest burden',
      'Interest charged strictly on daily utilized amount',
      'Zero non-usage commitment charges for average balances > ₹10 Lakhs'
    ]
  },
  {
    id: 'prod-ar-factoring',
    name: 'TReDS & Selective Receivables Acceleration Facility',
    category: 'Receivables Solutions',
    description: 'Non-recourse or limited-recourse invoice discounting to accelerate cash collection from corporate buyers and supermarket chains.',
    idealCustomerProfile: 'Suppliers selling to large regional/national grocery chains, hospital networks, or prime contractors with 45-90 day terms.',
    interestRateRange: '1.15% - 1.65% discount per 30-day invoice aging',
    creditRequirements: 'Underwritten on corporate debtor creditworthiness and verified GST invoices.',
    turnaroundTime: '24-48 hours per approved buyer limit',
    keyFeatureList: [
      'Advances up to 90% of invoice face value immediately upon verification',
      'Full GST portal and ERP/Tally/Zoho ledger synchronization',
      'Protects working capital without taking on long-term debt liabilities'
    ]
  },
  {
    id: 'prod-treasury-sweep',
    name: 'Automated Treasury Liquidity & Insured Auto-Sweep (ICS)',
    category: 'Treasury & Cash Management',
    description: 'Automated yield sweeps from current accounts into high-yielding overnight liquidity funds and short-term term deposits with DICGC safety.',
    idealCustomerProfile: 'Businesses maintaining operating cash buffers > ₹15 Lakhs seeking maximum yield and instant liquidity.',
    interestRateRange: '6.85% p.a. on overnight idle liquidity float',
    creditRequirements: 'Available to all commercial current account clients with average quarterly balance > ₹5 Lakhs.',
    turnaroundTime: 'Same-day instant activation',
    keyFeatureList: [
      'Maintains 100% instant liquidity for daily payroll & vendor RTGS/NEFT debits',
      'Automated daily reverse-sweep whenever operating balance dips below threshold',
      'Monthly automated interest credit directly into primary current account'
    ]
  },
  {
    id: 'prod-cgtmse',
    name: 'CGTMSE & MSME Growth Term Loan',
    category: 'Term Debt & Expansion',
    description: 'Collateral-free or semi-collateralized government credit guarantee scheme for MSME expansion, equipment procurement, and capacity scaling.',
    idealCustomerProfile: 'Growing small businesses seeking predictable 5 to 7-year amortizing term financing with lower equity contributions.',
    interestRateRange: '8.50% - 9.75% p.a. fixed or floating option',
    creditRequirements: 'Udyam MSME certificate; promoter contribution >= 15%; verified GST turnover.',
    turnaroundTime: '7-10 business days',
    keyFeatureList: [
      'Covered under Credit Guarantee Scheme (CGTMSE) for up to ₹5 Crore',
      'Moratorium period up to 6 months for equipment installation',
      'Consolidates fragmented high-cost short-term borrowings into a single predictable EMI'
    ]
  },
  {
    id: 'prod-equipment-lease',
    name: 'Tax-Advantaged Equipment & Commercial Vehicle Finance',
    category: 'Asset Financing',
    description: '100% hypothecation financing for commercial transport, processing machinery, kitchen equipment, and refrigeration cold rooms.',
    idealCustomerProfile: 'Farms, manufacturers, clinics, and logistics operators needing capital expenditure without depleting operational cash.',
    interestRateRange: '7.95% - 8.90% Fixed p.a.',
    creditRequirements: 'Proforma invoice from OEM/authorized dealer, DSCR >= 1.20x',
    turnaroundTime: '48 hours for approvals up to ₹25 Lakhs',
    keyFeatureList: [
      'Eligible for accelerated depreciation tax benefits under Income Tax Act',
      'Flexible seasonal EMI structures matching agricultural/business harvest cycles',
      'Preserves working capital limits for unexpected material or payroll needs'
    ]
  }
];

export const MOCK_CLIENTS: ClientProfile[] = [
  {
    id: 'client-gvo',
    name: 'Green Valley Organics',
    industry: 'Retail & Wholesale Agriculture',
    clientSince: 2019,
    riskTier: 'Low',
    annualRevenue: '₹2,85,00,000 (₹2.85 Cr)',
    employees: 24,
    contactPerson: {
      name: 'Elena Rostova',
      title: 'Founder & Managing Director',
      email: 'elena@greenvalleyorganics.in',
      phone: '+91 98201 45892'
    },
    relationshipManager: 'Marcus Vance, VP Commercial Banking',
    accountNumbers: {
      operatingChecking: '****-9412',
      treasuryMoneyMarket: '****-3108',
      activeCreditLine: '****-5520 (₹10 Lakhs limit, ₹0 drawn)'
    },
    tags: ['Organic Food', 'Wholesale Distributor', 'Seasonal Q3 Harvest', 'Modern Retail Supply'],
    businessDescription: 'Regional producer and distributor of certified organic produce, artisanal preserves, and farm-to-table culinary goods supplied to major regional supermarket chains and organic boutique grocers.',
    financialKPIs: {
      quickRatio: 1.4,
      quickRatioYoY: 0.2,
      quickRatioBenchmark: 1.1,
      monthlyBurnRate: 42, // ₹42k per month
      burnRateQoQ: 5,
      runwayMonths: 14,
      operatingMargin: 18,
      operatingMarginTrend: 'flat',
      operatingMarginBenchmark: 15,
      dscr: 1.62,
      dscrBenchmark: 1.25,
      cashBufferDays: 62,
      averageMonthlyRevenue: 2375000 // ₹23.75 Lakhs/mo
    },
    arAging: {
      current: 1850000,
      days31to60: 940000,
      days61to90: 380000,
      days90Plus: 120000,
      totalOutstanding: 3290000,
      invoices: [
        {
          id: 'INV-2026-088',
          debtor: 'Whole Foods Regional Hub',
          invoiceDate: '2026-06-12',
          dueDate: '2026-07-12',
          daysOverdue: 38,
          amount: 645000,
          status: 'Overdue (31-60d)',
          notes: 'Wholesale produce bulk delivery. Buyer ERP system upgrade cited for automated payment batch lag.'
        },
        {
          id: 'INV-2026-094',
          debtor: 'Sprouts Farmers Market',
          invoiceDate: '2026-06-28',
          dueDate: '2026-07-28',
          daysOverdue: 22,
          amount: 295000,
          status: 'Current',
          notes: 'Regular 30-day net billing cycle. Expected clearance within 5 business days.'
        },
        {
          id: 'INV-2026-071',
          debtor: 'Whole Foods Regional Hub',
          invoiceDate: '2026-05-18',
          dueDate: '2026-06-18',
          daysOverdue: 62,
          amount: 380000,
          status: 'Critical (>60d)',
          notes: 'Follow-up sent to regional accounts controller. Barcode reconciliation resolved; pending remittance.'
        },
        {
          id: 'INV-2026-102',
          debtor: 'Local Harvest Co-op Association',
          invoiceDate: '2026-07-15',
          dueDate: '2026-08-15',
          daysOverdue: 4,
          amount: 142000,
          status: 'Current',
          notes: 'Standard payment schedule; pristine historical payment track record.'
        }
      ]
    },
    vendorCostDrivers: [
      {
        vendor: 'EcoTransit Cold-Chain Logistics',
        category: 'Cold-Chain Freight & Reefer Transport',
        q2Cost: 486000,
        q2CostPriorYear: 434000,
        pctChange: 12.0,
        impactLevel: 'High',
        notes: 'Diesel fuel surcharges and expedited refrigerated reefer routes to regional fulfillment centers.'
      },
      {
        vendor: 'Cascadia Bio-Packaging',
        category: 'Eco-Friendly Packaging & Crates',
        q2Cost: 312000,
        q2CostPriorYear: 309000,
        pctChange: 1.0,
        impactLevel: 'Low',
        notes: 'Volume discount pricing locked through Q4 2026.'
      },
      {
        vendor: 'Pacific Organic Soil & Seed Lab',
        category: 'Agricultural Inputs & Certifications',
        q2Cost: 198000,
        q2CostPriorYear: 189000,
        pctChange: 4.8,
        impactLevel: 'Moderate',
        notes: 'Annual organic compliance audit and bio-fertilizer inputs.'
      }
    ]
  },
  {
    id: 'client-apex',
    name: 'Apex Build & Contracting',
    industry: 'Commercial Construction & HVAC',
    clientSince: 2021,
    riskTier: 'Moderate',
    annualRevenue: '₹5,40,00,000 (₹5.40 Cr)',
    employees: 38,
    contactPerson: {
      name: 'Derek Kowalski',
      title: 'Chief Financial Officer',
      email: 'dkowalski@apexbuildcorp.in',
      phone: '+91 97112 89045'
    },
    relationshipManager: 'Marcus Vance, VP Commercial Banking',
    accountNumbers: {
      operatingChecking: '****-1184',
      treasuryMoneyMarket: '****-6621',
      activeCreditLine: '****-9011 (₹25 Lakhs limit, ₹18 Lakhs drawn)'
    },
    tags: ['Commercial Subcontractor', 'Milestone RA Billing', 'Retainage Holdback', 'Labor Payroll'],
    businessDescription: 'Specialty commercial HVAC, ventilation, and structural mechanical contractor servicing general developers across IT tech parks, universities, and multi-specialty hospitals.',
    financialKPIs: {
      quickRatio: 1.05,
      quickRatioYoY: -0.15,
      quickRatioBenchmark: 1.15,
      monthlyBurnRate: 98,
      burnRateQoQ: 14,
      runwayMonths: 6,
      operatingMargin: 11,
      operatingMarginTrend: 'down',
      operatingMarginBenchmark: 13,
      dscr: 1.28,
      dscrBenchmark: 1.25,
      cashBufferDays: 28,
      averageMonthlyRevenue: 4500000
    },
    arAging: {
      current: 3100000,
      days31to60: 2400000,
      days61to90: 1150000,
      days90Plus: 650000,
      totalOutstanding: 7300000,
      invoices: [
        {
          id: 'INV-APX-441',
          debtor: 'Summit Metro Developers',
          invoiceDate: '2026-05-10',
          dueDate: '2026-06-10',
          daysOverdue: 70,
          amount: 650000,
          status: 'Critical (>60d)',
          notes: 'Retainage holdback on Riverside Tech Tower project pending final architectural sign-off.'
        },
        {
          id: 'INV-APX-512',
          debtor: 'Horizon Healthcare Infrastructure',
          invoiceDate: '2026-06-15',
          dueDate: '2026-07-15',
          daysOverdue: 35,
          amount: 1450000,
          status: 'Overdue (31-60d)',
          notes: 'Phase 2 ductwork inspection completed; waiting on owner joint measurement certificate.'
        }
      ]
    },
    vendorCostDrivers: [
      {
        vendor: 'SteelCraft Alloys & Sheet Metal',
        category: 'Raw Galvanized Sheet & Ducting',
        q2Cost: 1420000,
        q2CostPriorYear: 1220000,
        pctChange: 16.4,
        impactLevel: 'High',
        notes: 'Steel commodity index price surges and freight surcharges.'
      },
      {
        vendor: 'Titan Crane & Rigging Equipment',
        category: 'Heavy Crane Spot Rental',
        q2Cost: 540000,
        q2CostPriorYear: 460000,
        pctChange: 17.3,
        impactLevel: 'High',
        notes: 'High spot rental rates on 80-ton mobile cranes during hospital project lifting.'
      }
    ]
  },
  {
    id: 'client-beacon',
    name: 'Beacon Health Diagnostics',
    industry: 'Specialty Healthcare & Diagnostics',
    clientSince: 2018,
    riskTier: 'Low',
    annualRevenue: '₹4,10,00,000 (₹4.10 Cr)',
    employees: 19,
    contactPerson: {
      name: 'Dr. Sarah Chen, MD',
      title: 'Managing Director & Chief Pathologist',
      email: 'schen@beaconhealth.in',
      phone: '+91 99304 12389'
    },
    relationshipManager: 'Marcus Vance, VP Commercial Banking',
    accountNumbers: {
      operatingChecking: '****-5541',
      treasuryMoneyMarket: '****-8822',
      activeCreditLine: '****-4410 (₹15 Lakhs limit, ₹0 drawn)'
    },
    tags: ['Healthcare Clinic', 'Predictable Inflows', 'TPA Insurance Aging', 'Expansion Candidate'],
    businessDescription: 'Multi-specialty diagnostic and imaging center with MRI, digital radiography, physical therapy, and pathology laboratories.',
    financialKPIs: {
      quickRatio: 1.85,
      quickRatioYoY: 0.35,
      quickRatioBenchmark: 1.3,
      monthlyBurnRate: 35,
      burnRateQoQ: -2,
      runwayMonths: 22,
      operatingMargin: 24,
      operatingMarginTrend: 'up',
      operatingMarginBenchmark: 19,
      dscr: 2.15,
      dscrBenchmark: 1.3,
      cashBufferDays: 110,
      averageMonthlyRevenue: 3416666
    },
    arAging: {
      current: 1900000,
      days31to60: 850000,
      days61to90: 220000,
      days90Plus: 80000,
      totalOutstanding: 3050000,
      invoices: [
        {
          id: 'CLM-2026-901',
          debtor: 'Star Health / Max TPA Network',
          invoiceDate: '2026-06-20',
          dueDate: '2026-07-20',
          daysOverdue: 30,
          amount: 480000,
          status: 'Overdue (31-60d)',
          notes: 'Standard electronic cashless claims batch reconciliation cycle.'
        },
        {
          id: 'CLM-2026-877',
          debtor: 'Corporate Wellness Administrator',
          invoiceDate: '2026-07-01',
          dueDate: '2026-07-31',
          daysOverdue: 19,
          amount: 370000,
          status: 'Current',
          notes: 'Corporate annual executive health checkup contract remittance.'
        }
      ]
    },
    vendorCostDrivers: [
      {
        vendor: 'Apex Imaging Systems',
        category: 'Diagnostic Maintenance & Software SLA',
        q2Cost: 220000,
        q2CostPriorYear: 215000,
        pctChange: 2.3,
        impactLevel: 'Low',
        notes: 'Fixed annual maintenance comprehensive SLA.'
      }
    ]
  }
];

export const CLIENT_RISK_ALERTS: Record<string, RiskAlert[]> = {
  'client-gvo': [
    {
      id: 'alert-gvo-1',
      type: 'delayed_ar',
      title: 'Delayed Receivables Flag',
      severity: 'High',
      description: 'Accounts Receivable > 45 days increased by 15% this quarter. Primary contributor: Whole Foods Regional Hub (₹10.25 Lakhs outstanding across 2 invoice batches).',
      impactMetric: '₹10.25 Lakhs in 31-90 day bucket',
      debtorOrVendor: 'Whole Foods Regional Hub',
      actionText: 'View AR Aging Schedule',
      actionModal: 'ar_aging'
    },
    {
      id: 'alert-gvo-2',
      type: 'seasonal_dip',
      title: 'Seasonal Dip Anticipated',
      severity: 'Medium',
      description: 'Historical agricultural cycle indicates a 20% revenue dip in Q3 (harvest changeover). Current liquidity is adequate (14 months runway), but requires proactive buffer management.',
      impactMetric: 'Estimated ~₹4.7 Lakhs/mo revenue dip in Aug-Sep',
      actionText: 'Simulate Q3 Stress Test',
      actionModal: 'stress_test'
    },
    {
      id: 'alert-gvo-3',
      type: 'supplier_cost',
      title: 'Cold-Chain Freight Cost Surge',
      severity: 'Medium',
      description: 'Logistics costs from EcoTransit surged by 12.0% YoY in Q2, causing a 1.8% compression in gross margin on temperature-sensitive perishable lines.',
      impactMetric: '+12.0% YoY (₹4.86 Lakhs total spend)',
      debtorOrVendor: 'EcoTransit Solutions',
      actionText: 'Inspect Vendor Ledger',
      actionModal: 'vendor_ledger'
    }
  ],
  'client-apex': [
    {
      id: 'alert-apx-1',
      type: 'working_capital',
      title: 'Tightening Cash Buffer Warning',
      severity: 'High',
      description: 'Operating cash buffer compressed to 28 days due to delayed general contractor retainage (₹21 Lakhs in >45d bucket). Active CC line is 72% utilized (₹18L / ₹25L).',
      impactMetric: '28 Cash Buffer Days (Benchmark: 45 Days)',
      actionText: 'Run Liquidity Stress Test',
      actionModal: 'stress_test'
    },
    {
      id: 'alert-apx-2',
      type: 'delayed_ar',
      title: 'High Retainage Holdback Aging',
      severity: 'High',
      description: 'General Contractor retainage holdbacks past 60 days on Summit Metro Tower project totaling ₹6.5 Lakhs pending occupancy signoff.',
      impactMetric: '₹6.5 Lakhs overdue > 60 days',
      debtorOrVendor: 'Summit Metro Developers',
      actionText: 'View AR Aging Schedule',
      actionModal: 'ar_aging'
    }
  ],
  'client-beacon': [
    {
      id: 'alert-bcn-1',
      type: 'seasonal_dip',
      title: 'Idle Float Optimization Notice',
      severity: 'Low',
      description: 'Client is holding ₹68 Lakhs in non-interest operating current account. Auto-sweep liquidity facility can generate ~₹4.65 Lakhs annual interest income with zero liquidity lockup.',
      impactMetric: '+₹4.65 Lakhs/yr potential yield at 6.85% p.a.',
      actionText: 'Inspect Treasury Sweep Proposal',
      actionModal: 'working_capital'
    }
  ]
};

export const CLIENT_ADVISORY_RECOMMENDATIONS: Record<string, AdvisoryRecommendation[]> = {
  'client-gvo': [
    {
      id: 'rec-gvo-1',
      title: 'TReDS & Selective Receivables Acceleration Facility',
      category: 'Receivables Acceleration',
      suitabilityScore: 94,
      summary: 'Establish an automated invoice discounting facility specifically for Whole Foods Regional receivables to unlock ₹10.25 Lakhs in trapped cash without adding balance sheet debt.',
      keyBenefit: 'Improves cash conversion cycle by 32 days; safeguards Q3 seasonal harvest payroll.',
      clientPitch: "Elena, to insulate Green Valley's cash flow during the upcoming Q3 harvest transition while Whole Foods finalizes their system update, we can activate our automated receivables acceleration line. It provides same-day cash on approved GST invoices so your expansion schedule stays right on track.",
      whyThisRecommendation: {
        underlyingSignals: [
          'AR aging > 45 days rose by 15% this quarter, largely concentrated in Whole Foods (₹10.25 Lakhs total).',
          'Client has strong Quick Ratio (1.4x) and low risk tier, qualifying for prime discount rates (1.15% per 30 days).',
          'Seasonal harvest dip in August/September demands immediate working capital preservation.'
        ],
        policyMatch: 'Commercial Credit Policy §4.2: Wholesale suppliers to verified supermarket chains qualify for streamlined invoice discounting up to ₹35 Lakhs facility.',
        riskMitigationFactor: 'Non-debt working capital solution avoids increasing debt-service obligations during seasonal revenue slowdowns.',
        responsibleBankingCheck: 'Provides customer with full transparency on 1.15% fee structure vs. expensive spot bridge loans or unorganized finance.'
      },
      suggestedProduct: {
        name: 'Selective Receivables Acceleration Facility',
        rateOrFee: '1.15% discount per 30 days',
        maxFacility: '₹35,00,000 (₹35 Lakhs)',
        timeToDeploy: '48 Hours'
      }
    },
    {
      id: 'rec-gvo-2',
      title: 'Automated Insured Cash Sweep (ICS) for Operating Float',
      category: 'Treasury Yield',
      suitabilityScore: 89,
      summary: 'Deploy automated overnight sweep from current account into high-yield government liquidity funds (6.85% p.a.) while maintaining instant payroll drawability.',
      keyBenefit: 'Generates estimated ₹1,42,000 annual risk-free yield on Green Valley\'s ₹32 Lakhs operating cash float.',
      clientPitch: "With your healthy 14-month cash runway, we can put your everyday cash float to work. An automated sweep pays 6.85% p.a. overnight while keeping every Rupee instantly accessible for vendor RTGS debits and payroll.",
      whyThisRecommendation: {
        underlyingSignals: [
          'Average monthly cash balance consistently exceeds ₹30,00,000 with 14-month runway.',
          'Currently earning standard zero/low depository yield on operating current account.'
        ],
        policyMatch: 'Treasury Management Guidelines §8.1: Clients maintaining >₹15 Lakhs idle balances qualify for automated tiered liquidity sweeps.',
        riskMitigationFactor: 'Zero principal risk with DICGC backed bank safety and liquid mutual fund security.',
        responsibleBankingCheck: 'Zero lock-up periods or withdrawal penalties; 100% automated sweep back to current account whenever balances drop below ₹5 Lakhs threshold.'
      },
      suggestedProduct: {
        name: 'Automated Insured Cash Sweep (ICS)',
        rateOrFee: '6.85% p.a. (Net of admin fee)',
        maxFacility: 'Unlimited (DICGC backed)',
        timeToDeploy: 'Same Day'
      }
    }
  ],
  'client-apex': [
    {
      id: 'rec-apx-1',
      title: 'Working Capital Cash Credit (CC) Limit Enhancement',
      category: 'Liquidity & Cash Buffer',
      suitabilityScore: 96,
      summary: 'Upsize existing revolving Cash Credit limit from ₹25 Lakhs to ₹45 Lakhs linked with project milestone certificates to absorb the 28-day cash buffer compression.',
      keyBenefit: 'Expands liquidity headroom by ₹20 Lakhs, restoring cash buffer from 28 to 55 days.',
      clientPitch: "Derek, given your strong order book and recent retainage delays on the Tech Tower build, increasing your Cash Credit line to ₹45 Lakhs gives Apex the cushion needed to cover labor payroll comfortably while progress bills clear.",
      whyThisRecommendation: {
        underlyingSignals: [
          'CC line utilization currently at 72% (₹18 Lakhs drawn out of ₹25 Lakhs).',
          'Cash buffer is down to 28 days against industry safety target of 45 days.',
          'Strong 1.28x DSCR and ₹5.40 Cr annual turnover support an expanded credit limit under MSME underwriting guidelines.'
        ],
        policyMatch: 'MSME Lending Rule §3.1: Subcontractors with verifiable project milestone billings qualify for retainage bridge lines up to 10% of gross annual turnover.',
        riskMitigationFactor: 'Prevents expensive vendor defaults or emergency high-cost equipment financing.',
        responsibleBankingCheck: 'Requires clear milestone releases; structured at Repo Linked Rate + 1.50% with zero prepayment penalties.'
      },
      suggestedProduct: {
        name: 'Expanded Revolving Cash Credit Facility',
        rateOrFee: 'RBLR + 1.50% variable',
        maxFacility: '₹45,00,000 (₹45 Lakhs)',
        timeToDeploy: '4 business days'
      }
    }
  ],
  'client-beacon': [
    {
      id: 'rec-bcn-1',
      title: 'Diagnostic Wing Modernization & Medical Equipment Financing',
      category: 'Growth Financing',
      suitabilityScore: 92,
      summary: 'Fund digital MRI and pathology expansion via a 7-year fixed 7.95% equipment loan, preserving Beacon\'s ₹68 Lakhs cash reserves.',
      keyBenefit: 'Eligible for accelerated depreciation tax write-offs with zero depletion of clinic operational reserves.',
      clientPitch: "Dr. Chen, Beacon's pristine 2.15x DSCR and 22-month runway put you in an ideal position to acquire the new MRI and diagnostic suite via our specialized medical equipment program at 7.95% fixed, keeping your liquid reserves intact.",
      whyThisRecommendation: {
        underlyingSignals: [
          'Operating margin is an industry-leading 24% with 2.15x DSCR.',
          'Client expressed intent for clinic expansion without tapping operational cash reserves.'
        ],
        policyMatch: 'Healthcare Practice Advisory §12: Medical clinics with >3 years vintage qualify for 100% equipment financing up to ₹75 Lakhs.',
        riskMitigationFactor: 'Secured directly by medical hardware hypothecation; does not encumber diagnostic receivables.',
        responsibleBankingCheck: 'Fixed-rate structure protects against future interest rate volatility.'
      },
      suggestedProduct: {
        name: 'Healthcare Equipment Loan / Lease',
        rateOrFee: '7.95% Fixed p.a. (7-Year Term)',
        maxFacility: '₹60,00,000 (₹60 Lakhs)',
        timeToDeploy: '3 business days'
      }
    }
  ]
};

export const CASH_FLOW_DATA_GVO: CashFlowPoint[] = [
  // Past 9 months historical (in ₹ thousands: e.g. 220 = ₹2,20,000 / ₹2.2L)
  { month: '2025-11', label: 'Nov 25', isHistorical: true, historicalInflow: 220, historicalOutflow: 185, netCash: 35 },
  { month: '2025-12', label: 'Dec 25', isHistorical: true, historicalInflow: 260, historicalOutflow: 210, netCash: 50, events: 'Festival & wedding season wholesale surge' },
  { month: '2026-01', label: 'Jan 26', isHistorical: true, historicalInflow: 215, historicalOutflow: 190, netCash: 25 },
  { month: '2026-02', label: 'Feb 26', isHistorical: true, historicalInflow: 230, historicalOutflow: 195, netCash: 35 },
  { month: '2026-03', label: 'Mar 26', isHistorical: true, historicalInflow: 245, historicalOutflow: 205, netCash: 40 },
  { month: '2026-04', label: 'Apr 26', isHistorical: true, historicalInflow: 240, historicalOutflow: 200, netCash: 40 },
  { month: '2026-05', label: 'May 26', isHistorical: true, historicalInflow: 255, historicalOutflow: 218, netCash: 37 },
  { month: '2026-06', label: 'Jun 26', isHistorical: true, historicalInflow: 235, historicalOutflow: 222, netCash: 13, events: 'Whole Foods delayed billing batch' },
  { month: '2026-07', label: 'Jul 26', isHistorical: true, historicalInflow: 228, historicalOutflow: 225, netCash: 3, events: 'EcoTransit cold-chain freight +12% impact' },
  // AI Predicted next 5 months (Baseline vs Stressed)
  { month: '2026-08', label: 'Aug 26 (P)', isHistorical: false, predictedInflow: 195, predictedOutflow: 215, netCash: -20, stressedInflow: 175, stressedOutflow: 228, events: 'Seasonal harvest transition dip' },
  { month: '2026-09', label: 'Sep 26 (P)', isHistorical: false, predictedInflow: 190, predictedOutflow: 210, netCash: -20, stressedInflow: 168, stressedOutflow: 225, events: 'Low agricultural revenue trough' },
  { month: '2026-10', label: 'Oct 26 (P)', isHistorical: false, predictedInflow: 245, predictedOutflow: 205, netCash: 40, stressedInflow: 220, stressedOutflow: 215, events: 'Festival harvest wholesale recovery' },
  { month: '2026-11', label: 'Nov 26 (P)', isHistorical: false, predictedInflow: 270, predictedOutflow: 212, netCash: 58, stressedInflow: 245, stressedOutflow: 220, events: 'Diwali & festive inventory restocking' },
  { month: '2026-12', label: 'Dec 26 (P)', isHistorical: false, predictedInflow: 295, predictedOutflow: 220, netCash: 75, stressedInflow: 270, stressedOutflow: 230, events: 'Peak Q4 retail sales' }
];
