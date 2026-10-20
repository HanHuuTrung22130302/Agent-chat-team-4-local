export interface Project {
  id: number;
  code: string;
  name: string;
  clientName: string;
  location: string;
  projectType: string;
  contractValue: number;
  startDate: string;
  plannedEndDate: string;
  actualEndDate?: string;
  progressPercentage: number;
  status: 'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED';
}

export interface WBSItem {
  id: number;
  projectId: number;
  parentId?: number;
  wbsCode: string;
  name: string;
  level: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  weightPercentage: number;
  progressPercentage: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  children?: WBSItem[];
}

export interface DailySiteDiary {
  id: number;
  projectId: number;
  diaryDate: string;
  weatherMorning: string;
  weatherAfternoon: string;
  temperatureCelsius: number;
  isWeatherStoppage: boolean;
  stoppageHours: number;
  directManpowerCount: number;
  subcontractorManpowerCount: number;
  workPerformedSummary: string;
  issuesAndRisks?: string;
  safetyNotes?: string;
  siteManagerSignature?: string;
  consultantSignature?: string;
}

export interface Subcontractor {
  id: number;
  code: string;
  name: string;
  taxCode: string;
  representative?: string;
  phone?: string;
  email?: string;
  address?: string;
  specialty?: string;
  ratingGrade: 'A' | 'B' | 'C' | 'BLACKLISTED';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Subcontract {
  id: number;
  contractNumber: string;
  projectId: number;
  subcontractorId: number;
  subcontractorName?: string;
  title: string;
  contractType: string;
  totalValue: number;
  advancePaymentRate: number;
  advancePaymentAmount: number;
  retentionRate: number;
  retentionAccumulated: number;
  startDate?: string;
  endDate?: string;
  status: 'DRAFT' | 'EXECUTING' | 'COMPLETED' | 'TERMINATED';
}

export interface PaymentCertificate {
  id: number;
  certificateNumber: string;
  subcontractId: number;
  periodNumber: number;
  billingStartDate: string;
  billingEndDate: string;
  grossAmount: number;
  cumulativeGrossAmount: number;
  advanceDeduction: number;
  retentionDeduction: number;
  backchargesDeduction: number;
  taxAmount: number;
  netPayableAmount: number;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'PAID';
}
