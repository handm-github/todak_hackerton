// src/components/ConsultationModal.jsx - 상담사 연결 모달 컴포넌트
import React from 'react';
import { X, Heart } from 'lucide-react';

/**
 * ConsultationModal 컴포넌트 - 아래에서 위로 슬라이드되는 상담사 연결 모달
 * @param {boolean} isOpen - 모달 열림/닫힘 상태
 * @param {Function} onClose - 모달 닫기 함수
 */
const ConsultationModal = ({ isOpen, onClose }) => {
  
  // 상담 전화 연결 핸들러
  const handleConsultationClick = (type) => {
    // 실제 구현시에는 전화 연결 또는 상담 예약 API 호출
    alert(`${type} 연결을 시도합니다.`);
    console.log(`상담 요청: ${type}`);
  };

  // 오버레이 클릭시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 키보드 접근성을 위한 Escape 키 처리
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 모달이 열렸을 때 body 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* 오버레이 - 모달 외부 클릭시 닫기 */}
      <div 
        className={`modal-overlay ${isOpen ? '' : 'hidden'}`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* 상담사 연결 모달 */}
      <div 
        className={`consultation-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h3 id="modal-title" className="modal-title">
            더 많은 토닥임
          </h3>
          
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="menu-close-button"
            aria-label="모달 닫기"
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* 모달 콘텐츠 */}
        <div className="modal-content">
          
          {/* 자살예방 상담 전화 */}
          <div 
            className="consultation-item"
            onClick={() => handleConsultationClick('자살예방 상담')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleConsultationClick('자살예방 상담');
              }
            }}
            aria-label="자살예방 상담 전화 연결"
          >
            <div className="consultation-status" aria-hidden="true"></div>
            <div className="consultation-info">
              <div className="consultation-title">자살예방 상담 전화</div>
              <div className="consultation-desc">
                지역별 설정된 누구 아이거나 연결 번호, 기록, 
                등록을 도와는 방법을 제공
              </div>
            </div>
          </div>
          
          {/* 청소년 위기상담 전화 */}
          <div 
            className="consultation-item"
            onClick={() => handleConsultationClick('청소년 위기상담')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleConsultationClick('청소년 위기상담');
              }
            }}
            aria-label="청소년 위기상담 전화 연결"
          >
            <div className="consultation-status" aria-hidden="true"></div>
            <div className="consultation-info">
              <div className="consultation-title">청소년 위기상담 전화</div>
              <div className="consultation-desc">
                24시간 청소년 전문 상담사와 연결
              </div>
            </div>
          </div>

          {/* 추가 상담 옵션들 */}
          <div 
            className="consultation-item"
            onClick={() => handleConsultationClick('온라인 상담')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleConsultationClick('온라인 상담');
              }
            }}
            aria-label="온라인 상담 신청"
          >
            <div className="consultation-status" aria-hidden="true"></div>
            <div className="consultation-info">
              <div className="consultation-title">온라인 상담</div>
              <div className="consultation-desc">
                채팅으로 편안하게 상담받기
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
};

export default ConsultationModal;