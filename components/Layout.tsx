
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  onVoiceToggle: () => void;
  onSosTrigger: () => void;
}

const Layout: React.FC<LayoutProps> = ({ onVoiceToggle, onSosTrigger }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const confirmLocalReset = () => {
    const confirmed = window.confirm('Clear all VaultSpace demo data from this browser? This permanently removes local profiles, alerts, activity history, and saved credential IDs.');
    if (confirmed) onSosTrigger();
  };

  const navItems = [
    { label: 'Family', icon: 'family_restroom', path: '/vault/family' },
    { label: 'Work', icon: 'work', path: '/vault/adult' },
    { label: 'Operator', icon: 'admin_panel_settings', path: '/vault/operator' },
    { label: 'Reset', icon: 'delete_sweep', path: '/lockdown', isSos: true },
    { label: 'Alerts', icon: 'notifications', path: '/alert' },
    { label: 'Settings', icon: 'settings', path: '/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-card-dark/95 backdrop-blur-xl border-t border-slate-800/50 pb-safe pt-2">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            if (item.isSos) {
              return (
                <button
                  key={item.label}
                  onClick={confirmLocalReset}
                  aria-label="Clear all VaultSpace demo data"
                  className="flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 text-red-500 hover:text-red-400 active:scale-90"
                >
                  <span className="material-symbols-outlined text-[26px] animate-pulse">
                    {item.icon}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-tight text-red-500">
                    {item.label}
                  </span>
                </button>
              );
            }
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={`Open ${item.label}`}
                className={`flex flex-1 flex-col items-center justify-center gap-1 transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill-current' : ''}`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-tight transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Voice Button */}
      <button
        onClick={onVoiceToggle}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-50 group border-2 border-white/10"
        aria-label="Open browser assistant demo"
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:opacity-40"></div>
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">mic</span>
      </button>
    </div>
  );
};

export default Layout;
