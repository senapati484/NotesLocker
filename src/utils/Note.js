import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

// Create a new note
export const createNote = async (user, noteName) => {
  try {
    console.log(user);

    if (!user || !user.name) throw new Error("User name is required.");
    if (!noteName) throw new Error("Note name is required.");

    const userRef = doc(db, "users", user.name);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, { notes: [] }); // Create user document with an empty notes array
    }

    const newNote = {
      id: new Date().toISOString(),
      name: noteName,
      text: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, {
      notes: arrayUnion(newNote),
    });

    ToastNotification.success(`Note "${noteName}" created successfully!`);
  } catch (error) {
    console.log(error);
    ToastNotification.warning(`Failed to create note: ${error.message}`);
  }
};

// Update the text of a note
export const updateText = async (user, noteId, newText) => {
  try {
    if (!user) throw new Error("User name is required.");
    if (!noteId) throw new Error("Note ID is required.");

    const userRef = doc(db, "users", user); // Use user ID here

    await runTransaction(db, async (transaction) => {
      const userSnapshot = await transaction.get(userRef);
      if (!userSnapshot.exists()) throw new Error("User not found."); // Error if user not found

      const userDoc = userSnapshot.data();
      const updatedNotes = userDoc.notes.map((note) =>
        note.id === noteId
          ? { ...note, text: newText, updatedAt: new Date().toISOString() }
          : note
      );

      transaction.update(userRef, { notes: updatedNotes });
    });

    ToastNotification.success("Note text updated successfully!");
  } catch (error) {
    // console.error("Error in updateText:", error.message);
    ToastNotification.warning(`Failed to update note text: ${error.message}`);
  }
};

// Delete a note by ID
export const deleteNote = async (user, noteId) => {
  try {
    if (!user) throw new Error("User name is required.");
    if (!noteId) throw new Error("Note ID is required.");

    const userRef = doc(db, "users", user);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) throw new Error("User not found.");

    const userDoc = userSnapshot.data();
    const updatedNotes = userDoc.notes.filter((note) => note.id !== noteId);

    await updateDoc(userRef, { notes: updatedNotes });

    ToastNotification.success("Note deleted successfully!");
  } catch (error) {
    // console.error("Error in deleteNote:", error.message);
    ToastNotification.warning(`Failed to delete note: ${error.message}`);
  }
};

// Update the name of a note
export const updateName = async (user, noteId, newName) => {
  try {
    if (!user) throw new Error("User name is required.");
    if (!noteId) throw new Error("Note ID is required.");

    const userRef = doc(db, "users", user);

    const userDoc = (await userRef.get()).data();
    const notes = userDoc.notes.map((note) =>
      note.id === noteId
        ? { ...note, name: newName, updatedAt: new Date().toISOString() }
        : note
    );

    await updateDoc(userRef, { notes });

    ToastNotification.success("Note name updated successfully!");
  } catch (error) {
    console.log(error);
    ToastNotification.warning("Failed to update note name! Please try again.");
  }
};

// Update user password
export const updatePassword = async (user, newPassword) => {
  try {
    if (!user) throw new Error("User name is required.");
    if (!newPassword) throw new Error("Password is required.");

    const userRef = doc(db, "users", user);

    await updateDoc(userRef, { password: newPassword });

    ToastNotification.success("Password updated successfully!");
  } catch (error) {
    console.log(error);
    ToastNotification.warning("Failed to update password! Please try again.");
  }
};
