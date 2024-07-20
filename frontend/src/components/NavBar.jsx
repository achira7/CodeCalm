// NavBar.js
import React, { useState, useEffect } from "react";
import "@fontsource/inter";
import "typeface-inter";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Messages from "./Messages";
import SettingsOverlay from "./SettingsOverlay";
import { Color } from "../theme/Colors";
import { useSetRecoilState } from "recoil";
import { roleStateAtom } from "../atoms";

const baseUrl = "http://localhost:8000/api/employee/";
const assets = "http://127.0.0.1:8000/media/assets/";
const media = "http://127.0.0.1:8000/media/";

const NavBar = () => {
  const setRole = useSetRecoilState(roleStateAtom)
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const [navLinks, setNavLinks] = useState([]);
  const [userType, setUserType] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);

      if (user.is_superuser) {
        setNavLinks(adminLinks);
        setUserType("Admin");
        setRole("Admin")
      } else if (user.is_staff) {
        setNavLinks(supervisorLinks);
        setUserType("Supervisor");
        setRole("Supervisor")
      } else {
        setNavLinks(employeeLinks);
        setUserType("Employee");
        setRole("Employee")
      }
    } catch (e) {
      console.error(e);
      navigate("/employee/login");
    }
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleMessagesToggle = () => {
    setIsMessagesOpen(!isMessagesOpen);
  };

  const handleSettingsToggle = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const logoutUser = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/api/logout/");
      navigate("/employee/login/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const employeeLinks = [
    { id: 1, title: "dashboard", link: "/employee/dashboard" },
    { id: 2, title: "live camera", link: "/employee/livecam" },
    { id: 3, title: "breathing exercise", link: "/employee/breathingexercise" },
    { id: 4, title: "Audio Therapy", link: "/employee/player" },
    { id: 5, title: "Self Stress Assess", link: "/employee/self_stress" },
  ];

  const supervisorLinks = [
    { id: 1, title: "dashboard", link: "/employee/dashboard" },
    { id: 2, title: "live camera", link: "/employee/livecam" },
    { id: 3, title: "breathing exercise", link: "/employee/breathingexercise" },
    { id: 4, title: "Audio Therapy", link: "/employee/player" },
    { id: 5, title: "team dashboard", link: "/supervisor/teamdashboard" },
  ];

  const adminLinks = [
    { id: 1, title: "dashboard", link: "/admin/dashboard" },
    { id: 2, title: "user management", link: "/admin/allemployees" },
    { id: 3, title: "System Settings", link: "/admin/settings" },
  ];

  const handleThemeMode = () => {
    const currentMode = localStorage.getItem("darkMode");
    if (currentMode === null) {
      localStorage.setItem("darkMode", "true");
    } else if (currentMode === "true") {
      localStorage.setItem("darkMode", "false");
      navigate(0);
    } else {
      localStorage.setItem("darkMode", "true");
      navigate(0);
    }
  };


  const handleNotification = () => {
    const currentMode = localStorage.getItem("notification");
    if (currentMode === null || currentMode === "hidden") {
      localStorage.setItem("notification", "show");
    } else {
      localStorage.setItem("notification", "hidden");
    }
    navigate(0); // Refresh the page to apply changes
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`flex justify-between items-center w-full h-15 p-4 ${Color.navBar} text-white sticky top-0 z-10 flex-initial`}
    >
      <div className="flex items-center hover:cursor-pointer">
        <img
          className="h-8 px-2 drop-shadow-md shadow-blue-600/50 hover:cursor-pointer"
          src={`${assets}codecalm-logo-colored.png`}
          alt="Logo"
        />
        <h1 className="text-2xl font-google font-bold drop-shadow-xl shadow-blue-600/50 hover:cursor-pointer">
          CodeCalm
        </h1>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={toggleMenu}
          className="text-white hover:text-gray-200 focus:outline-none"
        >
          <svg
            className="h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0V5zm5-2a1 1 0 1 1 0 2h7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm7 9a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2h7z"
            />
          </svg>
        </button>

        {isMenuOpen && (
          <div
            className={` ${Color.navBarMob} absolute top-0 left-0 w-full  mt-16 py-2`}
          >
            <ul className="flex flex-col items-center ">
              {navLinks.map(({ id, title, link }) => (
                <li
                  key={id}
                  className="my-2 hover:bg-sky-500 rounded-3xl capitalize"
                >
                  <Link
                    to={link}
                    className=" text-center block py-2 px-4"
                    onClick={toggleMenu}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex justify-center w-full h-20 items-center fixed">
        <ul className="flex">
          {navLinks.map(({ id, title, link }) => (
            <li
              key={id}
              className={`px-6 font-google font-semibold capitalize font-large hover:scale-105 hover:drop-shadow-xl duration-300 ${
                location.pathname === link
                  ? "text-emerald-300 text-bold bg-black/20 rounded-md"
                  : "text-white"
              }`}
            >
              <Link
                to={link}
                className="cursor-pointer drop-shadow-md shadow-blue-600/50"
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-4 mx-5">
        <ul className="flex space-x-4 items-center">

          <li>
            <button onClick={handleDropdownToggle} className="relative">
              <img
                className="h-10 w-10 rounded-full border-2 border-white shadow-blue-600/50 transform hover:scale-110 transition-transform duration-300 cursor-pointer"
                src={userData.profile_picture ? userData.profile_picture : " "}
                alt="Profile"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-lg z-10">

                <button
                  onClick={handleThemeMode}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font google"
                >
                  <img src={` `} className="w-4 inline-flex mx-2" />
                  <b>Theme: </b>
                  {localStorage.getItem("darkMode") === "true"
                    ? "Dark"
                    : "Light"}
                </button>

                <button
                  onClick={handleNotification}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font google"
                >
                  <img src={` `} className="w-4 inline-flex mx-2" />
                  <b>Notifications: </b>
                  {localStorage.getItem("notification") === "hidden"
                    ? "Off"
                    : "On"}
                </button>

                <button
                  onClick={logoutUser}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font google"
                >
                  <img src={` `} className="w-4 inline-flex mx-2" />
                  <b>Logout</b>
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>

      {isMessagesOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-">
          <div className="bg-white rounded-lg shadow-lg p-8 text-black">
            <Messages userData={userData} />
            <button
              onClick={handleMessagesToggle}
              className="mt-9 px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <SettingsOverlay userData={userData} onClose={handleSettingsToggle} />
      )}
    </div>
  );
};

export default NavBar;
