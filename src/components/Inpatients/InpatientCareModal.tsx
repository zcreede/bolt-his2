import React, { useState } from 'react';
import { X, Heart, AlertTriangle, Clock, Calendar, User, Plus, Trash2, CheckCircle, Activity } from 'lucide-react';

type NursingLevel = 'standard' | 'intermediate' | 'intensive';

interface InpatientCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    ward: string;
    bedNumber: string;
    nursingLevel: NursingLevel;
    dietType: string;
    activityLevel: string;
    diagnosis: string;
    allergies?: string[];
  };
}

const InpatientCareModal: React.FC<InpatientCareModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient
}) => {
  const [formData, setFormData] = useState({
    nursingLevel: patient.nursingLevel,
    dietType: patient.dietType,
    activityLevel: patient.activityLevel,
    vitalSignsFrequency: 'q4h', // 每4小时
    intakeOutput: true,
    skinCare: true,
    fallPrevention: true,
    painAssessment: true,
    specialInstructions: '',
    tasks: [
      { id: '1', name: '测量生命体征', frequency: 'q4h', status: 'active' },
      { id: '2', name: '翻身拍背', frequency: 'q2h', status: 'active' }
    ],
    newTask: { name: '', frequency: 'q8h' }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addTask = () => {
    if (formData.newTask.name.trim()) {
      setFormData({
        ...formData,
        tasks: [
          ...formData.tasks,
          {
            id: Date.now().toString(),
            name: formData.newTask.name,
            frequency: formData.newTask.frequency,
            status: 'active'
          }
        ],
        newTask: { name: '', frequency: 'q8h' }
      });
    }
  };

  const removeTask = (id: string) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter(task => task.id !== id)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">护理计划</h2>
            <p className="text-sm text-gray-500 mt-1">
              患者：{patient.name} • {patient.age}岁 • {patient.gender} • {patient.ward} {patient.bedNumber}床
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：基本护理设置 */}
            <div className="space-y-6">
              {/* 患者信息提示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">患者信息</h3>
                    <p className="text-sm text-blue-700">诊断：{patient.diagnosis}</p>
                    {patient.allergies && patient.allergies.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-red-700">过敏史：</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {patient.allergies.map((allergy, index) => (
                            <span key={index} className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 护理级别 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  护理级别
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nursingLevel: 'standard' })}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border ${
                      formData.nursingLevel === 'standard'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    普通护理
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nursingLevel: 'intermediate' })}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border ${
                      formData.nursingLevel === 'intermediate'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    中级护理
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nursingLevel: 'intensive' })}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border ${
                      formData.nursingLevel === 'intensive'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    重症护理
                  </button>
                </div>
              </div>

              {/* 饮食 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  饮食
                </label>
                <select
                  value={formData.dietType}
                  onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="普通饮食">普通饮食</option>
                  <option value="低盐饮食">低盐饮食</option>
                  <option value="糖尿病饮食">糖尿病饮食</option>
                  <option value="流质饮食">流质饮食</option>
                  <option value="半流质饮食">半流质饮食</option>
                  <option value="软食">软食</option>
                  <option value="禁食">禁食</option>
                </select>
              </div>

              {/* 活动 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  活动
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="不限制">不限制</option>
                  <option value="适度活动">适度活动</option>
                  <option value="卧床休息，可下床如厕">卧床休息，可下床如厕</option>
                  <option value="卧床休息，定时翻身">卧床休息，定时翻身</option>
                  <option value="绝对卧床">绝对卧床</option>
                </select>
              </div>

              {/* 生命体征监测频率 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  生命体征监测频率
                </label>
                <select
                  value={formData.vitalSignsFrequency}
                  onChange={(e) => setFormData({ ...formData, vitalSignsFrequency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="q1h">每1小时</option>
                  <option value="q2h">每2小时</option>
                  <option value="q4h">每4小时</option>
                  <option value="q6h">每6小时</option>
                  <option value="q8h">每8小时</option>
                  <option value="q12h">每12小时</option>
                  <option value="qd">每日一次</option>
                </select>
              </div>

              {/* 特殊护理需求 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  特殊护理需求
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.intakeOutput}
                      onChange={(e) => setFormData({ ...formData, intakeOutput: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">出入量监测</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.skinCare}
                      onChange={(e) => setFormData({ ...formData, skinCare: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">皮肤护理</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.fallPrevention}
                      onChange={(e) => setFormData({ ...formData, fallPrevention: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">跌倒预防</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.painAssessment}
                      onChange={(e) => setFormData({ ...formData, painAssessment: e.target.checked })}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">疼痛评估</span>
                  </label>
                </div>
              </div>

              {/* 特殊说明 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  特殊说明
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入特殊护理说明..."
                />
              </div>
            </div>

            {/* 右侧：护理任务 */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">护理任务</h3>
                
                <div className="space-y-3 mb-4">
                  {formData.tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div>
                        <div className="font-medium text-gray-800">{task.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          频率: {task.frequency === 'q1h' ? '每1小时' :
                                 task.frequency === 'q2h' ? '每2小时' :
                                 task.frequency === 'q4h' ? '每4小时' :
                                 task.frequency === 'q6h' ? '每6小时' :
                                 task.frequency === 'q8h' ? '每8小时' :
                                 task.frequency === 'q12h' ? '每12小时' :
                                 task.frequency === 'qd' ? '每日一次' : task.frequency}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.newTask.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        newTask: { ...formData.newTask, name: e.target.value }
                      })}
                      placeholder="输入新任务..."
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <select
                      value={formData.newTask.frequency}
                      onChange={(e) => setFormData({
                        ...formData,
                        newTask: { ...formData.newTask, frequency: e.target.value }
                      })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="q1h">每1小时</option>
                      <option value="q2h">每2小时</option>
                      <option value="q4h">每4小时</option>
                      <option value="q6h">每6小时</option>
                      <option value="q8h">每8小时</option>
                      <option value="q12h">每12小时</option>
                      <option value="qd">每日一次</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={addTask}
                    disabled={!formData.newTask.name.trim()}
                    className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} className="inline mr-1" />
                    添加任务
                  </button>
                </div>
              </div>

              {/* 护理评估表 */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-800 mb-4">护理评估表</h3>
                
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <CheckCircle size={16} className="text-green-600 mr-2" />
                      <span className="font-medium text-gray-800">压疮风险评估</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      最近评估: 今天 08:00 • 低风险
                    </div>
                    <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                      重新评估
                    </button>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <CheckCircle size={16} className="text-green-600 mr-2" />
                      <span className="font-medium text-gray-800">跌倒风险评估</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      最近评估: 昨天 16:00 • 中度风险
                    </div>
                    <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                      重新评估
                    </button>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <Clock size={16} className="text-yellow-600 mr-2" />
                      <span className="font-medium text-gray-800">疼痛评估</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      需要评估
                    </div>
                    <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                      进行评估
                    </button>
                  </div>
                </div>
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
              保存护理计划
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InpatientCareModal;
