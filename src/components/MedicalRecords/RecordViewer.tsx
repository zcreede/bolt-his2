import React, { useState } from 'react';
import { X, Download, Printer as Print, Edit, Trash2, Star, Share2, Clock, User, Calendar, Tag, FileText, FileImage, Eye, ExternalLink } from 'lucide-react';

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

interface RecordViewerProps {
  record: MedicalRecord;
  onClose: () => void;
  onEdit?: (record: MedicalRecord) => void;
  onDelete?: (record: MedicalRecord) => void;
  onStar?: (record: MedicalRecord) => void;
}

const RecordViewer: React.FC<RecordViewerProps> = ({
  record,
  onClose,
  onEdit,
  onDelete,
  onStar
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'attachments' | 'history'>('details');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{record.title}</h2>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">{getRecordTypeName(record.type)}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
                {getStatusName(record.status)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStar && onStar(record)}
              className={`p-2 rounded-lg hover:bg-gray-100 ${record.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              title={record.isStarred ? "取消标星" : "标记为重要"}
            >
              <Star size={20} className={record.isStarred ? "fill-current" : ""} />
            </button>
            <button
              onClick={() => onEdit && onEdit(record)}
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              title="编辑"
            >
              <Edit size={20} />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              title="打印"
            >
              <Print size={20} />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              title="下载"
            >
              <Download size={20} />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              title="分享"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100"
              title="删除"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              title="关闭"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            详细信息
          </button>
          <button
            onClick={() => setActiveTab('attachments')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'attachments'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileImage size={16} className="inline mr-2" />
            附件 {record.attachments?.length ? `(${record.attachments.length})` : ''}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'history'
                ? 'border-b-2 border-primary-500 text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock size={16} className="inline mr-2" />
            历史版本
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* 患者信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">患者信息</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{record.patientName}</div>
                      <div className="text-xs text-gray-500">
                        {record.patientAge}岁 • {record.patientGender} • ID: {record.patientId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 记录信息 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">记录信息</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">创建时间</div>
                      <div className="text-sm text-gray-800 flex items-center">
                        <Calendar size={14} className="mr-1 text-gray-400" />
                        {record.createdDate} {record.createdTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">创建者</div>
                      <div className="text-sm text-gray-800 flex items-center">
                        <User size={14} className="mr-1 text-gray-400" />
                        {record.createdBy}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">最后修改</div>
                      <div className="text-sm text-gray-800 flex items-center">
                        <Clock size={14} className="mr-1 text-gray-400" />
                        {record.lastModified}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">修改者</div>
                      <div className="text-sm text-gray-800 flex items-center">
                        <User size={14} className="mr-1 text-gray-400" />
                        {record.lastModifiedBy}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              {record.tags && record.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {record.tags.map((tag, index) => (
                      <div key={index} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        <Tag size={12} className="mr-1 text-gray-500" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 病历内容 */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">病历内容</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {record.content}
                  </pre>
                </div>
              </div>

              {/* 诊断信息 */}
              {record.diagnosis && record.diagnosis.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">诊断信息</h3>
                  <div className="space-y-2">
                    {record.diagnosis.map((diag, index) => (
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
              {record.medications && record.medications.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">用药信息</h3>
                  <div className="space-y-2">
                    {record.medications.map((med, index) => (
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
              {record.labResults && record.labResults.length > 0 && (
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
                        {record.labResults.map((result, index) => (
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

              {/* 随访信息 */}
              {record.followUp && record.followUp.required && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">随访信息</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar size={16} className="text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">需要随访</span>
                    </div>
                    {record.followUp.date && (
                      <div className="text-sm text-yellow-700">
                        随访日期：{record.followUp.date}
                      </div>
                    )}
                    {record.followUp.instructions && (
                      <div className="text-sm text-yellow-700 mt-1">
                        随访说明：{record.followUp.instructions}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'attachments' && (
            <div className="space-y-4">
              {record.attachments && record.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {record.attachments.map((attachment) => (
                    <div key={attachment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {attachment.type === 'image' && <FileImage size={20} className="text-blue-500" />}
                          {attachment.type === 'pdf' && <FileText size={20} className="text-red-500" />}
                          {attachment.type === 'document' && <FileText size={20} className="text-green-500" />}
                          {attachment.type === 'video' && <FileText size={20} className="text-purple-500" />}
                          <span className="text-sm font-medium text-gray-800">{attachment.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatFileSize(attachment.size)}</span>
                      </div>
                      
                      {attachment.type === 'image' && (
                        <div className="mb-3 bg-gray-100 rounded-lg overflow-hidden">
                          <img 
                            src={attachment.url} 
                            alt={attachment.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{attachment.uploadDate}</span>
                        <div className="flex space-x-2">
                          <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center">
                            <Eye size={14} className="mr-1" />
                            查看
                          </button>
                          <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center">
                            <Download size={14} className="mr-1" />
                            下载
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <FileImage size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">无附件</h3>
                  <p className="text-gray-500">
                    此记录没有附件
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {record.previousVersions && record.previousVersions.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">{record.version}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-800">当前版本</div>
                      <div className="text-xs text-blue-600">
                        {record.lastModified} • {record.lastModifiedBy}
                      </div>
                    </div>
                    <div className="text-xs text-blue-700 px-2 py-1 bg-blue-100 rounded">
                      当前
                    </div>
                  </div>

                  {record.previousVersions.map((versionId, index) => {
                    const versionNumber = record.version - index - 1;
                    return (
                      <div key={versionId} className="flex items-center space-x-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">{versionNumber}</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">历史版本</div>
                          <div className="text-xs text-gray-500">
                            2024-01-{20 - index} • 系统
                          </div>
                        </div>
                        <button className="text-xs text-primary-600 hover:text-primary-700 flex items-center">
                          <Eye size={14} className="mr-1" />
                          查看
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Clock size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">无历史版本</h3>
                  <p className="text-gray-500">
                    此记录没有历史版本
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 删除确认对话框 */}
        {showConfirmDelete && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                确认删除
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                您确定要删除这条病历记录吗？此操作无法撤销。
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowConfirmDelete(false);
                    onDelete && onDelete(record);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordViewer;
