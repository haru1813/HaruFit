import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import './Profile.css';

function Profile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nickname: '',
    height: '',
    weight: '',
    age: '',
    gender: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userApi.getProfile();
      if (response.data.result) {
        const profile = response.data.data;
        setFormData({
          nickname: profile.nickname || '',
          height: profile.height || '',
          weight: profile.weight || '',
          age: profile.age || '',
          gender: profile.gender || ''
        });
      }
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      // 기본값 설정
      if (user) {
        setFormData({
          nickname: user.nickname || '',
          height: '',
          weight: '',
          age: '',
          gender: ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const updateData = {
        nickname: formData.nickname,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null
      };

      const response = await userApi.updateProfile(updateData);
      if (response.data.result) {
        // 사용자 정보 업데이트
        const updatedUser = {
          ...user,
          ...response.data.data
        };
        login(updatedUser);
        alert('프로필이 수정되었습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      alert(error.response?.data?.error?.message || '프로필 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">로딩 중...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>
        <i className="bi bi-person-circle"></i> 프로필
      </h1>

      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="profile-card">
            <div className="profile-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <h2 className="profile-name">{formData.nickname || user?.nickname || '사용자'}</h2>
            <p className="profile-email">{user?.email || ''}</p>
          </div>
        </div>

        <div className="col-12 col-md-8">
          <div className="profile-card">
            <h3 className="section-title">개인 정보</h3>
            <form onSubmit={handleSubmit}>
              <div className="profile-form">
                <div className="form-group">
                  <label>닉네임</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>이메일</label>
                  <input
                    type="email"
                    className="form-control"
                    value={user?.email || ''}
                    disabled
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>키 (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="175"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>몸무게 (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="70"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>나이</label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>성별</label>
                      <select
                        className="form-control"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="">선택하세요</option>
                        <option value="male">남성</option>
                        <option value="female">여성</option>
                        <option value="other">기타</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary-custom w-100 mt-3"
                  disabled={saving}
                >
                  {saving ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
