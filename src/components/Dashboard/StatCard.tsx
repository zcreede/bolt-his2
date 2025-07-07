import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
  textColor?: string;
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  change, 
  bgColor = 'bg-white', 
  textColor = 'text-gray-800' 
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <h3 className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</h3>
          
          {change && (
            <div className="flex items-center mt-2">
              {change.isPositive ? (
                <TrendingUp size={16} className="text-green-500 mr-1" />
              ) : (
                <TrendingDown size={16} className="text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${
                change.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {change.isPositive ? '+' : ''}{change.value}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-lg bg-gray-100">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
