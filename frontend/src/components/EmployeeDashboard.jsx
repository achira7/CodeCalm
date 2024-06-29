import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "../index.css";
import TestComponent from "./EmployeeComponent";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

const EmployeeDashboard = () => {
  const [userData, setUserData] = useState({});
  const [userRole, setUserRole] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
      if (response.data.is_superuser) {
        setUserRole("Admin");
      } else if (response.data.is_staff) {
        setUserRole("Supervisor");
      } else {
        setUserRole("Employee");
      }
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-sky-700">
            Employee Dashboard
          </h1>
        </div>

        <div className="container mx-auto py-6">
            <TestComponent id={userData.id} role={userRole} />
          </div>
        </div>
      </div>
  );
};
export default EmployeeDashboard;
