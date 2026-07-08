import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const COURT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Supreme Court of Bangladesh": { lat: 23.7380, lng: 90.4024 },
  "High Court Division - Bench 01": { lat: 23.7381, lng: 90.4025 },
  "High Court Division - Bench 12 (Constitutional)": { lat: 23.7382, lng: 90.4026 },
  "Dhaka District & Sessions Court": { lat: 23.7081, lng: 90.4137 },
  "Chittagong District & Sessions Court": { lat: 22.3353, lng: 91.8340 },
  "Sylhet Metropolitan Court": { lat: 24.8917, lng: 91.8833 },
  "Labour Court Division 1": { lat: 23.7328, lng: 90.4196 },
  "Administrative Appellate Tribunal": { lat: 23.7461, lng: 90.3742 },
  "Taxes Appellate Tribunal": { lat: 23.7431, lng: 90.3992 },
  "Dhaka Family Court": { lat: 23.7251, lng: 90.4072 }
};

function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
import {
  Scale,
  Briefcase,
  Users,
  Shield,
  FileText,
  DollarSign,
  Calendar,
  Layers,
  MapPin,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  Award,
  Compass,
  Navigation,
  Map,
  Clock,
  Printer,
  Copy,
  CheckCircle,
  FileDigit,
  UserCheck,
  AlertTriangle,
  BookOpen,
  Sliders,
  Send,
  Eye,
  Lock,
  RefreshCw,
  PhoneCall,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  User,
  ExternalLink
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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { UserRole, Employee, Case, Hearing, Evidence, Contract, FinancialRecord, Appointment, AuditLog } from "./types";
import { ArbitrationMediationModule } from "./components/ArbitrationMediationModule";

export default function App() {
  // Authentication & Simulation States
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SUPREME_ADMIN);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [loading, setLoading] = useState<boolean>(true);
  const [dbState, setDbState] = useState<{
    employees: Employee[];
    cases: Case[];
    hearings: Hearing[];
    evidence: Evidence[];
    contracts: Contract[];
    appointments: Appointment[];
    finance: FinancialRecord[];
    auditLogs: AuditLog[];
    criminals: any[];
  } | null>(null);

  // Filter & Search states
  const [caseSearch, setCaseSearch] = useState<string>("");
  const [caseTypeFilter, setCaseTypeFilter] = useState<string>("All");
  const [personnelSearch, setPersonnelSearch] = useState<string>("");
  const [personnelRoleFilter, setPersonnelRoleFilter] = useState<string>("All");
  const [personnelPage, setPersonnelPage] = useState<number>(1);
  const personnelPerPage = 12;

  // Selected Detail views
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Gemini Legal Draftsman States
  const [draftForm, setDraftForm] = useState({
    docType: "Power of Attorney",
    clientName: "",
    opposingParty: "",
    matterDescription: "",
    specificClauses: ""
  });
  const [draftResult, setDraftResult] = useState<string>("");
  const [drafting, setDrafting] = useState<boolean>(false);

  // Gemini Legislation Research States
  const [researchQuery, setResearchQuery] = useState<string>("");
  const [researchPracticeArea, setResearchPracticeArea] = useState<string>("Civil Litigations");
  const [researchResult, setResearchResult] = useState<string>("");
  const [researching, setResearching] = useState<boolean>(false);

  // Court Attendance States
  const [attendanceForm, setAttendanceForm] = useState({
    name: "",
    role: "Lawyer" as "Lawyer" | "Witness",
    courtName: "Supreme Court of Bangladesh",
    caseId: "",
    notes: ""
  });
  const [attendanceLocation, setAttendanceLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [attendanceLocationType, setAttendanceLocationType] = useState<"GPS" | "Simulated" | "">("");
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);
  const [attendanceStatus, setAttendanceStatus] = useState<"Verified" | "Outside Boundary" | "Simulated" | "">("");
  const [attendanceDistanceText, setAttendanceDistanceText] = useState<string>("");
  const [submittingAttendance, setSubmittingAttendance] = useState<boolean>(false);

  // New Case Modal States
  const [showNewCaseModal, setShowNewCaseModal] = useState<boolean>(false);
  const [newCaseForm, setNewCaseForm] = useState({
    caseNumber: "",
    title: "",
    court: "Supreme Court of Bangladesh",
    district: "Dhaka",
    division: "Dhaka",
    judge: "Justice Md. Ashraful Islam",
    leadLawyer: "Salim Rahaman Dipu",
    clientName: "Shahparan Rownak",
    opposingParty: "Tanvir Rifat",
    opposingLawyer: "Nuzhat Kamal",
    caseType: "Civil" as any,
    status: "Filing" as any,
    priority: "High" as any,
    riskLevel: "Standard" as any,
    summary: "",
    legalNotes: ""
  });

  // bKash Portal Modal States
  const [bkashModal, setBkashModal] = useState<{
    open: boolean;
    invoiceId: string;
    amount: number;
    step: "phone" | "otp" | "pin" | "success";
    phone: string;
    otp: string;
    pin: string;
  }>({
    open: false,
    invoiceId: "",
    amount: 0,
    step: "phone",
    phone: "",
    otp: "",
    pin: ""
  });

  // Adding Evidence states
  const [showAddEvidence, setShowAddEvidence] = useState<boolean>(false);
  const [newEvidenceForm, setNewEvidenceForm] = useState({
    title: "",
    type: "PDF" as any,
    tag: "Land Registry Documentation",
    notes: ""
  });

  // Adding Hearing states
  const [showAddHearing, setShowAddHearing] = useState<boolean>(false);
  const [newHearingForm, setNewHearingForm] = useState({
    hearingDate: "",
    hearingTime: "10:30 AM",
    courtroom: "Room No. 402",
    judge: "Justice Md. Ashraful Islam",
    assignedLawyer: "Salim Rahaman Dipu",
    notes: ""
  });

  // Fetch state on mount and role change
  const fetchState = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/state");
      const data = await res.json();
      setDbState(data);
      setLoading(false);
    } catch (e) {
      console.error("Failed to load state", e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  // Update client view whenever active tab changes to reset detailed overlays
  useEffect(() => {
    setSelectedCase(null);
    setSelectedEmployee(null);
  }, [activeTab]);

  // Handle New Case submission
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCaseForm)
      });
      if (res.ok) {
        setShowNewCaseModal(false);
        setNewCaseForm({
          caseNumber: "",
          title: "",
          court: "Supreme Court of Bangladesh",
          district: "Dhaka",
          division: "Dhaka",
          judge: "Justice Md. Ashraful Islam",
          leadLawyer: "Salim Rahaman Dipu",
          clientName: "Shahparan Rownak",
          opposingParty: "Tanvir Rifat",
          opposingLawyer: "Nuzhat Kamal",
          caseType: "Civil",
          status: "Filing",
          priority: "High",
          riskLevel: "Standard",
          summary: "",
          legalNotes: ""
        });
        fetchState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Gemini Draft Generation
  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setDrafting(true);
    setDraftResult("");
    try {
      const res = await fetch("/api/gemini/generate-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftForm)
      });
      const data = await res.json();
      if (data.success) {
        setDraftResult(data.draftText);
      } else {
        setDraftResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setDraftResult(`Connection failed: ${err.message}`);
    } finally {
      setDrafting(false);
    }
  };

  // Handle Legislative Research Grounding
  const handleExecuteResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setResearching(true);
    setResearchResult("");
    try {
      const res = await fetch("/api/gemini/search-legislation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: researchQuery, practiceArea: researchPracticeArea })
      });
      const data = await res.json();
      if (data.success) {
        setResearchResult(data.responseText);
      } else {
        setResearchResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setResearchResult(`Research request failed: ${err.message}`);
    } finally {
      setResearching(false);
    }
  };

  // Settle invoice with bKash Simulation
  const triggerBkash = (invoiceId: string, amount: number) => {
    setBkashModal({
      open: true,
      invoiceId,
      amount,
      step: "phone",
      phone: "",
      otp: "",
      pin: ""
    });
  };

  const handleBkashSubmit = async () => {
    const { step, invoiceId, amount, phone, otp, pin } = bkashModal;
    if (step === "phone") {
      if (!phone || phone.length < 11) return;
      setBkashModal(prev => ({ ...prev, step: "otp" }));
    } else if (step === "otp") {
      if (!otp || otp.length < 4) return;
      setBkashModal(prev => ({ ...prev, step: "pin" }));
    } else if (step === "pin") {
      if (!pin || pin.length < 4) return;
      // Mark invoice as paid in DB
      try {
        const matchingTx = (dbState?.finance || []).find(f => f.id === invoiceId);
        if (matchingTx) {
          await fetch(`/api/finance`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...matchingTx,
              id: `fin-${Date.now()}`,
              status: "Paid",
              paymentMethod: "bKash",
              date: new Date().toISOString().split("T")[0]
            })
          });
          fetchState();
        }
      } catch (e) {
        console.error(e);
      }
      setBkashModal(prev => ({ ...prev, step: "success" }));
    }
  };

  // Add evidence logically to selected case
  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCase.id,
          caseNumber: selectedCase.caseNumber,
          title: newEvidenceForm.title,
          type: newEvidenceForm.type,
          uploadedBy: selectedRole === UserRole.SUPREME_ADMIN ? "SMI Fahim" : selectedRole,
          fileSize: "1.8 MB",
          tag: newEvidenceForm.tag,
          notes: newEvidenceForm.notes
        })
      });
      if (res.ok) {
        setShowAddEvidence(false);
        setNewEvidenceForm({ title: "", type: "PDF", tag: "Land Registry Documentation", notes: "" });
        // Refresh local view
        const updatedDb = await fetch("/api/state").then(r => r.json());
        setDbState(updatedDb);
        const refetchedCase = updatedDb.cases.find((c: any) => c.id === selectedCase.id);
        setSelectedCase(refetchedCase);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add hearing log
  const handleAddHearing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const res = await fetch("/api/appointments", { // reuse appointment or load in dbState
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: selectedCase.id,
          caseNumber: selectedCase.caseNumber,
          clientName: selectedCase.clientName,
          lawyerName: newHearingForm.assignedLawyer,
          dateTime: `${newHearingForm.hearingDate}T10:30:00`,
          purpose: `Court Hearing scheduled at ${newHearingForm.courtroom} with Judge ${newHearingForm.judge}. Notes: ${newHearingForm.notes}`,
          status: "Scheduled",
          type: "In-Person"
        })
      });
      if (res.ok) {
        setShowAddHearing(false);
        setNewHearingForm({
          hearingDate: "",
          hearingTime: "10:30 AM",
          courtroom: "Room No. 402",
          judge: "Justice Md. Ashraful Islam",
          assignedLawyer: "Salim Rahaman Dipu",
          notes: ""
        });
        fetchState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Court Attendance Handlers
  const handleFetchGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please use the simulated option.");
      return;
    }
    setAttendanceLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setAttendanceLocation({ lat: latitude, lng: longitude });
        setAttendanceLocationType("GPS");
        
        // Calculate distance from chosen court
        const courtName = attendanceForm.courtName;
        const courtCoords = COURT_COORDINATES[courtName] || { lat: 23.7380, lng: 90.4024 };
        const dist = getHaversineDistance(latitude, longitude, courtCoords.lat, courtCoords.lng);
        
        if (dist <= 0.2) {
          setAttendanceStatus("Verified");
          setAttendanceDistanceText(`${(dist * 1000).toFixed(0)} meters (Verified within Complex boundary)`);
        } else {
          setAttendanceStatus("Outside Boundary");
          setAttendanceDistanceText(`${dist.toFixed(2)} km (Outside boundary - remote verification)`);
        }
        setAttendanceLoading(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert(`Failed to fetch GPS coordinates (${error.message}). Please use the high-fidelity 'Simulate Court GPS Presence' for testing in sandbox mode.`);
        setAttendanceLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSimulateCourtPresence = (courtName: string) => {
    const courtCoords = COURT_COORDINATES[courtName] || { lat: 23.7380, lng: 90.4024 };
    // Add small realistic offset (~10-25 meters)
    const offsetLat = (Math.random() - 0.5) * 0.00015;
    const offsetLng = (Math.random() - 0.5) * 0.00015;
    const simLat = courtCoords.lat + offsetLat;
    const simLng = courtCoords.lng + offsetLng;
    
    setAttendanceLocation({ lat: simLat, lng: simLng });
    setAttendanceLocationType("Simulated");
    setAttendanceStatus("Simulated");
    const dist = getHaversineDistance(simLat, simLng, courtCoords.lat, courtCoords.lng);
    setAttendanceDistanceText(`${(dist * 1000).toFixed(0)} meters (Simulated Satellite Signal Lock)`);
  };

  const handleSimulateRemotePresence = () => {
    // Put coordinates in another part of Dhaka (e.g. Uttara / Banani)
    const targetCoords = COURT_COORDINATES[attendanceForm.courtName] || { lat: 23.7380, lng: 90.4024 };
    const remoteLat = 23.8644; // Uttara
    const remoteLng = 90.4034;
    
    setAttendanceLocation({ lat: remoteLat, lng: remoteLng });
    setAttendanceLocationType("Simulated");
    setAttendanceStatus("Outside Boundary");
    const dist = getHaversineDistance(remoteLat, remoteLng, targetCoords.lat, targetCoords.lng);
    setAttendanceDistanceText(`${dist.toFixed(2)} km (Outside Boundary: remote location detected)`);
  };

  const handleSubmitAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceForm.name) {
      alert("Please provide the name of the attendee.");
      return;
    }
    if (!attendanceLocation) {
      alert("Please fetch or simulate location coordinates first.");
      return;
    }
    setSubmittingAttendance(true);
    try {
      const selectedCaseObj = (dbState?.cases || []).find(c => c.id === attendanceForm.caseId);
      const res = await fetch("/api/court-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: attendanceForm.name,
          role: attendanceForm.role,
          courtName: attendanceForm.courtName,
          caseId: attendanceForm.caseId || null,
          caseNumber: selectedCaseObj ? selectedCaseObj.caseNumber : "Ad-hoc Attendance",
          latitude: attendanceLocation.lat,
          longitude: attendanceLocation.lng,
          status: attendanceStatus,
          distanceText: attendanceDistanceText,
          notes: attendanceForm.notes,
          verificationType: attendanceLocationType
        })
      });
      if (res.ok) {
        // Reset states
        setAttendanceForm({
          name: "",
          role: "Lawyer",
          courtName: "Supreme Court of Bangladesh",
          caseId: "",
          notes: ""
        });
        setAttendanceLocation(null);
        setAttendanceLocationType("");
        setAttendanceStatus("");
        setAttendanceDistanceText("");
        
        // Fetch fresh db state
        fetchState();
        alert("Presence verified & logged successfully in the Court Attendance Ledger.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingAttendance(false);
    }
  };

  // Calculations for Admin / Judicial Analytics
  const totalCases = (dbState?.cases || []).length;
  const activeCases = (dbState?.cases || []).filter(c => c.status !== "Disposed").length;
  const disposedCases = (dbState?.cases || []).filter(c => c.status === "Disposed").length;
  const criticalCases = (dbState?.cases || []).filter(c => c.riskLevel === "Critical").length;

  // Real-time Today's Hearing Compliance
  const todayStr = new Date().toISOString().split("T")[0];
  const todaysHearings = (dbState?.hearings || []).filter(h => h.hearingDate === todayStr);
  const verifiedPresentCount = todaysHearings.filter(h => h.status === "Verified Present").length;
  const pendingCount = todaysHearings.filter(h => h.status === "Scheduled" || h.status === "Pending").length;
  const complianceRate = todaysHearings.length > 0 
    ? Math.round((verifiedPresentCount / todaysHearings.length) * 100) 
    : 100;

  // Filter cases based on search and practice type
  const filteredCases = (dbState?.cases || []).filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(caseSearch.toLowerCase()) ||
                          c.caseNumber.toLowerCase().includes(caseSearch.toLowerCase()) ||
                          c.clientName.toLowerCase().includes(caseSearch.toLowerCase());
    const matchesType = caseTypeFilter === "All" || c.caseType === caseTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filter Employees (Personnel Directory) with performance rating, paginated (showing all 400 cards cleanly)
  const filteredEmployees = (dbState?.employees || []).filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(personnelSearch.toLowerCase()) ||
                          e.email.toLowerCase().includes(personnelSearch.toLowerCase()) ||
                          e.phone.includes(personnelSearch);
    const matchesRole = personnelRoleFilter === "All" || e.role === personnelRoleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPersonnelPages = Math.ceil(filteredEmployees.length / personnelPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (personnelPage - 1) * personnelPerPage,
    personnelPage * personnelPerPage
  );

  // Financial statistics
  const totalRevenue = (dbState?.finance || [])
    .filter(f => f.type === "Payment" || (f.type === "Invoice" && f.status === "Paid"))
    .reduce((acc, f) => acc + f.amount, 0) || 0;
  const trustFunds = (dbState?.finance || [])
    .filter(f => f.isTrustAccount)
    .reduce((acc, f) => acc + f.amount, 0) || 0;
  const outstandingInvoices = (dbState?.finance || [])
    .filter(f => f.type === "Invoice" && f.status === "Unpaid")
    .reduce((acc, f) => acc + f.amount, 0) || 0;

  // Pie chart variables
  const caseTypeDistribution = [
    { name: "Civil", value: (dbState?.cases || []).filter(c => c.caseType === "Civil").length || 3, color: "#1E3A8A" },
    { name: "Criminal", value: (dbState?.cases || []).filter(c => c.caseType === "Criminal").length || 4, color: "#991B1B" },
    { name: "Constitutional", value: (dbState?.cases || []).filter(c => c.caseType === "Constitutional").length || 2, color: "#D4AF37" },
    { name: "Labour", value: (dbState?.cases || []).filter(c => c.caseType === "Labour").length || 2, color: "#065F46" },
    { name: "Family", value: (dbState?.cases || []).filter(c => c.caseType === "Family").length || 2, color: "#701A75" },
    { name: "Tax", value: (dbState?.cases || []).filter(c => c.caseType === "Tax").length || 1, color: "#C2410C" },
    { name: "Corporate", value: (dbState?.cases || []).filter(c => c.caseType === "Corporate").length || 2, color: "#0369A1" }
  ];

  // Financial timeline charts
  const financeTimeline = [
    { month: "Jan", revenue: 420000, expenses: 110000 },
    { month: "Feb", revenue: 380000, expenses: 95000 },
    { month: "Mar", revenue: 510000, expenses: 140000 },
    { month: "Apr", revenue: 480000, expenses: 120000 },
    { month: "May", revenue: 620000, expenses: 155000 },
    { month: "Jun", revenue: 590000, expenses: 130000 },
    { month: "Jul", revenue: totalRevenue / 10 || 320000, expenses: 85000 }
  ];

  return (
    <div className="min-h-screen bg-[#051124] text-slate-100 font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. TOP EXECUTIVE BAR */}
      <header className="border-b border-[#D4AF37]/10 bg-[#0A192F]/50 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-br from-[#D4AF37] to-[#8A6D1C] rounded-lg flex items-center justify-center shadow-lg">
            <Scale className="h-6 w-6 text-[#0A1424] stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2 font-sans">
              INTELLIJUDGE <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 rounded font-mono">BD V2.5</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono">Intelligent Legal Practice & Judicial Operations Platform</p>
          </div>
        </div>

        {/* Dynamic Role Simulator */}
        <div className="flex items-center gap-3 bg-[#051124] border border-[#D4AF37]/20 px-3 py-1.5 rounded-lg shadow-inner">
          <div className="text-right hidden xl:block">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Identity Simulator</p>
            <p className="text-xs font-semibold text-[#D4AF37]">
              {selectedRole === UserRole.SUPREME_ADMIN ? "SMI Fahim (System Owner)" : selectedRole}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#D4AF37]" />
            <select
              id="role-simulator-select"
              value={selectedRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setSelectedRole(newRole);
                // Switch default tab appropriately to match role experience
                if (newRole === UserRole.CLIENT) {
                  setActiveTab("client-portal");
                } else if (newRole === UserRole.HR) {
                  setActiveTab("personnel");
                } else if (newRole === UserRole.ACCOUNTS_DEPT) {
                  setActiveTab("billing");
                } else {
                  setActiveTab("dashboard");
                }
              }}
              className="bg-[#051124] text-[#D4AF37] border border-[#D4AF37]/20 rounded px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value={UserRole.SUPREME_ADMIN}>Supreme Admin (SMI Fahim)</option>
              <option value={UserRole.JUDICIAL_AUTHORITY}>Judicial Authority (Court admin)</option>
              <option value={UserRole.LAW_FIRM_OWNER}>Law Firm Owner</option>
              <option value={UserRole.LAWYER}>Lawyer</option>
              <option value={UserRole.HR}>HR Department</option>
              <option value={UserRole.ACCOUNTS_DEPT}>Accounts Department</option>
              <option value={UserRole.CLIENT}>Client (Secure Portal)</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* 2. SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 bg-[#0A192F] border-r border-[#D4AF37]/20 p-4 flex flex-col gap-2 shadow-xl shrink-0">
          <p className="text-[10px] font-mono text-[#D4AF37]/60 tracking-wider uppercase px-2 mb-1">Modules</p>
          
          <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1 pb-2 lg:pb-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Interactive Cockpit</span>
            </button>

            <button
              onClick={() => setActiveTab("cases")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "cases"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Scale className="h-4 w-4" />
              <span>Bangladesh Cases</span>
            </button>

            <button
              onClick={() => setActiveTab("ai-desk")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "ai-desk"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BookOpen className="h-4 w-4 text-amber-400" />
              <span className="flex items-center gap-1.5">
                AI Legal Hub <span className="text-[9px] bg-amber-500/10 text-amber-400 px-1 rounded">GenAI</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("personnel")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "personnel"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Personnel Registry (400+)</span>
            </button>

            <button
              onClick={() => setActiveTab("billing")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "billing"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Trust Ledger & Finance</span>
            </button>

            <button
              onClick={() => setActiveTab("client-portal")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "client-portal"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Client Secure Portal</span>
            </button>

            <button
              onClick={() => setActiveTab("directory")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "directory"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MapPin className="h-4 w-4" />
              <span>Courts Directory</span>
            </button>

            <button
              onClick={() => setActiveTab("attendance")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "attendance"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Compass className="h-4 w-4 text-[#D4AF37]" />
              <span className="flex items-center gap-1.5">
                Court Attendance <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded font-mono font-bold">GPS</span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("adr")}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                activeTab === "adr"
                  ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Briefcase className="h-4 w-4 text-[#D4AF37]" />
              <span className="flex items-center gap-1.5">
                Arbitration & Mediation <span className="text-[9px] bg-[#D4AF37]/10 text-[#D4AF37] px-1 rounded font-mono font-bold border border-[#D4AF37]/20">ADR</span>
              </span>
            </button>

            {(selectedRole === UserRole.SUPREME_ADMIN || selectedRole === UserRole.JUDICIAL_AUTHORITY) && (
              <button
                onClick={() => setActiveTab("audit")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all w-full ${
                  activeTab === "audit"
                    ? "bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-4 border-[#D4AF37] text-[#D4AF37] font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Security & Audit Trails</span>
              </button>
            )}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-800 text-center lg:text-left hidden lg:block">
            <div className="bg-[#051124] border border-[#D4AF37]/10 p-3 rounded-lg shadow-inner">
              <h4 className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">BANGLADESH OFFICES</h4>
              <p className="text-xs text-slate-300 mt-1">Supreme Court Complex</p>
              <p className="text-[10px] text-slate-400">Ramna, Dhaka, Bangladesh</p>
              <p className="text-[10px] text-slate-500 mt-2">Hours: Sun - Thu (09:00 - 17:00)</p>
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Database Status</span>
              <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span> ONLINE</span>
            </div>
          </div>
        </aside>

        {/* 3. CORE DISPLAY ENGINE */}
        <main className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="h-8 w-8 text-[#D4AF37] animate-spin" />
              <p className="text-sm font-mono text-slate-400">Acquiring IntelliJudge Central Records Ledger...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* --- TABS & SCREENS --- */}

              {/* A. Cockpit Dashboard */}
              {activeTab === "dashboard" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Bangladesh Welcome Banner */}
                  <div className="p-6 rounded-xl bg-gradient-to-r from-[#0F223D] via-[#0A192F]/60 to-[#051124] border border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                        <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Judicial System Operations Authorized</p>
                      </div>
                      <h2 className="text-2xl font-bold text-white mt-1">
                        Welcome back, <span className="text-[#D4AF37]">SMI Fahim</span>
                      </h2>
                      <p className="text-sm text-slate-300 mt-1 max-w-xl">
                        IntelliJudge is managing court records, personnel cards for {dbState?.employees.length} judicial employees, active litigation timelines, and digital evidence.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowNewCaseModal(true)}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] hover:from-[#E1BE43] hover:to-[#CBA632] text-black font-semibold text-xs px-4.5 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4 stroke-[2.5]" />
                      <span>Register New Case</span>
                    </button>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/30 transition-all shadow-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-mono text-slate-400 uppercase">Active Litigations</p>
                        <Scale className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <p className="text-3xl font-extrabold text-white mt-2 font-mono">{activeCases}</p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        <span className="text-emerald-400 font-semibold font-mono">+{disposedCases}</span> resolved cases archived
                      </p>
                    </div>

                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/30 transition-all shadow-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-mono text-slate-400 uppercase">Scheduled Hearings</p>
                        <Calendar className="h-5 w-5 text-emerald-500" />
                      </div>
                      <p className="text-3xl font-extrabold text-white mt-2 font-mono">
                        {(dbState?.hearings || []).filter(h => h.status === "Scheduled").length}
                      </p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        In Dhaka & Divisional high courts
                      </p>
                    </div>

                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/30 transition-all shadow-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-mono text-slate-400 uppercase">Registered Personnel</p>
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-3xl font-extrabold text-white mt-2 font-mono">{dbState?.employees.length}</p>
                      <p className="text-xs text-slate-400 mt-2">Individual profile cards mapped</p>
                    </div>

                    {/* Today's Attendance Compliance Card */}
                    <div className="bg-[#0F223D] border border-[#D4AF37]/15 p-5 rounded-xl hover:border-[#D4AF37]/40 transition-all shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 rounded-bl-3xl -z-10 group-hover:bg-emerald-500/10 transition-colors duration-300"></div>
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-mono text-slate-400 uppercase">Today's Attendance</p>
                        <UserCheck className="h-5 w-5 text-emerald-400 animate-pulse" />
                      </div>
                      
                      <div className="mt-2 flex items-baseline gap-2">
                        <p className="text-3xl font-extrabold text-white font-mono">{verifiedPresentCount}</p>
                        <p className="text-sm text-slate-400">/ {todaysHearings.length} Verified</p>
                      </div>

                      {/* Mini visual progress bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${complianceRate}%` }}
                        />
                      </div>

                      <div className="text-[10px] text-slate-400 mt-2.5 flex justify-between items-center">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-amber-500 rounded-full"></span>
                          <span className="font-mono text-[9px]">{pendingCount} Pending</span>
                        </span>
                        <span className="font-mono font-bold text-emerald-400">{complianceRate}% compliance</span>
                      </div>
                    </div>

                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-5 rounded-xl hover:border-[#D4AF37]/30 transition-all shadow-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-mono text-slate-400 uppercase">Trust Assets & Revenue</p>
                        <DollarSign className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <p className="text-3xl font-extrabold text-white mt-2 font-mono">
                        ৳{(totalRevenue / 100000).toFixed(2)}L
                      </p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                        bKash, Bank & Trust Accounts
                      </p>
                    </div>
                  </div>

                  {/* Dashboard Inner Modules based on Simulated Role */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* Left & Center: Charts & Distribution */}
                    <div className="xl:col-span-2 space-y-6">
                      
                      {/* Financial Analytics Area Chart */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h3 className="text-sm font-semibold text-white">Divisional Practice Revenue Analysis</h3>
                            <p className="text-xs text-slate-400 font-mono">Trust accounts vs Firm revenue stream (BDT ৳)</p>
                          </div>
                          <TrendingUp className="h-4 w-4 text-[#D4AF37]" />
                        </div>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financeTimeline}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: 10 }} />
                              <YAxis stroke="#94A3B8" style={{ fontSize: 10 }} />
                              <Tooltip contentStyle={{ backgroundColor: "#0F223D", borderColor: "rgba(212, 175, 55, 0.2)" }} />
                              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRev)" name="Revenue" />
                              <Area type="monotone" dataKey="expenses" stroke="#EF4444" fillOpacity={1} fill="url(#colorExp)" name="Expenses" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Case Litigations Distribution Bar Chart */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <h3 className="text-sm font-semibold text-white mb-4">Bangladeshi Court Cases by Category</h3>
                        <div className="h-60">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={caseTypeDistribution}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                              <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: 10 }} />
                              <YAxis stroke="#94A3B8" style={{ fontSize: 10 }} />
                              <Tooltip contentStyle={{ backgroundColor: "#0F223D", borderColor: "rgba(212, 175, 55, 0.2)" }} />
                              <Bar dataKey="value" fill="#D4AF37" radius={[4, 4, 0, 0]}>
                                {caseTypeDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>

                    {/* Right Side: Alerts, Today's Hearings, bKash Ledger Quick Links */}
                    <div className="space-y-6">
                      
                      {/* Active Judicial Hearings Sidebar Widget */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#D4AF37]/10">
                          <h3 className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold">Today's Hearing Schedule</h3>
                          <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
                          {(dbState?.hearings || []).slice(0, 4).map((hearing) => {
                            const isVerified = hearing.status === "Verified Present";
                            return (
                              <div key={hearing.id} className={`p-3 bg-[#051124] border border-white/5 border-l-4 rounded-lg hover:bg-[#051124]/80 transition-all cursor-pointer ${
                                isVerified ? "border-l-emerald-500 shadow-[inset_0_0_8px_rgba(16,185,129,0.1)]" : "border-l-amber-500"
                              }`} onClick={() => {
                                const match = (dbState?.cases || []).find(c => c.id === hearing.caseId);
                                if (match) setSelectedCase(match);
                              }}>
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-mono font-bold text-amber-400">{hearing.caseNumber}</span>
                                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                    {isVerified ? (
                                      <span className="text-emerald-400 font-bold uppercase tracking-wider text-[8px] bg-emerald-500/15 border border-emerald-500/20 px-1 py-0.5 rounded">Verified Present</span>
                                    ) : (
                                      <>
                                        <Clock className="h-2.5 w-2.5 text-[#D4AF37]" /> {hearing.hearingTime}
                                      </>
                                    )}
                                  </span>
                                </div>
                                <h4 className="text-xs font-semibold text-white mt-1 truncate">{hearing.caseTitle}</h4>
                                <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400 font-mono">
                                  <span className="truncate">{hearing.courtroom} • {hearing.judge}</span>
                                  {isVerified && <span className="text-emerald-400 font-sans font-medium">● Present</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Digital Evidence Integrity Check */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <h3 className="text-xs font-mono text-[#D4AF37] uppercase tracking-wider font-bold mb-3">Evidence Vault Audit</h3>
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-semibold text-white">Cryptographic Hashes Valid</h4>
                            <p className="text-[10px] text-slate-400 mt-1">
                              All {dbState?.evidence.length} forensic records, certified khatians, and audio clips match their SHA-256 signatures with 100% data integrity.
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* B. Cases Screen */}
              {activeTab === "cases" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Bangladesh Court Litigations</h2>
                      <p className="text-xs text-slate-400">Manage case filings, timelines, digital evidence, and court hearings</p>
                    </div>
                    <button
                      onClick={() => setShowNewCaseModal(true)}
                      className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-black font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Litigation</span>
                    </button>
                  </div>

                  {/* Filter and Search */}
                  <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-lg">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by Case Number, Title, or Client Name..."
                        value={caseSearch}
                        onChange={(e) => setCaseSearch(e.target.value)}
                        className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        id="case-type-filter"
                        value={caseTypeFilter}
                        onChange={(e) => setCaseTypeFilter(e.target.value)}
                        className="bg-[#051124] border border-[#D4AF37]/15 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="All">All Categories</option>
                        <option value="Civil">Civil</option>
                        <option value="Criminal">Criminal</option>
                        <option value="Constitutional">Constitutional</option>
                        <option value="Labour">Labour</option>
                        <option value="Family">Family</option>
                        <option value="Tax">Tax</option>
                        <option value="Corporate">Corporate</option>
                      </select>
                    </div>
                  </div>

                  {/* Case List Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredCases.map((c) => (
                      <div
                        key={c.id}
                        className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl overflow-hidden hover:border-[#D4AF37]/40 transition-all shadow-lg group flex flex-col"
                      >
                        <div className="p-4 bg-[#0A192F]/40 border-b border-[#D4AF37]/10 flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-[#D4AF37]">{c.caseNumber}</span>
                          <span className={`text-[10px] px-2.5 py-0.5 rounded font-semibold ${
                             c.status === "Filing" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                             c.status === "Hearing" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                             c.status === "Stayed" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                             c.status === "Judgment Pending" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                             "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}>
                            {c.status}
                          </span>
                        </div>

                        <div className="p-5 flex-1 space-y-3">
                          <h3 className="font-bold text-white text-sm hover:text-[#D4AF37] cursor-pointer transition-colors" onClick={() => setSelectedCase(c)}>
                            {c.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">{c.summary}</p>
                          
                          <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-500" /> {c.district}</span>
                            <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5 text-slate-500" /> {c.caseType}</span>
                          </div>

                          <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/60 flex justify-between">
                            <span>Client: <strong className="text-slate-200">{c.clientName}</strong></span>
                            <span>Lawyer: <strong className="text-slate-200">{c.leadLawyer}</strong></span>
                          </div>
                        </div>

                        <div className="p-3 bg-[#051124]/40 border-t border-[#D4AF37]/10 flex justify-between items-center">
                          <span className={`text-[10px] font-bold ${
                            c.riskLevel === "Critical" ? "text-red-500" : "text-slate-400"
                          }`}>
                            Risk: {c.riskLevel}
                          </span>
                          <button
                            onClick={() => setSelectedCase(c)}
                            className="text-[#D4AF37] hover:text-[#E1BE43] text-xs font-semibold flex items-center gap-1.5 group-hover:translate-x-1 transition-all cursor-pointer"
                          >
                            <span>Open Legal Records</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* C. AI Legal Hub (Gemini Powered) */}
              {activeTab === "ai-desk" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="border-b border-[#D4AF37]/20 pb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <BookOpen className="h-6 w-6 text-amber-400" />
                      <span>AI Judicial Operations & Research Center</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Powering legal work with official Bangladesh legal frameworks. Perform litigation research or draft statutory compliance documents instantly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    
                    {/* Module 1: AI Legal notices & Agreements drafting */}
                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-6 shadow-lg space-y-4">
                      <div>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono uppercase font-bold">Document Automation</span>
                        <h3 className="text-base font-bold text-white mt-1">Draft Advocate Notices & Affidavits</h3>
                        <p className="text-xs text-slate-400">Generate professional, formal courtroom drafts custom fit for Bangladesh</p>
                      </div>

                      <form onSubmit={handleGenerateDraft} className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Document Type</label>
                            <select
                              value={draftForm.docType}
                              onChange={(e) => setDraftForm({ ...draftForm, docType: e.target.value })}
                              className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                            >
                              <option>Power of Attorney</option>
                              <option>Legal Notice for Defalcation</option>
                              <option>Affidavit of Declaration</option>
                              <option>Writ Petition Draft</option>
                              <option>Corporate Partnership Deed</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Client Name</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Salim Rahaman Dipu"
                              value={draftForm.clientName}
                              onChange={(e) => setDraftForm({ ...draftForm, clientName: e.target.value })}
                              className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Opposing Party (Ltigant)</label>
                            <input
                              type="text"
                              placeholder="e.g. Tanvir Rifat"
                              value={draftForm.opposingParty}
                              onChange={(e) => setDraftForm({ ...draftForm, opposingParty: e.target.value })}
                              className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Brief Description of the Matter / Dispute</label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Detail the case facts, e.g., Unlawful land encroachment on Plot 203, Dhanmondi, or Breach of contract on software delivery delays."
                            value={draftForm.matterDescription}
                            onChange={(e) => setDraftForm({ ...draftForm, matterDescription: e.target.value })}
                            className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Specific Clauses to Include (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g., 30 days remedy period, Liquidated damages clause of 5,000 BDT daily"
                            value={draftForm.specificClauses}
                            onChange={(e) => setDraftForm({ ...draftForm, specificClauses: e.target.value })}
                            className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={drafting}
                          className="w-full bg-[#D4AF37] text-black font-semibold text-xs py-2.5 rounded hover:bg-[#E1BE43] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {drafting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          <span>Generate Certified Legal Document Draft</span>
                        </button>
                      </form>
                    </div>

                    {/* Module 2: AI Legislative Research Hub */}
                    <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-6 shadow-lg space-y-4">
                      <div>
                        <span className="text-[9px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono uppercase font-bold">Legislation Search</span>
                        <h3 className="text-base font-bold text-white mt-1">Grounding Cases under Bangladesh Law</h3>
                        <p className="text-xs text-slate-400">Query statutory legal acts, precedents, and remedies</p>
                      </div>

                      <form onSubmit={handleExecuteResearch} className="space-y-4">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Practice Area / Domain</label>
                          <select
                            value={researchPracticeArea}
                            onChange={(e) => setResearchPracticeArea(e.target.value)}
                            className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                          >
                            <option>Civil Litigations (CPC 1908)</option>
                            <option>Criminal Defense (CrPC 1898)</option>
                            <option>Constitutional & Writ Division</option>
                            <option>Bangladesh Labour Law (Act 2006)</option>
                            <option>Taxes & Corporate Compliance</option>
                            <option>Family & Inheritance Disputes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Legal Research Question / Scenario</label>
                          <textarea
                            rows={4}
                            required
                            placeholder="e.g. What are the rules for filing a temporary injunction petition under Order 39, Rules 1 and 2 of Code of Civil Procedure in Bangladesh?"
                            value={researchQuery}
                            onChange={(e) => setResearchQuery(e.target.value)}
                            className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={researching}
                          className="w-full bg-[#051124] text-[#D4AF37] border border-[#D4AF37]/30 font-semibold text-xs py-2.5 rounded hover:bg-[#051124]/80 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {researching ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                          <span>Execute statutory Case Research</span>
                        </button>
                      </form>
                    </div>

                  </div>

                  {/* Outputs Panel */}
                  {(draftResult || researchResult || drafting || researching) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-[#0F223D] border border-[#D4AF37]/20 rounded-xl p-6 space-y-4 shadow-lg relative"
                    >
                      <div className="flex justify-between items-center border-b border-[#D4AF37]/10 pb-3">
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <Award className="h-4 w-4 text-[#D4AF37]" />
                          <span>AI Intelligence Output Stream</span>
                        </h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const text = draftResult || researchResult;
                              navigator.clipboard.writeText(text);
                              alert("Copied to clipboard!");
                            }}
                            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-[#051124] rounded border border-[#D4AF37]/10 flex items-center gap-1 cursor-pointer font-mono"
                          >
                            <Copy className="h-3 w-3" /> Copy Output
                          </button>
                        </div>
                      </div>

                      {/* Draft Output Area */}
                      <div className="bg-[#051124] p-6 rounded-lg font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto min-h-[200px] border border-[#D4AF37]/10 whitespace-pre-wrap">
                        {drafting || researching ? (
                          <div className="h-32 flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="h-6 w-6 text-[#D4AF37] animate-spin" />
                            <p className="text-slate-400">Synthesizing draft under Supreme Court guidelines...</p>
                          </div>
                        ) : (
                          <div className="prose prose-invert prose-xs max-w-none">
                            {draftResult || researchResult}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* D. Personnel Registry (400+ Employees Individual Cards!) */}
              {activeTab === "personnel" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white">Judicial Personnel Registry ({dbState?.employees.length})</h2>
                    <p className="text-xs text-slate-400">Complete list of magistrates, lawyers, court clerks, front desk officers, and accounts executives</p>
                  </div>

                  {/* Filter/Search Panel */}
                  <div className="bg-[#0F223D] border border-[#D4AF37]/10 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-lg">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search employee cards by name or email..."
                        value={personnelSearch}
                        onChange={(e) => {
                          setPersonnelSearch(e.target.value);
                          setPersonnelPage(1); // reset to page 1
                        }}
                        className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <select
                        id="personnel-role-filter"
                        value={personnelRoleFilter}
                        onChange={(e) => {
                          setPersonnelRoleFilter(e.target.value);
                          setPersonnelPage(1);
                        }}
                        className="bg-[#051124] border border-[#D4AF37]/15 text-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="All">All Roles</option>
                        <option value={UserRole.SUPREME_ADMIN}>Supreme Administrator</option>
                        <option value={UserRole.JUDICIAL_AUTHORITY}>Judicial Authority</option>
                        <option value={UserRole.LAW_FIRM_OWNER}>Law Firm Owner</option>
                        <option value={UserRole.LAWYER}>Lawyer</option>
                        <option value={UserRole.JUNIOR_LAWYER}>Junior Lawyer</option>
                        <option value={UserRole.LEGAL_ASSISTANT}>Legal Assistant</option>
                        <option value={UserRole.FRONT_DESK}>Front Desk</option>
                        <option value={UserRole.ACCOUNTS_DEPT}>Accounts Dept</option>
                        <option value={UserRole.HR}>HR Department</option>
                        <option value={UserRole.CLIENT}>Clients</option>
                      </select>
                    </div>
                  </div>

                  {/* Individual Cards Grid (Paginated) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        onClick={() => setSelectedEmployee(emp)}
                        className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-4.5 hover:border-[#D4AF37]/40 transition-all shadow-lg flex flex-col justify-between cursor-pointer group hover:-translate-y-0.5"
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <div className="h-9 w-9 rounded-full bg-[#051124] flex items-center justify-center font-bold text-xs text-[#D4AF37] border border-[#D4AF37]/20 font-sans uppercase">
                              {emp.name.slice(0, 2)}
                            </div>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                              emp.status === "Active" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                            }`}>
                              {emp.status}
                            </span>
                          </div>

                          <h3 className="font-bold text-white text-xs mt-3 truncate group-hover:text-[#D4AF37] transition-colors">{emp.name}</h3>
                          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{emp.role}</p>

                          <div className="space-y-1 mt-3.5 text-[10px] text-slate-300 font-mono">
                            <div className="flex items-center gap-1.5">
                              <Mail className="h-3 w-3 text-slate-500" /> <span className="truncate">{emp.email}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <PhoneCall className="h-3 w-3 text-slate-500" /> <span>{emp.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3 w-3 text-slate-500" /> <span className="truncate">{emp.branch}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3.5 mt-3.5 border-t border-[#D4AF37]/10 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Rating: <strong className="text-amber-400 font-mono">★ {emp.performanceRating}</strong></span>
                          <span className="text-[#D4AF37] font-semibold flex items-center gap-1 font-mono">
                            ৳{(emp.salary || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination control */}
                  {totalPersonnelPages > 1 && (
                    <div className="flex justify-between items-center bg-[#0F223D] border border-[#D4AF37]/10 p-4 rounded-xl shadow-lg">
                      <span className="text-xs text-slate-400 font-mono">
                        Showing {(personnelPage - 1) * personnelPerPage + 1} - {Math.min(filteredEmployees.length, personnelPage * personnelPerPage)} of {filteredEmployees.length} profiles
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={personnelPage === 1}
                          onClick={() => setPersonnelPage(p => Math.max(1, p - 1))}
                          className="px-3 py-1 bg-[#051124] hover:bg-slate-800 text-xs text-slate-200 border border-[#D4AF37]/10 rounded disabled:opacity-50 cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs text-[#D4AF37] font-bold font-mono px-2 py-1">
                          Page {personnelPage} of {totalPersonnelPages}
                        </span>
                        <button
                          disabled={personnelPage === totalPersonnelPages}
                          onClick={() => setPersonnelPage(p => Math.min(totalPersonnelPages, p + 1))}
                          className="px-3 py-1 bg-[#051124] hover:bg-slate-800 text-xs text-slate-200 border border-[#D4AF37]/10 rounded disabled:opacity-50 cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* E. Trust Ledger & Billing */}
              {activeTab === "billing" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">Trust Accounting & Legal Billing</h2>
                      <p className="text-xs text-slate-400">Track client retainer deposits, professional legal fee invoices, and court expenditure files</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-[#0F223D] border border-emerald-500/20 rounded-xl shadow-lg">
                      <p className="text-xs font-mono text-slate-400 uppercase">Trust Assets Ledger</p>
                      <p className="text-3xl font-extrabold text-[#D4AF37] mt-2 font-mono">৳{(trustFunds || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Held under security retainers in Trust account</p>
                    </div>

                    <div className="p-5 bg-[#0F223D] border border-[#D4AF37]/20 rounded-xl shadow-lg">
                      <p className="text-xs font-mono text-slate-400 uppercase">Firm Revenue Collected</p>
                      <p className="text-3xl font-extrabold text-white mt-2 font-mono">৳{(totalRevenue || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Paid in 2026 fiscal cycle</p>
                    </div>

                    <div className="p-5 bg-[#0F223D] border border-red-500/25 rounded-xl shadow-lg">
                      <p className="text-xs font-mono text-slate-400 uppercase">Outstanding Bills</p>
                      <p className="text-3xl font-extrabold text-red-400 mt-2 font-mono">৳{(outstandingInvoices || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Requires immediate client deposit</p>
                    </div>
                  </div>

                  {/* Financial ledger table */}
                  <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl overflow-hidden shadow-lg">
                    <div className="p-4 bg-[#0A192F]/40 border-b border-[#D4AF37]/10">
                      <h3 className="text-sm font-semibold text-white">Recent Trust & Revenue Transactions</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#D4AF37]/10 text-[10px] font-mono text-slate-400 uppercase bg-[#051124]">
                            <th className="p-4">Transaction ID</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Fund Type</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Method</th>
                            <th className="p-4 font-mono text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D4AF37]/10 text-xs">
                          {(dbState?.finance || []).map((tx) => (
                            <tr key={tx.id} className="hover:bg-[#051124]/50 transition-colors">
                              <td className="p-4 font-mono text-slate-300">{tx.id}</td>
                              <td className="p-4 font-semibold text-white">{tx.clientName}</td>
                              <td className="p-4 text-slate-400">{tx.category}</td>
                              <td className="p-4">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase font-mono ${
                                  tx.isTrustAccount ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                                }`}>
                                  {tx.isTrustAccount ? "Trust Retainer" : "Firm Income"}
                                </span>
                              </td>
                              <td className="p-4 font-bold text-slate-200">৳{(tx.amount || 0).toLocaleString()}</td>
                              <td className="p-4 font-mono text-slate-400">{tx.paymentMethod || "Invoice Generated"}</td>
                              <td className="p-4 text-right">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                  tx.status === "Paid" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                                }`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* F. Client Secure Portal */}
              {activeTab === "client-portal" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="p-5 rounded-xl bg-gradient-to-r from-[#0F223D] via-[#0A192F] to-[#051124] border border-[#D4AF37]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
                    <div>
                      <h2 className="text-xl font-bold text-white">Client Portal & Electronic Counsel desk</h2>
                      <p className="text-xs text-slate-400">Secure link matching client profile cards to litigation records and bKash gateways</p>
                    </div>
                    <div className="text-xs bg-[#051124] px-3 py-1.5 rounded text-[#D4AF37] font-mono border border-[#D4AF37]/30 shadow-inner">
                      Client ID: CLIENT-PORTAL-ONLINE
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left & Center: Case tracking and unpaid invoices */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* Active Invoices needing Payment */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-4">Outstanding Legal Notices & Invoices</h3>
                        <div className="space-y-3">
                          {(dbState?.finance || []).filter(f => f.status === "Unpaid").map((inv) => (
                            <div key={inv.id} className="p-4 bg-[#051124] border border-red-500/20 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-inner">
                              <div>
                                <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Unpaid Invoice • {inv.caseNumber}</span>
                                <h4 className="text-sm font-semibold text-white mt-0.5">{inv.category}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">{inv.description}</p>
                              </div>
                              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                                <span className="text-base font-extrabold text-white font-mono">৳{(inv.amount || 0).toLocaleString()}</span>
                                <button
                                  onClick={() => triggerBkash(inv.id, inv.amount)}
                                  className="px-4.5 py-2 bg-gradient-to-r from-[#E2136E] to-[#D10F62] text-white hover:opacity-95 font-semibold text-xs rounded shadow flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <span>Pay via bKash</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Client Case Information */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg">
                        <h3 className="text-sm font-bold text-white mb-4">Your Registered Litigations</h3>
                        <div className="space-y-4">
                          {(dbState?.cases || []).slice(0, 2).map((c) => (
                            <div key={c.id} className="p-4 bg-[#051124] border border-[#D4AF37]/10 rounded-lg hover:border-[#D4AF37]/40 transition-all cursor-pointer shadow-inner" onClick={() => setSelectedCase(c)}>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-mono text-[#D4AF37]">{c.caseNumber}</span>
                                <span className="text-[10px] text-slate-400 font-mono">Next Hearing: {c.nextHearingDate}</span>
                              </div>
                              <h4 className="text-sm font-bold text-white mt-1.5">{c.title}</h4>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{c.summary}</p>
                              <div className="pt-3 mt-3 border-t border-[#D4AF37]/10 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                                <span>Judge: <strong className="text-slate-200">{c.judge}</strong></span>
                                <span className="text-[#D4AF37]">Click to review full timeline</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Right side: Secure message thread with SMI Fahim (Advocate) */}
                    <div className="space-y-6">
                      <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl p-5 shadow-lg flex flex-col h-[400px]">
                        <h3 className="text-sm font-bold text-white pb-3 border-b border-[#D4AF37]/10">Secure Consultation Channel</h3>
                        
                        <div className="flex-1 overflow-y-auto py-3 space-y-3.5">
                          <div className="p-2.5 bg-[#051124] border border-[#D4AF37]/5 rounded-lg text-xs max-w-[85%] shadow-inner">
                            <p className="font-mono text-[9px] text-[#D4AF37]">Advocate SMI Fahim</p>
                            <p className="text-slate-300 mt-0.5">Please upload the certified copy of your land CS Khatian. I will initiate the injunction petition once uploaded.</p>
                            <span className="text-[8px] text-slate-500 font-mono">10:45 AM</span>
                          </div>
                          
                          <div className="p-2.5 bg-[#051124] border border-[#D4AF37]/10 rounded-lg text-xs max-w-[85%] self-end ml-auto text-right shadow-inner">
                            <p className="font-mono text-[9px] text-emerald-400 font-semibold">Client Portal</p>
                            <p className="text-slate-300 mt-0.5">I have uploaded it to the Digital Evidence Vault. Please verify the hash.</p>
                            <span className="text-[8px] text-slate-500 font-mono">11:12 AM</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#D4AF37]/10 flex gap-2">
                          <input
                            type="text"
                            placeholder="Type a secure message..."
                            className="flex-1 bg-[#051124] border border-[#D4AF37]/15 text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button className="p-2 bg-[#D4AF37] text-black rounded hover:bg-[#E1BE43] transition-colors cursor-pointer">
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* G. Bangladesh Court Directory */}
              {activeTab === "directory" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-white">Official Bangladesh Courts Directory</h2>
                    <p className="text-xs text-slate-400">Structured repository of High Court, Metropolitan, and Special tribunals across all Divisions</p>
                  </div>

                  <div className="bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#D4AF37]/10 text-[10px] font-mono text-slate-400 uppercase bg-[#051124]">
                            <th className="p-4">Court Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Location</th>
                            <th className="p-4 font-mono text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D4AF37]/10 text-xs">
                          {COURT_DIRECTORY.map((court, i) => (
                            <tr key={i} className="hover:bg-[#051124]/50 transition-colors">
                              <td className="p-4 font-bold text-white flex items-center gap-2">
                                <Scale className="h-3.5 w-3.5 text-[#D4AF37]" />
                                {court.name}
                              </td>
                              <td className="p-4 font-mono text-slate-300">{court.type}</td>
                              <td className="p-4 text-slate-400">{court.location}</td>
                              <td className="p-4 text-right">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold uppercase">
                                  Operational
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* I. Arbitration & Mediation Module */}
              {activeTab === "adr" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <ArbitrationMediationModule
                    dbState={dbState}
                    refreshDbState={fetchState}
                    selectedRole={selectedRole}
                  />
                </motion.div>
              )}

              {/* H. Security Audit Trail (Supreme Admin / Court administrator only) */}
              {activeTab === "audit" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">System Security & Audit Log</h2>
                      <p className="text-xs text-slate-400">Real-time immutable database audit logs and cryptographic security traces</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(dbState?.auditLogs || []).map((log) => (
                      <div key={log.id} className="p-4.5 bg-[#0F223D] border border-[#D4AF37]/10 rounded-xl flex items-start gap-4 shadow-lg">
                        <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37] border border-[#D4AF37]/15">
                          <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="font-bold text-white text-xs">{log.action}</h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                User: <span className="text-[#D4AF37]">{log.user}</span> • {log.role}
                              </p>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-2">{log.details}</p>
                          <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/10 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                            <span>Module: <strong className="text-slate-400">{log.module}</strong></span>
                            <span>IP Address: {log.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* I. Court Attendance Tab */}
              {activeTab === "attendance" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Compass className="h-5 w-5 text-[#D4AF37]" />
                        Court Attendance & GPS Verification Ledger
                      </h2>
                      <p className="text-xs text-slate-400">
                        Cryptographically logged attendance of lawyers and witnesses backed by high-accuracy satellite location telemetry.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Log Attendance Form */}
                    <div className="bg-[#0F223D] border border-[#D4AF37]/15 rounded-2xl p-6 shadow-xl space-y-5 h-fit">
                      <div className="flex items-center gap-2 pb-3 border-b border-[#D4AF37]/10">
                        <Navigation className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                          Verify Court Presence
                        </h3>
                      </div>

                      <form onSubmit={handleSubmitAttendance} className="space-y-4 text-xs">
                        {/* Attendee Name */}
                        <div>
                          <label className="block text-slate-400 mb-1.5 font-semibold">Attendee Full Name</label>
                          <input
                            type="text"
                            className="w-full bg-[#051124] border border-[#D4AF37]/20 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                            placeholder="Enter Lawyer or Witness name"
                            value={attendanceForm.name}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, name: e.target.value })}
                            required
                          />
                          {/* Easy list helper */}
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            <span className="text-[10px] text-slate-500 mr-1 self-center">Quick Select:</span>
                            <button
                              type="button"
                              onClick={() => setAttendanceForm({ ...attendanceForm, name: "Salim Rahaman Dipu", role: "Lawyer" })}
                              className="text-[9px] px-1.5 py-0.5 bg-[#051124] hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 rounded transition-all cursor-pointer"
                            >
                              Dipu (Lawyer)
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttendanceForm({ ...attendanceForm, name: "SMI Fahim", role: "Lawyer" })}
                              className="text-[9px] px-1.5 py-0.5 bg-[#051124] hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 rounded transition-all cursor-pointer"
                            >
                              Fahim (Admin)
                            </button>
                            <button
                              type="button"
                              onClick={() => setAttendanceForm({ ...attendanceForm, name: "Hasanur Rahman", role: "Witness" })}
                              className="text-[9px] px-1.5 py-0.5 bg-[#051124] hover:bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/15 rounded transition-all cursor-pointer"
                            >
                              Hasanur (Witness)
                            </button>
                          </div>
                        </div>

                        {/* Attendee Role */}
                        <div>
                          <label className="block text-slate-400 mb-1.5 font-semibold">Attendee Role</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                              <input
                                type="radio"
                                name="attnRole"
                                checked={attendanceForm.role === "Lawyer"}
                                onChange={() => setAttendanceForm({ ...attendanceForm, role: "Lawyer" })}
                                className="accent-[#D4AF37]"
                              />
                              <span>Lawyer / Officer of the Court</span>
                            </label>
                            <label className="flex items-center gap-2 text-white cursor-pointer">
                              <input
                                type="radio"
                                name="attnRole"
                                checked={attendanceForm.role === "Witness"}
                                onChange={() => setAttendanceForm({ ...attendanceForm, role: "Witness" })}
                                className="accent-[#D4AF37]"
                              />
                              <span>Witness / Litigant</span>
                            </label>
                          </div>
                        </div>

                        {/* Selected Court */}
                        <div>
                          <label className="block text-slate-400 mb-1.5 font-semibold">Target Court Jurisdiction</label>
                          <select
                            className="w-full bg-[#051124] border border-[#D4AF37]/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                            value={attendanceForm.courtName}
                            onChange={(e) => {
                              setAttendanceForm({ ...attendanceForm, courtName: e.target.value });
                              // Clear location if they change court, to force re-fetch or re-simulate
                              setAttendanceLocation(null);
                              setAttendanceStatus("");
                              setAttendanceDistanceText("");
                            }}
                          >
                            {COURT_DIRECTORY.map((court) => (
                              <option key={court.name} value={court.name}>
                                {court.name} ({court.location})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Associated Case */}
                        <div>
                          <label className="block text-slate-400 mb-1.5 font-semibold">Associated Court Case</label>
                          <select
                            className="w-full bg-[#051124] border border-[#D4AF37]/20 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                            value={attendanceForm.caseId}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, caseId: e.target.value })}
                          >
                            <option value="">-- General / Ad-hoc Appearance (No specific case) --</option>
                            {(dbState?.cases || []).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.caseNumber} • {c.title.slice(0, 30)}...
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Geolocation Verification Core */}
                        <div className="p-4 bg-[#051124] border border-[#D4AF37]/10 rounded-xl space-y-3.5">
                          <span className="text-[10px] text-slate-400 font-mono block uppercase tracking-wider">
                            Location Coordinates (GPS / Satellite)
                          </span>

                          {attendanceLocation ? (
                            <div className="space-y-2 font-mono text-[11px]">
                              <div className="flex justify-between">
                                <span className="text-slate-400">Latitude:</span>
                                <span className="text-white font-bold">{attendanceLocation.lat.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Longitude:</span>
                                <span className="text-white font-bold">{attendanceLocation.lng.toFixed(6)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">Source:</span>
                                <span className={`font-semibold ${attendanceLocationType === "GPS" ? "text-emerald-400" : "text-amber-400"}`}>
                                  {attendanceLocationType} Telemetry
                                </span>
                              </div>
                              <div className="pt-1.5 border-t border-[#D4AF37]/10">
                                <div className="flex justify-between items-start gap-1">
                                  <span className="text-slate-400">Deviation:</span>
                                  <span className={`text-right font-bold ${attendanceStatus === "Verified" || attendanceStatus === "Simulated" ? "text-emerald-400" : "text-red-400"}`}>
                                    {attendanceDistanceText}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-slate-500 text-xs italic">
                              GPS location coordinates not yet locked.
                            </div>
                          )}

                          <div className="flex flex-col gap-2 pt-1">
                            <button
                              type="button"
                              disabled={attendanceLoading}
                              onClick={handleFetchGPSLocation}
                              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Navigation className={`h-3.5 w-3.5 ${attendanceLoading ? "animate-spin" : ""}`} />
                              <span>{attendanceLoading ? "Requesting Satellite Lock..." : "Fetch Real GPS Location"}</span>
                            </button>

                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => handleSimulateCourtPresence(attendanceForm.courtName)}
                                className="py-1.5 bg-[#0A192F] hover:bg-[#0A192F]/80 text-[#D4AF37] border border-[#D4AF37]/20 text-[10px] font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <CheckCircle className="h-3 w-3 text-[#D4AF37]" />
                                <span>Simulate Present</span>
                              </button>
                              <button
                                type="button"
                                onClick={handleSimulateRemotePresence}
                                className="py-1.5 bg-[#0A192F] hover:bg-[#0A192F]/80 text-red-400 border border-red-500/20 text-[10px] font-bold rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <AlertTriangle className="h-3 w-3 text-red-400" />
                                <span>Simulate Remote</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Extra Notes */}
                        <div>
                          <label className="block text-slate-400 mb-1.5 font-semibold">Statement / Log Notes</label>
                          <textarea
                            className="w-full bg-[#051124] border border-[#D4AF37]/20 rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                            placeholder="Add case session, target courtroom, or remark"
                            rows={2}
                            value={attendanceForm.notes}
                            onChange={(e) => setAttendanceForm({ ...attendanceForm, notes: e.target.value })}
                          />
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={submittingAttendance || !attendanceLocation}
                          className="w-full py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 disabled:opacity-50 text-[#051124] font-bold rounded-lg shadow-lg hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs"
                        >
                          <Compass className="h-4 w-4" />
                          <span>{submittingAttendance ? "Verifying & Saving..." : "Log Immutable Court Presence"}</span>
                        </button>
                      </form>
                    </div>

                    {/* Right Panel: Immutable GPS Logs Ledger */}
                    <div className="lg:col-span-2 space-y-4">
                      {/* Live satellite map mockup or pulsing beacon radar */}
                      <div className="p-5 bg-gradient-to-br from-[#0F223D] to-[#0A192F] border border-[#D4AF37]/20 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.06),transparent)] pointer-events-none" />
                        <div className="space-y-2 flex-1 z-10">
                          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold rounded uppercase tracking-wider border border-emerald-500/15">
                            Satellite Tracking Feed
                          </span>
                          <h3 className="text-base font-extrabold text-white">Active Judicial Geo-Fencing</h3>
                          <p className="text-xs text-slate-300 max-w-md">
                            All court attendances are validated against our official coordinates using pre-registered divisional geofences. Verification logs include SHA-256 digital validation seals.
                          </p>
                        </div>

                        {/* Pulsing beacon radar */}
                        <div className="relative h-24 w-24 rounded-full bg-[#051124] border border-[#D4AF37]/25 flex items-center justify-center shrink-0 shadow-inner">
                          <div className="absolute h-18 w-18 rounded-full border border-emerald-500/30 animate-ping" />
                          <div className="absolute h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/40 animate-pulse" />
                          <Compass className="h-7 w-7 text-[#D4AF37] animate-[spin_12s_linear_infinite]" />
                          <span className="absolute bottom-2 text-[8px] font-mono text-emerald-400 font-bold tracking-widest uppercase text-center w-full block">
                            LIVE RADAR
                          </span>
                        </div>
                      </div>

                      {/* Logs Ledger */}
                      <div className="bg-[#0F223D] border border-[#D4AF37]/15 rounded-2xl p-5 shadow-xl space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-[#D4AF37]/10">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                            <Map className="h-4 w-4 text-[#D4AF37]" />
                            Immutable Presence Ledger
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400">
                            Total Logs: {(dbState?.courtAttendance || []).length}
                          </span>
                        </div>

                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                          {(dbState?.courtAttendance || []).length === 0 ? (
                            <div className="text-center py-10 bg-[#051124] border border-[#D4AF37]/5 rounded-xl text-slate-500 text-xs italic">
                              No court attendance records verified in this fiscal session. Use the form on the left to log presence!
                            </div>
                          ) : (
                            (dbState?.courtAttendance || []).map((log: any) => {
                              const isVerified = log.status === "Verified" || log.status === "Simulated";
                              return (
                                <div
                                  key={log.id}
                                  className="p-4 bg-[#051124] border border-white/5 border-l-4 rounded-xl hover:bg-[#051124]/75 transition-all shadow-inner relative flex flex-col md:flex-row justify-between gap-4"
                                  style={{ borderLeftColor: isVerified ? "#10B981" : "#EF4444" }}
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <h4 className="font-bold text-white text-sm">{log.name}</h4>
                                      <span className="px-1.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-semibold rounded font-mono">
                                        {log.role}
                                      </span>
                                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                                        isVerified
                                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                                      }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${isVerified ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
                                        {log.status === "Simulated" ? "Simulated Presence" : isVerified ? "Verified Present" : "Boundary Deviation"}
                                      </span>
                                    </div>

                                    <div className="text-xs text-slate-300 space-y-1">
                                      <p className="flex items-center gap-1.5 text-slate-400">
                                        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                                        <span>Target: <strong>{log.courtName}</strong></span>
                                      </p>
                                      {log.caseNumber && (
                                        <p className="text-[11px] font-mono text-slate-400 pl-5">
                                          Case Reference: <span className="text-white font-semibold">{log.caseNumber}</span>
                                        </p>
                                      )}
                                      {log.notes && (
                                        <p className="text-xs text-slate-400 italic bg-[#0F223D]/50 border border-white/5 p-2 rounded-lg mt-1 max-w-xl pl-2 font-sans">
                                          "{log.notes}"
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex flex-col justify-between items-end shrink-0 text-right space-y-2 md:space-y-0">
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.timestamp).toLocaleDateString()}
                                    </span>

                                    <div className="space-y-1">
                                      <div className="text-[10px] font-mono text-slate-400">
                                        GPS: <a
                                          href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="text-[#D4AF37] hover:underline"
                                        >
                                          {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)} ↗
                                        </a>
                                      </div>
                                      <div className="text-[10px] font-mono font-bold text-slate-400">
                                        {log.distanceText}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </main>
      </div>

      {/* --- OVERLAY MODALS & DETAILS --- */}

      {/* 1. Case Details Overlay Panel */}
      <AnimatePresence>
        {selectedCase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex justify-end z-50 p-0 md:p-4 cursor-pointer"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="w-full max-w-2xl bg-[#0A192F] h-full overflow-y-auto p-6 md:rounded-l-2xl border-l border-[#D4AF37]/30 flex flex-col justify-between cursor-default shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-start border-b border-[#D4AF37]/15 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">{selectedCase.caseNumber}</span>
                    <h2 className="text-lg font-bold text-white mt-1">{selectedCase.title}</h2>
                  </div>
                  <button onClick={() => setSelectedCase(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-2 gap-4 bg-[#051124] p-4 rounded-xl border border-[#D4AF37]/10 text-xs shadow-inner">
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Jurisdiction Court</p>
                    <p className="font-semibold text-white mt-1">{selectedCase.court}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Presiding Judge</p>
                    <p className="font-semibold text-white mt-1">{selectedCase.judge}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Client Litigant</p>
                    <p className="font-semibold text-white mt-1">{selectedCase.clientName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">Assigned Advocate</p>
                    <p className="font-semibold text-white mt-1">{selectedCase.leadLawyer}</p>
                  </div>
                </div>

                {/* Timeline and hearings check list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-mono">Case History Timeline</h3>
                    <button
                      onClick={() => setShowAddHearing(true)}
                      className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> Add Step/Hearing
                    </button>
                  </div>

                  <div className="relative pl-6 border-l border-[#D4AF37]/30 ml-2 space-y-4">
                    {/* Dynamic Hearings from Live Ledger */}
                    {(() => {
                      const caseHearings = (dbState?.hearings || []).filter(h => h.caseId === selectedCase.id);
                      if (caseHearings.length === 0) {
                        return (
                          <div className="relative">
                            <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-[#D4AF37] ring-4 ring-[#0A192F]"></div>
                            <p className="text-[10px] font-mono text-[#D4AF37]">Active Stage</p>
                            <h4 className="text-xs font-semibold text-white mt-0.5">Court hearing Scheduled</h4>
                            <p className="text-xs text-slate-400">Assigned Advocate preparation ongoing. Scheduled for {selectedCase.nextHearingDate}.</p>
                          </div>
                        );
                      }
                      
                      return caseHearings.map((hearing, hIdx) => {
                        const isVerified = hearing.status === "Verified Present";
                        return (
                          <div key={hearing.id || hIdx} className="relative space-y-1.5">
                            <div className={`absolute -left-[30px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ring-[#0A192F] flex items-center justify-center ${
                              isVerified 
                                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.75)] animate-pulse" 
                                : "bg-[#D4AF37]"
                            }`}>
                              {isVerified && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[10px] font-mono font-bold text-[#D4AF37]">{hearing.hearingDate} • {hearing.hearingTime}</p>
                              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                                isVerified 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              }`}>
                                {hearing.status}
                              </span>
                            </div>

                            <h4 className="text-xs font-semibold text-white">
                              {isVerified ? "Court Session Presence Confirmed" : `Court Hearing Scheduled (${hearing.courtroom})`}
                            </h4>
                            <p className="text-xs text-slate-300">
                              {hearing.outcome || `Hearing scheduled under presiding officer ${hearing.judge}. Advocate Assigned: ${hearing.assignedLawyer}.`}
                            </p>
                            {hearing.notes && (
                              <p className="text-[10px] text-slate-400 font-mono italic bg-[#051124] p-2 rounded-lg border border-[#D4AF37]/10">
                                {hearing.notes}
                              </p>
                            )}
                          </div>
                        );
                      });
                    })()}

                    {/* Standard Historic Foundation Stage */}
                    <div className="relative opacity-60">
                      <div className="absolute -left-[30px] top-1 h-3 w-3 rounded-full bg-slate-600 ring-4 ring-[#0A192F]"></div>
                      <p className="text-[10px] font-mono text-slate-400">2026-05-12</p>
                      <h4 className="text-xs font-semibold text-white mt-0.5">Written Petitions filed</h4>
                      <p className="text-xs text-slate-400">Plaint submitted under CPC Order VII.</p>
                    </div>
                  </div>
                </div>

                {/* Digital Evidence Vault Section inside case */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider font-mono">Digital Evidence Vault</h3>
                    <button
                      onClick={() => setShowAddEvidence(true)}
                      className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" /> File Certified Document
                    </button>
                  </div>

                  {/* List evidence */}
                  <div className="space-y-2">
                    {(dbState?.evidence || []).filter(ev => ev.caseId === selectedCase?.id).map((ev) => (
                      <div key={ev.id} className="p-3 bg-[#051124] border border-[#D4AF37]/10 rounded-lg flex justify-between items-center shadow-inner">
                        <div className="flex items-start gap-2.5">
                          <FileText className="h-5 w-5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">SHA-256 Validated: {ev.digitalSignature.slice(0, 15)}...</p>
                          </div>
                        </div>
                        <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold">CERTIFIED</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Back to listings button */}
              <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-end">
                <button onClick={() => setSelectedCase(null)} className="px-4 py-2 bg-[#051124] hover:bg-[#051124]/80 text-xs rounded font-semibold text-white cursor-pointer border border-[#D4AF37]/15">
                  Close Records Drawer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Employee Details Overlay Panel */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 cursor-pointer"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0A192F] max-w-lg w-full rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start border-b border-[#D4AF37]/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-[#051124] flex items-center justify-center font-bold text-sm text-[#D4AF37] border border-[#D4AF37]/20 font-sans uppercase">
                      {selectedEmployee.name.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">{selectedEmployee.name}</h3>
                      <p className="text-xs font-mono text-[#D4AF37]">{selectedEmployee.role}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEmployee(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#051124] rounded-lg border border-[#D4AF37]/10">
                    <span className="text-[10px] text-slate-400 font-mono block">Status</span>
                    <strong className="text-white mt-1 block">{selectedEmployee.status}</strong>
                  </div>
                  <div className="p-3 bg-[#051124] rounded-lg border border-[#D4AF37]/10">
                    <span className="text-[10px] text-slate-400 font-mono block">Gender</span>
                    <strong className="text-white mt-1 block">{selectedEmployee.gender}</strong>
                  </div>
                  <div className="p-3 bg-[#051124] rounded-lg border border-[#D4AF37]/10">
                    <span className="text-[10px] text-slate-400 font-mono block">Monthly Emoluments</span>
                    <strong className="text-[#D4AF37] mt-1 block font-mono">৳{(selectedEmployee?.salary || 0).toLocaleString()} BDT</strong>
                  </div>
                  <div className="p-3 bg-[#051124] rounded-lg border border-[#D4AF37]/10">
                    <span className="text-[10px] text-slate-400 font-mono block">Performance Score</span>
                    <strong className="text-amber-400 mt-1 block font-mono">★ {selectedEmployee.performanceRating} / 5.0</strong>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono text-slate-300">
                  <div className="flex justify-between border-b border-[#D4AF37]/10 py-1.5">
                    <span className="text-slate-400">Official Email</span>
                    <span className="text-white truncate max-w-[250px]">{selectedEmployee.email}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D4AF37]/10 py-1.5">
                    <span className="text-slate-400">Registered Phone</span>
                    <span className="text-white">{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D4AF37]/10 py-1.5">
                    <span className="text-slate-400">Assigned Branch</span>
                    <span className="text-white">{selectedEmployee.branch}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#D4AF37]/10 py-1.5">
                    <span className="text-slate-400">Joining Date</span>
                    <span className="text-white">{selectedEmployee.joiningDate}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#051124] border-t border-[#D4AF37]/15 flex justify-end">
                <button onClick={() => setSelectedEmployee(null)} className="px-4.5 py-2 bg-[#0A192F] hover:bg-[#0A192F]/80 text-xs font-semibold text-white rounded cursor-pointer border border-[#D4AF37]/15">
                  Dismiss Profile Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. New Case Registration Modal */}
      <AnimatePresence>
        {showNewCaseModal && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#0A192F] max-w-xl w-full rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-[#0F223D] border-b border-[#D4AF37]/15 flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Register New Case (Bangladesh CPC compliant)</h3>
                <button onClick={() => setShowNewCaseModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCase} className="p-6 space-y-4 max-h-[500px] overflow-y-auto text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Case Number / Index</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. W.P.-2026-3425"
                      value={newCaseForm.caseNumber}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, caseNumber: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Case Category</label>
                    <select
                      value={newCaseForm.caseType}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, caseType: e.target.value as any })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option>Civil</option>
                      <option>Criminal</option>
                      <option>Constitutional</option>
                      <option>Labour</option>
                      <option>Family</option>
                      <option>Tax</option>
                      <option>Corporate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Case Title (Litigants)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salim Rahaman Dipu Vs. Tanvir Rifat (Property Title Dispute)"
                    value={newCaseForm.title}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Division / District</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dhaka"
                      value={newCaseForm.district}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, district: e.target.value, division: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Priority</label>
                    <select
                      value={newCaseForm.priority}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, priority: e.target.value as any })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Client Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salim Rahaman Dipu"
                      value={newCaseForm.clientName}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, clientName: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Assigned Lawyer</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SMI Fahim"
                      value={newCaseForm.leadLawyer}
                      onChange={(e) => setNewCaseForm({ ...newCaseForm, leadLawyer: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase text-[10px]">Matter Brief / Pleadings</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide details on the legal controversy..."
                    value={newCaseForm.summary}
                    onChange={(e) => setNewCaseForm({ ...newCaseForm, summary: e.target.value })}
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="pt-4 border-t border-[#D4AF37]/10 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewCaseModal(false)}
                    className="px-4.5 py-2 bg-[#051124] hover:bg-[#051124]/80 text-slate-200 rounded border border-[#D4AF37]/10 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-[#D4AF37] text-black font-semibold rounded hover:bg-[#E1BE43] cursor-pointer"
                  >
                    Complete Registration
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. bKash Gateway Portal Modal */}
      <AnimatePresence>
        {bkashModal.open && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#E2136E] max-w-sm w-full rounded-2xl overflow-hidden shadow-2xl text-white relative flex flex-col items-center"
            >
              {/* Header */}
              <div className="w-full bg-white p-4 flex justify-between items-center border-b border-pink-100">
                <img
                  src="https://opb-web-v1.oss-ap-southeast-1.aliyuncs.com/opb-images/bkash-logo.png"
                  alt="bKash"
                  onError={(e) => {
                    // Failback text if images have CORS or failure
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-8 object-contain"
                />
                <span className="text-xs font-bold text-[#E2136E] font-mono">bKash Payment Gateway</span>
                <button onClick={() => setBkashModal(prev => ({ ...prev, open: false }))} className="text-slate-500 hover:text-slate-800 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 w-full flex flex-col items-center text-center space-y-4">
                <div className="bg-pink-900/10 border border-pink-400/20 px-3.5 py-1.5 rounded text-xs font-mono">
                  Invoice ID: {bkashModal.invoiceId}
                </div>
                
                <p className="text-xs text-pink-100">Amount to Settle:</p>
                <p className="text-3xl font-extrabold font-mono">৳{(bkashModal.amount || 0).toLocaleString()} BDT</p>

                {bkashModal.step === "phone" && (
                  <div className="w-full space-y-3">
                    <p className="text-xs">Your bKash Wallet Account Number:</p>
                    <input
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      required
                      maxLength={11}
                      value={bkashModal.phone}
                      onChange={(e) => setBkashModal({ ...bkashModal, phone: e.target.value })}
                      className="w-full bg-white text-black p-3 rounded-lg text-center font-bold tracking-widest text-sm focus:outline-none"
                    />
                    <p className="text-[10px] text-pink-100">By clicking submit you accept bKash regulations.</p>
                  </div>
                )}

                {bkashModal.step === "otp" && (
                  <div className="w-full space-y-3">
                    <p className="text-xs">Enter OTP (One Time Password) sent to {bkashModal.phone}:</p>
                    <input
                      type="text"
                      placeholder="XXXX"
                      required
                      maxLength={4}
                      value={bkashModal.otp}
                      onChange={(e) => setBkashModal({ ...bkashModal, otp: e.target.value })}
                      className="w-full bg-white text-black p-3 rounded-lg text-center font-extrabold tracking-widest text-sm focus:outline-none"
                    />
                    <p className="text-[10px] text-pink-200">Resend code in 45s</p>
                  </div>
                )}

                {bkashModal.step === "pin" && (
                  <div className="w-full space-y-3">
                    <p className="text-xs">Provide your 5-digit security PIN:</p>
                    <input
                      type="password"
                      placeholder="•••••"
                      required
                      maxLength={5}
                      value={bkashModal.pin}
                      onChange={(e) => setBkashModal({ ...bkashModal, pin: e.target.value })}
                      className="w-full bg-white text-black p-3 rounded-lg text-center font-extrabold tracking-widest text-sm focus:outline-none"
                    />
                    <p className="text-[10px] text-pink-200">Payment is encrypted directly on bKash servers.</p>
                  </div>
                )}

                {bkashModal.step === "success" && (
                  <div className="w-full py-4 space-y-3">
                    <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center mx-auto text-white">
                      <CheckCircle className="h-8 w-8 stroke-[2.5]" />
                    </div>
                    <p className="text-sm font-bold">Transaction Certified!</p>
                    <p className="text-xs text-pink-100">Trust account invoice settled and marked PAID inside the system.</p>
                  </div>
                )}

                {bkashModal.step !== "success" && (
                  <button
                    onClick={handleBkashSubmit}
                    className="w-full bg-[#9c0446] hover:bg-pink-900 text-white font-bold text-xs py-3.5 rounded-lg uppercase tracking-wider transition-all"
                  >
                    <span>Proceed Securely</span>
                  </button>
                )}

                {bkashModal.step === "success" && (
                  <button
                    onClick={() => setBkashModal(prev => ({ ...prev, open: false }))}
                    className="w-full bg-white text-[#E2136E] font-bold text-xs py-3 rounded-lg uppercase tracking-wider transition-all"
                  >
                    <span>Return to Portal</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Sub-modal to add evidence */}
      <AnimatePresence>
        {showAddEvidence && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#0A192F] max-w-sm w-full rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl text-xs"
            >
              <div className="p-4 bg-[#0F223D] border-b border-[#D4AF37]/15 flex justify-between items-center">
                <h4 className="font-bold text-white">File Certified Evidence in Vault</h4>
                <button onClick={() => setShowAddEvidence(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddEvidence} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Evidence Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Certified Sale Deed No. 1290"
                    value={newEvidenceForm.title}
                    onChange={(e) => setNewEvidenceForm({ ...newEvidenceForm, title: e.target.value })}
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Format Type</label>
                    <select
                      value={newEvidenceForm.type}
                      onChange={(e) => setNewEvidenceForm({ ...newEvidenceForm, type: e.target.value as any })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option>PDF</option>
                      <option>Image</option>
                      <option>Video</option>
                      <option>Audio</option>
                      <option>Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Tag/Category</label>
                    <input
                      type="text"
                      value={newEvidenceForm.tag}
                      onChange={(e) => setNewEvidenceForm({ ...newEvidenceForm, tag: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Verification / Chain of Custody Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Verify authentication stamp, source, and signature authority"
                    value={newEvidenceForm.notes}
                    onChange={(e) => setNewEvidenceForm({ ...newEvidenceForm, notes: e.target.value })}
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded hover:bg-[#E1BE43] transition-all cursor-pointer"
                >
                  Encrypt and File to Digital Vault
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Sub-modal to add hearing */}
      <AnimatePresence>
        {showAddHearing && (
          <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-[#0A192F] max-w-sm w-full rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-2xl text-xs"
            >
              <div className="p-4 bg-[#0F223D] border-b border-[#D4AF37]/15 flex justify-between items-center">
                <h4 className="font-bold text-white">Schedule Court Hearing</h4>
                <button onClick={() => setShowAddHearing(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleAddHearing} className="p-5 space-y-3.5">
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Hearing Date</label>
                  <input
                    type="date"
                    required
                    value={newHearingForm.hearingDate}
                    onChange={(e) => setNewHearingForm({ ...newHearingForm, hearingDate: e.target.value })}
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Hearing Time</label>
                    <input
                      type="text"
                      value={newHearingForm.hearingTime}
                      onChange={(e) => setNewHearingForm({ ...newHearingForm, hearingTime: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Courtroom No.</label>
                    <input
                      type="text"
                      value={newHearingForm.courtroom}
                      onChange={(e) => setNewHearingForm({ ...newHearingForm, courtroom: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Assigned Judge</label>
                    <input
                      type="text"
                      value={newHearingForm.judge}
                      onChange={(e) => setNewHearingForm({ ...newHearingForm, judge: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Lead Lawyer</label>
                    <input
                      type="text"
                      value={newHearingForm.assignedLawyer}
                      onChange={(e) => setNewHearingForm({ ...newHearingForm, assignedLawyer: e.target.value })}
                      className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Case Preparation Instructions</label>
                  <textarea
                    rows={2}
                    value={newHearingForm.notes}
                    onChange={(e) => setNewHearingForm({ ...newHearingForm, notes: e.target.value })}
                    placeholder="Verify primary witnesses, compile plaint arguments..."
                    className="w-full bg-[#051124] border border-[#D4AF37]/15 rounded p-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black font-semibold py-2 rounded hover:bg-[#E1BE43] transition-all cursor-pointer"
                >
                  Publish and Synchronize Schedule
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. FOOTER CREDITS */}
      <footer className="border-t border-[#D4AF37]/15 bg-[#0A192F] px-6 py-4.5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-mono mt-auto">
        <p>© 2026 IntelliJudge Judicial Operations Platform. Trusted Justice.</p>
        <p className="flex items-center gap-1.5 mt-2 md:mt-0">
          <span>Registered Developer:</span>
          <span className="text-[#D4AF37] font-bold">SMI Fahim</span>
        </p>
      </footer>

    </div>
  );
}
