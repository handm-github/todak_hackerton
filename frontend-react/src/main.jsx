// src/main.jsx - React 애플리케이션 진입점
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // 전역 기본 스타일

// React 18의 createRoot API 사용
// StrictMode는 개발 모드에서 잠재적 문제를 찾아주는 도구
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);