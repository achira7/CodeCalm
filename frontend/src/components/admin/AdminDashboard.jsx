import React, { useEffect, useState } from "react";
import axios from "axios";
import { LuFileDown } from "react-icons/lu";

import "../../index.css";
import TeamComponent from "../TeamComponent";
import { useParams } from "react-router-dom";

const AdminDashboard = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
      <a
              href={`/admin/team_individual_view/${selectedTeam}`}
              className="text-sky-600"
            >
              Detailed View of Team {selectedTeam}
            </a>
            
        <div className="flex flex-wrap justify-center" id="report-content">
          <select
            id="teamSelect"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>

            


          <h5 className="text-xl font-semibold text-sky-900 mb-5">
            Overview of Team {selectedTeam}
          </h5>

          <div>
            <TeamComponent team={selectedTeam} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
