import React, { useEffect, useState } from "react";
import DoughnutChart from "../charts/DoughnutChart";
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

const EmotionCompare = ({ id, name, userRole, team, period }) => {
  const [emotionsA, setEmotionsA] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });

  const [emotionsB, setEmotionsB] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });

  const [hourlyEmotionA, setHourlyEmotionA] = useState({});
  const [hourlyEmotionB, setHourlyEmotionB] = useState({});

  const [highestEmotion, setHighestEmotion] = useState({ key: "", value: 0 });
  const [selectedDateA, setSelectedDateA] = useState(new Date());
  const [selectedDateB, setSelectedDateB] = useState(new Date());

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
      fetchEmotionData(
        property,
        parameter,
        period,
        defaultDateA,
        setEmotionsA,
        setHourlyEmotionA
      );
      fetchEmotionData(
        property,
        parameter,
        period,
        defaultDateB,
        setEmotionsB,
        setHourlyEmotionB
      );
    }
  }, [period, property, parameter]);

  const fetchEmotionData = async (
    property,
    parameter,
    period,
    exact_period,
    setEmotions,
    setHourlyEmotion
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_emotions/",
        {
          params: {
            [property]: parameter,
            period: period,
            exact_period: exact_period,
          },
        }
      );
      setEmotions(response.data.defaultEmotionValues);
      setHourlyEmotion(response.data.hourlyDominantEmotions);
    } catch (error) {
      setChartErrorA(<RetrieveError type="Emotion" />);
    }
  };

  useEffect(() => {
    if (emotionsA) {
      const allZeroA = Object.values(emotionsA).every((value) => value === 0);
      if (allZeroA) {
        setChartErrorA(<NoData type="Emotion" />);
      } else {
        setChartErrorA(null);
      }
    }
  }, [emotionsA]);

  useEffect(() => {
    if (emotionsB) {
      const allZeroB = Object.values(emotionsB).every((value) => value === 0);
      if (allZeroB) {
        setChartErrorB(<NoData type="Emotion" />);
      } else {
        setChartErrorB(null);
      }
    }
  }, [emotionsB]);

  const handleDateChangeA = (date) => {
    const exact_period = date.target.value;
    setSelectedDateA(exact_period);
    fetchEmotionData(
      property,
      parameter,
      period,
      exact_period,
      setEmotionsA,
      setHourlyEmotionA
    );
  };

  const handleDateChangeB = (date) => {
    const exact_period = date.target.value;
    setSelectedDateB(exact_period);
    fetchEmotionData(
      property,
      parameter,
      period,
      exact_period,
      setEmotionsB,
      setHourlyEmotionB
    );
  };

  const generateReport = () => {
    downloadPDF({
      componenetName: "Emotion Compare",
      team: team,
      name: name,
      userRole: userRole,
      orientation: "l",
    });
  };

  return (
    <div className={`${Color.background} rounded-lg flex flex-col justify-between min-h-full p-4`}>
    <div className="flex-grow">
      <div
        id="Emotion Compare report-content"
        className="flex flex-row rounded-lg m-4 p-6"
      >
        <div className={`${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6 flex flex-col`}>
          <div className="flex justify-center mb-4">
            <h2>Emotion Data on:</h2>
            <input
              type={calType}
              value={selectedDateA}
              onChange={handleDateChangeA}
              className="cursor-pointer border p-1 rounded ml-2"
            />
          </div>
          {chartErrorA ? (
            <h2 className="text-xl mt-4">{chartErrorA}</h2>
          ) : (
            <div className="flex justify-center items-center">
              <div className="max-w-[350px] max-h-[350px] p-5">
                <DoughnutChart {...emotionsA} />
              </div>
            </div>
          )}
        </div>

        <div className={`${Color.chartsBGText} ${PrimColor.card} rounded-lg m-4 p-6 flex flex-col`}>
          <div className="flex justify-center mb-4">
            <h2>Emotion Data on:</h2>
            <input
              type={calType}
              value={selectedDateB}
              onChange={handleDateChangeB}
              className="cursor-pointer border p-1 rounded ml-2"
            />
          </div>
          {chartErrorB ? (
            <h2 className="text-xl mt-4">{chartErrorB}</h2>
          ) : (
            <div className="flex justify-center items-center">
              <div className="max-w-[350px] max-h-[350px] p-5">
                <DoughnutChart {...emotionsB} />
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

export default EmotionCompare;