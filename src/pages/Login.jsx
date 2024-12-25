/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// toast messages
import ToastNotification from "../components/ToastNotification";
import { fetchUser } from "../utils/fetchUser";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  // Get user data from the previous page
  const location = useLocation();
  const { userData: userFromLocation } = location.state || {};

  useEffect(() => {
    if (userFromLocation) {
      // If user data is available from the location state, set it
      setUserData(userFromLocation);
    } else {
      // If not, fetch user data from Firebase
      fetchUser(username, navigate, setUserData);
    }
  }, [username, userFromLocation, navigate]);

  const handleLogin = () => {
    if (userData && userData.length > 0) {
      const realPassword = userData[0].password;

      if (password === realPassword) {
        ToastNotification.success("Login successful!");
        onLogin(username);
        navigate(`/${username || userData[0].username}/notes`);
      } else {
        ToastNotification.warning("Please enter the correct password!");
      }
    } else {
      ToastNotification.error("User data not found!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm w-full border border-gray-300">
        <p className="text-2xl font-bold mb-4 text-start text-gray-500">
          {username}: This note is already taken 🚀. If it's yours
        </p>
        <p className="text-2xl font-bold mb-4 text-start text-gray-800">
          Enter your password to continue:
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="border rounded px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
