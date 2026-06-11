# NotesLocker 🚀

NotesLocker is a lightweight, secure, and open-source cloud notepad application built with React and Firebase. It enables users to create, update, and sync notes securely without storing any personal information or raw passwords. 

The application utilizes a **Zero-Knowledge End-to-End Encryption (E2EE)** model powered by the browser's native **Web Crypto API**. The server/database has absolutely zero access to your notes, locker passwords, or cryptographic keys.

---

## 📱 Screenshots

### Landing Page
<img width="1710" height="952" alt="note2" src="https://github.com/user-attachments/assets/5a00aa25-0ad8-48fe-a0d8-3dc2b6fabee2" />

### Notes Workspace
<img width="1710" height="951" alt="notes" src="https://github.com/user-attachments/assets/8959ba7d-da1b-4fd8-8fec-d8010f3978ef" />

---

## 🔒 Zero-Knowledge Cryptographic Architecture (E2EE)

NotesLocker ensures absolute privacy by performing all encryption and decryption operations locally inside the user's browser. Plaintext notes and passwords are never transmitted over the network.

### 1. Key Derivation (PBKDF2)
When you register or log in, your browser takes your password and derives a 256-bit symmetric key using **PBKDF2 (Password-Based Key Derivation Function 2)**:
* **Algorithm**: HMAC-SHA-256
* **Iterations**: 100,000 rounds
* **Salt**: A cryptographically random salt generated per locker (`passwordSalt`)
This derived key is used solely in-memory to decrypt your locker's Master Key.

### 2. Two-Tier Key Architecture
To support seamless password changes without re-encrypting all notes, NotesLocker uses a two-tier key hierarchy:
* **Master Key**: A random 256-bit key generated locally using `window.crypto.getRandomValues()`. Your notes are encrypted with this Master Key.
* **Encrypted Master Key**: The Master Key is encrypted using your derived password key (AES-GCM) and stored in Firestore (`encryptedMasterKeyUser`).
* **Password Change**: When changing your password, the browser simply decrypts the Master Key, derives a new key from your new password, re-encrypts the Master Key, and saves the new encrypted Master Key to Firestore. Your encrypted notes remain untouched.

### 3. Symmetrical Notes Encryption (AES-GCM)
All notes are serialized to a JSON string and encrypted using **AES-GCM (Advanced Encryption Standard in Galois/Counter Mode)** with 256-bit keys:
* **Authentication**: AES-GCM provides authenticated encryption, guaranteeing data integrity and preventing unauthorized modification.
* **Initialization Vector (IV)**: A unique, cryptographically secure 12-byte IV is generated for every save operation. This ensures that identical notes text never yields the same ciphertext.

### 4. Client-Side Authentication (Zero-Knowledge Proof)
To authenticate you without saving your password on the server:
* On registration, your browser encrypts the validator string `"locker_unlocked"` with your derived password key to create `validatorCiphertext`.
* On login, the browser attempts to decrypt `validatorCiphertext` using the derived key. If decryption succeeds and resolves to `"locker_unlocked"`, authentication is successful. The database never stores or receives a password hash.

### 5. Secure Recovery Escrow & OTP
Since we cannot reset your password, we offer a Zero-Knowledge recovery mechanism:
* **Setup**: The browser generates a random **Recovery Key**, encrypts the Master Key with it (`encryptedMasterKeyRecovery`), and sends the plain Recovery Key to a serverless function (`/api/verify-otp`) alongside an email OTP.
* **Escrow**: The server verifies the OTP, encrypts the Recovery Key using a private server-side key (`RECOVERY_ENCRYPTION_KEY` via AES-256-GCM), and stores it in Firestore (`serverRecoveryKey`).
* **Recovery**: Upon entering the correct OTP during forgot password recovery, the server decrypts `serverRecoveryKey` and sends the plain Recovery Key to the browser. The browser decrypts `encryptedMasterKeyRecovery` to retrieve the Master Key, letting the user set a new password.

---

### Cryptographic Data Flow

```
                      === CLIENT BROWSER ===                      === FIRESTORE ===

  Locker Password ──► PBKDF2 (100k rounds, Salt) ──► Password Key
                                                         │
    "locker_unlocked" ────────────► AES-GCM ────────────┼────────► validatorCiphertext
                                                         │
    Master Key (Random 256-bit) ──► AES-GCM ────────────┼────────► encryptedMasterKeyUser
          │
          ▼
    Plain Notes (JSON) ───────────► AES-GCM ────────────┼────────► encryptedNotes
                                                         │
    Recovery Key (Random) ────────► AES-GCM (Master) ───┼────────► encryptedMasterKeyRecovery
          │
          ▼
    Plain Recovery Key ──► [Server Encrypts (ENV Key)] ──┼────────► serverRecoveryKey
```

---

## Features

- **🔒 Zero-Knowledge Security (E2EE)**: Complete client-side encryption using the native Web Crypto API (AES-GCM 256-bit + PBKDF2 key derivation). Passwords are never sent or stored.
- **🔑 Recovery Key Escrow**: Password recovery utilizing a secure server-side escrow mechanism, verified via email OTP sent through a secure Vercel Serverless Function.
- **⚡ Typing Lag Elimination**: Extracted and memoized individual note elements (`NoteItem`) and search queries to optimize editor performance.
- **🎨 Premium UI Overhaul**: Upgraded colors to brand orange, replaced browser alerts with custom modals, implemented event-driven toast notifications, and adjusted mobile viewports.
- **🛠️ Hover Tooltip Fix**: Disabled browser-native tooltips on truncated notes inside the sidebar.
- **🌙 Dark Mode Support**: Sleek, eye-friendly dark theme that toggles dynamically.

---

## Live Preview [Link 🚀](https://noteslocker.vercel.app)

- **Check Out**: You can checkout the live preview from here.
- **Hosting**: This website is hosted on Vercel.
- **Database**: We use Cloud Firestore for secure, encrypted document storage.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com) or [yarn](https://classic.yarnpkg.com/lang/en/docs/)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/senapati484/NotesLocker
   cd NotesLocker
   ```
2. Install dependencies:
   ```sh
   npm install # or yarn install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   VITE_API_KEY=your_api_key
   VITE_APP_DOMAIN=your_app_domain
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_storage_bucket
   VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_APP_ID=your_app_id
   VITE_MEASUREMENT_ID=your_measurement_id
   ```
4. Start the development server:
   ```sh
   npm run dev # or yarn dev
   ```

---

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and create a pull request. Ensure that your changes align with the project's goals and adhere to best practices.

## License

This project is licensed under the [MIT License](LICENSE).
