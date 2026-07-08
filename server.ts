import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { RAW_NAMES, createMockEmployee, detectGender } from "./src/data/names.ts";
import { UserRole } from "./src/types.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client (Lazy & safe)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// Durable local storage file
const STORE_PATH = path.join(process.cwd(), "data-store.json");

interface DataStoreSchema {
  employees: any[];
  cases: any[];
  hearings: any[];
  evidence: any[];
  contracts: any[];
  appointments: any[];
  finance: any[];
  auditLogs: any[];
  criminals: any[];
  courtAttendance: any[];
}

// High Court jurisdictions of Bangladesh
const COURT_DIRECTORY = [
  { name: "Supreme Court of Bangladesh", type: "Supreme Court", location: "Dhaka (Ramna)" },
  { name: "High Court Division - Bench 01", type: "High Court Division", location: "Dhaka" },
  { name: "High Court Division - Bench 12 (Constitutional)", type: "High Court Division", location: "Dhaka" },
  { name: "Dhaka District & Sessions Court", type: "District Court", location: "Dhaka Sadar" },
  { name: "Chittagong District & Sessions Court", type: "District Court", location: "Chittagong Sadar" },
  { name: "Sylhet Metropolitan Court", type: "Metropolitan Court", location: "Sylhet" },
  { name: "Labour Court Division 1", type: "Labour Court", location: "Dhaka (Motijheel)" },
  { name: "Administrative Appellate Tribunal", type: "Special Tribunal", location: "Dhaka" },
  { name: "Taxes Appellate Tribunal", type: "Tax Tribunal", location: "Dhaka" },
  { name: "Dhaka Family Court", type: "Family Court", location: "Dhaka" }
];

