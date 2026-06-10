import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ToastNotification from "../components/ToastNotification";
import { fetchUser } from "../utils/fetchUser";
import { hashPassword } from "../utils/crypto";
import { LuLock, LuArrowRight } from "react-icons/lu";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get user data from the previous page
  const location = useLocation();
  const { userData: userFromLocation } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (userFromLocation) {
          setUserData(userFromLocation);
        } else {
          const result = await fetchUser(username);
          if (result.exists) {
            setUserData(result.userData);
          } else {
            ToastNotification.error(`No user named ${username} found.`);
            navigate("/register", { state: { user: username } });
          }
        }
      } catch (error) {
        ToastNotification.error("Error fetching user data.");
        console.log(error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchData();
  }, [username, userFromLocation, navigate]);

  const handleLogin = async () => {
    if (!password) {
      ToastNotification.warning("Please enter your password.");
      return;
    }

    if (userData && userData.length > 0) {
      setIsSubmitting(true);
      const realPassword = userData[0].password;
      const enteredHash = await hashPassword(password);

      // Support both plaintext fallback (for old users) and secure hashing (for new users)
      if (enteredHash === realPassword || password === realPassword) {
        ToastNotification.success("Access granted!");
        onLogin(username);
        navigate(`/${username || userData[0].name}/notes`, {
          state: { userData: userData },
        });
      } else {
        ToastNotification.warning("Invalid password. Please try again!");
      }
      setIsSubmitting(false);
    } else {
      ToastNotification.error("User data not found!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#EFEFEF] dark:bg-[#07070a]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ff5f03]"></div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 font-medium">Checking locker status...</p>
      </div>
    );
  }

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
      <div className="w-full max-w-sm bg-white/90 dark:bg-slate-900/95 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/80 shadow-2xl rounded-3xl p-8 relative z-10 transition-colors duration-300">
        <div className="flex flex-col items-center mb-6">
          <div 
            onClick={() => navigate("/")}
            className="w-12 h-12 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer mb-4 shrink-0 shadow-md"
          >
            <span className="text-xs font-bold text-white dark:text-gray-950 tracking-tight">NL</span>
          </div>
          <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white text-center">
            Locker is Taken
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
            Locker <span className="font-semibold text-[#ff5f03]">/{username}</span> is already claimed. Enter password to unlock.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative flex items-center bg-white/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-full focus-within:ring-2 focus-within:ring-[#ff5f03]/20 focus-within:border-[#ff5f03] transition-all duration-300">
              <span className="pl-4 text-slate-400 dark:text-slate-500 shrink-0">
                <LuLock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter password to unlock"
                className="w-full pl-2.5 pr-4 py-3 bg-transparent border-0 focus:ring-0 focus:outline-none text-xs sm:text-sm text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Premium Hover Roll Button */}
          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className="group w-full flex items-center justify-between gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white pl-6 pr-2 py-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98] shadow-md shadow-gray-900/10 hover:shadow-gray-900/20"
          >
            <div className="h-[20px] overflow-hidden relative">
              <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSubmitting ? "Unlocking..." : "Unlock Locker"}</span>
                <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSubmitting ? "Unlocking..." : "Unlock Locker"}</span>
              </div>
            </div>
            <div className="w-7 h-7 bg-white/20 dark:bg-slate-950/10 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 shrink-0">
              <LuArrowRight className="w-4 h-4 text-white dark:text-slate-950" />
            </div>
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 text-slate-405 hover:text-slate-800 dark:text-slate-500 dark:hover:text-white text-sm font-medium transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
