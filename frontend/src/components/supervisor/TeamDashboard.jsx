import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamComponent from "../TeamComponent";
import { Link, useNavigate } from "react-router-dom";
import { TbReportAnalytics } from "react-icons/tb";
import { IoIosArrowDropright } from "react-icons/io";

export const TeamDashboard = () => {
  const [userData, setUserData] = useState({});
  const [teamID, setTeamID] = useState("");

  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      setTeamID(response.data.team);
      setUserData(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const detailedView = () => {
    navigate("/supervisor/team_individual_view");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center my-6 flex flex-col">
        <h1 className="text-3xl font-semibold text-sky-700 top-5 right-4">
          Team Dashboard
        </h1>

        <h2 className="text-2xl font-semibold text-sky-700">
          of Team {userData.team}
        </h2>

        <button
          className="px-4 py-2 rounded-md mb-5 flex absolute top-24 right-5 bg-sky-400 text-black button hover:bg-sky-600 hover:text-white duration-300"
          onClick={detailedView}
        >
          Detailed View of Team {userData.team}
          <IoIosArrowDropright size={25} className="ml-2 arrow-icon" />
        </button>
      </div>
      {userData.team && (
        <TeamComponent team={userData.team} role={"Supervisor"} />
      )}
    </div>
  );
};

export default TeamDashboard;
