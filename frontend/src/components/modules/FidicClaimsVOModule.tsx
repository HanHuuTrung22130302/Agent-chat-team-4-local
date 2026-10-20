import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Clock, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  ShieldAlert, 
  Plus, 
  ArrowUpRight 
} from 'lucide-react';
import { VariationOrder, FidicClaim, Project } from '../../types';
import { claimsApi } from '../../services/api';

interface FidicClaimsVOModuleProps {
  project: Project | null;
  isDarkMode?: boolean;
}

export const FidicClaimsVOModule: React.FC<FidicClaimsVOModuleProps> = ({ project, isDarkMode = true }) => {
  const [subTab, setSubTab] = useState<'vo' | 'claims'>('vo');
  const [voList, setVoList] = useState<VariationOrder[]>([]);
  const [claims, setClaims] = useState<FidicClaim[]>([]);

  useEffect(() => {
    async function loadClaimsData() {
      if (!project) return;
      const vos = await claimsApi.getVariationOrders(project.id);
      const clms = await claimsApi.getFidicClaims(project.id);
      setVoList(vos);
      setClaims(clms);
    }
    loadClaimsData();
  }, [project]);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-bold text-xs border border-orange-800">
              Module 12 • FIDIC Silver Book 2017
            </span>
            <span className="text-xs text-slate-400 font-medium">Quản trị Tranh chấp, Phát sinh & Gia hạn Tiến độ EOT</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <span>Phát Sinh Hợp Đồng (VO) & Khiếu Nại FIDIC Clause 20.1</span>
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSubTab('vo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'vo' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Phát Sinh Thiết Kế & Khối Lượng (VO)
          </button>
          <button
            onClick={() => setSubTab('claims')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              subTab === 'claims' ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Khiếu Nại FIDIC Clause 20.1 (EOT)
          </button>
        </div>
      </div>

      {subTab === 'vo' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voList.map((vo) => (
              <div 
                key={vo.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-orange-400 px-2 py-0.5 rounded bg-orange-950 border border-orange-800">
                      {vo.voNumber}
                    </span>
                    <span className="text-sm font-bold text-white">{vo.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    vo.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {vo.status === 'APPROVED' ? 'ĐÃ DUYỆT' : 'ĐANG THẨM ĐỊNH'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  {vo.scopeDescription}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div>
                    Đề xuất: <strong className="text-white">{formatVND(vo.proposedAmount)}</strong>
                    {vo.approvedAmount && (
                      <span className="ml-2 text-emerald-400 font-bold">
                        (Duyệt: {formatVND(vo.approvedAmount)})
                      </span>
                    )}
                  </div>
                  <span className="text-sky-400 font-bold">Gia hạn: +{vo.timeExtensionDays} Ngày</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab === 'claims' && (
        <div className="space-y-4">
          <div className="p-4 bg-orange-950/20 border border-orange-900/40 rounded-xl text-xs space-y-1">
            <span className="font-bold text-orange-400 flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Quy Tắc Thời Gian Nghiêm Ngặt FIDIC Clause 20.1 (28 Days Time-Bar):</span>
            </span>
            <p className="text-orange-200/90 leading-relaxed">
              Nhà thầu phải gửi Thông báo Khiếu nại (Notice of Claim) trong vòng tối đa 28 ngày kể từ khi nhận biết sự kiện chậm trễ. Quá thời hạn này, Nhà thầu sẽ mất toàn bộ quyền đòi Gia hạn Thời gian (EOT) và Chi phí phát sinh.
            </p>
          </div>

          <div className="space-y-3">
            {claims.map((claim) => (
              <div 
                key={claim.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-950 border border-sky-800">
                      {claim.claimNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300">
                      {claim.clause}
                    </span>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Kỹ Sư Tư Vấn Đã Phê Chuẩn
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {claim.eventDescription}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="space-x-4">
                    <span>Ngày gửi thông báo: <strong className="text-white">{claim.noticeDate}</strong></span>
                    <span>Hồ sơ chi tiết: <strong className="text-white">{claim.detailedParticularsDate}</strong></span>
                  </div>
                  <div>
                    Yêu cầu EOT: <strong className="text-emerald-400 font-bold">+{claim.claimedExtensionDays} Ngày</strong> • Chi phí: <strong className="text-amber-400 font-bold">{formatVND(claim.claimedAmount)}</strong>
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
