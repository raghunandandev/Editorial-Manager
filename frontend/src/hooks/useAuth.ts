import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const role = localStorage.getItem('currentRole');
      
      if (token && userData) {
        // Verify token with backend
        const response = await authAPI.getProfile();
        if (response.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          logout();
        }
      }
      
      if (role) {
        setCurrentRole(role);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentRole');
    setUser(null);
    setCurrentRole(null);
  };

  const setRole = (role) => {
    localStorage.setItem('currentRole', role);
    setCurrentRole(role);
  };

  const hasRole = (role) => {
    return user?.roles?.[role] === true;
  };

  const getAvailableRoles = () => {
    const roles = [];
    if (!user) return roles;
    
    if (hasRole('author')) roles.push('author');
    if (hasRole('reviewer')) roles.push('reviewer');
    if (hasRole('editor')) roles.push('editor');
    if (hasRole('editorInChief')) roles.push('editorInChief');
    roles.push('viewer');
    
    return roles;
  };

  return { 
    user, 
    loading, 
    currentRole,
    login, 
    logout, 
    setRole,
    hasRole,
    getAvailableRoles
  };
};