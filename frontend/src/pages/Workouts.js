import React, { useState, useEffect } from 'react';
import { workoutApi } from '../api/workoutApi';
import './Workouts.css';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutApi.getWorkoutLogs();
      if (response.data.result) {
        setWorkouts(response.data.data || []);
      }
    } catch (error) {
      console.error('운동 기록 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (logId) => {
    if (!window.confirm('정말 이 운동 기록을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await workoutApi.deleteWorkoutLog(logId);
      if (response.data.result) {
        alert('운동 기록이 삭제되었습니다.');
        loadWorkouts();
      }
    } catch (error) {
      console.error('운동 기록 삭제 실패:', error);
      alert('운동 기록 삭제에 실패했습니다.');
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
      <div className="workouts-page">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="workouts-page">
      <h1>
        <i className="bi bi-clipboard-check"></i> 운동 기록
      </h1>

      {workouts.length === 0 ? (
        <div className="text-center p-5">
          <i className="bi bi-inbox" style={{ fontSize: '4rem', color: 'var(--gray-400)' }}></i>
          <p className="mt-3 text-muted">등록된 운동 기록이 없습니다.</p>
        </div>
      ) : (
        workouts.map((workout) => (
          <div key={workout.log_id} className="workout-card">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="workout-date">{formatDate(workout.workout_date)}</div>
                <div className="workout-title">{workout.routine_name || '자유 운동'}</div>
              </div>
              <button 
                className="btn btn-sm btn-secondary-custom"
                onClick={() => handleDelete(workout.log_id)}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
            {workout.sets && workout.sets.length > 0 && (
              <div className="workout-exercises">
                {workout.sets.map((set, index) => (
                  <div key={index} className="exercise-item">
                    <span className="exercise-name">{set.exercise_name}</span>
                    <span className="exercise-sets">
                      {set.set_number}세트 × {set.reps}회
                      {set.weight && ` (${set.weight}kg)`}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="workout-summary">
              <div className="summary-item">
                <div className="summary-label">총 시간</div>
                <div className="summary-value">{workout.duration || 0}분</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">총 세트</div>
                <div className="summary-value">{workout.sets?.length || 0}세트</div>
              </div>
            </div>
            {workout.notes && (
              <div className="workout-notes mt-2">
                <small className="text-muted">{workout.notes}</small>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Workouts;
