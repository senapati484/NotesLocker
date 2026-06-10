import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import crypto from "crypto";

const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_APP_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASURENENT_ID,
};

let app;
let db;

function getDb() {
  if (!db) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  }
  return db;
}

// Helper: Encrypt the recovery key using the server's RECOVERY_ENCRYPTION_KEY
function encryptServer(text) {
  const keyHex = process.env.RECOVERY_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error("Invalid or missing RECOVERY_ENCRYPTION_KEY environment variable.");
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = crypto.randomBytes(12); // GCM standard IV
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  return {
    ciphertext: encrypted,
    iv: iv.toString('hex'),
    tag: tag
  };
}

// Helper: Decrypt the recovery key using the server's RECOVERY_ENCRYPTION_KEY
function decryptServer(ciphertext, ivHex, tagHex) {
  const keyHex = process.env.RECOVERY_ENCRYPTION_KEY;
  if (!keyHex || keyHex.length !== 64) {
    throw new Error("Invalid or missing RECOVERY_ENCRYPTION_KEY environment variable.");
  }
  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const tag = Buffer.from(tagHex, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, otp, isSetup, recoveryKey } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ error: "Username and OTP are required." });
  }

  try {
    const userRef = doc(getDb(), "users", username);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: "User not found." });
    }

    const userData = userSnapshot.data();
    const tempRecovery = userData.tempRecovery;

    if (!tempRecovery) {
      return res.status(400).json({ error: "No active recovery verification found. Please request a new code." });
    }

    const now = new Date().toISOString();
    if (now > tempRecovery.expiresAt) {
      return res.status(400).json({ error: "Verification code has expired. Please request a new one." });
    }

    // Verify OTP hash
    const enteredHash = crypto.createHash("sha256").update(otp.trim()).digest("hex");
    if (enteredHash !== tempRecovery.otpHash) {
      return res.status(400).json({ error: "Invalid verification code. Please try again." });
    }

    if (isSetup) {
      // Setup Recovery Email Flow:
      if (!recoveryKey) {
        return res.status(400).json({ error: "Recovery Key is required for setup." });
      }

      // Encrypt the client's recovery key using server-side AES-GCM
      const encryptedKeyData = encryptServer(recoveryKey);

      // Save verified email and escrowed recovery key details to Firestore
      await updateDoc(userRef, {
        recoveryEmail: tempRecovery.email,
        serverRecoveryKey: encryptedKeyData, // stores ciphertext, iv, tag
        tempRecovery: null, // Clear the temporary recovery state
      });

      return res.status(200).json({ success: true, email: tempRecovery.email });
    } else {
      // Forgot Password / Recovery Flow:
      const serverRecoveryKey = userData.serverRecoveryKey;
      if (!serverRecoveryKey) {
        return res.status(400).json({ error: "Locker is not configured with recovery credentials." });
      }

      // Decrypt the escrowed Recovery Key using the server key
      const plainRecoveryKey = decryptServer(
        serverRecoveryKey.ciphertext,
        serverRecoveryKey.iv,
        serverRecoveryKey.tag
      );

      // Clear the tempRecovery verification data
      await updateDoc(userRef, {
        tempRecovery: null
      });

      return res.status(200).json({ success: true, recoveryKey: plainRecoveryKey });
    }
  } catch (error) {
    console.error("Failed to verify OTP:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
