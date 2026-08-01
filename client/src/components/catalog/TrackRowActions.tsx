import React, { useState } from 'react';
import { PromoteWithMakoDialog } from '../marketing/PromoteWithMakoDialog';
import { Share2, Play, Heart, Download } from 'lucide-react';

interface TrackRowActionsProps {
  trackId: string;
  trackTitle: string;
  genre?: string;
  isArtistOwner?: boolean;
}

export const TrackRowActions: React.FC<TrackRowActionsProps> = ({
  trackId,
  trackTitle,
  genre = 'Afrobeat',
  isArtistOwner = true,
}) => {
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);

  return (
    <div className="flex items-center space-x-3">
      <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Play Preview">
        <Play className="w-4 h-4" />
      </button>
      <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Like Track">
        <Heart className="w-4 h-4" />
      </button>
      <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors" title="Download">
        <Download className="w-4 h-4" />
      </button>
      {isArtistOwner && (
        <>
          <button
            onClick={() => setIsPromoteOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center space-x-1.5 transition-all"
            title="Launch Mako Promotional Campaign"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Promote with Mako</span>
          </button>
          <PromoteWithMakoDialog
            isOpen={isPromoteOpen}
            onClose={() => setIsPromoteOpen(false)}
            releaseId={trackId}
            releaseTitle={trackTitle}
            defaultGenre={genre}
          />
        </>
      )}
    </div>
  );
};

export default TrackRowActions;
