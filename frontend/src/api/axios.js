import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://spotify-core.onrender.com/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default API;
