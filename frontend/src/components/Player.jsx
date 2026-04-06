import { usePlayer } from '../context/PlayerContext';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { BiShuffle, BiRepeat } from 'react-icons/bi';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
}

export default function Player() {
  const {
    currentTrack, isPlaying, progress, duration, volume,
    togglePlay, seek, changeVolume, playNext, playPrev,
  } = usePlayer();

  if (!currentTrack) return null;

  return (
    <footer className="player">
      <div className="player-track-info">
        <div className="player-artwork">
          <div className="player-artwork-placeholder">♫</div>
        </div>
        <div className="player-text">
          <span className="player-title">{currentTrack.title}</span>
          <span className="player-artist">
            {currentTrack.artist?.username || 'Unknown Artist'}
          </span>
        </div>
      </div>

      <div className="player-controls">
        <div className="player-buttons">
          <button className="player-btn" aria-label="Shuffle">
            <BiShuffle size={18} />
          </button>
          <button className="player-btn" onClick={playPrev} aria-label="Previous">
            <FaStepBackward size={14} />
          </button>
          <button className="player-btn player-btn-play" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} style={{ marginLeft: '2px' }} />}
          </button>
          <button className="player-btn" onClick={playNext} aria-label="Next">
            <FaStepForward size={14} />
          </button>
          <button className="player-btn" aria-label="Repeat">
            <BiRepeat size={18} />
          </button>
        </div>
        <div className="player-progress">
          <span className="player-time">{formatTime(progress)}</span>
          <input
            type="range"
            className="player-slider"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => seek(Number(e.target.value))}
          />
          <span className="player-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-volume">
        <button className="player-btn" onClick={() => changeVolume(volume > 0 ? 0 : 0.7)} aria-label="Mute">
          {volume > 0 ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
        </button>
        <input
          type="range"
          className="player-volume-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
        />
      </div>
    </footer>
  );
}
