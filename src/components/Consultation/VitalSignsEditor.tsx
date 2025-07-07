import React, { useState } from 'react';
import { Edit3, Save, X, Thermometer, Heart, Activity, Wind, Weight, Ruler } from 'lucide-react';

interface VitalSigns {
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  respiratoryRate: number;
  weight?: number;
  height?: number;
  bmi?: number;
}

interface VitalSignsEditorProps {
  vitalSigns: VitalSigns;
  onUpdate: (vitalSigns: VitalSigns) => void;
  editable?: boolean;
}

const VitalSignsEditor: React.FC<VitalSignsEditorProps> = ({
  vitalSigns,
  onUpdate,
  editable = true
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<VitalSigns>(vitalSigns);

  const handleEdit = () => {
    setEditValues(vitalSigns);
    setIsEditing(true);
  };

  const handleSave = () => {
    // 计算BMI
    if (editValues.weight && editValues.height) {
      const heightInMeters = editValues.height / 100;
      const bmi = editValues.weight / (heightInMeters * heightInMeters);
      editValues.bmi = Math.round(bmi * 10) / 10;
    }
    
    onUpdate(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues(vitalSigns);
    setIsEditing(false);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 36) return 'text-blue-600';
    if (temp > 37.5) return 'text-red-600';
    return 'text-green-600';
  };

  const getHeartRateColor = (rate: number) => {
    if (rate < 60 || rate > 100) return 'text-orange-600';
    return 'text-green-600';
  };

  const getBloodPressureColor = (bp: string) => {
    const [systolic] = bp.split('/').map(Number);
    if (systolic > 140 || systolic < 90) return 'text-red-600';
    return 'text-green-600';
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5 || bmi > 24) return 'text-orange-600';
    return 'text-green-600';
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
  };

  return (
    <div className="bg-white border-2 border-red-300 rounded-lg p-4 relative">
      {editable && (
        <div className="absolute top-2 right-2">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="p-1 text-gray-400 hover:text-primary-600 transition-colors edit-button"
              title="编辑生理指标"
            >
              <Edit3 size={16} />
            </button>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={handleSave}
                className="p-1 text-green-600 hover:text-green-700 transition-colors"
                title="保存"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="取消"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
        <Activity size={16} className="mr-1" />
        生命体征
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 体温 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Thermometer size={14} className="mr-1" />
            体温
          </div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={editValues.temperature}
                onChange={(e) => setEditValues({
                  ...editValues,
                  temperature: parseFloat(e.target.value) || 0
                })}
                className="w-16 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="ml-1 text-sm text-gray-500">°C</span>
            </div>
          ) : (
            <div className={`text-lg font-semibold ${getTemperatureColor(vitalSigns.temperature)}`}>
              {vitalSigns.temperature}°C
            </div>
          )}
        </div>

        {/* 血压 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-sm text-gray-500 mb-1">血压</div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="text"
                value={editValues.bloodPressure}
                onChange={(e) => setEditValues({
                  ...editValues,
                  bloodPressure: e.target.value
                })}
                placeholder="120/80"
                className="w-20 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="ml-1 text-xs text-gray-500">mmHg</span>
            </div>
          ) : (
            <div className={`text-lg font-semibold ${getBloodPressureColor(vitalSigns.bloodPressure)}`}>
              {vitalSigns.bloodPressure}
              <div className="text-xs text-gray-500">mmHg</div>
            </div>
          )}
        </div>

        {/* 心率 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Heart size={14} className="mr-1" />
            心率
          </div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="number"
                min="40"
                max="200"
                value={editValues.heartRate}
                onChange={(e) => setEditValues({
                  ...editValues,
                  heartRate: parseInt(e.target.value) || 0
                })}
                className="w-16 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="ml-1 text-xs text-gray-500">bpm</span>
            </div>
          ) : (
            <div className={`text-lg font-semibold ${getHeartRateColor(vitalSigns.heartRate)}`}>
              {vitalSigns.heartRate}
              <div className="text-xs text-gray-500">bpm</div>
            </div>
          )}
        </div>

        {/* 呼吸 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Wind size={14} className="mr-1" />
            呼吸
          </div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="number"
                min="10"
                max="40"
                value={editValues.respiratoryRate}
                onChange={(e) => setEditValues({
                  ...editValues,
                  respiratoryRate: parseInt(e.target.value) || 0
                })}
                className="w-16 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
              <span className="ml-1 text-xs text-gray-500">/min</span>
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {vitalSigns.respiratoryRate}
              <div className="text-xs text-gray-500">/min</div>
            </div>
          )}
        </div>

        {/* 体重 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Weight size={14} className="mr-1" />
            体重
          </div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="number"
                step="0.1"
                min="20"
                max="200"
                value={editValues.weight || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  weight: parseFloat(e.target.value) || undefined
                })}
                className="w-16 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="65"
              />
              <span className="ml-1 text-xs text-gray-500">kg</span>
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {vitalSigns.weight || '--'}
              <div className="text-xs text-gray-500">kg</div>
            </div>
          )}
        </div>

        {/* 身高 */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <Ruler size={14} className="mr-1" />
            身高
          </div>
          {isEditing ? (
            <div className="flex items-center">
              <input
                type="number"
                min="100"
                max="250"
                value={editValues.height || ''}
                onChange={(e) => setEditValues({
                  ...editValues,
                  height: parseInt(e.target.value) || undefined
                })}
                className="w-16 text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="170"
              />
              <span className="ml-1 text-xs text-gray-500">cm</span>
            </div>
          ) : (
            <div className="text-lg font-semibold text-gray-900">
              {vitalSigns.height || '--'}
              <div className="text-xs text-gray-500">cm</div>
            </div>
          )}
        </div>
      </div>

      {/* BMI显示 */}
      {(vitalSigns.bmi || (vitalSigns.weight && vitalSigns.height)) && (
        <div className="mt-4 bg-blue-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">BMI指数：</span>
              <span className={`text-lg font-semibold ml-2 ${
                vitalSigns.bmi ? getBMIColor(vitalSigns.bmi) : 'text-gray-900'
              }`}>
                {vitalSigns.bmi || '--'}
              </span>
            </div>
            {vitalSigns.bmi && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                vitalSigns.bmi < 18.5 ? 'bg-blue-100 text-blue-800' :
                vitalSigns.bmi < 24 ? 'bg-green-100 text-green-800' :
                vitalSigns.bmi < 28 ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {getBMICategory(vitalSigns.bmi)}
              </span>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="mt-3 text-xs text-gray-500 bg-yellow-50 p-2 rounded">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>正常范围：</strong></p>
              <p>• 体温：36.0-37.5°C</p>
              <p>• 血压：90-140/60-90 mmHg</p>
              <p>• 心率：60-100 bpm</p>
            </div>
            <div>
              <p><strong>参考值：</strong></p>
              <p>• 呼吸：12-20 /min</p>
              <p>• BMI：18.5-24 正常</p>
              <p>• 自动计算BMI需要体重和身高</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VitalSignsEditor;
