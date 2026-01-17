import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 세션 확인 (로컬 스토리지에서 사용자 정보 확인)
    const savedUser = localStorage.getItem('user');
    const debugData = {
      component: 'AuthContext',
      action: 'Initialization',
      savedUser: savedUser ? 'exists' : 'null',
      timestamp: new Date().toISOString()
    };
    console.log('🔐 AuthContext: Checking localStorage', debugData);
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔐 AuthContext: Parsed user:', parsedUser);
        
        // 사용자 정보 유효성 검사 - 더 엄격하게
        if (
          parsedUser && 
          typeof parsedUser === 'object' &&
          parsedUser.user_id && 
          typeof parsedUser.user_id === 'number' &&
          parsedUser.email && 
          typeof parsedUser.email === 'string' &&
          parsedUser.nickname && 
          typeof parsedUser.nickname === 'string'
        ) {
          console.log('✅ AuthContext: Valid user data, setting user');
          setUser(parsedUser);
        } else {
          // 유효하지 않은 데이터 제거
          console.warn('⚠️ AuthContext: Invalid user data, removing from localStorage', parsedUser);
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (e) {
        // 파싱 오류 시 데이터 제거
        console.error('❌ AuthContext: Error parsing user data, removing from localStorage', e);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      console.log('ℹ️ AuthContext: No saved user in localStorage');
      setUser(null);
    }
    setLoading(false);
    console.log('🔐 AuthContext: Initialization complete', { user: user, loading: false });
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // 오류 무시
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
