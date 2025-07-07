import React, { useState } from 'react';
import { User, Calendar, Phone, MapPin, AlertTriangle, Heart, Edit2, Save, X } from 'lucide-react';

interface PatientSummaryProps {
  patient: {
    id: string;
    name: string;
    age: number;
    gender: string;
    phone?: string;
    address?: string;
    visitType?: 'normal' | 'return';
    chiefComplaint?: string;
    allergies?: string[];
    chronicConditions?: string[];
    lastVisit?: string;
  };
  onChiefComplaintUpdate?: (newComplaint: string) => void;
}

const PatientSummary: React.FC<PatientSummaryProps> = ({ patient, onChiefComplaintUpdate }) => {
  const [isEditingComplaint, setIsEditingComplaint] = useState(false);
  const [editedComplaint, setEditedComplaint] = useState(patient.chiefComplaint || '');

  const handleSaveComplaint = () => {
    if (onChiefComplaintUpdate) {
      onChiefComplaintUpdate(editedComplaint);
    }
    setIsEditingComplaint(false);
  };

  const handleCancelEdit = () => {
    setEditedComplaint(patient.chiefComplaint || '');
    setIsEditingComplaint(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-primary-600" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-800">{patient.name}</h2>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{patient.age}岁</span>
              <span>{patient.gender === 'male' ? '男' : '女'}</span>
              <span>ID: {patient.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            patient.visitType === 'return' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
          }`}>
            {patient.visitType === 'return' ? '复诊' : '初诊'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        {patient.phone && (
          <div className="flex items-center text-gray-600">
            <Phone size={14} className="mr-2" />
            {patient.phone}
          </div>
        )}
        {patient.address && (
          <div className="flex items-center text-gray-600">
            <MapPin size={14} className="mr-2" />
            {patient.address}
          </div>
        )}
        {patient.lastVisit && (
          <div className="flex items-center text-gray-600">
            <Calendar size={14} className="mr-2" />
            上次就诊: {patient.lastVisit}
          </div>
        )}
      </div>

      {/* 过敏史和慢性病 */}
      {(patient.allergies?.length || patient.chronicConditions?.length) && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {patient.allergies?.length && (
            <div className="mb-2">
              <div className="flex items-center text-red-600 text-sm font-medium mb-1">
                <AlertTriangle size={14} className="mr-1" />
                过敏史
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.map((allergy, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
          {patient.chronicConditions?.length && (
            <div>
              <div className="flex items-center text-orange-600 text-sm font-medium mb-1">
                <Heart size={14} className="mr-1" />
                慢性病史
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.chronicConditions.map((condition, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 主诉 - 可编辑 */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">主诉</div>
          {!isEditingComplaint && onChiefComplaintUpdate && (
            <button
              onClick={() => setIsEditingComplaint(true)}
              className="text-xs text-primary-600 hover:text-primary-700 flex items-center"
            >
              <Edit2 size={12} className="mr-1" />
              编辑
            </button>
          )}
        </div>
        
        {isEditingComplaint ? (
          <div className="space-y-2">
            <textarea
              value={editedComplaint}
              onChange={(e) => setEditedComplaint(e.target.value)}
              rows={3}
              className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="请输入或修改主诉信息..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-700 border border-gray-300 rounded"
              >
                <X size={12} className="inline mr-1" />
                取消
              </button>
              <button
                onClick={handleSaveComplaint}
                className="px-3 py-1 text-xs text-white bg-primary-600 hover:bg-primary-700 rounded"
              >
                <Save size={12} className="inline mr-1" />
                保存
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-200">
            {patient.chiefComplaint || (
              <span className="text-gray-400 italic">
                暂无主诉信息
                {onChiefComplaintUpdate && (
                  <button
                    onClick={() => setIsEditingComplaint(true)}
                    className="ml-2 text-primary-600 hover:text-primary-700 underline"
                  >
                    点击添加
                  </button>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSummary;
