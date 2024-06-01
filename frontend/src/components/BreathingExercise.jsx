import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './BreathingExercise.css'; // Import the CSS file

const BreathingExercise = () => {
  const [breathing, setBreathing] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showIntroText, setShowIntroText] = useState(false);
  const cycleDuration = 6000; // Total cycle duration for inhale + exhale
  const inhaleDuration = cycleDuration / 2;
  const exhaleDuration = cycleDuration / 2;
  const inhaleColor = "#4ade80";
  const exhaleColor = "#38bdf8";
  const greyColor = "gray";
  const [circleText, setCircleText] = useState("Start");
  const [showText, setShowText] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [circleColor, setCircleColor] = useState(inhaleColor);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let countdownTimer;
    let breatheCycleTimer;
    let elapsedTimer;

    // Function to handle countdown logic
    const startCountdown = () => {
      setShowIntroText(true);
      countdownTimer = setTimeout(() => {
        setShowText(false);
        setTimeout(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
          setShowText(true);
        }, 500); // Transition duration for countdown
      }, 1000);
    };

    // Function to handle breathing cycle logic
    const startBreathingCycle = () => {
      setShowIntroText(false);
      setCircleText("Inhale!");
      setCircleColor(inhaleColor);
      setElapsedTime(0); // Reset elapsed time when breathing starts

      elapsedTimer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);

      breatheCycleTimer = setTimeout(() => {
        setCircleText("Exhale!");
        setCircleColor(exhaleColor);
        setInterval(() => {
          setShowText(false);
          setTimeout(() => {
            setCircleText("Inhale!");
            setCircleColor(inhaleColor);
            setShowText(true);
          }, 500);
          setTimeout(() => {
            setShowText(false);
            setTimeout(() => {
              setCircleText("Exhale!");
              setCircleColor(exhaleColor);
              setShowText(true);
            }, 500);
          }, inhaleDuration);
        }, cycleDuration);
      }, inhaleDuration);
    };

    // Clear existing timers to prevent overlap
    if (countdownTimer || breatheCycleTimer || elapsedTimer) {
      clearTimeout(countdownTimer);
      clearTimeout(breatheCycleTimer);
      clearInterval(elapsedTimer);
    }

    if (countdown > 0) {
      startCountdown();
    } else if (countdown === 0 && breathing) {
      startBreathingCycle();
    }

    // Cleanup function to clear timers
    return () => {
      clearTimeout(countdownTimer);
      clearTimeout(breatheCycleTimer);
      clearInterval(elapsedTimer);
    };
  }, [countdown, breathing, inhaleDuration]);

  const toggleBreathing = () => {
    if (breathing) {
      setBreathing(false);
      setCircleText("Start");
      setShowIntroText(false);
      setIsHovering(false);
      setCircleColor(inhaleColor);
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
      <h1 className="text-5xl font-bold text-sky-500 font-google">CodeCalm</h1>
      <h1 className="text-3xl font-bold mb-20 text-sky-300 font-google">Breathing Exercise</h1>
      <div className="relative flex items-center justify-center">
        {/* Circular Loading Bar */}
        <div className="absolute w-60 h-60 flex items-center justify-center">
          <CircularProgressbar
            value={(elapsedTime % 60)}
            maxValue={60}
            strokeWidth={2}
            styles={buildStyles({
              pathColor: "#38bdf8", // Fixed color
              trailColor: "#d6d6d6",
              strokeLinecap: 'round',
              transition: 'stroke-dashoffset 0.5s ease 0s',
            })}
          />
        </div>
        {/* Background Circle */}
        <div
          className="w-48 h-48 rounded-full absolute"
          style={{
            backgroundColor: countdown > 0 ? greyColor : circleColor,
            opacity: 0.2,
            transition: "background-color 0.5s ease",
          }}
        ></div>
        {/* Main Circle */}
        <div
          className={`w-32 h-32 rounded-full relative cursor-pointer ${
            breathing && countdown === 0 ? "animate-breath" : ""
          }`}
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
          <div className="font-google absolute inset-0 flex items-center justify-center text-white transition-opacity duration-500 font-google" style={{ opacity: showText ? 1 : 0 }}>
            {isHovering && breathing ? "Stop" : countdown > 0 ? countdown : circleText}
          </div>
        </div>
      </div>
      <div className="pt-20 text-xl text-gray-600 font-google">
        {formatTime(elapsedTime)}
      </div>
      <div className={`absolute bottom-20 transition-opacity duration-1000 ${showIntroText ? 'opacity-100' : 'opacity-0'}`}>
        <p className="mt-4 text-xl text-gray-600 font-google">Focus on your breath as you Inhale and Exhale</p>
      </div>
    </div>
  );
};

export default BreathingExercise;
