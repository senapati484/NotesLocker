/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import ToastNotification from "./ToastNotification";
import { useLocation } from "react-router-dom";
import { updatePassword } from "../utils/Note";

/* eslint-disable react/prop-types */
const ConfirmPassword = ({ isVisible, onClose, onConfirm }) => {
  if (!isVisible) return null;

  const location = useLocation();
  const { userData } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleConfirm = () => {
    if (!password) {
      ToastNotification.error("Please enter a password");
    } else {
      if (password.length < 3) {
        ToastNotification.error("Password must be at least 3 characters long");
      } else {
        if (password == confirmPassword) {
          updatePassword(userData[0].name, password);
          onConfirm(password);
        } else {
          ToastNotification.error("Passwords are not maching");
        }
      }
    }
  };

  // useEffect(() => {
  //   console.log(userData[0].name);
  // });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-4 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 text-start">Change Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="w-full border rounded-md px-3 py-2 mb-4"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-Enter Password"
          className="w-full border rounded-md px-3 py-2 mb-4"
        />
        <button
          onClick={handleConfirm}
          className="px-4 py-2 w-full text-center bg-black text-white rounded-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ConfirmPassword;
