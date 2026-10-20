import React, { useState } from 'react';
import { 
  Calendar, 
  Sun, 
  CloudRain, 
  Users, 
  HardHat, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Plus,
  ShieldCheck,
  Thermometer,
  PenTool
} from 'lucide-react';
import { DailySiteDiary, Project } from '../../types';

interface SiteDiaryModuleProps {
  project: Project | null;
  diaries: DailySiteDiary[];
  onOpenActionModal?: () => void;
}

export const SiteDiaryModule: React.FC<SiteDiaryModuleProps> = ({ 
  project, 
  diaries: initialDiaries,
  onOpenActionModal 
}) => {
  const [diaries] = useState<DailySiteDiary[]>(initialDiaries);
  const [selectedDiary, setSelectedDiary] = useState<DailySiteDiary | null>(initialDiaries[0] || null);

  // Compute metrics
  const totalDiaries = diaries.length;
  const latestDiary = diaries[0];
  const directManpower = latestDiary ? latestDiary.directManpowerCount : 0;
  const subManpower = latestDiary ? latestDiary.subcontractorManpowerCount : 0;
  const totalManpower = directManpower + subManpower;

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            <span>Nhật Ký Thi Công & Quân Số Hiện Trường</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ghi chép công tác hàng ngày, kiểm soát thời tiết, an toàn lao động và ký xác nhận điện tử theo Nghị định 06/2021/NĐ-CP
          </p>
        </div>

        <button
          onClick={onOpenActionModal}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi Nhật Ký Mới</span>
        </button>
      </div>

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tổng Quân Số Hôm Nay</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{totalManpower} người</div>
          <div className="text-xs text-slate-400 mt-1">
            Cơ hữu: <strong className="text-slate-200">{directManpower}</strong> | Thầu phụ: <strong className="text-slate-200">{subManpower}</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Điều Kiện Thời Tiết</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white flex items-center space-x-1.5">
            <span>{latestDiary ? `${latestDiary.temperatureCelsius}°C` : '32°C'}</span>
            <span className="text-xs font-normal text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800">Nắng ráo</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Gió nhẹ, thuận lợi đổ bê tông</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tạm Dừng Do Thời Tiết</span>
            <CloudRain className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-white">0.0 Giờ</div>
          <div className="text-xs text-emerald-400 mt-1">Không phát sinh gián đoạn thi công</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Ký Xác Nhận TVGS</span>
            <PenTool className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Đã Phê Duyệt 100%</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">TVGS Trưởng đã ký điện tử</div>
        </div>
      </div>

      {/* 3. Site Diary Cards List */}
      <div className="space-y-4">
        {diaries.map((diary) => (
          <div 
            key={diary.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
          >
            {/* Top row: Date & Weather Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-lg flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ngày {diary.diaryDate}</span>
                </span>
                <span className="flex items-center space-x-1 text-xs text-slate-300">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                  <span>{diary.temperatureCelsius}°C</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • Sáng: {diary.weatherMorning} | Chiều: {diary.weatherAfternoon}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Cơ hữu: <strong className="text-white">{diary.directManpowerCount}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  Thầu phụ: <strong className="text-white">{diary.subcontractorManpowerCount}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-bold">
                  Tổng: {diary.directManpowerCount + diary.subcontractorManpowerCount} người
                </span>
              </div>
            </div>

            {/* Work Performed Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Nội dung Công tác Triển khai Trong Ngày:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80">
                {diary.workPerformedSummary}
              </p>
            </div>

            {/* HSE & Issues Notice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs space-y-1">
                <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>An Toàn Lao Động & Vệ Sinh Môi Trường (HSE):</span>
                </span>
                <p className="text-amber-200/90 leading-relaxed">
                  {diary.safetyNotes || 'Tuân thủ đầy đủ quy trình an toàn, mang đai an toàn 2 móc khi làm việc trên cao.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                <span className="font-bold text-slate-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-sky-400" />
                  <span>Vấn Đề & Kiến Nghị Hiện Trường:</span>
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {diary.issuesAndRisks || 'Không phát sinh rủi ro bất thường. Nguồn điện lưới và vật tư đảm bảo nhịp độ thi công.'}
                </p>
              </div>
            </div>

            {/* Signatures Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <HardHat className="w-4 h-4 text-sky-400" />
                <span>Chỉ huy trưởng:</span>
                <strong className="text-slate-200">{diary.siteManagerSignature || 'Nguyễn Văn Hùng (Chỉ huy trưởng ADB)'}</strong>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Tư vấn giám sát:</span>
                <strong className="text-slate-200">{diary.consultantSignature || 'Trần Đình Trọng (TVGS Trưởng)'}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
