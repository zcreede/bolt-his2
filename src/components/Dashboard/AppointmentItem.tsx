import React from 'react';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type AppointmentStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

type AppointmentItemProps = {
  patient: {
    name: string;
    avatar: string;
    id: string;
  };
  time: string;
  reason: string;
  status: AppointmentStatus;
  onClick?: () => void;
};

const AppointmentItem: React.FC<AppointmentItemProps> = ({ 
  patient, 
  time, 
  reason, 
  status,
  onClick 
}) => {
  const { t } = useTranslation();
  
  return (
    <div 
      className="p-4 bg-white rounded-lg border border-gray-100 mb-3 transition-all hover:shadow-md cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src={patient.avatar} 
            alt={patient.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <h4 className="font-medium text-gray-800">{patient.name}</h4>
            <p className="text-xs text-gray-500">{`ID: ${patient.id}`}</p>
          </div>
        </div>
        
        <div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            status === 'ongoing' ? 'bg-green-100 text-green-800' :
            status === 'completed' ? 'bg-gray-100 text-gray-800' :
            'bg-red-100 text-red-800'
          }`}>
            {t(`dashboard.appointments.status.${status}`)}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-sm text-gray-600">{reason}</p>
        <div className="flex items-center mt-2 text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          {time}
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
