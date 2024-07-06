import React, { useState, useEffect } from "react";
import axios from 'axios'; // Ensure axios is imported
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './BreathingExercise.css';
import Reminders from "./Reminders";
import { FaClock } from 'react-icons/fa';

//import { checkReminders } from './notificationService';

const BreathingExercise = () => {
  const [breathing, setBreathing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showIntroText, setShowIntroText] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(0)
  const [profiles, setProfiles] = useState({0:{id: 1, name: 'Test Breathing', inhale_duration: 3, exhale_duration: 3, hold_duration: 5, description: '1. Lie on your back with your knees slightly bent and your head on a pillow. \n 2. You may place a pillow under your knees for support. \n3. Place one hand on your upper chest and one hand below your rib cage, allowing you to feel the movement of your diaphragm. \n4. Slowly inhale through your nose, feeling your stomach pressing into your hand. \n5. Keep your other hand as still as possible. \n6. Exhale using pursed lips as you tighten your abdominal muscles, keeping your upper hand completely still.'}});
  const [circleText, setCircleText] = useState("Start");
  const [showText, setShowText] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [circleColor, setCircleColor] = useState("#4ade80");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userID, setUserID] = useState(18)
  const [showReminders, setShowReminders] = useState(false);

  /*const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/breathing_profile/");
      setProfiles(response.data);
      setSelectedProfile(Object.keys(response.data)[0]);
    } catch (e) {
      console.error(e);
    }
  };*/


 /* useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getuser/", {
          withCredentials: true,
        });
        //setUserID(response.data.id);
      } catch (e) {
        console.error(e);
      }
    })();
    fetchProfiles();
  }, []);*/

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
      setCircleColor("#4ade80");
      setElapsedTime(0);

      elapsedTimer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      const breatheCycle = () => {
        setCircleText("Inhale!");
        setCircleColor("#4ade80");
        setShowText(true);

        breatheCycleTimer = setTimeout(() => {
          setCircleText("Hold!");
          setCircleColor("#f59e0b");
          setShowText(true);

          breatheCycleTimer = setTimeout(() => {
            setCircleText("Exhale!");
            setCircleColor("#38bdf8");
            setShowText(true);

            breatheCycleTimer = setTimeout(breatheCycle, profiles[selectedProfile].exhaleDuration);
          }, profiles[selectedProfile].holdDuration);
        }, profiles[selectedProfile].inhaleDuration);
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
  }, [countdown, breathing, selectedProfile, profiles]);

  const toggleBreathing = async () => {
    if (breathing) {
      setBreathing(false);
      setCircleText("Start");
      setShowIntroText(false);
      setIsHovering(false);
      setCircleColor("#4ade80");

      /*await axios.post(
        "http://127.0.0.1:8000/api/breathing/",{
          user: userID,
          exercise_name: profiles[selectedProfile].name,
          duration: elapsedTime
        },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
          },
        }
      );*/

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

  const toggleReminders = () => {
    setShowReminders(!showReminders);
  };

  // if (!selectedProfile) return <div>Loadinsssg...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <div className="absolute top-10 left-10">
        <h1 className="text-3xl font-bold text-sky-500">CODECALM</h1>
        <p className="text-xl font-bold text-sky-500">Breathing Exercise</p>
        <p className="text-sm text-gray-400">Apx: 5 Mins</p>
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
        <h2 className="text-xl font-bold">{profiles[selectedProfile].name}</h2>
        <p className="text-sm whitespace-pre-wrap">{profiles[selectedProfile].description}</p>
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
              backgroundColor: countdown > 0 ? "gray" : circleColor,
              opacity: 0.2,
              transition: "background-color 0.5s ease",
            }}
          ></div>
          <div
            className={`w-32 h-32 rounded-full relative cursor-pointer ${breathing && countdown === 0 ? "animate-breath" : ""}`}
            style={{
              animationDuration: `${profiles[selectedProfile].inhaleDuration + profiles[selectedProfile].holdDuration + profiles[selectedProfile].exhaleDuration}ms`,
              backgroundColor: countdown > 0 ? "gray" : circleColor,
              boxShadow: `0 0 20px ${countdown > 0 ? "gray" : circleColor}`,
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

      <div className="absolute bottom-10 right-10">
        <button onClick={toggleReminders} className="p-2 bg-sky-500 text-white rounded-full">
          <FaClock size={24} />
        </button>
      </div>

      {showReminders && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-3/4 h-3/4 bg-white rounded-lg p-4 overflow-auto">
            <button
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
              onClick={toggleReminders}
            >
              X
            </button>
            <Reminders />
          </div>
        </div>
      )}
    </div>
  );
};

export default BreathingExercise;
