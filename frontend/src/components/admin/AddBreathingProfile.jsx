import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDropleft } from "react-icons/io";
import { Color } from "../../theme/Colors";



const AddBreathingProfile = () => {
  const [name, setName] = useState("");
  const [inhaleDuration, setInhaleDuration] = useState(null);
  const [exhaleDuration, setExhaleDuration] = useState(null);
  const [holdDuration, setHoldDuration] = useState(null);
  const [description, setDescription] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [editProfileId, setEditProfileId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/breathing_profile/"
      );
      setProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProfileId) {
        await axios.put(
          `http://localhost:8000/api/breathing_profile/${editProfileId}/`,
          {
            name,
            inhale_duration: inhaleDuration,
            exhale_duration: exhaleDuration,
            hold_duration: holdDuration,
            description,
          }
        );
        toast.success("Profile updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/breathing_profile/", {
          name,
          inhale_duration: inhaleDuration,
          exhale_duration: exhaleDuration,
          hold_duration: holdDuration,
          description,
        });
        toast.success("Profile added successfully");
      }
      fetchProfiles();
      resetForm();
    } catch (error) {
      if (error.response && error.response.data.name) {
        toast.error("A profile with this name already exists.");
      } else {
        toast.error("Error adding/updating profile");
      }
    }
  };
  
  <div className="mb-4">
    <label className="block text-gray-700">Hold Duration:</label>
    <input
      type="number"
      placeholder="in seconds"
      value={holdDuration || ''}
      onChange={(e) => setHoldDuration(e.target.value)}
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
  </div>
  

  const resetForm = () => {
    setName("");
    setInhaleDuration(0);
    setExhaleDuration(0);
    setHoldDuration(0);
    setDescription("");
    setEditProfileId(null);
  };

  const handleEdit = (profile) => {
    setName(profile.name);
    setInhaleDuration(profile.inhale_duration);
    setExhaleDuration(profile.exhale_duration);
    setHoldDuration(profile.hold_duration);
    setDescription(profile.description);
    setEditProfileId(profile.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/breathing_profile/${id}/`);
      toast.success("Profile deleted successfully");
      fetchProfiles();
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Error deleting profile");
    }
  };

  const renderWarning = (duration) => {
    if (duration >= 10000) {
      return (
        <span className="text-red-500">
          10 seconds might be too long for the user to{" "}
          {duration === inhaleDuration
            ? "inhale"
            : duration === holdDuration
            ? "hold"
            : "exhale"}
        </span>
      );
    }
    return null;
  };

  const goBackToSettings = () => {
    navigate("/admin/settings");
  }

  return (
    <div>
      <div className="text-center w-full my-5">
        <h1 className="text-3xl font-semibold text-sky-700 ">
          Manage Breathing Exercise Profiles
        </h1>

        <button
          className="px-4 py-2 rounded-md mb-5 flex absolute top-24 left-5 button bg-sky-400 text-black  hover:bg-sky-600 hover:text-white duration-300"
          onClick={goBackToSettings}
        >
          <IoIosArrowDropleft size={25} className="mr-2 arrow-icon" />
          Go Back to Settings
        </button>
      </div>
      <div className="flex justify-center mx-auto container bg-white border border-gray-200 rounded-lg shadow-lg p-3 m-6">
        <div className="flex flex-col lg:flex-row lg:w-2/3 gap-4">
          <div className={` w-full`}>
            <div className={`py-6`}>
              <div
                className={`rounded-lg shadow-lg p-6 mb-6 ${Color.cardBox} `}
              >
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Add a Breathing Exercise Profile
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                min="1"
                max="10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Give a meaningful unique name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Inhale Duration:</label>
              <input
                type="number"
                placeholder="in seconds"
                min="1"
                max="10"
                value={inhaleDuration || ""}
                onChange={(e) => setInhaleDuration(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {renderWarning(inhaleDuration)}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Exhale Duration:</label>
              <input
                type="number"
                placeholder="in seconds"
                min="1"
                max="10"
                value={exhaleDuration || ""}
                onChange={(e) => setExhaleDuration(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {renderWarning(exhaleDuration)}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Hold Duration:</label>
              <input
                type="number"
                placeholder="in seconds"
                value={holdDuration || ""}
                onChange={(e) => setHoldDuration(e.target.value)}
                required
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {renderWarning(holdDuration)}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Type instructions to perform the breathing exercise here."
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {editProfileId ? "Update Profile" : "Add Profile"}
            </button>
          </form>
          </div>
        </div>
        </div>
            <ToastContainer />
          </div>
          <div className={`py-6 w-1/2 `}>
            <div className={`rounded-lg shadow-lg p-6 mb-6  ${Color.cardBox} `}>
            <h1 className="text-xl">
                <div className="flex flex-initial">
                  <p className="font-semibold">Currently Available Profiles: </p> <p> &nbsp;{profiles.length}</p>
                </div>
              </h1>
              <div
                className="mt-8 w-full max-w-2sl custom-scrollbar "
                style={{ maxHeight: "500x", overflowY: "scroll" }}
              >
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`flex ${Color.textFeild} flex items-center justify-between bg-white border border-gray-200 rounded-lg shadow-lg p-4 mb-4`}
            >
              <h3 className=" flex items-center justify-between font-semibold text-xl w-[100px]">{profile.name}</h3>
              <p className="p-5">
                Inhale: {profile.inhale_duration}s
              </p>
              <p className="p-5">
                Exhale: {profile.exhale_duration}s
              </p>
              <p className="p-5">
                Hold: {profile.hold_duration}s
              </p>
               <button
                 onClick={() => handleEdit(profile)}
                 className="bg-blue-500 text-white px-4 py-2 rounded"
               >
                 Edit
               </button>
               <button
                 onClick={() => handleDelete(profile.id)}
                 className="bg-red-500 text-white px-4 py-2 rounded"
               >
                 Delete
               </button>
             </div>
          ))}
        </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddBreathingProfile;
