import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPlay, FaPause, FaTrash } from "react-icons/fa";
import { Color } from "../../theme/Colors";
import { Link, useNavigate } from 'react-router-dom';

const AddTrack = () => {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioSrc, setAudioSrc] = useState(null);
  const [image, setImage] = useState(null);
  const [color, setColor] = useState("#3b82f6");
  const [tracks, setTracks] = useState([]);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/tracks/");
        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching tracks: ", error);
      }
    };

    fetchTracks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audioSrc", audioSrc);
    formData.append("image", image);
    formData.append("color", color);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/tracks/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Track added successfully!");
      setTracks((prevTracks) => [...prevTracks, response.data]);
      setTitle("");
      setArtist("");
      setAudioSrc(null);
      setImage(null);
      setColor("");
    } catch (error) {
      if (error.response && error.response.data.title) {
        toast.error("A track with this title already exists.");
      } else {
        toast.error("Error adding the Track");
      }
    }
  };
  const handlePlayPause = (index) => {
    const currentAudio = audioRefs.current[index];
    if (currentPlayingIndex === index) {
      currentAudio.pause();
      setCurrentPlayingIndex(null);
    } else {
      if (currentPlayingIndex !== null) {
        audioRefs.current[currentPlayingIndex].pause();
      }
      currentAudio.play();
      setCurrentPlayingIndex(index);
    }
  };

  const handleDelete = async (trackId) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${trackId}/`);
      setTracks(tracks.filter((track) => track.id !== trackId));
      toast.success("Track deleted successfully!");
    } catch (error) {
      console.error("Error deleting track: ", error);
      toast.error("Failed to delete track. Please try again.");
    }
  };

  return (
    <div className="flex justify-center mx-auto container ">
      <div className="flex flex-col lg:flex-row lg:w-2/3 gap-4">


      <Link to="/admin/settings">
          <div className="flex items-center mx-5 hover: transition-transform duration-300 cursor-pointer">
            <svg
              className="fill-sky-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              id="back-arrow"
            >
              <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
              <path d="M16.62 2.99c-.49-.49-1.28-.49-1.77 0L6.54 11.3c-.39.39-.39 1.02 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76z"></path>
            </svg>
            <p className="text-sky-500 font-semibold font google text-lg mx-3">
              To Settings Portal
            </p>
          </div>
        </Link>

        
      <div className="text-center">
          <h1 className="text-3xl font-semibold text-sky-700 mt-10">
            Manage Audio Therapy
          </h1>
        </div>

        <div className={` w-full`}>
          <div className={`py-6`}>
            <div className={`rounded-lg shadow-lg p-6 mb-6 ${Color.cardBox} `}>
              <h2 className="text-xl font-semibold mb-4">Add a Track</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block">Title</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-md  ${Color.textFeild} `}
                    placeholder="Enter track title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block ">Artist</label>
                  <input
                    id="artist"
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    required
                    className={`w-full px-3 py-2 rounded-md  ${Color.textFeild} `}
                    placeholder="Enter artist name"
                  />
                </div>
                <div className="mb-4">
                  <label className="block ">Audio File</label>
                  <input
                    id="audioSrc"
                    type="file"
                    onChange={(e) => setAudioSrc(e.target.files[0])}
                    accept="audio/mpeg3, audio/mp3"
                    required
                    className={`w-full px-3 py-2 rounded-md ${Color.textFeild} `}
                  />
                </div>
                <div className="mb-4">
                  <label className="block ">Image File</label>
                  <input
                    id="image"
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/png, image/jpeg, image/jpg"
                    required
                    className={`w-full px-3 py-2 rounded-md ${Color.textFeild} `}
                  />
                </div>
                <div className="mb-4">
                  <label className="block">Color</label>
                  <input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full rounded-md"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Track
                  </button>
                </div>
              </form>
            
            </div>
          </div>
          <ToastContainer />
        </div>

        <div className={`py-6 w-full `}>
          <div className={`rounded-lg shadow-lg p-6 mb-6  ${Color.cardBox} `}>
            <h1 className="text-xl">
              Currently Available Tracks : {tracks.length}
            </h1>
            <div
              className="mt-8 w-full max-w-lg custom-scrollbar "
              style={{ maxHeight: "472px", overflowY: "scroll" }}
            >
              {tracks.map((track, index) => (
                <div
                  key={index}
                  className={`flex ${Color.textFeild} items-center mb-4 p-1 rounded-lg`}
                >
                  <img
                    src={`http://127.0.0.1:8000${track.image}`}
                    alt={track.title}
                    className="w-20 h-20 rounded mr-4"
                  />
                  <div className="flex-1">
                    <p className="text-lg font-semibold">{track.title}</p>
                    <p className="text-sm">{track.artist}</p>
                    <p className="text-sm" style={{ color: track.color }}>
                      {track.color}
                    </p>
                  </div>
                  <button
                    onClick={() => handlePlayPause(index)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {currentPlayingIndex === index ? <FaPause /> : <FaPlay />}
                  </button>
                  <button
                    onClick={() => handleDelete(track.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                  >
                    <FaTrash />
                  </button>
                  <audio
                    ref={(el) => (audioRefs.current[index] = el)}
                    src={`http://127.0.0.1:8000${track.audioSrc}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTrack;
