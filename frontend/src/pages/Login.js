import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, FloatingLabel, Container } from 'react-bootstrap';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      navigate('/employeedashboard');
    }

    setValidated(true);
  };

  return (
    <Container fluid className="vh-100 bg-white d-flex flex-column justify-content-center">
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
        <Form noValidate validated={validated} onSubmit={handleLogin}>
          {/* 이메일 입력 (Floating Label) */}
          <FloatingLabel controlId="floatingEmail" label="이메일" className="mb-3">
            <Form.Control
              type="email"
              placeholder="이메일 입력"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$"
            />
            <Form.Control.Feedback type="invalid">
              이메일 양식에 맞게 입력해주세요. (예: user123@example.com)
            </Form.Control.Feedback>
          </FloatingLabel>

          {/* 비밀번호 입력 (Floating Label) */}
          <FloatingLabel controlId="floatingPassword" label="비밀번호" className="mb-3">
            <Form.Control
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Form.Control.Feedback type="invalid">
              비밀번호를 입력해주세요.
            </Form.Control.Feedback>
          </FloatingLabel>

          {/* 로그인 상태 유지 */}
          <Form.Check
            type="checkbox"
            label="로그인 상태 유지"
            className="mb-4"
            id="rememberMe"
          />

          {/* 로그인 버튼 */}
          <Button type="submit" className="w-100 fw-bold" variant="primary" style={{ height: '45px' }}>
            로그인
          </Button>
        </Form>

        {/* 회원가입 버튼 */}
        <div className="text-center mt-3">
          <span className="text-muted">아직 계정이 없으신가요? </span>
          <Link to="/signup" className="text-primary text-decoration-none fw-bold">
            회원가입
          </Link>
        </div>

        {/* 비밀번호 재설정 */}
        <div className="text-center mt-2">
          <Link to="/reset_password" className="text-primary text-decoration-none fw-bold">
            비밀번호 재설정
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Login;



