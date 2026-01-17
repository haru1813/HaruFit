import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // 디버깅용
  useEffect(() => {
    const debugData = {
      component: 'ProtectedRoute',
      isAuthenticated,
      loading,
      user,
      localStorageUser: localStorage.getItem('user'),
      timestamp: new Date().toISOString()
    };
    console.log('🔒 ProtectedRoute Debug:', debugData);
    console.table(debugData);
  }, [isAuthenticated, loading, user]);

  // 인증 체크 및 리다이렉트 (useEffect로 처리)
  useEffect(() => {
    if (!loading) {
      const savedUser = localStorage.getItem('user');
      const hasValidAuth = isAuthenticated && user && savedUser;
      
      console.log('🔒 ProtectedRoute useEffect - checking auth:', {
        loading,
        isAuthenticated,
        hasUser: !!user,
        hasSavedUser: !!savedUser,
        hasValidAuth
      });

      if (!hasValidAuth) {
        console.error('🚫 ProtectedRoute: NOT AUTHENTICATED - Redirecting NOW!');
        localStorage.removeItem('user');
        // 즉시 리다이렉트
        setTimeout(() => {
          window.location.href = '/login';
        }, 0);
      }
    }
  }, [loading, isAuthenticated, user]);

  // 로딩 중일 때는 아무것도 렌더링하지 않음
  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return <div className="text-center p-5">로딩 중...</div>;
  }

  // 인증되지 않은 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!isAuthenticated || !user) {
    console.error('🚫 ProtectedRoute: NOT AUTHENTICATED - Should redirect!');
    return null;
  }

  console.log('✅ ProtectedRoute: AUTHENTICATED - Rendering protected content');
  return <>{children}</>;
}

export default ProtectedRoute;
