import React, { useState, useEffect } from 'react';
import { routineApi } from '../api/routineApi';
import './Routines.css';

function Routines() {
  const [routines, setRoutines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    exercises: []
  });

  useEffect(() => {
    loadRoutines();
    loadExercises();
  }, []);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const response = await routineApi.getRoutines();
      if (response.data.result) {
        setRoutines(response.data.data || []);
      }
    } catch (error) {
      console.error('루틴 목록 로드 실패:', error);
      alert('루틴 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      const response = await routineApi.getExercises();
      if (response.data.result) {
        setExercises(response.data.data || []);
      }
    } catch (error) {
      console.error('운동 목록 로드 실패:', error);
    }
  };

  const handleCreate = () => {
    setEditingRoutine(null);
    setFormData({
      name: '',
      description: '',
      exercises: []
    });
    setShowModal(true);
  };

  const handleEdit = async (routineId) => {
    try {
      const response = await routineApi.getRoutine(routineId);
      if (response.data.result) {
        const routine = response.data.data;
        setEditingRoutine(routine);
        setFormData({
          name: routine.name,
          description: routine.description || '',
          exercises: routine.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight || 0,
            restTime: ex.restTime || 0,
            order: ex.order
          }))
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error('루틴 조회 실패:', error);
      alert('루틴 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleDelete = async (routineId) => {
    if (!window.confirm('정말 이 루틴을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await routineApi.deleteRoutine(routineId);
      if (response.data.result) {
        alert('루틴이 삭제되었습니다.');
        loadRoutines();
      }
    } catch (error) {
      console.error('루틴 삭제 실패:', error);
      alert('루틴 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('루틴 이름을 입력해주세요.');
      return;
    }

    if (formData.exercises.length === 0) {
      alert('최소 1개 이상의 운동을 추가해주세요.');
      return;
    }

    try {
      if (editingRoutine) {
        const response = await routineApi.updateRoutine(editingRoutine.routineId, formData);
        if (response.data.result) {
          alert('루틴이 수정되었습니다.');
          setShowModal(false);
          loadRoutines();
        }
      } else {
        const response = await routineApi.createRoutine(formData);
        if (response.data.result) {
          alert('루틴이 생성되었습니다.');
          setShowModal(false);
          loadRoutines();
        }
      }
    } catch (error) {
      console.error('루틴 저장 실패:', error);
      alert(error.response?.data?.error?.message || '루틴 저장에 실패했습니다.');
    }
  };

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, {
        exerciseId: '',
        sets: 3,
        reps: 10,
        weight: 0,
        restTime: 60,
        order: formData.exercises.length + 1
      }]
    });
  };

  const removeExercise = (index) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index)
    });
  };

  const updateExercise = (index, field, value) => {
    const updated = [...formData.exercises];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, exercises: updated });
  };

  if (loading) {
    return (
      <div className="routines-page">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="routines-page">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h1>
          <i className="bi bi-list-check"></i> 루틴 관리
        </h1>
        <button className="btn btn-primary-custom" onClick={handleCreate}>
          <i className="bi bi-plus-circle"></i> 새 루틴
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center p-5">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray-400)' }}></i>
          <p className="mt-3 text-muted">등록된 루틴이 없습니다. 새 루틴을 만들어보세요!</p>
        </div>
      ) : (
        <div className="row g-3">
          {routines.map((routine) => (
            <div key={routine.routineId} className="col-12 col-md-6 col-lg-4">
              <div className="routine-card">
                <div className="routine-header">
                  <h3>{routine.name}</h3>
                  <div className="routine-actions">
                    <button 
                      className="btn-icon" 
                      onClick={() => handleEdit(routine.routineId)}
                      title="수정"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleDelete(routine.routineId)}
                      title="삭제"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <p className="routine-description">{routine.description || '설명 없음'}</p>
                <div className="routine-stats">
                  <span><i className="bi bi-list-ul"></i> {routine.exercises?.length || 0}개 운동</span>
                </div>
                <button className="btn btn-primary-custom w-100 mt-3">시작하기</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 루틴 생성/수정 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRoutine ? '루틴 수정' : '새 루틴 만들기'}</h2>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>루틴 이름 *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>설명</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label>운동 목록 *</label>
                    <button type="button" className="btn btn-sm btn-secondary-custom" onClick={addExercise}>
                      <i className="bi bi-plus"></i> 추가
                    </button>
                  </div>
                  {formData.exercises.map((exercise, index) => (
                    <div key={index} className="exercise-form-item">
                      <div className="row g-2 mb-2">
                        <div className="col-12">
                          <select
                            className="form-control"
                            value={exercise.exerciseId}
                            onChange={(e) => updateExercise(index, 'exerciseId', parseInt(e.target.value))}
                            required
                          >
                            <option value="">운동 선택</option>
                            {exercises.map(ex => (
                              <option key={ex.exercise_id} value={ex.exercise_id}>
                                {ex.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="세트"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                            required
                            min="1"
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="횟수"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                            required
                            min="1"
                          />
                        </div>
                        <div className="col-6">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="무게 (kg)"
                            value={exercise.weight}
                            onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                            min="0"
                            step="0.5"
                          />
                        </div>
                        <div className="col-5">
                          <input
                            type="number"
                            className="form-control"
                            placeholder="휴식 (초)"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value))}
                            min="0"
                          />
                        </div>
                        <div className="col-1">
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => removeExercise(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.exercises.length === 0 && (
                    <p className="text-muted small">운동을 추가해주세요.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary-custom" onClick={() => setShowModal(false)}>
                  취소
                </button>
                <button type="submit" className="btn btn-primary-custom">
                  {editingRoutine ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Routines;
