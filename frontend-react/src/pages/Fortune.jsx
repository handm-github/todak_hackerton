// src/pages/Fortune.jsx - 포춘쿠키 페이지 (완성)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

/**
 * FortunePage 컴포넌트 - 포춘쿠키 메시지 표시
 */
const FortunePage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [showMessage, setShowMessage] = useState(false); // 메시지 표시 여부
  const [currentMessage, setCurrentMessage] = useState(null); // 현재 표시되는 메시지
  const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 상태

  // 포츈쿠키 메시지 목록
  const fortuneMessages = [
    {
      message: "오늘의 힘찬 하루를 응원합니다! 좋은 일이 생길거예요!",
      quote: "또한 같은 날이다. 기대해봐도 좋겠습니다."
    },
    {
      message: "어려운 시간이 지나면 반드시 밝은 내일이 기다리고 있어요.",
      quote: "모든 구름 뒤에는 태양이 숨어있다."
    },
    {
      message: "당신의 노력은 헛되지 않을 것입니다. 조금만 더 힘내세요!",
      quote: "천 리 길도 한 걸음부터."
    },
    {
      message: "오늘 하루도 당신이 소중한 존재라는 것을 잊지 마세요.",
      quote: "당신은 생각보다 강하고, 느끼는 것보다 사랑받고 있습니다."
    },
    {
      message: "작은 변화가 큰 행복을 가져다 줄 거예요.",
      quote: "나비의 날갯짓이 태풍을 일으킬 수 있다."
    },
    {
      message: "힘든 시간도 당신을 더 강하게 만들어 줄 거예요.",
      quote: "고통 없이는 얻는 것도 없다."
    },
    {
      message: "오늘은 새로운 시작을 위한 완벽한 날입니다.",
      quote: "새로운 시작에는 마법이 깃들어 있다."
    }
  ];

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/');
  };

  // 쿠키 클릭 처리 함수
  const handleCookieClick = () => {
    if (isAnimating) return; // 애니메이션 중이면 클릭 무시
    
    setIsAnimating(true);
    
    // 랜덤하게 메시지 선택
    const randomIndex = Math.floor(Math.random() * fortuneMessages.length);
    const selectedMessage = fortuneMessages[randomIndex];
    
    // 쿠키 크래킹 애니메이션 후 메시지 표시
    setTimeout(() => {
      setCurrentMessage(selectedMessage);
      setShowMessage(true);
      setIsAnimating(false);
    }, 500);
  };

  // 다시 뽑기 함수
  const handleRetry = () => {
    setShowMessage(false);
    setCurrentMessage(null);
  };

  // 키보드 접근성
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !showMessage && !isAnimating) {
      e.preventDefault();
      handleCookieClick();
    }
  };

  return (
    <div className="page-container">
      <Header showBackButton={true} onBack={handleBack} title="포춘쿠키" />
      
      {/* 포춘쿠키 콘텐츠 */}
      <div className="fortune-container">
        <div className="fortune-card">
          
          {!showMessage ? (
            /* 쿠키 상태 - 클릭 전 */
            <div 
              className={`cookie-container ${isAnimating ? 'cracking' : ''}`}
              onClick={handleCookieClick}
              onKeyDown={handleKeyDown}
              role="button"
              tabIndex={0}
              aria-label="쿠키를 클릭해서 오늘의 메시지를 확인하세요"
            >
              {/* 쿠키 이미지 */}
              <div className="cookie-image">
                {/* 쿠키 아이콘 (SVG) */}
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="cookie-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="9" cy="9" r="1"/>
                  <circle cx="15" cy="15" r="1"/>
                  <circle cx="8" cy="15" r="1"/>
                  <circle cx="16" cy="9" r="1"/>
                </svg>
              </div>
              
              {/* 클릭 안내 텍스트 */}
              <p className="cookie-text">
                {isAnimating ? '쿠키를 여는 중...' : '쿠키를 클릭해보세요!'}
              </p>
            </div>
          ) : (
            /* 메시지 상태 - 클릭 후 */
            <div className="fortune-message">
              
              {/* 메시지 말풍선 */}
              <div className="fortune-bubble">
                <p className="fortune-text">{currentMessage.message}</p>
              </div>
              
              {/* 명언 */}
              <p className="fortune-quote">
                "{currentMessage.quote}"
              </p>
              
              {/* 다시 뽑기 버튼 */}
              <button
                onClick={handleRetry}
                className="fortune-retry"
                aria-label="새로운 포츈쿠키 뽑기"
                type="button"
              >
                다시 뽑기
              </button>
            </div>
          )}
          
        </div>
        
        {/* 포춘쿠키 설명 */}
        {!showMessage && !isAnimating && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#fff7ed', 
            borderRadius: '0.5rem',
            border: '1px solid #fed7aa'
          }}>
            <h3 style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#c2410c', 
              marginBottom: '0.5rem' 
            }}>
              오늘의 포춘쿠키
            </h3>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#ea580c' 
            }}>
              매일 새로운 희망의 메시지를 받아보세요. 
              쿠키를 클릭하면 당신을 위한 특별한 메시지가 나타납니다.
            </p>
          </div>
        )}

        {/* 오늘의 날짜 표시 */}
        <div style={{ 
          marginTop: '1rem', 
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          {new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </div>
      </div>

      {/* 쿠키 크래킹 애니메이션 CSS */}
      <style jsx>{`
        .cookie-container.cracking .cookie-image {
          animation: crack 0.5s ease-in-out;
        }
        
        .cookie-container.cracking .cookie-icon {
          animation: shake 0.5s ease-in-out;
        }
        
        @keyframes crack {
          0% { transform: scale(1); }
          25% { transform: scale(1.05) rotate(-2deg); }
          50% { transform: scale(1.1) rotate(2deg); }
          75% { transform: scale(1.05) rotate(-1deg); }
          100% { transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .fortune-message {
          animation: slideUp 0.5s ease-out;
        }
        
        .fortune-bubble {
          animation: bounceIn 0.6s ease-out;
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .cookie-container:focus {
          outline: 2px solid #f97316;
          outline-offset: 4px;
        }
      `}</style>
    </div>
  );
};

export default FortunePage;