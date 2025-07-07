import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, Plus, Search, Filter, ExternalLink, FlaskConical, Activity, UserPlus, Calendar } from 'lucide-react';
import useSound from 'use-sound';

type QueueStatus = 'waiting' | 'called' | 'in-progress' | 'examination' | 'completed';
type QueueType = 'normal' | 'return';
type ExaminationType = 'lab' | 'imaging';

interface QueueItem {
  id: string;
  number: string;
  patientName: string;
  patientId: string;
  type: QueueType;
  doctor: string;
  status: QueueStatus;
  time: string;
  isAppointment: boolean; // 是否为预约患者
  appointmentTime?: string; // 预约时间
  examinations?: {
    type: ExaminationType;
    status: 'pending' | 'completed';
    returnTime?: string;
  }[];
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  department: string;
  appointmentTime: string;
  type: 'normal' | 'return';
  status: 'scheduled' | 'checked-in' | 'completed' | 'cancelled';
}

interface AddToQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddToQueueModal: React.FC<AddToQueueModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState<'appointment' | 'walk-in'>('appointment');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [walkInData, setWalkInData] = useState({
    patientName: '',
    patientId: '',
    phone: '',
    doctor: '',
    visitType: 'normal' as QueueType
  });

  // 模拟预约数据
  const appointments: Appointment[] = [
    {
      id: 'APT-001',
      patientId: 'P-12345',
      patientName: '张三',
      doctorName: '李医生',
      department: '内科',
      appointmentTime: '09:30',
      type: 'normal',
      status: 'scheduled'
    },
    {
      id: 'APT-002',
      patientId: 'P-12346',
      patientName: '王五',
      doctorName: '李医生',
      department: '内科',
      appointmentTime: '10:00',
      type: 'return',
      status: 'scheduled'
    }
  ];

  const doctors = [
    { id: 'D001', name: '李医生', department: '内科' },
    { id: 'D002', name: '张医生', department: '外科' },
    { id: 'D003', name: '王医生', department: '儿科' }
  ];

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (activeTab === 'appointment') {
      const appointment = appointments.find(apt => apt.id === selectedAppointment);
      if (appointment) {
        onSubmit({
          type: 'appointment',
          appointment
        });
      }
    } else {
      onSubmit({
        type: 'walk-in',
        data: walkInData
      });
    }
  };

  // 检查表单是否有效
  const isFormValid = () => {
    if (activeTab === 'appointment') {
      return selectedAppointment !== '';
    } else {
      return walkInData.patientName.trim() !== '' && 
             walkInData.phone.trim() !== '' && 
             walkInData.doctor !== '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">加入队列</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* 选项卡 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab('appointment')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'appointment'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              预约患者报到
            </button>
            <button
              onClick={() => setActiveTab('walk-in')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'walk-in'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <UserPlus size={16} className="inline mr-2" />
              临时患者加号
            </button>
          </div>

          {/* 预约患者报到 */}
          {activeTab === 'appointment' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择预约记录
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {appointments.filter(apt => apt.status === 'scheduled').map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAppointment === appointment.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAppointment(appointment.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                          <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {appointment.doctorName} • {appointment.department}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">
                            {appointment.appointmentTime}
                          </p>
                          <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                            appointment.type === 'return' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.type === 'return' ? '复诊' : '初诊'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {appointments.filter(apt => apt.status === 'scheduled').length === 0 && (
                  <p className="text-gray-500 text-center py-4">暂无待报到的预约记录</p>
                )}
              </div>
            </div>
          )}

          {/* 临时患者加号 */}
          {activeTab === 'walk-in' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    患者姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={walkInData.patientName}
                    onChange={(e) => setWalkInData({ ...walkInData, patientName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="请输入患者姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    患者ID
                  </label>
                  <input
                    type="text"
                    value={walkInData.patientId}
                    onChange={(e) => setWalkInData({ ...walkInData, patientId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="如有请输入患者ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={walkInData.phone}
                    onChange={(e) => setWalkInData({ ...walkInData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="请输入联系电话"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    就诊医生 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={walkInData.doctor}
                    onChange={(e) => setWalkInData({ ...walkInData, doctor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">请选择医生</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.name}>
                        {doctor.name} ({doctor.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  就诊类型 <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      value="normal"
                      checked={walkInData.visitType === 'normal'}
                      onChange={(e) => setWalkInData({ ...walkInData, visitType: e.target.value as QueueType })}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">初诊</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visitType"
                      value="return"
                      checked={walkInData.visitType === 'return'}
                      onChange={(e) => setWalkInData({ ...walkInData, visitType: e.target.value as QueueType })}
                      className="mr-2 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm">复诊</span>
                  </label>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>注意：</strong>临时加号患者将排在预约患者之后，请告知患者可能需要等待较长时间。
                </p>
              </div>

              {/* 表单验证提示 */}
              {!isFormValid() && (
                <div className="text-sm text-gray-500">
                  请填写所有必填项（标有 <span className="text-red-500">*</span> 的字段）
                </div>
              )}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                isFormValid()
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {activeTab === 'appointment' ? '确认报到' : '加入队列'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const QueueManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddToQueue, setShowAddToQueue] = useState(false);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([
    {
      id: '1',
      number: 'A001',
      patientName: '张三',
      patientId: 'P-12345',
      type: 'normal',
      doctor: 'Dr. Sarah Wilson',
      status: 'waiting',
      time: '09:30',
      isAppointment: true,
      appointmentTime: '09:30',
      examinations: []
    }
  ]);

  // Sound effect for calling numbers
  const [playCallSound] = useSound('/sounds/call.mp3', { volume: 0.5 });

  const handleOpenDisplay = () => {
    window.open('/queue-display', '_blank');
  };

  const handleAddToQueue = (data: any) => {
    let newQueueItem: QueueItem;
    
    if (data.type === 'appointment') {
      // 预约患者报到
      const appointment = data.appointment;
      const queueNumber = generateQueueNumber(appointment.type);
      
      newQueueItem = {
        id: `queue-${Date.now()}`,
        number: queueNumber,
        patientName: appointment.patientName,
        patientId: appointment.patientId,
        type: appointment.type,
        doctor: appointment.doctorName,
        status: 'waiting',
        time: new Date().toLocaleTimeString().slice(0, 5),
        isAppointment: true,
        appointmentTime: appointment.appointmentTime,
        examinations: []
      };
    } else {
      // 临时患者加号
      const walkInData = data.data;
      const queueNumber = generateQueueNumber(walkInData.visitType, true); // 临时患者使用不同的号码序列
      
      newQueueItem = {
        id: `queue-${Date.now()}`,
        number: queueNumber,
        patientName: walkInData.patientName,
        patientId: walkInData.patientId || `TEMP-${Date.now()}`,
        type: walkInData.visitType,
        doctor: walkInData.doctor,
        status: 'waiting',
        time: new Date().toLocaleTimeString().slice(0, 5),
        isAppointment: false,
        examinations: []
      };
    }

    setQueueItems(prev => [...prev, newQueueItem]);
    setShowAddToQueue(false);
    
    // 显示成功提示
    alert(`${newQueueItem.patientName} 已成功加入队列，队列号：${newQueueItem.number}`);
  };

  const generateQueueNumber = (type: QueueType, isWalkIn: boolean = false): string => {
    const prefix = type === 'normal' ? 'A' : 'B';
    const suffix = isWalkIn ? 'W' : '';
    const existingNumbers = queueItems
      .filter(item => item.number.startsWith(prefix))
      .map(item => parseInt(item.number.replace(/[A-Z]/g, '')))
      .filter(num => !isNaN(num));
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `${prefix}${String(nextNumber).padStart(3, '0')}${suffix}`;
  };

  const handleSendToExamination = (itemId: string, type: ExaminationType) => {
    setQueueItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: 'examination',
            examinations: [
              ...(item.examinations || []),
              { type, status: 'pending' }
            ]
          };
        }
        return item;
      })
    );
  };

  const handleReturnFromExamination = (itemId: string, examinationIndex: number) => {
    setQueueItems(items =>
      items.map(item => {
        if (item.id === itemId) {
          const examinations = [...(item.examinations || [])];
          examinations[examinationIndex] = {
            ...examinations[examinationIndex],
            status: 'completed',
            returnTime: new Date().toLocaleTimeString()
          };

          // Check if all examinations are completed
          const allCompleted = examinations.every(exam => exam.status === 'completed');

          return {
            ...item,
            type: 'return', // Mark as return visit
            status: allCompleted ? 'waiting' : 'examination',
            examinations
          };
        }
        return item;
      })
    );
    playCallSound(); // Play sound when patient returns to queue
  };

  const getStatusBadgeColor = (status: QueueStatus) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'called':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'examination':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeBadgeColor = (type: QueueType) => {
    return type === 'return' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  // Calculate statistics
  const stats = {
    total: queueItems.length,
    waiting: queueItems.filter(item => item.status === 'waiting').length,
    examination: queueItems.filter(item => item.status === 'examination').length,
    completed: queueItems.filter(item => item.status === 'completed').length,
    appointments: queueItems.filter(item => item.isAppointment).length,
    walkIns: queueItems.filter(item => !item.isAppointment).length
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('queue.management.title')}</h1>
          <p className="text-gray-600">{t('queue.management.subtitle')}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-3">
          <button
            onClick={handleOpenDisplay}
            className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            {t('queue.management.openDisplay')}
          </button>
          <button 
            onClick={() => setShowAddToQueue(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 flex items-center"
          >
            <Plus size={16} className="mr-1" />
            {t('queue.management.addToQueue')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Queue Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t('queue.stats.total')}</h2>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t('queue.stats.waiting')}</h2>
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-orange-600">{stats.waiting}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">检查中</h2>
            <FlaskConical className="h-6 w-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-600">{stats.examination}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{t('queue.stats.completed')}</h2>
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">预约患者</h2>
            <Calendar className="h-6 w-6 text-indigo-500" />
          </div>
          <div className="text-3xl font-bold text-indigo-600">{stats.appointments}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">临时患者</h2>
            <UserPlus className="h-6 w-6 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.walkIns}</div>
        </div>
      </div>

      {/* Queue List */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">{t('queue.management.title')}</h2>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={t('queue.management.search')}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                <Filter size={16} className="mr-1" />
                {t('common.filter')}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.number')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.patient')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.type')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    来源
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.doctor')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.status')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    检查项目
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.time')}
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('queue.list.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queueItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.patientName}</div>
                        <div className="text-sm text-gray-500">{item.patientId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 text-xs rounded-full ${getTypeBadgeColor(item.type)}`}>
                        {t(`queue.type.${item.type}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        {item.isAppointment ? (
                          <>
                            <Calendar size={14} className="mr-1 text-green-500" />
                            <span className="text-green-600">预约</span>
                            {item.appointmentTime && (
                              <span className="ml-1 text-gray-400">({item.appointmentTime})</span>
                            )}
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} className="mr-1 text-amber-500" />
                            <span className="text-amber-600">临时</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.doctor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(item.status)}`}>
                        {t(`queue.status.${item.status}`)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col space-y-2">
                        {item.examinations?.map((exam, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            {exam.type === 'lab' ? (
                              <FlaskConical size={14} className="text-purple-500" />
                            ) : (
                              <Activity size={14} className="text-blue-500" />
                            )}
                            <span className={`text-xs ${exam.status === 'completed' ? 'text-green-600' : 'text-gray-600'}`}>
                              {exam.type === 'lab' ? '化验' : '影像'}
                              {exam.status === 'completed' && ` (${exam.returnTime})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {item.status !== 'examination' && (
                          <>
                            <button
                              onClick={() => handleSendToExamination(item.id, 'lab')}
                              className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                              化验
                            </button>
                            <button
                              onClick={() => handleSendToExamination(item.id, 'imaging')}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              影像
                            </button>
                          </>
                        )}
                        {item.status === 'examination' && item.examinations?.map((exam, index) => (
                          exam.status === 'pending' && (
                            <button
                              key={index}
                              onClick={() => handleReturnFromExamination(item.id, index)}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              返回队列
                            </button>
                          )
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add to Queue Modal */}
      <AddToQueueModal
        isOpen={showAddToQueue}
        onClose={() => setShowAddToQueue(false)}
        onSubmit={handleAddToQueue}
      />
    </div>
  );
};

export default QueueManagement;
