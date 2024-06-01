import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const FaceLogin = () => {
  const webcamRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const intervalRef = useRef(null);


  useEffect(() => {
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
          setMessage("Face not recognized");
          toast.error("Face not recognized");
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
      }
    };

    const intervalTime = 5000;
    const progressIntervalTime = 100; // Update progress every 100ms

    intervalRef.current = setInterval(() => {
      captureAndPostImage();
      setSnapshotTaken(true);
    }, intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 0;
        }
        return prevProgress + (100 / (intervalTime / progressIntervalTime));
      });
    }, progressIntervalTime);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressInterval);
    };
  }, [userData.id]);

  const handleRetake = () => {
    setProgress(0);
    setMessage("");
    setSnapshotTaken(false);
  };

  return (
    <div>
      <h1>Face Login</h1>
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
        />
        <div style={{ width: 50, height: 50, marginTop: 20 }}>
          <CircularProgressbar
            value={progress}
            strokeWidth={50}
            styles={buildStyles({
              strokeLinecap: "butt",
            })}
          />
        </div>
        {snapshotTaken && <p>Snapshot Taken</p>}
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
              onClick={handleRetake}>Retake Picture</button>
      <p>{message}</p>
      <ToastContainer />
    </div>
  );
};

export default FaceLogin;
