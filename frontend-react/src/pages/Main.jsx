// src/pages/Main.jsx - 채팅 메인 페이지 (로그아웃 기능 수정)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import ConsultationModal from '../components/ConsultationModal';

/**
 * MainPage 컴포넌트 - 채팅 메인 화면
 */
const MainPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "안녕하세요! 무엇을 도와드릴까요?", 
      sender: "bot", 
      timestamp: "2025.09.18",
      time: "14:30"
    },
    { 
      id: 2, 
      text: "채팅 기능 테스트입니다.", 
      sender: "user", 
      timestamp: "2025.09.17",
      time: "15:20"
    }
  ]);
  const [newMessage, setNewMessage] = useState(''); // 입력중인 메시지
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 사이드 메뉴 상태
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false); // 상담 모달 상태
  const [isTyping, setIsTyping] = useState(false); // 봇 타이핑 상태

  // 현재 시간 포맷 함수
  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:MM 형식
  };

  // 현재 날짜 포맷 함수
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0].replace(/-/g, '.'); // YYYY.MM.DD 형식
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage.trim(),
      sender: "user",
      timestamp: getCurrentDate(),
      time: getCurrentTime()
    };

    // 사용자 메시지 추가
    setMessages(prev => [...prev, userMessage]);
    setNewMessage(''); // 입력창 초기화
    setIsTyping(true); // 봇 타이핑 표시

    // 봇 응답 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      const botResponses = [
        "네, 이해했습니다. 더 도와드릴 것이 있나요?",
        "좋은 질문이네요. 어떤 부분이 궁금하신가요?",
        "함께 이야기해보면 도움이 될 것 같아요.",
        "그런 마음이 드시는군요. 더 자세히 말씀해 주세요.",
        "힘든 상황이시군요. 저와 함께 이야기해보시겠어요?"
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "bot",
        timestamp: getCurrentDate(),
        time: getCurrentTime()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false); // 타이핑 표시 해제
    }, 1000 + Math.random() * 2000); // 1-3초 랜덤 지연
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 확인 메시지
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // localStorage 완전 초기화
      localStorage.clear();
      
      // 또는 특정 항목만 제거하려면:
      // localStorage.removeItem('isLoggedIn');
      // localStorage.removeItem('userId');
      
      // 로그인 페이지로 이동
      navigate('/login', { replace: true });
    }
  };

  // 메뉴 클릭 처리 함수
  const handleMenuClick = (menu) => {
    if (menu === '상담사 연결') {
      // 메뉴를 먼저 닫고, 0.3초 후 상담 모달 열기
      setIsMenuOpen(false);
      setTimeout(() => setIsConsultModalOpen(true), 300);
    } else if (menu === 'logout') {
      // 로그아웃 처리 함수 호출
      setIsMenuOpen(false); // 메뉴 먼저 닫기
      handleLogout();
    } else if (menu === '대화보관함') {
      navigate('/history');
      setIsMenuOpen(false);
    } else if (menu === '통계') {
      navigate('/stats');
      setIsMenuOpen(false);
    } else if (menu === '포츈쿠키') {
      navigate('/fortune');
      setIsMenuOpen(false);
    }
  };

  // 컴포넌트 마운트시 환영 메시지 (선택적)
  useEffect(() => {
    // 실제 구현시에는 사용자 정보를 가져와서 개인화된 인사말 표시
    console.log('메인 페이지 로드됨');
  }, []);

  return (
    <div className="page-container">
      {/* 헤더 */}
      <Header onMenuToggle={() => setIsMenuOpen(true)} />

      {/* 채팅 메시지 영역 */}
      <div className="chat-container">
        <div className="messages-wrapper">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-item ${message.sender === 'user' ? 'user' : ''}`}
            >
              {/* 프로필 아바타 */}
              <div className={`message-avatar ${
                message.sender === 'user' ? 'avatar-user' : 'avatar-bot'
              }`}></div>
              
              {/* 메시지 내용 */}
              <div className="message-content">
                <div className={`message-bubble ${
                  message.sender === 'user' ? 'bubble-user' : 'bubble-bot'
                }`}>
                  {message.text}
                </div>
                
                {/* 타임스탬프 */}
                <div className={`message-timestamp ${
                  message.sender === 'user' ? 'timestamp-right' : 'timestamp-left'
                }`}>
                  {message.time} • {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {/* 봇 타이핑 대기 에니메이션 */}
          {isTyping && (
            <div className="message-item">
              <div className="message-avatar avatar-bot"></div>
              <div className="message-content">
                <div className="message-bubble bubble-bot">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 메시지 입력 푸터 */}
      <Footer 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={sendMessage}
      />

      {/* 사이드 메뉴 */}
      <SideMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMenuClick={handleMenuClick}
      />

      {/* 상담사 연결 모달 */}
      <ConsultationModal 
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />

      {/* 타이핑 인디케이터 CSS */}
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #9ca3af;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default MainPage;