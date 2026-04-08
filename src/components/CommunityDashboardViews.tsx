import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Calendar, UsersIcon, Activity, UserPlus, AlertCircle, Search, Filter, 
  Trophy, Star, Shield, MoreVertical, MessageCircle, Eye, UserMinus,
  TrendingUp, GraduationCap, Heart, Brain, Target, Plus, Upload,
  ImageIcon, Link, Check, X, Edit, Trash2, BarChart3, Mail, PlayCircle,
  Clock, Video, MapPin, Phone, Wand2
} from 'lucide-react';

// Sample data types
interface Member {
  id: string;
  name: string;
  status: string;
  role: string;
  avatar: string;
  level: number;
  points: number;
  title: string;
  joinDate: string;
  bio: string;
  expertise: string[];
  sentiment: string;
  churnRisk: number;
  contributorScore: number;
}

interface Post {
  id: string;
  author: Member;
  content: string;
  timestamp: string;
  channel: string;
  reactions: Array<{ emoji: string; count: number; reacted: boolean }>;
  replies: Array<{ author: Member; preview: string }>;
  hasImage: boolean;
  isPinned: boolean;
  aiScore: number;
  sentiment: string;
}

interface AnalyticsProps {
  userRole: string;
  samplePosts: Post[];
}

interface SettingsProps {
  userRole: string;
  communityData: { title?: string };
}

interface EventsProps {
  userRole: string;
}

