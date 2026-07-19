import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

type Props = {
  src: string;
  title: string;
  artistName?: string;
};

export function AudioPlayer({ src, title, artistName }: Props) {
  const howlRef = useRef<Howl | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    howlRef.current?.unload();
    howlRef.current = new Howl({
      src: [src],
      html5: true,
      onend: () => setPlaying(false),
    });
    return () => {
      howlRef.current?.unload();
    };
  }, [src]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const howl = howlRef.current;
      if (!howl) return;
      const seek = howl.seek() as number;
      const duration = howl.duration();
      if (duration) setProgress((seek / duration) * 100);
    }, 500);
    return () => window.clearInterval(id);
  }, [playing]);

  const toggle = () => {
    const howl = howlRef.current;
    if (!howl) return;
    if (playing) {
      howl.pause();
      setPlaying(false);
    } else {
      howl.play();
      setPlaying(true);
    }
  };

  return (
    <div className="rounded-xl bg-indigo-900/40 border border-indigo-700/50 p-4">
      <div className="text-sm text-cream/70">{artistName}</div>
      <div className="font-semibold text-cream mb-3">{title}</div>
      <div className="h-1 bg-indigo-950 rounded mb-3">
        <div className="h-1 bg-terracotta rounded" style={{ width: `${progress}%` }} />
      </div>
      <button
        type="button"
        onClick={toggle}
        className="px-4 py-2 rounded-lg bg-terracotta text-white hover:bg-terracotta/90"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
