import React, { useState, useEffect } from "react";
import axios from 'axios'; // Ensure axios is imported
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './BreathingExercise.css';

const profiles = {
  Profile1: { name: "Deep Breathing", inhaleDuration: 3000, exhaleDuration: 3000, holdDuration: 0, description: "1. Find a comfortable position: Sit or lie down in a comfortable position.\n2. Place your hands: One hand on your chest and the other on your abdomen.\n3. Inhale deeply: Breathe in slowly through your nose, allowing your abdomen to rise while keeping your chest still.\n4. Exhale slowly: Exhale slowly through your mouth, feeling your abdomen fall.\n5. Repeat: Continue this for 5-10 minutes." },
  Profile2: { name: "Profile 2 (4s Inhale, 4s Exhale)", inhaleDuration: 4000, exhaleDuration: 4000, holdDuration: 0, description: "4 seconds inhale, 4 seconds exhale." },
  Profile3: { name: "Profile 3 (5s Inhale, 5s Exhale)", inhaleDuration: 5000, exhaleDuration: 5000, holdDuration: 0, description: "5 seconds inhale, 5 seconds exhale." },
  Profile4: { name: "Box Breathing (3-3-3)", inhaleDuration: 3000, holdDuration: 3000, exhaleDuration: 3000, description: "Inhale for 3 seconds, hold for 3 seconds, exhale for 3 seconds." },
  Profile5: { name: "4-7-8 Breathing", inhaleDuration: 5000, holdDuration: 5000, exhaleDuration: 5000, description: "Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds." },
};

const BreathingExercise = () => {
  const [breathing, setBreathing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showIntroText, setShowIntroText] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState('Profile1');
  const { inhaleDuration, exhaleDuration, holdDuration, name, description } = profiles[selectedProfile];
  const cycleDuration = inhaleDuration + holdDuration + exhaleDuration;
  const inhaleColor = "#4ade80";
  const exhaleColor = "#38bdf8";
  const holdColor = "#f59e0b";
  const greyColor = "gray";
  const [circleText, setCircleText] = useState("Start");
  const [showText, setShowText] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [circleColor, setCircleColor] = useState(inhaleColor);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userID, setUserID] = useState("")

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getuser/", {
          withCredentials: true,
        });
        setUserID(response.data.id);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    let countdownTimer;
    let breatheCycleTimer;
    let elapsedTimer;

    const startCountdown = () => {
      setShowIntroText(true);
      countdownTimer = setInterval(() => {
        setShowText(false);
        setTimeout(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
          setShowText(true);
        }, 500);
      }, 1000);
    };

    const startBreathingCycle = () => {
      setShowIntroText(false);
      setCircleText("Inhale!");
      setCircleColor(inhaleColor);
      setElapsedTime(0);

      elapsedTimer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      const breatheCycle = () => {
        setCircleText("Inhale!");
        setCircleColor(inhaleColor);
        setShowText(true);

        breatheCycleTimer = setTimeout(() => {
          setCircleText("Hold!");
          setCircleColor(holdColor);
          setShowText(true);

          breatheCycleTimer = setTimeout(() => {
            setCircleText("Exhale!");
            setCircleColor(exhaleColor);
            setShowText(true);

            breatheCycleTimer = setTimeout(breatheCycle, exhaleDuration);
          }, holdDuration);
        }, inhaleDuration);
      };

      breatheCycle();
    };

    if (countdown > 0) {
      startCountdown();
    } else if (countdown === 0 && breathing) {
      startBreathingCycle();
    }

    return () => {
      clearInterval(countdownTimer);
      clearTimeout(breatheCycleTimer);
      clearInterval(elapsedTimer);
    };
  }, [countdown, breathing, inhaleDuration, exhaleDuration, holdDuration]);

  useEffect(() => {
    if (breathing) {
      
    }
  }, [breathing, selectedProfile]);

  const toggleBreathing = async () => {
    if (breathing) {
      setBreathing(false);
      setCircleText("Start");
      setShowIntroText(false);
      setIsHovering(false);
      setCircleColor(inhaleColor);

      const formData = new FormData();
        formData.append("user", userID);
        formData.append("exercise_name", name);
        formData.append("duration", elapsedTime);

        /* const response = await axios.post(
         
            "http://127.0.0.1:8000/api/breathing_exercise_usage/",
            formData,
            {
              headers: {
                accept: "application/json",
                "Accept-Language": "en-US,en;q=0.8",
              },
            },
            console.log("Runs!!!")
          )*/

      axios.post("http://127.0.0.1:8000/api/breathing_exercise_usage/", {
        user: userID,
        exercise_name: name,
        duration: elapsedTime
      }),console.log("Runs!!!").
      

      


    } else {
      setCountdown(3);
      setBreathing(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="absolute top-10 left-10">
        <h1 className="text-3xl font-bold text-sky-500">CODECALM</h1>
        <p className="text-xl font-bold text-sky-500">Breathing Exercise</p>
        <p className="text-sm text-gray-400">Apx: 10 Mins</p>
      </div>
      <div className="absolute top-10 right-10">
        <select
          className="p-2 bg-sky-500 text-white rounded"
          value={selectedProfile}
          onChange={(e) => setSelectedProfile(e.target.value)}
        >
          {Object.entries(profiles).map(([key, profile]) => (
            <option key={key} value={key}>{profile.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-20 text-gray-600">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-sm whitespace-pre-wrap">{description}</p>
      </div>
      <div className="px-4 py-4 m-5 w-full max-w-sm bg-gradient-to-t from-sky-100 to-sky-50 border border-gray-200 rounded-xl drop-shadow-lg">
        <div className="relative flex items-center justify-center mt-20">
          <div className="absolute w-60 h-60 flex items-center justify-center">
            <CircularProgressbar
              value={(elapsedTime % 60)}
              maxValue={60}
              strokeWidth={2}
              styles={buildStyles({
                pathColor: "#38bdf8",
                trailColor: "#d6d6d6",
                strokeLinecap: 'round',
                transition: 'stroke-dashoffset 0.5s ease 0s',
              })}
            />
          </div>
          <div
            className="w-48 h-48 rounded-full absolute"
            style={{
              backgroundColor: countdown > 0 ? greyColor : circleColor,
              opacity: 0.2,
              transition: "background-color 0.5s ease",
            }}
          ></div>
          <div
            className={`w-32 h-32 rounded-full relative cursor-pointer ${breathing && countdown === 0 ? "animate-breath" : ""}`}
            style={{
              animationDuration: `${cycleDuration}ms`,
              backgroundColor: countdown > 0 ? greyColor : circleColor,
              boxShadow: `0 0 20px ${countdown > 0 ? greyColor : circleColor}`,
              transform: breathing && countdown === 0 ? "scale(1.5)" : "scale(1)",
              transition: "background-color 0.5s ease, transform 0.5s ease, box-shadow 0.5s ease"
            }}
            onClick={toggleBreathing}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white transition-opacity duration-500" style={{ opacity: showText ? 1 : 0 }}>
              {isHovering && breathing ? "Stop" : countdown > 0 ? countdown : circleText}
            </div>
          </div>
        </div>
        <div className="pt-20 text-xl text-gray-600 flex-auto">
          {formatTime(elapsedTime)}
        </div>
        <div className={`absolute transition-opacity duration-1000 ${showIntroText ? 'opacity-100' : 'opacity-0'}`}>
          <p className="mt-4 text-xl text-gray-600">Focus on your breath as you Inhale, Hold, and Exhale</p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;
