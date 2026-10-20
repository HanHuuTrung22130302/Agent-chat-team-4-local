import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Wind,
  CloudSun,
  ShieldCheck,
  Check,
  ChevronRight,
  Sliders,
  Camera,
  Activity
} from 'lucide-react';
import { Project, ExecutiveSCurvePoint, PendingApprovalItem } from '../../types';

interface ProjectDashboardProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  onOpenCreateModal: () => void;
  isDarkMode?: boolean;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenCreateModal,
  isDarkMode = true
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(3); // Default to May
  const [approvals, setApprovals] = useState<PendingApprovalItem[]>([
    { id: 'APP-01', type: 'PPC', title: 'Chứng chỉ thanh toán PPC đợt 3 — Thầu phụ Hưng Thịnh Phát', requester: 'Kỹ sư QS Nguyễn Văn Nam', amountOrScale: '4.268.700.000 ₫', submittedAt: '10 phút trước', priority: 'CRITICAL' },
    { id: 'APP-02', type: 'MR', title: 'Phiếu cấp 25.5 tấn thép D20 CB400 dầm D3', requester: 'Tổ trưởng Bê tông Móng 1', amountOrScale: '25.5 TẤN', submittedAt: '45 phút trước', priority: 'HIGH' },
    { id: 'APP-03', type: 'PTW', title: 'Giấy phép làm việc trên cao lắp kèo thép WinSteel trục 3', requester: 'Tổ trưởng Hàn WinSteel', amountOrScale: 'Độ cao 14.5m', submittedAt: '1 giờ trước', priority: 'HIGH' },
    { id: 'APP-04', type: 'RFI', title: 'Nghiệm thu công việc ẩn giấu cốt thép đài móng ĐM-05', requester: 'Kỹ sư QA/QC Vũ Minh Trí', amountOrScale: 'NĐ 06/2021', submittedAt: '2 giờ trước', priority: 'NORMAL' },
  ]);

  const sCurveData: ExecutiveSCurvePoint[] = [
    { month: 'T2', plannedCumulativePct: 5, actualCumulativePct: 5, costCumulativeVndBillion: 8.5, earnedValueVndBillion: 9.25 },
    { month: 'T3', plannedCumulativePct: 12, actualCumulativePct: 14, costCumulativeVndBillion: 21.0, earnedValueVndBillion: 25.9 },
    { month: 'T4', plannedCumulativePct: 22, actualCumulativePct: 24, costCumulativeVndBillion: 39.5, earnedValueVndBillion: 44.4 },
    { month: 'T5', plannedCumulativePct: 34, actualCumulativePct: 38.5, costCumulativeVndBillion: 65.0, earnedValueVndBillion: 71.2 },
    { month: 'T6', plannedCumulativePct: 48, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    { month: 'T7', plannedCumulativePct: 62, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    { month: 'T8', plannedCumulativePct: 75, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    { month: 'T9', plannedCumulativePct: 88, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    { month: 'T10', plannedCumulativePct: 96, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
    { month: 'T11', plannedCumulativePct: 100, actualCumulativePct: 0, costCumulativeVndBillion: 0, earnedValueVndBillion: 0 },
  ];

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  const totalContractValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const avgProgress = projects.length > 0 
    ? Number((projects.reduce((acc, p) => acc + p.progressPercentage, 0) / projects.length).toFixed(1))
    : 0;

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.filter(item => item.id !== id));
  };

  const selectedPoint = sCurveData[selectedMonthIndex];

  return (
    <div className="space-y-6">
      {/* 1. Executive Top Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Portfolio */}
        <div className={`p-4 rounded-xl border shadow-sm transition ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-400">
            <span className="font-bold uppercase tracking-wider">Tổng Giá Trị Hợp Đồng EPC</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">{formatVND(totalContractValue)}</div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-500 font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+15.4% so với kế hoạch quý</span>
          </div>
        </div>

        {/* KPI 2: Weighted Progress */}
        <div className={`p-4 rounded-xl border shadow-sm transition ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-400">
            <span className="font-bold uppercase tracking-wider">Tiến Độ Bình Quân Toàn Khối</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-500 tracking-tight">{avgProgress}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${avgProgress}%` }}
            />
          </div>
        </div>

        {/* KPI 3: Active Sites */}
        <div className={`p-4 rounded-xl border shadow-sm transition ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-400">
            <span className="font-bold uppercase tracking-wider">Đại Dự Án Đang Thi Công</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black tracking-tight">{projects.length} Dự Án Trọng Điểm</div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            KCN Sóng Thần 3 & VSIP II-A Bình Dương
          </div>
        </div>

        {/* KPI 4: HSE Zero Incident */}
        <div className={`p-4 rounded-xl border shadow-sm transition ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-xs mb-1.5 text-slate-400">
            <span className="font-bold uppercase tracking-wider">Giờ An Toàn Không Tai Nạn</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-500 tracking-tight">345,200 Giờ</div>
          <div className="text-xs text-emerald-500 font-semibold mt-1">
            Kỷ lục 0 Ca LTI • Nghị định 06/2021
          </div>
        </div>
      </div>

      {/* 2. Interactive Executive S-Curve Progress Chart */}
      <div className={`p-5 rounded-xl border shadow-sm transition ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 mb-4 border-slate-800/80">
          <div>
            <h3 className="font-bold text-sm flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Đường Cong Tiến Độ Luỹ Kế S-Curve (Planned PV vs Earned EV vs Actual Cost)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Đo lường tiến độ tổng thể danh mục dự án EPC theo chuẩn Quản trị Giá trị Thu được (EVM)
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-blue-500 rounded"></span>
              <span className="text-blue-400">Kế hoạch (PV)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded"></span>
              <span className="text-emerald-400">Thực hiện (EV)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded"></span>
              <span className="text-amber-400">Chi phí (AC)</span>
            </span>
          </div>
        </div>

        {/* SVG S-Curve Chart Container */}
        <div className="h-44 w-full relative">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 900 150" preserveAspectRatio="none">
            {/* Grid horizontal lines */}
            <line x1="0" y1="20" x2="900" y2="20" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} strokeDasharray="4" />
            <line x1="0" y1="60" x2="900" y2="60" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} strokeDasharray="4" />
            <line x1="0" y1="100" x2="900" y2="100" stroke={isDarkMode ? '#1e293b' : '#f1f5f9'} strokeDasharray="4" />
            <line x1="0" y1="140" x2="900" y2="140" stroke={isDarkMode ? '#334155' : '#cbd5e1'} />

            {/* Planned S-Curve Path (Blue) */}
            <path
              d="M 45,140 C 200,135 300,90 450,60 C 600,30 750,15 855,10"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
            />

            {/* Actual EV Curve Path up to Month 4 (Green) */}
            <path
              d="M 45,140 C 135,133 225,120 315,85"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
            />

            {/* Actual Cost AC Curve Path up to Month 4 (Amber) */}
            <path
              d="M 45,140 C 135,135 225,125 315,92"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="3 3"
            />

            {/* Data Points */}
            {sCurveData.map((pt, i) => {
              const cx = 45 + i * 90;
              const isActual = i <= 3;
              const isSelected = i === selectedMonthIndex;
              return (
                <g key={pt.month} className="cursor-pointer" onClick={() => setSelectedMonthIndex(i)}>
                  {/* Vertical hover guide */}
                  {isSelected && (
                    <line x1={cx} y1="0" x2={cx} y2="140" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2" />
                  )}
                  {/* Planned Point */}
                  <circle cx={cx} cy={140 - pt.plannedCumulativePct * 1.3} r={isSelected ? 5 : 3.5} fill="#3b82f6" />
                  {/* Actual Point if present */}
                  {isActual && (
                    <circle cx={cx} cy={140 - pt.actualCumulativePct * 1.3} r={isSelected ? 6 : 4.5} fill="#10b981" />
                  )}
                  {/* Month Label */}
                  <text x={cx} y="152" textAnchor="middle" fontSize="10" fill={isSelected ? '#38bdf8' : '#94a3b8'} fontWeight="bold">
                    {pt.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Interactive Point Details Inspector */}
        {selectedPoint && (
          <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sky-400 font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-800">
                Tháng {selectedPoint.month}
              </span>
              <span className="text-slate-300">
                Kế hoạch: <strong className="text-blue-400">{selectedPoint.plannedCumulativePct}%</strong>
              </span>
              {selectedPoint.actualCumulativePct > 0 ? (
                <span className="text-slate-300">
                  • Thực hiện: <strong className="text-emerald-400">{selectedPoint.actualCumulativePct}%</strong>
                  <span className="ml-1 text-[11px] text-emerald-400 font-semibold">(Vượt tiến độ +4.5%)</span>
                </span>
              ) : (
                <span className="text-slate-500 italic">• Chưa đến kỳ báo cáo</span>
              )}
            </div>

            {selectedPoint.costCumulativeVndBillion > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-slate-400">
                  Giá trị nghiệm thu (EV): <strong className="text-emerald-400">{selectedPoint.earnedValueVndBillion} Tỷ VNĐ</strong>
                </span>
                <span className="text-slate-400">
                  Chi phí thực tế (AC): <strong className="text-amber-400">{selectedPoint.costCumulativeVndBillion} Tỷ VNĐ</strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 text-[11px]">
                  Tiết kiệm chi phí (CV &gt; 0)
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Main Dashboard Body: Left 2/3 Portfolio Matrix vs Right 1/3 Site Command & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Portfolio (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toolbar */}
          <div className={`p-4 rounded-xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center space-x-2">
              {(['ALL', 'ACTIVE', 'PLANNING'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    filterStatus === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab === 'ALL' ? 'Tất cả Dự án' : tab === 'ACTIVE' ? 'Đang thi công' : 'Chuẩn bị'}
                </button>
              ))}
            </div>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Khởi tạo Dự án EPC Mới</span>
            </button>
          </div>

          {/* Project Cards with Gantt Breakdown */}
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`p-5 rounded-xl border shadow-sm cursor-pointer transition hover:border-blue-500 space-y-4 ${
                  selectedProject?.id === project.id 
                    ? isDarkMode ? 'bg-slate-800/80 border-blue-500 ring-1 ring-blue-500/50' : 'bg-blue-50/50 border-blue-400 ring-1 ring-blue-400/40'
                    : isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-sky-400 px-2.5 py-0.5 rounded bg-sky-950/80 border border-sky-800">
                        {project.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {project.status === 'ACTIVE' ? 'ĐANG TRIỂN KHAI' : 'CHUẨN BỊ'}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden md:inline">
                        • Hợp đồng FIDIC Silver Book EPC
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1.5 flex items-center space-x-2">
                      <span>{project.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-slate-400" />
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Giá Trị EPC</span>
                    <div className="text-lg font-black text-white">{formatVND(project.contractValue)}</div>
                  </div>
                </div>

                {/* Project Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="truncate">{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate">CĐT: {project.clientName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Bàn giao: {project.plannedEndDate}</span>
                  </div>
                </div>

                {/* Multi-Phase Gantt Mini-Progress Bar */}
                <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">Phân kỳ Thi công Hiện trường:</span>
                    <span className="font-bold text-emerald-400">{project.progressPercentage}% Hoàn thành</span>
                  </div>

                  {/* 4-Stage Mini Gantt Segments */}
                  <div className="grid grid-cols-4 gap-1.5 text-[10px] font-mono">
                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>1. Móng Cọc</span>
                        <span className="text-emerald-400 font-bold">100%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>2. Thép WinSteel</span>
                        <span className="text-sky-400 font-bold">45%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 w-[45%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>3. Bao Che</span>
                        <span className="text-slate-500">0%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 w-0" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-400 mb-0.5">
                        <span>4. M&E / PCCC</span>
                        <span className="text-slate-500">0%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-700 w-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Site Weather Radar & Approval Center (1/3 width) */}
        <div className="space-y-4">
          {/* Widget 1: Site Weather Radar & Crane Operating Safety */}
          <div className={`p-4 rounded-xl border shadow-sm space-y-3 transition ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <CloudSun className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Radar Hiện Trường & Cần Cẩu
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>An Toàn Cẩu</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px] mb-1">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tốc độ Gió</span>
                </div>
                <div className="text-lg font-black text-white">18.5 km/h</div>
                <span className="text-[10px] text-emerald-400 font-semibold">&lt; 45 km/h (Đủ đ/k cẩu)</span>
              </div>

              <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-lg">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px] mb-1">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Nhiệt độ & Mưa</span>
                </div>
                <div className="text-lg font-black text-amber-400">33.5°C</div>
                <span className="text-[10px] text-slate-400">Khả năng mưa 5%</span>
              </div>
            </div>

            {/* Webcam / Drone 360 preview mockup */}
            <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 h-28 flex items-center justify-center text-slate-400 text-xs">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="z-10 text-center space-y-1">
                <div className="flex items-center justify-center space-x-1 text-emerald-400 text-[11px] font-bold">
                  <Camera className="w-3.5 h-3.5 animate-pulse" />
                  <span>CAM-01: KHU VỰC CẨU LẮP TRỤC 1-5</span>
                </div>
                <p className="text-[10px] text-slate-300">Live 1080p • KCN Sóng Thần 3</p>
              </div>
            </div>
          </div>

          {/* Widget 2: Pending Approval Inbox */}
          <div className={`p-4 rounded-xl border shadow-sm space-y-3 transition ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Hộp Thư Chờ Duyệt Lệnh ({approvals.length})
                </span>
              </div>
              <span className="text-[11px] text-rose-400 font-bold">Cần ký điện tử</span>
            </div>

            <div className="space-y-2.5">
              {approvals.map((app) => (
                <div 
                  key={app.id} 
                  className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2 hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        app.type === 'PPC' 
                          ? 'bg-amber-950 text-amber-400 border-amber-800' 
                          : app.type === 'MR'
                          ? 'bg-sky-950 text-sky-400 border-sky-800'
                          : 'bg-rose-950 text-rose-400 border-rose-800'
                      }`}>
                        {app.type}
                      </span>
                      <h4 className="text-xs font-semibold text-white mt-1 leading-snug">
                        {app.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="font-mono text-emerald-400 font-bold">{app.amountOrScale}</span>
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] transition shadow-sm"
                    >
                      Duyệt Nhanh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
