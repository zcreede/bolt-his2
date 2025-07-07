import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ArrowRight } from 'lucide-react';

type BedTransferModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransferData) => void;
  currentBed: {
    id: string;
    number: string;
    ward: string;
    patient?: {
      id: string;
      name: string;
    };
  };
  availableBeds: Array<{
    id: string;
    number: string;
    ward: string;
    type: string;
  }>;
};

type TransferData = {
  targetBedId: string;
  reason: string;
  transferDate: string;
  transferTime: string;
  notes?: string;
};

const BedTransferModal: React.FC<BedTransferModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentBed,
  availableBeds
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<TransferData>({
    targetBedId: '',
    reason: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferTime: new Date().toLocaleTimeString().slice(0, 5)
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">床位调整</h2>
            {currentBed.patient && (
              <p className="text-sm text-gray-500">
                患者：{currentBed.patient.name} ({currentBed.patient.id})
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-sm text-gray-500">当前床位</p>
                <p className="font-medium text-gray-800">{currentBed.ward} - {currentBed.number}</p>
              </div>
              <ArrowRight className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">目标床位</p>
                <select
                  required
                  value={formData.targetBedId}
                  onChange={(e) => setFormData({ ...formData, targetBedId: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">选择目标床位</option>
                  {availableBeds.map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.ward} - {bed.number} ({bed.type})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                调整原因*
              </label>
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">选择调整原因</option>
                <option value="medical">医疗需要</option>
                <option value="patient-request">患者要求</option>
                <option value="maintenance">床位维护</option>
                <option value="ward-adjustment">病区调整</option>
                <option value="other">其他原因</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  调整日期*
                </label>
                <input
                  type="date"
                  required
                  value={formData.transferDate}
                  onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  调整时间*
                </label>
                <input
                  type="time"
                  required
                  value={formData.transferTime}
                  onChange={(e) => setFormData({ ...formData, transferTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                备注说明
              </label>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="输入其他需要说明的内容..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              确认调整
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BedTransferModal;
