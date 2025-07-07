import React from 'react';
import { FileText, Calendar, Download, Star, Eye, Edit, Trash2, User, Tag, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type RecordType = 'consultation' | 'admission' | 'discharge' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'nursing' | 'progress_note' | 'referral' | 'vaccination' | 'allergy' | 'vital_signs' | 'assessment' | 'plan';
type RecordStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'amended' | 'archived';
type Priority = 'low' | 'normal' | 'high' | 'urgent';

interface RecordCardProps {
  record: {
    id: string;
    title: string;
    date: string;
    type: RecordType;
    status: RecordStatus;
    priority: Priority;
    doctor: string;
    description: string;
    patientName?: string;
    patientId?: string;
    department?: string;
    tags?: string[];
    isStarred?: boolean;
    hasAttachments?: boolean;
    attachmentsCount?: number;
  };
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStar?: () => void;
  showPatient?: boolean;
  compact?: boolean;
}

const getRecordTypeIcon = (type: RecordType) => {
  switch (type) {
    case 'consultation':
      return <FileText size={16} className="text-blue-500" />;
    case 'lab_result':
      return <FileText size={16} className="text-purple-500" />;
    case 'prescription':
      return <FileText size={16} className="text-green-500" />;
    case 'imaging':
      return <FileText size={16} className="text-orange-500" />;
    default:
      return <FileText size={16} className="text-gray-500" />;
  }
};

const getRecordTypeName = (type: RecordType) => {
  const types = {
    consultation: '门诊记录',
    admission: '入院记录',
    discharge: '出院记录',
    lab_result: '检验报告',
    imaging: '影像报告',
    prescription: '处方记录',
    procedure: '操作记录',
    nursing: '护理记录',
    progress_note: '病程记录',
    referral: '转诊记录',
    vaccination: '疫苗记录',
    allergy: '过敏记录',
    vital_signs: '生命体征',
    assessment: '评估记录',
    plan: '治疗计划'
  };
  return types[type] || '其他记录';
};

const getStatusColor = (status: RecordStatus) => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'amended':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusName = (status: RecordStatus) => {
  const statuses = {
    draft: '草稿',
    active: '活动',
    completed: '完成',
    cancelled: '取消',
    amended: '修订',
    archived: '归档'
  };
  return statuses[status] || '未知';
};

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'urgent':
      return <AlertTriangle size={14} className="text-red-600" />;
    case 'high':
      return <AlertTriangle size={14} className="text-orange-600" />;
    case 'normal':
      return <CheckCircle size={14} className="text-blue-600" />;
    case 'low':
      return <CheckCircle size={14} className="text-gray-600" />;
    default:
      return null;
  }
};

const RecordCard: React.FC<RecordCardProps> = ({ 
  record, 
  onClick,
  onEdit,
  onDelete,
  onStar,
  showPatient = false,
  compact = false
}) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div 
        className="p-3 bg-white rounded-lg border border-gray-200 mb-2 transition-all hover:shadow-sm cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getRecordTypeIcon(record.type)}
            <h4 className="font-medium text-gray-800 text-sm">{record.title}</h4>
            {record.isStarred && <Star size={14} className="text-yellow-500 fill-current" />}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(record.status)}`}>
              {getStatusName(record.status)}
            </span>
            {getPriorityIcon(record.priority)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar size={12} className="mr-1" />
            {record.date}
          </div>
          <div>{record.doctor}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="p-4 bg-white rounded-lg border border-gray-200 mb-3 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center">
          {getRecordTypeIcon(record.type)}
          <div className="ml-3">
            <h4 className="font-medium text-gray-800">{record.title}</h4>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Calendar size={12} className="mr-1" />
              {record.date}
            </div>
          </div>
        </div>
        
        <div>
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
            {getRecordTypeName(record.type)}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(record.status)}`}>
              {getStatusName(record.status)}
            </span>
            {record.tags && record.tags.length > 0 && (
              <div className="flex space-x-1">
                {record.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
                {record.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    +{record.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {showPatient && record.patientName && (
            <div className="text-xs text-gray-500">
              <User size={12} className="inline mr-1" />
              {record.patientName}
            </div>
          )}
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-500">Dr. {record.doctor}</p>
          
          <div className="flex space-x-2">
            {onStar && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onStar();
                }}
                className={`text-xs ${record.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                <Star size={16} className={record.isStarred ? "fill-current" : ""} />
              </button>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Handle view action
              }}
              className="text-xs text-primary-600 hover:text-primary-700"
            >
              <Eye size={16} />
            </button>
            {onEdit && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                <Edit size={16} />
              </button>
            )}
            {record.hasAttachments && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle download action
                }}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                <Download size={16} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordCard;
