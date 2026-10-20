import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Plus, 
  Calendar,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Sliders
} from 'lucide-react';
import { WBSItem, Project } from '../../types';

interface WBSExplorerProps {
  project: Project | null;
  items: WBSItem[];
  onUpdateProgress?: (itemId: number, newProgress: number) => void;
}

export const WBSExplorer: React.FC<WBSExplorerProps> = ({ project, items: initialItems }) => {
  const [items, setItems] = useState<WBSItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<WBSItem | null>(null);
  const [editProgress, setEditProgress] = useState<number>(0);
  const [showProgressDrawer, setShowProgressDrawer] = useState(false);

  // Compute metrics
  const totalPackages = items.length;
  const completedCount = items.filter(i => i.status === 'COMPLETED').length;
  const inProgressCount = items.filter(i => i.status === 'IN_PROGRESS').length;
  const weightedProgress = items.reduce((acc, cur) => acc + (cur.progressPercentage * cur.weightPercentage / 100), 0);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.wbsCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenProgressDrawer = (item: WBSItem) => {
    setSelectedItem(item);
    setEditProgress(item.progressPercentage);
    setShowProgressDrawer(true);
  };

  const handleSaveProgress = () => {
    if (!selectedItem) return;
    setItems(prev => prev.map(i => {
      if (i.id === selectedItem.id) {
        const newStatus = editProgress >= 100 ? 'COMPLETED' : editProgress > 0 ? 'IN_PROGRESS' : 'NOT_STARTED';
        return { ...i, progressPercentage: editProgress, status: newStatus as any };
      }
      return i;
    }));
    setShowProgressDrawer(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Layers className="w-6 h-6 text-indigo-400" />
            <span>Cây Phân Rã Công Việc WBS (Work Breakdown Structure)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Quản trị tiến độ và cấu trúc phân rã công tác theo Thông tư 12/2021/TT-BXD & Điều kiện Hợp đồng FIDIC Silver Book
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tổng Gói Công Tác</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalPackages}</div>
          <div className="text-xs text-indigo-400 mt-1">Phân rã Level 1 & Level 2</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Đang Thi Công</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{inProgressCount}</div>
          <div className="text-xs text-slate-400 mt-1">Đang triển khai tại công trường</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Đã Nghiệm Thu (PPC)</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{completedCount}</div>
          <div className="text-xs text-emerald-500/80 mt-1">Hoàn thành 100% kiểm tra QA/QC</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tiến Độ Gia Quyền</span>
            <TrendingUp className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400">{weightedProgress.toFixed(1)}%</div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(weightedProgress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã WBS (vd: WBS-2.0) hoặc tên công tác..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Trạng thái:</span>
          {(['ALL', 'IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st === 'ALL' ? 'Tất cả' : st === 'IN_PROGRESS' ? 'Đang làm' : st === 'COMPLETED' ? 'Đã xong' : 'Chưa bắt đầu'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. WBS Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-white">Danh Mục Cấu Trúc Phân Rã</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {filteredItems.length} gói
            </span>
          </div>
          <span className="text-xs text-slate-400">Dự án: <strong className="text-slate-200">{project?.name || 'Tất cả dự án'}</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Mã WBS</th>
                <th className="py-3.5 px-4 font-semibold">Tên Hạng Mục Công Tác</th>
                <th className="py-3.5 px-4 font-semibold text-center">Cấp Độ</th>
                <th className="py-3.5 px-4 font-semibold text-center">Tỷ Trọng (%)</th>
                <th className="py-3.5 px-4 font-semibold text-center">Tiến Độ Thực Tế</th>
                <th className="py-3.5 px-4 font-semibold text-center">Trạng Thái</th>
                <th className="py-3.5 px-4 font-semibold text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredItems.map((item) => {
                const isComplete = item.status === 'COMPLETED';
                const isProgress = item.status === 'IN_PROGRESS';
                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {item.wbsCode}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center space-x-2">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                        L{item.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-200">
                      {item.weightPercentage}%
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center w-28">
                        <span className={`font-bold ${isComplete ? 'text-emerald-400' : isProgress ? 'text-sky-400' : 'text-slate-500'}`}>
                          {item.progressPercentage}%
                        </span>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-sky-500'}`} 
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                        isComplete
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                          : isProgress
                          ? 'bg-sky-950/60 text-sky-400 border-sky-800'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isComplete ? 'HOÀN THÀNH' : isProgress ? 'ĐANG LÀM' : 'CHƯA BẮT ĐẦU'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenProgressDrawer(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
                      >
                        Cập nhật
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Slide-over / Modal for Updating Progress */}
      {showProgressDrawer && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  <span>Cập Nhật Tiến Độ Gói Thầu</span>
                </h3>
                <p className="text-xs text-sky-400 font-mono mt-0.5">{selectedItem.wbsCode} — {selectedItem.name}</p>
              </div>
              <button 
                onClick={() => setShowProgressDrawer(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Tiến độ thi công thực tế</span>
                  <span className="text-indigo-400 font-bold text-sm">{editProgress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tỷ trọng trong dự án:</span>
                  <span className="text-slate-200 font-semibold">{selectedItem.weightPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Đóng góp tiến độ tổng thể:</span>
                  <span className="text-emerald-400 font-semibold">
                    {((editProgress * selectedItem.weightPercentage) / 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowProgressDrawer(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveProgress}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
              >
                Lưu Tiến Độ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
