import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './page/LoginPage';
import Dashboard from './page/Dashboard';
import RoleAndRoot from './components/RoleAndRoot';
import AddEmployee from './page/AddEmployee';
import MobileApp from './components/MobileApp';
import AddCategoryPage from './page/AddCategoryPage';
import DetailedStats from './page/DetailedStats';
import Partner from './page/Partner';
import CallPanel from './components/CallPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import './index.css';

function App() {
  const { user } = useAuth();
  const role =
    user?.Роль?.toLowerCase() ||
    user?.ВидКонтрагента?.toLowerCase() ||
    user?.counterparty_type?.toLowerCase();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      {/* 🔒 Moderator — только MobileApp и CallPanel */}
      {role === 'moderator' && (
        <>
          <Route
            path="/mobile"
            element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <MobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <CallPanel />
              </ProtectedRoute>
            }
          />
                    <Route
            path="/add-category"
            element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <AddCategoryPage />
              </ProtectedRoute>
            }
          />
          {/* ❌ Всё остальное — редирект на /mobile */}
          <Route path="*" element={<Navigate to="/mobile" replace />} />
        </>
      )}

      {/* ✅ Admin — полный доступ */}
      {role === 'admin' && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/RoleAndRoot" element={<RoleAndRoot />} />
          <Route path="/RoleAndRoot/add-employee" element={<AddEmployee />} />
          <Route path="/statistics/:type" element={<DetailedStats />} />
          <Route path="/add-category" element={<AddCategoryPage />} />
          <Route path="/Partner" element={<Partner />} />
          <Route
            path="/mobile"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MobileApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calls"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CallPanel />
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* 🧾 Остальные роли — только бизнес-панели */}
      {role !== 'admin' && role !== 'moderator' && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/RoleAndRoot" element={<RoleAndRoot />} />
          <Route path="/RoleAndRoot/add-employee" element={<AddEmployee />} />
          <Route path="/statistics/:type" element={<DetailedStats />} />
          <Route path="/add-category" element={<AddCategoryPage />} />
          <Route path="/Partner" element={<Partner />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
