import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { RecoilRoot } from 'recoil';

import Login from "./components/Login";
import NavBar from "./components/NavBar";
import EmployeeRegister from "./components/admin/EmployeeRegister";
import AllEmployees from "./components/admin/AllEmployees";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Player from "./components/Player";
import BreathingExercise from "./components/BreathingExercise";
import LiveCam from "./components/LiveCam";
import EditEmployee from "./components/admin/EditEmployee";
import AdminRegister from "./components/admin/AdminRegister";
import FaceLogin from "./components/FaceLogin";
import AddTeam  from "./components/admin/AddTeam";
import AdminDashboard from "./components/admin/AdminDashboard";
import SupervisorRegister from './components/admin/SupervisorRegister';
import SupervisorDashboard from './components/supervisor/SupervisorDashboard';

function App() {
  return (
    <RecoilRoot>
      <NavBar />
      <Routes>
        <Route path="/employee/login" element={<Login />} />
        <Route path="/employee/facelogin" element={<FaceLogin />} />
        <Route path="/admin/register_employee" element={<EmployeeRegister />} />
        <Route path="/admin/register_supervisor" element={<SupervisorRegister />} />
        <Route path="/admin/register_admin" element={<AdminRegister />} />

        <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />

        <Route path="/admin/adminregister" element={<AdminRegister />} />
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/player" element={<Player />} />
        <Route path="/employee/breathingexercise" element={<BreathingExercise />} />
        <Route path="/employee/livecam" element={<LiveCam />} />
        <Route path="/admin/edit" element={<EditEmployee />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/allemployees" element={<AllEmployees />} />
        <Route path="/admin/addteam" element={<AddTeam />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
