import React from 'react';
import { FanTierBadge } from './FanTierBadge';
import { Mail, Phone, Download } from 'lucide-react';

interface AudienceSegmentTableProps {
  segments: any[];
  isLoading?: boolean;
  onExportCsv?: () => void;
}

export const AudienceSegmentTable: React.FC<AudienceSegmentTableProps> = ({
  segments,
  isLoading = false,
  onExportCsv,
}) => {
  const handleExportCsv = () => {
    if (onExportCsv) {
      onExportCsv();
      return;
    }
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
    link.setAttribute('download', 'ngoma_mako_audience_segments.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
        Synchronizing listener interaction records and CRM audience traits...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-bold rounded-xl flex items-center space-x-2 transition-colors shadow-lg"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Audience List (CSV)</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-800/50 text-xs text-slate-400 uppercase tracking-wider">
              <th className="p-4">Supporter Tier</th>
              <th className="p-4">Contact Information</th>
              <th className="p-4">Preferred Genre</th>
              <th className="p-4">Total Spend</th>
              <th className="p-4">Engagement Velocity</th>
              <th className="p-4">CRM Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {segments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No listener segments match the selected criteria.
                </td>
              </tr>
            ) : (
              segments.map((fan: any) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AudienceSegmentTable;
