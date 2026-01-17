import api from './axios';

export const routineApi = {
  // 루틴 목록 조회
  getRoutines: () => api.get('/routines'),
  
  // 루틴 상세 조회
  getRoutine: (routineId) => api.get(`/routines/${routineId}`),
  
  // 루틴 생성
  createRoutine: (data) => api.post('/routines', data),
  
  // 루틴 수정
  updateRoutine: (routineId, data) => api.put(`/routines/${routineId}`, data),
  
  // 루틴 삭제
  deleteRoutine: (routineId) => api.delete(`/routines/${routineId}`),
  
  // 운동 목록 조회
  getExercises: () => api.get('/routines/exercises'),
};
