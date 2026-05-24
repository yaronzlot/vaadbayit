import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import PaymentsScreen from './screens/payments/PaymentsScreen';
import AnnouncementsScreen from './screens/announcements/AnnouncementsScreen';
import AddAnnouncementScreen from './screens/announcements/AddAnnouncementScreen';
import AnnouncementDetailScreen from './screens/announcements/AnnouncementDetailScreen';
import MaintenanceScreen from './screens/maintenance/MaintenanceScreen';
import AddMaintenanceScreen from './screens/maintenance/AddMaintenanceScreen';
import VendorsScreen from './screens/vendors/VendorsScreen';
import AddVendorScreen from './screens/vendors/AddVendorScreen';
import ProfileScreen from './screens/profile/ProfileScreen';
import AdminResidentsScreen from './screens/admin/AdminResidentsScreen';
import AdminFinancesScreen from './screens/admin/AdminFinancesScreen';
import { Spinner } from './components/UI';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterScreen /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><DashboardScreen /></PrivateRoute>} />
      <Route path="/payments" element={<PrivateRoute><PaymentsScreen /></PrivateRoute>} />
      <Route path="/announcements" element={<PrivateRoute><AnnouncementsScreen /></PrivateRoute>} />
      <Route path="/announcements/add" element={<PrivateRoute><AddAnnouncementScreen /></PrivateRoute>} />
      <Route path="/announcements/:id" element={<PrivateRoute><AnnouncementDetailScreen /></PrivateRoute>} />
      <Route path="/maintenance" element={<PrivateRoute><MaintenanceScreen /></PrivateRoute>} />
      <Route path="/maintenance/add" element={<PrivateRoute><AddMaintenanceScreen /></PrivateRoute>} />
      <Route path="/vendors" element={<PrivateRoute><VendorsScreen /></PrivateRoute>} />
      <Route path="/vendors/add" element={<PrivateRoute><AddVendorScreen /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfileScreen /></PrivateRoute>} />
      <Route path="/admin/residents" element={<AdminRoute><AdminResidentsScreen /></AdminRoute>} />
      <Route path="/admin/finances" element={<AdminRoute><AdminFinancesScreen /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
}
