import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Schema } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(express.json({ limit: "10mb" }));

  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "advisory-ai-rm",
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      currency: "INR (₹)",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // Copilot Chat API with Structured AI Grounding
  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { message, client, conversationHistory } = req.body;
      const ai = getAI();

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      if (ai) {
        const clientContext = client
          ? `
Client Financial Profile:
- Company Name: ${client.name} (${client.industry})
- Risk Tier: ${client.riskTier} | Client Since: ${client.clientSince}
- Annual Turnover / Revenue: ${client.annualRevenue}
- Quick Ratio: ${client.financialKPIs?.quickRatio} (Industry Benchmark: ${client.financialKPIs?.quickRatioBenchmark})
- Monthly Net Burn Rate: ₹${client.financialKPIs?.monthlyBurnRate}k (Runway: ${client.financialKPIs?.runwayMonths} months)
- Operating Margin: ${client.financialKPIs?.operatingMargin}% (Benchmark: ${client.financialKPIs?.operatingMarginBenchmark}%)
- Cash Buffer Days: ${client.financialKPIs?.cashBufferDays} days | DSCR: ${client.financialKPIs?.dscr}x
- Total AR Outstanding: ₹${client.arAging?.totalOutstanding?.toLocaleString("en-IN")}
  * 0-30d Current: ₹${client.arAging?.current?.toLocaleString("en-IN")}
  * 31-60d Overdue: ₹${client.arAging?.days31to60?.toLocaleString("en-IN")}
  * 61-90d Overdue: ₹${client.arAging?.days61to90?.toLocaleString("en-IN")}
  * 90d+ Critical: ₹${client.arAging?.days90Plus?.toLocaleString("en-IN")}
- Detailed AR Invoices: ${JSON.stringify(client.arAging?.invoices || [])}
- Vendor Cost Drivers & Inflation Spikes: ${JSON.stringify(client.vendorCostDrivers || [])}
`
          : "Generic Commercial MSME Banking Advisory context in Indian Rupees (₹).";

        const systemInstruction = `You are the Lead Commercial Banking AI Advisory Copilot assisting Relationship Managers (RMs).
Your goals:
1. Provide consultative, mathematically grounded financial analysis in Indian Rupees (₹, Lakhs, Crores).
2. Avoid hard selling. Prioritize cash flow preservation, margin defense, working capital optimization, and MSME policy alignments (TReDS, CGTMSE, Cash Sweep, CC/OD).
3. Always generate grounded citations when referencing specific client invoices, vendor cost lines, or regulatory policies.
4. Provide 3 specific next-step prompts for the Relationship Manager.`;

        const responseSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "Structured markdown advisory answer for the Relationship Manager.",
            },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  type: {
                    type: Type.STRING,
                    enum: ["ledger", "policy", "invoice", "market_benchmark"],
                  },
                  snippet: { type: Type.STRING },
                },
                required: ["id", "title", "type", "snippet"],
              },
              description: "Factual ledger or policy citations directly supporting the response.",
            },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 short, highly actionable next question prompts for the banker.",
            },
          },
          required: ["text", "citations", "suggestedFollowUps"],
        };

        const chatPrompt = `
${clientContext}

Conversation History:
${(conversationHistory || [])
  .map((h: any) => `${h.sender === "rm" ? "Relationship Manager" : "Copilot"}: ${h.text}`)
  .join("\n")}

Relationship Manager Query: "${message}"

Analyze the ledger data and formulate an articulate, data-backed advisory briefing with relevant citations.`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: chatPrompt,
          config: {
            systemInstruction,
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema,
          },
        });

        const parsed = JSON.parse(response.text || "{}");
        return res.json(parsed);
      }

      // Dynamic fallback for offline/local development without API key
      return res.json({
        text: `**Analysis for ${client?.name || "Client"}**:\n\n- **Quick Ratio**: **${client?.financialKPIs?.quickRatio || 1.4}x** vs benchmark ${client?.financialKPIs?.quickRatioBenchmark || 1.1}x.\n- **Cash Runway**: **${client?.financialKPIs?.runwayMonths || 12} Months** (Net Burn: ₹${client?.financialKPIs?.monthlyBurnRate || 40}k/mo).\n- **Working Capital Recommendation**: Review AR aging and consider automated TReDS invoice discounting to stabilize operating cash buffers.`,
        citations: [
          {
            id: "cite-local-ledger",
            title: `${client?.name || "Client"} Financial Summary`,
            type: "ledger",
            snippet: `Current Outstanding AR: ₹${client?.arAging?.totalOutstanding?.toLocaleString("en-IN") || "30,00,000"}.`,
          },
        ],
        suggestedFollowUps: [
          "Check working capital CC/OD eligibility",
          "Simulate 20% seasonal revenue dip",
          "Draft client advisory review agenda",
        ],
      });
    } catch (err: any) {
      console.error("Error in /api/copilot/chat:", err);
      res.status(500).json({ error: err.message || "Failed to process advisory query" });
    }
  });

  // AI-Driven Client Intake Diagnostic (Transforms raw business input into structured client analysis)
  app.post("/api/advisory/analyze-new-client", async (req, res) => {
    try {
      const { companyName, industry, annualRevenue, quickRatio, burnRate, notes } = req.body;
      const ai = getAI();

      if (ai) {
        const prompt = `Analyze this small business intake for a commercial bank relationship manager:
- Company Name: ${companyName}
- Industry: ${industry}
- Annual Turnover / Revenue: ${annualRevenue}
- Estimated Quick Ratio: ${quickRatio}
- Estimated Monthly Burn Rate: ₹${burnRate}k
- Additional Business Context / Raw Notes: ${notes || "None provided"}

Generate a complete, realistic client profile, including:
1. Contact info and account numbers.
2. Core Financial KPIs (DSCR, runway months, buffer days, operating margin).
3. 4-bucket AR Aging schedule with 2-3 realistic sample overdue invoices.
4. 2 major vendor cost drivers with YoY variances.
5. 2-3 proactive risk alerts.
6. 2 Next-Best-Action consultative advisory recommendations with suitability scores and explainability factors.
7. A 14-month cash flow trajectory array (9 historical months + 5 predicted months) in thousands of INR.`;

        const responseSchema: Schema = {
          type: Type.OBJECT,
          properties: {
            businessDescription: { type: Type.STRING },
            riskTier: { type: Type.STRING, enum: ["Low", "Moderate", "Elevated", "High"] },
            employees: { type: Type.NUMBER },
            contactPerson: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                title: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
              },
              required: ["name", "title", "email", "phone"],
            },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            financialKPIs: {
              type: Type.OBJECT,
              properties: {
                quickRatio: { type: Type.NUMBER },
                quickRatioYoY: { type: Type.NUMBER },
                quickRatioBenchmark: { type: Type.NUMBER },
                monthlyBurnRate: { type: Type.NUMBER },
                burnRateQoQ: { type: Type.NUMBER },
                runwayMonths: { type: Type.NUMBER },
                operatingMargin: { type: Type.NUMBER },
                operatingMarginTrend: { type: Type.STRING, enum: ["up", "flat", "down"] },
                operatingMarginBenchmark: { type: Type.NUMBER },
                dscr: { type: Type.NUMBER },
                dscrBenchmark: { type: Type.NUMBER },
                cashBufferDays: { type: Type.NUMBER },
                averageMonthlyRevenue: { type: Type.NUMBER },
              },
              required: ["quickRatio", "monthlyBurnRate", "runwayMonths", "operatingMargin", "dscr", "cashBufferDays"],
            },
            arAging: {
              type: Type.OBJECT,
              properties: {
                current: { type: Type.NUMBER },
                days31to60: { type: Type.NUMBER },
                days61to90: { type: Type.NUMBER },
                days90Plus: { type: Type.NUMBER },
                totalOutstanding: { type: Type.NUMBER },
                invoices: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      debtor: { type: Type.STRING },
                      invoiceDate: { type: Type.STRING },
                      dueDate: { type: Type.STRING },
                      daysOverdue: { type: Type.NUMBER },
                      amount: { type: Type.NUMBER },
                      status: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    },
                    required: ["id", "debtor", "amount", "status", "notes"],
                  },
                },
              },
              required: ["current", "days31to60", "days61to90", "days90Plus", "totalOutstanding", "invoices"],
            },
            vendorCostDrivers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  vendor: { type: Type.STRING },
                  category: { type: Type.STRING },
                  q2Cost: { type: Type.NUMBER },
                  q2CostPriorYear: { type: Type.NUMBER },
                  pctChange: { type: Type.NUMBER },
                  impactLevel: { type: Type.STRING, enum: ["High", "Moderate", "Low"] },
                  notes: { type: Type.STRING },
                },
                required: ["vendor", "category", "q2Cost", "pctChange", "impactLevel", "notes"],
              },
            },
            riskAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["delayed_ar", "seasonal_dip", "supplier_cost", "working_capital"] },
                  title: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  description: { type: Type.STRING },
                  impactMetric: { type: Type.STRING },
                  actionText: { type: Type.STRING },
                  actionModal: { type: Type.STRING, enum: ["ar_aging", "stress_test", "vendor_ledger", "working_capital"] },
                },
                required: ["id", "type", "title", "severity", "description", "impactMetric", "actionText", "actionModal"],
              },
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  suitabilityScore: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                  keyBenefit: { type: Type.STRING },
                  clientPitch: { type: Type.STRING },
                  whyThisRecommendation: {
                    type: Type.OBJECT,
                    properties: {
                      underlyingSignals: { type: Type.ARRAY, items: { type: Type.STRING } },
                      policyMatch: { type: Type.STRING },
                      riskMitigationFactor: { type: Type.STRING },
                      responsibleBankingCheck: { type: Type.STRING },
                    },
                    required: ["underlyingSignals", "policyMatch", "riskMitigationFactor", "responsibleBankingCheck"],
                  },
                  suggestedProduct: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      rateOrFee: { type: Type.STRING },
                      maxFacility: { type: Type.STRING },
                      timeToDeploy: { type: Type.STRING },
                    },
                    required: ["name", "rateOrFee", "maxFacility", "timeToDeploy"],
                  },
                },
                required: ["id", "title", "category", "suitabilityScore", "summary", "keyBenefit", "clientPitch", "whyThisRecommendation", "suggestedProduct"],
              },
            },
            cashFlowTrajectory: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  label: { type: Type.STRING },
                  isHistorical: { type: Type.BOOLEAN },
                  historicalInflow: { type: Type.NUMBER },
                  historicalOutflow: { type: Type.NUMBER },
                  predictedInflow: { type: Type.NUMBER },
                  predictedOutflow: { type: Type.NUMBER },
                  netCash: { type: Type.NUMBER },
                  stressedInflow: { type: Type.NUMBER },
                  stressedOutflow: { type: Type.NUMBER },
                  events: { type: Type.STRING },
                },
                required: ["month", "label", "isHistorical", "netCash"],
              },
            },
          },
          required: [
            "businessDescription",
            "riskTier",
            "employees",
            "contactPerson",
            "tags",
            "financialKPIs",
            "arAging",
            "vendorCostDrivers",
            "riskAlerts",
            "recommendations",
            "cashFlowTrajectory",
          ],
        };

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            temperature: 0.3,
            responseMimeType: "application/json",
            responseSchema,
          },
        });

        const generatedData = JSON.parse(response.text || "{}");
        return res.json(generatedData);
      }

      // Fallback response if AI is offline
      const parsedQuick = parseFloat(quickRatio) || 1.2;
      const parsedBurn = parseInt(burnRate, 10) || 35;
      return res.json({
        businessDescription: `${companyName} operates in the ${industry} sector with strong localized market footprint.`,
        riskTier: parsedQuick >= 1.2 ? "Low" : "Moderate",
        employees: 18,
        contactPerson: {
          name: "Managing Director",
          title: "Principal Partner",
          email: "management@business.in",
          phone: "+91 98400 11223",
        },
        tags: [industry, "Commercial MSME", "Growth Stage"],
        financialKPIs: {
          quickRatio: parsedQuick,
          quickRatioYoY: 0.1,
          quickRatioBenchmark: 1.15,
          monthlyBurnRate: parsedBurn,
          burnRateQoQ: 4,
          runwayMonths: 12,
          operatingMargin: 16,
          operatingMarginTrend: "flat",
          operatingMarginBenchmark: 14,
          dscr: 1.5,
          dscrBenchmark: 1.25,
          cashBufferDays: 45,
          averageMonthlyRevenue: 2000000,
        },
        arAging: {
          current: 1200000,
          days31to60: 450000,
          days61to90: 180000,
          days90Plus: 50000,
          totalOutstanding: 1880000,
          invoices: [
            {
              id: "INV-2026-001",
              debtor: "Regional Supermarket Partner",
              invoiceDate: "2026-06-15",
              dueDate: "2026-07-15",
              daysOverdue: 28,
              amount: 450000,
              status: "Current",
              notes: "Regular billing cycle reconciliation.",
            },
          ],
        },
        vendorCostDrivers: [
          {
            vendor: "Primary Raw Material Supplier",
            category: "Core Supplies",
            q2Cost: 520000,
            q2CostPriorYear: 480000,
            pctChange: 8.3,
            impactLevel: "Moderate",
            notes: "Quarterly freight adjustment.",
          },
        ],
        riskAlerts: [
          {
            id: `alert-${Date.now()}-1`,
            type: "delayed_ar",
            title: "Overdue Receivables Notification",
            severity: "Medium",
            description: "₹4.5 Lakhs in receivables nearing 30+ day aging threshold.",
            impactMetric: "₹4.5L at risk of aging",
            actionText: "Inspect AR Schedule",
            actionModal: "ar_aging",
          },
        ],
        recommendations: [
          {
            id: `rec-${Date.now()}-1`,
            title: "Selective Receivables Acceleration Line",
            category: "Receivables Acceleration",
            suitabilityScore: 91,
            summary: "Accelerate cash realization from top enterprise clients at 1.15% discount.",
            keyBenefit: "Improves cash conversion cycle by ~25 days.",
            clientPitch: "We can set up an instant TReDS invoice discounting limit to protect working capital.",
            whyThisRecommendation: {
              underlyingSignals: ["Healthy quick ratio and clean corporate billing track record."],
              policyMatch: "MSME Commercial Underwriting Policy 4.2",
              riskMitigationFactor: "Non-recourse cash injection prevents short-term debt build-up.",
              responsibleBankingCheck: "Transparent discount rates with zero early lock-in penalties.",
            },
            suggestedProduct: {
              name: "TReDS Invoice Acceleration",
              rateOrFee: "1.15% per 30 days",
              maxFacility: "₹25,00,000",
              timeToDeploy: "48 Hours",
            },
          },
        ],
        cashFlowTrajectory: [
          { month: "2026-01", label: "Jan 26", isHistorical: true, historicalInflow: 210, historicalOutflow: 180, netCash: 30 },
          { month: "2026-02", label: "Feb 26", isHistorical: true, historicalInflow: 220, historicalOutflow: 185, netCash: 35 },
          { month: "2026-03", label: "Mar 26", isHistorical: true, historicalInflow: 235, historicalOutflow: 195, netCash: 40 },
          { month: "2026-04", label: "Apr 26", isHistorical: true, historicalInflow: 230, historicalOutflow: 190, netCash: 40 },
          { month: "2026-05", label: "May 26", isHistorical: true, historicalInflow: 245, historicalOutflow: 205, netCash: 40 },
          { month: "2026-06", label: "Jun 26", isHistorical: true, historicalInflow: 225, historicalOutflow: 210, netCash: 15 },
          { month: "2026-07", label: "Jul 26", isHistorical: true, historicalInflow: 220, historicalOutflow: 215, netCash: 5 },
          { month: "2026-08", label: "Aug 26 (P)", isHistorical: false, predictedInflow: 190, predictedOutflow: 205, netCash: -15, stressedInflow: 170, stressedOutflow: 215 },
          { month: "2026-09", label: "Sep 26 (P)", isHistorical: false, predictedInflow: 185, predictedOutflow: 200, netCash: -15, stressedInflow: 165, stressedOutflow: 210 },
          { month: "2026-10", label: "Oct 26 (P)", isHistorical: false, predictedInflow: 240, predictedOutflow: 200, netCash: 40, stressedInflow: 215, stressedOutflow: 205 },
        ],
      });
    } catch (err: any) {
      console.error("Error in /api/advisory/analyze-new-client:", err);
      res.status(500).json({ error: err.message || "Failed to analyze intake" });
    }
  });

  // Client Meeting Summary / Executive Email Generator API
  app.post("/api/advisory/generate-summary", async (req, res) => {
    try {
      const { client, tone, focusArea } = req.body;
      const ai = getAI();

      if (ai && client) {
        const prompt = `Generate an authoritative, highly professional commercial banking advisory memorandum in Indian Rupees (₹ / Lakhs / Crores) for the Relationship Manager.
Client: ${client.name} (${client.industry})
Contact: ${client.contactPerson?.name}, ${client.contactPerson?.title}
Presentation Tone: ${tone || "Empathetic & Consultative Financial Partner"}
Focus Area: ${focusArea || "Cash Flow Optimization, Receivables Relief & Treasury Yield"}
Financial KPIs: Quick Ratio ${client.financialKPIs?.quickRatio}, Runway ${client.financialKPIs?.runwayMonths} months, AR Outstanding ₹${client.arAging?.totalOutstanding?.toLocaleString("en-IN")}.

Format:
1. Executive Meeting Briefing / Email Subject & Body (in Indian Rupees ₹)
2. Grounded Observations (Ledger facts, debtor aging, vendor inflation)
3. Tailored Advisory Solutions (Transparent non-predatory banking options)
4. Actionable Next Steps & Review Agenda`;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: { temperature: 0.3 },
        });

        return res.json({ content: response.text });
      }

      return res.json({
        content: `SUBJECT: Financial Health Review & Proactive Working Capital Optimization - ${client?.name}\n\nDear ${client?.contactPerson?.name || "Client"},\n\nWe have completed our periodic liquidity review for ${client?.name}. With a strong Quick Ratio of ${client?.financialKPIs?.quickRatio}x and ${client?.financialKPIs?.runwayMonths} months of operating runway, your balance sheet remains resilient.\n\nWe recommend reviewing the ₹${((client?.arAging?.days31to60 || 0) + (client?.arAging?.days61to90 || 0)).toLocaleString("en-IN")} in aged receivables to unlock liquidity before the upcoming quarter.`,
      });
    } catch (err: any) {
      console.error("Error in /api/advisory/generate-summary:", err);
      res.status(500).json({ error: err.message || "Failed to generate briefing" });
    }
  });

  // Server Setup (Vite in Dev / Static in Production)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Advisory AI Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
