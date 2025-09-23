// src/components/ConsultationModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ConsultationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const [step, setStep] = useState('main');       // 'main' | 'experts'
  const [experts, setExperts] = useState([]);

  // 모달 열릴 때 단계 초기화
  useEffect(() => {
    if (isOpen) setStep('main');
  }, [isOpen]);

  /** 온라인 상담 클릭 → 상담사 목록 가져오기 */
  const loadExperts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/experts', {
        withCredentials: true, // 세션 쿠키 전달 필수
      });
      console.log('전문가 목록 응답:', res.data);
      setExperts(res.data);
      setStep('experts');
    } catch (err) {
      console.error('상담사 목록 불러오기 실패:', err);
      alert('상담사 목록을 불러오지 못했습니다.');
    }
  };

  /** 상담사 클릭 → 채널 생성 또는 기존 방 이동 */
  const handleExpertClick = async (expertId, nick) => {
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/channels',
        {
          userId: expertId,
          channelName: `${nick}와 함께하는`,
          type: 'EXPERT',
        },
        { withCredentials: true }
      );
      navigate(`/channel/${res.data.channelId}`);
      onClose();
    } catch (error) {
      console.error('상담사 채팅 연결 실패:', error);
      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        const match = msg.match(/(\d+)\s*번/);
        if (match) {
          navigate(`/channel/${match[1]}`);
          onClose();
          return;
        }
        alert(msg);
      } else {
        alert('상담사 연결 중 문제가 발생했습니다.');
      }
    }
  };

  /** 오버레이 클릭 시 모달 닫기 */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* 투명 배경 오버레이 (클릭 닫기 가능) */}
      <div
        className={`modal-overlay ${isOpen ? '' : 'hidden'}`}
        onClick={handleOverlayClick}
        // 🔑 오버레이는 살짝 어둡게 유지하고 z-index 높임
        style={{ backgroundColor: 'transparent', zIndex: 2000 }}
      />

      {/* 실제 모달 박스 */}
      <div
        className={`consultation-modal ${isOpen ? 'open' : ''}`}
        role="dialog"
        // 🔑 모달을 사이드 메뉴나 다른 요소 위로 확실히 올리기 위해 z-index 크게 조정
        style={{ zIndex: 3000 }}
      >
        <div className="modal-header">
          <h3 className="modal-title">
            {step === 'main' ? '더 많은 토닥임' : '온라인 상담사 선택'}
          </h3>
          <button onClick={onClose} className="menu-close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {step === 'main' && (
            <>
              <div className="consultation-item" onClick={() => alert('자살예방 상담 연결')}>
                <div className="consultation-info">
                  <div className="consultation-title">자살예방 상담 전화</div>
                  <div className="consultation-desc">24시간 상담 가능</div>
                </div>
              </div>
              <div className="consultation-item" onClick={() => alert('청소년 위기상담 연결')}>
                <div className="consultation-info">
                  <div className="consultation-title">청소년 위기상담 전화</div>
                  <div className="consultation-desc">전문 상담사와 연결</div>
                </div>
              </div>
              <div className="consultation-item" onClick={loadExperts}>
                <div className="consultation-info">
                  <div className="consultation-title">온라인 상담</div>
                  <div className="consultation-desc">채팅으로 상담하기</div>
                </div>
              </div>
            </>
          )}

          {step === 'experts' && (
            <>
              {experts.length > 0 ? (
                experts.map((expert) => (
                  <div
                    key={expert.id}
                    className="consultation-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleExpertClick(expert.id, expert.nick)}
                  >
                    <div className="consultation-info">
                      <div className="consultation-title">{expert.nick}</div>
                      <div className="consultation-desc">{expert.username}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ padding: '1rem' }}>상담사를 불러오는 중이거나 없습니다.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ConsultationModal;
