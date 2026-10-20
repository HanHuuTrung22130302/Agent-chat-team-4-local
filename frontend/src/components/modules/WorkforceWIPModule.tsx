import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  Layers, 
  ShieldCheck, 
  UserCheck, 
  Calendar 
} from 'lucide-react';
import { WorkerAttendance, ProjectWIPAccounting, Project } from '../../types';
import { workforceWipApi } from '../../services/api';

interface WorkforceWIPModuleProps {
  project: Project | null;
  isDarkMode?: boolean;
}

export const WorkforceWIPModule: React.FC<WorkforceWIPModuleProps> = ({ project, isDarkMode = true }) => {
  const [subTab, setSubTab] = useState<'attendance' | 'wip'>('attendance');
  const [attendances, setAttendances] = useState<WorkerAttendance[]>([]);
  const [wipReport, setWipReport] = useState<ProjectWIPAccounting | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!project) return;
      const att = await workforceWipApi.getAttendances();
      const wip = await workforceWipApi.getWIPReport(project.id);
      setAttendances(att);
      setWipReport(wip);
    }
    loadData();
  }, [project]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-xs border border-blue-800">
              Module 10 & 11 • TT 200/2014/TT-BTC
            </span>
            <span className="text-xs text-slate-400 font-medium">Quản trị Nguồn lực & Tài chính D&B</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center space-x-2">
            <Users className="w-6 h-6 text-sky-400" />
            <span>Chấm Công GPS FaceID & Kế Toán Chi Phí Dở Dang (WIP)</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('attendance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'attendance' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chấm Công GPS FaceID
          </button>
          <button
            onClick={() => setSubTab('wip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'wip' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Chi Phí WIP & Tỷ Lệ Hoàn Thành (POC)
          </button>
        </div>
      </div>

      {subTab === 'attendance' && (
        <div className="space-y-4">
          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Quân Số Có Mặt Hôm Nay</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">120 Người</div>
              <span className="text-[11px] text-slate-400">100% Xác thực FaceID & GPS</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Tổ Đội Thép & Kết Cấu</span>
              <div className="text-2xl font-black text-sky-400 mt-1">52 Thợ</div>
              <span className="text-[11px] text-sky-500">Đội thi công chính móng</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Tổ Đội Bê Tông & Cốp Pha</span>
              <div className="text-2xl font-black text-amber-400 mt-1">45 Thợ</div>
              <span className="text-[11px] text-amber-500">Đổ sàn tầng lửng</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Tổ Hàn WinSteel & Cơ Điện</span>
              <div className="text-2xl font-black text-purple-400 mt-1">23 Thợ</div>
              <span className="text-[11px] text-purple-400">Chứng chỉ hàn 6G</span>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <span className="font-bold text-sm text-white">Bảng Nhật Ký Chấm Công GPS Trực Tuyến</span>
              <span className="text-xs text-emerald-400 font-semibold">Tọa độ: KCN Sóng Thần 3 (R &lt; 200m)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Họ & Tên Công Nhân</th>
                    <th className="py-3 px-4 font-semibold">Ngành Nghề / Bộ Phận</th>
                    <th className="py-3 px-4 font-semibold">Tổ Đội Thi Công</th>
                    <th className="py-3 px-4 font-semibold text-center">Giờ Quét Mặt</th>
                    <th className="py-3 px-4 font-semibold text-center">GPS Bán Kính</th>
                    <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attendances.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-white flex items-center space-x-2">
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>{a.workerName}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200">
                          {a.trade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{a.teamName}</td>
                      <td className="py-3 px-4 font-mono text-center text-sky-400">{a.checkInTime}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Hợp lệ (35m)</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          ĐÃ VÀO CA
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

      {subTab === 'wip' && wipReport && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Tỷ Lệ Hoàn Thành POC</span>
              <div className="text-2xl font-black text-blue-400 mt-1">{wipReport.pocPercentage}%</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Theo Chuẩn mực Kế toán TT 200</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Doanh Thu Ghi Nhận (POC)</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">{formatVND(wipReport.recognizedRevenue)}</div>
              <p className="text-[11px] text-emerald-500/80 mt-0.5">Giá trị hợp đồng x Tỷ lệ hoàn thành</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-xs text-slate-400 uppercase font-semibold">Chi Phí Tập Hợp Dở Dang (TK 154)</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{formatVND(wipReport.cumulativeCost)}</div>
              <p className="text-[11px] text-slate-400 mt-0.5">Vật tư 621 + Nhân công 622 + Máy 623</p>
            </div>
          </div>

          {/* Cost Allocation Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Cơ Cấu Chi Phí Sản Xuất Kinh Doanh Dở Dang (Tài Khoản 154 Công Trình)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Chi phí Vật liệu Trực tiếp (TK 621):</span>
                <div className="text-base font-bold text-white mt-1">{formatVND(wipReport.costMaterial621)}</div>
                <span className="text-[11px] text-sky-400 font-semibold">62.7% Tổng chi phí</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Chi phí Nhân công Trực tiếp (TK 622):</span>
                <div className="text-base font-bold text-white mt-1">{formatVND(wipReport.costLabor622)}</div>
                <span className="text-[11px] text-emerald-400 font-semibold">20.9% Tổng chi phí</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Chi phí Máy Thi công (TK 623):</span>
                <div className="text-base font-bold text-white mt-1">{formatVND(wipReport.costEquipment623)}</div>
                <span className="text-[11px] text-amber-400 font-semibold">11.5% Tổng chi phí</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <span className="text-slate-400">Chi phí Chung Công trường (TK 627):</span>
                <div className="text-base font-bold text-white mt-1">{formatVND(wipReport.costOverhead627)}</div>
                <span className="text-[11px] text-purple-400 font-semibold">4.9% Tổng chi phí</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
