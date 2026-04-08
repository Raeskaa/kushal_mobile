import { useState } from 'react';
import { ArrowLeft, Search, Bell, Home, Sparkles, MessageSquare, Calendar, BookOpen, Users, BarChart3, Settings, Menu, ChevronDown, Hash } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { MobileCommunityHome } from './community/MobileCommunityHome';
import { MobileCommunityAIHub } from './community/MobileCommunityAIHub';
import { MobileCommunityMessages } from './community/MobileCommunityMessages';
import { MobileCommunityEvents } from './community/MobileCommunityEvents';
import { MobileCommunityCourses } from './community/MobileCommunityCourses';
import { MobileCommunityMembers } from './community/MobileCommunityMembers';
import { MobileCommunityAnalytics } from './community/MobileCommunityAnalytics';
import { MobileCommunitySettings } from './community/MobileCommunitySettings';

interface MobileIndividualCommunityProps {
  communityId: string;
  onBack: () => void;
}

export function MobileIndividualCommunity({ communityId, onBack }: MobileIndividualCommunityProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [showChannelsDrawer, setShowChannelsDrawer] = useState(false);
  const [showChannels, setShowChannels] = useState(true);

  // Mock community data
  const community = {
    id: communityId,
    name: 'Design Innovators',
    avatar: 'DI',
    members: 247,
    role: 'Admin',
  };

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'ai-hub', label: 'AI Hub', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Top Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-3 px-5 py-3.5">
          <button onClick={onBack} className="p-1 active:scale-95 transition-all">
            <ArrowLeft className="size-5 text-gray-900" />
          </button>
          
          <div className="size-8 bg-[#420D74] rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">{community.avatar}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] text-gray-900 truncate">{community.name}</h1>
            <p className="text-[13px] text-gray-400">{community.members} members</p>
          </div>

          <button onClick={() => toast('Search within community coming soon')} className="p-2.5 active:scale-95 transition-all">
            <Search className="size-5 text-gray-400" />
          </button>
          <button onClick={() => toast('Community notifications coming soon')} className="p-2.5 active:scale-95 transition-all relative">
            <Bell className="size-5 text-gray-400" />
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button 
            onClick={() => setShowChannelsDrawer(true)}
            className="p-2.5 active:scale-95 transition-all"
          >
            <Menu className="size-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-20">
        {activeTab === 'home' && <MobileCommunityHome communityId={communityId} />}
        {activeTab === 'ai-hub' && <MobileCommunityAIHub communityId={communityId} />}
        {activeTab === 'messages' && <MobileCommunityMessages communityId={communityId} />}
        {activeTab === 'events' && <MobileCommunityEvents communityId={communityId} />}
        {activeTab === 'courses' && <MobileCommunityCourses communityId={communityId} />}
        {activeTab === 'members' && <MobileCommunityMembers communityId={communityId} />}
        {activeTab === 'analytics' && <MobileCommunityAnalytics communityId={communityId} />}
        {activeTab === 'settings' && <MobileCommunitySettings communityId={communityId} />}
      </div>

      {/* Channels Drawer */}
      {showChannelsDrawer && (
        <div className="fixed inset-0 z-50" onClick={() => setShowChannelsDrawer(false)}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div 
            className="absolute right-0 top-0 bottom-0 w-64 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Community Header */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-[#420D74] rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">{community.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] text-gray-900 truncate">{community.name}</h2>
                  <p className="text-[13px] text-gray-400">{community.members} members</p>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation */}
              <div className="p-3 border-b border-gray-100">
                <div className="space-y-0.5">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    const hasBadge = tab.id === 'messages';
                    const hasNewBadge = tab.id === 'ai-hub';
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowChannelsDrawer(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all active:scale-[0.98] ${
                          isActive
                            ? 'bg-purple-50 text-[#420D74]'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="size-[18px] flex-shrink-0" />
                        <span className="text-[14px] flex-1 text-left">{tab.label}</span>
                        {hasBadge && (
                          <span className="bg-[#420D74] text-white text-xs px-1.5 py-0.5 rounded-full">
                            3
                          </span>
                        )}
                        {hasNewBadge && (
                          <span className="bg-purple-100 text-[#420D74] text-xs px-2 py-0.5 rounded-full">
                            New
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Channels Section */}
              <div className="p-3">
                <button
                  onClick={() => setShowChannels(!showChannels)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 mb-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all active:scale-98"
                >
                  <ChevronDown className={`size-4 transition-transform ${showChannels ? '' : '-rotate-90'}`} />
                  <span className="text-xs">Channels</span>
                </button>

                {showChannels && (
                  <div className="space-y-1">
                    {['# Announcements', '# General', '# Introduction', '# Design Feedback', '# Random'].map((channel, idx) => (
                      <button
                        key={idx}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg active:scale-98 transition-all flex items-center gap-2"
                      >
                        <Hash className="size-3.5 text-gray-500" />
                        <span className="flex-1">{channel.replace('# ', '')}</span>
                      </button>
                    ))}
                    <button className="w-full text-left px-3 py-2 text-sm text-[#420D74] hover:bg-purple-50 rounded-lg active:scale-98 transition-all">
                      + Add Channel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Profile Footer */}
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-[#420D74] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">You</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">Your Profile</p>
                  <p className="text-xs text-gray-600">{community.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}