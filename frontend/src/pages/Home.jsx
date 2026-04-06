import { useState, useEffect } from 'react';
import API from '../api/axios';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [musicRes, albumRes] = await Promise.all([
          API.get('/music/'),
          API.get('/music/album'),
        ]);
        setMusics(musicRes.data.musics || []);
        setAlbums(albumRes.data.albums || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greetingTime = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-greeting">{greetingTime()}, {user?.username}</h1>
      </header>

      {albums.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">Albums</h2>
          <div className="card-grid">
            {albums.map((album) => (
              <AlbumCard key={album._id} album={album} />
            ))}
          </div>
        </section>
      )}

      {musics.length > 0 && (
        <section className="home-section">
          <h2 className="section-title">All Tracks</h2>
          <div className="card-grid">
            {musics.map((track) => (
              <TrackCard key={track._id} track={track} trackList={musics} />
            ))}
          </div>
        </section>
      )}

      {musics.length === 0 && albums.length === 0 && (
        <div className="home-empty">
          <h2>No music yet</h2>
          <p>
            {user?.role === 'artist'
              ? 'Start by uploading your first track!'
              : 'Check back later for new music.'}
          </p>
        </div>
      )}
    </div>
  );
}
