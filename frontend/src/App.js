import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 공통 */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

        {/* 관리자 */}
        <Route path="/admin/*" element={<AdminDashboard />} />

        {/* 직원 */}
        <Route path="/employee/*" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;