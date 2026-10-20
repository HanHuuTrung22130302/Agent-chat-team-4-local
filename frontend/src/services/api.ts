import axios from 'axios';
import { Project, WBSItem, DailySiteDiary, Subcontractor, Subcontract, PaymentCertificate } from '../types';

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
