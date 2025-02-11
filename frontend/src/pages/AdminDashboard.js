import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * fakeApiCall: 서버가 없는 상황에서 비동기 API 호출을 흉내내기 위한 함수.
 * @param {any} data - 반환할 데이터
 * @param {number} delay - 지연 시간 (ms)
 * @returns {Promise<any>}
 */
function fakeApiCall(data, delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}

// 더미 데이터들
const dummyEmployees = [
  {
    id: 1,
    name: '홍길동',
    start_date: '2023-01-01',
    current_work_days: 200,
    employment_period: 1,
    total_leave_entitlement: 15,
    used_leave_days: 3,
  },
  {
    id: 2,
    name: '김철수',
    start_date: '2022-06-15',
    current_work_days: 150,
    employment_period: 0.5,
    total_leave_entitlement: 10,
    used_leave_days: 2,
  },
];

const dummyLeaves = [
  {
    id: 1,
    employee_id: 1,
    year: 2023,
    leave_days: 15,
    status: 'ACTIVE',
  },
  {
    id: 2,
    employee_id: 2,
    year: 2023,
    leave_days: 10,
    status: 'ACTIVE',
  },
];

const dummyLeaveUsages = [
  {
    id: 1,
    employee_id: 1,
    leave_id: 1,
    start_date: '2023-07-01',
    end_date: '2023-07-03',
    leave_type: 'FULL',
    used_days: 3,
    status: 'APPROVED',
  },
  {
    id: 2,
    employee_id: 2,
    leave_id: 2,
    start_date: '2023-08-10',
    end_date: '2023-08-10',
    leave_type: 'HALF_MORNING',
    used_days: 0.5,
    status: 'PENDING',
  },
];

const dummyPolicies = [
  {
    id: 1,
    min_years: 0,
    max_years: 1,
    annual_leave_days: 12,
    additional_leave_per_year: 0,
  },
  {
    id: 2,
    min_years: 1,
    max_years: 3,
    annual_leave_days: 15,
    additional_leave_per_year: 0,
  },
  {
    id: 3,
    min_years: 3,
    max_years: 100,
    annual_leave_days: 15,
    additional_leave_per_year: 1,
  },
];

