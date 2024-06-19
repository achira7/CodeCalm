import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoughnutChart from "../charts/DoughnutChart";
import LineChart from "../charts/LineChart";

const AllTeamsDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamData, setTeamData] = useState({});
  const [emotions, setEmotions] = useState({});
  const [hourlyEmotion, setHourlyEmotion] = useState({});
  const [chartError, setChartError] = useState(null);
  const [highestEmotion, setHighestEmotion] = useState({});
  const [weeklyExerciseData, setWeeklyExerciseData] = useState({});
  const [monthlyExerciseData, setMonthlyExerciseData] = useState({});
  const [mostUsedExercise, setMostUsedExercise] = useState(null);
  const [weeklyListeningData, setWeeklyListeningData] = useState({});
  const [monthlyListeningData, setMonthlyListeningData] = useState({});
  const [mostListenedTrack, setMostListenedTrack] = useState(null);
  const [emotionView, setEmotionView] = useState('daily');
  const [exerciseView, setExerciseView] = useState('weekly');
  const [listeningView, setListeningView] = useState('weekly');
  const [isEmotionLeftDisabled, setIsEmotionLeftDisabled] = useState(false);
  const [isEmotionRightDisabled, setIsEmotionRightDisabled] = useState(false);
  const [isExerciseLeftDisabled, setIsExerciseLeftDisabled] = useState(false);
  const [isExerciseRightDisabled, setIsExerciseRightDisabled] = useState(false);
  const [isListeningLeftDisabled, setIsListeningLeftDisabled] = useState(false);
  const [isListeningRightDisabled, setIsListeningRightDisabled] = useState(false);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/teamlist/")
      .then((response) => {
        setTeams(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
      });
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamData(selectedTeam);
    }
  }, [selectedTeam]);

  const fetchTeamData = async (teamId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/teamdata/${teamId}`);
      setTeamData(response.data);
      fetchEmotionData(teamId);
      fetchExerciseData(teamId);
      fetchListeningData(teamId);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const fetchEmotionData = async (teamId, period = emotionView) => {
    try {
      const response = await axios.get("http://localhost:8000/api/getemotions/", {
        params: { team_id: teamId, period },
      });
      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setEmotions(data);
      setHourlyEmotion(hourlyEmotion);
      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
        setChartError("No Data Recorded ⚠");
      } else {
        setChartError(null);
      }
      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue       = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      setHighestEmotion({ key: maxKey, value: maxValue });
    } catch (error) {
      console.error("Error fetching data:", error);
      setChartError("An error occurred!");
    }
  };

  const fetchExerciseData = async (teamId, period = exerciseView) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/breathing_exercise_usage/",
        { params: { team: teamId, period } }
      );
      if (period === "weekly") {
        setWeeklyExerciseData(response.data.days);
        setMostUsedExercise(response.data.most_used_exercise);
      } else {
        setMonthlyExerciseData(response.data.days);
        setMostUsedExercise(response.data.most_used_exercise);
      }
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (teamId, period = listeningView) => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/track_listening/",
        { params: { team: teamId, period } }
      );
      if (period === "weekly") {
        setWeeklyListeningData(response.data.days);
        setMostListenedTrack(response.data.most_listened_track);
      } else {
        setMonthlyListeningData(response.data.days);
        setMostListenedTrack(response.data.most_listened_track);
      }
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  const handleViewChange = (viewSetter, view, direction) => {
    const views = ["daily", "weekly", "monthly", "all_time"];
    const currentIndex = views.indexOf(view);
    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < views.length) {
      viewSetter(views[newIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">All Teams Dashboard</h1>
        <div className="mb-4">
          <label htmlFor="teamSelect" className="block text-lg font-medium text-gray-700">
            Select Team:
          </label>
          <select
            id="teamSelect"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTeam && (
          <>
            <h2 className="text-xl font-bold mb-6">Team Details of Team {teamData.name}</h2>
            <div className="flex flex-wrap justify-center">
              <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="text-center">
                  <h5 className="text-xl font-semibold text-sky-900 mb-5">
                    {emotionView === "daily"
                      ? "Daily Emotions"
                      : emotionView === "weekly"
                      ? "Weekly Emotions"
                      : emotionView === "monthly"
                      ? "Monthly Emotions"
                      : "Overall Emotions"}
                  </h5>
                  {chartError ? (
                    <h2 className="text-xl text-gray-700 mt-4">{chartError}</h2>
                  ) : (
                    <DoughnutChart {...emotions} />
                  )}
                  <div className="flex justify-center mt-4">
                    <button
                      className={`text-sky-900 ${isEmotionLeftDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setEmotionView, emotionView, "prev")}
                      disabled={isEmotionLeftDisabled}
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      className={`ml-4 text-sky-900 ${isEmotionRightDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setEmotionView, emotionView, "next")}
                      disabled={isEmotionRightDisabled}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="text-center">
                  <h5 className="text-xl font-semibold text-sky-900">
                    Team's Most Common Emotion
                  </h5>
                  {chartError ? (
                    <h2 className="text-xl text-gray-700 mt-4">{chartError}</h2>
                  ) : (
                    <div className="mt-4">
                      <h2 className="text-xl text-sky-900 capitalize">{highestEmotion.key}</h2>
                      <img
                        className="w-20 h-20 mx-auto mt-4"
                        src={`http://127.0.0.1:8000/media/emojis/${highestEmotion.key}.png`}
                        alt={highestEmotion.key}
                      />
                      <p className="text-gray-700 mt-4">
                        Detected {highestEmotion.value}{" "}
                        {highestEmotion.value === 1 ? "time" : "times"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="text-center">
                  <h5 className="text-xl font-semibold text-sky-900 inline-flex">
                    <img src={`${icons}/breathing-icon.png`} alt="Breathing Exercise" className="h-10" />
                    {exerciseView === "weekly"
                      ? "Weekly Breathing Exercise Duration"
                      : "Monthly Breathing Exercise Duration"}
                  </h5>
                  {exerciseView === "weekly" ? (
                    Object.keys(weeklyExerciseData).length === 0 ? (
                      <h2 className="text-xl text-gray-700 mt-4">
                        No Data Recorded &#x26A0;
                      </h2>
                    ) : (
                      <LineChart data={weeklyExerciseData} period="weekly" />
                    )
                  ) : Object.keys(monthlyExerciseData).length === 0 ? (
                    <h2 className="text-xl text-gray-700 mt-4">No data recorded</h2>
                  ) : (
                    <LineChart data={monthlyExerciseData} period="monthly" />
                  )}
                  <div className="flex justify-center mt-4">
                    <button
                      className={`text-sky-900 ${isExerciseLeftDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setExerciseView, exerciseView, "prev")}
                      disabled={isExerciseLeftDisabled}
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      className={`ml-4 text-sky-900 ${isExerciseRightDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setExerciseView, exerciseView, "next")}
                      disabled={isExerciseRightDisabled}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                  {mostUsedExercise && (
                    <div className="mt-4">
                      <h5 className="text-lg font-semibold text-sky-900 mb-5">
                        Team's Most Used Exercise:
                      </h5>
                      <p className="text-gray-700">{mostUsedExercise.exercise_name}</p>
                      <p className="text-gray-700">
                        Total Duration: {(mostUsedExercise.total_duration / 60.0).toFixed(2)}{" "}
                        minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="max-w-sm w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="text-center">
                  <h5 className="text-xl font-semibold text-sky-900 inline-flex">
                    <img src={`${icons}/audio-icon.png`} alt="Listening Duration" className="h-10 pr-3 pl-3" />
                    {listeningView === "weekly"
                      ? "Weekly Listening Duration"
                      : "Monthly Listening Duration"}
                  </h5>
                  {listeningView === "weekly" ? (
                    Object.keys(weeklyListeningData).length === 0 ? (
                      <h2 className="text-xl text-gray-700 mt-4">
                        No Data Recorded &#                      x26A0;
                      </h2>
                    ) : (
                      <LineChart data={weeklyListeningData} period="weekly" />
                    )
                  ) : Object.keys(monthlyListeningData).length === 0 ? (
                    <h2 className="text-xl text-gray-700 mt-4">No data recorded</h2>
                  ) : (
                    <LineChart data={monthlyListeningData} period="monthly" />
                  )}
                  <div className="flex justify-center mt-4">
                    <button
                      className={`text-sky-900 ${isListeningLeftDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setListeningView, listeningView, "prev")}
                      disabled={isListeningLeftDisabled}
                    >
                      <FaArrowLeft />
                    </button>
                    <button
                      className={`ml-4 text-sky-900 ${isListeningRightDisabled ? "text-gray-400" : ""}`}
                      onClick={() => handleViewChange(setListeningView, listeningView, "next")}
                      disabled={isListeningRightDisabled}
                    >
                      <FaArrowRight />
                    </button>
                  </div>
                  {mostListenedTrack && (
                    <div className="mt-4">
                      <h5 className="text-lg font-semibold text-sky-900 mb-5">
                        Team's Most Listened Track:
                      </h5>
                      <p className="text-gray-700">{mostListenedTrack.track_name}</p>
                      <p className="text-gray-700">
                        Total Duration: {(mostListenedTrack.total_duration / 60).toFixed(2)} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="max-w-xl w-full px-4 py-4 m-5 bg-white border border-gray-200 rounded-lg shadow-lg">
              <h5 className="text-xl font-semibold text-sky-900">
                Team's Dominant Emotion by Hour
              </h5>
              <div className="flex justify-between mt-4 w-full">
                {Object.keys(hourlyEmotion).map((hour, index) => (
                  <div key={index} className="text-center ml-4 mr-4">
                    {hourlyEmotion[hour] ? (
                      <div>
                        <img
                          className="w-8 h-8 mx-auto"
                          src={`http://127.0.0.1:8000/media/emojis/${hourlyEmotion[hour]}.png`}
                          alt={hourlyEmotion[hour]}
                          title={hourlyEmotion[hour]}
                        />
                      </div>
                    ) : (
                      <span className="text-xl">-</span>
                    )}
                    <p className="text-sm text-gray-700">{hour.split(" ")[0]}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllTeamsDashboard;


