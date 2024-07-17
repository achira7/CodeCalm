import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
import { NoData } from "../../theme/ChartError";
import { RetrieveError } from "../../theme/ChartError";
import LineChart from "../charts/LineChart";

const BreathingCompare = ({ id, team, period }) => {
  const [breathingA, setBreathingA] = useState("");
  const [breathingB, setBreathingB] = useState("");

  const [mostUsedA, setMostUsedA] = useState(null);
  const [mostUsedB, setMostUsedB] = useState(null);

  const [breathing, setBreathing] = useState("");
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
        setBreathingA,
        setMostUsedA,
      );
      fetchData(
        property,
        parameter,
        period,
        defaultDateB,
        setBreathingB,
        setMostUsedB,
      );
    }
  }, [period, property, parameter]);

  const fetchData = async (
    property,
    parameter,
    period,
    exact_period,
    setBreathing,
    setMostUsed
  ) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/exact_breathing/",
        {
          params: {
            [property]: parameter,
            period: period,
            exact_period: exact_period,
          },
        }
      );
      setBreathing(response.data.days);
      setMostUsed(response.data.most_used_exercise || null);
    } catch (error) {
      setChartErrorA(<RetrieveError type="Audio Threapy" />);
    }
  };

  useEffect(() => {
    if (breathingA) {
      const allZeroA = Object.values(breathingA).every((value) => value === 0);
      if (allZeroA) {
        setChartErrorA(<NoData type="Audio Threapy" />);
      } else {
        setChartErrorA(null);
      }
    }
  }, [breathingA]);

  useEffect(() => {
    if (breathingB) {
      const allZeroB = Object.values(breathingB).every((value) => value === 0);
      if (allZeroB) {
        setChartErrorB(<NoData type="Audio Threapy" />);
      } else {
        setChartErrorB(null);
      }
    }
  }, [breathingB]);

  const handleDateChangeA = (date) => {
    const exact_period = date.target.value;
    setSelectedDateA(exact_period);
    fetchData(
      property,
      parameter,
      period,
      exact_period,
      setBreathingA,
      setMostUsedA,
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
      setBreathingB,
      setMostUsedB,
    );
  };

  return (
    <div className={`${Color.background} rounded-lg m-4 p-6`}>
      <div className="flex flex-cols lg:flex-row rounded-lg m-4 p-6">
        <div className={` ${Color.chartsBGText} rounded-lg m-4 p-6 `}>
          <h2> Stress Data on: </h2>
          <input
            type={calType}
            value={selectedDateA}
            onChange={handleDateChangeA}
            className="cursor-pointer"
          />
          {chartErrorA ? (
            <h2 className="text-xl">{chartErrorA}</h2>
          ) : (
            <LineChart
            
              data={{
                daily: breathingA,
                weekly: breathingA,
                monthly: breathingA,
              }[period]}
            />
          )}

          {mostUsedA && (
            <div className="mt-4">
              <h5 className="text-lg font-semibold mb-2">
                Most Used Exercise:
              </h5>
              <p>{mostUsedA.exercise_name}</p>
              <p>
                Total Duration:{" "}
                {(mostUsedA.total_duration / 60.0).toFixed(2)} minutes
              </p>
            </div>
          )}
        </div>
      </div>

      {/**Exact Data */}
      <div className={`${Color.chartsBGText} rounded-lg  m-4 p-6`}>
        <div className={`flex items-center align-super `}>
          <h2>Stress Data on:</h2>
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
          <LineChart
            data={{
              daily: breathingB,
              weekly: breathingB,
              monthly: breathingB,
            }[period]}
          />
        )}

        {mostUsedB && (
          <div className="mt-4">
            <h5 className="text-lg font-semibold mb-2">
              Most Used Exercise:
            </h5>
            <p>{mostUsedB.exercise_name}</p>
            <p>
              Total Duration:{" "}
              {(mostUsedB.total_duration / 60.0).toFixed(2)} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingCompare;
