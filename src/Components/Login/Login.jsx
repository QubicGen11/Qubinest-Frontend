import React, { useState } from "react";
import "./Login.css";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUser } from "../context/UserContext";
import config from "../config";
import useEmployeeStore from "../../store/employeeStore";

const Login = ({name}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setEmail: setUserEmail } = useUser();
  const { clearStore } = useEmployeeStore();

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      clearStore();
      localStorage.clear();

      const response = await axios.post(`${config.apiUrl}/qubinest/login`, { email, password });
      console.log(response);
      Cookies.set('email', email, { secure: true, sameSite: 'Strict' });
      setUserEmail(email);
      
      const existingEmails = JSON.parse(localStorage.getItem('userEmails')) || [];
      if (!existingEmails.includes(email)) {
        existingEmails.push(email);
      }
      localStorage.setItem('userEmails', JSON.stringify(existingEmails));

      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('loginTimestamp', Date.now().toString());

      setEmail('');
      setPassword('');
      toast.success(response.data.message || 'Login successful!');
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || 'Invalid Credentials';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Careersmain">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="logo">
        <img
          className="w-6/12"
          src="https://res.cloudinary.com/defsu5bfc/image/upload/v1715348582/og_6_jqnrvf.png"
          alt="QubiNest Logo"
        />
      </div>

      <div className="login-left flex justify-around">
        <div>
          <h1 className="text-white text-4xl font-bold font-sans relative z-50 h-[100vh] w-[30vw] flex justify-center items-center" id="welcome">
            WELCOME
          </h1>
        </div>
        <div className='loginform z-40 flex justify-center items-center' data-aos="flip-left">
          <div className="max-w-md relative flex flex-col rounded-lg text-black bg-[#EEF7FF] p-10" id="form">
            <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center px-9">
              Welcome to <span className="text-yellow-400">QubiNest</span>
            </div>
            <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
              Log in to your account
            </div>
            <form className="flex flex-col gap-3" onSubmit={onSubmit}>
              <div className="block relative">
                <label
                  htmlFor="email"
                  className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border bg-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                  autoComplete="email"
                />
              </div>
              <div className="block relative">
                <label
                  htmlFor="password"
                  className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded border bg-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2 ring-gray-900 outline-0"
                    autoComplete="current-password"
                  />
                  <span
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>
              <div>
                <a className="text-sm text-[#7747ff]" href="#">
                  Forgot your password?
                </a>

          

              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-max m-auto px-7 py-2 rounded flex items-center justify-center bg-yellow-400 text-black text-sm font-bold transform transition-all duration-500 ease-in-out hover:scale-110 hover:brightness-110 hover:animate-pulse active:animate-bounce disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  'SIGN IN'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
