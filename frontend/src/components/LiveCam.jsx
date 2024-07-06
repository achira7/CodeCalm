import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveCam = () => {
  const [userData, setUserData] = useState({});
  const [emotionResponseState, setEmotionResponseState] = useState("");
  const [emotionFrequency, setEmotionFrequency] = useState("");
  const [gaze, setGaze] = useState("");
  const [progress, setProgress] = useState(0);

  const webcamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getuser/", {
          withCredentials: true,
        });
        const user = response.data;
        setUserData(user);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);


  useEffect(() => {
    const postImage = async (imageSrc) => {
      try {
        const formData = new FormData();
        formData.append("frame", imageSrc);
        formData.append("user_id", userData.id);

        const response = await axios.post(
          "http://127.0.0.1:8000/api/emotions/",
          formData,
          {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
            },
          }
        );

        if (response) {
          const { emo, frq, gaze } = response.data;
          setEmotionResponseState(emo);
          setEmotionFrequency(frq);
          setGaze(gaze);

          if (
            response.data.emo === "No Face Detected" ||
            response.data.emo === "Multiple Faces Detected" ||
            response.data.emo === "No Emotion Detected" ||
            response.data.emo === "Webcam cover is closed or image is too dark" ||
            response.data.emo === "Image is blurred. Please clear the webcam."
          ) {
            toast.error(response.data.emo, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              limit: 1,
            });
          }

          if (response.data.frq === "You seem to be stressed!") {
            toast.error(`You seem to be stressed!`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              limit: 1,
            });
          }
        }
      } catch (error) {
        console.error("Error in POST request to emotions API:", error);
      }
    };

    const postFocusImage = async (imageSrc) => {
      try {
        const formData = new FormData();
        formData.append("frame", imageSrc);
        formData.append("user_id", userData.id);
    
        const response = await axios.post(
          "http://127.0.0.1:8000/api/focus/",
          formData,
          {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
            },
          }
        );

      } catch (error) {
        console.error("Error in POST request to focus API:", error);
      }
    };

    const captureAndPostImages = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        postImage(imageSrc);  // Existing function for emotion
        postFocusImage(imageSrc);  // New function for focus
      }
    };

    const intervalTime = 10000;
    const progressIntervalTime = 100;

    intervalRef.current = setInterval(() => {
      captureAndPostImages();
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

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-xl">
        <div className="relative">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="rounded-lg w-full"
          />
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-full">
            LIVE
          </div>
          <img
            src="http://127.0.0.1:8000/media/assets/codecalm-logo-colored.png"
            alt="CodeCalm"
            className="absolute top-2 right-2 w-10"
          />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-sm">Current Emotion</p>
            <p className="text-lg font-semibold">{emotionResponseState}</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-500 text-sm">Current Stress Level</p>
            <p className="text-lg font-semibold">{emotionFrequency}</p>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div style={{ width: 50, height: 50 }}>
            <CircularProgressbar
              value={progress}
              strokeWidth={50}
              styles={buildStyles({
                strokeLinecap: "butt",
              })}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LiveCam;
