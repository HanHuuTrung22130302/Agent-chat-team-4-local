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

export interface EVMAnalysis {
  projectId: number;
  bac: number;
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  costVariance: number;
  scheduleVariance: number;
  cpi: number;
  spi: number;
  estimateAtCompletion: number;
  healthStatus: 'HEALTHY' | 'COST_OVERRUN' | 'SCHEDULE_DELAY' | 'CRITICAL';
}

export interface Material {
  id: number;
  code: string;
  name: string;
  category: string;
  unit: string;
  standardNormRate: number;
  specs?: string;
}

export interface StockBalance {
  id: number;
  projectId: number;
  material: Material;
  currentQuantity: number;
  minimumThreshold: number;
  lastUpdated: string;
}

export interface NormReconciliationResult {
  materialCode: string;
  materialName: string;
  category: string;
  unit: string;
  totalIssuedQuantity: number;
  boqDesignedQuantity: number;
  varianceQuantity: number;
  actualWasteRate: number;
  standardNormRate: number;
  isOverNorm: boolean;
  alertLevel: 'NORMAL' | 'WARNING' | 'CRITICAL_OVER_NORM';
  statusMessage: string;
}

export interface Equipment {
  id: number;
  code: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  ownerType: string;
  status: string;
  standardFuelNorm: number;
  totalEngineHours: number;
  safetyInspectionExpiry: string;
}

export interface EquipmentLog {
  id: number;
  logNumber: string;
  equipmentId: number;
  logDate: string;
  operatorName: string;
  startEngineHour: number;
  endEngineHour: number;
  workedHours: number;
  fuelIssuedLiters: number;
  expectedFuelLiters: number;
  fuelVarianceRate: number;
  workDescription: string;
  alertFlag: 'NORMAL' | 'OVER_CONSUMPTION' | 'CRITICAL';
}

export interface SteelComponent {
  id: number;
  componentMark: string;
  componentType: string;
  profileSpecs: string;
  steelGrade: string;
  lengthMm: number;
  weightKg: number;
  gridLocation: string;
  qrCodeUid: string;
  cutStatus: string;
  fitStatus: string;
  weldStatus: string;
  blastStatus: string;
  paintStatus: string;
  shippingStatus: string;
  erectionStatus: string;
  erectedAt?: string;
  erectedBy?: string;
}
