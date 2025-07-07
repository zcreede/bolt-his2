import React, { useState } from 'react';
import { Search, Filter, Plus, User, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PatientCard from '../components/Patients/PatientCard';
import AddPatientModal from '../components/Patients/AddPatientModal';
import PatientDetailsModal from '../components/Patients/PatientDetailsModal';
import DeleteConfirmationModal from '../components/Patients/DeleteConfirmationModal';
import type { PatientFormData } from '../components/Patients/AddPatientModal';

const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<null | any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const { t } = useTranslation();
  
  // 示例数据 - 实际应该从API获取
  const patients = [
    {
      id: "P-12345",
      name: "张三",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
      age: 45,
      gender: "male",
      phone: "(555) 123-4567",
      email: "alex.johnson@example.com",
      lastVisit: "2025-05-15",
      medicalHistory: "高血压病史，定期复查。",
      allergies: "青霉素",
      upcomingAppointments: [
        {
          id: "APT-001",
          date: "2025-06-05",
          time: "10:00",
          doctor: "张医生",
          type: "复查"
        }
      ],
      recentRecords: [
        {
          id: "REC-001",
          date: "2025-05-15",
          title: "血压检查",
          doctor: "张医生",
          type: "门诊"
        }
      ]
    },
    // ... 其他患者数据保持不变
  ];

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 计算分页数据
  const totalPages = Math.ceil(filteredPatients.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPatients = filteredPatients.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // 重置到第一页
  };

  const handleAddPatient = (patientData: PatientFormData) => {
    console.log('添加新患者:', patientData);
    setIsAddModalOpen(false);
  };

  const handleEditPatient = (patientData: PatientFormData) => {
    console.log('更新患者信息:', patientData);
    setIsEditMode(false);
    setSelectedPatient(null);
  };

  const handleDeletePatient = () => {
    console.log('删除患者:', selectedPatient?.id);
    setIsDeleteModalOpen(false);
    setSelectedPatient(null);
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
  };

  const handleSchedule = (patient: any) => {
    console.log('预约患者:', patient);
  };

  // 渲染分页控件
  const renderPagination = () => {
    return (
      <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <span className="text-sm text-gray-700">
            每页显示
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="mx-2 rounded-md border-gray-300 py-1 text-base focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value={9}>9</option>
              <option value={18}>18</option>
              <option value={36}>36</option>
            </select>
            条记录
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            第 {startIndex + 1} - {Math.min(endIndex, filteredPatients.length)} 条，共 {filteredPatients.length} 条
          </span>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 ${
                currentPage === 1 ? 'cursor-not-allowed' : 'hover:text-gray-700'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  page === currentPage
                    ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 ${
                currentPage === totalPages ? 'cursor-not-allowed' : 'hover:text-gray-700'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('nav.patients')}</h1>
          <p className="text-gray-600">{t('patients.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            {t('patients.new')}
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
              placeholder={t('patients.search')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // 重置到第一页
              }}
            />
          </div>
          
          <div className="flex space-x-2">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500">
              <Filter size={16} className="mr-2" />
              {t('common.filter')}
            </button>
            
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 患者列表 */}
      {filteredPatients.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentPatients.map((patient) => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient}
                  onViewDetails={() => handleViewDetails(patient)}
                  onSchedule={() => handleSchedule(patient)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">患者信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系方式</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最近就诊</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={patient.avatar} 
                            alt={patient.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                            <div className="text-sm text-gray-500">
                              {patient.age}岁 • {patient.gender}
                            </div>
                            <div className="text-xs text-gray-400">ID: {patient.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.phone}</div>
                        <div className="text-sm text-gray-500">{patient.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.lastVisit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(patient)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            查看详情
                          </button>
                          <button 
                            onClick={() => handleSchedule(patient)}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            预约
                          </button>
                          <button 
                            className="text-primary-600 hover:text-primary-900"
                          >
                            开始接诊
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* 分页控件 */}
          {renderPagination()}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">{t('patients.noResults')}</h3>
          <p className="text-gray-500 mb-4">
            {t('patients.noResultsDesc')}
          </p>
          <button 
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            onClick={() => {
              setSearchQuery('');
              setCurrentPage(1);
            }}
          >
            {t('common.clear')}
          </button>
        </div>
      )}

      <AddPatientModal
        isOpen={isAddModalOpen || isEditMode}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditMode(false);
        }}
        onSubmit={isEditMode ? handleEditPatient : handleAddPatient}
        initialData={isEditMode ? selectedPatient : undefined}
        mode={isEditMode ? 'edit' : 'add'}
      />

      {selectedPatient && !isEditMode && (
        <PatientDetailsModal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onEdit={() => setIsEditMode(true)}
          onDelete={() => setIsDeleteModalOpen(true)}
          patient={selectedPatient}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatient}
        patientName={selectedPatient?.name || ''}
      />
    </div>
  );
};

export default Patients;
