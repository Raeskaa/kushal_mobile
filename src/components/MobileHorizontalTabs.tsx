import { Bell, Search } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface MobileHorizontalTabsProps {
  title: string;
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  showNotification?: boolean;
  onNotificationClick?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
}

export function MobileHorizontalTabs({
  title,
  tabs,
  activeTab,
  onTabChange,
  showNotification = true,
  onNotificationClick,
  showSearch = true,
  onSearchClick,
}: MobileHorizontalTabsProps) {
  return (
    <div className="bg-card border-b border-border">
      {/* Tabs Row */}
      <div className="flex overflow-x-auto no-scrollbar px-5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-3.5 border-b-2 transition-smooth active:scale-95 ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              <span className="whitespace-nowrap text-[13px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}