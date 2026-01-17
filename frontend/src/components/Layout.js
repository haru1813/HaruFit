import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, loading } = useAuth();
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  // 즉시 인증 체크 - 렌더링 전에 실행
  const savedUser = localStorage.getItem('user');
  const hasValidAuth = savedUser && isAuthenticated && user;

  useEffect(() => {
    console.log('🏗️ Layout - isAuthenticated:', isAuthenticated, 'loading:', loading, 'user:', user);
    console.log('🏗️ Layout - savedUser:', savedUser);
    console.log('🏗️ Layout - hasValidAuth:', hasValidAuth);
  }, [isAuthenticated, loading, user, savedUser, hasValidAuth]);

  // 인증 체크 및 리다이렉트 - 즉시 실행
  useEffect(() => {
    console.log('🏗️ Layout useEffect - checking auth immediately');
    
    if (!loading) {
      if (!savedUser) {
        console.error('🚫 Layout: No savedUser - Redirecting NOW!');
        window.location.replace('/login');
        return;
      }

      try {
        const parsedUser = JSON.parse(savedUser);
        if (!parsedUser || !parsedUser.user_id || !parsedUser.email || !parsedUser.nickname) {
          console.error('🚫 Layout: Invalid user data - Redirecting NOW!');
          localStorage.removeItem('user');
          window.location.replace('/login');
          return;
        }
      } catch (e) {
        console.error('🚫 Layout: Parse error - Redirecting NOW!', e);
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }

      if (!isAuthenticated || !user) {
        console.error('🚫 Layout: AuthContext mismatch - Redirecting NOW!');
        localStorage.removeItem('user');
        window.location.replace('/login');
        return;
      }
    }
  }, [loading, isAuthenticated, user, savedUser]);
  
  // 렌더링 전 체크 - 즉시 리다이렉트
  if (!savedUser) {
    console.error('🚫 Layout: No savedUser in render check - Redirecting immediately');
    window.location.replace('/login');
    return null;
  }

  if (!loading && (!isAuthenticated || !user)) {
    console.error('🚫 Layout: Not authenticated in render check - Redirecting immediately');
    window.location.replace('/login');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    setShowOffcanvas(false);
    navigate('/login');
  };

  const handleNavClick = () => {
    setShowOffcanvas(false);
  };

  // 로딩 중이면 아무것도 렌더링하지 않음
  if (loading) {
    console.log('⏳ Layout: Still loading...');
    return <div className="text-center p-5">로딩 중...</div>;
  }

  // 인증되지 않았으면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!isAuthenticated || !user) {
    console.error('🚫 Layout: NOT AUTHENTICATED - Should redirect!');
    return null;
  }

  const NavItems = ({ onClick }) => (
    <>
      <Link to="/dashboard" className="nav-item" onClick={onClick}>
        <i className="bi bi-house-door"></i>
        <span>대시보드</span>
      </Link>
      <Link to="/routines" className="nav-item" onClick={onClick}>
        <i className="bi bi-list-check"></i>
        <span>루틴 관리</span>
      </Link>
      <Link to="/workouts" className="nav-item" onClick={onClick}>
        <i className="bi bi-clipboard-check"></i>
        <span>운동 기록</span>
      </Link>
      <Link to="/goals" className="nav-item" onClick={onClick}>
        <i className="bi bi-bullseye"></i>
        <span>목표</span>
      </Link>
      <Link to="/journals" className="nav-item" onClick={onClick}>
        <i className="bi bi-journal-text"></i>
        <span>일지</span>
      </Link>
      <Link to="/profile" className="nav-item" onClick={onClick}>
        <i className="bi bi-person"></i>
        <span>프로필</span>
      </Link>
    </>
  );

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/dashboard" className="logo">
              <i className="bi bi-activity"></i> HaruFit
            </Link>
            
            {/* 데스크톱 네비게이션 */}
            <nav className="nav-menu d-none d-md-flex">
              <NavItems />
              {user && (
                <span className="nav-item d-none d-lg-inline" style={{ color: 'white', marginRight: '0.5rem' }}>
                  {user.nickname}
                </span>
              )}
              <button className="nav-item btn-logout" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">로그아웃</span>
              </button>
            </nav>

            {/* 모바일 햄버거 버튼 */}
            <button 
              className="btn-menu-toggle d-md-none" 
              onClick={() => setShowOffcanvas(true)}
              aria-label="메뉴 열기"
            >
              <i className="bi bi-list"></i>
            </button>
          </div>
        </div>
      </header>

      {/* 오프캔버스 메뉴 (모바일) */}
      <div className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`} tabIndex="-1" id="offcanvasMenu" aria-labelledby="offcanvasMenuLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">
            <i className="bi bi-activity"></i> HaruFit
          </h5>
          <button 
            type="button" 
            className="btn-close btn-close-white" 
            onClick={() => setShowOffcanvas(false)}
            aria-label="닫기"
          ></button>
        </div>
        <div className="offcanvas-body">
          {user && (
            <div className="offcanvas-user-info mb-4">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-person-circle" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                <div>
                  <div className="fw-bold">{user.nickname}</div>
                  <div className="text-muted small">{user.email}</div>
                </div>
              </div>
            </div>
          )}
          <nav className="offcanvas-nav">
            <NavItems onClick={handleNavClick} />
            <div className="offcanvas-divider"></div>
            <button className="offcanvas-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i>
              <span>로그아웃</span>
            </button>
          </nav>
        </div>
      </div>
      {showOffcanvas && (
        <div className="offcanvas-backdrop" onClick={() => setShowOffcanvas(false)}></div>
      )}
      <main className="layout-main">
        <div className="container-fluid">
          <Outlet />
        </div>
      </main>
      <footer className="layout-footer">
        <div className="text-center">
          <p className="mb-0">© 2026 HaruFit. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
