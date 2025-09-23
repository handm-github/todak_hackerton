import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "", 
    pw: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "아이디를 입력해주세요.";
    if (!formData.pw.trim()) newErrors.pw = "비밀번호를 입력해주세요.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        formData,
        { withCredentials: true } 
      );

      // 로그인 성공 시 세션 기반 유저 정보 저장
      console.log("로그인 성공:", response.data);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      localStorage.setItem("isLoggedIn", "true"); 

      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrors({
        general: "로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="center-container">
      <div className="auth-card">
        <h2>로그인</h2>

        <form onSubmit={handleLogin} className="auth-form">
          {errors.general && (
            <div className="error-text text-center">{errors.general}</div>
          )}

          {/* 아이디 */}
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`auth-input ${errors.username ? "error" : ""}`}
          />
          {errors.username && (
            <div className="error-text">{errors.username}</div>
          )}

          {/* 비밀번호 */}
          <input
            type="password"
            name="pw"
            placeholder="비밀번호"
            value={formData.pw}
            onChange={handleInputChange}
            disabled={isLoading}
            className={`auth-input ${errors.pw ? "error" : ""}`}
          />
          {errors.pw && <div className="error-text">{errors.pw}</div>}

          <button
            type="submit"
            className="auth-button login-button"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
