export interface Celebration {
  id: string;
  name: string;
  month: string;
  monthIndex: number; // 0 to 11
  day: number;
  year: number | null; // e.g. 2006, 1983, or null if year is unknown/default 2024
  event: 'Birthday' | 'Wedding Anniversary';
  rawDate: string;
}

export type ViewMode = 'dashboard' | 'calendar';

export type FilterCategory = 'all' | 'Birthday' | 'Wedding Anniversary';

export type SortMode = 'date' | 'name';

export interface UpcomingCelebration extends Celebration {
  daysRemaining: number;
  isToday: boolean;
  turningMilestone: string | null; // e.g. "Turning 43" or "19th Anniversary"
}
