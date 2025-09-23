// src/pages/History.jsx - 대화보관함 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

/**
 * HistoryPage 컴포넌트 - 이전 대화 기록 표시
 */
const HistoryPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);

  // 컴포넌트 마운트시 대화 기록 로드
  useEffect(() => {
    loadChatHistory();
  }, []);

  // 대화 기록 로드 함수
  const loadChatHistory = async () => {
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/chat-history');
      // const data = await response.json();
      
      // 임시 데이터 (실제 구현시 제거)
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockHistory = [
        {
          id: 1,
          date: "2025.09.18",
          messages: [
            "오늘 기분이 어떠세요?",
            "조금 우울해요.",
            "그럴 때가 있죠. 천천히 이야기해보세요.",
            "학교에서 친구들과 문제가 있었어요.",
            "어떤 일이 있었는지 말씀해 주시겠어요?"
          ],
          summary: "친구 관계 고민 상담",
          mood: "우울",
          duration: "15분"
        },
        {
          id: 2, 
          date: "2025.09.17",
          messages: [
            "안녕하세요!",
            "네, 안녕하세요. 오늘 하루는 어떠셨나요?",
            "학교에서 힘든 일이 있었어요.",
            "어떤 힘든 일이 있었는지 들어볼게요.",
            "시험 때문에 스트레스를 많이 받고 있어요."
          ],
          summary: "학업 스트레스 상담",
          mood: "스트레스",
          duration: "12분"
        },
        {
          id: 3,
          date: "2025.09.16", 
          messages: [
            "스트레스를 받을 때 어떻게 해결하시나요?",
            "운동이나 음악 듣기를 추천드려요.",
            "좋은 방법이네요. 시도해볼게요.",
            "그 외에도 깊은 호흡이나 명상도 도움이 됩니다.",
            "감사합니다. 실천해보겠어요."
          ],
          summary: "스트레스 해소 방법 상담",
          mood: "보통",
          duration: "8분"
        }
      ];

      setChatHistory(mockHistory);
      setLoading(false);
      
    } catch (error) {
      console.error('대화 기록 로드 실패:', error);
      setLoading(false);
    }
  };

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/');
  };

  // 대화 항목 클릭 처리
  const handleChatClick = (chatData) => {
    setSelectedChat(chatData);
  };

  // 대화 상세 닫기
  const handleCloseDetail = () => {
    setSelectedChat(null);
  };

  // 대화 삭제 함수
  const handleDeleteChat = (chatId) => {
    if (window.confirm('이 대화를 삭제하시겠습니까?')) {
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
      if (selectedChat && selectedChat.id === chatId) {
        setSelectedChat(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header showBackButton={true} onBack={handleBack} title="대화보관함" />
        <div className="history-container">
          <div className="text-center" style={{ padding: '2rem' }}>
            <div>대화 기록을 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header showBackButton={true} onBack={handleBack} title="대화보관함" />
      
      {!selectedChat ? (
        // 대화 목록 화면
        <div className="history-container">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat) => (
              <div key={chat.id}>
                {/* 날짜 구분선 */}
                <div className="history-date">{chat.date}</div>
                
                {/* 대화 항목 */}
                <div 
                  className="history-item"
                  onClick={() => handleChatClick(chat)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleChatClick(chat);
                    }
                  }}
                  aria-label={`${chat.date} ${chat.summary} 대화 보기`}
                >
                  {/* 대화 요약 정보 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontWeight: '600', color: '#1f2937' }}>{chat.summary}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(chat.id);
                      }}
                      style={{ 
                        padding: '0.25rem', 
                        color: '#ef4444', 
                        fontSize: '0.875rem',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      aria-label="대화 삭제"
                    >
                      삭제
                    </button>
                  </div>
                  
                  {/* 첫 번째와 마지막 메시지 미리보기 */}
                  <div style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: '1.4' }}>
                    <p style={{ fontWeight: '500' }}>{chat.messages[0]}</p>
                    {chat.messages.length > 1 && (
                      <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>
                        ...{chat.messages[chat.messages.length - 1]}
                      </p>
                    )}
                  </div>
                  
                  {/* 대화 메타 정보 */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: '#9ca3af'
                  }}>
                    <span>총 {chat.messages.length}개 메시지</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span>기분: {chat.mood}</span>
                      <span>•</span>
                      <span>{chat.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // 대화 기록이 없을 때
            <div className="text-center" style={{ padding: '3rem 1rem' }}>
              <div style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '1rem' }}>
                저장된 대화가 없습니다
              </div>
              <button 
                onClick={() => navigate('/')}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                새 대화 시작하기
              </button>
            </div>
          )}
        </div>
      ) : (
        // 대화 상세 화면
        <div className="history-container">
          
          
          <div className="history-date">{selectedChat.date}</div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', color: '#1f2937' }}>{selectedChat.summary}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedChat.messages.map((message, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: index % 2 === 0 ? '#f9fafb' : '#eff6ff',
                    borderRadius: '0.5rem',
                    borderLeft: `4px solid ${index % 2 === 0 ? '#d1d5db' : '#3b82f6'}`
                  }}
                >
                  {message}
                </div>
              ))}
            </div>
            
            {/* 대화 정보 */}
            <div style={{ 
              marginTop: '1.5rem', 
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <div>기분: {selectedChat.mood}</div>
              <div>대화 시간: {selectedChat.duration}</div>
              <div>메시지 수: {selectedChat.messages.length}개</div>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={handleCloseDetail}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              목록 보러가기
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default HistoryPage;