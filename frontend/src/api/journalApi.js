import api from './axios';

export const journalApi = {
  getJournals: () => api.get('/journals'),
  createJournal: (data) => api.post('/journals', data),
  deleteJournal: (journalId) => api.delete(`/journals/${journalId}`),
};
