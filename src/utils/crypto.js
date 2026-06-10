/**
 * Helper: Convert ArrayBuffer to Hex string
 */
const bufToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * Helper: Convert Hex string to Uint8Array
 */
const hexToBuf = (hex) => {
  if (!hex) return new Uint8Array();
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

/**
 * Hashes a plaintext string using SHA-256 via the browser's Web Crypto API.
 */
export const hashPassword = async (str) => {
  if (!str) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return bufToHex(hashBuffer);
};

/**
 * Generates a cryptographically secure 256-bit random hex key.
 */
export const generateRandomKey = () => {
  const bytes = window.crypto.getRandomValues(new Uint8Array(32));
  return bufToHex(bytes);
};

/**
 * Generates a cryptographically secure 128-bit random hex salt.
 */
export const generateRandomSalt = () => {
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  return bufToHex(bytes);
};

/**
 * Derives a 256-bit AES-GCM key from a password and a salt using PBKDF2.
 */
export const deriveKey = async (password, saltHex) => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const salt = hexToBuf(saltHex);

  const baseKey = await window.crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    baseKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

/**
 * Imports a raw 256-bit hex key as a CryptoKey for AES-GCM.
 */
export const importKeyFromHex = async (hexKey) => {
  const keyBuffer = hexToBuf(hexKey);
  return await window.crypto.subtle.importKey(
    "raw",
    keyBuffer,
    "AES-GCM",
    true,
    ["encrypt", "decrypt"]
  );
};

/**
 * Encrypts plaintext using AES-GCM with a given CryptoKey.
 * Returns { ciphertext: hex, iv: hex }
 */
export const encryptData = async (plaintext, key) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 12-byte IV for GCM

  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    data
  );

  return {
    ciphertext: bufToHex(ciphertextBuffer),
    iv: bufToHex(iv),
  };
};

/**
 * Decrypts AES-GCM ciphertext hex with a given CryptoKey and IV hex.
 * Returns decrypted plaintext string.
 */
export const decryptData = async (ciphertextHex, ivHex, key) => {
  const ciphertext = hexToBuf(ciphertextHex);
  const iv = hexToBuf(ivHex);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
};
