import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoHome, GoHomeFill } from 'react-icons/go';
import { BiSearch } from 'react-icons/bi';
import { MdLibraryMusic } from 'react-icons/md';
import { IoAddCircleOutline } from 'react-icons/io5';
import { RiLogoutBoxRLine } from 'react-icons/ri';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <svg viewBox="0 0 48 48" width="36" height="36">
          <circle cx="24" cy="24" r="24" fill="#1DB954" />
          <path d="M34.4 21.8c-5.7-3.4-15-3.7-20.4-2-.9.3-1.8-.2-2.1-1.1-.3-.9.2-1.8 1.1-2.1 6.2-1.9 16.5-1.6 23 2.3.8.5 1.1 1.5.6 2.3-.5.7-1.5 1-2.2.6zm-.3 4.7c-.4.6-1.3.8-1.9.4-4.7-2.9-11.9-3.7-17.5-2-.7.2-1.4-.2-1.6-.9-.2-.7.2-1.4.9-1.6 6.4-1.9 14.3-1 19.7 2.3.6.4.8 1.2.4 1.8zm-2.2 4.5c-.3.5-1 .7-1.6.4-4.1-2.5-9.3-3.1-15.4-1.7-.6.1-1.2-.2-1.3-.8-.1-.6.2-1.2.8-1.3 6.7-1.5 12.4-.9 17 2 .5.3.7 1 .5 1.4z" fill="#fff" />
        </svg>
        <span>Spotify</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <GoHomeFill size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <BiSearch size={24} />
          <span>Search</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <MdLibraryMusic size={24} />
          <span>Your Library</span>
        </NavLink>
      </nav>

      <div className="sidebar-divider"></div>

      {user?.role === 'artist' && (
        <div className="sidebar-section">
          <NavLink to="/upload" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IoAddCircleOutline size={24} />
            <span>Upload Music</span>
          </NavLink>
          <NavLink to="/create-album" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <IoAddCircleOutline size={24} />
            <span>Create Album</span>
          </NavLink>
        </div>
      )}

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-username">{user?.username}</span>
            <span className="sidebar-role">{user?.role}</span>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <RiLogoutBoxRLine size={20} />
        </button>
      </div>
    </aside>
  );
}
