// src/components/SideMenu.jsx - 왼쪽 슬라이드 메뉴 컴포넌트
import React from 'react';
import { X, MessageCircle, BarChart3, Phone, Cookie, LogOut } from 'lucide-react';

/**
 * SideMenu 컴포넌트 - 왼쪽에서 슬라이드되는 네비게이션 메뉴
 * @param {boolean} isOpen - 메뉴 열림/닫힘 상태
 * @param {Function} onClose - 메뉴 닫기 함수
 * @param {Function} onMenuClick - 메뉴 아이템 클릭 처리 함수
 */
const SideMenu = ({ isOpen, onClose, onMenuClick }) => {
  
  // 메뉴 아이템 클릭 처리
  const handleMenuClick = (menuName) => {
    onMenuClick(menuName); // 부모 컴포넌트로 메뉴 선택 전달
  };

  // 오버레이 클릭시 메뉴 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 키보드 접근성을 위한 Enter/Space 키 처리
  const handleKeyDown = (e, menuName) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMenuClick(menuName);
    }
  };

  return (
    <>
      {/* 오버레이 - 메뉴 외부 클릭시 닫기 */}
      <div 
        className={`menu-overlay ${isOpen ? 'visible' : 'hidden'}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* 사이드 메뉴 */}
      <nav 
        className={`side-menu ${isOpen ? 'open' : ''}`}
        role="navigation"
        aria-label="메인 네비게이션"
      >
        
        {/* 메뉴 헤더 */}
        <div className="menu-header">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="menu-close-button"
            aria-label="메뉴 닫기"
            type="button"
          >
            <X size={24} />
          </button>
          
          {/* 로고 */}
          <div className="logo"><img src="/todak_logo.png" alt="logo" /></div>
        </div>
        
        {/* 메뉴 아이템들 */}
        <div className="menu-items">
          
          {/* 대화보관함 */}
          <button
            onClick={() => handleMenuClick('대화보관함')}
            onKeyDown={(e) => handleKeyDown(e, '대화보관함')}
            className="menu-item chat"
            aria-label="대화보관함 페이지로 이동"
            type="button"
          >
            <MessageCircle size={20} aria-hidden="true" />
            <span>대화 보관함</span>
          </button>
          
          {/* 통계 */}
          <button
            onClick={() => handleMenuClick('통계')}
            onKeyDown={(e) => handleKeyDown(e, '통계')}
            className="menu-item stats"
            aria-label="통계 페이지로 이동"
            type="button"
          >
            <BarChart3 size={20} aria-hidden="true" />
            <span>통계</span>
          </button>
          
          {/* 상담사 연결 - 모달 트리거 */}
          <button
            onClick={() => handleMenuClick('상담사 연결')}
            onKeyDown={(e) => handleKeyDown(e, '상담사 연결')}
            className="menu-item consult"
            aria-label="상담사 연결 모달 열기"
            type="button"
          >
            <Phone size={20} aria-hidden="true" />
            <span>상담사 연결</span>
          </button>
          
          {/* 포츈쿠키 */}
          <button
            onClick={() => handleMenuClick('포츈쿠키')}
            onKeyDown={(e) => handleKeyDown(e, '포츈쿠키')}
            className="menu-item fortune"
            aria-label="포츈쿠키 페이지로 이동"
            type="button"
          >
            <Cookie size={20} aria-hidden="true" />
            <span>오늘의 포춘쿠키</span>
          </button>
          
        </div>

        {/* 로그아웃 버튼 - 하단 고정 */}
        <div className="menu-logout">
          <button
            onClick={() => handleMenuClick('logout')}
            onKeyDown={(e) => handleKeyDown(e, 'logout')}
            className="menu-item logout"
            aria-label="로그아웃"
            type="button"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>LOGOUT</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SideMenu;