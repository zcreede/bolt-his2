import React, { useState } from 'react';
import { User, Stethoscope, Scissors, Ban as Bandage, Droplets, Pill, Syringe, Plus, X, ChevronDown, ChevronRight } from 'lucide-react';

interface PastHistoryTabProps {
  value: string;
  onChange: (value: string) => void;
}

const PastHistoryTab: React.FC<PastHistoryTabProps> = ({ value, onChange }) => {
  // 可用的部分
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
  
  // 默认显示的部分
  const [sections, setSections] = useState<string[]>(['diseases']);
  const [activeSections, setActiveSections] = useState<string[]>(['diseases']);
  
  // 新增疾病
  const [newDisease, setNewDisease] = useState({
    name: '',
    diagnosisYear: '',
    status: 'active' as 'active' | 'resolved' | 'controlled',
    treatment: ''
  });
  
  // 新增手术
  const [newSurgery, setNewSurgery] = useState({
    name: '',
    year: '',
    hospital: '',
    complications: ''
  });
  
  // 新增过敏
  const [newAllergy, setNewAllergy] = useState({
    allergen: '',
    reaction: '',
    severity: 'moderate' as 'mild' | 'moderate' | 'severe',
    year: ''
  });
  
  // 常见疾病
  const commonDiseases = [
    '高血压', '糖尿病', '冠心病', '哮喘', '慢性阻塞性肺疾病', 
    '胃炎', '胃溃疡', '肝炎', '肾结石', '甲状腺功能亢进症'
  ];
  
  // 常见手术
  const commonSurgeries = [
    '阑尾切除术', '胆囊切除术', '疝气修补术', '剖腹产', '扁桃体切除术', 
    '骨折内固定术', '白内障手术', '心脏搭桥术', '胃旁路术'
  ];
  
  // 常见过敏原
  const commonAllergens = [
    '青霉素', '磺胺类', '阿司匹林', '布洛芬', '海鲜', '花粉', '尘螨', '乳制品', '花生', '小麦'
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
    if (sectionId === 'diseases') {
      // 不允许删除疾病史
      return;
    }
    setSections(sections.filter(id => id !== sectionId));
    setActiveSections(activeSections.filter(id => id !== sectionId));
  };
  
  const getAvailableSectionsToAdd = () => {
    return availableSections.filter(section => !sections.includes(section.id));
  };
  
  // 疾病相关
  const [diseases, setDiseases] = useState<{
    name: string;
    diagnosisYear?: string;
    status: 'active' | 'resolved' | 'controlled';
    treatment?: string;
  }[]>([]);
  
  const addDisease = () => {
    if (newDisease.name) {
      setDiseases([...diseases, {...newDisease}]);
      setNewDisease({
        name: '',
        diagnosisYear: '',
        status: 'active',
        treatment: ''
      });
    }
  };
  
  const removeDisease = (index: number) => {
    setDiseases(diseases.filter((_, i) => i !== index));
  };
  
  const addCommonDisease = (disease: string) => {
    setNewDisease({...newDisease, name: disease});
  };
  
  // 手术相关
  const [surgeries, setSurgeries] = useState<{
    name: string;
    year: string;
    hospital?: string;
    complications?: string;
  }[]>([]);
  
  const addSurgery = () => {
    if (newSurgery.name && newSurgery.year) {
      setSurgeries([...surgeries, {...newSurgery}]);
      setNewSurgery({
        name: '',
        year: '',
        hospital: '',
        complications: ''
      });
    }
  };
  
  const removeSurgery = (index: number) => {
    setSurgeries(surgeries.filter((_, i) => i !== index));
  };
  
  const addCommonSurgery = (surgery: string) => {
    setNewSurgery({...newSurgery, name: surgery});
  };
  
  // 过敏相关
  const [allergies, setAllergies] = useState<{
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
    year?: string;
  }[]>([]);
  
  const addAllergy = () => {
    if (newAllergy.allergen && newAllergy.reaction) {
      setAllergies([...allergies, {...newAllergy}]);
      setNewAllergy({
        allergen: '',
        reaction: '',
        severity: 'moderate',
        year: ''
      });
    }
  };
  
  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index));
  };
  
  const addCommonAllergen = (allergen: string) => {
    setNewAllergy({...newAllergy, allergen});
  };

  return (
    <div className="space-y-4">
      {/* 添加更多部分的下拉菜单 */}
      <div id="past-history-dropdown-container" className="relative mb-4">
        <div className="flex justify-end">
          <button
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
            onClick={() => document.getElementById('past-history-dropdown')?.classList.toggle('hidden')}
          >
            <Plus size={16} className="mr-1" />
            添加更多既往史
          </button>
        </div>
        
        <div 
          id="past-history-dropdown"
          className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 hidden"
        >
          <div className="py-1">
            {getAvailableSectionsToAdd().map(section => (
              <button
                key={section.id}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                onClick={() => {
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
                  {/* 疾病史 */}
                  {sectionId === 'diseases' && (
                    <div>
                      {/* 已添加的疾病 */}
                      {diseases.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {diseases.map((disease, index) => (
                            <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                              <div>
                                <div className="font-medium text-gray-800">{disease.name}</div>
                                <div className="text-sm text-gray-600">
                                  {disease.diagnosisYear && `诊断年份: ${disease.diagnosisYear} • `}
                                  状态: {
                                    disease.status === 'active' ? '活动期' : 
                                    disease.status === 'controlled' ? '控制中' : '已解决'
                                  }
                                  {disease.treatment && ` • 治疗: ${disease.treatment}`}
                                </div>
                              </div>
                              <button
                                onClick={() => removeDisease(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 添加新疾病 */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">疾病名称 *</label>
                          <div className="mb-2">
                            <input
                              type="text"
                              value={newDisease.name}
                              onChange={(e) => setNewDisease({...newDisease, name: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="输入疾病名称"
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-1">常见疾病（点击选择）：</div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {commonDiseases.map(disease => (
                              <button
                                key={disease}
                                onClick={() => addCommonDisease(disease)}
                                className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100"
                              >
                                {disease}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">诊断年份</label>
                            <input
                              type="text"
                              value={newDisease.diagnosisYear}
                              onChange={(e) => setNewDisease({...newDisease, diagnosisYear: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="如：2020"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">当前状态</label>
                            <select
                              value={newDisease.status}
                              onChange={(e) => setNewDisease({...newDisease, status: e.target.value as any})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="active">活动期</option>
                              <option value="controlled">控制中</option>
                              <option value="resolved">已解决</option>
                            </select>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">治疗方法</label>
                          <input
                            type="text"
                            value={newDisease.treatment}
                            onChange={(e) => setNewDisease({...newDisease, treatment: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如：药物治疗、手术等"
                          />
                        </div>
                        
                        <button
                          onClick={addDisease}
                          disabled={!newDisease.name}
                          className={`w-full py-2 text-sm font-medium rounded-lg ${
                            newDisease.name
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus size={16} className="inline mr-1" />
                          添加疾病
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 手术史 */}
                  {sectionId === 'surgeries' && (
                    <div>
                      {/* 已添加的手术 */}
                      {surgeries.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {surgeries.map((surgery, index) => (
                            <div key={index} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-lg p-3">
                              <div>
                                <div className="font-medium text-gray-800">{surgery.name}</div>
                                <div className="text-sm text-gray-600">
                                  {surgery.year && `年份: ${surgery.year}`}
                                  {surgery.hospital && ` • 医院: ${surgery.hospital}`}
                                  {surgery.complications && ` • 并发症: ${surgery.complications}`}
                                </div>
                              </div>
                              <button
                                onClick={() => removeSurgery(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 添加新手术 */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">手术名称 *</label>
                          <div className="mb-2">
                            <input
                              type="text"
                              value={newSurgery.name}
                              onChange={(e) => setNewSurgery({...newSurgery, name: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="输入手术名称"
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-1">常见手术（点击选择）：</div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {commonSurgeries.map(surgery => (
                              <button
                                key={surgery}
                                onClick={() => addCommonSurgery(surgery)}
                                className="px-2 py-1 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full hover:bg-orange-100"
                              >
                                {surgery}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">手术年份 *</label>
                            <input
                              type="text"
                              value={newSurgery.year}
                              onChange={(e) => setNewSurgery({...newSurgery, year: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="如：2020"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">手术医院</label>
                            <input
                              type="text"
                              value={newSurgery.hospital}
                              onChange={(e) => setNewSurgery({...newSurgery, hospital: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="如：北京协和医院"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">并发症</label>
                          <input
                            type="text"
                            value={newSurgery.complications}
                            onChange={(e) => setNewSurgery({...newSurgery, complications: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如有并发症请填写"
                          />
                        </div>
                        
                        <button
                          onClick={addSurgery}
                          disabled={!newSurgery.name || !newSurgery.year}
                          className={`w-full py-2 text-sm font-medium rounded-lg ${
                            newSurgery.name && newSurgery.year
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus size={16} className="inline mr-1" />
                          添加手术
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 过敏史 */}
                  {sectionId === 'allergies' && (
                    <div>
                      {/* 已添加的过敏 */}
                      {allergies.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {allergies.map((allergy, index) => (
                            <div key={index} className="flex items-center justify-between bg-purple-50 border border-purple-200 rounded-lg p-3">
                              <div>
                                <div className="font-medium text-gray-800">{allergy.allergen}</div>
                                <div className="text-sm text-gray-600">
                                  反应: {allergy.reaction} • 
                                  严重程度: {
                                    allergy.severity === 'mild' ? '轻度' : 
                                    allergy.severity === 'moderate' ? '中度' : '重度'
                                  }
                                  {allergy.year && ` • 首次发现: ${allergy.year}`}
                                </div>
                              </div>
                              <button
                                onClick={() => removeAllergy(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* 添加新过敏 */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">过敏原 *</label>
                          <div className="mb-2">
                            <input
                              type="text"
                              value={newAllergy.allergen}
                              onChange={(e) => setNewAllergy({...newAllergy, allergen: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="输入过敏原"
                            />
                          </div>
                          
                          <div className="text-xs text-gray-500 mb-1">常见过敏原（点击选择）：</div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {commonAllergens.map(allergen => (
                              <button
                                key={allergen}
                                onClick={() => addCommonAllergen(allergen)}
                                className="px-2 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 rounded-full hover:bg-purple-100"
                              >
                                {allergen}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">过敏反应 *</label>
                          <input
                            type="text"
                            value={newAllergy.reaction}
                            onChange={(e) => setNewAllergy({...newAllergy, reaction: e.target.value})}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="如：皮疹、荨麻疹、呼吸困难等"
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">严重程度</label>
                            <select
                              value={newAllergy.severity}
                              onChange={(e) => setNewAllergy({...newAllergy, severity: e.target.value as any})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                            >
                              <option value="mild">轻度</option>
                              <option value="moderate">中度</option>
                              <option value="severe">重度</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">首次发现年份</label>
                            <input
                              type="text"
                              value={newAllergy.year}
                              onChange={(e) => setNewAllergy({...newAllergy, year: e.target.value})}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
                              placeholder="如：2020"
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={addAllergy}
                          disabled={!newAllergy.allergen || !newAllergy.reaction}
                          className={`w-full py-2 text-sm font-medium rounded-lg ${
                            newAllergy.allergen && newAllergy.reaction
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <Plus size={16} className="inline mr-1" />
                          添加过敏史
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* 外伤史 */}
                  {sectionId === 'injuries' && (
                    <div>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        rows={3}
                        placeholder="请输入外伤史信息..."
                      />
                    </div>
                  )}
                  
                  {/* 用药史 */}
                  {sectionId === 'medications' && (
                    <div>
                      <textarea
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        rows={3}
                        placeholder="请输入用药史信息..."
                      />
                    </div>
                  )}
                  
                  {/* 接种史 */}
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          其他既往史信息
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          rows={4}
          placeholder="请记录其他既往史信息..."
        />
      </div>
    </div>
  );
};

export default PastHistoryTab;
