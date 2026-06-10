import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LuLock, LuGlobe, LuShield, LuTerminal, LuSun, LuMoon, 
  LuClock, LuChevronRight, LuFileText, LuMenu, LuX, LuArrowRight, LuSparkles
} from "react-icons/lu";
import Collapsible from "../components/Collapsable";
import { fetchUser } from "../utils/fetchUser";
import ToastNotification from "../components/ToastNotification";

const faqData = [
  {
    question: "Do you store any personal information?",
    answer: "Absolutely not. We do not require emails, names, or phone numbers. Your username is the only identifier, keeping you completely anonymous.",
  },
  {
    question: "Can I recover my notes if I forget my password?",
    answer: "No. Since we prioritize security and anonymity, we don't have recovery emails or backdoors. Your password is your only key.",
  },
  {
    question: "Can I backup or export my notes?",
    answer: "Yes! Once inside your locker, you can read and copy your notes, or save them locally. We store notes securely on the cloud so they are accessible from anywhere.",
  },
  {
    question: "Can I share my notes with others?",
    answer: "Currently, you can share your locker's username and password with trusted friends to view the same notes. Future updates will introduce secure note sharing options.",
  },
  {
    question: "How do you secure my password?",
    answer: "Passwords are encrypted client-side using SHA-256 before ever being stored in our Firestore database. This ensures your key stays private.",
  },
];

