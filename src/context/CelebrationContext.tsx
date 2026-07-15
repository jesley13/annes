import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { Celebration, FilterCategory, SortMode, UpcomingCelebration } from '../types/celebration';
import defaultData from '../data/celebrations.json';

interface CelebrationContextType {
  celebrations: Celebration[];
  filteredCelebrations: Celebration[];
  upcomingCelebrations: UpcomingCelebration[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: FilterCategory;
  setCategoryFilter: (cat: FilterCategory) => void;
  monthFilter: string; // 'All' or 'January' .. 'December'
  setMonthFilter: (m: string) => void;
  sortMode: SortMode;
  setSortMode: (s: SortMode) => void;
  isCustomData: boolean;
  uploadedFilename: string | null;
  uploadExcelFile: (file: File) => Promise<number>;
  resetToDefault: () => void;
  downloadJsonBackup: () => void;
  stats: {
    total: number;
    birthdays: number;
    anniversaries: number;
    todayCount: number;
  };
}

export const CelebrationContext = createContext<CelebrationContextType | undefined>(undefined);

const STORAGE_KEY = 'custom_celebrations_data';
const FILENAME_KEY = 'excel_filename';

const monthMap: Record<string, string> = {
  'january': 'January', 'february': 'February', 'march': 'March',
  'april': 'April', 'may': 'May', 'june': 'June', 'july': 'July',
  'august': 'August', 'september': 'September', 'october': 'October',
  'november': 'November', 'december': 'December'
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const CelebrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [celebrations, setCelebrations] = useState<Celebration[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return defaultData as Celebration[];
  });

  const [isCustomData, setIsCustomData] = useState<boolean>(() => {
    return !!localStorage.getItem(STORAGE_KEY);
  });

