# 🎵 Spotify Clone

A full-stack, premium music streaming platform inspired by Spotify, featuring real-time music uploads, dynamic artist themes, and a responsive modern interface.

## 🚀 Live Demo

- **Frontend (Vercel)**: [https://spotify-taupe-five.vercel.app/login](https://spotify-taupe-five.vercel.app/login)
- **Backend (Render)**: [https://spotify-core.onrender.com](https://spotify-core.onrender.com)

---

## ✨ Features

### 🎨 Premium UI/UX
- **Modern Design**: Sleek dark mode with glassmorphism and smooth transitions.
- **Dynamic Artist Theme**: Automatic UI shift! Artists get a rich **Purple Theme**, while listeners enjoy the classic **Spotify Green**.
- **Responsive Layout**: Designed for seamless experience across all screen sizes.

### 🎧 Music & Playback
- **Infinite Streaming**: Direct audio streaming from high-speed storage.
- **Smart Search**: Find your favorite tracks and artists instantly, with "Top 10" trending suggestions.
- **Player Controls**: Advanced playback with progress tracking, volume control, and play/pause functionality.

### 👩‍🎤 Artist Features
- **Fast Uploads**: Optimized multipart/buffer uploads for high-performance track sharing.
- **Album Management**: Create and manage albums with automatic track population.
- **Upload Progress**: Real-time progress bars for large audio files.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, React Router, React Hot Toast, React Icons.
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT (Cookie-based auth), Multer.
- **Storage**: ImageKit (Optimized for fast audio delivery).
- **Deployment**: Vercel (Frontend), Render (Backend).

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/ashish3120/spotify_core.git
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_URL_ENDPOINT=your_url_endpoint
```

### 3. Install & Start
**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## ⚡ Maintenance & Cold Start
Since the backend is hosted on Render's Free tier, it might experience a "cold start" (15-20 second delay) after 15 minutes of inactivity. 

**Recommendation**: Set up a free monitor at [UptimeRobot](https://uptimerobot.com/) to ping `https://spotify-core.onrender.com/api/ping` every 10 minutes to keep the server awake 24/7.

---

## 🔐 License
This project is for educational purposes. Feel free to fork and build upon it!
