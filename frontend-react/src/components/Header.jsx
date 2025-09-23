// src/components/Header.jsx - 헤더 컴포넌트
import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';

/**
 * Header 컴포넌트
 * @param {Function} onMenuToggle - 메뉴 토글 함수
 * @param {boolean} showBackButton - 뒤로가기 버튼 표시 여부
 * @param {Function} onBack - 뒤로가기 함수
 * @param {string} title - 페이지 제목
 */
const Header = ({ 
  onMenuToggle, 
  showBackButton = false, 
  onBack, 
  title = "" 
}) => {
  return (
    <header className="header">
      {/* 왼쪽: 메뉴 버튼 또는 뒤로가기 버튼 */}
      {showBackButton ? (
        <button
          onClick={onBack}
          className="header-button"
          aria-label="뒤로가기"
          type="button"
        >
          <ArrowLeft size={24} />
        </button>
      ) : (
        <button
          onClick={onMenuToggle}
          className="header-button"
          aria-label="메뉴 열기"
          type="button"
        >
          <Menu size={24} />
        </button>
      )}
      
      {/* 중앙: 페이지 제목 (선택적 표시) */}
      {title && (
        <h1 className="page-title">{title}</h1>
      )}
      
      {/* 오른쪽: 로고 */}
      <div className="logo"><img src="/todak_logo.png" alt="logo" /></div>
    </header>
  );
};

export default Header;