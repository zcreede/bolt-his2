import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, CalendarRange, UserRound, Building2, Clock } from 'lucide-react';
import AddScheduleModal from '../components/Schedules/AddScheduleModal';
import DeleteScheduleModal from '../components/Schedules/DeleteScheduleModal';
import type { ScheduleFormData } from '../components/Schedules/AddScheduleModal';

type Schedule = {
  id: string;
  doctor: {
    id: string;
    name: string;
    avatar: string;
    specialty: string;
  };
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  breakTime?: string;
  maxPatients: number;
  bookedPatients: number;
  status: 'available' | 'booked' | 'onLeave' | 'holiday';
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
};

const Schedules: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewSchedule, setShowNewSchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Sample data - would come from API in real application
  const schedules: Schedule[] = [
    {
      id: "SCH-001",
      doctor: {
        id: "D-001",
        name: "Dr. Sarah Wilson",
        avatar: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialty: "Cardiology"
      },
      department: "Cardiology Department",
      date: "2025-05-25",
      startTime: "09:00",
      endTime: "17:00",
      breakTime: "13:00-14:00",
      maxPatients: 20,
      bookedPatients: 15,
      status: "available",
      repeat: "weekly"
    },
    {
      id: "SCH-002",
      doctor: {
        id: "D-002",
        name: "Dr. James Anderson",
        avatar: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialty: "Neurology"
      },
      department: "Neurology Department",
      date: "2025-05-25",
      startTime: "10:00",
      endTime: "18:00",
      breakTime: "14:00-15:00",
      maxPatients: 15,
      bookedPatients: 15,
      status: "booked",
      repeat: "weekly"
    },
    {
      id: "SCH-003",
      doctor: {
        id: "D-003",
        name: "Dr. Emma Davis",
        avatar: "https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=150",
        specialty: "Orthopedics"
      },
      department: "Orthopedics Department",
      date: "2025-05-25",
      startTime: "08:00",
      endTime: "16:00",
      breakTime: "12:00-13:00",
      maxPatients: 18,
      bookedPatients: 0,
      status: "onLeave",
      repeat: "none"
    }
  ];

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'booked':
        return 'bg-orange-100 text-orange-800';
      case 'onLeave':
        return 'bg-yellow-100 text-yellow-800';
      case 'holiday':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRepeatLabel = (repeat: Schedule['repeat']) => {
    return t(`schedules.form.repeatOptions.${repeat}`);
  };

  const filteredSchedules = schedules.filter(schedule =>
    schedule.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    schedule.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSchedule = (scheduleData: ScheduleFormData) => {
    // Here you would typically make an API call to add the schedule
    console.log('Adding new schedule:', scheduleData);
    setShowNewSchedule(false);
  };

  const handleEditSchedule = (scheduleData: ScheduleFormData) => {
    // Here you would typically make an API call to update the schedule
    console.log('Updating schedule:', scheduleData);
    setIsEditMode(false);
    setSelectedSchedule(null);
  };

  const handleDeleteSchedule = () => {
    // Here you would typically make an API call to delete the schedule
    console.log('Deleting schedule:', selectedSchedule?.id);
    setIsDeleteModalOpen(false);
    setSelectedSchedule(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('schedules.title')}</h1>
          <p className="text-gray-600">{t('schedules.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowNewSchedule(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {t('schedules.new')}
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
              placeholder={t('schedules.search')}
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

      {/* Schedules List */}
      {filteredSchedules.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSchedules.map((schedule) => (
            <div 
              key={schedule.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img 
                      src={schedule.doctor.avatar}
                      alt={schedule.doctor.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-primary-100"
                    />
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{schedule.doctor.name}</h3>
                      <p className="text-sm text-gray-500">{schedule.doctor.specialty}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(schedule.status)}`}>
                    {t(`schedules.status.${schedule.status}`)}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 size={16} className="mr-2 text-gray-400" />
                    {schedule.department}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarRange size={16} className="mr-2 text-gray-400" />
                    {new Date(schedule.date).toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-2 text-gray-400" />
                    {schedule.startTime} - {schedule.endTime}
                    {schedule.breakTime && (
                      <span className="ml-2 text-gray-500">
                        (Break: {schedule.breakTime})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {schedule.bookedPatients} / {schedule.maxPatients} {t('schedules.patients')}
                    </span>
                    <span className="text-gray-500">
                      {getRepeatLabel(schedule.repeat)}
                    </span>
                  </div>
                </div>

                {schedule.status === 'available' && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(schedule.bookedPatients / schedule.maxPatients) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {schedule.maxPatients - schedule.bookedPatients} slots available
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setIsEditMode(true);
                    }}
                    className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('common.edit')}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedSchedule(schedule);
                      setIsDeleteModalOpen(true);
                    }}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <CalendarRange size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('schedules.noResults')}</h3>
          <p className="text-gray-500 mb-4">{t('schedules.noResultsDesc')}</p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => setSearchQuery('')}
          >
            {t('common.clear')}
          </button>
        </div>
      )}

      <AddScheduleModal
        isOpen={showNewSchedule || isEditMode}
        onClose={() => {
          setShowNewSchedule(false);
          setIsEditMode(false);
          setSelectedSchedule(null);
        }}
        onSubmit={isEditMode ? handleEditSchedule : handleAddSchedule}
        initialData={isEditMode ? {
          doctorId: selectedSchedule?.doctor.id || '',
          department: selectedSchedule?.department || '',
          date: selectedSchedule?.date || '',
          startTime: selectedSchedule?.startTime || '',
          endTime: selectedSchedule?.endTime || '',
          breakTime: selectedSchedule?.breakTime,
          maxPatients: selectedSchedule?.maxPatients || 20,
          status: selectedSchedule?.status || 'available',
          repeat: selectedSchedule?.repeat || 'none'
        } : undefined}
        mode={isEditMode ? 'edit' : 'add'}
      />

      <DeleteScheduleModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedSchedule(null);
        }}
        onConfirm={handleDeleteSchedule}
        doctorName={selectedSchedule?.doctor.name || ''}
        scheduleDate={selectedSchedule ? new Date(selectedSchedule.date).toLocaleDateString() : ''}
      />
    </div>
  );
};

export default Schedules;
