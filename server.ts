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
  arbitrationCases: any[];
  mediators: any[];
  adrMessages: any[];
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

const seedMediators = [
  {
    id: "med-1",
    name: "Justice Syed J. R. Mudassir Husain",
    type: "Both",
    expertise: "Constitutional & Civil ADR, Administrative Disputes",
    experienceYears: 32,
    certifications: ["CEDR Accredited Mediator", "FCIArb (London)", "Former Chief Justice of Bangladesh"],
    languages: ["Bangla", "English"],
    successRate: 92,
    rating: 4.9,
    workload: 2,
    conflictDeclaration: "No conflicts declared. Holds active panel membership at Bangladesh International Arbitration Centre (BIAC).",
    previousAssociations: ["Government of Bangladesh", "Supreme Court", "BIAC"],
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
    appointmentHistory: [
      { caseNumber: "ADR-2025-014", outcome: "Settled - Consent Order Issued", year: 2025 },
      { caseNumber: "ADR-2025-089", outcome: "Award Rendered", year: 2025 }
    ]
  },
  {
    id: "med-2",
    name: "Barrister Rashna Imam",
    type: "Both",
    expertise: "Corporate Mergers, Banking Law, Intellectual Property",
    experienceYears: 18,
    certifications: ["FCIArb (London)", "BIAC Panelist", "Supreme Court Advocate"],
    languages: ["Bangla", "English", "Urdu"],
    successRate: 85,
    rating: 4.8,
    workload: 1,
    conflictDeclaration: "No current conflicts. Advised Meghna Group of Industries in unrelated litigation during 2024.",
    previousAssociations: ["Meghna Group", "Meghna Builders", "Al-Amin Estate"],
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256",
    appointmentHistory: [
      { caseNumber: "ADR-2025-110", outcome: "Settled via Mediation", year: 2025 }
    ]
  },
  {
    id: "med-3",
    name: "Dr. Toufiq Ali",
    type: "Arbitrator",
    expertise: "International Trade, Maritime Law, Commercial Contracts",
    experienceYears: 25,
    certifications: ["Ph.D. in Economics", "Former Ambassador of Bangladesh to WTO", "BIAC Senior Arbitrator"],
    languages: ["Bangla", "English", "French"],
    successRate: 88,
    rating: 4.7,
    workload: 3,
    conflictDeclaration: "Former representative to World Trade Organization. Excused from cases involving Ministry of Shipping.",
    previousAssociations: ["Pacific Shipping Lines", "Ministry of Shipping", "WTO"],
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256",
    appointmentHistory: [
      { caseNumber: "ADR-2024-051", outcome: "Award Published", year: 2024 }
    ]
  },
  {
    id: "med-4",
    name: "Ms. Syeda Rizwana Hasan",
    type: "Mediator",
    expertise: "Environmental & Land ADR, Property Partition",
    experienceYears: 22,
    certifications: ["Goldman Environmental Prize Recipient", "Supreme Court Advocate", "BELR Panelist"],
    languages: ["Bangla", "English"],
    successRate: 90,
    rating: 4.9,
    workload: 0,
    conflictDeclaration: "Director of Bangladesh Environmental Lawyers Association. Will not mediate cases involving coal power consortia.",
    previousAssociations: ["Bangladesh Environmental Lawyers Association", "coal power consortia", "BELA"],
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256",
    appointmentHistory: [
      { caseNumber: "ADR-2024-022", outcome: "Settled - Land Partition Compromise", year: 2024 }
    ]
  },
  {
    id: "med-5",
    name: "Barrister Tanjib-ul Alam",
    type: "Arbitrator",
    expertise: "Company Disputes, Telecommunications, Energy Sector",
    experienceYears: 20,
    certifications: ["Advocate, Supreme Court of Bangladesh", "BIAC Governing Board Member"],
    languages: ["Bangla", "English"],
    successRate: 86,
    rating: 4.6,
    workload: 2,
    conflictDeclaration: "Independent Director at local commercial bank. Excluded from disputes involving Bank Asia.",
    previousAssociations: ["Bank Asia", "Telecommunications", "Grameenphone"],
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256",
    appointmentHistory: [
      { caseNumber: "ADR-2025-045", outcome: "Award Issued - Unanimous Panel", year: 2025 }
    ]
  }
];

