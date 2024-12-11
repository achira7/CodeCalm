import React, { useEffect, useState } from "react";
import BarChart from "../charts/BarChart";
import axios from "axios";
import moment from "moment";

import { Color } from "../../theme/Colors";
import { PrimColor } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import { NoData } from "../../theme/ChartError";
import { RetrieveError } from "../../theme/ChartError";
import { downloadPDF } from "../DownloadReport";
import { ReportButton } from "../../theme/ButtonTheme";

import { IoMdDownload } from "react-icons/io";

const StressCompare = ({ id, name, userRole, team, period }) => {
  const [stressA, setStressA] = useState("");
  const [stressB, setStressB] = useState("");

  const [selectedDateA, setSelectedDateA] = useState(new Date());
  const [selectedDateB, setSelectedDateB] = useState(new Date());
  const [stressView, setStressView] = useState("daily");

  const [calType, setCalType] = useState("date");
  const [chartErrorA, setChartErrorA] = useState(null);
  const [chartErrorB, setChartErrorB] = useState(null);

  const [property, setProperty] = useState("");
  const [parameter, setParameter] = useState("");

  useEffect(() => {
    if (id) {
      setProperty("user_id");
      setParameter(id);
    } else if (team) {
      setProperty("team_id");
      setParameter(team);
    }
  }, [id, team]);

  useEffect(() => {
    const today = moment();
    let defaultDateA, defaultDateB;

    if (period === "weekly") {
      setCalType("week");
      defaultDateA = today.startOf("week").format("YYYY-[W]WW");
      defaultDateB = today
        .subtract(1, "week")
        .startOf("week")
        .format("YYYY-[W]WW");
    } else if (period === "monthly") {
      setCalType("month");
      defaultDateA = today.startOf("month").format("YYYY-MM");
      defaultDateB = today
        .subtract(1, "month")
        .startOf("month")
        .format("YYYY-MM");
    } else if (period === "daily") {
      setCalType("date");
      defaultDateA = today.startOf("day").format("YYYY-MM-DD");
      defaultDateB = today
        .subtract(1, "day")
        .startOf("day")
        .format("YYYY-MM-DD");
    }

    setSelectedDateA(defaultDateA);
    setSelectedDateB(defaultDateB);

    if (property && parameter) {
      fetchData(property, parameter, period, defaultDateA, setStressA);
      fetchData(property, parameter, period, defaultDateB, setStressB);
    }
  }, [period, property, parameter]);

  const fetchData = async (
    property,
    parameter,
    period,
    exact_period,
    setStress
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_stress/",
        {
          params: {
            [property]: parameter,
            period: period,
            exact_period: exact_period,
          },
        }
      );
      setStress(response.data.days);
    } catch (error) {
      setChartErrorA(<RetrieveError type="Stress" />);
    }
  };

  useEffect(() => {
    if (stressA) {
      const allZeroA = Object.values(stressA).every((value) => value === 0);
      if (allZeroA) {
        setChartErrorA(<NoData type="Stress" />);
      } else {
        setChartErrorA(null);
      }
    }
  }, [stressA]);

  useEffect(() => {
    if (stressB) {
      const allZeroB = Object.values(stressB).every((value) => value === 0);
      if (allZeroB) {
        setChartErrorB(<NoData type="Stress" />);
      } else {
        setChartErrorB(null);
      }
    }
  }, [stressB]);

  const handleDateChangeA = (date) => {
    const exact_period = date.target.value;
    setSelectedDateA(exact_period);
    fetchData(property, parameter, period, exact_period, setStressA);
  };

  const handleDateChangeB = (date) => {
    const exact_period = date.target.value;
    setSelectedDateB(exact_period);
    fetchData(property, parameter, period, exact_period, setStressB);
  }

    const generateReport = () => {
      downloadPDF({
        componenetName: "Stress Compare",
        team: team,
        name: name,
        userRole: userRole,
        orientation: "l",
      });
  };

  return (
    <div className={`${Color.background} rounded-lg `}>
      <div
        id="Stress Compare report-content"
        className=" flex flex-row rounded-lg m-4 p-6"
      >
          <div
            className={` ${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6`}
          >
            <div className="flex justify-center">
              <h2> Stress Data on: </h2>
              <input
                type={calType}
                value={selectedDateA}
                onChange={handleDateChangeA}
                className="cursor-pointer"
              />
            </div>
            {chartErrorA ? (
              <h2 className="text-xl  mt-4">{chartErrorA}</h2>
            ) : (
              <div className=" flex justify-center items-center">
                <div className="max-w-[350px] max-h-[350px] p-5">
                  <BarChart
                    data={
                      {
                        daily: stressA,
                        weekly: stressA,
                        monthly: stressA,
                      }[stressView]
                    }
                    period={period}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Exact Stress Data */}
          <div
            className={` ${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6 `}
          >
            <div className="flex justify-center  flex-col">
              <div className="flex flex-row justify-center">
                <h2>Stress Data on:</h2>
                <input
                  type={calType}
                  value={selectedDateB}
                  onChange={handleDateChangeB}
                  className="cursor-pointer border p-1 rounded"
                />
              </div>
              {chartErrorB ? (
                <h2 className="text-xl mt-4">{chartErrorB}</h2>
              ) : (
                <div>
                  <div className="flex flex-cols lg:flex-row">
                    <div className="max-w-[350px] max-h-[350px] p-5">
                      <BarChart
                        data={
                          {
                            daily: stressB,
                            weekly: stressB,
                            monthly: stressB,
                          }[stressView]
                        }
                        period={period}
                      />
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
        </div>
      <div className="flex justify-center mt-4">
      {(userRole === "Admin" || userRole === "Supervisor") && (
        <button
          className={`flex items-center px-4 py-2 rounded-md ${ReportButton.base} ${ReportButton.hover} mb-4`}
          onClick={generateReport}
          title="in PDF format"
        >
          <IoMdDownload className="mr-2" /> Generate Report
        </button>
      )}
      </div>
    </div>
  );
}

export default StressCompare;
