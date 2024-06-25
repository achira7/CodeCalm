import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import tracks from "../Tracks";
import "tailwindcss/tailwind.css";
import "./PlayerStyles.css"; // Import custom CSS for additional styling
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Player = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dominantColor, setDominantColor] = useState("#000");
  const [progress, setProgress] = useState(0);
  const [userID, setUserID] = useState('');

  const currentTrack = tracks[currentTrackIndex];
  const audioRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/getuser/", {
          withCredentials: true,
        });
        console.log("User ID fetched: ", response.data.id);
        setUserID(response.data.id);
        
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleNext = () => {
    setCurrentTrackIndex((currentTrackIndex + 1) % tracks.length);
  };

  const handlePrevious = () => {
    setCurrentTrackIndex(
      (currentTrackIndex - 1 + tracks.length) % tracks.length
    );
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const toggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const handlePlayPause = () => {
    setIsPlaying(!audioRef.current.audio.current.paused);
  };

  const updateProgress = () => {
    if (audioRef.current && audioRef.current.audio.current) {
      const currentTime = audioRef.current.audio.current.currentTime;
      const duration = audioRef.current.audio.current.duration;
      setProgress((currentTime / duration) * 100);
    }
  };

  const logListeningData = async (user_id, duration) => {
    try {
      await axios.post('http://localhost:8000/api/listening/', {
        user: user_id,
        track_name: currentTrack.name,
        duration: duration
      });
    } catch (error) {
      console.error("Error posting data: ", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    let listeningStartTime = 0;

    const handlePlaying = () => {
      listeningStartTime = audioRef.current.audio.current.currentTime;
    };

    const handlePaused = async () => {
      const listeningEndTime = audioRef.current.audio.current.currentTime;
      const listeningDuration = listeningEndTime - listeningStartTime;
      if (listeningDuration > 0) {
        await logListeningData(userID, listeningDuration);
      }
    };

    const player = audioRef.current.audio.current;
    player.addEventListener('playing', handlePlaying);
    player.addEventListener('pause', handlePaused);
    player.addEventListener('ended', handlePaused);

    return () => {
      player.removeEventListener('playing', handlePlaying);
      player.removeEventListener('pause', handlePaused);
      player.removeEventListener('ended', handlePaused);
    };
  }, [currentTrackIndex, userID]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        updateProgress();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="relative mb-8">
        <div className={`circle-content ${isPlaying ? "breathing" : ""} circle-border`} style={{ "--dominant-color": dominantColor }}>
          <div className="relative" style={{ width: "250px", height: "250px" }}>
            <CircularProgressbar
              strokeWidth={2}
              value={progress}
              size={10}
              styles={buildStyles({
                pathColor: "rgb(1, 161, 219)",
                trailColor: "#d6d6d6",
                strokeLinecap: "butt",
                pathTransitionDuration: 0.5,
              })}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                ref={imageRef}
                src={currentTrack.artwork}
                alt={currentTrack.name}
                className={`w-56 h-56 rounded-full ${isPlaying ? "spinning" : "paused"}`}
              />
            </div>
          </div>
          <h2 className="text-white text-center song-title">
            {currentTrack.name}
          </h2>
        </div>
      </div>

      <AudioPlayer
        autoPlay={false}
        ref={audioRef}
        src={currentTrack.url}
        onPlay={handlePlayPause}
        onPause={handlePlayPause}
        onEnded={handleNext}
        layout="horizontal"
        showJumpControls={true}
        showSkipControls={true}
        onClickNext={handleNext}
        onClickPrevious={handlePrevious}
        customProgressBarSection={[]}
        loop={isLoop}
        className="custom-audio-player"
        style={{ width: '700px' }}
      />
    </div>
  );
};

export default Player;
