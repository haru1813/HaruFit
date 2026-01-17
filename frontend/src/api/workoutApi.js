import api from './axios';

export const workoutApi = {
  getWorkoutLogs: () => api.get('/workouts'),
  createWorkoutLog: (data) => api.post('/workouts', data),
  deleteWorkoutLog: (logId) => api.delete(`/workouts/${logId}`),
};
