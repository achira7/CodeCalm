import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCamera } from "react-icons/fa";

const FaceLoginRegistration = ({ userId }) => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showCapturedImage, setShowCapturedImage] = useState(false);
  const [registrationStarted, setRegistrationStarted] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const [userData, setUserData] = useState({});

  const prompts = [
    "Look straight ahead",
    "Look to your left",
    "Look to your right",
    "Look up",
    "Look down",
    "Wear your glasses (if applicable)",
  ];

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getuser/", {
        withCredentials: true,
      });
      const user = response.data;
      setUserData(user);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const startRegistration = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/startfaceregister/",
        { user_id: userData.id },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.message === "Registration started successfully") {
        toast.success("Registration started successfully");
        setRegistrationStarted(true);
      } else if (response.data.message === "Resume Registration") {
        setRegistrationStarted(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error starting registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setShowCapturedImage(true);
      setCapturedImage(imageSrc);
    }
  };

  const saveImage = async () => {
    try {
      const formData = new FormData();
      formData.append("image", capturedImage);
      formData.append("user_id", userData.id);

      const response = await axios.post(
        "http://localhost:8000/api/faceregister/",
        formData,
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
          },
        }
      );

      if (response.data.message === "Image saved successfully") {
        toast.success("Image saved successfully");
        setCurrentPromptIndex(currentPromptIndex + 1);
        setShowCapturedImage(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const retakeImage = () => {
    setShowCapturedImage(false);
    setCapturedImage(null);
  };

  const completeRegistration = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/completefaceregister/",
        { user_id: userData.id },
        {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
          },
        }
      );

      if (response.data.message === "Registration completed successfully") {
        toast.success("Registration completed successfully");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error completing registration:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto py-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-sky-900 mb-4">
            Face Registration
          </h2>
          {!registrationStarted ? (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={startRegistration}
            >
              Start FaceLogin Registration
            </button>
          ) : (
            <div className="flex flex-col items-center">
              {!showCapturedImage ? (
                <>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    height={500}
                    width={500}
                    screenshotFormat="image/jpeg"
                    className="mb-4 rounded-lg"
                  />
                  <p className="text-blue-500 mb-4">
                    {prompts[currentPromptIndex]}
                  </p>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center mb-4"
                    onClick={captureImage}
                    disabled={capturing}
                  >
                    <FaCamera className="mr-2" /> Capture Image
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="mb-4 rounded-lg"
                  />
                  <div className="flex space-x-4">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={retakeImage}
                    >
                      Retake
                    </button>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={saveImage}
                    >
                      Save
                    </button>

                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = capturedImage;
                        link.download = `captured_image_${
                          currentPromptIndex + 1
                        }.jpg`;
                        link.click();
                      }}
                    >
                      Download Image
                    </button>
                  </div>
                </>
              )}
              {currentPromptIndex >= prompts.length && (
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mt-4"
                  onClick={completeRegistration}
                >
                  Complete Registration
                </button>
              )}
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default FaceLoginRegistration;
