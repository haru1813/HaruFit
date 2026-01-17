import axios from 'axios';

// API URL 설정: 도메인 기반으로 자동 감지
const getApiUrl = () => {
  // 런타임에 호스트 확인 (환경 변수보다 우선)
  const hostname = window.location.hostname;
  
  // 현재 호스트가 harufit.haru.company이면 상대 경로 사용 (nginx가 /api를 프록시함)
  if (hostname === 'harufit.haru.company' || hostname.includes('harufit.haru.company')) {
    return '/api';
  }
  
  // 로컬 개발 환경 (localhost 또는 127.0.0.1)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // 환경 변수가 있으면 사용, 없으면 기본값
    return process.env.REACT_APP_API_URL || 'http://localhost:8081/api';
  }
  
  // 기타 환경에서는 환경 변수 사용 또는 기본값
  return process.env.REACT_APP_API_URL || '/api';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
