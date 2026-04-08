import { useState } from 'react';
import { MobileBuilderTabs } from '../MobileBuilderTabs';
import { MessageSquare, AtSign, Users as UsersIcon, Hash, Send } from 'lucide-react';

interface MobileCommunityMessagesProps {
  communityId: string;
}

export function MobileCommunityMessages({ communityId }: MobileCommunityMessagesProps) {
  const [activeTab, setActiveTab] = useState('direct');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  const tabs = [
    { id: 'direct', label: 'Direct' },
    { id: 'groups', label: 'Groups' },
    { id: 'channels', label: 'Channels' },
    { id: 'mentions', label: 'Mentions' },
  ];

  const directMessages = [
    { id: '1', name: 'Sarah Johnson', avatar: 'SJ', lastMessage: 'Thanks for the feedback!', time: '2m ago', unread: 2 },
    { id: '2', name: 'Mike Chen', avatar: 'MC', lastMessage: 'See you at the workshop', time: '1h ago', unread: 0 },
    { id: '3', name: 'Emma Wilson', avatar: 'EW', lastMessage: 'Great presentation today', time: '3h ago', unread: 1 },
  ];

  const groupChats = [
    { id: 'g1', name: 'Design Team', members: 12, lastMessage: 'Mike: Let\'s sync tomorrow', time: '30m ago', unread: 5 },
    { id: 'g2', name: 'Event Planning', members: 8, lastMessage: 'Sarah: Venue confirmed!', time: '2h ago', unread: 0 },
  ];

  const channels = [
    { id: 'c1', name: '# announcements', messages: 45, lastMessage: 'New workshop next week', time: '1h ago', unread: 2 },
    { id: 'c2', name: '# general', messages: 1234, lastMessage: 'Anyone free for coffee?', time: '15m ago', unread: 12 },
    { id: 'c3', name: '# design-feedback', messages: 567, lastMessage: 'Love the new mockups!', time: '45m ago', unread: 3 },
  ];

  if (selectedThread) {
    return (
      <div className="flex flex-col h-[calc(100vh-200px)]">
        {/* Thread Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setSelectedThread(null)}
            className="text-sm text-[#420D74] mb-2"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-sm text-[#420D74]">SJ</span>
            </div>
            <div>
              <h3 className="text-sm text-gray-900">Sarah Johnson</h3>
              <p className="text-xs text-green-600">● Active now</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { from: 'them', text: 'Hey! Did you get a chance to review the designs?', time: '2:30 PM' },
            { from: 'me', text: 'Yes! They look great. Just a few minor tweaks needed.', time: '2:32 PM' },
            { from: 'them', text: 'Thanks for the feedback!', time: '2:33 PM' },
          ].map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] ${msg.from === 'me' ? 'bg-[#420D74] text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-purple-200' : 'text-gray-500'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#420D74]"
            />
            <button className="px-4 py-2 bg-[#420D74] text-white rounded-lg active:scale-95 transition-all">
              <Send className="size-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* L3: Builder Tabs */}
      <MobileBuilderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Direct Messages */}
      {activeTab === 'direct' && (
        <div className="p-4 space-y-2">
          {directMessages.map((dm) => (
            <button
              key={dm.id}
              onClick={() => setSelectedThread(dm.id)}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm text-[#420D74]">{dm.avatar}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm text-gray-900">{dm.name}</h3>
                    <span className="text-xs text-gray-500">{dm.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{dm.lastMessage}</p>
                </div>
                {dm.unread > 0 && (
                  <span className="size-5 bg-[#420D74] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                    {dm.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Group Chats */}
      {activeTab === 'groups' && (
        <div className="p-4 space-y-2">
          {groupChats.map((group) => (
            <button
              key={group.id}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UsersIcon className="size-6 text-[#420D74]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm text-gray-900">{group.name}</h3>
                    <span className="text-xs text-gray-500">{group.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 truncate flex-1">{group.lastMessage}</p>
                    {group.unread > 0 && (
                      <span className="size-5 bg-[#420D74] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {group.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{group.members} members</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Channels */}
      {activeTab === 'channels' && (
        <div className="p-4 space-y-2">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Hash className="size-6 text-[#420D74]" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm text-gray-900">{channel.name}</h3>
                    <span className="text-xs text-gray-500">{channel.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600 truncate flex-1">{channel.lastMessage}</p>
                    {channel.unread > 0 && (
                      <span className="size-5 bg-[#420D74] text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">
                        {channel.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{channel.messages} messages</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mentions */}
      {activeTab === 'mentions' && (
        <div className="p-4 space-y-2">
          {[
            { channel: '# general', author: 'Sarah Johnson', message: '@you Great point about the design!', time: '1h ago' },
            { channel: '# design-feedback', author: 'Mike Chen', message: '@you Can you review this?', time: '3h ago' },
          ].map((mention, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AtSign className="size-5 text-[#420D74]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{mention.channel}</span>
                    <span className="text-xs text-gray-500">{mention.time}</span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{mention.author}</p>
                  <p className="text-sm text-gray-700">{mention.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
