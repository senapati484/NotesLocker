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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome, {username}</h1>
      <p className="mb-2">Please enter your password to continue:</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="border rounded px-3 py-2 mb-4 w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
