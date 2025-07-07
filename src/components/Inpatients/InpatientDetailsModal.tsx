import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, Pill, Activity, Heart, AlertTriangle, CheckCircle, ArrowRight, Printer, Download, Edit, Clipboard, Stethoscope, ChevronDown, ChevronRight } from 'lucide-react';

type InpatientStatus = 'admitted' | 'critical' | 'stable' | 'improving' | 'discharged' | 'transferred';

interface Inpatient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  admissionDate: string;
  admissionTime: string;
  ward: string;
  room: string;
  bedNumber: string;
  diagnosis: string[];
  doctor: string;
  department: string;
  status: InpatientStatus;
  expectedDischargeDate?: string;
  lengthOfStay: number;
  vitalSigns: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  nursingLevel: 'standard' | 'intermediate' | 'intensive';
  dietType: string;
  activityLevel: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    startDate: string;
    endDate?: string;
    status: 'active' | 'discontinued' | 'completed';
  }>;
  allergies?: string[];
  notes?: string;
  lastRound?: {
    date: string;
    time: string;
    doctor: string;
    notes: string;
  };
  careTeam: Array<{
    id: string;
    name: string;
    role: string;
    department: string;
  }>;
  orders: Array<{
    id: string;
    type: 'medication' | 'lab' | 'imaging' | 'procedure' | 'nursing' | 'diet' | 'activity';
    name: string;
    status: 'active' | 'completed' | 'cancelled';
    orderedDate: string;
    orderedBy: string;
    details: string;
  }>;
  progressNotes: Array<{
    id: string;
    date: string;
    time: string;
    author: string;
    content: string;
    type: 'doctor' | 'nurse' | 'other';
  }>;
  treatmentResponse: 'good' | 'fair' | 'poor' | 'unknown';
  complications: string[];
  dischargeStatus?: 'pending' | 'planned' | 'completed';
  dischargeDate?: string;
  dischargeSummary?: string;
  followUpPlan?: string;
}

interface InpatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Inpatient;
}

