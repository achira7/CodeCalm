import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";

import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { LuFileDown } from "react-icons/lu";

import "../index.css";
import { useParams } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

const TeamComponent = ({ team }) => {
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
  const [componenetUserData, setComponenetUserData] = useState({});
  const [emotionChartError, setEmotionChartError] = useState(null)
  const [stressChartError, setStressChartError] = useState(null)
  const [breathingChartError, setBreathingChartError] = useState(null)
  const [listeningChartError, setListeningChartError] = useState(null)

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

  const [dailyStressData, setDailyStressData] = useState({});
  const [weeklyStressData, setWeeklyStressData] = useState({});
  const [monthlyStressData, setMonthlyStressData] = useState({});
  const [stressView, setStressView] = useState("daily");

  const [hourlyEmotion, setHourlyEmotion] = useState([]);
  const [userRole, setUserRole] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      setComponenetUserData(response.data);

      if (response.data.is_superuser) {
        setUserRole("Admin");
      } else if (response.data.is_staff) {
        setUserRole("Supervisor");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchEmotionData = async (team, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/emotions/", {
        params: { team_id: team, period },
      });
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setEmotionChartError("No Emotion Data Recorded ⚠" );
      } else {
        setEmotionChartError(null);
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

  const fetchStressData = async (team, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/stress", {
        params: { team_id: team, period: period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setStressChartError("No Data Stress Recorded ⚠" );
      } else {
        setStressChartError(null);
      }
      if (period === "weekly") {
        setWeeklyStressData(data);
      } else if (period === "monthly") {
        setMonthlyStressData(data);
      } else if (period === "daily") {
        setDailyStressData(data);
      }
    } catch (error) {
      console.error("Error fetching stress data:", error);
    }
  };



  const fetchExerciseData = async (team, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/breathing/", {
        params: { team_id: team, period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setBreathingChartError("No Data Recorded ⚠" );
      } else {
        setBreathingChartError(null);
      }
      if (period === "weekly") {
        setWeeklyExerciseData(data);
      } else if (period === "monthly") {
        setMonthlyExerciseData(data);
      } else if (period === "daily") {
        setDailyExerciseData(data);
      }
      setMostUsedExercise(response.data.most_used_exercise);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (team, period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/listening/", {
        params: { team_id: team, period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setListeningChartError("No Data Recorded ⚠" );
      } else {
        setListeningChartError(null);
      }
      if (period === "weekly") {
        setWeeklyListeningData(data);
      } else if (period === "monthly") {
        setMonthlyListeningData(data);
      } else if (period === "daily") {
        setDailyListeningData(data);
      }
      setMostListenedTrack(response.data.most_listened_track);
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  useEffect(() => {
    if (team) {
      fetchUserData();
      fetchStressData(team, stressView)
      fetchEmotionData(team, emotionView);
      fetchExerciseData(team, exerciseView);
      fetchListeningData(team, listeningView);
    }
  }, [exerciseView, listeningView, emotionView, stressView]);

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

  const stressViews = ["daily", "weekly", "monthly"];
  const isStressLeftDisabled = stressView === "daily";
  const isStressRightDisabled = stressView === "monthly";

  const downloadPDF = async () => {
    /*await axios.post("http://localhost:8000/api/report/", {
        downloaded_by: userID,
            })*/

    const timestamp = new Date().toISOString();

    const input = document.getElementById("report-content");

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 20, imgWidth, imgHeight);

        pdf.setFont("helvetica"); // Set font to helvetica
        pdf.setFontSize(10); // Set font size to 16
        pdf.setTextColor(0, 0, 255);

        pdf.text(`Team ${componenetUserData.team} Report`, 10, 10)
          .setTextColor(0, 0, 0);
        pdf.text(`Generated on: ${timestamp}`, 10, 15);
        pdf.text(`Generated By: ${userRole} - ${componenetUserData.first_name} ${componenetUserData.last_name}`,
          10,
          20
        );

        pdf.save(`team_${componenetUserData.team}_report_${timestamp}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6" >
        <button
          className="bg-sky-500 text-white px-4 py-2 rounded-md mb-5"
          onClick={downloadPDF} title="in PDF format"
        >
          <LuFileDown /> Download Report 
        </button>

        <div className="flex flex-wrap justify-center" id="report-content">
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
              {emotionChartError ? (
                <h2 className="text-xl text-gray-700 mt-4 flex-initial">
                  {emotionChartError}   
                  </h2>
              ) : (
                <div>
                  <div className="flex items-center justify-center">
                    <DoughnutChart {...emotions} />

                    <div className="w-1/2 mb-28" id="highestEmotion">
                      <img
                        className="w-15 h-15 mx-auto mt-4"
                        src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                        alt={highestEmotion.key}
                        title={`Highest emotion is: ${highestEmotion.key}`}
                      />
                    </div>
                  </div>
                </div>
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

          {/* Stress Data */}
          <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="text-center">
              <h5 className="text-xl font-semibold text-sky-900 inline-flex">
                {stressView === "daily"
                  ? "Daily Stress Levels"
                  : stressView === "weekly"
                  ? "Weekly Stress Levels"
                  : "Monthly Stress Levels"}
              </h5>
              {stressChartError ? (
                <h2 className="text-xl text-gray-700 mt-4 flex-initial">
                  {stressChartError}
                </h2>
              ) : (
                <BarChart
                  data={
                    {
                      daily: dailyStressData,
                      weekly: weeklyStressData,
                      monthly: monthlyStressData,
                    }[stressView]
                  }
                  period={stressView}
                />
              )}
              <div className="flex justify-center mt-4">
                <button
                  className={`text-sky-900 ${
                    isStressLeftDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setStressView,
                      stressView,
                      "prev",
                      stressViews
                    )
                  }
                  disabled={isStressLeftDisabled}
                >
                  <FaArrowLeft />
                </button>
                <button
                  className={`ml-4 text-sky-900 ${
                    isStressRightDisabled ? "text-gray-400" : ""
                  }`}
                  onClick={() =>
                    handleViewChange(
                      setStressView,
                      stressView,
                      "next",
                      stressViews
                    )
                  }
                  disabled={isStressRightDisabled}
                >
                  <FaArrowRight />
                </button>
                </div>
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
              {breathingChartError ? (
                <h2 className="text-xl text-gray-700 mt-4 flex-initial">
                  {breathingChartError }
                </h2>
              ) : (              
              <LineChart
                data={
                  {
                    daily: dailyExerciseData,
                    weekly: weeklyExerciseData,
                    monthly: monthlyExerciseData,
                  }[exerciseView]
                }
              />
            )}
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
                    Most Used Exercise of team {team}:
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
              {listeningChartError ? (
                <h2 className="text-xl text-gray-700 mt-4 flex-initial">
                  {listeningChartError}
                </h2>
              ) : (
              <LineChart
                data={
                  {
                    daily: dailyListeningData,
                    weekly: weeklyListeningData,
                    monthly: monthlyListeningData,
                  }[listeningView]
                }
              />
            )}              
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
                    Most Listened Track of team {team}:
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
          Dominant Emotion by Hour of team {team}
        </h5>
        <div className="flex justify-between mt-4 w-full">
          {Object.keys(hourlyEmotion).map((hour, index) => (
            <div key={index} className="text-center ml-4 mr-4">
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
                <span className="text-xl"> - </span>
              )}
              <p className="text-sm text-gray-700">{hour.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamComponent;