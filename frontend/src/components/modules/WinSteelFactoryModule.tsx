import React, { useState } from 'react';
import { 
  Factory, 
  QrCode, 
  CheckCircle2, 
  Layers, 
  Flame, 
  Sparkles, 
  Paintbrush, 
  Truck, 
  HardHat, 
  Scale, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { SteelComponent } from '../../types';

interface WinSteelFactoryModuleProps {
  components: SteelComponent[];
  onErectComponent?: (qrCode: string) => void;
}

export const WinSteelFactoryModule: React.FC<WinSteelFactoryModuleProps> = ({
  components,
  onErectComponent
}) => {
  const [componentList, setComponentList] = useState<SteelComponent[]>(components);
  const [qrInput, setQrInput] = useState<string>('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Interactive Nesting Simulator State
  const [rawPlateKg, setRawPlateKg] = useState<number>(10000);
  const [utilizedKg, setUtilizedKg] = useState<number>(9750);

  const scrapKg = rawPlateKg - utilizedKg;
  const scrapRate = rawPlateKg > 0 ? Number(((scrapKg / rawPlateKg) * 100).toFixed(2)) : 0;
  const isNestingApproved = scrapRate <= 3.0;

  const handleErect = (qrCode: string, mark: string) => {
    setComponentList(prev => prev.map(c => 
      c.qrCodeUid === qrCode ? { ...c, erectionStatus: 'ERECTED', shippingStatus: 'ON_SITE' } : c
    ));
    if (onErectComponent) onErectComponent(qrCode);
    setSuccessToast(`Cấu kiện ${mark} (Mã QR: ${qrCode}) đã được quét cẩu lắp dựng thành công vào vị trí thiết kế!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const totalTonnageKg = componentList.reduce((acc, c) => acc + (c.weightKg || 0), 0);
  const erectedCount = componentList.filter(c => c.erectionStatus === 'ERECTED').length;

  return (
    <div className="space-y-6">
      {/* SUCCESS TOAST */}
      {successToast && (
        <div className="bg-purple-950/90 border border-purple-600 text-purple-200 px-4 py-3 rounded-xl flex items-center space-x-3 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* 1. TOP WINSTEEL METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Công suất Nhà máy WinSteel</span>
            <div className="p-2 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
              <Factory className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            1.500 <span className="text-sm font-normal text-slate-400">Tấn / Tháng</span>
          </div>
          <div className="text-xs text-purple-400 font-medium mt-2">KCN Nam Tân Uyên, Bình Dương</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Tiến độ Lắp dựng Hiện trường</span>
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <HardHat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 tracking-tight">
            {erectedCount} / {componentList.length} <span className="text-sm font-normal text-slate-400">Cấu kiện</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">Quét mã QR định danh khi cẩu lắp</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Chuẩn Làm sạch Bề mặt</span>
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-cyan-400 tracking-tight">Bắn Bi Thép Sa 2.5</div>
          <div className="text-xs text-slate-400 mt-2">Theo tiêu chuẩn Thụy Điển ISO 8501-1</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Sơn Chống cháy PCCC</span>
            <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-800">
              <Paintbrush className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-400 tracking-tight">QCVN 06:2022/BXD</div>
          <div className="text-xs text-slate-400 mt-2">Sơn Epoxy lót 80μm + Chống cháy R90</div>
        </div>
      </div>

      {/* 2. INTERACTIVE NESTING CUT OPTIMIZATION CALCULATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Kiểm soát Kế hoạch Cắt Phôi Thép Tấm (Nesting Plan Optimization)</h3>
          </div>
          <span className="text-xs text-slate-400">Quy chuẩn ADB: Tỷ lệ thép vụn phế liệu &le; 3.00%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Quy cách Thép Tấm Phôi:</label>
            <input 
              type="text"
              readOnly
              value="Posco SS400 2000x12000x12mm"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 px-3 py-2 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Khối lượng Phôi Thép Ban đầu (kg):</label>
            <input 
              type="number"
              step="50"
              value={rawPlateKg}
              onChange={(e) => setRawPlateKg(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Thành phẩm Tận dụng (kg):</label>
            <input 
              type="number"
              step="50"
              value={utilizedKg}
              onChange={(e) => setUtilizedKg(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
            isNestingApproved 
              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
              : 'bg-rose-950/40 border-rose-800 text-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Tỷ lệ Phế liệu Vụn:</span>
              <strong className="text-sm font-bold font-mono">{scrapRate}%</strong>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] opacity-80">Vụn: {scrapKg} kg</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                isNestingApproved ? 'bg-emerald-900 text-white' : 'bg-rose-900 text-white animate-pulse'
              }`}>
                {isNestingApproved ? 'DUYỆT CẮT' : 'REJECTED_OVER_SCRAP'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. STEEL COMPONENTS BOM TABLE WITH QR ERECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <QrCode className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-sm text-white">Danh mục Cấu kiện Thép Bóc tách (Tekla BOM) & Quét Mã QR Lắp dựng</h3>
          </div>
          <span className="text-xs text-slate-400">Tổng khối lượng: {(totalTonnageKg / 1000).toFixed(2)} Tấn</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã Cấu kiện</th>
                <th className="py-3 px-4 font-semibold">Mã QR Code UID</th>
                <th className="py-3 px-4 font-semibold">Tiết diện Quy cách</th>
                <th className="py-3 px-4 font-semibold">Vị trí Trục</th>
                <th className="py-3 px-4 font-semibold text-right">Khối lượng (kg)</th>
                <th className="py-3 px-4 font-semibold text-center">Cắt CNC</th>
                <th className="py-3 px-4 font-semibold text-center">Hàn SAW</th>
                <th className="py-3 px-4 font-semibold text-center">Bắn bi Sa2.5</th>
                <th className="py-3 px-4 font-semibold text-center">Sơn DFT</th>
                <th className="py-3 px-4 font-semibold text-center">Lắp dựng</th>
                <th className="py-3 px-4 font-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {componentList.map((c) => {
                const isErected = c.erectionStatus === 'ERECTED';
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-white">{c.componentMark}</td>
                    <td className="py-3 px-4 font-mono text-purple-400 flex items-center space-x-1">
                      <QrCode className="w-3.5 h-3.5 mr-1 shrink-0" />
                      <span className="truncate">{c.qrCodeUid}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{c.profileSpecs}</td>
                    <td className="py-3 px-4 font-bold text-sky-400">{c.gridLocation}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">{c.weightKg.toLocaleString('vi-VN')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400">OK</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400">NDT OK</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400">Sa 2.5</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950 text-emerald-400">DFT 80μm</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isErected 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {isErected ? 'ĐÃ LẮP DỰNG' : 'CHỜ CẨU LẮP'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!isErected ? (
                        <button
                          onClick={() => handleErect(c.qrCodeUid, c.componentMark)}
                          className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow transition active:scale-95"
                        >
                          Quét Lắp Dựng
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Hoàn thành
                        </span>
                      )}
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
