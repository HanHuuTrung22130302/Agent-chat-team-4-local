import React, { useState } from 'react';
import { X, Building2, DollarSign, Calendar, MapPin, Check } from 'lucide-react';
import { Project } from '../../types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Project) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [code, setCode] = useState('DA-ADB-2026-003');
  const [name, setName] = useState('Nhà máy Dược phẩm Chuẩn GMP & Trung tâm R&D Ánh Dương');
  const [clientName, setClientName] = useState('Tập đoàn Dược phẩm Quốc tế Sanofi-A');
  const [location, setLocation] = useState('KCN Long Hậu, Long An');
  const [contractValue, setContractValue] = useState(210000000000);
  const [startDate, setStartDate] = useState('2026-04-01');
  const [plannedEndDate, setPlannedEndDate] = useState('2026-12-31');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now(),
      code,
      name,
      clientName,
      location,
      projectType: 'INDUSTRIAL_FACTORY',
      contractValue: Number(contractValue),
      startDate,
      plannedEndDate,
      progressPercentage: 5.0,
      status: 'ACTIVE'
    };
    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Khởi tạo Dự án D&B EPC Mới</h2>
              <p className="text-xs text-slate-400">Thiết lập hợp đồng tổng thầu Ánh Dương Building</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Mã Dự án:</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white font-mono font-bold px-3 py-2 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Chủ đầu tư:</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white px-3 py-2 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Tên Công trình / Dự án EPC:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white font-semibold px-3 py-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Địa điểm Công trường:</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white px-3 py-2 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Giá trị Hợp đồng EPC (VNĐ):</label>
              <input
                type="number"
                required
                value={contractValue}
                onChange={(e) => setContractValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white font-mono font-bold px-3 py-2 outline-none text-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Ngày Khởi công:</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white px-3 py-2 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Hạn Bàn giao Hoàn thành:</label>
              <input
                type="date"
                required
                value={plannedEndDate}
                onChange={(e) => setPlannedEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-white px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Khởi tạo Dự án</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
