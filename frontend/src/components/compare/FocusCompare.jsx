import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { IoMdDownload } from "react-icons/io";
import { Color, PrimColor } from "../../theme/Colors";
import { BtnColor, ReportButton } from "../../theme/ButtonTheme";
import TwoValueBarChart from "../charts/TwoValueBarChart";
import { NoData } from "../../theme/ChartError";
import { RetrieveError } from "../../theme/ChartError";
import { downloadPDF } from "../DownloadReport";

const FocusCompare = ({ id, name, userRole, team, period }) => {
  const [focusA, setFocusA] = useState("");
  const [focusB, setFocusB] = useState("");

  const [selectedDateA, setSelectedDateA] = useState(new Date());
  const [selectedDateB, setSelectedDateB] = useState(new Date());
  const [chartErrorA, setChartErrorA] = useState(null);
  const [chartErrorB, setChartErrorB] = useState(null);
  const [calType, setCalType] = useState("date");
  const [focusView, setFocusView] = useState("daily");
  const [focusChartError, setFocusChartError] = useState(null);

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
      fetchData(property, parameter, period, defaultDateA, setFocusA);
      fetchData(property, parameter, period, defaultDateB, setFocusB);
    }
  }, [period, property, parameter]);

  const fetchData = async (
    property,
    parameter,
    period,
    exact_period,
    setFocus
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_focus/",
        {
          params: {
            [property]: parameter,
            period: period,
            exact_period: exact_period,
          },
        }
      );
      setFocus(response.data.days);
    } catch (error) {
      setChartErrorA(<RetrieveError type="Focus" />);
    }
  };

  useEffect(() => {
    if (focusA) {
      const allZeroA = Object.values(focusA).every((value) => value === 0);
      if (allZeroA) {
        setChartErrorA(<NoData type="Focus" />);
      } else {
        setChartErrorA(null);
      }
    }
  }, [focusA]);

  useEffect(() => {
    if (focusB) {
      const allZeroB = Object.values(focusB).every((value) => value === 0);
      if (allZeroB) {
        setChartErrorB(<NoData type="Focus" />);
      } else {
        setChartErrorB(null);
      }
    }
  }, [focusB]);

  const handleDateChangeA = (date) => {
    const exact_period = date.target.value;
    setSelectedDateA(exact_period);
    fetchData(property, parameter, period, exact_period, setFocusA);
  };

  const handleDateChangeB = (date) => {
    const exact_period = date.target.value;
    setSelectedDateB(exact_period);
    fetchData(property, parameter, period, exact_period, setFocusB);
  };

  const generateReport = () => {
    downloadPDF({
      componenetName: "Focus Compare",
      team: team,
      name: name,
      userRole: userRole,
      orientation: "l",
    });
  };

  return (
    <div className={`${Color.background} rounded-lg`}>
      <div
        id="Focus Compare report-content"
        className=" flex flex-row rounded-lg m-4 p-6"
      >
        <div
          className={` ${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6`}
        >
          <div className="flex justify-center">
            <h2> Focus Data on: </h2>
            <input
              type={calType}
              value={selectedDateA}
              onChange={handleDateChangeA}
              className="cursor-pointer border p-1 rounded"
            />
          </div>
          {chartErrorA ? (
            <h2 className="text-xl  mt-4">{chartErrorA}</h2>
          ) : (
            <div className=" flex justify-center items-center">
              <div className="max-w-[350px] max-h-[350px] p-5">
                <TwoValueBarChart
                  data={
                    {
                      daily: focusA,
                      weekly: focusA,
                      monthly: focusA,
                    }[focusView]
                  }
                  period={period}
                />
              </div>
            </div>
          )}
        </div>
        {/*Exact Focus*/}
        <div
          className={` ${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6 `}
        >
          <div className="flex justify-center  flex-col">
            <div className="flex flex-row justify-center">
              <h2>Focus Data on:</h2>
              <input
                type={calType}
                value={selectedDateB}
                onChange={handleDateChangeB}
                className="cursor-pointer"
              />
            </div>
            {chartErrorB ? (
              <h2 className="text-xl mt-4">{chartErrorB}</h2>
            ) : (
              <div>
                <div className="flex flex-cols lg:flex-row">
                  <div className="max-w-[350px] max-h-[350px] p-5">
                    <TwoValueBarChart
                      data={
                        {
                          daily: focusB,
                          weekly: focusB,
                          monthly: focusB,
                        }[focusView]
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
};

export default FocusCompare;
