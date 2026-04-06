# Spotify Clone - Backend API Documentation

Welcome to the backend API for the Spotify Clone project! This guide is designed to help you integrate the frontend seamlessly with this backend.

## 🚀 Getting Started

### Backend URL
`http://localhost:3000`

### Prerequisites for Frontend Integration
- **Axios** (Recommended for HTTP requests)
- **Cookie management**: Enable `withCredentials: true` in your Axios configuration (crucial for authentication).

---

## 🔐 Authentication System

The backend uses **Cookie-based JWT Authentication**. When a user logs in or registers, the server sends an `httpOnly` cookie named `token`. 

> [!IMPORTANT]
> To maintain the user session across requests, you must set `withCredentials: true` in your API client (e.g., Axios).

### User Roles
1.  **user**: Basic listener. Can search music and view albums.
2.  **artist**: Creative user. Can upload music and create albums.

---

## 📂 API Endpoints

### 1. Authentication (`/api/auth`)

| Endpoint | Method | Body Parameters | Description |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | `username`, `email`, `password`, `role` (optional, default "user") | Registers a new user. Returns user info. |
| `/login` | `POST` | `username` (or `email`), `password` | Logs in the user and sets the auth cookie. |
| `/logout` | `POST` | (none) | Clears the auth cookie and logs out the user. |

### 2. Music (`/api/music`)

| Endpoint | Method | Requirements | Description |
| :--- | :--- | :--- | :--- |
| `/upload` | `POST` | Role: `artist` | Uploads music using `multipart/form-data`. Key: `music` (file), `title` (text). |
| `/` | `GET` | Role: `user` or `artist` | Fetches all musics. (Note: Currently has internal skip/limit applied). |

### 3. Albums (`/api/music/album`)

| Endpoint | Method | Requirements | Description |
| :--- | :--- | :--- | :--- |
| `/album` | `POST` | Role: `artist` | Creates an album. Body: `{ "title": String, "musics": ["music_id1", "music_id2"] }`. |
| `/album` | `GET` | Role: `user` or `artist` | Fetches all albums (only title and artist username). |
| `/album/:albumId` | `GET` | Role: `user` or `artist` | Fetches details and songs of a specific album. |

---

## 🏗️ Data Models (Schemas)

### User
```json
{
  "username": "string (unique)",
  "email": "string (unique)",
  "role": "enum ['artist', 'user']"
}
```

### Music
```json
{
  "title": "string",
  "uri": "string (URL to audio source)",
  "artist": "ObjectId (ref: user)"
}
```

### Album
```json
{
  "title": "string",
  "artist": "ObjectId (ref: user)",
  "musics": ["ObjectId (ref: music)"]
}
```

---

## 🛠️ Frontend Implementation Tips

### Setting up Axios Global Configuration
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true  // Required for cookies
});

export default api;
```

### Handling Multi-part Uploads (For Artists)
```javascript
const formData = new FormData();
formData.append('title', 'My Secret Song');
formData.append('music', fileObject);

const response = await api.post('/music/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
```

### Note on CORS
If you host your frontend on a different port (e.g., `localhost:5173`), you **must** install and configure the `cors` package in the backend `app.js`:
```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
```

---

## ⚙️ Environment Configuration (Backend)
Ensure your `.env` file contains:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A secure string for signing tokens.
- `IMAGEKIT_PRIVATE_KEY`: For music file storage.
