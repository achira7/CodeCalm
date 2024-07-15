import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Link } from "react-router-dom";

import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import BarChart from "./charts/BarChart";
import TwoValueBarChart from "./charts/TwoValueBarChart";

import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { LuFileDown } from "react-icons/lu";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

import "../index.css";
import { useParams } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Color } from "../theme/Colors";
import { BtnColor } from "../theme/ButtonTheme";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EmotionCompare from "./compare/EmotionCompare";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";
const icons = "http://127.0.0.1:8000/media/icons";

const EmployeeComponent = ({ id, role }) => {
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

  const [emotionChartError, setEmotionChartError] = useState(null);
  const [stressChartError, setStressChartError] = useState(null);
  const [breathingChartError, setBreathingChartError] = useState(null);
  const [listeningChartError, setListeningChartError] = useState(null);

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

  const [dailyFocusData, setDailyFocusData] = useState({});
  const [weeklyFocusData, setWeeklyFocusData] = useState({});
  const [monthlyFocusData, setMonthlyFocusData] = useState({});
  const [focusedData, setFocusedData] = useState({});
  const [focusChartError, setFocusChartError] = useState(null);
  const [focusView, setFocusView] = useState("daily");

  const [dailyStressData, setDailyStressData] = useState({});
  const [weeklyStressData, setWeeklyStressData] = useState({});
  const [monthlyStressData, setMonthlyStressData] = useState({});
  const [stressView, setStressView] = useState("daily");

  const [hourlyEmotion, setHourlyEmotion] = useState([]);

  const [userRole, setUserRole] = useState("");
  const [componenetUserData, setComponenetUserData] = useState({});

  const [goBackText, setGoBackText] = useState("");

  const [specificPeriod, setSpecificPeriod] = useState(null);
  const [dateType, setDateType] = useState("daily");

  const [selectedView, setSelectedView] = useState("daily");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [periodForExact, setPeriodForExact] = useState("daily");

  const [calType, setCalType] = useState("date");

  const fetchUserDataWithID = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/g/", {
        params: {
          user_id: id,
        },
      });
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

  const fetchEmotionData = async (period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/emotions/", {
        params: {
          user_id: id,
          period: period,
          //specific_period: specific_period,
        },
      });
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setEmotionChartError("No Emotion Data Recorded ⚠");
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
  const fetchStressData = async (period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/stress", {
        params: { user_id: id, period: period },
      });

      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setStressChartError("No Data Stress Recorded ⚠");
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

  const fetchFocusData = async (period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/focus", {
        params: { user_id: id, period: period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setFocusChartError("No Focus Data Recorded ⚠");
      } else {
        setFocusChartError(null);
      }
      if (period === "weekly") {
        setWeeklyFocusData(data);
      } else if (period === "monthly") {
        setMonthlyFocusData(data);
      } else if (period === "daily") {
        setDailyFocusData(data);
      }
      //setFocusedData(data);
    } catch (error) {
      console.error("Error fetching focus data:", error);
    }
  };

  const fetchExerciseData = async (period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/breathing/", {
        params: { user_id: id, period: period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setBreathingChartError("No Data Recorded ⚠");
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
      setMostUsedExercise(response.data.most_used_exercise || null);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (period) => {
    try {
      const response = await axios.get("http://localhost:8000/api/listening/", {
        params: { user_id: id, period: period },
      });
      const data = response.data.days || {};
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setListeningChartError("No Data Recorded ⚠");
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
      setMostListenedTrack(response.data.most_listened_track || null);
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  //EXACT PERIOD FUNCTIONS
  const fetchExactBreathingData = async (period, exact_period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_breathing/",
        {
          params: { user_id: id, period: period, exact_period: exact_period },
        }
      );
      const data = response.data.days || {};
      if (period === "daily") {
        setDailyExerciseData(data);
      } else if (period === "weekly") {
        setWeeklyExerciseData(data);
      } else if (period === "monthly") {
        setMonthlyExerciseData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact breathing data:", error);
    }
  };

  const fetchExactListeningData = async (period, exact_period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_listening/",
        {
          params: { user_id: id, period: period, exact_period: exact_period },
        }
      );
      const data = response.data.days || {};
      if (period === "daily") {
        setDailyListeningData(data);
      } else if (period === "weekly") {
        setWeeklyListeningData(data);
      } else if (period === "monthly") {
        setMonthlyListeningData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  };

  const fetchExactEmotionData = async (period, exact_period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_emotions/",
        {
          params: { user_id: id, period: period, exact_period: exact_period },
        }
      );
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);

      if (period === "daily") {
        setDailyListeningData(data);
      } else if (period === "weekly") {
        setWeeklyListeningData(data);
      } else if (period === "monthly") {
        setMonthlyListeningData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  };

  const fetchExactStressData = async (period, exact_period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_stress/",
        {
          params: { user_id: id, period: period, exact_period: exact_period },
        }
      );
      const data = response.data.days || {};
      if (period === "daily") {
        setDailyStressData(data);
      } else if (period === "weekly") {
        setWeeklyStressData(data);
      } else if (period === "monthly") {
        setMonthlyStressData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  };

  const fetchExactFocusData = async (period, exact_period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_focus/",
        {
          params: { user_id: id, period: period, exact_period: exact_period },
        }
      );
      const data = response.data.days || {};
      if (period === "daily") {
        setDailyFocusData(data);
      } else if (period === "weekly") {
        setWeeklyFocusData(data);
      } else if (period === "monthly") {
        setMonthlyFocusData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  };

  useEffect(
    (id) => {
      fetchUserDataWithID(id);
      fetchUserData();
    },
    [id]
  );

  useEffect(() => {
    if (userData.id) {
      fetchEmotionData(emotionView);
      fetchExerciseData(exerciseView);
      fetchListeningData(listeningView);
      fetchStressData(stressView);
      fetchFocusData(focusView);
    }
  }, [
    userData,
    exerciseView,
    listeningView,
    emotionView,
    stressView,
    focusView,
  ]);

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

  const focusViews = ["daily", "weekly", "monthly"];
  const isFocusLeftDisabled = focusView === "daily";
  const isFocusRightDisabled = focusView === "monthly";

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

        pdf.setFont("helvetica");
        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 255);

        pdf
          .text(
            `Employee ${userData.first_name} ${userData.last_name} Report`,
            10,
            10
          )
          .setTextColor(0, 0, 0);
        pdf.text(`Generated on: ${timestamp}`, 10, 15);
        pdf.text(
          `Generated By: ${userRole} - ${componenetUserData.first_name} ${componenetUserData.last_name}`,
          10,
          20
        );

        pdf.save(`team_${userData.team}_report_${timestamp}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  useEffect(() => {
    if (userData.id) {
      fetchFocusData(focusView);
    }
  }, [userData, focusView]);

  const handlePeriodChange = (period) => {
    setEmotionView(period);
    setStressView(period);
    setExerciseView(period);
    setListeningView(period);
    setFocusView(period);
    setPeriodForExact(period);

    fetchEmotionData(period);
    fetchStressData(period);
    fetchExerciseData(period);
    fetchListeningData(period);
    fetchFocusData(period);

    if (period === "daily") {
      setCalType("date");
      setSelectedDate(new Date());
    } else if (period === "weekly") {
      setCalType("week");
    } else if (period === "monthly") {
      setCalType("month");
    }
  };

  const handleDateChange = (date) => {
    const exact_period = date.target.value;
    setSelectedDate(new Date(exact_period));
    fetchExactBreathingData(periodForExact, exact_period);
    fetchExactListeningData(periodForExact, exact_period);
    fetchExactEmotionData(periodForExact, exact_period);
    fetchExactFocusData(periodForExact, exact_period);
    fetchExactStressData(periodForExact, exact_period);
  };

  const [isEmotionOverlayOpen, setIsOverlayOpen] = useState(false);

  const openEmotionOverlay = () => {
    setIsOverlayOpen(true);
  };

  const closeEmotionOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className={`min-h-screen ${Color.background} `}>
      <div className="container  mx-auto py-2 px-4 md:px-20 lg:px-12 xl:px-48">
        {/*Period Selection Buttons */}

        <div className={` ${Color.outSideCard} rounded-xl px-6 py-6`}>
          <div className="flex justify-between">
            {/*Date Picker Componenet*/}
            <div>
              {["daily", "weekly", "monthly"].map((period) => (
                <button
                  key={period}
                  className={`mx-2 px-4 py-2 rounded ${
                    emotionView === period
                      ? BtnColor.dashBoardBtnSelected
                      : BtnColor.dashBoardBtnIdel
                  } `}
                  onClick={() => handlePeriodChange(period)}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
              <div className="flex items-center">
                <FaCalendarAlt size={24} className="mr-2 cursor-pointer" />

                <input
                  type={calType}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showPopperArrow={false}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/*Report Download Componenet*/}
            <div>
              {(userRole === "Admin" || userRole === "Supervisor") && (
                <button
                  className={`bg-sky-500  px-4 py-2 rounded-md mb-5 flex ${BtnColor.primary}`}
                  onClick={downloadPDF}
                  title="in PDF format"
                >
                  <LuFileDown /> Download Report
                </button>
              )}
            </div>

            <div>
              {(userRole === "Admin" || userRole === "Supervisor") && (
                <button
                  className={`bg-sky-500  px-4 py-2 rounded-md mb-5 flex ${BtnColor.primary}`}
                  onClick={downloadPDF}
                  title="in PDF format"
                >
                  <LuFileDown /> Download Report
                </button>
              )}
            </div>
          </div>

          <div
            className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-2 gap-0 justify-center"
            id="report-content"
          >
            {/* PIE CHART */}
            <div className={`rounded-lg  ${Color.chartsBGText} m-4 p-6`}>
              <div className="text-center flex-auto">
                <h5 className="text-2xl font-semibold  mb-5">
                  {emotionView === "daily"
                    ? "Daily Emotions"
                    : emotionView === "weekly"
                    ? "Weekly Emotions"
                    : emotionView === "monthly"
                    ? "Monthly Emotions"
                    : "Overall Emotions"}
                </h5>

                <div className="flex align-super">
                  <button onClick={openEmotionOverlay}>
                    <FaArrowRightArrowLeft size={20} />
                  </button>
                </div>

                {emotionChartError ? (
                  <h2 className="text-xl  mt-4">{emotionChartError}</h2>
                ) : (
                  <div>
                    <div className="flex items-center justify-center">
                      <DoughnutChart {...emotions} />

                      <div className="mb-24" id="highestEmotion">
                        <img
                          className=""
                          // src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                          src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                          alt={highestEmotion.key}
                          title={`Highest emotion is: ${highestEmotion.key}`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stress Data */}
            <div className={`${Color.chartsBGText} rounded-lg  m-4 p-6`}>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {stressView === "daily"
                    ? "Daily Stress Levels"
                    : stressView === "weekly"
                    ? "Weekly Stress Levels"
                    : "Monthly Stress Levels"}
                </h5>
                <button className=" hover:text-sky-600">
                  <FaArrowRightArrowLeft size={20} />
                </button>

                {stressChartError ? (
                  <h2 className="text-xl  mt-4">{stressChartError}</h2>
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
                <div className="mt-6">
                  Use the filteration button on top to filter this result more.
                  You can hover to view more details.
                </div>
              </div>
            </div>

            {/* Focus Data */}
            <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {focusView === "daily"
                    ? "Daily Focus Data"
                    : focusView === "weekly"
                    ? "Weekly Focus Data"
                    : "Monthly Focus Data"}
                </h5>
                <button className=" hover:text-sky-600">
                  <FaArrowRightArrowLeft size={20} />
                </button>
                {focusChartError ? (
                  <h2 className="text-xl  mt-4">{listeningChartError}</h2>
                ) : (
                  <TwoValueBarChart
                    data={
                      {
                        daily: dailyFocusData,
                        weekly: weeklyFocusData,
                        monthly: monthlyFocusData,
                      }[focusView]
                    }
                    period={focusView}
                  />
                )}
              </div>
            </div>

            {/* Exercise Data */}
            <div className={` ${Color.chartsBGText}  rounded-lg  m-4 p-6`}>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {exerciseView === "daily"
                    ? "Daily Breathing Exercise Usage"
                    : exerciseView === "weekly"
                    ? "Weekly Breathing Exercise Usage"
                    : "Monthly Breathing Exercise Usage"}
                </h5>
                <button className=" hover:text-sky-600">
                  <FaArrowRightArrowLeft size={20} />
                </button>
                {breathingChartError ? (
                  <h2 className="text-xl  mt-4">{breathingChartError}</h2>
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

                {mostUsedExercise && (
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold  mb-2">
                      {userData.first_name}'s Most Used Exercise:
                    </h5>
                    <p className="">{mostUsedExercise.exercise_name}</p>
                    <p className="">
                      Total Duration:{" "}
                      {(mostUsedExercise.total_duration / 60.0).toFixed(2)}{" "}
                      minutes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Listening Data */}
            <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {listeningView === "daily"
                    ? "Daily Track Listening Usage"
                    : listeningView === "weekly"
                    ? "Weekly Track Listening Usage"
                    : "Monthly Track Listening Usage"}
                </h5>
                <button className=" hover:text-sky-600">
                  <FaArrowRightArrowLeft size={20} />
                </button>
                {listeningChartError ? (
                  <h2 className="text-xl  mt-4">{listeningChartError}</h2>
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

                {mostListenedTrack && (
                  <div className="mt-4">
                    <h5 className="text-lg font-semibold mb-2">
                      {userData.first_name}'s Most Listened Track:
                    </h5>
                    <p className="">{mostListenedTrack.track_name}</p>
                    <p className="">
                      Total Duration:{" "}
                      {(mostListenedTrack.total_duration / 60).toFixed(2)}{" "}
                      minutes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Emotion based on Hours */}
          <div className={` ${Color.chartsBGText}  rounded-lg mx-4 p-6`}>
            <h5 className="text-xl font-semibold">
              {userData.first_name}'s Dominant Emotion by Hour
            </h5>
            <div className="flex flex-wrap justify-center gap-10 mt-4 w-full">
              {Object.keys(hourlyEmotion).map((hour, index) => (
                <div key={index} className="text-center">
                  {hourlyEmotion[hour] ? (
                    <div>
                      <img
                        className="w-10"
                        src={`http://127.0.0.1:8000/media/emojis/${hourlyEmotion[hour]}.png`}
                        alt={hourlyEmotion[hour]}
                        title={hourlyEmotion[hour]}
                      />
                    </div>
                  ) : (
                    <span className="text-xl"> - </span>
                  )}
                  <p className="text-sm">{hour.split(" ")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div></div>
      </div>

      {isEmotionOverlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <EmotionCompare id={userData.id} period={periodForExact}/>
          <button onClick={closeEmotionOverlay}>Close</button>
        </div>
      )}
    </div>
  );
};

export default EmployeeComponent;
