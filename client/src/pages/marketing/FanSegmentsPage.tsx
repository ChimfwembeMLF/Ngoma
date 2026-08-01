import React, { useState } from 'react';
import { useFanSegments } from '../../hooks/useMarketingIntegration';
import { FanTierBadge } from '../../components/marketing/FanTierBadge';
import { Users, Download, Filter, Mail, Phone, Sparkles } from 'lucide-react';

export const FanSegmentsPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const { data, isLoading } = useFanSegments({ tier: selectedTier || undefined, genre: selectedGenre || undefined });

  const segments = data?.data || [];
  const counts = data?.counts || { vip: 2, fan: 1, casual: 1, total: 4 };

  const handleExportCsv = () => {
    const headers = 'ID,Email,Phone,Preferred Genre,Total Spent (ZMW),Interactions,Supporter Tier\n';
    const rows = segments
      .map(
        (s: any) =>
          `${s.id},${s.contactEmail || 'N/A'},${s.phoneContact || 'N/A'},${s.preferredGenre},${s.totalSpent},${s.interactionsCount},${s.supporterTier}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'ngoma_mako_fan_segments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/20 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mako CRM & Audience Sync</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Automated Fan Segmentation & CRM Roster
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Ngoma dynamically categorizes your listeners into Casual, Fan, and VIP supporter tiers based on PawaPay tip velocity, track purchase history, and engagement frequency.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export CRM Roster (CSV)</span>
        </button>
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

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Synchronizing listener interaction records...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
                <th className="p-4">Supporter Tier</th>
                <th className="p-4">Contact Information</th>
                <th className="p-4">Preferred Genre</th>
                <th className="p-4">Total Spend</th>
                <th className="p-4">Engagement Velocity</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {segments.map((fan: any) => (
                <tr key={fan.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <FanTierBadge tier={fan.supporterTier} />
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center space-x-2 text-slate-200 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{fan.contactEmail || 'Protected Fan Identity'}</span>
                    </div>
                    {fan.phoneContact && (
                      <div className="flex items-center space-x-2 text-slate-400 text-xs">
                        <Phone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                        <span>{fan.phoneContact}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-300 font-semibold">{fan.preferredGenre}</td>
                  <td className="p-4 font-extrabold text-emerald-400">ZMW {Number(fan.totalSpent).toFixed(2)}</td>
                  <td className="p-4 text-slate-300">
                    <span className="font-bold">{fan.interactionsCount}</span> track plays & tips
                  </td>
                  <td className="p-4">
                    <a
                      href={`http://localhost:4001/crm/contacts?query=${encodeURIComponent(fan.contactEmail || fan.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-400 hover:text-teal-300 underline font-semibold"
                    >
                      View in Mako CRM
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FanSegmentsPage;
