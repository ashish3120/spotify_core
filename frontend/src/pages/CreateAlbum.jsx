import { useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function CreateAlbum() {
  const [title, setTitle] = useState('');
  const [allMusics, setAllMusics] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/music/').then(res => setAllMusics(res.data.musics || [])).catch(() => {});
  }, []);

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) return toast.error('Select at least one track');
    setLoading(true);
    try {
      await API.post('/music/album', { title, musics: selected });
      toast.success('Album created!');
      setTitle('');
      setSelected([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Create Album</h1>
      <p className="page-subtitle">Group your tracks into an album</p>

      <form onSubmit={handleSubmit} className="upload-form">
        <div className="auth-field">
          <label htmlFor="album-title">Album Title</label>
          <input
            id="album-title"
            type="text"
            placeholder="Name your album"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label>Select Tracks ({selected.length} selected)</label>
          <div className="track-selector">
            {allMusics.length === 0 && (
              <p className="track-selector-empty">No tracks available. Upload some first!</p>
            )}
            {allMusics.map((track) => (
              <div
                key={track._id}
                className={`track-selector-item ${selected.includes(track._id) ? 'track-selector-item--selected' : ''}`}
                onClick={() => toggleSelect(track._id)}
              >
                <div className="track-selector-check">
                  {selected.includes(track._id) ? '✓' : ''}
                </div>
                <div className="track-selector-info">
                  <span className="track-selector-title">{track.title}</span>
                  <span className="track-selector-artist">{track.artist?.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="auth-btn upload-btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Album'}
        </button>
      </form>
    </div>
  );
}
