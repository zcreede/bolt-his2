import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  UserRound, 
  CalendarCheck, 
  FileText, 
  Receipt, 
  Pill, 
  FlaskConical, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Building2,
  CalendarRange,
  BedDouble,
  ListOrdered,
  Stethoscope,
  UserCheck,
  DoorOpen,
  Microscope,
  HeartPulse,
  UserCog,
  ClipboardList,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../../stores/authStore';
import type { UserRole } from '../../stores/authStore';

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active, collapsed }) => {
  return (
    <Link 
      to={to}
      className={`flex items-center px-4 py-3 text-sm rounded-lg mb-1 transition-all relative group ${
        active 
          ? 'bg-primary-100 text-primary-700 font-medium' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
      title={collapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!collapsed && <span className="ml-3 whitespace-nowrap">{label}</span>}
      
      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </Link>
  );
};

// 定义角色可访问的菜单项
const roleMenuAccess: Record<UserRole, string[]> = {
  superadmin: ['dashboard', 'patients', 'appointments', 'medical-records', 'departments', 'doctors', 'schedules', 'inpatients', 'wards', 'beds', 'queue', 'consultation', 'billing', 'pharmacy', 'laboratory', 'settings'],
  doctor: ['dashboard', 'patients', 'appointments', 'medical-records', 'schedules', 'inpatients', 'queue', 'consultation'],
  nurse: ['dashboard', 'patients', 'medical-records', 'schedules', 'inpatients', 'wards', 'beds'],
  director: ['dashboard', 'departments', 'doctors', 'wards', 'beds'],
  admin: ['dashboard', 'departments', 'doctors', 'settings'],
  cashier: ['dashboard', 'billing'],
  pharmacist: ['dashboard', 'pharmacy'],
  technician: ['dashboard', 'laboratory'],
  receptionist: ['dashboard', 'patients', 'appointments', 'schedules', 'queue']
};

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();
  const { user } = useAuthStore();

  if (!user) return null;

  const allowedMenus = roleMenuAccess[user.role];

  const navItems = {
    outpatient: [
      { to: "/patients", icon: <UserCog size={20} />, label: t('nav.patients') },
      { to: "/appointments", icon: <CalendarCheck size={20} />, label: t('nav.appointments') },
      { to: "/queue", icon: <ListOrdered size={20} />, label: t('nav.queue') },
      { to: "/consultation", icon: <ClipboardList size={20} />, label: t('nav.consultation') },
      { to: "/medical-records", icon: <FileText size={20} />, label: t('nav.medicalRecords') }
    ],
    inpatient: [
      { to: "/inpatients", icon: <UserCheck size={20} />, label: t('nav.inpatients') },
      { to: "/wards", icon: <DoorOpen size={20} />, label: t('nav.wards') },
      { to: "/beds", icon: <BedDouble size={20} />, label: t('nav.beds') }
    ],
    auxiliary: [
      { to: "/departments", icon: <Building2 size={20} />, label: t('nav.departments') },
      { to: "/doctors", icon: <Stethoscope size={20} />, label: t('nav.doctors') },
      { to: "/schedules", icon: <CalendarRange size={20} />, label: t('nav.schedules') },
      { to: "/billing", icon: <Receipt size={20} />, label: t('nav.billing') },
      { to: "/pharmacy", icon: <Pill size={20} />, label: t('nav.pharmacy') },
      { to: "/laboratory", icon: <Microscope size={20} />, label: t('nav.laboratory') }
    ],
    system: [
      { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: t('nav.dashboard') },
      { to: "/settings", icon: <Settings size={20} />, label: t('nav.settings') }
    ]
  };

  return (
    <div className={`bg-white h-screen border-r border-gray-200 flex flex-col transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`p-5 border-b border-gray-200 ${collapsed ? 'px-3' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center flex-shrink-0">
              <HeartPulse size={20} className="text-white" />
            </div>
            {!collapsed && (
              <h1 className="ml-2 text-xl font-semibold text-gray-800 whitespace-nowrap">MediCore</h1>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
            title={collapsed ? '展开菜单' : '收起菜单'}
          >
            {collapsed ? (
              <ChevronRight size={16} className="text-gray-600" />
            ) : (
              <ChevronLeft size={16} className="text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex-1 overflow-y-auto ${collapsed ? 'px-2' : 'px-3'} py-2`}>
        {/* 门诊业务 */}
        {navItems.outpatient.some(item => allowedMenus.includes(item.to.slice(1))) && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('nav.sections.outpatient')}
              </p>
            )}
            {navItems.outpatient
              .filter(item => allowedMenus.includes(item.to.slice(1)))
              .map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.to}
                  collapsed={collapsed}
                />
              ))}
          </div>
        )}

        {/* 住院业务 */}
        {navItems.inpatient.some(item => allowedMenus.includes(item.to.slice(1))) && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('nav.sections.inpatient')}
              </p>
            )}
            {navItems.inpatient
              .filter(item => allowedMenus.includes(item.to.slice(1)))
              .map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.to}
                  collapsed={collapsed}
                />
              ))}
          </div>
        )}

        {/* 辅助业务 */}
        {navItems.auxiliary.some(item => allowedMenus.includes(item.to.slice(1))) && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('nav.sections.auxiliary')}
              </p>
            )}
            {navItems.auxiliary
              .filter(item => allowedMenus.includes(item.to.slice(1)))
              .map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.to}
                  collapsed={collapsed}
                />
              ))}
          </div>
        )}

        {/* 系统管理 */}
        {navItems.system.some(item => allowedMenus.includes(item.to.slice(1))) && (
          <div className="mb-6">
            {!collapsed && (
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                {t('nav.sections.system')}
              </p>
            )}
            {navItems.system
              .filter(item => allowedMenus.includes(item.to.slice(1)))
              .map((item) => (
                <NavItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={currentPath === item.to}
                  collapsed={collapsed}
                />
              ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={`border-t border-gray-200 p-4 ${collapsed ? 'px-2' : ''}`}>
        <div className="flex items-center">
          <img
            src={user?.avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"}
            alt={user?.name || "User"}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          {!collapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.department || user?.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