// ──────────────────────────────────────────────
// 메인 관리자 대시보드 컴포넌트: 탭 전환으로 각 관리 화면을 보여줌
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="container my-4">
      <h1 className="mb-4">휴가 관리 관리자 페이지</h1>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            직원 관리
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'leave-grants' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave-grants')}
          >
            연차 지급 관리
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'leave-usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave-usage')}
          >
            연차 사용 내역
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'leave-policy' ? 'active' : ''}`}
            onClick={() => setActiveTab('leave-policy')}
          >
            연차 규정 관리
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'employees' && <EmployeeManagement />}
        {activeTab === 'leave-grants' && <LeaveGrantManagement />}
        {activeTab === 'leave-usage' && <LeaveUsageManagement />}
        {activeTab === 'leave-policy' && <LeavePolicyManagement />}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// 직원 관리 컴포넌트
function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // 서버 미구축 상태이므로 fakeApiCall로 더미 데이터를 불러옴
    fakeApiCall(dummyEmployees)
      .then((data) => setEmployees(data))
      .catch((error) => console.error('Error fetching employees:', error));
  }, []);

  return (
    <div>
      <h3>직원 관리</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>입사일</th>
            <th>현재 근무일수</th>
            <th>근속 연수</th>
            <th>총 지급 연차</th>
            <th>사용 연차</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.start_date}</td>
                <td>{emp.current_work_days}</td>
                <td>{emp.employment_period}</td>
                <td>{emp.total_leave_entitlement}</td>
                <td>{emp.used_leave_days}</td>
                <td>
                  <button className="btn btn-primary btn-sm">상세보기</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                데이터 없음
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────
// 연차 지급 관리 컴포넌트
function LeaveGrantManagement() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fakeApiCall(dummyLeaves)
      .then((data) => setLeaves(data))
      .catch((error) => console.error('Error fetching leave grants:', error));
  }, []);

  return (
    <div>
      <h3>연차 지급 관리</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>직원 ID</th>
            <th>연도</th>
            <th>지급 연차</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave) => (
              <tr key={leave.id}>
                <td>{leave.id}</td>
                <td>{leave.employee_id}</td>
                <td>{leave.year}</td>
                <td>{leave.leave_days}</td>
                <td>{leave.status}</td>
                <td>
                  {/* 예: 연차 만료 처리 기능 (추후 구현) */}
                  <button className="btn btn-warning btn-sm">만료 처리</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                데이터 없음
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────
// 연차 사용 내역 관리 컴포넌트
function LeaveUsageManagement() {
  const [leaveUsages, setLeaveUsages] = useState([]);

  useEffect(() => {
    fakeApiCall(dummyLeaveUsages)
      .then((data) => setLeaveUsages(data))
      .catch((error) => console.error('Error fetching leave usage:', error));
  }, []);

  // 연차 사용 승인 (더미 데이터 업데이트)
  const handleApprove = (id) => {
    setLeaveUsages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'APPROVED' } : item
      )
    );
  };

  // 연차 사용 취소 (더미 데이터 업데이트)
  const handleCancel = (id) => {
    setLeaveUsages((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'CANCELLED' } : item
      )
    );
  };

  return (
    <div>
      <h3>연차 사용 내역 관리</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>직원 ID</th>
            <th>연차 지급 ID</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>연차 유형</th>
            <th>사용 일수</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {leaveUsages.length > 0 ? (
            leaveUsages.map((usage) => (
              <tr key={usage.id}>
                <td>{usage.id}</td>
                <td>{usage.employee_id}</td>
                <td>{usage.leave_id}</td>
                <td>{usage.start_date}</td>
                <td>{usage.end_date}</td>
                <td>{usage.leave_type}</td>
                <td>{usage.used_days}</td>
                <td>{usage.status}</td>
                <td>
                  {usage.status === 'PENDING' && (
                    <>
                      <button
                        className="btn btn-success btn-sm mr-2"
                        onClick={() => handleApprove(usage.id)}
                      >
                        승인
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancel(usage.id)}
                      >
                        취소
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                데이터 없음
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ──────────────────────────────────────────────
// 연차 규정 관리 컴포넌트
function LeavePolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [newPolicy, setNewPolicy] = useState({
    min_years: '',
    max_years: '',
    annual_leave_days: '',
    additional_leave_per_year: '',
  });

  useEffect(() => {
    fakeApiCall(dummyPolicies)
      .then((data) => setPolicies(data))
      .catch((error) => console.error('Error fetching leave policies:', error));
  }, []);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setNewPolicy({ ...newPolicy, [e.target.name]: e.target.value });
  };

  // 새 연차 규정 추가 (더미 데이터 업데이트)
  const handleAddPolicy = (e) => {
    e.preventDefault();
    const newPolicyData = {
      ...newPolicy,
      id: policies.length + 1, // 단순 증가 아이디
    };
    setPolicies([...policies, newPolicyData]);
    setNewPolicy({
      min_years: '',
      max_years: '',
      annual_leave_days: '',
      additional_leave_per_year: '',
    });
  };

  return (
    <div>
      <h3>연차 규정 관리</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>최소 근속 연수</th>
            <th>최대 근속 연수</th>
            <th>지급 연차</th>
            <th>추가 지급 기준</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {policies.length > 0 ? (
            policies.map((policy) => (
              <tr key={policy.id}>
                <td>{policy.id}</td>
                <td>{policy.min_years}</td>
                <td>{policy.max_years}</td>
                <td>{policy.annual_leave_days}</td>
                <td>{policy.additional_leave_per_year}</td>
                <td>
                  <button className="btn btn-primary btn-sm">수정</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                데이터 없음
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h4 className="mt-4">새 연차 규정 추가</h4>
      <form onSubmit={handleAddPolicy}>
        <div className="form-row">
          <div className="form-group col-md-3">
            <label>최소 근속 연수</label>
            <input
              type="number"
              className="form-control"
              name="min_years"
              value={newPolicy.min_years}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label>최대 근속 연수</label>
            <input
              type="number"
              className="form-control"
              name="max_years"
              value={newPolicy.max_years}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label>지급 연차</label>
            <input
              type="number"
              className="form-control"
              name="annual_leave_days"
              value={newPolicy.annual_leave_days}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group col-md-3">
            <label>추가 지급 기준</label>
            <input
              type="number"
              className="form-control"
              name="additional_leave_per_year"
              value={newPolicy.additional_leave_per_year}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success">
          규정 추가
        </button>
      </form>
    </div>
  );
}

export default AdminDashboard;

