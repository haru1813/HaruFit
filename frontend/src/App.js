import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Routines from './pages/Routines';
import Workouts from './pages/Workouts';
import Goals from './pages/Goals';
import Journals from './pages/Journals';
import Profile from './pages/Profile';
import './App.css';

// 라우트 가드 컴포넌트 - 더 강력한 체크
function RouteGuard() {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    console.log('🚦 RouteGuard - Location:', location.pathname);
    console.log('🚦 RouteGuard - isAuthenticated:', isAuthenticated);
    console.log('🚦 RouteGuard - loading:', loading);
    console.log('🚦 RouteGuard - user:', user);
    
    const savedUser = localStorage.getItem('user');
    console.log('🚦 RouteGuard - localStorage:', savedUser);

    // 보호된 경로인지 확인
    const protectedPaths = ['/dashboard', '/routines', '/workouts', '/goals', '/journals', '/profile'];
    const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path)) || location.pathname === '/';

    console.log('🚦 RouteGuard - isProtectedPath:', isProtectedPath);

    if (isProtectedPath) {
      // 로딩 완료 여부와 관계없이 즉시 체크
      if (!savedUser) {
        console.error('🚫 RouteGuard: No savedUser - Redirecting NOW');
        window.location.replace('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser || !parsedUser.user_id || !parsedUser.email || !parsedUser.nickname) {
          console.error('🚫 RouteGuard: Invalid user data - Redirecting NOW');
          localStorage.removeItem('user');
          window.location.replace('/login');
          return;
        }
      } catch (e) {
        console.error('🚫 RouteGuard: Parse error - Redirecting NOW', e);
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }

      // 추가 체크: AuthContext와 일치하는지
      if (!loading && (!isAuthenticated || !user)) {
        console.error('🚫 RouteGuard: AuthContext mismatch - Redirecting NOW');
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }
    }
  }, [location.pathname, loading, isAuthenticated, user]);

  return null;
}

function App() {
  useEffect(() => {
    console.log('🚀 App component mounted');
    console.log('🚀 Current URL:', window.location.href);
    console.log('🚀 Current pathname:', window.location.pathname);
    
    // 페이지 로드 시 즉시 인증 체크
    const checkAuth = () => {
      const savedUser = localStorage.getItem('user');
      const protectedPaths = ['/dashboard', '/routines', '/workouts', '/goals', '/journals', '/profile'];
      const currentPath = window.location.pathname;
      const isProtected = protectedPaths.some(path => currentPath.startsWith(path)) || currentPath === '/';
      
      console.log('🚀 App checkAuth - currentPath:', currentPath, 'isProtected:', isProtected, 'savedUser:', savedUser);
      
      if (isProtected) {
        if (!savedUser) {
          console.error('🚫 App: No auth in localStorage, redirecting to /login');
          window.location.replace('/login');
          return;
        }
        
        try {
          const user = JSON.parse(savedUser);
          if (!user || !user.user_id || !user.email || !user.nickname) {
            console.error('🚫 App: Invalid user data, redirecting to /login');
            localStorage.removeItem('user');
            window.location.replace('/login');
            return;
          }
        } catch (e) {
          console.error('🚫 App: Parse error, redirecting to /login', e);
          localStorage.removeItem('user');
          window.location.replace('/login');
          return;
        }
      }
    };
    
    // 즉시 실행
    checkAuth();
    
    // 주기적으로도 체크 (안전장치)
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <RouteGuard />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="routines" element={<ProtectedRoute><Routines /></ProtectedRoute>} />
            <Route path="workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
            <Route path="goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="journals" element={<ProtectedRoute><Journals /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Route>
          {/* 404 처리 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
