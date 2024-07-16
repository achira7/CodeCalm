import React, { useEffect, useState } from "react";
import axios from "axios";
import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import TwoValueBarChart from "../charts/TwoValueBarChart";

const FocusCompare = ({ id, period }) => {
  const [focusData, setFocusData] = useState("");
  const [exactFocusData, setExactFocusData] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calType, setCalType] = useState("date");
  const [focusView, setFocusView] = useState("daily");
  const [focusChartError, setFocusChartError] = useState(null);

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
    fetchFocusData(period);
  }, [id, period]);

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
        setFocusData(data);
      } else if (period === "monthly") {
        setFocusData(data);
      } else if (period === "daily") {
        setFocusData(data);
      }
      //setFocusedData(data);
    } catch (error) {
      console.error("Error fetching focus data:", error);
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
        setExactFocusData(data);
      } else if (period === "weekly") {
        setExactFocusData(data);
      } else if (period === "monthly") {
        setExactFocusData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  };

  useEffect(() => {
    fetchFocusData(period);
  }, [id, period]);

  const handleDateChange = (date) => {
    const exact_period = date.target.value;
    setSelectedDate(new Date(exact_period));
    fetchExactFocusData(period, exact_period);
  };

  return (
    <div className={`min-h-screen ${Color.background} `}>
      <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
        <div className="text-center">
          <h5 className="text-2xl font-semibold  mb-5">
            {focusView === "daily"
              ? "Daily Focus Data"
              : focusView === "weekly"
              ? "Weekly Focus Data"
              : "Monthly Focus Data"}
          </h5>
          {focusChartError ? (
            <h2 className="text-xl  mt-4">{listeningChartError}</h2>
          ) : (
            <TwoValueBarChart
              data={
                {
                  daily: focusData,
                  weekly: focusData,
                  monthly: focusData,
                }[focusView]
              }
              period={focusView}
            />
          )}
        </div>
      </div>

      {/*Exact Focus*/}
      <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
        <div className="text-center">
          <input
            type={calType}
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="cursor-pointer"
          />
          <h5 className="text-2xl font-semibold  mb-5">
            {focusView === "daily"
              ? "Daily Focus Data"
              : focusView === "weekly"
              ? "Weekly Focus Data"
              : "Monthly Focus Data"}
          </h5>
          {focusChartError ? (
            <h2 className="text-xl  mt-4">{listeningChartError}</h2>
          ) : (
            <TwoValueBarChart
              data={
                {
                  daily: exactFocusData,
                  weekly: exactFocusData,
                  monthly: exactFocusData,
                }[focusView]
              }
              period={focusView}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusCompare;
