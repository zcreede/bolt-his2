import React, { useState } from 'react';
import { 
  Briefcase, 
  Cigarette, 
  Wine, 
  Heart, 
  Utensils, 
  Activity, 
  Moon, 
  Calendar, 
  GraduationCap, 
  Home, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

interface SocialHistoryTabProps {
  data: {
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
  onChange: (field: string, value: any) => void;
  patientGender?: string;
}

// 可用的社会史部分
const availableSections = [
  {
    id: 'occupation',
    title: '职业史',
    icon: <Briefcase size={16} className="text-blue-600" />
  },
  {
    id: 'smoking',
    title: '吸烟史',
    icon: <Cigarette size={16} className="text-orange-600" />
  },
  {
    id: 'alcohol',
    title: '饮酒史',
    icon: <Wine size={16} className="text-red-600" />
  },
  {
    id: 'marital',
    title: '婚育史',
    icon: <Heart size={16} className="text-pink-600" />
  },
  {
    id: 'education',
    title: '教育背景',
    icon: <GraduationCap size={16} className="text-indigo-600" />
  },
  {
    id: 'living',
    title: '居住情况',
    icon: <Home size={16} className="text-green-600" />
  },
  {
    id: 'diet',
    title: '饮食习惯',
    icon: <Utensils size={16} className="text-yellow-600" />
  },
  {
    id: 'exercise',
    title: '运动习惯',
    icon: <Activity size={16} className="text-teal-600" />
  },
  {
    id: 'sleep',
    title: '睡眠情况',
    icon: <Moon size={16} className="text-purple-600" />
  },
  {
    id: 'menstrual',
    title: '月经史',
    icon: <Calendar size={16} className="text-pink-600" />
  }
];

const SocialHistoryTab: React.FC<SocialHistoryTabProps> = ({ 
  data, 
  onChange,
  patientGender = 'male'
}) => {
  // 默认显示的部分
  const [sections, setSections] = useState<string[]>(['occupation', 'smoking', 'alcohol']);
  const [activeSections, setActiveSections] = useState<string[]>(['occupation']);
  
  // 新增暴露因素
  const [newExposure, setNewExposure] = useState('');
  
  // 新增烟草类型
  const [newTobaccoType, setNewTobaccoType] = useState('');
  
  // 新增酒类型
  const [newAlcoholType, setNewAlcoholType] = useState('');
  
  // 新增饮食限制
  const [newDietRestriction, setNewDietRestriction] = useState('');
  
  // 新增运动类型
  const [newExerciseType, setNewExerciseType] = useState('');
  
  // 新增睡眠问题
  const [newSleepIssue, setNewSleepIssue] = useState('');
  
  // 常见职业暴露因素
  const commonExposures = [
    '粉尘', '化学品', '噪音', '辐射', '高温', '低温', '重金属', '生物制剂'
  ];
  
  // 常见烟草类型
  const commonTobaccoTypes = [
    '卷烟', '雪茄', '烟斗', '电子烟', '水烟'
  ];
  
  // 常见酒类型
  const commonAlcoholTypes = [
    '啤酒', '红酒', '白酒', '洋酒'
  ];
  
  // 常见饮食限制
  const commonDietRestrictions = [
    '素食', '低盐', '低脂', '低糖', '无麸质', '无乳糖'
  ];
  
  // 常见运动类型
  const commonExerciseTypes = [
    '步行', '跑步', '游泳', '骑车', '健身', '瑜伽', '太极'
  ];
  
  // 常见睡眠问题
  const commonSleepIssues = [
    '入睡困难', '早醒', '睡眠中断', '打鼾', '白天嗜睡', '睡眠呼吸暂停'
  ];
  
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
    if (['occupation', 'smoking', 'alcohol'].includes(sectionId)) {
      // 不允许删除基本部分
      return;
    }
    setSections(sections.filter(id => id !== sectionId));
    setActiveSections(activeSections.filter(id => id !== sectionId));
  };
  
  const getAvailableSectionsToAdd = () => {
    const filtered = availableSections.filter(section => 
      !sections.includes(section.id) && 
      (section.id !== 'menstrual' || patientGender === 'female')
    );
    return filtered;
  };
  
  // 职业暴露因素
  const addExposure = () => {
    if (newExposure && !data.occupation.exposures.includes(newExposure)) {
      onChange('occupation', {
        ...data.occupation,
        exposures: [...data.occupation.exposures, newExposure]
      });
      setNewExposure('');
    }
  };
  
  const removeExposure = (exposure: string) => {
    onChange('occupation', {
      ...data.occupation,
      exposures: data.occupation.exposures.filter(e => e !== exposure)
    });
  };
  
  const addCommonExposure = (exposure: string) => {
    if (!data.occupation.exposures.includes(exposure)) {
      onChange('occupation', {
        ...data.occupation,
        exposures: [...data.occupation.exposures, exposure]
      });
    }
  };
  
  // 烟草类型
  const addTobaccoType = () => {
    if (newTobaccoType && !data.smoking.type.includes(newTobaccoType)) {
      onChange('smoking', {
        ...data.smoking,
        type: [...data.smoking.type, newTobaccoType]
      });
      setNewTobaccoType('');
    }
  };
  
  const removeTobaccoType = (type: string) => {
    onChange('smoking', {
      ...data.smoking,
      type: data.smoking.type.filter(t => t !== type)
    });
  };
  
  const addCommonTobaccoType = (type: string) => {
    if (!data.smoking.type.includes(type)) {
      onChange('smoking', {
        ...data.smoking,
        type: [...data.smoking.type, type]
      });
    }
  };
  
  // 酒类型
  const addAlcoholType = () => {
    if (newAlcoholType && !data.alcohol.type.includes(newAlcoholType)) {
      onChange('alcohol', {
        ...data.alcohol,
        type: [...data.alcohol.type, newAlcoholType]
      });
      setNewAlcoholType('');
    }
  };
  
  const removeAlcoholType = (type: string) => {
    onChange('alcohol', {
      ...data.alcohol,
      type: data.alcohol.type.filter(t => t !== type)
    });
  };
  
  const addCommonAlcoholType = (type: string) => {
    if (!data.alcohol.type.includes(type)) {
      onChange('alcohol', {
        ...data.alcohol,
        type: [...data.alcohol.type, type]
      });
    }
  };
  
  // 饮食限制
  const addDietRestriction = () => {
    if (newDietRestriction && !data.diet.restrictions.includes(newDietRestriction)) {
      onChange('diet', {
        ...data.diet,
        restrictions: [...data.diet.restrictions, newDietRestriction]
      });
      setNewDietRestriction('');
    }
  };
  
  const removeDietRestriction = (restriction: string) => {
    onChange('diet', {
      ...data.diet,
      restrictions: data.diet.restrictions.filter(r => r !== restriction)
    });
  };
  
  const addCommonDietRestriction = (restriction: string) => {
    if (!data.diet.restrictions.includes(restriction)) {
      onChange('diet', {
        ...data.diet,
        restrictions: [...data.diet.restrictions, restriction]
      });
    }
  };
  
  // 运动类型
  const addExerciseType = () => {
    if (newExerciseType && !data.exercise.type.includes(newExerciseType)) {
      onChange('exercise', {
        ...data.exercise,
        type: [...data.exercise.type, newExerciseType]
      });
      setNewExerciseType('');
    }
  };
  
  const removeExerciseType = (type: string) => {
    onChange('exercise', {
      ...data.exercise,
      type: data.exercise.type.filter(t => t !== type)
    });
  };
  
  const addCommonExerciseType = (type: string) => {
    if (!data.exercise.type.includes(type)) {
      onChange('exercise', {
        ...data.exercise,
        type: [...data.exercise.type, type]
      });
    }
  };
  
  // 睡眠问题
  const addSleepIssue = () => {
    if (newSleepIssue && !data.sleep.issues.includes(newSleepIssue)) {
      onChange('sleep', {
        ...data.sleep,
        issues: [...data.sleep.issues, newSleepIssue]
      });
      setNewSleepIssue('');
    }
  };
  
  const removeSleepIssue = (issue: string) => {
    onChange('sleep', {
      ...data.sleep,
      issues: data.sleep.issues.filter(i => i !== issue)
    });
  };
  
  const addCommonSleepIssue = (issue: string) => {
    if (!data.sleep.issues.includes(issue)) {
      onChange('sleep', {
        ...data.sleep,
        issues: [...data.sleep.issues, issue]
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* 添加更多部分的下拉菜单 */}
      <div className="relative mb-4">
        <div 
          id="social-history-dropdown"
          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden"
        >
          <div className="py-1">
            {getAvailableSectionsToAdd().map(section => (
              <button
                key={section.id}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
                  addSection(section.id);
                  document.getElementById('social-history-dropdown')?.classList.add('hidden');
                }}
              >
                {section.icon}
                <span className="ml-2">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
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
                  {!['occupation', 'smoking', 'alcohol'].includes(sectionId) && (
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
                  {/* 职业史 */}
                  {sectionId === 'occupation' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">当前职业</label>
                        <input
                          type="text"
                          value={data.occupation.current}
                          onChange={(e) => onChange('occupation', {...data.occupation, current: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如: 教师、工程师、医生等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">从事时间</label>
                        <input
                          type="text"
                          value={data.occupation.duration}
                          onChange={(e) => onChange('occupation', {...data.occupation, duration: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如: 5年、10个月等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">职业暴露</label>
                        
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">常见暴露因素（点击添加）：</div>
                          <div className="flex flex-wrap gap-1">
                            {commonExposures.map(exposure => (
                              <button
                                key={exposure}
                                onClick={() => addCommonExposure(exposure)}
                                disabled={data.occupation.exposures.includes(exposure)}
                                className={`px-2 py-1 text-xs rounded-full border ${
                                  data.occupation.exposures.includes(exposure)
                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
                                }`}
                              >
                                {exposure}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={newExposure}
                            onChange={(e) => setNewExposure(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addExposure()}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="输入其他暴露因素..."
                          />
                          <button
                            onClick={addExposure}
                            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                          >
                            添加
                          </button>
                        </div>
                        
                        {data.occupation.exposures.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {data.occupation.exposures.map((exposure, index) => (
                              <div key={index} className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {exposure}
                                <button
                                  onClick={() => removeExposure(exposure)}
                                  className="ml-1 text-blue-700 hover:text-blue-900"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">既往职业</label>
                        <textarea
                          value={data.occupation.previousOccupations}
                          onChange={(e) => onChange('occupation', {...data.occupation, previousOccupations: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          rows={2}
                          placeholder="请描述之前从事过的职业..."
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 吸烟史 */}
                  {sectionId === 'smoking' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">吸烟状态</label>
                        <select
                          value={data.smoking.status}
                          onChange={(e) => onChange('smoking', {...data.smoking, status: e.target.value as any})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="never">从不吸烟</option>
                          <option value="current">现在吸烟</option>
                          <option value="former">曾经吸烟</option>
                        </select>
                      </div>
                      
                      {data.smoking.status !== 'never' && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">烟草类型</label>
                            
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">常见烟草类型（点击添加）：</div>
                              <div className="flex flex-wrap gap-1">
                                {commonTobaccoTypes.map(type => (
                                  <button
                                    key={type}
                                    onClick={() => addCommonTobaccoType(type)}
                                    disabled={data.smoking.type.includes(type)}
                                    className={`px-2 py-1 text-xs rounded-full border ${
                                      data.smoking.type.includes(type)
                                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={newTobaccoType}
                                onChange={(e) => setNewTobaccoType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addTobaccoType()}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="输入其他烟草类型..."
                              />
                              <button
                                onClick={addTobaccoType}
                                className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                              >
                                添加
                              </button>
                            </div>
                            
                            {data.smoking.type.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {data.smoking.type.map((type, index) => (
                                  <div key={index} className="flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                                    {type}
                                    <button
                                      onClick={() => removeTobaccoType(type)}
                                      className="ml-1 text-orange-700 hover:text-orange-900"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">每日数量 (支)</label>
                              <input
                                type="number"
                                value={data.smoking.amountPerDay || ''}
                                onChange={(e) => onChange('smoking', {...data.smoking, amountPerDay: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 10"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">开始年龄</label>
                              <input
                                type="number"
                                value={data.smoking.startAge || ''}
                                onChange={(e) => onChange('smoking', {...data.smoking, startAge: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 18"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">吸烟年限</label>
                              <input
                                type="number"
                                value={data.smoking.duration || ''}
                                onChange={(e) => onChange('smoking', {...data.smoking, duration: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 10"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">包年</label>
                              <input
                                type="number"
                                value={data.smoking.packYears || ''}
                                onChange={(e) => onChange('smoking', {...data.smoking, packYears: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 10"
                              />
                            </div>
                          </div>
                          
                          {data.smoking.status === 'former' && (
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">戒烟年龄</label>
                              <input
                                type="number"
                                value={data.smoking.endAge || ''}
                                onChange={(e) => onChange('smoking', {...data.smoking, endAge: parseInt(e.target.value) || undefined})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 30"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* 饮酒史 */}
                  {sectionId === 'alcohol' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">饮酒状态</label>
                        <select
                          value={data.alcohol.status}
                          onChange={(e) => onChange('alcohol', {...data.alcohol, status: e.target.value as any})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="never">从不饮酒</option>
                          <option value="current">现在饮酒</option>
                          <option value="former">曾经饮酒</option>
                        </select>
                      </div>
                      
                      {data.alcohol.status !== 'never' && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">饮酒频率</label>
                            <select
                              value={data.alcohol.frequency}
                              onChange={(e) => onChange('alcohol', {...data.alcohol, frequency: e.target.value as any})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="occasional">偶尔（每月少于1次）</option>
                              <option value="weekly">每周（1-3次/周）</option>
                              <option value="daily">每天</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">酒类型</label>
                            
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">常见酒类型（点击添加）：</div>
                              <div className="flex flex-wrap gap-1">
                                {commonAlcoholTypes.map(type => (
                                  <button
                                    key={type}
                                    onClick={() => addCommonAlcoholType(type)}
                                    disabled={data.alcohol.type.includes(type)}
                                    className={`px-2 py-1 text-xs rounded-full border ${
                                      data.alcohol.type.includes(type)
                                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-red-300 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={newAlcoholType}
                                onChange={(e) => setNewAlcoholType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addAlcoholType()}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="输入其他酒类型..."
                              />
                              <button
                                onClick={addAlcoholType}
                                className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                              >
                                添加
                              </button>
                            </div>
                            
                            {data.alcohol.type.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {data.alcohol.type.map((type, index) => (
                                  <div key={index} className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                    {type}
                                    <button
                                      onClick={() => removeAlcoholType(type)}
                                      className="ml-1 text-red-700 hover:text-red-900"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">每周饮酒量 (标准杯)</label>
                              <input
                                type="number"
                                value={data.alcohol.amountPerWeek || ''}
                                onChange={(e) => onChange('alcohol', {...data.alcohol, amountPerWeek: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 7"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">饮酒年限</label>
                              <input
                                type="number"
                                value={data.alcohol.duration || ''}
                                onChange={(e) => onChange('alcohol', {...data.alcohol, duration: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 10"
                              />
                            </div>
                          </div>
                          
                          {data.alcohol.status === 'former' && (
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">最后一次饮酒</label>
                              <input
                                type="text"
                                value={data.alcohol.lastDrink || ''}
                                onChange={(e) => onChange('alcohol', {...data.alcohol, lastDrink: e.target.value})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 2年前"
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* 婚育史 */}
                  {sectionId === 'marital' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">婚姻状况</label>
                        <select
                          value={data.maritalStatus}
                          onChange={(e) => onChange('maritalStatus', e.target.value as any)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="single">未婚</option>
                          <option value="married">已婚</option>
                          <option value="divorced">离婚</option>
                          <option value="widowed">丧偶</option>
                          <option value="separated">分居</option>
                          <option value="other">其他</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">子女数量</label>
                        <input
                          type="number"
                          value={data.children || ''}
                          onChange={(e) => onChange('children', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如: 2"
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* 教育背景 */}
                  {sectionId === 'education' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">教育程度</label>
                      <select
                        value={data.education}
                        onChange={(e) => onChange('education', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="">请选择</option>
                        <option value="小学">小学</option>
                        <option value="初中">初中</option>
                        <option value="高中">高中</option>
                        <option value="大专">大专</option>
                        <option value="本科">本科</option>
                        <option value="硕士">硕士</option>
                        <option value="博士">博士</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>
                  )}
                  
                  {/* 居住情况 */}
                  {sectionId === 'living' && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">居住情况</label>
                      <input
                        type="text"
                        value={data.livingArrangement}
                        onChange={(e) => onChange('livingArrangement', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        placeholder="如: 与配偶同住、独居等"
                      />
                    </div>
                  )}
                  
                  {/* 饮食习惯 */}
                  {sectionId === 'diet' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">饮食类型</label>
                        <input
                          type="text"
                          value={data.diet.type}
                          onChange={(e) => onChange('diet', {...data.diet, type: e.target.value})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="如: 普通饮食、素食等"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">饮食限制</label>
                        
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">常见饮食限制（点击添加）：</div>
                          <div className="flex flex-wrap gap-1">
                            {commonDietRestrictions.map(restriction => (
                              <button
                                key={restriction}
                                onClick={() => addCommonDietRestriction(restriction)}
                                disabled={data.diet.restrictions.includes(restriction)}
                                className={`px-2 py-1 text-xs rounded-full border ${
                                  data.diet.restrictions.includes(restriction)
                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-pointer'
                                }`}
                              >
                                {restriction}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={newDietRestriction}
                            onChange={(e) => setNewDietRestriction(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addDietRestriction()}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="输入其他饮食限制..."
                          />
                          <button
                            onClick={addDietRestriction}
                            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                          >
                            添加
                          </button>
                        </div>
                        
                        {data.diet.restrictions.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {data.diet.restrictions.map((restriction, index) => (
                              <div key={index} className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                {restriction}
                                <button
                                  onClick={() => removeDietRestriction(restriction)}
                                  className="ml-1 text-yellow-700 hover:text-yellow-900"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="flex items-center text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={data.diet.regularMeals}
                              onChange={(e) => onChange('diet', {...data.diet, regularMeals: e.target.checked})}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            规律进餐
                          </label>
                        </div>
                        
                        <div>
                          <label className="flex items-center text-sm text-gray-600">
                            <input
                              type="checkbox"
                              checked={data.diet.caffeine}
                              onChange={(e) => onChange('diet', {...data.diet, caffeine: e.target.checked})}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                            />
                            咖啡因摄入
                          </label>
                        </div>
                      </div>
                      
                      {data.diet.caffeine && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">咖啡因摄入量</label>
                          <input
                            type="text"
                            value={data.diet.caffeineAmount || ''}
                            onChange={(e) => onChange('diet', {...data.diet, caffeineAmount: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如: 2杯咖啡/天"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* 运动习惯 */}
                  {sectionId === 'exercise' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">运动频率</label>
                        <select
                          value={data.exercise.frequency}
                          onChange={(e) => onChange('exercise', {...data.exercise, frequency: e.target.value as any})}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="never">从不运动</option>
                          <option value="occasional">偶尔（每月少于4次）</option>
                          <option value="regular">规律（每周1-3次）</option>
                          <option value="daily">每天</option>
                        </select>
                      </div>
                      
                      {data.exercise.frequency !== 'never' && (
                        <>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">运动类型</label>
                            
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">常见运动类型（点击添加）：</div>
                              <div className="flex flex-wrap gap-1">
                                {commonExerciseTypes.map(type => (
                                  <button
                                    key={type}
                                    onClick={() => addCommonExerciseType(type)}
                                    disabled={data.exercise.type.includes(type)}
                                    className={`px-2 py-1 text-xs rounded-full border ${
                                      data.exercise.type.includes(type)
                                        ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'border-teal-300 bg-teal-50 text-teal-700 hover:bg-teal-100 cursor-pointer'
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 mb-2">
                              <input
                                type="text"
                                value={newExerciseType}
                                onChange={(e) => setNewExerciseType(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && addExerciseType()}
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="输入其他运动类型..."
                              />
                              <button
                                onClick={addExerciseType}
                                className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                              >
                                添加
                              </button>
                            </div>
                            
                            {data.exercise.type.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {data.exercise.type.map((type, index) => (
                                  <div key={index} className="flex items-center px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
                                    {type}
                                    <button
                                      onClick={() => removeExerciseType(type)}
                                      className="ml-1 text-teal-700 hover:text-teal-900"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">每次时长 (分钟)</label>
                              <input
                                type="number"
                                value={data.exercise.duration || ''}
                                onChange={(e) => onChange('exercise', {...data.exercise, duration: parseInt(e.target.value) || 0})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                                placeholder="如: 30"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm text-gray-600 mb-1">运动强度</label>
                              <select
                                value={data.exercise.intensity}
                                onChange={(e) => onChange('exercise', {...data.exercise, intensity: e.target.value as any})}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              >
                                <option value="light">轻度（不出汗）</option>
                                <option value="moderate">中度（微微出汗）</option>
                                <option value="vigorous">剧烈（大量出汗）</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {/* 睡眠情况 */}
                  {sectionId === 'sleep' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">每晚睡眠时间 (小时)</label>
                          <input
                            type="number"
                            value={data.sleep.hoursPerNight || ''}
                            onChange={(e) => onChange('sleep', {...data.sleep, hoursPerNight: parseInt(e.target.value) || 0})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如: 7"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">睡眠质量</label>
                          <select
                            value={data.sleep.quality}
                            onChange={(e) => onChange('sleep', {...data.sleep, quality: e.target.value as any})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="good">良好</option>
                            <option value="fair">一般</option>
                            <option value="poor">较差</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">睡眠问题</label>
                        
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">常见睡眠问题（点击添加）：</div>
                          <div className="flex flex-wrap gap-1">
                            {commonSleepIssues.map(issue => (
                              <button
                                key={issue}
                                onClick={() => addCommonSleepIssue(issue)}
                                disabled={data.sleep.issues.includes(issue)}
                                className={`px-2 py-1 text-xs rounded-full border ${
                                  data.sleep.issues.includes(issue)
                                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer'
                                }`}
                              >
                                {issue}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mb-2">
                          <input
                            type="text"
                            value={newSleepIssue}
                            onChange={(e) => setNewSleepIssue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addSleepIssue()}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="输入其他睡眠问题..."
                          />
                          <button
                            onClick={addSleepIssue}
                            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                          >
                            添加
                          </button>
                        </div>
                        
                        {data.sleep.issues.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {data.sleep.issues.map((issue, index) => (
                              <div key={index} className="flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                                {issue}
                                <button
                                  onClick={() => removeSleepIssue(issue)}
                                  className="ml-1 text-purple-700 hover:text-purple-900"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* 月经史 - 仅女性 */}
                  {sectionId === 'menstrual' && patientGender === 'female' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">初潮年龄</label>
                          <input
                            type="number"
                            value={data.menstrualHistory?.age || ''}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              age: parseInt(e.target.value) || 0
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如: 13"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">月经规律性</label>
                          <select
                            value={data.menstrualHistory?.regularity || 'regular'}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              regularity: e.target.value as any
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="regular">规律</option>
                            <option value="irregular">不规律</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">周期 (天)</label>
                          <input
                            type="number"
                            value={data.menstrualHistory?.cycle || ''}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              cycle: parseInt(e.target.value) || 0
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如: 28"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">经量</label>
                          <select
                            value={data.menstrualHistory?.flow || 'moderate'}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              flow: e.target.value as any
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="light">少</option>
                            <option value="moderate">中等</option>
                            <option value="heavy">多</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">痛经程度</label>
                          <select
                            value={data.menstrualHistory?.pain || 'none'}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              pain: e.target.value as any
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          >
                            <option value="none">无</option>
                            <option value="mild">轻度</option>
                            <option value="moderate">中度</option>
                            <option value="severe">重度</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">末次月经</label>
                          <input
                            type="date"
                            value={data.menstrualHistory?.lastPeriod || ''}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              lastPeriod: e.target.value
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="flex items-center text-sm text-gray-600">
                          <input
                            type="checkbox"
                            checked={data.menstrualHistory?.menopause || false}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              menopause: e.target.checked
                            })}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mr-2"
                          />
                          已绝经
                        </label>
                      </div>
                      
                      {data.menstrualHistory?.menopause && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">绝经年龄</label>
                          <input
                            type="number"
                            value={data.menstrualHistory?.menopauseAge || ''}
                            onChange={(e) => onChange('menstrualHistory', {
                              ...data.menstrualHistory,
                              menopauseAge: parseInt(e.target.value) || undefined
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如: 50"
                          />
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
    </div>
  );
};

export default SocialHistoryTab;
