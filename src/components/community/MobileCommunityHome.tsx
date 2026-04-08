import { useState } from 'react';
import { MobileFilterChips } from '../MobileFilterChips';
import { TrendingUp, Users, Calendar, BookOpen, MessageSquare, Heart, MessageCircle, Share2, ThumbsUp } from 'lucide-react';

interface MobileCommunityHomeProps {
  communityId: string;
}

export function MobileCommunityHome({ communityId }: MobileCommunityHomeProps) {
  const [activityFilter, setActivityFilter] = useState('all');

  const activityFilters = [
    { id: 'all', label: 'All' },
    { id: 'posts', label: 'Posts' },
    { id: 'comments', label: 'Comments' },
    { id: 'events', label: 'Events' },
    { id: 'updates', label: 'Updates' },
  ];

  return (
    <div className="space-y-4">
      {/* Hero Banner */}
      <div className="bg-[#420D74] p-6 text-white">
        <h2 className="text-lg mb-1">Welcome back!</h2>
        <p className="text-sm text-purple-100">Here's what's happening in Design Innovators</p>
      </div>

      {/* Quick Stats */}
      <div className="px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm text-gray-900 mb-4">Community Stats</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Members', value: '247' },
              { icon: MessageSquare, label: 'Posts', value: '1.2k' },
              { icon: Calendar, label: 'Events', value: '12' },
              { icon: BookOpen, label: 'Courses', value: '8' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <stat.icon className="size-5 text-gray-400 mx-auto mb-1.5" />
                <div className="text-lg text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="px-4">
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-base text-gray-900 mb-4">Recent Activity</h3>
            <MobileFilterChips
              filters={activityFilters}
              activeFilter={activityFilter}
              onFilterChange={setActivityFilter}
            />
          </div>

          {/* Activity Items */}
          <div className="divide-y divide-gray-200">
            {[
              {
                type: 'post',
                author: 'Sarah Johnson',
                avatar: 'SJ',
                time: '2h ago',
                content: 'Just finished an amazing design sprint! Here are the key takeaways from our team...',
                likes: 24,
                comments: 8,
              },
              {
                type: 'event',
                author: 'Mike Chen',
                avatar: 'MC',
                time: '4h ago',
                content: 'Don\'t forget! UX Workshop starts tomorrow at 2 PM. Looking forward to seeing everyone there!',
                likes: 15,
                comments: 3,
              },
              {
                type: 'comment',
                author: 'Emma Wilson',
                avatar: 'EW',
                time: '6h ago',
                content: 'Great insights on the latest design trends. I especially loved the section on micro-interactions.',
                likes: 12,
                comments: 2,
              },
            ].map((activity, idx) => (
              <div key={idx} className="p-5">
                <div className="flex gap-3">
                  <div className="size-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-gray-700">{activity.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900">{activity.author}</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{activity.content}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 text-xs text-gray-600 active:scale-95 transition-all">
                        <Heart className="size-4" />
                        <span>{activity.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-600 active:scale-95 transition-all">
                        <MessageCircle className="size-4" />
                        <span>{activity.comments}</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-xs text-gray-600 active:scale-95 transition-all">
                        <Share2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="px-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base text-gray-900">Upcoming Events</h3>
            <button className="text-xs text-[#420D74]">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'UX Workshop', date: 'Tomorrow, 2:00 PM', attendees: 23 },
              { title: 'Design Review', date: 'Friday, 10:00 AM', attendees: 12 },
            ].map((event, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="size-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-gray-900">{event.title}</h4>
                  <p className="text-xs text-gray-600">{event.date} • {event.attendees} attending</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base text-gray-900">Featured Courses</h3>
            <button className="text-xs text-[#420D74]">View All</button>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Advanced Product Design', progress: 68, students: 45 },
              { title: 'UX Research Fundamentals', progress: 45, students: 32 },
            ].map((course, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="size-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm text-gray-900">{course.title}</h4>
                    <p className="text-xs text-gray-600">{course.students} students enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#420D74] rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <span className="text-xs text-gray-600">{course.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}