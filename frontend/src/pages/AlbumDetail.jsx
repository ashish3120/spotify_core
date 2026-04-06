import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaClock } from 'react-icons/fa';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { play, pause, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await API.get(`/music/album/${albumId}`);
        setAlbum(res.data.album);
      } catch (err) {
        console.error('Failed to fetch album:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!album) {
    return <div className="page-error">Album not found</div>;
  }

  const tracks = album.musics || [];
  const isAlbumPlaying = tracks.some(t => t._id === currentTrack?._id) && isPlaying;

  const handlePlayAll = () => {
    if (tracks.length === 0) return;
    if (isAlbumPlaying) {
      pause();
    } else {
      play(tracks[0], tracks);
    }
  };

  const handleTrackClick = (track) => {
    if (currentTrack?._id === track._id && isPlaying) {
      pause();
    } else {
      play(track, tracks);
    }
  };

  return (
    <div className="album-detail">
      <div className="album-detail-header">
        <div className="album-detail-cover">
          <div className="album-detail-cover-placeholder">💿</div>
        </div>
        <div className="album-detail-info">
          <span className="album-detail-type">ALBUM</span>
          <h1 className="album-detail-title">{album.title}</h1>
          <div className="album-detail-meta">
            <span className="album-detail-artist">{album.artist?.username}</span>
            <span className="album-detail-dot">•</span>
            <span>{tracks.length} song{tracks.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      <div className="album-detail-actions">
        <button className="album-play-btn" onClick={handlePlayAll}>
          {isAlbumPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
      </div>

      <div className="album-tracklist">
        <div className="tracklist-header">
          <span className="tracklist-num">#</span>
          <span className="tracklist-title-head">Title</span>
          <span className="tracklist-duration"><FaClock size={14} /></span>
        </div>
        {tracks.map((track, i) => {
          const active = currentTrack?._id === track._id;
          return (
            <div
              key={track._id}
              className={`tracklist-row ${active ? 'tracklist-row--active' : ''}`}
              onClick={() => handleTrackClick(track)}
            >
              <span className="tracklist-num">
                {active && isPlaying ? (
                  <span className="tracklist-eq">
                    <span></span><span></span><span></span>
                  </span>
                ) : (
                  i + 1
                )}
              </span>
              <div className="tracklist-track-info">
                <span className={`tracklist-track-title ${active ? 'text-green' : ''}`}>
                  {track.title}
                </span>
                <span className="tracklist-track-artist">
                  {track.artist?.username || album.artist?.username}
                </span>
              </div>
              <span className="tracklist-duration">--:--</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
