import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "./ToastNotification";
import { generateRandomKey, encryptData, importKeyFromHex } from "../utils/crypto";
import { LuMail, LuShieldCheck, LuX, LuLock } from "react-icons/lu";

const RecoveryEmailModal = ({ isVisible, onClose, currentUser }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");

  // Fetch latest recovery email config when modal opens
  useEffect(() => {
    const fetchLatestEmail = async () => {
      if (!isVisible || !currentUser?.name) return;
      try {
        const userRef = doc(db, "users", currentUser.name);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          if (data.recoveryEmail) {
            setVerifiedEmail(data.recoveryEmail);
            setEmail(data.recoveryEmail);
          }
        }
      } catch (error) {
        console.error("Error fetching recovery email:", error);
      }
    };
    fetchLatestEmail();
  }, [isVisible, currentUser]);

  if (!isVisible) return null;

  const handleSendOtp = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      ToastNotification.warning("Please enter a valid email address.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      ToastNotification.error("Please enter a valid email format.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.name,
          email: cleanEmail,
          isSetup: true,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        ToastNotification.success(`Verification code sent to ${cleanEmail}`);
        setIsOtpSent(true);
      } else {
        ToastNotification.error(result.error || "Failed to send verification code.");
      }
    } catch (error) {
      console.error(error);
      ToastNotification.error("Failed to connect to verification server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6 || !/^\d+$/.test(cleanOtp)) {
      ToastNotification.warning("Please enter a valid 6-digit numeric code.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!currentUser || !currentUser.masterKey) {
        ToastNotification.error("Invalid user session. Please log in again.");
        return;
      }

      // 1. Generate a random Recovery Key
      const recoveryKey = generateRandomKey();

      // 2. Encrypt the Master Key with the Recovery Key
      const recoveryCryptoKey = await importKeyFromHex(recoveryKey);
      const { ciphertext: encryptedMasterKeyRecovery, iv: masterKeyRecoveryIv } = await encryptData(
        currentUser.masterKey,
        recoveryCryptoKey
      );

      // 3. Store the E2EE recovery key ciphertext in Firestore first
      const userRef = doc(db, "users", currentUser.name);
      await updateDoc(userRef, {
        encryptedMasterKeyRecovery,
        masterKeyRecoveryIv,
      });

      // 4. Call serverless verify-otp endpoint to encrypt the recovery key and verify OTP
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.name,
          otp: cleanOtp,
          isSetup: true,
          recoveryKey: recoveryKey,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setVerifiedEmail(result.email);
        setIsOtpSent(false);
        setOtp("");
        ToastNotification.success("Recovery email configured successfully!");
      } else {
        ToastNotification.error(result.error || "Verification failed.");
      }
    } catch (error) {
      console.error(error);
      ToastNotification.error("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setVerifiedEmail("");
    setEmail("");
    setIsOtpSent(false);
    setOtp("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 transition-all duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm relative transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LuX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="p-3 bg-[#ff5f03]/10 dark:bg-[#ff5f03]/10 rounded-2xl mb-3 text-[#ff5f03] dark:text-[#ff5f03] shrink-0">
            {verifiedEmail ? <LuShieldCheck className="w-7 h-7" /> : <LuMail className="w-7 h-7" />}
          </div>
          <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">
            {verifiedEmail ? "Recovery Email Active" : "Forgot Password Setup"}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
            {verifiedEmail
              ? "Link an email to recover your locker password if forgotten."
              : "Set up recovery email to securely reset your password."}
          </p>
        </div>

        {verifiedEmail ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-500/20 text-center text-xs sm:text-sm">
              Linked to <span className="font-semibold">{verifiedEmail}</span>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-full transition-colors duration-200 mt-2"
            >
              Update Email
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {!isOtpSent ? (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Recovery Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                    <LuMail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={isSubmitting || !email}
                  className="w-full py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? "Sending OTP..." : "Get OTP"}
                </button>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  6-Digit OTP Code
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                    <LuLock className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-955 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => setIsOtpSent(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-full transition-colors duration-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmitting || otp.length !== 6}
                    className="flex-1 py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-xs font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

RecoveryEmailModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default RecoveryEmailModal;
