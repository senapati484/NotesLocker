import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { setUser } from "../utils/setUser";
import ToastNotification from "../components/ToastNotification";
import { LuCheck, LuX, LuLock, LuArrowRight } from "react-icons/lu";

const RequirementItem = ({ checked, text }) => (
  <div className="flex items-center space-x-2 text-xs">
    {checked ? (
      <LuCheck className="text-emerald-500 w-4 h-4 shrink-0" />
    ) : (
      <LuX className="text-slate-350 dark:text-slate-600 w-4 h-4 shrink-0" />
    )}
    <span className={checked ? "text-slate-600 dark:text-slate-300" : "text-slate-400 dark:text-slate-500"}>
      {text}
    </span>
  </div>
);

RequirementItem.propTypes = {
  checked: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
};

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = location.state || {};

  // Password requirements
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isMinLength = password.length >= 5;

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

  const handleRegister = async () => {
    if (!user) {
      ToastNotification.error("No username provided. Please go back.");
      navigate("/");
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      ToastNotification.error("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await setUser(user, password);
      if (onLogin) {
        onLogin(user);
      } else {
        navigate(`/${user}/notes`);
      }
    } catch (error) {
      console.error(error);
      ToastNotification.error("Failed to register. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden px-4 transition-colors duration-300">
      
      {/* Animated Shader Background Stack */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#EFEFEF] dark:bg-[#07070a]">
        {/* Swirl base gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ffffff] to-[#f0f0f0] dark:from-[#090d16] dark:to-[#020408] opacity-100"></div>
        
        {/* ChromaFlow orange blobs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[70%] bg-[#ff5f03]/20 dark:bg-[#ff5f03]/12 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] blur-[80px] sm:blur-[120px] animate-chroma-orange"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-[#ff5f03]/15 dark:bg-[#ff5f03]/8 rounded-[50%_40%_60%_50%_/_50%_60%_40%_50%] blur-[90px] sm:blur-[130px] animate-chroma-orange animation-delay-2000"></div>
        
        {/* FlutedGlass refraction layer */}
        <div className="absolute inset-0 fluted-glass-overlay"></div>
        
        {/* FilmGrain overlay */}
        <div className="absolute inset-0 film-grain opacity-80"></div>
      </div>

      {/* Glassmorphic Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-8 relative z-10 transition-colors duration-300">
        <div className="flex flex-col items-center mb-6">
          <div 
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer mb-4 shrink-0 shadow-md"
          >
            <span className="text-xs font-bold text-white dark:text-gray-950 tracking-tight">NL</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white text-center">
            Claim your locker
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            The username <span className="font-semibold text-[#ff5f03]">/{user}</span> is available! Set a password to protect your notes.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Create Password
            </label>
            <div className="relative flex items-center bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-full focus-within:ring-2 focus-within:ring-[#ff5f03]/20 focus-within:border-[#ff5f03] transition-all duration-300">
              <span className="pl-4 text-slate-400 dark:text-slate-500 shrink-0">
                <LuLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-2.5 pr-4 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <div className="relative flex items-center bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-full focus-within:ring-2 focus-within:ring-[#ff5f03]/20 focus-within:border-[#ff5f03] transition-all duration-300">
              <span className="pl-4 text-slate-400 dark:text-slate-500 shrink-0">
                <LuLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-2.5 pr-4 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Password Requirements Grid */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/50">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
              Password Requirements
            </p>
            <div className="grid grid-cols-2 gap-2">
              <RequirementItem checked={isMinLength} text="5+ Characters" />
              <RequirementItem checked={hasLetter} text="Contains Letters" />
              <RequirementItem checked={hasNumber} text="Contains Numbers" />
            </div>
          </div>

          {/* Premium Hover Roll Button */}
          <button
            onClick={handleRegister}
            disabled={isSubmitting}
            className="group w-full flex items-center justify-between gap-2 bg-[#ff5f03] hover:bg-[#e04f02] text-white pl-6 pr-2 py-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98] shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25"
          >
            <div className="h-[20px] overflow-hidden relative">
              <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSubmitting ? "Creating Locker..." : "Create Locker"}</span>
                <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSubmitting ? "Creating Locker..." : "Create Locker"}</span>
              </div>
            </div>
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shrink-0">
              <LuArrowRight className="w-4 h-4 text-[#ff5f03]" />
            </div>
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white text-sm font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

Register.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Register;
