import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const FortunePage = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [showMessage, setShowMessage] = useState(false);      // 메시지 표시 여부
  const [currentMessage, setCurrentMessage] = useState(null); // 서버에서 받은 메시지
  const [isLoading, setIsLoading] = useState(false);          // API 호출 중 여부

  // 뒤로가기 버튼
  const handleBack = () => {
    navigate('/');
  };

  // ✅ 서버에서 포춘쿠키 메시지 받아오기
  const handleCookieClick = async () => {
    if (isLoading) return; // 중복 클릭 방지
    setIsLoading(true);

    try {
      const res = await axios.get(
        'http://localhost:8080/api/v1/users/fortune/daily',
        { withCredentials: true }
      );
      // 서버에서 받아온 문자열 저장
      setCurrentMessage(res.data);
      setShowMessage(true);
    } catch (err) {
      console.error('포춘쿠키 불러오기 실패:', err);
      alert('포춘쿠키를 가져오지 못했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  // 다시 뽑기
  const handleRetry = () => {
    setShowMessage(false);
    setCurrentMessage(null);
  };

  return (
    <div className="page-container">
      <Header showBackButton={true} onBack={handleBack} title="포춘쿠키" />

      <div className="fortune-container">
        <div className="fortune-card">
          {!showMessage ? (
            // 쿠키 클릭 전
            <div
              className="cookie-container"
              onClick={handleCookieClick}
              role="button"
              tabIndex={0}
              aria-label="쿠키를 클릭해서 오늘의 메시지를 확인하세요"
            >
              {/* 쿠키 아이콘 */}
              <div className="cookie-image">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="cookie-icon"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="9" cy="9" r="1" />
                  <circle cx="15" cy="15" r="1" />
                  <circle cx="8" cy="15" r="1" />
                  <circle cx="16" cy="9" r="1" />
                </svg>
              </div>
              <p className="cookie-text">
                {isLoading ? '쿠키를 여는 중...' : '쿠키를 클릭해보세요!'}
              </p>
            </div>
          ) : (
            // 메시지 표시 후
            <div className="fortune-message">
              <div className="fortune-bubble">
                <p className="fortune-text">{currentMessage}</p>
              </div>

              <button
                onClick={handleRetry}
                className="fortune-retry"
                aria-label="새로운 포츈쿠키 뽑기"
              >
                다시 뽑기
              </button>
            </div>
          )}
        </div>

        {/* 오늘 날짜 표시 */}
        <div
          style={{
            marginTop: '1rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: '#6b7280',
          }}
        >
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </div>
      </div>
    </div>
  );
};

export default FortunePage;
