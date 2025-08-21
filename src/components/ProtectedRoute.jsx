import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  const role = user?.Роль?.toLowerCase() 
          || user?.ВидКонтрагента?.toLowerCase() 
          || user?.counterparty_type?.toLowerCase();
  console.log('user:', user);
  console.log('role:', role);
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
