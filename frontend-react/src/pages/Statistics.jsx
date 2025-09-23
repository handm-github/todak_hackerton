// src/pages/Statistics.jsx - 통계 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

/**
 * StatisticsPage 컴포넌트 - 사용자 통계 데이터 표시
 */
const StatisticsPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [riskData, setRiskData] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트시 데이터 로드
  useEffect(() => {
    loadStatisticsData();
  }, []);

  // 통계 데이터 로드 함수
  const loadStatisticsData = async () => {
    try {
      // TODO: 실제 API 호출로 대체
      // const response = await fetch('/api/statistics');
      // const data = await response.json();
      
      // 임시 데이터 (실제 구현시 제거)
      await new Promise(resolve => setTimeout(resolve, 1000)); // 로딩 시뮬레이션
      
      const mockRiskData = [
        { month: 1, value: 25, label: '1월' },
        { month: 2, value: 45, label: '2월' },
        { month: 3, value: 30, label: '3월' },
        { month: 4, value: 60, label: '4월' },
        { month: 5, value: 75, label: '5월' },
        { month: 6, value: 40, label: '6월' },
        { month: 7, value: 55, label: '7월' },
        { month: 8, value: 35, label: '8월' }
      ];

      const mockKeywords = [
        { text: "상황적", size: "small", weight: 1 },
        { text: "진로 스트레스", size: "medium", weight: 3 },
        { text: "가족관계", size: "large", weight: 5 },
        { text: "또래관계우울", size: "large", weight: 4 },
        { text: "시간감문제", size: "small", weight: 2 },
        { text: "학업", size: "medium", weight: 3 },
        { text: "인모불안", size: "small", weight: 1 },
        { text: "온토위등의", size: "small", weight: 1 },
        { text: "성식문제", size: "small", weight: 2 },
        { text: "학교적응", size: "small", weight: 2 },
        { text: "시간", size: "small", weight: 1 }
      ];

      setRiskData(mockRiskData);
      setKeywords(mockKeywords);
      setLoading(false);
      
    } catch (error) {
      console.error('통계 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/');
  };

  // 차트 바 높이 계산
  const getBarHeight = (value) => {
    const maxValue = Math.max(...riskData.map(item => item.value));
    return Math.max((value / maxValue) * 150, 10); // 최소 10px, 최대 150px
  };

  // 차트 바 클릭 처리
  const handleBarClick = (data) => {
    alert(`${data.label}: ${data.value}% 위험도`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <Header showBackButton={true} onBack={handleBack} title="통계" />
        <div className="stats-container">
          <div className="text-center" style={{ padding: '2rem' }}>
            <div>데이터를 불러오는 중...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Header showBackButton={true} onBack={handleBack} title="통계" />
      
      <div className="stats-container">
        
        {/* 위험 감지 수치 차트 */}
        <div className="stats-card">
          <h2 className="stats-title">⚠ 위험 감지 수치</h2>
          
          <div className="chart-container">
            {riskData.map((data) => (
              <div key={data.month} className="chart-group">
                <div 
                  className="chart-bar"
                  style={{ height: `${getBarHeight(data.value)}px` }}
                  onClick={() => handleBarClick(data)}
                  title={`${data.label}: ${data.value}%`} // 툴팁
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleBarClick(data);
                    }
                  }}
                  aria-label={`${data.label} 위험도 ${data.value}%`}
                ></div>
                <div className="chart-label">{data.label}</div>
              </div>
            ))}
          </div>

          {/* 차트 설명 */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: '#6b7280'
          }}>
            월별 위험 감지 수치를 표시합니다. 높을수록 주의가 필요합니다.
          </div>
        </div>

        {/* 키워드 구름 */}
        <div className="stats-card">
          <h2 className="stats-title">☁ 키워드 구름</h2>
          
          <div className="keyword-cloud">
            {keywords.map((keyword, index) => (
              <span 
                key={index}
                className={`keyword keyword-${keyword.size}`}
                title={`키워드: ${keyword.text} (언급 횟수: ${keyword.weight})`} // 툴팁
                role="button"
                tabIndex={0}
                onClick={() => {
                  alert(`"${keyword.text}" 키워드가 ${keyword.weight}번 언급되었습니다.`);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    alert(`"${keyword.text}" 키워드가 ${keyword.weight}번 언급되었습니다.`);
                  }
                }}
                aria-label={`키워드 ${keyword.text}, ${keyword.weight}번 언급됨`}
              >
                {keyword.text}
              </span>
            ))}
          </div>
          
          {/* 키워드 설명 */}
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            backgroundColor: '#eff6ff', 
            borderRadius: '0.5rem' 
          }}>
            <h3 style={{ 
              fontSize: '0.875rem', 
              fontWeight: '500', 
              color: '#1e40af', 
              marginBottom: '0.5rem' 
            }}>
              키워드 분석 정보
            </h3>
            <p style={{ 
              fontSize: '0.75rem', 
              color: '#2563eb' 
            }}>
              대화 내용에서 자주 언급된 키워드들을 크기별로 표시했습니다. 
              큰 글씨일수록 자주 언급된 주제입니다.
            </p>
          </div>
        </div>

        {/* 추가 통계 정보 */}
        <div className="stats-card">
          <h2 className="stats-title">월별 요약</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem' 
          }}>
            <div style={{ 
              backgroundColor: '#f0fdf4', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#16a34a' 
              }}>73%</div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#15803d' 
              }}>긍정적 대화</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#fff7ed', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center',
              border: '1px solid #fed7aa'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#ea580c' 
              }}>27%</div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#c2410c' 
              }}>주의 필요</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#eff6ff', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#2563eb' 
              }}>156</div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#1d4ed8' 
              }}>총 대화 수</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#faf5ff', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              textAlign: 'center',
              border: '1px solid #d8b4fe'
            }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: '#9333ea' 
              }}>28일</div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#7c3aed' 
              }}>활동 일수</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;