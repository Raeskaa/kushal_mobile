import { X, Plus, Check, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { AddLeapspaceModal } from './AddLeapspaceModal';
import { MobileFilterChips } from './MobileFilterChips';

interface Leapspace {
  id: string;
  name: string;
  role: 'creator' | 'member';
  unreadCount?: number;
}

interface LeapspaceSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentLeapspace: string;
  onSwitch: (leapspaceId: string) => void;
  onOpenManageLeapSpace?: () => void;
}

const mockLeapspaces: Leapspace[] = [
  { id: 'trueleap', name: 'Trueleap', role: 'creator' },
  { id: 'design-academy', name: 'Design Academy', role: 'creator', unreadCount: 3 },
  { id: 'marketing-hub', name: 'Marketing Hub', role: 'member', unreadCount: 12 },
  { id: 'dev-community', name: 'Dev Community', role: 'member' },
  { id: 'product-school', name: 'Product School', role: 'creator', unreadCount: 5 },
];

export function LeapspaceSwitcher({ 
  isOpen, 
  onClose, 
  currentLeapspace,
  onSwitch,
  onOpenManageLeapSpace,
}: LeapspaceSwitcherProps) {
  const [isAddLeapspaceModalOpen, setIsAddLeapspaceModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const leapspaceFilters = [
    { id: 'all', label: 'All' },
    { id: 'draft', label: 'Drafts' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div 
        className={`fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {/* Leapspaces List */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            {/* All Leapspaces Option */}
            <button
              onClick={() => {
                onSwitch('all');
                onClose();
              }}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors active:bg-gray-50 ${
                currentLeapspace === 'all'
                  ? 'bg-white border-l-4 border-[#420D74]' 
                  : 'border-l-4 border-transparent'
              }`}
            >
              <div className={`size-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                currentLeapspace === 'all' ? 'bg-[#420D74]' : 'bg-gray-300'
              }`}>
                <span className="text-white text-lg">∞</span>
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${currentLeapspace === 'all' ? 'text-[#420D74]' : 'text-gray-900'}`}>
                    All Leapspaces
                  </span>
                  {currentLeapspace === 'all' && <Check className="size-4 text-[#420D74]" />}
                </div>
                <p className="text-xs text-gray-500">View everything</p>
              </div>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Filter Chips */}
            <div className="px-6 py-2">
              <MobileFilterChips
                filters={leapspaceFilters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                leapspaceContext="all"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Your Leapspaces */}
            <div className="px-6 py-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Your Leapspaces</p>
            </div>
            {mockLeapspaces.filter(ls => ls.role === 'creator').map((leapspace) => {
              const isActive = currentLeapspace === leapspace.id;
              return (
                <button
                  key={leapspace.id}
                  onClick={() => {
                    onSwitch(leapspace.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors active:bg-gray-50 ${
                    isActive 
                      ? 'bg-white border-l-4 border-[#420D74]' 
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className={`size-10 rounded-full flex-shrink-0 ${
                    isActive ? 'bg-[#420D74]' : 'bg-gray-300'
                  }`}>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isActive ? 'text-[#420D74]' : 'text-gray-900'}`}>
                        {leapspace.name}
                      </span>
                      {isActive && <Check className="size-4 text-[#420D74]" />}
                    </div>
                    <p className="text-xs text-gray-500">Creator</p>
                  </div>
                  {leapspace.unreadCount && leapspace.unreadCount > 0 && (
                    <div className="size-6 bg-[#420D74] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">{leapspace.unreadCount}</span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Joined Leapspaces */}
            <div className="px-6 py-2 mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Joined Leapspaces</p>
            </div>
            {mockLeapspaces.filter(ls => ls.role === 'member').map((leapspace) => {
              const isActive = currentLeapspace === leapspace.id;
              return (
                <button
                  key={leapspace.id}
                  onClick={() => {
                    onSwitch(leapspace.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-6 py-3 transition-colors active:bg-gray-50 ${
                    isActive 
                      ? 'bg-white border-l-4 border-[#420D74]' 
                      : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className={`size-10 rounded-full flex-shrink-0 ${
                    isActive ? 'bg-[#420D74]' : 'bg-gray-300'
                  }`}>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${isActive ? 'text-[#420D74]' : 'text-gray-900'}`}>
                        {leapspace.name}
                      </span>
                      {isActive && <Check className="size-4 text-[#420D74]" />}
                    </div>
                    <p className="text-xs text-gray-500">Member</p>
                  </div>
                  {leapspace.unreadCount && leapspace.unreadCount > 0 && (
                    <div className="size-6 bg-[#420D74] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-semibold">{leapspace.unreadCount}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions - Slack Style */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white">
          <button 
            onClick={() => setIsAddLeapspaceModalOpen(true)}
            className="w-full flex items-center gap-3 px-6 py-4 active:bg-gray-50 transition-colors"
          >
            <Plus className="size-5 text-gray-700" />
            <span className="text-gray-900">Add a leapspace</span>
          </button>
          
          <button 
            onClick={() => {
              onClose();
              onOpenManageLeapSpace?.();
            }}
            className="w-full flex items-center gap-3 px-6 py-4 active:bg-gray-50 transition-colors"
          >
            <Settings className="size-5 text-gray-700" />
            <span className="text-gray-900">Manage LeapSpace</span>
          </button>
          
          <button 
            onClick={() => console.log('Help')}
            className="w-full flex items-center gap-3 px-6 py-4 active:bg-gray-50 transition-colors"
          >
            <HelpCircle className="size-5 text-gray-700" />
            <span className="text-gray-900">Help</span>
          </button>
        </div>
      </div>

      {/* Add Leapspace Modal */}
      <AddLeapspaceModal
        isOpen={isAddLeapspaceModalOpen}
        onClose={() => setIsAddLeapspaceModalOpen(false)}
      />
    </>
  );
}
