import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Popover,
  Avatar,
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import '../components/CalendarStyles.css';

const EmployeeDashboard = () => {
  // 상태 변수들
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([
    { id: "1", title: "연차 - 김아름", start: "2025-02-03" },
    { id: "2", title: "연차 - 홍길동", start: "2025-02-10" },
    { id: "3", title: "연차 - 이영희", start: "2025-02-15" },
  ]);
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [leaveEndDate, setLeaveEndDate] = useState("");
  const [startLeaveType, setStartLeaveType] = useState("full");
  const [endLeaveType, setEndLeaveType] = useState("full");
  const [calculatedLeave, setCalculatedLeave] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [usedLeave, setUsedLeave] = useState(10);

  // 사원 정보 (예시)
  const [userInfo, setUserInfo] = useState({
    name: "김아름",
    startDate: "2022-12-01",
    usedLeave: 10,
    remainingLeave: 5,
    workDays: calculateWorkDays("2022-12-01", usedLeave),
  });

  // 입사일 기준 근무일수 계산 (연차 사용 제외)
  function calculateWorkDays(startDate, usedLeaveDays) {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = today - start;
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return (totalDays - usedLeaveDays) + "일";
  }

  // 연차 계산 함수 (반차/연차)
  const calculateLeaveDays = () => {
    if (!leaveStartDate) return 0;
    if (startLeaveType === "morning") return 0.5;
    if (startLeaveType === "afternoon" && !leaveEndDate) return 0.5;
    
    const start = new Date(leaveStartDate);
    const end = leaveEndDate ? new Date(leaveEndDate) : new Date(leaveStartDate);
    const diffTime = Math.abs(end - start);
    let diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (startLeaveType === "full") {
      if (endLeaveType === "morning") {
        return diffDays - 0.5;
      }
      return diffDays;
    } else if (startLeaveType === "afternoon") {
      if (endLeaveType === "morning") {
        return diffDays - 1;
      }
      return diffDays - 0.5;
    }
    return 0;
  };

  // 종료일 선택 시 최소 날짜
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

  // 시작일 유형 변경 시
  const handleStartTypeChange = (e) => {
    const newType = e.target.value;
    setStartLeaveType(newType);
    setLeaveEndDate("");
    setEndLeaveType("full");
  };

  // 모달 초기화
  const resetModal = () => {
    setStartLeaveType("full");
    setLeaveStartDate("");
    setEndLeaveType("full");
    setLeaveEndDate("");
    setCalculatedLeave(0);
  };

  const handleCloseModal = () => {
    resetModal();
    setShowModal(false);
  };

  // 연차 계산 값 업데이트
  useEffect(() => {
    setCalculatedLeave(calculateLeaveDays());
  }, [leaveStartDate, leaveEndDate, startLeaveType, endLeaveType]);

  useEffect(() => {
    setUserInfo(prevInfo => ({
      ...prevInfo,
      workDays: calculateWorkDays(prevInfo.startDate, usedLeave),
    }));
  }, [usedLeave]);

  // 연차 신청 처리
  const handleLeaveSubmit = () => {
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
    const leaveDays = calculateLeaveDays();
    if (userInfo.remainingLeave < leaveDays) {
      alert("잔여 연차 일수가 부족합니다.");
      return;
    }
    setUsedLeave(prev => prev + leaveDays);
    setUserInfo(prevInfo => ({
      ...prevInfo,
      usedLeave: prevInfo.usedLeave + leaveDays,
      remainingLeave: prevInfo.remainingLeave - leaveDays,
      workDays: calculateWorkDays(prevInfo.startDate, usedLeave),
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
      end: endDateForCalendar
        ? endDateForCalendar.toISOString().split("T")[0]
        : leaveStartDate,
      allDay: true,
    };
    setEvents([...events, newEvent]);
    resetModal();
    setShowModal(false);
  };

  // 이벤트 클릭 시 상세 Dialog 표시
  const handleEventClick = (clickInfo) => {
    const eventTitle = clickInfo.event.title;
    const start = clickInfo.event.startStr;
    const end = clickInfo.event.endStr ? clickInfo.event.endStr : start;
    setSelectedEvent({
      title: eventTitle,
      start,
      end,
      id: clickInfo.event.id,
    });
  };

  // 우클릭 시 Popover (컨텍스트 메뉴)
  const handleEventRightClick = (clickInfo, e) => {
    e.preventDefault();
    setSelectedEventId(clickInfo.event.id);
    setContextMenu({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  const handleDeleteEvent = () => {
    if (!selectedEventId) return;
    const confirmDelete = window.confirm("이 일정을 삭제하시겠습니까?");
    if (confirmDelete) {
      setEvents(prevEvents =>
        prevEvents.filter(event => event.id !== selectedEventId)
      );
    }
    setContextMenu(null);
    setSelectedEventId(null);
  };

  const handleCloseEventModal = () => {
    setSelectedEvent(null);
  };

  const renderEventContent = (eventInfo) => (
    <Box>
      <Typography variant="body2">{eventInfo.event.title}</Typography>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', minWidth: '100wh', py: 4, backgroundColor: '#FAFAFA' }}>
      {/* 헤더 (노션처럼 심플하게) */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: '#202124' }}>
          Employee Dashboard
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 좌측: 사원 정보 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Avatar
                src="https://via.placeholder.com/100"
                sx={{ width: 80, height: 80, mx: 'auto' }}
              />
            </Box>
            <Typography variant="h6" align="center" sx={{ fontWeight: 500 }}>
              {userInfo.name}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              입사일: {userInfo.startDate}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2">근무일수: {userInfo.workDays}</Typography>
              <Typography variant="body2">사용 연차: {usedLeave}일</Typography>
              <Typography variant="body2">잔여 연차: {userInfo.remainingLeave}일</Typography>
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(userInfo.remainingLeave / (userInfo.usedLeave + userInfo.remainingLeave)) * 100}
                  sx={{ height: 8, borderRadius: 2 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {userInfo.remainingLeave}일 남음
                </Typography>
              </Box>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Button variant="outlined" fullWidth onClick={() => setShowModal(true)}>
                연차 신청하기
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* 우측: 캘린더 */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, borderRadius: 2, boxShadow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2, py: 1, backgroundColor: '#F7F7F7', borderBottom: '1px solid #E0E0E0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                캘린더
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                initialView="dayGridMonth"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                events={events}
                eventContent={renderEventContent}
                eventClick={handleEventClick}
                eventMouseEnter={(mouseEnterInfo) => {
                  mouseEnterInfo.el.addEventListener("contextmenu", (e) => handleEventRightClick(mouseEnterInfo, e));
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Popover (컨텍스트 메뉴) */}
      <Popover
        open={Boolean(contextMenu)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
        onClose={() => setContextMenu(null)}
      >
        <Box sx={{ p: 1 }}>
          <Button color="error" onClick={handleDeleteEvent}>
            삭제
          </Button>
        </Box>
      </Popover>

      {/* 연차 신청 Dialog */}
      <Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: '1px solid #E0E0E0' }}>연차 신청</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="start-leave-type-label">시작일 유형</InputLabel>
                <Select
                  labelId="start-leave-type-label"
                  value={startLeaveType}
                  label="시작일 유형"
                  onChange={handleStartTypeChange}
                >
                  <MenuItem value="full">연차</MenuItem>
                  <MenuItem value="morning">반차 - 오전</MenuItem>
                  <MenuItem value="afternoon">반차 - 오후</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="휴가 시작 날짜 *"
                type="date"
                fullWidth
                value={leaveStartDate}
                onChange={(e) => {
                  setLeaveStartDate(e.target.value);
                  setLeaveEndDate("");
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth disabled={startLeaveType === "morning"}>
                <InputLabel id="end-leave-type-label">종료일 유형</InputLabel>
                <Select
                  labelId="end-leave-type-label"
                  value={endLeaveType}
                  label="종료일 유형"
                  onChange={(e) => setEndLeaveType(e.target.value)}
                >
                  <MenuItem value="full">연차</MenuItem>
                  <MenuItem value="morning">반차 - 오전</MenuItem>
                  {(startLeaveType === "full" || startLeaveType === "afternoon") && (
                    <MenuItem value="afternoon">반차 - 오후</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                label="휴가 종료 날짜 (선택)"
                type="date"
                fullWidth
                value={leaveEndDate}
                onChange={(e) => setLeaveEndDate(e.target.value)}
                disabled={startLeaveType === "morning"}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: calculateMinEndDate() }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Typography variant="subtitle1" color="text.primary">
            신청 연차: {calculatedLeave}일
          </Typography>
          <Box>
            <Button onClick={handleCloseModal} variant="outlined" sx={{ mr: 1 }}>
              닫기
            </Button>
            <Button onClick={handleLeaveSubmit} variant="contained">
              신청하기
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* 이벤트 상세 Dialog */}
      <Dialog open={Boolean(selectedEvent)} onClose={handleCloseEventModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: '1px solid #E0E0E0' }}>{selectedEvent?.title}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">
            <strong>시작일:</strong> {selectedEvent?.start}
          </Typography>
          <Typography variant="body1">
            <strong>종료일:</strong> {selectedEvent?.end}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDeleteEvent}>
            삭제
          </Button>
          <Button onClick={handleCloseEventModal}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeeDashboard;




