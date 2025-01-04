import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { setUser } from "../utils/setUser";
import ToastNotification from "../components/ToastNotification";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = location.state || {};

  const handleRegister = async () => {
    if (password.length < 3) {
      ToastNotification.error("Password must be at least 3 characters long");
    } else {
      if (password === confirmPassword) {
        await setUser(user, password);
        navigate(`/${user}/notes`);
      } else {
        ToastNotification.error("Passwords do not match. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm w-full border border-gray-300">
        <p className="text-2xl font-bold mb-4 text-start text-gray-500">
          {user}: This note is available 🎉 you can create
        </p>
        <p className="text-2xl font-bold mb-4 text-start text-gray-800">
          Enter password to continue:
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="border rounded px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your password"
          className="border rounded px-4 py-2 mb-4 w-full focus:ring-2 focus:ring-gray-500 focus:outline-none"
        />
        <button
          onClick={handleRegister}
          className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition duration-300"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default Register;
