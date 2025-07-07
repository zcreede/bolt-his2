import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { 
  Clock, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  X,
  Calendar,
  ThermometerSnowflake,
  Zap,
  Droplets,
  Pill,
  Activity
} from 'lucide-react';

interface PresentIllnessTabProps {
  value: string;
  onChange: (value: string) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
}

const PresentIllnessTab: React.FC<PresentIllnessTabProps> = ({ 
  value, 
  onChange, 
  onAttachmentUpload 
}) => {
  const [structuredData, setStructuredData] = useState({
    onsetDate: '',
    onsetType: 'gradual', // 'sudden' | 'gradual'
    duration: '',
    location: '',
    quality: '',
    severity: 'mild', // 'mild' | 'moderate' | 'severe'
    aggravatingFactors: [] as string[],
    relievingFactors: [] as string[],
    associatedSymptoms: [] as string[],
    treatments: [] as string[]
  });
  
  const [newFactor, setNewFactor] = useState('');
  const [newSymptom, setNewSymptom] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  
  // 可用的部分
  const availableSections = [
    {
      id: 'main',
      title: '主要症状信息',
      icon: <Clock size={16} className="text-primary-600 mr-2" />
    },
    {
      id: 'aggravating',
      title: '加重因素',
      icon: <Zap size={16} className="text-orange-600 mr-2" />
    },
    {
      id: 'relieving',
      title: '缓解因素',
      icon: <Droplets size={16} className="text-blue-600 mr-2" />
    },
    {
      id: 'associated',
      title: '伴随症状',
      icon: <Activity size={16} className="text-purple-600 mr-2" />
    },
    {
      id: 'treatments',
      title: '诊治经过',
      icon: <Pill size={16} className="text-green-600 mr-2" />
    }
  ];
  
  const [sections, setSections] = useState<string[]>(['main']);
  const [activeSections, setActiveSections] = useState<string[]>(['main']);
  
  const toggleSection = (sectionId: string) => {
    setActiveSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId) 
        : [...prev, sectionId]
    );
  };
  
  const addSection = (sectionId: string) => {
    if (!sections.includes(sectionId)) {
      setSections([...sections, sectionId]);
      setActiveSections([...activeSections, sectionId]);
    }
  };
  
  const removeSection = (sectionId: string) => {
    if (sectionId === 'main') {
      // 不允许删除主要信息
      return;
    }
    setSections(sections.filter(id => id !== sectionId));
    setActiveSections(activeSections.filter(id => id !== sectionId));
  };
  
  const getAvailableSectionsToAdd = () => {
    return availableSections.filter(section => !sections.includes(section.id));
  };
  
  // 常见加重因素
  const commonAggravatingFactors = [
    '活动', '进食', '情绪激动', '天气变化', '姿势改变', '咳嗽', '深呼吸'
  ];
  
  // 常见缓解因素
  const commonRelievingFactors = [
    '休息', '药物', '按摩', '热敷', '冷敷', '体位改变', '进食'
  ];
  
  // 常见伴随症状
  const commonAssociatedSymptoms = [
    '发热', '头痛', '恶心', '呕吐', '乏力', '食欲不振', '腹泻', '便秘', '咳嗽', '气短'
  ];
  
  const addAggravatingFactor = () => {
    if (newFactor && !structuredData.aggravatingFactors.includes(newFactor)) {
      setStructuredData({
        ...structuredData,
        aggravatingFactors: [...structuredData.aggravatingFactors, newFactor]
      });
      setNewFactor('');
    }
  };
  
  const removeAggravatingFactor = (factor: string) => {
    setStructuredData({
      ...structuredData,
      aggravatingFactors: structuredData.aggravatingFactors.filter(f => f !== factor)
    });
  };
  
  const addRelievingFactor = () => {
    if (newFactor && !structuredData.relievingFactors.includes(newFactor)) {
      setStructuredData({
        ...structuredData,
        relievingFactors: [...structuredData.relievingFactors, newFactor]
      });
      setNewFactor('');
    }
  };
  
  const removeRelievingFactor = (factor: string) => {
    setStructuredData({
      ...structuredData,
      relievingFactors: structuredData.relievingFactors.filter(f => f !== factor)
    });
  };
  
  const addAssociatedSymptom = () => {
    if (newSymptom && !structuredData.associatedSymptoms.includes(newSymptom)) {
      setStructuredData({
        ...structuredData,
        associatedSymptoms: [...structuredData.associatedSymptoms, newSymptom]
      });
      setNewSymptom('');
    }
  };
  
  const removeAssociatedSymptom = (symptom: string) => {
    setStructuredData({
      ...structuredData,
      associatedSymptoms: structuredData.associatedSymptoms.filter(s => s !== symptom)
    });
  };
  
  const addTreatment = () => {
    if (newTreatment && !structuredData.treatments.includes(newTreatment)) {
      setStructuredData({
        ...structuredData,
        treatments: [...structuredData.treatments, newTreatment]
      });
      setNewTreatment('');
    }
  };
  
  const removeTreatment = (treatment: string) => {
    setStructuredData({
      ...structuredData,
      treatments: structuredData.treatments.filter(t => t !== treatment)
    });
  };
  
  const addCommonFactor = (factor: string, type: 'aggravating' | 'relieving') => {
    if (type === 'aggravating' && !structuredData.aggravatingFactors.includes(factor)) {
      setStructuredData({
        ...structuredData,
        aggravatingFactors: [...structuredData.aggravatingFactors, factor]
      });
    } else if (type === 'relieving' && !structuredData.relievingFactors.includes(factor)) {
      setStructuredData({
        ...structuredData,
        relievingFactors: [...structuredData.relievingFactors, factor]
      });
    }
  };
  
  const addCommonSymptom = (symptom: string) => {
    if (!structuredData.associatedSymptoms.includes(symptom)) {
      setStructuredData({
        ...structuredData,
        associatedSymptoms: [...structuredData.associatedSymptoms, symptom]
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 提示信息 */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">现病史记录要点：</div>
            <div className="text-xs space-y-1">
              <div>• 如果患者在挂号时已填写主诉，系统会自动加载到此处</div>
              <div>• 可以在此基础上补充详细的病史信息</div>
              <div>• 建议包含：发病时间、起病缓急、诱发因素、主要症状、伴随症状、病情演变、诊治经过</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 添加更多部分的下拉菜单 */}
      <div id="present-illness-dropdown-container" className="relative mb-4">
        <div className="flex justify-end">
          <button
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            onClick={() => document.getElementById('present-illness-dropdown')?.classList.toggle('hidden')}
          >
            <Plus size={16} className="mr-1" />
            添加更多信息
          </button>
        </div>
        
        <div 
          id="present-illness-dropdown"
          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden"
        >
          <div className="py-1">
            {getAvailableSectionsToAdd().map(section => (
              <button
                key={section.id}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  addSection(section.id);
                  document.getElementById('present-illness-dropdown')?.classList.add('hidden');
                }}
              >
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 结构化现病史 */}
      <div className="space-y-3">
        {sections.map(sectionId => {
          const section = availableSections.find(s => s.id === sectionId);
          if (!section) return null;
          
          return (
            <div key={sectionId} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer"
                onClick={() => toggleSection(sectionId)}
              >
                <div className="flex items-center">
                  {section.icon}
                  <span className="font-medium text-gray-700">{section.title}</span>
                </div>
                <div className="flex items-center">
                  {sectionId !== 'main' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSection(sectionId);
                      }}
                      className="mr-2 text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {activeSections.includes(sectionId) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </div>
              
              {activeSections.includes(sectionId) && (
                <div className="p-3">
                  {/* 主要症状信息 */}
                  {sectionId === 'main' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">发病日期</label>
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <input
                            type="date"
                            value={structuredData.onsetDate}
                            onChange={(e) => setStructuredData({...structuredData, onsetDate: e.target.value})}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">起病方式</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={structuredData.onsetType === 'sudden'}
                              onChange={() => setStructuredData({...structuredData, onsetType: 'sudden'})}
                              className="mr-2 text-primary-600 focus:ring-primary-500"
                            />
                            <Zap size={16} className="text-orange-500 mr-1" />
                            <span className="text-sm">急性</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              checked={structuredData.onsetType === 'gradual'}
                              onChange={() => setStructuredData({...structuredData, onsetType: 'gradual'})}
                              className="mr-2 text-primary-600 focus:ring-primary-500"
                            />
                            <ThermometerSnowflake size={16} className="text-blue-500 mr-1" />
                            <span className="text-sm">缓慢</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">持续时间</label>
                        <input
                          type="text"
                          value={structuredData.duration}
                          onChange={(e) => setStructuredData({...structuredData, duration: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如：3天、2周、1个月等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">部位</label>
                        <input
                          type="text"
                          value={structuredData.location}
                          onChange={(e) => setStructuredData({...structuredData, location: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如：头部、胸部、腹部等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">性质</label>
                        <input
                          type="text"
                          value={structuredData.quality}
                          onChange={(e) => setStructuredData({...structuredData, quality: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如：刺痛、钝痛、灼烧感等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">严重程度</label>
                        <select
                          value={structuredData.severity}
                          onChange={(e) => setStructuredData({...structuredData, severity: e.target.value as any})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="mild">轻度</option>
                          <option value="moderate">中度</option>
                          <option value="severe">重度</option>
                        </select>
                      </div>
                    </div>
                  )}
                  
                  {/* 加重因素 */}
                  {sectionId === 'aggravating' && (
                    <div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">常见加重因素（点击添加）：</div>
                        <div className="flex flex-wrap gap-1">
                          {commonAggravatingFactors.map(factor => (
                            <button
                              key={factor}
                              onClick={() => addCommonFactor(factor, 'aggravating')}
                              disabled={structuredData.aggravatingFactors.includes(factor)}
                              className={`px-2 py-1 text-xs rounded-full border ${
                                structuredData.aggravatingFactors.includes(factor)
                                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer'
                              }`}
                            >
                              {factor}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={newFactor}
                          onChange={(e) => setNewFactor(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addAggravatingFactor()}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="输入其他加重因素..."
                        />
                        <button
                          onClick={addAggravatingFactor}
                          className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                        >
                          添加
                        </button>
                      </div>
                      
                      {structuredData.aggravatingFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {structuredData.aggravatingFactors.map((factor, index) => (
                            <div key={index} className="flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                              {factor}
                              <button
                                onClick={() => removeAggravatingFactor(factor)}
                                className="ml-1 text-orange-700 hover:text-orange-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 缓解因素 */}
                  {sectionId === 'relieving' && (
                    <div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">常见缓解因素（点击添加）：</div>
                        <div className="flex flex-wrap gap-1">
                          {commonRelievingFactors.map(factor => (
                            <button
                              key={factor}
                              onClick={() => addCommonFactor(factor, 'relieving')}
                              disabled={structuredData.relievingFactors.includes(factor)}
                              className={`px-2 py-1 text-xs rounded-full border ${
                                structuredData.relievingFactors.includes(factor)
                                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                              }`}
                            >
                              {factor}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={newFactor}
                          onChange={(e) => setNewFactor(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRelievingFactor()}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="输入其他缓解因素..."
                        />
                        <button
                          onClick={addRelievingFactor}
                          className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                        >
                          添加
                        </button>
                      </div>
                      
                      {structuredData.relievingFactors.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {structuredData.relievingFactors.map((factor, index) => (
                            <div key={index} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {factor}
                              <button
                                onClick={() => removeRelievingFactor(factor)}
                                className="ml-1 text-blue-700 hover:text-blue-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 伴随症状 */}
                  {sectionId === 'associated' && (
                    <div>
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">常见伴随症状（点击添加）：</div>
                        <div className="flex flex-wrap gap-1">
                          {commonAssociatedSymptoms.map(symptom => (
                            <button
                              key={symptom}
                              onClick={() => addCommonSymptom(symptom)}
                              disabled={structuredData.associatedSymptoms.includes(symptom)}
                              className={`px-2 py-1 text-xs rounded-full border ${
                                structuredData.associatedSymptoms.includes(symptom)
                                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer'
                              }`}
                            >
                              {symptom}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={newSymptom}
                          onChange={(e) => setNewSymptom(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addAssociatedSymptom()}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="输入其他伴随症状..."
                        />
                        <button
                          onClick={addAssociatedSymptom}
                          className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                        >
                          添加
                        </button>
                      </div>
                      
                      {structuredData.associatedSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {structuredData.associatedSymptoms.map((symptom, index) => (
                            <div key={index} className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                              {symptom}
                              <button
                                onClick={() => removeAssociatedSymptom(symptom)}
                                className="ml-1 text-purple-700 hover:text-purple-900"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 诊治经过 */}
                  {sectionId === 'treatments' && (
                    <div>
                      <div className="flex space-x-2 mb-3">
                        <input
                          type="text"
                          value={newTreatment}
                          onChange={(e) => setNewTreatment(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTreatment()}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="输入已接受的诊疗措施..."
                        />
                        <button
                          onClick={addTreatment}
                          className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                        >
                          添加
                        </button>
                      </div>
                      
                      {structuredData.treatments.length > 0 && (
                        <div className="space-y-2">
                          {structuredData.treatments.map((treatment, index) => (
                            <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
                              <span className="text-sm text-green-800">{treatment}</span>
                              <button
                                onClick={() => removeTreatment(treatment)}
                                className="text-green-700 hover:text-green-900"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 传统文本区域 */}
      <div className="mt-4">
        <RichTextEditor
          value={value}
          onChange={onChange}
          placeholder="请详细描述患者本次发病的时间、诱因、主要症状、病情发展过程、诊治经过等...&#10;&#10;如果患者在挂号时已填写主诉信息，会自动显示在这里，您可以在此基础上补充完善。"
          height="200px"
          onAttachmentUpload={onAttachmentUpload}
        />
        <div className="mt-2 text-xs text-gray-500">
          建议包含：发病时间、起病缓急、诱发因素、主要症状、伴随症状、病情演变、诊治经过
        </div>
      </div>
    </div>
  );
};

export default PresentIllnessTab;
