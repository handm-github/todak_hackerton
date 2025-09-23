// src/pages/MainPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import ConsultationModal from '../components/ConsultationModal';

const MainPage = () => {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);      // ✅ 채팅방 이름 입력 모달
  const [channelName, setChannelName] = useState('');
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false); // ✅ 상담사 연결 모달

  // 로그인된 사용자 닉네임 가져오기
  useEffect(() => {
    const stored = localStorage.getItem('userInfo');
    if (stored) {
      try {
        const info = JSON.parse(stored);
        setNickname(info.nick);
      } catch (err) {
        console.error('userInfo 파싱 실패:', err);
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 로그아웃 처리
  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    try {
      await axios.post(
        'http://localhost:8080/api/v1/users/logout',
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  // 채널 생성 후 이동
  const handleCreateChannel = async () => {
    if (!channelName.trim()) {
      alert('채팅방 이름을 입력해주세요.');
      return;
    }

    try {
      const requestData = {
        userId: null,
        channelName: channelName.trim(),
        type: 'CHATBOT',
      };

      const res = await axios.post(
        'http://localhost:8080/api/v1/channels',
        requestData,
        { withCredentials: true }
      );

      const { channelId } = res.data;
      if (!channelId) throw new Error('채널 ID가 응답에 없습니다.');

      setIsModalOpen(false);
      setChannelName('');
      navigate(`/channel/${channelId}`);
    } catch (error) {
      console.error('채널 생성 실패:', error);
      alert('채널을 생성할 수 없습니다.');
    }
  };

  // 메뉴 클릭 처리
  const handleMenuClick = (menu) => {
    switch (menu) {
      case 'logout':
        handleLogout();
        break;
      case '대화보관함':
        navigate('/history');
        break;
      case '통계':
        navigate('/stats');
        break;
      case '포츈쿠키':
        navigate('/fortune');
        break;
      case '상담사 연결':                        // ✅ 추가
        setIsConsultModalOpen(true);             // ✅ 상담사 연결 모달 열기
        break;
      default:
        break;
    }
  };

  return (
    <div className="main-layout">
      <Header onMenuToggle={() => setIsMenuOpen(true)} />

      {/* 중앙 환영 영역 */}
      <main className="center-content">
        <div className="center-inner">
          <h2 className="welcome-text">
            {nickname ? (
              <>
                {nickname} 님<br />
                환영합니다!
              </>
            ) : (
              '환영합니다!'
            )}
          </h2>
          <button
            className="create-chat-btn"
            onClick={() => setIsModalOpen(true)}
          >
            + 챗봇 생성
          </button>
        </div>
      </main>

      {/* 사이드 메뉴 */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onMenuClick={handleMenuClick}
      />

      {/* ✅ 채팅방 이름 입력 모달 */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>채팅방 이름을 입력하세요</h3>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="예: 유저의 챗봇 방"
              className="modal-input"
            />
            <div className="modal-buttons">
              <button
                className="modal-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="modal-confirm"
                onClick={handleCreateChannel}
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ 상담사 연결 모달 */}
      <ConsultationModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />

      {/* 페이지 전용 스타일 */}
      <style jsx>{`
        .main-layout {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f9fafb;
        }
        .center-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .center-inner {
          text-align: center;
        }
        .welcome-text {
          font-size: 1.6rem;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        .create-chat-btn {
          padding: 0.8rem 2rem;
          background-color: #4f46e5;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background 0.2s;
        }
        .create-chat-btn:hover {
          background-color: #4338ca;
        }
        /* 모달 스타일 */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 999;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          width: 320px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        }
        .modal h3 {
          margin-bottom: 1rem;
        }
        .modal-input {
          width: 100%;
          padding: 0.6rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        .modal-cancel,
        .modal-confirm {
          flex: 1;
          padding: 0.6rem 1rem;
          font-size: 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }
        .modal-cancel {
          background: #e5e7eb;
          color: #374151;
        }
        .modal-confirm {
          background: #4f46e5;
          color: white;
        }
        .modal-confirm:hover {
          background: #4338ca;
        }
      `}</style>
    </div>
  );
};

export default MainPage;
