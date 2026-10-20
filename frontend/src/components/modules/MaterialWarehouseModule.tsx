import React, { useState } from 'react';
import { 
  Boxes, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ShieldCheck, 
  Scale, 
  FileText,
  Plus
} from 'lucide-react';
import { Material, StockBalance } from '../../types';

interface MaterialWarehouseModuleProps {
  materials: Material[];
  stockBalances: StockBalance[];
}

export const MaterialWarehouseModule: React.FC<MaterialWarehouseModuleProps> = ({
  materials,
  stockBalances
}) => {
  // Interactive Norm Reconciliation Calculator State
  const [selectedMatCode, setSelectedMatCode] = useState<string>('MAT-STEEL-CB400');
  const [designedQty, setDesignedQty] = useState<number>(100);
  const [actualIssuedQty, setActualIssuedQty] = useState<number>(103.2);

  const selectedMat = materials.find(m => m.code === selectedMatCode) || materials[0];
  const standardNorm = selectedMat?.standardNormRate || 2.5;
  const varianceQty = actualIssuedQty - designedQty;
  const actualWasteRate = designedQty > 0 ? Number(((varianceQty / designedQty) * 100).toFixed(2)) : 0;
  const isOverNorm = actualWasteRate > standardNorm;

  return (
    <div className="space-y-6">
      {/* 1. TOP NORMS CARDS (CIRCULAR 12/2021/TT-BXD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Định mức Hao hụt Sắt thép</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">TT 12/2021</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">≤ 2.50%</div>
          <div className="text-xs text-slate-500 mt-2">Hao hụt thi công, nối buộc & gia công</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Định mức Bê tông Thương phẩm</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">TT 12/2021</span>
          </div>
          <div className="text-2xl font-extrabold text-sky-400 tracking-tight">≤ 1.50%</div>
          <div className="text-xs text-slate-500 mt-2">Hao hụt đổ tại chỗ, đầm dùi sàn dầm</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Định mức Cát, Đá xây dựng</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">TT 12/2021</span>
          </div>
          <div className="text-2xl font-extrabold text-amber-400 tracking-tight">≤ 3.00%</div>
          <div className="text-xs text-slate-500 mt-2">Hao hụt vận chuyển bãi tập kết hiện trường</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Định mức Xi măng Bao</span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">TT 12/2021</span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-400 tracking-tight">≤ 1.00%</div>
          <div className="text-xs text-slate-500 mt-2">Hao hụt bốc dỡ & rách vỡ bao PCB40</div>
        </div>
      </div>

      {/* 2. INTERACTIVE NORM RECONCILIATION INSPECTOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Kiểm soát & Đối soát Hao hụt Vật tư Hiện trường (Thông tư 12/2021/TT-BXD)</h3>
          </div>
          <span className="text-xs text-slate-400">Kiểm tra chênh lệch Phiếu Xuất GIN vs Khối lượng BOQ Thiết kế</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Select Material */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Chủng loại Vật tư:</label>
            <select
              value={selectedMatCode}
              onChange={(e) => setSelectedMatCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            >
              {materials.map(m => (
                <option key={m.code} value={m.code}>{m.name} ({m.unit})</option>
              ))}
            </select>
          </div>

          {/* Input BOQ Qty */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Khối lượng Thiết kế BOQ ({selectedMat?.unit}):</label>
            <input 
              type="number"
              value={designedQty}
              onChange={(e) => setDesignedQty(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Input Actual Issued Qty */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Tổng Xuất Kho GIN Thực tế ({selectedMat?.unit}):</label>
            <input 
              type="number"
              step="0.1"
              value={actualIssuedQty}
              onChange={(e) => setActualIssuedQty(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Result Card */}
          <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
            isOverNorm 
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-300' 
              : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Hao hụt Thực tế:</span>
              <strong className="text-sm font-bold font-mono">{actualWasteRate}%</strong>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] opacity-80">Định mức TT12: {standardNorm}%</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                isOverNorm ? 'bg-rose-900 text-white animate-pulse' : 'bg-emerald-900 text-white'
              }`}>
                {isOverNorm ? 'CẢNH BÁO ĐỎ' : 'HỢP LỆ'}
              </span>
            </div>
          </div>
        </div>

        {/* Warning text if over norm */}
        {isOverNorm && (
          <div className="p-3 bg-rose-950/60 border border-rose-700/80 rounded-lg text-xs text-rose-200 flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>CẢNH BÁO THẤT THOÁT:</strong> Tỷ lệ hao hụt thực tế ({actualWasteRate}%) vượt trần định mức ({standardNorm}%) là <strong>+{(actualWasteRate - standardNorm).toFixed(2)}%</strong> (tương đương vượt <strong>{varianceQty.toFixed(2)} {selectedMat?.unit}</strong>). Chỉ huy trưởng cần đình chỉ xuất kho để rà soát thất thoát hiện trường!
            </span>
          </div>
        )}
      </div>

      {/* 3. WAREHOUSE STOCK BALANCES TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Boxes className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">Sổ Kho Tồn Thực tế tại Công trường (Stock Balances)</h3>
          </div>
          <span className="text-xs text-slate-400">Cập nhật thời gian thực từ phiếu Nhập GRN / Xuất GIN</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã Vật tư</th>
                <th className="py-3 px-4 font-semibold">Tên Vật tư</th>
                <th className="py-3 px-4 font-semibold">Nhóm</th>
                <th className="py-3 px-4 font-semibold text-center">ĐVT</th>
                <th className="py-3 px-4 font-semibold text-right">Tồn kho Khả dụng</th>
                <th className="py-3 px-4 font-semibold text-right">Ngưỡng An toàn</th>
                <th className="py-3 px-4 font-semibold text-center">Định mức TT12</th>
                <th className="py-3 px-4 font-semibold text-center">Tình trạng Kho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stockBalances.map((sb) => {
                const isLowStock = sb.currentQuantity <= sb.minimumThreshold;
                return (
                  <tr key={sb.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-sky-400">{sb.material.code}</td>
                    <td className="py-3 px-4 font-semibold text-white">{sb.material.name}</td>
                    <td className="py-3 px-4 text-slate-400">{sb.material.category}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-300">{sb.material.unit}</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-400 text-sm">
                      {sb.currentQuantity.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">{sb.minimumThreshold.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cyan-400">{sb.material.standardNormRate}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isLowStock 
                          ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse' 
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}>
                        {isLowStock ? 'SẮP HẾT' : 'ĐẦY ĐỦ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
