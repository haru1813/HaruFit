import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function DebugInfo() {
  const { isAuthenticated, loading, user } = useAuth();
  const [localStorageUser, setLocalStorageUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('user');
      setLocalStorageUser(saved ? JSON.parse(saved) : null);
    } catch (e) {
      setLocalStorageUser(null);
    }
  }, [isAuthenticated, user]);

  const debugInfo = {
    isAuthenticated,
    loading,
    user,
    localStorageUser,
    timestamp: new Date().toLocaleTimeString()
  };

  // 콘솔에 출력
  useEffect(() => {
    console.log('%c=== 🔍 DEBUG INFO ===', 'color: #4ade80; font-weight: bold; font-size: 14px;');
    console.log('%c인증 상태:', 'color: #60a5fa; font-weight: bold;', isAuthenticated);
    console.log('%c로딩 상태:', 'color: #60a5fa; font-weight: bold;', loading);
    console.log('%c사용자 정보:', 'color: #60a5fa; font-weight: bold;', user);
    console.log('%c로컬 스토리지:', 'color: #60a5fa; font-weight: bold;', localStorageUser);
    console.log('%c전체 정보:', 'color: #60a5fa; font-weight: bold;', debugInfo);
    console.log('===================');
  }, [isAuthenticated, loading, user, localStorageUser]);

  // 개발 환경에서만 화면에 표시
  if (process.env.NODE_ENV === 'development') {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 99999,
        maxWidth: '350px',
        maxHeight: '400px',
        overflow: 'auto',
        border: '2px solid #4ade80',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#4ade80', fontSize: '13px' }}>
          🔍 DEBUG INFO
        </div>
        <div style={{ marginBottom: '8px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <strong style={{ color: '#60a5fa' }}>isAuthenticated:</strong> 
          <span style={{ color: isAuthenticated ? '#4ade80' : '#f87171', marginLeft: '5px' }}>
            {String(isAuthenticated)}
          </span>
        </div>
        <div style={{ marginBottom: '8px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <strong style={{ color: '#60a5fa' }}>loading:</strong> 
          <span style={{ marginLeft: '5px' }}>{String(loading)}</span>
        </div>
        <div style={{ marginBottom: '8px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <strong style={{ color: '#60a5fa' }}>user:</strong>
          <pre style={{ margin: '5px 0 0 0', fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
            {user ? JSON.stringify(user, null, 2) : 'null'}
          </pre>
        </div>
        <div style={{ marginBottom: '8px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <strong style={{ color: '#60a5fa' }}>localStorage:</strong>
          <pre style={{ margin: '5px 0 0 0', fontSize: '10px', overflow: 'auto', maxHeight: '100px' }}>
            {localStorageUser ? JSON.stringify(localStorageUser, null, 2) : 'null'}
          </pre>
        </div>
        <div style={{ marginTop: '10px', fontSize: '9px', color: '#94a3b8', textAlign: 'center' }}>
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    );
  }

  return null;
}

export default DebugInfo;
