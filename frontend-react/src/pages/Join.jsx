// src/pages/Join.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

/**
 * JoinPage 컴포넌트 - 사용자 회원가입 화면
 */
const JoinPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [errors, setErrors] = useState({}); // 유효성 검사 에러

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 입력값 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    // 아이디 검사
    if (!formData.id.trim()) {
      newErrors.id = '아이디를 입력해주세요.';
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.id)) {
      newErrors.id = '아이디는 영문자와 숫자만 사용 가능합니다.';
    }

    // 비밀번호 검사
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    // 비밀번호 확인 검사
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    // 닉네임 검사
    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다.';
    } else if (formData.nickname.length > 10) {
      newErrors.nickname = '닉네임은 10자 이하여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 처리 함수
  const handleJoin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    setIsLoading(true);
    
    try {
      // 백엔드 DTO(UserSignupRequest) 기준으로 데이터 매핑
      const requestData = {
        username: formData.id,
        pw: formData.password,
        nick: formData.nickname
      };

      const response = await axios.post(
        'http://localhost:8080/api/v1/users',
        requestData
      );

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다!');
      
      // 로그인 페이지로 이동
      navigate('/login');
      
    } catch (error) {
      console.error('회원가입 실패:', error);

      // 서버에서 반환한 메시지 사용 가능
      const message = error.response?.data || '회원가입에 실패했습니다. 다시 시도해주세요.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleJoin(e);
    }
  };

  // 로그인 페이지로 돌아가기
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="center-container">
      <div className="auth-card">

        <h2>회원가입</h2>

        <form onSubmit={handleJoin} className="auth-form">
          {/* 전체 에러 메시지 */}
          {errors.general && (
            <div className="error-text text-center">
              {errors.general}
            </div>
          )}
          
          {/* 아이디 입력 */}
          <div>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="ID (영문/숫자)"
              className={`auth-input ${errors.id ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={20}
              autoComplete="username"
              autoFocus
            />
            {errors.id && <div className="error-text">{errors.id}</div>}
          </div>
          
          {/* 비밀번호 입력 */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="PW"
              className={`auth-input ${errors.password ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={50}
              autoComplete="new-password"
            />
            {errors.password && <div className="error-text">{errors.password}</div>}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="PW 확인"
              className={`auth-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={50}
              autoComplete="new-password"
            />
            {errors.confirmPassword && <div className="error-text">{errors.confirmPassword}</div>}
          </div>
          
          {/* 닉네임 입력 */}
          <div>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="NICK"
              className={`auth-input ${errors.nickname ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={10}
            />
            {errors.nickname && <div className="error-text">{errors.nickname}</div>}
          </div>
          
          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="auth-button signup-button"
            disabled={isLoading}
          >
            {isLoading ? '가입 중...' : 'JOIN'}
          </button>
        </form>
        
        {/* 로그인 페이지로 돌아가기 링크 */}
        <button
          type="button"
          onClick={handleBackToLogin}
          className="auth-link"
          disabled={isLoading}
        >
          ← 로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default JoinPage;
