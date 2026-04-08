import { Search, Bell, Coins } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useCredits } from '../data/CreditContext';
import { MobileCreditDashboard } from './MobileCreditDashboard';

interface MobileTopBarProps {
  title: string;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
  nestedSection?: string | null;
  onBackClick?: () => void;
  onLeapspaceClick?: () => void;
}

export function MobileTopBar({ 
  title, 
  onSearchClick,
  onProfileClick,
  onNotificationClick,
  onLeapspaceClick,
}: MobileTopBarProps) {
  const [hasNotifications] = useState(true);
  const [showCreditDashboard, setShowCreditDashboard] = useState(false);

  const creditStore = useCredits();
  
  return (
    <>
      <div className="sticky top-0 z-30 bg-card border-b border-border text-card-foreground safe-area-inset-top">
        <div className="px-5 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Leapspace Switcher */}
            <button 
              onClick={onLeapspaceClick}
              className="p-1 rounded-xl transition-all active:bg-muted active:scale-95 group"
            >
              <div className="size-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-xs text-primary-foreground/90">LS</span>
              </div>
            </button>

            {/* Center: Credit Balance Chip */}
            {creditStore && (
              <button
                onClick={() => setShowCreditDashboard(true)}
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 active:scale-95 transition-all"
              >
                <Coins className="size-3.5 text-amber-500" />
                <span className="text-[12px] text-amber-800 tabular-nums">
                  {creditStore.userBalance.toLocaleString()}
                </span>
              </button>
            )}

            {/* Right: Search, Notifications, Profile */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <Button 
                variant="ghost"
                size="icon"
                onClick={onSearchClick}
                className="rounded-xl text-muted-foreground hover:text-card-foreground"
              >
                <Search className="size-[22px]" />
              </Button>

              <Button 
                variant="ghost"
                size="icon"
                onClick={onNotificationClick}
                className="rounded-xl text-muted-foreground hover:text-card-foreground relative"
              >
                <Bell className="size-[22px]" />
                {hasNotifications && (
                  <div className="absolute top-2.5 right-2.5 size-2 bg-destructive rounded-full border-2 border-card" />
                )}
              </Button>

              <button 
                onClick={onProfileClick}
                className="ml-1.5 active:scale-95 transition-transform"
              >
                <Avatar className="size-9 ring-2 ring-border">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">JD</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Dashboard — self-contained */}
      {creditStore && (
        <MobileCreditDashboard
          isOpen={showCreditDashboard}
          onClose={() => setShowCreditDashboard(false)}
        />
      )}
    </>
  );
}