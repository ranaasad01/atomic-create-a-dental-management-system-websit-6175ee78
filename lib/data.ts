export interface NavLink {
  label: string;
  href: string;
  key: string;
  icon?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  age: number;
  phone: string;
  email: string;
  dentist: string;
  lastVisit: string;
  nextAppointment: string | null;
  status: "Active" | "Inactive" | "Archived";
  bloodType: string;
  allergies: string[];
  insurance: string;
  policyNumber: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  procedure: string;
  dentist: string;
  room: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | "No-Show";
  duration: string;
  date: string;
}

export interface TreatmentPlan {
  id: string;
  patientName: string;
  procedure: string;
  dentist: string;
  startDate: string;
  status: "Active" | "Completed" | "On Hold" | "Awaiting Approval";
}

export interface Invoice {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  items: { description: string; amount: number }[];
}

export interface StaffMember {
  id: string;
  name: string;
  role: "Admin" | "Dentist" | "Hygienist" | "Receptionist";
  specialty?: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave" | "Inactive";
  joinDate: string;
}

export interface InsuranceClaim {
  id: string;
  patientName: string;
  provider: string;
  amount: number;
  submittedDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Under Review";
  procedure: string;
}

export const APP_NAME = "DentaCore";
export const APP_TAGLINE = "Smarter Dental Practice Management";
export const APP_VERSION = "2.4.1";

export const navLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard" },
  { label: "Patients", href: "/patients", key: "patients" },
  { label: "Appointments", href: "/appointments", key: "appointments" },
  { label: "Treatments", href: "/treatments", key: "treatments" },
  { label: "Billing", href: "/billing", key: "billing" },
  { label: "Insurance", href: "/insurance", key: "insurance" },
  { label: "Staff", href: "/staff", key: "staff" },
  { label: "Reports", href: "/reports", key: "reports" },
  { label: "Settings", href: "/settings", key: "settings" },
];

export const sidebarLinks: NavLink[] = [
  { label: "Dashboard", href: "/dashboard", key: "dashboard", icon: "LayoutDashboard" },
  { label: "Patients", href: "/patients", key: "patients", icon: "Users" },
  { label: "Appointments", href: "/appointments", key: "appointments", icon: "Calendar" },
  { label: "Treatments", href: "/treatments", key: "treatments", icon: "Activity" },
  { label: "Billing", href: "/billing", key: "billing", icon: "FileText" },
  { label: "Insurance", href: "/insurance", key: "insurance", icon: "Shield" },
  { label: "Staff", href: "/staff", key: "staff", icon: "UserCheck" },
  { label: "Reports", href: "/reports", key: "reports", icon: "BarChart2" },
  { label: "Settings", href: "/settings", key: "settings", icon: "Settings" },
];

