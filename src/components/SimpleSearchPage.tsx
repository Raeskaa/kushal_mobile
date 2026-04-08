import { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Search, X, Filter, Clock, Star, Users, Calendar, 
  BookOpen, User, ChevronDown, Check, MapPin, Trash2, 
  Plus, Hash, Save, Sparkles, Mic
} from 'lucide-react';

interface SimpleSearchPageProps {
  onClose: () => void;
}

type SearchTab = 'all' | 'communities' | 'events' | 'courses' | 'people';
type EmptyTab = 'recent' | 'suggestions' | 'saved' | 'quick-actions';

export function SimpleSearchPage({ onClose }: SimpleSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [emptyTab, setEmptyTab] = useState<EmptyTab>('recent');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('all-time');
  const [creatorFilter, setCreatorFilter] = useState('any-creator');
  const [statusFilter, setStatusFilter] = useState('any-status');
  const [sortBy, setSortBy] = useState('relevant');
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showCreatorMenu, setShowCreatorMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'UX Design Course',
    'Product Management',
    'Weekly Standup',
    'Marketing Community'
  ]);
  const [savedSearches, setSavedSearches] = useState([
    'My draft courses',
    'Upcoming events this week'
  ]);

  const hasQuery = searchQuery.trim().length > 0;
  const hasActiveFilters = activeFilters.length > 0 || dateFilter !== 'all-time' || 
    creatorFilter !== 'any-creator' || statusFilter !== 'any-status';

  // Mock data
  const mockCommunities = [
    { 
      id: 1, 
      name: 'Web Development Masters', 
      description: 'A community for web developers to learn and grow together',
      members: 1234, 
      courses: 12,
      badges: ['Public', 'Active']
    },
    { 
      id: 2, 
      name: 'UI/UX Design Hub', 
      description: 'Design professionals sharing knowledge and resources',
      members: 856, 
      courses: 8,
      badges: ['Public', 'Active']
    },
  ];

  const mockCourses = [
    { 
      id: 1, 
      name: 'React Masterclass 2024', 
      description: 'Master React from basics to advanced concepts',
      students: 5432, 
      rating: 4.8,
      modules: 12,
      badges: ['Beginner', '12 modules']
    },
    { 
      id: 2, 
      name: 'Advanced TypeScript', 
      description: 'Deep dive into TypeScript type system and patterns',
      students: 3210, 
      rating: 4.6,
      modules: 8,
      badges: ['Advanced', '8 modules']
    },
  ];

  const mockEvents = [
    { 
      id: 1, 
      name: 'Design Workshop', 
      description: 'Tomorrow at 2:00 PM • Design Masters community',
      attending: 24, 
      location: 'Virtual',
      badges: ['Upcoming']
    },
    { 
      id: 2, 
      name: 'React Conference', 
      description: 'Feb 20 at 10:00 AM • Virtual event',
      attending: 156, 
      location: 'Virtual',
      badges: ['Upcoming']
    },
  ];

  const mockPeople = [
    { 
      id: 1, 
      name: 'Sarah Johnson', 
      title: 'Product Designer',
      company: 'Figma',
      badges: ['Instructor', 'Pro']
    },
    { 
      id: 2, 
      name: 'Mike Chen', 
      title: 'Community Leader',
      company: 'Google',
      badges: ['Community Leader']
    },
  ];

  const searchTabs = [
    { id: 'all' as SearchTab, label: 'All', count: 8 },
    { id: 'communities' as SearchTab, label: 'Communities', count: mockCommunities.length },
    { id: 'events' as SearchTab, label: 'Events', count: mockEvents.length },
    { id: 'courses' as SearchTab, label: 'Courses', count: mockCourses.length },
    { id: 'people' as SearchTab, label: 'People', count: mockPeople.length },
  ];

  const emptyTabs = [
    { id: 'recent' as EmptyTab, label: 'Recent Searches', icon: Clock },
    { id: 'suggestions' as EmptyTab, label: 'Leapy Suggests', icon: Sparkles },
    { id: 'saved' as EmptyTab, label: 'Saved Searches', icon: Save },
    { id: 'quick-actions' as EmptyTab, label: 'Quick Actions', icon: Plus },
  ];

  const quickFilters = [
    { id: 'created-by-me', label: 'Created by me', icon: '👤' },
    { id: 'public', label: 'Public', icon: '🌍' },
    { id: 'active', label: 'Active', icon: '✓' },
    { id: 'has-courses', label: 'Has courses', icon: '📚' },
  ];

  const leapySuggestions = [
    { title: 'Design Sprint Workshop', type: 'event', icon: Calendar },
    { title: 'Advanced Prototyping', type: 'course', icon: BookOpen },
    { title: 'Marketing Pros', type: 'community', icon: Users },
  ];

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 text-gray-900">{part}</mark> : part
    );
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setDateFilter('all-time');
    setCreatorFilter('any-creator');
    setStatusFilter('any-status');
  };

  const removeRecentSearch = (index: number) => {
    setRecentSearches(prev => prev.filter((_, i) => i !== index));
  };

  const removeSavedSearch = (index: number) => {
    setSavedSearches(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveSearch = () => {
    if (hasQuery && !savedSearches.includes(searchQuery)) {
      setSavedSearches(prev => [searchQuery, ...prev]);
    }
  };

  const renderEmptyState = () => {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Empty State Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex overflow-x-auto no-scrollbar">
            {emptyTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setEmptyTab(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 border-b-2 transition-colors ${
                    emptyTab === tab.id
                      ? 'border-[#420D74] text-[#420D74]'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" />
                    <span className="text-sm whitespace-nowrap">{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {emptyTab === 'recent' && (
            <div className="space-y-2">
              {recentSearches.length > 0 ? (
                recentSearches.map((search, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg active:bg-gray-50 transition-colors"
                  >
                    <Search className="size-4 text-gray-400 flex-shrink-0" />
                    <button
                      onClick={() => setSearchQuery(search)}
                      className="flex-1 text-left text-gray-900"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(idx);
                      }}
                      className="text-gray-400 active:text-red-500 transition-colors flex-shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent searches</p>
                </div>
              )}
            </div>
          )}

          {emptyTab === 'suggestions' && (
            <div className="space-y-2">
              {leapySuggestions.map((suggestion, idx) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(suggestion.title)}
                    className="flex items-center gap-3 w-full p-3 rounded-lg active:bg-gray-50 transition-colors"
                  >
                    <Sparkles className="size-4 text-[#420D74] flex-shrink-0" />
                    <span className="flex-1 text-left text-gray-900">{suggestion.title}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
                      {suggestion.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {emptyTab === 'saved' && (
            <div className="space-y-2">
              {savedSearches.length > 0 ? (
                savedSearches.map((search, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-lg active:bg-gray-50 transition-colors"
                  >
                    <Save className="size-4 text-gray-400 flex-shrink-0" />
                    <button
                      onClick={() => setSearchQuery(search)}
                      className="flex-1 text-left text-gray-900"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedSearch(idx);
                      }}
                      className="text-gray-400 active:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Save className="size-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No saved searches yet</p>
                </div>
              )}
            </div>
          )}

          {emptyTab === 'quick-actions' && (
            <div className="space-y-2">
              <button className="w-full p-4 rounded-lg bg-[#420D74] text-white text-left flex items-center gap-2 active:scale-95 transition-transform">
                <Plus className="size-5" />
                <span>Create a new community</span>
              </button>
              <button className="w-full p-4 rounded-lg bg-white border border-gray-200 text-gray-900 text-left flex items-center gap-2 active:scale-95 transition-transform">
                <Plus className="size-5" />
                <span>Create a new course</span>
              </button>
              <button className="w-full p-4 rounded-lg bg-white border border-gray-200 text-gray-900 text-left flex items-center gap-2 active:scale-95 transition-transform">
                <Plus className="size-5" />
                <span>Create a new event</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    const allResults = [
      ...mockCommunities.map(c => ({ ...c, type: 'community' })),
      ...mockCourses.map(c => ({ ...c, type: 'course' })),
      ...mockEvents.map(e => ({ ...e, type: 'event' })),
      ...mockPeople.map(p => ({ ...p, type: 'person' }))
    ];
    
    let filteredResults = allResults;
    if (activeTab === 'communities') filteredResults = mockCommunities.map(c => ({ ...c, type: 'community' }));
    if (activeTab === 'courses') filteredResults = mockCourses.map(c => ({ ...c, type: 'course' }));
    if (activeTab === 'events') filteredResults = mockEvents.map(e => ({ ...e, type: 'event' }));
    if (activeTab === 'people') filteredResults = mockPeople.map(p => ({ ...p, type: 'person' }));

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Search Result Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <div className="flex overflow-x-auto no-scrollbar">
            {searchTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 border-b-2 transition-smooth active:scale-95 will-change-transform ${
                  activeTab === tab.id
                    ? 'border-[#420D74] text-[#420D74]'
                    : 'border-transparent text-gray-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm whitespace-nowrap">{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? 'bg-[#420D74] text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-b border-gray-200 bg-gray-50">
          {/* Row 1: Quick Filters + Advanced Filters */}
          <div className="px-4 py-3 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 min-w-min">
              {/* Quick Filters */}
              {quickFilters.map((filter) => {
                const isActive = activeFilters.includes(filter.id);
                return (
                  <button
                    key={filter.id}
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                      isActive
                        ? 'bg-[#420D74] text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:border-[#420D74] hover:text-[#420D74]'
                    }`}
                  >
                    <span>{filter.icon}</span>
                    <span>{filter.label}</span>
                    {isActive && <X className="size-3" />}
                  </button>
                );
              })}

              {/* Date Filter */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowDateMenu(!showDateMenu)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    dateFilter !== 'all-time'
                      ? 'bg-[#420D74] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#420D74] hover:text-[#420D74]'
                  }`}
                >
                  <Clock className="size-3.5" />
                  <span>{dateFilter === 'all-time' ? 'All time' : dateFilter === 'last-7-days' ? 'Last 7 days' : dateFilter === 'this-month' ? 'This month' : 'This year'}</span>
                  <ChevronDown className="size-3.5" />
                </button>
                {showDateMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px] animate-dropdown-slide">
                    {['all-time', 'last-7-days', 'this-month', 'this-year'].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setDateFilter(option);
                          setShowDateMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between transition-colors active:bg-gray-100"
                      >
                        <span className="capitalize">{option.replace(/-/g, ' ')}</span>
                        {dateFilter === option && <Check className="size-4 text-[#420D74]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Creator Filter */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowCreatorMenu(!showCreatorMenu)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    creatorFilter !== 'any-creator'
                      ? 'bg-[#420D74] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#420D74] hover:text-[#420D74]'
                  }`}
                >
                  <User className="size-3.5" />
                  <span>{creatorFilter === 'any-creator' ? 'Any creator' : creatorFilter}</span>
                  <ChevronDown className="size-3.5" />
                </button>
                {showCreatorMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px]">
                    <button
                      onClick={() => {
                        setCreatorFilter('any-creator');
                        setShowCreatorMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>Any creator</span>
                      {creatorFilter === 'any-creator' && <Check className="size-4 text-[#420D74]" />}
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    {['Sarah Chen', 'Alex Kumar', 'Emma Wilson'].map((creator) => (
                      <button
                        key={creator}
                        onClick={() => {
                          setCreatorFilter(creator);
                          setShowCreatorMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{creator}</span>
                        {creatorFilter === creator && <Check className="size-4 text-[#420D74]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    statusFilter !== 'any-status'
                      ? 'bg-[#420D74] text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-[#420D74] hover:text-[#420D74]'
                  }`}
                >
                  <Filter className="size-3.5" />
                  <span>{statusFilter === 'any-status' ? 'Any status' : statusFilter}</span>
                  <ChevronDown className="size-3.5" />
                </button>
                {showStatusMenu && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[140px]">
                    <button
                      onClick={() => {
                        setStatusFilter('any-status');
                        setShowStatusMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                    >
                      <span>Any status</span>
                      {statusFilter === 'any-status' && <Check className="size-4 text-[#420D74]" />}
                    </button>
                    <div className="border-t border-gray-200 my-1" />
                    {['Draft', 'Published', 'Archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{status}</span>
                        {statusFilter === status && <Check className="size-4 text-[#420D74]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Clear All Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex-shrink-0 text-xs text-[#420D74] hover:text-[#531596] transition-colors ml-2"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Row 2: Advanced Search Helper + Sort + Save */}
          <div className="px-4 pb-3 flex items-center justify-between gap-4">
            {/* Advanced Search Helper */}
            <div className="text-xs text-gray-500 flex-1">
              Try: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#420D74] font-mono">type:course</code> <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#420D74] font-mono">level:beginner</code>
            </div>

            {/* Sort + Save */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#420D74] transition-colors"
                >
                  <span>Sort: {sortBy === 'relevant' ? 'Most relevant' : sortBy === 'recent' ? 'Recently created' : sortBy === 'updated' ? 'Recently updated' : sortBy === 'active' ? 'Most active' : 'Alphabetical'}</span>
                  <ChevronDown className="size-3.5" />
                </button>
                {showSortMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-20 min-w-[160px]">
                    {[
                      { id: 'relevant', label: 'Most relevant' },
                      { id: 'recent', label: 'Recently created' },
                      { id: 'updated', label: 'Recently updated' },
                      { id: 'active', label: 'Most active' },
                      { id: 'alphabetical', label: 'Alphabetical' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          setSortBy(option.id);
                          setShowSortMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{option.label}</span>
                        {sortBy === option.id && <Check className="size-4 text-[#420D74]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Save Search */}
              <button
                onClick={handleSaveSearch}
                className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-[#420D74] transition-colors"
              >
                <Save className="size-3.5" />
                <span>Save search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredResults.map((result: any) => (
            <div
              key={`${result.type}-${result.id}`}
              className="p-4 rounded-lg border border-gray-200 active:bg-gray-50 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Content */}
                <div className="flex-1 min-w-0">
                  {/* Title + Badges */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {result.type === 'community' && <Hash className="size-4 text-gray-500 flex-shrink-0" />}
                    {result.type === 'course' && <BookOpen className="size-4 text-gray-500 flex-shrink-0" />}
                    {result.type === 'event' && <Calendar className="size-4 text-gray-500 flex-shrink-0" />}
                    {result.type === 'person' && <User className="size-4 text-gray-500 flex-shrink-0" />}
                    
                    <h4 className="font-medium text-gray-900">{highlightText(result.name, searchQuery)}</h4>
                    
                    {result.badges?.map((badge: string, idx: number) => (
                      <span 
                        key={idx} 
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          badge === 'Upcoming' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  {result.description && (
                    <p className="text-sm text-gray-600 mb-2">{highlightText(result.description, searchQuery)}</p>
                  )}

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {result.members !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>{result.members} members</span>
                      </div>
                    )}
                    {result.courses !== undefined && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-3.5" />
                        <span>{result.courses} courses</span>
                      </div>
                    )}
                    {result.students !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>{result.students} enrolled</span>
                      </div>
                    )}
                    {result.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{result.rating}</span>
                      </div>
                    )}
                    {result.modules !== undefined && (
                      <div className="flex items-center gap-1">
                        <BookOpen className="size-3.5" />
                        <span>{result.modules} modules</span>
                      </div>
                    )}
                    {result.attending !== undefined && (
                      <div className="flex items-center gap-1">
                        <Users className="size-3.5" />
                        <span>{result.attending} attending</span>
                      </div>
                    )}
                    {result.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="size-3.5" />
                        <span>{result.location}</span>
                      </div>
                    )}
                    {result.title && (
                      <span>{result.title}</span>
                    )}
                    {result.company && (
                      <span>• {result.company}</span>
                    )}
                  </div>
                </div>

                {/* Right: CTA Button */}
                <button 
                  className="flex-shrink-0 px-4 py-2 bg-[#420D74] text-white text-sm rounded-lg active:scale-95 transition-transform"
                >
                  {result.type === 'community' && 'Join'}
                  {result.type === 'course' && 'Enroll'}
                  {result.type === 'event' && 'RSVP'}
                  {result.type === 'person' && 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col animate-slide-in-right gpu-accelerate">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#420D74] text-white shadow-lg">
        <div className="flex items-center gap-3 px-4 py-4">
          <button onClick={onClose} className="text-white hover:text-white/80 transition-colors">
            <ArrowLeft className="size-6" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search communities, courses, events..."
              autoFocus
              className="w-full h-10 pl-10 pr-20 bg-white/20 rounded-lg border border-white/30 text-white placeholder:text-white/60 outline-none focus:bg-white/30 focus:border-white/50 transition-colors"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-11 top-1/2 -translate-y-1/2 text-white/60 active:text-white transition-colors"
              >
                <X className="size-5" />
              </button>
            ) : null}
            <button
              onClick={() => {/* Voice search handler */}}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 active:text-white transition-colors"
            >
              <Mic className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {hasQuery ? renderResults() : renderEmptyState()}
    </div>
  );
}