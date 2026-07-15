import React from 'react';
import { Calendar, Gift, Heart, Sparkles } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';
import { CelebrationCard } from './CelebrationCard';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const shortMonthNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const MonthByMonthView: React.FC = () => {
  const { filteredCelebrations, monthFilter, setMonthFilter } = useCelebrations();

  const scrollToMonth = (monthName: string) => {
    const el = document.getElementById(`month-section-${monthName}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Group filtered celebrations by monthIndex
  const groupedByMonth = monthNames.map((name, idx) => {
    const items = filteredCelebrations
      .filter(c => c.monthIndex === idx)
      .sort((a, b) => a.day - b.day);
    return { name, shortName: shortMonthNames[idx], index: idx, items };
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Quick Jump & Filter Bar */}
      <div className="sticky top-20 z-30 glass-panel p-3 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <span className="text-xs font-bold text-main flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            Jump to Month:
          </span>
          <button
            onClick={() => setMonthFilter('All')}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
              monthFilter === 'All'
                ? 'bg-purple-500 text-white'
                : 'text-purple-400 hover:bg-tertiary'
            }`}
          >
            Show All 12 Months
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
          {groupedByMonth.map((group) => {
            const isSelected = monthFilter === group.name;
            return (
              <button
                key={group.name}
                onClick={() => {
                  if (monthFilter === 'All') {
                    scrollToMonth(group.name);
                  } else {
                    setMonthFilter(isSelected ? 'All' : group.name);
                  }
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md scale-105'
                    : group.items.length > 0
                    ? 'bg-tertiary text-main hover:bg-secondary border border-border'
                    : 'bg-tertiary/40 text-light opacity-50 hover:opacity-80'
                }`}
                title={`${group.name} (${group.items.length} celebrations)`}
              >
                <span>{group.shortName}</span>
                <span className={`text-[10px] mt-0.5 px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted'
                }`}>
                  {group.items.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Month Directory Sections */}
      <div className="space-y-10">
        {groupedByMonth
          .filter(group => monthFilter === 'All' || group.name === monthFilter)
          .map(group => (
            <section
              key={group.name}
              id={`month-section-${group.name}`}
              className="scroll-mt-44"
            >
              {/* Month Section Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/80">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-lg font-bold text-purple-400 shadow-sm">
                    {group.shortName}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-main tracking-tight">
                      {group.name}
                    </h2>
                    <p className="text-xs text-muted font-medium">
                      {group.items.length} celebration{group.items.length !== 1 ? 's' : ''} in {group.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/25 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    {group.items.filter(i => i.event === 'Birthday').length} Birthdays
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/25 flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {group.items.filter(i => i.event === 'Wedding Anniversary').length} Anniversaries
                  </span>
                </div>
              </div>

              {/* Cards Grid for Month */}
              {group.items.length === 0 ? (
                <div className="glass-panel p-8 text-center border border-dashed border-border/70">
                  <Sparkles className="w-6 h-6 text-muted mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-muted">No celebrations match criteria in {group.name}</p>
                </div>
              ) : (
                <div className="grid grid-cols-auto">
                  {group.items.map(item => (
                    <CelebrationCard key={item.id} celebration={item} />
                  ))}
                </div>
              )}
            </section>
          ))}
      </div>

    </div>
  );
};
