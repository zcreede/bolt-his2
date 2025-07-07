import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Plus, Trash2, Upload, FileImage, FileText, Calendar, Clock, User, Tag } from 'lucide-react';
import RichTextEditor from '../Consultation/RichTextEditor';

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

interface RecordEditorProps {
  record?: MedicalRecord;
  isNew?: boolean;
  onClose: () => void;
  onSave: (record: MedicalRecord) => void;
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  recordType?: RecordType;
  templateContent?: string;
}

const RecordEditor: React.FC<RecordEditorProps> = ({
  record,
  isNew = false,
  onClose,
  onSave,
  patientId,
  patientName,
  patientAge,
  patientGender,
  recordType = 'consultation',
  templateContent
}) => {
  const [formData, setFormData] = useState<Partial<MedicalRecord>>({
    title: '',
    description: '',
    content: '',
    status: 'draft',
    priority: 'normal',
    accessLevel: 'public',
    department: '',
    tags: [],
    diagnosis: [],
    medications: [],
    followUp: {
      required: false
    }
  });
  const [newTag, setNewTag] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState({ code: '', description: '', type: 'primary' as const });
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '', duration: '', route: '' });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    } else if (isNew) {
      setFormData({
        id: `MR-${Date.now()}`,
        patientId: patientId || '',
        patientName: patientName || '',
        patientAge: patientAge || 0,
        patientGender: patientGender || '',
        type: recordType,
        title: '',
        description: '',
        content: templateContent || '',
        status: 'draft',
        priority: 'normal',
        accessLevel: 'public',
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString().slice(0, 5),
        createdBy: '当前用户',
        lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
        lastModifiedBy: '当前用户',
        department: '',
        tags: [],
        isStarred: false,
        isArchived: false,
        version: 1
      });
    }
  }, [record, isNew, patientId, patientName, patientAge, patientGender, recordType, templateContent]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags && !formData.tags.includes(newTag.trim())) {
      handleChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (formData.tags) {
      handleChange('tags', formData.tags.filter(t => t !== tag));
    }
  };

  const handleAddDiagnosis = () => {
    if (newDiagnosis.description.trim()) {
      handleChange('diagnosis', [...(formData.diagnosis || []), { ...newDiagnosis }]);
      setNewDiagnosis({ code: '', description: '', type: 'primary' });
    }
  };

  const handleRemoveDiagnosis = (index: number) => {
    if (formData.diagnosis) {
      handleChange('diagnosis', formData.diagnosis.filter((_, i) => i !== index));
    }
  };

  const handleAddMedication = () => {
    if (newMedication.name.trim()) {
      handleChange('medications', [...(formData.medications || []), { ...newMedication }]);
      setNewMedication({ name: '', dosage: '', frequency: '', duration: '', route: '' });
    }
  };

  const handleRemoveMedication = (index: number) => {
    if (formData.medications) {
      handleChange('medications', formData.medications.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    // 验证必填字段
    if (!formData.title?.trim()) {
      alert('请填写标题');
      return;
    }

    if (!formData.content?.trim()) {
      alert('请填写内容');
      return;
    }

    // 更新最后修改时间
    const updatedRecord = {
      ...formData,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
      lastModifiedBy: '当前用户'
    } as MedicalRecord;

    onSave(updatedRecord);
    setHasUnsavedChanges(false);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      onClose();
    }
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isNew ? `新建${getRecordTypeName(formData.type as RecordType)}` : `编辑${getRecordTypeName(formData.type as RecordType)}`}
            </h2>
            {formData.patientName && (
              <p className="text-sm text-gray-500 mt-1">
                患者：{formData.patientName} ({formData.patientAge}岁, {formData.patientGender})
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <Save size={16} className="mr-1" />
              保存
            </button>
            <button
              onClick={handleClose}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="请输入病历标题"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  科室
                </label>
                <select
                  value={formData.department || ''}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">选择科室</option>
                  <option value="内科">内科</option>
                  <option value="外科">外科</option>
                  <option value="儿科">儿科</option>
                  <option value="妇科">妇科</option>
                  <option value="心内科">心内科</option>
                  <option value="神经内科">神经内科</option>
                  <option value="检验科">检验科</option>
                  <option value="放射科">放射科</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="draft">草稿</option>
                  <option value="active">活动</option>
                  <option value="completed">完成</option>
                  <option value="cancelled">取消</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  优先级
                </label>
                <select
                  value={formData.priority || 'normal'}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="low">低</option>
                  <option value="normal">正常</option>
                  <option value="high">高</option>
                  <option value="urgent">紧急</option>
                </select>
              </div>
            </div>

            {/* 简要描述 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                简要描述
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="请输入简要描述"
              />
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标签
              </label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="添加标签"
                />
                <button
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  添加
                </button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      <Tag size={12} className="mr-1 text-gray-500" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 病历内容 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                病历内容 <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(value) => handleChange('content', value)}
                placeholder="请输入病历内容..."
                height="300px"
              />
            </div>

            {/* 诊断信息 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                诊断信息
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
                <input
                  type="text"
                  value={newDiagnosis.code}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, code: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="诊断代码 (如: I10)"
                />
                <input
                  type="text"
                  value={newDiagnosis.description}
                  onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="诊断名称"
                />
                <div className="flex space-x-2">
                  <select
                    value={newDiagnosis.type}
                    onChange={(e) => setNewDiagnosis({ ...newDiagnosis, type: e.target.value as 'primary' | 'secondary' })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="primary">主要诊断</option>
                    <option value="secondary">次要诊断</option>
                  </select>
                  <button
                    onClick={handleAddDiagnosis}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    添加
                  </button>
                </div>
              </div>
              {formData.diagnosis && formData.diagnosis.length > 0 && (
                <div className="space-y-2">
                  {formData.diagnosis.map((diag, index) => (
                    <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          diag.type === 'primary' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {diag.type === 'primary' ? '主要诊断' : '次要诊断'}
                        </span>
                        <span className="text-sm font-medium text-gray-800">{diag.description}</span>
                        {diag.code && <span className="text-xs text-gray-500">({diag.code})</span>}
                      </div>
                      <button
                        onClick={() => handleRemoveDiagnosis(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 用药信息 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用药信息
              </label>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-2">
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="药品名称"
                />
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="剂量 (如: 5mg)"
                />
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="频次 (如: 每日一次)"
                />
                <input
                  type="text"
                  value={newMedication.duration}
                  onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="疗程 (如: 7天)"
                />
                <div className="flex space-x-2">
                  <select
                    value={newMedication.route}
                    onChange={(e) => setNewMedication({ ...newMedication, route: e.target.value })}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">给药途径</option>
                    <option value="口服">口服</option>
                    <option value="静脉注射">静脉注射</option>
                    <option value="肌肉注射">肌肉注射</option>
                    <option value="皮下注射">皮下注射</option>
                    <option value="外用">外用</option>
                  </select>
                  <button
                    onClick={handleAddMedication}
                    className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    添加
                  </button>
                </div>
              </div>
              {formData.medications && formData.medications.length > 0 && (
                <div className="space-y-2">
                  {formData.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{med.name}</div>
                        <div className="text-xs text-gray-600">
                          {med.dosage} • {med.frequency} • {med.duration} • {med.route}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMedication(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 随访信息 */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <input
                  type="checkbox"
                  checked={formData.followUp?.required || false}
                  onChange={(e) => handleChange('followUp', { 
                    ...formData.followUp,
                    required: e.target.checked 
                  })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span>需要随访</span>
              </label>

              {formData.followUp?.required && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      随访日期
                    </label>
                    <input
                      type="date"
                      value={formData.followUp?.date || ''}
                      onChange={(e) => handleChange('followUp', { 
                        ...formData.followUp,
                        date: e.target.value 
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      随访说明
                    </label>
                    <input
                      type="text"
                      value={formData.followUp?.instructions || ''}
                      onChange={(e) => handleChange('followUp', { 
                        ...formData.followUp,
                        instructions: e.target.value 
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="随访说明"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 附件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                附件
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">拖放文件到此处或</p>
                  <button className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50">
                    浏览文件
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    支持图片、PDF、文档等格式，单个文件不超过10MB
                  </p>
                </div>
              </div>
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center">
                        {attachment.type === 'image' ? <FileImage size={16} className="text-blue-500 mr-2" /> : <FileText size={16} className="text-gray-500 mr-2" />}
                        <span className="text-sm text-gray-800">{attachment.name}</span>
                        <span className="text-xs text-gray-500 ml-2">
                          ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (formData.attachments) {
                            handleChange('attachments', formData.attachments.filter((_, i) => i !== index));
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 未保存警告 */}
        {showUnsavedWarning && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-yellow-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                未保存的更改
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                您有未保存的更改，确定要离开吗？
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowUnsavedWarning(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  继续编辑
                </button>
                <button
                  onClick={() => {
                    setShowUnsavedWarning(false);
                    onClose();
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  放弃更改
                </button>
                <button
                  onClick={() => {
                    handleSave();
                    setShowUnsavedWarning(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  保存并离开
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordEditor;
