/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { toastEvents } from "../utils/toastEvent";
import { LuCheck, LuX, LuInfo } from "react-icons/lu";

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toastEvents.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
      }, newToast.duration);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((t) => (
        <ToastItem 
          key={t.id} 
          toast={t} 
          onClose={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))} 
        />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Small delay to trigger mount animations
    const animationFrame = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return (
          <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-500 shrink-0">
            <LuCheck className="w-3.5 h-3.5" />
          </div>
        );
      case "error":
        return (
          <div className="w-5.5 h-5.5 rounded-full bg-rose-500/10 dark:bg-rose-500/15 flex items-center justify-center text-rose-500 shrink-0">
            <LuX className="w-3.5 h-3.5" />
          </div>
        );
      case "warning":
        return (
          <div className="w-5.5 h-5.5 rounded-full bg-amber-500/10 dark:bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
            <LuInfo className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-5.5 h-5.5 rounded-full bg-sky-500/10 dark:bg-sky-500/15 flex items-center justify-center text-sky-500 shrink-0">
            <LuInfo className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/60 shadow-[0_12px_36px_-10px_rgba(0,0,0,0.08)] dark:shadow-[0_16px_40px_-10px_rgba(0,0,0,0.4)] rounded-2xl transition-all duration-300 transform ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-4 opacity-0 scale-95"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getIcon()}
        <span className="text-[13px] font-semibold text-slate-805 dark:text-slate-200 leading-tight">
          {toast.message}
        </span>
      </div>
      <button
        onClick={handleClose}
        className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
      >
        <LuX className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
