import { ReactNode, useState } from 'react';
import { Home, Users, BookOpen, Calendar, User, Sparkles, MessageCircle, Menu, X, Bell, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { imgGroup } from '../imports/svg-qpgp8';

interface MobileLayoutProps {
  children: ReactNode;
  currentPage: 'home' | 'communities' | 'courses' | 'events' | 'profile';
  onNavigate: (page: 'home' | 'communities' | 'courses' | 'events' | 'profile') => void;
  onAIClick: () => void;
  showAIFAB?: boolean;
  hideBottomNav?: boolean;
}

export function MobileLayout({ 
  children, 
  currentPage, 
  onNavigate, 
  onAIClick,
  showAIFAB = true,
  hideBottomNav = false
}: MobileLayoutProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'communities' as const, icon: Users, label: 'Communities' },
    { id: 'courses' as const, icon: BookOpen, label: 'Courses' },
    { id: 'events' as const, icon: Calendar, label: 'Events' },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-[480px] mx-auto">
      {/* Mobile Top Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setShowMenu(true)}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="size-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-2">
            <img src={imgGroup} alt="TrueLeap" className="size-7" />
            <span className="text-[#420D74]">TrueLeap</span>
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowNotifications(true)}
              className="p-2 -mr-2 hover:bg-gray-100 rounded-lg relative transition-colors"
            >
              <Bell className="size-6 text-gray-700" />
              <div className="absolute top-1.5 right-1.5 size-2 bg-[#420D74] rounded-full ring-2 ring-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* AI Floating Action Button */}
      {showAIFAB && (
        <button
          onClick={onAIClick}
          className="fixed bottom-20 right-4 size-14 bg-[#420D74] rounded-full flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
        >
          <Sparkles className="size-6 text-white" />
        </button>
      )}

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-40 max-w-[480px] mx-auto">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[64px] ${
                    isActive ? 'text-[#420D74]' : 'text-gray-600'
                  }`}
                >
                  <Icon className={`size-6 ${isActive ? 'fill-[#420D74]/10' : ''}`} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Side Menu Sheet */}
      <Sheet open={showMenu} onOpenChange={setShowMenu}>
        <SheetContent side="left" className="w-[300px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <img src={imgGroup} alt="Leapy" className="size-6" />
              <span>Menu</span>
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-1">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <User className="size-5 text-gray-600" />
              <span className="text-gray-900">My Profile</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <Users className="size-5 text-gray-600" />
              <span className="text-gray-900">My Communities</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <BookOpen className="size-5 text-gray-600" />
              <span className="text-gray-900">My Courses</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <Calendar className="size-5 text-gray-600" />
              <span className="text-gray-900">My Events</span>
            </button>
            <div className="border-t border-gray-200 my-2" />
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <span className="text-gray-900">Settings</span>
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 flex items-center gap-3">
              <span className="text-gray-900">Help & Support</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Notifications Sheet */}
      <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
        <SheetContent side="right" className="w-[300px]">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <div className="size-2 bg-[#420D74] rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">New member joined your community</p>
                  <p className="text-xs text-gray-600 mt-1">2 minutes ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="size-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">Course enrollment milestone reached</p>
                  <p className="text-xs text-gray-600 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="size-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-900">AI insights ready for review</p>
                  <p className="text-xs text-gray-600 mt-1">3 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}