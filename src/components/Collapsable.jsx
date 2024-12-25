/* eslint-disable react/prop-types */
import { useState } from "react";

const Collapsible = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className=" rounded-lg border last:border-none bg-slate-50 hover:bg-slate-100  mt-6">
      <button
        className="w-full flex justify-between items-center p-3 text-left text-lg font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ⌃
        </span>
      </button>
      {isOpen && <p className="px-4 py-4 text-gray-600 bg-white">{answer}</p>}
    </div>
  );
};

export default Collapsible;
