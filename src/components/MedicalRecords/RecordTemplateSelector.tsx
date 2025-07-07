import React, { useState } from 'react';
import { X, FileText, Search, Plus, Edit, Trash2, Copy } from 'lucide-react';

type RecordType = 'consultation' | 'admission' | 'discharge' | 'lab_result' | 'imaging' | 'prescription' | 'procedure' | 'nursing' | 'progress_note' | 'referral' | 'vaccination' | 'allergy' | 'vital_signs' | 'assessment' | 'plan';

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

interface RecordTemplateSelectorProps {
  onClose: () => void;
  onSelectTemplate: (template: RecordTemplate) => void;
  onCreateTemplate: () => void;
  onEditTemplate: (template: RecordTemplate) => void;
}

const RecordTemplateSelector: React.FC<RecordTemplateSelectorProps> = ({
  onClose,
  onSelectTemplate,
  onCreateTemplate,
  onEditTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<RecordType | 'all'>('all');

  // 示例模板数据
  const templates: RecordTemplate[] = [
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
    },
    {
      id: "TPL-003",
      name: "出院小结模板",
      type: "discharge",
      category: "住院",
      template: `
入院日期：
出院日期：
入院诊断：
出院诊断：
入院情况：
诊疗经过：
出院情况：
出院医嘱：
      `,
      fields: [
        { name: "入院日期", type: "date", required: true },
        { name: "出院日期", type: "date", required: true },
        { name: "入院诊断", type: "textarea", required: true },
        { name: "出院诊断", type: "textarea", required: true },
        { name: "入院情况", type: "textarea", required: true },
        { name: "诊疗经过", type: "textarea", required: true },
        { name: "出院情况", type: "textarea", required: true },
        { name: "出院医嘱", type: "textarea", required: true }
      ]
    },
    {
      id: "TPL-004",
      name: "高血压随访模板",
      type: "progress_note",
      category: "慢病管理",
      template: `
血压：
症状：
用药情况：
生活方式：
随访计划：
      `,
      fields: [
        { name: "血压", type: "text", required: true },
        { name: "症状", type: "textarea", required: true },
        { name: "用药情况", type: "textarea", required: true },
        { name: "生活方式", type: "textarea", required: false },
        { name: "随访计划", type: "textarea", required: true }
      ]
    },
    {
      id: "TPL-005",
      name: "糖尿病随访模板",
      type: "progress_note",
      category: "慢病管理",
      template: `
血糖：
症状：
用药情况：
饮食情况：
运动情况：
并发症筛查：
随访计划：
      `,
      fields: [
        { name: "血糖", type: "text", required: true },
        { name: "症状", type: "textarea", required: true },
        { name: "用药情况", type: "textarea", required: true },
        { name: "饮食情况", type: "textarea", required: false },
        { name: "运动情况", type: "textarea", required: false },
        { name: "并发症筛查", type: "textarea", required: true },
        { name: "随访计划", type: "textarea", required: true }
      ]
    }
  ];

  // 获取所有类别
  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  // 获取所有类型
  const types = ['all', ...Array.from(new Set(templates.map(t => t.type)))];

  // 过滤模板
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesType = selectedType === 'all' || template.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

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
          <h2 className="text-xl font-semibold text-gray-800">选择病历模板</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索模板..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">所有类别</option>
              {categories.filter(c => c !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as RecordType | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="all">所有类型</option>
              {types.filter(t => t !== 'all').map(type => (
                <option key={type} value={type}>{getRecordTypeName(type as RecordType)}</option>
              ))}
            </select>
            
            <button
              onClick={onCreateTemplate}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              新建模板
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <FileText size={18} className="text-primary-600" />
                    <h3 className="font-medium text-gray-800">{template.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEditTemplate(template)}
                      className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-primary-100"
                      title="编辑模板"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-primary-600 rounded hover:bg-primary-100"
                      title="复制模板"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      className="p-1 text-gray-500 hover:text-red-600 rounded hover:bg-red-100"
                      title="删除模板"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {template.category}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                    {getRecordTypeName(template.type)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-3 line-clamp-3 bg-gray-50 p-2 rounded border border-gray-200">
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {template.template.trim()}
                  </pre>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    {template.fields.length} 个字段，{template.fields.filter(f => f.required).length} 个必填
                  </div>
                  <button
                    onClick={() => onSelectTemplate(template)}
                    className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded hover:bg-primary-50"
                  >
                    使用模板
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">未找到模板</h3>
              <p className="text-gray-500 mb-4">
                没有找到符合条件的模板
              </p>
              <button 
                onClick={onCreateTemplate}
                className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
              >
                <Plus size={16} className="inline mr-1" />
                创建新模板
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordTemplateSelector;
