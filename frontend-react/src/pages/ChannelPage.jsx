// src/pages/ChannelPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import Header from '../components/Header';
import Footer from '../components/Footer';
import SideMenu from '../components/SideMenu';
import ConsultationModal from '../components/ConsultationModal';

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [myId, setMyId] = useState(null); // ✅ 현재 로그인한 사용자 ID 저장

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ 세션 확인 및 내 userId 저장
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/users/info', { withCredentials: true })
      .then((res) => {
        console.log('세션 사용자:', res.data);
        setMyId(res.data.userId); // ✅ 내 id 저장
      })
      .catch((err) => {
        console.warn('세션 없음 또는 만료됨', err);
        localStorage.clear();
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  // ✅ 초기 메시지 로드
  useEffect(() => {
    if (!myId) return; // 내 id가 아직 없으면 실행 X
    axios
      .get(`http://localhost:8080/api/v1/channels/${channelId}/messages`, {
        withCredentials: true,
      })
      .then((res) => {
        const loaded = res.data.content.map((m) => ({
          id: m.messageId,
          text: m.content,
          nick: m.nick || '챗봇',
          userId: m.userId,
          isMine: m.userId === myId, // ✅ 내 메시지인지 여부
          time: new Date(m.create_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          date: new Date(m.create_at).toLocaleDateString(),
        }));
        setMessages(loaded.reverse());
      })
      .catch((err) => console.error('메시지 불러오기 실패:', err));
  }, [channelId, myId]);

  // ✅ STOMP WebSocket 연결
  useEffect(() => {
    if (!myId) return;
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/channels/${channelId}/messages`, (frame) => {
          const msg = JSON.parse(frame.body);
          setMessages((prev) => [
            ...prev,
            {
              id: msg.messageId,
              text: msg.content,
              nick: msg.nick || '챗봇',
              userId: msg.userId,
              isMine: msg.userId === myId, // ✅ 내 메시지인지 여부
              time: new Date(msg.createAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              date: new Date(msg.createAt).toLocaleDateString(),
            },
          ]);
        });
      },
    });
    client.activate();
    setStompClient(client);
    return () => client.deactivate();
  }, [channelId, myId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ 메시지 전송
  const sendMessage = () => {
    if (!newMessage.trim() || !stompClient) return;
    stompClient.publish({
      destination: `/app/channels/${channelId}/messages`,
      body: JSON.stringify({ content: newMessage }),
    });
    setNewMessage('');
  };

  // ✅ 로그아웃
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

  // ✅ 메뉴 클릭 처리
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
      case '상담사 연결':
        setIsConsultModalOpen(true);
        break;
      default:
        break;
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="page-container">
      <Header onMenuToggle={() => setIsMenuOpen(true)} />

      {/* 채팅 메시지 영역 */}
      <div className="chat-container">
        <div className="messages-wrapper">
          {messages.map((m) => (
            <div
              key={m.id}
              // ✅ 내 메시지면 user 클래스 → 오른쪽, 아니면 '' → 왼쪽
              className={`message-item ${m.isMine ? 'user' : ''}`}
            >
              <div
                className={`message-avatar ${
                  m.isMine ? 'avatar-user' : 'avatar-bot'
                }`}
              ></div>
              <div className="message-content">
                <div className="message-nick">{m.nick}</div>
                <div
                  className={`message-bubble ${
                    m.isMine ? 'bubble-user' : 'bubble-bot'
                  }`}
                >
                  {m.text}
                </div>
                <div
                  className={`message-timestamp ${
                    m.isMine ? 'timestamp-right' : 'timestamp-left'
                  }`}
                >
                    {m.date}  {m.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>
      </div>

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

      <style jsx>{`
        .messages-wrapper {
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          padding: 1rem;
        }
        .message-nick {
          font-size: 0.8rem;
          color: #6b7280;
          margin-bottom: 0.2rem;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
};

export default ChannelPage;
