import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://spotify-core.onrender.com/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// In-memory access token storage
let localAccessToken = null;
let isRefreshing = false;
let failedQueue = [];

export const setLocalAccessToken = (token) => {
  localAccessToken = token;
};

export const getLocalAccessToken = () => {
  return localAccessToken;
};

// Process request queue when refreshing token
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach access token in Authorization header
API.interceptors.request.use(
  (config) => {
    if (localAccessToken) {
      config.headers.Authorization = `Bearer ${localAccessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Capture tokens and handle automatic refresh on 401
API.interceptors.response.use(
  (response) => {
    // Automatically capture accessToken from login, register, and refresh responses
    if (response.data && response.data.accessToken) {
      setLocalAccessToken(response.data.accessToken);
    }
    // Automatically clear accessToken on successful logout
    if (response.config.url.includes('/auth/logout')) {
      setLocalAccessToken(null);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error status is 401 (Unauthorized) and has not been retried yet
    // Exclude login, register, and refresh endpoints to prevent infinite loops
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return API(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await API.post('/auth/refresh');
        const newAccessToken = response.data.accessToken;
        setLocalAccessToken(newAccessToken);
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Session completely expired (refresh token expired/revoked) -> Log out user
        setLocalAccessToken(null);
        localStorage.removeItem('spotify_user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
