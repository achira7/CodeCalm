import React, { useEffect, useState } from "react";
import axios from "axios";
import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import LineChart from "../charts/LineChart";

const BreathingCompare = ({ id, period }) => {
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

  const [breathingData, setBreathingData] = useState("")
  const [exactBreathingData, setExactBreathingData] = useState("")

  useEffect(() => {
    if (period === "weekly") {
      setCalType("week");
    } else if (period === "monthly") {
      setCalType("month");
    } else {
      setCalType("date");
    }
  }, [period]);

  useEffect(() => {
    fetchBreathingData(period);
    fetchUserDataWithID(id)
  }, [id, period]);

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
        setExactBreathingData(data);
      } else if (period === "weekly") {
        setExactBreathingData(data);
      } else if (period === "monthly") {
        setExactBreathingData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact breathing data:", error);
    }
  };

  const fetchBreathingData = async (period) => {
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
        setBreathingData(data);
      } else if (period === "monthly") {
        setBreathingData(data);
      } else if (period === "daily") {
        setBreathingData(data);
      }
      setMostUsedExercise(response.data.most_used_exercise || null);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };


  const handleDateChange = (date) => {
    const exact_period = date.target.value;
    setSelectedDate(new Date(exact_period));
    fetchExactBreathingData(period, exact_period);
  };


  return (
    <div>

<div className={` ${Color.chartsBGText}  rounded-lg  m-4 p-6`}>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {exerciseView === "daily"
                    ? "Daily Breathing Exercise Usage"
                    : exerciseView === "weekly"
                    ? "Weekly Breathing Exercise Usage"
                    : "Monthly Breathing Exercise Usage"}
                </h5>
          
                {breathingChartError ? (
                  <h2 className="text-xl  mt-4">{breathingChartError}</h2>
                ) : (
                  <LineChart
                    data={
                      {
                        daily: breathingData,
                        weekly: breathingData,
                        monthly: breathingData,
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

            {/**Exact Data */}
            <div className={` ${Color.chartsBGText}  rounded-lg  m-4 p-6`}>
              <div className="text-center">
              <input
            type={calType}
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="cursor-pointer"
          />
                <h5 className="text-2xl font-semibold  mb-5">
                  {exerciseView === "daily"
                    ? "Daily Breathing Exercise Usage"
                    : exerciseView === "weekly"
                    ? "Weekly Breathing Exercise Usage"
                    : "Monthly Breathing Exercise Usage"}
                </h5>
        
                {breathingChartError ? (
                  <h2 className="text-xl  mt-4">{breathingChartError}</h2>
                ) : (
                  <LineChart
                    data={
                      {
                        daily: exactBreathingData,
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
    </div>
  )
}

export default BreathingCompare