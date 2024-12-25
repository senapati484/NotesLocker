import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "../components/ToastNotification";

export const fetchUser = async (user, navigate) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("name", "==", user));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //   console.log(`${user}'s data:`, userData);
      navigate(`/${user}`, { state: { userData: userData } });
    } else {
      //   console.log(`No user named ${user} found.`);
      navigate("/register", { state: { user: user } });
    }
  } catch (error) {
    console.error("Error fetching user: ", error);
    ToastNotification.warning(`Errot fetching ${user}'s Data`);
  }
};
