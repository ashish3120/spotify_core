import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause } from 'react-icons/fa';

export default function TrackCard({ track, trackList }) {
  const { play, pause, currentTrack, isPlaying } = usePlayer();
  const isActive = currentTrack?._id === track._id;

  const handleClick = () => {
    if (isActive && isPlaying) {
      pause();
    } else {
      play(track, trackList);
    }
  };

  return (
    <div className={`track-card ${isActive ? 'track-card--active' : ''}`} onClick={handleClick}>
      <div className="track-card-artwork">
        <div className="track-card-artwork-placeholder">♫</div>
        <div className="track-card-overlay">
          {isActive && isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </div>
      </div>
      <div className="track-card-info">
        <span className="track-card-title">{track.title}</span>
        <span className="track-card-artist">
          {track.artist?.username || 'Unknown'}
        </span>
      </div>
    </div>
  );
}