// Seed initial data-store if it doesn't exist
function seedDatabase() {
  if (fs.existsSync(STORE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    } catch (e) {
      console.error("Failed to parse existing data store, re-seeding.", e);
    }
  }

  console.log("Seeding IntelliJudge data-store with 400+ names and cases...");
  
  // 1. Distribute names across roles
  const employees: any[] = [];
  const criminals: any[] = [];
  
  // Always set SMI Fahim as Supreme Administrator
  employees.push({
    id: "emp-1",
    name: "SMI Fahim",
    gender: "Male",
    role: UserRole.SUPREME_ADMIN,
    email: "smi.fahim@intellijudge.gov.bd",
    phone: "+8801711223344",
    branch: "Dhaka Head Office (Supreme Court Complex)",
    joiningDate: "2015-01-01",
    salary: 250000,
    status: "Active",
    performanceRating: 5.0
  });

  // Assign roles dynamically from the 400 names provided
  const rolesDistribution = [
    UserRole.JUDICIAL_AUTHORITY,
    UserRole.LAW_FIRM_OWNER,
    UserRole.SENIOR_PARTNER,
    UserRole.LAWYER,
    UserRole.JUNIOR_LAWYER,
    UserRole.LEGAL_ASSISTANT,
    UserRole.FRONT_DESK,
    UserRole.ACCOUNTS_DEPT,
    UserRole.HR,
    UserRole.CLIENT
  ];

  RAW_NAMES.forEach((name, index) => {
    const idNum = index + 2; // Keep id 1 for SMI Fahim
    const id = `emp-${idNum}`;
    
    // Assign roles cyclically
    const role = rolesDistribution[index % rolesDistribution.length];
    
    // Some go to Employees, some to Clients/Criminal suspects
    if (index % 10 === 0) {
      // Put some in criminal suspects / opposing litigants list
      const gender = detectGender(name);
      criminals.push({
        id: `crim-${index}`,
        name,
        gender,
        age: 22 + (index % 45),
        associatedCrime: ["Financial Fraud", "Land Registry Dispute", "Corporate Tax Evasion", "Contract Breach", "Civil Trespass", "Copyright Infringement"][(index % 6)],
        policeStation: ["Dhanmondi PS", "Gulshan PS", "Ramna PS", "Kotwali PS", "Sylhet Sadar PS"][(index % 5)],
        status: ["Under Trial", "Bailed", "Acquitted", "Sentenced"][(index % 4)],
        riskLevel: ["High", "Medium", "Low"][(index % 3)],
        division: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"][(index % 5)]
      });
    }

    employees.push(createMockEmployee(id, name, role));
  });

  // 2. Generate initial Mock Cases
  const cases: any[] = [];
  const caseTypes = ["Civil", "Criminal", "Constitutional", "Labour", "Family", "Tax", "Corporate"];
  const districts = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];
  const caseStatuses = ["Filing", "Hearing", "Stayed", "Judgment Pending", "Disposed"];
  const priorities = ["High", "Medium", "Low"];
  
  // Create 15 structured cases matching Bangladesh context
  for (let i = 1; i <= 15; i++) {
    const caseType = caseTypes[i % caseTypes.length];
    const district = districts[i % districts.length];
    const status = caseStatuses[i % caseStatuses.length];
    const priority = priorities[i % priorities.length];
    
    // Pick dynamic names from the raw name list
    const judge = employees.find(e => e.role === UserRole.JUDICIAL_AUTHORITY)?.name || "Justice Md. Ashraful Islam";
    const lawyer = employees.find(e => e.role === UserRole.LAWYER)?.name || "Salim Rahaman Dipu";
    const client = employees.find(e => e.role === UserRole.CLIENT)?.name || "Shahparan Rownak";
    const opponent = criminals[i % criminals.length]?.name || "Tanvir Rifat";

    cases.push({
      id: `case-${i}`,
      caseNumber: `W.P.-${2020 + (i % 6)}-${3420 + i}`,
      title: i % 2 === 0 
        ? `${client} Vs. Government of Bangladesh & Others`
        : `${client} Vs. ${opponent} (Property Title Dispute)`,
      court: COURT_DIRECTORY[i % COURT_DIRECTORY.length].name,
      division: district === "Dhaka" ? "Dhaka" : district === "Chittagong" ? "Chittagong" : "Sylhet",
      district: district,
      judge: judge,
      leadLawyer: lawyer,
      clientName: client,
      opposingParty: opponent,
      opposingLawyer: employees[10 + i]?.name || "Nuzhat Kamal",
      caseType: caseType,
      status: status,
      priority: priority,
      riskLevel: i % 3 === 0 ? "Critical" : i % 3 === 1 ? "Standard" : "Low",
      nextHearingDate: `2026-07-${String(10 + i).padStart(2, "0")}`,
      summary: `This litigation pertains to the adjudication of rights and obligations regarding ${caseType.toLowerCase()} issues under Bangladesh civil regulations, specifically referencing land, registry, or administrative laws.`,
      legalNotes: "Strict review of documentary evidence is ongoing. Cross-examination of the primary surveyor scheduled.",
      createdAt: `2026-01-${String(i).padStart(2, "0")}`
    });
  }

  // 3. Mock Hearings
  const hearings: any[] = [];
  cases.forEach((c, idx) => {
    hearings.push({
      id: `hearing-${idx}`,
      caseId: c.id,
      caseNumber: c.caseNumber,
      caseTitle: c.title,
      hearingDate: c.nextHearingDate,
      hearingTime: `${9 + (idx % 4)}:30 AM`,
      courtroom: `Room No. ${400 + idx}`,
      judge: c.judge,
      assignedLawyer: c.leadLawyer,
      checklist: ["Verify primary deed", "Examine secondary witness", "Draft written statement"],
      durationMinutes: 45 + (idx % 4) * 15,
      outcome: idx % 3 === 0 ? "Adjourned - Next date set" : "Hearing concluded",
      status: idx % 2 === 0 ? "Scheduled" : "Completed",
      notes: "Ensure translated land survey reports are submitted prior to this hearing session."
    });
  });

  // 4. Mock Evidence Repository
  const evidence: any[] = [];
  cases.slice(0, 8).forEach((c, idx) => {
    evidence.push({
      id: `ev-${idx}`,
      caseId: c.id,
      caseNumber: c.caseNumber,
      title: idx % 2 === 0 ? "Certified Copy of CS Khatian No. 1290" : "Digital Forensics Audio Recording",
      type: idx % 2 === 0 ? "PDF" : "Audio",
      uploadedBy: c.leadLawyer,
      uploadDate: "2026-04-12",
      fileSize: idx % 2 === 0 ? "4.2 MB" : "18.5 MB",
      tag: "Property Title Documents",
      chainOfCustody: [
        { date: "2026-04-12 10:00 AM", action: "Uploaded by Lawyer", user: c.leadLawyer },
        { date: "2026-04-13 02:00 PM", action: "Approved by Senior Partner", user: "SMI Fahim" }
      ],
      digitalSignature: `SHA256-${Math.random().toString(36).substring(7).toUpperCase()}`,
      notes: "Verified against Government Land Registry archives."
    });
  });

  // 5. Mock Contracts / Drafting
  const contracts: any[] = [];
  employees.filter(e => e.role === UserRole.CLIENT).slice(0, 5).forEach((cl, idx) => {
    contracts.push({
      id: `con-${idx}`,
      title: `General Power of Attorney - ${cl.name}`,
      clientName: cl.name,
      type: "Power of Attorney",
      status: idx % 2 === 0 ? "Signed" : "Drafting",
      draftedBy: "SMI Fahim",
      content: `KNOW ALL MEN BY THESE PRESENTS that I, ${cl.name}, resident of Bangladesh, do hereby constitute, appoint and ordain SMI Fahim, Advocate of the Supreme Court of Bangladesh, as my true and lawful attorney...`,
      version: "1.0",
      lastUpdated: "2026-05-18",
      signatureDate: idx % 2 === 0 ? "2026-05-20" : undefined,
      clauses: [
        { title: "Power to File Suits", text: "To file petitions, plaints, written statements, and affidavits before all appropriate courts of Bangladesh." },
        { title: "Power of Compromise", text: "To settle, compromise, or refer to arbitration any land or civil disputes." }
      ]
    });
  });

  // 6. Mock Appointments
  const appointments: any[] = [];
  cases.slice(0, 5).forEach((c, idx) => {
    appointments.push({
      id: `appt-${idx}`,
      clientName: c.clientName,
      lawyerName: c.leadLawyer,
      dateTime: `2026-07-08T${10 + idx}:00:00`,
      purpose: "Reviewing witness testimony and written petitions",
      status: "Scheduled",
      type: idx % 2 === 0 ? "In-Person" : "Video Conference"
    });
  });

  // 7. Mock Finance
  const finance: any[] = [];
  cases.forEach((c, idx) => {
    finance.push({
      id: `fin-${idx}`,
      caseNumber: c.caseNumber,
      clientName: c.clientName,
      type: idx % 3 === 0 ? "Invoice" : idx % 3 === 1 ? "Payment" : "Expense",
      category: idx % 3 === 0 ? "Professional Legal Fees" : idx % 3 === 1 ? "Retainer Deposit" : "Court Filing Fees",
      amount: idx % 3 === 0 ? 85000 : idx % 3 === 1 ? 50000 : 12500,
      date: `2026-06-${String(10 + idx).padStart(2, "0")}`,
      status: idx % 2 === 0 ? "Paid" : "Unpaid",
      paymentMethod: idx % 2 === 0 ? "bKash" : undefined,
      isTrustAccount: idx % 3 === 1,
      description: idx % 3 === 0 ? "Legal drafting and representation services" : idx % 3 === 1 ? "Trust retainer deposit for litigation" : "Official stamp duty and filing charges",
      branch: "Dhaka Main Branch"
    });
  });

  // 8. Mock Audit Logs
  const auditLogs: any[] = [
    {
      id: "log-1",
      timestamp: "2026-07-07 10:15 AM",
      user: "SMI Fahim",
      role: "Supreme Administrator",
      action: "Database Backup Completed",
      module: "Security",
      ipAddress: "192.168.1.105",
      details: "Full backup of 400+ personnel cards and court records executed successfully."
    },
    {
      id: "log-2",
      timestamp: "2026-07-07 11:30 AM",
      user: "Justice Md. Ashraful Islam",
      role: "Judicial Authority",
      action: "Hearing Postponed",
      module: "Scheduling",
      ipAddress: "192.168.1.120",
      details: "Hearing for Case W.P.-2022-3422 rescheduled due to court holiday."
    }
  ];

  const initialData: DataStoreSchema = {
    employees,
    cases,
    hearings,
    evidence,
    contracts,
    appointments,
    finance,
    auditLogs,
    criminals,
    courtAttendance: []
  };

  fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf8");
  return initialData;
}

