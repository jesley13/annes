import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Gift, Heart, Sparkles, X } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';
import { CelebrationCard } from './CelebrationCard';
import { Celebration } from '../types/celebration';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC = () => {
  const { celebrations, searchQuery, categoryFilter } = useCelebrations();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayCelebrations, setSelectedDayCelebrations] = useState<Celebration[] | null>(null);

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
  };

  const handleJumpToday = () => {
    setCurrentDate(new Date());
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(new Date(year, parseInt(e.target.value, 10), 1));
  };

  // Calculate calendar grid days
  const firstDayOfMonth = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const prevMonthDays = new Date(year, monthIndex, 0).getDate();

  const gridCells: { dayNumber: number; isCurrentMonth: boolean; monthIdx: number }[] = [];

  // Previous month trailing cells
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    gridCells.push({
      dayNumber: prevMonthDays - i,
      isCurrentMonth: false,
      monthIdx: (monthIndex - 1 + 12) % 12
    });
  }

  // Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    gridCells.push({
      dayNumber: i,
      isCurrentMonth: true,
      monthIdx: monthIndex
    });
  }

  // Next month leading cells to complete grid (42 total squares typically)
  const remainingCells = 42 - gridCells.length;
  for (let i = 1; i <= remainingCells; i++) {
    gridCells.push({
      dayNumber: i,
      isCurrentMonth: false,
      monthIdx: (monthIndex + 1) % 12
    });
  }

  // Filter celebrations for specific month & day
  const getCelebrationsForDate = (mIdx: number, dayNum: number) => {
    return celebrations.filter(item => {
      if (item.monthIndex !== mIdx || item.day !== dayNum) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.month.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (categoryFilter !== 'all' && item.event !== categoryFilter) return false;
      return true;
    });
  };

  const now = new Date();
  const isTodaySquare = (mIdx: number, dayNum: number) => {
    return now.getFullYear() === year && now.getMonth() === mIdx && now.getDate() === dayNum;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Navigation Header */}
      <div className="glass-panel p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg">
            📅
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-main tracking-tight">
              {monthNames[monthIndex]} <span className="text-purple-400">{year}</span>
            </h2>
            <p className="text-xs text-muted">Click any day or badge to inspect celebrations</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handleJumpToday}
            className="btn btn-secondary text-xs px-3 py-1.5"
            title="Jump to current real-time month"
          >
            Today
          </button>

          <select
            value={monthIndex}
            onChange={handleMonthChange}
            className="bg-tertiary border border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-main focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {monthNames.map((name, idx) => (
              <option key={name} value={idx}>{name}</option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg bg-tertiary border border-border text-muted hover:text-main hover:bg-secondary transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg bg-tertiary border border-border text-muted hover:text-main hover:bg-secondary transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel overflow-hidden border border-white/10 shadow-xl">
        {/* Day of Week Header */}
        <div className="grid grid-cols-7 bg-tertiary/90 border-b-2 border-slate-400/50 dark:border-slate-600/70">
          {daysOfWeek.map((day, idx) => (
            <div
              key={day}
              className={`py-3 text-center text-xs font-bold uppercase tracking-wider border-r border-slate-400/40 dark:border-slate-700/60 last:border-r-0 ${
                idx === 0 || idx === 6 ? 'text-purple-400 font-extrabold' : 'text-main'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Squares with Crisp Grid Lines */}
        <div className="calendar-grid">
          {gridCells.map((cell, index) => {
            const dayCelebrations = getCelebrationsForDate(cell.monthIdx, cell.dayNumber);
            const isToday = isTodaySquare(cell.monthIdx, cell.dayNumber);

            return (
              <div
                key={index}
                onClick={() => {
                  if (dayCelebrations.length > 0) {
                    setSelectedDayCelebrations(dayCelebrations);
                  }
                }}
                className={`calendar-cell ${
                  !cell.isCurrentMonth ? 'other-month' : ''
                } ${isToday ? 'ring-2 ring-inset ring-pink-500 bg-pink-500/10 font-bold' : ''} ${
                  dayCelebrations.length > 0 ? 'cursor-pointer' : ''
                }`}
              >
                {/* Square Header (Day number isolated from Today/Events count) */}
                <div className="flex items-center justify-between gap-1 w-full pb-1.5 border-b border-border/40">
                  <span
                    className={`inline-flex items-center justify-center min-w-[24px] h-6 px-1 rounded-md text-xs font-extrabold ${
                      isToday
                        ? 'bg-pink-500 text-white shadow-md'
                        : cell.isCurrentMonth
                        ? 'text-main bg-tertiary/80'
                        : 'text-light'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {dayCelebrations.length > 0 && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold shadow-sm whitespace-nowrap">
                      ★ {dayCelebrations.length} {dayCelebrations.length === 1 ? 'Event' : 'Events'}
                    </span>
                  )}
                </div>

                {/* Celebrations inside Square */}
                <div className="mt-2 space-y-1 overflow-y-auto max-h-[85px]">
                  {dayCelebrations.map((c) => (
                    <div
                      key={c.id}
                      className={`px-1.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 truncate shadow-sm transition-transform hover:scale-105 ${
                        c.event === 'Birthday'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                      title={`${c.name} (${c.event})`}
                    >
                      {c.event === 'Birthday' ? <Gift className="w-2.5 h-2.5 flex-shrink-0" /> : <Heart className="w-2.5 h-2.5 flex-shrink-0" />}
                      <span className="truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Modal */}
      {selectedDayCelebrations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel max-w-2xl w-full p-6 relative shadow-2xl border border-white/20 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-main">
                    Celebrations on {selectedDayCelebrations[0]?.month} {selectedDayCelebrations[0]?.day}
                  </h3>
                  <p className="text-xs text-muted">Inspect details and copy greetings</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDayCelebrations(null)}
                className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-tertiary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-1">
              {selectedDayCelebrations.map((c) => (
                <CelebrationCard key={c.id} celebration={c} />
              ))}
            </div>

            <div className="mt-auto flex justify-end pt-4 border-t border-border">
              <button
                onClick={() => setSelectedDayCelebrations(null)}
                className="btn btn-secondary text-sm"
              >
                Close Day View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
