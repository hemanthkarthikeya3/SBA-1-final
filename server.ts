import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Helper to initialize Google Gen AI
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
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
      model: "gemini-3.7-flash",
      timestamp: new Date().toISOString(),
    });
  });

  // Copilot Chat API endpoint with Dynamic Gemini Reasoning & Grounding
  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { message, client, conversationHistory } = req.body;
      const ai = getAI();

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build comprehensive dynamic financial profile from client object
      const clientContext = client
        ? `
=== CLIENT FINANCIAL & LEDGER PROFILE ===
- Client Legal Name: ${client.name}
- Industry: ${client.industry}
- Risk Classification: ${client.riskTier}
- Annual Turnover: ${client.annualRevenue}
- Currency: Indian Rupees (₹ / Lakhs / Crores)
- Current Quick Ratio: ${client.financialKPIs?.quickRatio}x (Industry Benchmark: ${client.financialKPIs?.quickRatioBenchmark}x)
- Debt Service Coverage Ratio (DSCR): ${client.financialKPIs?.dscr}x (Benchmark: ${client.financialKPIs?.dscrBenchmark}x)
- Cash Runway: ${client.financialKPIs?.runwayMonths} Months (Monthly Burn: ₹${client.financialKPIs?.monthlyBurnRate}k)
- Operating Cash Buffer: ${client.financialKPIs?.cashBufferDays} Days
- Operating Margin: ${client.financialKPIs?.operatingMargin}%
- Total Outstanding Accounts Receivable: ₹${(client.arAging?.totalOutstanding || 0).toLocaleString('en-IN')}
- Overdue Receivables (>30 Days): ₹${((client.arAging?.days31to60 || 0) + (client.arAging?.days61to90 || 0)).toLocaleString('en-IN')}
- Detailed AR Aging Breakdown:
  * Current (0-30d): ₹${(client.arAging?.current || 0).toLocaleString('en-IN')}
  * 31-60 Days Overdue: ₹${(client.arAging?.days31to60 || 0).toLocaleString('en-IN')}
  * 61-90 Days Overdue: ₹${(client.arAging?.days61to90 || 0).toLocaleString('en-IN')}
  * 90+ Days Critical: ₹${(client.arAging?.days90Plus || 0).toLocaleString('en-IN')}
- Major Customer Invoices on File:
  ${JSON.stringify(client.arAging?.invoices || [], null, 2)}
- Key Vendor Cost Drivers:
  ${JSON.stringify(client.vendorCostDrivers || [], null, 2)}
`
        : "General MSME Commercial Banking Advisory Context in Indian Rupees (₹)";

      if (ai) {
        const systemInstruction = `
You are the AI Advisory Copilot for Commercial & MSME Relationship Managers (RMs) in Small Business Banking.

CORE DIRECTIVES:
1. Ground every answer strictly in the provided Client Financial & Ledger Profile. Reference specific invoice numbers, overdue debtor amounts, and vendor cost lines.
2. ALWAYS quote monetary figures in Indian Rupees (₹, Lakhs, Crores) with appropriate Indian number formatting (e.g. ₹10.25 Lakhs, ₹4,86,000).
3. Frame all recommendations around consultative relationship banking, fair lending, non-debt liquidity (e.g., TReDS invoice discounting, cash sweep yield, freight hedging), and working capital resilience. Avoid predatory high-interest credit push.
4. If asked about loan eligibility or facility sizing, evaluate DSCR (>1.25x required), Quick Ratio (>1.1x required), and runway.
5. Format your output with clear bold headers, crisp bullet points, and actionable next steps for the Relationship Manager.
`;

        const prompt = `
${clientContext}

Prior Discussion:
${(conversationHistory || []).map((h: any) => `${h.sender === "rm" ? "Banker" : "Copilot"}: ${h.text}`).join("\n")}

Banker Question: "${message}"

Deliver a consultative, precise, and data-backed response.
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.25,
          },
        });

        const replyText = response.text || "I have analyzed the client records and generated recommendations based on current cash flow trajectories.";

        // Dynamic citations extracted from the client's actual data
        const citations = [];
        if (client?.arAging?.invoices?.length) {
          const topInvoice = client.arAging.invoices[0];
          citations.push({
            id: `cite-${topInvoice.id}`,
            title: `Invoice ${topInvoice.id} (${topInvoice.debtor})`,
            type: "invoice" as const,
            snippet: `Invoice Amount: ₹${topInvoice.amount.toLocaleString('en-IN')}, Due: ${topInvoice.dueDate}, Status: ${topInvoice.status}. Note: ${topInvoice.notes}`,
          });
        }
        if (client?.vendorCostDrivers?.length) {
          const topVendor = client.vendorCostDrivers[0];
          citations.push({
            id: `cite-${topVendor.vendor}`,
            title: `${topVendor.vendor} Spend Audit`,
            type: "ledger" as const,
            snippet: `Current Spend: ₹${topVendor.q2Cost.toLocaleString('en-IN')} (+${topVendor.pctChange}% YoY). Category: ${topVendor.category}. Note: ${topVendor.notes}`,
          });
        }
        citations.push({
          id: "cite-rbi-policy",
          title: "MSME Working Capital & TReDS Policy Guidelines §4.2",
          type: "policy" as const,
          snippet: "Qualifying MSME suppliers to approved corporate buyers are eligible for up to 90% instant advance at 1.15% discount per 30 days without collateral encumbrance.",
        });

        return res.json({
          text: replyText,
          citations,
          suggestedFollowUps: [
            `Check credit facility eligibility for ${client?.name || 'client'}`,
            `Simulate 20% seasonal revenue contraction`,
            `Draft client advisory agenda in Indian Rupees`,
          ],
        });
      }

      // Dynamic fallback when GEMINI_API_KEY is not configured in local environment
      const overdueTotal = (client?.arAging?.days31to60 || 0) + (client?.arAging?.days61to90 || 0);
      const topDebtor = client?.arAging?.invoices?.[0]?.debtor || "corporate buyer";
      const topDebtorAmount = client?.arAging?.invoices?.[0]?.amount || 645000;
      const topVendor = client?.vendorCostDrivers?.[0]?.vendor || "primary supplier";
      const topVendorShift = client?.vendorCostDrivers?.[0]?.pctChange || 12;

      let fallbackText = `I have performed a diagnostic on **${client?.name || "the client"}**'s financial ledger in Indian Rupees (₹):\n\n- **Quick Ratio**: **${client?.financialKPIs?.quickRatio || 1.4}x** (Safe vs 1.15x benchmark)\n- **Operating Runway**: **${client?.financialKPIs?.runwayMonths || 14} Months** (Net monthly burn ₹${client?.financialKPIs?.monthlyBurnRate || 42}k)\n- **Overdue AR Lag**: **₹${(overdueTotal / 100000).toFixed(2)} Lakhs** past 30 days (concentrated with ${topDebtor})\n- **Cost Inflation**: ${topVendor} expenses shifted **+${topVendorShift}% YoY**\n\n**Advisory Action**: Activate **TReDS Receivables Discounting** (advance 90% at 1.15% discount) to unlock ₹${(topDebtorAmount / 100000).toFixed(2)} Lakhs immediately without taking on balance-sheet debt.`;

      const citations = [
        {
          id: "cite-dyn-ledger",
          title: `${client?.name || "Client"} General Ledger Schedule`,
          type: "ledger" as const,
          snippet: `Current burn rate ₹${client?.financialKPIs?.monthlyBurnRate || 42}k/month with ${client?.financialKPIs?.runwayMonths || 14} months operating runway in INR.`,
        },
        {
          id: "cite-dyn-policy",
          title: "MSME Fair Lending & TReDS Framework §4.2",
          type: "policy" as const,
          snippet: "Expedited delegated credit sanction available for businesses with DSCR > 1.25x and Quick Ratio > 1.1x.",
        },
      ];

      return res.json({
        text: fallbackText,
        citations,
        suggestedFollowUps: [
          `Check loan & CC/OD line eligibility`,
          `Simulate Q3 seasonal stress test`,
          `Draft client advisory review brief`,
        ],
      });
    } catch (err: any) {
      console.error("Error in /api/copilot/chat:", err);
      res.status(500).json({ error: err.message || "Failed to process advisory query" });
    }
  });

  // Client Meeting Summary / Executive Briefing Generator API
  app.post("/api/advisory/generate-summary", async (req, res) => {
    try {
      const { client, tone, focusArea } = req.body;
      const ai = getAI();

      if (ai && client) {
        const prompt = `
Generate a professional, highly articulate small business banking advisory document in Indian Rupees (₹ / Lakhs / Crores) for the Relationship Manager to share with ${client.name}.

Client Context:
- Legal Name: ${client.name} (${client.industry})
- Contact: ${client.contactPerson?.name}, ${client.contactPerson?.title}
- Quick Ratio: ${client.financialKPIs?.quickRatio}x
- Cash Runway: ${client.financialKPIs?.runwayMonths} Months
- Overdue AR: ₹${((client.arAging?.days31to60 || 0) + (client.arAging?.days61to90 || 0)).toLocaleString('en-IN')}
- Burn Rate: ₹${client.financialKPIs?.monthlyBurnRate}k/month

Tone: ${tone || "Empathetic & Consultative Commercial Banker"}
Focus Area: ${focusArea || "Cash Flow Optimization, Receivables Relief & Treasury Float Yield"}

Output Format:
1. Executive Briefing Subject & Structured Message Body (in Indian Rupees ₹)
2. Key Observed Strengths & Stress Points
3. Responsible Advisory Recommendations (Framed around business resilience, non-predatory solutions)
4. Proposed Next Steps & Review Agenda
`;

        const response = await ai.models.generateContent({
          model: "gemini-3.7-flash",
          contents: prompt,
        });

        return res.json({ content: response.text });
      }

      // Default structured memo in Rupees (₹)
      const content = `SUBJECT: Financial Health Review & Proactive Working Capital Optimization — ${client?.name || "Green Valley Organics"}

Dear ${client?.contactPerson?.name || "Client Executive"},

As part of our proactive relationship banking commitment, our advisory analytics team conducted a comprehensive liquidity and working capital review for ${client?.name || "your enterprise"}.

### 1. Key Financial Observations (₹ INR)
- **Healthy Liquidity Cushion**: Quick Ratio stands at **${client?.financialKPIs?.quickRatio || 1.4}x** (above the 1.15x regional benchmark), providing **${client?.financialKPIs?.runwayMonths || 14} months** of operating runway.
- **Receivables Lengthening**: Accounts receivable past 30 days have expanded to **₹${(((client?.arAging?.days31to60 || 0) + (client?.arAging?.days61to90 || 0)) / 100000).toFixed(2)} Lakhs**.
- **Supply Chain Volatility**: Key logistics and raw materials costs shifted across major operating vendors.

### 2. Proactive Advisory Solutions (Non-Debt & Liquidity Support)
1. **TReDS & Selective Receivables Acceleration**: Same-day invoice advance at 1.15% discount per 30 days to bridge corporate debtor settlement cycles without taking on balance-sheet debt.
2. **Automated Insured Cash Sweep (ICS)**: Move operating cash float into AAA-rated sovereign liquidity funds earning **6.85% p.a.** overnight with 100% daily availability.

### 3. Proposed Discussion Agenda for Our Upcoming Review
- [ ] Review Q3 seasonal cash flow forecast & stress scenarios
- [ ] Walk through invoice acceleration setup (takes under 48 hours)
- [ ] Review vendor freight discount structures

Warm regards,

Commercial Banking Advisory Group`;

      return res.json({ content });
    } catch (err: any) {
      console.error("Error in /api/advisory/generate-summary:", err);
      res.status(500).json({ error: err.message || "Failed to generate briefing" });
    }
  });

  // What-If Cash Flow Stress Test Simulation API
  app.post("/api/stress/simulate", (req, res) => {
    const { client, revenueDropPct = 20, cogsSurgePct = 10, arDelayDays = 30 } = req.body;

    const baseBurn = client?.financialKPIs?.monthlyBurnRate || 42;
    const baseRevenue = client?.financialKPIs?.averageMonthlyRevenue || 2375000;
    const baseRunway = client?.financialKPIs?.runwayMonths || 14;

    // Recalculate stress impact
    const monthlyRevenueImpact = baseRevenue * (revenueDropPct / 100);
    const monthlyCostImpact = (baseBurn * 1000) * (cogsSurgePct / 100);
    const totalMonthlyCashDrag = (monthlyRevenueImpact + monthlyCostImpact) / 1000;
    const stressedMonthlyBurn = Math.round(baseBurn + totalMonthlyCashDrag);
    const stressedRunwayMonths = Math.max(2, Math.round((baseRunway * baseBurn) / Math.max(1, stressedMonthlyBurn)));
    const stressedCashBufferDays = Math.max(12, Math.round((client?.financialKPIs?.cashBufferDays || 45) * (1 - arDelayDays / 90)));

    res.json({
      revenueDropPct,
      cogsSurgePct,
      arDelayDays,
      stressedMonthlyBurn,
      stressedRunwayMonths,
      stressedCashBufferDays,
      runwayDelta: stressedRunwayMonths - baseRunway,
      burnDeltaPct: Math.round(((stressedMonthlyBurn - baseBurn) / baseBurn) * 100),
      aiAssessment: `Under a ${revenueDropPct}% revenue contraction combined with ${cogsSurgePct}% cost inflation and a ${arDelayDays}-day AR delay, cash runway compresses from ${baseRunway} to ${stressedRunwayMonths} months. Activating a ₹35 Lakhs working capital buffer restores liquidity back to safe thresholds.`,
    });
  });

  // Vite middleware in dev or static files in production
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
    console.log(`Small Business Banking Advisory Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
