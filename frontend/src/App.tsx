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
  Award
} from 'lucide-react';
import { Project, WBSItem, DailySiteDiary, Subcontractor, Subcontract, PaymentCertificate } from './types';
import { projectApi, subcontractorApi } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'projects' | 'wbs' | 'diary' | 'subcontractors' | 'boq' | 'winsteel'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [wbsItems, setWbsItems] = useState<WBSItem[]>([]);
  const [diaries, setDiaries] = useState<DailySiteDiary[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [subcontracts, setSubcontracts] = useState<Subcontract[]>([]);
  const [certificates, setCertificates] = useState<PaymentCertificate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const projList = await projectApi.getProjects();
      setProjects(projList);
      const subList = await subcontractorApi.getSubcontractors();
      setSubcontractors(subList);

      if (projList.length > 0) {
        setSelectedProject(projList[0]);
        const wbs = await projectApi.getProjectWBS(projList[0].id);
        const diaryList = await projectApi.getSiteDiaries(projList[0].id);
        const contractList = await subcontractorApi.getSubcontracts(projList[0].id);
        setWbsItems(wbs);
        setDiaries(diaryList);
        setSubcontracts(contractList);
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
    setWbsItems(wbs);
    setDiaries(diaryList);
    setSubcontracts(contractList);
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
            Phân hệ Quản trị
          </div>
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'projects' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <FolderKanban className="w-4 h-4 text-sky-400" />
            <span>Dự án & Danh mục</span>
          </button>

          <button 
            onClick={() => setActiveTab('wbs')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'wbs' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Tiến độ WBS (CPM)</span>
          </button>

          <button 
            onClick={() => setActiveTab('diary')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'diary' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>Nhật ký Thi công NĐ06</span>
          </button>

          <button 
            onClick={() => setActiveTab('subcontractors')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'subcontractors' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4 text-teal-400" />
            <span>Thầu phụ & FIDIC PPC</span>
          </button>

          <button 
            onClick={() => setActiveTab('boq')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'boq' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>Dự toán BOQ & Chi phí</span>
          </button>

          <button 
            onClick={() => setActiveTab('winsteel')}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'winsteel' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            <Factory className="w-4 h-4 text-purple-400" />
            <span>Nhà máy WinSteel</span>
          </button>

          <div className="pt-4 px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Nghiệp vụ Mở rộng
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-slate-400 text-sm hover:text-slate-200 cursor-not-allowed">
            <Truck className="w-4 h-4" />
            <span>Vật tư & Xe máy thi công</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-slate-400 text-sm hover:text-slate-200 cursor-not-allowed">
            <Clock className="w-4 h-4" />
            <span>Chấm công GPS & Lương</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 text-slate-400 text-sm hover:text-slate-200 cursor-not-allowed">
            <DollarSign className="w-4 h-4" />
            <span>Kế toán WIP (TK 154)</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>PostgreSQL: 192.168.1.50</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP HEADER */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <div className="text-xs font-medium text-slate-400">Dự án Đang Chọn:</div>
            <select 
              value={selectedProject?.id || ''}
              onChange={(e) => {
                const found = projects.find(p => p.id === Number(e.target.value));
                if (found) handleSelectProject(found);
              }}
              className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-sky-500"
            >
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            {loading && (
              <span className="text-xs text-sky-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span> Đang tải dữ liệu...
              </span>
            )}
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-950 text-sky-400 border border-sky-800">
              Tổng thầu D&B Hạng I
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Spring Boot 3 + React 18
            </span>
          </div>
        </header>

        {/* CONTENT TABS */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {/* TAB 1: DỰ ÁN & DANH MỤC */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Danh mục Dự án Thi công & Xây lắp</h2>
                  <p className="text-xs text-slate-400 mt-1">Quản lý danh mục gói thầu D&B, giá trị hợp đồng và tiến độ lũy kế</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {projects.map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => handleSelectProject(p)}
                    className={`p-5 rounded-xl border transition cursor-pointer ${selectedProject?.id === p.id ? 'bg-slate-900 border-sky-500 shadow-lg shadow-sky-500/10' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-sky-400 font-semibold">{p.code}</span>
                        <h3 className="text-base font-bold text-white mt-1">{p.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{p.clientName}</p>
                      </div>
                      <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {p.status}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center text-xs text-slate-400 space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{p.location}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-slate-400">Giá trị Hợp đồng:</span>
                        <span className="font-semibold text-emerald-400 ml-1.5">{formatVND(p.contractValue)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400">Tiến độ:</span>
                        <span className="font-bold text-sky-400 ml-1.5">{p.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TIẾN ĐỘ WBS */}
          {activeTab === 'wbs' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-emerald-400" />
                    <span>Cấu trúc Phân chia Công việc WBS (Work Breakdown Structure)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Dự án: {selectedProject?.name}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                      <th className="py-3 px-4 font-semibold">Mã WBS</th>
                      <th className="py-3 px-4 font-semibold">Tên Hạng mục Thi công</th>
                      <th className="py-3 px-4 font-semibold">Tỷ trọng (%)</th>
                      <th className="py-3 px-4 font-semibold">Tiến độ Hiện tại</th>
                      <th className="py-3 px-4 font-semibold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {wbsItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono text-sky-400 font-medium">{item.wbsCode}</td>
                        <td className="py-3 px-4 font-medium text-slate-200">{item.name}</td>
                        <td className="py-3 px-4 text-slate-300 font-semibold">{item.weightPercentage}%</td>
                        <td className="py-3 px-4">
                          <div className="w-36 bg-slate-800 rounded-full h-2 overflow-hidden inline-block mr-2 align-middle">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full" 
                              style={{ width: `${item.progressPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-mono text-xs">{item.progressPercentage}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${item.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
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

          {/* TAB 3: NHẬT KÝ CÔNG TRƯỜNG NĐ06 */}
          {activeTab === 'diary' && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <HardHat className="w-5 h-5 text-amber-400" />
                    <span>Nhật ký Thi công Điện tử (Nghị định 06/2021/NĐ-CP)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Ghi nhận điều kiện thời tiết, nhân lực công trường và chữ ký số</p>
                </div>
              </div>

              {diaries.map((diary) => (
                <div key={diary.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-sm text-white flex items-center space-x-1.5">
                        <Calendar className="w-4 h-4 text-sky-400" />
                        <span>Ngày {diary.diaryDate}</span>
                      </span>
                      <span className="text-xs px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {diary.temperatureCelsius}°C — {diary.weatherMorning}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã ký số điện tử CHT & TVGS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Nhân lực Trực tiếp ADB:</span>
                      <span className="font-bold text-white ml-2 text-sm">{diary.directManpowerCount} công nhân</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Nhân lực Thầu phụ:</span>
                      <span className="font-bold text-sky-400 ml-2 text-sm">{diary.subcontractorManpowerCount} công nhân</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-semibold">Công việc Thực hiện trong Ngày:</span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                        {diary.workPerformedSummary}
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-400 font-semibold">Ghi chú An toàn & Vệ sinh Lao động (HSE / TBM):</span>
                      <p className="text-emerald-400 mt-0.5 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                        {diary.safetyNotes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: THẦU PHỤ & FIDIC PPC */}
          {activeTab === 'subcontractors' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Users className="w-5 h-5 text-teal-400" />
                    <span>Quản lý Thầu phụ, Hợp đồng Giao khoán & Nghiệm thu Thanh toán PPC theo FIDIC</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Đánh giá hồ sơ năng lực, hợp đồng theo đơn giá và chứng chỉ thanh toán kỳ (PPC)</p>
                </div>
              </div>

              {/* SUBCONTRACTOR DIRECTORY */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Award className="w-4 h-4 text-sky-400" />
                  <span>Danh bạ & Xếp hạng Năng lực Nhà thầu phụ</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {subcontractors.map((sub) => (
                    <div key={sub.id} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-[10px] text-teal-400 font-semibold">{sub.code}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">Hạng {sub.ratingGrade}</span>
                      </div>
                      <div className="font-semibold text-slate-200 line-clamp-1">{sub.name}</div>
                      <div className="text-[11px] text-slate-400">{sub.specialty}</div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">MST: {sub.taxCode}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTRACTS OVERVIEW */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subcontracts.map((sc) => (
                  <div key={sc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono text-teal-400 font-semibold">{sc.contractNumber}</span>
                        <h3 className="font-bold text-white text-sm mt-1">{sc.title}</h3>
                        <p className="text-xs text-slate-400">{sc.subcontractorName}</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {sc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-slate-400">Giá trị Giao khoán:</span>
                        <div className="font-bold text-white text-sm">{formatVND(sc.totalValue)}</div>
                      </div>
                      <div>
                        <span className="text-slate-400">Tỷ lệ Tạm ứng / Bảo hành:</span>
                        <div className="font-semibold text-amber-400 text-sm">{sc.advancePaymentRate}% / {sc.retentionRate}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAYMENT CERTIFICATES TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Chứng chỉ Thanh toán Khối lượng Hoàn thành (PPC) Đã Lập</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/50">
                        <th className="py-3 px-4 font-semibold">Số Chứng chỉ</th>
                        <th className="py-3 px-4 font-semibold">Kỳ</th>
                        <th className="py-3 px-4 font-semibold">Thời gian Nghiệm thu</th>
                        <th className="py-3 px-4 font-semibold text-right">Giá trị Nghiệm thu (Gross)</th>
                        <th className="py-3 px-4 font-semibold text-right">Khấu trừ Hoàn ứng</th>
                        <th className="py-3 px-4 font-semibold text-right">Giữ lại Bảo hành (5%)</th>
                        <th className="py-3 px-4 font-semibold text-right">Thực chi (Net Payable)</th>
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

          {/* TAB 5: DỰ TOÁN BOQ */}
          {activeTab === 'boq' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                <span>Bóc tách Khối lượng BOQ & Kiểm soát Chi phí Dự toán (Thông tư 12/2021/TT-BXD)</span>
              </h2>
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-lg">
                <FileSpreadsheet className="w-12 h-12 mx-auto text-blue-400/50 mb-3" />
                <h3 className="font-semibold text-white">Phân hệ Dự toán BOQ đang được hoàn thiện</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Hỗ trợ import file Excel dự toán, tra mã định mức Thông tư 12/2021/TT-BXD, và đo lường Earned Value Management (EVM).
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: NHÀ MÁY WINSTEEL */}
          {activeTab === 'winsteel' && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Factory className="w-5 h-5 text-purple-400" />
                <span>Nhà máy Kết cấu Thép WinSteel — Theo dõi Sản xuất & Lắp dựng</span>
              </h2>
              <div className="p-8 text-center text-slate-400 border border-dashed border-slate-800 rounded-lg">
                <Factory className="w-12 h-12 mx-auto text-purple-400/50 mb-3" />
                <h3 className="font-semibold text-white">Phân hệ WinSteel đang trong chu trình đặc tả</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Bao gồm bóc tách BOM cấu kiện thép, kế hoạch cắt phôi Nesting, mã QR cấu kiện và nghiệm thu lắp dựng ngoài hiện trường.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