const seedArbitrationCases = [
  {
    id: "adr-1",
    caseNumber: "ADR-2026-Dhaka-102",
    type: "Mediation",
    disputeCategory: "Commercial Property",
    subject: "Chittagong Port Warehouse Lease Land Dispute",
    parties: "Meghna Builders Ltd. Vs. Al-Amin Estate Ltd.",
    representatives: "Advocate Salim Rahaman Dipu, Advocate Tanvir Rifat",
    organization: "Bangladesh International Arbitration Centre (BIAC)",
    contactInfo: "admin@meghnabuilders.com | +8801755112233",
    priority: "High",
    claimAmount: 4500000,
    supportingDocuments: ["Lease Agreement 2024.pdf", "Survey Report.pdf", "CS Khatian Copy.pdf"],
    initialStatement: "Claimant seeks restoration of storage warehouse demarcation line as per Section 89A of Code of Civil Procedure (CPC) Bangladesh. Respondent alleges illegal encroachment.",
    jurisdiction: "Dhaka Division",
    preferredLanguage: "Bangla",
    confidentiality: "Strictly Confidential",
    status: "Under Mediation",
    createdAt: "2026-06-01",
    mediatorId: "med-2",
    panelType: "Sole",
    arbitrators: [],
    timeline: [
      { date: "2026-06-01", action: "Dispute Registered", details: "Dispute formal filing received and processed under BIAC Fast-Track Rules.", icon: "Registration" },
      { date: "2026-06-03", action: "Document Uploaded", details: "CS Khatian and Land survey reports uploaded for review.", icon: "Document" },
      { date: "2026-06-10", action: "Mediator Assigned", details: "Barrister Rashna Imam assigned as Sole Mediator following conflict verification.", icon: "Mediator" },
      { date: "2026-06-20", action: "First Joint Mediation Session", details: "Parties met at BIAC Room 10. Boundaries reviewed. Settlement options discussed.", icon: "Hearing" }
    ],
    evidence: [
      { id: "ev-adr-1", title: "Original Lease Agreement (Registered)", type: "PDF", uploadedBy: "Advocate Salim Rahaman Dipu", uploadDate: "2026-06-02", size: "4.2 MB" },
      { id: "ev-adr-2", title: "Digital Land Survey Map", type: "Image", uploadedBy: "Advocate Tanvir Rifat", uploadDate: "2026-06-05", size: "8.1 MB" }
    ],
    proceduralOrders: [
      { id: "po-adr-1", orderNumber: 1, title: "Order for Joint Site Survey", date: "2026-06-12", description: "Directing both parties to engage a government-certified surveyor to verify boundaries." }
    ],
    writtenSubmissions: [
      { id: "ws-adr-1", party: "Meghna Builders Ltd.", title: "Claim Statement & Demarcation Plea", date: "2026-06-08", docUrl: "#" }
    ],
    witnesses: [
      { id: "wit-adr-1", name: "Engr. Mahmudul Hasan", type: "Expert", expertise: "Cadastral Survey", declaredConflict: false }
    ],
    finalAward: null,
    sessions: [
      {
        id: "sess-adr-1",
        date: "2026-06-20",
        time: "10:30 AM",
        mode: "Physical",
        venue: "BIAC Room 10 (Panthapath, Dhaka)",
        jointRecord: "Both parties agreed to let the surveyor determine the boundary. Respondents requested time to inspect raw survey logs.",
        privateNotes: "Respondents are willing to pay monetary compensation if they cannot adjust the boundary physically. High chance of settlement.",
        attendance: ["Salim Rahaman Dipu", "Tanvir Rifat", "Engr. Mahmudul Hasan"]
      }
    ],
    settlementAgreement: {
      id: "sa-adr-1",
      status: "Draft",
      content: "PREAMBLE: This Settlement Agreement is entered under Sec 89A of CPC (Bangladesh) between Meghna Builders and Al-Amin Estate...\nTERMS OF SETTLEMENT: \n1. Respondent shall pay 1,200,000 BDT in lieu of land adjustment.\n2. Both parties waive further court litigation on this specific plot.",
      signatures: [],
      versionHistory: [
        { version: "v1.0", date: "2026-06-25", author: "Barrister Rashna Imam", comment: "Initial draft formulated from mediation session guidelines." }
      ]
    }
  },
  {
    id: "adr-2",
    caseNumber: "ADR-2026-Ctg-204",
    type: "Arbitration",
    disputeCategory: "Maritime & Shipping",
    subject: "Demurrage Charges Dispute under Bill of Lading",
    parties: "Dhaka Garments Export Ltd. Vs. Pacific Shipping Lines",
    representatives: "Advocate Kamal Hossain, Advocate Rashedul Bari",
    organization: "Chittagong Chamber of Commerce & Industry",
    contactInfo: "legal@dhakagarments.com | +8801811223344",
    priority: "High",
    claimAmount: 18000000,
    supportingDocuments: ["Bill of Lading.pdf", "Demurrage Invoice.pdf", "Customs Clearance.pdf"],
    initialStatement: "Dispute concerning 18,000,000 BDT demurrage fees levied on garments raw materials at Chittagong Port due to port labor strikes. Claimant argues Force Majeure under Clause 14.",
    jurisdiction: "Chittagong Division",
    preferredLanguage: "English",
    confidentiality: "Standard",
    status: "Arbitration Panel Formed",
    createdAt: "2026-05-10",
    mediatorId: null,
    panelType: "Sole",
    arbitrators: ["Dr. Toufiq Ali"],
    timeline: [
      { date: "2026-05-10", action: "Dispute Registered", details: "Arbitration request filed citing bilateral clause in Bill of Lading.", icon: "Registration" },
      { date: "2026-05-20", action: "Arbitration Panel Formed", details: "Dr. Toufiq Ali appointed as Sole Arbitrator under Bangladesh Arbitration Act 2001.", icon: "Mediator" },
      { date: "2026-06-05", action: "First Hearing", details: "Terms of Reference signed. Deadlines for written claims and counterclaims established.", icon: "Hearing" }
    ],
    evidence: [
      { id: "ev-adr-3", title: "Customs Clearance Delay Logs", type: "PDF", uploadedBy: "Advocate Kamal Hossain", uploadDate: "2026-05-15", size: "1.8 MB" }
    ],
    proceduralOrders: [
      { id: "po-adr-2", orderNumber: 1, title: "Terms of Reference & Schedule", date: "2026-05-25", description: "Directing claimant to file Written Statement by June 15 and respondent to reply by July 5." }
    ],
    writtenSubmissions: [
      { id: "ws-adr-2", party: "Dhaka Garments Export Ltd.", title: "Statement of Claim", date: "2026-06-12", docUrl: "#" },
      { id: "ws-adr-3", party: "Pacific Shipping Lines", title: "Statement of Defence & Counterclaim", date: "2026-07-02", docUrl: "#" }
    ],
    witnesses: [
      { id: "wit-adr-2", name: "Capt. Anwarul Kabir", type: "Expert", expertise: "Port Operations", declaredConflict: false }
    ],
    finalAward: null,
    sessions: [
      {
        id: "sess-adr-2",
        date: "2026-06-05",
        time: "02:00 PM",
        mode: "Physical",
        venue: "Chittagong Chamber Seminar Hall",
        jointRecord: "Terms of reference finalized. Respondent submitted force majeure clauses require pre-approval.",
        privateNotes: "No private discussion. Structured arbitration proceeding.",
        attendance: ["Kamal Hossain", "Rashedul Bari", "Dr. Toufiq Ali"]
      }
    ],
    settlementAgreement: null
  },
  {
    id: "adr-3",
    caseNumber: "ADR-2026-Dhaka-045",
    type: "Mediation",
    disputeCategory: "Intellectual Property / Corporate",
    subject: "Dhakai Jamdani Design Patent & Royalties Dispute",
    parties: "WebTech Bangladesh Vs. Jamdani Artisans Coop",
    representatives: "Advocate Sonia Akhtar, Advocate Rakib Ahmed",
    organization: "Bangladesh IP Association",
    contactInfo: "coop@jamdani.org | +8801911223344",
    priority: "Medium",
    claimAmount: 2000000,
    supportingDocuments: ["Patent Registration.pdf", "Marketing Agreement.pdf"],
    initialStatement: "Artisans alleged unauthorized online commercialization of Geographic Indication (GI) protected Jamdani patterns on WebTech's e-commerce platform.",
    jurisdiction: "Dhaka Division",
    preferredLanguage: "Bangla",
    confidentiality: "Standard",
    status: "Settled",
    createdAt: "2026-04-12",
    mediatorId: "med-1",
    panelType: "Sole",
    arbitrators: [],
    timeline: [
      { date: "2026-04-12", action: "Dispute Registered", details: "Cooperative filed complaint regarding IP copyright infringement.", icon: "Registration" },
      { date: "2026-04-20", action: "Mediator Assigned", details: "Justice Syed J. R. Mudassir Husain agreed to act as Mediator.", icon: "Mediator" },
      { date: "2026-04-28", action: "Joint Mediation Session", details: "Amicable settlement reached. Draft agreement created.", icon: "Hearing" },
      { date: "2026-05-15", action: "Settlement Executed", details: "Digital Settlement Agreement signed by both parties' directors.", icon: "Agreement" }
    ],
    evidence: [],
    proceduralOrders: [],
    writtenSubmissions: [],
    witnesses: [],
    finalAward: null,
    sessions: [
      {
        id: "sess-adr-3",
        date: "2026-04-28",
        time: "11:00 AM",
        mode: "Online",
        venue: "Virtual Zoom Mediation",
        jointRecord: "Parties agreed to standard co-branding. WebTech agreed to pay 8% royalty to coop funds on all digital sales.",
        privateNotes: "Cooperative was eager to gain digital market access. WebTech was afraid of brand boycott. A swift win-win scenario.",
        attendance: ["Sonia Akhtar", "Rakib Ahmed", "Artisan Leader"]
      }
    ],
    settlementAgreement: {
      id: "sa-adr-3",
      status: "Signed",
      content: "MEMORANDUM OF SETTLEMENT\nUnder Section 89A of Civil Procedure Code 1908 (Bangladesh).\n1. WebTech Bangladesh recognizes Jamdani Cooperative's GI rights.\n2. WebTech shall display GI authentication badges on all listings.\n3. Royalty of 8% on net sales is payable quarterly.",
      signatures: [
        { party: "WebTech CEO", date: "2026-05-15T11:00:00Z", ip: "103.112.44.15" },
        { party: "Cooperative Chairman", date: "2026-05-15T11:15:00Z", ip: "103.112.45.20" }
      ],
      versionHistory: [
        { version: "v1.0", date: "2026-04-30", author: "Justice Syed J. R. Mudassir Husain", comment: "Final version approved by legal councils." }
      ]
    }
  }
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
      hearingDate: idx < 2 ? new Date().toISOString().split("T")[0] : c.nextHearingDate,
      hearingTime: `${9 + (idx % 4)}:30 AM`,
      courtroom: `Room No. ${400 + idx}`,
      judge: c.judge,
      assignedLawyer: c.leadLawyer,
      checklist: ["Verify primary deed", "Examine secondary witness", "Draft written statement"],
      durationMinutes: 45 + (idx % 4) * 15,
      outcome: idx % 3 === 0 ? "Adjourned - Next date set" : "Hearing concluded",
      status: idx < 2 ? "Scheduled" : (idx % 2 === 0 ? "Scheduled" : "Completed"),
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
    courtAttendance: [],
    arbitrationCases: seedArbitrationCases,
    mediators: seedMediators,
    adrMessages: []
  };

  fs.writeFileSync(STORE_PATH, JSON.stringify(initialData, null, 2), "utf8");
  return initialData;
}

