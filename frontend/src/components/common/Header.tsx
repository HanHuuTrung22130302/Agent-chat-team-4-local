import React from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Bell, 
  UserCheck, 
  Globe, 
  ChevronDown 
} from 'lucide-react';
import { Project } from '../../types';

interface HeaderProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onOpenCreateModal: () => void;
  onOpenActionModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenCreateModal,
  onOpenActionModal
}) => {
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
      {/* Left: Project Selector Dropdown */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-slate-400">
          <Building2 className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Dự án:</span>
        </div>

        <div className="relative">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const found = projects.find(p => p.id === Number(e.target.value));
              if (found) onSelectProject(found);
            }}
            className="appearance-none bg-slate-950 border border-slate-700/80 hover:border-slate-600 text-slate-100 text-xs font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:border-sky-500 shadow-sm cursor-pointer transition"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 py-1">
                {p.code} — {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {selectedProject && (
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-400 border border-sky-800 font-mono font-medium">
              {formatVND(selectedProject.contractValue)}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 font-semibold text-[11px]">
              Tiến độ {selectedProject.progressPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        <input 
          type="text"
          placeholder="Tìm cấu kiện, WBS, thầu phụ, vật tư..."
          className="w-full bg-slate-950/80 border border-slate-800 focus:border-sky-500 rounded-lg text-xs text-slate-200 pl-8 pr-12 py-1.5 focus:outline-none placeholder-slate-500 transition"
        />
        <kbd className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
          ⌘K
        </kbd>
      </div>

      {/* Right: Actions & User Info */}
      <div className="flex items-center space-x-2.5">
        <button
          onClick={onOpenActionModal}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition active:scale-95"
          title="Tạo Phiếu Vật Tư / Ghi Nhiên Liệu / Nhật Ký / Đợt PPC"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Thao tác Nhanh</span>
        </button>

        <button
          onClick={onOpenCreateModal}
          className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          title="Khởi tạo Dự án EPC Mới"
        >
          <span>+ Dự án Mới</span>
        </button>

        <a 
          href="https://resolved-commander-price-reduces.trycloudflare.com" 
          target="_blank" 
          rel="noreferrer"
          title="Cloudflare Tunnel Live Public Gateway"
          className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs text-sky-400 transition"
        >
          <Globe className="w-3 h-3 text-sky-400 animate-pulse" />
          <span className="text-[11px] font-medium">Tunnel Live</span>
        </a>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            HT
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-white">Nguyễn Văn Hùng</div>
            <div className="text-[10px] text-sky-400 font-medium">Chỉ huy trưởng EPC</div>
          </div>
        </div>
      </div>
    </header>
  );
};
