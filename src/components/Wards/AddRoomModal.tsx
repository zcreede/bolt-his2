import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

type AddRoomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData) => void;
  initialData?: RoomFormData;
  mode?: 'add' | 'edit';
};

export type RoomFormData = {
  number: string;
  type: 'standard' | 'premium' | 'vip';
  capacity: number;
  facilities: {
    hasWindow: boolean;
    hasPrivateBathroom: boolean;
    hasTV: boolean;
    hasRefrigerator: boolean;
    hasAC: boolean;
    hasWifi: boolean;
    hasPhone: boolean;
    hasNurseCall: boolean;
    hasOxygen: boolean;
  };
};

const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add'
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<RoomFormData>(initialData || {
    number: '',
    type: 'standard',
    capacity: 2,
    facilities: {
      hasWindow: true,
      hasPrivateBathroom: false,
      hasTV: true,
      hasRefrigerator: false,
      hasAC: true,
      hasWifi: true,
      hasPhone: true,
      hasNurseCall: true,
      hasOxygen: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? '添加病房' : '编辑病房'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                房间号*
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="如：301"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                房间类型*
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as RoomFormData['type'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="standard">标准间</option>
                <option value="premium">高级间</option>
                <option value="vip">VIP病房</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位数量*
              </label>
              <input
                type="number"
                required
                min="1"
                max="6"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房间设施
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasWindow}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasWindow: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">窗户</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasPrivateBathroom}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasPrivateBathroom: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">独立卫生间</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasTV}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasTV: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">电视</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasRefrigerator}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasRefrigerator: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">冰箱</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasAC}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasAC: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">空调</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasWifi}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasWifi: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">WiFi</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasPhone}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasPhone: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">电话</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasNurseCall}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasNurseCall: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">呼叫器</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.facilities.hasOxygen}
                    onChange={(e) => setFormData({
                      ...formData,
                      facilities: { ...formData.facilities, hasOxygen: e.target.checked }
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">供氧</span>
                </label>
              </div>
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
              {mode === 'add' ? '添加' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