const InpatientDetailsModal: React.FC<InpatientDetailsModalProps> = ({
  isOpen,
  onClose,
  patient
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'progress' | 'care'>('overview');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'medications': true,
    'vitals': true,
    'team': true,
    'diagnosis': true
  });

  if (!isOpen) return null;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status: InpatientStatus) => {
    switch (status) {
      case 'admitted': return 'bg-blue-100 text-blue-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'improving': return 'bg-teal-100 text-teal-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      case 'transferred': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: InpatientStatus) => {
    const labels = {
      admitted: '已入院',
      critical: '危重',
      stable: '稳定',
      improving: '好转中',
      discharged: '已出院',
      transferred: '已转科'
    };
    return labels[status] || '未知';
  };

  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return <Pill size={16} className="text-green-600" />;
      case 'lab': return <Activity size={16} className="text-purple-600" />;
      case 'imaging': return <Activity size={16} className="text-blue-600" />;
      case 'procedure': return <Activity size={16} className="text-red-600" />;
      case 'nursing': return <Heart size={16} className="text-pink-600" />;
      case 'diet': return <Clipboard size={16} className="text-orange-600" />;
      case 'activity': return <Activity size={16} className="text-teal-600" />;
      default: return <FileText size={16} className="text-gray-600" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">基本信息</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            编辑
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">患者ID</p>
            <p className="font-medium">{patient.patientId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">姓名</p>
            <p className="font-medium">{patient.patientName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">年龄/性别</p>
            <p className="font-medium">{patient.age}岁 / {patient.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">入院日期</p>
            <p className="font-medium">{patient.admissionDate} {patient.admissionTime}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">住院天数</p>
            <p className="font-medium">{patient.lengthOfStay}天</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">预计出院日期</p>
            <p className="font-medium">{patient.expectedDischargeDate || '未确定'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">病区/床位</p>
            <p className="font-medium">{patient.ward} {patient.bedNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">主治医生</p>
            <p className="font-medium">{patient.doctor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">科室</p>
            <p className="font-medium">{patient.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">护理级别</p>
            <p className="font-medium">
              {patient.nursingLevel === 'standard' ? '普通护理' : 
               patient.nursingLevel === 'intermediate' ? '中级护理' : '重症护理'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">饮食</p>
            <p className="font-medium">{patient.dietType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">活动</p>
            <p className="font-medium">{patient.activityLevel}</p>
          </div>
        </div>
      </div>

      {/* 诊断信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('diagnosis')}>
          <h3 className="text-lg font-medium text-gray-800">诊断信息</h3>
          {expandedSections['diagnosis'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        
        {expandedSections['diagnosis'] && (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">诊断</p>
              {patient.diagnosis.map((diag, index) => (
                <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <p className="text-sm text-blue-800">{diag}</p>
                </div>
              ))}
            </div>
            
            {patient.complications.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">并发症</p>
                {patient.complications.map((comp, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2">
                    <p className="text-sm text-red-800">{comp}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">治疗反应</p>
              <div className={`inline-block px-3 py-1 rounded-full text-sm ${
                patient.treatmentResponse === 'good' ? 'bg-green-100 text-green-800' :
                patient.treatmentResponse === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                patient.treatmentResponse === 'poor' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {patient.treatmentResponse === 'good' ? '良好' :
                 patient.treatmentResponse === 'fair' ? '一般' :
                 patient.treatmentResponse === 'poor' ? '较差' : '未知'}
              </div>
            </div>
            
            {patient.allergies && patient.allergies.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">过敏史</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 生命体征 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('vitals')}>
          <h3 className="text-lg font-medium text-gray-800">生命体征</h3>
          {expandedSections['vitals'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        
        {expandedSections['vitals'] && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">体温</p>
              <p className={`text-xl font-semibold ${
                patient.vitalSigns.temperature > 37.5 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {patient.vitalSigns.temperature}°C
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">血压</p>
              <p className="text-xl font-semibold text-gray-800">
                {patient.vitalSigns.bloodPressure}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">心率</p>
              <p className={`text-xl font-semibold ${
                patient.vitalSigns.heartRate > 100 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {patient.vitalSigns.heartRate}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">呼吸</p>
              <p className={`text-xl font-semibold ${
                patient.vitalSigns.respiratoryRate > 24 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {patient.vitalSigns.respiratoryRate}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500 mb-1">血氧</p>
              <p className={`text-xl font-semibold ${
                patient.vitalSigns.oxygenSaturation < 95 ? 'text-red-600' : 'text-gray-800'
              }`}>
                {patient.vitalSigns.oxygenSaturation}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 用药信息 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('medications')}>
          <h3 className="text-lg font-medium text-gray-800">用药信息</h3>
          {expandedSections['medications'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        
        {expandedSections['medications'] && (
          <div className="space-y-3">
            {patient.medications.map((med, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-800">{med.name}</div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    med.status === 'active' ? 'bg-green-100 text-green-800' :
                    med.status === 'discontinued' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {med.status === 'active' ? '活动' :
                     med.status === 'discontinued' ? '已停用' : '已完成'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {med.dosage} • {med.frequency} • {med.route}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  开始日期: {med.startDate}
                  {med.endDate && ` • 结束日期: ${med.endDate}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 医疗团队 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => toggleSection('team')}>
          <h3 className="text-lg font-medium text-gray-800">医疗团队</h3>
          {expandedSections['team'] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
        
        {expandedSections['team'] && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.careTeam.map((member) => (
              <div key={member.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="font-medium text-gray-800">{member.name}</div>
                <div className="text-sm text-gray-600">{member.role}</div>
                <div className="text-xs text-gray-500">{member.department}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="space-y-6">
      {/* 活动医嘱 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">活动医嘱</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            开具医嘱
          </button>
        </div>
        
        <div className="space-y-3">
          {patient.orders
            .filter(order => order.status === 'active')
            .map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    {getOrderTypeIcon(order.type)}
                    <span className="ml-2 font-medium text-gray-800">{order.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-red-600 hover:text-red-700">
                      停止
                    </button>
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      修改
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  {order.details}
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  {order.orderedDate} • {order.orderedBy}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 已完成医嘱 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">已完成医嘱</h3>
        </div>
        
        <div className="space-y-3">
          {patient.orders
            .filter(order => order.status === 'completed')
            .map((order) => (
              <div key={order.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  {getOrderTypeIcon(order.type)}
                  <span className="ml-2 font-medium text-gray-800">{order.name}</span>
                </div>
                <div className="text-sm text-gray-600 ml-6">
                  {order.details}
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  {order.orderedDate} • {order.orderedBy}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* 进展记录 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">进展记录</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            添加记录
          </button>
        </div>
        
        <div className="space-y-4">
          {patient.progressNotes
            .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
            .map((note) => (
              <div key={note.id} className="border-l-4 border-primary-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">{note.author}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      {note.type === 'doctor' ? '医生记录' : 
                       note.type === 'nurse' ? '护理记录' : '其他记录'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {note.date} {note.time}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {note.content}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 查房记录 */}
      {patient.lastRound && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-800">最近查房</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm">
              查看全部
            </button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Stethoscope size={16} className="text-blue-600 mr-2" />
                <span className="font-medium text-gray-800">{patient.lastRound.doctor}</span>
              </div>
              <div className="text-sm text-gray-600">
                {patient.lastRound.date} {patient.lastRound.time}
              </div>
            </div>
            <div className="text-sm text-gray-700">
              {patient.lastRound.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCareTab = () => (
    <div className="space-y-6">
      {/* 护理评估 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">护理评估</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            更新评估
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">护理级别</p>
            <p className="font-medium text-gray-800">
              {patient.nursingLevel === 'standard' ? '普通护理' : 
               patient.nursingLevel === 'intermediate' ? '中级护理' : '重症护理'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">饮食</p>
            <p className="font-medium text-gray-800">{patient.dietType}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">活动</p>
            <p className="font-medium text-gray-800">{patient.activityLevel}</p>
          </div>
        </div>
      </div>

      {/* 护理记录 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">护理记录</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm">
            <Edit size={14} className="inline mr-1" />
            添加记录
          </button>
        </div>
        
        <div className="space-y-4">
          {patient.progressNotes
            .filter(note => note.type === 'nurse')
            .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime())
            .map((note) => (
              <div key={note.id} className="border-l-4 border-pink-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800">{note.author}</span>
                    <span className="ml-2 text-xs text-pink-600">护理记录</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {note.date} {note.time}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {note.content}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 护理任务 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">护理任务</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-gray-800">测量生命体征</div>
              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                已完成
              </span>
            </div>
            <div className="text-sm text-gray-600">
              每4小时测量一次
            </div>
            <div className="text-xs text-gray-500 mt-1">
              最近执行: 今天 08:00
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-gray-800">静脉给药</div>
              <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                待执行
              </span>
            </div>
            <div className="text-sm text-gray-600">
              头孢曲松 2g 静脉滴注
            </div>
            <div className="text-xs text-gray-500 mt-1">
              计划时间: 今天 12:00
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium text-gray-800">翻身拍背</div>
              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                定时任务
              </span>
            </div>
            <div className="text-sm text-gray-600">
              每2小时翻身一次，预防压疮
            </div>
            <div className="text-xs text-gray-500 mt-1">
              下次执行: 今天 14:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">{patient.patientName}</h2>
              <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(patient.status)}`}>
                {getStatusLabel(patient.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {patient.age}岁 • {patient.gender} • {patient.ward} {patient.bedNumber}床 • 住院{patient.lengthOfStay}天
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
              <Printer size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User size={16} className="inline mr-2" />
            概览
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clipboard size={16} className="inline mr-2" />
            医嘱
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'progress'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            病程记录
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'care'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Heart size={16} className="inline mr-2" />
            护理管理
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'orders' && renderOrdersTab()}
          {activeTab === 'progress' && renderProgressTab()}
          {activeTab === 'care' && renderCareTab()}
        </div>
      </div>
    </div>
  );
};

export default InpatientDetailsModal;
