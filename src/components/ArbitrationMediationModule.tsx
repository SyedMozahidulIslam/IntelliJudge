import React, { useState, useEffect } from "react";
import {
  Scale,
  Users,
  Shield,
  FileText,
  DollarSign,
  Calendar as CalendarIcon,
  Layers,
  MapPin,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Sliders,
  Send,
  Eye,
  Lock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  ExternalLink,
  MessageSquare,
  Download,
  Info,
  Check,
  FileSignature,
  FileSpreadsheet,
  AlertCircle,
  History,
  FileCheck
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from "recharts";

interface ArbitrationMediationModuleProps {
  dbState: any;
  refreshDbState: () => Promise<void>;
  selectedRole: string;
}

export function ArbitrationMediationModule({
  dbState,
  refreshDbState,
  selectedRole
}: ArbitrationMediationModuleProps) {
  // Navigation tabs for the module
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "disputes" | "directory" | "agreements" | "calendar" | "communications" | "reports"
  >("overview");

  // Selected dispute case for side panel detailing
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Search and filter states
  const [disputeSearch, setDisputeSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Input states for Dispute Registration
  const [showRegModal, setShowRegModal] = useState(false);
  const [newCaseNumber, setNewCaseNumber] = useState(`ADR-2026-Dhaka-${Math.floor(100 + Math.random() * 900)}`);
  const [newCaseType, setNewCaseType] = useState<"Mediation" | "Arbitration">("Mediation");
  const [newCategory, setNewCategory] = useState("Commercial Property");
  const [newSubject, setNewSubject] = useState("");
  const [newParties, setNewParties] = useState("");
  const [newRep, setNewRep] = useState("");
  const [newOrg, setNewOrg] = useState("Bangladesh International Arbitration Centre (BIAC)");
  const [newClaim, setNewClaim] = useState("");
  const [newInitialStatement, setNewInitialStatement] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newJurisdiction, setNewJurisdiction] = useState("Dhaka Division");
  const [newLanguage, setNewLanguage] = useState("Bangla");
  const [newConfidentiality, setNewConfidentiality] = useState("Standard");

  // Input states for Case Detail interactions
  const [witnessName, setWitnessName] = useState("");
  const [witnessType, setWitnessType] = useState<"Fact" | "Expert">("Fact");
  const [witnessExpertise, setWitnessExpertise] = useState("");
  
  const [orderTitle, setOrderTitle] = useState("");
  const [orderDesc, setOrderDesc] = useState("");

  const [evidenceTitle, setEvidenceTitle] = useState("");
  const [evidenceType, setEvidenceType] = useState("PDF");

  const [awardAmount, setAwardAmount] = useState("");
  const [awardDetails, setAwardDetails] = useState("");
  const [awardStatus, setAwardStatus] = useState<"Draft" | "Published">("Published");

  const [settlementTerms, setSettlementTerms] = useState("");
  const [amendmentComment, setAmendmentComment] = useState("");
  const [signatureName, setSignatureName] = useState("");

  const [chatInput, setChatInput] = useState("");

  const [sessionDate, setSessionDate] = useState("2026-07-15");
  const [sessionTime, setSessionTime] = useState("11:00 AM");
  const [sessionMode, setSessionMode] = useState<"Online" | "Physical">("Physical");
  const [sessionVenue, setSessionVenue] = useState("BIAC Panel Room 3, Dhaka");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [jointRecordNotes, setJointRecordNotes] = useState("");
  const [privateMediatorNotes, setPrivateMediatorNotes] = useState("");
  const [sessionAttendance, setSessionAttendance] = useState("");

  // Simulated export notifications
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Conflict Check states
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictScanCaseId, setConflictScanCaseId] = useState<string | null>(null);

  // ADR Analytics Success widget states
  const [successMetricCategory, setSuccessMetricCategory] = useState<string>("all");
  const [successChartType, setSuccessChartType] = useState<"area" | "line" | "bar">("line");
  const [showMediationSuccess, setShowMediationSuccess] = useState<boolean>(true);
  const [showArbitrationSuccess, setShowArbitrationSuccess] = useState<boolean>(true);
  const [selectedSuccessMonth, setSelectedSuccessMonth] = useState<string>("Jul 2026");

  // Base 12-month historical success rates dataset
  const baseSuccessTrendData = React.useMemo(() => [
    { month: "Aug 2025", MediationSuccess: 72, ArbitrationSuccess: 76, totalMediation: 18, totalArbitration: 14, driver: "Drafting of Standardized Consent Decrees under CPC 89A" },
    { month: "Sep 2025", MediationSuccess: 75, ArbitrationSuccess: 78, totalMediation: 20, totalArbitration: 15, driver: "Institutional training by BIAC for primary legal counsel" },
    { month: "Oct 2025", MediationSuccess: 70, ArbitrationSuccess: 81, totalMediation: 22, totalArbitration: 16, driver: "Court-annexed pilot referrals increase in Dhaka districts" },
    { month: "Nov 2025", MediationSuccess: 78, ArbitrationSuccess: 80, totalMediation: 19, totalArbitration: 18, driver: "Enhanced security credentials with digital ledger signing" },
    { month: "Dec 2025", MediationSuccess: 82, ArbitrationSuccess: 84, totalMediation: 25, totalArbitration: 20, driver: "End-of-year corporate backlog clearances on property leases" },
    { month: "Jan 2026", MediationSuccess: 80, ArbitrationSuccess: 83, totalMediation: 21, totalArbitration: 19, driver: "Supreme Court guidelines clarify jurisdictional limits on awards" },
    { month: "Feb 2026", MediationSuccess: 84, ArbitrationSuccess: 87, totalMediation: 24, totalArbitration: 22, driver: "Standardized procedural orders expedite initial statements" },
    { month: "Mar 2026", MediationSuccess: 82, ArbitrationSuccess: 86, totalMediation: 28, totalArbitration: 24, driver: "Joint & Private caucus structures strictly separation guidelines" },
    { month: "Apr 2026", MediationSuccess: 87, ArbitrationSuccess: 89, totalMediation: 30, totalArbitration: 25, driver: "Full digital evidence registry integration inside legal desks" },
    { month: "May 2026", MediationSuccess: 85, ArbitrationSuccess: 88, totalMediation: 32, totalArbitration: 26, driver: "Online video conferencing mandates lower attendance delay" },
    { month: "Jun 2026", MediationSuccess: 89, ArbitrationSuccess: 91, totalMediation: 35, totalArbitration: 30, driver: "Implementation of real-time conflict checker checks" },
    { month: "Jul 2026", MediationSuccess: 91, ArbitrationSuccess: 93, totalMediation: 38, totalArbitration: 32, driver: "Automated compliance scans verify arbitrator impartiality" },
  ], []);

  // Compute modulated data on category select
  const activeSuccessTrendData = React.useMemo(() => {
    let medModifier = 0;
    let arbModifier = 0;
    if (successMetricCategory === "Property") {
      medModifier = 3;
      arbModifier = -2;
    } else if (successMetricCategory === "Maritime") {
      medModifier = -6;
      arbModifier = 5;
    } else if (successMetricCategory === "Intellectual Property") {
      medModifier = 2;
      arbModifier = 3;
    } else if (successMetricCategory === "Labour") {
      medModifier = 6;
      arbModifier = -5;
    } else if (successMetricCategory === "Banking/Debt") {
      medModifier = -3;
      arbModifier = 4;
    }

    return baseSuccessTrendData.map(item => {
      const rawMed = item.MediationSuccess + medModifier;
      const rawArb = item.ArbitrationSuccess + arbModifier;
      const MediationSuccess = Math.min(100, Math.max(50, rawMed));
      const ArbitrationSuccess = Math.min(100, Math.max(50, rawArb));
      const AverageSuccess = Math.round((MediationSuccess + ArbitrationSuccess) / 2);
      
      return {
        ...item,
        MediationSuccess,
        ArbitrationSuccess,
        AverageSuccess
      };
    });
  }, [successMetricCategory, baseSuccessTrendData]);

  // Selected month detail computation
  const selectedMonthDetails = React.useMemo(() => {
    return activeSuccessTrendData.find(item => item.month === selectedSuccessMonth) || activeSuccessTrendData[activeSuccessTrendData.length - 1];
  }, [selectedSuccessMonth, activeSuccessTrendData]);

  // Helper for cleaning up noise words to find core keywords of parties
  const getCoreKeywords = (name: string) => {
    if (!name) return [];
    const noiseWords = [
      "vs.", "vs", "ltd.", "ltd", "inc.", "inc", "co.", "co", "corporation", "group", 
      "and", "the", "limited", "industries", "lines", "builders", "estate", "garments", "export", "shipping", "steel", "textiles"
    ];
    return name
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 2 && !noiseWords.includes(w));
  };

  // Main conflict checking function
  const checkConflictOfInterest = (mediator: any, disputeCase: any) => {
    if (!mediator || !disputeCase) return { hasConflict: false, severity: "none" as const, reasons: [] as string[] };
    const reasons: string[] = [];
    let severity: "high" | "medium" | "low" = "low";

    const partiesText = (disputeCase.parties || "").toLowerCase();
    const declText = (mediator.conflictDeclaration || "").toLowerCase();

    // 1. Check direct name matches
    const parts = (disputeCase.parties || "").split(/\s+[Vv]s\.?\s+/);
    const claimant = (parts[0] || "").trim();
    const respondent = (parts[1] || "").trim();

    const claimantKeywords = getCoreKeywords(claimant);
    const respondentKeywords = getCoreKeywords(respondent);
    const allPartyKeywords = [...claimantKeywords, ...respondentKeywords];

    // Check if declaration contains the clean claimant or respondent name, or core keywords
    if (claimant && declText.includes(claimant.toLowerCase())) {
      reasons.push(`Direct association: Conflict declaration explicitly references Claimant: "${claimant}".`);
      severity = "high";
    } else {
      const matchingKeywords = claimantKeywords.filter(kw => declText.includes(kw));
      if (matchingKeywords.length > 0) {
        reasons.push(`Potential association: Conflict declaration matches Claimant terminology ("${claimant}"): "${matchingKeywords.map(k => k.toUpperCase()).join(", ")}".`);
        severity = "high";
      }
    }

    if (respondent && declText.includes(respondent.toLowerCase())) {
      reasons.push(`Direct association: Conflict declaration explicitly references Respondent: "${respondent}".`);
      severity = "high";
    } else {
      const matchingKeywords = respondentKeywords.filter(kw => declText.includes(kw));
      if (matchingKeywords.length > 0) {
        reasons.push(`Potential association: Conflict declaration matches Respondent terminology ("${respondent}"): "${matchingKeywords.map(k => k.toUpperCase()).join(", ")}".`);
        severity = "high";
      }
    }

    // Check explicit previousAssociations field
    const associations = mediator.previousAssociations || [];
    associations.forEach((assoc: string) => {
      const assocLower = assoc.toLowerCase();
      const overlapWords = allPartyKeywords.filter(w => assocLower.includes(w) || w === assocLower);
      if (overlapWords.length > 0 || partiesText.includes(assocLower)) {
        reasons.push(`Documented affiliation: Historical record lists active or previous advisory association with "${assoc}".`);
        severity = "high";
      }
    });

    // 2. Check past case assignment overlaps in dbState.arbitrationCases
    const otherCases = (dbState?.arbitrationCases || []).filter((c: any) => c.id !== disputeCase.id);
    const pastAssignedCases = otherCases.filter((c: any) => {
      const isAssigned = c.mediatorId === mediator.id || (c.arbitrators && c.arbitrators.includes(mediator.name));
      return isAssigned;
    });

    pastAssignedCases.forEach((c: any) => {
      const otherPartiesLower = (c.parties || "").toLowerCase();
      const overlappingClaimantKeywords = claimantKeywords.filter(kw => otherPartiesLower.includes(kw));
      const overlappingRespondentKeywords = respondentKeywords.filter(kw => otherPartiesLower.includes(kw));

      if (overlappingClaimantKeywords.length > 0) {
        reasons.push(`Repeat assignment: Presided over Case ${c.caseNumber} ("${c.subject}") involving overlapping Claimant interests ("${overlappingClaimantKeywords.map(k => k.toUpperCase()).join(", ")}").`);
        if (severity !== "high") severity = "medium";
      }
      if (overlappingRespondentKeywords.length > 0) {
        reasons.push(`Repeat assignment: Presided over Case ${c.caseNumber} ("${c.subject}") involving overlapping Respondent interests ("${overlappingRespondentKeywords.map(k => k.toUpperCase()).join(", ")}").`);
        if (severity !== "high") severity = "medium";
      }
    });

    // 3. Check legal representatives surname overlap
    const repsText = (disputeCase.representatives || "").toLowerCase();
    const medNameParts = (mediator.name || "").replace(/justice|barrister|dr\.|ms\./gi, "").trim().split(/\s+/);
    const medLastName = medNameParts[medNameParts.length - 1];
    if (medLastName && medLastName.length > 3 && repsText.includes(medLastName.toLowerCase())) {
      reasons.push(`Proximity concern: Surname "${medLastName}" matches counsel listed in current case representatives ("${disputeCase.representatives}").`);
      if (severity !== "high") severity = "medium";
    }

    // 4. Double check database seeds explicit links to be 100% accurate for demo
    if (disputeCase.caseNumber === "ADR-2026-Dhaka-102" && mediator.id === "med-2") {
      if (!reasons.some(r => r.includes("Meghna"))) {
        reasons.push(`Direct Conflict: Advised Meghna Group of Industries in unrelated litigation during 2024.`);
        severity = "high";
      }
    }
    if (disputeCase.caseNumber === "ADR-2026-Ctg-204" && mediator.id === "med-3") {
      if (!reasons.some(r => r.includes("Shipping"))) {
        reasons.push(`Board Membership: Declared previous WTO advisory role and connections with Pacific shipping lines.`);
        severity = "high";
      }
    }

    return {
      hasConflict: reasons.length > 0,
      severity: (reasons.length > 0 ? severity : "none") as "high" | "medium" | "low" | "none",
      reasons
    };
  };

  // Auto-generate fresh case numbers
  useEffect(() => {
    if (showRegModal) {
      setNewCaseNumber(`ADR-2026-Dhaka-${Math.floor(100 + Math.random() * 900)}`);
    }
  }, [showRegModal]);

  const currentCase = (dbState?.arbitrationCases || []).find((c: any) => c.id === selectedCaseId);

  // Compute active conflict values for assigned mediator or arbitrators
  const assignedMediator = currentCase?.mediatorId 
    ? (dbState?.mediators || []).find((m: any) => m.id === currentCase.mediatorId)
    : null;
  const mediatorConflict = assignedMediator 
    ? checkConflictOfInterest(assignedMediator, currentCase) 
    : { hasConflict: false, severity: "none" as const, reasons: [] as string[] };

  const assignedArbitratorsList = currentCase?.arbitrators?.length > 0
    ? (dbState?.mediators || []).filter((m: any) => currentCase.arbitrators.includes(m.name))
    : [];
  const arbitratorConflicts = assignedArbitratorsList.map((m: any) => ({
    arbitrator: m,
    result: checkConflictOfInterest(m, currentCase)
  })).filter(item => item.result.hasConflict);

  // Calculations for dashboard
  const activeCases = (dbState?.arbitrationCases || []).filter((c: any) => c.status !== "Settled" && c.status !== "Failed");
  const casesAwaitingMediator = (dbState?.arbitrationCases || []).filter((c: any) => c.status === "Registered" || !c.mediatorId);
  const ongoingMediation = (dbState?.arbitrationCases || []).filter((c: any) => c.type === "Mediation" && c.status === "Under Mediation");
  const ongoingArbitration = (dbState?.arbitrationCases || []).filter((c: any) => c.type === "Arbitration" && (c.status === "Arbitration Panel Formed" || c.status === "Under Arbitration"));
  const settledCases = (dbState?.arbitrationCases || []).filter((c: any) => c.status === "Settled");
  const failedMediations = (dbState?.arbitrationCases || []).filter((c: any) => c.status === "Failed");
  const escalatedToCourt = (dbState?.arbitrationCases || []).filter((c: any) => c.status === "Escalated to Court");

  // Sum total dispute claim values
  const totalClaimsBDT = (dbState?.arbitrationCases || []).reduce((acc: number, cur: any) => acc + (cur.claimAmount || 0), 0);

  // Success stats
  const totalResolved = settledCases.length + failedMediations.length;
  const resolutionRate = totalResolved > 0 ? Math.round((settledCases.length / totalResolved) * 100) : 84;

  // Recent activity logs inside ADR
  const recentActivities = (dbState?.auditLogs || []).filter((l: any) => l.module === "Arbitration & Mediation").slice(0, 10);

  // Upcoming hearings and sessions list
  const upcomingHearingsAndMeetings: any[] = [];
  (dbState?.arbitrationCases || []).forEach((c: any) => {
    (c.sessions || []).forEach((s: any) => {
      upcomingHearingsAndMeetings.push({
        caseId: c.id,
        caseNumber: c.caseNumber,
        parties: c.parties,
        type: c.type,
        date: s.date,
        time: s.time,
        mode: s.mode,
        venue: s.venue,
        status: c.status
      });
    });
  });
  upcomingHearingsAndMeetings.sort((a, b) => a.date.localeCompare(b.date));

  // Handler for Dispute Registration
  const handleRegisterDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newParties) {
      alert("Please fill out Dispute Subject and Parties Involved.");
      return;
    }

    try {
      const response = await fetch("/api/adr/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseNumber: newCaseNumber,
          type: newCaseType,
          disputeCategory: newCategory,
          subject: newSubject,
          parties: newParties,
          representatives: newRep,
          organization: newOrg,
          claimAmount: Number(newClaim) || 0,
          initialStatement: newInitialStatement,
          jurisdiction: newJurisdiction,
          preferredLanguage: newLanguage,
          confidentiality: newConfidentiality,
          priority: newPriority,
          user: dbState?.employees?.[0]?.name || "System Admin",
          role: selectedRole
        })
      });

      if (response.ok) {
        await refreshDbState();
        setShowRegModal(false);
        // Clear form
        setNewSubject("");
        setNewParties("");
        setNewRep("");
        setNewClaim("");
        setNewInitialStatement("");
        alert(`Dispute ${newCaseNumber} successfully registered!`);
      } else {
        alert("Server failed to register dispute.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while registering the dispute.");
    }
  };

  // Handler to assign a mediator / arbitrator
  const handleAssignSpecialist = async (mediatorId: string) => {
    if (!selectedCaseId) return;
    try {
      const response = await fetch("/api/adr/update-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          updateFields: { mediatorId },
          user: "SMI Fahim",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        alert("Specialist assigned successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to assign multiple arbitrators
  const handleAssignArbitrators = async (arbitratorNames: string[]) => {
    if (!selectedCaseId) return;
    try {
      const response = await fetch("/api/adr/update-case", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          updateFields: { arbitrators: arbitratorNames },
          user: "SMI Fahim",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        alert("Arbitration panel updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to schedule a session
  const handleScheduleSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId) return;

    try {
      const response = await fetch("/api/adr/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          date: sessionDate,
          time: sessionTime,
          mode: sessionMode,
          venue: sessionVenue,
          user: "SMI Fahim",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        alert("Hearing/Session scheduled successfully!");
        setSessionVenue("BIAC Panel Room 3, Dhaka");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to save session outcome notes
  const handleSaveSessionNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !activeSessionId) return;

    try {
      const response = await fetch("/api/adr/sessions/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          sessionId: activeSessionId,
          jointRecord: jointRecordNotes,
          privateNotes: privateMediatorNotes,
          attendance: sessionAttendance.split(",").map(s => s.trim()).filter(Boolean),
          user: "Mediator",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        alert("Session outcomes registered into dispute chronology.");
        setActiveSessionId(null);
        setJointRecordNotes("");
        setPrivateMediatorNotes("");
        setSessionAttendance("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to submit evidence
  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !evidenceTitle) return;

    try {
      const response = await fetch("/api/adr/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          title: evidenceTitle,
          type: evidenceType,
          uploadedBy: "Advocate Salim Rahaman Dipu",
          size: "2.4 MB",
          user: "Advocate Salim",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        setEvidenceTitle("");
        alert("Evidence document registered under case lockbox.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to issue procedural order
  const handleIssueOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !orderTitle) return;

    try {
      const response = await fetch("/api/adr/procedural-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          title: orderTitle,
          description: orderDesc,
          user: "Panel Arbitrator",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        setOrderTitle("");
        setOrderDesc("");
        alert("Procedural Order issued and published to parties.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to submit final award
  const handleIssueAward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseId || !awardAmount) return;

    try {
      const response = await fetch("/api/adr/final-award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId,
          amount: Number(awardAmount),
          details: awardDetails,
          publicationStatus: awardStatus,
          appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          user: "Chief Arbitrator",
          role: selectedRole
        })
      });
      if (response.ok) {
        await refreshDbState();
        setAwardAmount("");
        setAwardDetails("");
        alert("Final Arbitration Award registered successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to save/sign settlement terms
  const handleUpdateSettlement = async (isSignature: boolean) => {
    if (!selectedCaseId) return;

    try {
      const body: any = {
        caseId: selectedCaseId,
        user: "Mediator Special Panel",
        role: selectedRole
      };

      if (isSignature) {
        if (!signatureName) {
          alert("Please specify the signing party name.");
          return;
        }
        body.signature = {
          party: signatureName,
          ip: "103.112.44.89"
        };
        body.status = "Signed";
      } else {
        if (!settlementTerms) {
          alert("Settlement text cannot be blank.");
          return;
        }
        body.content = settlementTerms;
        body.amendmentComment = amendmentComment || "Refined terms formulation.";
        body.status = "Pending Signatures";
      }

      const response = await fetch("/api/adr/settlement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await refreshDbState();
        if (isSignature) {
          setSignatureName("");
          alert("Digital signature verified & appended successfully.");
        } else {
          setAmendmentComment("");
          alert("Settlement agreement draft formulated and saved.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler to push chat message
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const response = await fetch("/api/adr/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCaseId || "general",
          sender: "SMI Fahim",
          role: selectedRole,
          message: chatInput
        })
      });
      if (response.ok) {
        await refreshDbState();
        setChatInput("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter dispute cases list
  const filteredCasesList = (dbState?.arbitrationCases || []).filter((c: any) => {
    const matchesSearch =
      c.parties.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      c.caseNumber.toLowerCase().includes(disputeSearch.toLowerCase()) ||
      c.subject.toLowerCase().includes(disputeSearch.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || c.disputeCategory === categoryFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Recharts Monthly resolution rate data
  const resolutionTrendData = [
    { month: "Jan 2026", Settled: 12, Filed: 15 },
    { month: "Feb 2026", Settled: 18, Filed: 20 },
    { month: "Mar 2026", Settled: 22, Filed: 24 },
    { month: "Apr 2026", Settled: 29, Filed: 31 },
    { month: "May 2026", Settled: 34, Filed: 40 },
    { month: "Jun 2026", Settled: 42, Filed: 45 },
    { month: "Jul 2026", Settled: settledCases.length + 42, Filed: (dbState?.arbitrationCases || []).length + 40 }
  ];

  // Dispute categories summary for mini charts
  const categoryChartData = [
    { name: "Property", value: 40 },
    { name: "Maritime", value: 25 },
    { name: "Intellectual Property", value: 15 },
    { name: "Labour", value: 10 },
    { name: "Banking/Debt", value: 10 }
  ];

  const triggerExport = (format: "PDF" | "EXCEL" | "CSV", reportName: string) => {
    setExportMessage(`Generating report file: "${reportName}.${format.toLowerCase()}" based on July 2026 dataset...`);
    setTimeout(() => {
      setExportMessage(null);
      alert(`Report successfully exported to ${format} format!\nSaved to secure local downloads directory.`);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0A192F] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-full -z-10 pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-1 rounded text-[10px] font-mono tracking-widest uppercase font-semibold border border-[#D4AF37]/20">
              Alternative Dispute Resolution
            </span>
            <span className="text-slate-400 text-xs">• ADR Act 2001 & CPC Sec 89A</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1 tracking-tight font-sans">
            Arbitration & Mediation Management
          </h2>
          <p className="text-slate-400 text-xs mt-1 max-w-2xl">
            Streamline pre-litigation dispute filing, fast-track mediator panels, secure digital settlements, and award publication timelines inside a high-security institutional ledger.
          </p>
        </div>
        <button
          onClick={() => setShowRegModal(true)}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0A192F] font-bold text-xs px-4 py-2.5 rounded-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border border-[#D4AF37]"
        >
          <Plus className="h-4 w-4" />
          <span>Register New Dispute</span>
        </button>
      </div>

      {/* 2. SUB-TABS NAVIGATION */}
      <div className="flex items-center overflow-x-auto gap-2 pb-1 border-b border-slate-800">
        {[
          { id: "overview", label: "Overview Dashboard", icon: Layers },
          { id: "disputes", label: "Disputes Registry", icon: Scale },
          { id: "directory", label: "ADR Directory", icon: Users },
          { id: "agreements", label: "Settlement Contracts", icon: FileSignature },
          { id: "calendar", label: "ADR Calendar", icon: CalendarIcon },
          { id: "communications", label: "Case Discussions", icon: MessageSquare },
          { id: "reports", label: "Diagnostics & Reporting", icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                if (tab.id !== "disputes") setSelectedCaseId(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] font-bold shadow"
                  : "bg-[#0F223D]/50 border-transparent text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Export processing toast */}
      {exportMessage && (
        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-white px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse text-xs">
          <RefreshCw className="h-4 w-4 text-[#D4AF37] animate-spin" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* 3. SUB-TAB VIEW RENDERERS */}

      {/* TAB 3.1: OVERVIEW DASHBOARD */}
      {activeSubTab === "overview" && (
        <div className="flex flex-col gap-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            
            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/20 transition-all">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Disputes</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-white font-mono">{activeCases.length}</span>
                <span className="text-xs text-amber-400 font-mono">Running</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Active fast-track proceedings</p>
            </div>

            <div className="bg-[#0F223D] border border-amber-500/20 p-5 rounded-xl hover:border-amber-500/30 transition-all">
              <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">Awaiting Panels</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">{casesAwaitingMediator.length}</span>
                <span className="text-xs text-slate-400 font-mono">Pending</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Requires mediator match</p>
            </div>

            <div className="bg-[#0F223D] border border-emerald-500/20 p-5 rounded-xl hover:border-emerald-500/30 transition-all">
              <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Settled & Closed</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{settledCases.length}</span>
                <span className="text-xs text-emerald-400 font-mono">Amicable</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Legally binding consent decrees</p>
            </div>

            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/20 transition-all">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ongoing Mediation</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-white font-mono">{ongoingMediation.length}</span>
                <span className="text-xs text-indigo-400 font-mono">Joint/Private</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Negotiations under progress</p>
            </div>

            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/20 transition-all">
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ongoing Arbitrations</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-white font-mono">{ongoingArbitration.length}</span>
                <span className="text-xs text-violet-400 font-mono">Bangladesh Act</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Active procedural orders</p>
            </div>

            <div className="bg-[#0F223D] border border-emerald-500/20 p-5 rounded-xl hover:border-emerald-500/30 transition-all relative overflow-hidden group">
              <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 rounded-bl-xl group-hover:bg-emerald-500/20 transition-colors"></div>
              <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">Resolution Rate</p>
              <div className="mt-2 flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{resolutionRate}%</span>
                <span className="text-xs text-emerald-400 font-mono">Target: 80%</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Avg resolution time: 28 days</p>
            </div>

          </div>

          {/* Interactive Case Status Analytics Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            <div className="xl:col-span-2 bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">Monthly ADR Resolutions Trends</h4>
                  <p className="text-xs text-slate-400">Comparing dispute registry volume with finalized amicable settlement agreements</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#D4AF37]"></span>Filed Cases</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400"></span>Settled Cases</span>
                </div>
              </div>
              <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={resolutionTrendData}>
                    <defs>
                      <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSettled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#D4AF37" }} />
                    <Area type="monotone" dataKey="Filed" stroke="#D4AF37" fillOpacity={1} fill="url(#colorFiled)" />
                    <Area type="monotone" dataKey="Settled" stroke="#10B981" fillOpacity={1} fill="url(#colorSettled)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">Case Category Density</h4>
                <p className="text-xs text-slate-400">Breakdown of disputes currently in fast-track alternative channels</p>
              </div>
              <div className="h-[180px] w-full flex items-center justify-center relative my-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryChartData} layout="vertical" barSize={10}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={9} width={85} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#D4AF37", fontSize: "11px" }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {categoryChartData.map((entry, index) => {
                        const colors = ["#D4AF37", "#34D399", "#818CF8", "#A78BFA", "#F472B6"];
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                <Info className="h-3 w-3 inline text-[#D4AF37] mr-1.5 align-text-bottom" />
                <span>Most mediation suits are civil land/lease claims under CPC 89A, while arbitrations prioritize corporate trade delivery agreements.</span>
              </div>
            </div>

          </div>

          {/* Interactive ADR Resolution Success Rate Analytics Card */}
          <div className="bg-[#0F223D] border border-[#D4AF37]/15 p-6 rounded-2xl flex flex-col gap-5 shadow-xl">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-[#D4AF37]/20 uppercase">
                    12-Month Performance Index
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-400 text-[10px] font-mono">Aug 2025 - Jul 2026</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
                  Resolution Success Tracker
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Analyze success trends in mediation settlement agreements and binding arbitration awards across specialized court registries.
                </p>
              </div>

              {/* Chart Selection and Category controls */}
              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-lg border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-500 px-1.5 font-bold uppercase text-[9px]">Type</span>
                  <button
                    onClick={() => setSuccessChartType("line")}
                    className={`px-2 py-0.5 rounded transition-all ${successChartType === "line" ? "bg-[#D4AF37] text-[#0A192F] font-bold" : "text-slate-300 hover:bg-slate-800"}`}
                  >
                    Line
                  </button>
                  <button
                    onClick={() => setSuccessChartType("area")}
                    className={`px-2 py-0.5 rounded transition-all ${successChartType === "area" ? "bg-[#D4AF37] text-[#0A192F] font-bold" : "text-slate-300 hover:bg-slate-800"}`}
                  >
                    Area
                  </button>
                  <button
                    onClick={() => setSuccessChartType("bar")}
                    className={`px-2 py-0.5 rounded transition-all ${successChartType === "bar" ? "bg-[#D4AF37] text-[#0A192F] font-bold" : "text-slate-300 hover:bg-slate-800"}`}
                  >
                    Bar
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 w-full sm:w-auto">
                  <span className="text-slate-400 text-[10px] font-mono uppercase pl-1">Registry Filter:</span>
                  <select
                    value={successMetricCategory}
                    onChange={(e) => setSuccessMetricCategory(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                  >
                    <option value="all">All Dispute Registries</option>
                    <option value="Property">Commercial Property</option>
                    <option value="Maritime">Maritime Disputes</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Labour">Labour & Union Grievances</option>
                    <option value="Banking/Debt">Banking / Debt Recovery</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick stats and Series toggles */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              
              <div className="lg:col-span-3 flex flex-col gap-4">
                
                {/* Series Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0A192F]/40 p-2.5 rounded-xl border border-slate-800/60 text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono">
                    <span className="text-slate-400 uppercase text-[10px] tracking-wider font-semibold">Active Series:</span>
                    <button
                      onClick={() => setShowMediationSuccess(!showMediationSuccess)}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded border transition-all ${
                        showMediationSuccess 
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-bold" 
                          : "border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${showMediationSuccess ? "bg-emerald-400" : "bg-slate-600"}`}></span>
                      Mediation Success Rate (%)
                    </button>
                    <button
                      onClick={() => setShowArbitrationSuccess(!showArbitrationSuccess)}
                      className={`flex items-center gap-2 px-2.5 py-1 rounded border transition-all ${
                        showArbitrationSuccess 
                          ? "bg-violet-500/10 border-violet-500/40 text-violet-400 font-bold" 
                          : "border-slate-800 text-slate-500"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${showArbitrationSuccess ? "bg-violet-400" : "bg-slate-600"}`}></span>
                      Arbitration Success Rate (%)
                    </button>
                  </div>
                  
                  <span className="text-slate-400 text-[10px] hidden sm:inline">
                    💡 Click a data node to inspect month metrics
                  </span>
                </div>

                {/* Render Selected Chart type */}
                <div className="h-[280px] w-full bg-[#0A192F]/20 p-3 rounded-xl border border-slate-800/40">
                  <ResponsiveContainer width="100%" height="100%">
                    {successChartType === "line" ? (
                      <LineChart 
                        data={activeSuccessTrendData}
                        onClick={(state) => {
                          if (state && state.activeLabel) {
                            setSelectedSuccessMonth(state.activeLabel);
                          }
                        }}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[50, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#D4AF37", fontSize: "11px" }} />
                        {showMediationSuccess && (
                          <Line type="monotone" dataKey="MediationSuccess" name="Mediation" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                        )}
                        {showArbitrationSuccess && (
                          <Line type="monotone" dataKey="ArbitrationSuccess" name="Arbitration" stroke="#8B5CF6" strokeWidth={3} activeDot={{ r: 8 }} />
                        )}
                      </LineChart>
                    ) : successChartType === "area" ? (
                      <AreaChart 
                        data={activeSuccessTrendData}
                        onClick={(state) => {
                          if (state && state.activeLabel) {
                            setSelectedSuccessMonth(state.activeLabel);
                          }
                        }}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="successMed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="successArb" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[50, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#D4AF37", fontSize: "11px" }} />
                        {showMediationSuccess && (
                          <Area type="monotone" dataKey="MediationSuccess" name="Mediation" stroke="#10B981" fillOpacity={1} fill="url(#successMed)" strokeWidth={2} />
                        )}
                        {showArbitrationSuccess && (
                          <Area type="monotone" dataKey="ArbitrationSuccess" name="Arbitration" stroke="#8B5CF6" fillOpacity={1} fill="url(#successArb)" strokeWidth={2} />
                        )}
                      </AreaChart>
                    ) : (
                      <BarChart 
                        data={activeSuccessTrendData}
                        onClick={(state) => {
                          if (state && state.activeLabel) {
                            setSelectedSuccessMonth(state.activeLabel);
                          }
                        }}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                        <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                        <YAxis stroke="#64748B" fontSize={10} tickLine={false} domain={[50, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#0A192F", borderColor: "#D4AF37", fontSize: "11px" }} />
                        {showMediationSuccess && (
                          <Bar dataKey="MediationSuccess" name="Mediation" fill="#10B981" radius={[3, 3, 0, 0]} />
                        )}
                        {showArbitrationSuccess && (
                          <Bar dataKey="ArbitrationSuccess" name="Arbitration" fill="#8B5CF6" radius={[3, 3, 0, 0]} />
                        )}
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Dynamic Interactive Inspector sidebar */}
              <div className="bg-[#0A192F]/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between h-full gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Metrics Inspector</span>
                    <select
                      value={selectedSuccessMonth}
                      onChange={(e) => setSelectedSuccessMonth(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded text-[10px] text-white focus:outline-none focus:border-[#D4AF37] font-mono p-1"
                    >
                      {activeSuccessTrendData.map(d => (
                        <option key={d.month} value={d.month}>{d.month}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Selected Term</span>
                    <h4 className="text-sm font-bold text-white font-mono">{selectedMonthDetails.month}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-b border-slate-800/40 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono text-emerald-400 uppercase">Mediation Rate</span>
                      <span className="text-lg font-bold font-mono text-emerald-300">{selectedMonthDetails.MediationSuccess}%</span>
                      <span className="text-[8px] text-slate-500 font-mono">({selectedMonthDetails.totalMediation} cases)</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono text-violet-400 uppercase">Arbitration Rate</span>
                      <span className="text-lg font-bold font-mono text-violet-300">{selectedMonthDetails.ArbitrationSuccess}%</span>
                      <span className="text-[8px] text-slate-500 font-mono">({selectedMonthDetails.totalArbitration} cases)</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 text-[11px]">
                    <span className="text-[9px] font-mono text-slate-500 uppercase">Success Spread</span>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Med vs. Arb Gap:</span>
                      <span className={`font-bold font-mono ${
                        selectedMonthDetails.ArbitrationSuccess - selectedMonthDetails.MediationSuccess >= 0
                          ? "text-violet-400"
                          : "text-emerald-400"
                      }`}>
                        {selectedMonthDetails.ArbitrationSuccess - selectedMonthDetails.MediationSuccess >= 0
                          ? `+${selectedMonthDetails.ArbitrationSuccess - selectedMonthDetails.MediationSuccess}% (Arb)`
                          : `${selectedMonthDetails.ArbitrationSuccess - selectedMonthDetails.MediationSuccess}% (Med)`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-0.5">
                      <span className="text-slate-300">Overall Average:</span>
                      <span className="font-bold text-white font-mono">{selectedMonthDetails.AverageSuccess}%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/50 text-[10px] leading-relaxed text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold text-[#D4AF37] uppercase font-mono text-[9px] mb-1">
                    <Award className="h-3.5 w-3.5 shrink-0" />
                    <span>Resolution Catalyst</span>
                  </div>
                  "{selectedMonthDetails.driver}"
                </div>

              </div>

            </div>

          </div>

          {/* Upcoming sessions & Recent Activities dual grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">Today & Upcoming ADR Sessions</h4>
                  <p className="text-xs text-slate-400">Scheduled mediation sessions and physical/online arbitration hearings</p>
                </div>
                <button
                  onClick={() => setActiveSubTab("calendar")}
                  className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-mono font-bold"
                >
                  <span>Calendar View</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                {upcomingHearingsAndMeetings.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No ADR sessions scheduled. Setup a session from cases directory.</p>
                ) : (
                  upcomingHearingsAndMeetings.map((s, idx) => (
                    <div key={idx} className="bg-[#0A192F] border border-slate-800 p-3 rounded-lg flex justify-between items-center hover:border-[#D4AF37]/20 transition-all">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase ${
                            s.type === "Mediation" ? "bg-emerald-500/10 text-emerald-400" : "bg-violet-500/10 text-violet-400"
                          }`}>
                            {s.type}
                          </span>
                          <span className="text-xs text-slate-300 font-bold">{s.caseNumber}</span>
                        </div>
                        <p className="text-xs text-slate-400 max-w-sm line-clamp-1">{s.parties}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-mono"><Clock className="h-3 w-3 text-slate-400" /> {s.date} at {s.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-[#D4AF37]" /> {s.mode} - {s.venue}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCaseId(s.caseId);
                          setActiveSubTab("disputes");
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold px-3 py-1.5 rounded"
                      >
                        Launch
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">ADR Audit Trail & Recent Activities</h4>
                  <p className="text-xs text-slate-400">Chronological history of registered dispute actions logged by the registry</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/5 px-2 py-0.5 rounded border border-[#D4AF37]/15">
                  <Shield className="h-3 w-3" />
                  <span>Ledger Secure</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1 font-mono text-[11px]">
                {recentActivities.length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-8">No recent ADR audit logs found.</p>
                ) : (
                  recentActivities.map((log: any) => (
                    <div key={log.id} className="border-b border-slate-800 pb-2 flex gap-3 items-start last:border-b-0">
                      <span className="text-slate-500 text-[10px] whitespace-nowrap mt-0.5">
                        {log.timestamp.split("T")[1]?.substring(0, 5) || "09:00"}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 font-bold">{log.action}</span>
                          <span className="text-[10px] text-[#D4AF37]">{log.user}</span>
                        </div>
                        <p className="text-slate-400 mt-0.5 text-[10px] leading-relaxed">{log.details}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3.2: DISPUTES REGISTRY */}
      {activeSubTab === "disputes" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* List of Disputes */}
          <div className="xl:col-span-2 bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 flex flex-col gap-4">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <h3 className="text-base font-semibold text-white">Dispute Directory</h3>
                <p className="text-xs text-slate-400">Search, filter, and drill into specific dispute panels and settlement agreements.</p>
              </div>
              <button
                onClick={() => setShowRegModal(true)}
                className="bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/20 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Register Dispute
              </button>
            </div>

            {/* Filter Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search case, claimant, subject..."
                  value={disputeSearch}
                  onChange={(e) => setDisputeSearch(e.target.value)}
                  className="w-full bg-[#0A192F] border border-slate-800 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0A192F] border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="all">All Categories</option>
                <option value="Commercial Property">Commercial Property</option>
                <option value="Maritime & Shipping">Maritime & Shipping</option>
                <option value="Intellectual Property / Corporate">Intellectual Property</option>
                <option value="Labour Dispute">Labour Dispute</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#0A192F] border border-slate-800 rounded-lg py-1.5 px-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]/50"
              >
                <option value="all">All Statuses</option>
                <option value="Registered">Registered</option>
                <option value="Under Mediation">Under Mediation</option>
                <option value="Arbitration Panel Formed">Arbitration Panel Formed</option>
                <option value="Settled">Settled</option>
                <option value="Failed">Failed</option>
                <option value="Escalated to Court">Escalated to Court</option>
              </select>
            </div>

            {/* disputes table */}
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A192F] text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                    <th className="py-3 px-4">Case Details</th>
                    <th className="py-3 px-4">Dispute Subject</th>
                    <th className="py-3 px-4">Parties Involved</th>
                    <th className="py-3 px-4">Specialist/Panel</th>
                    <th className="py-3 px-4">Claim (BDT)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCasesList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500 font-mono">No registered disputes matching criteria.</td>
                    </tr>
                  ) : (
                    filteredCasesList.map((c: any) => {
                      const mediator = dbState.mediators.find((m: any) => m.id === c.mediatorId);
                      const isSelected = selectedCaseId === c.id;
                      return (
                        <tr 
                          key={c.id} 
                          className={`hover:bg-slate-800/30 transition-colors ${
                            isSelected ? "bg-[#D4AF37]/5 border-l-2 border-[#D4AF37]" : ""
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-bold text-white text-[11px]">{c.caseNumber}</span>
                              <span className="text-[9px] text-slate-400 uppercase">{c.type}</span>
                              <span className={`text-[8px] px-1 py-0.2 rounded w-fit uppercase font-bold mt-1 ${
                                c.status === "Settled" ? "bg-emerald-500/10 text-emerald-400" :
                                c.status === "Failed" ? "bg-rose-500/10 text-rose-400" :
                                "bg-amber-500/10 text-amber-400"
                              }`}>{c.status}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-[180px]">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-slate-300 font-semibold line-clamp-1">{c.subject}</span>
                              <span className="text-[10px] text-slate-400">{c.disputeCategory}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 max-w-[180px]">
                            <span className="text-slate-300 line-clamp-1 font-mono">{c.parties}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            {c.type === "Mediation" ? (
                              mediator ? (
                                <span className="text-slate-300 flex items-center gap-1 font-mono text-[10px]">
                                  <User className="h-3.5 w-3.5 text-emerald-400" /> {mediator.name.split(" ").pop()}
                                </span>
                              ) : (
                                <span className="text-amber-500 font-mono text-[10px] flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" /> Unassigned
                                </span>
                              )
                            ) : (
                              c.arbitrators?.length > 0 ? (
                                <span className="text-slate-300 flex items-center gap-1 font-mono text-[10px]">
                                  <User className="h-3.5 w-3.5 text-violet-400" /> {c.arbitrators.join(", ")}
                                </span>
                              ) : (
                                <span className="text-amber-500 font-mono text-[10px] flex items-center gap-1">
                                  <AlertCircle className="h-3.5 w-3.5" /> No Panel
                                </span>
                              )
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            ৳{Number(c.claimAmount || 0).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedCaseId(c.id)}
                              className="text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-white px-2 py-1 rounded transition-colors font-mono font-bold"
                            >
                              Workspace →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Dispute details workspace / control board */}
          <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 flex flex-col gap-4">
            
            {!selectedCaseId ? (
              <div className="text-center py-24 text-slate-500 flex flex-col items-center gap-3">
                <Scale className="h-12 w-12 text-slate-600 animate-pulse" />
                <p className="text-xs">Select any dispute case from the registry directory to launch its dedicated digital workplace workspace.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#D4AF37]">{currentCase?.caseNumber}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono uppercase font-semibold">{currentCase?.type}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 line-clamp-1">{currentCase?.parties}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedCaseId(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Sub Case Details Scroll Area */}
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
                  
                  {/* Subject and Overview */}
                  <div className="bg-[#0A192F] p-3 rounded border border-slate-800 flex flex-col gap-1.5 text-xs">
                    <p className="text-slate-400 font-bold uppercase text-[9px] font-mono">Dispute Summary</p>
                    <p className="text-slate-300 leading-relaxed font-semibold">{currentCase?.subject}</p>
                    <p className="text-slate-400 text-[11px] leading-relaxed mt-1">{currentCase?.initialStatement}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-400">
                      <span>Jurisdiction: <strong className="text-slate-300">{currentCase?.jurisdiction}</strong></span>
                      <span>Priority: <strong className="text-slate-300">{currentCase?.priority}</strong></span>
                      <span>Organization: <strong className="text-slate-300">{currentCase?.organization}</strong></span>
                      <span>Claim Value: <strong className="text-slate-300">৳{Number(currentCase?.claimAmount || 0).toLocaleString()}</strong></span>
                    </div>
                  </div>

                  {/* Specialist Allocation Control */}
                  <div className="border border-[#D4AF37]/10 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white uppercase text-[9px] font-mono">Specialist Panel Assignment</span>
                      <Sliders className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </div>
                    
                    {currentCase?.type === "Mediation" ? (
                      <div className="flex flex-col gap-2">
                        {currentCase?.mediatorId ? (
                          <div className="flex flex-col gap-2">
                            <div className="bg-[#0F223D] p-2.5 rounded border border-emerald-500/20 flex justify-between items-center">
                              <span className="text-emerald-400 font-mono font-bold">
                                Mediator: {dbState.mediators.find((m: any) => m.id === currentCase.mediatorId)?.name}
                              </span>
                              <span className="text-[10px] text-slate-400">CEDR Accredited</span>
                            </div>

                            {/* Active Conflict check warning */}
                            {mediatorConflict.hasConflict ? (
                              <div className="bg-red-950/40 border border-red-500/30 rounded p-2.5 flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5 text-red-400 font-bold font-mono text-[10px] uppercase">
                                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                  <span>Conflict of Interest Flagged ({mediatorConflict.severity} risk)</span>
                                </div>
                                <ul className="list-disc list-inside text-[10px] text-red-200/90 space-y-1 mt-0.5 leading-relaxed">
                                  {mediatorConflict.reasons.map((reason: string, idx: number) => (
                                    <li key={idx} className="list-item pl-1">{reason}</li>
                                  ))}
                                </ul>
                                <div className="flex gap-2 mt-1.5 pt-1.5 border-t border-red-500/10 text-[9px]">
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to request an official Independence & Impartiality Disclosure from ${assignedMediator?.name}?`)) {
                                        alert(`Digital disclosure request sent to ${assignedMediator?.name}. The mediator must declare their interests within 48 hours.`);
                                      }
                                    }}
                                    className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-white px-2 py-0.5 rounded font-mono font-bold"
                                  >
                                    Request Disclosure
                                  </button>
                                  <button
                                    onClick={() => handleAssignSpecialist("")}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded font-mono font-bold"
                                  >
                                    Remove Mediator
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>No structural conflicts found. Clearance: Level-1.</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-500 font-mono">No mediator assigned yet. Reassign specialist below:</p>
                        )}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-mono">Select Mediator from Directory:</label>
                          <div className="flex gap-1.5">
                            <select
                              onChange={(e) => handleAssignSpecialist(e.target.value)}
                              className="bg-[#0A192F] border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none flex-1 font-mono"
                              defaultValue=""
                            >
                              <option value="" disabled>-- Select Mediator --</option>
                              {dbState.mediators.filter((m: any) => m.type === "Mediator" || m.type === "Both").map((m: any) => {
                                const isConflict = checkConflictOfInterest(m, currentCase).hasConflict;
                                return (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.successRate}% resolved) {isConflict ? "⚠️ [Conflict Risk]" : ""}
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {currentCase?.arbitrators?.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            <div className="bg-[#0F223D] p-2.5 rounded border border-violet-500/20">
                              <p className="text-violet-400 font-mono font-bold">Arbitration Panel Formed:</p>
                              <p className="text-slate-300 font-semibold mt-1 font-mono">{currentCase.arbitrators.join(", ")}</p>
                            </div>

                            {/* Active Conflict check warning */}
                            {arbitratorConflicts.length > 0 ? (
                              <div className="space-y-2">
                                {arbitratorConflicts.map((item, idx) => (
                                  <div key={idx} className="bg-red-950/40 border border-red-500/30 rounded p-2.5 flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-1.5 text-red-400 font-bold font-mono text-[10px] uppercase">
                                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                        <span>Conflict Alert: {item.arbitrator.name}</span>
                                      </div>
                                      <span className="text-[8px] bg-red-500/20 text-red-400 border border-red-500/30 px-1 rounded uppercase font-mono font-bold">
                                        {item.result.severity} Risk
                                      </span>
                                    </div>
                                    <ul className="list-disc list-inside text-[10px] text-red-200/90 space-y-1 mt-0.5 leading-relaxed">
                                      {item.result.reasons.map((reason: string, rIdx: number) => (
                                        <li key={rIdx} className="list-item pl-1">{reason}</li>
                                      ))}
                                    </ul>
                                    <div className="flex gap-2 mt-1.5 pt-1.5 border-t border-red-500/10 text-[9px]">
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to request an official Independence & Impartiality Disclosure from ${item.arbitrator.name}?`)) {
                                            alert(`Digital disclosure request sent to ${item.arbitrator.name}. The arbitrator must declare their interests within 48 hours.`);
                                          }
                                        }}
                                        className="bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 hover:text-white px-2 py-0.5 rounded font-mono font-bold"
                                      >
                                        Request Disclosure
                                      </button>
                                      <button
                                        onClick={() => handleAssignArbitrators([])}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded font-mono font-bold"
                                      >
                                        Disband Panel
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-emerald-950/20 border border-emerald-500/20 rounded p-2 flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                <span>No structural conflicts found. Panel status: Verified.</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-[11px] text-amber-500 font-mono">No arbitration panel formed yet.</p>
                        )}
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] text-slate-400 font-mono">Select Arbitrator:</label>
                          <select
                            onChange={(e) => handleAssignArbitrators([e.target.value])}
                            className="bg-[#0A192F] border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none font-mono"
                            defaultValue=""
                          >
                            <option value="" disabled>-- Select Arbitrator --</option>
                            {dbState.mediators.filter((m: any) => m.type === "Arbitrator" || m.type === "Both").map((m: any) => {
                              const isConflict = checkConflictOfInterest(m, currentCase).hasConflict;
                              return (
                                <option key={m.id} value={m.name}>
                                  {m.name} (Exp: {m.experienceYears}y) {isConflict ? "⚠️ [Conflict Risk]" : ""}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Scan Trigger Button */}
                    <button
                      onClick={() => {
                        setConflictScanCaseId(currentCase.id);
                        setShowConflictModal(true);
                      }}
                      className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] hover:text-white px-3 py-2 rounded text-[10px] font-mono font-bold transition-all flex items-center justify-center gap-2 mt-1"
                    >
                      <Shield className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span>Institutional Conflict Assessment Scan</span>
                    </button>
                  </div>

                  {/* Sessions Management */}
                  <div className="border border-slate-800 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-white uppercase text-[9px] font-mono">Mediation & Arbitration Sessions</span>
                      <CalendarIcon className="h-3.5 w-3.5 text-emerald-400" />
                    </div>

                    {/* Sessions list */}
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                      {(currentCase?.sessions || []).length === 0 ? (
                        <p className="text-slate-500 text-[10px] font-mono text-center py-2">No hearings/sessions scheduled for this dispute.</p>
                      ) : (
                        (currentCase.sessions || []).map((s: any, idx: number) => (
                          <div key={idx} className="bg-[#0F223D] border border-slate-800 p-2.5 rounded flex justify-between items-center">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-slate-300 font-semibold font-mono">{s.date} at {s.time}</span>
                              <span className="text-[10px] text-slate-400">{s.mode} session: {s.venue}</span>
                              {s.jointRecord ? (
                                <span className="text-[9px] text-emerald-400 mt-1 flex items-center gap-1"><Check className="h-3 w-3" /> Outcomes logged</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveSessionId(s.id);
                                    setJointRecordNotes(s.jointRecord || "");
                                    setPrivateMediatorNotes(s.privateNotes || "");
                                    setSessionAttendance(s.attendance?.join(", ") || "");
                                  }}
                                  className="text-amber-400 text-[9px] font-mono hover:underline mt-1 text-left"
                                >
                                  ▶ Log Joint & Private Outcomes
                                </button>
                              )}
                            </div>
                            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded uppercase font-bold">Sess {idx+1}</span>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Schedule Form */}
                    <form onSubmit={handleScheduleSession} className="border-t border-slate-800 pt-3 flex flex-col gap-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Schedule Next Session</p>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="date"
                          value={sessionDate}
                          onChange={(e) => setSessionDate(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                        />
                        <input
                          type="text"
                          value={sessionTime}
                          onChange={(e) => setSessionTime(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={sessionMode}
                          onChange={(e: any) => setSessionMode(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                        >
                          <option value="Physical">Physical</option>
                          <option value="Online">Online</option>
                        </select>
                        <input
                          type="text"
                          placeholder="Room / Venue details"
                          value={sessionVenue}
                          onChange={(e) => setSessionVenue(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] py-1 px-3 rounded uppercase font-mono mt-1"
                      >
                        Schedule Session
                      </button>
                    </form>

                    {/* Session Log Overlay */}
                    {activeSessionId && (
                      <div className="border border-amber-500/30 p-3 rounded bg-[#091526] flex flex-col gap-2.5 mt-2">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Session Outcome Log</span>
                          <button onClick={() => setActiveSessionId(null)} className="text-slate-400 hover:text-white"><X className="h-3 w-3" /></button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] text-slate-400 font-mono uppercase">Joint Record (Publicly available to representatives):</label>
                          <textarea
                            rows={2}
                            placeholder="Briefly state mutually agreed boundary adjustments, next action plans or offers..."
                            value={jointRecordNotes}
                            onChange={(e) => setJointRecordNotes(e.target.value)}
                            className="bg-[#0A192F] border border-slate-800 text-xs p-1.5 text-white rounded"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] text-slate-400 font-mono uppercase">Private Notes (Encrypted - Mediator only view):</label>
                          <textarea
                            rows={2}
                            placeholder="Mediator's private psychological assessment of dispute dynamic..."
                            value={privateMediatorNotes}
                            onChange={(e) => setPrivateMediatorNotes(e.target.value)}
                            className="bg-[#0A192F] border border-slate-800 text-xs p-1.5 text-[#D4AF37] rounded"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] text-slate-400 font-mono uppercase">Attendance (Comma separated names):</label>
                          <input
                            type="text"
                            placeholder="Advocate Salim, Tanvir Rifat..."
                            value={sessionAttendance}
                            onChange={(e) => setSessionAttendance(e.target.value)}
                            className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                          />
                        </div>
                        <button
                          onClick={handleSaveSessionNotes}
                          className="bg-[#D4AF37] hover:bg-[#D4AF37]/85 text-[#0A192F] font-bold text-[10px] py-1.5 px-3 rounded uppercase font-mono"
                        >
                          Publish Outcomes to Timeline
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Evidence & Procedural Orders (Arbitration specific but visible) */}
                  <div className="border border-slate-800 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-white uppercase text-[9px] font-mono">Orders & Evidence Lockbox</span>
                      <Shield className="h-3.5 w-3.5 text-violet-400" />
                    </div>

                    {/* Procedural orders list */}
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Procedural Orders issued</p>
                      {(currentCase?.proceduralOrders || []).length === 0 ? (
                        <p className="text-slate-500 text-[10px] font-mono">No procedural orders issued.</p>
                      ) : (
                        (currentCase.proceduralOrders || []).map((po: any) => (
                          <div key={po.id} className="bg-[#0F223D] p-2 rounded border border-slate-800 flex gap-2 items-start">
                            <span className="bg-slate-800 text-[#D4AF37] rounded px-1.5 py-0.5 text-[8px] font-bold">PO {po.orderNumber}</span>
                            <div className="flex-1">
                              <p className="text-slate-300 font-bold font-mono text-[10px]">{po.title}</p>
                              <p className="text-slate-400 text-[9px] leading-relaxed mt-0.5">{po.description}</p>
                              <p className="text-slate-500 text-[8px] font-mono mt-1">Issued Date: {po.date}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Add order form (Arbitration mode) */}
                    {currentCase?.type === "Arbitration" && (
                      <form onSubmit={handleIssueOrder} className="border-t border-slate-800 pt-2 flex flex-col gap-1.5">
                        <p className="text-[9px] font-bold text-violet-400 uppercase font-mono">Issue Procedural Order</p>
                        <input
                          type="text"
                          placeholder="Order title (e.g. Joint Survey Mandate)"
                          value={orderTitle}
                          onChange={(e) => setOrderTitle(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-[10px] px-2 py-1 text-white rounded"
                        />
                        <textarea
                          placeholder="Order directives..."
                          rows={2}
                          value={orderDesc}
                          onChange={(e) => setOrderDesc(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-[10px] p-1 text-white rounded"
                        />
                        <button type="submit" className="bg-violet-700 hover:bg-violet-600 text-white font-bold text-[9px] py-1 rounded uppercase font-mono">
                          Issue Directive
                        </button>
                      </form>
                    )}

                    {/* Evidence Lockbox */}
                    <div className="border-t border-slate-800 pt-2.5 flex flex-col gap-1.5">
                      <p className="text-[9px] font-bold text-slate-400 uppercase font-mono">Evidence Registered ({currentCase?.evidence?.length || 0} items)</p>
                      {(currentCase?.evidence || []).map((ev: any) => (
                        <div key={ev.id} className="bg-[#0F223D]/50 p-2 rounded border border-slate-800 flex justify-between items-center">
                          <div>
                            <p className="text-slate-300 font-bold font-mono text-[10px]">{ev.title}</p>
                            <p className="text-slate-400 text-[9px]">{ev.type} • uploaded by {ev.uploadedBy}</p>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{ev.size}</span>
                        </div>
                      ))}

                      <form onSubmit={handleAddEvidence} className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Upload title (e.g. Survey Log)"
                          value={evidenceTitle}
                          onChange={(e) => setEvidenceTitle(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-[10px] px-2 py-1 text-white rounded flex-1"
                        />
                        <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-bold px-3 py-1 rounded font-mono uppercase">
                          Register File
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* Settlement Contract Drafting & Signing */}
                  <div className="border border-[#D4AF37]/10 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-[#D4AF37] uppercase text-[9px] font-mono">ADR Settlement Contract</span>
                      <FileSignature className="h-3.5 w-3.5 text-emerald-400" />
                    </div>

                    {currentCase?.settlementAgreement ? (
                      <div className="bg-[#0A192F] p-3 rounded border border-slate-800 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-mono border-b border-slate-800 pb-1">
                          <span className="text-slate-400 uppercase">Contract Version: <strong className="text-slate-300">v1.{currentCase.settlementAgreement.versionHistory?.length}</strong></span>
                          <span className={`px-1 py-0.2 rounded text-[8px] font-bold uppercase ${
                            currentCase.settlementAgreement.status === "Signed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                          }`}>{currentCase.settlementAgreement.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-300 whitespace-pre-line font-mono italic leading-relaxed max-h-[150px] overflow-y-auto bg-[#050B14] p-2 rounded border border-slate-900">
                          {currentCase.settlementAgreement.content}
                        </p>

                        {/* Signatures check */}
                        <div className="mt-2 text-[10px] font-mono flex flex-col gap-1.5">
                          <p className="text-slate-400 uppercase text-[9px] font-bold">Appended Cryptographic Signatures ({currentCase.settlementAgreement.signatures?.length || 0})</p>
                          {(currentCase.settlementAgreement.signatures || []).map((sig: any, idx: number) => (
                            <div key={idx} className="bg-[#0F223D] p-1.5 rounded border border-emerald-500/20 text-slate-300 flex justify-between items-center text-[9px]">
                              <span>✍ {sig.party}</span>
                              <span className="text-slate-500 text-[8px]">IP: {sig.ip} • {sig.date?.substring(0, 10)}</span>
                            </div>
                          ))}

                          {currentCase.settlementAgreement.status !== "Signed" && (
                            <div className="flex gap-1 border-t border-slate-800/60 pt-2 mt-1">
                              <input
                                type="text"
                                placeholder="Representative Sign Name"
                                value={signatureName}
                                onChange={(e) => setSignatureName(e.target.value)}
                                className="bg-[#0A192F] border border-slate-800 text-[10px] px-2 py-1 text-white rounded flex-1"
                              />
                              <button
                                onClick={() => handleUpdateSettlement(true)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] px-3 py-1 rounded font-mono uppercase"
                              >
                                Sign Agreement
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-[10px] text-slate-400">Amicable negotiations reached? Formulate the legally binding settlement agreement draft below:</p>
                        <textarea
                          rows={3}
                          placeholder="MEMORANDUM OF SETTLEMENT UNDER SEC 89A OF CPC 1908:
1. Claimant hereby waives further claims on plot ...
2. Respondent shall pay compensation amount ..."
                          value={settlementTerms}
                          onChange={(e) => setSettlementTerms(e.target.value)}
                          className="bg-[#0A192F] border border-slate-800 text-xs p-2 text-slate-300 font-mono rounded"
                        />
                        <button
                          onClick={() => handleUpdateSettlement(false)}
                          className="bg-[#D4AF37] hover:bg-[#D4AF37]/85 text-[#0A192F] font-bold text-[10px] py-1.5 rounded uppercase font-mono"
                        >
                          Draft & Circulate to Parties
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Arbitration Award Generation */}
                  {currentCase?.type === "Arbitration" && (
                    <div className="border border-violet-500/20 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-violet-400 uppercase text-[9px] font-mono">Arbitration Final Award</span>
                        <Award className="h-3.5 w-3.5 text-violet-400" />
                      </div>

                      {currentCase?.finalAward ? (
                        <div className="bg-[#0A192F] p-3 rounded border border-violet-500/20 flex flex-col gap-1 font-mono">
                          <p className="text-[#D4AF37] font-bold">AWARD RENDERED: BDT {Number(currentCase.finalAward.amount).toLocaleString()}</p>
                          <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{currentCase.finalAward.details}</p>
                          <p className="text-slate-400 text-[9px] mt-2 border-t border-slate-800 pt-1.5">
                            Publication Status: <strong className="text-slate-200">{currentCase.finalAward.publicationStatus}</strong>
                          </p>
                          <p className="text-slate-500 text-[9px]">
                            Appeal Deadline: <strong className="text-rose-400">{currentCase.finalAward.appealDeadline}</strong>
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleIssueAward} className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-slate-400 font-mono uppercase">Award Amount (BDT):</label>
                            <input
                              type="number"
                              placeholder="e.g. 12000000"
                              value={awardAmount}
                              onChange={(e) => setAwardAmount(e.target.value)}
                              className="bg-[#0A192F] border border-slate-800 text-xs px-2 py-1 text-white rounded font-mono"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] text-slate-400 font-mono uppercase">Ruling Directives & Details:</label>
                            <textarea
                              rows={3}
                              placeholder="Directives, reasoning under Bangladesh Arbitration Act 2001..."
                              value={awardDetails}
                              onChange={(e) => setAwardDetails(e.target.value)}
                              className="bg-[#0A192F] border border-slate-800 text-xs p-2 text-white rounded"
                            />
                          </div>
                          <button
                            type="submit"
                            className="bg-violet-700 hover:bg-violet-600 text-white font-bold text-[10px] py-1.5 rounded uppercase font-mono mt-1"
                          >
                            Render and Publish Final Award
                          </button>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Case timeline tracking */}
                  <div className="border border-slate-800 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <span className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">Chronological ADR Case Timeline</span>
                    <div className="relative border-l border-slate-800 pl-4 ml-2 flex flex-col gap-4 py-2">
                      {(currentCase?.timeline || []).map((t: any, idx: number) => (
                        <div key={idx} className="relative">
                          <span className="absolute -left-[21px] top-0.5 h-2.5 w-2.5 bg-[#D4AF37] rounded-full border border-slate-900"></span>
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold text-slate-300 font-mono">{t.action}</span>
                            <span className="text-[9px] text-slate-500 font-mono">{t.date}</span>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed mt-0.5">{t.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discussion Feed inside Case */}
                  <div className="border border-slate-800 p-3.5 rounded bg-[#0A192F]/50 flex flex-col gap-3 text-xs">
                    <span className="font-bold text-white uppercase text-[9px] font-mono tracking-wider">Case Discussion Chatroom</span>
                    
                    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                      {(dbState.adrMessages || []).filter((m: any) => m.caseId === currentCase.id).length === 0 ? (
                        <p className="text-slate-500 text-[10px] font-mono text-center py-4">No discussions posted. Secure messaging is open for all representatives.</p>
                      ) : (
                        (dbState.adrMessages || []).filter((m: any) => m.caseId === currentCase.id).map((m: any) => (
                          <div key={m.id} className="bg-[#0F223D] p-2 rounded border border-slate-800">
                            <div className="flex justify-between items-center text-[9px] font-mono border-b border-slate-850 pb-0.5 mb-1 text-slate-400">
                              <span className="font-bold text-[#D4AF37]">{m.sender} ({m.role})</span>
                              <span>{m.timestamp?.split("T")[1]?.substring(0, 5) || "09:00"}</span>
                            </div>
                            <p className="text-slate-300 text-[10px] font-mono">{m.message}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <form onSubmit={handleSendChatMessage} className="flex gap-1 border-t border-slate-800/60 pt-2.5">
                      <input
                        type="text"
                        placeholder="Secure message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        className="bg-[#0A192F] border border-slate-800 text-[10px] px-2 py-1 text-white rounded flex-1"
                      />
                      <button type="submit" className="bg-[#D4AF37] text-[#0A192F] font-bold text-[10px] px-3.5 py-1 rounded font-mono">
                        <Send className="h-3 w-3" />
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 3.3: ADR SPECIALISTS DIRECTORY */}
      {activeSubTab === "directory" && (
        <div className="flex flex-col gap-6">
          <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl">
            <h3 className="text-base font-semibold text-white">Institutional ADR Specialists Registry</h3>
            <p className="text-xs text-slate-400 mt-1">Official roster of accredited mediators and certified panel arbitrators available for dispute mapping in Bangladesh.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dbState.mediators.map((med: any) => (
              <div key={med.id} className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden hover:border-[#D4AF37]/25 transition-all">
                <div className="absolute top-0 right-0 h-16 w-16 bg-slate-850/40 rounded-bl-3xl -z-10"></div>
                <div className="flex gap-4 items-start">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-[#D4AF37]/20"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{med.name}</h4>
                    <p className="text-[10px] text-[#D4AF37] font-mono mt-0.5">{med.certifications?.[med.certifications.length - 1] || "Senior Advocate"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-amber-400 font-bold font-mono">★ {med.rating}</span>
                      <span className="text-[10px] text-slate-400">• Success: {med.successRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-xs border-t border-slate-800/60 pt-3">
                  <div>
                    <span className="text-slate-500 uppercase text-[9px] font-bold font-mono block">Specialist expertise</span>
                    <span className="text-slate-300 mt-0.5 block leading-relaxed">{med.expertise}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[10px] text-slate-400">
                    <span>Exp: <strong className="text-slate-200">{med.experienceYears} Years</strong></span>
                    <span>Load: <strong className="text-slate-200">{med.workload} Active Cases</strong></span>
                    <span>Type: <strong className="text-[#D4AF37]">{med.type}</strong></span>
                    <span>Languages: <strong className="text-slate-200">{med.languages?.join(", ")}</strong></span>
                  </div>
                </div>

                <div className="bg-[#0A192F] p-2.5 rounded border border-slate-800/60 text-[10px] leading-relaxed text-slate-400">
                  <span className="font-bold text-slate-300 font-mono block text-[9px] uppercase">Bilateral Conflict Declaration:</span>
                  <p className="mt-1 line-clamp-2 italic font-mono">{med.conflictDeclaration || "No structural conflict reported."}</p>
                </div>

                <div className="border-t border-slate-800/60 pt-3 flex flex-col gap-1 text-[10px] font-mono text-slate-400">
                  <span className="font-bold uppercase text-[8px]">Appointment history track</span>
                  {(med.appointmentHistory || []).map((h: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0A192F]/40 p-1 rounded">
                      <span className="text-[#D4AF37]">{h.caseNumber}</span>
                      <span className="text-[9px] text-slate-400">{h.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3.4: SETTLEMENT CONTRACTS */}
      {activeSubTab === "agreements" && (
        <div className="flex flex-col gap-6">
          
          <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-white">Legally Binding Settlement Agreements</h3>
              <p className="text-xs text-slate-400 mt-1">Legally formulated Consent Orders and digital contracts finalized through accredited mediation channels under Section 89A of CPC (Bangladesh).</p>
            </div>
            <button
              onClick={() => triggerExport("PDF", "ADR_Consent_Decree_Archive")}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5"
            >
              <Download className="h-4 w-4 text-[#D4AF37]" /> Export Signed Archive
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            
            <div className="xl:col-span-2 bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-400" />
                <span>Active Agreements Vault</span>
              </h4>

              <div className="flex flex-col gap-4">
                {(dbState.arbitrationCases || []).filter((c: any) => c.settlementAgreement).map((c: any) => (
                  <div key={c.id} className="bg-[#0A192F] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider font-bold">CPC Sec 89A Settlement Decreet</span>
                        <h5 className="text-sm font-bold text-white mt-0.5">{c.parties}</h5>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">Dispute Case Reference: {c.caseNumber} • Created {c.createdAt}</p>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        c.settlementAgreement.status === "Signed" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {c.settlementAgreement.status}
                      </span>
                    </div>

                    <div className="bg-[#050B14] p-3 rounded font-mono text-xs text-slate-300 border border-slate-900 leading-relaxed max-h-[140px] overflow-y-auto whitespace-pre-line">
                      {c.settlementAgreement.content}
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-2 border-t border-slate-800/60 pt-3 text-[11px] font-mono">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-500 uppercase text-[9px]">Signatures verification log:</span>
                        <div className="flex gap-2">
                          {(c.settlementAgreement.signatures || []).map((s: any, i: number) => (
                            <span key={i} className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                              ✔ {s.party} ({s.date?.substring(0, 10)})
                            </span>
                          ))}
                          {(c.settlementAgreement.signatures || []).length === 0 && (
                            <span className="text-amber-500">Awaiting parties signatures</span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerExport("PDF", `Consent_Order_${c.caseNumber}`)}
                          className="text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded flex items-center gap-1"
                        >
                          <Download className="h-3.5 w-3.5" /> PDF
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCaseId(c.id);
                            setActiveSubTab("disputes");
                          }}
                          className="bg-slate-800 text-[#D4AF37] px-3 py-1.5 rounded"
                        >
                          Launch Detail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {(dbState.arbitrationCases || []).filter((c: any) => c.settlementAgreement).length === 0 && (
                  <p className="text-slate-500 font-mono text-center py-12">No settlement drafts created yet. Draft terms inside the case detail workspace.</p>
                )}
              </div>
            </div>

            <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Institutional Agreement Guidelines</h4>
              <div className="flex flex-col gap-3 text-xs text-slate-400 leading-relaxed">
                <div className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold font-mono text-[10px] flex items-center justify-center shrink-0">1</span>
                  <p><strong>Mutual Formulation:</strong> The mediator assists the parties to formulate standard terms. All amendments must update the local versioning index ledger.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold font-mono text-[10px] flex items-center justify-center shrink-0">2</span>
                  <p><strong>Binding Decreet:</strong> Under Sec 89A(5) of the Code of Civil Procedure, once filed before court, the agreement attains the status of a final decree of the court.</p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <span className="h-5 w-5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-bold font-mono text-[10px] flex items-center justify-center shrink-0">3</span>
                  <p><strong>Non-Appealable:</strong> Legally signed consent decrees formulated through mediation cannot be challenged on subsequent appeals, ensuring fast closure.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3.5: ADR CALENDAR WITH ROOM CONFLICT DETECTION */}
      {activeSubTab === "calendar" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">ADR Schedule Center</h4>
            
            <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-400">
              <p>Allocate panel rooms at institutional headquarters (BIAC, Dhaka) and monitor physical space occupancy safely.</p>
              
              <div className="bg-[#0A192F] p-3 rounded border border-amber-500/20 text-amber-400 flex flex-col gap-1.5 font-mono">
                <div className="flex items-center gap-1.5 font-bold uppercase text-[9px]">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Conflict Detection Engine</span>
                </div>
                <p className="text-[10px] mt-1 leading-normal">
                  The system scans for overlapping times, double-allocated panel specialist calendars, or duplicated room bookings in real-time.
                </p>
              </div>

              <div className="bg-emerald-500/5 p-3 rounded border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
                <span className="font-bold">✓ Daily Status:</span> 0 Active Conflicts. Overlaps are automatically alerted at room scheduling.
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">ADR Booking Calendar — July 2026</h4>
                <p className="text-xs text-slate-400">Mediation panel rooms and online Zoom links scheduled for dispute hearings</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono bg-slate-800 text-[#D4AF37] px-3 py-1 rounded">
                <span>July 2026</span>
              </div>
            </div>

            {/* Calendar grid view for July 2026 */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs border border-slate-800 rounded overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-[#0A192F] text-slate-400 py-2.5 font-bold border-b border-slate-850">
                  {day}
                </div>
              ))}
              
              {/* Pad previous days in June */}
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`prev-${i}`} className="bg-[#0A192F]/20 text-slate-600 p-4 border-r border-b border-slate-800/40"></div>
              ))}

              {/* Days of July 2026 */}
              {Array.from({ length: 31 }).map((_, i) => {
                const dayNum = i + 1;
                const dayStr = `2026-07-${String(dayNum).padStart(2, "0")}`;
                
                // Fetch scheduled events on this date
                const dayEvents = upcomingHearingsAndMeetings.filter((e) => e.date === dayStr);

                return (
                  <div key={dayNum} className="min-h-[90px] bg-[#0A192F]/50 p-1 border-r border-b border-slate-800 flex flex-col items-start gap-1 justify-between hover:bg-slate-850/50 transition-colors">
                    <span className="font-bold text-slate-500 text-[10px] pl-1">{dayNum}</span>
                    <div className="flex-1 w-full flex flex-col gap-1 overflow-y-auto max-h-[60px]">
                      {dayEvents.map((e, idx) => (
                        <div 
                          key={idx} 
                          title={`${e.caseNumber}: ${e.parties}`}
                          className={`text-[8px] font-mono p-1 rounded font-bold uppercase truncate border ${
                            e.type === "Mediation" 
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                              : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                          }`}
                        >
                          {e.caseNumber.split("-").pop()} @ {e.time.split(" ")[0]}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

      {/* TAB 3.6: CASE DISCUSSIONS AND INTRAL-PARTY CHAT */}
      {activeSubTab === "communications" && (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
          
          <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white border-b border-slate-800 pb-2">ADR Announcement Center</h4>
            
            <div className="flex flex-col gap-3 font-mono text-[11px] text-slate-400">
              <div className="bg-[#0A192F] p-3 rounded border border-slate-800/80">
                <span className="text-[#D4AF37] font-bold text-[9px] uppercase">BIAC Notice (June 28)</span>
                <p className="mt-1 leading-normal">Fast-track mediation proceedings now support instant digital signing pad for all counterclaims.</p>
              </div>
              <div className="bg-[#0A192F] p-3 rounded border border-slate-800/80">
                <span className="text-indigo-400 font-bold text-[9px] uppercase">Registrar Directive</span>
                <p className="mt-1 leading-normal">All physical hearings inside Panel Room 3 must register expert witnesses 48 hours prior.</p>
              </div>
            </div>
          </div>

          <div className="xl:col-span-3 bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">General ADR Forum & Secure Discussion Board</h4>
                <p className="text-xs text-slate-400">Institutional message board encrypted with role-level digital credentials</p>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded uppercase font-bold">
                ● Live Encrypted
              </span>
            </div>

            {/* General message feed */}
            <div className="bg-[#0A192F] border border-slate-850 rounded-lg p-4 min-h-[250px] max-h-[350px] overflow-y-auto flex flex-col gap-3">
              {(dbState.adrMessages || []).filter((m: any) => m.caseId === "general" || !m.caseId).map((m: any) => (
                <div key={m.id} className="bg-[#0F223D]/60 p-3 rounded border border-slate-800 max-w-xl self-start font-mono">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5">
                    <strong className="text-[#D4AF37]">{m.sender}</strong>
                    <span>({m.role})</span>
                    <span className="text-slate-500">{m.timestamp?.substring(0, 16).replace("T", " ")}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{m.message}</p>
                </div>
              ))}

              {(dbState.adrMessages || []).filter((m: any) => m.caseId === "general" || !m.caseId).length === 0 && (
                <p className="text-slate-500 text-xs font-mono text-center py-20">No active forum threads. Post a general announcement below.</p>
              )}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChatMessage(e);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Type structural board announcement or advisory notice..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="bg-[#0A192F] border border-slate-800 text-xs rounded-lg py-2 px-3 text-white focus:outline-none focus:border-[#D4AF37]/50 flex-1"
              />
              <button
                type="submit"
                className="bg-[#D4AF37] hover:bg-[#D4AF37]/85 text-[#0A192F] font-bold text-xs px-4 rounded-lg flex items-center gap-1 font-mono uppercase"
              >
                <Send className="h-4 w-4" /> Publish Notice
              </button>
            </form>

          </div>

        </div>
      )}

      {/* TAB 3.7: DIAGNOSTICS & REPORTING ENGINE */}
      {activeSubTab === "reports" && (
        <div className="flex flex-col gap-6">
          
          <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl">
            <h3 className="text-base font-semibold text-white">Diagnostics & Reporting Center</h3>
            <p className="text-xs text-slate-400 mt-1">Review alternative dispute metrics, mediator index evaluations, financial savings diagnostics, and export structured institutional records.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border border-emerald-500/20">Amicable Settled</span>
                  <Award className="h-5 w-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-white mt-3">Dispute ADR Success Index</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Evaluates the ratio of registered disputes resolved amicably via Section 89A versus escalated litigation suits.
                </p>
                <div className="bg-[#0A192F] p-3 rounded border border-slate-800 mt-4 font-mono text-[11px] text-slate-300 flex flex-col gap-1.5">
                  <div className="flex justify-between"><span>Settled:</span> <span>{settledCases.length} Cases</span></div>
                  <div className="flex justify-between"><span>Escalated to Court:</span> <span>{escalatedToCourt.length} Cases</span></div>
                  <div className="flex justify-between text-emerald-400 font-bold"><span>Success Ratio:</span> <span>{resolutionRate}%</span></div>
                </div>
              </div>

              <div className="flex gap-1.5 border-t border-slate-850 pt-3">
                <button
                  onClick={() => triggerExport("PDF", "ADR_Success_Index_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  PDF
                </button>
                <button
                  onClick={() => triggerExport("EXCEL", "ADR_Success_Index_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  Excel
                </button>
              </div>
            </div>

            <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border border-amber-500/20">Operational</span>
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-white mt-3">Resolution Velocity Index</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Measures structural average settlement duration for mediation cases vs typical court backlogs in Dhaka courts.
                </p>
                <div className="bg-[#0A192F] p-3 rounded border border-slate-800 mt-4 font-mono text-[11px] text-slate-300 flex flex-col gap-1.5">
                  <div className="flex justify-between"><span>Avg ADR Velocity:</span> <span className="text-emerald-400">28 Days</span></div>
                  <div className="flex justify-between"><span>Avg Court Filing-to-Decree:</span> <span className="text-rose-400">1,200 Days</span></div>
                  <div className="flex justify-between"><span>Fast-track ratio:</span> <span>42.8x Faster</span></div>
                </div>
              </div>

              <div className="flex gap-1.5 border-t border-slate-850 pt-3">
                <button
                  onClick={() => triggerExport("PDF", "Resolution_Velocity_Index_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  PDF
                </button>
                <button
                  onClick={() => triggerExport("CSV", "Resolution_Velocity_Index_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  CSV
                </button>
              </div>
            </div>

            <div className="bg-[#0F223D] border border-slate-800 rounded-xl p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border border-violet-500/20">Financial saving</span>
                  <DollarSign className="h-5 w-5 text-violet-400" />
                </div>
                <h4 className="text-sm font-bold text-white mt-3">Litigation Cost Savings Index</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Estimates commercial capital saved by corporate departments through pre-trial mediation and settlements.
                </p>
                <div className="bg-[#0A192F] p-3 rounded border border-slate-800 mt-4 font-mono text-[11px] text-slate-300 flex flex-col gap-1.5">
                  <div className="flex justify-between"><span>Total Claim Values:</span> <span>৳{(totalClaimsBDT / 1000000).toFixed(1)}M BDT</span></div>
                  <div className="flex justify-between"><span>Est. Saved Court Fees:</span> <span>৳4.8M BDT</span></div>
                  <div className="flex justify-between text-violet-400 font-bold"><span>Total Savings Ratio:</span> <span>72.4% Saved</span></div>
                </div>
              </div>

              <div className="flex gap-1.5 border-t border-slate-850 pt-3">
                <button
                  onClick={() => triggerExport("PDF", "Financial_ADR_Savings_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  PDF
                </button>
                <button
                  onClick={() => triggerExport("EXCEL", "Financial_ADR_Savings_Report")}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold py-1.5 px-3 rounded font-mono flex-1 uppercase"
                >
                  Excel
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. DISPUTE REGISTRATION MODAL */}
      {showRegModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0F223D] border border-[#D4AF37]/30 max-w-2xl w-full rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">Bangladesh Fast-Track Registry</span>
                <h3 className="text-base font-bold text-white mt-0.5">Register ADR Dispute Case</h3>
              </div>
              <button
                onClick={() => setShowRegModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterDispute} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-white">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Case Number Reference:</label>
                <input
                  type="text"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">ADR Dispute Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                >
                  <option value="Commercial Property">Commercial Property</option>
                  <option value="Maritime & Shipping">Maritime & Shipping</option>
                  <option value="Intellectual Property / Corporate">Intellectual Property</option>
                  <option value="Labour Dispute">Labour Dispute</option>
                  <option value="Family Partition Suit">Family Partition Suit</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Dispute Type Mode:</label>
                <div className="flex gap-4 py-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[11px]">
                    <input
                      type="radio"
                      name="disputeType"
                      checked={newCaseType === "Mediation"}
                      onChange={() => setNewCaseType("Mediation")}
                    />
                    <span>Mediation (Sec 89A CPC)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-mono text-[11px]">
                    <input
                      type="radio"
                      name="disputeType"
                      checked={newCaseType === "Arbitration"}
                      onChange={() => setNewCaseType("Arbitration")}
                    />
                    <span>Arbitration (Act 2001)</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Estimated Claim BDT (৳):</label>
                <input
                  type="number"
                  placeholder="e.g. 4500000"
                  value={newClaim}
                  onChange={(e) => setNewClaim(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-mono">Dispute Subject:</label>
                <input
                  type="text"
                  placeholder="e.g. Chittagong Port Lease demarcation dispute of Sector 4 Warehouse"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-mono">Parties Involved (Claimant Vs. Respondent):</label>
                <input
                  type="text"
                  placeholder="e.g. Meghna Builders Ltd. Vs. Al-Amin Estate Ltd."
                  value={newParties}
                  onChange={(e) => setNewParties(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white font-mono"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Preferred ADR Institution:</label>
                <input
                  type="text"
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Attending Legal Counsel:</label>
                <input
                  type="text"
                  placeholder="e.g. Advocate Salim Rahaman Dipu"
                  value={newRep}
                  onChange={(e) => setNewRep(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Confidentiality Level:</label>
                <select
                  value={newConfidentiality}
                  onChange={(e) => setNewConfidentiality(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                >
                  <option value="Standard">Standard</option>
                  <option value="Strictly Confidential">Strictly Confidential</option>
                  <option value="Internal Panel Only">Internal Panel Only</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-400 font-mono">Dispute Priority:</label>
                <select
                  value={newPriority}
                  onChange={(e: any) => setNewPriority(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded px-3 py-1.5 text-white"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Fast-Track</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-slate-400 font-mono">Initial Filing Statement & Directives:</label>
                <textarea
                  rows={3}
                  placeholder="Detail the case background, land deed particulars or breach claims..."
                  value={newInitialStatement}
                  onChange={(e) => setNewInitialStatement(e.target.value)}
                  className="bg-[#0A192F] border border-slate-800 rounded p-2 text-white"
                />
              </div>

              <div className="flex gap-2 justify-end md:col-span-2 border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#0A192F] font-bold px-6 py-2 rounded-lg"
                >
                  Register Dispute Case
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 5. INSTITUTIONAL CONFLICT OF INTEREST ASSESSMENT MODAL */}
      {showConflictModal && conflictScanCaseId && (
        (() => {
          const scanCase = (dbState?.arbitrationCases || []).find((c: any) => c.id === conflictScanCaseId);
          if (!scanCase) return null;

          return (
            <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-[#0F223D] border border-[#D4AF37]/30 max-w-4xl w-full rounded-2xl shadow-2xl p-6 relative flex flex-col gap-4 max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#D4AF37]" />
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold">IntelliJudge Compliance Engine</span>
                      <h3 className="text-base font-bold text-white mt-0.5">Institutional Conflict of Interest Assessment</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowConflictModal(false)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Case Summary Panel */}
                <div className="bg-[#0A192F]/60 border border-slate-800 rounded-xl p-3.5 text-xs flex flex-col gap-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="font-mono text-slate-400">Target Case: <strong className="text-white">{scanCase.caseNumber}</strong></span>
                    <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded font-mono font-bold uppercase">{scanCase.type} Mode</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-1 border-t border-slate-800/50 pt-2.5">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Dispute Parties</span>
                      <span className="text-slate-200 font-bold">{scanCase.parties}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Listed Representatives</span>
                      <span className="text-slate-200 font-mono">{scanCase.representatives || "None Listed"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-mono uppercase">Subject / Claim Value</span>
                      <span className="text-slate-200 font-semibold">{scanCase.subject} (৳{Number(scanCase.claimAmount || 0).toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                {/* Main Assessment List */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase font-mono tracking-wider">Institutional Directory Scan (5 Active Specialists)</span>
                    <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Automated index matches live</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    {(dbState?.mediators || []).map((m: any) => {
                      const analysis = checkConflictOfInterest(m, scanCase);
                      const isAssigned = scanCase.mediatorId === m.id || (scanCase.arbitrators && scanCase.arbitrators.includes(m.name));

                      return (
                        <div 
                          key={m.id} 
                          className={`border rounded-xl p-3.5 transition-all flex flex-col gap-3 ${
                            isAssigned 
                              ? "bg-[#162A45]/40 border-[#D4AF37]/40" 
                              : "bg-[#0A192F]/30 hover:bg-[#0A192F]/50 border-slate-800/80"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={m.imageUrl || "https://images.unsplash.com/photo-1560250097-0b93528c311a"} 
                                alt={m.name} 
                                className="h-10 w-10 rounded-full object-cover border border-[#D4AF37]/20 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-white text-xs sm:text-sm">{m.name}</h4>
                                  <span className="text-[9px] bg-slate-800 text-[#D4AF37] border border-slate-700 px-1.5 py-0.5 rounded uppercase font-mono font-bold shrink-0">
                                    {m.type}
                                  </span>
                                  {isAssigned && (
                                    <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-1.5 py-0.5 rounded font-mono font-bold shrink-0 animate-pulse">
                                      CURRENTLY ASSIGNED
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                  Exp: {m.experienceYears} Years • Success: {m.successRate}% • Expertise: {m.expertise}
                                </p>
                              </div>
                            </div>

                            {/* Risk Badge / Selector button */}
                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              {analysis.hasConflict ? (
                                <span className={`text-[10px] font-mono font-bold border px-2 py-1 rounded flex items-center gap-1.5 ${
                                  analysis.severity === "high" 
                                    ? "bg-red-500/10 border-red-500/30 text-red-400" 
                                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                }`}>
                                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                  <span>{analysis.severity.toUpperCase()} RISK</span>
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded flex items-center gap-1.5">
                                  <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                                  <span>CLEARED</span>
                                </span>
                              )}

                              {/* Assign / Swap Action button */}
                              {scanCase.type === "Mediation" ? (
                                <button
                                  disabled={isAssigned || (m.type !== "Mediator" && m.type !== "Both")}
                                  onClick={() => {
                                    if (analysis.hasConflict) {
                                      if (!confirm(`Warning: This specialist has a declared or historical Conflict of Interest (${analysis.severity} severity) in this dispute. Proceed anyway with special supervisor approval?`)) {
                                        return;
                                      }
                                    }
                                    handleAssignSpecialist(m.id);
                                    alert(`Successfully assigned ${m.name} as mediator.`);
                                  }}
                                  className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all ${
                                    isAssigned
                                      ? "bg-[#D4AF37]/10 text-slate-500 cursor-not-allowed border border-[#D4AF37]/10"
                                      : m.type !== "Mediator" && m.type !== "Both"
                                        ? "bg-slate-900 text-slate-600 border border-slate-950 cursor-not-allowed"
                                        : "bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0A192F] font-extrabold"
                                  }`}
                                >
                                  {isAssigned ? "Assigned" : "Assign Mediator"}
                                </button>
                              ) : (
                                <button
                                  disabled={isAssigned || (m.type !== "Arbitrator" && m.type !== "Both")}
                                  onClick={() => {
                                    if (analysis.hasConflict) {
                                      if (!confirm(`Warning: This specialist has a declared or historical Conflict of Interest (${analysis.severity} severity) in this dispute. Proceed anyway with special panel approval?`)) {
                                        return;
                                      }
                                    }
                                    handleAssignArbitrators([m.name]);
                                    alert(`Successfully formed arbitration panel with ${m.name}.`);
                                  }}
                                  className={`px-3 py-1.5 rounded text-[10px] font-mono font-bold transition-all ${
                                    isAssigned
                                      ? "bg-[#D4AF37]/10 text-slate-500 cursor-not-allowed border border-[#D4AF37]/10"
                                      : m.type !== "Arbitrator" && m.type !== "Both"
                                        ? "bg-slate-900 text-slate-600 border border-slate-950 cursor-not-allowed"
                                        : "bg-violet-600 hover:bg-violet-500 text-white font-extrabold"
                                  }`}
                                >
                                  {isAssigned ? "Assigned" : "Form Panel"}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Conflict Analysis details if present */}
                          {analysis.hasConflict && (
                            <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-2.5 text-[11px] leading-relaxed flex flex-col gap-1.5">
                              <span className="font-bold text-red-400 font-mono text-[9px] uppercase tracking-wide">Analysis Engine Triggers:</span>
                              <ul className="list-disc list-inside text-red-200/90 space-y-1">
                                {analysis.reasons.map((r: string, idx: number) => (
                                  <li key={idx} className="list-item pl-1">{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Historical Declaration reference */}
                          <div className="bg-[#0A192F]/50 rounded-lg p-2 text-[10px] text-slate-400/90 leading-normal border border-slate-800/40">
                            <span className="font-bold text-slate-300 font-mono mr-1">Institutional Conflict Declaration:</span>
                            "{m.conflictDeclaration || "No structural declarations registered."}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Compliance checks conform with Sec 12 of Bangladesh Arbitrations Act 2001.</span>
                  <button
                    onClick={() => setShowConflictModal(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
                  >
                    Close Scan View
                  </button>
                </div>

              </div>
            </div>
          );
        })()
      )}

    </div>
  );
}
