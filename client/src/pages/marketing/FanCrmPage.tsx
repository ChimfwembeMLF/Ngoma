import React, { useState } from 'react';
import { useFanSegments } from '../../hooks/useMarketingIntegration';
import { AudienceSegmentTable } from '../../components/marketing/AudienceSegmentTable';
import { Filter, Sparkles } from 'lucide-react';

export const FanCrmPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const { data, isLoading } = useFanSegments({ tier: selectedTier || undefined, genre: selectedGenre || undefined });

  const segments = data?.data || [];
  const counts = data?.counts || { vip: 2, fan: 1, casual: 1, total: 4 };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mako CRM & Audience Sync</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Fan CRM & Automated Audience Intelligence
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Ngoma dynamically categorizes your listeners into Casual, Fan, and VIP supporter tiers based on PawaPay tip velocity, track purchase history, and engagement frequency to power targeted promotional outreach in Mako.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Total Roster</span>
          <p className="text-3xl font-extrabold text-slate-100 mt-2">{counts.total}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-amber-500/30 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent">
          <span className="text-xs font-semibold text-amber-400 uppercase">VIP Supporters</span>
          <p className="text-3xl font-extrabold text-amber-300 mt-2">{counts.vip}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-emerald-500/30 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent">
          <span className="text-xs font-semibold text-emerald-400 uppercase">Dedicated Fans</span>
          <p className="text-3xl font-extrabold text-emerald-300 mt-2">{counts.fan}</p>
        </div>
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 uppercase">Casual Listeners</span>
          <p className="text-3xl font-extrabold text-slate-300 mt-2">{counts.casual}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Filter className="w-4 h-4 text-emerald-400" />
          <span>Filter Segments:</span>
        </div>
        <select
          value={selectedTier}
          onChange={(e) => setSelectedTier(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 font-semibold"
        >
          <option value="">All Supporter Tiers</option>
          <option value="VIP">VIP Supporters</option>
          <option value="FAN">Dedicated Fans</option>
          <option value="CASUAL">Casual Listeners</option>
        </select>
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-400 font-semibold"
        >
          <option value="">All Preferred Genres</option>
          <option value="Afrobeat">Afrobeat</option>
          <option value="Amapiano">Amapiano</option>
          <option value="Highlife">Highlife</option>
        </select>
        {(selectedTier || selectedGenre) && (
          <button
            onClick={() => { setSelectedTier(''); setSelectedGenre(''); }}
            className="text-xs text-rose-400 hover:underline ml-2"
          >
            Clear filters
          </button>
        )}
      </div>

      <AudienceSegmentTable segments={segments} isLoading={isLoading} />
    </div>
  );
};

export default FanCrmPage;
