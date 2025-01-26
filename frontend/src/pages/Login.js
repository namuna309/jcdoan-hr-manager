import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="container-fluid vh-100 bg-white d-flex flex-column justify-content-center">
      {/* 로고 */}
      <div className="position-absolute top-0 start-0 p-3">
        <img
          src="https://via.placeholder.com/150x50" // 로고 URL 변경
          alt="Shiftee Logo"
        />
      </div>

      {/* 로그인 카드 */}
      <div className="mx-auto" style={{ width: '400px' }}>
        <h2 className="fw-bold text-center mb-4">로그인</h2>
        <form>
          {/* 이메일 입력 */}
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label htmlFor="email" className="form-label fw-bold">
                이메일
              </label>
              <a
                href="#"
                className="text-decoration-none text-primary"
              >
                이메일 찾기
              </a>
            </div>
            <input
             
jsx
복사
편집
              type="email"
              id="email"
              placeholder="이메일 입력"
              className="form-control"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label htmlFor="password" className="form-label fw-bold">
                비밀번호
              </label>
              <a
                href="#"
                className="text-decoration-none text-primary"
              >
                비밀번호 찾기
              </a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="비밀번호 입력"
              className="form-control"
            />
          </div>

          {/* 로그인 상태 유지 */}
          <div className="form-check mb-4">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMe"
            />
            <label htmlFor="rememberMe" className="form-check-label">
              로그인 상태 유지
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{ height: '45px' }}
          >
            로그인
          </button>
        </form>

         {/* 회원가입 버튼 */}
         <div className="text-center">
          <span className="text-muted">아직 계정이 없으신가요? </span>
          <Link
            to="/login/signup"
            className="text-primary text-decoration-none fw-bold"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
