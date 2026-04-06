import { useNavigate } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';

export default function AlbumCard({ album }) {
  const navigate = useNavigate();

  return (
    <div className="album-card" onClick={() => navigate(`/album/${album._id}`)}>
      <div className="album-card-artwork">
        <div className="album-card-artwork-placeholder">💿</div>
        <button className="album-card-play" aria-label="Play album">
          <FaPlay size={18} />
        </button>
      </div>
      <div className="album-card-info">
        <span className="album-card-title">{album.title}</span>
        <span className="album-card-artist">
          {album.artist?.username || 'Unknown'}
        </span>
      </div>
    </div>
  );
}
