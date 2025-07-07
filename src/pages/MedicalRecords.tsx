import React, { useState } from 'react';
import { Search, Filter, Plus, FileText, Calendar, User, Stethoscope, FlaskConical, Pill, Eye, Download, Edit, Trash2, Clock, AlertCircle, CheckCircle, Star, Archive, Share2, Printer as Print, Upload, Tag, FolderOpen, Activity, Heart, Brain, Microscope, Camera, FileImage, FileCheck, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RecordType = 'consultation' | 'admission' | 'discharge' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'nursing' | 'progress_note' | 'referral' | 'vaccination' | 'allergy' | 'vital_signs' | 'assessment' | 'plan';
type RecordStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'amended' | 'archived';
type Priority = 'low' | 'normal' | 'high' | 'urgent';
type AccessLevel = 'public' | 'restricted' | 'confidential';

interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  type: RecordType;
  title: string;
  description: string;
  content: string;
  status: RecordStatus;
  priority: Priority;
  accessLevel: AccessLevel;
  createdDate: string;
  createdTime: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  department: string;
  encounter?: {
    id: string;
    type: 'outpatient' | 'inpatient' | 'emergency';
    location: string;
    provider: string;
  };
  diagnosis?: Array<{
    code: string;
    description: string;
    type: 'primary' | 'secondary';
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf' | 'document' | 'video';
    size: number;
    url: string;
    uploadDate: string;
  }>;
  tags?: string[];
  relatedRecords?: string[];
  vitalSigns?: {
    temperature: number;
    bloodPressure: string;
    heartRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight: number;
    height: number;
  };
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
  }>;
  labResults?: Array<{
    test: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  followUp?: {
    required: boolean;
    date?: string;
    instructions?: string;
  };
  isStarred: boolean;
  isArchived: boolean;
  version: number;
  previousVersions?: string[];
}

interface RecordTemplate {
  id: string;
  name: string;
  type: RecordType;
  category: string;
  template: string;
  fields: Array<{
    name: string;
    type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
    required: boolean;
    options?: string[];
  }>;
}

