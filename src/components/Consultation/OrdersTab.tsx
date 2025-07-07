import React, { useState } from 'react';
import { Plus, X, Pill, FlaskConical, Activity, Calendar } from 'lucide-react';

interface MedicationOrder {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  route: string;
  instructions: string;
}

interface InvestigationOrder {
  id: string;
  type: 'lab' | 'imaging' | 'procedure';
  name: string;
  urgency: 'routine' | 'urgent' | 'stat';
  instructions: string;
}

interface OrdersTabProps {
  data: {
    medications: MedicationOrder[];
    investigations: InvestigationOrder[];
    generalInstructions: string;
  };
  onChange: (field: string, value: any) => void;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ data, onChange }) => {
  const [newMedication, setNewMedication] = useState<Partial<MedicationOrder>>({
    name: '', dosage: '', frequency: '', duration: '', route: 'oral', instructions: ''
  });

  const [newInvestigation, setNewInvestigation] = useState<Partial<InvestigationOrder>>({
    type: 'lab', name: '', urgency: 'routine', instructions: ''
  });

  const addMedication = () => {
    if (!newMedication.name?.trim()) return;
    
    const medication: MedicationOrder = {
      id: `med-${Date.now()}`,
      name: newMedication.name!,
      dosage: newMedication.dosage || '',
      frequency: newMedication.frequency || '',
      duration: newMedication.duration || '',
      route: newMedication.route || 'oral',
      instructions: newMedication.instructions || ''
    };

    onChange('medications', [...data.medications, medication]);
    setNewMedication({ name: '', dosage: '', frequency: '', duration: '', route: 'oral', instructions: '' });
  };

  const addInvestigation = () => {
    if (!newInvestigation.name?.trim()) return;
    
    const investigation: InvestigationOrder = {
      id: `inv-${Date.now()}`,
      type: newInvestigation.type as InvestigationOrder['type'],
      name: newInvestigation.name!,
      urgency: newInvestigation.urgency as InvestigationOrder['urgency'],
      instructions: newInvestigation.instructions || ''
    };

    onChange('investigations', [...data.investigations, investigation]);
    setNewInvestigation({ type: 'lab', name: '', urgency: 'routine', instructions: '' });
  };

  const removeMedication = (id: string) => {
    onChange('medications', data.medications.filter(m => m.id !== id));
  };

  const removeInvestigation = (id: string) => {
    onChange('investigations', data.investigations.filter(i => i.id !== id));
  };

  const getUrgencyColor = (urgency: InvestigationOrder['urgency']) => {
    switch (urgency) {
      case 'stat': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'routine': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: InvestigationOrder['type']) => {
    switch (type) {
      case 'lab': return <FlaskConical size={16} className="text-purple-600" />;
      case 'imaging': return <Activity size={16} className="text-blue-600" />;
      case 'procedure': return <Calendar size={16} className="text-green-600" />;
      default: return <FlaskConical size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* 药物医嘱 */}
      <div>
        <div className="flex items-center mb-3">
          <Pill size={18} className="text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">药物医嘱</h3>
        </div>

        {/* 现有药物 */}
        <div className="space-y-3 mb-4">
          {data.medications.map((medication) => (
            <div key={medication.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">药品名称</label>
                    <div className="font-medium">{medication.name}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">剂量</label>
                    <div>{medication.dosage}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">频次</label>
                    <div>{medication.frequency}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">疗程</label>
                    <div>{medication.duration}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">给药途径</label>
                    <div>{medication.route}</div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">用药说明</label>
                    <div className="text-sm text-gray-600">{medication.instructions}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeMedication(medication.id)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加新药物 */}
        <div className="border border-dashed border-gray-300 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={newMedication.name || ''}
              onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
              placeholder="药品名称"
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <input
              type="text"
              value={newMedication.dosage || ''}
              onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
              placeholder="剂量 (如: 500mg)"
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <select
              value={newMedication.frequency || ''}
              onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="">选择频次</option>
              <option value="qd">每日一次</option>
              <option value="bid">每日两次</option>
              <option value="tid">每日三次</option>
              <option value="qid">每日四次</option>
              <option value="q8h">每8小时一次</option>
              <option value="prn">必要时</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <input
              type="text"
              value={newMedication.duration || ''}
              onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
              placeholder="疗程 (如: 7天)"
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <select
              value={newMedication.route || 'oral'}
              onChange={(e) => setNewMedication({ ...newMedication, route: e.target.value })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="oral">口服</option>
              <option value="iv">静脉注射</option>
              <option value="im">肌肉注射</option>
              <option value="topical">外用</option>
              <option value="sublingual">舌下含服</option>
            </select>
            <input
              type="text"
              value={newMedication.instructions || ''}
              onChange={(e) => setNewMedication({ ...newMedication, instructions: e.target.value })}
              placeholder="用药说明"
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <button
            onClick={addMedication}
            disabled={!newMedication.name?.trim()}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-gray-300"
          >
            <Plus size={16} className="inline mr-1" />
            添加药物
          </button>
        </div>
      </div>

      {/* 检查检验医嘱 */}
      <div>
        <div className="flex items-center mb-3">
          <FlaskConical size={18} className="text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">检查检验医嘱</h3>
        </div>

        {/* 现有检查 */}
        <div className="space-y-3 mb-4">
          {data.investigations.map((investigation) => (
            <div key={investigation.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getTypeIcon(investigation.type)}
                    <span className="font-medium">{investigation.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(investigation.urgency)}`}>
                      {investigation.urgency === 'stat' ? '急查' : 
                       investigation.urgency === 'urgent' ? '加急' : '常规'}
                    </span>
                  </div>
                  {investigation.instructions && (
                    <div className="text-sm text-gray-600">{investigation.instructions}</div>
                  )}
                </div>
                <button
                  onClick={() => removeInvestigation(investigation.id)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 添加新检查 */}
        <div className="border border-dashed border-gray-300 rounded-lg p-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <select
              value={newInvestigation.type || 'lab'}
              onChange={(e) => setNewInvestigation({ ...newInvestigation, type: e.target.value as InvestigationOrder['type'] })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="lab">化验检查</option>
              <option value="imaging">影像检查</option>
              <option value="procedure">特殊检查</option>
            </select>
            <input
              type="text"
              value={newInvestigation.name || ''}
              onChange={(e) => setNewInvestigation({ ...newInvestigation, name: e.target.value })}
              placeholder="检查项目名称"
              className="text-sm border border-gray-300 rounded px-2 py-1"
            />
            <select
              value={newInvestigation.urgency || 'routine'}
              onChange={(e) => setNewInvestigation({ ...newInvestigation, urgency: e.target.value as InvestigationOrder['urgency'] })}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="routine">常规</option>
              <option value="urgent">加急</option>
              <option value="stat">急查</option>
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              value={newInvestigation.instructions || ''}
              onChange={(e) => setNewInvestigation({ ...newInvestigation, instructions: e.target.value })}
              placeholder="检查说明"
              className="w-full text-sm border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <button
            onClick={addInvestigation}
            disabled={!newInvestigation.name?.trim()}
            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-300"
          >
            <Plus size={16} className="inline mr-1" />
            添加检查
          </button>
        </div>
      </div>

      {/* 一般医嘱 */}
      <div>
        <div className="flex items-center mb-3">
          <Calendar size={18} className="text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-800">一般医嘱</h3>
        </div>
        <textarea
          value={data.generalInstructions}
          onChange={(e) => onChange('generalInstructions', e.target.value)}
          placeholder="请输入护理医嘱、饮食医嘱、活动医嘱等一般医嘱..."
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};

export default OrdersTab;
