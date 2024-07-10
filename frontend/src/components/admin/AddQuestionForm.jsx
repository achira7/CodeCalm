import React, { useEffect, useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StressQuestionForm = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAffect, setNewAffect] = useState('P'); 
  const [newType, setNewType] = useState('A');
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchQuestions();
  }, []);

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
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleNewQuestionChange = (e) => {
    setNewQuestion(e.target.value);
  };

  const handleNewAffectChange = (e) => {
    setNewAffect(e.target.value);
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  }

  const handleNewQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to add a question.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/api/stress_questions/', {
        question: newQuestion,
        affect: newAffect,
        type: newType,
      }, {
        withCredentials: true,
      });
      setNewQuestion('');
      setNewAffect('P');
      setNewType('A');
      fetchQuestions(); 
      toast.success('Question added successfully!');
    } catch (error) {
      console.error('There was an error adding the new question:', error);
      toast.error('Failed to add the question. Please try again.');
    }
  };

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find(question => question.id === id);
    setEditQuestionId(id);
    setNewQuestion(questionToEdit.question);
    setNewAffect(questionToEdit.affect);
    setNewType(questionToEdit.type);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to edit a question.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8000/api/stress_questions/${editQuestionId}/`, {
        question: newQuestion,
        affect: newAffect,
        type: newType,
      }, {
        withCredentials: true,
      });
      setEditQuestionId(null);
      setNewQuestion('');
      setNewAffect('P');
      setNewType('A');
      fetchQuestions(); 
      toast.success('Question edited successfully!');
    } catch (error) {
      console.error('There was an error editing the question:', error);
      toast.error('Failed to edit the question. Please try again.');
    }
  };

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/stress_questions/${deleteQuestionId}/`, {
        withCredentials: true,
      });
      setQuestions(questions.filter(question => question.id !== deleteQuestionId));
      setIsConfirmOpen(false);
      setDeleteQuestionId(null);
      toast.success('Question deleted successfully!');
    } catch (error) {
      console.error('There was an error deleting the question:', error);
      toast.error('Failed to delete the question. Please try again.');
    }
  };

  const openConfirmBox = (id) => {
    setDeleteQuestionId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirmBox = () => {
    setIsConfirmOpen(false);
    setDeleteQuestionId(null);
  };

  const confirmAction = () => {
    handleDeleteQuestion();
    closeConfirmBox();
  };

  if (!isAuthenticated) {
    return <div>Please log in to add a question.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">{editQuestionId ? 'Edit Stress Question' : 'Add New Stress Question'}</h2>
      <form onSubmit={editQuestionId ? handleUpdateQuestion : handleNewQuestionSubmit}>
        <label htmlFor="newQuestion" className="block text-sm font-medium text-gray-700">
          Question:
        </label>
        <input
          type="text"
          id="newQuestion"
          value={newQuestion}
          onChange={handleNewQuestionChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <label htmlFor="newAffect" className="block text-sm font-medium text-gray-700 mt-4">
          Affect:
        </label>
        <select
          id="newAffect"
          value={newAffect}
          onChange={handleNewAffectChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="P">Positive</option>
          <option value="N">Negative</option>
        </select>

        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mt-4">
          Type:
        </label>
        <select
          id="type"
          value={newType}
          onChange={handleNewTypeChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="A">Agreeable</option>
          <option value="T">Occurrence Based</option>
        </select>

        <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          {editQuestionId ? 'Update Question' : 'Add Question'}
        </button>
      </form>
      <h2 className="text-xl font-bold mt-8 mb-4">Stress Questions</h2>
      <ul>
        {questions.map(({ id, question, affect, type }) => (
          <li key={id} className="mb-2 p-2 bg-gray-100 rounded-md flex justify-between items-center">
            <div>
            {question} 
            </div>
            <div>
              <span className="text-gray-600">- Affect: {affect}</span>
            </div>
            <div>
              <span className="text-gray-600">- Type: {type}</span>
            </div>
            <div>
              <button onClick={() => handleEditQuestion(id)} className="ml-2 px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                Edit
              </button>
              <button onClick={() => openConfirmBox(id)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl mb-4">Are you sure you want to delete this question?</h2>
            <p>{questions.find(question => question.id === deleteQuestionId)?.question}</p>
            <div className="flex justify-end">
              <button
                onClick={closeConfirmBox}
                className="bg-gray-300 text-gray-700 px-3 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StressQuestionForm;
