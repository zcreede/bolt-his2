import React, { useState } from 'react';
import { Phone, Mail, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import RegistrationModal from './RegistrationModal';
import VisitTypeModal from './VisitTypeModal';

type PatientCardProps = {
  patient: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisit: string;
  };
  onViewDetails: () => void;
  onSchedule: () => void;
};

const PatientCard: React.FC<PatientCardProps> = ({ patient, onViewDetails }) => {
  const { t } = useTranslation();
  const [showRegistration, setShowRegistration] = useState(false);
  const [showVisitType, setShowVisitType] = useState(false);

  const handleRegistration = () => {
    setShowRegistration(true);
  };

  const handleStartVisit = () => {
    setShowVisitType(true);
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md">
        <div className="p-4">
          <div className="flex items-center">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
            />
            <div className="ml-4">
              <h3 className="font-semibold text-gray-800">{patient.name}</h3>
              <div className="flex mt-1 text-xs text-gray-500">
                <span className="mr-3">{patient.age} {t('patients.age')}</span>
                <span>{t(`patients.gender.${patient.gender.toLowerCase()}`)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">ID: {patient.id}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone size={14} className="mr-2 text-gray-400" />
              {patient.phone}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Mail size={14} className="mr-2 text-gray-400" />
              {patient.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={14} className="mr-2 text-gray-400" />
              {t('patients.lastVisit')}: {patient.lastVisit}
            </div>
          </div>
        </div>
        
        <div className="flex border-t border-gray-100">
          <button 
            onClick={onViewDetails}
            className="flex-1 py-2 text-sm text-center text-primary-600 hover:bg-primary-50 transition-colors"
          >
            {t('patients.viewDetails')}
          </button>
          <button 
            onClick={handleRegistration}
            className="flex-1 py-2 text-sm text-center text-primary-600 border-l border-gray-100 hover:bg-primary-50 transition-colors"
          >
            门诊挂号
          </button>
          <button 
            onClick={handleStartVisit}
            className="flex-1 py-2 text-sm text-center text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            开始接诊
          </button>
        </div>
      </div>

      <RegistrationModal
        isOpen={showRegistration}
        onClose={() => setShowRegistration(false)}
        patientId={patient.id}
        patientName={patient.name}
      />

      <VisitTypeModal
        isOpen={showVisitType}
        onClose={() => setShowVisitType(false)}
        patientId={patient.id}
      />
    </>
  );
};

export default PatientCard;
