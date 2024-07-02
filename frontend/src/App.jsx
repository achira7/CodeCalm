import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
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
import TeamDashboard from './components/supervisor/TeamDashboard';
import StressDetectionForm from './components/StressDetectionForm';
import AddQuestionForm from './components/admin/AddQuestionForm';
import EmployeeDashboardOverlay from './components/EmployeeDashboardOverlay';
import AllTeamsDashboard from './components/admin/AllTeamsDashboard';
import Test from './components/Test';
import Dashboard from './components/Dashboard';
import TeamIndividualView from './components/supervisor/TeamIndividualView';
import TestDashboard from './components/TestDashboard';
import AdminTeamIndividualView from './components/admin/AdminTeamIndividualView';
import EmployeeComponent from './components/EmployeeComponent';
import AdminSettings from './components/admin/AdminSettings';
import AddBreathingProfile from './components/admin/AddBreathingProfile';
import AddTrack from './components/admin/AddTrack';


function App() {
  return (
    <RecoilRoot>
      <NavBar />
      <Routes>

        {/*EMPLOYEE URLs */}
        <Route path="/employee/login" element={<Login />} />
        <Route path="/employee/facelogin" element={<FaceLogin />} />
        {<Route path="/employee/dashboard" element={<EmployeeDashboard />} />}
        <Route path="/employee/player" element={<Player />} />
        <Route path="/employee/breathingexercise" element={<BreathingExercise />} />
        <Route path="/employee/livecam" element={<LiveCam />} />
        <Route path="/employee/self_stress" element={<StressDetectionForm />}/>
        
        <Route path="/employee/test" element={<Test />}/>
        <Route path={`/employee/dashboard/:id`} element={<Dashboard />}/>


        
        {/*SUPERVISOR URLs */}
        {/*<Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />*/}
        <Route path="/supervisor/teamdashboard" element={<TeamDashboard />} />
        <Route path="/supervisor/team_individual_view" element={<TeamIndividualView />} />


        {/*ADMIN URLs */}
        <Route path="/admin/register_employee" element={<EmployeeRegister />} />
        <Route path="/admin/register_supervisor" element={<SupervisorRegister />} />
        <Route path="/admin/register_admin" element={<AdminRegister />} />
        <Route path="/admin/adminregister" element={<AdminRegister />} />
        <Route path="/admin/edit" element={<EditEmployee />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/allemployees" element={<AllEmployees />} />
        <Route path="/admin/addteam" element={<AddTeam />} />
        <Route path="/admin/addquestion" element={<AddQuestionForm />} />
        <Route path="/admin/employee_dashboard_view" element={<EmployeeDashboardOverlay/>} />
        <Route path="/admin/team_dashboard" element={<AllTeamsDashboard/>} />
        <Route path="/admin/test" element={<TestDashboard/>} />
        <Route path="/admin/team_individual_view/:selectedTeam" element={<AdminTeamIndividualView />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/breathing" element={<AddBreathingProfile />} />
        <Route path="/admin/track" element={<AddTrack />} />
      </Routes>
    </RecoilRoot>
  );
}

export default App;
