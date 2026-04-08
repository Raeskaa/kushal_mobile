import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { 
  Filter, 
  Video, 
  MapPin, 
  Layers, 
  Globe, 
  Lock, 
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Ticket,
  Link2,
  Eye,
  DollarSign
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (id: string) => void;
}

const FilterGroup: React.FC<FilterGroupProps> = ({ title, options, selectedValues, onChange }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
        {title === 'DELIVERY FORMAT' && <Video className="w-4 h-4" />}
        {title === 'VISIBILITY' && <Eye className="w-4 h-4" />}
        {title === 'ACCESS TYPE' && <ShieldCheck className="w-4 h-4" />}
        {title === 'PRICE' && <DollarSign className="w-4 h-4" />}
        {title === 'NESTED IN' && <Layers className="w-4 h-4" />}
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] border transition-colors ${
                isSelected 
                  ? 'bg-primary text-primary-foreground border-primary' 
                  : 'bg-card text-card-foreground border-border hover:bg-muted'
              }`}
            >
              {option.icon && (
                <span className={isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}>
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface MobileEventsFilterDrawerProps {
  selectedFilters: string[];
  onApplyFilters: (filters: string[]) => void;
}

export const MobileEventsFilterDrawer: React.FC<MobileEventsFilterDrawerProps> = ({ 
  selectedFilters, 
  onApplyFilters 
}) => {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<string[]>([]);

  // Initialize temp filters when opening
  React.useEffect(() => {
    if (open) {
      setTempFilters(selectedFilters);
    }
  }, [open, selectedFilters]);

  const toggleFilter = (id: string) => {
    setTempFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    onApplyFilters(tempFilters);
    setOpen(false);
  };

  const handleClearAll = () => {
    setTempFilters([]);
  };

  const deliveryOptions: FilterOption[] = [
    { id: 'virtual', label: 'Virtual', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'in-person', label: 'In-Person', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'hybrid', label: 'Hybrid', icon: <Layers className="w-3.5 h-3.5" /> },
  ];

  const visibilityOptions: FilterOption[] = [
    { id: 'public', label: 'Public', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'private', label: 'Private', icon: <Lock className="w-3.5 h-3.5" /> },
    { id: 'global', label: 'Global', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'shared', label: 'Shared', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  const accessOptions: FilterOption[] = [
    { id: 'open', label: 'Open Registration', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
    { id: 'waitlist', label: 'Waitlist', icon: <Clock className="w-3.5 h-3.5" /> },
    { id: 'apply', label: 'Apply to Join', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
    { id: 'paid-access', label: 'Paid Access', icon: <Ticket className="w-3.5 h-3.5" /> },
  ];

  const priceOptions: FilterOption[] = [
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
  ];

  const nestedOptions: FilterOption[] = [
    { id: 'standalone', label: 'Standalone' },
    { id: 'inside-community', label: 'Inside Community', icon: <Link2 className="w-3.5 h-3.5" /> },
  ];

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-medium border transition-all active:scale-95 flex-shrink-0 shadow-sm ${
            selectedFilters.length > 0
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-card text-foreground border-border hover:bg-muted'
          }`}
        >
          <Filter className={`w-[22px] h-[22px] ${selectedFilters.length > 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
          <span className={`font-medium ${selectedFilters.length > 0 ? 'text-primary-foreground' : 'text-foreground'}`}>Filter</span>
          {selectedFilters.length > 0 && (
            <span className="ml-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-primary-foreground text-[11px] font-bold text-primary">
              {selectedFilters.length}
            </span>
          )}
        </button>
      </Drawer.Trigger>
      
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] h-[85vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          <div className="p-4 bg-card rounded-t-[20px] flex-1 flex flex-col overflow-hidden">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted-foreground/20 mb-4" />
            
            <div className="flex items-center justify-between mb-6">
              <Drawer.Title className="text-xl font-semibold text-card-foreground">Filters</Drawer.Title>
              <button 
                onClick={handleClearAll}
                className="text-[13px] text-primary font-medium"
              >
                Clear all
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 pb-20 no-scrollbar">
              <FilterGroup 
                title="DELIVERY FORMAT" 
                options={deliveryOptions} 
                selectedValues={tempFilters} 
                onChange={toggleFilter} 
              />
              <FilterGroup 
                title="VISIBILITY" 
                options={visibilityOptions} 
                selectedValues={tempFilters} 
                onChange={toggleFilter} 
              />
              <FilterGroup 
                title="ACCESS TYPE" 
                options={accessOptions} 
                selectedValues={tempFilters} 
                onChange={toggleFilter} 
              />
              <FilterGroup 
                title="PRICE" 
                options={priceOptions} 
                selectedValues={tempFilters} 
                onChange={toggleFilter} 
              />
              <FilterGroup 
                title="NESTED IN" 
                options={nestedOptions} 
                selectedValues={tempFilters} 
                onChange={toggleFilter} 
              />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
              <button 
                onClick={handleApply}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                Show Results
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
