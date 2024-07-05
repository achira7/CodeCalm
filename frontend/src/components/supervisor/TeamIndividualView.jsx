import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleTeamMember from "./SingleTeamMember";
import { Navigate, Link } from "react-router-dom";
import TeamIndividualViewComponenet from "../TeamIndividualViewComponenet";



const TeamIndividualView = () => {
  const [navigate, setNavigate] = useState(false);
  const [message, setMessage] = useState("You are not authenticated");
  const [userData, setUserData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
      console.log(user)
      setMessage(`Hi ${user.first_name} ${user.last_name}`);
      fetchTeamMembers(user.team);
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const fetchTeamMembers = async (team) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/team_detections/",
        {
          params: { team: team },
        }, 
      )
      const members = response.data.team_members;
      setTeamMembers(members);
      setTeamLeaders(members.filter((member) => member.is_staff));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
        <div className="text-center">
        <TeamIndividualViewComponenet team={userData.team} role={"Supervisor"} />
      </div>  
    </div>
  );
};

export default TeamIndividualView;
