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
import { IoClose, IoHelpCircleOutline } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";

import "../index.css";
import { useParams } from "react-router-dom";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { Color } from "../theme/Colors";
import { BtnColor, BtnClose, ReportButton } from "../theme/ButtonTheme";
import { CompareIconColor } from "../theme/ButtonTheme";
import { DateSelector } from "../theme/ButtonTheme";
import { NoData } from "../theme/ChartError";
import { RetrieveError } from "../theme/ChartError";
import { PrimColor } from "../theme/Colors";

import EmotionCompare from "./compare/EmotionCompare";
import FocusCompare from "./compare/FocusCompare";
import BreathingCompare from "./compare/BreathingCompare";
import ListeningCompare from "./compare/ListeningCompare";
import StressCompare from "./compare/StressCompare";

import EmployeeInfo from "./EmployeeInfo";

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
      } else {
        setUserRole("Employee");
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
        },
      });
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setEmotionChartError(<NoData type="Emotion" />);
      } else {
        setEmotionChartError(null);
      }
      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      setHighestEmotion({ key: maxKey, value: maxValue });
    } catch (error) {
      setEmotionChartError(<RetrieveError type="Emotion" />);
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
        setStressChartError(<NoData type="Stress" />);
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
      setEmotionChartError(<RetrieveError type="Stress" />);
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
        setFocusChartError(<NoData type="Focus" />);
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
    } catch (error) {
      setEmotionChartError(<RetrieveError type="Focus" />);
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
        setBreathingChartError(<NoData type="Breathing Exercise" />);
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
      setEmotionChartError(<RetrieveError type="Breathing Exercise" />);
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
        setListeningChartError(<NoData type="Audio Threapy" />);
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
      //setEmotionChartError(<RetrieveError type="Audio Therapy" />);
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

  const [isEmotionOverlayOpen, setIsEmotionOverlayOpen] = useState(false);
  const [isStressOverlayOpen, setIsStressOverlayOpen] = useState(false);
  const [isFocusOverlayOpen, setIsFocusOverlayOpen] = useState(false);
  const [isBreathingOverlayOpen, setIsBreathingOverlayOpen] = useState(false);
  const [isListeningOverlayOpen, setIsListeningOverlayOpen] = useState(false);

  const openEmotionOverlay = () => {
    setIsEmotionOverlayOpen(true);
  };

  const closeEmotionOverlay = () => {
    setIsEmotionOverlayOpen(false);
  };

  const openStressOverlay = () => {
    setIsStressOverlayOpen(true);
  };

  const closeStressOverlay = () => {
    setIsStressOverlayOpen(false);
  };

  const openFocusOverlay = () => {
    setIsFocusOverlayOpen(true);
  };

  const closeFocusOverlay = () => {
    setIsFocusOverlayOpen(false);
  };

  const openBreathingOverlay = () => {
    setIsBreathingOverlayOpen(true);
  };

  const closeBreathingOverlay = () => {
    setIsBreathingOverlayOpen(false);
  };

  const openListeningOverlay = () => {
    setIsListeningOverlayOpen(true);
  };

  const closeListeningOverlay = () => {
    setIsListeningOverlayOpen(false);
  };

  const generateReport = () => {
    downloadPDF({
      componenetName: `Employee Overview ${team}`,
      team: team,
      name: name,
      userRole: role,
      orientation: "",
    });
  };

  return (
    <div className={`min-h-screen ${Color.background}`}>
      <div id="Employee Overview report-content">
        <EmployeeInfo
          name={`${userData.first_name} ${userData.last_name}`}
          team={userData.team}
          accountType={role}
          picture={userData.profile_picture}
        />

        <div className="container mx-auto py-2 px-4 md:px-20 lg:px-12 xl:px-48">
          {/*Period Selection Buttons */}

          <div className={` ${Color.outSideCard} rounded-xl px-6 py-6`}>
            <div>
              {/* Date Picker Component */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {["daily", "weekly", "monthly"].map((period) => (
                    <button
                      key={period}
                      className={`mx-2 px-4 py-2 rounded-lg ${
                        emotionView === period
                          ? BtnColor.dashBoardBtnSelected
                          : BtnColor.dashBoardBtnIdel
                      } `}
                      onClick={() => handlePeriodChange(period)}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                  <input
                    type={calType}
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className="cursor-pointer text-lg rounded-lg py-1 px-3 text-white bg-emerald-500 ml-2"
                    style={{ caretColor: "transparent" }}
                  />
                </div>
                <div>
                  {(userRole === "Admin" || userRole === "Supervisor") && (
                    <button
                      className={`flex items-center px-4 py-2 rounded-md ${ReportButton.base} ${ReportButton.hover}`}
                      onClick={generateReport}
                      title="in PDF format"
                    >
                      <IoMdDownload className="mr-2" /> Generate Report
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div
              className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-2 gap-0 justify-center"
              id="report-content"
            >
              {/* Emotions */}
              <div className={`rounded-lg  ${Color.chartsBGText} m-4 p-6`}>
                <div className="text-center flex-auto">
                  <IoHelpCircleOutline size={25} />
                  <h5 className="text-2xl font-semibold  mb-5">
                    {emotionView === "daily"
                      ? "Daily Emotions"
                      : emotionView === "weekly"
                      ? "Weekly Emotions"
                      : emotionView === "monthly"
                      ? "Monthly Emotions"
                      : "Overall Emotions"}
                  </h5>

                  <div>
                    <button
                      onClick={openEmotionOverlay}
                      className={`${CompareIconColor.base} ${CompareIconColor.hover} ${CompareIconColor.rotate}`}
                      title="Compare Emotion Data"
                    >
                      <FaArrowRightArrowLeft size={20} />
                    </button>
                  </div>

                  {emotionChartError ? (
                    <h2 className="text-xl  mt-4">{emotionChartError}</h2>
                  ) : (
                    <div>
                      <div className="flex items-center justify-center">
                        <DoughnutChart {...emotions} />
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
                  <div>
                    <button
                      onClick={openStressOverlay}
                      className={`${CompareIconColor.base} ${CompareIconColor.hover} ${CompareIconColor.rotate}`}
                      title="Compare Emotion Data"
                    >
                      <FaArrowRightArrowLeft size={20} />
                    </button>
                  </div>

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
                    Use the filteration button on top to filter this result
                    more. You can hover to view more details.
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
                  <div>
                    <button
                      onClick={openFocusOverlay}
                      className={`${CompareIconColor.base} ${CompareIconColor.hover} ${CompareIconColor.rotate}`}
                      title="Compare Focus Data"
                    >
                      <FaArrowRightArrowLeft size={20} />
                    </button>
                  </div>
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
                  <div>
                    <button
                      onClick={openBreathingOverlay}
                      className={`${CompareIconColor.base} ${CompareIconColor.hover} ${CompareIconColor.rotate}`}
                      title="Compare Breathing Exercise Usage"
                    >
                      <FaArrowRightArrowLeft size={20} />
                    </button>
                  </div>
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
                  <div>
                    <button
                      onClick={openListeningOverlay}
                      className={`${CompareIconColor.base} ${CompareIconColor.hover} ${CompareIconColor.rotate}`}
                      title="Compare Audio Therapy Usage"
                    >
                      <FaArrowRightArrowLeft size={20} />
                    </button>
                  </div>
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
            <div className="relative bg-white rounded-md shadow-lg">
              <button
                onClick={closeEmotionOverlay}
                className={` text-black absolute top-5 right-5 ${BtnClose.base} ${BtnClose.hover}`}
              >
                <IoClose size={25} />
              </button>
              <div className="flex justify-center items-center">
                <EmotionCompare
                  id={userData.id}
                  period={periodForExact}
                  name={userData.first_name + userData.last_name}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}

        {isStressOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-md shadow-lg">
              <button
                onClick={closeStressOverlay}
                className={` text-black absolute top-5 right-5 ${BtnClose.base} ${BtnClose.hover}`}
              >
                <IoClose size={25} />
              </button>

              <div className="flex justify-center items-center">
                <StressCompare
                  id={userData.id}
                  period={periodForExact}
                  name={userData.first_name + userData.last_name}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}

        {isFocusOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-md shadow-lg">
              <button
                onClick={closeFocusOverlay}
                className={` text-black absolute top-5 right-5 ${BtnClose.base} ${BtnClose.hover}`}
              >
                <IoClose size={25} />
              </button>
              <div>
                <FocusCompare
                  id={userData.id}
                  period={periodForExact}
                  name={userData.first_name + userData.last_name}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}

        {isBreathingOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-md shadow-lg">
              <button
                onClick={closeBreathingOverlay}
                className={` text-black absolute top-5 right-5 ${BtnClose.base} ${BtnClose.hover}`}
              >
                <IoClose size={25} />
              </button>
              <div>
                <BreathingCompare
                  id={userData.id}
                  period={periodForExact}
                  name={userData.first_name + userData.last_name}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}

        {isListeningOverlayOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-md shadow-lg">
              <button
                onClick={closeListeningOverlay}
                className={` text-black absolute top-5 right-5 ${BtnClose.base} ${BtnClose.hover}`}
              >
                <IoClose />
              </button>
              <div>
                <ListeningCompare
                  id={userData.id}
                  period={periodForExact}
                  name={userData.first_name + userData.last_name}
                  userRole={userRole}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeComponent;
