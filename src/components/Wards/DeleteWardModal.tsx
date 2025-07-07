import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type DeleteWardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  wardName: string;
};

const DeleteWardModal: React.FC<DeleteWardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  wardName,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            关闭病区
          </h3>
          
          <p className="text-sm text-gray-600 text-center mb-6">
            确定要关闭 {wardName} 吗？此操作无法撤销。
          </p>
          
          <div className="flex justify-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              确认关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteWardModal;
