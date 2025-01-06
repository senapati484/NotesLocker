import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { setUser } from "../utils/setUser";
import ToastNotification from "../components/ToastNotification";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user } = location.state || {};

  // Function to validate password
  const validatePassword = (password) => {
    const errors = [];
    if (!/[A-Z]/.test(password)) errors.push("uppercase");
    if (!/[a-z]/.test(password)) errors.push("lowercase");
    if (!/[0-9]/.test(password)) errors.push("number");
    if (!/[^A-Za-z0-9]/.test(password)) errors.push("symbol");
    if (password.length <= 5) errors.push("at least 6 characters");

    if (errors.length > 0) {
      ToastNotification.error(`Password must contain ${errors.join(", ")}.`);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validatePassword(password)) {
      return;
    }

    if (password === confirmPassword) {
      try {
        await setUser(user, password);
        navigate(`/${user}/notes`);
      } catch (error) {
        console.log(error);
        ToastNotification.error("Failed to register. Please try again.");
      }
    } else {
      ToastNotification.error("Passwords do not match. Please try again.");
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