let dbState: DataStoreSchema = seedDatabase();
if (!dbState.courtAttendance) {
  dbState.courtAttendance = [];
}

// Save helper
function saveState() {
  fs.writeFileSync(STORE_PATH, JSON.stringify(dbState, null, 2), "utf8");
}

// ---------------- REST API ENDPOINTS ----------------

// Fetch entire database state (extremely useful for client context)
app.get("/api/state", (req, res) => {
  res.json(dbState);
});

// Case Endpoints
app.post("/api/cases", (req, res) => {
  const newCase = {
    id: `case-${dbState.cases.length + 1}`,
    createdAt: new Date().toISOString().split("T")[0],
    ...req.body
  };
  dbState.cases.unshift(newCase);
  
  // Add an audit log
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    user: "SMI Fahim",
    role: "Supreme Administrator",
    action: "New Case Registered",
    module: "Case Management",
    ipAddress: "127.0.0.1",
    details: `Case Number ${newCase.caseNumber} registered in ${newCase.court}.`
  });

  saveState();
  res.json({ success: true, item: newCase });
});

app.put("/api/cases/:id", (req, res) => {
  const { id } = req.params;
  const index = dbState.cases.findIndex(c => c.id === id);
  if (index !== -1) {
    dbState.cases[index] = { ...dbState.cases[index], ...req.body };
    dbState.auditLogs.unshift({
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: "SMI Fahim",
      role: "Supreme Administrator",
      action: "Case Details Modified",
      module: "Case Management",
      ipAddress: "127.0.0.1",
      details: `Case ID ${id} was updated.`
    });
    saveState();
    res.json({ success: true, item: dbState.cases[index] });
  } else {
    res.status(404).json({ error: "Case not found" });
  }
});

