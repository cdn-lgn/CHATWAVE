import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { setUser } from "../redux/authUserSlice";
import { verificationForTFA, secretPasskeyCheck } from '../services/TFA';

const loginUrl = `${import.meta.env.VITE_USER_API}/user/login`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secretPasskeyPrompt, setSecretPasskeyPrompt] = useState(false);
  const [secretPasskey, setSecretPasskey] = useState("");
  const [userId, setUserId] = useState(null);  // Added state to store userId
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Call login API
      const loginResponse = await axios.post(
        loginUrl,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // Save userId in state
      setUserId(loginResponse.data.userId);

      if (loginResponse?.data?.TFAStatus) {
        const TFACheck = await verificationForTFA({ userId: loginResponse?.data?.userId });

        if (TFACheck.data.verified) {
          dispatch(setUser(TFACheck.data.user));
          navigate("/");
        } else {
          setSecretPasskeyPrompt(true);
        }
      } else {
        dispatch(setUser(loginResponse.data.user));
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSecretPasskeySubmit = async () => {
    if (!secretPasskey) {
      setError("Please enter the secret passkey.");
      return;
    }

    try {
      if (!userId) {
        setError("User not found.");
        return;
      }
      const passkeyResponse = await secretPasskeyCheck({
        userId: userId,secretPasskey,
      });

      if (passkeyResponse.data.verified) {
        dispatch(setUser(passkeyResponse.data.user));
        navigate("/");
      } else {
        setError("Invalid secret passkey.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSecretPasskeyPrompt(false);
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <img
            src="/chat.png"
            alt="CHATWAVE Logo"
            className="w-16 h-16 mr-4 rounded-full"
          />
          <h1 className="text-3xl font-bold text-blue-600">CHATWAVE</h1>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Login to continue to Chatwave
          </p>

          <form onSubmit={loginUser} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                  />
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Signup
            </a>
          </p>
        </div>
      </div>

      {secretPasskeyPrompt && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Enter your Secret Passkey</h2>
            <input
              type="text"
              maxLength="10"
              value={secretPasskey}
              onChange={(e) => setSecretPasskey(e.target.value)}
              placeholder="Enter secret passkey"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setSecretPasskeyPrompt(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSecretPasskeySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
