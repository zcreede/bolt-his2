import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, FileText, Stethoscope, Clock, AlertTriangle } from 'lucide-react';

type WardRoundModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WardRoundData) => void;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    diagnosis: string;
    admissionDate: string;
    ward: string;
    bedNumber: string;
  };
  previousRounds?: WardRoundData[];
};

export type WardRoundData = {
  id: string;
  date: string;
  time: string;
  doctor: string;
  vitalSigns: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
  };
  condition: string;
  progress: string;
  treatment: string;
  nextRoundDate?: string;
  urgencyLevel: 'normal' | 'attention' | 'urgent';
};

const WardRoundModal: React.FC<WardRoundModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient,
  previousRounds
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<WardRoundData, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString().slice(0, 5),
    doctor: '张医生', // 实际应该从登录用户信息获取
    vitalSigns: {
      temperature: 37,
      bloodPressure: '120/80',
      heartRate: 75,
      respiratoryRate: 16
    },
    condition: '',
    progress: '',
    treatment: '',
    urgencyLevel: 'normal'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: `WR-${Date.now()}`,
      ...formData
    });
  };

  const getUrgencyColor = (level: WardRoundData['urgencyLevel']) => {
    switch (level) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'attention':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">查房记录</h2>
            <p className="text-sm text-gray-500">患者：{patient.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：患者信息和新查房记录 */}
          <div className="space-y-6">
            {/* 患者信息 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">患者信息</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID</span>
                  <span>{patient.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">年龄</span>
                  <span>{patient.age}岁</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">性别</span>
                  <span>{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">入院日期</span>
                  <span>{patient.admissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">病区/床位</span>
                  <span>{patient.ward} - {patient.bedNumber}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-gray-600">初步诊断</span>
                  <p className="mt-1 text-gray-800">{patient.diagnosis}</p>
                </div>
              </div>
            </div>

            {/* 查房记录表单 */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      日期
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      时间
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    生命体征
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="体温 (°C)"
                        value={formData.vitalSigns.temperature}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {
                            ...formData.vitalSigns,
                            temperature: parseFloat(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="血压 (mmHg)"
                        value={formData.vitalSigns.bloodPressure}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {
                            ...formData.vitalSigns,
                            bloodPressure: e.target.value
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="心率 (次/分)"
                        value={formData.vitalSigns.heartRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {
                            ...formData.vitalSigns,
                            heartRate: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="呼吸 (次/分)"
                        value={formData.vitalSigns.respiratoryRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitalSigns: {
                            ...formData.vitalSigns,
                            respiratoryRate: parseInt(e.target.value)
                          }
                        })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    目前病情
                  </label>
                  <textarea
                    rows={3}
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="描述患者当前症状和体征..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    病情进展
                  </label>
                  <textarea
                    rows={3}
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="描述病情变化情况..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    治疗方案
                  </label>
                  <textarea
                    rows={3}
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="记录治疗方案调整..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    下次查房
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.nextRoundDate}
                    onChange={(e) => setFormData({ ...formData, nextRoundDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    关注等级
                  </label>
                  <select
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value as WardRoundData['urgencyLevel'] })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="normal">正常</option>
                    <option value="attention">需要关注</option>
                    <option value="urgent">需要紧急处理</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
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
                    保存记录
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 右侧：历史查房记录 */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">历史查房记录</h3>
            <div className="space-y-4 max-h-[calc(90vh-200px)] overflow-y-auto">
              {previousRounds?.map((round) => (
                <div key={round.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <Clock size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">
                        {round.date} {round.time}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(round.urgencyLevel)}`}>
                      {round.urgencyLevel === 'urgent' ? '紧急' : 
                       round.urgencyLevel === 'attention' ? '需关注' : '正常'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 flex items-center">
                        <Stethoscope size={16} className="mr-1" />
                        生命体征
                      </h4>
                      <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gray-600">
                          体温: {round.vitalSigns.temperature}°C
                        </div>
                        <div className="text-gray-600">
                          血压: {round.vitalSigns.bloodPressure}
                        </div>
                        <div className="text-gray-600">
                          心率: {round.vitalSigns.heartRate}次/分
                        </div>
                        <div className="text-gray-600">
                          呼吸: {round.vitalSigns.respiratoryRate}次/分
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">病情记录</h4>
                      <p className="mt-1 text-sm text-gray-600">{round.condition}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">进展情况</h4>
                      <p className="mt-1 text-sm text-gray-600">{round.progress}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700">治疗方案</h4>
                      <p className="mt-1 text-sm text-gray-600">{round.treatment}</p>
                    </div>

                    {round.nextRoundDate && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock size={16} className="mr-1" />
                        下次查房: {new Date(round.nextRoundDate).toLocaleString()}
                      </div>
                    )}

                    <div className="text-sm text-gray-500">
                      记录医生: {round.doctor}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardRoundModal;