// Financial Transaction Endpoint
app.post("/api/finance", (req, res) => {
  const newTx = {
    id: `fin-${Date.now()}`,
    ...req.body
  };
  dbState.finance.unshift(newTx);
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    user: "SMI Fahim",
    role: "Supreme Administrator",
    action: "Financial Record Added",
    module: "Billing & Finance",
    ipAddress: "127.0.0.1",
    details: `${newTx.type} of BDT ${newTx.amount} created for client ${newTx.clientName}.`
  });
  saveState();
  res.json({ success: true, item: newTx });
});

// Digital Evidence Upload Endpoint (Simulated)
app.post("/api/evidence", (req, res) => {
  const newEv = {
    id: `ev-${Date.now()}`,
    uploadDate: new Date().toISOString().split("T")[0],
    digitalSignature: `SHA256-${Math.random().toString(36).substring(7).toUpperCase()}`,
    chainOfCustody: [
      {
        date: new Date().toLocaleString(),
        action: "Uploaded and digitally signed",
        user: "SMI Fahim"
      }
    ],
    ...req.body
  };
  dbState.evidence.unshift(newEv);
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    user: "SMI Fahim",
    role: "Supreme Administrator",
    action: "Evidence Filed in Vault",
    module: "Evidence Vault",
    ipAddress: "127.0.0.1",
    details: `Evidence "${newEv.title}" digitally logged with SHA-256 validation.`
  });
  saveState();
  res.json({ success: true, item: newEv });
});

