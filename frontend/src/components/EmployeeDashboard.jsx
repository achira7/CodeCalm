import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../index.css";
import Dashboard from "./Dashboard";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

export const EmployeeDashboard = () => {
  const [emotions, setEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const [navigate, setNavigate] = useState(false);
  const [userData, setUserData] = useState({});
  const [chartError, setChartError] = useState(null);
  const [highestEmotion, setHighestEmotion] = useState({ key: "", value: 0 });
  const [weeklyExerciseData, setWeeklyExerciseData] = useState({});
  const [monthlyExerciseData, setMonthlyExerciseData] = useState({});
  const [dailyExerciseData, setDailyExerciseData] = useState({});
  const [weeklyListeningData, setWeeklyListeningData] = useState({});
  const [monthlyListeningData, setMonthlyListeningData] = useState({});
  const [dailyListeningData, setDailyListeningData] = useState({});
  const [mostUsedExercise, setMostUsedExercise] = useState(null);
  const [mostListenedTrack, setMostListenedTrack] = useState(null);
  const [exerciseView, setExerciseView] = useState("daily");
  const [listeningView, setListeningView] = useState("daily");
  const [emotionView, setEmotionView] = useState("daily");
  const [hourlyEmotion, setHourlyEmotion] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const fetchEmotionData = async (userId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/emotions/",
        {
          params: { user_id: userId, period: period },
        }
      );
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setChartError("No Data Recorded ⚠");
      } else {
        setChartError(null);
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

  const fetchExerciseData = async (userId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/breathing/",
        {
          params: { user: userId, period: period },
        }
      );
      console.log(response.data);
      const data = response.data.days || {};
      if (period === "weekly") {
        setWeeklyExerciseData(data);
      } else if (period === "monthly") {
        setMonthlyExerciseData(data);
      } else if (period === "daily") {
        setDailyExerciseData(data);
      }
      setMostUsedExercise(response.data.most_used_exercise || null);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (userId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/listening/",
        {
          params: { user: userId, period: period },
        }
      );
      const data = response.data.days || {};
      if (period === "weekly") {
        setWeeklyListeningData(data);
      } else if (period === "monthly") {
        setMonthlyListeningData(data);
      } else if (period === "daily") {
        setDailyListeningData(data);
      }
      setMostListenedTrack(response.data.most_listened_track || null);
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchEmotionData(userData.id, emotionView);
      fetchExerciseData(userData.id, exerciseView);
      fetchListeningData(userData.id, listeningView);
    }
  }, [userData, exerciseView, listeningView, emotionView]);

  const handleViewChange = (viewSetter, view, direction, viewsArray) => {
    const currentIndex = viewsArray.indexOf(view);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < viewsArray.length) {
      viewSetter(viewsArray[newIndex]);
    }
  };

  const emotionViews = ["daily", "weekly", "monthly", "all_time"];
  const isEmotionLeftDisabled = emotionView === "daily";
  const isEmotionRightDisabled = emotionView === "all_time";

  const exerciseViews = ["daily", "weekly", "monthly"];
  const isExerciseLeftDisabled = exerciseView === "daily";
  const isExerciseRightDisabled = exerciseView === "monthly";

  const listeningViews = ["daily", "weekly", "monthly"];
  const isListeningLeftDisabled = listeningView === "daily";
  const isListeningRightDisabled = listeningView === "monthly";

  if (navigate) {
    return <Navigate to="/employee/login/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-sky-700">
            Employee Dashboard
          </h1>
        </div>

        <div className="flex flex-wrap justify-center">
          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <img
                className="w-32 h-32 rounded-full mx-auto border-4 border-sky-500 shadow-lg"
                src={userData.profile_picture || pfp}
                alt="Profile"
              />
              <h2 className="mt-4 text-2xl font-semibold text-sky-900">
                Welcome, {userData.first_name} &nbsp; {userData.last_name}!
              </h2>
              <p className="text-gray-600 mt-2">UserID: {userData.id}</p>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>
          </div>

          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <h5 className="text-xl font-semibold text-sky-900 mb-5">
                {emotionView === "daily"
                  ? "Daily Emotions"
                  : emotionView === "weekly"
                  ? "Weekly Emotions"
                  : emotionView === "monthly"
                  ? "Monthly Emotions"
                  : "Overall Emotions"}
              </h5>
              {chartError ? (
                <h2 className="text-xl text-gray-700 mt-4">{chartError}</h2>
              ) : (
                <DoughnutChart {...emotions} />
              )}
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isEmotionLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setEmotionView,
                      emotionView,
                      "prev",
                      emotionViews
                    )
                  }
                  disabled={isEmotionLeftDisabled}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className={`ml-4 text-sky-900 ${
                    isEmotionRightDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setEmotionView,
                      emotionView,
                      "next",
                      emotionViews
                    )
                  }
                  disabled={isEmotionRightDisabled}
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <h5 className="text-xl font-semibold text-sky-900">
                Your Most Common Emotion
              </h5>
              {chartError ? (
                <h2 className="text-xl text-gray-700 mt-4">{chartError}</h2>
              ) : (
                <div className="mt-4">
                  <h2 className="text-xl text-sky-900 capitalize">
                    {highestEmotion.key}
                  </h2>
                  <img
                    className="w-20 h-20 mx-auto mt-4"
                    src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                    alt={highestEmotion.key}
                  />
                  <p className="text-gray-700 mt-4">
                    Detected {highestEmotion.value}{" "}
                    {highestEmotion.value === 1 ? "time" : "times"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Exercise Data */}
          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <h5 className="text-xl font-semibold text-sky-900 inline-flex">
                {exerciseView === "daily"
                  ? "Daily Breathing Exercise Usage"
                  : exerciseView === "weekly"
                  ? "Weekly Breathing Exercise Usage"
                  : "Monthly Breathing Exercise Usage"}
              </h5>
              <LineChart
                data={
                  {
                    daily: dailyExerciseData,
                    weekly: weeklyExerciseData,
                    monthly: monthlyExerciseData,
                  }[exerciseView]
                }
              />
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isExerciseLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setExerciseView,
                      exerciseView,
                      "prev",
                      exerciseViews
                    )
                  }
                  disabled={isExerciseLeftDisabled}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className={`ml-4 text-sky-900 ${
                    isExerciseRightDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setExerciseView,
                      exerciseView,
                      "next",
                      exerciseViews
                    )
                  }
                  disabled={isExerciseRightDisabled}
                >
                  <FaArrowRight />
                </button>
              </div>
              {mostUsedExercise && (
                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-sky-900 mb-5">
                    Most Used Exercise:
                  </h5>
                  <p className="text-gray-700">
                    {mostUsedExercise.exercise_name}
                  </p>
                  <p className="text-gray-700">
                    Total Duration:{" "}
                    {(mostUsedExercise.total_duration / 60.0).toFixed(2)}{" "}
                    minutes
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Listening Data */}
          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <h5 className="text-xl font-semibold text-sky-900 mb-5">
                {listeningView === "daily"
                  ? "Daily Track Listening Usage"
                  : listeningView === "weekly"
                  ? "Weekly Track Listening Usage"
                  : "Monthly Track Listening Usage"}
              </h5>
              <LineChart
                data={
                  {
                    daily: dailyListeningData,
                    weekly: weeklyListeningData,
                    monthly: monthlyListeningData,
                  }[listeningView]
                }
              />
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isListeningLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setListeningView,
                      listeningView,
                      "prev",
                      listeningViews
                    )
                  }
                  disabled={isListeningLeftDisabled}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className={`ml-4 text-sky-900 ${
                    isListeningRightDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setListeningView,
                      listeningView,
                      "next",
                      listeningViews
                    )
                  }
                  disabled={isListeningRightDisabled}
                >
                  <FaArrowRight />
                </button>
              </div>
              {mostListenedTrack && (
                <div className="mt-4">
                  <h5 className="text-lg font-semibold text-sky-900 mb-5">
                    Most Listened Track:
                  </h5>
                  <p className="text-gray-700">
                    {mostListenedTrack.track_name}
                  </p>
                  <p className="text-gray-700">
                    Total Duration:{" "}
                    {(mostListenedTrack.total_duration / 60).toFixed(2)} minutes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-xl w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h5 className="text-xl font-semibold text-sky-900">
          Dominant Emotion by Hour
        </h5>
        <div className="flex justify-between mt-4 w-full">
          {Object.keys(hourlyEmotion).map((hour, index) => (
            <div key={index} className="text-center ml-4 mr-4 my-5">
              {hourlyEmotion[hour] ? (
                <div>
                  <img
                    className="w-8 mx-auto"
                    src={`http://127.0.0.1:8000/media/emojis/${hourlyEmotion[hour]}.png`}
                    alt={hourlyEmotion[hour]}
                    title={hourlyEmotion[hour]} // Adding the title attribute for the tooltip
                  />
                </div>
              ) : (
                <span className="text-xl">-</span>
              )}
              <p className="text-sm text-gray-700">{hour.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
