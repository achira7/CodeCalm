import React, { useState, useEffect } from "react";
import axios from "axios";
import TeamComponent from "../TeamComponent";
import AddTeam from "./AddTeam";

const AllTeamsDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/teamlist/")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  const handleAddTeam = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">All Teams Dashboard</h1>
        <div className="mb-4">
          <label
            htmlFor="teamSelect"
            className="block text-lg font-medium text-gray-700"
          >
            Select Team:
          </label>
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
          <div>
            <a
              href={`/admin/team_individual_view/${selectedTeam}`}
              className="text-sky-600"
            >
              Detailed View of Team {selectedTeam}
            </a>
            <button
              className="ml-3 px-3 py-2 bg-sky-500 text-white rounded"
              type="button"
              onClick={handleAddTeam}
            >
              Add Team
            </button>
          </div>
        </div>

        {selectedTeam && (
          <div className="container mx-auto py-6">
            <TeamComponent team={selectedTeam} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTeamsDashboard;
