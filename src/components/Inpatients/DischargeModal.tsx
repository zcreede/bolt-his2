import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface DischargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    admissionDate: string;
    lengthOfStay: number;
    diagnosis: string[];
    doctor: string;
    department: string;
  };
}

const DischargeModal: React.FC<DischargeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patient
}) => {
  const [formData, setFormData] = useState({
    dischargeDate: new Date().toISOString().split('T')[0],
    dischargeTime: new Date().toLocaleTimeString().slice(0, 5),
    dischargeType: 'regular',
    dischargeDestination: 'home',
    dischargeCondition: 'improved',
    dischargeDiagnosis: patient.diagnosis.join('、'),
    treatmentSummary: '',
    medicationInstructions: '',
    followUpPlan: '',
    followUpDate: '',
    specialInstructions: '',
    warningSymptoms: '',
    requiresReferral: false,
    referralDetails: '',
    dischargeApproved: false,
    approvedBy: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">办理出院</h2>
            <p className="text-sm text-gray-500 mt-1">
              患者：{patient.name} • {patient.age}岁 • {patient.gender} • 住院{patient.lengthOfStay}天
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
            {/* 左侧：出院基本信息 */}
            <div className="space-y-6">
              {/* 出院信息提示 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 mb-1">出院前确认</h3>
                    <p className="text-sm text-blue-700">请确保患者已完成所有必要的治疗和检查，并已准备好出院材料。</p>
                  </div>
                </div>
              </div>

              {/* 出院时间 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出院日期*
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dischargeDate}
                    onChange={(e) => setFormData({ ...formData, dischargeDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    出院时间*
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.dischargeTime}
                    onChange={(e) => setFormData({ ...formData, dischargeTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* 出院类型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出院类型*
                </label>
                <select
                  required
                  value={formData.dischargeType}
                  onChange={(e) => setFormData({ ...formData, dischargeType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="regular">正常出院</option>
                  <option value="transfer">转院</option>
                  <option value="against-advice">自动出院</option>
                  <option value="deceased">死亡</option>
                </select>
              </div>

              {/* 出院去向 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出院去向*
                </label>
                <select
                  required
                  value={formData.dischargeDestination}
                  onChange={(e) => setFormData({ ...formData, dischargeDestination: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="home">回家</option>
                  <option value="nursing-home">养老院</option>
                  <option value="rehabilitation">康复中心</option>
                  <option value="other-hospital">其他医院</option>
                </select>
              </div>

              {/* 出院状态 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出院状态*
                </label>
                <select
                  required
                  value={formData.dischargeCondition}
                  onChange={(e) => setFormData({ ...formData, dischargeCondition: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="improved">好转</option>
                  <option value="cured">治愈</option>
                  <option value="stable">稳定</option>
                  <option value="unchanged">无变化</option>
                  <option value="worse">恶化</option>
                </select>
              </div>

              {/* 出院诊断 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出院诊断*
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.dischargeDiagnosis}
                  onChange={(e) => setFormData({ ...formData, dischargeDiagnosis: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* 治疗总结 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  治疗总结*
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.treatmentSummary}
                  onChange={(e) => setFormData({ ...formData, treatmentSummary: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请总结住院期间的主要治疗措施和效果..."
                />
              </div>
            </div>

            {/* 右侧：出院医嘱和随访计划 */}
            <div className="space-y-6">
              {/* 出院用药指导 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  出院用药指导*
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.medicationInstructions}
                  onChange={(e) => setFormData({ ...formData, medicationInstructions: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请详细说明出院后的用药方案、剂量、频次等..."
                />
              </div>

              {/* 随访计划 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  随访计划*
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.followUpPlan}
                  onChange={(e) => setFormData({ ...formData, followUpPlan: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请说明随访安排..."
                />
              </div>

              {/* 随访日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  随访日期
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* 特殊指导 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  特殊指导
                </label>
                <textarea
                  rows={3}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入饮食、活动、生活方式等方面的特殊指导..."
                />
              </div>

              {/* 警示症状 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  需警惕的症状*
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.warningSymptoms}
                  onChange={(e) => setFormData({ ...formData, warningSymptoms: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请说明出院后需要警惕并及时就医的症状..."
                />
              </div>

              {/* 转诊信息 */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.requiresReferral}
                    onChange={(e) => setFormData({ ...formData, requiresReferral: e.target.checked })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>需要转诊</span>
                </label>

                {formData.requiresReferral && (
                  <textarea
                    rows={3}
                    value={formData.referralDetails}
                    onChange={(e) => setFormData({ ...formData, referralDetails: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="请输入转诊医院、科室和原因..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* 出院审批 */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <label className="flex items-center space-x-2 text-sm font-medium text-yellow-800 mb-2">
              <input
                type="checkbox"
                checked={formData.dischargeApproved}
                onChange={(e) => setFormData({ ...formData, dischargeApproved: e.target.checked })}
                className="rounded border-yellow-300 text-primary-600 focus:ring-primary-500"
              />
              <span>我确认患者符合出院标准，并已完成所有必要的出院准备</span>
            </label>

            {formData.dischargeApproved && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-yellow-800 mb-1">
                  审批医生
                </label>
                <input
                  type="text"
                  value={formData.approvedBy}
                  onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  className="w-full border border-yellow-300 bg-white rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="输入审批医生姓名"
                />
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
              disabled={!formData.dischargeApproved}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                formData.dischargeApproved
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <ArrowRight size={16} className="inline mr-1" />
              确认出院
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DischargeModal;
