import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOutlineWbSunny } from "react-icons/md";
import {
  LuSunMoon,
  LuCirclePlus,
  LuArrowLeft,
  LuArrowRight,
  LuEllipsis,
  LuTrash2,
  LuSave,
  LuUserPen,
  LuRefreshCw,
  LuX,
} from "react-icons/lu";

const Notes = () => {
  const { username } = useParams();
  const location = useLocation();
  const { userData } = location.state || {};
  // const notes = userData[0].notes; // no

  const [notes, setNotes] = useState(userData ? userData[0].notes : []);
  const [selectedNote, setSelectedNote] = useState(userData[0].notes[0]); // Selected note
  const [editIndex, setEditIndex] = useState(null); // Index of the note being edited
  const [editText, setEditText] = useState(""); // Temporary text for editing

  //Whidth of display
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleEditClick = (index) => {
  //   setEditIndex(index);
  //   setEditText(notes[index].text); // Initialize edit text with current note text
  // };

  // const handleSaveClick = (index) => {
  //   const updatedNotes = [...notes];
  //   updatedNotes[index].text = editText; // Update note text
  //   setNotes(updatedNotes); // Update state
  //   setEditIndex(null); // Exit edit mode
  //   setEditText(""); // Clear temporary text
  // };

  // const handleCancelClick = () => {
  //   setEditIndex(null); // Exit edit mode
  //   setEditText(""); // Clear temporary text
  // };

  const handleClick = () => {
    notes.map((note) => console.log(note));
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-4 md:px-12 lg:px-48 xl:px-80">
      {/* Header */}
      <header className="flex justify-between items-center py-4">
        <h1 className="text-xl font-bold sm:appearance-none">NotesLocker</h1>
        <div className="flex flex-row gap-2">
          {/* <button className="rounded-md border">
            {width < 768 && (
              <p className="p-3">
                <LuRefreshCw />
              </p>
            )}
            {width >= 768 && <p className="py-2 px-3">Refresh</p>}
          </button> */}
          <button className="rounded-md border">
            {width < 768 && (
              <p className="p-3">
                <LuUserPen />
              </p>
            )}
            {width >= 768 && <p className="py-2 px-3">Change Password</p>}
          </button>
          <button className="rounded-md border bg-black text-white">
            {width < 768 && (
              <p className="p-3">
                <LuSave />
              </p>
            )}
            {width >= 768 && <p className="py-2 px-3">Save</p>}
          </button>
          <button className="rounded-md border bg-red-500 text-white">
            {width < 768 && (
              <p className="p-3">
                <LuTrash2 />
              </p>
            )}
            {width >= 768 && <p className="py-2 px-3">Delete</p>}
          </button>
          <button className="p-3 rounded-md border">
            <MdOutlineWbSunny />
          </button>
        </div>
      </header>
      <section className="flex flex-col py-4 gap-2">
        <div className="flex flex-row gap-2 items-center justify-between">
          <button className="px-3 py-3 rounded-md">
            <LuArrowLeft />
          </button>
          <div className="w-full">
            <button className="flex flex-row gap-2 items-center justify-center overflow-x-auto">
              {notes.map((note, index) => (
                <div
                  key={index}
                  className={`flex px-3 flex-row gap-2 border items-center rounded-md justify-center ${
                    selectedNote === note ? "bg-gray-100" : ""
                  }`}
                  onClick={() => handleNoteClick(note)}
                >
                  <p className="py-2 whitespace-nowrap ">{note.name}</p>
                  <LuX />
                </div>
              ))}
            </button>
          </div>
          <button className="px-3 py-3 rounded-md ">
            <LuArrowRight />
          </button>
          <button className="px-3 py-3 rounded-md">
            <LuCirclePlus />
          </button>
          <button className="px-3 py-3 rounded-md border" onClick={handleClick}>
            <LuEllipsis />
          </button>
        </div>
        <div className="w-full border p-2 rounded-md">
          <h2 className="text-xl font-bold px-2 py-0.5">
            {selectedNote ? selectedNote.name : "No note selected"}
          </h2>
        </div>
      </section>
      <textarea
        name="body"
        value={selectedNote ? selectedNote.text : ""}
        // onChange={handleNoteTextChange}
        className="w-full h-96 border p-2 rounded-md"
      />
    </div>
  );
};

export default Notes;
