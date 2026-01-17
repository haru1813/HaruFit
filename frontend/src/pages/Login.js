import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.result && response.data.data) {
        // 로그인 성공 - 사용자 정보 저장
        const userData = response.data.data;
        // 사용자 데이터 유효성 검사
        if (userData.user_id && userData.email && userData.nickname) {
          login(userData);
          navigate('/dashboard', { replace: true });
        } else {
          setError('로그인 응답 데이터가 올바르지 않습니다.');
        }
      } else {
        setError('로그인에 실패했습니다.');
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="text-center mb-4">
          <i className="bi bi-person-circle"></i> 로그인
        </h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="mb-3">
            <label className="form-label">이메일</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">비밀번호</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary-custom w-100 mb-3">
            로그인
          </button>
          <p className="text-center text-muted">
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
