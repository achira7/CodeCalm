import React, { useEffect, useState } from "react";
import axios from "axios";
import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import LineChart from "../charts/LineChart";


const ListeningCompare = ({ id, period }) => {
  const [userData, settUserData] = useState({})

  const [listeningView, setListeningView] = useState("daily");
  const [exactListeningData, setExactListeningData] = useState("")
  const [listeningData, setListeningData] = useState("")
  const [listeningChartError, setListeningChartError] = useState(null);
  const [mostListenedTrack, setMostListenedTrack] = useState(null);
  const [calType, setCalType] = useState("date");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [periodForExact, setPeriodForExact] = useState("daily");






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
        setListeningData(data);
      } else if (period === "monthly") {
        setListeningData(data);
      } else if (period === "daily") {
        setListeningData(data);
      }
      setMostListenedTrack(response.data.most_listened_track || null);
    } catch (error) {
      console.error("Error fetching listening data:", error);
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
        setExactListeningData(data);
      } else if (period === "weekly") {
        setExactListeningData(data);
      } else if (period === "monthly") {
        setExactListeningData(data);
      }
      console.log(data);
    } catch (error) {
      console.error("Error fetching exact listening data:", error);
    }
  }

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
    fetchListeningData(period);
  }, [id, period]);

  const handleDateChange = (date) => {
    const exact_period = date.target.value;
    setSelectedDate(new Date(exact_period));
    fetchExactListeningData(periodForExact, exact_period);

  };

  return (
    <div  className={` ${Color.background}`}>
    <div className = "flex flex-cols lg:flex-row">
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
                {listeningChartError ? (
                  <h2 className="text-xl  mt-4">{listeningChartError}</h2>
                ) : (
                  <LineChart
                    data={
                      {
                        daily: listeningData,
                        weekly: listeningData,
                        monthly: listeningData,
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



            {/* Exact Listening Data */}
            <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
            <div className="flex items-center">
                <input
                  type={calType}
                  selected={selectedDate}
                  onChange={handleDateChange}
                  showPopperArrow={false}
                  className="cursor-pointer"
                />
              </div>
              <div className="text-center">
                <h5 className="text-2xl font-semibold  mb-5">
                  {listeningView === "daily"
                    ? "Daily Track Listening Usage"
                    : listeningView === "weekly"
                    ? "Weekly Track Listening Usage"
                    : "Monthly Track Listening Usage"}
                </h5>
                {listeningChartError ? (
                  <h2 className="text-xl  mt-4">{listeningChartError}</h2>
                ) : (
                  <LineChart
                    data={
                      {
                        daily: exactListeningData,
                        weekly: exactListeningData,
                        monthly: exactListeningData,
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
    </div>
  )
}

export default ListeningCompare