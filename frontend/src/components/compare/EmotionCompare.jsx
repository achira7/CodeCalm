import React, { useEffect, useState } from "react";
import DoughnutChart from "../charts/DoughnutChart";
import axios from "axios";
import { Color } from "../../theme/Colors";
import { BtnColor } from "../../theme/ButtonTheme";
const EmotionCompare = ({ id, period }) => {
  console.log(id, period);

  const [emotions, setEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });

  const [exactEmotions, setExactEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });

  const [hourlyEmotion, setHourlyEmotion] = useState({});
  const [exactHourlyEmotion, setExactHourlyEmotion] = useState({});

  const [highestEmotion, setHighestEmotion] = useState({ key: "", value: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calType, setCalType] = useState("date");

  useEffect(() => {
    if (period === "weekly") {
      setCalType("week");
    } else if (period === "monthly") {
      setCalType("month");
    } else {
      setCalType("date");
    }
  }, [period]);

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

      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      setHighestEmotion({ key: maxKey, value: maxValue });
    } catch (error) {
      console.error("Error fetching data:", error);
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
      setExactEmotions(data);
      setExactHourlyEmotion(hourlyEmotion);
    } catch (error) {
      console.error("Error fetching exact emotion data:", error);
    }
  };

  useEffect(() => {
    fetchEmotionData(period);
  }, [id, period]);

  const handleDateChange = (date) => {
    const exact_period = date.target.value;
    setSelectedDate(new Date(exact_period));
    fetchExactEmotionData(period, exact_period);
  };

  return (
    <div className={`${Color.background} rounded-lg m-4 p-6`}>
      <div className="flex flex-cols lg:flex-row rounded-lg m-4 p-6">

      <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
        <h2>Daily Emotions</h2>
        <div className="relative"> {/*`rounded-lg  ${Color.chartsBGText} m-4 p-6`*/}
          <DoughnutChart {...emotions} />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              className="w-16"
              src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
              alt={highestEmotion.key}
              title={`Highest emotion is: ${highestEmotion.key}`}
            />
          </div>
        </div>
        {/*<div className="flex flex-wrap justify-center gap-10 mt-4 w-full">
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
        </div>*/}
      </div>
  
      {/* New wrapper div for side by side layout */}
      <div className={` ${Color.chartsBGText}   rounded-lg m-4 p-6 `}>
        <div className="flex flex-col items-center">
          <h2>Daily Emotions</h2>
          <input
            type={calType}
            value={selectedDate.toISOString().split("T")[0]}
            onChange={handleDateChange}
            className="cursor-pointer"
          />
          <div className="relative"> {/*`rounded-lg  ${Color.chartsBGText} m-4 p-6`*/}
            <DoughnutChart {...exactEmotions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                className="w-16"
                src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                alt={highestEmotion.key}
                title={`Highest emotion is: ${highestEmotion.key}`}
              />
            </div>
          </div>
          {/*<div className="flex flex-wrap justify-center gap-10 mt-4 w-full">
            {Object.keys(exactHourlyEmotion).map((hour, index) => (
              <div key={index} className="text-center">
                {exactHourlyEmotion[hour] ? (
                  <div>
                    <img
                      className="w-10"
                      src={`http://127.0.0.1:8000/media/emojis/${exactHourlyEmotion[hour]}.png`}
                      alt={exactHourlyEmotion[hour]}
                      title={exactHourlyEmotion[hour]}
                    />
                  </div>
                ) : (
                  <span className="text-xl"> - </span>
                )}
                <p className="text-sm">{hour.split(" ")[0]}</p>
              </div>
            ))}
          </div>*/}
        </div>
      </div>
    </div>
    </div>
  );
}
  export default EmotionCompare;