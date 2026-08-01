import React from 'react';
import { Crown, Heart, User } from 'lucide-react';

interface FanTierBadgeProps {
  tier: 'VIP' | 'FAN' | 'CASUAL' | string;
}

export const FanTierBadge: React.FC<FanTierBadgeProps> = ({ tier }) => {
  switch (tier) {
    case 'VIP':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40 shadow-sm">
          <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span>VIP Supporter</span>
        </span>
      );
    case 'FAN':
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          <Heart className="w-3 h-3 text-emerald-400 fill-emerald-400/30" />
          <span>Dedicated Fan</span>
        </span>
      );
    case 'CASUAL':
    default:
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
          <User className="w-3 h-3 text-slate-400" />
          <span>Casual Listener</span>
        </span>
      );
  }
};

export default FanTierBadge;
