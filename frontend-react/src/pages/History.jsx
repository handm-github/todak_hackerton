import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import axios from 'axios';

const HistoryPage = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState('CHATBOT'); // 현재 탭 (CHATBOT / EXPERT)
  const [channels, setChannels] = useState([]); // 현재 탭의 채널 목록
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  /** 채널 목록 로드 */
  const loadChannels = async (pageNum = 0, reset = false, forceType) => {
    const targetType = forceType || tab;
    const base_url = 'http://localhost:8080';

    try {
      setLoading(true);
      const res = await axios.get(base_url + '/api/v1/channels', {
        params: { page: pageNum, size: 10, type: targetType },
        withCredentials: true,
      });

      const data = res.data || {};
      const newList = Array.isArray(data.content) ? data.content : [];
      setChannels((prev) => (reset ? newList : [...prev, ...newList]));
      setPage((data.number ?? 0) + 1);
      setHasMore(!data.last);
    } catch (err) {
      console.error('채널 목록 로드 실패:', err);
      setChannels([]);
    } finally {
      setLoading(false);
    }
  };

  /** 첫 화면 로드 */
  useEffect(() => {
    loadChannels(0, true, 'CHATBOT');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 탭 클릭 시 데이터 새로 로드 */
  const handleTabClick = (type) => {
    setTab(type);
    loadChannels(0, true, type);
  };

  /** 채널 삭제(나가기) */
  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm('이 채널을 삭제(나가기) 하시겠습니까?')) return;
    const base_url = 'http://localhost:8080';
    try {
      await axios.get(base_url + `/api/v1/channels/${channelId}`, { withCredentials: true });
      setChannels((prev) => prev.filter((c) => c.channelId !== channelId));
    } catch (err) {
      console.error('채널 삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  /** 채널 클릭 시 채팅방으로 이동 */
  const handleChannelClick = (channelId) => {
    navigate(`/channel/${channelId}`);
  };

  const handleBack = () => navigate('/');

  const safeChannels = Array.isArray(channels) ? channels : [];

  return (
    <div className="page-container">
      <Header showBackButton onBack={handleBack} title="대화보관함" />

      {/* 탭 버튼 */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          margin: '1rem',
          borderBottom: '1px solid #ddd',
          paddingBottom: '0.5rem',
        }}
      >
        <button
          onClick={() => handleTabClick('CHATBOT')}
          style={{
            fontWeight: tab === 'CHATBOT' ? 'bold' : 'normal',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          챗봇
        </button>
        <button
          onClick={() => handleTabClick('EXPERT')}
          style={{
            fontWeight: tab === 'EXPERT' ? 'bold' : 'normal',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          상담사
        </button>
      </div>

      {/* 채널 목록 */}
      {loading && safeChannels.length === 0 ? (
        <div style={{ padding: '2rem' }}>불러오는 중...</div>
      ) : (
        <div className="history-container">
          {safeChannels.length > 0 ? (
            <>
              {safeChannels.map((ch) => (
                <div key={ch.channelId}>
                  <div className="history-date">
                    {ch.date
                      ? new Date(ch.date).toLocaleDateString()
                      : '날짜 없음'}
                  </div>

                  {/* ✅ 채널 클릭 시 채팅방으로 이동 */}
                  <div
                    className="history-item"
                    onClick={() => handleChannelClick(ch.channelId)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #e5e7eb',
                      cursor: 'pointer',      // 클릭 커서 표시
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{ch.channelName}</div>
                      <div
                        style={{
                          color: '#6b7280',
                          fontSize: '0.875rem',
                          marginTop: '0.25rem',
                        }}
                      >
                        유형: {ch.type} | 상태: {ch.status}
                      </div>
                    </div>

                    {/* ✅ 나가기 버튼 클릭 시에는 상위 클릭 이벤트 막음 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();  // 상위 div 클릭 방지
                        handleDeleteChannel(ch.channelId);
                      }}
                      style={{
                        padding: '0.25rem 0.5rem',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        borderRadius: '0.25rem',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        height: '2rem',
                        alignSelf: 'center',
                      }}
                    >
                      나가기
                    </button>
                  </div>
                </div>
              ))}

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button
                    onClick={() => loadChannels(page)}
                    style={{
                      padding: '0.5rem 1rem',
                      border: '1px solid #ccc',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      background: 'white',
                    }}
                  >
                    더보기
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              채팅방이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
