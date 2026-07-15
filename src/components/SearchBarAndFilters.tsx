import React from 'react';
import { Search, X } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';

export const SearchBarAndFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
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
