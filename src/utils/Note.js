import { doc, updateDoc, runTransaction } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";
import {
  importKeyFromHex,
  encryptData,
  decryptData,
  generateRandomSalt,
  deriveKey
} from "./crypto";

// Helper: read, decrypt, modify, encrypt, and save notes in a transaction
const modifyAndSaveNotes = async (userName, masterKey, modifierFn) => {
  const userRef = doc(db, "users", userName);
  await runTransaction(db, async (transaction) => {
    const userSnapshot = await transaction.get(userRef);
    if (!userSnapshot.exists()) throw new Error("User not found.");

    const userData = userSnapshot.data();
    const { encryptedNotes, notesIv } = userData;

    if (!encryptedNotes || !notesIv) {
      throw new Error("Encrypted notes data is missing.");
    }

    // Decrypt notes
    const masterCryptoKey = await importKeyFromHex(masterKey);
    const notesPlaintext = await decryptData(encryptedNotes, notesIv, masterCryptoKey);
    const notesArray = JSON.parse(notesPlaintext);

    // Apply modifications
    const updatedNotes = modifierFn(notesArray);

    // Re-encrypt
    const { ciphertext: newEncryptedNotes, iv: newNotesIv } = await encryptData(
      JSON.stringify(updatedNotes),
      masterCryptoKey
    );

    // Update
    transaction.update(userRef, {
      encryptedNotes: newEncryptedNotes,
      notesIv: newNotesIv
    });
  });
};

// Create a new note
export const createNote = async (user, noteName) => {
  try {
    if (!user || !user.name || !user.masterKey) throw new Error("Invalid user session.");
    if (!noteName) throw new Error("Note name is required.");

    const newNote = {
      id: new Date().toISOString(),
      name: noteName,
      text: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await modifyAndSaveNotes(user.name, user.masterKey, (notes) => {
      return [...notes, newNote];
    });

    ToastNotification.success(`Note "${noteName}" created successfully!`);
    return newNote;
  } catch (error) {
    console.error(error);
    ToastNotification.warning(`Failed to create note: ${error.message}`);
    throw error;
  }
};

// Delete a note by ID
export const deleteNote = async (user, noteId) => {
  try {
    if (!user || !user.name || !user.masterKey) throw new Error("Invalid user session.");
    if (!noteId) throw new Error("Note ID is required.");

    await modifyAndSaveNotes(user.name, user.masterKey, (notes) => {
      return notes.filter((note) => note.id !== noteId);
    });

    ToastNotification.success("Note deleted successfully!");
  } catch (error) {
    console.error(error);
    ToastNotification.warning(`Failed to delete note: ${error.message}`);
    throw error;
  }
};

// Update note content and name in a single transaction
export const updateNote = async (user, noteId, newText, newName) => {
  try {
    if (!user || !user.name || !user.masterKey) throw new Error("Invalid user session.");
    if (!noteId) throw new Error("Note ID is required.");

    await modifyAndSaveNotes(user.name, user.masterKey, (notes) => {
      return notes.map((note) =>
        note.id === noteId
          ? { ...note, text: newText, name: newName, updatedAt: new Date().toISOString() }
          : note
      );
    });
  } catch (error) {
    console.error(error);
    ToastNotification.warning(`Failed to save note changes: ${error.message}`);
    throw error;
  }
};

// Update user password and re-encrypt the Master Key
export const updatePassword = async (user, newPassword) => {
  try {
    if (!user || !user.name || !user.masterKey) throw new Error("Invalid user session.");
    if (!newPassword) throw new Error("Password is required.");

    const userRef = doc(db, "users", user.name);

    // Derive new password-based key
    const passwordSalt = generateRandomSalt();
    const passwordKey = await deriveKey(newPassword, passwordSalt);

    // Create new validator
    const { ciphertext: validatorCiphertext, iv: validatorIv } = await encryptData(
      "locker_unlocked",
      passwordKey
    );

    // Re-encrypt Master Key
    const { ciphertext: encryptedMasterKeyUser, iv: masterKeyUserIv } = await encryptData(
      user.masterKey,
      passwordKey
    );

    // Update Firestore
    await updateDoc(userRef, {
      passwordSalt,
      validatorCiphertext,
      validatorIv,
      encryptedMasterKeyUser,
      masterKeyUserIv,
    });

    ToastNotification.success("Password updated successfully!");
  } catch (error) {
    console.error(error);
    ToastNotification.warning("Failed to update password! Please try again.");
    throw error;
  }
};
