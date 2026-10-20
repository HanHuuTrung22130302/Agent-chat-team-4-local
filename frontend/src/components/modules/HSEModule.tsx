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
  Calendar
} from 'lucide-react';
import { PermitToWork, SafetyIncident, ToolboxMeeting, Project } from '../../types';
import { hseApi } from '../../services/api';

interface HSEModuleProps {
  project: Project | null;
}

export const HSEModule: React.FC<HSEModuleProps> = ({ project }) => {
  const [subTab, setSubTab] = useState<'ptw' | 'incidents' | 'toolbox'>('ptw');
  const [permits, setPermits] = useState<PermitToWork[]>([]);
  const [incidents, setIncidents] = useState<SafetyIncident[]>([]);
  const [toolboxMeetings, setToolboxMeetings] = useState<ToolboxMeeting[]>([]);
  const [loading, setLoading] = useState(false);

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

  // Compute metrics
  const activePermits = permits.filter(p => p.status === 'ACTIVE' || p.status === 'APPROVED').length;
  const totalIncidents = incidents.length;
  const lostTimeCount = incidents.filter(i => i.type === 'LOST_TIME').length;

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-rose-400" />
            <span>An Toàn Lao Động, Sức Khỏe & Môi Trường (HSE)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cấp phép làm việc nguy hiểm (PTW), kiểm soát sự cố rủi ro và huấn luyện an toàn đầu giờ (Toolbox Meeting)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('ptw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'ptw' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Giấy Phép PTW ({activePermits})
          </button>
          <button
            onClick={() => setSubTab('incidents')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'incidents' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Sự Cố & Suýt Gặp ({totalIncidents})
          </button>
          <button
            onClick={() => setSubTab('toolbox')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'toolbox' 
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            Họp Đầu Giờ Toolbox
          </button>
        </div>
      </div>

      {/* 2. KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Giờ An Toàn Không Tai Nạn</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">345,200 Giờ</div>
          <div className="text-xs text-emerald-500/80 mt-1">Không phát sinh tai nạn LTI</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Giấy Phép PTW Hiệu Lực</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{activePermits} PTW</div>
          <div className="text-xs text-slate-400 mt-1">Cẩu tải nặng & Hàn cắt kim loại</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tuân Thủ BHLĐ (PPE)</span>
            <CheckCircle2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold text-sky-400">99.8%</div>
          <div className="text-xs text-slate-400 mt-1">Kiểm tra đầu vào cổng công trường</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold uppercase tracking-wider">Tai Nạn Mất Ngày Công</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">0 Ca LTI</div>
          <div className="text-xs text-emerald-400 mt-1">Mục tiêu Zero Accident 2026</div>
        </div>
      </div>

      {/* 3. Sub-Tab Content */}
      {subTab === 'ptw' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
            <span className="font-bold text-sm text-white">Danh Sách Giấy Phép Làm Việc Nguy Hiểm (Permit To Work)</span>
            <span className="text-xs text-slate-400">Yêu cầu thẩm định điều kiện an toàn trước khi kích hoạt</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Số Giấy Phép</th>
                  <th className="py-3.5 px-4 font-semibold">Loại Hình & Vị Trí Thao Tác</th>
                  <th className="py-3.5 px-4 font-semibold">Đơn Vị Thực Hiện</th>
                  <th className="py-3.5 px-4 font-semibold">Hiệu Lực Thời Gian</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Kiểm Tra Điều Kiện</th>
                  <th className="py-3.5 px-4 font-semibold text-center">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permits.map((p) => {
                  const isActive = p.status === 'ACTIVE';
                  const isApproved = p.status === 'APPROVED';
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-rose-400">
                        {p.ptwNumber}
                        <div className="text-[10px] text-slate-500 font-normal">Cán bộ HSE: {p.issuerName}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white flex items-center space-x-1.5">
                          {p.permitType === 'HOT_WORK' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                          <span>{p.permitType === 'HOT_WORK' ? 'Hàn cắt sinh nhiệt' : p.permitType === 'HEAVY_LIFTING' ? 'Cẩu lắp cấu kiện nặng' : 'Làm việc trên cao'}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.location}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{p.subcontractorName}</div>
                        <div className="text-[10px] text-slate-400">Người nhận: {p.receiverName}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {p.validFrom} &rarr; {p.validTo.split(' ')[1]}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.fireExtinguisherPresent ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'}`}>
                            PCCC
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.fullHarnessCertified ? 'bg-sky-950 text-sky-400 border border-sky-800' : 'bg-slate-800 text-slate-500'}`}>
                            Đai 2 Móc
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded text-[11px] font-semibold border ${
                          isActive
                            ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                            : isApproved
                            ? 'bg-sky-950/60 text-sky-400 border-sky-800'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {isActive ? 'ĐANG HIỆU LỰC' : isApproved ? 'ĐÃ DUYỆT' : 'HẾT HẠN/ĐÓNG'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'incidents' && (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <div 
              key={inc.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-amber-400 text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
                    {inc.incidentCode}
                  </span>
                  <span className="text-sm font-bold text-white">Sự Cố Suýt Gặp (Near-Miss)</span>
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
      )}

      {subTab === 'toolbox' && (
        <div className="space-y-4">
          {toolboxMeetings.map((tb) => (
            <div 
              key={tb.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-rose-950 border border-rose-800 text-rose-400 text-xs font-bold rounded flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Ngày {tb.meetingDate}</span>
                  </span>
                  <span className="text-sm font-bold text-white">{tb.topic}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Quân số tham gia: <strong className="text-emerald-400">{tb.attendeesCount} công nhân & kỹ sư</strong>
                </div>
              </div>

              <div className="text-xs text-slate-300 space-y-1.5">
                <span className="text-slate-400">Chủ trì huấn luyện: <strong className="text-slate-200">{tb.leader}</strong></span>
                <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-lg">
                  <span className="font-bold text-amber-400 block mb-1">Các Mối Nguy Trọng Tâm Được Phổ Biến:</span>
                  <p className="text-slate-300 leading-relaxed">{tb.keyHazardsDiscussed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
