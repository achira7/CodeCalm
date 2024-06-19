import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import DoughnutChart from "../charts/DoughnutChart";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [emotions, setEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const [weeklyEmotions, setWeeklyEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const [message, setMessage] = useState("You are not authenticated");
  const [userData, setUserData] = useState({});
  const [chartError, setChartError] = useState(null);
  const [highestEmotion, setHighestEmotion] = useState({ key: "", value: 0 });

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
      setMessage(`Hi ${user.first_name} ${user.last_name}`);
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const fetchEmotionData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getallemotions/",
        //{ params: { user_id: userId } }
      );
      const data = response.data;
      setEmotions(data);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setChartError("No data recorded");
      } else {
        setChartError(null);
      }

      try {
        const response = await axios.get(
          "http://localhost:8000/api/getweeklyallemotions/",
          { params: { user_id: userId } }
        );
        const data = response.data;
        setWeeklyEmotions(data);
  
        const allZero = Object.values(data).every((value) => value === 0);
        if (allZero) {
          setChartError("No data recorded");
        } else {
          setChartError(null);
        }
    }catch (e){
        console.log(e)
    }

      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      
      setHighestEmotion({ key: maxKey, value: maxValue });

    } catch (error) {
      
      console.error("Error fetching data:", error);
      setChartError("An error occurred!");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchEmotionData(userData.id);
    }
  }, [userData]);

  if (!navigate) {
    navigate("/employee/login/")
  }

  return (
    <div>
      <div className="flex m-5">
        <h1 className="mb-1 text-2xl text-sky-700 font-google font-semibold">
          Employee Dashboard
        </h1>
      </div>

      <a href="/admin/addquestion"> Add a question!</a>

      <div>
        <div className="flex items-center">
          <div className="px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t rounded-lg ">
            <div className="flex flex-col items-center pb-10">
              <div className="mt-4 items-center pb-10 flex flex-col">
                <img
                  className="scale-[0.4] rounded-full border-2 border-sky-500 shadow-blue-600/50 "
                  src={userData.profile_picture || pfp}
                  alt="Profile"
                />

                <h1 className="text-xl text-sky-900 font-google font-semibold">
                  Welcome, {userData.first_name} {userData.last_name}!
                </h1>
                <div></div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-lg drop-shadow-lg">
            <div className="flex flex-col items-center pb-10">
              <h5 className="mb-1 text-xl text-sky-900 font-google font-semibold">
                Overall Employee Emotions
              </h5>
              {chartError ? (
                <h2 className="mb-1 text-xl text-sky-900 font-google">
                  {chartError}
                </h2>
              ) : (
                <DoughnutChart {...emotions} />
              )}
            </div>
          </div>

          <div className="px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-lg drop-shadow-lg">
            <div className="flex flex-col items-center pb-10">
              <h5 className="mb-1 text-xl text-sky-900 font-google font-semibold">
                Weekly Employee Emotions
              </h5>
              {chartError ? (
                <h2 className="mb-1 text-xl text-sky-900 font-google">
                  {chartError}
                </h2>
              ) : (
                <DoughnutChart {...weeklyEmotions} />
              )}
            </div>
          </div>

          <div className="px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-lg drop-shadow-lg">
            <div className="flex flex-col items-center pb-10">
              <h5 className="mb-1 text-xl text-sky-900 font-google font-semibold">
                Your Most Common Emotion Is:
              </h5>
              <div className="flex mt-4 md:mt-6">
                {chartError ? (
                  <div>
                    <h2 className="mb-1 text-xl text-sky-900 font-google text-transform: capitalize">
                      {chartError}
                    </h2>
                  </div>
                ) : (
                  <div>
                    <h2 className="mb-1 text-xl text-sky-900 font-google text-transform: capitalize">
                      {highestEmotion.key}
                    </h2>
                    <img
                      className="h-32 w-32"
                      src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                      alt={highestEmotion.key}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
