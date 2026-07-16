# NotesLocker - Development Setup Guide

This guide helps you set up NotesLocker for local development.

---

## Prerequisites

Make sure you have installed:

- Node.js 18+
- npm
- Git

Check versions:

```bash
node -v
npm -v
git --version
```

---

## Clone the repository

```bash
git clone https://github.com/senapati484/NotesLocker.git
cd NotesLocker
```

---

## Install dependencies

```bash
npm install
```

---

## Create the environment file

Create a file named:

```
.env
```

Copy the following:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Replace the values with your Firebase project's credentials.

---

## What each variable does

| Variable | Description |
|-----------|-------------|
| VITE_FIREBASE_API_KEY | Firebase API key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase authentication domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase Storage bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| VITE_FIREBASE_APP_ID | Firebase application ID |

---

## Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Build for production

```bash
npm run build
```

---

## Preview production build

```bash
npm run preview
```

---

## Project Structure

```
NotesLocker
│
├── public/
├── src/
│   ├── components/
│   ├── hooks/ (contains firebase.js)
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env
├── index.html
├── package.json
└── vite.config.js
```

---

## Common Setup Mistakes

### Blank screen

Usually caused by missing Firebase environment variables.

---

### Firebase authentication not working

Verify:

- API Key
- Auth Domain
- Project ID

---

### npm install fails

Try:

```bash
npm cache clean --force
npm install
```

---

### Vite command not found

Run:

```bash
npm install
```

again.

---

## Contributing

Before opening a Pull Request:

- Pull the latest changes
- Create a feature branch
- Run the application locally
- Ensure there are no build errors

Happy coding!
