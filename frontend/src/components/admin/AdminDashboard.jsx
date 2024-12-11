import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuFileDown } from "react-icons/lu";

import "../../index.css";
import TeamComponent from "../TeamComponent";
import { useParams } from "react-router-dom";
import { Color } from "../../theme/Colors";
import { useNavigate } from "react-router-dom";
import { IoIosArrowDropright } from "react-icons/io";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const params = useParams();

  const [emotions, setEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const [componenetUserData, setComponenetUserData] = useState({});
  const [userRole, setUserRole] = useState("");

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("all");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      setComponenetUserData(response.data);

      if (response.data.is_superuser) {
        setUserRole("Admin");
      } else if (response.data.is_staff) {
        setUserRole("Supervisor");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/teamlist/");
      setTeams(response.data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTeams();
  }, []);

  const goToSelectedTeam = () => {
    navigate(`/admin/team_individual_view/${selectedTeam}`);
  };

  console.log(selectedTeam);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <select
            id="teamSelect"
            className="m-5 block w-1/4 pl-3 pr-10 py-2 bg-sky-200 text-bold border-solid border-2 border-sky-500 font-google focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="" className="">
              Select a team
            </option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>

          <h1
            className={`text-3xl font-bold text-sky-700 font-google text-center ${Color.background} ${Color.cardBGText}`}
          >
            Employee Dashboard Of <br />
            {selectedTeam !== null && selectedTeam === "all"
              ? "All Employees"
              : `Team ${selectedTeam}`}
          </h1>

          <button
            className={`px-4 py-2 rounded-md flex mr-20 ${
              selectedTeam === null ||
              selectedTeam.trim() === "all" ||
              selectedTeam === ""
                ? "bg-gray-300 text-slate-400 cursor-not-allowed"
                : "bg-sky-400 text-black  hover:bg-sky-600 hover:text-white duration-300"
            }`}
            onClick={goToSelectedTeam}
            disabled={selectedTeam === null || selectedTeam.trim() === "all"}
          >
            Detailed View of {selectedTeam}
            <IoIosArrowDropright size={25} className="ml-2 arrow-icon" />
          </button>
        </div>

        <div id="report-content" className="flex flex-wrap justify-center mt-5">
          <div>
            <TeamComponent team={selectedTeam} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
