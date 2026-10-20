import React from 'react';
import { 
  FolderKanban, 
  Layers, 
  Calendar, 
  Activity, 
  Users, 
  Boxes, 
  Truck, 
  Factory,
  ShieldCheck,
  FileCheck2,
  PieChart,
  HardHat
} from 'lucide-react';

export type TabKey = 
  | 'projects' 
  | 'wbs' 
  | 'diary' 
  | 'boq' 
  | 'subcontractors' 
  | 'inventory' 
  | 'equipment' 
  | 'winsteel' 
  | 'qaqc' 
  | 'hse';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const navSections = [
    {
      title: 'DỰ ÁN & HIỆN TRƯỜNG',
      items: [
        { key: 'projects' as TabKey, label: '01. Quản lý Dự án', icon: FolderKanban, color: 'text-sky-400' },
        { key: 'wbs' as TabKey, label: '01. Cây Phân rã WBS', icon: Layers, color: 'text-indigo-400' },
        { key: 'diary' as TabKey, label: '02. Nhật ký Thi công', icon: Calendar, color: 'text-emerald-400' },
        { key: 'qaqc' as TabKey, label: '08. Chất lượng QA/QC', icon: FileCheck2, color: 'text-teal-400' },
        { key: 'hse' as TabKey, label: '09. An toàn Lao động', icon: ShieldCheck, color: 'text-rose-400' },
      ]
    },
    {
      title: 'DỰ TOÁN & THẦU PHỤ',
      items: [
        { key: 'boq' as TabKey, label: '03. BOQ & Quản trị EVM', icon: Activity, color: 'text-cyan-400' },
        { key: 'subcontractors' as TabKey, label: '04. Thầu phụ & FIDIC PPC', icon: Users, color: 'text-amber-400' },
      ]
    },
    {
      title: 'CUNG ỨNG & SẢN XUẤT',
      items: [
        { key: 'inventory' as TabKey, label: '05. Vật tư & Kho (TT 12)', icon: Boxes, color: 'text-teal-400' },
        { key: 'equipment' as TabKey, label: '06. Đội Xe máy & Ca máy', icon: Truck, color: 'text-orange-400' },
        { key: 'winsteel' as TabKey, label: '07. Nhà máy Thép WinSteel', icon: Factory, color: 'text-purple-400' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-lg shadow-sky-500/25">
          ADB
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white flex items-center">
            <span>ÁNH DƯƠNG</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800 font-semibold">
              D&B
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Enterprise EPC Platform</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-5 overflow-y-auto custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-600/20'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.color}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between bg-slate-950/40">
        <div className="flex items-center space-x-2">
          <HardHat className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-300">Ánh Dương ERP v2.5</span>
        </div>
        <span className="flex items-center text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Cluster Live
        </span>
      </div>
    </aside>
  );
};
