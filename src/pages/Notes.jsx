import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { 
  LuSearch, LuPlus, LuLogOut, LuTrash2, LuLock, LuSun, LuMoon, 
  LuChevronLeft, LuCheck, LuInfo, LuFileText
} from "react-icons/lu";
import {
  deleteNote,
  createNote,
  updateNote
} from "../utils/Note";
import ConfirmPassword from "../components/ConfirmPassword";
import ToastNotification from "../components/ToastNotification";

const Notes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = location.state || {};

  // Redirection guard for missing session
  useEffect(() => {
    if (!userData || !userData[0]) {
      ToastNotification.error("Session expired. Please log in again.");
      navigate("/");
    }
  }, [userData, navigate]);

  const currentUser = userData?.[0];

  // State variables
  const [notes, setNotes] = useState(currentUser?.notes || []);
  const [selectedNote, setSelectedNote] = useState(currentUser?.notes?.[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingStatus, setSavingStatus] = useState("idle"); // 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  
  // Track dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync state for tab close guard
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (savingStatus === "unsaved") {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [savingStatus]);

  // Direct save function
  const saveNoteDirect = useCallback(async (noteToSave) => {
    if (!noteToSave || !currentUser?.id) return;
    try {
      setSavingStatus("saving");
      await updateNote(currentUser.id, noteToSave.id, noteToSave.text, noteToSave.name);
      
      // Update local notes timestamp / info
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === noteToSave.id ? noteToSave : n))
      );
      setSavingStatus("saved");
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSavingStatus("error");
    }
  }, [currentUser?.id]);

  // Debounced auto-save effect
  useEffect(() => {
    if (savingStatus === "unsaved" && selectedNote) {
      const timer = setTimeout(() => {
        saveNoteDirect(selectedNote);
      }, 2000); // 2 seconds debounce
      return () => clearTimeout(timer);
    }
  }, [selectedNote, savingStatus, saveNoteDirect]);

  // Switch note handler - saves previous note immediately if unsaved
  const handleNoteClick = async (note) => {
    if (savingStatus === "unsaved" && selectedNote) {
      await saveNoteDirect(selectedNote);
    }
    setSelectedNote(note);
    setSavingStatus("idle");
  };

  // Text content change handler
  const handleNoteTextChange = (event) => {
    if (!selectedNote) return;
    const updatedNote = {
      ...selectedNote,
      text: event.target.value,
      updatedAt: new Date().toISOString(),
    };
    setSelectedNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === selectedNote.id ? updatedNote : n))
    );
    setSavingStatus("unsaved");
  };

  // Title change handler
  const handleNoteNameChange = (event) => {
    if (!selectedNote) return;
    const updatedNote = {
      ...selectedNote,
      name: event.target.value,
      updatedAt: new Date().toISOString(),
    };
    setSelectedNote(updatedNote);
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n.id === selectedNote.id ? updatedNote : n))
    );
    setSavingStatus("unsaved");
  };

  // Create Note Handler
  const createNoteHandler = async () => {
    try {
      if (!currentUser?.name) {
        throw new Error("User credentials not found.");
      }

      // 1. Immediately save current note if unsaved
      if (savingStatus === "unsaved" && selectedNote) {
        await saveNoteDirect(selectedNote);
      }

      const noteName = `Note ${notes.length + 1}`;
      setSavingStatus("saving");
      
      // 2. Create in backend and retrieve note with matching ID
      const newNote = await createNote(currentUser, noteName);
      
      if (newNote) {
        setNotes((prevNotes) => [...prevNotes, newNote]);
        setSelectedNote(newNote);
        setSavingStatus("saved");
      }
    } catch (error) {
      console.error("Failed to create note:", error);
      setSavingStatus("error");
    }
  };

  // Delete Note Handler
  const handleNoteDeleteClick = async () => {
    if (!selectedNote) return;
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${selectedNote.name}"?`);
    if (!confirmDelete) return;

    try {
      setSavingStatus("saving");
      await deleteNote(currentUser.name, selectedNote.id);
      
      const filteredNotes = notes.filter((n) => n.id !== selectedNote.id);
      setNotes(filteredNotes);
      setSelectedNote(filteredNotes.length ? filteredNotes[0] : null);
      setSavingStatus("idle");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setSavingStatus("error");
    }
  };

  // Change password modal triggers
  const handleOpen = () => setConfirmVisible(true);
  const handleClose = () => setConfirmVisible(false);

  // Logout handler - saves active note first
  const handleLogout = async () => {
    if (savingStatus === "unsaved" && selectedNote) {
      await saveNoteDirect(selectedNote);
    }
    ToastNotification.success("Logged out successfully.");
    navigate("/");
  };

  // Search filtering
  const filteredNotes = notes.filter(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Relative time helper
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  // Render Status Indicator
  const renderStatus = () => {
    switch (savingStatus) {
      case "unsaved":
        return (
          <span className="flex items-center space-x-1.5 text-xs text-amber-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>Unsaved changes</span>
          </span>
        );
      case "saving":
        return (
          <span className="flex items-center space-x-1.5 text-xs text-indigo-500 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping"></span>
            <span>Saving changes...</span>
          </span>
        );
      case "saved":
        return (
          <span className="flex items-center space-x-1.5 text-xs text-emerald-500 font-medium">
            <LuCheck className="w-3.5 h-3.5" />
            <span>Saved to cloud</span>
          </span>
        );
      case "error":
        return (
          <span className="flex items-center space-x-1.5 text-xs text-rose-500 font-medium">
            <LuInfo className="w-3.5 h-3.5" />
            <span>Sync error!</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      
      {/* SIDEBAR (Hidden on mobile when a note is active) */}
      <aside className={`w-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-all duration-300 ${
        selectedNote ? "hidden md:flex" : "flex"
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-950 dark:text-white">
              NotesLocker
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md">
              /{currentUser?.name}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <LuSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-550/20 focus:border-indigo-500 text-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <LuFileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No notes found</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleNoteClick(note)}
                className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                  selectedNote?.id === note.id
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold"
                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-650 dark:text-slate-400"
                }`}
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="truncate text-sm font-medium pr-2">{note.name || "Untitled Note"}</span>
                  <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                    {formatTime(note.updatedAt || note.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-450 dark:text-slate-500 truncate font-normal">
                  {note.text || "Empty note"}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Sidebar Actions / Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <LuSun className="w-4 h-4 text-amber-500" /> : <LuMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleOpen}
              className="p-2 text-slate-500 hover:text-slate-855 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
              title="Change Password"
            >
              <LuLock className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-rose-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Log Out"
            >
              <LuLogOut className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={createNoteHandler}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-indigo-650 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/10 transition-all duration-200"
          >
            <LuPlus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </aside>

      {/* EDITOR WORKSPACE (Hidden on mobile when no note is active) */}
      <main className={`flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative ${
        !selectedNote ? "hidden md:flex" : "flex"
      }`}>
        {selectedNote ? (
          <>
            {/* Editor Header */}
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 md:hidden transition-colors"
                >
                  <LuChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={selectedNote.name}
                    onChange={handleNoteNameChange}
                    className="w-full text-base font-semibold bg-transparent border-0 p-0 focus:outline-none focus:ring-0 text-slate-950 dark:text-white"
                    placeholder="Untitled Note"
                  />
                  <div className="flex items-center space-x-2 mt-0.5">
                    {renderStatus()}
                    <span className="text-[10px] text-slate-400">
                      Modified {formatTime(selectedNote.updatedAt || selectedNote.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4 shrink-0">
                <button
                  onClick={() => saveNoteDirect(selectedNote)}
                  disabled={savingStatus === "saving" || savingStatus === "saved"}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors duration-200"
                >
                  Save Now
                </button>
                <button
                  onClick={handleNoteDeleteClick}
                  className="p-2 text-rose-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors duration-200"
                  title="Delete Note"
                >
                  <LuTrash2 className="w-4.5 h-4.5" />
                </button>
              </div>
            </header>

            {/* Textarea Area */}
            <div className="flex-1 p-6 relative">
              <textarea
                value={selectedNote.text}
                onChange={handleNoteTextChange}
                placeholder="Start typing your note here..."
                className="w-full h-full resize-none bg-transparent border-0 p-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-150 text-sm leading-relaxed font-sans placeholder-slate-400"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white/40 dark:bg-slate-900/10">
            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-650 dark:text-indigo-400 rounded-2xl mb-4">
              <LuFileText className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-slate-850 dark:text-white font-display">
              No Note Selected
            </h3>
            <p className="text-sm text-slate-450 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              Select an existing note from the list, or create a new note to start writing.
            </p>
            <button
              onClick={createNoteHandler}
              className="mt-6 px-4 py-2.5 bg-indigo-650 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-md transition-all duration-200"
            >
              Create New Note
            </button>
          </div>
        )}
      </main>

      {/* CHANGE PASSWORD MODAL */}
      <ConfirmPassword
        isVisible={isConfirmVisible}
        onClose={handleClose}
        onConfirm={handleClose}
      />
    </div>
  );
};

export default Notes;
