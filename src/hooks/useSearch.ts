import { useState, useEffect } from 'react';

console.log('🚀 useSearch.ts FILE LOADED');

export interface CommunityResult {
  id: number;
  name: string;
  description: string;
  members: number;
  courses: number;
  badges: string[];
}

export interface CourseResult {
  id: number;
  name: string;
  description: string;
  enrolled: number;
  rating: number;
  modules: number;
  badges: string[];
}

export interface EventResult {
  id: number;
  name: string;
  description: string;
  attending: number;
  location: string;
  badges: string[];
}

export interface ResultCounts {
  all: number;
  communities: number;
  events: number;
  courses: number;
  people: number;
}

export type SearchTab = 'all' | 'communities' | 'events' | 'courses' | 'people';
export type EmptyStateTab = 'recent' | 'suggestions' | 'saved' | 'actions';

// Mock data
const mockCommunities: CommunityResult[] = [
  { id: 1, name: 'Design Masters', description: 'A community for design professionals to share knowledge and collaborate', members: 245, courses: 12, badges: ['Public', 'Active'] },
  { id: 2, name: 'Product Management Hub', description: 'Learn and discuss product management strategies', members: 189, courses: 8, badges: ['Public', 'Active'] },
  { id: 3, name: 'Marketing Pros', description: 'Marketing professionals sharing best practices', members: 312, courses: 15, badges: ['Public', 'Active'] },
];

const mockCourses: CourseResult[] = [
  { id: 1, name: 'UX Design Fundamentals', description: 'Master the fundamentals of user experience design', enrolled: 89, rating: 4.8, modules: 6, badges: ['Beginner', '6 modules'] },
  { id: 2, name: 'Advanced Prototyping', description: 'Learn advanced prototyping techniques in Figma', enrolled: 156, rating: 4.9, modules: 8, badges: ['Advanced', '8 modules'] },
  { id: 3, name: 'Product Management 101', description: 'Everything you need to know about product management', enrolled: 234, rating: 4.7, modules: 10, badges: ['Beginner', '10 modules'] },
];

const mockEvents: EventResult[] = [
  { id: 1, name: 'Design Sprint Workshop', description: 'Tomorrow at 2:00 PM • Design Masters community', attending: 24, location: 'Virtual', badges: ['Upcoming'] },
  { id: 2, name: 'Product Strategy Session', description: 'Friday at 10:00 AM • Product Management Hub', attending: 45, location: 'Virtual', badges: ['Upcoming'] },
  { id: 3, name: 'Weekly Standup', description: 'Every Monday at 9:00 AM • Marketing Pros', attending: 67, location: 'Virtual', badges: ['Recurring'] },
];

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [emptyStateTab, setEmptyStateTab] = useState<EmptyStateTab>('recent');
  const [sortBy, setSortBy] = useState('relevant');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState('all-time');
  const [creatorFilter, setCreatorFilter] = useState('any');
  const [statusFilter, setStatusFilter] = useState('any');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'UX Design Course',
    'Product Management',
    'Weekly Standup',
    'Marketing Community'
  ]);
  const [savedSearches, setSavedSearches] = useState<string[]>([
    'My draft courses',
    'Upcoming events this week'
  ]);
  
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showCreatorMenu, setShowCreatorMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  // Filter results based on query and filters
  const getFilteredResults = () => {
    const query = searchQuery.toLowerCase().trim();
    
    let communities = mockCommunities;
    let courses = mockCourses;
    let events = mockEvents;
    
    if (query) {
      communities = communities.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query)
      );
      courses = courses.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.description.toLowerCase().includes(query)
      );
      events = events.filter(e => 
        e.name.toLowerCase().includes(query) || 
        e.description.toLowerCase().includes(query)
      );
    }
    
    // Apply quick filters
    if (activeFilters.includes('public')) {
      communities = communities.filter(c => c.badges.includes('Public'));
    }
    if (activeFilters.includes('active')) {
      communities = communities.filter(c => c.badges.includes('Active'));
    }
    
    return { communities, courses, events };
  };

  const results = getFilteredResults();
  
  const resultCounts: ResultCounts = {
    all: results.communities.length + results.courses.length + results.events.length,
    communities: results.communities.length,
    courses: results.courses.length,
    events: results.events.length,
    people: 0,
  };

  const hasQuery = searchQuery.trim().length > 0;

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
    setCreatorFilter('any');
    setStatusFilter('any');
  };

  const hasActiveFilters = activeFilters.length > 0 || 
    dateFilter !== 'all-time' || 
    creatorFilter !== 'any' || 
    statusFilter !== 'any';

  const clearSearch = () => {
    setSearchQuery('');
    setActiveTab('all');
    clearAllFilters();
  };

  const addToRecentSearches = (query: string) => {
    if (!query.trim()) return;
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== query);
      return [query, ...filtered].slice(0, 10);
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches(prev => prev.filter(s => s !== query));
  };

  const saveSearch = (name?: string) => {
    const searchName = name || searchQuery;
    if (!searchName.trim()) return;
    setSavedSearches(prev => {
      if (prev.includes(searchName)) return prev;
      return [...prev, searchName];
    });
  };

  const removeSavedSearch = (query: string) => {
    setSavedSearches(prev => prev.filter(s => s !== query));
  };

  const executeSearch = (query: string) => {
    setSearchQuery(query);
    addToRecentSearches(query);
  };

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    emptyStateTab,
    setEmptyStateTab,
    sortBy,
    setSortBy,
    activeFilters,
    toggleFilter,
    dateFilter,
    setDateFilter,
    creatorFilter,
    setCreatorFilter,
    statusFilter,
    setStatusFilter,
    recentSearches,
    savedSearches,
    results,
    resultCounts,
    hasQuery,
    hasActiveFilters,
    clearAllFilters,
    clearSearch,
    addToRecentSearches,
    removeRecentSearch,
    saveSearch,
    removeSavedSearch,
    executeSearch,
    showSortMenu,
    setShowSortMenu,
    showDateMenu,
    setShowDateMenu,
    showCreatorMenu,
    setShowCreatorMenu,
    showStatusMenu,
    setShowStatusMenu,
  };
}