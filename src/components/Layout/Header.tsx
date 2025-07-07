import React, { useState } from 'react';
import { Bell, Search, Menu, X, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

type HeaderProps = {
  toggleSidebar: () => void;
  sidebarVisible: boolean;
};

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarVisible }) => {
  const [notifications, setNotifications] = useState(3);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-10">
      <button 
        className="lg:hidden mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        onClick={toggleSidebar}
        aria-label={sidebarVisible ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarVisible ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      <div className="flex-1 flex items-center">
        <div className="relative max-w-md w-full lg:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('common.search')}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="ml-4 flex items-center space-x-4">
        <button
          onClick={toggleLanguage}
          className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center"
        >
          <Globe size={20} />
          <span className="ml-1 text-sm">{i18n.language.toUpperCase()}</span>
        </button>

        <div className="relative">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={20} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <img
              src={user?.avatar || "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"}
              alt={user?.name || "User"}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="ml-2 hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.department || user?.role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-600 focus:outline-none flex items-center"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
