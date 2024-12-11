import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Color } from "../theme/Colors";

const StressDetectionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastSubmitDate, setLastSubmitDate] = useState(null);
  const [shouldShow, setShouldShow] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchLatestStressFormDate();
    }
  }, [userData.id]);

  useEffect(() => {
    calculateTotalPoints();
  }, [formData]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
      setIsAuthenticated(true);
    } catch (e) {
      console.error(e);
      setIsAuthenticated(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/stress_questions/", {
        withCredentials: true,
      });
      setQuestions(response.data);
      const initialFormData = response.data.reduce((acc, question) => {
        acc[question.id] = {
          affect: question.affect,
          occurrence: "3", 
        };
        return acc;
      }, {});
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleChange = (e, id, field) => {
    if (id === "additionalComments") {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    } else {
      setFormData({
        ...formData,
        [id]: {
          ...formData[id],
          [field]: e.target.value,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      user: userData.id,
      answers: Object.keys(formData).reduce((acc, key) => {
        const question = questions.find((q) => q.id == key);
        const options = renderOptions(question.type);
        acc[question.question] = options[formData[key].occurrence - 1];
        return acc;
      }, {}),
      score: totalPoints,
      additional_comments: formData.additionalComments || "",
    };

    try {
      const response = await axios.post("http://localhost:8000/api/stress_form/", submissionData, {
        withCredentials: true,
      });
      console.log("Response:", response.data);
      alert("Thank you for your responses!");
    } catch (error) {
      console.error("There was an error submitting the form:", error);
    }
  };

  const fetchLatestStressFormDate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/latest_stress_form/?user_id=${userData.id}`
      );
      const date = response.data.submitted_at;
      setLastSubmitDate(date);
      const isMoreThanAWeek = moment().diff(moment(date, "DD-MM-YYYY"), "weeks") > 1;
      setShouldShow(isMoreThanAWeek);
    } catch (error) {
      console.error("There was an error fetching the latest stress form date:", error);
    }
  };

  const renderOptions = (type) => {
    if (type === "T") {
      return ["Never", "Rarely", "Sometimes", "Very Often", "Always"];
    } else if (type === "A") {
      return ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
    }
    return [];
  };

  const calculatePoints = (type, affect, value) => {
    const valueIndex = parseInt(value) - 1;
    const positivePointsT = [-20, -10, 0, 10, 20];
    const negativePointsT = [20, 10, 0, -10, -20];
    const positivePointsA = [-20, -10, 0, 10, 20];
    const negativePointsA = [20, 10, 0, -10, -20];

    if (affect === "P" && type === "T") return positivePointsT[valueIndex];
    if (affect === "N" && type === "T") return negativePointsT[valueIndex];
    if (affect === "P" && type === "A") return positivePointsA[valueIndex];
    if (affect === "N" && type === "A") return negativePointsA[valueIndex];

    return 0;
  };

  const calculateTotalPoints = () => {
    let total = 0;
    for (const id in formData) {
      const question = questions.find((q) => q.id == id);
      if (question) {
        const { type, affect } = question;
        total += calculatePoints(type, affect, formData[id].occurrence);
      }
    }
    setTotalPoints(total);
  };

  return (
    <div className="pb-10">
    <div
      className={`max-w-5xl mx-auto mt-8 p-4 pb-10 pt-8 shadow-md rounded-2xl ${Color.cardBox}`}
    >
      <div className="flex justify-center">
        <h2 className="text-xl font-bold mb-4 text-center">
          Weekly Stress Detection Form
        </h2>
      </div>
      <div className="flex flex-col ">
        <div className="flex justify-center w-full">
          <div className="flex justify-center">
            <img src="http://127.0.0.1:8000/media/stressForm/Forms.png/" className="w-[300px]" alt="form Image" />
          </div>
        </div>
        <div className="flex justify-center mt-8 w-full px-10">
          <form className="flex flex-col w-full" onSubmit={handleSubmit}>
            {questions.map(({ id, question, type, affect }) => (
              <div key={id} className="mb-4 py-5">
                <label
                  htmlFor={`question-${id}`}
                  className="block font-medium"
                >
                  {question}
                </label>
                <div className="mt-2">
                  {renderOptions(type).map((label, index) => (
                    <label
                      key={index}
                      className="inline-flex items-center mr-4"
                    >
                      <input
                        type="radio"
                        id={`occurrence-${id}-${index}`}
                        name={`occurrence-${id}`}
                        value={index + 1}
                        checked={formData[id]?.occurrence === String(index + 1)}
                        onChange={(e) => handleChange(e, id, "occurrence")}
                        className="form-radio"
                      />
                      <span className="ml-2">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className="mb-4">
              <label
                htmlFor="additionalComments"
                className="block font-medium"
              >
                Additional Comments:
              </label>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments || ""}
                onChange={(e) =>
                  handleChange(e, "additionalComments", "additionalComments")
                }
                className={`mt-1 block min-h-24 w-full rounded-xl ${Color.textFeild}`}
                style={{ padding: "10px" }} 
              />
            </div>
            <div className="flex justify-end mt-auto">
              <button
                type="submit"
                className="px-4 text-black py-2 bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StressDetectionForm;