import React from 'react';
import { Search, X, Filter, ArrowUpDown, Gift, Heart, Sparkles } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';
import { FilterCategory, SortMode } from '../types/celebration';

export const SearchBarAndFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    sortMode,
    setSortMode,
    stats,
    filteredCelebrations
  } = useCelebrations();

  return (
    <div className="glass-panel p-4 md:p-5 mb-8 border border-white/10 shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, month e.g., 'Niji' or 'February'..."
            className="input-field pl-10 pr-9 text-sm focus:border-purple-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 justify-start sm:justify-center">
          <span className="text-xs font-semibold text-muted mr-1.5 flex items-center gap-1 hidden sm:flex">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'all'
                ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'bg-tertiary text-muted hover:text-main hover:bg-secondary border border-border'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            All Events ({stats.total})
          </button>

          <button
            onClick={() => setCategoryFilter('Birthday')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'Birthday'
                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm'
                : 'bg-tertiary text-muted hover:text-main hover:bg-secondary border border-border'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            Birthdays ({stats.birthdays})
          </button>

          <button
            onClick={() => setCategoryFilter('Wedding Anniversary')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              categoryFilter === 'Wedding Anniversary'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'bg-tertiary text-muted hover:text-main hover:bg-secondary border border-border'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            Anniversaries ({stats.anniversaries})
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-border">
          <span className="text-xs font-semibold text-muted flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="bg-tertiary border border-border rounded-lg px-3 py-1.5 text-xs font-semibold text-main focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="date">Chronological by Date</option>
            <option value="name">Alphabetical A - Z</option>
          </select>
        </div>

      </div>

      {/* Result feedback if searching/filtering */}
      {(searchQuery || categoryFilter !== 'all') && (
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted font-medium">
          <span>
            Showing <strong className="text-main">{filteredCelebrations.length}</strong> matching celebration{filteredCelebrations.length !== 1 ? 's' : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </span>
          <button
            onClick={() => { setSearchQuery(''); setCategoryFilter('all'); }}
            className="text-purple-400 hover:text-purple-300 underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
