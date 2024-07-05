import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaTimes, FaHourglassEnd } from "react-icons/fa";
import FaceLogin from "./FaceLogin";
import { BtnColor } from "../theme/ButtonTheme";
import { Color } from "../theme/Colors";
import loginImage from "../../assets/login/login.png";
import loginBGImage from "../../assets/login/loginBG.jpg";
import Logo from "../../assets/logo/cclogo.png";

const media = "http://127.0.0.1:8000/media/assets/";

const Login = () => {
  const [formError, setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const [showFaceLogin, setShowFaceLogin] = useState(false);
  const [hasFaceLogin, setHasFaceLogin] = useState(false);

  const submitLoginForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.message === "Login successful") {
        setUserData(response.data);

        setFormError(false);
        if (response.data.is_staff) {
          navigate("/employee/dashboard");
        } else if (response.data.is_superuser) {
          navigate("/admin/dashboard");
        } else {
          navigate("/employee/dashboard");
        }
      } else if (response.data.message === "Invalid username or password") {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setFormError(true);
        setErrorMsg("Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setFormError(true);
      setErrorMsg("An error occurred during login");
      console.error(error);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openFaceLogin = () => {
    setShowFaceLogin(true);
  };

  const closeFaceLogin = () => {
    setShowFaceLogin(false);
  };

  return (
    <div className="relative flex flex-row h-screen w-screen">
      <ToastContainer />
      {/* Logo Text */}
      <div className="flex absolute top-4 left-4 text-4xl font-bold text-black">
        <div>CodeCalm</div>
        <div className="flex items-center">
          <img src={Logo} width={75} alt="logoImg" />
        </div>
      </div>

      <div
        className={`hidden md:flex lg:w-1/2 h-screen bg-cover justify-center ${Color.LoginleftSideBg} items-center`}
        // style={{ backgroundImage: `url(${loginBGImage})` }}
      >
        <div>
          <img src={loginImage} width={500} alt="Background" />
        </div>
      </div>

      <div
        className={`w-full lg:w-1/2 flex justify-center items-center ${Color.LoginrightSideBg}`}
        // style={{ backgroundImage: `url(${loginBGImage})` }}
      >
        <form
          onSubmit={submitLoginForm}
          className={`p-20 py-20 rounded-xl ${Color.cardBGText} `}
        >

            <div className="flex items-center justify-center pb-10">
              <img src={Logo} width={75} alt="logoImg" />
            </div>
       
          <div className="text-3xl w-64 text-center mb-10">
            Login
          </div>
          <div className="mb-6">
            <input
              placeholder="Company Email Address"
              className="w-full p-2 text-lg bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-sky-500"
              name="email"
              id="email"
              autoComplete="username"
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-10">
            <div className="relative">
              <input
                placeholder="Password"
                className="w-full p-2 text-lg bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-sky-500"
                name="password"
                id="password"
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div
              onClick={openFaceLogin}
              className="text-amber-500 cursor-pointer hover:underline"
            >
              <a className="text-sky-500 underline cursor-pointer">
                Try FaceLogin
              </a>
            </div>

            <button
              type="submit"
              className={`w-32 h-10 rounded-lg ${BtnColor.primary}`}
            >
              <div className={` justify-center flex`}>
                {" "}
                {loading ? (
                  <div className="animate-spin">
                    <FaHourglassEnd />{" "}
                  </div>
                ) : (
                  "Login"
                )}
              </div>
            </button>
          </div>
          <p className="text-center text-md mt-10 leading-9 tracking-tight text-red-500 font-google">
            {formError && errorMsg}
          </p>
        </form>

        {showFaceLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-5 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={closeFaceLogin}
              >
                <FaTimes size={24} />
              </button>
              <FaceLogin />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
