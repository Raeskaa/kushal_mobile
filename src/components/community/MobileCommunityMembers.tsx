import { useState } from 'react';
import { MobileFilterChips } from '../MobileFilterChips';
import { Users, Plus, Search, Crown, Shield } from 'lucide-react';

interface MobileCommunityMembersProps {
  communityId: string;
}

export function MobileCommunityMembers({ communityId }: MobileCommunityMembersProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'new', label: 'New' },
    { id: 'moderators', label: 'Moderators' },
    { id: 'admins', label: 'Admins' },
  ];

  const members = [
    { id: '1', name: 'Sarah Johnson', avatar: 'SJ', role: 'Admin', status: 'online', joinDate: 'Jan 2024', posts: 145 },
    { id: '2', name: 'Mike Chen', avatar: 'MC', role: 'Moderator', status: 'online', joinDate: 'Feb 2024', posts: 98 },
    { id: '3', name: 'Emma Wilson', avatar: 'EW', role: 'Member', status: 'offline', joinDate: 'Mar 2024', posts: 67 },
    { id: '4', name: 'David Park', avatar: 'DP', role: 'Member', status: 'online', joinDate: 'Dec 2024', posts: 23 },
    { id: '5', name: 'Lisa Anderson', avatar: 'LA', role: 'Member', status: 'offline', joinDate: 'Dec 2024', posts: 12 },
  ];

  return (
    <div>
      {/* Search & Filter */}
      <div className="bg-white border-b border-gray-200 p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#420D74]"
          />
        </div>

        {/* L3: Filter Chips */}
        <MobileFilterChips
          filters={filters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-[#420D74]" />
            <span className="text-gray-900">247 members</span>
          </div>
          <button className="flex items-center gap-1 text-[#420D74] active:scale-95 transition-all">
            <Plus className="size-4" />
            <span className="text-xs">Invite</span>
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="p-4 space-y-3">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 relative">
                <span className="text-sm text-gray-700">{member.avatar}</span>
                {member.status === 'online' && (
                  <span className="absolute bottom-0 right-0 size-3 bg-[#420D74] border-2 border-white rounded-full"></span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm text-gray-900">{member.name}</h3>
                  {member.role === 'Admin' && <Crown className="size-3.5 text-gray-500" />}
                  {member.role === 'Moderator' && <Shield className="size-3.5 text-gray-500" />}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className={member.role !== 'Member' ? 'text-[#420D74]' : ''}>
                    {member.role}
                  </span>
                  <span>•</span>
                  <span>Joined {member.joinDate}</span>
                  <span>•</span>
                  <span>{member.posts} posts</span>
                </div>
              </div>

              <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-xs active:scale-95 transition-all hover:border-gray-300">
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="p-4 pb-6">
        <button className="w-full py-3 border border-gray-200 text-gray-700 rounded-lg text-sm active:scale-95 transition-all hover:border-gray-300">
          Load More Members
        </button>
      </div>
    </div>
  );
}