export enum UserRole {
  SUPREME_ADMIN = "Supreme Administrator",
  JUDICIAL_AUTHORITY = "Judicial Authority",
  LAW_FIRM_OWNER = "Law Firm Owner",
  SENIOR_PARTNER = "Senior Partner",
  LAWYER = "Lawyer",
  JUNIOR_LAWYER = "Junior Lawyer",
  LEGAL_ASSISTANT = "Legal Assistant",
  FRONT_DESK = "Front Desk",
  ACCOUNTS_DEPT = "Accounts Department",
  HR = "HR Department",
  CLIENT = "Client Portal"
}

export interface Employee {
  id: string;
  name: string;
  gender: "Male" | "Female";
  role: UserRole;
  email: string;
  phone: string;
  branch: string;
  joiningDate: string;
  salary: number;
  status: "Active" | "On Leave" | "Suspended";
  performanceRating: number;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  court: string;
  division: string;
  district: string;
  judge: string;
  leadLawyer: string;
  clientName: string;
  opposingParty: string;
  opposingLawyer: string;
  caseType: "Civil" | "Criminal" | "Constitutional" | "Labour" | "Family" | "Tax" | "Corporate";
  status: "Filing" | "Hearing" | "Stayed" | "Judgment Pending" | "Disposed";
  priority: "High" | "Medium" | "Low";
  riskLevel: "Critical" | "Standard" | "Low";
  nextHearingDate: string;
  summary: string;
  legalNotes: string;
  createdAt: string;
}

export interface Hearing {
  id: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  hearingDate: string;
  hearingTime: string;
  courtroom: string;
  judge: string;
  assignedLawyer: string;
  checklist: string[];
  durationMinutes: number;
  outcome: string;
  status: "Scheduled" | "Completed" | "Adjourned" | "Cancelled";
  notes: string;
}

export interface Evidence {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  type: "PDF" | "Image" | "Video" | "Audio" | "Document";
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  tag: string;
  chainOfCustody: {
    date: string;
    action: string;
    user: string;
  }[];
  digitalSignature: string;
  notes: string;
}

export interface Contract {
  id: string;
  title: string;
  clientName: string;
  type: "Power of Attorney" | "Service Agreement" | "NDA" | "Employment Contract" | "Affidavit" | "Partnership deed";
  status: "Drafting" | "Pending Review" | "Approved" | "Signed" | "Expired";
  draftedBy: string;
  content: string;
  version: string;
  lastUpdated: string;
  signatureDate?: string;
  clauses: {
    title: string;
    text: string;
  }[];
}

export interface FinancialRecord {
  id: string;
  caseNumber?: string;
  clientName: string;
  type: "Invoice" | "Payment" | "Expense" | "Retainer";
  category: string;
  amount: number;
  date: string;
  status: "Paid" | "Unpaid" | "Pending" | "Void";
  paymentMethod?: string;
  isTrustAccount: boolean;
  description: string;
  branch: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  lawyerName: string;
  dateTime: string;
  purpose: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  type: "In-Person" | "Video Conference";
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
}

export interface NoticeTemplate {
  id: string;
  title: string;
  type: string;
  content: string;
}
