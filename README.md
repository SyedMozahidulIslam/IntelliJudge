# IntelliJudge — Intelligent Legal Operations. Trusted Justice.

IntelliJudge is an enterprise-grade Legal Practice Management & Judicial Operations Platform custom-tailored specifically for the administrative, structural, and regulatory context of **Bangladesh**. This client-ready, government-ready platform digitizes the entire lifecycle of legal operations—from client intake and case filing to forensic evidence auditing, local bKash retainer trust-accounting, and AI-powered statutory document synthesis.

**Primary Developer:** SMI Fahim  
**Tagline:** Intelligent Legal Operations. Trusted Justice.

---

## 1. Project Overview & Business Vision

In many judicial sectors, traditional legal work is hindered by paper-based processes, lack of clear metrics, and manual document translation. **IntelliJudge** acts as a unified digital ecosystem bridging government courts, commercial law firms, financial institutions, and citizens.

### Objectives
- **Zero-Friction Ingress**: Full compliance with the Civil Procedure Code (CPC 1908) and Criminal Procedure Code (CrPC 1898) of Bangladesh.
- **AI-Powered Augmentation**: Advanced server-side document automation and statutory search using Gemini models (`gemini-3.5-flash`).
- **Personnel Mapped (400+ Profiles)**: Robust HR mapping of over 400 unique judicial personnel cards, randomizing judges, lawyers, front desk support, and financial officers with performance indicators.
- **Verified Forensic Signatures**: Cryptographic verification of certified document hashes (SHA-256) inside our digital evidence vault.
- **bKash Trust-Accounting Integration**: Highly authentic mock bKash mobile gateway with OTP/PIN validation to settle retainers and court fees.

---

## 2. System Architecture & Tech Stack

IntelliJudge is built using a secure full-stack architecture running behind a single-container deployment paradigm:

- **Frontend**: React 19 with TypeScript, styled with Tailwind CSS, animating with `motion` for smooth micro-interactions.
- **Backend**: Express.js server utilizing TypeScript-strip Native execution (`tsx`).
- **Database / Storage**: Durable Local JSON repository (`data-store.json`) implementing a clean repository pattern with transactional locks for offline-first development.
- **AI Engine**: Modern `@google/genai` SDK on the server-side, protecting API keys entirely from client exposure.
- **Charts / Visualizations**: Recharts engine visualizing financial growth and category distribution.

```
┌────────────────────────────────────────────────────────┐
│                   Vite/React Client                    │
└───────────────────────────┬────────────────────────────┘
                            │ (Secure HTTP REST API / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Express Full-Stack Server              │
│       (Serves static build assets in production)       │
├───────────────────────────┼────────────────────────────┤
│   @google/genai SDK       │   data-store.json          │
│   (Lazy Initialized)      │   (Durable Seed Database)  │
└───────────┬───────────────┴─────────────┬──────────────┘
            │                             │
            ▼                             ▼
   ┌─────────────────┐           ┌─────────────────┐
   │   Gemini API    │           │  400+ Personnel │
   │ (Server Secret) │           │   Record Cards  │
   └─────────────────┘           └─────────────────┘
```

---

## 3. Folder Structure

```
/
├── server.ts                    # Full-Stack entry point (Express, Vite Middleware, REST APIs)
├── data-store.json              # Durable local database file (Seeded on first boot)
├── package.json                 # Node dependencies & production compilation pipeline
├── tsconfig.json                # TypeScript compiler parameters
├── vite.config.ts               # Bundling config & dev port setup
├── index.html                   # HTML entry point
├── metadata.json                # AI Studio application metadata
├── src/
│   ├── App.tsx                  # Core React dashboard workspace
│   ├── index.css                # Global styles, fonts (Inter & JetBrains), scrollbars
│   ├── main.tsx                 # React DOM mount point
│   ├── types.ts                 # Strongly-typed schemas (Case, Employee, Evidence, Financials)
│   └── data/
│       └── names.ts             # 400+ Bangladeshi raw name list & heuristic gender engine
└── skills/                      # Platform guidelines and instructions
```

---

## 4. Key Features & Workflows

### 💼 Interactive Cockpit (Dynamic Role Simulation)
At the top-right, users can simulate roles instantly to view custom dashboards:
- **Supreme Administrator (SMI Fahim)**: Direct system oversight, server audit trails, personnel salary ledger.
- **Judicial Authority**: Presiding courtroom schedules, judge utilization, case distribution metrics.
- **Lawyers (Senior & Junior)**: Case filings, active hearing checklists, real-time draft workspace.
- **Accounts Department**: Revenue timelines, pending billing invoice generation, and trust accounts.
- **HR Department**: Paginated browser for all 400+ individual employee cards with performance metrics.
- **Client Secure Portal**: Case details tracking, secure consulting channels, and live bKash checkout.

### 🤖 AI Legislative Hub
- **Statutory Document Automation**: Draft legal notices, general power of attorneys, writs, or affidavits based onCPC / Contract Act of Bangladesh.
- **Legislative Case Research**: Ground queries against Bangladesh statutory code with fully cited Acts and counsel recommendations.

### 💳 Mobile Retention Settle (bKash Gateway)
Simulate local payment pipelines:
1. Input 11-digit mobile wallet number (`017XXXXXXXX`).
2. Input 4-digit mock OTP sent via SMS.
3. Securely provide 5-digit PIN.
4. Transaction automatically triggers system database updates to mark invoices as PAID.

---

## 5. Local Installation & Launch

To install and boot the platform locally in a sandboxed Node environment:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Secrets** (`.env`):
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   NODE_ENV="development"
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the system.

4. **Build Production Distribution**:
   ```bash
   npm run build
   ```
   Compiles Vite client static pages and bundles `server.ts` into a self-contained `dist/server.cjs` file.

5. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 6. Future Roadmap
- **Biometric Witness Verification**: Face recognition for criminal suspect matching.
- **SMS Judicial Notifications**: Dynamic SMS dispatching via local Bangladesh Telco APIs when hearings are rescheduled.
- **Relational PostgreSQL Migration**: Integration with Cloud SQL using Drizzle ORM schemas.

---

## 7. Credits & License

- **Developer**: SMI Fahim (Supreme Administrator & Principal Engineer)
- **Frameworks**: React, TypeScript, Vite, Tailwind CSS, Recharts, Motion, Express.
- **Project Scope**: Designed for the Supreme Court of Bangladesh, High Court Division, Law Firms, and Ministries.
- **License**: Enterprise Commercial License. Protected under Bangladesh Intellectual Property Law.
