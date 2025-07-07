import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Calendar, Clock, AlertCircle, FileText } from 'lucide-react';

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  patientId,
  patientName
}) => {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [registrationType, setRegistrationType] = useState<'today' | 'appointment'>('today');
  const [selectedDate, setSelectedDate] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptomDuration, setSymptomDuration] = useState('');
  const [symptomSeverity, setSymptomSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
  
  // 模拟数据 - 实际应该从API获取
  const departments = [
    { id: 'DEPT-001', name: '内科' },
    { id: 'DEPT-002', name: '外科' },
    { id: 'DEPT-003', name: '儿科' },
    { id: 'DEPT-004', name: '妇科' }
  ];

  const schedules = [
    {
      id: 'SCH-001',
      doctorId: 'D-001',
      doctorName: '张医生',
      department: 'DEPT-001',
      date: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endTime: '11:30',
      availableSlots: 8,
      totalSlots: 15,
      registrationType: 'today'
    },
    {
      id: 'SCH-002',
      doctorId: 'D-002',
      doctorName: '李医生',
      department: 'DEPT-001',
      date: new Date().toISOString().split('T')[0],
      startTime: '14:00',
      endTime: '17:00',
      availableSlots: 5,
      totalSlots: 12,
      registrationType: 'today'
    },
    {
      id: 'SCH-003',
      doctorId: 'D-003',
      doctorName: '王医生',
      department: 'DEPT-001',
      date: '2025-05-26',
      startTime: '09:00',
      endTime: '11:30',
      availableSlots: 12,
      totalSlots: 15,
      registrationType: 'appointment'
    }
  ];

  // 常见症状建议
  const commonSymptoms = [
    '发热', '头痛', '咳嗽', '胸痛', '腹痛', '恶心', '呕吐', '腹泻', 
    '便秘', '头晕', '乏力', '失眠', '心悸', '气短', '关节痛', '皮疹'
  ];

  const handleSubmit = (scheduleId: string) => {
    // 构建挂号数据，包含主诉信息
    const registrationData = {
      patientId,
      scheduleId,
      registrationType,
      chiefComplaint: {
        mainComplaint: chiefComplaint,
        duration: symptomDuration,
        severity: symptomSeverity,
        urgencyLevel,
        additionalSymptoms,
        registrationTime: new Date().toISOString()
      }
    };
    
    console.log('Registration submitted with chief complaint:', registrationData);
    onClose();
  };

  const addSymptom = () => {
    if (newSymptom.trim() && !additionalSymptoms.includes(newSymptom.trim())) {
      setAdditionalSymptoms([...additionalSymptoms, newSymptom.trim()]);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setAdditionalSymptoms(additionalSymptoms.filter(s => s !== symptom));
  };

  const addCommonSymptom = (symptom: string) => {
    if (!additionalSymptoms.includes(symptom)) {
      setAdditionalSymptoms([...additionalSymptoms, symptom]);
    }
  };

  const filteredSchedules = schedules.filter(s => 
    (!selectedDepartment || s.department === selectedDepartment) && 
    (!selectedDate || s.date === selectedDate) &&
    s.registrationType === registrationType
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {registrationType === 'today' ? '当日挂号' : '预约挂号'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">患者：{patientName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 左侧：挂号信息 */}
          <div className="space-y-6">
            <div>
              <div className="flex space-x-4 mb-4">
                <button
                  onClick={() => setRegistrationType('today')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                    registrationType === 'today'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  当日挂号
                </button>
                <button
                  onClick={() => setRegistrationType('appointment')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium ${
                    registrationType === 'appointment'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  预约挂号
                </button>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择科室
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">请选择科室</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {registrationType === 'appointment' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择日期
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            )}

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">可选号源</h3>
              {filteredSchedules.length > 0 ? (
                <div className="space-y-3">
                  {filteredSchedules.map(schedule => (
                    <div key={schedule.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">{schedule.doctorName}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar size={14} className="mr-1" />
                            {schedule.date}
                            <Clock size={14} className="ml-3 mr-1" />
                            {schedule.startTime} - {schedule.endTime}
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          剩余号源：{schedule.availableSlots}/{schedule.totalSlots}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSubmit(schedule.id)}
                        disabled={schedule.availableSlots === 0 || !chiefComplaint.trim()}
                        className={`w-full py-2 text-sm font-medium rounded-lg ${
                          schedule.availableSlots > 0 && chiefComplaint.trim()
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {schedule.availableSlots > 0 ? (
                          registrationType === 'today' ? '挂号' : '预约'
                        ) : '已满'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无可用号源
                </div>
              )}
            </div>
          </div>

          {/* 右侧：主诉信息 */}
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <FileText size={16} className="text-yellow-600 mr-2" />
                <h3 className="text-sm font-medium text-yellow-800">主诉信息</h3>
                <span className="ml-2 text-xs text-red-600">* 必填</span>
              </div>
              <p className="text-xs text-yellow-700">
                请详细描述患者的主要症状，这将帮助医生更好地了解病情并提供针对性的诊疗。
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主要症状 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="请详细描述患者的主要不适症状，如：头痛、发热、咳嗽等..."
                required
              />
              <div className="mt-1 text-xs text-gray-500">
                建议包含：症状部位、性质、程度等信息
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  症状持续时间
                </label>
                <select
                  value={symptomDuration}
                  onChange={(e) => setSymptomDuration(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">选择时间</option>
                  <option value="几小时">几小时</option>
                  <option value="1天">1天</option>
                  <option value="2-3天">2-3天</option>
                  <option value="1周">1周</option>
                  <option value="2周">2周</option>
                  <option value="1个月">1个月</option>
                  <option value="3个月以上">3个月以上</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  症状严重程度
                </label>
                <select
                  value={symptomSeverity}
                  onChange={(e) => setSymptomSeverity(e.target.value as 'mild' | 'moderate' | 'severe')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="mild">轻度</option>
                  <option value="moderate">中度</option>
                  <option value="severe">重度</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                紧急程度
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'routine', label: '常规', color: 'green' },
                  { value: 'urgent', label: '紧急', color: 'yellow' },
                  { value: 'emergency', label: '急诊', color: 'red' }
                ].map(level => (
                  <button
                    key={level.value}
                    onClick={() => setUrgencyLevel(level.value as 'routine' | 'urgent' | 'emergency')}
                    className={`py-2 px-3 text-sm font-medium rounded-lg border ${
                      urgencyLevel === level.value
                        ? level.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                          level.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' :
                          'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                伴随症状
              </label>
              
              {/* 常见症状快速选择 */}
              <div className="mb-3">
                <div className="text-xs text-gray-500 mb-2">常见症状（点击添加）：</div>
                <div className="flex flex-wrap gap-1">
                  {commonSymptoms.map(symptom => (
                    <button
                      key={symptom}
                      onClick={() => addCommonSymptom(symptom)}
                      disabled={additionalSymptoms.includes(symptom)}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        additionalSymptoms.includes(symptom)
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义症状输入 */}
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="输入其他症状..."
                />
                <button
                  onClick={addSymptom}
                  className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  添加
                </button>
              </div>

              {/* 已选择的症状 */}
              {additionalSymptoms.length > 0 && (
                <div className="space-y-1">
                  {additionalSymptoms.map(symptom => (
                    <div key={symptom} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-3 py-2">
                      <span className="text-sm text-gray-700">{symptom}</span>
                      <button
                        onClick={() => removeSymptom(symptom)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 提示信息 */}
            {!chiefComplaint.trim() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertCircle size={16} className="text-red-600 mr-2" />
                  <span className="text-sm text-red-700">请填写主要症状后才能完成挂号</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
