/* eslint-disable react/prop-types */
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const Collapsible = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200/50 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/30 backdrop-blur-sm rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#ff5f03]/40 dark:hover:border-[#ff5f03]/30 shadow-sm">
      <button
        className="w-full flex justify-between items-center p-5 sm:p-6 text-left text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-[#ff5f03] dark:hover:text-[#ff5f03] transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="pr-4">{question}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/80 dark:bg-slate-800/80 transition-all duration-300 shrink-0 ${isOpen ? "bg-[#ff5f03]/10 dark:bg-[#ff5f03]/15 text-[#ff5f03]" : "text-slate-400 dark:text-slate-500"}`}>
          <LuChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-gray-200/60 dark:border-slate-800/50" : "max-h-0"
        }`}
      >
        <p className="p-5 sm:p-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 bg-slate-50/20 dark:bg-slate-950/10">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default Collapsible;
