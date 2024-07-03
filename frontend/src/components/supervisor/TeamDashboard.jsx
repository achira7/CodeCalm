import React, { useEffect, useState } from "react";
import axios from "axios";
import TeamComponent from "../TeamComponent";
import { Link, useNavigate } from 'react-router-dom';


export const TeamDashboard = () => {
  const [userData, setUserData] = useState({});
  const [teamID, setTeamID] = useState('');

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

  const detailedView = () =>{
    navigate("/supervisor/team_individual_view")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      < div className="text-center mb-6">
        <h1 className="text-3xl font-semibold text-sky-700">Team Dashboard</h1>
        <h2 className="text-2xl font-semibold text-sky-700">of team {userData.team}</h2>
       
        <button className="bg-sky-500 text-white px-4 py-2 rounded-md mb-5 flex"
        onClick={detailedView}>
            Detailed View of Team {userData.team}
        </button>
      
      </div>
      {userData.team && (
        <TeamComponent team={userData.team} role={"Supervisor"} />
      )}
    </div>
  );
};

export default TeamDashboard;
