import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');
      const redirectPath = params.get('state');

      if (accessToken && idToken) {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('id_token', idToken);

        // Clear the hash from the URL
        window.location.hash = '';
        // Redirect to home or desired route
        navigate(`/${redirectPath || ''}`);
      }
    }
  }, [navigate]);

  return (
    <div>
      <h2>Processing authentication...</h2>
    </div>
  );
}
