import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeDashboard from "../EmployeeDashboard";
import EmployeeDashboardOverlay from "../EmployeeDashboardOverlay";
import { useNavigate } from "react-router-dom";

function SingleTeamMember(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [formDetails, setFormDetails] = useState(null);
  const [showUserDashboardOverlay, setShowUserDashboardOverlay] =
    useState(false);
  const [weeklyExerciseData, setWeeklyExerciseData] = useState({});
  const [highestEmotion, setHighestEmotion] = useState({ key: "", value: 0 });

  const [monthlyExerciseData, setMonthlyExerciseData] = useState({});
  const [weeklyListeningData, setWeeklyListeningData] = useState({});
  const [monthlyListeningData, setMonthlyListeningData] = useState({});
  const [mostUsedExercise, setMostUsedExercise] = useState(null);
  const [mostListenedTrack, setMostListenedTrack] = useState(null);
  const [exerciseView, setExerciseView] = useState("weekly");
  const [listeningView, setListeningView] = useState("weekly");
  const [emotionView, setEmotionView] = useState("daily"); // Start with daily view
  const [hourlyEmotion, setHourlyEmotion] = useState([]);

  const [maxValue, setmaxValue] = useState("");
  const toggleOverlay = () => {
    setIsOpen(!isOpen);
  };

  const navigate = useNavigate();

  const fetchFormDetails = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/stress_form/${props.employee.id}/`
      );
      setFormDetails(response.data);
      setIsOpen(true);
    } catch (error) {
      console.error("Error fetching form details:", error);
    }
  };

  const fetchEmotionData = async (
    userId = props.employee.id,
    period = "weekly"
  ) => {
    try {
      const response = await axios.get("http://localhost:8000/api/emotions/", {
        params: { user_id: userId, period },
      });
      console.log(response.data);

      const data = response.data.defaultEmotionValues;
      const hourlyEmotion = response.data.hourlyDominantEmotions;
      setHourlyEmotion(hourlyEmotion);

      const allZero = Object.values(data).every((value) => value === 0);
      if (allZero) {
      } else {
      }
      const values = Object.values(data);
      const keys = Object.keys(data);
      const maxValue = Math.max(...values);
      const maxKey = keys[values.indexOf(maxValue)];
      setHighestEmotion({ key: maxKey, value: maxValue });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchExerciseData = async (
    userId = props.employee.id,
    period = "weekly"
  ) => {
    try {
      const response = await axios.get("http://localhost:8000/api/breathing/", {
        params: { user: userId, period },
      });
      setWeeklyExerciseData(response.data.days);
      setMostUsedExercise(response.data.most_used_exercise);
    } catch (error) {
      console.error("Error fetching exercise data:", error);
    }
  };

  const fetchListeningData = async (
    userId = props.employee.id,
    period = "weekly"
  ) => {
    try {
      const response = await axios.get("http://localhost:8000/api/listening/", {
        params: { user: userId, period },
      });
      setWeeklyListeningData(response.data.days);
      setMostListenedTrack(response.data.most_listened_track);
    } catch (error) {
      console.error("Error fetching listening data:", error);
    }
  };

  const openConfirmBox = () => {
    setIsConfirmOpen(true);
  };

  const goToDashboard = () => {
    navigate(`/employee/dashboard/${props.employee.id}`);
  };

  const totalWeeklyExercise = Object.values(weeklyExerciseData).reduce(
    (sum, value) => sum + value,
    0
  );

  useEffect(() => {
    fetchExerciseData(props.employee.id, exerciseView);
    fetchListeningData(props.employee.id, listeningView);
    fetchEmotionData(props.employee.id, emotionView);
  }, [props.employee.id, exerciseView, listeningView, emotionView]);

  return (
    <>
      <tr>
        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-10 h-10">
              <p></p>
              <img
                className="w-full h-full rounded-full"
                src={
                  props.employee.profile_picture
                    ? `http://127.0.0.1:8000/media/${props.employee.profile_picture}`
                    : `http://127.0.0.1:8000/media/profilePictures/default.jpg`
                }
                alt={`${props.employee.first_name}'s Photo`}
                title={`${props.employee.first_name}'s Photo`}
              />
            </div>
            <div className="ml-3">
              <p className="text-gray-900 whitespace-no-wrap">
                {props.employee.first_name} {props.employee.last_name}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-blue-500 underline whitespace-no-wrap">
            <a
              href={`mailto:${props.employee.email}`}
              target="_blank"
              title={`Send an email to ${props.employee.first_name} ${props.employee.last_name}`}
            >
              {props.employee.email}
            </a>
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap capitalize">
            {highestEmotion.value !== 0 ? `${highestEmotion.key}` : " - "}
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {props.employee.stress}
          </p>
        </td>

        <td
          className="px-5 py-5 border-b border-gray-200 bg-white text-sm"
          title="Time"
        >
          <p className="text-gray-900 whitespace-no-wrap">
            {mostUsedExercise ? `${mostUsedExercise.exercise_name}` : " - "}
          </p>

          <p className="text-gray-900 whitespace-no-wrap">
            {weeklyExerciseData
              ? `${(totalWeeklyExercise / 60.0).toFixed(2)} Minutes`
              : " - "}
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p className="text-gray-900 whitespace-no-wrap">
            {mostListenedTrack ? `${mostListenedTrack.track_name}` : " - "}
          </p>

          <p className="text-gray-900 whitespace-no-wrap">
            {weeklyListeningData
              ? `${(weeklyListeningData / 60.0).toFixed(2)} Minutes`
              : " - "}
          </p>
        </td>

        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <p
            className="text-gray-900 whitespace-no-wrap font-bold cursor-pointer text-xl"
            style={{
              color:
                props.employee.stress_score < 0
                  ? "red"
                  : props.employee.stress_score > 0
                  ? "green"
                  : "black",
            }}
            onClick={fetchFormDetails}
          >
            {props.employee.stress_score}
          </p>
          <p className="text-xs font-light text-gray-700">
            {props.employee.submitted_on}
          </p>
        </td>

        {!props.employee.is_superuser && (
          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
            <p className="text-gray-900 whitespace-no-wrap flex">
              <button
                onClick={goToDashboard}
                className="flex w-1/2 justify-center rounded-md bg-green-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                More Details
              </button>
              <button
                onClick={openConfirmBox}
                className="flex w-1/2 justify-center rounded-md bg-blue-300 px-1 py-1.5 mx-2 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Send Message
              </button>
            </p>
          </td>
        )}
      </tr>

      {isOpen && formDetails && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Self Stress Detection Details
            </h2>
            <h2 className="font-semibold mt-4">
              of {props.employee.first_name} {props.employee.last_name}
            </h2>
            <h2 className="font-semibold mt-4">
              Submitted on: {props.employee.submitted_on}
            </h2>
            <div>
              <h3 className="font-semibold">Answers:</h3>
              <ol className="list-decimal list-inside">
                {Object.entries(formDetails.answers).map(
                  ([question, answer], index) => (
                    <li key={index} className="mt-1">
                      <strong>{question}</strong> - {answer}
                    </li>
                  )
                )}
              </ol>
              <h3 className="font-semibold mt-4">
                <strong>Additional Comments:</strong>
              </h3>
              <p>{formDetails.additional_comments || "None"}</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showUserDashboardOverlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg">
            <EmployeeDashboardOverlay employeeId={Number(props.employee.id)} />{" "}
            <button
              onClick={() => setShowUserDashboardOverlay(false)}
              className="mt-4 bg-red-500 text-white p-2 rounded"
            >
              Close Overlay
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default SingleTeamMember;
