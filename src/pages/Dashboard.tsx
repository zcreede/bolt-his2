import React from 'react';
import { Users, CalendarClock, FileText, Receipt, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatCard from '../components/Dashboard/StatCard';
import AppointmentItem from '../components/Dashboard/AppointmentItem';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  // 示例数据 - 实际应该从API获取
  const stats = [
    { 
      title: t('dashboard.stats.totalPatients'), 
      value: "1,284", 
      icon: <Users size={20} className="text-blue-600" />, 
      change: { value: 12, isPositive: true } 
    },
    { 
      title: t('dashboard.stats.appointmentsToday'), 
      value: "42", 
      icon: <CalendarClock size={20} className="text-green-600" />, 
      change: { value: 8, isPositive: true } 
    },
    { 
      title: t('dashboard.stats.medicalRecords'), 
      value: "3,574", 
      icon: <FileText size={20} className="text-purple-600" />, 
      change: { value: 5, isPositive: true } 
    },
    { 
      title: t('dashboard.stats.totalRevenue'), 
      value: "¥128,430", 
      icon: <Receipt size={20} className="text-orange-600" />, 
      change: { value: 3, isPositive: false } 
    }
  ];
  
  const appointments = [
    {
      patient: {
        name: "张三",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        id: "P-12345"
      },
      time: "10:00 - 10:30",
      reason: "常规检查和血压监测",
      status: "upcoming" as const
    },
    {
      patient: {
        name: "李四",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
        id: "P-12346"
      },
      time: "11:15 - 11:45",
      reason: "糖尿病复诊和用药调整",
      status: "upcoming" as const
    },
    {
      patient: {
        name: "王五",
        avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
        id: "P-12347"
      },
      time: "09:00 - 09:30",
      reason: "术后复查",
      status: "completed" as const
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{t('nav.dashboard')}</h1>
        <p className="text-gray-600">{t('dashboard.welcome')}, 张医生</p>
      </div>
      
      {/* 统计概览 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard 
            key={index} 
            title={stat.title} 
            value={stat.value} 
            icon={stat.icon} 
            change={stat.change} 
          />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日预约 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.appointments.title')}</h2>
              <button className="text-sm text-primary-600 flex items-center hover:underline">
                {t('common.viewAll')} <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <AppointmentItem 
                  key={index} 
                  patient={appointment.patient}
                  time={appointment.time}
                  reason={appointment.reason}
                  status={appointment.status}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* 快捷操作和待办事项 */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.quickActions.title')}</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between py-3 px-4 text-left bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
                <span className="flex items-center">
                  <Users size={18} className="mr-2" />
                  {t('dashboard.quickActions.addPatient')}
                </span>
                <ArrowRight size={16} />
              </button>
              
              <button className="w-full flex items-center justify-between py-3 px-4 text-left bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                <span className="flex items-center">
                  <CalendarClock size={18} className="mr-2" />
                  {t('dashboard.quickActions.scheduleAppointment')}
                </span>
                <ArrowRight size={16} />
              </button>
              
              <button className="w-full flex items-center justify-between py-3 px-4 text-left bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
                <span className="flex items-center">
                  <FileText size={18} className="mr-2" />
                  {t('dashboard.quickActions.createRecord')}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t('dashboard.upcomingTasks.title')}</h2>
            </div>
            
            <div>
              <div className="flex items-start mb-4">
                <div className="min-w-fit p-2 rounded-full bg-blue-100 mr-3">
                  <Clock size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('dashboard.upcomingTasks.teamMeeting')}</p>
                  <p className="text-xs text-gray-500">今天 14:00</p>
                </div>
              </div>
              
              <div className="flex items-start mb-4">
                <div className="min-w-fit p-2 rounded-full bg-purple-100 mr-3">
                  <Clock size={16} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('dashboard.upcomingTasks.labResults')}</p>
                  <p className="text-xs text-gray-500">今天 16:30</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="min-w-fit p-2 rounded-full bg-orange-100 mr-3">
                  <Clock size={16} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{t('dashboard.upcomingTasks.patientCall')}</p>
                  <p className="text-xs text-gray-500">明天 10:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
