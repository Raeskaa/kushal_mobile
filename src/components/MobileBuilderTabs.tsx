interface Tab {
  id: string;
  label: string;
}

interface MobileBuilderTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MobileBuilderTabs({ tabs, activeTab, onTabChange }: MobileBuilderTabsProps) {
  return (
    <div className="p-3 bg-card border-b border-border">
      <div className="overflow-x-auto">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-[13px] transition-all active:scale-95 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}