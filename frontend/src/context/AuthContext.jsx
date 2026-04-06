import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('spotify_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await API.post('/auth/login', credentials);
    setUser(res.data.user);
    localStorage.setItem('spotify_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const register = async (data) => {
    const res = await API.post('/auth/register', data);
    setUser(res.data.user);
    localStorage.setItem('spotify_user', JSON.stringify(res.data.user));
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.log('Logout API call failed, clearing local session anyway');
    } finally {
      setUser(null);
      localStorage.removeItem('spotify_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
