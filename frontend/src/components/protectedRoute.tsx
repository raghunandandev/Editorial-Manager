import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const currentRole = localStorage.getItem('currentRole');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length) {
    const userRoles = user?.roles || {};
    const hasAllowedRole = roles.some(
      (role) => currentRole === role || userRoles[role] === true
    );

    if (!hasAllowedRole) {
      return <Navigate to="/role-selection" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;