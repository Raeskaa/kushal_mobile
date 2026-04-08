import { X, Clock, User, Filter, ChevronDown, Check } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface SearchFiltersProps {
  activeFilters: string[];
  onToggleFilter: (filterId: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  creatorFilter: string;
  onCreatorFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  showDateMenu: boolean;
  setShowDateMenu: (show: boolean) => void;
  showCreatorMenu: boolean;
  setShowCreatorMenu: (show: boolean) => void;
  showStatusMenu: boolean;
  setShowStatusMenu: (show: boolean) => void;
}

const quickFilters = [
  { id: 'created-by-me', label: '👤 Created by me' },
  { id: 'public', label: '🌍 Public' },
  { id: 'active', label: '✓ Active' },
  { id: 'has-courses', label: '📚 Has courses' },
];

const dateOptions = [
  { value: 'all-time', label: 'All time' },
  { value: 'last-7-days', label: 'Last 7 days' },
  { value: 'this-month', label: 'This month' },
  { value: 'this-year', label: 'This year' },
];

const creatorOptions = [
  { value: 'any', label: 'Any creator' },
  { value: 'sarah', label: 'Sarah Chen' },
  { value: 'alex', label: 'Alex Kumar' },
  { value: 'emma', label: 'Emma Wilson' },
];

const statusOptions = [
  { value: 'any', label: 'Any status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

function Dropdown({ 
  isOpen, 
  onClose, 
  options, 
  value, 
  onChange, 
  label 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  options: { value: string; label: string }[]; 
  value: string; 
  onChange: (value: string) => void;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[160px] animate-in zoom-in-95 fade-in duration-200"
    >
      {options.map((option, idx) => (
        <button
          key={option.value}
          onClick={() => {
            onChange(option.value);
            onClose();
          }}
          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${
            idx === 0 ? 'rounded-t-lg' : ''
          } ${idx === options.length - 1 ? 'rounded-b-lg' : ''} ${
            idx === 1 ? 'border-t border-gray-200' : ''
          }`}
        >
          <span className={value === option.value ? 'text-[#420D74]' : 'text-gray-900'}>
            {option.label}
          </span>
          {value === option.value && <Check className="size-4 text-[#420D74]" />}
        </button>
      ))}
    </div>
  );
}

export function SearchFilters({
  activeFilters,
  onToggleFilter,
  dateFilter,
  onDateFilterChange,
  creatorFilter,
  onCreatorFilterChange,
  statusFilter,
  onStatusFilterChange,
  onClearAll,
  hasActiveFilters,
  showDateMenu,
  setShowDateMenu,
  showCreatorMenu,
  setShowCreatorMenu,
  showStatusMenu,
  setShowStatusMenu,
}: SearchFiltersProps) {
  console.log('🎯 SearchFilters RENDER');
  console.log('activeFilters:', activeFilters);
  console.log('hasActiveFilters:', hasActiveFilters);
  
  const selectedDateLabel = dateOptions.find(o => o.value === dateFilter)?.label || 'All time';
  const selectedCreatorLabel = creatorOptions.find(o => o.value === creatorFilter)?.label || 'Any creator';
  const selectedStatusLabel = statusOptions.find(o => o.value === statusFilter)?.label || 'Any status';

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      {/* Row 1: Quick filters */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* Quick filter pills */}
          {quickFilters.map((filter) => {
            const isActive = activeFilters.includes(filter.id);
            return (
              <button
                key={filter.id}
                onClick={() => onToggleFilter(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#420D74] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-[#420D74]/50'
                }`}
              >
                <span>{filter.label}</span>
                {isActive && <X className="size-3" />}
              </button>
            );
          })}

          {/* Date filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDateMenu(!showDateMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                dateFilter !== 'all-time'
                  ? 'bg-[#420D74] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#420D74]/50'
              }`}
            >
              <Clock className="size-3.5" />
              <span>{selectedDateLabel}</span>
              <ChevronDown className="size-3" />
            </button>
            <Dropdown
              isOpen={showDateMenu}
              onClose={() => setShowDateMenu(false)}
              options={dateOptions}
              value={dateFilter}
              onChange={onDateFilterChange}
              label="Date"
            />
          </div>

          {/* Creator filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowCreatorMenu(!showCreatorMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                creatorFilter !== 'any'
                  ? 'bg-[#420D74] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#420D74]/50'
              }`}
            >
              <User className="size-3.5" />
              <span>{selectedCreatorLabel}</span>
              <ChevronDown className="size-3" />
            </button>
            <Dropdown
              isOpen={showCreatorMenu}
              onClose={() => setShowCreatorMenu(false)}
              options={creatorOptions}
              value={creatorFilter}
              onChange={onCreatorFilterChange}
              label="Creator"
            />
          </div>

          {/* Status filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap ${
                statusFilter !== 'any'
                  ? 'bg-[#420D74] text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#420D74]/50'
              }`}
            >
              <Filter className="size-3.5" />
              <span>{selectedStatusLabel}</span>
              <ChevronDown className="size-3" />
            </button>
            <Dropdown
              isOpen={showStatusMenu}
              onClose={() => setShowStatusMenu(false)}
              options={statusOptions}
              value={statusFilter}
              onChange={onStatusFilterChange}
              label="Status"
            />
          </div>

          {/* Clear all */}
          {hasActiveFilters && (
            <button
              onClick={onClearAll}
              className="text-xs text-[#420D74] hover:text-[#420D74]/80 transition-colors whitespace-nowrap ml-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Row 2: Advanced search helper + Sort */}
      <div className="px-6 py-2 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs">
          <div className="text-gray-500">
            Try: <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#420D74] font-mono">type:course</code>{' '}
            <code className="px-1.5 py-0.5 bg-gray-100 rounded text-[#420D74] font-mono">level:beginner</code>
          </div>
        </div>
      </div>
    </div>
  );
}