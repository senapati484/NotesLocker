import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../hooks/firebase";
import ToastNotification from "./ToastNotification";
import { hashPassword } from "../utils/crypto";
import { LuShieldAlert, LuLock, LuX, LuMail } from "react-icons/lu";

const ForgotPasswordModal = ({ isVisible, onClose, username }) => {
  const [step, setStep] = useState("init"); // 'init' | 'otp' | 'reset' | 'no-email'
  const [emailMasked, setEmailMasked] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mask Email Helper
  const maskEmail = (email) => {
    if (!email) return "";
    const [local, domain] = email.split("@");
    if (local.length <= 2) {
      return `${local[0]}***@${domain}`;
    }
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  };

  // Check recovery email configuration when modal opens
  useEffect(() => {
    const checkRecoveryEmail = async () => {
      if (!isVisible || !username) return;
      try {
        setIsSubmitting(true);
        const userRef = doc(db, "users", username);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          if (userData.recoveryEmail) {
            setEmailMasked(maskEmail(userData.recoveryEmail));
            setStep("init");
          } else {
            setStep("no-email");
          }
        } else {
          ToastNotification.error(`Locker /${username} does not exist.`);
          onClose();
        }
      } catch (error) {
        console.error("Error checking recovery email:", error);
        ToastNotification.error("Failed to query locker details.");
      } finally {
        setIsSubmitting(false);
      }
    };

    checkRecoveryEmail();
  }, [isVisible, username, onClose]);

  if (!isVisible) return null;

  const handleSendOtp = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          isSetup: false,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        ToastNotification.success(`Verification code sent to your recovery email`);
        setStep("otp");
      } else {
        ToastNotification.error(result.error || "Failed to send code.");
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
      const userRef = doc(db, "users", username);
      const userSnapshot = await getDoc(userRef);

      if (!userSnapshot.exists()) return;

      const userData = userSnapshot.data();
      const tempRecovery = userData.tempRecovery;

      if (!tempRecovery) {
        ToastNotification.error("No active OTP found. Please send a new code.");
        return;
      }

      const enteredHash = await hashPassword(cleanOtp);
      const now = new Date().toISOString();

      if (now > tempRecovery.expiresAt) {
        ToastNotification.error("Verification code has expired. Please send a new one.");
        return;
      }

      if (enteredHash !== tempRecovery.otpHash) {
        ToastNotification.error("Invalid verification code. Please try again.");
        return;
      }

      // Successful verification -> Move to password reset
      setStep("reset");
      ToastNotification.success("OTP verified! Set your new password.");
    } catch (error) {
      console.error(error);
      ToastNotification.error("Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePassword = (pwd) => {
    const errors = [];
    if (!/[a-zA-Z]/.test(pwd)) errors.push("at least one letter");
    if (!/[0-9]/.test(pwd)) errors.push("at least one number");
    if (pwd.length < 5) errors.push("at least 5 characters");

    if (errors.length > 0) {
      ToastNotification.error(`Password requires: ${errors.join(", ")}.`);
      return false;
    }
    return true;
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      ToastNotification.warning("Please enter a password.");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    if (newPassword !== confirmNewPassword) {
      ToastNotification.error("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const hashedPassword = await hashPassword(newPassword);
      const userRef = doc(db, "users", username);

      await updateDoc(userRef, {
        password: hashedPassword,
        tempRecovery: null, // Clear OTP details
      });

      ToastNotification.success("Password reset successful! You can now log in.");
      onClose();
    } catch (error) {
      console.error(error);
      ToastNotification.error("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-4 transition-all duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 w-full max-w-sm relative transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <LuX className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <div className="p-3 bg-[#ff5f03]/10 dark:bg-[#ff5f03]/10 rounded-2xl mb-3 text-[#ff5f03] dark:text-[#ff5f03] shrink-0">
            {step === "no-email" ? <LuShieldAlert className="w-7 h-7 text-rose-500" /> : <LuLock className="w-7 h-7" />}
          </div>
          <h2 className="text-xl font-bold font-display text-slate-800 dark:text-white">
            {step === "no-email" ? "Recovery Impossible" : "Recover Locker"}
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center mt-1">
            {step === "no-email"
              ? "No recovery credentials were set up for this locker."
              : "Verify security code sent to your linked recovery email."}
          </p>
        </div>

        {step === "no-email" && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Because NotesLocker does not store emails, names, or accounts, we cannot recover passwords unless you have explicitly configured a recovery email beforehand.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white text-sm font-semibold rounded-full transition-all duration-200 mt-4 shadow-md shadow-rose-600/10"
            >
              Go Back
            </button>
          </div>
        )}

        {step === "init" && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/80 text-center text-xs">
              Linked Email: <span className="font-semibold text-slate-700 dark:text-slate-300">{emailMasked}</span>
            </div>
            <button
              onClick={handleSendOtp}
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200"
            >
              {isSubmitting ? "Sending OTP..." : "Send Verification OTP"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Verification OTP
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
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={isSubmitting || otp.length !== 6}
              className="w-full py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? "Verifying..." : "Verify OTP Code"}
            </button>
          </div>
        )}

        {step === "reset" && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                  <LuLock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                  <LuLock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff5f03]/20 focus:border-[#ff5f03] text-sm transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isSubmitting}
              className="w-full py-3 bg-[#ff5f03] hover:bg-[#e04f02] active:scale-[0.98] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#ff5f03]/15 hover:shadow-[#ff5f03]/25 transition-all duration-200 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

ForgotPasswordModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

export default ForgotPasswordModal;
