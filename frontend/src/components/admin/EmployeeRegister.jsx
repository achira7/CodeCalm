import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";

import React, { useEffect, useState } from "react";

const baseUrl = "http://127.0.0.1:8000/api/register/";

function EmployeeRegister() {
  const [first_name, setFirst_Name] = useState("")
  const [last_name, setLast_Name] = useState("")
  const [email, setEmail] = useState("")
  const [team, setTeam] = useState("")
  const [gender, setGender] = useState("")
  const [employment_type, setEmployment_type] = useState("")
  const [work_location, setWork_location] = useState("")
  const [password, setPassword] = useState("")
  const [registerSucess, setregisterSucess] = useState(false)
  const [profile_picture, setProfilePicture] = useState(null)
  const is_staff = "False"
  const is_superuser = "False"

  const registerFormSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/register/", {
      first_name,
      last_name,
      email,
      team,
      gender,
      employment_type,
      work_location,
      password,
      is_staff,
      is_superuser,
      profile_picture,
    });
    setregisterSucess(true);
  };

  if (registerSucess) {
    console.log("register sucess!")
  }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            (e) => setProfilePicture(e.target.value)
          setProfilePicture(file)
          const reader = new FileReader();
          reader.onload = () => {
            setPreviewSrc(reader.result)
          }
          reader.readAsDataURL(file)
        }
      }
    
      const [previewSrc, setPreviewSrc] = useState(
        "http://127.0.0.1:8000/media/profilePictures/default.jpg"
      )

  return (
    <div className="items-center">
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
                d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <p className="text-sky-500 font-semibold font google text-lg mx-3">
              Back to All Employees
            </p>
          </div>
        </Link>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900 font-google">
            Add a new User
          </h2>
          <h3 className="font-google text-center text-sky-500">to CodeCalm</h3>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form method="POST" onSubmit={registerFormSubmit}>
              <div>
                <div class="mb-4 md:flex md:justify-between">
                  <div class="mb-4 md:mr-2 md:mb-0">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="firstName"
                    >
                      First Name
                    </label>
                    <input
                      class="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="first_name"
                      type="text"
                      placeholder="First Name"
                      onChange={(e) => setFirst_Name(e.target.value)}
                    />
                  </div>
                  <div class="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <input
                      class="w-full px-3 py-2 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="last_name"
                      type="text"
                      placeholder="Last Name"
                      onChange={(e) => setLast_Name(e.target.value)}
                    />
                  </div>
                </div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5  text-gray-700"
                >
                  E-mail Address
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    id="name"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="User's company email"
                    type="email"
                  />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"></div>
                </div>

                <div class="mb-4 md:flex md:justify-between">
                  <div class="mb-4 md:mr-2 md:mb-0">
                    <label
                      class="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="firstName"
                    >
                      Team
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline "
                      name="team"
                      type="text"
                      placeholder="Team"
                      onChange={(e) => setTeam(e.target.value)}
                    />
                  </div>
                  <div class="md:ml-2">
                    <label
                      className="block mb-2 text-sm font-bold text-gray-700 font-google"
                      htmlFor="gender"
                    >
                      Gender
                    </label>
                    <select
                      className="w-full px-3 py-2 text-sm leading-tight text-gray-700  border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      name="gender"
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="" selected disabled hidden>
                        Choose Gender
                      </option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5  text-gray-700"
                >
                  Employement Type
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <select
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    name="employment_type"
                    onChange={(e) => setEmployment_type(e.target.value)}
                  >
                    <option value="" selected disabled hidden>
                      Choose Here
                    </option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="intern">Intern</option>
                  </select>
                </div>
              </div>

              <div class="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-5  text-gray-700"
                >
                  Work Location
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <select
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    name="work_location"
                    onChange={(e) => setWork_location(e.target.value)}
                  >
                    <option value="" selected disabled hidden>
                      Choose Here
                    </option>
                    <option value="onsite">On Site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"></div>
                </div>
              </div>

              <div class="mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Password
                </label>
                <div class="mt-1 rounded-md shadow-sm">
                  <input
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type="password"
                  />
                </div>
              </div>

              <div class="mt-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Profile Picture
                </label>
                <div class="mt-1 rounded-md shadow-sm">
                <div className="mt-6">
          <label
            htmlFor="profile_picture"
            className="block text-sm font-medium leading-5 text-gray-700"
          >
            Profile Picture
          </label>
          <div className="mt-1 flex items-center">
            <input
              name="profile_picture"
              type="file"
              onChange={(e) => handleFileChange} // Handle file input change
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                hover:file:bg-violet-100"/>
            <img
              id="preview_img"
              className="h-16 w-16 object-cover rounded-full"
              src={previewSrc}
              alt="Current profile photo"
            />
          </div>
        </div>
                </div>
              </div>

              <div class="mt-6">
                <span class="block w-full rounded-md shadow-sm">
                  <button
                    class="flex w-full justify-center rounded-md disabled:bg-green-200 disabled:text-gray-400 bg-green-300 px-3 py-1.5 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300"
                    type="submit"
                  >
                    Create User
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeRegister;
