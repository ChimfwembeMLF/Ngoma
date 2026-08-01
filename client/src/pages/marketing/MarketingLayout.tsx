import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sparkles, BarChart3, Users, Share2, ShieldCheck, Layers } from 'lucide-react';

export const MarketingLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Promotions & Smart Links', path: '/marketing/promotions', icon: Share2 },
    { name: 'ROI & Revenue Analytics', path: '/marketing/analytics/roi', icon: BarChart3 },
    { name: 'Fan Segments & Mako CRM', path: '/marketing/fans/segments', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl text-slate-950 font-black flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center space-x-2">
                <span>Ngoma Studio</span>
                <span className="text-slate-500 font-normal">/</span>
                <span className="text-emerald-400 font-semibold">Mako Marketing & Tekrem ID</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 bg-slate-800/80 border border-slate-700/80 rounded-full px-3 py-1 text-xs font-semibold text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tekrem SSO Active</span>
            </div>
            <a
              href="http://localhost:4001"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Open Mako Dashboard</span>
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 -mb-px">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/marketing/promotions' && location.pathname === '/marketing');
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 py-3.5 text-sm font-bold border-b-2 transition-colors ${
                    isActive
                      ? 'border-emerald-400 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p>© 2026 Ngoma Music Platform. Integrated with Mako Marketing AI and Tekrem ID Single Sign-On.</p>
          <span className="font-mono text-slate-600">v1.0.0-unified</span>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
