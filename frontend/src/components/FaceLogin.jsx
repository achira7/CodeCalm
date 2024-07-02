import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCamera } from "react-icons/fa";
import axios from "axios";

const FaceLogin = () => {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  const postImage = async (imageSrc) => {
    try {
      const formData = new FormData();
      formData.append("frame", imageSrc);

      const response = await axios.post(
        "http://localhost:8000/api/facelogin/",
        formData,
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
          },
        }
      );

      if (response.data.message === "Login successful") {
        setMessage("Login successful");
        toast.success("Login successful");
      } else {
        setMessage(response.data.message);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error logging in with face:", error);
      setMessage("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  const captureAndPostImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      postImage(imageSrc);
      setSnapshotTaken(true);
    }
  };

  return (
        <>
          
          <div className="flex flex-col items-center bg-white border border-gray-200 ">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">Face Login</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="mb-4 rounded-lg"
            />
            {snapshotTaken && <p className="text-green-500 mb-4">Snapshot Taken</p>}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center"
              onClick={captureAndPostImage}
            >
              <FaCamera className="mr-2" /> Take Snapshot
            </button>
            <p className="mt-4 text-red-500">{message}</p>
          </div><ToastContainer />
        </>
        
      
    );
};

export default FaceLogin;
