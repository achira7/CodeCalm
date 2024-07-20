import React, { useEffect, useState } from "react";
import axios from "axios";
import SingleTeamMember from "./supervisor/SingleTeamMember";
import { Navigate, Link } from "react-router-dom";
import { IoIosArrowDropleft } from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useRecoilValue } from "recoil";
import { roleStateAtom } from "../atoms";

const TeamIndividualViewComponenet = ({ team, role }) => {
  //const [navigate, setNavigate] = useState(false);
  const [message, setMessage] = useState("You are not authenticated");
  const [userData, setUserData] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [goBackText, setGoBackText] = useState("");

  const userRole = useRecoilValue(roleStateAtom)


  const navigate = useNavigate()

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
      setGoBackText("/admin/dashboard");
    } else if (role === "Supervisor") {
      setGoBackText("/supervisor/teamdashboard");
    }
  }, [role]);

  const goBackButton = () => {
    navigate(goBackText)
  }

  return (
    <div>
        <button
          className="px-4 py-2 rounded-md mb-5 flex absolute top-24 left-5 button bg-sky-400 text-black  hover:bg-sky-600 hover:text-white duration-300"
          onClick={goBackButton}
        >
          <IoIosArrowDropleft size={25} className="mr-2 arrow-icon" />
          Go Back to {role=="Admin" ? "Admin Dashboard":"Team Dashboard"}
        </button>


      <div className="text-center">
        <div className="felx items-center">
          <div className="mt-5">
            <h5 className="text-2xl font-bold text-sky-900">
              Detailed View of:
            </h5>

            <h5 className="text-lg text-black">Team {team}</h5>
          </div>

          <div className="felx items-center rounded-lg bg-gray-300 flex-wrap m-5 px-5 py-2 inline-block">
            <h1 className="font-semibold">Team Leader(s):</h1>
            <div className="flex items-center justify-center">
              {teamLeaders.length > 0 ? (
                <ul>
                  {teamLeaders.map((leader, index) => (
                    <li key={index} className="text-left flex items-center">
                      <FaCaretRight className="" />
                      {leader.first_name} {leader.last_name}
                      {/*leader.id === userData.id && "(You)"*/}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No team leaders found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="font-google px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee
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
                Audio Therapy
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Self Stress Report Score
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody>
            {teamMembers
              .filter((member) => !member.is_staff)
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
