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
  HardHat,
  FileSpreadsheet,
  Clock,
  CircleDollarSign,
  AlertCircle
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
  | 'hse'
  | 'workforce'
  | 'wip'
  | 'claims';

interface SidebarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  isDarkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, isDarkMode }) => {
  const navSections = [
    {
      title: 'DỰ ÁN & HIỆN TRƯỜNG',
      items: [
        { key: 'projects' as TabKey, label: '01. Tổng quan & S-Curve', icon: FolderKanban, color: 'text-blue-500' },
        { key: 'wbs' as TabKey, label: '01. Cây Phân rã WBS', icon: Layers, color: 'text-indigo-500' },
        { key: 'diary' as TabKey, label: '02. Nhật ký Hiện trường', icon: Calendar, color: 'text-emerald-500' },
        { key: 'qaqc' as TabKey, label: '08. Chất lượng QA/QC', icon: FileCheck2, color: 'text-teal-500' },
        { key: 'hse' as TabKey, label: '09. An toàn Lao động HSE', icon: ShieldCheck, color: 'text-rose-500' },
      ]
    },
    {
      title: 'DỰ TOÁN & THẦU PHỤ',
      items: [
        { key: 'boq' as TabKey, label: '03. BOQ & Quản trị EVM', icon: Activity, color: 'text-cyan-500' },
        { key: 'subcontractors' as TabKey, label: '04. Thầu phụ & FIDIC PPC', icon: Users, color: 'text-amber-500' },
        { key: 'claims' as TabKey, label: '12. FIDIC Claims & Phát sinh VO', icon: AlertCircle, color: 'text-orange-500' },
      ]
    },
    {
      title: 'CUNG ỨNG & SẢN XUẤT',
      items: [
        { key: 'inventory' as TabKey, label: '05. Vật tư & Kho (TT 12)', icon: Boxes, color: 'text-teal-500' },
        { key: 'equipment' as TabKey, label: '06. Đội Xe máy & Ca máy', icon: Truck, color: 'text-orange-500' },
        { key: 'winsteel' as TabKey, label: '07. Nhà máy Thép WinSteel', icon: Factory, color: 'text-purple-500' },
      ]
    },
    {
      title: 'TÀI CHÍNH & NHÂN SỰ',
      items: [
        { key: 'workforce' as TabKey, label: '10. Chấm công GPS FaceID', icon: Clock, color: 'text-sky-500' },
        { key: 'wip' as TabKey, label: '11. Kế toán Chi phí WIP (TT 200)', icon: CircleDollarSign, color: 'text-emerald-500' },
      ]
    }
  ];

  return (
    <aside className={`w-64 flex flex-col shrink-0 select-none border-r transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 text-slate-200' 
        : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Brand Header */}
      <div className={`p-4 border-b flex items-center space-x-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center font-black text-white shadow-md shadow-blue-500/20">
          ADB
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wide flex items-center">
            <span>ÁNH DƯƠNG</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-700 font-bold border border-blue-200">
              EPC
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Design & Build Platform</p>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onSelectTab(item.key)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
      <div className={`p-3.5 border-t text-xs flex items-center justify-between ${
        isDarkMode ? 'border-slate-800 bg-slate-950/50 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <div className="flex items-center space-x-2">
          <HardHat className="w-4 h-4 text-amber-500" />
          <span className="font-semibold">Ánh Dương ERP v3.0</span>
        </div>
        <span className="flex items-center text-emerald-500 font-bold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
          Cluster 4-PC
        </span>
      </div>
    </aside>
  );
};
