import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LiveCam = () => {
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("You are not authenticated");
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
        setMessage("You are not authenticated");
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
          )

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
            notifyUser(response.data.emo);
            toast.error(response.data.emo, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              toastId: customId,
            });
          }

          if (response.data.frq === "You seem to be stressed!") {
            notifyUser("You seem to be stressed!");
            toast.error(`You seem to be stressed!`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              toastId: customId,
            });
          }
        }

      } catch (error) {
        console.error("Error in POST requests:", error);
      }
    };

    const captureAndPostImage = () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        postImage(imageSrc);
      }
    };

    const intervalTime = 10000;
    const progressIntervalTime = 100; // Update progress every 100ms

    intervalRef.current = setInterval(() => {
      captureAndPostImage();
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

  const customId = "custom-id-yes";

  const notifyUser = (message) => {
    if (document.hidden && Notification.permission === "granted") {
      new Notification("CodeCalm", {
        body: message,
        icon: "http://127.0.0.1:8000/media/favicons/codecalm_favicon_2.png",
      });
    }
  };

  const requestNotificationPermission = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div>
      <h1>Webcam Data to Server</h1>

      <div className="flex flex-col items-center">
        <Webcam
          audio={false}
          ref={webcamRef}
          height={500}
          width={500}
          screenshotFormat="image/jpeg"
        />
        <h2 className="font-google">Detected Emotion is: {emotionResponseState}</h2>
        <h2 className="font-google">User Focus is: {gaze}</h2>
        <div style={{ width: 50, height: 50, marginTop: 20 }}>
          <CircularProgressbar
            value={progress}
            strokeWidth={50}
            styles={buildStyles({
              strokeLinecap: "butt",
            })}
          />
        </div>
      </div>
      <div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LiveCam;
