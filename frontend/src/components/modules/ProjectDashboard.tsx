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
  AlertCircle
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectDashboardProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (p: Project) => void;
  onOpenCreateModal: () => void;
}

export const ProjectDashboard: React.FC<ProjectDashboardProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenCreateModal
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  const filteredProjects = projects.filter(p => {
    const matchStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPortfolioValue = projects.reduce((acc, p) => acc + (p.contractValue || 0), 0);
  const avgProgress = projects.length > 0 
    ? (projects.reduce((acc, p) => acc + (p.progressPercentage || 0), 0) / projects.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI SUMMARY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Tổng Danh mục Hợp đồng EPC</span>
            <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {formatVND(totalPortfolioValue)}
          </div>
          <div className="flex items-center space-x-1.5 mt-2 text-xs">
            <span className="text-emerald-400 font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +15.4%
            </span>
            <span className="text-slate-500">so với kế hoạch năm</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Tiến độ Bình quân Toàn khối</span>
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            {avgProgress}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }}></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Công trường Đang Thi công</span>
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {projects.filter(p => p.status === 'ACTIVE').length} <span className="text-sm font-normal text-slate-400">Dự án lớn</span>
          </div>
          <div className="text-xs text-sky-400 font-medium mt-2">
            KCN Sóng Thần 3, VSIP II-A, Bàu Bàng
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">An toàn Lao động Hiện trường</span>
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-400 tracking-tight">
            320 <span className="text-sm font-normal text-slate-400">Ngày An toàn</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-2">
            Chuẩn "Zero Harm" & Nghị định 06/2021
          </div>
        </div>
      </div>

      {/* 2. FILTER & ACTION TOOLBAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm theo mã dự án, tên công trình, chủ đầu tư..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-xs text-slate-200 px-3 py-2 w-full sm:w-80 focus:outline-none transition"
          />
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'ACTIVE', 'PLANNING', 'COMPLETED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  filterStatus === status 
                    ? 'bg-sky-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status === 'ALL' ? 'Tất cả' : status === 'ACTIVE' ? 'Đang chạy' : status === 'PLANNING' ? 'Kế hoạch' : 'Hoàn thành'}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Dự án Mới</span>
        </button>
      </div>

      {/* 3. PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => {
          const isSelected = selectedProject?.id === p.id;
          return (
            <div
              key={p.id}
              onClick={() => onSelectProject(p)}
              className={`bg-slate-900 border rounded-xl p-5 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-sky-500 shadow-lg shadow-sky-500/10 bg-slate-850' 
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-850/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{p.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      p.status === 'ACTIVE' 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5 leading-snug">{p.name}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-800/80 text-slate-400">
                  <ArrowUpRight className="w-4 h-4 text-sky-400" />
                </div>
              </div>

              {/* Financial & Timeline Bar */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Chủ đầu tư</span>
                  <div className="font-semibold text-slate-200 truncate">{p.clientName}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[11px]">Giá trị EPC</span>
                  <div className="font-mono font-bold text-white">{formatVND(p.contractValue)}</div>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 text-[11px]">Tiến độ thi công thực tế</span>
                  <span className="font-mono font-bold text-emerald-400">{p.progressPercentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-slate-400" /> Khởi công: {p.startDate}
                </span>
                <span className="flex items-center text-slate-400">
                  <Clock className="w-3 h-3 mr-1 text-indigo-400" /> Bàn giao: {p.plannedEndDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
