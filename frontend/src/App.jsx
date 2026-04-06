import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Upload from './pages/Upload';
import CreateAlbum from './pages/CreateAlbum';
import AlbumDetail from './pages/AlbumDetail';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <PlayerProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
        <Player />
      </div>
    </PlayerProvider>
  );
}

function ArtistRoute() {
  const { user } = useAuth();
  if (user?.role !== 'artist') return <Navigate to="/" replace />;
  return <Outlet />;
}

function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
}

function ThemeManager() {
  const { user } = useAuth();
  
  useEffect(() => {
    if (user?.role === 'artist') {
      document.documentElement.setAttribute('data-theme', 'artist');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeManager />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#282828',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/album/:albumId" element={<AlbumDetail />} />
            <Route element={<ArtistRoute />}>
              <Route path="/upload" element={<Upload />} />
              <Route path="/create-album" element={<CreateAlbum />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
