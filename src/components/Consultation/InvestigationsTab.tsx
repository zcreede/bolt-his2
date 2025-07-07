import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  FlaskConical, 
  Activity, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  FileText,
  Image as ImageIcon,
  Stethoscope,
  Heart,
  Brain,
  Zap,
  Microscope,
  Camera,
  Scan,
  Target,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';

type InvestigationType = 'lab' | 'imaging' | 'cardiology' | 'endoscopy' | 'pathology' | 'function';
type InvestigationStatus = 'ordered' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'reported';
type Priority = 'routine' | 'urgent' | 'stat' | 'asap';
type ResultStatus = 'normal' | 'abnormal' | 'critical' | 'pending';

interface Investigation {
  id: string;
  type: InvestigationType;
  category: string;
  name: string;
  code?: string;
  priority: Priority;
  status: InvestigationStatus;
  orderDate: string;
  orderTime: string;
  scheduledDate?: string;
  scheduledTime?: string;
  completedDate?: string;
  completedTime?: string;
  reportDate?: string;
  reportTime?: string;
  orderedBy: string;
  department: string;
  instructions?: string;
  clinicalInfo?: string;
  results?: {
    status: ResultStatus;
    summary: string;
    details: string;
    values: Array<{
      parameter: string;
      value: string;
      unit: string;
      referenceRange: string;
      status: 'normal' | 'high' | 'low' | 'critical';
    }>;
    attachments: Array<{
      id: string;
      name: string;
      type: 'image' | 'pdf' | 'document';
      url: string;
      uploadDate: string;
    }>;
    reportedBy?: string;
    verifiedBy?: string;
  };
  cost?: number;
  insurance?: {
    covered: boolean;
    copay?: number;
    preauth?: string;
  };
}

interface InvestigationTemplate {
  id: string;
  name: string;
  category: string;
  investigations: Array<{
    type: InvestigationType;
    name: string;
    code?: string;
  }>;
}

interface InvestigationsTabProps {
  data: {
    investigations: Investigation[];
    templates: InvestigationTemplate[];
  };
  onChange: (field: string, value: any) => void;
  patientInfo?: {
    age: number;
    gender: string;
    allergies?: string[];
    conditions?: string[];
  };
}

