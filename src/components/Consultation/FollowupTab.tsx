import React from 'react';
import { Calendar, Clock, FileText, AlertCircle, CheckCircle, Phone, MessageSquare, Video } from 'lucide-react';

interface FollowupTabProps {
  data: {
    followupPlan: string;
    nextAppointment: string;
    healthEducation: string;
    followupType: 'clinic' | 'phone' | 'video' | 'message';
    followupInterval: string;
    followupInstructions: string;
    medicationReview: boolean;
    labReview: boolean;
    imagingReview: boolean;
    emergencyContacts: Array<{
      name: string;
      phone: string;
      relationship: string;
    }>;
    warningSignsEducation: string[];
    lifestyleRecommendations: string[];
  };
  onChange: (field: string, value: any) => void;
}

const FollowupTab: React.FC<FollowupTabProps> = ({ data, onChange }) => {
  const followupTypes = [
    { value: 'clinic', label: '门诊复诊', icon: <Calendar size={16} /> },
    { value: 'phone', label: '电话随访', icon: <Phone size={16} /> },
    { value: 'video', label: '视频随访', icon: <Video size={16} /> },
    { value: 'message', label: '消息随访', icon: <MessageSquare size={16} /> }
  ];

  const followupIntervals = [
    { value: '1week', label: '1周后' },
    { value: '2weeks', label: '2周后' },
    { value: '1month', label: '1个月后' },
    { value: '3months', label: '3个月后' },
    { value: '6months', label: '6个月后' },
    { value: 'custom', label: '自定义' }
  ];

  const commonWarningSignsEducation = [
    '发热超过38.5°C',
    '呼吸困难或胸痛',
    '严重头痛或头晕',
    '持续恶心呕吐',
    '意识状态改变',
    '严重腹痛',
    '出血不止',
    '过敏反应症状'
  ];

  const commonLifestyleRecommendations = [
    '保持规律作息',
    '适量运动',
    '均衡饮食',
    '戒烟限酒',
    '定期监测血压',
    '按时服药',
    '保持心情愉快',
    '避免过度劳累'
  ];

  const addWarningSign = (sign: string) => {
    if (!data.warningSignsEducation.includes(sign)) {
      onChange('warningSignsEducation', [...data.warningSignsEducation, sign]);
    }
  };

  const removeWarningSign = (index: number) => {
    onChange('warningSignsEducation', data.warningSignsEducation.filter((_, i) => i !== index));
  };

  const addLifestyleRecommendation = (recommendation: string) => {
    if (!data.lifestyleRecommendations.includes(recommendation)) {
      onChange('lifestyleRecommendations', [...data.lifestyleRecommendations, recommendation]);
    }
  };

  const removeLifestyleRecommendation = (index: number) => {
    onChange('lifestyleRecommendations', data.lifestyleRecommendations.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 space-y-6 max-w-full">
      {/* 随访计划 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Calendar size={18} className="text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">随访计划</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">随访方式</label>
            <div className="grid grid-cols-2 gap-2">
              {followupTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => onChange('followupType', type.value)}
                  className={`flex items-center justify-center p-2 border rounded-lg text-sm ${
                    data.followupType === type.value
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {type.icon}
                  <span className="ml-1">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">随访间隔</label>
            <select
              value={data.followupInterval}
              onChange={(e) => onChange('followupInterval', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">选择随访间隔</option>
              {followupIntervals.map(interval => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">下次随访时间</label>
          <input
            type="datetime-local"
            value={data.nextAppointment}
            onChange={(e) => onChange('nextAppointment', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">随访内容</label>
          <div className="space-y-2 mb-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.medicationReview}
                onChange={(e) => onChange('medicationReview', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">药物使用情况评估</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.labReview}
                onChange={(e) => onChange('labReview', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">化验结果复查</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.imagingReview}
                onChange={(e) => onChange('imagingReview', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">影像检查复查</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">随访说明</label>
          <textarea
            rows={3}
            value={data.followupInstructions}
            onChange={(e) => onChange('followupInstructions', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="详细说明随访的具体要求和注意事项..."
          />
        </div>
      </div>

      {/* 健康教育 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <FileText size={18} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">健康教育</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">健康教育内容</label>
          <textarea
            rows={4}
            value={data.healthEducation}
            onChange={(e) => onChange('healthEducation', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="提供给患者的健康教育内容..."
          />
        </div>
      </div>

      {/* 生活方式建议 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <CheckCircle size={18} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">生活方式建议</h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">常用建议</label>
          <div className="flex flex-wrap gap-2">
            {commonLifestyleRecommendations.map(recommendation => (
              <button
                key={recommendation}
                onClick={() => addLifestyleRecommendation(recommendation)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100"
              >
                + {recommendation}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">已选择的建议</label>
          <div className="space-y-2">
            {data.lifestyleRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-2">
                <span className="text-sm text-blue-800">{recommendation}</span>
                <button
                  onClick={() => removeLifestyleRecommendation(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 危险信号教育 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <AlertCircle size={18} className="text-red-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">危险信号教育</h3>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">常见危险信号</label>
          <div className="flex flex-wrap gap-2">
            {commonWarningSignsEducation.map(sign => (
              <button
                key={sign}
                onClick={() => addWarningSign(sign)}
                className="px-3 py-1 text-sm bg-red-50 text-red-700 border border-red-200 rounded-full hover:bg-red-100"
              >
                + {sign}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">需要立即就医的症状</label>
          <div className="space-y-2">
            {data.warningSignsEducation.map((sign, index) => (
              <div key={index} className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-2">
                <span className="text-sm text-red-800">{sign}</span>
                <button
                  onClick={() => removeWarningSign(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 紧急联系人 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Phone size={18} className="text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">紧急联系方式</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-sm font-medium text-orange-800 mb-1">医院急诊科</div>
            <div className="text-sm text-orange-700">电话：120 或 医院总机转急诊科</div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="text-sm font-medium text-orange-800 mb-1">主治医生</div>
            <div className="text-sm text-orange-700">工作时间：周一至周五 8:00-17:00</div>
            <div className="text-sm text-orange-700">联系方式：通过医院总机转科室</div>
          </div>

          {data.emergencyContacts && data.emergencyContacts.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">患者紧急联系人</div>
              {data.emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-800">{contact.name} ({contact.relationship})</div>
                  <div className="text-sm text-gray-600">{contact.phone}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowupTab;
