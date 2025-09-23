// src/pages/Login.jsx - 로그인 페이지
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * LoginPage 컴포넌트 - 사용자 로그인 화면
 */
const LoginPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [errors, setErrors] = useState({}); // 에러 메시지

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
    }

    // 비밀번호 검사
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: 실제 로그인 API 호출
      // const response = await loginAPI(formData.id, formData.password);
      
      // 임시 로그인 로직 (실제 구현시 제거)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      
      console.log('로그인 시도:', formData);
      
      // 로그인 성공시 사용자 정보 저장 (실제로는 토큰 등 저장)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', formData.id);
      
      // 메인 페이지로 이동
      navigate('/');
      
    } catch (error) {
      console.error('로그인 실패:', error);
      setErrors({ 
        general: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin(e);
    }
  };

  // 회원가입 페이지로 이동
  const handleJoinClick = () => {
    navigate('/join');
  };

  return (
    <div className="center-container">
      <div className="auth-card">
        
        {/* 로고 영역 */}
        <div className="auth-header">
          <div className="auth-logo">
            <img src="/todak_logo.png" alt="logo" />
            <p className="main_txt"><span>토닥임</span>이 필요한 <b>나날</b></p>
          </div>
          
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="auth-form">
          
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
              placeholder="ID"
              className={`auth-input ${errors.id ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={20}
              autoComplete="username"
              autoFocus
            />
            {errors.id && (
              <div className="error-text">{errors.id}</div>
            )}
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
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>
          
          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="auth-button login-button"
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : 'LOGIN'}
          </button>
          
          {/* 회원가입 버튼 */}
          <button
            type="button"
            onClick={handleJoinClick}
            className="auth-button join-button"
            disabled={isLoading}
          >
            JOIN
          </button>
        </form>

        {/* 추가 정보 */}
        <div className="text-center" style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
          {/* <p>테스트용 계정: 아무 아이디나 입력하세요</p> */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;