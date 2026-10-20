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
  SteelComponent
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
      // Fallback mock data when backend is starting or offline
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
        { id: 1, projectId, wbsCode: 'WBS-1.0', name: 'Giai đoạn Chuẩn bị & Cọc thử nghiệm móng', level: 1, weightPercentage: 10, progressPercentage: 100, status: 'COMPLETED' },
        { id: 2, projectId, wbsCode: 'WBS-2.0', name: 'Thi công Kết cấu Móng & Bể nước ngầm PCCC', level: 1, weightPercentage: 25, progressPercentage: 85, status: 'IN_PROGRESS' },
        { id: 3, projectId, wbsCode: 'WBS-3.0', name: 'Gia công & Lắp dựng Khung Kết cấu Thép (WinSteel)', level: 1, weightPercentage: 35, progressPercentage: 20, status: 'IN_PROGRESS' },
        { id: 4, projectId, wbsCode: 'WBS-4.0', name: 'Thi công Bao che, Tấm lợp & Nền bê tông xoa phẳng', level: 1, weightPercentage: 15, progressPercentage: 0, status: 'NOT_STARTED' },
        { id: 5, projectId, wbsCode: 'WBS-5.0', name: 'Hệ thống Cơ điện M&E, PCCC & Trạm biến áp', level: 1, weightPercentage: 15, progressPercentage: 0, status: 'NOT_STARTED' },
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
          weatherMorning: 'Nắng ráo, gió nhẹ',
          weatherAfternoon: 'Nắng gắt, oi bức',
          temperatureCelsius: 33.5,
          isWeatherStoppage: false,
          stoppageHours: 0,
          directManpowerCount: 42,
          subcontractorManpowerCount: 78,
          workPerformedSummary: 'Đổ bê tông sàn tầng lửng trục 1-5 (khối lượng 145m3); Gia công cốt thép đài móng trục 6-10; Thi công lắp giàn giáo an toàn lưới bao che theo NĐ 06/2021/NĐ-CP.',
          issuesAndRisks: 'Không phát sinh rủi ro bất thường. Nguồn điện lưới ổn định.',
          safetyNotes: '100% công nhân đeo dây đai an toàn 2 móc khi thao tác trên giàn giáo cao >2m. Buổi sáng họp Tool-box 15 phút.',
          siteManagerSignature: 'Nguyễn Văn Hùng (Chỉ huy trưởng)',
          consultantSignature: 'Trần Đình Trọng (TVGS Trưởng)'
        }
      ];
    }
  }
};

export const subcontractorApi = {
  getSubcontractors: async (): Promise<Subcontractor[]> => {
    try {
      const response = await apiClient.get<Subcontractor[]>('/subcontractors');
      return response.data;
    } catch {
      return [
        { id: 1, code: 'SUB-STEEL-001', name: 'Công ty Cổ phần Cơ khí Xây dựng Việt Thép', taxCode: '0301234567', representative: 'Nguyễn Văn Hùng', specialty: 'Kết cấu thép nhà xưởng & Gia công xà gồ', ratingGrade: 'A', status: 'ACTIVE' },
        { id: 2, code: 'SUB-MEP-002', name: 'Công ty TNHH Cơ điện Lạnh Á Châu', taxCode: '0309876543', representative: 'Trần Đình Trọng', specialty: 'Hệ thống HVAC, PCCC & Điện trung thế', ratingGrade: 'A', status: 'ACTIVE' },
        { id: 3, code: 'SUB-FOUND-003', name: 'Công ty CP Nền móng & Thi công Cọc Đại Nam', taxCode: '0311556677', representative: 'Lê Hoàng Nam', specialty: 'Ép cọc dự ứng lực & Khoan nhồi D1200', ratingGrade: 'B', status: 'ACTIVE' }
      ];
    }
  },

  getSubcontracts: async (projectId: number): Promise<Subcontract[]> => {
    try {
      const response = await apiClient.get<Subcontract[]>(`/subcontractors/project/${projectId}/contracts`);
      return response.data;
    } catch {
      return [
        {
          id: 10,
          contractNumber: 'HĐGK-ADB-2026/04-ST',
          projectId,
          subcontractorId: 1,
          subcontractorName: 'Công ty Cổ phần Cơ khí Xây dựng Việt Thép',
          title: 'Giao khoán Gia công & Lắp dựng Kết cấu Thép Nhà máy Chính',
          contractType: 'UNIT_PRICE',
          totalValue: 32500000000,
          advancePaymentRate: 10,
          advancePaymentAmount: 3250000000,
          retentionRate: 5,
          retentionAccumulated: 450000000,
          status: 'EXECUTING'
        }
      ];
    }
  },

  getCertificates: async (subcontractId: number): Promise<PaymentCertificate[]> => {
    try {
      const response = await apiClient.get<PaymentCertificate[]>(`/payment-certificates/subcontract/${subcontractId}`);
      return response.data;
    } catch {
      return [
        {
          id: 101,
          certificateNumber: 'PPC-HĐGK-ADB-2026/04-ST-P01',
          subcontractId,
          periodNumber: 1,
          billingStartDate: '2026-03-01',
          billingEndDate: '2026-03-31',
          grossAmount: 4500000000,
          cumulativeGrossAmount: 4500000000,
          advanceDeduction: 450000000,
          retentionDeduction: 225000000,
          backchargesDeduction: 15000000,
          taxAmount: 324000000,
          netPayableAmount: 4134000000,
          status: 'APPROVED'
        }
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
        plannedValue: 71225000000,
        earnedValue: 72850000000,
        actualCost: 69400000000,
        costVariance: 3450000000,
        scheduleVariance: 1625000000,
        cpi: 1.05,
        spi: 1.02,
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
