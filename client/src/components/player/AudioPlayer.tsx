import { useState } from 'react';
import { getProxiedImageUrl } from '@/lib/utils';
import { usePlayer } from '@/providers/PlayerProvider';
import { Button } from '@/components/ui/button';
import { Play, Pause, Loader2, SkipBack, SkipForward, Repeat, Repeat1, ListMusic, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    isLoading, 
    progress, 
    duration, 
    pauseTrack, 
    resumeTrack,
    playNext,
    playPrevious,
    repeatMode,
    setRepeatMode,
    queue,
    queueIndex,
    setQueue,
    seekTrack
  } = usePlayer();
  const [showQueue, setShowQueue] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);

  if (!currentTrack) return null;

  const currentProgress = isDragging ? dragTime : (progress || 0);
  const progressPercent = duration ? (currentProgress / duration) * 100 : 0;

  const toggleRepeatMode = () => {
    if (repeatMode === 'off') setRepeatMode('queue');
    else if (repeatMode === 'queue') setRepeatMode('track');
    else setRepeatMode('off');
  };

  return (
    <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] sm:bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 p-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="absolute top-[-8px] left-0 right-0 h-4 flex items-center group cursor-pointer">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentProgress}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          onChange={(e) => {
            setIsDragging(true);
            setDragTime(Number(e.target.value));
          }}
          onMouseUp={(e) => {
            setIsDragging(false);
            seekTrack(Number((e.target as HTMLInputElement).value));
          }}
          onTouchEnd={(e) => {
            setIsDragging(false);
            seekTrack(Number((e.target as HTMLInputElement).value));
          }}
          onKeyUp={(e) => {
            setIsDragging(false);
            seekTrack(Number((e.target as HTMLInputElement).value));
          }}
          className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-muted transition-all group-hover:h-1.5">
          <div
            className="h-full bg-primary relative pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100 shadow-sm" />
          </div>
        </div>
      </div>
      
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-2 sm:px-8">
        <div className="flex items-center gap-3 overflow-hidden">
          {currentTrack.coverUrl ? (
            <img src={getProxiedImageUrl(currentTrack.coverUrl)} alt="Cover" className="h-10 w-10 shrink-0 rounded-md object-cover sm:h-12 sm:w-12" />
          ) : (
            <div className="h-10 w-10 shrink-0 rounded-md bg-muted sm:h-12 sm:w-12" />
          )}
          <div className="min-w-0 flex flex-col justify-center max-w-[120px] sm:max-w-xs">
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">
              {currentTrack.title}
            </p>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              {currentTrack.artistName}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center gap-1 sm:gap-4 flex-1 max-w-[200px] sm:max-w-[300px]">
          <Button 
            variant="ghost" 
            size="icon" 
            className="flex h-8 w-8 sm:h-10 sm:w-10" 
            onClick={playPrevious}
          >
            <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <Button
            variant="default"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full sm:h-12 sm:w-12"
            onClick={() => (isPlaying ? pauseTrack() : resumeTrack())}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-current sm:h-6 sm:w-6" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-1 sm:h-6 sm:w-6" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="flex h-8 w-8 sm:h-10 sm:w-10" 
            onClick={playNext}
          >
            <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 justify-end w-[60px] sm:w-[120px]">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRepeatMode}
            className={cn("flex h-8 w-8 sm:h-10 sm:w-10", repeatMode !== 'off' && "text-primary")}
          >
            {repeatMode === 'track' ? (
              <Repeat1 className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Repeat className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowQueue((prev) => !prev)}
            className={cn("flex h-8 w-8 sm:h-10 sm:w-10 relative", showQueue && "bg-muted text-primary")}
          >
            <ListMusic className="h-3 w-3 sm:h-4 sm:w-4" />
            {queue.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-primary text-[8px] sm:text-[9px] font-bold text-primary-foreground">
                {queue.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {showQueue && (
        <div className="absolute bottom-full right-4 mb-2 max-h-80 w-80 sm:w-96 overflow-y-auto rounded-lg border border-border bg-card p-4 shadow-xl text-card-foreground">
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <ListMusic className="h-4 w-4" /> Playback Queue ({queue.length})
            </h3>
            <button
              onClick={() => setShowQueue(false)}
              className="rounded text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {queue.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">Your queue is empty.</p>
          ) : (
            <ul className="space-y-2">
              {queue.map((track, idx) => {
                const isCurrent = idx === queueIndex || track.id === currentTrack.id;
                return (
                  <li
                    key={`${track.id}-${idx}`}
                    onClick={() => {
                      setQueue(queue, idx);
                      setShowQueue(false);
                    }}
                    className={cn(
                      "flex items-center justify-between rounded-md p-2 text-xs transition-colors cursor-pointer",
                      isCurrent
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="w-5 shrink-0 text-muted-foreground">{idx + 1}.</span>
                      <div className="truncate">
                        <p className="truncate font-medium">{track.title}</p>
                        <p className="truncate text-muted-foreground/80">{track.artistName}</p>
                      </div>
                    </div>
                    {isCurrent && <span className="text-[10px] uppercase font-bold text-primary shrink-0 ml-2">Playing</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
