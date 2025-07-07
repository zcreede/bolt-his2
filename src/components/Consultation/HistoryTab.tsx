import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { Clock, User, Heart, Users, AlertCircle, ChevronDown, ChevronRight, Plus, X, Pill, Syringe, Droplets, Scissors, Ban as Bandage, Stethoscope, Dna } from 'lucide-react';
import SocialHistoryTab from './SocialHistoryTab';

interface HistoryTabProps {
  data: {
    presentIllness: string;
    pastHistory: string;
    familyHistory: string;
    socialHistory: {
      occupation: {
        current: string;
        duration: string;
        exposures: string[];
        previousOccupations: string;
      };
      smoking: {
        status: 'never' | 'current' | 'former';
        type: string[];
        amountPerDay: number;
        startAge: number;
        endAge?: number;
        duration: number;
        packYears?: number;
        quitAttempts?: number;
        quitDesire?: 'none' | 'low' | 'medium' | 'high';
      };
      alcohol: {
        status: 'never' | 'current' | 'former';
        frequency: 'never' | 'occasional' | 'weekly' | 'daily';
        type: string[];
        amountPerWeek: number;
        duration: number;
        lastDrink?: string;
      };
      maritalStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other';
      children: number;
      livingArrangement: string;
      education: string;
      diet: {
        type: string;
        restrictions: string[];
        regularMeals: boolean;
        caffeine: boolean;
        caffeineAmount?: string;
      };
      exercise: {
        frequency: 'never' | 'occasional' | 'regular' | 'daily';
        type: string[];
        duration: number;
        intensity: 'light' | 'moderate' | 'vigorous';
      };
      sleep: {
        hoursPerNight: number;
        quality: 'good' | 'fair' | 'poor';
        issues: string[];
      };
      menstrualHistory?: {
        age: number;
        regularity: 'regular' | 'irregular';
        cycle: number;
        flow: 'light' | 'moderate' | 'heavy';
        pain: 'none' | 'mild' | 'moderate' | 'severe';
        lastPeriod: string;
        menopause: boolean;
        menopauseAge?: number;
      };
    };
  };
  onChange: (field: string, value: any) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
  patientGender?: string;
}

// 现病史组件
const PresentIllnessCard: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ value, onChange, onAttachmentUpload, isExpanded, onToggle }) => {
  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-blue-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <Clock size={18} className="text-primary-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">现病史</h3>
          <span className="ml-2 text-sm text-red-500">*</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* 提示信息 */}
          <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
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
      )}
    </div>
  );
};

