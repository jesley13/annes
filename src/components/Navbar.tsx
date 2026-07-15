import React, { useState } from 'react';
import { Sparkles, Calendar as CalendarIcon, UploadCloud, Sun, Moon } from 'lucide-react';
import { ViewMode } from '../types/celebration';
import { useCelebrations } from '../context/CelebrationContext';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onOpenUploadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange, onOpenUploadModal }) => {
  const { stats } = useCelebrations();
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('dark');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      setIsDark(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-white/10 mx-4 mt-4 mb-6 shadow-lg py-3 px-4 md:px-6">
      {/* Top Row: Left Title & Right Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        {/* Title Section (Left-Aligned & Colorful) */}
        <div className="flex flex-col items-start justify-center text-left">
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight whitespace-nowrap">
            <span className="text-pink-500 font-black">Annes</span>{' '}
            <span className="gradient-text-purple font-black">Celebrations</span>{' '}
            <span className="text-indigo-500 dark:text-indigo-400 font-black">Hub</span>
          </h1>
          <p className="text-xs font-bold whitespace-nowrap mt-0.5 flex items-center gap-1.5">
            <span className="text-pink-500">Birthdays</span>
            <span className="text-purple-400">&</span>
            <span className="text-amber-500">Wedding Anniversaries</span>
          </p>
        </div>

        {/* Actions (Upload Excel & Theme Toggle) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenUploadModal}
            className="p-2.5 rounded-xl bg-tertiary border border-border text-purple-400 hover:border-purple-500/50 hover:text-purple-300 hover:bg-secondary transition-all group"
            title="Upload an Excel sheet (`BD&WA.xlsx`)"
            aria-label="Upload Excel"
          >
            <UploadCloud className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-tertiary border border-border text-muted hover:text-main hover:bg-secondary transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </div>

      {/* Bottom Layout: Centrally Aligned Dashboard & Calendar Grid Tabs */}
      <div className="flex items-center justify-center w-full mt-3 pt-3 border-t border-border/40">
        <nav className="flex items-center gap-1 p-1 bg-tertiary/90 rounded-xl border border-border/60 shadow-inner">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                : 'text-muted hover:text-main hover:bg-secondary/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Dashboard</span>
            {(stats?.todayCount || 0) > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500 text-white text-[10px] font-bold animate-bounce">
                {stats?.todayCount || 0}
              </span>
            )}
          </button>

          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              currentView === 'calendar'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                : 'text-muted hover:text-main hover:bg-secondary/60'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar Grid</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
