/* eslint-disable react/prop-types */
import { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const Collapsible = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 rounded-xl overflow-hidden transition-all duration-300">
      <button
        className="w-full flex justify-between items-center p-5 text-left text-base font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <LuChevronDown
          className={`w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[500px] border-t border-slate-100 dark:border-slate-800" : "max-h-0"
        }`}
      >
        <p className="p-5 text-sm leading-relaxed text-slate-605 dark:text-slate-400 bg-white dark:bg-slate-900/10">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default Collapsible;
