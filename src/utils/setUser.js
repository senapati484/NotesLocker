import { doc, setDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";
import {
  generateRandomSalt,
  generateRandomKey,
  deriveKey,
  importKeyFromHex,
  encryptData
} from "./crypto";

export const setUser = async (user, password) => {
  try {
    if (!user) throw new Error("User name is required.");

    // 1. Generate cryptographic credentials
    const passwordSalt = generateRandomSalt();
    const passwordKey = await deriveKey(password, passwordSalt);

    // 2. Create validator ciphertext
    const { ciphertext: validatorCiphertext, iv: validatorIv } = await encryptData(
      "locker_unlocked",
      passwordKey
    );

    // 3. Generate Master Key and encrypt it with the password key
    const masterKey = generateRandomKey();
    const { ciphertext: encryptedMasterKeyUser, iv: masterKeyUserIv } = await encryptData(
      masterKey,
      passwordKey
    );

    // 4. Encrypt initial notes with the Master Key
    const initialNotes = [
      {
        id: new Date().toISOString(),
        name: "notes 1",
        text: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const masterCryptoKey = await importKeyFromHex(masterKey);
    const { ciphertext: encryptedNotes, iv: notesIv } = await encryptData(
      JSON.stringify(initialNotes),
      masterCryptoKey
    );

    // 5. Save everything to Firestore
    const userRef = doc(db, "users", user);
    await setDoc(userRef, {
      name: user,
      passwordSalt,
      validatorCiphertext,
      validatorIv,
      encryptedMasterKeyUser,
      masterKeyUserIv,
      encryptedNotes,
      notesIv,
      createdAt: new Date().toISOString(),
    });

    ToastNotification.success("Registration successful!");
    
    // Return the decrypted user session so the frontend can route immediately
    return {
      success: true,
      userData: [{
        id: user,
        name: user,
        notes: initialNotes,
        masterKey: masterKey,
      }]
    };
  } catch (error) {
    console.error("Failed to register user:", error);
    ToastNotification.warning("Failed to register user! Please try again.");
    throw error;
  }
};
