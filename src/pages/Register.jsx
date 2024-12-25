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
    if (password === confirmPassword) {
      await setUser(user, password);
      navigate(`/${user}/notes`);
    } else {
      ToastNotification.error("Passwords do not match. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user}</h1>
      <p className="mb-2">Please enter your password to continue:</p>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        className="border rounded px-3 py-2 mb-4 w-64"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Re-enter your password"
        className="border rounded px-3 py-2 mb-4 w-64"
      />
      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create
      </button>
    </div>
  );
};

export default Register;
