import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTeam from "./AddTeam"; 

const baseUrl = "http://127.0.0.1:8000/api/register/";

function SupervisorRegister() {
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [gender, setGender] = useState("");
  const [work_location, setWork_location] = useState("");
  const [password, setPassword] = useState("");
  const [registerSucess, setregisterSucess] = useState(false);
  const [profile_picture, setProfilePicture] = useState(null);
  const is_staff = "True";
  const is_superuser = "False";
  const employment_type = "full_time"

  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); 
  
  const navigate = useNavigate();

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

  const registerFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('email', email);
    formData.append('team', team);
    formData.append('gender', gender);
    formData.append('employment_type', employment_type);
    formData.append('work_location', work_location);
    formData.append('password', password);
    formData.append('is_staff', is_staff);
    formData.append('is_superuser', is_superuser);
    if (profile_picture) {
      formData.append('profile_picture', profile_picture);
    }

    try {
      const response = await axios.post(baseUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setregisterSucess(true);
      toast.success(`${first_name} ${last_name} Employee successfully registered!`);
      //navigate("/admin/allemployees");
    } catch (error) {
      console.error("Error registering employee:", error);
      toast.error("Error occurred when registering the Supervisor.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [previewSrc, setPreviewSrc] = useState(
    "http://127.0.0.1:8000/media/profilePictures/default.jpg"
  );

  const handleAddTeam = () => {
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false); 
  };

  return (
    <div className="items-center">
      <ToastContainer />
      {isOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white p-8 rounded shadow-lg">
            <button
              className="absolute top-0 right-0 m-4 text-gray-700 hover:text-gray-900"
              onClick={handleCloseOverlay}
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="5px" y="5px" width="25" height="25" viewBox="0 0 30 30">
                <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
              </svg>
            </button>
            <AddTeam
              onSuccess={() => {
                toast.success("Team created successfully!");
              }}
              onError={() => {
                toast.error("Error creating team.");
              }}
            />
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Link to="/admin/allemployees">
          <div className="flex items-center mx-5 hover: transition-transform duration-300 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-sky-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1-18 0Z"
              />
            </svg>
            <p className="text-sky-500 font-semibold font google text-lg mx-3">
              Back to All Supervisors
            </p>
          </div>
        </Link>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 font-google">
            Add a new Supervisor
          </h2>
          <h3 className="font-google text-center text-sky-500">to CodeCalm</h3>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form method="POST" onSubmit={registerFormSubmit}>
              <div>
                <div className="mb-4 md:flex md:justify-between">
                  <div className="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="first_name"
                      type="text"
                      placeholder="First Name"
                      onChange={(e) => setFirst_Name(e.target.value)}
                    />
                  </div>
                  <div className="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="last_name"
                      type="text"
                      placeholder="Last Name"
                      onChange={(e) => setLast_Name(e.target.value)}
                    />
                  </div>
                </div>

                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="team"
                >
                  Overseeing Team
                </label>
                <div className="flex items-center">
                  <select
                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    name="team"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                  >
                    <option value="">Select Team</option>
                    {teams.map((team, index) => (
                      <option key={index} value={team.name}>{team.name}</option>
                    ))}
                  </select>
                  <button
                    className="ml-3 px-3 py-2 bg-sky-500 text-white rounded"
                    type="button"
                    onClick={handleAddTeam}
                  >
                    Add Team
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="gender"
                >
                  Gender
                </label>
                <select
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="" selected disabled hidden>Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>


              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="work_location"
                >
                  Work Location
                </label>
                <select
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="work_location"
                  value={work_location}
                  onChange={(e) => setWork_location(e.target.value)}
                >
                  <option value="" selected disabled hidden>Select Work Location</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700 font-google"
                  htmlFor="profile_picture"
                >
                  Profile Picture
                </label>
                <input
                  className="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                  name="profile_picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                
              </div>

              {previewSrc && (
                <div className="mb-4">
                  <img
                    src={previewSrc}
                    alt="Profile Preview"
                    className="w-24 h-24 object-cover rounded-full mx-auto"
                  />
                </div>
              )}

              <div className="mt-6">
                <button
                  className="w-full px-4 py-2 bg-sky-500 text-white text-sm font-bold rounded hover:bg-sky-600 focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Register Supervisor
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisorRegister;
