import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
    <Card className="p-4 shadow-sm">
      {artistName && <div className="text-sm text-muted-foreground">{artistName}</div>}
      <div className="mb-3 font-semibold text-foreground">{title}</div>
      <div className="mb-3 h-1.5 rounded-full bg-muted">
        <div
          className="h-1.5 rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <Button type="button" onClick={toggle} variant="default">
        {playing ? 'Pause' : 'Play'}
      </Button>
    </Card>
  );
}
