import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "react-h5-audio-player/lib/styles.css";
import { Color } from "../theme/Colors";
import "tailwindcss/tailwind.css";
import { playerState, tracksState } from "../atoms";
import "./PlayerStyles.css"; 
import "react-circular-progressbar/dist/styles.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./noScroll.css"

const Player = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dominantColor, setDominantColor] = useState("#000");
  const [progress, setProgress] = useState(0);
  const [userID, setUserID] = useState("");
  const [player, setPlayer] = useRecoilState(playerState);

  const tracks = useRecoilValue(tracksState);
  const setTracks = useSetRecoilState(tracksState);

  // const [tracks, setTracks] = useState({})

  // const currentTrack = tracks[currentTrackIndex];
  const audioRef = useRef(null);
  const imageRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  const currentTrack = tracks.length > 0 ? tracks[currentTrackIndex] : {};

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
    const fetchTracks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tracks/");
        setTracks(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching tracks: ", error);
      }
    };

    fetchTracks();
  }, []);


  const updateProgress = () => {
    if (audioRef.current && audioRef.current.audio.current) {
      const currentTime = audioRef.current.audio.current.currentTime;
      const duration = audioRef.current.audio.current.duration;
      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress((currentTime / duration) * 100);
    }
  };

  const logListeningData = async (user_id, track_name, duration) => {
    if (!user_id || !track_name || !duration) {
      console.error("User, track name, and duration are required");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/listening/", {
        user: user_id,
        track_name: track_name,
        duration: duration,
      });
    } catch (error) {
      console.error(
        "Error posting data: ",
        error.response ? error.response.data : error.message
      );
    }
  }

  useEffect(() => {
    let listeningStartTime = 0;

    const handlePlaying = () => {
      listeningStartTime = audioRef.current.audio.current.currentTime;
    };

    const handlePaused = async () => {
      const listeningEndTime = audioRef.current.audio.current.currentTime;
      const listeningDuration = listeningEndTime - listeningStartTime;
      if (listeningDuration > 0) {
        await logListeningData(userID, currentTrack.title, listeningDuration);
      }
    };

    if (audioRef.current && audioRef.current.audio.current) {
      const player = audioRef.current.audio.current;
      player.addEventListener("playing", handlePlaying);
      player.addEventListener("pause", handlePaused);
      player.addEventListener("ended", handlePaused);

      return () => {
        player.removeEventListener("playing", handlePlaying);
        player.removeEventListener("pause", handlePaused);
        player.removeEventListener("ended", handlePaused);
      };
    }
  }, [currentTrackIndex, userID, currentTrack.title]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        updateProgress();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes('/employee/player')) {
      console.log('Current path includes "/employee/player"');
      setPlayer((prev) => ({ ...prev, isFloating: false }))
      // setPlayer(false)
    } else {
      console.log('Current path does not include "/employee/player"');
      setPlayer((prev) => ({ ...prev, isFloating: true }))
      // setPlayer(true)
    }
  }, [])

  return (
    <div className={`${Color.background} flex flex-col items-center`}>
      <button
        onClick={() => setPlayer((prev) => ({ ...prev, isFloating: !prev.isFloating }))}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {player.isFloating ? "Switch to Normal Mode" : "Switch to Floating Mode"}
      </button>
      {/*<div className="h-screen overflow-y-hidden">

  </div>*/}
    </div>
  );
};

export default Player;
