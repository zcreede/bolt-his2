import React from 'react';
import { X, Phone, Mail, Calendar, FileText, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PatientDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  patient: {
    id: string;
    name: string;
    avatar: string;
    age: number;
    gender: string;
    phone: string;
    email: string;
    lastVisit: string;
    medicalHistory?: string;
    allergies?: string;
    upcomingAppointments?: Array<{
      id: string;
      date: string;
      time: string;
      doctor: string;
      type: string;
    }>;
    recentRecords?: Array<{
      id: string;
      date: string;
      title: string;
      doctor: string;
      type: string;
    }>;
  };
};

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  onEdit,
  onDelete,
  patient 
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={patient.avatar} 
              alt={patient.name} 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-100"
            />
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
              <p className="text-sm text-gray-500">ID: {patient.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title={t('common.edit')}
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title={t('common.delete')}
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4">{t('patients.details.basicInfo')}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium mr-2">{t('patients.age')}:</span>
                    {patient.age} {t('patients.age')}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium mr-2">{t('patients.gender.title')}:</span>
                    {t(`patients.gender.${patient.gender.toLowerCase()}`)}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    {patient.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {patient.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium mr-2">{t('patients.lastVisit')}:</span>
                    {patient.lastVisit}
                  </div>
                </div>
              </div>

              {/* Medical History & Allergies */}
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-4">{t('patients.details.medicalInfo')}</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FileText size={16} className="mr-2 text-gray-400" />
                      {t('patients.addNew.medicalHistory')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {patient.medicalHistory || t('patients.details.noMedicalHistory')}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <AlertCircle size={16} className="mr-2 text-gray-400" />
                      {t('patients.addNew.allergies')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {patient.allergies || t('patients.details.noAllergies')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments and Records */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Appointments */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">{t('patients.details.upcomingAppointments')}</h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    {t('patients.schedule')}
                  </button>
                </div>

                {patient.upcomingAppointments && patient.upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {patient.upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{appointment.type}</p>
                            <p className="text-xs text-gray-500">{t('patients.details.with')} {appointment.doctor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-800">{appointment.date}</p>
                            <p className="text-xs text-gray-500">{appointment.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                    {t('patients.details.noUpcomingAppointments')}
                  </p>
                )}
              </div>

              {/* Recent Medical Records */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">{t('patients.details.recentRecords')}</h3>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    {t('common.viewAll')}
                  </button>
                </div>

                {patient.recentRecords && patient.recentRecords.length > 0 ? (
                  <div className="space-y-3">
                    {patient.recentRecords.map((record) => (
                      <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{record.title}</p>
                            <p className="text-xs text-gray-500">{t('patients.details.by')} {record.doctor}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-800">{record.date}</p>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {record.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
                    {t('patients.details.noRecentRecords')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsModal;
