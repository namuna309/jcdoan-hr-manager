import React, { useState } from 'react';
import { Form, Button, Container, FloatingLabel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();

  const handleReset = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      alert("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
      setTimeout(() => navigate("/login"), 2000); // 2초 후 로그인 페이지로 이동
    }

    setValidated(true);
  };

  return (
    <Container fluid className="vh-100 bg-white d-flex flex-column justify-content-center">
      <div className="mx-auto" style={{ width: '400px' }}>
        <h2 className="fw-bold text-center mb-4">비밀번호 재설정</h2>
        <p className="text-center text-muted">비밀번호를 재설정할 이메일을 입력해주세요.</p>
        <Form noValidate validated={validated} onSubmit={handleReset}>
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
              올바른 이메일 형식을 입력해주세요.
            </Form.Control.Feedback>
          </FloatingLabel>

          {/* 비밀번호 재설정 버튼 */}
          <Button type="submit" className="w-100 fw-bold" variant="primary" style={{ height: '45px' }}>
            재설정 링크 보내기
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default ResetPassword;
