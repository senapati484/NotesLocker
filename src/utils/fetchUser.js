import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

export const fetchUser = async (user) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", user));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { exists: true, userData };
    } else {
      return { exists: false };
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    ToastNotification.warning(`Error fetching ${user}'s Data`);
    throw error;
  }
};
