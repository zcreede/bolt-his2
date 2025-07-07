import React from 'react';
import { FileText, Calendar, User, Clock, Star, Eye, Download, Edit, Trash2, Tag, AlertTriangle, CheckCircle } from 'lucide-react';

type RecordType = 'consultation' | 'admission' | 'discharge' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'nursing' | 'progress_note' | 'referral' | 'vaccination' | 'allergy' | 'vital_signs' | 'assessment' | 'plan';
type RecordStatus = 'draft' | 'active' | 'completed' | 'cancelled' | 'amended' | 'archived';
type Priority = 'low' | 'normal' | 'high' | 'urgent';

interface TimelineRecord {
  id: string;
  title: string;
  date: string;
  time: string;
  type: RecordType;
  status: RecordStatus;
  priority: Priority;
  doctor: string;
  description: string;
  department?: string;
  tags?: string[];
  isStarred?: boolean;
  hasAttachments?: boolean;
  attachmentsCount?: number;
}

interface RecordTimelineProps {
  records: TimelineRecord[];
  onRecordClick: (record: TimelineRecord) => void;
  onEdit?: (record: TimelineRecord) => void;
  onDelete?: (record: TimelineRecord) => void;
  onStar?: (record: TimelineRecord) => void;
}

const RecordTimeline: React.FC<RecordTimelineProps> = ({
  records,
  onRecordClick,
  onEdit,
  onDelete,
  onStar
}) => {
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

  // 按日期分组记录
  const recordsByDate = records.reduce((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = [];
    }
    acc[record.date].push(record);
    return acc;
  }, {} as Record<string, TimelineRecord[]>);

  // 按日期排序
  const sortedDates = Object.keys(recordsByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
              <Calendar size={16} className="text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">{date}</h3>
          </div>

          <div className="ml-4 border-l-2 border-gray-200 pl-6 space-y-4">
            {recordsByDate[date].map((record) => (
              <div 
                key={record.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => onRecordClick(record)}
              >
                {/* 时间线连接点 */}
                <div className="absolute w-3 h-3 bg-primary-500 rounded-full -left-[30px] top-6 border-2 border-white"></div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getRecordTypeIcon(record.type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-800">{record.title}</h4>
                        {record.isStarred && <Star size={14} className="text-yellow-500 fill-current" />}
                        {getPriorityIcon(record.priority)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock size={12} className="mr-1" />
                          {record.time}
                        </span>
                        <span className="flex items-center">
                          <User size={12} className="mr-1" />
                          {record.doctor}
                        </span>
                        {record.department && (
                          <span>{record.department}</span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-2">{record.description}</p>
                      
                      <div className="flex items-center space-x-2 mt-2">
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
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    {onStar && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStar(record);
                        }}
                        className={`p-1 rounded hover:bg-gray-100 ${record.isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                      >
                        <Star size={16} className={record.isStarred ? "fill-current" : ""} />
                      </button>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onRecordClick(record);
                      }}
                      className="p-1 text-gray-400 hover:text-primary-600 rounded hover:bg-gray-100"
                    >
                      <Eye size={16} />
                    </button>
                    {record.hasAttachments && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle download action
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded hover:bg-gray-100"
                      >
                        <Download size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(record);
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded hover:bg-gray-100"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(record);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordTimeline;
