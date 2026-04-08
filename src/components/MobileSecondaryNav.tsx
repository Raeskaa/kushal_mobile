import { LucideIcon } from 'lucide-react';
import { Badge } from './ui/badge';

export interface SecondaryNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  color?: string;
}

interface MobileSecondaryNavProps {
  items: SecondaryNavItem[];
  activeId: string;
  onNavigate: (id: string) => void;
  title?: string;
}

export function MobileSecondaryNav({ items, activeId, onNavigate, title }: MobileSecondaryNavProps) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-30">
      {title && (
        <div className="px-4 py-2 border-b border-border">
          <h2 className="text-sm text-card-foreground">{title}</h2>
        </div>
      )}
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 px-4 py-3 min-w-max">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 relative border ${
                  isActive
                    ? 'bg-primary/5 text-primary border-primary/20'
                    : 'bg-card text-muted-foreground border-border hover:bg-muted hover:border-border active:bg-accent'
                }`}
              >
                <Icon className={`size-4 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] font-bold ml-0.5 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-destructive text-destructive-foreground'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}