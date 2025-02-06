import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ResetPassword from './pages/ResetPassword';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* 루트 경로에서 /login으로 리디렉트 */}
         <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 공통 */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/reset_password' element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />

        {/* 관리자 */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* 직원 */}
        <Route path="/employeedashboard/*" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;