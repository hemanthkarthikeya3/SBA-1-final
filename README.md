# Small Business Banking Advisory Assistant (₹ INR)

An AI-powered commercial banking advisory platform that equips Relationship Managers (RMs) and small business advisors with proactive risk detection, predictive cash flow diagnostics, and responsible Next-Best-Actions localized in **Indian Rupees (₹)**.

---

## 🚀 How to Execute Locally in Visual Studio Code (VS Code)

### Prerequisites
- **Node.js** (v18 or higher recommended, e.g., Node.js LTS 20+)
- **npm** (comes with Node.js) or **pnpm** / **yarn** / **bun**
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### Step-by-Step Local Setup

1. **Open the Project in VS Code**:
   - Open Visual Studio Code.
   - Go to `File` > `Open Folder...` and select this project directory.
   - Open the integrated terminal (`Ctrl + ~` on Windows/Linux or `Cmd + ~` on macOS).

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory (copy from `.env.example`):
     ```bash
     cp .env.example .env
     ```
   - In `.env`, add your Gemini API key:
     ```env
     GEMINI_API_KEY="your_actual_gemini_api_key_here"
     ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.
   - The application boots both the Vite React client and the Express backend API in a unified dev environment powered by `tsx`.

---

## 🌐 How to Deploy on Vercel

This full-stack application uses a React (Vite) frontend with an Express API backend proxying Gemini AI requests.

### Method 1: Deploy via Vercel Dashboard & GitHub (Recommended)

1. **Push your code to GitHub / GitLab / Bitbucket**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Small Business Banking Advisory Assistant"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Log in to [Vercel](https://vercel.com).
   - Click **Add New** > **Project** and import your GitHub repository.

3. **Configure Build & Environment Settings**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - Key: `GEMINI_API_KEY`
     - Value: `your_gemini_api_key`

4. **Deploy**:
   - Click **Deploy**. Vercel will build and host your production app.

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login and Deploy**:
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Add the Environment Secret**:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
   Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🛠️ Scripts Reference

- `npm run dev`: Starts the local development server (port 3000).
- `npm run build`: Compiles the Vite frontend and bundles the Express backend into `dist/server.cjs`.
- `npm run start`: Runs the compiled standalone production server.
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## 🇮🇳 Key Features & INR Localization

- **Rupee Currency System (₹)**: All financial KPIs, burn rates, revenue figures, invoice lists, and charts format in Indian numbering (Lakhs & Crores).
- **Proactive Risk & Stress Detection**: Real-time identification of delayed receivables, seasonal revenue dips, and freight supply chain spikes.
- **Explainable Next-Best-Actions**: Responsible credit solutions (e.g., TReDS Receivables Acceleration, Automated Cash Sweeps) with clear suitability logic and non-predatory rate guardrails.
- **Interactive Cash Flow Simulation**: Sliders for revenue stress testing, COGS inflation, and debtor payment lags.
- **Advisory Copilot**: Chat-based assistant grounded in audited client ledger PDFs and bank underwriting policies.
