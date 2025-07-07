import React, { useState } from 'react';
import { 
  Users, 
  Dna, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';

interface FamilyHistoryTabProps {
  value: string;
  onChange: (value: string) => void;
}

const FamilyHistoryTab: React.FC<FamilyHistoryTabProps> = ({ value, onChange }) => {
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
    <div className="space-y-4">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          其他家族史信息
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
          rows={4}
          placeholder="请记录其他家族史信息..."
        />
        <div className="mt-2 text-xs text-gray-500">
          重点关注：遗传性疾病、肿瘤、心血管疾病、糖尿病等家族史
        </div>
      </div>
    </div>
  );
};

export default FamilyHistoryTab;
