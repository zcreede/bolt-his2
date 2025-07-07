import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Building2, UserRound, BedDouble } from 'lucide-react';

const Departments: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data - would come from API in real application
  const departments = [
    {
      id: "DEPT-001",
      name: t('departments.cardiology'),
      description: t('departments.descriptions.cardiology'),
      head: "Dr. Sarah Wilson",
      location: "Building A, 3rd Floor",
      status: "active",
      doctorsCount: 12,
      patientsCount: 450,
      bedsCount: 30
    },
    {
      id: "DEPT-002",
      name: t('departments.neurology'),
      description: t('departments.descriptions.neurology'),
      head: "Dr. James Anderson",
      location: "Building B, 2nd Floor",
      status: "active",
      doctorsCount: 8,
      patientsCount: 320,
      bedsCount: 25
    },
    {
      id: "DEPT-003",
      name: t('departments.orthopedics'),
      description: t('departments.descriptions.orthopedics'),
      head: "Dr. Emma Davis",
      location: "Building A, 4th Floor",
      status: "active",
      doctorsCount: 10,
      patientsCount: 380,
      bedsCount: 28
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('departments.title')}</h1>
          <p className="text-gray-600">{t('departments.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors">
            <Plus size={16} className="mr-1" />
            {t('departments.new')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('departments.search')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Departments List */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDepartments.map((department) => (
            <div 
              key={department.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <Building2 size={20} className="text-primary-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-800">{department.name}</h3>
                      <p className="text-xs text-gray-500">{department.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(department.status)}`}>
                    {t(`departments.status.${department.status}`)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">{department.description}</p>

                {/* 统计卡片 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <UserRound size={20} className="mx-auto mb-1 text-blue-600" />
                    <div className="text-lg font-semibold text-blue-600">{department.doctorsCount}</div>
                    <div className="text-xs text-blue-600">{t('departments.form.doctors')}</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <UserRound size={20} className="mx-auto mb-1 text-green-600" />
                    <div className="text-lg font-semibold text-green-600">{department.patientsCount}</div>
                    <div className="text-xs text-green-600">{t('departments.form.patients')}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <BedDouble size={20} className="mx-auto mb-1 text-purple-600" />
                    <div className="text-lg font-semibold text-purple-600">{department.bedsCount}</div>
                    <div className="text-xs text-purple-600">{t('departments.form.beds')}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('departments.form.head')}</span>
                    <span className="text-gray-800">{department.head}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('departments.form.location')}</span>
                    <span className="text-gray-800">{department.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                  <button className="px-3 py-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
                    {t('common.edit')}
                  </button>
                  <button className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium">
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
            <Building2 size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('departments.noResults')}</h3>
          <p className="text-gray-500 mb-4">{t('departments.noResultsDesc')}</p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => setSearchQuery('')}
          >
            {t('common.clear')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Departments;
