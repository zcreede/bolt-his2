import React, { useState, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import { 
  Plus, X, AlertCircle, CheckCircle, Clock, Search, Star, Trash2, Edit3, Save, ArrowLeft,
  FileText, Calendar, User, Stethoscope, Activity, Target, BookOpen, History,
  ChevronDown, ChevronRight, Filter, SortAsc, Eye, Copy, Download, Upload
} from 'lucide-react';

interface Diagnosis {
  id: string;
  type: 'primary' | 'secondary' | 'differential';
  code?: string;
  description: string;
  certainty: 'confirmed' | 'suspected' | 'rule_out';
  reasoning?: string;
  differentialNotes?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  onset?: 'acute' | 'chronic' | 'subacute';
  status?: 'active' | 'resolved' | 'improving' | 'worsening';
  createdAt?: string;
  createdBy?: string;
  lastModified?: string;
  modifiedBy?: string;
  order?: number; // 诊断优先级
  relatedFindings?: string[]; // 相关检查发现
  treatmentPlan?: string; // 治疗计划
  followUpRequired?: boolean; // 是否需要随访
  followUpDate?: string; // 随访日期
  complications?: string[]; // 并发症
  prognosis?: 'excellent' | 'good' | 'fair' | 'poor' | 'guarded'; // 预后
}

interface DiagnosisTemplate {
  id: string;
  name: string;
  category: string;
  diagnoses: Omit<Diagnosis, 'id' | 'createdAt' | 'createdBy'>[];
  description: string;
  specialty: string;
}

interface DiagnosisTabProps {
  data: {
    diagnoses: Diagnosis[];
    clinicalReasoning: string;
    differentialDiagnosis: string;
  };
  onChange: (field: string, value: any) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
}

const DiagnosisTab: React.FC<DiagnosisTabProps> = ({ data, onChange, onAttachmentUpload }) => {
  const [newDiagnosis, setNewDiagnosis] = useState<Partial<Diagnosis>>({
    type: 'primary',
    certainty: 'confirmed',
    description: '',
    severity: 'moderate',
    onset: 'acute',
    status: 'active'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'diagnoses' | 'reasoning' | 'differential' | 'templates' | 'history'>('diagnoses');
  const [selectedDiagnosisForReasoning, setSelectedDiagnosisForReasoning] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['primary']);
  const [sortBy, setSortBy] = useState<'order' | 'date' | 'type' | 'severity'>('order');
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'resolved' | 'pending'>('all');
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const [diagnosisHistory, setDiagnosisHistory] = useState<Diagnosis[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // 模拟ICD诊断数据库 - 扩展版
  const icdDatabase = [
    { code: 'I10', description: '原发性高血压', category: '循环系统疾病', severity: 'moderate' },
    { code: 'E11', description: '2型糖尿病', category: '内分泌疾病', severity: 'moderate' },
    { code: 'J44', description: '慢性阻塞性肺疾病', category: '呼吸系统疾病', severity: 'moderate' },
    { code: 'N18', description: '慢性肾脏病', category: '泌尿系统疾病', severity: 'severe' },
    { code: 'I25', description: '慢性缺血性心脏病', category: '循环系统疾病', severity: 'moderate' },
    { code: 'K29', description: '胃炎和十二指肠炎', category: '消化系统疾病', severity: 'mild' },
    { code: 'M79', description: '其他软组织疾患', category: '肌肉骨骼疾病', severity: 'mild' },
    { code: 'R50', description: '发热，未特指', category: '症状体征', severity: 'mild' },
    { code: 'R51', description: '头痛', category: '症状体征', severity: 'mild' },
    { code: 'R06', description: '呼吸异常', category: '症状体征', severity: 'moderate' },
    { code: 'I21', description: '急性心肌梗死', category: '循环系统疾病', severity: 'severe' },
    { code: 'J18', description: '肺炎，未特指病原体', category: '呼吸系统疾病', severity: 'moderate' },
    { code: 'G93.1', description: '缺氧性脑损伤', category: '神经系统疾病', severity: 'severe' },
    { code: 'F32', description: '抑郁发作', category: '精神疾病', severity: 'moderate' }
  ];

  // 诊断模板
  const diagnosisTemplates: DiagnosisTemplate[] = [
    {
      id: 'hypertension-diabetes',
      name: '高血压合并糖尿病',
      category: '内分泌代谢',
      specialty: '内科',
      description: '常见的代谢综合征组合',
      diagnoses: [
        {
          type: 'primary',
          code: 'I10',
          description: '原发性高血压',
          certainty: 'confirmed',
          severity: 'moderate',
          onset: 'chronic',
          status: 'active'
        },
        {
          type: 'secondary',
          code: 'E11',
          description: '2型糖尿病',
          certainty: 'confirmed',
          severity: 'moderate',
          onset: 'chronic',
          status: 'active'
        }
      ]
    },
    {
      id: 'acute-coronary',
      name: '急性冠脉综合征',
      category: '心血管急症',
      specialty: '心内科',
      description: '急性心血管事件诊断组合',
      diagnoses: [
        {
          type: 'primary',
          code: 'I21',
          description: '急性心肌梗死',
          certainty: 'suspected',
          severity: 'severe',
          onset: 'acute',
          status: 'active'
        }
      ]
    }
  ];

  const filteredICD = icdDatabase.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 初始化诊断历史
  useEffect(() => {
    // 模拟从API获取诊断历史
    const mockHistory: Diagnosis[] = [
      {
        id: 'hist-1',
        type: 'primary',
        code: 'I10',
        description: '原发性高血压',
        certainty: 'confirmed',
        severity: 'moderate',
        onset: 'chronic',
        status: 'resolved',
        createdAt: '2024-01-15',
        createdBy: '张医生',
        lastModified: '2024-01-20',
        modifiedBy: '李医生'
      }
    ];
    setDiagnosisHistory(mockHistory);
  }, []);

  const addDiagnosis = () => {
    if (!newDiagnosis.description?.trim()) return;
    
    const diagnosis: Diagnosis = {
      id: `diag-${Date.now()}`,
      type: newDiagnosis.type as Diagnosis['type'],
      description: newDiagnosis.description,
      certainty: newDiagnosis.certainty as Diagnosis['certainty'],
      code: newDiagnosis.code,
      severity: newDiagnosis.severity,
      onset: newDiagnosis.onset,
      status: newDiagnosis.status || 'active',
      reasoning: '',
      differentialNotes: '',
      order: data.diagnoses.length + 1,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '当前医生', // 实际应该从用户信息获取
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: '当前医生',
      relatedFindings: [],
      complications: [],
      followUpRequired: false
    };

    onChange('diagnoses', [...data.diagnoses, diagnosis]);
    setNewDiagnosis({ 
      type: 'primary', 
      certainty: 'confirmed', 
      description: '',
      severity: 'moderate',
      onset: 'acute',
      status: 'active'
    });
    setSearchTerm('');
  };

  const removeDiagnosis = (id: string) => {
    onChange('diagnoses', data.diagnoses.filter(d => d.id !== id));
    if (editingId === id) setEditingId(null);
    if (selectedDiagnosisForReasoning === id) setSelectedDiagnosisForReasoning(null);
  };

  const updateDiagnosis = (id: string, field: keyof Diagnosis, value: any) => {
    onChange('diagnoses', data.diagnoses.map(d => 
      d.id === id ? { 
        ...d, 
        [field]: value,
        lastModified: new Date().toISOString().split('T')[0],
        modifiedBy: '当前医生'
      } : d
    ));
  };

  const duplicateDiagnosis = (diagnosis: Diagnosis) => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: `diag-${Date.now()}`,
      description: `${diagnosis.description} (副本)`,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '当前医生',
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: '当前医生',
      order: data.diagnoses.length + 1
    };
    onChange('diagnoses', [...data.diagnoses, newDiagnosis]);
  };

  const applyTemplate = (template: DiagnosisTemplate) => {
    const newDiagnoses = template.diagnoses.map((diagTemplate, index) => ({
      ...diagTemplate,
      id: `diag-${Date.now()}-${index}`,
      order: data.diagnoses.length + index + 1,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: '当前医生',
      lastModified: new Date().toISOString().split('T')[0],
      modifiedBy: '当前医生',
      reasoning: '',
      differentialNotes: '',
      relatedFindings: [],
      complications: [],
      followUpRequired: false
    }));
    
    onChange('diagnoses', [...data.diagnoses, ...newDiagnoses]);
    setSelectedTemplate('');
  };

  const startEditDiagnosis = (diagnosis: Diagnosis) => {
    setEditingId(diagnosis.id);
    setNewDiagnosis({
      type: diagnosis.type,
      certainty: diagnosis.certainty,
      description: diagnosis.description,
      code: diagnosis.code,
      severity: diagnosis.severity,
      onset: diagnosis.onset,
      status: diagnosis.status
    });
  };

  const saveEditDiagnosis = () => {
    if (!editingId || !newDiagnosis.description?.trim()) return;
    
    Object.entries(newDiagnosis).forEach(([field, value]) => {
      if (value !== undefined) {
        updateDiagnosis(editingId, field as keyof Diagnosis, value);
      }
    });
    
    setEditingId(null);
    setNewDiagnosis({ 
      type: 'primary', 
      certainty: 'confirmed', 
      description: '',
      severity: 'moderate',
      onset: 'acute',
      status: 'active'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewDiagnosis({ 
      type: 'primary', 
      certainty: 'confirmed', 
      description: '',
      severity: 'moderate',
      onset: 'acute',
      status: 'active'
    });
  };

  const selectICD = (item: any) => {
    setNewDiagnosis({
      ...newDiagnosis,
      code: item.code,
      description: item.description,
      severity: item.severity as Diagnosis['severity']
    });
    setSearchTerm('');
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  // 获取样式函数
  const getTypeColor = (type: Diagnosis['type']) => {
    switch (type) {
      case 'primary': return 'bg-red-100 text-red-800 border-red-200';
      case 'secondary': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'differential': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityColor = (severity?: Diagnosis['severity']) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status?: Diagnosis['status']) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'improving': return 'bg-blue-100 text-blue-800';
      case 'worsening': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCertaintyIcon = (certainty: Diagnosis['certainty']) => {
    switch (certainty) {
      case 'confirmed': return <CheckCircle size={16} className="text-green-600" />;
      case 'suspected': return <Clock size={16} className="text-yellow-600" />;
      case 'rule_out': return <X size={16} className="text-red-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  // 排序和筛选诊断
  const sortedAndFilteredDiagnoses = data.diagnoses
    .filter(d => {
      if (filterBy === 'all') return true;
      if (filterBy === 'active') return d.status === 'active';
      if (filterBy === 'resolved') return d.status === 'resolved';
      if (filterBy === 'pending') return !d.reasoning;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'order': return (a.order || 0) - (b.order || 0);
        case 'date': return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'type': return a.type.localeCompare(b.type);
        case 'severity': 
          const severityOrder = { mild: 1, moderate: 2, severe: 3 };
          return (severityOrder[b.severity || 'moderate'] || 2) - (severityOrder[a.severity || 'moderate'] || 2);
        default: return 0;
      }
    });

  // 按类型分组诊断
  const groupedDiagnoses = {
    primary: sortedAndFilteredDiagnoses.filter(d => d.type === 'primary'),
    secondary: sortedAndFilteredDiagnoses.filter(d => d.type === 'secondary'),
    differential: sortedAndFilteredDiagnoses.filter(d => d.type === 'differential')
  };

  const selectedDiagnosis = selectedDiagnosisForReasoning 
    ? data.diagnoses.find(d => d.id === selectedDiagnosisForReasoning)
    : null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 顶部导航标签 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex space-x-1">
          <button
            onClick={() => {
              setActiveSection('diagnoses');
              setSelectedDiagnosisForReasoning(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'diagnoses'
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <AlertCircle size={16} className="inline mr-2" />
            临床诊断
            {data.diagnoses.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {data.diagnoses.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('reasoning')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'reasoning'
                ? 'bg-green-100 text-green-700 border border-green-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <CheckCircle size={16} className="inline mr-2" />
            诊断依据
            {selectedDiagnosis && (
              <span className="ml-2 text-xs text-green-600">
                ({selectedDiagnosis.description.substring(0, 10)}...)
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSection('differential')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'differential'
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Target size={16} className="inline mr-2" />
            鉴别诊断
          </button>
          <button
            onClick={() => setActiveSection('templates')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'templates'
                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <BookOpen size={16} className="inline mr-2" />
            诊断模板
          </button>
          <button
            onClick={() => setActiveSection('history')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeSection === 'history'
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <History size={16} className="inline mr-2" />
            诊断历史
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        {activeSection === 'diagnoses' && (
          <div className="h-full flex">
            {/* 左侧：诊断列表 */}
            <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">诊断列表</h3>
                  <div className="flex items-center space-x-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="order">按优先级</option>
                      <option value="date">按时间</option>
                      <option value="type">按类型</option>
                      <option value="severity">按严重程度</option>
                    </select>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="all">全部</option>
                      <option value="active">活动</option>
                      <option value="resolved">已解决</option>
                      <option value="pending">待完善</option>
                    </select>
                  </div>
                </div>
                
                {/* 诊断统计 */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{groupedDiagnoses.primary.length}</div>
                    <div className="text-xs text-red-600">主要诊断</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{groupedDiagnoses.secondary.length}</div>
                    <div className="text-xs text-blue-600">次要诊断</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{groupedDiagnoses.differential.length}</div>
                    <div className="text-xs text-yellow-600">鉴别诊断</div>
                  </div>
                </div>
              </div>

              {/* 诊断列表 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {Object.entries(groupedDiagnoses).map(([type, diagnoses]) => (
                  <div key={type}>
                    {diagnoses.length > 0 && (
                      <>
                        <div 
                          className="flex items-center justify-between cursor-pointer py-2"
                          onClick={() => toggleGroup(type)}
                        >
                          <h4 className="text-sm font-medium text-gray-700 flex items-center">
                            {expandedGroups.includes(type) ? 
                              <ChevronDown size={16} className="mr-1" /> : 
                              <ChevronRight size={16} className="mr-1" />
                            }
                            {type === 'primary' ? '主要诊断' : 
                             type === 'secondary' ? '次要诊断' : '鉴别诊断'}
                            <span className="ml-2 text-xs text-gray-500">({diagnoses.length})</span>
                          </h4>
                        </div>
                        
                        {expandedGroups.includes(type) && diagnoses.map((diagnosis, index) => (
                          <div 
                            key={diagnosis.id} 
                            className={`group border rounded-lg p-3 hover:shadow-sm transition-all cursor-pointer ${
                              selectedDiagnosisForReasoning === diagnosis.id 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-gray-50 border-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedDiagnosisForReasoning(diagnosis.id);
                              setActiveSection('reasoning');
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                    {diagnosis.order || index + 1}
                                  </span>
                                  <div className="flex items-center space-x-1">
                                    {getCertaintyIcon(diagnosis.certainty)}
                                  </div>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(diagnosis.severity)}`}>
                                    {diagnosis.severity === 'mild' ? '轻度' : 
                                     diagnosis.severity === 'moderate' ? '中度' : '重度'}
                                  </span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(diagnosis.status)}`}>
                                    {diagnosis.status === 'active' ? '活动' : 
                                     diagnosis.status === 'resolved' ? '已解决' : 
                                     diagnosis.status === 'improving' ? '好转' : '恶化'}
                                  </span>
                                </div>
                                
                                <div className="text-sm font-medium text-gray-800 mb-1">
                                  {diagnosis.description}
                                </div>
                                
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                                  {diagnosis.code && (
                                    <span>ICD: {diagnosis.code}</span>
                                  )}
                                  {diagnosis.onset && (
                                    <span>起病: {diagnosis.onset === 'acute' ? '急性' : 
                                                diagnosis.onset === 'chronic' ? '慢性' : '亚急性'}</span>
                                  )}
                                  {diagnosis.createdAt && (
                                    <span>创建: {diagnosis.createdAt}</span>
                                  )}
                                </div>
                                
                                {/* 显示诊断完成状态 */}
                                <div className="flex items-center space-x-3 text-xs">
                                  {diagnosis.reasoning && (
                                    <span className="text-green-600 flex items-center">
                                      <CheckCircle size={12} className="mr-1" />
                                      有诊断依据
                                    </span>
                                  )}
                                  {!diagnosis.reasoning && (
                                    <span className="text-orange-600 flex items-center">
                                      <Clock size={12} className="mr-1" />
                                      待完善依据
                                    </span>
                                  )}
                                  {diagnosis.followUpRequired && (
                                    <span className="text-blue-600 flex items-center">
                                      <Calendar size={12} className="mr-1" />
                                      需随访
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    duplicateDiagnosis(diagnosis);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                                  title="复制"
                                >
                                  <Copy size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditDiagnosis(diagnosis);
                                  }}
                                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded"
                                  title="编辑"
                                >
                                  <Edit3 size={14} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeDiagnosis(diagnosis.id);
                                  }}
                                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                  title="删除"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ))}

                {data.diagnoses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>暂无诊断记录</p>
                    <p className="text-sm">请在右侧添加诊断</p>
                  </div>
                )}
              </div>
            </div>

            {/* 右侧：添加/编辑诊断 */}
            <div className="w-1/2 bg-white flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {editingId ? '编辑诊断' : '添加新诊断'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowAdvancedFields(!showAdvancedFields)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {showAdvancedFields ? '简化模式' : '高级模式'}
                    </button>
                    {editingId && (
                      <button
                        onClick={cancelEdit}
                        className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                      >
                        <ArrowLeft size={16} className="mr-1" />
                        返回
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        诊断类型 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newDiagnosis.type}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, type: e.target.value as Diagnosis['type'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="primary">主要诊断</option>
                        <option value="secondary">次要诊断</option>
                        <option value="differential">鉴别诊断</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        确定性 <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newDiagnosis.certainty}
                        onChange={(e) => setNewDiagnosis({ ...newDiagnosis, certainty: e.target.value as Diagnosis['certainty'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="confirmed">确诊</option>
                        <option value="suspected">疑似</option>
                        <option value="rule_out">排除</option>
                      </select>
                    </div>
                  </div>

                  {/* 高级字段 */}
                  {showAdvancedFields && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          严重程度
                        </label>
                        <select
                          value={newDiagnosis.severity}
                          onChange={(e) => setNewDiagnosis({ ...newDiagnosis, severity: e.target.value as Diagnosis['severity'] })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="mild">轻度</option>
                          <option value="moderate">中度</option>
                          <option value="severe">重度</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          起病方式
                        </label>
                        <select
                          value={newDiagnosis.onset}
                          onChange={(e) => setNewDiagnosis({ ...newDiagnosis, onset: e.target.value as Diagnosis['onset'] })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="acute">急性</option>
                          <option value="subacute">亚急性</option>
                          <option value="chronic">慢性</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          当前状态
                        </label>
                        <select
                          value={newDiagnosis.status}
                          onChange={(e) => setNewDiagnosis({ ...newDiagnosis, status: e.target.value as Diagnosis['status'] })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="active">活动</option>
                          <option value="improving">好转</option>
                          <option value="worsening">恶化</option>
                          <option value="resolved">已解决</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* ICD搜索 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ICD诊断搜索
                    </label>
                    <div className="relative">
                      <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="搜索ICD诊断..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    {searchTerm && filteredICD.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg bg-white shadow-sm">
                        {filteredICD.map((item) => (
                          <button
                            key={item.code}
                            onClick={() => selectICD(item)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900">{item.description}</div>
                                <div className="text-xs text-gray-500">{item.category}</div>
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{item.code}</span>
                                <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(item.severity as Diagnosis['severity'])}`}>
                                  {item.severity === 'mild' ? '轻度' : 
                                   item.severity === 'moderate' ? '中度' : '重度'}
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 诊断描述 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      诊断描述 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newDiagnosis.description || ''}
                      onChange={(e) => setNewDiagnosis({ ...newDiagnosis, description: e.target.value })}
                      placeholder="请输入详细的诊断描述..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* ICD编码显示 */}
                  {newDiagnosis.code && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-blue-800">ICD编码：</span>
                          <span className="text-sm text-blue-700">{newDiagnosis.code}</span>
                        </div>
                        <button
                          onClick={() => setNewDiagnosis({ ...newDiagnosis, code: undefined })}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="space-y-2">
                    {editingId ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={saveEditDiagnosis}
                          disabled={!newDiagnosis.description?.trim()}
                          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                            newDiagnosis.description?.trim()
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Save size={16} className="mr-2" />
                          保存修改
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={addDiagnosis}
                        disabled={!newDiagnosis.description?.trim()}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                          newDiagnosis.description?.trim()
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus size={16} className="mr-2" />
                        添加诊断
                      </button>
                    )}
                  </div>

                  {/* 快速诊断模板 */}
                  {!editingId && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">常用诊断模板</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { code: 'I10', description: '原发性高血压', type: 'primary', severity: 'moderate' },
                          { code: 'E11', description: '2型糖尿病', type: 'primary', severity: 'moderate' },
                          { code: 'J44', description: '慢性阻塞性肺疾病', type: 'primary', severity: 'moderate' }
                        ].map((template) => (
                          <button
                            key={template.code}
                            onClick={() => setNewDiagnosis({
                              type: template.type as Diagnosis['type'],
                              certainty: 'confirmed',
                              description: template.description,
                              code: template.code,
                              severity: template.severity as Diagnosis['severity'],
                              onset: 'chronic',
                              status: 'active'
                            })}
                            className="text-left p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="text-sm font-medium text-gray-800">{template.description}</div>
                            <div className="text-xs text-gray-500">{template.code}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 诊断模板页面 */}
        {activeSection === 'templates' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">诊断模板</h3>
                <p className="text-sm text-gray-600">选择预设的诊断组合，快速添加常见疾病诊断</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {diagnosisTemplates.map((template) => (
                  <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-800">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{template.category}</span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{template.specialty}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {template.diagnoses.map((diag, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded ${getTypeColor(diag.type)}`}>
                              {diag.type === 'primary' ? '主要' : '次要'}
                            </span>
                            <span className="font-medium">{diag.description}</span>
                            {diag.code && <span className="text-gray-500">({diag.code})</span>}
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => applyTemplate(template)}
                      className="w-full py-2 px-4 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      应用模板
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 诊断历史页面 */}
        {activeSection === 'history' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">诊断历史</h3>
                <p className="text-sm text-gray-600">查看患者的历史诊断记录</p>
              </div>

              <div className="space-y-4">
                {diagnosisHistory.map((diagnosis) => (
                  <div key={diagnosis.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(diagnosis.type)}`}>
                            {diagnosis.type === 'primary' ? '主要诊断' : 
                             diagnosis.type === 'secondary' ? '次要诊断' : '鉴别诊断'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(diagnosis.status)}`}>
                            {diagnosis.status === 'resolved' ? '已解决' : '活动'}
                          </span>
                          {diagnosis.severity && (
                            <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(diagnosis.severity)}`}>
                              {diagnosis.severity === 'mild' ? '轻度' : 
                               diagnosis.severity === 'moderate' ? '中度' : '重度'}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-800 mb-1">{diagnosis.description}</h4>
                        {diagnosis.code && (
                          <p className="text-sm text-gray-600 mb-2">ICD编码: {diagnosis.code}</p>
                        )}
                        
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>创建时间: {diagnosis.createdAt} by {diagnosis.createdBy}</div>
                          {diagnosis.lastModified && (
                            <div>最后修改: {diagnosis.lastModified} by {diagnosis.modifiedBy}</div>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          const newDiag = { ...diagnosis, id: `diag-${Date.now()}` };
                          onChange('diagnoses', [...data.diagnoses, newDiag]);
                        }}
                        className="ml-4 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded hover:bg-blue-50"
                      >
                        重新应用
                      </button>
                    </div>
                  </div>
                ))}

                {diagnosisHistory.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <History size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>暂无历史诊断记录</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 其他现有的页面保持不变 */}
        {activeSection === 'reasoning' && (
          <div className="h-full flex flex-col">
            {/* 诊断选择器 */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">诊断依据</h3>
                  <p className="text-sm text-gray-600">为每个诊断提供详细的依据和理由</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">选择诊断：</span>
                  <select
                    value={selectedDiagnosisForReasoning || ''}
                    onChange={(e) => setSelectedDiagnosisForReasoning(e.target.value || null)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">请选择诊断</option>
                    {data.diagnoses.map((diagnosis) => (
                      <option key={diagnosis.id} value={diagnosis.id}>
                        {diagnosis.description} ({diagnosis.type === 'primary' ? '主要' : 
                                                 diagnosis.type === 'secondary' ? '次要' : '鉴别'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {selectedDiagnosis ? (
                <div className="max-w-4xl mx-auto">
                  {/* 选中诊断信息 */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-800">{selectedDiagnosis.description}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(selectedDiagnosis.type)}`}>
                            {selectedDiagnosis.type === 'primary' ? '主要诊断' : 
                             selectedDiagnosis.type === 'secondary' ? '次要诊断' : '鉴别诊断'}
                          </span>
                          <div className="flex items-center space-x-1">
                            {getCertaintyIcon(selectedDiagnosis.certainty)}
                            <span className="text-xs text-blue-600">
                              {selectedDiagnosis.certainty === 'confirmed' ? '确诊' : 
                               selectedDiagnosis.certainty === 'suspected' ? '疑似' : '排除'}
                            </span>
                          </div>
                          {selectedDiagnosis.code && (
                            <span className="text-xs text-blue-600">ICD: {selectedDiagnosis.code}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 诊断依据编辑器 */}
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 px-6 py-4 border-b border-green-200">
                      <div className="flex items-center">
                        <CheckCircle size={20} className="text-green-600 mr-3" />
                        <h3 className="text-lg font-semibold text-green-800">
                          {selectedDiagnosis.description} - 诊断依据
                        </h3>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <RichTextEditor
                        value={selectedDiagnosis.reasoning || ''}
                        onChange={(value) => updateDiagnosis(selectedDiagnosis.id, 'reasoning', value)}
                        placeholder={`请详细说明"${selectedDiagnosis.description}"的诊断依据：&#10;&#10;• 主要症状和体征&#10;• 实验室检查结果&#10;• 影像学检查发现&#10;• 其他支持诊断的证据&#10;&#10;建议按照以下结构组织内容：&#10;1. 临床表现支持&#10;2. 辅助检查证据&#10;3. 排除其他疾病的依据&#10;4. 综合分析结论`}
                        height="400px"
                        onAttachmentUpload={onAttachmentUpload}
                      />
                    </div>
                  </div>

                  {/* 通用诊断依据 */}
                  <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <CheckCircle size={20} className="text-gray-600 mr-3" />
                        <h3 className="text-lg font-semibold text-gray-800">通用诊断依据</h3>
                        <span className="ml-3 text-sm text-gray-600">适用于所有诊断的共同依据</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <RichTextEditor
                        value={data.clinicalReasoning}
                        onChange={(value) => onChange('clinicalReasoning', value)}
                        placeholder="请记录适用于所有诊断的通用依据：&#10;• 患者基本情况&#10;• 病史特点&#10;• 总体临床表现&#10;• 综合分析思路"
                        height="300px"
                        onAttachmentUpload={onAttachmentUpload}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <CheckCircle size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">请先选择一个诊断</p>
                    <p className="text-sm">为选中的诊断添加具体的诊断依据</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'differential' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-6 py-4 border-b border-yellow-200">
                  <div className="flex items-center">
                    <AlertCircle size={20} className="text-yellow-600 mr-3" />
                    <h3 className="text-lg font-semibold text-yellow-800">鉴别诊断</h3>
                    <span className="ml-3 text-sm text-yellow-600">列出需要鉴别的疾病及鉴别要点</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <RichTextEditor
                    value={data.differentialDiagnosis}
                    onChange={(value) => onChange('differentialDiagnosis', value)}
                    placeholder="请列出需要鉴别的疾病：&#10;&#10;• 相似疾病的临床表现对比&#10;• 关键鉴别点&#10;• 排除依据&#10;&#10;建议格式：&#10;1. 疾病名称&#10;   - 相似点：...&#10;   - 鉴别点：...&#10;   - 排除依据：...&#10;&#10;2. 疾病名称&#10;   - 相似点：...&#10;   - 鉴别点：...&#10;   - 排除依据：..."
                    height="500px"
                    onAttachmentUpload={onAttachmentUpload}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>诊断总数: {data.diagnoses.length}</span>
            <span>主要诊断: {groupedDiagnoses.primary.length}</span>
            <span>次要诊断: {groupedDiagnoses.secondary.length}</span>
            <span>鉴别诊断: {groupedDiagnoses.differential.length}</span>
            <span>已完善依据: {data.diagnoses.filter(d => d.reasoning).length}</span>
            <span>活动诊断: {data.diagnoses.filter(d => d.status === 'active').length}</span>
          </div>
          <div className="flex items-center space-x-2">
            {data.diagnoses.length === 0 && (
              <span className="text-red-500 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                请至少添加一个主要诊断
              </span>
            )}
            {data.diagnoses.length > 0 && data.diagnoses.every(d => d.reasoning) && (
              <span className="text-green-500 flex items-center">
                <CheckCircle size={16} className="mr-1" />
                诊断信息完整
              </span>
            )}
            {data.diagnoses.length > 0 && !data.diagnoses.every(d => d.reasoning) && (
              <span className="text-orange-500 flex items-center">
                <Clock size={16} className="mr-1" />
                部分诊断缺少依据
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosisTab;
