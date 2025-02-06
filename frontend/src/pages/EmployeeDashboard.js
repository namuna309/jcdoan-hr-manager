import React, { useState, useEffect  } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css";
import '../components/CalendarStyles.css'

const EmployeeDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([
    { id: "1", title: "연차 - 김아름", start: "2025-02-03" },
    { id: "2", title: "연차 - 홍길동", start: "2025-02-10" },
    { id: "3", title: "연차 - 이영희", start: "2025-02-15" },
  ]);

  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState(""); // 선택 가능
  const [startLeaveType, setStartLeaveType] = useState("full");
  const [endLeaveType, setEndLeaveType] = useState("full");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const calculateWorkDays = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + "일";
  };
  // 사용자 정보 상태 관리 추가
  const [userInfo, setUserInfo] = useState({
    name: "김아름",
    startDate: "2022-12-01",
    workDays: calculateWorkDays("2022-12-01"),
    usedLeave: 10,  // 숫자로 변경
    remainingLeave: 5  // 숫자로 변경
  });

  // 연차 계산 함수
  const calculateLeaveDays = () => {
    if (!leaveStartDate) return 0;
    
    // 시작일이 오전 반차인 경우
    if (startLeaveType === "morning") return 0.5;
    
    // 시작일이 오후 반차이고 종료일이 없는 경우
    if (startLeaveType === "afternoon" && !leaveEndDate) return 0.5;
    
    const start = new Date(leaveStartDate);
    const end = leaveEndDate ? new Date(leaveEndDate) : new Date(leaveStartDate);
    
    // 날짜 차이 계산 (밀리초를 일수로 변환)
    const diffTime = Math.abs(end - start);
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (startLeaveType === "full") {
      if (endLeaveType === "morning") {
        return diffDays - 0.5;
      }
      return diffDays;
    } else if (startLeaveType === "afternoon") {
      if (endLeaveType === "morning") {
        return diffDays - 0.5 - 0.5;
      }
      return diffDays - 0.5;
    }

    return 0;
  };

  // 최소 종료 날짜 계산 함수 추가
  const calculateMinEndDate = () => {
    if (!leaveStartDate) return '';
    
    if (startLeaveType === 'morning') {
      return leaveStartDate;
    } else {
      const nextDay = new Date(leaveStartDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
  };

  // 시작일 유형 변경 핸들러 수정
  const handleStartTypeChange = (e) => {
    const newType = e.target.value;
    setStartLeaveType(newType);
    // 시작일 유형이 바뀌면 종료일 관련 상태 초기화
    setLeaveEndDate("");
    setEndLeaveType("full");
  };
  // 모달 초기화 함수 추가
  const resetModal = () => {
    setStartLeaveType("full");
    setLeaveStartDate("");
    setEndLeaveType("full");
    setLeaveEndDate("");
    setCalculatedLeave(0);
  };

  // 모달 닫기 핸들러 수정
  const handleCloseModal = () => {
    resetModal();
    setShowModal(false);
  };

  // 계산된 연차 수를 표시하기 위한 상태 추가
  const [calculatedLeave, setCalculatedLeave] = useState(0);

  // useEffect를 사용하여 연차 계산 값을 실시간으로 업데이트
  useEffect(() => {
    setCalculatedLeave(calculateLeaveDays());
  }, [leaveStartDate, leaveEndDate, startLeaveType, endLeaveType]);
  // 클릭하면 컨텍스트 메뉴 닫기
  useEffect(() => {
    if (contextMenu) {
      const handleClickOutside = () => setContextMenu(null);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [contextMenu]);

  function handleLeaveSubmit() {
    if (!leaveStartDate) {
      alert("휴가 시작 날짜를 선택해주세요.");
      return;
    }

    const start = new Date(leaveStartDate);
    let end = leaveEndDate ? new Date(leaveEndDate) : null;

    if (end && start > end) {
      alert("시작 날짜가 종료 날짜보다 늦을 수 없습니다.");
      return;
    }

    // 연차 일수 계산
    const leaveDays = calculateLeaveDays();

    // 잔여 연차 확인
    if (userInfo.remainingLeave < leaveDays) {
      alert("잔여 연차 일수가 부족합니다.");
      return;
    }

    // 연차 상태 업데이트
    setUserInfo(prevInfo => ({
      ...prevInfo,
      usedLeave: prevInfo.usedLeave + leaveDays,
      remainingLeave: prevInfo.remainingLeave - leaveDays
    }));

    const endDateForCalendar = end ? new Date(end) : null;
    if (endDateForCalendar) {
      endDateForCalendar.setDate(endDateForCalendar.getDate() + 1);
    }

    let title = `연차 - ${userInfo.name}`;
    
    if (startLeaveType === "morning") {
      title += " (반차 - 오전)";
    } else if (startLeaveType === "afternoon") {
      title += " (반차 - 오후)";
    } else {
      title += " (연차)";
    }

    if (end) {
      if (endLeaveType === "morning") {
        title += " ~ 반차(오전)";
      } else if (endLeaveType === "afternoon") {
        title += " ~ 반차(오후)";
      } else {
        title += " ~ 연차";
      }
    }

    const newEvent = {
      id: String(events.length + 1),
      title,
      start: leaveStartDate,
      end: endDateForCalendar ? endDateForCalendar.toISOString().split("T")[0] : leaveStartDate,
      allDay: true,
    };

    setEvents([...events, newEvent]);
    resetModal(); // 초기화 함수 호출
    setShowModal(false);
  }

  
  


  const handleEventClick = (clickInfo) => {
      const eventTitle = clickInfo.event.title;
      const start = clickInfo.event.startStr;
      const end = clickInfo.event.endStr ? clickInfo.event.endStr : start;
    
      setSelectedEvent({
        title: eventTitle,
        start,
        end,
      });
      
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
  
    const confirmDelete = window.confirm("이 일정을 삭제하시겠습니까?");
    if (confirmDelete) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== selectedEventId));
    }
  
    setContextMenu(null);
    setSelectedEventId(null);
  };
  
  const handleEventRightClick = (clickInfo, e) => {
    e.preventDefault(); // 기본 우클릭 메뉴 방지
    setSelectedEventId(clickInfo.event.id);
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };
  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };

  function renderEventContent(eventInfo) {
    return (
      <div className="fc-event-custom">
        <span>{eventInfo.event.title}</span>
      </div>
    );
  }
  

  return (
    
    <Container fluid className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <Row className="w-100 h-100 justify-content-center align-items-center">
        <Col md={4} className="h-100 d-flex flex-column justify-content-center">
          <Card className="shadow-lg rounded-3 border-0 bg-light p-4 w-100 h-100">
            <Card.Body>
              <Card.Title className="fw-bold text-primary text-center">사원 정보</Card.Title>
              <Card.Text className="text-secondary text-center">이름: {userInfo.name}</Card.Text>
              <Card.Text className="text-secondary text-center">입사일: {userInfo.startDate}</Card.Text>
              <Card.Text className="text-secondary text-center">근무일수: {userInfo.workDays}</Card.Text>
              <Card.Text className="text-secondary text-center">사용 연차: {userInfo.usedLeave}일</Card.Text>
              <Card.Text className="text-secondary text-center">잔여 연차 일수: {userInfo.remainingLeave}일</Card.Text>
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
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                // select={handleDateSelect}
                eventContent={renderEventContent} // custom render function
                eventClick={handleEventClick}
                eventMouseEnter={(mouseEnterInfo) => {
                  mouseEnterInfo.el.addEventListener("contextmenu", (e) => handleEventRightClick(mouseEnterInfo, e));
                }}
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
      {contextMenu && (
        <div
          style={{
            position: "absolute",
            top: contextMenu.mouseY,
            left: contextMenu.mouseX,
            backgroundColor: "white",
            border: "1px solid #ccc",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.2)",
            padding: "5px 10px",
            zIndex: 1000,
            cursor: "pointer",
            borderRadius: "5px",
          }}
          onClick={handleDeleteEvent}
        >
          삭제
        </div>
      )}
  
  <Modal 
        show={showModal} 
        onHide={handleCloseModal}  // 모달 닫기 이벤트
        backdrop={true}            // true로 설정하여 외부 클릭 활성화
        keyboard={true}            // ESC 키 활성화
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">연차 신청</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex align-items-center mb-3">
              <Form.Group className="me-2">
                <Form.Label className="fw-semibold">시작일 유형</Form.Label>
                <Form.Select
                  value={startLeaveType}
                  onChange={handleStartTypeChange}
                >
                  <option value="full">연차</option>
                  <option value="morning">반차 - 오전</option>
                  <option value="afternoon">반차 - 오후</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="flex-grow-1">
                <Form.Label className="fw-semibold">휴가 시작 날짜 *</Form.Label>
                <Form.Control
                  type="date"
                  value={leaveStartDate}
                  onChange={(e) => {
                    setLeaveStartDate(e.target.value);
                    setLeaveEndDate("");
                  }}
                  required
                />
              </Form.Group>
            </div>

            <div className="d-flex align-items-center">
              <Form.Group className="me-2">
                <Form.Label className="fw-semibold">종료일 유형</Form.Label>
                <Form.Select
                  value={endLeaveType}
                  onChange={(e) => setEndLeaveType(e.target.value)}
                  disabled={startLeaveType === "morning"}
                >
                  <option value="full">연차</option>
                  <option value="morning">반차 - 오전</option>
                  {startLeaveType === "full" || startLeaveType === "afternoon" ? null : (
                    <option value="afternoon">반차 - 오후</option>
                  )}
                </Form.Select>
              </Form.Group>
              <Form.Group className="flex-grow-1">
                <Form.Label className="fw-semibold">휴가 종료 날짜 (선택)</Form.Label>
                <Form.Control
                  type="date"
                  value={leaveEndDate}
                  onChange={(e) => setLeaveEndDate(e.target.value)}
                  disabled={startLeaveType === "morning"}
                  min={calculateMinEndDate()}
                />
              </Form.Group>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div className="text-primary fw-semibold">
            신청 연차: {calculatedLeave}일
          </div>
          <div>
            <Button variant="secondary" className="rounded-3 me-2" onClick={handleCloseModal}>
              닫기
            </Button>
            <Button variant="primary" className="rounded-3" onClick={handleLeaveSubmit}>
              신청하기
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <Modal show={!!selectedEvent} onHide={handleCloseEventModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">{selectedEvent?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>시작일:</strong> {selectedEvent?.start}</p>
          {selectedEvent?.start === selectedEvent?.end || !selectedEvent?.end ? (
            <p><strong>종료일:</strong> {selectedEvent?.start}</p>
          ) : (
            <p><strong>종료일:</strong> {selectedEvent?.end}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEventModal}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EmployeeDashboard;



