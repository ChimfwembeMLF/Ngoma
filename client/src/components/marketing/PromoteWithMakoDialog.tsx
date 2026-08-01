import React, { useState } from 'react';
import { usePromoteRelease } from '../../hooks/useMarketingIntegration';
import { Share2, ExternalLink, Sparkles, X, CheckCircle2, Loader2 } from 'lucide-react';

interface PromoteWithMakoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  releaseId: string;
  releaseTitle: string;
  defaultGenre?: string;
}

export const PromoteWithMakoDialog: React.FC<PromoteWithMakoDialogProps> = ({
  isOpen,
  onClose,
  releaseId,
  releaseTitle,
  defaultGenre = 'Afrobeat',
}) => {
  const [genre, setGenre] = useState(defaultGenre);
  const [caption, setCaption] = useState('');
  const promoteMutation = usePromoteRelease();
  const [result, setResult] = useState<{ makoRedirectUrl: string; smartLinkSlug: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    promoteMutation.mutate(
      { releaseId, targetGenre: genre, customCaption: caption },
      {
        onSuccess: (res: any) => {
          if (res.data) {
            setResult(res.data);
            window.open(res.data.makoRedirectUrl, '_blank', 'noopener,noreferrer');
          }
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Promote with Mako AI</h3>
            <p className="text-xs text-slate-400">One-click social campaigns and smart link creation</p>
          </div>
        </div>

        <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl mb-4 text-sm flex justify-between items-center">
          <span className="text-slate-400">Selected Track:</span>
          <span className="font-semibold text-emerald-300">{releaseTitle}</span>
        </div>

        {result ? (
          <div className="text-center py-4 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-bold text-slate-100">Promotion Initialized!</h4>
              <p className="text-xs text-slate-400">
                Your release metadata and smart link (<span className="text-teal-300 font-mono">/link/{result.smartLinkSlug}</span>) have been synced to Mako.
              </p>
            </div>
            <a
              href={result.makoRedirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Open Mako Campaign Workspace</span>
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Close window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Target Audience Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
                placeholder="e.g. Afrobeat, Amapiano, Highlife"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Custom Social Caption <span className="text-slate-500">(Optional)</span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm focus:outline-none focus:border-emerald-400"
                placeholder="Stream my brand new track across all platforms!"
              />
            </div>

            <button
              type="submit"
              disabled={promoteMutation.isPending}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {promoteMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Syncing to Mako...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Launch One-Click Campaign</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PromoteWithMakoDialog;
