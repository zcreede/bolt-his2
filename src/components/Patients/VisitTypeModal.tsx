import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserCheck } from 'lucide-react';

type VisitTypeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
};

const VisitTypeModal: React.FC<VisitTypeModalProps> = ({ isOpen, onClose, patientId }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelectType = (type: 'normal' | 'return') => {
    navigate(`/consultation?patientId=${patientId}&visitType=${type}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-6">
          请选择就诊类型
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelectType('normal')}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <UserPlus size={32} className="text-primary-600 mb-3" />
            <span className="text-gray-900 font-medium">初诊</span>
            <span className="text-sm text-gray-500 mt-1">首次就诊</span>
          </button>

          <button
            onClick={() => handleSelectType('return')}
            className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <UserCheck size={32} className="text-primary-600 mb-3" />
            <span className="text-gray-900 font-medium">复诊</span>
            <span className="text-sm text-gray-500 mt-1">再次就诊</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitTypeModal;