// Appoint booking Endpoint
app.post("/api/appointments", (req, res) => {
  const newAppt = {
    id: `appt-${Date.now()}`,
    ...req.body
  };
  dbState.appointments.unshift(newAppt);

  // Synchronize scheduled litigation steps/hearings with dbState.hearings
  if (req.body.caseId) {
    const purpose = req.body.purpose || "";
    const courtroomMatch = purpose.match(/at\s+(Room\s+No\.\s+\d+)/i) || purpose.match(/at\s+([^.]+)/i);
    const courtroom = courtroomMatch ? courtroomMatch[1] : "Room No. 402";

    const judgeMatch = purpose.match(/with\s+Judge\s+([^.]+)/i);
    const judge = judgeMatch ? judgeMatch[1] : "Justice Md. Ashraful Islam";

    const notesMatch = purpose.match(/Notes:\s*(.*)/i);
    const notes = notesMatch ? notesMatch[1] : purpose;

    dbState.hearings.unshift({
      id: `hearing-${Date.now()}`,
      caseId: req.body.caseId,
      caseNumber: req.body.caseNumber || "",
      caseTitle: dbState.cases.find(c => c.id === req.body.caseId)?.title || "Court Litigation Session",
      hearingDate: req.body.dateTime ? req.body.dateTime.split("T")[0] : new Date().toISOString().split("T")[0],
      hearingTime: req.body.dateTime ? new Date(req.body.dateTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "10:30 AM",
      courtroom,
      judge,
      assignedLawyer: req.body.lawyerName || "Salim Rahaman Dipu",
      checklist: ["Verify primary deed", "Examine witness"],
      durationMinutes: 45,
      outcome: "Hearing scheduled",
      status: "Scheduled",
      notes
    });
  }

  saveState();
  res.json({ success: true, item: newAppt });
});

// Contract Draft Endpoint
app.post("/api/contracts", (req, res) => {
  const newContract = {
    id: `con-${Date.now()}`,
    lastUpdated: new Date().toISOString().split("T")[0],
    ...req.body
  };
  dbState.contracts.unshift(newContract);
  saveState();
  res.json({ success: true, item: newContract });
});

// Court Attendance Endpoint
app.post("/api/court-attendance", (req, res) => {
  const newAttendance = {
    id: `attn-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body
  };
  dbState.courtAttendance.unshift(newAttendance);

  // Automatically update the 'Court Hearing' status to 'Verified Present' in the hearings store
  if (req.body.caseId && (req.body.status === "Verified" || req.body.status === "Simulated")) {
    let updatedHearing = false;
    dbState.hearings = dbState.hearings.map((h) => {
      if (h.caseId === req.body.caseId && h.status === "Scheduled") {
        updatedHearing = true;
        return {
          ...h,
          status: "Verified Present",
          outcome: `Presence of ${req.body.name} (${req.body.role}) verified via GPS at ${req.body.courtName}.`,
          notes: `${h.notes || ""}\n[GPS Verification ${new Date().toLocaleString()}]: Status: ${req.body.status}. coordinates: [${req.body.latitude || 0}, ${req.body.longitude || 0}]`
        };
      }
      return h;
    });

    // If no scheduled hearing exists, create an dynamic active stage hearing as "Verified Present"
    if (!updatedHearing) {
      const associatedCase = dbState.cases.find(c => c.id === req.body.caseId);
      dbState.hearings.unshift({
        id: `hearing-${Date.now()}`,
        caseId: req.body.caseId,
        caseNumber: associatedCase ? associatedCase.caseNumber : (req.body.caseNumber || "Ad-hoc"),
        caseTitle: associatedCase ? associatedCase.title : "Court Litigation Session",
        hearingDate: new Date().toISOString().split("T")[0],
        hearingTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        courtroom: "Room No. 402",
        judge: associatedCase ? associatedCase.judge : "Justice Md. Ashraful Islam",
        assignedLawyer: req.body.name || "Salim Rahaman Dipu",
        checklist: ["GPS presence validated"],
        durationMinutes: 30,
        outcome: `Presence of ${req.body.name} (${req.body.role}) verified via GPS.`,
        status: "Verified Present",
        notes: `Attendance verified at ${req.body.courtName} (Lat: ${req.body.latitude || 0}, Lng: ${req.body.longitude || 0}).`
      });
    }
  }

  // Add audit log
  dbState.auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
    user: req.body.name || "System",
    role: req.body.role || "Lawyer",
    action: "Court Presence Logged",
    module: "Court Attendance Ledger",
    ipAddress: "127.0.0.1",
    details: `${req.body.name} (${req.body.role}) logged court attendance at ${req.body.courtName || "Court"} via GPS [${req.body.latitude || 0}, ${req.body.longitude || 0}]. Status: ${req.body.status || "Verified"}.`
  });

  saveState();
  res.json({ success: true, item: newAttendance });
});

// ---------------- INTELLIGENT AI FEATURES (GEMINI) ----------------

// 1. AI Legal Notices & Contracts drafting route
app.post("/api/gemini/generate-draft", async (req, res) => {
  const { docType, clientName, opposingParty, matterDescription, specificClauses } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured in Secrets." });
  }

  try {
    const prompt = `You are a Senior Legal Draftsman and Advocate of the Supreme Court of Bangladesh. 
    Draft a fully professional, legally sound, and formal ${docType} customized for Bangladesh jurisdiction.
    
    Details:
    - Primary Client: ${clientName}
    - Opposing Party: ${opposingParty || "N/A"}
    - Matter Description: ${matterDescription}
    - Key Clauses to include: ${specificClauses || "Standard clauses conforming to the Code of Civil Procedure (CPC) or Contract Act of Bangladesh."}
    
    Ensure you use standard Bangladeshi legal terminology, such as:
    - "Whereas the Scheduled Property..." (if property is involved)
    - Reference relevant statutory laws (e.g., Contract Act 1872, Code of Civil Procedure 1908, Penal Code 1860, Specific Relief Act 1877)
    - Professional legal layout, with placeholders [Insert Date], [Insert Address], etc.
    - Write the output in a clear, formatted, readable manner with markdown.
    - Start with a grand title fit for a Bangladeshi court or formal law office.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, draftText: response.text });
  } catch (err: any) {
    console.error("Gemini Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate legal draft." });
  }
});