export const mockPatients: Patient[] = [
  {
    id: "PT-00401",
    name: "Emily R. Hartman",
    dob: "Sep 22, 1990",
    age: 34,
    phone: "(312) 555-0182",
    email: "emily.hartman@email.com",
    dentist: "Dr. Sarah Okonkwo",
    lastVisit: "Jun 3, 2025",
    nextAppointment: "Jul 15, 2025",
    status: "Active",
    bloodType: "A+",
    allergies: ["Latex"],
    insurance: "BlueCross BlueShield",
    policyNumber: "BCB-441-2290",
  },
  {
    id: "PT-00402",
    name: "Marcus J. Delgado",
    dob: "Jan 7, 1975",
    age: 50,
    phone: "(773) 555-0294",
    email: "marcus.delgado@email.com",
    dentist: "Dr. James Patel",
    lastVisit: "May 18, 2025",
    nextAppointment: null,
    status: "Inactive",
    bloodType: "O-",
    allergies: ["Penicillin"],
    insurance: "Aetna Dental",
    policyNumber: "AET-882-1104",
  },
  {
    id: "PT-00403",
    name: "Aisha N. Kamara",
    dob: "Apr 30, 2008",
    age: 17,
    phone: "(847) 555-0371",
    email: "aisha.kamara@email.com",
    dentist: "Dr. Mei-Lin Torres",
    lastVisit: "Jun 10, 2025",
    nextAppointment: "Jun 24, 2025",
    status: "Active",
    bloodType: "B+",
    allergies: [],
    insurance: "Delta Dental",
    policyNumber: "DD-229-5571",
  },
  {
    id: "PT-00404",
    name: "David O. Whitfield",
    dob: "Nov 12, 1962",
    age: 62,
    phone: "(630) 555-0445",
    email: "david.whitfield@email.com",
    dentist: "Dr. Sarah Okonkwo",
    lastVisit: "Apr 29, 2025",
    nextAppointment: "Jul 8, 2025",
    status: "Active",
    bloodType: "AB+",
    allergies: ["Aspirin"],
    insurance: "Cigna Dental",
    policyNumber: "CIG-773-8820",
  },
  {
    id: "PT-00405",
    name: "Priya S. Anand",
    dob: "Jul 19, 1995",
    age: 29,
    phone: "(312) 555-0517",
    email: "priya.anand@email.com",
    dentist: "Dr. James Patel",
    lastVisit: "Mar 5, 2025",
    nextAppointment: null,
    status: "Active",
    bloodType: "O+",
    allergies: [],
    insurance: "United Concordia",
    policyNumber: "UC-114-3390",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "APT-001",
    patientName: "Maria Santos",
    patientId: "PT-00310",
    time: "09:00 AM",
    procedure: "Routine Cleaning & Checkup",
    dentist: "Dr. Reyes",
    room: "Room 1",
    status: "Confirmed",
    duration: "45 min",
    date: "Jul 22, 2025",
  },
  {
    id: "APT-002",
    patientName: "James Okafor",
    patientId: "PT-00298",
    time: "09:45 AM",
    procedure: "Root Canal Therapy (Session 2 of 3)",
    dentist: "Dr. Reyes",
    room: "Room 2",
    status: "Confirmed",
    duration: "90 min",
    date: "Jul 22, 2025",
  },
  {
    id: "APT-003",
    patientName: "Lily Chen",
    patientId: "PT-00321",
    time: "10:30 AM",
    procedure: "Composite Filling — Upper Left Molar",
    dentist: "Dr. Patel",
    room: "Room 1",
    status: "Pending",
    duration: "60 min",
    date: "Jul 22, 2025",
  },
  {
    id: "APT-004",
    patientName: "David Müller",
    patientId: "PT-00334",
    time: "11:15 AM",
    procedure: "Orthodontic Adjustment — Braces",
    dentist: "Dr. Patel",
    room: "Room 3",
    status: "Confirmed",
    duration: "30 min",
    date: "Jul 22, 2025",
  },
  {
    id: "APT-005",
    patientName: "Aisha Kamara",
    patientId: "PT-00403",
    time: "02:00 PM",
    procedure: "New Patient Consultation & X-Ray",
    dentist: "Dr. Reyes",
    room: "Room 2",
    status: "Confirmed",
    duration: "60 min",
    date: "Jul 22, 2025",
  },
  {
    id: "APT-006",
    patientName: "Carlos Rivera",
    patientId: "PT-00289",
    time: "03:30 PM",
    procedure: "Crown Fitting — Lower Right Premolar",
    dentist: "Dr. Reyes",
    room: "Room 1",
    status: "Confirmed",
    duration: "60 min",
    date: "Jul 22, 2025",
  },
];

