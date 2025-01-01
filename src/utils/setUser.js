import { doc, setDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

export const setUser = async (user, password) => {
  try {
    if (!user) throw new Error("User name is required.");

    const userRef = doc(db, "users", user);
    await setDoc(userRef, {
      name: user,
      password: password, // Hash this password in next step using
      notes: [
        {
          id: new Date().toISOString(),
          name: "notes 1",
          text: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    });

    ToastNotification.success("Registration successful!");
  } catch (error) {
    console.log(error);
    ToastNotification.warning("Failed to register user! Please try again.");
  }
};
