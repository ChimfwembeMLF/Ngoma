import React, { useState } from 'react';
import { useCreateSmartLink } from '../../hooks/useMarketingIntegration';
import { Share2, Copy, Check, QrCode, Link as LinkIcon } from 'lucide-react';

interface SmartLinkGeneratorProps {
  releaseId: string;
  campaignId: string;
  initialSlug?: string;
}

export const SmartLinkGenerator: React.FC<SmartLinkGeneratorProps> = ({
  releaseId,
  campaignId,
  initialSlug,
}) => {
  const [customSlug, setCustomSlug] = useState(initialSlug || '');
  const [copied, setCopied] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(
    initialSlug ? `${window.location.origin}/link/${initialSlug}` : null
  );
  const createLinkMutation = useCreateSmartLink();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createLinkMutation.mutate(
      { releaseId, campaignId, customSlug: customSlug || undefined },
      {
        onSuccess: (res: any) => {
          if (res.data?.fullUrl) {
            setGeneratedUrl(res.data.fullUrl);
          }
        },
      }
    );
  };

  const handleCopy = () => {
    if (generatedUrl) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <LinkIcon className="w-5 h-5 text-emerald-400" />
        <h3 className="font-bold text-slate-100">Traceable Smart Link Generator</h3>
      </div>

      {generatedUrl ? (
        <div className="space-y-4 pt-2">
          <div className="p-4 bg-slate-950 border border-slate-700/60 rounded-xl flex items-center justify-between">
            <span className="text-sm font-mono text-teal-300 truncate mr-3">{generatedUrl}</span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Attributes stream conversions & PawaPay tips directly to your Mako campaign.</span>
            <button
              onClick={() => setGeneratedUrl(null)}
              className="text-emerald-400 hover:underline font-medium"
            >
              Generate Another Alias
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Custom Handle Alias <span className="text-slate-500">(Optional)</span>
            </label>
            <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden focus-within:border-emerald-400">
              <span className="px-3 text-sm text-slate-500 bg-slate-900 border-r border-slate-700 py-2 font-mono">
                /link/
              </span>
              <input
                type="text"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="my-new-hit-single-2026"
                className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none font-mono"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={createLinkMutation.isPending}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10 flex items-center justify-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{createLinkMutation.isPending ? 'Generating...' : 'Generate Traceable Link & QR Code'}</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default SmartLinkGenerator;
