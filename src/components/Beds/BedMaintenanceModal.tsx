import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, PenTool as Tool, Calendar, Clock } from 'lucide-react';

type MaintenanceType = 'cleaning' | 'repair' | 'inspection' | 'other';

type BedMaintenanceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MaintenanceData) => void;
  bedInfo: {
    id: string;
    number: string;
    ward: string;
  };
};

type MaintenanceData = {
  type: MaintenanceType;
  startDate: string;
  startTime: string;
  expectedDuration: number;
  description: string;
  assignedTo: string;
};

const BedMaintenanceModal: React.FC<BedMaintenanceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bedInfo
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<MaintenanceData>({
    type: 'cleaning',
    startDate: new Date().toISOString().split('T')[0],
    startTime: new Date().toLocaleTimeString().slice(0, 5),
    expectedDuration: 1,
    description: '',
    assignedTo: ''
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
            <h2 className="text-xl font-semibold text-gray-800">床位维护</h2>
            <p className="text-sm text-gray-500">
              {bedInfo.ward} - 床位 {bedInfo.number}
            </p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                维护类型*
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as MaintenanceType })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="cleaning">清洁消毒</option>
                <option value="repair">设备维修</option>
                <option value="inspection">例行检查</option>
                <option value="other">其他</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始日期*
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开始时间*
                </label>
                <input
                  type="time"
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                预计时长（小时）*
              </label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                value={formData.expectedDuration}
                onChange={(e) => setFormData({ ...formData, expectedDuration: parseFloat(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                维护说明*
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="请详细描述维护内容..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                负责人*
              </label>
              <input
                type="text"
                required
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="输入负责人姓名"
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
              提交
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BedMaintenanceModal;
