# NotesLocker

NotesLocker is a lightweight, secure, and open-source notepad application built with React and Firebase. It enables users to create, update, and delete notes securely without storing any personal information. The application uses Firebase Firestore for data storage and ensures robust protection for user data.

![](https://github.com/senapati484/NotesLocker/tree/main/public/Light-mode.gif)

## Features

- **Secure Password Management**: Protect your notes with a secure password.
- **Privacy-Focused Storage**: No personal information is stored.
- **No Account Required**: Start using NotesLocker without signing up.
- **Open-Source Transparency**: Full source code available for review.
- **Dark Mode Support**: Enjoy a theme that suits your preferences.
- **Auto-Save Functionality**: Never lose your progress.

## Live Preview [Link 🚀](https://noteslocker.vercel.app)

- **Check Out**: You can checkout the live preview from here.
- **Hosting**: This website is hosted on vercel.
- **Database**: There we using the Firebase database.

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

## Components

### `App.jsx`

Defines the routes for the application, including:

- `/`: Home page (Home)
- `/register`: Registration page (Register)
- `/:username`: Login page (Login)
- `/:username/notes`: Notes page (protected route) (Notes)

### `Home.jsx`

The home page component allows users to enter a username and get started. It also highlights application features and FAQs.

### `Register.jsx`

The registration page component lets users set a password for their username. It validates the password and stores the user data in Firebase Firestore.

### `Login.jsx`

The login page component enables users to enter their password to access their notes. It fetches user data from Firebase Firestore and validates the password.

### `Notes.jsx`

The notes page component allows users to create, update, and delete notes. It includes features like:

- Auto-save
- Dark mode
- Password change functionality

### `ConfirmPassword.jsx`

A modal component for changing passwords. It validates the new password and updates it in Firebase Firestore.

### `ToastNotification.jsx`

A utility component for toast notifications (success, error, info, and warning) using `react-toastify`.

### `Collapsable.jsx`

A reusable component for collapsible sections, used for displaying FAQs on the home page.

### Utility Files

- **`firebase.js`**: Initializes Firebase and exports the Firestore database instance.
- **`fetchUser.js`**: Defines the `fetchUser` function to fetch user data from Firebase Firestore.
- **`Note.js`**: Contains functions to create, update, and delete notes, as well as update user passwords in Firebase Firestore.
- **`setUser.js`**: Defines the `setUser` function to register new users and store their data in Firebase Firestore.

## Doccumentation [click 🚀](https://github.com/senapati484/NotesLocker/README.md)

## Contributing

Contributions are welcome! Please fork the repository, make your changes, and create a pull request. Ensure that your changes align with the project's goals and adhere to best practices.

## License

This project is licensed under the [MIT License](LICENSE).
