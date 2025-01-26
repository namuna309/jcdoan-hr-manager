import React from 'react';

const Signup = () => {
  return (
    <div className="container-fluid vh-100 d-flex flex-column justify-content-center bg-white">
      {/* 회원가입 폼 */}
      <div className="mx-auto" style={{ width: '400px' }}>
        <h1 className="fw-bold text-center mb-4">환영합니다!</h1>
        <form>
          {/* 이메일 입력 */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              이메일
            </label>
            <input
              type="email"
              id="email"
              placeholder="이메일 입력"
              className="form-control"
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호 입력"
              className="form-control"
            />
            <small className="text-muted">
              * 10자 이상이면서 영문, 숫자, 특수문자를 모두 포함하세요
            </small>
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label fw-bold">
              비밀번호 재확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="비밀번호 확인"
              className="form-control"
            />
            <small className="text-muted">
              * 비밀번호를 다시 입력해주세요
            </small>
          </div>

          {/* 이름 및 전화번호 */}
          <div className="row">
            <div className="col-6 mb-3">
              <label htmlFor="name" className="form-label fw-bold">
                이름
              </label>
              <input
                type="text"
                id="name"
                placeholder="이름 입력"
                className="form-control"
              />
            </div>
            <div className="col-6 mb-3">
              <label htmlFor="phone" className="form-label fw-bold">
                전화번호 (선택)
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="전화번호 입력"
                className="form-control"
              />
            </div>
          </div>

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            style={{ height: '45px' }}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
