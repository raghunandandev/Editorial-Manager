import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { authAPI } from '../../services/api';
// newClient/src/pages/sign_pages/logIn.tsx
import { validateEmail, validatePassword } from '../../utils/validation';
const LogIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();

  // If redirected from OAuth with an error, show it (react to location changes)
  React.useEffect(() => {
    console.log('[LogIn] location.search:', location.search, 'location.state:', location.state);
    // Prefer router state (set by GoogleCallback) because it's reliable during navigation
    const state = location.state as { oauthError?: boolean; message?: string } | null;
    if (state?.oauthError) {
      setError(state.message || 'Authentication with Google failed.');
      return;
    }

    // Fallback to query params for direct links
    const params = new URLSearchParams(location.search);
    const oauthError = params.get('oauth_error');
    const message = params.get('message');
    if (oauthError) {
      console.log('[LogIn] oauthError found in query, message:', message);
      try {
        const decoded = message ? decodeURIComponent(message) : 'Authentication with Google failed.';
        setError(decoded);
      } catch (e) {
        setError(message || 'Authentication with Google failed.');
      }
    }

    // Final fallback: check localStorage (set by GoogleCallback) and clear it after use
    try {
      const stored = localStorage.getItem('oauth_error_message');
      if (stored) {
        console.log('[LogIn] oauth error found in localStorage:', stored);
        setError(stored);
        localStorage.removeItem('oauth_error_message');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [location.search]);

  // Inside the LogIn component, add these state variables
const [errors, setErrors] = useState<{
  email?: string;
  password?: string;
}>({});
const validateForm = () => {
  const newErrors = {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password)
  };
  setErrors(newErrors);
  return !Object.values(newErrors).some(error => error);
};
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Real-time validation
  if (name === 'email') {
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  } else if (name === 'password') {
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  }
};

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.success) {
        const {user, token} = response.data;
        
        // localStorage.setItem('token', response.data.data.token);
        // localStorage.setItem('user', JSON.stringify(user));
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
          // Notify other windows/components that auth state changed
          try { window.dispatchEvent(new Event('auth_updated')); } catch (e) {}
        
        // Always redirect to role selection page after successful login
        navigate('/role-selection', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              {/* <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              /> */}

              
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm p-2`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}

            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {/* <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              /> */}

              
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm p-2`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:3000/api/auth/google'; }}
                className="w-full mt-3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
              >
                Continue with Google
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => { window.location.href = 'http://localhost:3000/api/auth/orcid'; }}
                className="w-full mt-3 flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100"
              >
                Continue with ORCID
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LogIn;