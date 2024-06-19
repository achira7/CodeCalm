import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StressDetectionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchQuestions();
    fetchUserData();
  }, []);

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
      const response = await axios.get('http://localhost:8000/api/stress_questions/', {
        withCredentials: true,
      });
      setQuestions(response.data);
      const initialFormData = response.data.reduce((acc, question) => {
        acc[question.id] = {
          affect: question.affect,
          occurrence: '3', // Set default occurrence value as string for radio buttons
        };
        return acc;
      }, {});
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleChange = (e, id, field) => {
    setFormData({
      ...formData,
      [id]: {
        ...formData[id],
        [field]: e.target.value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      user: userData.id,
      answers: Object.keys(formData).reduce((acc, key) => {
        const question = questions.find(q => q.id == key);
        const options = renderOptions(question.type);
        acc[question.question] = options[formData[key].occurrence - 1];
        return acc;
      }, {}),
      score: totalPoints,
      additional_comments: formData.additionalComments || '',
    };

    try {
      const response = await axios.post('http://localhost:8000/api/stress_form/', submissionData, {
        withCredentials: true,
      });
      console.log('Response:', response.data);
      alert('Thank you for your responses!');
    } catch (error) {
      console.error('There was an error submitting the form:', error);
    }
  };

  const renderOptions = (type) => {
    if (type === 'T') {
      return ['Never', 'Rarely', 'Sometimes', 'Very Often', 'Always'];
    } else if (type === 'A') {
      return ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];
    }
    return [];
  };

  const calculatePoints = (type, affect, value) => {
    const valueIndex = parseInt(value) - 1;
    const positivePointsT = [-20, -10, 0, 10, 20];
    const negativePointsT = [20, 10, 0, -10, -20];
    const positivePointsA = [-20, -10, 0, 10, 20];
    const negativePointsA = [20, 10, 0, -10, -20];

    if (affect === 'P' && type === 'T') return positivePointsT[valueIndex];
    if (affect === 'N' && type === 'T') return negativePointsT[valueIndex];
    if (affect === 'P' && type === 'A') return positivePointsA[valueIndex];
    if (affect === 'N' && type === 'A') return negativePointsA[valueIndex];

    return 0;
  };

  const calculateTotalPoints = () => {
    let total = 0;
    for (const id in formData) {
      const question = questions.find(q => q.id == id);
      if (question) {
        const { type, affect } = question;
        total += calculatePoints(type, affect, formData[id].occurrence);
      }
    }
    setTotalPoints(total);
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4">Weekly Stress Detection Form</h2>
      <form onSubmit={handleSubmit}>
        {questions.map(({ id, question, type, affect }) => (
          <div key={id} className="mb-4 px-5 py-5">
            <label htmlFor={`question-${id}`} className="block text-sm font-medium text-gray-700">
              {question}
            </label>
            <div className="mt-2">
              {renderOptions(type).map((label, index) => (
                <label key={index} className="inline-flex items-center mr-4">
                  <input
                    type="radio"
                    id={`occurrence-${id}-${index}`}
                    name={`occurrence-${id}`}
                    value={index + 1}
                    checked={formData[id]?.occurrence === String(index + 1)}
                    onChange={(e) => handleChange(e, id, 'occurrence')}
                    className="form-radio"
                  />
                  <span className="ml-2">{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        <div className="mb-4">
          <label htmlFor="additionalComments" className="block text-sm font-medium text-gray-700">
            Additional Comments:
          </label>
          <textarea
            id="additionalComments"
            name="additionalComments"
            value={formData.additionalComments || ''}
            onChange={(e) => handleChange(e, 'additionalComments', 'additionalComments')}
            className="mt-1 block w-full"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Submit
        </button>
      </form>
      <div className="mt-4 text-xl font-bold">Total Points: {totalPoints}</div>
    </div>
  );
};

export default StressDetectionForm;
