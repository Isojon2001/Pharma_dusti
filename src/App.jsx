import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import LoginPage from './page/LoginPage';
import Dashboard from './page/Dashboard';
import RoleAndRoot from './components/RoleAndRoot';
import AddEmployee from './page/AddEmployee';
import MobileApp from './components/MobileApp';
import AddCategoryPage from './page/AddCategoryPage';
import AddBlockPage from './page/AddBlockPage';
import ListOfBlocks from './page/ListOfBlocks';
import DetailedStats from './page/DetailedStats';
import Partner from './page/Partner';
import CallPanel from './components/CallPanel';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  const { token, user, isLoading } = useAuth();

  if (isLoading) return null;

  const role =
    user?.Роль?.toLowerCase() ||
    user?.ВидКонтрагента?.toLowerCase() ||
    user?.counterparty_type?.toLowerCase() ||
    '';

  const isClient = role === 'клиент';
  const isAllowed = token && !['admin', 'moderator', 'клиент'].includes(role);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

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
          <Route
            path="/add-block"
            element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <AddBlockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-of-blocks"
            element={
              <ProtectedRoute allowedRoles={['moderator']}>
                <ListOfBlocks />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/mobile" replace />} />
        </>
      )}

      {role === 'admin' && (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleAndRoot"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RoleAndRoot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleAndRoot/add-employee"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics/:type"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DetailedStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-category"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-block"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AddBlockPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-of-blocks"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ListOfBlocks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Partner"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Partner />
              </ProtectedRoute>
            }
          />
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

      {isAllowed && (
        <>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleAndRoot"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <RoleAndRoot />
              </ProtectedRoute>
            }
          />
          <Route
            path="/RoleAndRoot/add-employee"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/statistics/:type"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <DetailedStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-category"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <AddCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/list-of-blocks"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <ListOfBlocks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Partner"
            element={
              <ProtectedRoute allowedRoles={[role]}>
                <Partner />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}

      {token && isClient && (
        <Route path="*" element={<Navigate to="/" replace />} />
      )}
    </Routes>
  );
}

export default App;
