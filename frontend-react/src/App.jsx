// src/App.jsx - 메인 애플리케이션 컴포넌트
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 페이지 컴포넌트 import
import LoginPage from './pages/Login';
import JoinPage from './pages/Join';
import MainPage from './pages/Main';
import HistoryPage from './pages/History';
import StatisticsPage from './pages/Statistics';
import FortunePage from './pages/Fortune';
import ChannelPage from './pages/ChannelPage';   // ✅ 새 채팅 페이지 추가

import './App.css';

/**
 * 보호된 라우트 (로그인 필수)
 */
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
};

/**
 * 공개 라우트 (로그인시 접근 금지)
 */
const PublicRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn) return <Navigate to="/" replace />;
  return children;
};

const ChatApp = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userId = localStorage.getItem('userId');

      if (isLoggedIn && userId) {
        setUser({ id: userId, isLoggedIn: true });
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('앱 초기화 실패:', error);
      localStorage.clear();
      setIsInitialized(true);
    }
  }, []);

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{
            fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem',
            color: '#9ca3af'
          }}>LOGO</div>
          <div>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 공개 라우트 */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/join" element={<PublicRoute><JoinPage /></PublicRoute>} />

          {/* 보호 라우트 */}
          <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><StatisticsPage /></ProtectedRoute>} />
          <Route path="/fortune" element={<ProtectedRoute><FortunePage /></ProtectedRoute>} />
          {/* ✅ 채널별 실시간 채팅 페이지 */}
          <Route
            path="/channel/:channelId"
            element={<ProtectedRoute><ChannelPage /></ProtectedRoute>}
          />

          {/* 404 처리 */}
          <Route path="*" element={
            <div style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6', textAlign: 'center'
            }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 'bold', color: '#ef4444' }}>404</h1>
              <h2 style={{ fontSize: '1.5rem', color: '#6b7280', marginBottom: '2rem' }}>
                페이지를 찾을 수 없습니다
              </h2>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white',
                  border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem'
                }}
              >
                홈으로 돌아가기
              </button>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default ChatApp;