import { useState, useEffect } from 'react';
import API from '../api/axios';
import TrackCard from '../components/TrackCard';
import AlbumCard from '../components/AlbumCard';
import { BiSearch } from 'react-icons/bi';

export default function Search() {
  const [query, setQuery] = useState('');
  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
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
    fetchAll();
  }, []);

  const q = query.toLowerCase();
  const filteredTracks = musics.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.artist?.username?.toLowerCase().includes(q)
  );
  const filteredAlbums = albums.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.artist?.username?.toLowerCase().includes(q)
  );

  return (
    <div className="search-page">
      <div className="search-bar">
        <BiSearch size={24} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {loading ? (
        <div className="page-loading"><div className="spinner"></div></div>
      ) : (
        <>
          {query && filteredAlbums.length > 0 && (
            <section className="home-section">
              <h2 className="section-title">Albums</h2>
              <div className="card-grid">
                {filteredAlbums.map(album => (
                  <AlbumCard key={album._id} album={album} />
                ))}
              </div>
            </section>
          )}

          {query && filteredTracks.length > 0 && (
            <section className="home-section">
              <h2 className="section-title">Songs</h2>
              <div className="card-grid">
                {filteredTracks.map(track => (
                  <TrackCard key={track._id} track={track} trackList={filteredTracks} />
                ))}
              </div>
            </section>
          )}

          {query && filteredTracks.length === 0 && filteredAlbums.length === 0 && (
            <div className="home-empty">
              <h2>No results found for "{query}"</h2>
              <p>Try a different search term</p>
            </div>
          )}

          {!query && (
            <section className="home-section">
              <h2 className="section-title">Browse All</h2>
              <div className="browse-grid">
                {['Pop', 'Rock', 'Hip-Hop', 'Jazz', 'Electronic', 'Classical', 'R&B', 'Indie'].map((genre, i) => (
                  <div key={genre} className="browse-card" style={{ '--hue': i * 45 }}>
                    <span>{genre}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
