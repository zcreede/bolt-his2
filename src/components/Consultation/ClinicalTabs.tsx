import React from 'react';
import { 
  FileText, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface ClinicalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  hasUnsavedChanges?: boolean;
}

const ClinicalTabs: React.FC<ClinicalTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  hasUnsavedChanges = false 
}) => {
  const tabs = [
    {
      id: 'history',
      label: '病史采集',
      icon: <FileText size={14} />,
      description: '现病史、既往史'
    },
    {
      id: 'examination',
      label: '体格检查',
      icon: <Stethoscope size={14} />,
      description: '生命体征、体检'
    },
    {
      id: 'diagnosis',
      label: '诊断',
      icon: <AlertCircle size={14} />,
      description: '临床诊断、鉴别'
    },
    {
      id: 'orders',
      label: '医嘱',
      icon: <Pill size={14} />,
      description: '用药、检查'
    },
    {
      id: 'investigations',
      label: '检查检验',
      icon: <FlaskConical size={14} />,
      description: '化验、影像'
    },
    {
      id: 'followup',
      label: '随访计划',
      icon: <Calendar size={14} />,
      description: '复诊、指导'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 bg-primary-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              {tab.icon}
              <div className="text-left">
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </div>
              {hasUnsavedChanges && activeTab === tab.id && (
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClinicalTabs;
