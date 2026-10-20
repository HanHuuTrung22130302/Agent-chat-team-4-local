import { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  FileSpreadsheet, 
  Users, 
  Truck, 
  HardHat, 
  Factory, 
  Clock, 
  DollarSign, 
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Receipt,
  Boxes,
  Activity,
  AlertTriangle,
  QrCode,
  Gauge
} from 'lucide-react';
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
} from './types';
import { 
  projectApi, 
  subcontractorApi, 
  boqApi, 
  inventoryApi, 
  equipmentApi, 
  winsteelApi 
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'wbs' | 'diary' | 'subcontractors' | 'boq' | 'inventory' | 'equipment' | 'winsteel'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([]);
  const [diaries, setDiaries] = useState<DailySiteDiary[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [subcontracts, setSubcontracts] = useState<Subcontract[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  
  // New Modules Data
  const [evmData, setEvmData] = useState<EVMAnalysis | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stockBalances, setStockBalances] = useState<StockBalance[]>([]);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [components, setComponents] = useState<SteelComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const projList = await projectApi.getProjects();
      setProjects(projList);
      const subList = await subcontractorApi.getSubcontractors();
      setSubcontractors(subList);
      const matList = await inventoryApi.getMaterials();
      setMaterials(matList);
      const eqList = await equipmentApi.getEquipments();
      setEquipments(eqList);
      const compList = await winsteelApi.getComponents(1);
      setComponents(compList);

      if (projList.length > 0) {
        const p = projList[0];
        setSelectedProject(p);
        const wbs = await projectApi.getProjectWBS(p.id);
        const diaryList = await projectApi.getSiteDiaries(p.id);
        const contractList = await subcontractorApi.getSubcontracts(p.id);
        const evm = await boqApi.getEVMAnalysis(p.id);
        const stocks = await inventoryApi.getStockBalances(p.id);

        setWbsItems(wbs);
        setDiaries(diaryList);
        setSubcontracts(contractList);
        setEvmData(evm);
        setStockBalances(stocks);

        if (contractList.length > 0) {
          const certList = await subcontractorApi.getCertificates(contractList[0].id);
          setCertificates(certList);
        }
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSelectProject = async (p: Project) => {
    setSelectedProject(p);
    const wbs = await projectApi.getProjectWBS(p.id);
    const diaryList = await projectApi.getSiteDiaries(p.id);
    const contractList = await subcontractorApi.getSubcontracts(p.id);
    const evm = await boqApi.getEVMAnalysis(p.id);
    const stocks = await inventoryApi.getStockBalances(p.id);

    setWbsItems(wbs);
    setDiaries(diaryList);
    setSubcontracts(contractList);
    setEvmData(evm);
    setStockBalances(stocks);

    if (contractList.length > 0) {
      const certList = await subcontractorApi.getCertificates(contractList[0].id);
      setCertificates(certList);
    } else {
      setCertificates([]);
    }
  };

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-sky-500/20">
            ADB
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">ÁNH DƯƠNG BLDG</h1>
            <p className="text-xs text-sky-400 font-medium">Design & Build ERP</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Phân hệ Quản trị (12 Modules)
          </div>
          
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'projects' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <FolderKanban className="w-4 h-4 text-sky-400" />
            <span>01. Dự án & Tổng quan</span>
          </button>

          <button 
            onClick={() => setActiveTab('wbs')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'wbs' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>01. Phân rã WBS</span>
          </button>

          <button 
            onClick={() => setActiveTab('diary')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'diary' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>02. Nhật ký & Nhân công</span>
          </button>

          <button 
            onClick={() => setActiveTab('boq')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'boq' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>03. BOQ & Phân tích EVM</span>
          </button>

          <button 
            onClick={() => setActiveTab('subcontractors')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'subcontractors' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>04. Thầu phụ & FIDIC PPC</span>
          </button>

          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'inventory' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Boxes className="w-4 h-4 text-teal-400" />
            <span>05. Vật tư & Định mức TT12</span>
          </button>

          <button 
            onClick={() => setActiveTab('equipment')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'equipment' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Truck className="w-4 h-4 text-orange-400" />
            <span>06. Đội Xe máy & Ca máy</span>
          </button>

          <button 
            onClick={() => setActiveTab('winsteel')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'winsteel' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Factory className="w-4 h-4 text-purple-400" />
            <span>07. Nhà máy Thép WinSteel</span>
          </button>
        </nav>

        {/* User Info / Version */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
          <span>Ánh Dương ERP v2.0</span>
          <span className="flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            Online
          </span>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-slate-900/60 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Dự án Chọn lọc:
            </label>
            <select 
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const found = projects.find(p => p.id === Number(e.target.value));
                if (found) handleSelectProject(found);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
              Chỉ huy trưởng: <strong>Nguyễn Văn Hùng</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-sky-950/60 border border-sky-800 text-sky-400 font-semibold">
              FIDIC D&B General Contractor
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-20 text-slate-400 text-sm">
              <Clock className="w-5 h-5 mr-2 animate-spin text-sky-500" />
              Đang đồng bộ dữ liệu hiện trường từ Server...
            </div>
          )}

          {/* TAB 1: DỰ ÁN */}
          {activeTab === 'projects' && selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Giá trị Hợp đồng EPC</span>
                    <DollarSign className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xl font-bold text-white tracking-tight">
                    {formatVND(selectedProject.contractValue)}
                  </div>
                  <div className="text-xs text-sky-400 mt-1">Đã bao gồm VAT & WinSteel BOM</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Tiến độ Thi công</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold text-emerald-400">
                    {selectedProject.progressPercentage}%
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedProject.progressPercentage}%` }}></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Thời hạn Bàn giao</span>
                    <Calendar className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-base font-bold text-white">
                    {selectedProject.plannedEndDate}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Khởi công: {selectedProject.startDate}</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Địa điểm Công trường</span>
                    <MapPin className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {selectedProject.location}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Chủ đầu tư: {selectedProject.clientName}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WBS */}
          {activeTab === 'wbs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <span>Cây Phân rã Công việc WBS (Work Breakdown Structure)</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Mã WBS</th>
                      <th className="py-3 px-4 font-semibold">Tên Hạng mục Công tác</th>
                      <th className="py-3 px-4 font-semibold text-center">Tỷ trọng (%)</th>
                      <th className="py-3 px-4 font-semibold text-center">Tiến độ (%)</th>
                      <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {wbsItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium text-sky-400">{item.wbsCode}</td>
                        <td className="py-3 px-4 font-semibold text-white">{item.name}</td>
                        <td className="py-3 px-4 text-center">{item.weightPercentage}%</td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-bold text-emerald-400">{item.progressPercentage}%</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-sky-950 text-sky-400 border border-sky-800'}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NHẬT KÝ */}
          {activeTab === 'diary' && (
            <div className="space-y-4">
              {diaries.map((d) => (
                <div key={d.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold rounded">
                        Ngày {d.diaryDate}
                      </span>
                      <span className="text-xs text-slate-400">Nhiệt độ: {d.temperatureCelsius}°C</span>
                      <span className="text-xs text-slate-400">Thời tiết: {d.weatherMorning}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Tổng quân số: <strong className="text-white">{d.directManpowerCount + d.subcontractorManpowerCount} người</strong> (Cơ hữu: {d.directManpowerCount}, Thầu phụ: {d.subcontractorManpowerCount})
                    </div>
                  </div>
                  <div className="text-sm text-slate-200 leading-relaxed">
                    <strong>Nội dung thi công hoàn thành:</strong> {d.workPerformedSummary}
                  </div>
                  <div className="text-xs text-amber-400/90 bg-amber-950/20 border border-amber-900/40 p-2.5 rounded">
                    <strong>An toàn lao động (HSE):</strong> {d.safetyNotes}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: BOQ & EVM ANALYSIS */}
          {activeTab === 'boq' && evmData && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Ngân sách Hoàn thành (BAC)</span>
                  <div className="text-lg font-bold text-white mt-1">{formatVND(evmData.bac)}</div>
                  <span className="text-[11px] text-slate-500">Giá trị tổng dự toán</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Giá trị Thực hiện (EV)</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1">{formatVND(evmData.earnedValue)}</div>
                  <span className="text-[11px] text-emerald-500/80">Khối lượng nghiệm thu</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Chi phí Thực tế (AC)</span>
                  <div className="text-lg font-bold text-sky-400 mt-1">{formatVND(evmData.actualCost)}</div>
                  <span className="text-[11px] text-sky-500/80">Kho + Thầu phụ + Máy</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Chỉ số Hiệu suất CPI / SPI</span>
                  <div className="text-lg font-bold text-white mt-1">
                    CPI: <span className="text-emerald-400">{evmData.cpi}</span> | SPI: <span className="text-cyan-400">{evmData.spi}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400">Tiết kiệm & Đúng tiến độ</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-bold text-sm text-white mb-3">Đo lường Độ lệch Chi phí & Tiến độ (Earned Value Management)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Chênh lệch Chi phí (Cost Variance - CV)</span>
                    <div className="text-base font-bold text-emerald-400 mt-1">+{formatVND(evmData.costVariance)}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">EV - AC &gt; 0 (Chi phí thực tế thấp hơn giá trị thu được)</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Chênh lệch Tiến độ (Schedule Variance - SV)</span>
                    <div className="text-base font-bold text-cyan-400 mt-1">+{formatVND(evmData.scheduleVariance)}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">EV - PV &gt; 0 (Tiến độ thực tế nhanh hơn kế hoạch)</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Dự toán khi Hoàn thành (EAC)</span>
                    <div className="text-base font-bold text-white mt-1">{formatVND(evmData.estimateAtCompletion)}</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">BAC / CPI (Dự báo tổng chi phí cuối kỳ)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THẦU PHỤ & FIDIC PPC */}
          {activeTab === 'subcontractors' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Hợp đồng Giao khoán Thầu phụ (FIDIC Subcontracts)</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Số Hợp đồng</th>
                        <th className="py-3 px-4 font-semibold">Nhà thầu phụ</th>
                        <th className="py-3 px-4 font-semibold">Nội dung Giao khoán</th>
                        <th className="py-3 px-4 font-semibold text-right">Giá trị HĐ (VNĐ)</th>
                        <th className="py-3 px-4 font-semibold text-center">Tạm ứng</th>
                        <th className="py-3 px-4 font-semibold text-center">Bảo hành</th>
                        <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {subcontracts.map((sc) => (
                        <tr key={sc.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-mono font-medium text-sky-400">{sc.contractNumber}</td>
                          <td className="py-3 px-4 font-semibold text-white">{sc.subcontractorName}</td>
                          <td className="py-3 px-4 text-slate-300">{sc.title}</td>
                          <td className="py-3 px-4 text-right font-bold text-white">{formatVND(sc.totalValue)}</td>
                          <td className="py-3 px-4 text-center">{sc.advancePaymentRate}%</td>
                          <td className="py-3 px-4 text-center">{sc.retentionRate}%</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {sc.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PPC Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Receipt className="w-5 h-5 text-teal-400" />
                  <span>Chứng chỉ Thanh toán Tạm tính PPC (Progress Payment Certificates - FIDIC)</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Số Chứng chỉ</th>
                        <th className="py-3 px-4 font-semibold">Kỳ</th>
                        <th className="py-3 px-4 font-semibold">Giai đoạn</th>
                        <th className="py-3 px-4 font-semibold text-right">Khối lượng Đợt</th>
                        <th className="py-3 px-4 font-semibold text-right">Thu hồi Tạm ứng</th>
                        <th className="py-3 px-4 font-semibold text-right">Giữ lại Bảo hành 5%</th>
                        <th className="py-3 px-4 font-semibold text-right text-emerald-400">Thực thanh toán</th>
                        <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {certificates.map((cert) => (
                        <tr key={cert.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-mono text-teal-400 font-medium">{cert.certificateNumber}</td>
                          <td className="py-3 px-4 font-semibold text-white">Kỳ {cert.periodNumber}</td>
                          <td className="py-3 px-4 text-slate-400">{cert.billingStartDate} → {cert.billingEndDate}</td>
                          <td className="py-3 px-4 text-right font-medium text-slate-200">{formatVND(cert.grossAmount)}</td>
                          <td className="py-3 px-4 text-right text-rose-400">-{formatVND(cert.advanceDeduction)}</td>
                          <td className="py-3 px-4 text-right text-amber-400">-{formatVND(cert.retentionDeduction)}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">{formatVND(cert.netPayableAmount)}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                              {cert.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: VẬT TƯ & ĐỊNH MỨC KHO */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Định mức Hao hụt Sắt thép</span>
                  <div className="text-xl font-bold text-emerald-400 mt-1">≤ 2.50%</div>
                  <span className="text-[11px] text-slate-500">Thông tư 12/2021/TT-BXD</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Định mức Hao hụt Bê tông</span>
                  <div className="text-xl font-bold text-sky-400 mt-1">≤ 1.50%</div>
                  <span className="text-[11px] text-slate-500">Thông tư 12/2021/TT-BXD</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className="text-xs text-slate-400">Định mức Cát, Đá xây dựng</span>
                  <div className="text-xl font-bold text-amber-400 mt-1">≤ 3.00%</div>
                  <span className="text-[11px] text-slate-500">Thông tư 12/2021/TT-BXD</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Boxes className="w-5 h-5 text-teal-400" />
                  <span>Sổ Kho Tồn Vật tư Thực tế tại Công trường</span>
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4 font-semibold">Mã Vật tư</th>
                        <th className="py-3 px-4 font-semibold">Tên Vật tư</th>
                        <th className="py-3 px-4 font-semibold">Phân loại</th>
                        <th className="py-3 px-4 font-semibold text-center">ĐVT</th>
                        <th className="py-3 px-4 font-semibold text-right">Tồn Kho Hiện tại</th>
                        <th className="py-3 px-4 font-semibold text-right">Hạn mức Tối thiểu</th>
                        <th className="py-3 px-4 font-semibold text-center">Định mức TT12 (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {stockBalances.map((sb) => (
                        <tr key={sb.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 font-mono font-medium text-sky-400">{sb.material.code}</td>
                          <td className="py-3 px-4 font-semibold text-white">{sb.material.name}</td>
                          <td className="py-3 px-4 text-slate-400">{sb.material.category}</td>
                          <td className="py-3 px-4 text-center font-bold">{sb.material.unit}</td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">{sb.currentQuantity}</td>
                          <td className="py-3 px-4 text-right text-slate-400">{sb.minimumThreshold}</td>
                          <td className="py-3 px-4 text-center font-mono text-cyan-400">{sb.material.standardNormRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ĐỘI XE MÁY & CA MÁY */}
          {activeTab === 'equipment' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Truck className="w-5 h-5 text-orange-400" />
                <span>Đội Xe máy, Thiết bị Thi công & Định mức Dầu Diesel Ca máy</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Mã Thiết bị</th>
                      <th className="py-3 px-4 font-semibold">Tên Máy thi công</th>
                      <th className="py-3 px-4 font-semibold">Chủng loại</th>
                      <th className="py-3 px-4 font-semibold text-right">Tổng giờ nổ máy</th>
                      <th className="py-3 px-4 font-semibold text-right">Định mức Dầu (L/h)</th>
                      <th className="py-3 px-4 font-semibold text-center">Hạn Kiểm định</th>
                      <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {equipments.map((eq) => (
                      <tr key={eq.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono font-medium text-orange-400">{eq.code}</td>
                        <td className="py-3 px-4 font-semibold text-white">{eq.name}</td>
                        <td className="py-3 px-4 text-slate-400">{eq.category}</td>
                        <td className="py-3 px-4 text-right font-bold text-white">{eq.totalEngineHours} h</td>
                        <td className="py-3 px-4 text-right font-bold text-cyan-400">{eq.standardFuelNorm} L/h</td>
                        <td className="py-3 px-4 text-center font-mono text-emerald-400">{eq.safetyInspectionExpiry}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {eq.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: NHÀ MÁY THÉP WINSTEEL */}
          {activeTab === 'winsteel' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Factory className="w-5 h-5 text-purple-400" />
                  <span>Nhà máy Kết cấu Thép WinSteel — Theo dõi 5 Công đoạn Xưởng & Mã QR Lắp dựng</span>
                </h2>
                <span className="px-2.5 py-1 bg-purple-950/60 border border-purple-800 text-purple-300 text-xs rounded font-semibold">
                  Chuẩn Sa 2.5 & QCVN 06:2022
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Mã Cấu kiện</th>
                      <th className="py-3 px-4 font-semibold">Mã QR Định danh</th>
                      <th className="py-3 px-4 font-semibold">Quy cách Tiết diện</th>
                      <th className="py-3 px-4 font-semibold">Vị trí Trục</th>
                      <th className="py-3 px-4 font-semibold text-right">Khối lượng (kg)</th>
                      <th className="py-3 px-4 font-semibold text-center">Cắt CNC</th>
                      <th className="py-3 px-4 font-semibold text-center">Hàn SAW</th>
                      <th className="py-3 px-4 font-semibold text-center">Bắn bi Sa2.5</th>
                      <th className="py-3 px-4 font-semibold text-center">Sơn DFT</th>
                      <th className="py-3 px-4 font-semibold text-center">Lắp dựng Hiện trường</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {components.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-bold text-white font-mono">{c.componentMark}</td>
                        <td className="py-3 px-4 font-mono text-purple-400 flex items-center space-x-1">
                          <QrCode className="w-3.5 h-3.5 mr-1" />
                          <span>{c.qrCodeUid}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{c.profileSpecs}</td>
                        <td className="py-3 px-4 font-medium text-sky-400">{c.gridLocation}</td>
                        <td className="py-3 px-4 text-right font-bold text-white">{c.weightKg}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-400">OK</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-400">NDT OK</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-400">Sa 2.5</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-950 text-emerald-400">DFT 80μm</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${c.erectionStatus === 'ERECTED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'}`}>
                            {c.erectionStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