const InvestigationsTab: React.FC<InvestigationsTabProps> = ({ 
  data, 
  onChange, 
  patientInfo 
}) => {
  const [activeView, setActiveView] = useState<'order' | 'results' | 'history'>('order');
  const [selectedType, setSelectedType] = useState<InvestigationType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [newInvestigation, setNewInvestigation] = useState<Partial<Investigation>>({
    type: 'lab',
    priority: 'routine',
    status: 'ordered',
    orderDate: new Date().toISOString().split('T')[0],
    orderTime: new Date().toLocaleTimeString().slice(0, 5),
    orderedBy: '当前医生'
  });

  // 预定义的检查检验项目
  const investigationCatalog = {
    lab: {
      name: '化验检查',
      icon: <FlaskConical size={16} />,
      color: 'purple',
      items: [
        { code: 'CBC', name: '全血细胞计数', category: '血液学' },
        { code: 'BMP', name: '基础代谢组合', category: '生化' },
        { code: 'LFT', name: '肝功能检查', category: '生化' },
        { code: 'RFT', name: '肾功能检查', category: '生化' },
        { code: 'LIPID', name: '血脂检查', category: '生化' },
        { code: 'HBA1C', name: '糖化血红蛋白', category: '内分泌' },
        { code: 'TSH', name: '甲状腺功能', category: '内分泌' },
        { code: 'URINE', name: '尿常规', category: '尿液' },
        { code: 'ESR', name: '血沉', category: '炎症指标' },
        { code: 'CRP', name: 'C反应蛋白', category: '炎症指标' }
      ]
    },
    imaging: {
      name: '影像检查',
      icon: <Camera size={16} />,
      color: 'blue',
      items: [
        { code: 'XRAY', name: '胸部X光', category: '放射科' },
        { code: 'CT', name: 'CT扫描', category: '放射科' },
        { code: 'MRI', name: '磁共振成像', category: '放射科' },
        { code: 'US', name: '超声检查', category: '超声科' },
        { code: 'ECHO', name: '心脏超声', category: '超声科' },
        { code: 'MAMMO', name: '乳腺钼靶', category: '放射科' }
      ]
    },
    cardiology: {
      name: '心脏检查',
      icon: <Heart size={16} />,
      color: 'red',
      items: [
        { code: 'ECG', name: '心电图', category: '心电图室' },
        { code: 'HOLTER', name: '24小时动态心电图', category: '心电图室' },
        { code: 'STRESS', name: '运动负荷试验', category: '心功能室' },
        { code: 'ECHO', name: '超声心动图', category: '超声科' }
      ]
    },
    endoscopy: {
      name: '内镜检查',
      icon: <Scan size={16} />,
      color: 'green',
      items: [
        { code: 'EGD', name: '胃镜检查', category: '内镜中心' },
        { code: 'COLONOSCOPY', name: '结肠镜检查', category: '内镜中心' },
        { code: 'BRONCHOSCOPY', name: '支气管镜', category: '内镜中心' }
      ]
    },
    pathology: {
      name: '病理检查',
      icon: <Microscope size={16} />,
      color: 'indigo',
      items: [
        { code: 'BIOPSY', name: '组织活检', category: '病理科' },
        { code: 'CYTOLOGY', name: '细胞学检查', category: '病理科' },
        { code: 'FROZEN', name: '冰冻切片', category: '病理科' }
      ]
    },
    function: {
      name: '功能检查',
      icon: <Activity size={16} />,
      color: 'orange',
      items: [
        { code: 'PFT', name: '肺功能检查', category: '肺功能室' },
        { code: 'EMG', name: '肌电图', category: '神经电生理' },
        { code: 'EEG', name: '脑电图', category: '神经电生理' },
        { code: 'AUDIOMETRY', name: '听力检查', category: '耳鼻喉科' }
      ]
    }
  };

  // 常用检查组合模板
  const commonTemplates: InvestigationTemplate[] = [
    {
      id: 'routine-checkup',
      name: '常规体检套餐',
      category: '体检',
      investigations: [
        { type: 'lab', name: '全血细胞计数', code: 'CBC' },
        { type: 'lab', name: '基础代谢组合', code: 'BMP' },
        { type: 'lab', name: '肝功能检查', code: 'LFT' },
        { type: 'lab', name: '尿常规', code: 'URINE' },
        { type: 'imaging', name: '胸部X光', code: 'XRAY' },
        { type: 'cardiology', name: '心电图', code: 'ECG' }
      ]
    },
    {
      id: 'diabetes-workup',
      name: '糖尿病检查套餐',
      category: '内分泌',
      investigations: [
        { type: 'lab', name: '糖化血红蛋白', code: 'HBA1C' },
        { type: 'lab', name: '血脂检查', code: 'LIPID' },
        { type: 'lab', name: '肾功能检查', code: 'RFT' },
        { type: 'lab', name: '尿常规', code: 'URINE' },
        { type: 'cardiology', name: '心电图', code: 'ECG' }
      ]
    },
    {
      id: 'cardiac-workup',
      name: '心脏检查套餐',
      category: '心血管',
      investigations: [
        { type: 'cardiology', name: '心电图', code: 'ECG' },
        { type: 'cardiology', name: '超声心动图', code: 'ECHO' },
        { type: 'lab', name: '心肌酶谱', code: 'CARDIAC' },
        { type: 'imaging', name: '胸部X光', code: 'XRAY' }
      ]
    }
  ];

  const getTypeColor = (type: InvestigationType) => {
    const colors = {
      lab: 'purple',
      imaging: 'blue',
      cardiology: 'red',
      endoscopy: 'green',
      pathology: 'indigo',
      function: 'orange'
    };
    return colors[type];
  };

  const getStatusColor = (status: InvestigationStatus) => {
    switch (status) {
      case 'ordered': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'reported': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'stat': return 'bg-red-100 text-red-800 border-red-200';
      case 'asap': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'urgent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'routine': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultStatusColor = (status: ResultStatus) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'abnormal': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const addInvestigation = () => {
    if (!newInvestigation.name?.trim()) return;
    
    const investigation: Investigation = {
      id: `inv-${Date.now()}`,
      type: newInvestigation.type as InvestigationType,
      category: newInvestigation.category || '',
      name: newInvestigation.name,
      code: newInvestigation.code,
      priority: newInvestigation.priority as Priority,
      status: 'ordered',
      orderDate: newInvestigation.orderDate!,
      orderTime: newInvestigation.orderTime!,
      orderedBy: newInvestigation.orderedBy!,
      department: newInvestigation.department || '',
      instructions: newInvestigation.instructions,
      clinicalInfo: newInvestigation.clinicalInfo
    };

    onChange('investigations', [...data.investigations, investigation]);
    setNewInvestigation({
      type: 'lab',
      priority: 'routine',
      status: 'ordered',
      orderDate: new Date().toISOString().split('T')[0],
      orderTime: new Date().toLocaleTimeString().slice(0, 5),
      orderedBy: '当前医生'
    });
  };

  const applyTemplate = (template: InvestigationTemplate) => {
    const newInvestigations = template.investigations.map(item => ({
      id: `inv-${Date.now()}-${Math.random()}`,
      type: item.type,
      category: template.category,
      name: item.name,
      code: item.code,
      priority: 'routine' as Priority,
      status: 'ordered' as InvestigationStatus,
      orderDate: new Date().toISOString().split('T')[0],
      orderTime: new Date().toLocaleTimeString().slice(0, 5),
      orderedBy: '当前医生',
      department: investigationCatalog[item.type]?.items.find(cat => cat.code === item.code)?.category || ''
    }));

    onChange('investigations', [...data.investigations, ...newInvestigations]);
    setShowTemplates(false);
  };

  const removeInvestigation = (id: string) => {
    onChange('investigations', data.investigations.filter(inv => inv.id !== id));
  };

  const updateInvestigationStatus = (id: string, status: InvestigationStatus) => {
    onChange('investigations', data.investigations.map(inv => 
      inv.id === id ? { ...inv, status } : inv
    ));
  };

  const filteredInvestigations = data.investigations.filter(inv => {
    const matchesType = selectedType === 'all' || inv.type === selectedType;
    const matchesSearch = inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inv.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const renderOrderView = () => (
    <div className="space-y-6">
      {/* 快速模板选择 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-blue-800">常用检查套餐</h3>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showTemplates ? '收起' : '展开'}
          </button>
        </div>
        
        {showTemplates && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {commonTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white border border-blue-200 rounded-lg p-3 hover:shadow-sm cursor-pointer"
                onClick={() => applyTemplate(template)}
              >
                <h4 className="font-medium text-gray-800 text-sm">{template.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                <p className="text-xs text-blue-600 mt-2">
                  {template.investigations.length} 项检查
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 添加新检查 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">开具检查检验</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">检查类型</label>
            <select
              value={newInvestigation.type}
              onChange={(e) => setNewInvestigation({ 
                ...newInvestigation, 
                type: e.target.value as InvestigationType 
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {Object.entries(investigationCatalog).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">检查项目</label>
            <select
              value={newInvestigation.name || ''}
              onChange={(e) => {
                const selectedItem = investigationCatalog[newInvestigation.type as InvestigationType]?.items
                  .find(item => item.name === e.target.value);
                setNewInvestigation({ 
                  ...newInvestigation, 
                  name: e.target.value,
                  code: selectedItem?.code,
                  category: selectedItem?.category,
                  department: selectedItem?.category
                });
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">选择检查项目</option>
              {investigationCatalog[newInvestigation.type as InvestigationType]?.items.map(item => (
                <option key={item.code} value={item.name}>
                  {item.name} ({item.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">优先级</label>
            <select
              value={newInvestigation.priority}
              onChange={(e) => setNewInvestigation({ 
                ...newInvestigation, 
                priority: e.target.value as Priority 
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="routine">常规</option>
              <option value="urgent">加急</option>
              <option value="asap">尽快</option>
              <option value="stat">急查</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">执行科室</label>
            <input
              type="text"
              value={newInvestigation.department || ''}
              onChange={(e) => setNewInvestigation({ 
                ...newInvestigation, 
                department: e.target.value 
              })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="自动填充或手动输入"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">临床信息</label>
          <textarea
            rows={2}
            value={newInvestigation.clinicalInfo || ''}
            onChange={(e) => setNewInvestigation({ 
              ...newInvestigation, 
              clinicalInfo: e.target.value 
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="提供相关临床信息以协助检查..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">检查说明</label>
          <textarea
            rows={2}
            value={newInvestigation.instructions || ''}
            onChange={(e) => setNewInvestigation({ 
              ...newInvestigation, 
              instructions: e.target.value 
            })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="特殊要求或注意事项..."
          />
        </div>

        <button
          onClick={addInvestigation}
          disabled={!newInvestigation.name?.trim()}
          className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 text-sm font-medium"
        >
          <Plus size={16} className="inline mr-1" />
          开具检查
        </button>
      </div>

      {/* 已开具的检查列表 */}
      {data.investigations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">已开具检查 ({data.investigations.length})</h3>
          
          <div className="space-y-3">
            {data.investigations.map(investigation => (
              <div key={investigation.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {investigationCatalog[investigation.type]?.icon}
                      <span className="font-medium text-gray-800">{investigation.name}</span>
                      {investigation.code && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {investigation.code}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(investigation.priority)}`}>
                        {investigation.priority === 'stat' ? '急查' : 
                         investigation.priority === 'asap' ? '尽快' :
                         investigation.priority === 'urgent' ? '加急' : '常规'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(investigation.status)}`}>
                        {investigation.status === 'ordered' ? '已开具' :
                         investigation.status === 'scheduled' ? '已预约' :
                         investigation.status === 'in-progress' ? '检查中' :
                         investigation.status === 'completed' ? '已完成' :
                         investigation.status === 'reported' ? '已报告' : '已取消'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>科室：{investigation.department}</div>
                      <div>开具时间：{investigation.orderDate} {investigation.orderTime}</div>
                      {investigation.clinicalInfo && (
                        <div>临床信息：{investigation.clinicalInfo}</div>
                      )}
                      {investigation.instructions && (
                        <div>检查说明：{investigation.instructions}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {investigation.status === 'ordered' && (
                      <button
                        onClick={() => updateInvestigationStatus(investigation.id, 'scheduled')}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        预约
                      </button>
                    )}
                    <button
                      onClick={() => removeInvestigation(investigation.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      取消
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderResultsView = () => (
    <div className="space-y-6">
      {/* 筛选和搜索 */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="搜索检查项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as InvestigationType | 'all')}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">所有类型</option>
            {Object.entries(investigationCatalog).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 结果列表 */}
      <div className="space-y-4">
        {filteredInvestigations
          .filter(inv => inv.status === 'completed' || inv.status === 'reported')
          .map(investigation => (
            <div key={investigation.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {investigationCatalog[investigation.type]?.icon}
                    <span className="font-medium text-gray-800">{investigation.name}</span>
                    {investigation.results && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        investigation.results.status === 'normal' ? 'bg-green-100 text-green-800' :
                        investigation.results.status === 'abnormal' ? 'bg-yellow-100 text-yellow-800' :
                        investigation.results.status === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {investigation.results.status === 'normal' ? '正常' :
                         investigation.results.status === 'abnormal' ? '异常' :
                         investigation.results.status === 'critical' ? '危急' : '待定'}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {investigation.department} • {investigation.completedDate} {investigation.completedTime}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                    <Eye size={14} className="mr-1" />
                    查看
                  </button>
                  <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                    <Download size={14} className="mr-1" />
                    下载
                  </button>
                </div>
              </div>

              {investigation.results && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 mb-2">检查结果</div>
                  <div className="text-sm text-gray-600 mb-3">{investigation.results.summary}</div>
                  
                  {investigation.results.values && investigation.results.values.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-1">项目</th>
                            <th className="text-left py-1">结果</th>
                            <th className="text-left py-1">单位</th>
                            <th className="text-left py-1">参考范围</th>
                            <th className="text-left py-1">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          {investigation.results.values.map((value, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-1">{value.parameter}</td>
                              <td className={`py-1 font-medium ${
                                value.status === 'high' ? 'text-red-600' :
                                value.status === 'low' ? 'text-blue-600' :
                                value.status === 'critical' ? 'text-red-700 font-bold' :
                                'text-gray-800'
                              }`}>
                                {value.value}
                              </td>
                              <td className="py-1 text-gray-600">{value.unit}</td>
                              <td className="py-1 text-gray-600">{value.referenceRange}</td>
                              <td className="py-1">
                                {value.status === 'high' && <TrendingUp size={12} className="text-red-600" />}
                                {value.status === 'low' && <TrendingUp size={12} className="text-blue-600 transform rotate-180" />}
                                {value.status === 'critical' && <AlertTriangle size={12} className="text-red-700" />}
                                {value.status === 'normal' && <CheckCircle size={12} className="text-green-600" />}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {investigation.results.attachments && investigation.results.attachments.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">附件</div>
                      <div className="flex flex-wrap gap-2">
                        {investigation.results.attachments.map(attachment => (
                          <div key={attachment.id} className="flex items-center space-x-2 bg-white border border-gray-200 rounded px-2 py-1">
                            {attachment.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                            <span className="text-xs">{attachment.name}</span>
                            <button className="text-xs text-primary-600 hover:text-primary-700">
                              <Download size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {investigation.results.reportedBy && (
                    <div className="mt-3 text-xs text-gray-500">
                      报告医生：{investigation.results.reportedBy}
                      {investigation.results.verifiedBy && ` • 审核医生：${investigation.results.verifiedBy}`}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  const renderHistoryView = () => (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">检查检验历史</h3>
        
        {/* 时间线视图 */}
        <div className="space-y-4">
          {data.investigations.map(investigation => (
            <div key={investigation.id} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-3 h-3 rounded-full ${
                  investigation.status === 'completed' || investigation.status === 'reported' 
                    ? 'bg-green-500' 
                    : investigation.status === 'in-progress' 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-300'
                }`}></div>
                <div className="w-px h-full bg-gray-200 mt-2"></div>
              </div>
              
              <div className="flex-1 pb-4">
                <div className="flex items-center space-x-2 mb-1">
                  {investigationCatalog[investigation.type]?.icon}
                  <span className="font-medium text-gray-800">{investigation.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(investigation.status)}`}>
                    {investigation.status === 'ordered' ? '已开具' :
                     investigation.status === 'scheduled' ? '已预约' :
                     investigation.status === 'in-progress' ? '检查中' :
                     investigation.status === 'completed' ? '已完成' :
                     investigation.status === 'reported' ? '已报告' : '已取消'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600">
                  开具时间：{investigation.orderDate} {investigation.orderTime}
                  {investigation.completedDate && (
                    <span> • 完成时间：{investigation.completedDate} {investigation.completedTime}</span>
                  )}
                </div>
                
                {investigation.results && (
                  <div className="mt-2 text-sm">
                    <span className={getResultStatusColor(investigation.results.status)}>
                      {investigation.results.summary}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-4 max-w-full">
      {/* 标签页导航 */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveView('order')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'order'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FlaskConical size={16} className="inline mr-2" />
            开具检查
          </button>
          <button
            onClick={() => setActiveView('results')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'results'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} className="inline mr-2" />
            检查结果
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeView === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Clock size={16} className="inline mr-2" />
            历史记录
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="min-h-0 flex-1">
        {activeView === 'order' && renderOrderView()}
        {activeView === 'results' && renderResultsView()}
        {activeView === 'history' && renderHistoryView()}
      </div>
    </div>
  );
};

export default InvestigationsTab;
