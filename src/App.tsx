import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Appointments from './pages/Appointments';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import Schedules from './pages/Schedules';
import Inpatients from './pages/Inpatients';
import QueueManagement from './pages/QueueManagement';
import QueueDisplay from './pages/QueueDisplay';
import Consultation from './pages/Consultation';
import WardManagement from './pages/WardManagement';
import BedManagement from './pages/BedManagement';
import Billing from './pages/Billing';
import useAuthStore from './stores/authStore';

// 创建需要身份验证的路由包装器
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }

  return <>{children}</>;
};

// 创建基于角色的路由访问控制
const RoleBasedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user } = useAuthStore();
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard\" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/queue-display" element={<QueueDisplay />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard\" replace />} />
          
          {/* 所有角色都可访问的路由 */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* 医生、护士、导医可访问 */}
          <Route path="patients" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'nurse', 'receptionist']}>
              <Patients />
            </RoleBasedRoute>
          } />
          
          {/* 医生、护士可访问 */}
          <Route path="medical-records" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'nurse']}>
              <MedicalRecords />
            </RoleBasedRoute>
          } />
          
          {/* 医生、导医可访问 */}
          <Route path="appointments" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'receptionist']}>
              <Appointments />
            </RoleBasedRoute>
          } />
          
          {/* 管理员和科室主任可访问 */}
          <Route path="departments" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'admin', 'director']}>
              <Departments />
            </RoleBasedRoute>
          } />
          
          <Route path="doctors" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'admin', 'director']}>
              <Doctors />
            </RoleBasedRoute>
          } />
          
          {/* 医生、护士、导医可访问 */}
          <Route path="schedules" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'nurse', 'receptionist']}>
              <Schedules />
            </RoleBasedRoute>
          } />
          
          {/* 医生、护士可访问 */}
          <Route path="inpatients" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'nurse']}>
              <Inpatients />
            </RoleBasedRoute>
          } />
          
          {/* 护士、主任可访问 */}
          <Route path="wards" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'nurse', 'director']}>
              <WardManagement />
            </RoleBasedRoute>
          } />
          
          <Route path="beds" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'nurse', 'director']}>
              <BedManagement />
            </RoleBasedRoute>
          } />
          
          {/* 医生、导医可访问 */}
          <Route path="queue" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor', 'receptionist']}>
              <QueueManagement />
            </RoleBasedRoute>
          } />
          
          {/* 仅医生可访问 */}
          <Route path="consultation" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'doctor']}>
              <Consultation />
            </RoleBasedRoute>
          } />

          {/* 收费员可访问 */}
          <Route path="billing" element={
            <RoleBasedRoute allowedRoles={['superadmin', 'cashier']}>
              <Billing />
            </RoleBasedRoute>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
