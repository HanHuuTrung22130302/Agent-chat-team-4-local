import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Clock, 
  Plus, 
  FileCheck, 
  HeartHandshake,
  ShieldAlert,
  Calendar,
  Sparkles,
  HardHat,
  Search,
  Check
} from 'lucide-react';
import { PermitToWork, SafetyIncident, ToolboxMeeting, Project } from '../../types';
import { hseApi } from '../../services/api';

interface HSEModuleProps {
  project: Project | null;
  isDarkMode?: boolean;
}

export const HSEModule: React.FC<HSEModuleProps> = ({ project, isDarkMode = true }) => {
  const [subTab, setSubTab] = useState<'ptw' | 'incidents' | 'toolbox'>('ptw');
  const [ptwFilter, setPtwFilter] = useState<string>('ALL');
  const [permits, setPermits] = useState<PermitToWork[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [toolboxMeetings, setToolboxMeetings] = useState<ToolboxMeeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    async function loadHSEData() {
      if (!project) return;
      setLoading(true);
      const pList = await hseApi.getPermits(project.id);
      const incList = await hseApi.getIncidents(project.id);
      const tbList = await hseApi.getToolboxMeetings(project.id);
      setPermits(pList);
      setIncidents(incList);
      setToolboxMeetings(tbList);
      setLoading(false);
    }
    loadHSEData();
  }, [project]);

  const activePermitsCount = permits.filter(p => p.status === 'ACTIVE' || p.status === 'APPROVED').length;

  const filteredPermits = permits.filter(p => {
    if (ptwFilter === 'ALL') return true;
    return p.permitType === ptwFilter;
  });

  const handleApprovePtw = (id: number) => {
    setPermits(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, status: 'ACTIVE' };
      }
      return p;
    }));
    setSuccessToast(`Đã kích hoạt phê duyệt an toàn cho Giấy phép PTW thành công!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 font-bold text-xs border border-rose-800">
              ISO 45001 & NĐ 06/2021
            </span>
            <span className="text-xs text-slate-400 font-medium">Hệ thống Giám sát Hiện trường</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-rose-500" />
            <span>An Toàn Lao Động, Sức Khỏe & Môi Trường (HSE)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cấp phép làm việc nguy hiểm (PTW), kiểm soát sự cố rủi ro và huấn luyện an toàn đầu giờ (Toolbox Meeting)
          </p>
        </div>

        {/* View Switcher Buttons */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('ptw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'ptw' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Giấy Phép PTW ({activePermitsCount})
          </button>
          <button
            onClick={() => setSubTab('incidents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'incidents' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sự Cố & Suýt Gặp ({incidents.length})
          </button>
          <button
            onClick={() => setSubTab('toolbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'toolbox' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Họp Đầu Giờ Toolbox ({toolboxMeetings.length})
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-800 rounded-xl text-xs font-semibold text-emerald-300 shadow-lg flex items-center justify-between animate-in fade-in">
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white ml-3">✕</button>
        </div>
      )}

      {/* 2. Vital HSE Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Giờ An Toàn Tích Lũy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">345,200 Giờ</div>
          <div className="text-xs text-emerald-500 font-semibold mt-1">Không phát sinh tai nạn LTI</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Giấy Phép PTW Hiệu Lực</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{activePermitsCount} PTW</div>
          <div className="text-xs text-slate-400 mt-1">Cẩu tải nặng & Hàn cắt kim loại</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Tuân Thủ BHLĐ (PPE)</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-sky-400">99.8%</div>
          <div className="text-xs text-slate-400 mt-1">Kiểm tra qua cổng FaceID sáng nay</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-bold uppercase tracking-wider">Tai Nạn Mất Ngày Công</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">0 Ca LTI</div>
          <div className="text-xs text-emerald-400 font-semibold mt-1">Kỷ lục 320 Ngày An Toàn</div>
        </div>
      </div>

      {/* 3. Sub-Tab 1: Permit To Work Visual Board */}
      {subTab === 'ptw' && (
        <div className="space-y-4">
          {/* PTW Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 font-bold mr-1">Loại Hình:</span>
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'HOT_WORK', label: 'Hàn cắt' },
                { key: 'HEAVY_LIFTING', label: 'Cẩu tải nặng' },
                { key: 'WORKING_AT_HEIGHT', label: 'Làm việc trên cao' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setPtwFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    ptwFilter === f.key
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-400">
              Dự án: <strong className="text-white">{project?.name || 'Tất cả dự án'}</strong>
            </span>
          </div>

          {/* PTW Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPermits.map((p) => {
              const isActive = p.status === 'ACTIVE';
              const isApproved = p.status === 'APPROVED';
              return (
                <div 
                  key={p.id}
                  className={`bg-slate-900 border rounded-xl p-5 shadow-sm space-y-3.5 transition hover:border-slate-700 ${
                    isActive ? 'border-rose-900/60' : 'border-slate-800'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <span className="font-mono font-bold text-xs text-rose-400 px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                        {p.ptwNumber}
                      </span>
                      <h3 className="font-bold text-sm text-white mt-1.5 flex items-center space-x-1.5">
                        {p.permitType === 'HOT_WORK' && <Flame className="w-4 h-4 text-amber-400 shrink-0" />}
                        <span>{p.permitType === 'HOT_WORK' ? 'Hàn cắt sinh nhiệt' : p.permitType === 'HEAVY_LIFTING' ? 'Cẩu tải nặng 20T' : 'Làm việc trên cao'}</span>
                      </h3>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      isActive 
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800 animate-pulse' 
                        : isApproved
                        ? 'bg-sky-950 text-sky-400 border-sky-800'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {isActive ? 'ĐANG THAO TÁC' : isApproved ? 'ĐÃ PHÊ DUYỆT' : 'HẾT HẠN/ĐÓNG'}
                    </span>
                  </div>

                  {/* Location & Team */}
                  <div className="text-xs space-y-1 text-slate-300">
                    <div>Vị trí: <strong className="text-white">{p.location}</strong></div>
                    <div>Đơn vị: <strong className="text-sky-400">{p.subcontractorName}</strong></div>
                    <div className="text-[11px] text-slate-400">
                      Người nhận: {p.receiverName} • Cán bộ HSE: {p.issuerName}
                    </div>
                  </div>

                  {/* Safety Checklist Badges */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Thẩm định Điều kiện An toàn Bắt buộc:
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-semibold border flex items-center space-x-1 ${
                        p.fireExtinguisherPresent ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <Check className="w-3 h-3" />
                        <span>Bình PCCC tại chỗ</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold border flex items-center space-x-1 ${
                        p.fullHarnessCertified ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <Check className="w-3 h-3" />
                        <span>Đai an toàn 2 móc</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded font-semibold border flex items-center space-x-1 ${
                        p.gasCheckCompleted ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}>
                        <Check className="w-3 h-3" />
                        <span>Kiểm tra nồng độ khí</span>
                      </span>
                    </div>
                  </div>

                  {/* Time & Action Footer */}
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="font-mono text-[11px] text-slate-400">
                      {p.validFrom} &rarr; {p.validTo.split(' ')[1]}
                    </span>

                    {isApproved && (
                      <button
                        onClick={() => handleApprovePtw(p.id)}
                        className="px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition"
                      >
                        Kích hoạt Thao tác
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Sub-Tab 2: Near-Miss & Incident Risk Log */}
      {subTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Sổ Ghi Nhận Sự Cố Suýt Gặp (Near-Miss Incident Log)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Quy tắc văn hóa an toàn không đổ lỗi: Ghi nhận 100% tình huống suýt nguy hiểm để cải tiến biện pháp phòng ngừa rủi ro.
            </p>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div 
                key={inc.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-amber-400 text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                      {inc.incidentCode}
                    </span>
                    <span className="text-sm font-bold text-white">Sự Cố Tuột Chốt Móc Xe Nâng</span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-semibold">
                      0 Ngày Mất Công (0 LTI)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold">
                      ĐÃ ĐÓNG XỬ LÝ
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <span className="text-slate-400">Thời gian & Vị trí: <strong className="text-slate-200">{inc.incidentDate} — {inc.location}</strong></span>
                  <p className="text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                    {inc.description}
                  </p>
                </div>

                <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs space-y-1">
                  <span className="font-bold text-emerald-400">Biện Pháp Khắc Phục Phòng Ngừa Tái Diễn:</span>
                  <p className="text-emerald-200/90 leading-relaxed">{inc.remedialAction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sub-Tab 3: Toolbox Safety Meetings */}
      {subTab === 'toolbox' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Biên Bản Huấn Luyện An Toàn Đầu Giờ (Daily Toolbox Meeting)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Tổ chức 15 phút mỗi sáng trước khi vào ca làm việc, điểm danh 100% quân số cơ hữu và nhà thầu phụ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolboxMeetings.map((tb) => (
              <div 
                key={tb.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3.5"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="px-2.5 py-1 bg-rose-950 border border-rose-800 text-rose-400 text-xs font-bold rounded flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ngày {tb.meetingDate}</span>
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">
                    Quân số: {tb.attendeesCount} người
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{tb.topic}</h4>

                <div className="text-xs text-slate-300 space-y-1.5">
                  <span className="text-slate-400">Chủ trì: <strong className="text-white">{tb.leader}</strong></span>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="font-bold text-amber-400 block mb-1 text-[11px]">Mối Nguy Trọng Tâm Được Nhắc Nhở:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{tb.keyHazardsDiscussed}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
