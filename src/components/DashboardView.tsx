import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, PartyPopper } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';
import { CelebrationCard } from './CelebrationCard';
import { ViewMode } from '../types/celebration';

interface DashboardViewProps {
  onViewChange: (view: ViewMode) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onViewChange }) => {
  const { upcomingCelebrations, searchQuery, categoryFilter, monthFilter } = useCelebrations();

  // If search or filters are active on the dashboard, show filtered upcoming list
  const activeList = upcomingCelebrations.filter(item => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchMonth = item.month.toLowerCase().includes(q);
      const matchDate = `${item.month} ${item.day}`.toLowerCase().includes(q);
      if (!matchName && !matchMonth && !matchDate) return false;
    }
    if (categoryFilter !== 'all' && item.event !== categoryFilter) return false;
    if (monthFilter !== 'All' && item.month !== monthFilter) return false;
    return true;
  });

  const todayCelebrations = activeList.filter(c => c.isToday);
  const thisWeekCelebrations = activeList.filter(c => !c.isToday && c.daysRemaining <= 7);
  const next30DaysCelebrations = activeList.filter(c => c.daysRemaining > 7 && c.daysRemaining <= 30);
  const furtherOutCelebrations = activeList.filter(c => c.daysRemaining > 30).slice(0, 8);

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6']
    });
  };

  useEffect(() => {
    if (todayCelebrations.length > 0) {
      // Trigger subtle confetti on load when today has celebrations
      const timer = setTimeout(() => {
        triggerConfetti();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [todayCelebrations.length]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Spotlight / Today Banner */}
      {todayCelebrations.length > 0 && (
        <div className="glass-panel p-6 sm:p-8 relative overflow-hidden ring-2 ring-pink-500/40 bg-gradient-to-r from-pink-500/20 via-purple-500/15 to-amber-500/15 shadow-xl">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500 text-white font-bold text-xs shadow-md animate-bounce">
                <PartyPopper className="w-3.5 h-3.5" /> CELEBRATING TODAY!
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
                Happening Right Now!
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Join the celebration! We have <strong className="text-pink-400 font-bold">{todayCelebrations.length}</strong> special event{todayCelebrations.length > 1 ? 's' : ''} taking place today. Send them your warmest greetings!
              </p>
            </div>

            <button
              onClick={triggerConfetti}
              className="btn btn-primary px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 group self-stretch sm:self-auto"
            >
              <PartyPopper className="w-5 h-5 group-hover:scale-125 transition-transform text-amber-300" />
              <span className="font-bold">Celebrate & Confetti!</span>
            </button>
          </div>

          {/* Cards for Today */}
          <div className="grid grid-cols-auto mt-6">
            {todayCelebrations.map(c => (
              <CelebrationCard
                key={c.id}
                celebration={c}
                daysRemaining={c.daysRemaining}
                isToday={c.isToday}
                turningMilestone={c.turningMilestone}
              />
            ))}
          </div>
        </div>
      )}

      {/* This Week Spotlight (Only shown if celebrations exist within next 7 days) */}
      {thisWeekCelebrations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                ✨
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-main tracking-tight">
                  This Week's Celebrations
                </h2>
                <p className="text-xs text-muted">Happening within the next 7 days</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-tertiary border border-border text-purple-400">
              {thisWeekCelebrations.length} upcoming
            </span>
          </div>

          <div className="grid grid-cols-auto">
            {thisWeekCelebrations.map(c => (
              <CelebrationCard
                key={c.id}
                celebration={c}
                daysRemaining={c.daysRemaining}
                isToday={c.isToday}
                turningMilestone={c.turningMilestone}
              />
            ))}
          </div>
        </section>
      )}

      {/* Next 30 Days Section (Only shown if celebrations exist in the 8-30 day window) */}
      {next30DaysCelebrations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                📅
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-main tracking-tight">
                  Upcoming Next 30 Days
                </h2>
                <p className="text-xs text-muted">Plan your wishes and reminders ahead of time</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-tertiary border border-border text-amber-400">
              {next30DaysCelebrations.length} upcoming
            </span>
          </div>

          <div className="grid grid-cols-auto">
            {next30DaysCelebrations.map(c => (
              <CelebrationCard
                key={c.id}
                celebration={c}
                daysRemaining={c.daysRemaining}
                isToday={c.isToday}
                turningMilestone={c.turningMilestone}
              />
            ))}
          </div>
        </section>
      )}

      {/* Further Out / Next Up Highlights */}
      <section className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-main">On the Horizon</h3>
            <p className="text-xs text-muted">Next closest celebrations later in the year</p>
          </div>
          <button
            onClick={() => onViewChange('months')}
            className="btn btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 text-purple-400 hover:border-purple-500/40"
          >
            <span>View All 12 Months</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-auto">
          {furtherOutCelebrations.map(c => (
            <CelebrationCard
              key={c.id}
              celebration={c}
              daysRemaining={c.daysRemaining}
              isToday={c.isToday}
              turningMilestone={c.turningMilestone}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