export function AnalyticsView({ userRole, samplePosts }: AnalyticsProps) {
  const canAccessAnalytics = userRole === 'admin' || userRole === 'moderator';
  
  if (!canAccessAnalytics) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Track your community's performance</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="size-4 mr-2" />
              Last 30 days
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Members</span>
                <UsersIcon className="size-4 text-purple-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">128</p>
              <p className="text-xs text-green-600">↑ 12% vs last month</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Engagement Rate</span>
                <Activity className="size-4 text-blue-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">68%</p>
              <p className="text-xs text-green-600">↑ 5% vs last month</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Courses</span>
                <GraduationCap className="size-4 text-orange-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">5</p>
              <p className="text-xs text-gray-500">2 published</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Revenue (MTD)</span>
                <TrendingUp className="size-4 text-emerald-600" />
              </div>
              <p className="text-2xl text-gray-900 mb-1">$12.4k</p>
              <p className="text-xs text-green-600">↑ 23% vs last month</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Growth Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">Member Growth</h3>
              <div className="h-48 flex items-end justify-around gap-2">
                {[45, 52, 48, 63, 71, 68, 78, 85, 92, 98, 105, 128].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-purple-200 rounded-t" style={{ height: `${(value / 128) * 100}%` }}>
                      <div className="w-full bg-purple-600 rounded-t h-1/2" />
                    </div>
                    <span className="text-xs text-gray-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">Weekly Engagement</h3>
              <div className="h-48 flex items-end justify-around gap-2">
                {[65, 72, 68, 75, 71, 68, 78].map((value, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-blue-200 rounded-t" style={{ height: `${value}%` }}>
                      <div className="w-full bg-blue-600 rounded-t h-1/2" />
                    </div>
                    <span className="text-xs text-gray-500">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Content Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-4">Top Performing Posts</h3>
            <div className="space-y-3">
              {samplePosts.slice(0, 3).map((post, idx) => (
                <div key={post.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-center justify-center size-8 bg-gray-100 rounded text-sm text-gray-600">
                    #{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{post.content}</p>
                    <p className="text-xs text-gray-500">by {post.author.name} • {post.timestamp}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Heart className="size-4" />
                      <span>{post.reactions.reduce((sum, r) => sum + r.count, 0)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="size-4" />
                      <span>{post.replies.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="size-4" />
                      <span>{post.aiScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Completion */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-4">Course Completion Rates</h3>
            <div className="space-y-3">
              {[
                { name: 'Web Development Bootcamp', completion: 72 },
                { name: 'Digital Marketing Fundamentals', completion: 85 },
                { name: 'UI/UX Design Masterclass', completion: 56 }
              ].map((course, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{course.name}</span>
                    <span className="text-gray-600">{course.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${course.completion}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          {userRole === 'admin' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-gray-900 mb-1">AI Insights & Predictions</h3>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-start gap-2 text-sm">
                      <TrendingUp className="size-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-gray-900">Engagement spike predicted for Thursday 2-4 PM</p>
                        <p className="text-xs text-gray-600">Best time to post announcements this week</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="size-4 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-gray-900">8 members at risk of churning</p>
                        <p className="text-xs text-gray-600">Consider personalized re-engagement campaign</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Target className="size-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-gray-900">Community health trending toward 85/100</p>
                        <p className="text-xs text-gray-600">On track to meet monthly goals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SettingsView({ userRole, communityData }: SettingsProps) {
  const canAccessSettings = userRole === 'admin' || userRole === 'moderator';
  
  if (!canAccessSettings) return null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-gray-900">Settings</h2>
        <p className="text-sm text-gray-600 mt-1">Manage your community configuration</p>
      </div>

      <div className="p-6">
        <div className="max-w-4xl space-y-6">
          {/* General Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-4">General Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Community Name</label>
                <input
                  type="text"
                  defaultValue={communityData.title || 'Design Professionals Hub'}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Description</label>
                <Textarea
                  defaultValue="A community for design professionals to learn, share, and grow together."
                  className="w-full resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Privacy</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                  <option>Public - Anyone can join</option>
                  <option>Private - Invite only</option>
                  <option>Hidden - Not discoverable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm text-gray-900 mb-4">Branding</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Community Logo</label>
                <div className="flex items-center gap-4">
                  <div className="size-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <ImageIcon className="size-6 text-gray-400" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="size-4 mr-2" />
                    Upload Logo
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Header Image</label>
                <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="size-8 text-gray-400" />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="size-4 mr-2" />
                  Upload Header
                </Button>
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Primary Color</label>
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-purple-600 rounded-lg border border-gray-200" />
                  <input
                    type="text"
                    defaultValue="#420D74"
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          {userRole === 'admin' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">Permissions & Roles</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">Members can create posts</p>
                    <p className="text-xs text-gray-600">Allow all members to post in channels</p>
                  </div>
                  <button className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="size-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">Members can invite others</p>
                    <p className="text-xs text-gray-600">Allow members to send invites</p>
                  </div>
                  <button className="size-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <X className="size-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">Require approval for new members</p>
                    <p className="text-xs text-gray-600">Manually approve join requests</p>
                  </div>
                  <button className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="size-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Monetization */}
          {userRole === 'admin' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">Monetization</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Membership Fee</label>
                  <div className="flex items-center gap-2">
                    <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                      <option>Free</option>
                      <option>One-time</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-700 mb-1 block">Payment Provider</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent">
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>Razorpay</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {userRole === 'admin' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">Integrations</h3>
              <div className="space-y-3">
                {[
                  { name: 'Zoom', description: 'Video conferencing for events', connected: true },
                  { name: 'Google Calendar', description: 'Sync community events', connected: false },
                  { name: 'Mailchimp', description: 'Email marketing automation', connected: false },
                  { name: 'Slack', description: 'Cross-post to Slack workspace', connected: false }
                ].map((integration, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Link className="size-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{integration.name}</p>
                        <p className="text-xs text-gray-600">{integration.description}</p>
                      </div>
                    </div>
                    {integration.connected ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
                    ) : (
                      <Button variant="outline" size="sm">Connect</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Configuration */}
          {userRole === 'admin' && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm text-gray-900 mb-4">AI Assistant</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">Enable AI suggestions</p>
                    <p className="text-xs text-gray-600">Get AI-powered content and moderation suggestions</p>
                  </div>
                  <button className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="size-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">Auto-moderate content</p>
                    <p className="text-xs text-gray-600">Automatically flag inappropriate content</p>
                  </div>
                  <button className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="size-4 text-white" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-900">AI content generation</p>
                    <p className="text-xs text-gray-600">Help create posts, courses, and announcements</p>
                  </div>
                  <button className="size-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Check className="size-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventsView({ userRole }: EventsProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-900">Events</h2>
            <p className="text-sm text-gray-600 mt-1">Manage community events and gatherings</p>
          </div>
          {(userRole === 'admin' || userRole === 'moderator') && (
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="size-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl space-y-6">
          {/* Upcoming Events */}
          <div>
            <h3 className="text-sm text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {[
                {
                  id: 1,
                  title: 'Monthly Community Call',
                  date: 'Dec 15, 2024',
                  time: '3:00 PM EST',
                  type: 'virtual',
                  attendees: 42,
                  capacity: 100,
                  description: 'Monthly sync to discuss Q1 goals and upcoming features'
                },
                {
                  id: 2,
                  title: 'Design Workshop: Figma Advanced',
                  date: 'Dec 18, 2024',
                  time: '2:00 PM EST',
                  type: 'virtual',
                  attendees: 28,
                  capacity: 50,
                  description: 'Learn advanced Figma techniques from industry experts'
                },
                {
                  id: 3,
                  title: 'Networking Mixer',
                  date: 'Dec 22, 2024',
                  time: '6:00 PM EST',
                  type: 'in-person',
                  attendees: 15,
                  capacity: 30,
                  description: 'Meet fellow community members in person'
                }
              ].map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Date Box */}
                    <div className="size-16 bg-purple-50 border border-purple-200 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs text-purple-600">Dec</span>
                      <span className="text-xl text-purple-900">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm text-gray-900 mb-1">{event.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="size-3" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              {event.type === 'virtual' ? (
                                <>
                                  <Video className="size-3" />
                                  <span>Virtual</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="size-3" />
                                  <span>In-Person</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <UsersIcon className="size-3" />
                              <span>{event.attendees}/{event.capacity} attending</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        </div>
                        {(userRole === 'admin' || userRole === 'moderator') && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="text-gray-400 hover:text-gray-600 ml-2">
                                <MoreVertical className="size-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-1" align="end">
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                <Edit className="size-4" />
                                Edit Event
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                <Mail className="size-4" />
                                Send Reminder
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                <BarChart3 className="size-4" />
                                View Analytics
                              </button>
                              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md">
                                <Trash2 className="size-4" />
                                Cancel Event
                              </button>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Check className="size-3 mr-2" />
                          RSVP
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="size-3 mr-2" />
                          Remind Me
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events */}
          <div>
            <h3 className="text-sm text-gray-900 mb-4">Past Events</h3>
            <div className="space-y-3">
              {[
                {
                  id: 4,
                  title: 'Welcome Webinar',
                  date: 'Nov 28, 2024',
                  attendees: 65,
                  recording: true
                },
                {
                  id: 5,
                  title: 'Q&A with Industry Leaders',
                  date: 'Nov 15, 2024',
                  attendees: 48,
                  recording: true
                }
              ].map((event) => (
                <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-12 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                        <Calendar className="size-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-900">{event.title}</h4>
                        <p className="text-xs text-gray-600">{event.date} • {event.attendees} attended</p>
                      </div>
                    </div>
                    {event.recording && (
                      <Button size="sm" variant="outline">
                        <PlayCircle className="size-3 mr-2" />
                        Watch Recording
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Event Suggestions */}
          {userRole === 'admin' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-gray-900 mb-1">AI Event Suggestions</h3>
                  <p className="text-sm text-gray-600 mb-3">Based on member interests and engagement patterns:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-purple-600" />
                      <span className="text-gray-700">Code Review Session</span>
                      <span className="text-xs text-gray-500">(High interest from developers)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-purple-600" />
                      <span className="text-gray-700">Portfolio Review Workshop</span>
                      <span className="text-xs text-gray-500">(Requested by 12 members)</span>
                    </div>
                  </div>
                  <Button size="sm" className="mt-3 bg-purple-600 hover:bg-purple-700">
                    <Wand2 className="size-3 mr-2" />
                    Generate Event Plan
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
