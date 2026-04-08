import { useState } from 'react';
import { Plus, Users, Calendar, BookOpen, Sparkles, ShoppingBag, FileText, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';

interface MobileGlobalNavProps {
  currentPage: 'home' | 'communities' | 'courses' | 'events' | 'leapy' | 'drafts' | 'marketplace';
  onNavigate: (page: 'home' | 'communities' | 'courses' | 'events' | 'leapy' | 'drafts' | 'marketplace') => void;
  onOpenAI: () => void;
  activeNestedSection?: string | null;
  onNestedNavigate?: (sectionId: string) => void;
}

export function MobileGlobalNav({ currentPage, onNavigate, onOpenAI }: MobileGlobalNavProps) {
  const [isHelpMode, setIsHelpMode] = useState(false);

  const mainTabs = [
    { id: 'home', label: 'Home', icon: Plus },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
  ] as const;

  const helpTabs = [
    { id: 'leapy', label: 'Leapy', icon: Sparkles },
    { id: 'drafts', label: 'Drafts', icon: FileText },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
  ] as const;

  const handleHelpToggle = () => {
    setIsHelpMode(true);
    onNavigate('leapy');
  };

  const handleMainConsolidatedClick = () => {
    setIsHelpMode(false);
    onNavigate('home');
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-inset-bottom">
        <div className="px-4 py-2.5 flex items-center justify-between gap-3 h-[72px]">
          
          <button
            onClick={handleMainConsolidatedClick}
            className={`
              bg-card border border-border rounded-full 
              flex items-center justify-center flex-shrink-0
              active:scale-95 transition-all duration-500 ease-in-out
              ${isHelpMode ? 'size-[48px] opacity-100 scale-100' : 'w-0 opacity-0 scale-0 border-0'}
            `}
          >
            <LayoutGrid className="size-5 text-muted-foreground" />
          </button>

          <div 
            className={`
              bg-muted rounded-[2rem] p-1.5 
              flex items-center gap-1 overflow-hidden
              transition-all duration-500 ease-in-out
              ${isHelpMode ? 'w-0 opacity-0 -translate-x-full' : 'flex-1 opacity-100 translate-x-0'}
            `}
          >
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPage === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-3 rounded-[1.5rem] transition-all duration-300 ${
                    isActive 
                      ? 'bg-card text-primary ring-1 ring-border' 
                      : 'text-muted-foreground hover:text-foreground active:scale-95'
                  }`}
                >
                  <Icon className={`size-[22px] transition-all ${isActive ? 'scale-105' : ''}`} />
                </button>
              );
            })}
          </div>

          <div 
            className={`
              bg-muted rounded-[2rem] p-1.5 
              flex items-center gap-1 overflow-hidden
              transition-all duration-500 ease-in-out
              ${isHelpMode ? 'flex-1 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-full'}
            `}
          >
            {helpTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPage === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className={`flex-1 flex items-center justify-center py-3 px-3 rounded-[1.5rem] transition-all duration-300 ${
                    isActive 
                      ? 'bg-card text-primary ring-1 ring-border' 
                      : 'text-muted-foreground hover:text-foreground active:scale-95'
                  }`}
                >
                  <Icon className={`size-[22px] transition-all ${isActive ? 'scale-105' : ''}`} />
                </button>
              );
            })}
          </div>

          <button
            onClick={handleHelpToggle}
            className={`
              size-[48px] bg-card border border-border rounded-full 
              flex items-center justify-center flex-shrink-0
              active:scale-95 transition-all duration-500 ease-in-out
              ${isHelpMode ? 'w-0 opacity-0 scale-0 border-0' : 'opacity-100 scale-100'}
            `}
          >
            <LayoutGrid className="size-5 text-muted-foreground" />
          </button>
        </div>
      </nav>
    </>
  );
}
