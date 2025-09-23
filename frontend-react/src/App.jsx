// src/App.jsx - 메인 애플리케이션 컴포넌트
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 페이지 컴포넌트들 import
import LoginPage from './pages/Login';
import JoinPage from './pages/Join';
import MainPage from './pages/Main';
import HistoryPage from './pages/History';
import StatisticsPage from './pages/Statistics';
import FortunePage from './pages/Fortune';

// CSS 파일 import
import './App.css';

/**
 * ProtectedRoute 컴포넌트 - 로그인이 필요한 페이지 보호
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * PublicRoute 컴포넌트 - 로그인 후 접근하면 안되는 페이지 (로그인, 회원가입)
 */
const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

/**
 * ChatApp 컴포넌트 - 메인 애플리케이션
 */
const ChatApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  // 앱 초기화 및 사용자 정보 로드
  useEffect(() => {
    initializeApp();
  }, []);

  // 애플리케이션 초기화 함수
  const initializeApp = () => {
    try {
      // 로컬 스토리지에서 사용자 정보 확인
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userId = localStorage.getItem('userId');
      
      if (isLoggedIn && userId) {
        setUser({
          id: userId,
          isLoggedIn: true
        });
      }
      
      setIsInitialized(true);
      
    } catch (error) {
      console.error('앱 초기화 실패:', error);
      // 에러 발생시 로컬 스토리지 클리어
      localStorage.clear();
      setIsInitialized(true);
    }
  };

  // 로딩 중일 때 표시할 컴포넌트
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: '#9ca3af'
          }}>
            LOGO
          </div>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 공개 라우트 - 로그인하지 않은 사용자만 접근 가능 */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/join" 
            element={
              <PublicRoute>
                <JoinPage />
              </PublicRoute>
            } 
          />

          {/* 보호된 라우트 - 로그인이 필요한 페이지들 */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/history" 
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stats" 
            element={
              <ProtectedRoute>
                <StatisticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/fortune" 
            element={
              <ProtectedRoute>
                <FortunePage />
              </ProtectedRoute>
            } 
          />

          {/* 404 페이지 - 존재하지 않는 경로 */}
          <Route 
            path="*" 
            element={
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f3f4f6',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <h1 style={{ 
                  fontSize: '4rem', 
                  fontWeight: 'bold', 
                  color: '#ef4444',
                  marginBottom: '1rem'
                }}>
                  404
                </h1>
                <h2 style={{ 
                  fontSize: '1.5rem', 
                  color: '#6b7280',
                  marginBottom: '2rem'
                }}>
                  페이지를 찾을 수 없습니다
                </h2>
                <button 
                  onClick={() => window.location.href = '/'}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
                >
                  홈으로 돌아가기
                </button>
              </div>
            } 
          />
        </Routes>

        {/* 개발 환경에서만 표시되는 디버그 정보 */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            zIndex: 1000,
            fontFamily: 'monospace'
          }}>
            <div>경로: {window.location.pathname}</div>
            {user && <div>사용자: {user.id}</div>}
            <div>로그인: {user ? '✓' : '✗'}</div>
          </div>
        )} */}
      </div>
    </Router>
  );
};

export default ChatApp;