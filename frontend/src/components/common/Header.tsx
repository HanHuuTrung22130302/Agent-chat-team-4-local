import React from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Bell, 
  Sun, 
  Moon, 
  Globe, 
  ChevronDown,
  CheckCircle2,
  HardHat
} from 'lucide-react';
import { Project, PendingApprovalItem } from '../../types';

interface HeaderProps {
  projects: Project[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onOpenCreateModal: () => void;
  onOpenActionModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  pendingApprovalsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProject,
  onSelectProject,
  onOpenCreateModal,
  onOpenActionModal,
  isDarkMode,
  onToggleTheme,
  pendingApprovalsCount = 4
}) => {
  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <header className={`h-16 px-6 flex items-center justify-between border-b shrink-0 z-20 transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-900/90 backdrop-blur-md border-slate-800 text-slate-100' 
        : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-800 shadow-sm'
    }`}>
      {/* Left: Project Selector Dropdown & Budget */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Building2 className={`w-4 h-4 ${isDarkMode ? 'text-sky-400' : 'text-blue-600'}`} />
          <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-slate-400">
            Dự án Chọn:
          </span>
        </div>

        <div className="relative">
          <select
            value={selectedProject?.id || ''}
            onChange={(e) => {
              const found = projects.find(p => p.id === Number(e.target.value));
              if (found) onSelectProject(found);
            }}
            className={`appearance-none text-xs font-bold rounded-lg pl-3 pr-8 py-2 border shadow-sm cursor-pointer transition focus:outline-none ${
              isDarkMode
                ? 'bg-slate-950 border-slate-700 hover:border-slate-600 text-slate-100 focus:border-sky-500'
                : 'bg-slate-50 border-slate-300 hover:border-slate-400 text-slate-900 focus:border-blue-600'
            }`}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {selectedProject && (
          <div className="hidden lg:flex items-center space-x-2 text-xs">
            <span className={`px-2.5 py-1 rounded-md font-mono font-semibold border ${
              isDarkMode 
                ? 'bg-sky-950/80 text-sky-400 border-sky-800' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {formatVND(selectedProject.contractValue)}
            </span>
            <span className={`px-2 py-1 rounded-md font-semibold text-[11px] border ${
              isDarkMode 
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
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
          placeholder="Tìm cấu kiện thép, WBS, thầu phụ, vật tư..."
          className={`w-full rounded-lg text-xs pl-8 pr-12 py-1.5 border transition focus:outline-none ${
            isDarkMode
              ? 'bg-slate-950/80 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-sky-500'
              : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600'
          }`}
        />
        <kbd className={`absolute right-2.5 top-2 px-1.5 py-0.5 rounded text-[10px] font-mono border ${
          isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-500 border-slate-300'
        }`}>
          ⌘K
        </kbd>
      </div>

      {/* Right: Actions, Theme Switcher, Cloudflare, User */}
      <div className="flex items-center space-x-2.5">
        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
          className={`p-2 rounded-lg border transition ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Pending Approvals Badge */}
        <button
          onClick={onOpenActionModal}
          title="Hộp thư Chờ duyệt Lệnh (PPC, MR, PTW)"
          className={`relative p-2 rounded-lg border transition ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          {pendingApprovalsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        {/* Quick Action Button */}
        <button
          onClick={onOpenActionModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition active:scale-95"
          title="Tạo Phiếu Vật Tư / Ghi Nhiên Liệu / Nhật Ký / Đợt PPC"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Thao tác Nhanh</span>
        </button>

        {/* Create Project Button */}
        <button
          onClick={onOpenCreateModal}
          className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
          }`}
          title="Khởi tạo Dự án EPC Mới"
        >
          <span>+ Dự án Mới</span>
        </button>

        {/* Tunnel Pill */}
        <a 
          href="https://resolved-commander-price-reduces.trycloudflare.com" 
          target="_blank" 
          rel="noreferrer"
          title="Cloudflare Tunnel Live Public Gateway"
          className={`hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs transition ${
            isDarkMode 
              ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-sky-400' 
              : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-blue-600'
          }`}
        >
          <Globe className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
          <span className="text-[11px] font-semibold">Tunnel Live</span>
        </a>

        {/* User Avatar & Title */}
        <div className={`flex items-center space-x-2 pl-2 border-l ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            H
          </div>
          <div className="hidden 2xl:block text-left">
            <div className={`text-xs font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Nguyễn Văn Hùng
            </div>
            <div className="text-[10px] text-blue-500 font-semibold">Chỉ huy trưởng EPC</div>
          </div>
        </div>
      </div>
    </header>
  );
};
