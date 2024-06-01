import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
import AdminDashboard from "./components/admin/AdminDashboard";

function App() {
  return (
    <>
      <NavBar />
        <Routes>
          <Route path="/employee/login" element={<Login />} />
          <Route path="/employee/facelogin" element={<FaceLogin />} />
          <Route path="/admin/register" element={<EmployeeRegister />} />
          <Route path="/admin/adminregister" element={<AdminRegister />} />

          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/player" element={<Player />} />
          <Route path="/employee/breathingexercise" element={<BreathingExercise />} />
          <Route path="/employee/livecam" element={<LiveCam />} />

          <Route path="/admin/edit" element={<EditEmployee />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/allemployees" element={<AllEmployees />} />
        </Routes>
    </>
  );
}

export default App;
