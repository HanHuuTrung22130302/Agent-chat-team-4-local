import axios from 'axios';
import { 
  Project, 
  WBSItem, 
  DailySiteDiary, 
  Subcontractor, 
  Subcontract, 
  PaymentCertificate,
  EVMAnalysis,
  Material,
  StockBalance,
  Equipment,
  SteelComponent,
  QAQCInspection,
  ConcreteTestSample,
  NCRReport,
  PermitToWork,
  SafetyIncident,
  ToolboxMeeting,
  WorkerAttendance,
  ProjectWIPAccounting,
  VariationOrder,
  FidicClaim,
  ExecutiveSCurvePoint,
  PendingApprovalItem
} from '../types';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  getProjects: async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get<Project[]>('/projects');
      return response.data;
    } catch {
      return [
        {
          id: 1,
          code: 'DA-ADB-2026-001',
          name: 'Nhà máy Cơ khí Chính xác & Logistics Ánh Dương',
          clientName: 'Tập đoàn Công nghiệp Ánh Dương',
          location: 'KCN Sóng Thần 3, Bình Dương',
          projectType: 'INDUSTRIAL_FACTORY',
          contractValue: 185000000000,
          startDate: '2026-02-01',
          plannedEndDate: '2026-11-30',
          progressPercentage: 38.5,
          status: 'ACTIVE'
        },
        {
          id: 2,
          code: 'DA-ADB-2026-002',
          name: 'Nhà xưởng Công nghệ cao & Kho Thông minh WinSteel',
          clientName: 'Công ty Cổ phần Thép WinSteel',
          location: 'KCN VSIP II-A, Bình Dương',
          projectType: 'LOGISTICS',
          contractValue: 120000000000,
          startDate: '2026-03-15',
          plannedEndDate: '2026-12-15',
          progressPercentage: 18.2,
          status: 'ACTIVE'
        }
      ];
    }
  },

  getProjectWBS: async (projectId: number): Promise<WBSItem[]> => {
    try {
      const response = await apiClient.get<WBSItem[]>(`/projects/${projectId}/wbs`);
      return response.data;
    } catch {
      return [
        { id: 1, projectId, wbsCode: 'WBS-1.0', name: 'Giai đoạn Chuẩn bị & Cọc thử nghiệm móng D1200', level: 1, weightPercentage: 10, progressPercentage: 100, status: 'COMPLETED', normCode: 'AF.12111 (TT 12/2021)', criticalPath: false },
        { id: 2, projectId, wbsCode: 'WBS-2.0', name: 'Thi công Kết cấu Móng, Đài cọc & Bể ngầm PCCC', level: 1, weightPercentage: 25, progressPercentage: 85, status: 'IN_PROGRESS', normCode: 'AF.21100 (TT 12/2021)', criticalPath: true },
        { id: 3, projectId, wbsCode: 'WBS-3.0', name: 'Gia công & Lắp dựng Khung Kết cấu Thép (WinSteel)', level: 1, weightPercentage: 35, progressPercentage: 32, status: 'IN_PROGRESS', normCode: 'AI.11000 (TT 12/2021)', criticalPath: true },
        { id: 4, projectId, wbsCode: 'WBS-4.0', name: 'Thi công Bao che, Tấm lợp & Nền bê tông xoa phẳng', level: 1, weightPercentage: 15, progressPercentage: 0, status: 'NOT_STARTED', normCode: 'AK.12000 (TT 12/2021)', criticalPath: false },
        { id: 5, projectId, wbsCode: 'WBS-5.0', name: 'Hệ thống Cơ điện M&E, PCCC & Trạm biến áp 1250kVA', level: 1, weightPercentage: 15, progressPercentage: 0, status: 'NOT_STARTED', normCode: 'BA.10000 (TT 12/2021)', criticalPath: false },
      ];
    }
  },

  getSiteDiaries: async (projectId: number): Promise<DailySiteDiary[]> => {
    try {
      const response = await apiClient.get<DailySiteDiary[]>(`/projects/${projectId}/site-diaries`);
      return response.data;
    } catch {
      return [
        {
          id: 1,
          projectId,
          diaryDate: new Date().toISOString().split('T')[0],
          weatherMorning: 'Nắng ráo, nhiệt độ 31°C, gió cấp 2',
          weatherAfternoon: 'Nắng gắt 34°C, oi bức, không mưa',
          temperatureCelsius: 33.5,
          isWeatherStoppage: false,
          stoppageHours: 0,
          directManpowerCount: 42,
          subcontractorManpowerCount: 78,
          workPerformedSummary: 'Đổ bê tông sàn tầng lửng trục 1-5 (khối lượng 145m3 bê tông M350); Gia công cốt thép đài móng trục 6-10; Lắp dựng giàn giáo hoàn thiện mặt đứng theo NĐ 06/2021/NĐ-CP.',
          issuesAndRisks: 'Nguồn điện trạm tạm ổn định. Đảm bảo cấp đủ nước uống giải nhiệt cho 120 công nhân.',
          safetyNotes: '100% công nhân đeo dây đai an toàn 2 móc khi thao tác trên giàn giáo cao >2m. Buổi sáng họp Tool-box 15 phút về phòng chống say nắng.',
          siteManagerSignature: 'Nguyễn Văn Hùng (Chỉ huy trưởng)',
          consultantSignature: 'Trần Đình Trọng (TVGS Trưởng)'
        }
      ];
    }
  },

  getSCurveData: async (): Promise<ExecutiveSCurvePoint[]> => {
    return [
      { month: 'T2/26', plannedCumulativePct: 5, actualCumulativePct: 5, costCumulativeVndBillion: 8.5, earnedValueVndBillion: 9.25 },
      { month: 'T3/26', plannedCumulativePct: 12, actualCumulativePct: 14, costCumulativeVndBillion: 21.0, earnedValueVndBillion: 25.9 },
      { month: 'T4/26', plannedCumulativePct: 22, actualCumulativePct: 24, costCumulativeVndBillion: 39.5, earnedValueVndBillion: 44.4 },
      { month: 'T5/26', plannedCumulativePct: 34, actualCumulativePct: 38.5, costCumulativeVndBillion: 65.0, earnedValueVndBillion: 71.2 },
      { month: 'T6/26', plannedCumulativePct: 48, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
      { month: 'T7/26', plannedCumulativePct: 62, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
      { month: 'T8/26', plannedCumulativePct: 75, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
      { month: 'T9/26', plannedCumulativePct: 88, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
      { month: 'T10/26', plannedCumulativePct: 96, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
      { month: 'T11/26', plannedCumulativePct: 100, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    ];
  },

  getPendingApprovals: async (): Promise<PendingApprovalItem[]> => {
    return [
      { id: 'APP-01', type: 'PPC', title: 'Chứng chỉ nghiệm thu đợt 3 — Thầu phụ Cơ điện Hưng Thịnh', requester: 'Kỹ sư QS Nguyễn Văn Nam', amountOrScale: '4.250.000.000 ₫', submittedAt: '10 phút trước', priority: 'CRITICAL' },
      { id: 'APP-02', type: 'MR', title: 'Phiếu đề nghị cấp 25.5 tấn thép D20 CB400 dầm D3', requester: 'Đội trưởng Bê tông Móng 1', amountOrScale: '25.5 TẤN', submittedAt: '45 phút trước', priority: 'HIGH' },
      { id: 'APP-03', type: 'PTW', title: 'Giấy phép làm việc trên cao lắp kèo thép WinSteel trục 3', requester: 'Tổ trưởng Hàn WinSteel', amountOrScale: 'Độ cao 14.5m', submittedAt: '1 giờ trước', priority: 'HIGH' },
      { id: 'APP-04', type: 'RFI', title: 'Nghiệm thu công việc ẩn giấu cốt thép đài móng ĐM-05', requester: 'Kỹ sư QA/QC Vũ Minh Trí', amountOrScale: 'NĐ 06/2021', submittedAt: '2 giờ trước', priority: 'NORMAL' },
    ];
  }
};

export const subcontractorApi = {
  getSubcontractors: async (): Promise<Subcontractor[]> => {
    try {
      const response = await apiClient.get<Subcontractor[]>('/subcontractors');
      return response.data;
    } catch {
      return [
        { id: 1, code: 'SUB-HTP-01', name: 'Công ty TNHH Xây dựng Hưng Thịnh Phát', taxCode: '0314589201', representative: 'Nguyễn Văn Hưng', phone: '0903123456', specialty: 'Thi công Kết cấu Bê tông & Cốt thép', ratingGrade: 'A', status: 'ACTIVE' },
        { id: 2, code: 'SUB-WNS-02', name: 'Công ty Cổ phần Kết cấu Thép WinSteel', taxCode: '3702158963', representative: 'Lê Hoàng Nam', phone: '0918765432', specialty: 'Gia công & Lắp dựng Khung Thép Tiền chế', ratingGrade: 'A', status: 'ACTIVE' },
        { id: 3, code: 'SUB-MEP-03', name: 'Công ty Cơ Điện Lạnh Á Châu (Asia M&E)', taxCode: '0309988771', representative: 'Trần Đình Trọng', phone: '0988112233', specialty: 'Hệ thống Điện, PCCC & HVAC Nhà xưởng', ratingGrade: 'B', status: 'ACTIVE' }
      ];
    }
  },

  getSubcontracts: async (projectId: number): Promise<Subcontract[]> => {
    try {
      const response = await apiClient.get<Subcontract[]>(`/projects/${projectId}/subcontracts`);
      return response.data;
    } catch {
      return [
        { id: 1, contractNumber: 'HDGK-ADB-2026-001', projectId, subcontractorId: 1, subcontractorName: 'Hưng Thịnh Phát', title: 'Giao khoán toàn bộ nhân công kết cấu móng & sàn bê tông', contractType: 'FIDIC_RED_LABOR_ONLY', totalValue: 24500000000, advancePaymentRate: 10, advancePaymentAmount: 2450000000, retentionRate: 5, retentionAccumulated: 367500000, startDate: '2026-02-15', endDate: '2026-08-30', status: 'EXECUTING' },
        { id: 2, contractNumber: 'HDGK-ADB-2026-002', projectId, subcontractorId: 2, subcontractorName: 'WinSteel Corporation', title: 'Gia công chế tạo và cẩu lắp khung nhà xưởng 24,000m2', contractType: 'FIDIC_YELLOW_SUPPLY_ERECT', totalValue: 58000000000, advancePaymentRate: 15, advancePaymentAmount: 8700000000, retentionRate: 5, retentionAccumulated: 435000000, startDate: '2026-03-01', endDate: '2026-09-15', status: 'EXECUTING' }
      ];
    }
  },

  getCertificates: async (subcontractId: number): Promise<PaymentCertificate[]> => {
    try {
      const response = await apiClient.get<PaymentCertificate[]>(`/subcontracts/${subcontractId}/certificates`);
      return response.data;
    } catch {
      return [
        { id: 1, certificateNumber: 'PPC-ADB-HTP-01', subcontractId, subcontractorName: 'Hưng Thịnh Phát', periodNumber: 1, billingStartDate: '2026-02-15', billingEndDate: '2026-03-15', grossAmount: 3500000000, cumulativeGrossAmount: 3500000000, advanceDeduction: 350000000, retentionDeduction: 175000000, backchargesDeduction: 15000000, taxAmount: 236800000, netPayableAmount: 3196800000, status: 'PAID' },
        { id: 2, certificateNumber: 'PPC-ADB-HTP-02', subcontractId, subcontractorName: 'Hưng Thịnh Phát', periodNumber: 2, billingStartDate: '2026-03-16', billingEndDate: '2026-04-15', grossAmount: 4200000000, cumulativeGrossAmount: 7700000000, advanceDeduction: 420000000, retentionDeduction: 210000000, backchargesDeduction: 25000000, taxAmount: 283600000, netPayableAmount: 3828600000, status: 'APPROVED' },
        { id: 3, certificateNumber: 'PPC-ADB-HTP-03', subcontractId, subcontractorName: 'Hưng Thịnh Phát', periodNumber: 3, billingStartDate: '2026-04-16', billingEndDate: '2026-05-15', grossAmount: 4650000000, cumulativeGrossAmount: 12350000000, advanceDeduction: 465000000, retentionDeduction: 232500000, backchargesDeduction: 0, taxAmount: 316200000, netPayableAmount: 4268700000, status: 'SUBMITTED' }
      ];
    }
  }
};

export const boqApi = {
  getEVMAnalysis: async (projectId: number): Promise<EVMAnalysis> => {
    try {
      const response = await apiClient.get<EVMAnalysis>(`/boq/${projectId}/evm`);
      return response.data;
    } catch {
      return {
        projectId,
        bac: 185000000000,
        plannedValue: 68500000000,
        earnedValue: 71225000000,
        actualCost: 67800000000,
        costVariance: 3425000000,
        scheduleVariance: 2725000000,
        cpi: 1.05,
        spi: 1.04,
        estimateAtCompletion: 176190476190,
        healthStatus: 'HEALTHY'
      };
    }
  }
};

export const inventoryApi = {
  getMaterials: async (): Promise<Material[]> => {
    try {
      const response = await apiClient.get<Material[]>('/materials');
      return response.data;
    } catch {
      return [
        { id: 1, code: 'MAT-STEEL-CB400', name: 'Thép thanh vằn Hòa Phát CB400 D20-D32', category: 'STEEL', unit: 'TẤN', standardNormRate: 2.50, specs: 'TCVN 1651-2:2018' },
        { id: 2, code: 'MAT-CONC-M300', name: 'Bê tông thương phẩm mác M300 R28', category: 'CONCRETE', unit: 'M3', standardNormRate: 1.50, specs: 'TCVN 9340:2012' },
        { id: 3, code: 'MAT-SAND-GOLD', name: 'Cát vàng xây tô bê tông hạt to', category: 'AGGREGATES', unit: 'M3', standardNormRate: 3.00, specs: 'TCVN 7570:2006' },
        { id: 4, code: 'MAT-CEMENT-PCB40', name: 'Xi măng Holcim/Insee PCB40 bao 50kg', category: 'CEMENT', unit: 'BAO', standardNormRate: 1.00, specs: 'TCVN 6260:2020' }
      ];
    }
  },

  getStockBalances: async (projectId: number): Promise<StockBalance[]> => {
    try {
      const response = await apiClient.get<StockBalance[]>(`/inventory/stock/${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, projectId, material: { id: 1, code: 'MAT-STEEL-CB400', name: 'Thép Hòa Phát CB400', category: 'STEEL', unit: 'TẤN', standardNormRate: 2.50 }, currentQuantity: 185.500, minimumThreshold: 50.000, lastUpdated: new Date().toISOString() },
        { id: 2, projectId, material: { id: 2, code: 'MAT-CONC-M300', name: 'Bê tông tươi M300', category: 'CONCRETE', unit: 'M3', standardNormRate: 1.50 }, currentQuantity: 42.000, minimumThreshold: 20.000, lastUpdated: new Date().toISOString() },
        { id: 3, projectId, material: { id: 3, code: 'MAT-SAND-GOLD', name: 'Cát vàng hạt to', category: 'AGGREGATES', unit: 'M3', standardNormRate: 3.00 }, currentQuantity: 310.000, minimumThreshold: 100.000, lastUpdated: new Date().toISOString() }
      ];
    }
  }
};

export const equipmentApi = {
  getEquipments: async (): Promise<Equipment[]> => {
    try {
      const response = await apiClient.get<Equipment[]>('/equipments');
      return response.data;
    } catch {
      return [
        { id: 1, code: 'EQ-CRANE-50T-01', name: 'Cần cẩu bánh xích Hitachi KH180-3 50T', category: 'CRANE', brand: 'Hitachi', ownerType: 'INTERNAL', status: 'OPERATIONAL', standardFuelNorm: 18.50, totalEngineHours: 4250.00, safetyInspectionExpiry: '2026-12-31' },
        { id: 2, code: 'EQ-EXC-KOMATSU-01', name: 'Máy xúc đào bánh xích Komatsu PC200-8', category: 'EXCAVATOR', brand: 'Komatsu', ownerType: 'INTERNAL', status: 'OPERATIONAL', standardFuelNorm: 15.20, totalEngineHours: 3120.00, safetyInspectionExpiry: '2026-10-30' },
        { id: 3, code: 'EQ-ROLLER-SAKAI-01', name: 'Máy lu rung Sakai SV520DH 14T', category: 'ROLLER', brand: 'Sakai', ownerType: 'INTERNAL', status: 'OPERATIONAL', standardFuelNorm: 12.00, totalEngineHours: 1450.00, safetyInspectionExpiry: '2027-03-20' }
      ];
    }
  }
};

export const winsteelApi = {
  getComponents: async (orderId: number): Promise<SteelComponent[]> => {
    try {
      const response = await apiClient.get<SteelComponent[]>(`/winsteel/components/order/${orderId}`);
      return response.data;
    } catch {
      return [
        { id: 101, componentMark: 'C1-1', componentType: 'COLUMN', profileSpecs: 'H500x250x8x12', steelGrade: 'SS400', lengthMm: 9500, weightKg: 1250, gridLocation: 'Trục 1-A', qrCodeUid: 'ADB-WS-P01-C1-001', cutStatus: 'COMPLETED', fitStatus: 'COMPLETED', weldStatus: 'NDT_PASSED', blastStatus: 'COMPLETED', paintStatus: 'COMPLETED', shippingStatus: 'ON_SITE', erectionStatus: 'ERECTED' },
        { id: 102, componentMark: 'R1-1', componentType: 'RAFTER', profileSpecs: 'H600~350x200x6x10', steelGrade: 'SS400', lengthMm: 15000, weightKg: 1680, gridLocation: 'Kèo Trục 1', qrCodeUid: 'ADB-WS-P01-R1-001', cutStatus: 'COMPLETED', fitStatus: 'COMPLETED', weldStatus: 'NDT_PASSED', blastStatus: 'COMPLETED', paintStatus: 'COMPLETED', shippingStatus: 'ON_SITE', erectionStatus: 'PENDING' },
        { id: 103, componentMark: 'Z200-01', componentType: 'PURLIN', profileSpecs: 'Z200x65x20x2.0', steelGrade: 'Q345B', lengthMm: 6000, weightKg: 35, gridLocation: 'Xà gồ mái trục 1-2', qrCodeUid: 'ADB-WS-P01-Z-001', cutStatus: 'COMPLETED', fitStatus: 'COMPLETED', weldStatus: 'COMPLETED', blastStatus: 'COMPLETED', paintStatus: 'COMPLETED', shippingStatus: 'IN_SHOP', erectionStatus: 'PENDING' }
      ];
    }
  }
};

export const qaqcApi = {
  getInspections: async (projectId: number): Promise<QAQCInspection[]> => {
    try {
      const response = await apiClient.get<QAQCInspection[]>(`/qaqc/inspections?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, projectId, inspectionCode: 'NT-ADB-2026-042', wbsCode: 'WBS-2.0', workCategory: 'Bê tông cốt thép móng', inspectionType: 'CONCEALED_WORK', standardReference: 'TCVN 4453:1995 & NĐ 06/2021/NĐ-CP', inspectionDate: '2026-10-18', inspectorADB: 'Kỹ sư Vũ Minh Trí (ADB QA/QC)', supervisionConsultant: 'TVGS Trưởng Trần Đình Trọng', result: 'PASSED', notes: 'Cốt thép đúng bản vẽ shop drawing số SD-ADB-FO-05, chiều dày lớp bê tông bảo vệ cọc 70mm đạt chuẩn.', attachedPhotosCount: 6 },
        { id: 2, projectId, inspectionCode: 'NT-ADB-2026-043', wbsCode: 'WBS-3.0', workCategory: 'Bu lông neo móng chân cột thép', inspectionType: 'STAGE', standardReference: 'TCVN 5575:2012 & AWS D1.1', inspectionDate: '2026-10-19', inspectorADB: 'Kỹ sư Hoàng Hải Đăng', supervisionConsultant: 'Kỹ sư Phan Bá Đạt (TVGS)', result: 'PASSED', notes: 'Định vị tim trục bu lông neo Gr.8.8 M30 sai số trong phạm vi ±2mm (cho phép ±3mm).', attachedPhotosCount: 4 },
        { id: 3, projectId, inspectionCode: 'NT-ADB-2026-044', wbsCode: 'WBS-3.0', workCategory: 'Khung thép tiền chế WinSteel đợt 1', inspectionType: 'MATERIAL_INCOMING', standardReference: 'TCVN 6735:2000 (Siêu âm mối hàn UT)', inspectionDate: '2026-10-20', inspectorADB: 'Kỹ sư Vũ Minh Trí', supervisionConsultant: 'TVGS Trưởng Trần Đình Trọng', result: 'PASSED_WITH_CONDITIONS', notes: 'Kiểm tra 100% chứng chỉ xuất xưởng CO/CQ và kết quả siêu âm đường hàn góc cánh kèo. Yêu cầu dặm sơn lót epoxy tại vị trí móc cáp cẩu.', attachedPhotosCount: 8 }
      ];
    }
  },

  getConcreteTests: async (projectId: number): Promise<ConcreteTestSample[]> => {
    try {
      const response = await apiClient.get<ConcreteTestSample[]>(`/qaqc/concrete-tests?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, projectId, sampleCode: 'BT-M300-R28-091', pourDate: '2026-09-22', batchPlantName: 'Trạm trộn Bê tông Lê Phan VSIP', designedGrade: 'B22.5 (M300)', slumpMm: 120, strengthR7Mpa: 24.8, strengthR28Mpa: 33.4, requiredStrengthMpa: 30.0, passPercentage: 111.3, status: 'PASSED' },
        { id: 2, projectId, sampleCode: 'BT-M350-R28-092', pourDate: '2026-09-28', batchPlantName: 'Trạm trộn Bê tông Fico Tây Ninh', designedGrade: 'B25 (M350)', slumpMm: 135, strengthR7Mpa: 28.5, strengthR28Mpa: 38.6, requiredStrengthMpa: 35.0, passPercentage: 110.2, status: 'PASSED' },
        { id: 3, projectId, sampleCode: 'BT-M400-R7-105', pourDate: '2026-10-14', batchPlantName: 'Trạm trộn Bê tông Lê Phan VSIP', designedGrade: 'B30 (M400)', slumpMm: 140, strengthR7Mpa: 32.1, strengthR28Mpa: 0, requiredStrengthMpa: 40.0, passPercentage: 80.25, status: 'TESTING' }
      ];
    }
  },

  getNCRs: async (projectId: number): Promise<NCRReport[]> => {
    try {
      const response = await apiClient.get<NCRReport[]>(`/qaqc/ncrs?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, ncrNumber: 'NCR-ADB-2026-003', projectId, title: 'Rỗ tổ ong bề mặt cổ cột C3 trục 4-B sau khi tháo dỡ ván khuôn', severity: 'MINOR', issuedBy: 'TVGS Trưởng Trần Đình Trọng', issuedTo: 'Đội Thi công Bê tông Móng số 1', issueDate: '2026-10-15', rootCause: 'Đầm dùi chưa kỹ tại góc hẹp vị trí thép dầy mật độ cao.', correctiveAction: 'Đục tẩy lớp bê tông xốp, quét phụ gia kết nối Sika Monotop R và trám vữa Sika Grout 214-11 cường độ cao.', deadline: '2026-10-18', status: 'VERIFIED_CLOSED' },
        { id: 2, ncrNumber: 'NCR-ADB-2026-004', projectId, title: 'Lớp mạ kẽm xà gồ Z200 bị trầy xước quá 50mm trong quá trình bốc dỡ', severity: 'MINOR', issuedBy: 'Kỹ sư Vũ Minh Trí (ADB QA/QC)', issuedTo: 'Đơn vị Vận chuyển & Kho bãi Tân Cảng', issueDate: '2026-10-19', rootCause: 'Xếp dỡ cọ xát cơ học bằng xích cáp không bọc đệm cao su bảo vệ.', correctiveAction: 'Sơn dặm phục hồi bề mặt bằng hợp chất giàu kẽm nguội Zinc Guard theo tiêu chuẩn ASTM A780.', deadline: '2026-10-22', status: 'IN_PROGRESS' }
      ];
    }
  }
};

export const hseApi = {
  getPermits: async (projectId: number): Promise<PermitToWork[]> => {
    try {
      const response = await apiClient.get<PermitToWork[]>(`/hse/permits?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, ptwNumber: 'PTW-2026-HW-051', projectId, permitType: 'HOT_WORK', location: 'Khu vực cụm vì kèo nhà xưởng trục 3-5', issuerName: 'Lê Hoàng Long (HSE Manager ADB)', receiverName: 'Nguyễn Thành Nam (Tổ trưởng Hàn WinSteel)', subcontractorName: 'Công ty Cổ phần Thép WinSteel', validFrom: '2026-10-21 07:30', validTo: '2026-10-21 17:30', gasCheckCompleted: true, fireExtinguisherPresent: true, fullHarnessCertified: true, status: 'ACTIVE' },
        { id: 2, ptwNumber: 'PTW-2026-HL-052', projectId, permitType: 'HEAVY_LIFTING', location: 'Khu vực cẩu lắp dầm cầu trục 20 tấn', issuerName: 'Lê Hoàng Long', receiverName: 'Vũ Đức Thắng (Lái cẩu 50T)', subcontractorName: 'Đội Xe máy ADB Nội bộ', validFrom: '2026-10-21 08:00', validTo: '2026-10-21 12:00', gasCheckCompleted: true, fireExtinguisherPresent: true, fullHarnessCertified: true, status: 'APPROVED' },
        { id: 3, ptwNumber: 'PTW-2026-WH-048', projectId, permitType: 'WORKING_AT_HEIGHT', location: 'Lắp dựng giàn giáo hoàn thiện mặt ngoài trục A', issuerName: 'Lê Hoàng Long', receiverName: 'Đặng Quốc Huy (Giám sát An toàn)', subcontractorName: 'Hưng Thịnh Phát', validFrom: '2026-10-20 07:30', validTo: '2026-10-20 17:30', gasCheckCompleted: false, fireExtinguisherPresent: true, fullHarnessCertified: true, status: 'CLOSED' }
      ];
    }
  },

  getIncidents: async (projectId: number): Promise<SafetyIncident[]> => {
    try {
      const response = await apiClient.get<SafetyIncident[]>(`/hse/incidents?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, incidentCode: 'INC-2026-NM-005', projectId, type: 'NEAR_MISS', incidentDate: '2026-10-17 14:15', location: 'Khu tập kết cấu kiện thép phía Đông', description: 'Cáp treo phụ của xe nâng bị tuột móc chốt an toàn khi hạ palet phụ kiện bulong neo, không gây thương tích hay hỏng hóc.', lostDays: 0, remedialAction: 'Thay thế lập tức chốt lưỡi gà an toàn cho 100% móc cẩu trên công trường, nhắc nhở trong buổi họp giao ban HSE.', status: 'CLOSED' }
      ];
    }
  },

  getToolboxMeetings: async (projectId: number): Promise<ToolboxMeeting[]> => {
    try {
      const response = await apiClient.get<ToolboxMeeting[]>(`/hse/toolbox?projectId=${projectId}`);
      return response.data;
    } catch {
      return [
        { id: 1, projectId, meetingDate: '2026-10-21', topic: 'Quy trình an toàn khi làm việc trên cao và kiểm tra đai an toàn 2 móc giảm chấn', leader: 'Lê Hoàng Long (HSE Manager)', attendeesCount: 118, keyHazardsDiscussed: 'Nguy cơ ngã cao tại mép sàn biên chưa lắp lan can bảo vệ; quy định buộc dây cứu sinh (lifeline) bằng cáp thép mạ kẽm D10mm.' },
        { id: 2, projectId, meetingDate: '2026-10-20', topic: 'An toàn phòng cháy chữa cháy (PCCC) trong công tác hàn cắt kim loại', leader: 'Nguyễn Văn Hùng (Chỉ huy trưởng)', attendeesCount: 125, keyHazardsDiscussed: 'Bạt chống cháy Spunlace cách ly khu vực hàn; trang bị tối thiểu 02 bình bột MFZ4 và 01 bình khí CO2 MT3 tại mỗi điểm hàn.' }
      ];
    }
  }
};

export const workforceWipApi = {
  getAttendances: async (): Promise<WorkerAttendance[]> => {
    return [
      { id: 1, workerName: 'Nguyễn Văn Tâm', trade: 'STEEL', teamName: 'Đội Cốt thép Móng 1', checkInTime: '06:45:12', gpsVerified: true, faceMatched: true, status: 'PRESENT' },
      { id: 2, workerName: 'Trần Văn Mạnh', trade: 'CONCRETE', teamName: 'Tổ Bê tông 2', checkInTime: '06:50:30', gpsVerified: true, faceMatched: true, status: 'PRESENT' },
      { id: 3, workerName: 'Lê Đình Bảo', trade: 'WELDING', teamName: 'Tổ Hàn WinSteel', checkInTime: '06:52:18', gpsVerified: true, faceMatched: true, status: 'PRESENT' },
      { id: 4, workerName: 'Phạm Văn Hòa', trade: 'FORMWORK', teamName: 'Tổ Cốp pha Dầm sàn', checkInTime: '07:15:00', gpsVerified: true, faceMatched: true, status: 'PRESENT' },
      { id: 5, workerName: 'Hoàng Quốc Việt', trade: 'MEP', teamName: 'Tổ Điện PCCC', checkInTime: '06:58:44', gpsVerified: true, faceMatched: true, status: 'PRESENT' }
    ];
  },

  getWIPReport: async (projectId: number): Promise<ProjectWIPAccounting> => {
    return {
      projectId,
      contractValue: 185000000000,
      cumulativeCost: 67800000000,
      actualCostIncurred: 67800000000,
      estimateAtCompletion: 176190476190,
      pocPercentage: 38.5,
      recognizedRevenue: 71225000000,
      unbilledReceivables: 3425000000,
      costMaterial621: 42500000000,
      costLabor622: 14200000000,
      costEquipment623: 7800000000,
      costOverhead627: 3300000000
    };
  }
};

export const claimsApi = {
  getVariationOrders: async (projectId: number): Promise<VariationOrder[]> => {
    return [
      { id: 1, voNumber: 'VO-ADB-2026-001', projectId, title: 'Nâng chiều cao thông thủy nhà xưởng từ 9.5m lên 11.2m', scopeDescription: 'Tăng tiết diện cột H500 lên H600 và gia cường vì kèo chịu tải trọng lắp đặt hệ thống pin mặt trời Rooftop Solar 1.2MWp.', proposedAmount: 8500000000, approvedAmount: 8200000000, timeExtensionDays: 14, initiator: 'CLIENT', status: 'APPROVED' },
      { id: 2, voNumber: 'VO-ADB-2026-002', projectId, title: 'Bổ sung mương cáp ngầm kỹ thuật và hố ga van xả lũ', scopeDescription: 'Thay đổi hướng tuyến cấp thoát nước ngoài ranh dự án do vướng cáp quang ngầm của KCN.', proposedAmount: 1850000000, approvedAmount: 1750000000, timeExtensionDays: 5, initiator: 'CONTRACTOR', status: 'UNDER_REVIEW' }
    ];
  },

  getFidicClaims: async (projectId: number): Promise<FidicClaim[]> => {
    return [
      { id: 1, claimNumber: 'CLAIM-ADB-EOT-01', clause: 'CLAUSE_8.4_EOT', eventDescription: 'Bàn giao mặt bằng chậm 21 ngày tại khu vực trạm biến áp và bể nước ngầm do Chủ đầu tư chưa hoàn tất giải phóng mặt bằng với BQL KCN.', noticeDate: '2026-02-28', detailedParticularsDate: '2026-03-25', daysRemainingBeforeTimeBar: 0, claimedExtensionDays: 21, claimedAmount: 1250000000, engineerDeterminationStatus: 'DETERMINED' },
      { id: 2, claimNumber: 'CLAIM-ADB-VO-02', clause: 'CLAUSE_20.1', eventDescription: 'Mưa lớn bất thường vượt cấp lịch sử làm ngập móng trong 4 ngày liên tục, phải huy động máy bơm công suất lớn chống ngập.', noticeDate: '2026-04-10', detailedParticularsDate: '2026-05-05', daysRemainingBeforeTimeBar: 18, claimedExtensionDays: 4, claimedAmount: 450000000, engineerDeterminationStatus: 'SUBMITTED' }
    ];
  }
};
