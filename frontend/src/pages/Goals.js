import React, { useState, useEffect } from 'react';
import { goalApi } from '../api/goalApi';
import './Goals.css';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goalType: 'frequency',
    targetValue: 0,
    currentValue: 0,
    deadline: ''
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const response = await goalApi.getGoals();
      if (response.data.result) {
        setGoals(response.data.data || []);
      }
    } catch (error) {
      console.error('목표 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setFormData({
      goalType: 'frequency',
      targetValue: 0,
      currentValue: 0,
      deadline: ''
    });
    setShowModal(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      goalType: goal.goal_type,
      targetValue: goal.target_value,
      currentValue: goal.current_value,
      deadline: goal.deadline
    });
    setShowModal(true);
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('정말 이 목표를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await goalApi.deleteGoal(goalId);
      if (response.data.result) {
        alert('목표가 삭제되었습니다.');
        loadGoals();
      }
    } catch (error) {
      console.error('목표 삭제 실패:', error);
      alert('목표 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal) {
        const response = await goalApi.updateGoal(editingGoal.goal_id, formData);
        if (response.data.result) {
          alert('목표가 수정되었습니다.');
          setShowModal(false);
          loadGoals();
        }
      } else {
        const response = await goalApi.createGoal(formData);
        if (response.data.result) {
          alert('목표가 생성되었습니다.');
          setShowModal(false);
          loadGoals();
        }
      }
    } catch (error) {
      console.error('목표 저장 실패:', error);
      alert(error.response?.data?.error?.message || '목표 저장에 실패했습니다.');
    }
  };

  const getGoalTypeLabel = (type) => {
    const labels = {
      weight: '체중',
      muscle: '근육량',
      frequency: '운동 횟수',
      duration: '운동 시간',
      other: '기타'
    };
    return labels[type] || type;
  };

  const getGoalTypeIcon = (type) => {
    const icons = {
      weight: 'bi-scale',
      muscle: 'bi-activity',
      frequency: 'bi-calendar-check',
      duration: 'bi-clock',
      other: 'bi-bullseye'
    };
    return icons[type] || 'bi-bullseye';
  };

  if (loading) {
    return (
      <div className="goals-page">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="goals-page">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>
          <i className="bi bi-bullseye"></i> 목표
        </h1>
        <button className="btn btn-primary-custom" onClick={handleCreate}>
          <i className="bi bi-plus-circle"></i> 새 목표
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center p-5">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray-400)' }}></i>
          <p className="mt-3 text-muted">등록된 목표가 없습니다. 새 목표를 만들어보세요!</p>
        </div>
      ) : (
        <div className="row g-3">
          {goals.map((goal) => (
            <div key={goal.goal_id} className="col-12 col-md-6">
              <div className={`goal-card ${goal.status === 'completed' ? 'completed' : ''}`}>
                <div className="goal-header">
                  <h3>
                    <i className={`bi ${getGoalTypeIcon(goal.goal_type)}`}></i> {getGoalTypeLabel(goal.goal_type)} 목표
                  </h3>
                  <span className={`goal-badge ${goal.status === 'completed' ? 'completed' : goal.status === 'active' ? 'success' : ''}`}>
                    {goal.status === 'completed' ? '완료' : goal.status === 'active' ? '진행중' : '취소'}
                  </span>
                </div>
                <div className="goal-progress">
                  <div className="progress-info">
                    <span>
                      {goal.current_value} / {goal.target_value}
                      {goal.goal_type === 'frequency' && '회'}
                      {goal.goal_type === 'duration' && '분'}
                      {goal.goal_type === 'weight' && 'kg'}
                    </span>
                    <span className="progress-percent">{Math.round(goal.progress || 0)}%</span>
                  </div>
                  <div className="progress-bar-wrapper">
                    <div 
                      className="progress-bar-fill" 
                      style={{
                        width: `${Math.min(100, Math.round(goal.progress || 0))}%`,
                        background: goal.status === 'completed' 
                          ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)'
                          : 'linear-gradient(90deg, var(--primary-color) 0%, var(--primary-light) 100%)'
                      }}
                    ></div>
                  </div>
                </div>
                <div className="goal-deadline">
                  <i className="bi bi-calendar"></i> 마감일: {new Date(goal.deadline).toLocaleDateString('ko-KR')}
                </div>
                <div className="goal-actions mt-3">
                  <button 
                    className="btn btn-sm btn-secondary-custom me-2"
                    onClick={() => handleEdit(goal)}
                  >
                    <i className="bi bi-pencil"></i> 수정
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary-custom"
                    onClick={() => handleDelete(goal.goal_id)}
                  >
                    <i className="bi bi-trash"></i> 삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 목표 생성/수정 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal ? '목표 수정' : '새 목표 만들기'}</h2>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>목표 유형 *</label>
                  <select
                    className="form-control"
                    value={formData.goalType}
                    onChange={(e) => setFormData({ ...formData, goalType: e.target.value })}
                    required
                  >
                    <option value="frequency">운동 횟수</option>
                    <option value="duration">운동 시간</option>
                    <option value="weight">체중</option>
                    <option value="muscle">근육량</option>
                    <option value="other">기타</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>목표 값 *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>현재 값 *</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.currentValue}
                    onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) })}
                    required
                    min="0"
                    step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label>마감일 *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-custom" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary-custom">
                  {editingGoal ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Goals;
