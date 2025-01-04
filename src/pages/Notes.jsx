import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import {
  LuCirclePlus,
  LuArrowLeft,
  LuArrowRight,
  LuEllipsis,
  LuTrash2,
  LuSave,
  LuUserPen,
} from "react-icons/lu";
import {
  updateText,
  deleteNote,
  createNote,
  updateNoteName,
} from "../utils/Note";
import ConfirmPassword from "../components/ConfirmPassword";

const Notes = () => {
  const location = useLocation();
  const { userData } = location.state || {};

  const [notes, setNotes] = useState(userData?.[0]?.notes || []);
  const [selectedNote, setSelectedNote] = useState(userData?.[0]?.notes?.[0]);
  const [width, setWidth] = useState(window.innerWidth);

  // Change password handlers
  const [isConfirmVisible, setConfirmVisible] = useState(false);
  const handleOpen = () => setConfirmVisible(true);
  const handleClose = () => setConfirmVisible(false);
  const handleConfirm = () => {
    setConfirmVisible(false);
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    // console.log(userData[0].notes.length);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  }; // solved // Frontend

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
  }; // solved // Frontend

  const handleNoteNameChange = async (event) => {
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

    try {
      if (userData?.[0]?.name) {
        await updateNoteName(userData[0].name, selectedNote.id, updatedName);
        console.log("Note name updated successfully:", updatedName);
      } else {
        console.error("User data is missing. Cannot update the note name.");
      }
    } catch (error) {
      console.error("Failed to update note name:", error.message);
    }
  }; // solved // Frontend

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
  }; // solved // Backend

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
        console.log("Note saved:", updatedNote);
      } catch (error) {
        console.error("Failed to save the note:", error);
      }
    }
  }; // solved // Backend

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
  }; // solced // Backend

  const handleRightArrow = () => {
    const index = notes.indexOf(selectedNote);
    if (index < notes.length - 1) {
      setSelectedNote(notes[index + 1]);
    }
  }; // solved // Frontend

  const handleLeftArrow = () => {
    const index = notes.indexOf(selectedNote);
    if (index > 0) {
      setSelectedNote(notes[index - 1]);
    }
  }; // solved // Frontend

  // useEffect(() => {
  //   console.log(userData[0]);
  // });

  return (
    <div className="flex flex-col h-screen max-w-screen bg-white text-gray-800 px-4 md:px-12 lg:px-48 xl:px-80">
      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <h1 className="text-xl font-bold sm:appearance-none">NotesLocker</h1>
        <div className="flex flex-row gap-2">
          {/* Change Password */}
          <button className="rounded-md border" onClick={handleOpen}>
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
            className="rounded-md border bg-black text-white"
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
            className="rounded-md border bg-red-500 text-white"
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
          <button className="p-3 rounded-md border">
            <MdOutlineWbSunny />
          </button>
        </div>
      </header>

      {/* Next Section */}
      <section className="flex flex-col py-4 gap-2">
        <div className="flex flex-row gap-2 items-center justify-between">
          {/* Left arrow */}
          <button className="px-3 py-3 rounded-md" onClick={handleLeftArrow}>
            <LuArrowLeft />
          </button>
          {/* Scrollable container */}
          <div className="w-full overflow-x-scroll whitespace-nowrap max-w-full">
            <div className="flex flex-row gap-2 items-center">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className={`flex px-3 border items-center rounded-md justify-center cursor-pointer ${
                    selectedNote === note ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <p className="py-2">{note.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button className="px-3 py-3 rounded-md" onClick={handleRightArrow}>
            <LuArrowRight />
          </button>
          {/* Create note */}
          <button className="px-3 py-3 rounded-md" onClick={createNoteHandler}>
            <LuCirclePlus />
          </button>
          {/* three dot */}
          <button className="px-3 py-3 rounded-md border">
            <LuEllipsis />
          </button>
        </div>
        <div className="w-full border p-2 rounded-md">
          <input
            type="text"
            value={selectedNote ? selectedNote.name : ""}
            className="w-full text-xl font-bold px-2 py-0.5"
            onChange={handleNoteNameChange}
          />
        </div>
      </section>

      {/* Textarea */}
      <textarea
        name="body"
        value={selectedNote ? selectedNote.text : ""}
        onChange={handleNoteTextChange}
        className="flex-grow w-full border p-4 mb-4 rounded-md"
      />
      <ConfirmPassword
        isVisible={isConfirmVisible}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default Notes;
