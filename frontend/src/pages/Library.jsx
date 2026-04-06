import { useState, useEffect } from 'react';
import API from '../api/axios';
import AlbumCard from '../components/AlbumCard';
import TrackCard from '../components/TrackCard';

export default function Library() {
  const [tab, setTab] = useState('albums');
  const [albums, setAlbums] = useState([]);
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="library-page">
      <h1 className="page-title">Your Library</h1>

      <div className="library-tabs">
        <button
          className={`library-tab ${tab === 'albums' ? 'library-tab--active' : ''}`}
          onClick={() => setTab('albums')}
        >
          Albums
        </button>
        <button
          className={`library-tab ${tab === 'tracks' ? 'library-tab--active' : ''}`}
          onClick={() => setTab('tracks')}
        >
          Tracks
        </button>
      </div>

      {tab === 'albums' && (
        <div className="card-grid">
          {albums.length > 0 ? (
            albums.map(album => <AlbumCard key={album._id} album={album} />)
          ) : (
            <div className="home-empty"><p>No albums found</p></div>
          )}
        </div>
      )}

      {tab === 'tracks' && (
        <div className="card-grid">
          {musics.length > 0 ? (
            musics.map(track => <TrackCard key={track._id} track={track} trackList={musics} />)
          ) : (
            <div className="home-empty"><p>No tracks found</p></div>
          )}
        </div>
      )}
    </div>
  );
}
