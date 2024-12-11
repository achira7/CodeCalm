import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { IoMdDownload } from "react-icons/io";

import { Color, PrimColor } from "../../theme/Colors";
import { BtnColor, ReportButton } from "../../theme/ButtonTheme";
import { NoData } from "../../theme/ChartError";
import { RetrieveError } from "../../theme/ChartError";
import { downloadPDF } from "../DownloadReport";

import LineChart from "../charts/LineChart";


const ListeningCompare = ({ id, name, userRole, team, period }) => {
  const [listeningA, setListeningA] = useState("");
  const [listeningB, setListeningB] = useState("");

  const [mostUsedA, setMostUsedA] = useState(null);
  const [mostUsedB, setMostUsedB] = useState(null);

  const [listening, setListening] = useState("");
  const [mostUsed, setMostUsed] = useState("");

  const [selectedDateA, setSelectedDateA] = useState(new Date());
  const [selectedDateB, setSelectedDateB] = useState(new Date());
  const [stressView, setStressView] = useState("daily");

  const [chartErrorA, setChartErrorA] = useState(null);
  const [chartErrorB, setChartErrorB] = useState(null);

  const [calType, setCalType] = useState("date");
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
      fetchData(
        property,
        parameter,
        period,
        defaultDateA,
        setListeningA,
        setMostUsedA
      );
      fetchData(
        property,
        parameter,
        period,
        defaultDateB,
        setListeningB,
        setMostUsedB
      );
    }
  }, [period, property, parameter]);

  const fetchData = async (
    property,
    parameter,
    period,
    exact_period,
    setListening,
    setMostUsed
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_listening/",
        {
          params: {
            [property]: parameter,
            period: period,
            exact_period: exact_period,
          },
        }
      );
      setListening(response.data.days);
      setMostUsed(response.data.most_listened_track || null);
    } catch (error) {
      setChartErrorA(<RetrieveError type="Audio Threapy" />);
    }
  };

  useEffect(() => {
    if (listeningA) {
      const allZeroA = Object.values(listeningA).every((value) => value === 0);
      if (allZeroA) {
        setChartErrorA(<NoData type="Audio Threapy" />);
      } else {
        setChartErrorA(null);
      }
    }
  }, [listeningA]);

  useEffect(() => {
    if (listeningB) {
      const allZeroB = Object.values(listeningB).every((value) => value === 0);
      if (allZeroB) {
        setChartErrorB(<NoData type="Audio Threapy" />);
      } else {
        setChartErrorB(null);
      }
    }
  }, [listeningB]);

  const handleDateChangeA = (date) => {
    const exact_period = date.target.value;
    setSelectedDateA(exact_period);
    fetchData(
      property,
      parameter,
      period,
      exact_period,
      setListeningA,
      setMostUsedA
    );
  };

  const handleDateChangeB = (date) => {
    const exact_period = date.target.value;
    setSelectedDateB(exact_period);
    fetchData(
      property,
      parameter,
      period,
      exact_period,
      setListeningB,
      setMostUsedB
    );
  };

  const generateReport = () => {
    downloadPDF({
      componenetName: "Audio Therapy Compare",
      team: team,
      name: name,
      userRole: userRole,
      orientation: "l",
    });
  };

  return (
    <div className={`${Color.background} rounded-lg m-4 p-6`}>
      <div
      id="Audio Therapy Compare report-content"
      className=" flex flex-row rounded-lg"
      >
        <div className={`${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6`}>
          <div className="flex justify-center mb-4">
            <h2 className="mr-2"> Audio Threapy usage on: </h2>
            <input
              type={calType}
              value={selectedDateA}
              onChange={handleDateChangeA}
              className="cursor-pointer border p-1 rounded"
            />
             </div>

             <div className="flex justify-center items-center">
            {chartErrorA ? (
              <h2 className="text-xl mt-4">{chartErrorA}</h2>
            ) : (
              <div className="max-w-[350px] max-h-[350px] p-5">
              <LineChart
                data={
                  {
                    daily: listeningA,
                    weekly: listeningA,
                    monthly: listeningA,
                  }[period]
                }
              />
               </div>
            )}
            </div>

            <div className="flex justify-center items-center"> 
            {mostUsedA && (
              <div className="mt-4">
                <h5 className="text-lg font-semibold mb-2">
                  Most Used Exercise:
                </h5>
                <p>{mostUsedA.track_name}</p>
                <p>
                  Total Duration: {(mostUsedA.total_duration / 60.0).toFixed(2)}{" "}
                  minutes
                </p>
              </div>
            )}
          </div>
        </div>

        {/**Exact Data */}
        <div className={`${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6`}>
        <div className="flex justify-center mb-4">
            <h2 className="mr-2">Audio Threapy usage on:</h2>
            <input
              type={calType}
              value={selectedDateB}
              onChange={handleDateChangeB}
              className="cursor-pointer border p-1 rounded"
            />
          </div>

          <div className="flex justify-center items-center">
          {chartErrorB ? (
            <h2 className="text-xl mt-4">{chartErrorB}</h2>
          ) : (
            <div className="max-w-[350px] max-h-[350px] p-5">
            <LineChart
              data={
                {
                  daily: listeningB,
                  weekly: listeningB,
                  monthly: listeningB,
                }[period]
              }
            />
            </div>
          )}
          </div>

          <div className="flex justify-center items-center">
          {mostUsedB && (
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2">
                Most Used Exercise:
              </h5>
              <p>{mostUsedB.track_name}</p>
              <p>
                Total Duration: {(mostUsedB.total_duration / 60.0).toFixed(2)}{" "}
                minutes
              </p>
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

export default ListeningCompare;
