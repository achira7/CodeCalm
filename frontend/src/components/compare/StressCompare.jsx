import React, { useEffect, useState } from "react";
import axios from "axios";
import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import BarChart from "../charts/BarChart";

const StressCompare = ({ id, period }) => {
  const [userData, settUserData] = useState({})
  const [stressData, setStressData] = useState("");
  const [exactStressData, setExactStressData] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calType, setCalType] = useState("date");
  const [stressView, setStressView] = useState("daily");
  const [stressChartError, setStressChartError] = useState(null);

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
    fetchStressData(period);
  }, [id, period]);
  
  return (
    <div>
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
                <div className="flex align-super">
                  <button onClick={openStressOverlay}>
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
                  Use the filteration button on top to filter this result more.
                  You can hover to view more details.
                </div>
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
                <div className="flex align-super">
                  <button onClick={openStressOverlay}>
                    <FaArrowRightArrowLeft size={20} />
                  </button>
                </div>

                {stressChartError ? (
                  <h2 className="text-xl  mt-4">{stressChartError}</h2>
                ) : (
                  <BarChart
                    data={
                      {
                        daily: exactStressData,
                        weekly: exactStressData,
                        monthly: exactStressData,
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
    </div>
  )
}

export default StressCompare