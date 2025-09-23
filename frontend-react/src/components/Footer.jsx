// src/components/Footer.jsx - 메시지 입력 영역 컴포넌트
import React from 'react';
import { Send } from 'lucide-react';

/**
 * Footer 컴포넌트 - 채팅 메시지 입력 영역
 * @param {string} newMessage - 현재 입력중인 메시지
 * @param {Function} setNewMessage - 메시지 상태 업데이트 함수
 * @param {Function} onSendMessage - 메시지 전송 함수
 */
const Footer = ({ newMessage, setNewMessage, onSendMessage }) => {
  
  // Enter 키 처리 함수 (Shift+Enter는 줄바꿈, Enter만 전송)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // 기본 Enter 동작 방지
      onSendMessage();
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <footer className="footer">
      <div className="input-wrapper">
        {/* 메시지 입력 필드 */}
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요"
          className="message-input"
          maxLength={500} // 최대 글자수 제한
          autoComplete="off" // 자동완성 비활성화
        />
        
        {/* 전송 버튼 */}
        <button
          onClick={onSendMessage}
          className="send-button"
          disabled={!newMessage.trim()} // 빈 메시지는 전송 불가
          aria-label="메시지 전송"
          type="button"
        >
          <Send size={20} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;