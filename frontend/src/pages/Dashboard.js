import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { routineApi } from '../api/routineApi';
import { workoutApi } from '../api/workoutApi';
import { goalApi } from '../api/goalApi';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { isAuthenticated, loading, user } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({
    workoutCount: 0,
    totalDuration: 0,
    totalCalories: 0,
    completionRate: 0
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      window.location.replace('/login');
      return;
    }

    if (!isAuthenticated || !user) {
      window.location.replace('/login');
      return;
    }

    loadData();
  }, [isAuthenticated, user]);

  const loadData = async () => {
    try {
      // 루틴 목록 (최근 3개)
      const routinesRes = await routineApi.getRoutines();
      if (routinesRes.data.result) {
        setRoutines(routinesRes.data.data.slice(0, 3) || []);
      }

      // 최근 운동 기록 (이번 주)
      const workoutsRes = await workoutApi.getWorkoutLogs();
      if (workoutsRes.data.result) {
        const thisWeekWorkouts = workoutsRes.data.data.filter(workout => {
          const workoutDate = new Date(workout.workout_date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return workoutDate >= weekAgo;
        });
        setWorkouts(thisWeekWorkouts);

        // 통계 계산
        const workoutCount = thisWeekWorkouts.length;
        const totalDuration = thisWeekWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
        const totalCalories = Math.round(totalDuration * 7); // 대략적인 계산
        const completionRate = goals.length > 0 
          ? Math.round((goals.filter(g => g.status === 'completed').length / goals.length) * 100)
          : 0;

        setStats({
          workoutCount,
          totalDuration,
          totalCalories,
          completionRate
        });
      }

      // 목표 목록
      const goalsRes = await goalApi.getGoals();
      if (goalsRes.data.result) {
        setGoals(goalsRes.data.data || []);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>
        <i className="bi bi-calendar-check"></i> 오늘의 운동
      </h1>
      {routines.length === 0 ? (
        <div className="text-center p-4 mb-4">
          <p className="text-muted">등록된 루틴이 없습니다.</p>
          <Link to="/routines" className="btn btn-primary-custom">
            <i className="bi bi-plus-circle"></i> 루틴 만들기
          </Link>
        </div>
      ) : (
        <div className="row g-3">
          {routines.map((routine) => (
            <div key={routine.routineId} className="col-12 col-md-6 col-lg-4">
              <div className="card-custom">
                <h3><i className="bi bi-activity"></i> {routine.name}</h3>
                <p className="text-muted">운동 종목: {routine.exercises?.length || 0}개</p>
                <Link to={`/routines`} className="btn btn-primary-custom w-100">
                  시작하기
                </Link>
              </div>
            </div>
          ))}
          {routines.length < 3 && (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card-custom" style={{ border: '2px dashed var(--gray-300)', background: 'var(--gray-50)' }}>
                <h3><i className="bi bi-plus-circle"></i> 새 루틴 만들기</h3>
                <p className="text-muted">새로운 운동 루틴을 만들어보세요</p>
                <Link to="/routines" className="btn btn-secondary-custom w-100">
                  만들기
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      
      <h2>
        <i className="bi bi-graph-up"></i> 이번 주 통계
      </h2>
      <div className="row g-2 g-md-3">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="stat-label">운동 횟수</div>
            <div className="stat-value">{stats.workoutCount}회</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'}}>
            <div className="stat-label">총 시간</div>
            <div className="stat-value">{stats.totalDuration}분</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'}}>
            <div className="stat-label">소모 칼로리</div>
            <div className="stat-value">{stats.totalCalories}kcal</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card" style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'}}>
            <div className="stat-label">완료율</div>
            <div className="stat-value">{stats.completionRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
