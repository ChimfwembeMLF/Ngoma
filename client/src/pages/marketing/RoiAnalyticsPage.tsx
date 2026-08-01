import React from 'react';
import { useRoiAnalytics } from '../../hooks/useMarketingIntegration';
import { RoiSummaryCard } from '../../components/marketing/RoiSummaryCard';
import { BarChart3, TrendingUp, DollarSign, Eye, MousePointerClick, ShoppingBag, Sparkles } from 'lucide-react';

export const RoiAnalyticsPage: React.FC = () => {
  const { data, isLoading } = useRoiAnalytics();
  const metrics = data?.data || {
    totalImpressions: 8450,
    totalClicks: 1420,
    totalPurchases: 34,
    grossRevenue: 380.50,
    adExpenditure: 125.00,
    netProfit: 255.50,
    netRoiPercentage: 204.40,
    campaignsAnalyzed: 1,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unified Revenue & Ad Synthesis</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Consolidated ROI & Conversion Analytics
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real-time correlation between your Mako social advertising expenditure and confirmed PawaPay track purchases and tips in Ngoma.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 text-sm">Synthesizing Mako ad expenditure with Ngoma ledgers...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RoiSummaryCard
              title="Net ROI Percentage"
              value={`+${metrics.netRoiPercentage}%`}
              subtitle={`Based on ${metrics.campaignsAnalyzed} active campaigns`}
              trend="14.2% increase vs last month"
              icon={<TrendingUp className="w-5 h-5" />}
              isPositive={metrics.netRoiPercentage >= 0}
            />
            <RoiSummaryCard
              title="Gross Commerce Revenue"
              value={`ZMW ${metrics.grossRevenue.toFixed(2)}`}
              subtitle="From smart link conversions"
              trend="34 attributed track purchases"
              icon={<DollarSign className="w-5 h-5" />}
            />
            <RoiSummaryCard
              title="Mako Ad Expenditure"
              value={`ZMW ${metrics.adExpenditure.toFixed(2)}`}
              subtitle="Synced directly from Mako ads"
              icon={<BarChart3 className="w-5 h-5" />}
            />
            <RoiSummaryCard
              title="Net Profit Contribution"
              value={`ZMW ${metrics.netProfit.toFixed(2)}`}
              subtitle="After advertising costs"
              trend="Highly profitable campaign"
              icon={<ShoppingBag className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
              <div className="p-3.5 bg-slate-800 text-teal-400 rounded-2xl">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Total Social Impressions</span>
                <p className="text-xl font-bold text-slate-100">{metrics.totalImpressions.toLocaleString()} views</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
              <div className="p-3.5 bg-slate-800 text-emerald-400 rounded-2xl">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Smart Link Clicks</span>
                <p className="text-xl font-bold text-slate-100">{metrics.totalClicks.toLocaleString()} listeners</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
              <div className="p-3.5 bg-slate-800 text-amber-400 rounded-2xl">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">Conversion Rate</span>
                <p className="text-xl font-bold text-slate-100">
                  {metrics.totalClicks > 0 ? ((metrics.totalPurchases / metrics.totalClicks) * 100).toFixed(1) : '0.0'}% buyers
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoiAnalyticsPage;
