import React, { useState } from 'react';
import { usePromotedCampaigns } from '../../hooks/useMarketingIntegration';
import { PromoteWithMakoDialog } from '../../components/marketing/PromoteWithMakoDialog';
import { Share2, Sparkles, ExternalLink, TrendingUp, Music } from 'lucide-react';

export const PromotionDashboardPage: React.FC = () => {
  const { data, isLoading, error } = usePromotedCampaigns();
  const [selectedTrack, setSelectedTrack] = useState<{ id: string; title: string } | null>(null);

  const mockCatalogTracks = [
    { id: '1a2b3c4d-1111-2222-3333-444455556666', title: 'Midnight Amapiano Groove', genre: 'Amapiano', plays: '12,450' },
    { id: '2b3c4d5e-2222-3333-4444-555566667777', title: 'Nairobi Nights (Feat. Sauti)', genre: 'Afro-fusion', plays: '45,210' },
    { id: '3c4d5e6f-3333-4444-5555-666677778888', title: 'Accra Sunrise Anthem', genre: 'Highlife', plays: '8,900' },
  ];

  const campaigns = data?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mako AI Promotion Center</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Instant Catalog Syndication & Smart Links
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Select any published track from your artist catalog to automatically bundle artwork, stream destinations, and genre tags into a promotional Mako campaign with one click.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center space-x-2">
          <Music className="w-5 h-5 text-emerald-400" />
          <span>Select Release to Promote</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockCatalogTracks.map((track) => (
            <div key={track.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {track.genre}
                </span>
                <h4 className="text-base font-bold text-slate-100 mt-3">{track.title}</h4>
                <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  <span>{track.plays} total streams</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedTrack({ id: track.id, title: track.title })}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Promote with Mako</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-lg font-bold text-slate-200">Active Promotional Campaigns</h3>
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading synced Mako campaigns...</div>
        ) : error ? (
          <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl text-center text-slate-400 text-sm">
            No active Mako promotional campaigns found for this profile yet. Click "Promote with Mako" above to get started!
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-10 bg-slate-900/50 border border-slate-800 rounded-2xl text-center space-y-3">
            <Share2 className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-medium text-slate-300">No promotional campaigns launched yet</p>
            <p className="text-xs text-slate-500">Launch a campaign above to syndicate your releases and generate smart links.</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Release Title</th>
                  <th className="p-4">Genre Target</th>
                  <th className="p-4">Mako Campaign ID</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm">
                {campaigns.map((camp: any) => (
                  <tr key={camp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-bold text-slate-100">{camp.releaseTitle}</td>
                    <td className="p-4 text-slate-300">{camp.targetGenre}</td>
                    <td className="p-4 font-mono text-xs text-teal-400">{camp.makoCampaignId || 'Synchronizing...'}</td>
                    <td className="p-4">
                      <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20 font-bold">
                        {camp.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <a
                        href={`http://localhost:4001/social/campaigns/${camp.makoCampaignId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 underline"
                      >
                        <span>View in Mako</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PromoteWithMakoDialog
        isOpen={!!selectedTrack}
        onClose={() => setSelectedTrack(null)}
        releaseId={selectedTrack?.id || ''}
        releaseTitle={selectedTrack?.title || ''}
      />
    </div>
  );
};

export default PromotionDashboardPage;
