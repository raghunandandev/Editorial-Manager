import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Parse token or error from query params
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const oauthError = params.get('error');
        const oauthMessage = params.get('message');

        if (oauthError) {
          console.warn('[GoogleCallback] OAuth error:', oauthError, oauthMessage);
          // Persist message in localStorage as a reliable fallback, then navigate to login
          try {
            localStorage.setItem('oauth_error_message', oauthMessage || 'Authentication failed');
          } catch (e) {
            console.warn('[GoogleCallback] Could not write oauth error to localStorage', e);
          }
          const loginUrl = `/login?oauth_error=1&message=${encodeURIComponent(oauthMessage || 'Authentication failed')}`;
          navigate(loginUrl, { replace: true, state: { oauthError: true, message: oauthMessage || 'Authentication failed' } });
          return;
        }
        
        console.log('[GoogleCallback] Token from URL:', token ? `${token.substring(0, 20)}...` : 'MISSING');
        
        if (!token) {
          console.warn('[GoogleCallback] No token in URL, redirecting to login');
          navigate('/login', { replace: true });
          return;
        }

        console.log('[GoogleCallback] Saving token to localStorage');
        localStorage.setItem('token', token);

        // Fetch user profile with the new token
        try {
          console.log('[GoogleCallback] Fetching user profile...');
          const profileResponse = await authAPI.getProfile();
          console.log('[GoogleCallback] Profile fetched:', profileResponse.data?.user?.email);
          
          if (profileResponse.data?.user) {
            localStorage.setItem('user', JSON.stringify(profileResponse.data.user));
            console.log('[GoogleCallback] User saved to localStorage');
          }
        } catch (profileError) {
          console.warn('[GoogleCallback] Failed to fetch profile, but token is valid:', profileError.message);
          // Even if profile fetch fails, token is valid, so proceed
        }

        // Small delay to ensure token is persisted
        setTimeout(() => {
          console.log('[GoogleCallback] Navigating to /role-selection');
          try { window.dispatchEvent(new Event('auth_updated')); } catch (e) {}
          navigate('/role-selection', { replace: true });
        }, 100);
      } catch (error) {
        console.error('[GoogleCallback] Error during callback:', error);
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

export default GoogleCallback;
