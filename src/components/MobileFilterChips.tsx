interface Filter {
  id: string;
  label: string;
}

interface MobileFilterChipsProps {
  filters: Filter[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  leapspaceContext?: 'all' | 'creator' | 'member';
}

export function MobileFilterChips({ 
  filters, 
  activeFilter, 
  onFilterChange,
  leapspaceContext = 'all'
}: MobileFilterChipsProps) {
  const getVisibleFilters = () => {
    if (leapspaceContext === 'all') {
      return filters.filter(f => 
        f.id === 'all' || 
        f.id === 'member' || 
        f.id === 'moderator' || 
        f.id === 'admin' ||
        f.id === 'draft'
      );
    } else if (leapspaceContext === 'creator') {
      return filters.filter(f => f.id === 'draft' || f.id === 'all');
    } else if (leapspaceContext === 'member') {
      return filters.filter(f => 
        f.id === 'all' || 
        f.id === 'member' || 
        f.id === 'moderator' || 
        f.id === 'admin'
      );
    }
    return filters;
  };

  const visibleFilters = getVisibleFilters();

  return (
    <div className="flex gap-2 whitespace-nowrap">
      {visibleFilters.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all active:scale-95 ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground shadow-sm border border-border hover:bg-muted'
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
