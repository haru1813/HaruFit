import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React 로드 전 즉시 인증 체크
(function() {
  console.log('🔍 index.js - Pre-React auth check');
  const protectedPaths = ['/dashboard', '/routines', '/workouts', '/goals', '/journals', '/profile'];
  const currentPath = window.location.pathname;
  const isProtectedPath = protectedPaths.some(path => currentPath.startsWith(path)) || currentPath === '/';
  
  console.log('🔍 Current path:', currentPath);
  console.log('🔍 Is protected path:', isProtectedPath);
  
  if (isProtectedPath) {
    const savedUser = localStorage.getItem('user');
    console.log('🔍 Saved user:', savedUser);
    
    if (!savedUser) {
      console.error('🚫 index.js: No user - Redirecting to /login');
      window.location.replace('/login');
      return;
    }
    
    try {
      const user = JSON.parse(savedUser);
      if (!user || !user.user_id || !user.email || !user.nickname) {
        console.error('🚫 index.js: Invalid user - Redirecting to /login');
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }
      console.log('✅ index.js: Valid user found');
    } catch (e) {
      console.error('🚫 index.js: Parse error - Redirecting to /login', e);
      localStorage.removeItem('user');
      window.location.replace('/login');
      return;
    }
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
