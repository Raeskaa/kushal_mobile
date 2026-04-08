import { useState } from 'react';
import { MobileBuilderTabs } from '../MobileBuilderTabs';
import { TrendingUp, Users, MessageSquare, Eye, Activity, Calendar } from 'lucide-react';

interface MobileCommunityAnalyticsProps {
  communityId: string;
}

export function MobileCommunityAnalytics({ communityId }: MobileCommunityAnalyticsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'content', label: 'Content' },
    { id: 'channels', label: 'Channels' },
    { id: 'health', label: 'Health' },
  ];

  return (
    <div>
      {/* L3: Builder Tabs */}
      <MobileBuilderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Overview */}
      {activeTab === 'overview' && (
        <div className="p-4 space-y-4">
          {/* Key Metrics */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base text-gray-900 mb-4">Key Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Members', value: '247', change: '+12%', icon: Users, trend: 'up' },
                { label: 'Active Today', value: '89', change: '+8%', icon: Activity, trend: 'up' },
                { label: 'Total Posts', value: '1,234', change: '+15%', icon: MessageSquare, trend: 'up' },
                { label: 'Engagement', value: '78%', change: '-2%', icon: TrendingUp, trend: 'down' },
              ].map((metric, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <metric.icon className={`size-5 mb-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                  <div className="text-2xl text-gray-900 mb-1">{metric.value}</div>
                  <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                  <div className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Chart Placeholder */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Member Growth (30 Days)</h3>
            <div className="h-40 bg-purple-50 rounded-lg flex items-end justify-center">
              <div className="text-sm text-gray-600 mb-4">Chart visualization</div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Quick Insights</h3>
            <div className="space-y-2">
              {[
                { label: 'Peak Activity Time', value: '2:00 PM - 4:00 PM' },
                { label: 'Most Active Day', value: 'Wednesday' },
                { label: 'Avg. Session Duration', value: '12 minutes' },
                { label: 'New Members (7 days)', value: '18 members' },
              ].map((insight, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{insight.label}</span>
                  <span className="text-gray-900">{insight.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Member Analytics */}
      {activeTab === 'members' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-4">Member Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Daily Active Users (DAU)', value: '89', total: '247' },
                { label: 'Weekly Active Users (WAU)', value: '156', total: '247' },
                { label: 'Monthly Active Users (MAU)', value: '231', total: '247' },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{metric.label}</span>
                    <span className="text-sm text-gray-900">{metric.value}/{metric.total}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#420D74] rounded-full" 
                      style={{ width: `${(parseInt(metric.value) / parseInt(metric.total)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Member Segmentation</h3>
            <div className="space-y-2">
              {[
                { label: 'High Activity', count: 67, color: 'bg-green-600' },
                { label: 'Medium Activity', count: 124, color: 'bg-yellow-600' },
                { label: 'Low Activity', count: 56, color: 'bg-red-600' },
              ].map((segment, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`size-3 ${segment.color} rounded-full`}></div>
                  <span className="text-sm text-gray-600 flex-1">{segment.label}</span>
                  <span className="text-sm text-gray-900">{segment.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Analytics */}
      {activeTab === 'content' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-4">Post Performance</h3>
            <div className="space-y-3">
              {[
                { title: 'Design Sprint Takeaways', views: 234, engagement: 45 },
                { title: 'UX Workshop Tomorrow', views: 189, engagement: 38 },
                { title: 'New Course Announcement', views: 156, engagement: 32 },
              ].map((post, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-2">{post.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="size-3" />
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="size-3" />
                      <span>{post.engagement} engagements</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Channel Analytics */}
      {activeTab === 'channels' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm text-gray-900 mb-4">Channel Activity</h3>
            <div className="space-y-3">
              {[
                { name: '# general', messages: 1234, members: 247, activity: 95 },
                { name: '# announcements', messages: 45, members: 247, activity: 78 },
                { name: '# design-feedback', messages: 567, members: 189, activity: 82 },
              ].map((channel, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm text-gray-900">{channel.name}</h4>
                    <span className="text-xs text-gray-600">{channel.messages} messages</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#420D74] rounded-full" 
                        style={{ width: `${channel.activity}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{channel.activity}%</span>
                  </div>
                  <p className="text-xs text-gray-500">{channel.members} members</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Health */}
      {activeTab === 'health' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-900">Overall Health Score</h3>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-green-600" />
                <span className="text-sm text-green-600">Healthy</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Community Score</span>
                <span className="text-2xl text-gray-900">87/100</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: 'Member Engagement', score: 92, color: 'bg-green-600' },
                { label: 'Content Quality', score: 85, color: 'bg-green-600' },
                { label: 'Member Growth', score: 78, color: 'bg-yellow-600' },
                { label: 'Retention Rate', score: 90, color: 'bg-green-600' },
                { label: 'Community Sentiment', score: 88, color: 'bg-green-600' },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{metric.label}</span>
                    <span className="text-xs text-gray-900">{metric.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${metric.color} rounded-full`} 
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}