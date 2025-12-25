import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const OrcidCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const oauthError = params.get('error');
        const oauthMessage = params.get('message');

        if (oauthError) {
          try { localStorage.setItem('oauth_error_message', oauthMessage || 'Authentication failed'); } catch (e) {}
          const loginUrl = `/login?oauth_error=1&message=${encodeURIComponent(oauthMessage || 'Authentication failed')}`;
          navigate(loginUrl, { replace: true, state: { oauthError: true, message: oauthMessage || 'Authentication failed' } });
          return;
        }

        if (!token) {
          navigate('/login', { replace: true });
          return;
        }

        localStorage.setItem('token', token);

        try {
          const profileResponse = await authAPI.getProfile();
          if (profileResponse.data?.user) {
            localStorage.setItem('user', JSON.stringify(profileResponse.data.user));
          }
        } catch (e) {
          // ignore
        }

        try { window.dispatchEvent(new Event('auth_updated')); } catch (e) {}
        setTimeout(() => navigate('/role-selection', { replace: true }), 100);
      } catch (error) {
        navigate('/login', { replace: true });
      }
    };

    processCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-700">Processing sign in...</div>
        <div className="mt-2 text-sm text-gray-500">Please wait while we complete your authentication.</div>
      </div>
    </div>
  );
};

export default OrcidCallback;
