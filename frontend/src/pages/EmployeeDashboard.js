import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import '../components/CalendarStyles.css'

const EmployeeDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([
    { id: "1", title: "연차 - 김아름", start: "2025-02-03" },
    { id: "2", title: "연차 - 홍길동", start: "2025-02-10" },
    { id: "3", title: "연차 - 이영희", start: "2025-02-15" },
  ]);
  
  const calculateWorkDays = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + "일";
  };

  const userInfo = {
    name: "김아름",
    startDate: "2022-12-01",
    workDays: calculateWorkDays("2022-12-01"),
    usedLeave: "10일",
    remainingLeave: "5일"
  };
  const handleDateSelect = (selectInfo) => {
    const title = prompt("새로운 이벤트 제목을 입력하세요:");
    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      selectInfo.view.calendar.unselect();
    }
  };

  const handleEventClick = (clickInfo) => {
    if (window.confirm(`'${clickInfo.event.title}' 이벤트를 삭제하시겠습니까?`)) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  function renderEventContent(eventInfo) {
    return (
      <div className="fc-event-custom">
        <b>{eventInfo.timeText}</b> <span>{eventInfo.event.title}</span>
      </div>
    );
  }

  return (
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <Row className="w-100 h-100 justify-content-center align-items-center">
        <Col md={4} className="h-100 d-flex flex-column justify-content-center">
          <Card className="shadow-lg rounded-3 border-0 bg-light p-4 w-100 h-100">
            <Card.Body>
              <Card.Title className="fw-bold text-primary text-center">개인 정보</Card.Title>
              <Card.Text className="text-secondary text-center">이름: {userInfo.name}</Card.Text>
              <Card.Text className="text-secondary text-center">입사일: {userInfo.startDate}</Card.Text>
              <Card.Text className="text-secondary text-center">근무일수: {userInfo.workDays}</Card.Text>
              <Card.Text className="text-secondary text-center">사용 연차: {userInfo.usedLeave}</Card.Text>
              <Card.Text className="text-secondary text-center">잔여 연차 일수: {userInfo.remainingLeave}</Card.Text>
              <Button variant="secondary" className="w-100 mt-2">개인 연차 세부</Button>
              <Button variant="primary" className="w-100 mt-2" onClick={() => setShowModal(true)}>
                연차 신청하기
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8} className="h-100 d-flex flex-column justify-content-center">
          <Card className="shadow-lg rounded-3 border-0 bg-light p-4 w-100 h-100 d-flex flex-column">
            <Card.Body className="d-flex flex-column justify-content-start h-100 p-4">
              <div className="flex-grow-1 w-100">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  center: 'title',
                  left: 'prev,next today',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                /* you can update a remote database when these fire:
                eventAdd={function(){}}
                eventChange={function(){}}
                eventRemove={function(){}}
                */
              />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">연차 신청</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label className="fw-semibold">휴가 시작 날짜</Form.Label>
              <Form.Control type="date" className="rounded-3 no-underline" />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">휴가 종료 날짜</Form.Label>
              <Form.Control type="date" className="rounded-3 no-underline" />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label className="fw-semibold">사유</Form.Label>
              <Form.Control as="textarea" rows={3} className="rounded-3 no-underline" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="rounded-3" onClick={() => setShowModal(false)}>
            닫기
          </Button>
          <Button variant="primary" className="rounded-3">신청하기</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeDashboard;