// 2. AI Laws Grounding & Research Assistance Route
app.post("/api/gemini/search-legislation", async (req, res) => {
  const { query, practiceArea } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured in Secrets." });
  }

  try {
    const prompt = `You are an elite legal researcher and senior legal advisor for the Ministry of Law, Justice and Parliamentary Affairs of Bangladesh. 
    Analyze the following research query under the legal framework of Bangladesh:
    
    Query: "${query}"
    Practice Area: ${practiceArea || "General Practice"}
    
    Structure your answer as follows:
    1. **Applicable Acts/Statutes**: Identify the specific Acts (e.g., Code of Civil Procedure 1908, Code of Criminal Procedure 1898, Transfer of Property Act 1882, Bangladesh Labour Act 2006).
    2. **Key Legal Principles**: Explain how these laws apply to the query.
    3. **Precedent Guidelines**: Provide historical or standard interpretations/precedents of the Supreme Court of Bangladesh (High Court or Appellate Division) if relevant.
    4. **Actionable Counsel/Recommendations**: Steps a junior lawyer should take in preparing this litigation.
    
    Respond in professional, objective legal language with elegant structure. Use Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ success: true, responseText: response.text });
  } catch (err: any) {
    console.error("Gemini Research Error:", err);
    res.status(500).json({ error: err.message || "Failed to execute legal research." });
  }
});


// ---------------- PRODUCTION SERVING AND DEV SERVER SETUP ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IntelliJudge Full-Stack Server running at http://localhost:${PORT}`);
  });
}

startServer();
