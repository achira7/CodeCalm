import React, { useEffect, useState } from "react";
import axios from "axios";
import DoughnutChart from "../charts/DoughnutChart";
import LineChart from "../charts/LineChart";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const pfp = "http://127.0.0.1:8000/media/profilePictures/default.jpg";

export const TeamDashboard = () => {
  const [teamEmotions, setTeamEmotions] = useState({
    angry: 0,
    disgust: 0,
    fear: 0,
    happy: 0,
    sad: 0,
    surprise: 0,
    neutral: 0,
  });
  const [chartError, setChartError] = useState(null);
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

  const fetchTeamEmotionData = async (teamId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/getteamemotions/",
        {
          params: { team_id: teamId, period: period },
        }
      );
      const data = response.data.defaultEmotionValues;
      setTeamEmotions(data);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setChartError("No Data Recorded ⚠");
      } else {
        setChartError(null);
      }
      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      setHighestEmotion({ key: maxKey, value: maxValue });
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartError("An error occurred!");
    }
  };

  const fetchTeamExerciseData = async (teamId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/team_breathing_exercise_usage/",
        {
          params: { team_id: teamId, period: period },
        }
      );
      const data = response.data;
      if (period === "daily") {
        setDailyExerciseData(data.days);
      } else if (period === "weekly") {
        setWeeklyExerciseData(data.days);
      } else if (period === "monthly") {
        setMonthlyExerciseData(data.days);
      }
      setMostUsedExercise(data.most_used_exercise);
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartError("An error occurred!");
    }
  };

  const fetchTeamListeningData = async (teamId, period) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/team_track_listening/",
        {
          params: { team_id: teamId, period: period },
        }
      );
      const data = response.data;
      if (period === "daily") {
        setDailyListeningData(data.days);
      } else if (period === "weekly") {
        setWeeklyListeningData(data.days);
      } else if (period === "monthly") {
        setMonthlyListeningData(data.days);
      }
      setMostListenedTrack(data.most_listened_track);
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartError("An error occurred!");
    }
  };

  useEffect(() => {
    const teamId = "YOUR_TEAM_ID"; // replace with actual team ID
    fetchTeamEmotionData(teamId, emotionView);
    fetchTeamExerciseData(teamId, exerciseView);
    fetchTeamListeningData(teamId, listeningView);
  }, [emotionView, exerciseView, listeningView]);

  return (
    <div className="dashboard">
      <div>TeamDashboard</div>
    <div>
        <a href='/supervisor/team_individual_view'> Detailed View of Team</a>
    </div>
      <header>
        <h1>Team Dashboard</h1>
      </header>
      <div className="team-emotions">
        <h2>Team Emotions</h2>
        {chartError ? (
          <p>{chartError}</p>
        ) : (
          <DoughnutChart data={teamEmotions} />
        )}
        <div>
          <FaArrowLeft
            onClick={() =>
              setEmotionView((prev) =>
                prev === "daily"
                  ? "monthly"
                  : prev === "monthly"
                  ? "weekly"
                  : "daily"
              )
            }
          />
          <span>{emotionView}</span>
          <FaArrowRight
            onClick={() =>
              setEmotionView((prev) =>
                prev === "daily"
                  ? "weekly"
                  : prev === "weekly"
                  ? "monthly"
                  : "daily"
              )
            }
          />
        </div>
        <p>
          Most experienced emotion: {highestEmotion.key} (
          {highestEmotion.value})
        </p>
      </div>

      <div className="team-breathing">
        <h2>Team Breathing Exercise Usage</h2>
        {exerciseView === "daily" && <LineChart data={dailyExerciseData} />}
        {exerciseView === "weekly" && <LineChart data={weeklyExerciseData} />}
        {exerciseView === "monthly" && <LineChart data={monthlyExerciseData} />}
        <div>
          <FaArrowLeft
            onClick={() =>
              setExerciseView((prev) =>
                prev === "daily"
                  ? "monthly"
                  : prev === "monthly"
                  ? "weekly"
                  : "daily"
              )
            }
          />
          <span>{exerciseView}</span>
          <FaArrowRight
            onClick={() =>
              setExerciseView((prev) =>
                prev === "daily"
                  ? "weekly"
                  : prev === "weekly"
                  ? "monthly"
                  : "daily"
              )
            }
          />
        </div>
        <p>
          Most used exercise: {mostUsedExercise?.exercise_name} (
          {mostUsedExercise?.total_duration} seconds)
        </p>
      </div>

      <div className="team-listening">
        <h2>Team Track Listening</h2>
        {listeningView === "daily" && <LineChart data={dailyListeningData} />}
        {listeningView === "weekly" && <LineChart data={weeklyListeningData} />}
        {listeningView === "monthly" && (
          <LineChart data={monthlyListeningData} />
        )}
        <div>
          <FaArrowLeft
            onClick={() =>
              setListeningView((prev) =>
                prev === "daily"
                  ? "monthly"
                  : prev === "monthly"
                  ? "weekly"
                  : "daily"
              )
            }
          />
          <span>{listeningView}</span>
          <FaArrowRight
            onClick={() =>
              setListeningView((prev) =>
                prev === "daily"
                  ? "weekly"
                  : prev === "weekly"
                  ? "monthly"
                  : "daily"
              )
            }
          />
        </div>
        <p>
          Most listened track: {mostListenedTrack?.track_name} (
          {mostListenedTrack?.total_duration} seconds)
        </p>
      </div>
    </div>
  );
};

export default TeamDashboard;
