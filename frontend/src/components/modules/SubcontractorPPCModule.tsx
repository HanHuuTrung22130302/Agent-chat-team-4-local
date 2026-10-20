import React, { useState } from 'react';
import { 
  Users, 
  Receipt, 
  CheckCircle2, 
  DollarSign, 
  Plus, 
  ShieldAlert, 
  FileText,
  Building,
  Check,
  AlertCircle
} from 'lucide-react';
import { Subcontractor, Subcontract, PaymentCertificate } from '../../types';

interface SubcontractorPPCModuleProps {
  subcontractors: Subcontractor[];
  subcontracts: Subcontract[];
  certificates: PaymentCertificate[];
  onApprovePPC?: (certId: number) => void;
}

export const SubcontractorPPCModule: React.FC<SubcontractorPPCModuleProps> = ({
  subcontractors,
  subcontracts,
  certificates,
  onApprovePPC
}) => {
  const [activeCertList, setActiveCertList] = useState<PaymentCertificate[]>(certificates);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  const handleApprove = (certId: number) => {
    setActiveCertList(prev => prev.map(c => c.id === certId ? { ...c, status: 'APPROVED' } : c));
    if (onApprovePPC) onApprovePPC(certId);
    setSuccessMessage(`Đã phê duyệt thành công chứng chỉ thanh toán PPC #${certId}! Hệ thống đã tự động kết chuyển giữ lại 5% bảo hành.`);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const totalContracted = subcontracts.reduce((acc, s) => acc + (s.totalValue || 0), 0);
  const totalPaid = activeCertList.reduce((acc, c) => acc + (c.netPayableAmount || 0), 0);
  const totalRetention = activeCertList.reduce((acc, c) => acc + (c.retentionDeduction || 0), 0);

  return (
    <div className="space-y-6">
      {/* SUCCESS ALERT TOAST */}
      {successMessage && (
        <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{successMessage}</span>
        </div>
      )}

      {/* 1. TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <span className="text-slate-400 text-xs font-semibold">Tổng Giá trị Giao khoán Thầu phụ</span>
          <div className="text-xl font-extrabold text-white mt-1.5">{formatVND(totalContracted)}</div>
          <span className="text-[11px] text-slate-500">{subcontracts.length} Gói thầu đang thi công</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <span className="text-slate-400 text-xs font-semibold">Lũy kế Đã Giải ngân Thực tế</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1.5">{formatVND(totalPaid)}</div>
          <span className="text-[11px] text-emerald-500/80">Qua chứng chỉ PPC được duyệt</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <span className="text-slate-400 text-xs font-semibold">Tiền Giữ lại Bảo hành (5% Retention)</span>
          <div className="text-xl font-extrabold text-amber-400 mt-1.5">{formatVND(totalRetention)}</div>
          <span className="text-[11px] text-amber-500/80">Giữ đến hết bảo hành công trình</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <span className="text-slate-400 text-xs font-semibold">Chuẩn mực Hợp đồng Áp dụng</span>
          <div className="text-base font-bold text-sky-400 mt-1.5">FIDIC Red/Yellow Book</div>
          <span className="text-[11px] text-slate-400">VAT 8% & Khấu trừ tạm ứng lũy tiến</span>
        </div>
      </div>

      {/* 2. SUBCONTRACTS OVERVIEW TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-white">Danh mục Gói thầu Giao khoán Phụ (Subcontract Packages)</h3>
          </div>
          <span className="text-xs text-slate-400">Đơn giá cố định & Đơn giá điều chỉnh</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Số Hợp đồng</th>
                <th className="py-3 px-4 font-semibold">Nhà thầu phụ</th>
                <th className="py-3 px-4 font-semibold">Nội dung Giao khoán</th>
                <th className="py-3 px-4 font-semibold text-right">Giá trị HĐ (VNĐ)</th>
                <th className="py-3 px-4 font-semibold text-center">Tạm ứng</th>
                <th className="py-3 px-4 font-semibold text-center">Bảo hành 5%</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {subcontracts.map((sc) => (
                <tr key={sc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{sc.contractNumber}</td>
                  <td className="py-3 px-4 font-semibold text-white">{sc.subcontractorName}</td>
                  <td className="py-3 px-4 text-slate-300">{sc.title}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">{formatVND(sc.totalValue)}</td>
                  <td className="py-3 px-4 text-center font-mono text-cyan-400">{sc.advancePaymentRate}%</td>
                  <td className="py-3 px-4 text-center font-mono text-amber-400">{sc.retentionRate}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {sc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. FIDIC PPC CERTIFICATES WITH FORMULA BREAKDOWN */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-sm text-white">Chứng chỉ Thanh toán Tạm tính PPC (Progress Payment Certificates)</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Công thức: <strong className="text-white">Thực thanh toán = Khối lượng kỳ - Thu hồi tạm ứng - Giữ lại 5% - Phạt vi phạm + VAT 8%</strong>
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800 text-xs font-semibold self-start sm:self-auto">
            Hạch toán TK 1547 / 331
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Số Chứng chỉ</th>
                <th className="py-3 px-4 font-semibold">Kỳ</th>
                <th className="py-3 px-4 font-semibold">Thời gian Nghiệm thu</th>
                <th className="py-3 px-4 font-semibold text-right">Khối lượng Đợt</th>
                <th className="py-3 px-4 font-semibold text-right">Thu hồi Tạm ứng</th>
                <th className="py-3 px-4 font-semibold text-right">Bảo hành 5%</th>
                <th className="py-3 px-4 font-semibold text-right">Phạt Backcharges</th>
                <th className="py-3 px-4 font-semibold text-right font-bold text-emerald-400">Thực thanh toán</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
                <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeCertList.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-400">{cert.certificateNumber}</td>
                  <td className="py-3 px-4 font-semibold text-white">Kỳ {cert.periodNumber}</td>
                  <td className="py-3 px-4 text-slate-400">{cert.billingStartDate} → {cert.billingEndDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-200">{formatVND(cert.grossAmount)}</td>
                  <td className="py-3 px-4 text-right font-mono text-rose-400">-{formatVND(cert.advanceDeduction)}</td>
                  <td className="py-3 px-4 text-right font-mono text-amber-400">-{formatVND(cert.retentionDeduction)}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">-{formatVND(cert.backchargesDeduction)}</td>
                  <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-400">{formatVND(cert.netPayableAmount)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cert.status === 'APPROVED' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {cert.status !== 'APPROVED' ? (
                      <button
                        onClick={() => handleApprove(cert.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition active:scale-95"
                      >
                        Duyệt PPC
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Đã duyệt
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
