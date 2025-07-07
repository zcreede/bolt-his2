import React from 'react';
import { useTranslation } from 'react-i18next';
import { Receipt } from 'lucide-react';

const Billing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">收费管理</h1>
          <p className="text-gray-600">管理患者费用和收费记录</p>
        </div>
      </div>

      {/* 临时的开发中提示 */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Receipt size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">功能开发中</h3>
        <p className="text-gray-500">
          收费管理功能正在开发中，敬请期待...
        </p>
      </div>
    </div>
  );
};

export default Billing;
