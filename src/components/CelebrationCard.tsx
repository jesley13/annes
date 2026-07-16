import React, { useState } from 'react';
import { Gift, Heart, Calendar, Sparkles, Clock, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { Celebration } from '../types/celebration';
import { generateWishCanvasBlob } from '../utils/canvasWishGenerator';

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
  const [isCopying, setIsCopying] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isBirthday = celebration.event === 'Birthday';

  const handleWishClick = async () => {
    if (isCopying) return;
    setIsCopying(true);
    try {
      const blob = await generateWishCanvasBlob(celebration);
      if (blob) {
        if (navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        } else {
          // Fallback if browser/context blocks automatic clipboard image write
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${celebration.name.replace(/[^a-zA-Z0-9]/g, '_')}_WishCard.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3500);
      }
    } catch (err) {
      // If clipboard write throws an error due to permissions/secure context, fallback to direct download
      try {
        const blob = await generateWishCanvasBlob(celebration);
        if (blob) {
          const prefix = celebration.event === 'Birthday' ? 'BD' : 'WA';
          const cleanName = celebration.name.replace(/[^a-zA-Z0-9]/g, '_');
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${prefix}_${cleanName}.png`;
          a.click();
          URL.revokeObjectURL(url);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 3500);
        }
      } catch (fallbackErr) {
        console.error('Failed to copy wish image:', fallbackErr);
      }
    } finally {
      setIsCopying(false);
    }
  };

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
      className={`glass-card relative overflow-hidden transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 ${
        isToday
          ? isBirthday
            ? 'border-pink-500/60 bg-gradient-to-br from-pink-500/15 via-secondary to-purple-500/10 shadow-xl shadow-pink-500/15 ring-2 ring-pink-500/30'
            : 'border-amber-500/60 bg-gradient-to-br from-amber-500/15 via-secondary to-emerald-500/10 shadow-xl shadow-amber-500/15 ring-2 ring-amber-500/30'
          : 'hover:border-border-hover'
      }`}
    >
      {/* Top Accent Bar for Today */}
      {isToday && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-500 animate-pulse" />
      )}

      {/* Main Content with generous breathing space */}
      <div>
        {/* Top Header Pills */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <span className={isBirthday ? 'badge badge-birthday' : 'badge badge-anniversary'}>
            {isBirthday ? <Gift className="w-3.5 h-3.5" /> : <Heart className="w-3.5 h-3.5" />}
            {celebration.event}
          </span>

          {/* Countdown or Date Pill */}
          {daysRemaining !== undefined && (
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-tight ${
                isToday
                  ? 'bg-pink-500 text-white animate-bounce shadow-sm'
                  : daysRemaining <= 7
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold'
                  : 'bg-tertiary text-muted font-medium'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {isToday ? 'TODAY! 🎉' : daysRemaining === 1 ? 'Tomorrow' : `In ${daysRemaining} days`}
            </span>
          )}
        </div>

        {/* Hero Name with spacious margins and larger typography */}
        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-main tracking-tight leading-relaxed mb-3 truncate" title={celebration.name}>
          {celebration.name}
        </h3>

        {/* Date Row with breathing room */}
        <div className="flex items-center gap-2.5 text-sm text-muted font-medium mb-5">
          <Calendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <span className="font-semibold text-main">
            {celebration.month} {celebration.day}
          </span>
          {celebration.year && (
            <span className="text-light text-xs">({celebration.year})</span>
          )}
        </div>

        {/* Milestone badge if calculated */}
        {turningMilestone && (
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border border-purple-500/30 text-xs font-bold text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {turningMilestone}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer with tall, sleek buttons */}
      <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between gap-3">
        <button
          onClick={handleWishClick}
          disabled={isCopying}
          className={`btn text-xs sm:text-sm px-4 py-2.5 flex-1 transition-all duration-200 group flex items-center justify-center gap-2 rounded-xl ${
            isCopied
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25 border-emerald-500 font-bold'
              : isCopying
              ? 'btn-secondary text-purple-400 opacity-80 cursor-wait font-semibold'
              : 'btn-secondary text-purple-400 hover:border-purple-500/60 hover:text-purple-300 font-bold'
          }`}
          title="Copy custom portrait wish image directly to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-white animate-scale-in" />
              <span>Copied to Clipboard!</span>
            </>
          ) : isCopying ? (
            <>
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Copying...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
              <span>Wish</span>
            </>
          )}
        </button>

        <button
          onClick={handleDownloadIcs}
          className="p-2.5 rounded-xl bg-tertiary border border-border text-muted hover:text-main hover:bg-secondary transition-all"
          title="Add calendar reminder to phone or desktop (.ics)"
          aria-label="Download calendar reminder"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
