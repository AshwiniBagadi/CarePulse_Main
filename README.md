<div align="center">

# 🏥 CarePulse AI — Doctor Dashboard

**A real-time, AI-powered patient queue management system for modern clinics and hospitals.**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-00C9A7?style=flat-square)](LICENSE)

<br/>

![CarePulse Dashboard Preview](https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=900&q=80)

> *Designed for doctors. Built for speed. Powered by AI.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Firebase Setup](#-firebase-setup)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Dashboard Components](#-dashboard-components)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧠 Overview

**CarePulse AI** is a full-stack, real-time doctor dashboard that streamlines patient queue management in hospitals and clinics. Doctors can view live patient queues, manage consultations, write notes, and get AI-generated summaries — all in one clean interface.

Built with **React + Firebase**, the dashboard syncs live across all devices using Firestore's `onSnapshot` listeners. When no Firebase connection is available, it falls back to mock patient data so the UI always works.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔴 **Live Queue** | Real-time patient queue powered by Firestore `onSnapshot` |
| 🤖 **AI Summary** | Auto-generated symptom summaries for each patient |
| 📋 **Consultation Notes** | Doctors can write and save notes per patient |
| ✅ **Complete / Skip / Pause** | Full queue flow control per patient |
| 🚨 **Priority Flags** | Emergency vs. Normal patient tagging |
| 📊 **Live Stats** | Today's count, completed, waiting, avg consult time |
| 🔮 **AI Predictions** | Estimated finish time, queue speed, and patients left |
| 🌐 **Online/Offline Toggle** | Doctor availability status |
| 🌙 **Theme Toggle** | Light and dark mode support |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🛠 Tech Stack

**Frontend**
- [React 18](https://reactjs.org/) — UI framework
- [React Router v6](https://reactrouter.com/) — Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Vite](https://vitejs.dev/) — Lightning-fast build tool

**Backend / Database**
- [Firebase Auth](https://firebase.google.com/docs/auth) — Doctor authentication
- [Cloud Firestore](https://firebase.google.com/docs/firestore) — Real-time database
- [Firebase SDK v9](https://firebase.google.com/docs/web/modular-upgrade) — Modular imports

**Fonts**
- [DM Sans](https://fonts.google.com/specimen/DM+Sans) — UI font
- [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Token numbers & stats

---

## 📁 Project Structure

```
carepulse-ai/
├── public/
│   └── favicon.ico
├── src/
│   ├── lib/
│   │   └── firebase/
│   │       └── config.ts          # Firebase initialization
│   ├── pages/
│   │   ├── DoctorDashboard.jsx    # Main doctor dashboard
│   │   └── Login.jsx              # Auth page
│   ├── ThemeContext.tsx            # Light/dark theme provider
│   ├── App.tsx                    # Root component & routes
│   └── main.tsx                   # Entry point
├── .env.local                     # Firebase credentials (gitignored)
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `>= 18.x`
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) project with Firestore and Auth enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/carepulse-ai.git
cd carepulse-ai

# 2. Install dependencies
npm install

# 3. Add your Firebase config (see Environment Variables section)
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.

2. Enable **Authentication** → Sign-in method → **Email/Password**

3. Enable **Firestore Database** in production or test mode.

4. Create the following Firestore collections:

**`users` collection**
```
users/{uid}
  ├── name: string
  ├── email: string
  └── role: "doctor" | "patient"
```

**`appointments` collection**
```
appointments/{appointmentId}
  ├── doctorId: string        ← Firebase Auth UID
  ├── patientName: string
  ├── patientAge: number
  ├── tokenNumber: number
  ├── symptoms: string
  ├── status: "booked" | "waiting" | "checkedIn" | "serving" | "completed"
  ├── priority: "normal" | "emergency"
  ├── notes: string
  ├── createdAt: timestamp
  └── completedAt: timestamp
```

5. Set Firestore rules (development):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit `.env.local` to GitHub. It is already listed in `.gitignore`.

---

## 💡 Usage

### Doctor Login
Sign in with a Firebase-authenticated account that has `role: "doctor"` in the `users` collection.

### Running Without Firebase
The dashboard works out-of-the-box with **mock patient data** if no Firebase connection is available. It automatically falls back to `MOCK_PATIENTS` when the `appointments` collection is empty.

### Queue Flow
1. Doctor opens dashboard → sees live queue
2. Click a patient row to jump to that patient
3. Review symptoms and AI summary
4. Add consultation notes
5. Click **Complete** → patient marked as `completed`, next patient loads
6. Click **Skip** → moves to next patient without completing
7. Click **Pause** → pauses the session

---

## 🧩 Dashboard Components

| Component | Purpose |
|---|---|
| `Navbar` | Live clock, online status, theme toggle, logout |
| `Doctor Info + Stats` | Shows doctor name, today's count, completed, waiting, avg time |
| `Currently Serving Card` | Active patient with symptoms, AI summary, notes, and actions |
| `Today's Queue` | Scrollable live list of all patients, click to select |
| `AI Predictions` | Estimated finish time, queue speed, patients remaining |

---

## 🗺 Roadmap

- [x] Real-time Firestore queue sync
- [x] Complete / Skip / Pause queue flow
- [x] AI symptom summary display
- [x] Light / Dark theme toggle
- [x] Emergency priority flags
- [ ] Prescription generation & PDF export
- [ ] Patient history & past visits
- [ ] In-app messaging between doctor and patient
- [ ] Push notifications for new patient check-ins
- [ ] Analytics dashboard (weekly/monthly trends)
- [ ] Multi-doctor support per clinic
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# Fork the repo, then:
git checkout -b feature/your-feature-name
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

Please follow the existing code style and add comments where relevant.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ for healthcare workers everywhere.

**CarePulse AI** — *Faster queues. Better care.*

</div>
