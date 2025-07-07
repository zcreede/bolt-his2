import React from 'react';
import { FileText, Calendar, User, Clock, Star, Eye, Download, Edit, Trash2, Tag, AlertTriangle, CheckCircle, FileImage, Activity, Heart, Brain, Microscope, Camera, Pill, Stethoscope } from 'lucide-react';

type RecordType = 'consultation' | 'admission' | 'discharge' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'nursing' | 'progress_note' | 'referral' | 'vaccination' | 'allergy' | 'vital_signs' | 'assessment' | 'plan';

interface RecordSummaryProps {
  recordsByType: Record<RecordType, Array<{
    id: string;
    title: string;
    date: string;
    description: string;
    isStarred?: boolean;
  }>>;
  onRecordClick: (recordId: string, recordType: RecordType) => void;
}

const RecordSummary: React.FC<RecordSummaryProps> = ({
  recordsByType,
  onRecordClick
}) => {
  const getRecordTypeIcon = (type: RecordType) => {
    switch (type) {
      case 'consultation':
        return <Stethoscope size={20} className="text-blue-500" />;
      case 'admission':
        return <User size={20} className="text-green-500" />;
      case 'discharge':
        return <User size={20} className="text-orange-500" />;
      case 'lab_result':
        return <Microscope size={20} className="text-purple-500" />;
      case 'imaging':
        return <Camera size={20} className="text-indigo-500" />;
      case 'prescription':
        return <Pill size={20} className="text-green-500" />;
      case 'procedure':
        return <Activity size={20} className="text-red-500" />;
      case 'nursing':
        return <Heart size={20} className="text-pink-500" />;
      case 'progress_note':
        return <FileText size={20} className="text-gray-500" />;
      case 'assessment':
        return <Brain size={20} className="text-purple-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
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

  const getRecordTypeColor = (type: RecordType) => {
    const colors = {
      consultation: 'bg-blue-50 border-blue-200',
      admission: 'bg-green-50 border-green-200',
      discharge: 'bg-orange-50 border-orange-200',
      lab_result: 'bg-purple-50 border-purple-200',
      imaging: 'bg-indigo-50 border-indigo-200',
      prescription: 'bg-green-50 border-green-200',
      procedure: 'bg-red-50 border-red-200',
      nursing: 'bg-pink-50 border-pink-200',
      progress_note: 'bg-gray-50 border-gray-200',
      referral: 'bg-yellow-50 border-yellow-200',
      vaccination: 'bg-teal-50 border-teal-200',
      allergy: 'bg-red-50 border-red-200',
      vital_signs: 'bg-blue-50 border-blue-200',
      assessment: 'bg-purple-50 border-purple-200',
      plan: 'bg-green-50 border-green-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Object.entries(recordsByType).map(([type, records]) => (
        <div 
          key={type}
          className={`border rounded-lg overflow-hidden ${getRecordTypeColor(type as RecordType)}`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getRecordTypeIcon(type as RecordType)}
                <h3 className="font-medium text-gray-800">{getRecordTypeName(type as RecordType)}</h3>
              </div>
              <span className="text-sm text-gray-500">({records.length})</span>
            </div>
          </div>
          
          <div className="p-4">
            {records.length > 0 ? (
              <div className="space-y-3">
                {records.map((record) => (
                  <div 
                    key={record.id}
                    onClick={() => onRecordClick(record.id, type as RecordType)}
                    className="flex items-start space-x-2 p-2 hover:bg-white rounded cursor-pointer"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FileText size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1">
                        <h4 className="text-sm font-medium text-gray-800 truncate">{record.title}</h4>
                        {record.isStarred && <Star size={12} className="text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{record.date}</p>
                    </div>
                  </div>
                ))}
                
                {records.length > 5 && (
                  <div className="text-center pt-2 border-t border-gray-200">
                    <button className="text-xs text-primary-600 hover:text-primary-700">
                      查看全部 {records.length} 条记录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">暂无记录</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecordSummary;