let dbState: DataStoreSchema = seedDatabase();
if (!dbState.courtAttendance) {
  dbState.courtAttendance = [];
}
if (!dbState.arbitrationCases) {
  dbState.arbitrationCases = seedArbitrationCases;
}
if (!dbState.mediators) {
  dbState.mediators = seedMediators;
}
if (!dbState.adrMessages) {
  dbState.adrMessages = [];
}
saveState();

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


// ---------------- ARBITRATION & MEDIATION ENDPOINTS ----------------

// Register a new ADR dispute
app.post("/api/adr/disputes", (req, res) => {
  try {
    const todayStr = new Date().toISOString().split("T")[0];
    const newDispute = {
      id: `adr-${Date.now()}`,
      caseNumber: req.body.caseNumber || `ADR-2026-Dhaka-${Math.floor(100 + Math.random() * 900)}`,
      type: req.body.type || "Mediation",
      disputeCategory: req.body.disputeCategory || "Civil Dispute",
      subject: req.body.subject || "General Dispute Subject",
      parties: req.body.parties || "Claimant Vs. Respondent",
      representatives: req.body.representatives || "",
      organization: req.body.organization || "BIAC",
      contactInfo: req.body.contactInfo || "",
      priority: req.body.priority || "Medium",
      claimAmount: Number(req.body.claimAmount) || 0,
      supportingDocuments: req.body.supportingDocuments || [],
      initialStatement: req.body.initialStatement || "",
      jurisdiction: req.body.jurisdiction || "Dhaka Division",
      preferredLanguage: req.body.preferredLanguage || "Bangla",
      confidentiality: req.body.confidentiality || "Standard",
      status: "Registered",
      createdAt: todayStr,
      mediatorId: null,
      panelType: req.body.panelType || "Sole",
      arbitrators: [],
      timeline: [
        { 
          date: todayStr, 
          action: "Dispute Registered", 
          details: `Dispute formal filing received under ${req.body.organization || "institutional"} rules. Initial claim amount: BDT ${Number(req.body.claimAmount || 0).toLocaleString()}.`, 
          icon: "Registration" 
        }
      ],
      evidence: [],
      proceduralOrders: [],
      writtenSubmissions: [],
      witnesses: [],
      finalAward: null,
      sessions: [],
      settlementAgreement: null
    };

    dbState.arbitrationCases.unshift(newDispute);

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: req.body.user || "Registrar Office",
      role: "Front Desk / Registrar",
      action: "Register ADR Case",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Registered new ADR Dispute ${newDispute.caseNumber}: ${newDispute.parties}.`
    });

    saveState();
    res.json({ success: true, item: newDispute });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to register dispute" });
  }
});

// Update ADR case (assign mediator, edit details, change status, add witnesses)
app.post("/api/adr/update-case", (req, res) => {
  try {
    const { caseId, updateFields, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    const updatedCase = { ...currentCase, ...updateFields };
    const todayStr = new Date().toISOString().split("T")[0];

    // Check what changed to add timeline updates
    if (updateFields.mediatorId && updateFields.mediatorId !== currentCase.mediatorId) {
      const mediator = dbState.mediators.find(m => m.id === updateFields.mediatorId);
      const name = mediator ? mediator.name : "Assigned Specialist";
      updatedCase.timeline.push({
        date: todayStr,
        action: "Mediator Assigned",
        details: `Assigned mediator ${name} to manage dispute resolution discussions.`,
        icon: "Mediator"
      });
      updatedCase.status = "Under Mediation";
    }

    if (updateFields.arbitrators && JSON.stringify(updateFields.arbitrators) !== JSON.stringify(currentCase.arbitrators)) {
      updatedCase.timeline.push({
        date: todayStr,
        action: "Arbitration Panel Formed",
        details: `Formed arbitration panel with: ${updateFields.arbitrators.join(", ")}.`,
        icon: "Mediator"
      });
      updatedCase.status = "Arbitration Panel Formed";
    }

    if (updateFields.status && updateFields.status !== currentCase.status) {
      updatedCase.timeline.push({
        date: todayStr,
        action: "Status Changed",
        details: `Dispute resolution status updated from ${currentCase.status} to ${updateFields.status}.`,
        icon: "Agreement"
      });
    }

    if (updateFields.witnesses && updateFields.witnesses.length !== (currentCase.witnesses || []).length) {
      const addedWitness = updateFields.witnesses[updateFields.witnesses.length - 1];
      updatedCase.timeline.push({
        date: todayStr,
        action: "Witness Listed",
        details: `Added ${addedWitness.type} witness: ${addedWitness.name} (${addedWitness.expertise || "Fact Witness"}).`,
        icon: "Document"
      });
    }

    dbState.arbitrationCases[index] = updatedCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Officer",
      role: role || "Mediator / Registrar",
      action: "Update ADR Case",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Updated ADR Case ${currentCase.caseNumber} fields: ${Object.keys(updateFields).join(", ")}.`
    });

    saveState();
    res.json({ success: true, item: updatedCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update case" });
  }
});

