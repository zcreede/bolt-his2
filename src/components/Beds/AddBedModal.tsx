import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, BedDouble } from 'lucide-react';

type AddBedModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BedFormData) => void;
  initialData?: BedFormData;
  mode?: 'add' | 'edit';
  wardRooms: Array<{
    id: string;
    number: string;
    type: 'standard' | 'premium' | 'vip';
    capacity: number;
    currentBeds: number;
    wardName: string;
  }>;
};

export type BedFormData = {
  number: string;
  wardId: string;
  roomId: string;
  type: 'normal' | 'icu' | 'emergency' | 'pediatric';
  level: string;
  description?: string;
  features?: string[];
  status: 'available' | 'maintenance';
  position: {
    x: number;
    y: number;
  };
};

const AddBedModal: React.FC<AddBedModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = 'add',
  wardRooms
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BedFormData>(initialData || {
    number: '',
    wardId: '',
    roomId: '',
    type: 'normal',
    level: '',
    description: '',
    features: [],
    status: 'available',
    position: {
      x: 0,
      y: 0
    }
  });

  // 获取所有病区
  const wards = Array.from(new Set(wardRooms.map(room => room.wardName)));
  
  // 根据选择的病区筛选房间
  const filteredRooms = wardRooms.filter(room => 
    !formData.wardId || room.wardName === formData.wardId
  );

  // 获取选中房间的信息
  const selectedRoom = wardRooms.find(room => room.id === formData.roomId);

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
            <h2 className="text-xl font-semibold text-gray-800">
              {mode === 'add' ? '添加床位' : '编辑床位'}
            </h2>
            {selectedRoom && (
              <p className="text-sm text-gray-500">
                {selectedRoom.wardName} - {selectedRoom.number}房 ({selectedRoom.currentBeds}/{selectedRoom.capacity}床)
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择病区*
              </label>
              <select
                required
                value={formData.wardId}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  wardId: e.target.value,
                  roomId: '' // 清空已选择的房间
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">请选择病区</option>
                {wards.map(ward => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                选择房间*
              </label>
              <select
                required
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                disabled={!formData.wardId}
              >
                <option value="">请选择房间</option>
                {filteredRooms.map(room => (
                  <option 
                    key={room.id} 
                    value={room.id}
                    disabled={room.currentBeds >= room.capacity}
                  >
                    {room.number}房 - {room.type === 'standard' ? '标准间' : 
                                     room.type === 'premium' ? '高级间' : 'VIP'} 
                    ({room.currentBeds}/{room.capacity}床)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位号*
              </label>
              <input
                type="text"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="如：301-A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位类型*
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as BedFormData['type'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="normal">普通床位</option>
                <option value="icu">重症监护</option>
                <option value="emergency">急诊观察</option>
                <option value="pediatric">儿科病床</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位等级*
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">选择等级</option>
                <option value="standard">标准床位</option>
                <option value="premium">高级床位</option>
                <option value="vip">VIP床位</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位描述
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="输入床位的详细描述..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位状态*
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as BedFormData['status'] })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="available">可用</option>
                <option value="maintenance">维护中</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                床位特点
              </label>
              <div className="space-y-2">
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...(formData.features || [])];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="输入床位特点"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.features?.filter((_, i) => i !== index);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    features: [...(formData.features || []), '']
                  })}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  + 添加特点
                </button>
              </div>
            </div>

            {selectedRoom && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  床位位置
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="aspect-[4/3] bg-white border-2 border-dashed border-gray-300 rounded-lg relative">
                    {/* 这里可以添加床位布局的可视化编辑器 */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      点击设置床位位置
                    </div>
                  </div>
                </div>
              </div>
            )}
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

export default AddBedModal;
