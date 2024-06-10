import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { useSetRecoilState } from 'recoil';

//import { userIdAtom, userFirstNameAtom, userLastNameAtom, userIsStaffAtom, userIsSuperuserAtom, userProfilePictureAtom, userEmailAtom } from '../atoms';

const media = 'http://127.0.0.1:8000/media/assets/'

const Login = () => {
  const [formError, setFormError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userData, setUserData] = useState({})

  const navigate = useNavigate();

  /*const setUserId = useSetRecoilState(userIdAtom);
  const setUserFirstName = useSetRecoilState(userFirstNameAtom);
  const setUserLastName = useSetRecoilState(userLastNameAtom);
  const setUserEmail = useSetRecoilState(userEmailAtom);
  const setUserIsStaff = useSetRecoilState(userIsStaffAtom);
  const setUserIsSuperuser = useSetRecoilState(userIsSuperuserAtom);
  const setUserProfilePicture = useSetRecoilState(userProfilePictureAtom);*/

  const submitLoginForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        email,
        password
      }, { withCredentials: true });

      if (response.data.message === 'Login successful') {
        setUserData(response.data)
        /*setUserId(response.data.user.id);
        setUserFirstName(response.data.user.first_name);
        setUserLastName(response.data.user.last_name);
        setUserEmail(response.data.user.email);
        setUserIsStaff(response.data.user.is_staff);
        setUserIsSuperuser(response.data.user.is_superuser);
        setUserProfilePicture(response.data.user.profile_picture);*/

        setFormError(false);
        if (response.data.is_staff) {
          navigate("/admin/dashboard");
        } else if (response.data.is_superuser) {
          navigate("/admin/dashboard");
        }else{
          navigate("/employee/dashboard");
        }
      } 
      else if (response.data.message === 'Invalid username or password')  {
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
  };

  return (
    <div className="items-center">
      <div className="h-3/5 flex items-center justify-center bg-center bg-cover flex-1 bg-[url('../assets/login-page-backgroundimage.jpg')]">
        <div className="h-screen flex items-center justify-center w-1/2">
          <div className="flex bg-gradient-to-t from-sky-400 to-blue-500 w-1/2 h-3/4 items-center justify-center">
            <div className="flex flex-col items-center justify-center h-screen">
              <img
                className="h-20 my-2 drop-shadow-md shadow-blue-600/50"
                src={`${media}codecalm-logo-colored.png`}
              />
              <h1 className="text-4xl font-google font-bold text-white drop-shadow-xl shadow-blue-600/50">
                CodeCalm
              </h1>
            </div>
            <ToastContainer/>
          </div>

          <div className="flex bg-sky-50 w-1/2 h-3/4 items-center align-center flex-col justify-center">
            <div className="flex bg-sky-50 w-1/2 h-3/4 items-center align-center flex-col justify-center">
              <div className="flex min-h-full flex-col justify-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                  <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 font-google">
                    Codecalm Login
                  </h2>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={submitLoginForm}
                >
                  <div>
                    <p className="text-center text-md leading-9 tracking-tight text-red-500 font-google">
                      {formError && errorMsg}
                    </p>

                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold leading-6 text-gray-600 font-google"
                    >
                      Company Email Address
                    </label>
                    <div className="mt-2">
                      <input
                        name="email"
                        id="email"
                        autoComplete="username"
                        type="email"
                        required
                        onChange={e => setEmail(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-sky-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-semibold leading-6 text-gray-600 font-google"
                      >
                        Password
                      </label>
                    </div>
                    <div className="mt-2">
                      <input
                        name="password"
                        id="password"
                        autoComplete="current-password"
                        type="password"
                        required
                        onChange={e => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 px-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2  focus:ring-sky-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                  <div>
                    <a href="/employee/facelogin"> Try FaceLogin </a>
                  </div>

                  <div>
                    <input type="submit"
                      value="Log in"
                      name="submit"
                      className="flex w-full justify-center rounded-md disabled:bg-green-200 disabled:text-gray-400 bg-green-300 px-3 py-1.5 font-google text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-300" />
                     
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