const MedicalRecords: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<RecordStatus | 'all'>('all');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'summary'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // 示例数据
  const medicalRecords: MedicalRecord[] = [
    {
      id: "MR-001",
      patientId: "P-12345",
      patientName: "张三",
      patientAge: 45,
      patientGender: "男",
      type: "consultation",
      title: "门诊就诊记录 - 高血压复查",
      description: "患者因高血压复查就诊，血压控制良好",
      content: `
        主诉：高血压复查
        现病史：患者高血压病史3年，规律服用降压药物，血压控制良好。今日复查。
        体格检查：血压 130/85 mmHg，心率 75次/分，规律。心肺听诊无异常。
        诊断：原发性高血压
        处理：继续原有降压方案，定期监测血压。
      `,
      status: "completed",
      priority: "normal",
      accessLevel: "public",
      createdDate: "2024-01-20",
      createdTime: "09:30",
      createdBy: "张医生",
      lastModified: "2024-01-20 09:45",
      lastModifiedBy: "张医生",
      department: "心内科",
      encounter: {
        id: "ENC-001",
        type: "outpatient",
        location: "门诊楼3楼心内科",
        provider: "张医生"
      },
      diagnosis: [
        { code: "I10", description: "原发性高血压", type: "primary" }
      ],
      vitalSigns: {
        temperature: 36.5,
        bloodPressure: "130/85",
        heartRate: 75,
        respiratoryRate: 18,
        oxygenSaturation: 98,
        weight: 70,
        height: 175
      },
      medications: [
        {
          name: "氨氯地平片",
          dosage: "5mg",
          frequency: "每日一次",
          duration: "30天",
          route: "口服"
        }
      ],
      followUp: {
        required: true,
        date: "2024-02-20",
        instructions: "1个月后复查血压"
      },
      tags: ["高血压", "复查", "门诊"],
      isStarred: false,
      isArchived: false,
      version: 1
    },
    {
      id: "MR-002",
      patientId: "P-12345",
      patientName: "张三",
      patientAge: 45,
      patientGender: "男",
      type: "lab_result",
      title: "血常规检查报告",
      description: "血常规检查结果正常",
      content: "血常规检查各项指标均在正常范围内",
      status: "completed",
      priority: "normal",
      accessLevel: "public",
      createdDate: "2024-01-18",
      createdTime: "14:20",
      createdBy: "检验科",
      lastModified: "2024-01-18 14:20",
      lastModifiedBy: "检验科",
      department: "检验科",
      labResults: [
        { test: "白细胞计数", value: "6.5", unit: "×10⁹/L", referenceRange: "3.5-9.5", status: "normal" },
        { test: "红细胞计数", value: "4.8", unit: "×10¹²/L", referenceRange: "4.3-5.8", status: "normal" },
        { test: "血红蛋白", value: "145", unit: "g/L", referenceRange: "130-175", status: "normal" },
        { test: "血小板计数", value: "280", unit: "×10⁹/L", referenceRange: "125-350", status: "normal" }
      ],
      tags: ["血常规", "检验"],
      isStarred: true,
      isArchived: false,
      version: 1
    },
    {
      id: "MR-003",
      patientId: "P-12346",
      patientName: "李四",
      patientAge: 32,
      patientGender: "女",
      type: "imaging",
      title: "胸部CT检查报告",
      description: "胸部CT平扫，未见明显异常",
      content: "胸部CT平扫显示：双肺纹理清晰，未见明显实质性病变，心影大小正常，纵隔居中。",
      status: "completed",
      priority: "normal",
      accessLevel: "public",
      createdDate: "2024-01-19",
      createdTime: "16:45",
      createdBy: "放射科",
      lastModified: "2024-01-19 16:45",
      lastModifiedBy: "放射科",
      department: "放射科",
      attachments: [
        {
          id: "ATT-001",
          name: "胸部CT影像.dcm",
          type: "image",
          size: 2048000,
          url: "/attachments/chest-ct-001.dcm",
          uploadDate: "2024-01-19 16:45"
        }
      ],
      tags: ["CT", "胸部", "影像"],
      isStarred: false,
      isArchived: false,
      version: 1
    }
  ];

  // 记录模板
  const recordTemplates: RecordTemplate[] = [
    {
      id: "TPL-001",
      name: "门诊病历模板",
      type: "consultation",
      category: "门诊",
      template: `
主诉：
现病史：
既往史：
体格检查：
辅助检查：
诊断：
治疗方案：
      `,
      fields: [
        { name: "主诉", type: "textarea", required: true },
        { name: "现病史", type: "textarea", required: true },
        { name: "既往史", type: "textarea", required: false },
        { name: "体格检查", type: "textarea", required: true },
        { name: "辅助检查", type: "textarea", required: false },
        { name: "诊断", type: "textarea", required: true },
        { name: "治疗方案", type: "textarea", required: true }
      ]
    },
    {
      id: "TPL-002",
      name: "住院病历模板",
      type: "admission",
      category: "住院",
      template: `
入院诊断：
主诉：
现病史：
既往史：
个人史：
家族史：
体格检查：
辅助检查：
初步诊断：
治疗计划：
      `,
      fields: [
        { name: "入院诊断", type: "textarea", required: true },
        { name: "主诉", type: "textarea", required: true },
        { name: "现病史", type: "textarea", required: true },
        { name: "既往史", type: "textarea", required: false },
        { name: "个人史", type: "textarea", required: false },
        { name: "家族史", type: "textarea", required: false },
        { name: "体格检查", type: "textarea", required: true },
        { name: "辅助检查", type: "textarea", required: false },
        { name: "初步诊断", type: "textarea", required: true },
        { name: "治疗计划", type: "textarea", required: true }
      ]
    }
  ];

  const getRecordTypeIcon = (type: RecordType) => {
    const icons = {
      consultation: <Stethoscope size={16} className="text-blue-500" />,
      admission: <User size={16} className="text-green-500" />,
      discharge: <User size={16} className="text-orange-500" />,
      lab_result: <FlaskConical size={16} className="text-purple-500" />,
      imaging: <Camera size={16} className="text-indigo-500" />,
      prescription: <Pill size={16} className="text-green-500" />,
      procedure: <Activity size={16} className="text-red-500" />,
      nursing: <Heart size={16} className="text-pink-500" />,
      progress_note: <FileText size={16} className="text-gray-500" />,
      referral: <Share2 size={16} className="text-yellow-500" />,
      vaccination: <FileCheck size={16} className="text-teal-500" />,
      allergy: <AlertTriangle size={16} className="text-red-500" />,
      vital_signs: <Activity size={16} className="text-blue-500" />,
      assessment: <Brain size={16} className="text-purple-500" />,
      plan: <Calendar size={16} className="text-green-500" />
    };
    return icons[type] || <FileText size={16} className="text-gray-500" />;
  };

  const getRecordTypeName = (type: RecordType) => {
    const names = {
      consultation: "门诊记录",
      admission: "入院记录",
      discharge: "出院记录",
      lab_result: "检验报告",
      imaging: "影像报告",
      prescription: "处方记录",
      procedure: "操作记录",
      nursing: "护理记录",
      progress_note: "病程记录",
      referral: "转诊记录",
      vaccination: "疫苗记录",
      allergy: "过敏记录",
      vital_signs: "生命体征",
      assessment: "评估记录",
      plan: "治疗计划"
    };
    return names[type] || "其他记录";
  };

  const getStatusColor = (status: RecordStatus) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      active: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      amended: "bg-yellow-100 text-yellow-800",
      archived: "bg-purple-100 text-purple-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusName = (status: RecordStatus) => {
    const names = {
      draft: "草稿",
      active: "活动",
      completed: "完成",
      cancelled: "取消",
      amended: "修订",
      archived: "归档"
    };
    return names[status] || "未知";
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      low: "text-gray-500",
      normal: "text-blue-500",
      high: "text-orange-500",
      urgent: "text-red-500"
    };
    return colors[priority] || "text-gray-500";
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    const matchesPatient = !selectedPatient || record.patientId === selectedPatient;
    const matchesDateRange = (!dateRange.start || record.createdDate >= dateRange.start) &&
                            (!dateRange.end || record.createdDate <= dateRange.end);
    
    return matchesSearch && matchesType && matchesStatus && matchesPatient && matchesDateRange;
  });

  const renderListView = () => (
    <div className="space-y-4">
      {filteredRecords.map((record) => (
        <div 
          key={record.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            setSelectedRecord(record);
            setShowRecordModal(true);
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                {getRecordTypeIcon(record.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {record.title}
                  </h3>
                  {record.isStarred && (
                    <Star size={14} className="text-yellow-500 fill-current" />
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                    {getStatusName(record.status)}
                  </span>
                  <span className={`text-xs ${getPriorityColor(record.priority)}`}>
                    {record.priority === 'urgent' && <AlertCircle size={12} className="inline mr-1" />}
                    {record.priority === 'high' && <AlertTriangle size={12} className="inline mr-1" />}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {record.description}
                </p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center">
                    <User size={12} className="mr-1" />
                    {record.patientName} ({record.patientAge}岁, {record.patientGender})
                  </span>
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {record.createdDate} {record.createdTime}
                  </span>
                  <span className="flex items-center">
                    <Stethoscope size={12} className="mr-1" />
                    {record.createdBy}
                  </span>
                  <span>{record.department}</span>
                </div>
                
                {record.tags && record.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {record.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {record.attachments && record.attachments.length > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <FileImage size={12} className="mr-1" />
                  {record.attachments.length}
                </div>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle star
                }}
                className="text-gray-400 hover:text-yellow-500"
              >
                <Star size={16} className={record.isStarred ? "text-yellow-500 fill-current" : ""} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRecord(record);
                  setShowRecordModal(true);
                }}
                className="text-gray-400 hover:text-primary-600"
              >
                <Eye size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-6">
      {filteredRecords
        .sort((a, b) => new Date(b.createdDate + ' ' + b.createdTime).getTime() - new Date(a.createdDate + ' ' + a.createdTime).getTime())
        .map((record, index) => (
          <div key={record.id} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              {index < filteredRecords.length - 1 && (
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              )}
            </div>
            
            <div className="flex-1 pb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  {getRecordTypeIcon(record.type)}
                  <span className="text-sm font-medium text-gray-900">{record.title}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                    {getStatusName(record.status)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{record.createdDate} {record.createdTime}</span>
                  <span>{record.createdBy}</span>
                  <span>{record.department}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const renderSummaryView = () => {
    const recordsByType = filteredRecords.reduce((acc, record) => {
      if (!acc[record.type]) {
        acc[record.type] = [];
      }
      acc[record.type].push(record);
      return acc;
    }, {} as Record<RecordType, MedicalRecord[]>);

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(recordsByType).map(([type, records]) => (
          <div key={type} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              {getRecordTypeIcon(type as RecordType)}
              <h3 className="font-medium text-gray-900">{getRecordTypeName(type as RecordType)}</h3>
              <span className="text-sm text-gray-500">({records.length})</span>
            </div>
            
            <div className="space-y-2">
              {records.slice(0, 5).map((record) => (
                <div 
                  key={record.id}
                  className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer truncate"
                  onClick={() => {
                    setSelectedRecord(record);
                    setShowRecordModal(true);
                  }}
                >
                  {record.title}
                </div>
              ))}
              {records.length > 5 && (
                <div className="text-sm text-gray-400">
                  还有 {records.length - 5} 条记录...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">病历管理</h1>
          <p className="text-gray-600">管理患者电子病历和医疗文档</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button 
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 flex items-center"
          >
            <FolderOpen size={16} className="mr-1" />
            模板
          </button>
          <button 
            onClick={() => setShowNewRecordModal(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            新建病历
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索病历标题、描述或患者姓名..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${
                showFilters ? 'border-primary-500 text-primary-600 bg-primary-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={16} className="mr-2" />
              筛选
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">记录类型</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as RecordType | 'all')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">所有类型</option>
                  <option value="consultation">门诊记录</option>
                  <option value="admission">入院记录</option>
                  <option value="discharge">出院记录</option>
                  <option value="lab_result">检验报告</option>
                  <option value="imaging">影像报告</option>
                  <option value="prescription">处方记录</option>
                  <option value="procedure">操作记录</option>
                  <option value="nursing">护理记录</option>
                  <option value="progress_note">病程记录</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as RecordStatus | 'all')}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">所有状态</option>
                  <option value="draft">草稿</option>
                  <option value="active">活动</option>
                  <option value="completed">完成</option>
                  <option value="cancelled">取消</option>
                  <option value="amended">修订</option>
                  <option value="archived">归档</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 视图切换 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            列表视图
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'timeline' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            时间线
          </button>
          <button
            onClick={() => setViewMode('summary')}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              viewMode === 'summary' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            分类汇总
          </button>
        </div>

        <div className="text-sm text-gray-500">
          共 {filteredRecords.length} 条记录
        </div>
      </div>

      {/* 病历列表 */}
      {filteredRecords.length > 0 ? (
        <div>
          {viewMode === 'list' && renderListView()}
          {viewMode === 'timeline' && renderTimelineView()}
          {viewMode === 'summary' && renderSummaryView()}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileText size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">未找到病历记录</h3>
          <p className="text-gray-500 mb-4">
            没有找到符合搜索条件的病历记录
          </p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedType('all');
              setSelectedStatus('all');
              setSelectedPatient('');
              setDateRange({ start: '', end: '' });
            }}
          >
            清除筛选条件
          </button>
        </div>
      )}

      {/* 病历详情模态框 */}
      {showRecordModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{selectedRecord.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRecord.patientName} • {selectedRecord.createdDate} {selectedRecord.createdTime}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <Edit size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <Download size={20} />
                </button>
                <button className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                  <Print size={20} />
                </button>
                <button
                  onClick={() => setShowRecordModal(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {/* 基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">基本信息</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">记录类型</span>
                        <span className="text-sm font-medium">{getRecordTypeName(selectedRecord.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">状态</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedRecord.status)}`}>
                          {getStatusName(selectedRecord.status)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">科室</span>
                        <span className="text-sm font-medium">{selectedRecord.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">创建者</span>
                        <span className="text-sm font-medium">{selectedRecord.createdBy}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRecord.vitalSigns && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">生命体征</h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">体温</span>
                          <span className="text-sm font-medium">{selectedRecord.vitalSigns.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">血压</span>
                          <span className="text-sm font-medium">{selectedRecord.vitalSigns.bloodPressure} mmHg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">心率</span>
                          <span className="text-sm font-medium">{selectedRecord.vitalSigns.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">血氧</span>
                          <span className="text-sm font-medium">{selectedRecord.vitalSigns.oxygenSaturation}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 病历内容 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">病历内容</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {selectedRecord.content}
                    </pre>
                  </div>
                </div>

                {/* 诊断信息 */}
                {selectedRecord.diagnosis && selectedRecord.diagnosis.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">诊断信息</h3>
                    <div className="space-y-2">
                      {selectedRecord.diagnosis.map((diag, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              diag.type === 'primary' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {diag.type === 'primary' ? '主要诊断' : '次要诊断'}
                            </span>
                            <span className="text-sm font-medium text-gray-800">{diag.description}</span>
                            <span className="text-xs text-gray-500">({diag.code})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 用药信息 */}
                {selectedRecord.medications && selectedRecord.medications.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">用药信息</h3>
                    <div className="space-y-2">
                      {selectedRecord.medications.map((med, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-800">{med.name}</span>
                            <span className="text-xs text-gray-500">{med.route}</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {med.dosage} • {med.frequency} • {med.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 检验结果 */}
                {selectedRecord.labResults && selectedRecord.labResults.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">检验结果</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">检验项目</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">结果</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">单位</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">参考范围</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.labResults.map((result, index) => (
                            <tr key={index} className="border-t border-gray-200">
                              <td className="px-4 py-2 text-sm text-gray-800">{result.test}</td>
                              <td className={`px-4 py-2 text-sm font-medium ${
                                result.status === 'normal' ? 'text-green-600' :
                                result.status === 'abnormal' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {result.value}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-600">{result.unit}</td>
                              <td className="px-4 py-2 text-sm text-gray-600">{result.referenceRange}</td>
                              <td className="px-4 py-2">
                                {result.status === 'normal' && <CheckCircle size={16} className="text-green-600" />}
                                {result.status === 'abnormal' && <AlertTriangle size={16} className="text-yellow-600" />}
                                {result.status === 'critical' && <AlertCircle size={16} className="text-red-600" />}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 附件 */}
                {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">附件</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedRecord.attachments.map((attachment) => (
                        <div key={attachment.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-2">
                            {attachment.type === 'image' ? <FileImage size={16} /> : <FileText size={16} />}
                            <span className="text-sm font-medium text-gray-800 truncate">{attachment.name}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB • {attachment.uploadDate}
                          </div>
                          <div className="flex space-x-2 mt-2">
                            <button className="text-xs text-primary-600 hover:text-primary-700">
                              <Eye size={12} className="inline mr-1" />
                              查看
                            </button>
                            <button className="text-xs text-primary-600 hover:text-primary-700">
                              <Download size={12} className="inline mr-1" />
                              下载
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 随访信息 */}
                {selectedRecord.followUp && selectedRecord.followUp.required && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">随访信息</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar size={16} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">需要随访</span>
                      </div>
                      {selectedRecord.followUp.date && (
                        <div className="text-sm text-yellow-700">
                          随访日期：{selectedRecord.followUp.date}
                        </div>
                      )}
                      {selectedRecord.followUp.instructions && (
                        <div className="text-sm text-yellow-700 mt-1">
                          随访说明：{selectedRecord.followUp.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 新建病历模态框 */}
      {showNewRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">新建病历</h2>
              <button
                onClick={() => setShowNewRecordModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries({
                  consultation: "门诊记录",
                  admission: "入院记录",
                  discharge: "出院记录",
                  lab_result: "检验报告",
                  imaging: "影像报告",
                  prescription: "处方记录",
                  procedure: "操作记录",
                  nursing: "护理记录",
                  progress_note: "病程记录"
                }).map(([type, name]) => (
                  <button
                    key={type}
                    onClick={() => {
                      setShowNewRecordModal(false);
                      // 这里可以跳转到对应的编辑页面
                    }}
                    className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    {getRecordTypeIcon(type as RecordType)}
                    <span className="text-sm font-medium text-gray-800 mt-2">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模板选择模态框 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">病历模板</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {recordTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-colors"
                    onClick={() => {
                      setShowTemplateModal(false);
                      // 这里可以使用模板创建新病历
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getRecordTypeIcon(template.type)}
                      <h3 className="font-medium text-gray-800">{template.name}</h3>
                      <span className="text-xs text-gray-500">({template.category})</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      包含 {template.fields.length} 个字段，
                      {template.fields.filter(f => f.required).length} 个必填
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
