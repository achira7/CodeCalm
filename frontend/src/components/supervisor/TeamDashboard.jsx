import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamComponent from "../TeamComponent";

export const TeamDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [teamID, setTeamID] = useState('');

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      setTeamID(response.data.team);
      const user = response.data;
      setUserData(user);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-sky-700">Team Dashboard</h1>
        <h2 className="text-2xl font-semibold text-sky-700">of team {userData.team}</h2>
        <div>
          <a href="/supervisor/team_individual_view" className="text-sky-600">
            Detailed View of Team {userData.team}
          </a>
        </div>
      </div>
      <TeamComponent team={userData.team} />
    </div>
  );
};

export default TeamDashboard;