const features = [
  {
    icon: <LuLock className="w-5 h-5 text-[#ff5f03]" />,
    title: "Client-Side Hashing",
    description: "Passwords are encrypted via SHA-256 before leaving your browser, keeping your keys private.",
  },
  {
    icon: <LuShield className="w-5 h-5 text-emerald-555 dark:text-emerald-400" />,
    title: "Absolute Anonymity",
    description: "No email verification, sign-up forms, or tracking cookies. Just enter a name and start writing.",
  },
  {
    icon: <LuGlobe className="w-5 h-5 text-sky-555 dark:text-sky-400" />,
    title: "Zero Data-Loss Sync",
    description: "Every character auto-saves to the cloud with smart conflict resolution when switching notes.",
  },
  {
    icon: <LuTerminal className="w-5 h-5 text-amber-555 dark:text-amber-400" />,
    title: "Open Source Code",
    description: "Full repository transparency. Inspect, audit, or deploy your own server from GitHub.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [londonTime, setLondonTime] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuAnimate, setIsMobileMenuAnimate] = useState(false);
  const inputRef = useRef(null);

  const handleFocusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    setTimeout(() => setIsMobileMenuAnimate(true), 10);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuAnimate(false);
    setTimeout(() => setIsMobileMenuOpen(false), 500);
  };

  // Initialize darkMode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Scroll listener for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // London Clock updater
  useEffect(() => {
    const updateLondonTime = () => {
      const now = new Date();
      const options = {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setLondonTime(now.toLocaleTimeString("en-GB", options));
    };
    updateLondonTime();
    const interval = setInterval(updateLondonTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleGetStarted = async () => {
    const cleanUsername = user.trim().toLowerCase();
    if (!cleanUsername) {
      ToastNotification.warning("Please enter a username.");
      return;
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(cleanUsername)) {
      ToastNotification.error("Username can only contain alphanumeric characters, hyphens, and underscores.");
      return;
    }

    try {
      setIsSearching(true);
      const result = await fetchUser(cleanUsername);
      if (result.exists) {
        navigate(`/${cleanUsername}`, { state: { userData: result.userData } });
      } else {
        navigate("/register", { state: { user: cleanUsername } });
      }
    } catch (error) {
      ToastNotification.warning(error.message || "Failed to query database.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFEFEF] dark:bg-[#07070a] text-slate-900 dark:text-slate-100 transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
      
      {/* Floating pill navigation */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 lg:px-8 transition-all duration-500 bg-transparent ${
        isScrolled ? "py-3" : "py-6"
      }`}>
        <nav className="w-full max-w-[1440px] mx-auto p-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/55 dark:border-slate-800/50 rounded-full shadow-md flex items-center justify-between">
          {/* LEFT: Logo & Nav Links */}
          <div className="flex items-center space-x-6 pl-2 py-1">
            <div 
              onClick={() => navigate("/")}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <span className="text-[10px] sm:text-[11px] font-bold text-white dark:text-gray-950 tracking-tight">NL</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-900 dark:text-gray-250">
              <a href="#about" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">Features</a>
              <a href="#projects" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">Quickstart</a>
              <a href="#faqs" className="hover:text-gray-500 dark:hover:text-gray-400 transition-colors duration-300">FAQs</a>
            </div>
          </div>

          {/* RIGHT: Status, Clock, CTA */}
          <div className="flex items-center space-x-3 pr-2.5">
            {/* Tagline */}
            <span className="hidden lg:inline text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              Securing thoughts & secrets in 2026
            </span>

            {/* London Time Clock */}
            <div className="hidden md:flex items-center space-x-1 text-[13px] text-gray-500 dark:text-gray-400 font-medium">
              <LuClock className="w-3.5 h-3.5 text-gray-450 dark:text-gray-500 shrink-0" />
              <span>{londonTime} in London</span>
            </div>

            {/* Theme Toggle inside navbar */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <LuSun className="w-4 h-4 text-amber-500" /> : <LuMoon className="w-4 h-4" />}
            </button>

            {/* Strategy Call Button -> Claim Locker Trigger */}
            <button
              onClick={handleFocusInput}
              className="group hidden md:flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-950 text-white pl-5 pr-2 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98]"
            >
              <div className="h-[20px] overflow-hidden relative">
                <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                  <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">Claim Locker</span>
                  <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">Claim Locker</span>
                </div>
              </div>
              <div className="w-6 h-6 bg-white/20 dark:bg-slate-955/10 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <LuArrowRight className="w-3.5 h-3.5 text-white dark:text-slate-950" />
              </div>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={openMobileMenu}
              className="md:hidden flex items-center justify-center p-2 rounded-full bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-gray-950 transition-all duration-300"
              aria-label="Toggle Mobile Menu"
            >
              <LuMenu className="w-4.5 h-4.5" />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
              isMobileMenuAnimate ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          ></div>
          
          {/* Bottom Sheet */}
          <div className={`w-full bg-white dark:bg-slate-900 rounded-2xl mx-3 mb-3 p-6 z-10 shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            isMobileMenuAnimate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}>
            <div className="flex justify-between items-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-305 rounded-full">
                <LuClock className="w-3.5 h-3.5 text-gray-450" />
                <span>{londonTime} in London</span>
              </span>
              <button 
                onClick={closeMobileMenu}
                className="w-8 h-8 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              >
                <LuX className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 mb-8 text-left">
              <a 
                href="#about" 
                onClick={closeMobileMenu}
                className="text-3xl font-semibold text-gray-900 dark:text-white hover:text-[#ff5f03] transition-colors"
              >
                Features
              </a>
              <a 
                href="#projects" 
                onClick={closeMobileMenu}
                className="text-3xl font-semibold text-gray-900 dark:text-white hover:text-[#ff5f03] transition-colors"
              >
                Quickstart
              </a>
              <a 
                href="#faqs" 
                onClick={closeMobileMenu}
                className="text-3xl font-semibold text-gray-900 dark:text-white hover:text-[#ff5f03] transition-colors"
              >
                FAQs
              </a>
            </div>

            <button
              onClick={() => {
                closeMobileMenu();
                handleFocusInput();
              }}
              className="group w-full flex items-center justify-center gap-2 bg-[#ff5f03] hover:bg-[#e04f02] text-white py-3.5 rounded-xl transition-all duration-300 active:scale-[0.98]"
            >
              <span className="text-sm font-semibold whitespace-nowrap">Claim Locker</span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <LuChevronRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 1: HERO (Full viewport height) */}
      <section className="min-h-screen flex flex-col justify-between relative overflow-hidden px-5 sm:px-8 lg:px-12 pt-28 pb-14 sm:pb-16 lg:pb-20">
        
        {/* Full screen animated shader overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden bg-[#EFEFEF] dark:bg-[#07070a]">
          {/* Swirl base texture */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffffff] to-[#f0f0f0] dark:from-[#090d16] dark:to-[#020408] opacity-100"></div>
          
          {/* ChromaFlow dynamic blobs */}
          <div className="absolute top-[-20%] left-[-10%] w-[65%] h-[75%] bg-[#ff5f03]/25 dark:bg-[#ff5f03]/15 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] blur-[90px] sm:blur-[130px] animate-chroma-orange"></div>
          <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[65%] bg-[#ff5f03]/20 dark:bg-[#ff5f03]/10 rounded-[50%_40%_60%_50%_/_50%_60%_40%_50%] blur-[90px] sm:blur-[130px] animate-chroma-orange animation-delay-2000"></div>
          <div className="absolute top-[30%] left-[35%] w-[40%] h-[50%] bg-[#ff5f03]/12 dark:bg-[#ff5f03]/7 rounded-[60%_40%_50%_50%_/_40%_50%_60%_50%] blur-[80px] sm:blur-[110px] animate-chroma-orange animation-delay-4000"></div>
          
          {/* FlutedGlass overlay */}
          <div className="absolute inset-0 fluted-glass-overlay"></div>
          
          {/* FilmGrain strength 0.05 */}
          <div className="absolute inset-0 film-grain opacity-85"></div>
        </div>

        {/* Top spacer to push content to bottom */}
        <div className="flex-1"></div>

        {/* Hero Headline content (z-20) */}
        <div className="w-full max-w-[1440px] mx-auto z-20 relative text-left">
          
          {/* Small label button */}
          <button
            className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-white/80 dark:bg-indigo-950/40 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-indigo-900/40 mb-6 hover:scale-[1.02] active:scale-95 transition-all text-xs font-semibold"
            onClick={handleFocusInput}
          >
            <LuSparkles className="w-3.5 h-3.5 animate-pulse text-[#ff5f03]" />
            <span>Open-source zero-knowledge cloud notepad</span>
          </button>

          {/* Headline H1 with clamp sizing */}
          <h1 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white max-w-5xl">
            A private cloud locker <br className="hidden sm:block" />
            for your thoughts <span className="bg-gradient-to-r from-[#ff5f03] to-[#ff8f43] bg-clip-text text-transparent">&</span> secrets.
          </h1>
          
          <p className="text-sm sm:text-base text-gray-605 dark:text-gray-400 mt-5 max-w-lg leading-relaxed">
            Zero logs. Client-side hashing. Automatic cloud synchronization. Start typing instantly without an account.
          </p>

          {/* CTA Row */}
          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row items-stretch md:items-center gap-5">
            {/* Claim Locker Input Form Card */}
            <div className="p-1.5 bg-white/90 dark:bg-slate-900/95 border border-gray-200/50 dark:border-slate-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-full flex items-center max-w-md w-full focus-within:ring-2 focus-within:ring-[#ff5f03]/20 focus-within:border-[#ff5f03] transition-all duration-300">
              <div className="flex items-center flex-1 min-w-0 pl-4">
                <span className="text-gray-400 text-xs sm:text-[13px] font-medium select-none">noteslocker.app/</span>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="locker-name"
                  className="flex-1 min-w-0 bg-transparent border-0 p-0 pl-0.5 focus:ring-0 focus:outline-none text-gray-900 dark:text-white font-medium text-xs sm:text-[13px]"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
                />
              </div>

              {/* Orange CTA button with text-roll */}
              <button
                onClick={handleGetStarted}
                disabled={isSearching}
                className="group flex items-center justify-center gap-2 bg-[#F26522] hover:bg-[#e05a1a] text-white pl-5 pr-2 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98] shrink-0"
              >
                <div className="h-[20px] overflow-hidden relative">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSearching ? "Checking..." : "Claim Locker"}</span>
                    <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">{isSearching ? "Checking..." : "Claim Locker"}</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <LuArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                </div>
              </button>
            </div>

            {/* Partner Badge (Blocked/Commented out for future implementation)
            <div className="inline-flex items-center gap-2.5 bg-white dark:bg-slate-900/90 backdrop-blur-md border border-gray-200/50 dark:border-slate-800/80 rounded-[4px] px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all duration-300 w-fit shrink-0">
              <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current text-[#E8704E] shrink-0" viewBox="0 0 100 100">
                <path d="m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z" />
              </svg>
              <span className="text-[13px] sm:text-sm font-medium text-gray-900 dark:text-gray-205">Certified Partner</span>
              <span className="text-[9px] sm:text-[10px] font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1.5 py-0.5 rounded">Featured</span>
            </div>
            */}
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES (White background) */}
      <section id="about" className="bg-white dark:bg-slate-950 pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden relative z-20 transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          {/* Badge row */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-[11px] sm:text-[12px] font-semibold">
              1
            </div>
            <span className="border border-gray-200 dark:border-slate-800 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium text-gray-900 dark:text-gray-300">
              Introducing Security
            </span>
          </div>

          {/* Heading h2 with clamp sizing */}
          <h2 className="text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 dark:text-white mb-12 sm:mb-16 lg:mb-28 max-w-4xl">
            Strategy-led security, built <br className="hidden sm:block" />
            directly for digital privacy.
          </h2>

          {/* Content area: Desktop (Grid) vs Mobile (Stacked) */}
          <div className="grid grid-cols-1 lg:grid-cols-[38%_1fr] items-start gap-8">
            {/* Left box (Zero-Knowledge details) */}
            <div className="flex flex-col justify-between p-8 bg-[#F5F5F5] dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl h-full min-h-[300px]">
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-950 dark:text-white font-display">Zero-Knowledge Cloud</h4>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Through client-side cryptography and modular document structures, we guarantee your password acts as your ultimate cryptographic key.
                </p>
              </div>
              
              <button
                onClick={handleFocusInput}
                className="group flex items-center gap-2 bg-[#F26522] hover:bg-[#e05a1a] text-white pl-5 pr-2 py-2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] active:scale-[0.98] w-fit mt-8 shadow-lg shadow-[#F26522]/10 hover:shadow-[#F26522]/20"
              >
                <div className="h-[20px] overflow-hidden relative">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">Claim your locker</span>
                    <span className="text-[13px] font-medium h-[20px] flex items-center pr-1 whitespace-nowrap">Claim your locker</span>
                  </div>
                </div>
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                  <LuArrowRight className="w-3.5 h-3.5 text-[#F26522]" />
                </div>
              </button>
            </div>

            {/* Right column: 4 Features Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, index) => (
                <div
                  key={index}
                  className="p-6 border border-slate-200/80 dark:border-slate-800 rounded-2xl hover:border-[#ff5f03] dark:hover:border-[#ff5f03] transition-colors duration-300 bg-white dark:bg-slate-900/10"
                >
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm w-fit mb-4 text-[#ff5f03]">
                    {item.icon}
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{item.title}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: QUICKSTART / STEPS (Light gray background) */}
      <section id="projects" className="bg-[#F5F5F5] dark:bg-slate-900 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 relative z-20 transition-colors duration-500">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Badge row */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8 px-5 sm:px-8 lg:px-12">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center text-[11px] sm:text-[12px] font-semibold">
              2
            </div>
            <span className="border border-gray-300 dark:border-slate-800 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[12px] sm:text-[13px] font-medium text-gray-900 dark:text-gray-300">
              Interactive Steps
            </span>
          </div>

          {/* Heading h2 */}
          <h2 className="text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white mb-10 sm:mb-14 lg:mb-16 px-5 sm:px-8 lg:px-12">
            Write. Sync. Lock.
          </h2>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-5 sm:px-8 lg:px-12">
            {[
              {
                title: "1. Name your locker",
                description: "Define a secure, unique route suffix. This is your dedicated notes route.",
                accent: "bg-[#1a1d2e] text-indigo-400"
              },
              {
                title: "2. Lock with password",
                description: "Set a password. Hashed client-side so it is never exposed in raw text.",
                accent: "bg-[#4b5563]/20 text-sky-400"
              },
              {
                title: "3. Write and sync",
                description: "All changes save to the cloud automatically with 2-second debounces.",
                accent: "bg-indigo-950/60 text-emerald-400"
              }
            ].map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  handleFocusInput();
                }}
                className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-850 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[320px] relative overflow-hidden"
              >
                {/* Graphics slot representing aspects */}
                <div className={`aspect-[4/3] w-full rounded-xl flex items-center justify-center ${item.accent} relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01]`}>
                  <LuFileText className="w-10 h-10 animate-pulse" />
                  
                  {/* Expanding White Button on Hover */}
                  <div className="absolute bottom-3 left-3 h-8 w-8 bg-white dark:bg-slate-950 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out group-hover:w-[130px] group-hover:px-3 shadow-md">
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 max-w-0 group-hover:max-w-[100px] overflow-hidden whitespace-nowrap mr-0 group-hover:mr-2">
                      Get Started
                    </span>
                    <LuChevronRight className="w-4 h-4 text-slate-900 dark:text-white shrink-0 transition-transform duration-300 group-hover:-rotate-45" />
                  </div>
                </div>

                <div className="pt-4 text-left">
                  <h4 className="font-bold text-base text-slate-950 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: FAQs */}
      <section id="faqs" className="bg-white dark:bg-slate-950 py-20 sm:py-28 transition-colors duration-500 border-t border-slate-200 dark:border-slate-800 relative z-20">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header Row */}
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-6 h-6 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-955 flex items-center justify-center text-[11px] font-bold">
              3
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Collapsible key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-900 bg-[#F5F5F5] dark:bg-slate-950 text-center px-6 relative z-20 text-xs text-slate-400 dark:text-slate-500 transition-colors duration-500">
        <p className="mb-2">
          Redesigned by{" "}
          <a
            href="https://github.com/senapati484"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-600 dark:text-slate-305 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            @senapati484
          </a>
        </p>
        <p>
          NotesLocker is fully open-source. Powered securely by Firebase Firestore & Vite.
        </p>
      </footer>
    </div>
  );
};

export default Home;
