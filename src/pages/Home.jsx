import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";
import { LuGlobeLock, LuIdCard, LuGithub } from "react-icons/lu";

import Collapsible from "../components/Collapsable";
import { fetchUser } from "../utils/fetchUser"; // Import the fetchUser function
import ToastNotification from "../components/ToastNotification";

const faqData = [
  {
    question: "Personal Information of the user !",
    answer:
      "We do not store any personal information of the user. The user is completely anonymous.",
  },
  {
    question: "How can I recover my site if I forget my password?",
    answer:
      "Unfortunately, there is no other way to reset your password. Recovery is not possible without the password.",
  },
  {
    question: "How can I backup my notes?",
    answer: "You can export your notes as text files and store them locally.",
  },
  {
    question: "How can I share my notes?",
    answer:
      "Right now there is no way to share my notes, but you can share username and password",
  },
  {
    question: "How do you verify the user",
    answer:
      "The password is used to check wheather the entered password is correct or not.",
  },
  {
    question: "Upcomin updates",
    answer:
      "there is going to be an option to share the notes and the notes can be visible without password if you choose to share",
  },
];

const features = [
  {
    icon: <MdLockOutline size={24} className="text-gray-600" />,
    title: "Secure Password Management",
    description:
      "Your password is securely stored into Firebase. This ensures your password and notes are protected.",
  },
  {
    icon: <LuGlobeLock size={24} className="text-gray-600" />,
    title: "Privacy-Focused Storage",
    description:
      "Your note titles and content are being stored, ensuring data privacy and security.",
  },
  {
    icon: <LuIdCard size={24} className="text-gray-600" />,
    title: "No Account Required",
    description:
      "No need for an account! Just set a password to securely manage your notes while maintaining complete anonymity.",
  },
  {
    icon: <LuGithub size={24} className="text-gray-600" />,
    title: "Open-Source Transparency",
    description:
      "Our code is open-source and available on GitHub. Review, fork, and contribute to ensure trust and transparency.",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  const handleGetStarted = async () => {
    try {
      const result = await fetchUser(user);
      if (result.exists) {
        navigate(`/${user}`, { state: { userData: result.userData } });
      } else {
        navigate("/register", { state: { user } });
      }
    } catch (error) {
      ToastNotification.warning(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 md:px-12 lg:px-48 xl:px-80">
      {/* Header */}
      <header className="flex justify-between items-center py-8">
        <h1 className="text-2xl font-bold">NotesLocker</h1>
        <a
          href="https://github.com/senapati484/NotesLocker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-black flex gap-2 font-semibold"
        >
          <FaGithub size={22} /> GitHub
        </a>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center py-32">
        <button
          className="py-1 px-4 rounded-full hover:bg-slate-100 border my-10"
          onClick={() =>
            window.open("https://github.com/senapati484/NotesLocker", "_blank")
          }
        >
          Star us on Github⭐️
        </button>
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Lightweight protected notepad.
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-6">
          Fully open-source protected notepad with rich text support. No login
          required.
        </p>

        {/* Input Section */}
        <div className="w-full mt-10 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="text-gray-500">noteslocker.vercel.app/</span>
          <input
            type="text"
            placeholder="mynotes"
            className="border rounded px-3 py-2 focus:outline-none w-full sm:flex-1"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <button
            onClick={handleGetStarted}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full sm:w-auto"
          >
            Get Started
          </button>
        </div>
      </main>

      {/* Quickstart Section */}
      <section className="py-16 pb-10 w-full">
        <h3 className="text-2xl font-bold text-center mb-8">Quickstart</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Step 1", "Step 2", "Step 3"].map((step, index) => (
            <div
              key={index}
              className="text-center py-10 px-10 bg-white shadow-md rounded-lg border"
            >
              <h4 className="font-semibold mb-2 text-3xl">{step}</h4>
              <p>
                {index === 0
                  ? "Create your own notepad at noteslocker.vercel.app/your-name."
                  : index === 1
                  ? "Set a password and start writing notes."
                  : "Save and close the tab once you are done!"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Secure Notes */}
      <section className="py-4 px-4 w-full my-8 shadow-md rounded-lg border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="md:w-6/12 space-y-4 flex flex-col justify-start pl-4 pt-4">
            <h4 className="text-slate-400 font-bold">Protected Notepad</h4>
            <h2 className="text-3xl font-bold font-mono leading-snug text-gray-800">
              Protect your notes with a secure password.
            </h2>
            <ul className="space-y-6 text-gray-700">
              {features.map((item, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <span className="text-base p-1 rounded-lg border">
                    {item.icon}
                  </span>
                  <p>
                    <strong>{item.title}</strong> <br />
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Image Section */}
          <div className="md:w-5/12 flex justify-center bg-white shadow-md rounded-lg border">
            <img
              src="img.jpg"
              alt="Secure Notes Illustration"
              className="max-w-full rounded-lg shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-4 px-4 h-full border rounded-lg shadow-md">
        <h2 className="text-3xl font-bold">FAQs</h2>
        <div className="bg-white rounded-lg">
          {faqData.map((faq, index) => (
            <Collapsible
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-10 px-10 text-center py-16 text-gray-500 border-t">
        Built by{" "}
        <span
          className="text-gray-800 font-semibold cursor-pointer"
          onClick={() =>
            window.open("https://github.com/senapati484", "_blank")
          }
        >
          @senapati484
        </span>
        <br />
        LockNotes is open-source on{" "}
        <span
          className="text-gray-800 font-semibold cursor-pointer"
          onClick={() => window.open("https://github.com/", "_blank")}
        >
          GitHub
        </span>{" "}
        and uses{" "}
        <span
          className="text-gray-800 font-semibold cursor-pointer"
          onClick={() => window.open("https://firebase.google.com/", "_blank")}
        >
          Firebase
        </span>{" "}
        for storing notes and users.
      </footer>
    </div>
  );
};

export default Home;
