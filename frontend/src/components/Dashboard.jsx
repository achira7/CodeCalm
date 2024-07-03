import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "../index.css";
import { useParams } from "react-router-dom";
import TestComponent from "./EmployeeComponent";
import TestDashboard from "./TestDashboard";


const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

const Dashboard = (props) => {
  const params = useParams();

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

  const [goBackText, setGoBackText] = useState("");

  const fetchUserDataWithID = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/g/", {
        params: {
          user_id: params.id,
        },
      });
      console.log(response.data);
      setUserData(response.data);
    } catch (e) {
      console.error(e);
      setNavigate(true);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });

      if (response.data.is_superuser == true) {
        setReportGeneration(true)
        setGoBackText("/admin/team_dashboard");
      } else if (response.data.is_staff == true){
        setGoBackText("/supervisor/team_individual_view");
        setReportGeneration(true)
      }else{
        setReportGeneration(false)

      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEmotionData = async (userId = params.id, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getemotions/",
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

  const fetchExerciseData = async (
    userId = params.id,
    period,
    team_id = "none"
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/breathing/",
        {
          params: { user: userId, period: period, team_id: team_id },
        }
      );
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

  const fetchListeningData = async (
    userId = params.id,
    period /*team_id="none"*/
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/listening/",
        {
          params: { user: userId, period: period /*team_id*/ },
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
    fetchUserDataWithID();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <Link to={goBackText}>
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
              Go Back
            </p>
          </div>
        </Link>

        <div className="flex flex-wrap justify-center">
          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <img
                className="w-32 h-32 rounded-full mx-auto border-4 border-sky-500 shadow-lg"
                src={userData.profile_picture || pfp}
                alt="Profile"
              />
              Detailed view of:
              <h2 className="mt-4 text-2xl font-semibold text-sky-700">
                {userData.first_name}&nbsp;{userData.last_name}
              </h2>
              <p className="text-gray-600 mt-2">UserID: {params.id}</p>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>
          </div>

          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            
              <TestComponent id={params.id}/>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
