import React, { useState } from 'react';
import { 
  Truck, 
  Fuel, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  Gauge, 
  Plus, 
  Calendar 
} from 'lucide-react';
import { Equipment } from '../../types';

interface EquipmentFleetModuleProps {
  equipments: Equipment[];
}

export const EquipmentFleetModule: React.FC<EquipmentFleetModuleProps> = ({ equipments }) => {
  const [selectedEqId, setSelectedEqId] = useState<number>(equipments[0]?.id || 1);
  const [workedHours, setWorkedHours] = useState<number>(8);
  const [fuelIssued, setFuelIssued] = useState<number>(160);

  const activeMachine = equipments.find(e => e.id === selectedEqId) || equipments[0];
  const normLitersPerHour = activeMachine?.standardFuelNorm || 18.5;
  const expectedFuel = workedHours * normLitersPerHour;
  const varianceLiters = fuelIssued - expectedFuel;
  const variancePercent = expectedFuel > 0 ? Number(((varianceLiters / expectedFuel) * 100).toFixed(2)) : 0;

  const isCritical = variancePercent > 15;
  const isOver = variancePercent > 5;

  return (
    <div className="space-y-6">
      {/* 1. TOP FLEET SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Tổng Thiết bị Cơ giới Đội xe</span>
            <div className="p-2 rounded-lg bg-orange-950 text-orange-400 border border-orange-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight">
            {equipments.length} <span className="text-sm font-normal text-slate-400">Đầu máy</span>
          </div>
          <div className="text-xs text-emerald-400 font-medium mt-2">100% Sẵn sàng Hoạt động</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Tổng Giờ Nổ Máy Tích lũy</span>
            <div className="p-2 rounded-lg bg-sky-950 text-sky-400 border border-sky-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-400 tracking-tight">
            {equipments.reduce((acc, e) => acc + (e.totalEngineHours || 0), 0).toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-400">Giờ</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">Theo đồng hồ Hour Meter cơ điện</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Chuẩn Tiêu hao Nhiên liệu</span>
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg font-bold text-amber-400 tracking-tight">Thông tư 12/2021/TT-BXD</div>
          <div className="text-xs text-slate-400 mt-2">Định mức ca máy theo công suất động cơ</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4.5">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span className="font-semibold text-slate-300">Kiểm định An toàn Kỹ thuật</span>
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-emerald-400 tracking-tight">Còn hiệu lực 100%</div>
          <div className="text-xs text-slate-400 mt-2">Trung tâm Kiểm định Bộ LĐ-TB&XH</div>
        </div>
      </div>

      {/* 2. INTERACTIVE DIESEL FUEL & ENGINE HOUR CALCULATOR */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Gauge className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm text-white">Kiểm tra Nhật trình Ca máy & Đối soát Dầu Diesel (Thông tư 12/2021)</h3>
          </div>
          <span className="text-xs text-slate-400">Ngưỡng cảnh báo: &gt;5% (Vàng), &gt;15% (Đỏ)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Select Machine */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Chọn Đầu máy Thi công:</label>
            <select
              value={selectedEqId}
              onChange={(e) => setSelectedEqId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            >
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.code} — {eq.name}</option>
              ))}
            </select>
          </div>

          {/* Input Worked Hours */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Số giờ nổ máy thực tế (Giờ):</label>
            <input 
              type="number"
              step="0.5"
              value={workedHours}
              onChange={(e) => setWorkedHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Input Fuel Liters */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Lượng dầu Diesel cấp phát (Lít):</label>
            <input 
              type="number"
              step="1"
              value={fuelIssued}
              onChange={(e) => setFuelIssued(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-bold text-white px-3 py-2 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Fuel Result Badge */}
          <div className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${
            isCritical 
              ? 'bg-rose-950/40 border-rose-800 text-rose-300' 
              : isOver 
              ? 'bg-amber-950/40 border-amber-800 text-amber-300' 
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Độ lệch Nhiên liệu:</span>
              <strong className="text-sm font-bold font-mono">
                {variancePercent > 0 ? `+${variancePercent}` : variancePercent}%
              </strong>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] opacity-80">Kỳ vọng: {expectedFuel.toFixed(1)} L</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                isCritical 
                  ? 'bg-rose-900 text-white animate-pulse' 
                  : isOver 
                  ? 'bg-amber-900 text-white' 
                  : 'bg-emerald-900 text-white'
              }`}>
                {isCritical ? 'CRITICAL' : isOver ? 'OVER_CONSUMPTION' : 'NORMAL'}
              </span>
            </div>
          </div>
        </div>

        {isCritical && (
          <div className="p-3 bg-rose-950/60 border border-rose-700 rounded-lg text-xs text-rose-200 flex items-center space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>CẢNH BÁO BẤT THƯỜNG:</strong> Lượng dầu tiêu hao vượt định mức {variancePercent}% (&gt;15%). Cần cử kỹ sư cơ điện kiểm tra rò rỉ xilanh hoặc gian lận dầu bồn téc!
            </span>
          </div>
        )}
      </div>

      {/* 3. FLEET MACHINERY DIRECTORY */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm text-white">Danh bạ Thiết bị & Hồ sơ Kiểm định An toàn Kỹ thuật</h3>
          </div>
          <span className="text-xs text-slate-400">Chuẩn an toàn thiết bị nâng TCVN 4244:2005</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">Mã Thiết bị</th>
                <th className="py-3 px-4 font-semibold">Tên Máy thi công</th>
                <th className="py-3 px-4 font-semibold">Hãng / Chủng loại</th>
                <th className="py-3 px-4 font-semibold text-right">Tổng Giờ Máy (h)</th>
                <th className="py-3 px-4 font-semibold text-right">Định mức Dầu TT12</th>
                <th className="py-3 px-4 font-semibold text-center">Hạn Kiểm định</th>
                <th className="py-3 px-4 font-semibold text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {equipments.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-orange-400">{eq.code}</td>
                  <td className="py-3 px-4 font-semibold text-white">{eq.name}</td>
                  <td className="py-3 px-4 text-slate-400">{eq.brand || 'Komatsu'} — {eq.category}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-white">
                    {eq.totalEngineHours.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-cyan-400">
                    {eq.standardFuelNorm > 0 ? `${eq.standardFuelNorm} L/h` : 'Điện 3 pha'}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                    {eq.safetyInspectionExpiry}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      {eq.status}
                    </span>
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