export const mockTreatments: TreatmentPlan[] = [
  {
    id: "TRT-2041",
    patientName: "Maria Santos",
    procedure: "Root Canal Therapy (Tooth #14)",
    dentist: "Dr. Reyes",
    startDate: "Jun 12, 2025",
    status: "Active",
  },
  {
    id: "TRT-2040",
    patientName: "James Okafor",
    procedure: "Full Mouth Rehabilitation",
    dentist: "Dr. Chen",
    startDate: "Jun 3, 2025",
    status: "Active",
  },
  {
    id: "TRT-2039",
    patientName: "Priya Nair",
    procedure: "Composite Bonding (Teeth #8, #9)",
    dentist: "Dr. Reyes",
    startDate: "May 28, 2025",
    status: "Completed",
  },
  {
    id: "TRT-2038",
    patientName: "Lucas Ferreira",
    procedure: "Orthodontic Consultation + Braces Fitting",
    dentist: "Dr. Lim",
    startDate: "May 20, 2025",
    status: "Awaiting Approval",
  },
  {
    id: "TRT-2037",
    patientName: "Aisha Kamara",
    procedure: "Periodontal Scaling & Root Planing",
    dentist: "Dr. Chen",
    startDate: "May 14, 2025",
    status: "On Hold",
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "INV-2025-0847",
    patientName: "Maria Santos",
    patientId: "PT-00310",
    date: "Jun 12, 2025",
    amount: 1200,
    status: "Paid",
    dueDate: "Jul 12, 2025",
    items: [
      { description: "Root Canal Therapy — Session 1", amount: 900 },
      { description: "Periapical X-ray", amount: 150 },
      { description: "Consultation Fee", amount: 150 },
    ],
  },
  {
    id: "INV-2025-0846",
    patientName: "James Okafor",
    patientId: "PT-00298",
    date: "Jun 3, 2025",
    amount: 3400,
    status: "Pending",
    dueDate: "Jul 3, 2025",
    items: [
      { description: "Full Mouth Rehabilitation — Phase 1", amount: 2800 },
      { description: "CBCT Scan", amount: 400 },
      { description: "Consultation Fee", amount: 200 },
    ],
  },
  {
    id: "INV-2025-0845",
    patientName: "David Whitfield",
    patientId: "PT-00404",
    date: "Apr 29, 2025",
    amount: 580,
    status: "Overdue",
    dueDate: "May 29, 2025",
    items: [
      { description: "Routine Cleaning & Checkup", amount: 280 },
      { description: "Bitewing X-rays (4)", amount: 200 },
      { description: "Fluoride Treatment", amount: 100 },
    ],
  },
];

export const mockStaff: StaffMember[] = [
  {
    id: "STF-001",
    name: "Dr. Elena Reyes",
    role: "Dentist",
    specialty: "Endodontics",
    email: "e.reyes@dentacore.com",
    phone: "(312) 555-0101",
    status: "Active",
    joinDate: "Mar 15, 2019",
  },
  {
    id: "STF-002",
    name: "Dr. James Patel",
    role: "Dentist",
    specialty: "Orthodontics",
    email: "j.patel@dentacore.com",
    phone: "(312) 555-0102",
    status: "Active",
    joinDate: "Jun 1, 2020",
  },
  {
    id: "STF-003",
    name: "Dr. Sarah Okonkwo",
    role: "Dentist",
    specialty: "Periodontics",
    email: "s.okonkwo@dentacore.com",
    phone: "(312) 555-0103",
    status: "Active",
    joinDate: "Jan 10, 2021",
  },
  {
    id: "STF-004",
    name: "Tina Park",
    role: "Receptionist",
    email: "t.park@dentacore.com",
    phone: "(312) 555-0104",
    status: "Active",
    joinDate: "Aug 22, 2022",
  },
  {
    id: "STF-005",
    name: "Marcus Webb",
    role: "Hygienist",
    email: "m.webb@dentacore.com",
    phone: "(312) 555-0105",
    status: "Active",
    joinDate: "Feb 14, 2023",
  },
];

export const mockClaims: InsuranceClaim[] = [
  {
    id: "CLM-4421",
    patientName: "James Okafor",
    provider: "BlueCross BlueShield",
    amount: 3400,
    submittedDate: "Jun 3, 2025",
    status: "Pending",
    procedure: "Full Mouth Rehabilitation",
  },
  {
    id: "CLM-4420",
    patientName: "Maria Santos",
    provider: "Aetna Dental",
    amount: 1200,
    submittedDate: "Jun 12, 2025",
    status: "Approved",
    procedure: "Root Canal Therapy",
  },
  {
    id: "CLM-4419",
    patientName: "David Whitfield",
    provider: "Cigna Dental",
    amount: 580,
    submittedDate: "Apr 29, 2025",
    status: "Under Review",
    procedure: "Routine Cleaning & Checkup",
  },
];