import { playerState, tracksState } from "../atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import React, { useState, useRef, useEffect } from "react";
import { Color } from "../theme/Colors"; // Assuming Color.outSideCard provides necessary styling for outer container
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import noIcon from "../../assets/player/music.png";
import { useExtractColor } from "react-extract-colors";

const FloatingPlayer = () => {
  const [player, setPlayer] = useRecoilState(playerState);
  const tracks = useRecoilValue(tracksState);
  const currentTrack =
    tracks.length > 0 ? tracks[player.currentTrackIndex] : {};
  const [userID, setUserID] = useState("");
  const audioRef = useRef(null);
  const imageRef = useRef(null);
  //   const [dominantColor, setDominantColor] = useState("#b0cf00");
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);
  const normalMode = `mt-10 p-8 lg:w-1/3 rounded-xl ${Color.playerBG}`;
  const floatMode =
    "fixed bottom-2 left-2 border border-gray-300 border-3 bg-opacity-60 backdrop-blur-sm ";
  const { colors, dominantColor, darkerColor, lighterColor, loading, error } =
    useExtractColor(currentTrack.image);
  const gradient = `linear-gradient(135deg, ${dominantColor} 40%, ${lighterColor} 60%)`;

  const handleNext = () => {
    setPlayer((prev) => ({
      ...prev,
      currentTrackIndex: (prev.currentTrackIndex + 1) % tracks.length,
    }));
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handlePrevious = () => {
    setPlayer((prev) => ({
      ...prev,
      currentTrackIndex:
        (prev.currentTrackIndex - 1 + tracks.length) % tracks.length,
    }));
  };

  const handlePlayPause = () => {
    setPlayer((prev) => ({
      ...prev,
      isPlaying: !audioRef.current.audio.current.paused,
    }));
  };

  const updateProgress = () => {
    if (audioRef.current && audioRef.current.audio.current) {
      const currentTime = audioRef.current.audio.current.currentTime;
      const duration = audioRef.current.audio.current.duration;
      setCurrentTime(currentTime);
      setDuration(duration);
      setProgress((currentTime / duration) * 100);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.isPlaying) {
        updateProgress();
      }
    }, 900);

    return () => clearInterval(interval);
  }, [player.isPlaying]);

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
    player.addEventListener("playing", handlePlaying);
    player.addEventListener("pause", handlePaused);
    player.addEventListener("ended", handlePaused);

    return () => {
      player.removeEventListener("playing", handlePlaying);
      player.removeEventListener("pause", handlePaused);
      player.removeEventListener("ended", handlePaused);
    };
  }, [player.currentTrackIndex, userID]);

  return (
    <div
      className={`${
        player.isFloating
          ? ""
          : window.location.pathname.includes("/employee/player")
          ? `flex justify-center   ${Color.background}`
          : ""
      }`}
    >
      <div
        //   className={`fixed bottom-2 left-2 ${
        className={`bg-opacity-30 ${Color.playerBG} rounded-lg p-4 ${
          player.isFloating
            ? floatMode
            : window.location.pathname.includes("/employee/player")
            ? normalMode
            : "hidden"
        }`}
        style={{ background: gradient }}
      >
        <div className="flex justify-between">
          <div className="mb-8 flex items-center">
            <div className="mr-3">
              <img
                src={currentTrack.image || noIcon}
                alt={currentTrack.title}
                className="rounded-lg w-16 h-16 object-cover border-2 border-gray-200"
              />
            </div>
            <div>
              <div className="font-bold text-lg">{currentTrack.title}</div>
              <div className="text-md">{currentTrack.artist}</div>
            </div>
          </div>
          <div>
            {window.location.pathname.includes("/employee/player") ? (
              ""
            ) : (
              <button
                className="text-white hover:text-sky-500"
                onClick={() =>
                  setPlayer((prev) => ({ ...prev, isFloating: false }))
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {window.location.pathname.includes("/employee/player") ? (
          <div className="relative mb-8 flex justify-center z-10">
            <div
              className={` circle-content ${
                player.isPlaying ? "breathing" : ""
              } circle-border`}
              style={{ "--dominant-color": dominantColor }}
            >
              <div
                className="relative"
                style={{ width: "250px", height: "250px" }}
              >
                <CircularProgressbar
                  strokeWidth={2}
                  value={progress}
                  size={10}
                  styles={buildStyles({
                    pathColor: "rgb(0, 161, 219)",
                    trailColor: "#d6d6d6",
                    strokeLinecap: "butt",
                    pathTransitionDuration: 0.5,
                  })}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    ref={imageRef}
                    src={currentTrack.image}
                    alt={currentTrack.title}
                    className={`w-56 h-56 rounded-full ${
                      player.isPlaying ? "spinning" : "paused"
                    }`}
                  />
                </div>
              </div>
              <h2 className="text-white text-center song-title">
                <div className="bg-gray-800/90 rounded-full w-32 h-32 flex justify-center items-center">
                  {formatTime(currentTime)}/{formatTime(duration)}
                </div>
              </h2>
            </div>
          </div>
        ) : (
          ""
        )}

        <AudioPlayer
          autoPlay={false}
          ref={audioRef}
          src={currentTrack.audioSrc}
          onPlay={handlePlayPause}
          onPause={handlePlayPause}
          onEnded={handleNext}
          showJumpControls={true}
          showSkipControls={true}
          onClickNext={handleNext}
          onClickPrevious={handlePrevious}
          loop={player.isLoop}
          style={{ backgroundColor : currentTrack.color }}
        />
      </div>
    </div>
  );
};

export default FloatingPlayer;
