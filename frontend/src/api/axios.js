import axios from 'axios';

const API = axios.create({
  baseURL: 'https://spotify-core.onrender.com/api',
  withCredentials: true,
});

export default API;
