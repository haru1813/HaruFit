import api from './axios';

export const goalApi = {
  getGoals: () => api.get('/goals'),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (goalId, data) => api.put(`/goals/${goalId}`, data),
  deleteGoal: (goalId) => api.delete(`/goals/${goalId}`),
};
