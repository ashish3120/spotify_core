import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle cx="24" cy="24" r="24" fill="#1DB954" />
            <path d="M34.4 21.8c-5.7-3.4-15-3.7-20.4-2-.9.3-1.8-.2-2.1-1.1-.3-.9.2-1.8 1.1-2.1 6.2-1.9 16.5-1.6 23 2.3.8.5 1.1 1.5.6 2.3-.5.7-1.5 1-2.2.6zm-.3 4.7c-.4.6-1.3.8-1.9.4-4.7-2.9-11.9-3.7-17.5-2-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 6.4-1.9 14.3-1 19.7 2.3.6.4.8 1.2.4 1.8zm-2.2 4.5c-.3.5-1 .7-1.6.4-4.1-2.5-9.3-3.1-15.4-1.7-.6.1-1.2-.2-1.3-.8-.1-.6.2-1.2.8-1.3 6.7-1.5 12.4-.9 17 2 .5.3.7 1 .5 1.4z" fill="#fff" />
          </svg>
        </div>
        <h1 className="auth-title">Log in to Spotify</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up for Spotify</Link>
        </p>
      </div>
    </div>
  );
}
