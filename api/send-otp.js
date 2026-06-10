import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import crypto from "crypto";

let app;
let db;

function getDb() {
  if (!db) {
    const firebaseConfig = {
      apiKey: process.env.VITE_API_KEY,
      authDomain: process.env.VITE_APP_DOMAIN,
      projectId: process.env.VITE_PROJECT_ID,
      storageBucket: process.env.VITE_STORAGE_BUCKET,
      messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
      appId: process.env.VITE_APP_ID,
      measurementId: process.env.VITE_MEASURENENT_ID,
    };
    app = initializeApp(firebaseConfig);
    db = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  }
  return db;
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { username, email, isSetup } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const userRef = doc(getDb(), "users", username);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      return res.status(404).json({ error: "User not found." });
    }

    const userData = userSnapshot.data();
    let targetEmail = email;

    if (!isSetup) {
      // Forgot Password flow: Send OTP to the configured recovery email
      if (!userData.recoveryEmail) {
        return res.status(400).json({ error: "No recovery email configured for this locker." });
      }
      targetEmail = userData.recoveryEmail;
    } else {
      // Setup Recovery Email flow: Email must be provided in body
      if (!email) {
        return res.status(400).json({ error: "Email is required for setup." });
      }
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP using SHA-256 for secure comparison
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins expiry

    // Save tempRecovery details to Firestore
    await updateDoc(userRef, {
      tempRecovery: {
        email: targetEmail,
        otpHash: otpHash,
        expiresAt: expiresAt,
      },
    });

    // Create Transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "465"),
      secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const actionText = isSetup ? "verify your recovery email setup" : "reset your password";

    // Send Mail
    const mailOptions = {
      from: `"NotesLocker" <${process.env.SMTP_USER}>`,
      to: targetEmail,
      subject: `NotesLocker Verification Code: ${otp}`,
      text: `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes. Use this to ${actionText}.\n\n---\nNotesLocker: https://noteslocker.vercel.app\nGitHub Repository: https://github.com/senapati484/NotesLocker`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <h2 style="color: #ff5f03; font-weight: bold; margin-bottom: 20px; margin-top: 0; font-family: Outfit, sans-serif;">NotesLocker</h2>
          <p style="font-size: 16px; color: #334155;">Hello,</p>
          <p style="font-size: 14px; color: #475569; line-height: 1.5;">
            You requested a verification code to <strong>${actionText}</strong> for your locker <strong>/${username}</strong>.
          </p>
          <div style="margin: 30px 0; text-align: center;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #0f172a; background-color: #f8fafc; padding: 12px 24px; border-radius: 12px; border: 1px solid #cbd5e1; display: inline-block;">
              ${otp}
            </span>
          </div>
          <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
            <p style="font-size: 13px; color: #64748b; margin: 0 0 10px 0;">
              Securely store and lock your notes with <strong>NotesLocker</strong>.
            </p>
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 15px;">
              <a href="https://noteslocker.vercel.app" style="color: #ff5f03; text-decoration: none; margin-right: 15px; font-weight: bold;">Visit NotesLocker</a>
              <a href="https://github.com/senapati484/NotesLocker" style="color: #ff5f03; text-decoration: none; font-weight: bold;">GitHub Repository</a>
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin: 15px 0 0 0; border-top: 1px dashed #f1f5f9; padding-top: 10px;">
              This verification code is valid for 10 minutes. If you did not make this request, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
