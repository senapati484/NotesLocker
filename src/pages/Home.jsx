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
    question: "What is zero knowledge app?",
    answer:
      "A Zero-Knowledge (ZK) App leverages zero-knowledge proofs (ZKPs) to ensure data privacy and security while enabling verifiable interactions. We don't store any of your personal information or your password. We only encrypt text which never leaves your browser.",
  },
  {
    question: "How can I recover my site if I forget my password?",
    answer:
      "Unfortunately, passwords are not stored. Recovery is not possible without the password.",
  },
  {
    question: "How can I backup my notes?",
    answer:
      "You can export your notes as encrypted files and store them locally.",
  },
  {
    question: "How can I share my notes?",
    answer:
      "Share encrypted files or decrypt them locally to share readable text.",
  },
  {
    question:
      "How do you verify the password if it is never sent to the server?",
    answer:
      "The password is used to decrypt the data locally, ensuring that it is never transmitted or stored.",
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
    <>
      <div className="min-h-screen bg-white text-gray-800 px-4 md:px-12 lg:px-48 xl:px-80 mb-28">
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
        <main className="flex flex-col items-center justify-center text-center py-24">
          <button
            className="py-1 px-4 rounded-full hover:bg-slate-100 border my-10"
            onClick={() =>
              window.open(
                "https://github.com/senapati484/NotesLocker",
                "_blank"
              )
            }
          >
            Star us on Github⭐️
          </button>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Lightweight encrypted notepad.
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            Fully open-source encrypted notepad with rich text support. No login
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
        <section className="py-16 w-full">
          <h3 className="text-2xl font-bold text-center mb-8">Quickstart</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center py-10 px-10 bg-white shadow-md rounded-lg border">
              <h4 className="font-semibold mb-2 text-3xl">Step 1</h4>
              <p>Create your own notepad at sealnotes.com/your-name.</p>
            </div>
            <div className="text-center py-10 px-10 bg-white shadow-md rounded-lg border">
              <h4 className="font-semibold mb-2 text-3xl">Step 2</h4>
              <p>Set a password and start writing notes.</p>
            </div>
            <div className="text-center py-10 px-10 bg-white shadow-md rounded-lg border">
              <h4 className="font-semibold mb-2 text-3xl">Step 3</h4>
              <p>Save and close the tab once you are done!</p>
            </div>
          </div>
        </section>

        {/* secure Notes */}
        <section className="py-4 px-4 w-full my-8 shadow-md rounded-lg border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Text Section */}
            <div className="md:w-6/12 space-y-4 flex flex-col  justify-start pl-4 pt-4">
              <h4 className=" text-slate-400 font-bold">Encrypted Notepad</h4>
              <h2 className="text-3xl font-bold font-mono leading-snug text-gray-800">
                Protect your notes with a secure password.
              </h2>
              <ul className="space-y-6 text-gray-700">
                <li className="flex items-start space-x-4">
                  <span className="text-base p-1 rounded-lg border">
                    <MdLockOutline />
                  </span>
                  <p>
                    <strong>Set a password for your notes</strong> <br />
                    We never store your password. Instead, your password is used
                    as a key to encrypt your notepad.
                  </p>
                </li>
                <li className="flex items-start space-x-4">
                  <span className="text-base p-1 rounded-lg border">
                    <LuGlobeLock />
                  </span>
                  <p>
                    <strong>Hashed site names</strong> <br />
                    Your site or notepad names are hashed before being stored in
                    our database.
                  </p>
                </li>
                <li className="flex items-start space-x-4">
                  <span className="text-base p-1 rounded-lg border">
                    <LuIdCard />
                  </span>
                  <p>
                    <strong>No login required</strong> <br />
                    Since we only need a password to encrypt your notes, there’s
                    no need for you to log in.
                  </p>
                </li>
                <li className="flex items-start space-x-4">
                  <span className="text-base p-1 rounded-lg border">
                    <LuGithub />
                  </span>
                  <p>
                    <strong>Fully open-source</strong> <br />
                    We are fully open-source on GitHub. Fork the repo and
                    self-deploy!
                  </p>
                </li>
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
      </div>
      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 border-t">
        Built by{" "}
        {
          <span
            className="text-gray-800 font-semibold cursor-pointer"
            onClick={() =>
              window.open("https://github.com/senapati484", "_blank")
            }
          >
            {" "}
            @senapati484{" "}
          </span>
        }
        {<br />} LockNotes is open-source on{" "}
        {
          <span
            className="text-gray-800 font-semibold cursor-pointer"
            onClick={() => window.open("https://github.com/", "_blank")}
          >
            {" "}
            Github{" "}
          </span>
        }{" "}
        and uses{" "}
        {
          <span
            className="text-gray-800 font-semibold cursor-pointer"
            onClick={() =>
              window.open("https://firebase.google.com/", "_blank")
            }
          >
            {" "}
            firebase{" "}
          </span>
        }
        for storing notes and users.
      </footer>
    </>
  );
};

export default Home;