  const [uploadedFilename, setUploadedFilename] = useState<string | null>(() => {
    return localStorage.getItem(FILENAME_KEY) || (localStorage.getItem(STORAGE_KEY) ? 'BD&WA.xlsx' : null);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [monthFilter, setMonthFilter] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('date');

  // Calculate upcoming celebrations with countdowns & milestones
  const upcomingCelebrations = useMemo<UpcomingCelebration[]>(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return celebrations.map(item => {
      let targetYear = today.getFullYear();
      let targetDate = new Date(targetYear, item.monthIndex, item.day);

      if (targetDate < today) {
        targetYear += 1;
        targetDate = new Date(targetYear, item.monthIndex, item.day);
      }

      const diffTime = targetDate.getTime() - today.getTime();
      const daysRemaining = Math.round(diffTime / (1000 * 60 * 60 * 24));
      const isToday = daysRemaining === 0;

      let turningMilestone: string | null = null;
      if (item.year !== null) {
        const count = targetYear - item.year;
        if (count > 0) {
          if (item.event === 'Birthday') {
            turningMilestone = `Turning ${count}`;
          } else {
            turningMilestone = `${count}th Anniversary`;
          }
        }
      }

      return {
        ...item,
        daysRemaining,
        isToday,
        turningMilestone
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [celebrations]);

  // Filter and sort for general directory/list views
  const filteredCelebrations = useMemo(() => {
    return celebrations
      .filter(item => {
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchMonth = item.month.toLowerCase().includes(q);
          const matchDate = `${item.month} ${item.day}`.toLowerCase().includes(q);
          if (!matchName && !matchMonth && !matchDate) return false;
        }

        if (categoryFilter !== 'all' && item.event !== categoryFilter) {
          return false;
        }

        if (monthFilter !== 'All' && item.month !== monthFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'name') {
          return a.name.localeCompare(b.name);
        } else {
          // Chronological by monthIndex then day
          if (a.monthIndex !== b.monthIndex) {
            return a.monthIndex - b.monthIndex;
          }
          return a.day - b.day;
        }
      });
  }, [celebrations, searchQuery, categoryFilter, monthFilter, sortMode]);

  const stats = useMemo(() => {
    const birthdays = celebrations.filter(c => c.event === 'Birthday').length;
    const anniversaries = celebrations.filter(c => c.event === 'Wedding Anniversary').length;
    const todayCount = upcomingCelebrations.filter(c => c.isToday).length;
    return {
      total: celebrations.length,
      birthdays,
      anniversaries,
      todayCount
    };
  }, [celebrations, upcomingCelebrations]);

  const uploadExcelFile = async (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rawRows = XLSX.utils.sheet_to_json(sheet, { raw: true }) as Record<string, any>[];

          const parsed: Celebration[] = rawRows.map((row, index) => {
            const name = (row.Name || '').trim();
            if (!name) return null;

            const monthRaw = (row.Month || '').trim().toLowerCase();
            const month = monthMap[monthRaw] || 'January';

            const eventRaw = (row.Event || '').trim().toLowerCase();
            let event: 'Birthday' | 'Wedding Anniversary' = 'Birthday';
            if (eventRaw.includes('wed') || eventRaw.includes('anniv')) {
              event = 'Wedding Anniversary';
            } else if (eventRaw.includes('birth') || eventRaw.includes('bday') || eventRaw.includes('bady')) {
              event = 'Birthday';
            }

            let day = 1;
            let year: number | null = null;
            const dateStr = row.Date + '';

            if (typeof row.Date === 'number' || (!isNaN(row.Date) && Number(row.Date) > 100)) {
              const serial = Number(row.Date);
              const dateObj = new Date((serial - (serial > 60 ? 25569 : 25568)) * 86400 * 1000);
              day = dateObj.getUTCDate();
              const fullYear = dateObj.getUTCFullYear();
              if (fullYear > 1900 && fullYear < 2023) {
                year = fullYear;
              }
            } else {
              const str = String(row.Date || '').trim();
              if (str.includes('/') || str.includes('-') || str.includes(' ')) {
                const parts = str.split(/[\/\- ]+/);
                for (const part of parts) {
                  const n = parseInt(part, 10);
                  if (!isNaN(n) && n >= 1 && n <= 31) {
                    if (parts.indexOf(part) === 0 || isNaN(parseInt(parts[0], 10))) {
                      day = n;
                      break;
                    }
                  }
                }
                if (parts.length >= 3) {
                  const yStr = parts[parts.length - 1];
                  const y = parseInt(yStr, 10);
                  if (!isNaN(y)) {
                    if (y > 30 && y < 100) year = 1900 + y;
                    else if (y >= 0 && y <= 24) year = 2000 + y;
                    else if (y > 1900 && y < 2023) year = y;
                  }
                }
              }
            }

            const monthIndex = monthNames.indexOf(month);

            return {
              id: `cel-custom-${index + 1}-${Date.now()}`,
              name,
              month,
              monthIndex,
              day,
              year,
              event,
              rawDate: dateStr
            } as Celebration;
          }).filter(Boolean) as Celebration[];

          if (parsed.length === 0) {
            throw new Error('No valid rows found in Excel sheet. Please ensure columns Name, Month, Date, and Event exist.');
          }

          setCelebrations(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
          localStorage.setItem(FILENAME_KEY, file.name);
          setIsCustomData(true);
          setUploadedFilename(file.name);
          resolve(parsed.length);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const resetToDefault = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(FILENAME_KEY);
    setCelebrations(defaultData as Celebration[]);
    setIsCustomData(false);
    setUploadedFilename(null);
  };

  const downloadJsonBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(celebrations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "celebrations.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <CelebrationContext.Provider
      value={{
        celebrations,
        filteredCelebrations,
        upcomingCelebrations,
        searchQuery,
        setSearchQuery,
        categoryFilter,
        setCategoryFilter,
        monthFilter,
        setMonthFilter,
        sortMode,
        setSortMode,
        isCustomData,
        uploadedFilename,
        uploadExcelFile,
        resetToDefault,
        downloadJsonBackup,
        stats
      }}
    >
      {children}
    </CelebrationContext.Provider>
  );
};

export { useCelebrations } from '../hooks/useCelebrations';