// 既往史组件
const PastHistoryCard: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ value, onChange, onAttachmentUpload, isExpanded, onToggle }) => {
  // 可添加的部分
  const availableSections = [
    {
      id: 'diseases',
      title: '疾病史',
      icon: <Stethoscope size={16} className="text-blue-600" />
    },
    {
      id: 'surgeries',
      title: '手术史',
      icon: <Scissors size={16} className="text-orange-600" />
    },
    {
      id: 'injuries',
      title: '外伤史',
      icon: <Bandage size={16} className="text-red-600" />
    },
    {
      id: 'allergies',
      title: '过敏史',
      icon: <Droplets size={16} className="text-purple-600" />
    },
    {
      id: 'medications',
      title: '用药史',
      icon: <Pill size={16} className="text-green-600" />
    },
    {
      id: 'vaccinations',
      title: '接种史',
      icon: <Syringe size={16} className="text-teal-600" />
    }
  ];
  
  const [sections, setSections] = useState<string[]>(['diseases']);
  const [activeSections, setActiveSections] = useState<string[]>(['diseases']);
  
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
    setSections(sections.filter(id => id !== sectionId));
    setActiveSections(activeSections.filter(id => id !== sectionId));
  };
  
  const getAvailableSectionsToAdd = () => {
    return availableSections.filter(section => !sections.includes(section.id));
  };

  return (
    <div className="border border-blue-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-blue-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <User size={18} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">既往史</h3>
        </div>
        <div className="flex items-center">
          {/* 添加更多部分的下拉菜单 */}
          {isExpanded && getAvailableSectionsToAdd().length > 0 && (
            <div className="relative mr-2">
              <button
                className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('past-history-dropdown')?.classList.toggle('hidden');
                }}
              >
                <Plus size={16} className="mr-1" />
                添加
              </button>
              
              <div 
                id="past-history-dropdown"
                className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden"
              >
                <div className="py-1">
                  {getAvailableSectionsToAdd().map(section => (
                    <button
                      key={section.id}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        addSection(section.id);
                        document.getElementById('past-history-dropdown')?.classList.add('hidden');
                      }}
                    >
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          <button className="text-gray-500 hover:text-gray-700">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* 各部分的内容 */}
          <div className="space-y-4">
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
                      <span className="ml-2 font-medium text-gray-700">{section.title}</span>
                    </div>
                    <div className="flex items-center">
                      {sectionId !== 'diseases' && (
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
                      {/* 这里根据不同的部分显示不同的表单 */}
                      {sectionId === 'diseases' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入疾病史信息..."
                          />
                        </div>
                      )}
                      
                      {sectionId === 'surgeries' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入手术史信息..."
                          />
                        </div>
                      )}
                      
                      {sectionId === 'allergies' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入过敏史信息..."
                          />
                        </div>
                      )}
                      
                      {sectionId === 'injuries' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入外伤史信息..."
                          />
                        </div>
                      )}
                      
                      {sectionId === 'medications' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入用药史信息..."
                          />
                        </div>
                      )}
                      
                      {sectionId === 'vaccinations' && (
                        <div>
                          <textarea
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                            rows={3}
                            placeholder="请输入接种史信息..."
                          />
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
              placeholder="请记录患者既往疾病史、手术史、外伤史、过敏史、预防接种史等..."
              height="150px"
              onAttachmentUpload={onAttachmentUpload}
            />
            <div className="mt-2 text-xs text-gray-500">
              包含：既往疾病、手术史、外伤史、输血史、过敏史、预防接种史
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 家族史组件
const FamilyHistoryCard: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onAttachmentUpload?: (file: File) => Promise<string>;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ value, onChange, onAttachmentUpload, isExpanded, onToggle }) => {
  const [familyMembers, setFamilyMembers] = useState<{
    relation: string;
    age?: number;
    isAlive: boolean;
    causeOfDeath?: string;
    conditions: string[];
  }[]>([]);
  
  const [newMember, setNewMember] = useState({
    relation: '',
    age: undefined as number | undefined,
    isAlive: true,
    causeOfDeath: '',
    conditions: [] as string[]
  });
  
  const [newCondition, setNewCondition] = useState('');
  const [activeMember, setActiveMember] = useState<number | null>(null);
  
  const commonRelations = [
    '父亲', '母亲', '兄弟', '姐妹', '儿子', '女儿', '祖父', '祖母', '外祖父', '外祖母'
  ];
  
  const commonConditions = [
    '高血压', '糖尿病', '冠心病', '脑卒中', '癌症', '哮喘', 
    '慢性阻塞性肺疾病', '肝炎', '肾病', '精神疾病', '自身免疫性疾病'
  ];
  
  const addFamilyMember = () => {
    if (newMember.relation) {
      setFamilyMembers([...familyMembers, {...newMember}]);
      setNewMember({
        relation: '',
        age: undefined,
        isAlive: true,
        causeOfDeath: '',
        conditions: []
      });
    }
  };
  
  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
    if (activeMember === index) {
      setActiveMember(null);
    }
  };
  
  const addCondition = () => {
    if (newCondition && !newMember.conditions.includes(newCondition)) {
      setNewMember({
        ...newMember,
        conditions: [...newMember.conditions, newCondition]
      });
      setNewCondition('');
    }
  };
  
  const removeCondition = (index: number) => {
    setNewMember({
      ...newMember,
      conditions: newMember.conditions.filter((_, i) => i !== index)
    });
  };
  
  const addCommonCondition = (condition: string) => {
    if (!newMember.conditions.includes(condition)) {
      setNewMember({
        ...newMember,
        conditions: [...newMember.conditions, condition]
      });
    }
  };
  
  const toggleMember = (index: number) => {
    setActiveMember(activeMember === index ? null : index);
  };

  return (
    <div className="border border-green-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-green-50 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          <Users size={18} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">家族史</h3>
        </div>
        <div className="flex items-center">
          {isExpanded && (
            <button
              className="flex items-center text-sm text-primary-600 hover:text-primary-700 mr-2"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('add-family-member-form')?.classList.toggle('hidden');
              }}
            >
              <Plus size={16} className="mr-1" />
              添加
            </button>
          )}
          <button className="text-gray-500 hover:text-gray-700">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          {/* 添加新家族成员表单 */}
          <div id="add-family-member-form" className="border border-gray-200 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">添加家族成员</h4>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">关系 *</label>
              <div className="mb-2">
                <input
                  type="text"
                  value={newMember.relation}
                  onChange={(e) => setNewMember({...newMember, relation: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="如：父亲、母亲、兄弟、姐妹等"
                />
              </div>
              
              <div className="text-xs text-gray-500 mb-1">常见关系（点击选择）：</div>
              <div className="flex flex-wrap gap-1 mb-3">
                {commonRelations.map(relation => (
                  <button
                    key={relation}
                    onClick={() => setNewMember({...newMember, relation})}
                    className="px-2 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full hover:bg-green-100"
                  >
                    {relation}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">年龄</label>
                <input
                  type="number"
                  value={newMember.age || ''}
                  onChange={(e) => setNewMember({...newMember, age: e.target.value ? parseInt(e.target.value) : undefined})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="年龄"
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm text-gray-600 mb-1">
                  <input
                    type="checkbox"
                    checked={newMember.isAlive}
                    onChange={(e) => setNewMember({...newMember, isAlive: e.target.checked})}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                  />
                  在世
                </label>
                
                {!newMember.isAlive && (
                  <input
                    type="text"
                    value={newMember.causeOfDeath || ''}
                    onChange={(e) => setNewMember({...newMember, causeOfDeath: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="死亡原因"
                  />
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">疾病情况</label>
              
              <div className="mb-2">
                <div className="text-xs text-gray-500 mb-1">常见疾病（点击添加）：</div>
                <div className="flex flex-wrap gap-1">
                  {commonConditions.map(condition => (
                    <button
                      key={condition}
                      onClick={() => addCommonCondition(condition)}
                      disabled={newMember.conditions.includes(condition)}
                      className={`px-2 py-1 text-xs rounded-full border ${
                        newMember.conditions.includes(condition)
                          ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-green-300 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCondition()}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="输入其他疾病..."
                />
                <button
                  onClick={addCondition}
                  className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                >
                  添加
                </button>
              </div>
              
              {newMember.conditions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {newMember.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {condition}
                      <button
                        onClick={() => removeCondition(index)}
                        className="ml-1 text-green-700 hover:text-green-900"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={addFamilyMember}
              disabled={!newMember.relation}
              className={`w-full py-2 text-sm font-medium rounded-lg ${
                newMember.relation
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Plus size={16} className="inline mr-1" />
              添加家族成员
            </button>
          </div>
          
          {/* 已添加的家族成员 */}
          {familyMembers.length > 0 && (
            <div className="space-y-3">
              {familyMembers.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="flex items-center justify-between p-2 bg-gray-50 cursor-pointer"
                    onClick={() => toggleMember(index)}
                  >
                    <div className="flex items-center">
                      <Users size={16} className="text-green-600 mr-2" />
                      <span className="font-medium text-gray-700">
                        {member.relation} {member.age && `(${member.age}岁)`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFamilyMember(index);
                        }}
                        className="mr-2 text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                      {activeMember === index ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                  
                  {activeMember === index && (
                    <div className="p-3">
                      <div className="text-sm text-gray-600 mb-2">
                        状态: {member.isAlive ? '在世' : '已故'}
                        {!member.isAlive && member.causeOfDeath && ` - 死因: ${member.causeOfDeath}`}
                      </div>
                      
                      {member.conditions.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-700 mb-1">疾病:</div>
                          <div className="flex flex-wrap gap-1">
                            {member.conditions.map((condition, i) => (
                              <span key={i} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* 传统文本区域 */}
          <div className="mt-4">
            <RichTextEditor
              value={value}
              onChange={onChange}
              placeholder="请记录患者家族中的遗传性疾病、传染性疾病等相关病史..."
              height="120px"
              onAttachmentUpload={onAttachmentUpload}
            />
            <div className="mt-2 text-xs text-gray-500">
              重点关注：遗传性疾病、肿瘤、心血管疾病、糖尿病等家族史
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryTab: React.FC<HistoryTabProps> = ({ 
  data, 
  onChange, 
  onAttachmentUpload,
  patientGender = 'male'
}) => {
  const [expandedSections, setExpandedSections] = useState({
    presentIllness: true,
    pastHistory: true,
    familyHistory: true,
    socialHistory: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleSocialHistoryChange = (field: string, value: any) => {
    onChange('socialHistory', {
      ...data.socialHistory,
      [field]: value
    });
  };

  return (
    <div className="space-y-6 p-4">
      {/* 现病史 */}
      <PresentIllnessCard
        value={data.presentIllness}
        onChange={(value) => onChange('presentIllness', value)}
        onAttachmentUpload={onAttachmentUpload}
        isExpanded={expandedSections.presentIllness}
        onToggle={() => toggleSection('presentIllness')}
      />

      {/* 既往史 */}
      <PastHistoryCard
        value={data.pastHistory}
        onChange={(value) => onChange('pastHistory', value)}
        onAttachmentUpload={onAttachmentUpload}
        isExpanded={expandedSections.pastHistory}
        onToggle={() => toggleSection('pastHistory')}
      />

      {/* 家族史 */}
      <FamilyHistoryCard
        value={data.familyHistory}
        onChange={(value) => onChange('familyHistory', value)}
        onAttachmentUpload={onAttachmentUpload}
        isExpanded={expandedSections.familyHistory}
        onToggle={() => toggleSection('familyHistory')}
      />

      {/* 社会史 - 结构化表单 */}
      <div className="border border-purple-200 rounded-lg overflow-hidden">
        <div 
          className="flex items-center justify-between p-3 bg-purple-50 cursor-pointer"
          onClick={() => toggleSection('socialHistory')}
        >
          <div className="flex items-center">
            <Heart size={18} className="text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-800">社会史</h3>
          </div>
          <div className="flex items-center">
            {expandedSections.socialHistory && (
              <button
                className="flex items-center text-sm text-primary-600 hover:text-primary-700 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById('social-history-dropdown')?.classList.toggle('hidden');
                }}
              >
                <Plus size={16} className="mr-1" />
                添加
              </button>
            )}
            <button className="text-gray-500 hover:text-gray-700">
              {expandedSections.socialHistory ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
        
        {expandedSections.socialHistory && (
          <div className="p-4">
            <SocialHistoryTab
              data={data.socialHistory}
              onChange={handleSocialHistoryChange}
              patientGender={patientGender}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryTab;
