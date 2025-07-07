import React, { useState } from 'react';
import { Search, Filter, Plus, Calendar, Clock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type Appointment = {
  id: string;
  patientName: string;
  patientId: string;
  patientAvatar: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  type: 'regular' | 'follow-up' | 'emergency';
};

const Appointments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const { t } = useTranslation();
  
  // Sample data - would come from API in real application
  const appointments: Appointment[] = [
    {
      id: "APT-001",
      patientName: "Alex Johnson",
      patientId: "P-12345",
      patientAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      doctorName: "Dr. Sarah Wilson",
      department: "Cardiology",
      date: "2025-05-25",
      time: "09:00",
      status: "scheduled",
      type: "regular"
    },
    {
      id: "APT-002",
      patientName: "Maria Garcia",
      patientId: "P-12346",
      patientAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      doctorName: "Dr. James Anderson",
      department: "Neurology",
      date: "2025-05-25",
      time: "10:30",
      status: "scheduled",
      type: "follow-up"
    },
    {
      id: "APT-003",
      patientName: "David Chen",
      patientId: "P-12347",
      patientAvatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
      doctorName: "Dr. Emma Davis",
      department: "Orthopedics",
      date: "2025-05-25",
      time: "11:45",
      status: "in-progress",
      type: "emergency"
    }
  ];

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'regular':
        return 'bg-gray-100 text-gray-800';
      case 'follow-up':
        return 'bg-purple-100 text-purple-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Appointment['status']) => {
    return t(`appointments.status.${status.replace('-', '')}`);
  };

  const getTypeLabel = (type: Appointment['type']) => {
    return t(`appointments.schedule.appointmentType.${type.replace('-', '')}`);
  };

  const filteredAppointments = appointments.filter(appointment => 
    appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('appointments.title')}</h1>
          <p className="text-gray-600">{t('appointments.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowNewAppointment(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {t('appointments.new')}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('appointments.search')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500">
            <Filter size={16} className="mr-2" />
            {t('common.filter')}
          </button>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center">
                  <img 
                    src={appointment.patientAvatar}
                    alt={appointment.patientName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div className="ml-3">
                    <h3 className="font-medium text-gray-800">{appointment.patientName}</h3>
                    <p className="text-sm text-gray-500">{appointment.patientId}</p>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusLabel(appointment.status)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                    {getTypeLabel(appointment.type)}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <User size={16} className="mr-2 text-gray-400" />
                  {appointment.doctorName}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  {new Date(appointment.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 text-gray-400" />
                  {appointment.time}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  {t('common.edit')}
                </button>
                <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">
                  {t('common.cancel')}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('appointments.noResults')}</h3>
          <p className="text-gray-500 mb-4">
            {t('appointments.noResultsDesc')}
          </p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => setSearchQuery('')}
          >
            {t('common.clear')}
          </button>
        </div>
      )}

      {/* New Appointment Modal */}
      {showNewAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('appointments.schedule.title')}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('appointments.schedule.selectPatient')}
                </label>
                <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">{t('appointments.schedule.selectPatient')}</option>
                  <option value="P-12345">Alex Johnson (P-12345)</option>
                  <option value="P-12346">Maria Garcia (P-12346)</option>
                  <option value="P-12347">David Chen (P-12347)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('appointments.schedule.selectDoctor')}
                </label>
                <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="">{t('appointments.schedule.selectDoctor')}</option>
                  <option value="D-001">Dr. Sarah Wilson (Cardiology)</option>
                  <option value="D-002">Dr. James Anderson (Neurology)</option>
                  <option value="D-003">Dr. Emma Davis (Orthopedics)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.date')}
                  </label>
                  <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('common.time')}
                  </label>
                  <input 
                    type="time" 
                    className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.type')}
                </label>
                <select className="w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="regular">{t('appointments.schedule.appointmentType.regular')}</option>
                  <option value="follow-up">{t('appointments.schedule.appointmentType.followUp')}</option>
                  <option value="emergency">{t('appointments.schedule.appointmentType.emergency')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('common.notes')}
                </label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                  rows={3}
                  placeholder={t('appointments.schedule.addNotes')}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewAppointment(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              >
                {t('common.cancel')}
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">
                {t('common.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
