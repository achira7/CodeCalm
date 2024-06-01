import React, { useState, useEffect, useRef } from "react"
import AudioControls from "./MusicControl"

const Whitenoise = ({tracks}) => {
    
    const [trackIndex, setTrackIndex] = useState(0);
    const [trackProgress, setTrackProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
  
    const { title, artist, color, image, audioSrc } = tracks[trackIndex];
  
    const audioRef = useRef(new Audio(audioSrc));
    const intervalRef = useRef();
    const isReady = useRef(false);
  
    const { duration } = audioRef.current;
  
    const startTimer = () => {

      clearInterval(intervalRef.current);
  
      intervalRef.current = setInterval(() => {
        if (audioRef.current.ended) {
          toNextTrack();
        } else {
          setTrackProgress(audioRef.current.currentTime);
        }
      }, [1000]);
    };
  
    const onScrub = (value) => {

      clearInterval(intervalRef.current);
      audioRef.current.currentTime = value;
      setTrackProgress(audioRef.current.currentTime);
    };
  
    const onScrubEnd = () => {
      if (!isPlaying) {
        setIsPlaying(true);
      }
      startTimer();
    };
  
    const toPrevTrack = () => {
      if (trackIndex - 1 < 0) {
        setTrackIndex(tracks.length - 1);
      } else {
        setTrackIndex(trackIndex - 1);
      }
    };
  
    const toNextTrack = () => {
      if (trackIndex < tracks.length - 1) {
        setTrackIndex(trackIndex + 1);
      } else {
        setTrackIndex(0);
      }
    };
  
    useEffect(() => {
      if (isPlaying) {
        audioRef.current.play();
        startTimer();
      } else {
        audioRef.current.pause();
      }
    }, [isPlaying]);
  
    useEffect(() => {
      audioRef.current.pause();
  
      audioRef.current = new Audio(audioSrc);
      setTrackProgress(audioRef.current.currentTime);
  
      if (isReady.current) {
        audioRef.current.play();
        setIsPlaying(true);
        startTimer();
      } else {
        isReady.current = true;
      }
    }, [trackIndex]);
  
    useEffect(() => {
      return () => {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      };
    }, []);

    return (

        <div className="audio-player">
        <div className="track-info">
          <img
            className="artwork"
            src={image}
            alt={`track artwork for ${title} by ${artist}`}
          />
          <h2 className="title pt-3">{title}</h2>
          <h3 className="artist">{artist}</h3>
          <AudioControls className="p-5"
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
          />
          <input
            type="range"
            value={trackProgress}
            step="1"
            min="0"
            max={duration ? duration : `${duration}`}
            className="progress"
            onChange={(e) => onScrub(e.target.value)}
            onMouseUp={onScrubEnd}
            onKeyUp={onScrubEnd}
          />
        </div>
        <Backdrop
          trackIndex={trackIndex}
          activeColor={color}
          isPlaying={isPlaying}
        />
      </div>
        
            )}

export default Whitenoise