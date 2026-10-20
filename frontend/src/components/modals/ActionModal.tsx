import React, { useState } from 'react';
import { X, Check, Boxes, Truck, Calendar, Receipt } from 'lucide-react';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [actionType, setActionType] = useState<'MR' | 'EQUIPMENT' | 'DIARY' | 'PPC'>('MR');
  
  // MR Form State
  const [mrNumber, setMrNumber] = useState(`MR-ADB-${new Date().getFullYear()}-0${Math.floor(Math.random() * 90 + 10)}`);
  const [matCode, setMatCode] = useState('MAT-STEEL-CB400');
  const [qty, setQty] = useState(25.5);
  const [reason, setReason] = useState('Gia công cốt thép dầm sàn tầng 2 trục 5-10');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (actionType === 'MR') {
      onSuccess(`Đã tạo thành công Phiếu đề nghị cấp vật tư ${mrNumber} (${qty} tấn)! Đã gửi phê duyệt PM.`);
    } else if (actionType === 'EQUIPMENT') {
      onSuccess(`Đã ghi nhận nhật trình ca máy và dầu Diesel thành công! Đối soát hợp lệ theo TT 12/2021.`);
    } else if (actionType === 'DIARY') {
      onSuccess(`Đã số hóa nhật ký hiện trường ngày hôm nay kèm xác nhận của TVGS!`);
    } else {
      onSuccess(`Đã khởi tạo đợt nghiệm thu thanh toán PPC mới theo chuẩn FIDIC!`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div>
            <h2 className="text-base font-bold text-white">Thao tác Nghiệp vụ Hiện trường</h2>
            <p className="text-xs text-slate-400">Chọn quy trình cần thực hiện</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Type Selector */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 grid grid-cols-4 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActionType('MR')}
            className={`p-2 rounded-lg flex flex-col items-center space-y-1 font-semibold transition ${
              actionType === 'MR' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Cấp Vật tư</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('EQUIPMENT')}
            className={`p-2 rounded-lg flex flex-col items-center space-y-1 font-semibold transition ${
              actionType === 'EQUIPMENT' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Ca Máy & Dầu</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('DIARY')}
            className={`p-2 rounded-lg flex flex-col items-center space-y-1 font-semibold transition ${
              actionType === 'DIARY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Nhật ký</span>
          </button>
          <button
            type="button"
            onClick={() => setActionType('PPC')}
            className={`p-2 rounded-lg flex flex-col items-center space-y-1 font-semibold transition ${
              actionType === 'PPC' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Duyệt PPC</span>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {actionType === 'MR' && (
            <>
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Số Phiếu MR (Material Requisition):</label>
                <input
                  type="text"
                  required
                  value={mrNumber}
                  onChange={(e) => setMrNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold px-3 py-2 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Chủng loại Vật tư:</label>
                  <select
                    value={matCode}
                    onChange={(e) => setMatCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-3 py-2 outline-none focus:border-sky-500"
                  >
                    <option value="MAT-STEEL-CB400">Thép Hòa Phát CB400 D20</option>
                    <option value="MAT-CONC-M300">Bê tông tươi M300 R28</option>
                    <option value="MAT-SAND-GOLD">Cát vàng bê tông</option>
                    <option value="MAT-CEMENT-PCB40">Xi măng Insee PCB40</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Khối lượng Đề nghị:</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white font-mono font-bold px-3 py-2 outline-none text-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Mục đích sử dụng & Vị trí WBS:</label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg text-white px-3 py-2 outline-none focus:border-sky-500 resize-none"
                />
              </div>
            </>
          )}

          {actionType === 'EQUIPMENT' && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 space-y-2">
              <p className="font-semibold text-orange-400">Ghi nhận nhanh Nhật trình Ca máy:</p>
              <p className="text-slate-400">Đầu máy: <strong>Hitachi KH180-3 50T</strong> | Thợ lái: <strong>Trần Văn Tám</strong></p>
              <p className="text-slate-400">Giờ hoạt động: <strong>8.0 giờ</strong> | Dầu cấp phát: <strong>148.0 Lít</strong> (Đạt chuẩn định mức TT 12/2021).</p>
            </div>
          )}

          {actionType === 'DIARY' && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 space-y-2">
              <p className="font-semibold text-emerald-400">Điểm danh & Nhật ký ngày hôm nay:</p>
              <p className="text-slate-400">Thời tiết: <strong>Nắng ráo 33°C</strong> | Quân số: <strong>120 kỹ sư & công nhân</strong>.</p>
              <p className="text-slate-400">An toàn: <strong>100% công nhân trang bị đồ bảo hộ cá nhân PPE</strong>.</p>
            </div>
          )}

          {actionType === 'PPC' && (
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 space-y-2">
              <p className="font-semibold text-teal-400">Khởi tạo Chứng chỉ PPC Kỳ tiếp theo:</p>
              <p className="text-slate-400">Hợp đồng: <strong>HĐGK-ADB-2026/04-ST</strong> (Việt Thép)</p>
              <p className="text-slate-400">Tự động áp dụng khấu trừ 10% tạm ứng và 5% bảo hành theo FIDIC.</p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition font-medium"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-lg shadow-sky-600/20 transition active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Xác nhận Lưu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
