import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar/NavBar.jsx';
import AuthHandler from './AuthHandler.jsx';

function HomePage() {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const idToken = localStorage.getItem('id_token');

    console.log('Access Token on Home Page:', accessToken); // Log to see the access token on home page
    console.log('ID Token on Home Page:', idToken); // Log to see the ID token on home page
  }, []);

  const manualSignIn = () => {
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const url = `${cognitoDomain}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=token&client_id=${clientId}&scope=email openid phone`;
    window.location.href = url;
  };

  return (
    <div>
      <button onClick={manualSignIn}>Login</button>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/auth" element={<AuthHandler />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}
