import { createContext, useContext, useState, useRef } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const audioRef = useRef(new Audio());

  const play = (track, trackList = []) => {
    if (trackList.length > 0) {
      setQueue(trackList);
      const idx = trackList.findIndex(t => t._id === track._id);
      setQueueIndex(idx >= 0 ? idx : 0);
    }
    if (currentTrack?._id === track._id) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    audioRef.current.pause();
    audioRef.current.src = track.uri;
    audioRef.current.volume = volume;
    audioRef.current.play();
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) pause();
    else if (currentTrack) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (v) => {
    setVolume(v);
    audioRef.current.volume = v;
  };

  const playNext = () => {
    if (queue.length === 0) return;
    const next = (queueIndex + 1) % queue.length;
    setQueueIndex(next);
    play(queue[next], queue);
  };

  const playPrev = () => {
    if (queue.length === 0) return;
    const prev = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prev);
    play(queue[prev], queue);
  };

  // Update progress
  audioRef.current.ontimeupdate = () => setProgress(audioRef.current.currentTime);
  audioRef.current.onloadedmetadata = () => setDuration(audioRef.current.duration);
  audioRef.current.onended = () => playNext();

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, progress, duration, volume, queue,
      play, pause, togglePlay, seek, changeVolume, playNext, playPrev, audioRef,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
