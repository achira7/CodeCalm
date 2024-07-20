import React, { useEffect, useState } from "react";
import axios from "axios";
import { Color } from "../../theme/Colors";
import "tailwindcss/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

const AddTeam = ({ onSuccess, onError }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [updatingTeam, setUpdatingTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/teamlist/");
        setTeamList(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const teamData = { name, description };

    try {
      if (updatingTeam) {
        const response = await axios.put(
          `http://localhost:8000/api/team/${updatingTeam.id}/`,
          teamData
        );
        toast.success("Team updated successfully!");
        setTeamList((prevTeamList) =>
          prevTeamList.map((team) =>
            team.id === response.data.id ? response.data : team
          )
        );
        setUpdatingTeam(null);
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/team/",
          teamData
        );
        toast.success("Team added successfully!");
        setTeamList((prevTeamList) => [...prevTeamList, response.data]);
      }
      setName("");
      setDescription("");
      onSuccess();
    } catch (error) {
      console.error("There was an error creating/updating the team!", error);
      if (error.response && error.response.data && error.response.data.name) {
        onError("A team with this name already exists.");
      } else {
        onError("Error adding/updating team");
      }
      toast.error("Error adding/updating the Team");
    }
  };

  const handleDelete = async (teamId) => {
    try {
      await axios.delete(`http://localhost:8000/api/team/${teamId}/`);
      setTeamList(teamList.filter((team) => team.id !== teamId));
      toast.success("Team deleted successfully!");
    } catch (error) {
      console.error("Error deleting team: ", error);
      toast.error("Failed to delete team. Please try again.");
    }
  };

  return (
    <div className="flex justify-center container py-8">
      <Link to="/admin/settings">
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
              To Settings Portal
            </p>
          </div>
        </Link>
      <div className="flex flex-col lg:flex-row lg:w-2/3 gap-4">

      

        <div className="text-center w-full lg:w-1/2">
          <h1 className="text-3xl font-semibold text-sky-700 mt-10">
            {updatingTeam ? "Update Team" : "Create Team"}
          </h1>
        </div>

        <div className="w-full lg:w-1/2">
          <div className={`rounded-lg shadow-lg p-6 mb-6 ${Color.cardBox}`}>
            <form method="POST" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Team Name:
                </label>
                <input
                  className={`w-full px-3 py-2 rounded-md ${Color.textFeild}`}
                  type="text"
                  name="name"
                  value={name}
                  placeholder="Team Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Team Description:
                </label>
                <textarea
                  className={`w-full px-3 py-2 rounded-md ${Color.textFeild}`}
                  name="description"
                  value={description}
                  placeholder="Team Description"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  {updatingTeam ? "Update Team" : "Create Team"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={`py-6 w-full lg:w-1/2`}>
          <div className={`rounded-lg shadow-lg p-6 mb-6 ${Color.cardBox}`}>
            <h1 className="text-xl">
              Currently Available Teams : {teamList.length}
            </h1>
            <div
              className="mt-8 w-full max-w-lg custom-scrollbar"
              style={{ maxHeight: "472px", overflowY: "scroll" }}
            >
              {teamList.map((team) => (
                <div
                  key={team.id}
                  className={`flex ${Color.textFeild} items-center mb-4 p-1 rounded-lg`}
                >
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{team.name}</p>
                    <p className="text-sm">{team.description}</p>
                  </div>
                  <button
                    onClick={() => {
                      setName(team.name);
                      setDescription(team.description);
                      setUpdatingTeam(team);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddTeam;
