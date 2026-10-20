import React, { useState, useEffect } from 'react';
import { 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Search, 
  Filter, 
  FlaskConical, 
  ShieldAlert, 
  Layers, 
  Camera, 
  Plus,
  TrendingUp,
  FileText
} from 'lucide-react';
import { QAQCInspection, ConcreteTestSample, NCRReport, Project } from '../../types';
import { qaqcApi } from '../../services/api';

interface QAQCModuleProps {
  project: Project | null;
}

export const QAQCModule: React.FC<QAQCModuleProps> = ({ project }) => {
  const [subTab, setSubTab] = useState<'inspections' | 'concrete' | 'ncr'>('inspections');
  const [inspections, setInspections] = useState<QAQCInspection[]>([]);
  const [concreteTests, setConcreteTests] = useState<ConcreteTestSample[]>([]);
  const [ncrs, setNcrs] = useState<NCRReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadQAQCData() {
      if (!project) return;
      setLoading(true);
      const inspList = await qaqcApi.getInspections(project.id);
      const concList = await qaqcApi.getConcreteTests(project.id);
      const ncrList = await qaqcApi.getNCRs(project.id);
      setInspections(inspList);
      setConcreteTests(concList);
      setNcrs(ncrList);
      setLoading(false);
    }
    loadQAQCData();
  }, [project]);

  // Compute metrics
  const totalInspections = inspections.length;
  const passedInspections = inspections.filter(i => i.result === 'PASSED').length;
  const passRate = totalInspections > 0 ? ((passedInspections / totalInspections) * 100).toFixed(1) : '100';
  const openNcrs = ncrs.filter(n => n.status !== 'VERIFIED_CLOSED').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileCheck2 className="w-6 h-6 text-teal-400" />
            <span>Quản Lý Chất Lượng QA/QC (Nghị định 06/2021/NĐ-CP)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Nghiệm thu công việc xây dựng, kiểm soát cường độ nén bê tông R7/R28, siêu âm mối hàn kết cấu thép & quản lý NCR
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('inspections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'inspections' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Biên Bản Nghiệm Thu
          </button>
          <button
            onClick={() => setSubTab('concrete')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'concrete' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Mẫu Bê Tông (R7/R28)
          </button>
          <button
            onClick={() => setSubTab('ncr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'ncr' 
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Báo Cáo NCR ({openNcrs})
          </button>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tỷ Lệ Đạt Nghiệm Thu</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{passRate}%</div>
          <div className="text-xs text-slate-400 mt-1">Đã kiểm tra 42 đợt nghiệm thu</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Cường Độ Bê Tông R28</span>
            <FlaskConical className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-teal-400">&gt; 110% Mác TK</div>
          <div className="text-xs text-slate-400 mt-1">Đạt chuẩn TCVN 9340:2012</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">NCR Đang Mở</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{openNcrs} Báo cáo</div>
          <div className="text-xs text-slate-400 mt-1">1 việc sửa chữa đang xử lý</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Hồ Sơ Pháp Lý NĐ 06</span>
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-sm font-bold text-white flex items-center space-x-1 mt-1">
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
            <span>Đồng bộ 100% Nhật ký</span>
          </div>
          <div className="text-xs text-sky-400 mt-1">Sẵn sàng nghiệm thu giai đoạn</div>
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      {subTab === 'inspections' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-white">Danh Mục Phiếu Nghiệm Thu Công Việc (RFI)</span>
            <span className="text-xs text-slate-400">Theo Tiêu chuẩn TCVN & NĐ 06/2021/NĐ-CP</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Mã Nghiệm Thu</th>
                  <th className="py-3.5 px-4 font-semibold">Hạng Mục & Tiêu Chuẩn</th>
                  <th className="py-3.5 px-4 font-semibold">Hình Thức</th>
                  <th className="py-3.5 px-4 font-semibold">Ngày NT</th>
                  <th className="py-3.5 px-4 font-semibold">Kỹ Sư ADB & TVGS</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Kết Quả</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Hình Ảnh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-teal-400">
                      {insp.inspectionCode}
                      <div className="text-[10px] text-slate-500 font-normal">{insp.wbsCode}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{insp.workCategory}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{insp.standardReference}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
                        {insp.inspectionType === 'CONCEALED_WORK' ? 'Công việc ẩn giấu' : insp.inspectionType === 'MATERIAL_INCOMING' ? 'Vật tư đầu vào' : 'Giai đoạn thi công'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{insp.inspectionDate}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-200">{insp.inspectorADB}</div>
                      <div className="text-[11px] text-slate-400">{insp.supervisionConsultant}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        insp.result === 'PASSED'
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : insp.result === 'PASSED_WITH_CONDITIONS'
                          ? 'bg-amber-950/60 text-amber-400 border-amber-800'
                          : 'bg-rose-950/60 text-rose-400 border-rose-800'
                      }`}>
                        {insp.result === 'PASSED' ? 'ĐẠT YÊU CẦU' : insp.result === 'PASSED_WITH_CONDITIONS' ? 'ĐẠT CÓ ĐK' : 'KHÔNG ĐẠT'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        <Camera className="w-3 h-3 text-sky-400" />
                        <span>{insp.attachedPhotosCount} ảnh</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'concrete' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-white">Sổ Nhật Ký Thí Nghiệm Nén Mẫu Bê Tông Hiện Trường</span>
            <span className="text-xs text-teal-400 font-semibold">TCVN 9340:2012 Bê tông nặng</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Mã Tổ Mẫu</th>
                  <th className="py-3.5 px-4 font-semibold">Trạm Trộn & Mác TK</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Độ Sụt (mm)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Cường Độ R7 (MPa)</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Cường Độ R28 (MPa)</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Đạt Tỷ Lệ (%)</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Đánh Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {concreteTests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {t.sampleCode}
                      <div className="text-[10px] text-slate-500 font-normal">Đổ ngày: {t.pourDate}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{t.designedGrade}</div>
                      <div className="text-[11px] text-slate-400">{t.batchPlantName}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">
                      {t.slumpMm} mm
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-200">
                      {t.strengthR7Mpa} MPa
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-teal-400">
                      {t.strengthR28Mpa > 0 ? `${t.strengthR28Mpa} MPa` : 'Đang dưỡng hộ'}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-emerald-400">
                      {t.passPercentage.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        t.status === 'PASSED' 
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : 'bg-sky-950/60 text-sky-400 border-sky-800'
                      }`}>
                        {t.status === 'PASSED' ? 'ĐẠT CHUẨN' : 'ĐANG DƯỠNG'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'ncr' && (
        <div className="space-y-4">
          {ncrs.map((ncr) => {
            const isClosed = ncr.status === 'VERIFIED_CLOSED';
            return (
              <div 
                key={ncr.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-teal-400 text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                      {ncr.ncrNumber}
                    </span>
                    <span className="text-sm font-bold text-white">{ncr.title}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                      ncr.severity === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : ncr.severity === 'MAJOR'
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-sky-950 text-sky-400 border-sky-800'
                    }`}>
                      Mức độ: {ncr.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                      isClosed 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}>
                      {isClosed ? 'ĐÃ KHẮC PHỤC XONG' : 'ĐANG XỬ LÝ'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg space-y-1">
                    <span className="font-semibold text-rose-400">Nguyên nhân gốc rễ (Root Cause):</span>
                    <p className="text-slate-300 leading-relaxed">{ncr.rootCause}</p>
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg space-y-1">
                    <span className="font-semibold text-emerald-400">Biện pháp khắc phục (Corrective Action):</span>
                    <p className="text-slate-300 leading-relaxed">{ncr.correctiveAction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Người lập: <strong className="text-slate-200">{ncr.issuedBy}</strong> &rarr; Đơn vị nhận: <strong className="text-slate-200">{ncr.issuedTo}</strong></span>
                  <span>Hạn khắc phục: <strong className="text-amber-400">{ncr.deadline}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
