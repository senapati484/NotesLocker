import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

export const createNote = async (user, noteName) => {
  try {
    if (!user) throw new Error("User name is required.");
    if (!noteName) throw new Error("Note name is required.");

    const userRef = doc(db, "users", user);

    const newNote = {
      name: noteName,
      text: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, {
      notes: arrayUnion(newNote), // Add the new note to the notes array
    });

    ToastNotification.success(`Note "${noteName}" created successfully!`);
  } catch (error) {
    ToastNotification.warning("Failed to create note! Please try again.");
  }
};
