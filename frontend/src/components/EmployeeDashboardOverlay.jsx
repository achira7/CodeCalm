import React, { useEffect, useState } from "react";
import axios from "axios";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../index.css";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

export const EmployeeDashboardOverlay = () => {

  const user_id = 18;
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
  const [weeklyListeningData, setWeeklyListeningData] = useState({});
  const [monthlyListeningData, setMonthlyListeningData] = useState({});
  const [mostUsedExercise, setMostUsedExercise] = useState(null);
  const [mostListenedTrack, setMostListenedTrack] = useState(null);
  const [exerciseView, setExerciseView] = useState("weekly");
  const [listeningView, setListeningView] = useState("weekly");
  const [emotionView, setEmotionView] = useState("daily");
  const [hourlyEmotion, setHourlyEmotion] = useState([]);

  const fetchUserData = async (user_id) => {
    try {
      const response = axios.get("http://localhost:8000/api/getuser/", {
        params: { user_id: user_id },
      });
      const user = response.data;
      setUserData(user);
      console.log(user)
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const fetchEmotionData = async (user_id, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getemotions/",
        {
          params: { user_id: user_id, period: period },
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

  const fetchExerciseData = async (user_id, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/breathing_exercise_usage/",
        {
          params: { user: user_id, period: period },
        }
      );
      if (period === "weekly") {
        setWeeklyExerciseData(response.data.days);
        setMostUsedExercise(response.data.most_used_exercise);
      } else {
        setMonthlyExerciseData(response.data.days);
        setMostUsedExercise(response.data.most_used_exercise);
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (user_id, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/track_listening/",
        {
          params: { user: user_id, period: period },
        }
      );
      if (period === "weekly") {
        setWeeklyListeningData(response.data.days);
        setMostListenedTrack(response.data.most_listened_track);
      } else {
        setMonthlyListeningData(response.data.days);
        setMostListenedTrack(response.data.most_listened_track);
      }
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  
  console.log(user_id)

  useEffect(() => {
    if (userData.id) {
      fetchUserData()
      fetchEmotionData(userData.id, emotionView);
      fetchExerciseData(userData.id, exerciseView);
      fetchListeningData(userData.id, listeningView);
    }
  }, [userData, exerciseView, listeningView, emotionView]);

  const handleViewChange = (viewSetter, view, direction) => {
    const views = ["daily", "weekly", "monthly", "all_time"];
    const currentIndex = views.indexOf(view);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < views.length) {
      viewSetter(views[newIndex]);
    }
  };

  const emotionViews = ["daily", "weekly", "monthly", "all_time"];
  const isEmotionLeftDisabled = emotionView === "daily";
  const isEmotionRightDisabled = emotionView === "all_time";

  const exerciseViews = ["weekly", "monthly"];
  const isExerciseLeftDisabled = exerciseView === "weekly";
  const isExerciseRightDisabled = exerciseView === "monthly";

  const listeningViews = ["weekly", "monthly"];
  const isListeningLeftDisabled = listeningView === "weekly";
  const isListeningRightDisabled = listeningView === "monthly";

  /*if (navigate) {
    return <Navigate to="/employee/login/" />;
  }*/

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-semibold text-sky-700">
          {userData.first_name} &nbsp; {userData.last_name}          </h1>
        </div>

        <p>{user_id}</p>

        <div className="flex flex-wrap justify-center">

            <a href="/supervisor/teamdashboard"> ---Go back</a>


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
                    handleViewChange(setEmotionView, emotionView, "prev")
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
                    handleViewChange(setEmotionView, emotionView, "next")
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
                <img
                  src={`${icons}/breathing-icon.png`}
                  alt="Breathing Exercise"
                  className="h-10"
                />
                {exerciseView === "weekly"
                  ? "Weekly Breathing Exercise Duration"
                  : "Monthly Breathing Exercise Duration"}
              </h5>
              {exerciseView === "weekly" ? (
                Object.keys(weeklyExerciseData).length === 0 ? (
                  <h2 className="text-xl text-gray-700 mt-4">
                    No Data Recorded &#x26A0;
                    {/*<h2 className="text-xl text-gray-700 mt-4">{chartError}</h2>*/}
                  </h2>
                ) : (
                  <LineChart data={weeklyExerciseData} period="weekly" />
                )
              ) : Object.keys(monthlyExerciseData).length === 0 ? (
                <h2 className="text-xl text-gray-700 mt-4">No data recorded</h2>
              ) : (
                <LineChart data={monthlyExerciseData} period="monthly" />
              )}
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isExerciseLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(setExerciseView, exerciseView, "prev")
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
                    handleViewChange(setExerciseView, exerciseView, "next")
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
              <h5 className="text-xl font-semibold text-sky-900 inline-flex">
                <img
                  src={`${icons}/audio-icon.png`}
                  alt="Breathing Exercise"
                  className="h-10 pr-3 pl-3"
                />
                {listeningView === "weekly"
                  ? "Weekly Listening Duration"
                  : "Monthly Listening Duration"}
              </h5>
              {listeningView === "weekly" ? (
                Object.keys(weeklyListeningData).length === 0 ? (
                  <h2 className="text-xl text-gray-700 mt-4">
                    No Data Recorded &#x26A0;
                  </h2>
                ) : (
                  <LineChart data={weeklyListeningData} period="weekly" />
                )
              ) : Object.keys(monthlyListeningData).length === 0 ? (
                <h2 className="text-xl text-gray-700 mt-4">No data recorded </h2>
              ) : (
                <LineChart data={monthlyListeningData} period="monthly" />
              )}
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isListeningLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(setListeningView, listeningView, "prev")
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
                    handleViewChange(setListeningView, listeningView, "next")
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
            <div key={index} className="text-center ml-4 mr-4">
              {hourlyEmotion[hour] ? (
                <div>
                  <img
                    className="w-8 h-8 mx-auto"
                    src={`http://127.0.0.1:8000/media/emojis/${hourlyEmotion[hour]}.png`}
                    alt={hourlyEmotion[hour]}
                    title={hourlyEmotion[hour]} 
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

export default EmployeeDashboardOverlay;
