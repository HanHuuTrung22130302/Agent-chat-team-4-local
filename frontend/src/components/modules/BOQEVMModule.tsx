import React, { useState } from 'react';
import { 
  Activity, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Calculator, 
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { EVMAnalysis } from '../../types';

interface BOQEVMModuleProps {
  evmData: EVMAnalysis | null;
  projectId: number;
}

export const BOQEVMModule: React.FC<BOQEVMModuleProps> = ({ evmData }) => {
  const [simulatedCostDelta, setSimulatedCostDelta] = useState<number>(0);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(num);
  };

  const currentBAC = evmData?.bac || 185000000000;
  const currentEV = evmData?.earnedValue || 72850000000;
  const baseAC = evmData?.actualCost || 69400000000;
  const simulatedAC = baseAC + (simulatedCostDelta * 1000000000); // delta in billions VND
  const simulatedCPI = simulatedAC > 0 ? Number((currentEV / simulatedAC).toFixed(2)) : 1.0;
  const simulatedCV = currentEV - simulatedAC;

  const boqItems = [
    { code: 'BOQ-01.01', name: 'Khoan cọc nhồi D1200 sâu 45m', unit: 'MÉT', qty: 2400, rate: 3200000, total: 7680000000, normCode: 'AF.12111 (TT 12/2021)' },
    { code: 'BOQ-01.02', name: 'Đào móng đất cấp III bằng máy 1.25m3', unit: 'M3', qty: 15600, rate: 85000, total: 1326000000, normCode: 'AB.11413 (TT 12/2021)' },
    { code: 'BOQ-02.01', name: 'Bê tông đài móng M300 R28 B8', unit: 'M3', qty: 3800, rate: 1650000, total: 6270000000, normCode: 'AF.21112 (TT 12/2021)' },
    { code: 'BOQ-02.02', name: 'Gia công lắp dựng cốt thép CB400 D>18', unit: 'TẤN', qty: 450, rate: 21500000, total: 9675000000, normCode: 'AF.61123 (TT 12/2021)' },
    { code: 'BOQ-03.01', name: 'Gia công cột thép H500x250x8x12 WinSteel', unit: 'TẤN', qty: 650, rate: 38500000, total: 25025000000, normCode: 'AI.11211 (Tekla BOM)' },
    { code: 'BOQ-03.02', name: 'Lắp dựng khung kèo thép tiền chế khẩu độ 36m', unit: 'TẤN', qty: 820, rate: 6500000, total: 5330000000, normCode: 'AI.22114 (TT 12/2021)' }
  ];

  return (
    <div className="space-y-6">
      {/* 1. TOP EVM COCKPIT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Planned Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Giá trị Kế hoạch (PV)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">Planned</span>
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight">
            {formatVND(evmData?.plannedValue || 71225000000)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            % Kế hoạch WBS × Ngân sách BAC
          </div>
        </div>

        {/* Earned Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Giá trị Thu được (EV)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">Earned</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-400 tracking-tight">
            {formatVND(currentEV)}
          </div>
          <div className="text-xs text-emerald-400/90 font-medium mt-2">
            % Nghiệm thu thực tế × BAC
          </div>
        </div>

        {/* Actual Cost */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Chi phí Thực tế (AC)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800 font-mono">Actual</span>
          </div>
          <div className="text-xl font-extrabold text-sky-400 tracking-tight">
            {formatVND(baseAC)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Tổng chi từ Kho, Máy & Thầu phụ
          </div>
        </div>

        {/* CPI / SPI Metric */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="font-semibold text-slate-300">Chỉ số Hiệu suất (CPI / SPI)</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">HEALTHY</span>
          </div>
          <div className="text-xl font-extrabold text-white tracking-tight flex items-center space-x-3">
            <span>CPI: <strong className="text-emerald-400">{evmData?.cpi || 1.05}</strong></span>
            <span className="text-slate-600">|</span>
            <span>SPI: <strong className="text-cyan-400">{evmData?.spi || 1.02}</strong></span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-2">
            Tiết kiệm chi phí & Đúng kế hoạch
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE WHAT-IF COST SIMULATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Trình Mô phỏng Biến động Chi phí & Rủi ro Dự toán (What-If EVM Calculator)</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Chuẩn quốc tế PMI / FIDIC EVM</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Mô phỏng Phát sinh Chi phí Hiện trường (Tỷ VNĐ):
            </label>
            <div className="flex items-center space-x-3">
              <input 
                type="range" 
                min="-10" 
                max="20" 
                step="0.5"
                value={simulatedCostDelta}
                onChange={(e) => setSimulatedCostDelta(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <span className={`font-mono font-bold text-sm min-w-16 text-right ${simulatedCostDelta > 0 ? 'text-rose-400' : simulatedCostDelta < 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                {simulatedCostDelta > 0 ? `+${simulatedCostDelta}` : simulatedCostDelta} Tỷ
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Kéo thanh trượt để dự báo biến động CPI và tổng chi phí khi hoàn thành (EAC).</p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">CPI Mô phỏng (EV / AC):</span>
              <strong className={`font-mono text-sm ${simulatedCPI >= 1.0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {simulatedCPI} {simulatedCPI >= 1.0 ? '(Hiệu quả)' : '(Vượt chi)'}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Độ lệch Chi phí (CV = EV - AC):</span>
              <strong className={`font-mono ${simulatedCV >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatVND(simulatedCV)}
              </strong>
            </div>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Dự toán khi Hoàn thành (EAC):</span>
              <strong className="font-mono text-sm text-white">
                {formatVND(simulatedCPI > 0 ? Math.round(currentBAC / simulatedCPI) : currentBAC)}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Dự báo Tiết kiệm / Vượt ngân sách:</span>
              <strong className={`font-mono ${currentBAC - (currentBAC / simulatedCPI) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatVND(Math.round(currentBAC - (currentBAC / simulatedCPI)))}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILED BOQ ITEMS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm text-white">Bảng Tiên lượng Khối lượng & Đơn giá BOQ (Định mức Thông tư 12/2021/TT-BXD)</h3>
          </div>
          <span className="text-xs text-slate-400">Tổng cộng: {boqItems.length} Hạng mục chính</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã BOQ</th>
                <th className="py-3 px-4 font-semibold">Mã Định mức BXD</th>
                <th className="py-3 px-4 font-semibold">Mô tả Công tác</th>
                <th className="py-3 px-4 font-semibold text-center">ĐVT</th>
                <th className="py-3 px-4 font-semibold text-right">Khối lượng</th>
                <th className="py-3 px-4 font-semibold text-right">Đơn giá (VNĐ)</th>
                <th className="py-3 px-4 font-semibold text-right font-bold text-white">Thành tiền (VNĐ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {boqItems.map((item, index) => (
                <tr key={index} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-sky-400">{item.code}</td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{item.normCode}</td>
                  <td className="py-3 px-4 font-semibold text-white">{item.name}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-300">{item.unit}</td>
                  <td className="py-3 px-4 text-right font-mono font-medium">{item.qty.toLocaleString('vi-VN')}</td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">{formatVND(item.rate)}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">{formatVND(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
