import { useState } from "react";
import PropTypes from "prop-types";
import ToastNotification from "./ToastNotification";
import { useLocation } from "react-router-dom";
import { updatePassword } from "../utils/Note";
import { LuLock, LuShieldCheck, LuX } from "react-icons/lu";

const ConfirmPassword = ({ isVisible, onClose, onConfirm }) => {
  const location = useLocation();
  const { userData } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isVisible) return null;

  const validatePassword = (pwd) => {
    const errors = [];
    if (!/[a-zA-Z]/.test(pwd)) errors.push("at least one letter");
    if (!/[0-9]/.test(pwd)) errors.push("at least one number");
    if (pwd.length < 5) errors.push("at least 5 characters");

    if (errors.length > 0) {
      ToastNotification.error(`Password requires: ${errors.join(", ")}.`);
      return false;
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!password) {
      ToastNotification.error("Please enter a password");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      ToastNotification.error("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await updatePassword(userData[0], password);
      onConfirm(password);
      onClose();
    } catch (error) {
      console.error(error);
      ToastNotification.error("Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LuX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="p-3 bg-[#ff5f03]/10 dark:bg-[#ff5f03]/10 rounded-2xl mb-3 text-[#ff5f03] dark:text-[#ff5f03]">
            <LuShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">
            Change Password
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
            Secure your locker. Make sure you remember it!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                <LuLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                <LuLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="w-full py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmPassword.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmPassword;
