import React, { useState } from 'react';
import { Gift, Heart, Calendar, Sparkles, Clock, Image as ImageIcon } from 'lucide-react';
import { Celebration } from '../types/celebration';
import { GreetingCardModal } from './GreetingCardModal';

interface CelebrationCardProps {
  celebration: Celebration;
  daysRemaining?: number;
  isToday?: boolean;
  turningMilestone?: string | null;
}

export const CelebrationCard: React.FC<CelebrationCardProps> = ({
  celebration,
  daysRemaining,
  isToday,
  turningMilestone
}) => {
  const [showWishModal, setShowWishModal] = useState(false);

  const isBirthday = celebration.event === 'Birthday';

  const handleDownloadIcs = () => {
    const now = new Date();
    let targetYear = now.getFullYear();
    const targetDate = new Date(targetYear, celebration.monthIndex, celebration.day);
    
    if (targetDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      targetYear += 1;
    }

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${targetYear}${pad(celebration.monthIndex + 1)}${pad(celebration.day)}`;
    const nextDayStr = `${targetYear}${pad(celebration.monthIndex + 1)}${pad(celebration.day + 1)}`;

    const title = isBirthday ? `🎉 ${celebration.name}'s Birthday` : `💖 ${celebration.name}'s Wedding Anniversary`;
    const desc = isBirthday ? `Celebrate ${celebration.name}'s Birthday today!` : `Celebrate ${celebration.name}'s Wedding Anniversary today!`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Celebrations Hub//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `DTSTART;VALUE=DATE:${dateStr}`,
      `DTEND;VALUE=DATE:${nextDayStr}`,
      `UID:cel-${celebration.id}-${targetYear}@celebrationshub.local`,
      'RRULE:FREQ=YEARLY',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${celebration.name.replace(/[^a-zA-Z0-9]/g, '_')}_Celebration.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`glass-card relative overflow-hidden transition-all duration-300 flex flex-col justify-between ${
        isToday
          ? isBirthday
            ? 'border-pink-500/60 bg-gradient-to-br from-pink-500/15 via-secondary to-purple-500/10 shadow-lg shadow-pink-500/15 ring-2 ring-pink-500/30'
            : 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-secondary to-emerald-500/10 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/30'
          : 'hover:border-border-hover'
      }`}
    >
      {/* Top Accent Bar for Today */}
      {isToday && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 animate-pulse" />
      )}

      {/* Main Content */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <span className={isBirthday ? 'badge badge-birthday' : 'badge badge-anniversary'}>
            {isBirthday ? <Gift className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
            {celebration.event}
          </span>

          {/* Countdown or Date Pill */}
          {daysRemaining !== undefined && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-tight ${
                isToday
                  ? 'bg-pink-500 text-white animate-bounce'
                  : daysRemaining <= 7
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold'
                  : 'bg-tertiary text-muted font-medium'
              }`}
            >
              <Clock className="w-3 h-3" />
              {isToday ? 'TODAY! 🎉' : daysRemaining === 1 ? 'Tomorrow' : `In ${daysRemaining} days`}
            </span>
          )}
        </div>

        <h3 className="text-base sm:text-lg font-bold text-main tracking-tight leading-snug mb-1 truncate" title={celebration.name}>
          {celebration.name}
        </h3>

        <div className="flex items-center gap-2 text-xs text-muted font-medium mb-3">
          <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="font-semibold text-main">
            {celebration.month} {celebration.day}
          </span>
          {celebration.year && (
            <span className="text-light">({celebration.year})</span>
          )}
        </div>

        {/* Milestone badge if calculated */}
        {turningMilestone && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 text-xs font-bold text-purple-300">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {turningMilestone}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 mt-1 border-t border-border/60 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowWishModal(true)}
          className="btn btn-secondary text-[11px] px-2.5 py-1.5 flex-1 hover:border-purple-500/50 hover:text-purple-400 group flex items-center justify-center gap-1.5"
          title="Create a Portrait (9:16) Image Wish Card"
        >
          <ImageIcon className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold">Wish</span>
        </button>

        <button
          onClick={handleDownloadIcs}
          className="p-1.5 rounded-lg bg-tertiary border border-border text-muted hover:text-main hover:bg-secondary transition-all"
          title="Download .ics Calendar Reminder for phone/desktop"
          aria-label="Download calendar reminder"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Portrait Wish Generator Modal */}
      {showWishModal && (
        <GreetingCardModal
          celebration={celebration}
          onClose={() => setShowWishModal(false)}
        />
      )}
    </div>
  );
};
