import { Search, Sparkles, Save, Plus, X, Trash2 } from 'lucide-react';
import { EmptyStateTab } from '../../hooks/useSearch';

interface SearchEmptyStateProps {
  activeTab: EmptyStateTab;
  onTabChange: (tab: EmptyStateTab) => void;
  recentSearches: string[];
  savedSearches: string[];
  onSearchClick: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onRemoveSaved: (query: string) => void;
  onQuickAction?: (action: string) => void;
}

const leapySuggestions = [
  { title: 'Design Sprint Workshop', type: 'event' },
  { title: 'Advanced Prototyping', type: 'course' },
  { title: 'Marketing Pros', type: 'community' },
];

const quickActions = [
  { id: 'create-community', label: 'Create a new community', shortcut: '⌘N' },
  { id: 'create-course', label: 'Create a new course', shortcut: '⌘C' },
  { id: 'create-event', label: 'Create a new event', shortcut: '⌘E' },
];

export function SearchEmptyState({
  activeTab,
  onTabChange,
  recentSearches,
  savedSearches,
  onSearchClick,
  onRemoveRecent,
  onRemoveSaved,
  onQuickAction,
}: SearchEmptyStateProps) {
  const tabs = [
    { id: 'recent' as const, label: 'Recent Searches' },
    { id: 'suggestions' as const, label: 'Leapy Suggests' },
    { id: 'saved' as const, label: 'Saved Searches' },
    { id: 'actions' as const, label: 'Quick Actions' },
  ];

  return (
    <>
      {/* Tabs */}
      <div className="border-b border-gray-200 px-4 bg-white">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'border-[#420D74] text-[#420D74] font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-6 px-4">
        {activeTab === 'recent' && (
          <div className="space-y-2">
            {recentSearches.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="size-12 text-gray-300 mx-auto mb-4" />
                <p>No recent searches</p>
              </div>
            ) : (
              recentSearches.map((search, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSearchClick(search)}
                >
                  <Search className="size-4 text-gray-400 group-hover:text-[#420D74] transition-colors" />
                  <span className="flex-1 text-gray-900">{search}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecent(search);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-all"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-2">
            {leapySuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSearchClick(suggestion.title)}
              >
                <Sparkles className="size-4 text-[#420D74]" />
                <span className="flex-1 text-gray-900">{suggestion.title}</span>
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {suggestion.type}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-2">
            {savedSearches.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Save className="size-12 text-gray-300 mx-auto mb-4" />
                <p>No saved searches</p>
              </div>
            ) : (
              savedSearches.map((search, idx) => (
                <div
                  key={idx}
                  className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSearchClick(search)}
                >
                  <Save className="size-4 text-gray-400 group-hover:text-[#420D74] transition-colors" />
                  <span className="flex-1 text-gray-900">{search}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveSaved(search);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-2">
            {quickActions.map((action) => (
              <div
                key={action.id}
                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onQuickAction?.(action.id)}
              >
                <Plus className="size-4 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                <span className="flex-1 text-gray-900">{action.label}</span>
                <span className="text-xs font-mono text-gray-400 hidden md:block">
                  {action.shortcut}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}