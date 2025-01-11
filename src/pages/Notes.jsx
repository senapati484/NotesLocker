/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdNightlightRound, MdOutlineWbSunny } from "react-icons/md";
import {
  LuCirclePlus,
  LuArrowLeft,
  LuArrowRight,
  LuEllipsis,
  LuTrash2,
  LuSave,
  LuUserPen,
  LuRefreshCw,
  LuBookmark,
} from "react-icons/lu";
import {
  updateText,
  deleteNote,
  createNote,
  updateNoteName,
} from "../utils/Note";
import ConfirmPassword from "../components/ConfirmPassword";
import ToastNotification from "../components/ToastNotification";

const Notes = () => {
  // Get user data from the location state
  const location = useLocation();
  const { userData } = location.state || {};

  // State variables
  const [notes, setNotes] = useState(userData?.[0]?.notes || []);
  const [selectedNote, setSelectedNote] = useState(userData?.[0]?.notes?.[0]);
  const [width, setWidth] = useState(window.innerWidth);
  const [autoSave, setAutoSave] = useState(false);

  // Change password handlers
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const handleOpen = () => setConfirmVisible(true);
  const handleClose = () => setConfirmVisible(false);
  const handleConfirm = () => {
    setConfirmVisible(false);
  };

  // Dark mode enable
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []); // used for getting the screen width

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(() => {
        handleNoteSaveClick();
        console.log("Auto Save enabled");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoSave, selectedNote, notes]); // used for setting the auto save

  const handleAutoSave = () => {
    setAutoSave(!autoSave);
  }; // auto save enabled // solved

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  }; // click to the note to select the note as current note // solved // Frontend

  const handleNoteTextChange = (event) => {
    const updatedText = event.target.value;
    const updatedNote = {
      ...selectedNote,
      text: updatedText,
      updatedAt: new Date().toISOString(),
    };
    setSelectedNote(updatedNote);

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  }; // setting the notename in the usestate // solved // Frontend

  const handleRightArrow = () => {
    const index = notes.indexOf(selectedNote);
    if (index < notes.length - 1) {
      setSelectedNote(notes[index + 1]);
    }
  }; // select right note from the list // solved // Frontend

  const handleLeftArrow = () => {
    const index = notes.indexOf(selectedNote);
    if (index > 0) {
      setSelectedNote(notes[index - 1]);
    }
  }; // select left note from the list // solved // Frontend

  const handleNoteNameChange = (event) => {
    const updatedName = event.target.value;
    const updatedNote = {
      ...selectedNote,
      name: updatedName,
      updatedAt: new Date().toISOString(),
    };
    setSelectedNote(updatedNote);

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  }; // Only updates the local state // solved // frontend

  const handleSaveNoteNameClick = async () => {
    try {
      if (userData?.[0]?.name && selectedNote?.id) {
        await updateNoteName(
          userData[0].name,
          selectedNote.id,
          selectedNote.name
        );
        ToastNotification.success(
          "Note name saved successfully",
          selectedNote.name
        );
      } else {
        console.error("User data or selected note is missing. Cannot save.");
        ToastNotification.warning("Cannot save note name", "User data missing");
      }
    } catch (error) {
      ToastNotification.error("Failed to save note name", error.message);
    }
  }; // Explicitly saves the note name to the backend // solved // backend

  const createNoteHandler = async () => {
    try {
      // Ensure that userData.name is available
      if (!userData || !userData[0]?.name) {
        throw new Error("User is not authenticated.");
      }

      const user = userData[0]; // Ensure this object has a `name` property
      const noteName = `Note ${notes.length + 1}`; // Generate a unique name for the new note

      // Pass the correct user name to createNote
      await createNote(user, noteName); // Corrected argument

      const newNote = {
        id: new Date().toISOString(),
        name: noteName,
        text: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes([...notes, newNote]);
      setSelectedNote(newNote);
      console.log("Note created:", newNote);
    } catch (error) {
      console.error("Failed to create a note:", error.message);
      console.log("failed to create note in createNoteHandler");
    }
  }; // create notes in the backend // solved // Backend

  const handleNoteSaveClick = async () => {
    if (selectedNote && userData?.[0]?.id) {
      // Ensure userData is available
      try {
        const updatedNote = {
          ...selectedNote,
          updatedAt: new Date().toISOString(),
        };

        await updateText(userData[0].id, updatedNote.id, updatedNote.text); // Pass userData[0].id to updateText
        const updatedNotes = notes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        );
        setNotes(updatedNotes);
        // console.log("Note saved:", updatedNote);
      } catch (error) {
        console.error("Failed to save the note:", error);
      }
    }
  }; // note save click from backend // solved // Backend

  const handleNoteDeleteClick = async () => {
    if (selectedNote) {
      try {
        await deleteNote(userData[0].name, selectedNote.id);
        const filteredNotes = notes.filter(
          (note) => note.id !== selectedNote.id
        );
        setNotes(filteredNotes);
        setSelectedNote(filteredNotes.length ? filteredNotes[0] : null);
        console.log("Note deleted:", selectedNote);
      } catch (error) {
        console.error("Failed to delete the note:", error);
      }
    }
  }; // note note delete from backend // solced // Backend

  return (
    <div
      className={`flex flex-col h-screen max-w-screen  px-4 md:px-12 lg:px-48 xl:px-80 ${
        darkMode ? "dark bg-black" : "bg-white"
      }`}
    >
      <div className="flex flex-col h-screen text-gray-800 dark:text-gray-100">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <h1 className="text-xl font-bold sm:appearance-none">NotesLocker</h1>
          <div className="flex flex-row gap-2">
            {/* Auto Save */}
            <button
              className={`rounded-md border dark:border-slate-500 ${
                autoSave ? "bg-gray-100 dark:bg-gray-700 delay-150" : ""
              }`}
              onClick={handleAutoSave}
            >
              {width < 768 ? (
                <p className="p-3">
                  <LuRefreshCw />
                </p>
              ) : (
                <p className="py-2 px-3">Auto Save</p>
              )}
            </button>
            {/* Change Password */}
            <button
              className="rounded-md border dark:border-slate-500"
              onClick={handleOpen}
            >
              {width < 768 ? (
                <p className="p-3">
                  <LuUserPen />
                </p>
              ) : (
                <p className="py-2 px-3">Change Password</p>
              )}
            </button>
            {/* Save Button */}
            <button
              className="rounded-md border bg-black dark:bg-gray-400 text-white dark:border-slate-500"
              onClick={handleNoteSaveClick}
            >
              {width < 768 ? (
                <p className="p-3">
                  <LuSave />
                </p>
              ) : (
                <p className="py-2 px-3">Save</p>
              )}
            </button>
            {/* Delete Button */}
            <button
              className="rounded-md border bg-red-500 text-white dark:border-slate-500"
              onClick={handleNoteDeleteClick}
            >
              {width < 768 ? (
                <p className="p-3">
                  <LuTrash2 />
                </p>
              ) : (
                <p className="py-2 px-3">Delete</p>
              )}
            </button>
            {/* Night mode button */}
            <button
              className="p-3 rounded-md border dark:border-slate-500"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <MdOutlineWbSunny className="text-yellow-500" />
              ) : (
                <MdNightlightRound className="text-gray-500" />
              )}
            </button>
          </div>
        </header>

        {/* Next Section */}
        <section className="flex flex-col py-4 gap-2">
          <div className="flex flex-row gap-2 items-center justify-between">
            {/* Left arrow */}
            <button
              className="px-3 py-3 rounded-md  hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleLeftArrow}
            >
              <LuArrowLeft />
            </button>
            {/* Scrollable container */}
            <div className="w-full overflow-x-scroll whitespace-nowrap max-w-full">
              <div className="flex flex-row gap-2 items-center">
                {notes.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No notes available. Create a new note to get started!
                  </p>
                )}
                {notes.map((note, index) => (
                  <div
                    key={index}
                    className={`flex px-2 border items-center rounded-md justify-center cursor-pointer dark:border-slate-500 ${
                      selectedNote === note
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }`}
                    onClick={() => handleNoteClick(note)}
                  >
                    <p className="py-2">{note.name}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right arrow */}
            <button
              className="px-3 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleRightArrow}
            >
              <LuArrowRight />
            </button>
            {/* Create note */}
            <button
              className="px-3 py-3 rounded-md  hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Create new note"
              onClick={createNoteHandler}
            >
              <LuCirclePlus />
            </button>
            {/* three dot */}
            <button className="px-3 py-3 rounded-md border dark:border-slate-500">
              <LuEllipsis />
            </button>
          </div>
          {/* Note name section */}
          <div className="flex flex-row w-full border px-2 py-0.5 rounded-md dark:border-slate-500">
            <input
              type="text"
              value={selectedNote ? selectedNote.name : ""}
              className="w-full text-xl font-bold px-2 py-0.5 bg-white dark:bg-black outline-none "
              onChange={handleNoteNameChange}
            />
            <button className="" onClick={handleSaveNoteNameClick}>
              {width < 768 ? (
                <p className="px-2">
                  <LuBookmark />
                </p>
              ) : (
                <p className="py-2 px-3">Done</p>
              )}
            </button>
          </div>
        </section>

        {/* Textarea */}
        <textarea
          name="body"
          value={selectedNote ? selectedNote.text : ""}
          onChange={handleNoteTextChange}
          className="flex-grow w-full border p-4 mb-4 rounded-md outline-none bg-white dark:border-slate-500 dark:bg-black text-gray-800 dark:text-gray-100"
        />
        <ConfirmPassword
          isVisible={isConfirmVisible}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default Notes;
