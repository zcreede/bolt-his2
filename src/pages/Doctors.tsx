import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, UserRound, Mail, Phone, Building2, GraduationCap, Calendar } from 'lucide-react';
import AddDoctorModal from '../components/Doctors/AddDoctorModal';
import DeleteDoctorModal from '../components/Doctors/DeleteDoctorModal';
import type { DoctorFormData } from '../components/Doctors/AddDoctorModal';

type Doctor = {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  department: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'on-leave';
  schedule: {
    days: string[];
    hours: string;
  };
  patientsCount: number;
  appointmentsCount: number;
};

const Doctors: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewDoctor, setShowNewDoctor] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // 示例数据 - 实际应该从API获取
  const doctors: Doctor[] = [
    {
      id: "D-001",
      name: "Dr. Sarah Wilson",
      avatar: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialty: "心脏科",
      department: "内科",
      qualification: "主任医师",
      experience: 12,
      phone: "(555) 123-4567",
      email: "sarah.wilson@hospital.com",
      status: "active",
      schedule: {
        days: ["周一", "周三", "周五"],
        hours: "9:00 - 17:00"
      },
      patientsCount: 450,
      appointmentsCount: 32
    },
    {
      id: "D-002",
      name: "Dr. James Anderson",
      avatar: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialty: "神经科",
      department: "内科",
      qualification: "副主任医师",
      experience: 15,
      phone: "(555) 234-5678",
      email: "james.anderson@hospital.com",
      status: "active",
      schedule: {
        days: ["周二", "周四", "周六"],
        hours: "10:00 - 18:00"
      },
      patientsCount: 380,
      appointmentsCount: 28
    },
    {
      id: "D-003",
      name: "Dr. Emma Davis",
      avatar: "https://images.pexels.com/photos/5214995/pexels-photo-5214995.jpeg?auto=compress&cs=tinysrgb&w=150",
      specialty: "骨科",
      department: "外科",
      qualification: "主治医师",
      experience: 10,
      phone: "(555) 345-6789",
      email: "emma.davis@hospital.com",
      status: "on-leave",
      schedule: {
        days: ["周一", "周二", "周四"],
        hours: "8:00 - 16:00"
      },
      patientsCount: 320,
      appointmentsCount: 25
    }
  ];

  const getStatusColor = (status: Doctor['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDoctor = (doctorData: DoctorFormData) => {
    // 这里应该调用API添加医生
    console.log('添加新医生:', doctorData);
    setShowNewDoctor(false);
  };

  const handleEditDoctor = (doctorData: DoctorFormData) => {
    // 这里应该调用API更新医生信息
    console.log('更新医生信息:', doctorData);
    setIsEditMode(false);
    setSelectedDoctor(null);
  };

  const handleDeleteDoctor = () => {
    // 这里应该调用API删除医生
    console.log('删除医生:', selectedDoctor?.id);
    setIsDeleteModalOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('doctors.title')}</h1>
          <p className="text-gray-600">{t('doctors.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setShowNewDoctor(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {t('doctors.new')}
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={t('doctors.search')}
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

      {/* 医生列表 */}
      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={doctor.avatar} 
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{doctor.name}</h3>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getStatusColor(doctor.status)}`}>
                      {t(`doctors.status.${doctor.status}`)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 size={16} className="mr-2 text-gray-400" />
                    {doctor.department}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap size={16} className="mr-2 text-gray-400" />
                    {doctor.qualification} • {doctor.experience} 年
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone size={16} className="mr-2 text-gray-400" />
                    {doctor.phone}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail size={16} className="mr-2 text-gray-400" />
                    {doctor.email}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    {doctor.schedule.days.join('、')} • {doctor.schedule.hours}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-800">{doctor.patientsCount}</p>
                      <p className="text-xs text-gray-500">{t('doctors.stats.patients')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-gray-800">{doctor.appointmentsCount}</p>
                      <p className="text-xs text-gray-500">{t('doctors.stats.appointments')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedDoctor(doctor);
                      setIsEditMode(true);
                    }}
                    className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {t('common.edit')}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedDoctor(doctor);
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
            <UserRound size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('doctors.noResults')}</h3>
          <p className="text-gray-500 mb-4">{t('doctors.noResultsDesc')}</p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => setSearchQuery('')}
          >
            {t('common.clear')}
          </button>
        </div>
      )}

      <AddDoctorModal
        isOpen={showNewDoctor || isEditMode}
        onClose={() => {
          setShowNewDoctor(false);
          setIsEditMode(false);
          setSelectedDoctor(null);
        }}
        onSubmit={isEditMode ? handleEditDoctor : handleAddDoctor}
        initialData={isEditMode ? {
          name: selectedDoctor?.name || '',
          specialty: selectedDoctor?.specialty || '',
          department: selectedDoctor?.department || '',
          qualification: selectedDoctor?.qualification || '',
          experience: selectedDoctor?.experience.toString() || '',
          phone: selectedDoctor?.phone || '',
          email: selectedDoctor?.email || '',
          status: selectedDoctor?.status || 'active',
          schedule: selectedDoctor?.schedule || { days: [], hours: '' },
          avatarPreview: selectedDoctor?.avatar
        } : undefined}
        mode={isEditMode ? 'edit' : 'add'}
      />

      <DeleteDoctorModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDoctor(null);
        }}
        onConfirm={handleDeleteDoctor}
        doctorName={selectedDoctor?.name || ''}
      />
    </div>
  );
};

export default Doctors;
