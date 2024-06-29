import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleTeamMember from "./supervisor/SingleTeamMember";
import { Navigate, Link } from "react-router-dom";

const TeamIndividualViewComponenet = ({ team, role }) => {
  const [navigate, setNavigate] = useState(false);
  const [message, setMessage] = useState("You are not authenticated");
  const [userData, setUserData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [goBackText, setGoBackText] = useState("");

  console.log(team, role);

  const fetchTeamMembers = async (team) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/team_detections/",
        {
          params: { team: team },
        }
      );
      const members = response.data.team_members;
      setTeamMembers(members);
      setTeamLeaders(members.filter((member) => member.is_staff));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTeamMembers(team);
  }, [team]);

  useEffect(() => {
    if (role === "Admin") {
      setGoBackText("/admin/teamdashboard");
    } else if (role === "Supervisor") {
      setGoBackText("/supervisor/teamdashboard");
    }
  }, [role]);

  return (
    <div>
      <Link to={goBackText}>
        <div className="flex items-center mx-5 hover: transition-transform duration-300 cursor-pointer">
          <svg
            className="fill-sky-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            id="back-arrow"
          >
            <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
            <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
          </svg>
          <p className="text-sky-500 font-semibold font google text-lg mx-3">
            Back to Team Dashboard
          </p>
        </div>
      </Link>

      <div className="text-center">
        <h5 className="text-xl font-semibold text-sky-900">
          Detailed View of <br />
          Team {team}
        </h5>
        <h1>Team Leader(s)</h1>

        <div className="mt-4">
          {teamLeaders.length > 0 ? (
            <ul>
              {teamLeaders.map((leader, index) => (
                <li key={index} className="text-left">
                  {leader.first_name} {leader.last_name}{" "}
                  {/*leader.id === userData.id && "(You)"*/}
                </li>
              ))}
            </ul>
          ) : (
            <p>No team leaders found.</p>
          )}
        </div>
      </div>

      <div>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email Address
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Emotion
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stress
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100  text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Breathing Exercise
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                White Noise
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stress Score
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {teamMembers
              .filter((member) => !member.is_staff) // Filter out staff members
              .map((member) => (
                <SingleTeamMember key={member.id} employee={member} />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamIndividualViewComponenet;
