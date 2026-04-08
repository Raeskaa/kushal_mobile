import { X, Save, ArrowLeft } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import { SearchInput } from './search/SearchInput';
import { SearchEmptyState } from './search/SearchEmptyState';
import { SearchFilters } from './search/SearchFilters';
import { SearchResults } from './search/SearchResults';

console.log('🚀 MobileSearchPage.tsx FILE LOADED');

interface MobileSearchPageProps {
  onClose: () => void;
}

export function MobileSearchPage({ onClose }: MobileSearchPageProps) {
  console.log('🔍 MobileSearchPage COMPONENT FUNCTION CALLED');
  
  const search = useSearch();
  
  console.log('🔍 MobileSearchPage RENDER');
  console.log('hasQuery:', search.hasQuery);
  console.log('searchQuery:', search.searchQuery);
  console.log('resultCounts:', search.resultCounts);
  console.log('results:', search.results);

  return (
    <div className="min-h-screen bg-white flex flex-col animate-in slide-in-from-bottom fade-in duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <h1 className="flex-1 text-gray-900">Search</h1>
          {search.hasQuery && (
            <button
              onClick={() => search.saveSearch()}
              className="text-gray-600 hover:text-[#420D74] transition-colors"
            >
              <Save className="size-5" />
            </button>
          )}
        </div>

        {/* Title Bar (when has query) */}
        {search.hasQuery && (
          <div className="border-b border-gray-200 px-4 py-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-900">
                Search results for "<span>{search.searchQuery}</span>"
              </p>
              <button
                onClick={search.clearSearch}
                className="text-[#420D74] hover:text-[#420D74]/80 transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Search Input */}
        <SearchInput
          value={search.searchQuery}
          onChange={search.setSearchQuery}
          onClear={search.clearSearch}
          autoFocus={true}
        />
      </div>

      {/* Filters (only when has query) */}
      {search.hasQuery && (
        <SearchFilters
          activeFilters={search.activeFilters}
          onToggleFilter={search.toggleFilter}
          dateFilter={search.dateFilter}
          onDateFilterChange={search.setDateFilter}
          creatorFilter={search.creatorFilter}
          onCreatorFilterChange={search.setCreatorFilter}
          statusFilter={search.statusFilter}
          onStatusFilterChange={search.setStatusFilter}
          onClearAll={search.clearAllFilters}
          hasActiveFilters={search.hasActiveFilters}
          showDateMenu={search.showDateMenu}
          setShowDateMenu={search.setShowDateMenu}
          showCreatorMenu={search.showCreatorMenu}
          setShowCreatorMenu={search.setShowCreatorMenu}
          showStatusMenu={search.showStatusMenu}
          setShowStatusMenu={search.setShowStatusMenu}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {console.log('📦 About to render content area')}
        <div className="p-8 space-y-4">
          <div className="text-2xl">🔍 TESTING</div>
          <div className="text-lg">hasQuery: {String(search.hasQuery)}</div>
          <div className="text-lg">searchQuery: "{search.searchQuery}"</div>
          <div className="text-lg">All Results: {search.resultCounts.all}</div>
          <div className="text-lg">Communities: {search.results.communities.length}</div>
          <div className="text-lg">Courses: {search.results.courses.length}</div>
          <div className="text-lg">Events: {search.results.events.length}</div>
          
          <div className="mt-8 p-4 bg-blue-200">
            <div className="text-xl mb-2">If you can see this, components ARE rendering</div>
          </div>
        </div>
        {console.log('✅ Content area rendered')}
      </div>
    </div>
  );
}