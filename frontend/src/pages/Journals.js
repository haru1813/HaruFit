import React, { useState, useEffect } from 'react';
import { journalApi } from '../api/journalApi';
import './Journals.css';

function Journals() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [formData, setFormData] = useState({
    workoutDate: '',
    content: ''
  });

  useEffect(() => {
    loadJournals();
  }, []);

  const loadJournals = async () => {
    try {
      setLoading(true);
      const response = await journalApi.getJournals();
      if (response.data.result) {
        setJournals(response.data.data || []);
      }
    } catch (error) {
      console.error('일지 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingJournal(null);
    setFormData({
      workoutDate: new Date().toISOString().split('T')[0],
      content: ''
    });
    setShowModal(true);
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setFormData({
      workoutDate: journal.workout_date,
      content: journal.content
    });
    setShowModal(true);
  };

  const handleDelete = async (journalId) => {
    if (!window.confirm('정말 이 일지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await journalApi.deleteJournal(journalId);
      if (response.data.result) {
        alert('일지가 삭제되었습니다.');
        loadJournals();
      }
    } catch (error) {
      console.error('일지 삭제 실패:', error);
      alert('일지 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      const response = await journalApi.createJournal(formData);
      if (response.data.result) {
        alert('일지가 저장되었습니다.');
        setShowModal(false);
        loadJournals();
      }
    } catch (error) {
      console.error('일지 저장 실패:', error);
      alert(error.response?.data?.error?.message || '일지 저장에 실패했습니다.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="journals-page">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="journals-page">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>
          <i className="bi bi-journal-text"></i> 운동 일지
        </h1>
        <button className="btn btn-primary-custom" onClick={handleCreate}>
          <i className="bi bi-plus-circle"></i> 새 일지
        </button>
      </div>

      {journals.length === 0 ? (
        <div className="text-center p-5">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray-400)' }}></i>
          <p className="mt-3 text-muted">등록된 일지가 없습니다. 새 일지를 작성해보세요!</p>
        </div>
      ) : (
        <div className="row g-3">
          {journals.map((journal) => (
            <div key={journal.journal_id} className="col-12 col-md-6 col-lg-4">
              <div className="journal-card">
                <div className="journal-date">
                  <i className="bi bi-calendar3"></i> {formatDate(journal.workout_date)}
                </div>
                <h3 className="journal-title">운동 후기</h3>
                <p className="journal-content">{journal.content}</p>
                <div className="journal-footer">
                  <button 
                    className="btn btn-sm btn-secondary-custom me-2"
                    onClick={() => handleEdit(journal)}
                  >
                    <i className="bi bi-pencil"></i> 수정
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary-custom"
                    onClick={() => handleDelete(journal.journal_id)}
                  >
                    <i className="bi bi-trash"></i> 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 일지 생성/수정 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingJournal ? '일지 수정' : '새 일지 작성'}</h2>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>운동 날짜 *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.workoutDate}
                    onChange={(e) => setFormData({ ...formData, workoutDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>내용 *</label>
                  <textarea
                    className="form-control"
                    rows="8"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    placeholder="오늘의 운동 후기를 작성해주세요..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-custom" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary-custom">
                  {editingJournal ? '수정' : '저장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journals;
