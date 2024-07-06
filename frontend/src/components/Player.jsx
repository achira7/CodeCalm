import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "tailwindcss/tailwind.css";
import "./PlayerStyles.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { playerState, tracksState } from "../atoms";
import song from '../../assets/temp/song.mp3';
import { Color } from "../theme/Colors";

const Player = () => {
  const [player, setPlayer] = useRecoilState(playerState);
  const tracks = useRecoilValue(tracksState);
  const setTracks = useSetRecoilState(tracksState);


  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tracks/");
        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching tracks: ", error);
      }
    };


    // fetchTracks()

    
    setTracks([
      {
        title: "White Noise",
        artist: "CodeCalm",
        audioSrc: song,
        image: 'https://plus.unsplash.com/premium_photo-1689974465650-b223928cdc9e?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        color: "#00aeb0"
      },
      {
        title: "Rain",
        artist: "CodeCalm",
        audioSrc: 'http://127.0.0.1:8000/media/audio/rain.mp3',
        image: '',
        color: "#ffb77a"
      },
      {
        title: "Sea",
        artist: "CodeCalm",
        audioSrc: 'http://127.0.0.1:8000/media/audio/sea.mp3',
        image: '',
        color: "#5f9fff"
      }
    ]);
  }, []);


  useEffect(()=>{
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
    <div className={`${Color.background} flex flex-col items-center `}>      
      <button
        onClick={() => setPlayer((prev) => ({ ...prev, isFloating: !prev.isFloating }))}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        {player.isFloating ? "Switch to Normal Mode" : "Switch to Floating Mode"}
      </button>
      <div className="h-screen">
      </div>
    </div>
  );
};

export default Player;