// Schedule mediation/arbitration session
app.post("/api/adr/sessions", (req, res) => {
  try {
    const { caseId, date, time, mode, venue, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    const newSession = {
      id: `sess-${Date.now()}`,
      date,
      time,
      mode,
      venue,
      jointRecord: "",
      privateNotes: "",
      attendance: []
    };

    currentCase.sessions = currentCase.sessions || [];
    currentCase.sessions.push(newSession);

    // Update case timeline
    currentCase.timeline.push({
      date,
      action: "Session Scheduled",
      details: `Scheduled ${currentCase.type} Session (${mode}) on ${date} at ${time}. Venue: ${venue}.`,
      icon: "Hearing"
    });

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Scheduler",
      role: role || "Staff",
      action: "Schedule ADR Session",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Scheduled ${currentCase.type} session for Case ${currentCase.caseNumber} on ${date}.`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to schedule session" });
  }
});

// Save session notes (attendance, joint record, private notes)
app.post("/api/adr/sessions/notes", (req, res) => {
  try {
    const { caseId, sessionId, jointRecord, privateNotes, attendance, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    const sessIndex = currentCase.sessions.findIndex((s: any) => s.id === sessionId);
    if (sessIndex === -1) {
      return res.status(404).json({ error: "Session not found" });
    }

    currentCase.sessions[sessIndex].jointRecord = jointRecord;
    currentCase.sessions[sessIndex].privateNotes = privateNotes;
    currentCase.sessions[sessIndex].attendance = attendance;

    const todayStr = new Date().toISOString().split("T")[0];
    currentCase.timeline.push({
      date: todayStr,
      action: "Session Concluded",
      details: `Concluded session dated ${currentCase.sessions[sessIndex].date}. Negotiation notes and attendance sheet registered.`,
      icon: "Hearing"
    });

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Specialist",
      role: role || "Mediator",
      action: "Save ADR Session Notes",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Registered session outcome and notes for Case ${currentCase.caseNumber} (Session ID: ${sessionId}).`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save session notes" });
  }
});

// Create a procedural order (mainly for arbitration)
app.post("/api/adr/procedural-orders", (req, res) => {
  try {
    const { caseId, title, description, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    currentCase.proceduralOrders = currentCase.proceduralOrders || [];
    
    const newOrder = {
      id: `po-${Date.now()}`,
      orderNumber: currentCase.proceduralOrders.length + 1,
      title,
      date: new Date().toISOString().split("T")[0],
      description
    };

    currentCase.proceduralOrders.push(newOrder);

    // Update case timeline
    currentCase.timeline.push({
      date: newOrder.date,
      action: "Procedural Order Issued",
      details: `Issued Procedural Order No. ${newOrder.orderNumber}: "${title}". Details: ${description}`,
      icon: "Document"
    });

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Arbitrator",
      role: role || "Arbitrator",
      action: "Issue Procedural Order",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Issued Procedural Order No. ${newOrder.orderNumber} for Case ${currentCase.caseNumber}.`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to issue procedural order" });
  }
});

// Upload case evidence/documents
app.post("/api/adr/evidence", (req, res) => {
  try {
    const { caseId, title, type, uploadedBy, size, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    currentCase.evidence = currentCase.evidence || [];
    
    const newEv = {
      id: `ev-adr-${Date.now()}`,
      title,
      type,
      uploadedBy,
      uploadDate: new Date().toISOString().split("T")[0],
      size: size || "1.2 MB"
    };

    currentCase.evidence.push(newEv);

    // Update case timeline
    currentCase.timeline.push({
      date: newEv.uploadDate,
      action: "Evidence Document Uploaded",
      details: `Uploaded file "${title}" (${type}, Size: ${newEv.size}) into dispute directory.`,
      icon: "Document"
    });

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || uploadedBy,
      role: role || "Lawyer",
      action: "Upload ADR Evidence",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Uploaded evidence document "${title}" for Case ${currentCase.caseNumber}.`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to upload evidence" });
  }
});

// Generate/Issue Final Award (Arbitration)
app.post("/api/adr/final-award", (req, res) => {
  try {
    const { caseId, amount, details, publicationStatus, appealDeadline, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    const todayStr = new Date().toISOString().split("T")[0];

    currentCase.finalAward = {
      id: `award-${Date.now()}`,
      amount: Number(amount) || 0,
      details,
      date: todayStr,
      publicationStatus: publicationStatus || "Published",
      appealDeadline: appealDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] // default 30 days
    };

    if (publicationStatus === "Published") {
      currentCase.status = "Settled"; // Concluded or Settled
      currentCase.timeline.push({
        date: todayStr,
        action: "Final Arbitration Award Issued",
        details: `Final Arbitration Award issued: BDT ${Number(amount).toLocaleString()} awarded. Appeal deadline set to ${currentCase.finalAward.appealDeadline} under Sec 42 of Bangladesh Arbitration Act 2001.`,
        icon: "Agreement"
      });
    } else {
      currentCase.timeline.push({
        date: todayStr,
        action: "Draft Award Generated",
        details: `Draft Arbitration Award generated by Arbitrator. Awaiting final publication review.`,
        icon: "Document"
      });
    }

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Arbitrator",
      role: role || "Arbitrator",
      action: "Issue Final Award",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Generated final award for Case ${currentCase.caseNumber} of amount BDT ${Number(amount).toLocaleString()}.`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to generate final award" });
  }
});

// Settlement Agreement management (create, update, sign)
app.post("/api/adr/settlement", (req, res) => {
  try {
    const { caseId, status, content, signature, amendmentComment, user, role } = req.body;
    const index = dbState.arbitrationCases.findIndex(c => c.id === caseId);
    if (index === -1) {
      return res.status(404).json({ error: "ADR Case not found" });
    }

    const currentCase = dbState.arbitrationCases[index];
    const todayStr = new Date().toISOString().split("T")[0];

    if (!currentCase.settlementAgreement) {
      currentCase.settlementAgreement = {
        id: `sa-${Date.now()}`,
        status: status || "Draft",
        content: content || "",
        signatures: [],
        versionHistory: [
          { version: "v1.0", date: todayStr, author: user || "Mediator", comment: amendmentComment || "Initial Settlement draft formulated." }
        ]
      };
    } else {
      const prevContent = currentCase.settlementAgreement.content;
      currentCase.settlementAgreement.status = status || currentCase.settlementAgreement.status;
      currentCase.settlementAgreement.content = content || currentCase.settlementAgreement.content;
      
      if (content && prevContent !== content) {
        const nextVersion = `v1.${currentCase.settlementAgreement.versionHistory.length}`;
        currentCase.settlementAgreement.versionHistory.push({
          version: nextVersion,
          date: todayStr,
          author: user || "Mediator",
          comment: amendmentComment || "Settlement agreement edited and refined."
        });
      }
    }

    // Append digital signature if supplied
    if (signature) {
      currentCase.settlementAgreement.signatures = currentCase.settlementAgreement.signatures || [];
      currentCase.settlementAgreement.signatures.push({
        party: signature.party,
        date: new Date().toISOString(),
        ip: signature.ip || "103.112.44.15"
      });

      currentCase.timeline.push({
        date: todayStr,
        action: "Digital Signature Applied",
        details: `Digital Signature applied by representative of "${signature.party}". IP Verified: ${signature.ip || "103.112.44.15"}.`,
        icon: "Agreement"
      });

      // If signed by multiple parties (or if we mark status as Signed), conclude case as Settled
      if (status === "Signed" || currentCase.settlementAgreement.signatures.length >= 2) {
        currentCase.settlementAgreement.status = "Signed";
        currentCase.status = "Settled";
        currentCase.timeline.push({
          date: todayStr,
          action: "Settlement Executed Amicably",
          details: `Dispute resolved amicably. Settlement contract fully signed and archived under Sec 89A of CPC (Bangladesh).`,
          icon: "Agreement"
        });
      }
    } else {
      // General status updates
      if (status === "Signed") {
        currentCase.settlementAgreement.status = "Signed";
        currentCase.status = "Settled";
        currentCase.timeline.push({
          date: todayStr,
          action: "Settlement Executed Amicably",
          details: `Dispute resolved amicably. Settlement contract finalized and marked fully signed.`,
          icon: "Agreement"
        });
      } else if (status === "Pending Signatures" && currentCase.settlementAgreement.status !== "Pending Signatures") {
        currentCase.timeline.push({
          date: todayStr,
          action: "Settlement Circulated for Signatures",
          details: `Settlement draft approved. Circulated to parties for formal digital signatures.`,
          icon: "Document"
        });
      }
    }

    dbState.arbitrationCases[index] = currentCase;

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: user || "Mediator",
      role: role || "Mediator",
      action: signature ? "Sign Settlement" : "Update Settlement",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: signature 
        ? `Applied digital signature for "${signature.party}" on ADR Case ${currentCase.caseNumber}.`
        : `Updated settlement terms for ADR Case ${currentCase.caseNumber}.`
    });

    saveState();
    res.json({ success: true, item: currentCase });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to manage settlement agreement" });
  }
});

// Post a discussion message
app.post("/api/adr/messages", (req, res) => {
  try {
    const { caseId, sender, role, message } = req.body;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      caseId: caseId || "general",
      sender,
      role,
      message,
      timestamp: new Date().toISOString()
    };

    dbState.adrMessages.push(newMsg);

    // Audit Log
    dbState.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: sender,
      role: role,
      action: "Send Case Message",
      module: "Arbitration & Mediation",
      ipAddress: "192.168.1.100",
      details: `Posted discussion message in Case context: ${caseId || "General Center"}.`
    });

    saveState();
    res.json({ success: true, item: newMsg });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send message" });
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
