import { doc, getDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

export const fetchUser = async (user) => {
  try {
    if (!user) return { exists: false };
    const userRef = doc(db, "users", user);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const userData = [{
        id: docSnap.id,
        ...data,
      }];
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
