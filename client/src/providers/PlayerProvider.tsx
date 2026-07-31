import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export type TrackData = {
  id: string;
  title: string;
  artistName: string;
  streamUrl: string;
  coverUrl?: string;
};

export type RepeatMode = 'off' | 'track' | 'queue';

type PlayerContextType = {
  currentTrack: TrackData | null;
  isPlaying: boolean;
  isLoading: boolean;
  progress: number;
  duration: number;
  queue: TrackData[];
  queueIndex: number;
  repeatMode: RepeatMode;
  playTrack: (track: TrackData) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTrack: (time: number) => void;
  addToQueue: (track: TrackData) => void;
  setQueue: (tracks: TrackData[], startIndex?: number) => void;
  updateQueueWithoutPlaying: (tracks: TrackData[]) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  playNext: () => void;
  playPrevious: () => void;
};

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [queue, setQueueState] = useState<TrackData[]>([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [repeatMode, setRepeatModeState] = useState<RepeatMode>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobCache = useRef<Map<string, string>>(new Map());
  const stateRef = useRef({ queue, queueIndex, repeatMode, currentTrack });

  useEffect(() => {
    stateRef.current = { queue, queueIndex, repeatMode, currentTrack };
  }, [queue, queueIndex, repeatMode, currentTrack]);

  const preloadTrackToCache = useCallback(async (track?: TrackData) => {
    if (!track || !track.id || blobCache.current.has(track.id)) return;
    try {
      const res = await fetch(track.streamUrl);
      if (res.ok) {
        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);
        blobCache.current.set(track.id, objectUrl);
      }
    } catch (e) {
      console.warn('Silent preload failure for track:', track.id, e);
    }
  }, []);

  const playTrackInternal = useCallback((track: TrackData) => {
    if (!audioRef.current) return;
    setCurrentTrack(track);
    setIsLoading(true);

    const cachedUrl = blobCache.current.get(track.id);
    audioRef.current.src = cachedUrl || track.streamUrl;
    audioRef.current.play().catch((err) => {
      console.error('Audio play error:', err);
      setIsLoading(false);
      setIsPlaying(false);
    });

    if (!cachedUrl) {
      preloadTrackToCache(track);
    }

    // Proactively preload the next track in the queue into RAM
    const { queue, queueIndex, repeatMode } = stateRef.current;
    if (queue.length > 0) {
      let nextIdx = queueIndex + 1;
      if (nextIdx >= queue.length && repeatMode === 'queue') nextIdx = 0;
      if (nextIdx < queue.length && queue[nextIdx]) {
        preloadTrackToCache(queue[nextIdx]);
      }
    }
  }, [preloadTrackToCache]);

  const playNext = useCallback(() => {
    const { queue, queueIndex, repeatMode } = stateRef.current;
    if (queue.length === 0) return;

    let nextIndex = queueIndex + 1;
    if (nextIndex >= queue.length) {
      if (repeatMode === 'queue') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }
    setQueueIndex(nextIndex);
    playTrackInternal(queue[nextIndex]);
  }, [playTrackInternal]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onEnded = () => {
      const { repeatMode, currentTrack } = stateRef.current;
      if (repeatMode === 'track' && currentTrack) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };
    const onCanPlay = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('error', onError);
    };
  }, [playNext]);

  const playTrack = (track: TrackData) => {
    // If playing the same track, just resume
    if (currentTrack?.id === track.id) {
      if (!isPlaying) {
        audioRef.current?.play().catch(() => {});
      }
      return;
    }
    setQueueState([track]);
    setQueueIndex(0);
    playTrackInternal(track);
  };

  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (!audioRef.current || !currentTrack) return;
    audioRef.current.play().catch(() => {});
  };

  const seekTrack = (time: number) => {
    if (!audioRef.current || !currentTrack) return;
    const cachedUrl = blobCache.current.get(currentTrack.id);
    if (cachedUrl && audioRef.current.src !== cachedUrl) {
      const wasPlaying = !audioRef.current.paused;
      audioRef.current.src = cachedUrl;
      audioRef.current.currentTime = time;
      if (wasPlaying) audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  };

  const addToQueue = (track: TrackData) => {
    setQueueState((prev) => [...prev, track]);
    if (queueIndex === -1) {
      setQueueIndex(0);
      playTrackInternal(track);
    }
  };

  const setQueue = (tracks: TrackData[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setQueueState(tracks);
    setQueueIndex(startIndex);
    playTrackInternal(tracks[startIndex]);
  };

  const updateQueueWithoutPlaying = (tracks: TrackData[]) => {
    setQueueState(tracks);
    if (currentTrack) {
      const newIdx = tracks.findIndex((t) => t.id === currentTrack.id);
      if (newIdx !== -1) {
        setQueueIndex(newIdx);
      }
    }
  };

  const setRepeatMode = (mode: RepeatMode) => {
    setRepeatModeState(mode);
  };

  const playPrevious = () => {
    const { queue, queueIndex } = stateRef.current;
    if (queue.length === 0) return;
    
    // If we're more than 3 seconds in, just restart the track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIndex = queueIndex - 1;
    if (prevIndex < 0) {
      prevIndex = 0; // Or loop to end if repeatMode === 'queue'
    }
    setQueueIndex(prevIndex);
    playTrackInternal(queue[prevIndex]);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isLoading,
        progress,
        duration,
        queue,
        queueIndex,
        repeatMode,
        playTrack,
        pauseTrack,
        resumeTrack,
        seekTrack,
        addToQueue,
        setQueue,
        updateQueueWithoutPlaying,
        setRepeatMode,
        playNext,
        playPrevious,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
