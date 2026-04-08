import { useState } from 'react';
import { 
  MessageSquare, Users, BookOpen, BarChart3, Settings, Calendar,
  Plus, TrendingUp, Clock, Crown, ChevronRight, Hash, MoreVertical,
  Search, Filter, Bell, Star, Eye, Heart, Send, Bookmark, Share2,
  Award, Zap, Target, ThumbsUp, MessageCircleMore, Video, FileText,
  Shield, Link as LinkIcon, Globe, Lock, Mail, Sparkles, ArrowUpRight,
  Activity, UserPlus, MessageCircle, CheckCircle2, AlertCircle, Edit3
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { CommunityData } from '../types';
import { LeapyIcon } from './LeapyIcon';
import { MobileSecondaryNav, SecondaryNavItem } from './MobileSecondaryNav';

interface MobileCommunityDashboardProps {
  communityData: Partial<CommunityData>;
  onOpenAI: () => void;
}

export function MobileCommunityDashboard({ communityData, onOpenAI }: MobileCommunityDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPublished, setIsPublished] = useState(false); // Community publish state
  const [isAIPromptExpanded, setIsAIPromptExpanded] = useState(false); // AI prompt expansion state

  const tabs: SecondaryNavItem[] = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'build', label: 'Build', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: isPublished ? 5 : undefined },
    { id: 'members', label: 'Members', icon: Users, badge: isPublished ? undefined : 0 },
    { id: 'courses', label: 'Courses', icon: BookOpen, badge: 2 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const mockMessages = [
    { id: 1, author: 'Sarah Johnson', avatar: 'SJ', message: 'Just launched our new design system! Check it out in #resources', time: '2m ago', channel: 'general', likes: 12, replies: 5, unread: true },
    { id: 2, author: 'Mike Chen', avatar: 'MC', message: 'Anyone attending the UX conference next week? Would love to meet up!', time: '15m ago', channel: 'events', likes: 8, replies: 3, unread: true },
    { id: 3, author: 'Emma Wilson', avatar: 'EW', message: 'Great workshop today! Thanks to everyone who participated 🎉', time: '1h ago', channel: 'general', likes: 24, replies: 12, isPinned: true },
    { id: 4, author: 'Alex Kumar', avatar: 'AK', message: 'Quick question about the new course structure...', time: '2h ago', channel: 'courses', likes: 5, replies: 8 },
  ];

  const mockMembers = [
    { name: 'Sarah Johnson', role: 'Admin', level: 15, avatar: 'SJ', points: 2450, status: 'online', contributions: 156 },
    { name: 'Mike Chen', role: 'Moderator', level: 12, avatar: 'MC', points: 1890, status: 'online', contributions: 128 },
    { name: 'Emma Wilson', role: 'Member', level: 8, avatar: 'EW', points: 1240, status: 'away', contributions: 94 },
    { name: 'Alex Kumar', role: 'Member', level: 5, avatar: 'AK', points: 680, status: 'online', contributions: 52 },
    { name: 'Lisa Park', role: 'Member', level: 10, avatar: 'LP', points: 1560, status: 'online', contributions: 87 },
  ];

  const activeCourses = [
    { id: 1, title: 'Advanced Product Design', students: 45, progress: 68, instructor: 'Sarah J.', nextLesson: 'Tomorrow, 2 PM' },
    { id: 2, title: 'UX Research Fundamentals', students: 32, progress: 45, instructor: 'Mike C.', nextLesson: 'Friday, 10 AM' },
    { id: 3, title: 'Design Systems Mastery', students: 28, progress: 82, instructor: 'Emma W.', nextLesson: 'Today, 4 PM' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Weekly Design Review', date: 'Today, 3:00 PM', attendees: 23, type: 'Meeting' },
    { id: 2, title: 'UX Workshop: User Interviews', date: 'Tomorrow, 2:00 PM', attendees: 45, type: 'Workshop' },
    { id: 3, title: 'Community Coffee Chat', date: 'Friday, 10:00 AM', attendees: 12, type: 'Social' },
  ];

  const recentActivity = [
    { type: 'member', text: '3 new members joined today', time: '5m ago', icon: UserPlus },
    { type: 'course', text: 'Sarah completed "Design Systems Mastery"', time: '1h ago', icon: CheckCircle2 },
    { type: 'message', text: '45 new messages in #general', time: '2h ago', icon: MessageCircle },
    { type: 'event', text: 'UX Workshop starting in 2 hours', time: '3h ago', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Enhanced Community Header with Purple Background */}
      <div className="bg-primary px-5 pt-6 pb-5 relative overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-foreground rounded-full" />
        </div>

        <div className="relative z-10">
          {/* Top Bar with Icons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-primary-foreground/15 rounded-full flex items-center justify-center border-2 border-primary-foreground/20">
                <LeapyIcon className="size-6" />
              </div>
              <h1 className="text-xl text-primary-foreground">{communityData.title || 'Home'}</h1>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2.5 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Users className="size-5 text-primary-foreground/80" />
              </button>
              <button className="p-2.5 hover:bg-primary-foreground/10 rounded-full transition-colors">
                <Search className="size-5 text-primary-foreground/80" />
              </button>
              <button className="p-2.5 hover:bg-primary-foreground/10 rounded-full transition-colors relative">
                <Bell className="size-5 text-primary-foreground/80" />
                <div className="absolute top-1.5 right-1.5 size-2 bg-destructive rounded-full border-2 border-primary" />
              </button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary-foreground/10 rounded-xl p-3.5 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <Users className="size-4 text-primary-foreground/70" />
                <p className="text-xs text-primary-foreground/60">Members</p>
              </div>
              <p className="text-2xl text-primary-foreground mb-1">247</p>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-chart-5" />
                <span className="text-chart-5">+12%</span>
              </div>
            </div>

            <div className="bg-primary-foreground/10 rounded-xl p-3.5 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="size-4 text-primary-foreground/70" />
                <p className="text-xs text-primary-foreground/60">Active Now</p>
              </div>
              <p className="text-2xl text-primary-foreground mb-1">89</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-primary-foreground/50">36% online</span>
              </div>
            </div>

            <div className="bg-primary-foreground/10 rounded-xl p-3.5 border border-primary-foreground/10">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-4 text-primary-foreground/70" />
                <p className="text-xs text-primary-foreground/60">Messages</p>
              </div>
              <p className="text-2xl text-primary-foreground mb-1">1.2k</p>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-primary-foreground/50">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation with enhanced design */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-1 px-3 py-2.5 min-w-max">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="size-4" />
                  <span className="text-[13px]">{tab.label}</span>
                  {tab.badge && activeTab !== tab.id && (
                    <Badge className="bg-destructive text-destructive-foreground text-xs h-5 min-w-5 px-1">{tab.badge}</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 pb-24">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Collapsible AI Prompt Bar */}
            <div 
              className={`bg-card border-2 border-primary rounded-xl overflow-hidden transition-all duration-300 ${ 
                isAIPromptExpanded ? 'ring-1 ring-primary/20' : ''
              }`}
            >
              {/* Collapsed View */}
              {!isAIPromptExpanded && (
                <button
                  onClick={() => setIsAIPromptExpanded(true)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-primary/5 transition-smooth active:scale-[0.99]"
                >
                  <LeapyIcon className="size-8 flex-shrink-0" />
                  <div className="flex-1 text-left">
                    <p className="text-sm text-foreground">Ask Leapy AI anything...</p>
                    <p className="text-xs text-muted-foreground">Tap to get insights, generate content, or manage your community</p>
                  </div>
                  <Sparkles className="size-5 text-primary flex-shrink-0 animate-pulse" />
                </button>
              )}

              {/* Expanded View */}
              {isAIPromptExpanded && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <LeapyIcon className="size-8" />
                      <div>
                        <h3 className="text-sm text-foreground">Leapy AI</h3>
                        <p className="text-xs text-muted-foreground">Your AI assistant</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsAIPromptExpanded(false)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors active:scale-95"
                    >
                      <ChevronRight className="size-4 text-muted-foreground rotate-90" />
                    </button>
                  </div>

                  {/* AI Actions Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button 
                      onClick={() => {
                        onOpenAI();
                        setIsAIPromptExpanded(false);
                      }}
                      className="bg-muted hover:bg-primary/5 border border-border rounded-lg p-3 text-left transition-smooth active:scale-95"
                    >
                      <BarChart3 className="size-5 mb-2 text-primary" />
                      <p className="text-xs text-foreground">Get Insights</p>
                    </button>
                    <button 
                      onClick={() => {
                        onOpenAI();
                        setIsAIPromptExpanded(false);
                      }}
                      className="bg-muted hover:bg-primary/5 border border-border rounded-lg p-3 text-left transition-smooth active:scale-95"
                    >
                      <Sparkles className="size-5 mb-2 text-primary" />
                      <p className="text-xs text-foreground">Generate</p>
                    </button>
                    <button 
                      onClick={() => {
                        onOpenAI();
                        setIsAIPromptExpanded(false);
                      }}
                      className="bg-muted hover:bg-primary/5 border border-border rounded-lg p-3 text-left transition-smooth active:scale-95"
                    >
                      <BookOpen className="size-5 mb-2 text-primary" />
                      <p className="text-xs text-foreground">Create Course</p>
                    </button>
                    <button 
                      onClick={() => {
                        onOpenAI();
                        setIsAIPromptExpanded(false);
                      }}
                      className="bg-muted hover:bg-primary/5 border border-border rounded-lg p-3 text-left transition-smooth active:scale-95"
                    >
                      <Calendar className="size-5 mb-2 text-primary" />
                      <p className="text-xs text-foreground">Plan Event</p>
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      onOpenAI();
                      setIsAIPromptExpanded(false);
                    }}
                    className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageCircle className="size-4" />
                    Open Full AI Chat
                  </button>
                </div>
              )}
            </div>

            {/* Quick CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={onOpenAI}
                className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-smooth"
              >
                <Plus className="size-4 mr-2" />
                New Post
              </Button>
              <Button 
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 active:scale-95 transition-smooth"
              >
                <UserPlus className="size-4 mr-2" />
                Invite
              </Button>
            </div>

            {/* Key Metrics */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm text-foreground">Community Stats</h3>
                </div>
                <button className="text-xs text-primary">View all</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Users className="size-5 text-primary" />
                  <TrendingUp className="size-4 text-chart-1" />
                </div>
                <p className="text-2xl text-card-foreground mb-1">247</p>
                <p className="text-xs text-muted-foreground mb-1">Total Members</p>
                <p className="text-xs text-chart-1">+12% this week</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="size-5 text-primary" />
                  <div className="size-2 bg-primary rounded-full animate-pulse" />
                </div>
                <p className="text-2xl text-card-foreground mb-1">89</p>
                <p className="text-xs text-muted-foreground mb-1">Active Now</p>
                <p className="text-xs text-muted-foreground">36% online</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <MessageSquare className="size-5 text-primary" />
                  <Badge className="bg-primary/10 text-primary text-xs">+5</Badge>
                </div>
                <p className="text-2xl text-card-foreground mb-1">1.2k</p>
                <p className="text-xs text-muted-foreground mb-1">Messages</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-4 active:scale-[0.98] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="size-5 text-primary" />
                  <span className="text-xs text-chart-1">+8%</span>
                </div>
                <p className="text-2xl text-card-foreground mb-1">68%</p>
                <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                <p className="text-xs text-muted-foreground">Above avg</p>
              </div>
            </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Activity className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm text-foreground">Recent Activity</h3>
                </div>
                <button className="text-xs text-primary">View all</button>
              </div>
              <div className="space-y-3">
                {recentActivity.slice(0, 4).map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="size-8 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="size-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Events Preview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm text-foreground">Upcoming Events</h3>
                </div>
                <button onClick={() => setActiveTab('events')} className="text-xs text-primary">View all</button>
              </div>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-foreground truncate">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">{event.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs border-primary text-primary">
                      {event.attendees}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Courses Preview */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="size-4 text-primary" />
                  </div>
                  <h3 className="text-sm text-foreground">Active Courses</h3>
                </div>
                <button onClick={() => setActiveTab('courses')} className="text-xs text-primary">View all</button>
              </div>
              <div className="space-y-2">
                {activeCourses.slice(0, 2).map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-foreground truncate">{course.title}</h4>
                      <p className="text-xs text-muted-foreground">{course.students} students • {course.progress}% done</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab('members')}
                className="bg-card border border-border rounded-2xl p-4 text-left hover:border-primary transition-all active:scale-95"
              >
                <Users className="size-6 text-primary mb-2" />
                <p className="text-sm text-foreground">Members</p>
                <p className="text-xs text-muted-foreground">247 total</p>
              </button>

              <button 
                onClick={() => setActiveTab('messages')}
                className="bg-card border border-border rounded-2xl p-4 text-left hover:border-primary transition-all active:scale-95"
              >
                <MessageSquare className="size-6 text-primary mb-2" />
                <p className="text-sm text-foreground">Messages</p>
                <p className="text-xs text-muted-foreground">1.2k today</p>
              </button>
            </div>
          </div>
        )}

        {/* Build Tab */}
        {activeTab === 'build' && (
          <div className="space-y-4">
            {/* Draft/Published State Banner */}
            {!isPublished ? (
              <div className="bg-secondary border border-border rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="size-10 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="size-5 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm text-foreground mb-1">Community in Draft Mode</h3>
                    <p className="text-xs text-secondary-foreground mb-3">
                      Your community is being built with AI. Preview and refine everything before publishing. Once published, you can invite members, host events, and sell courses.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setIsPublished(true)}
                        size="sm" 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Publish Community
                      </Button>
                      <Button 
                        onClick={onOpenAI}
                        size="sm" 
                        variant="outline"
                      >
                        <Sparkles className="size-4 mr-2" />
                        Continue Building
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm text-foreground mb-1">Community is Live! 🎉</h3>
                    <p className="text-xs text-secondary-foreground mb-2">
                      Your community is published and ready for members.
                    </p>
                    <button className="text-xs text-primary">View Public Page →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Community Preview Card - Marketplace Style */}
            <div className="bg-card rounded-2xl overflow-hidden border border-border">
              {/* Header Image */}
              <div className="relative h-40 bg-primary flex items-center justify-center overflow-hidden">
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
                  }} />
                </div>
                
                {/* Community Name Overlay */}
                <div className="relative z-10 text-center px-6">
                  <h2 className="text-primary-foreground text-xl mb-1">
                    {communityData.title || 'My Community'}
                  </h2>
                  <p className="text-primary-foreground/90 text-xs">
                    {communityData.description?.split('.')[0] || 'Community description'}.
                  </p>
                </div>

                {/* Edit Header Button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={onOpenAI}
                    className="p-2 bg-primary-foreground/15 hover:bg-primary-foreground/25 rounded-lg transition-all"
                  >
                    <Edit3 className="size-3.5 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* Community Info Section */}
              <div className="p-4 bg-card">
                <div className="mb-4">
                  <h3 className="text-sm text-foreground mb-1">
                    Welcome to {communityData.title || 'My Community'}!
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {communityData.description || 'Community description'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 py-3 border-t border-border">
                  <div className="text-center flex-1">
                    <div className="text-lg text-card-foreground">
                      {isPublished ? '247' : '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">Members</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg text-card-foreground">
                      {communityData.spaces?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Channels</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-lg text-card-foreground">
                      {isPublished ? '12' : '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">Events</div>
                  </div>
                </div>

                {/* Preview Badge & Action */}
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-2 bg-muted text-muted-foreground text-center rounded-lg text-xs">
                      {isPublished ? 'Live on Marketplace' : 'Preview - Not Published'}
                    </div>
                    <button
                      onClick={onOpenAI}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Edit3 className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Customization Tip */}
            <div className="bg-muted border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Eye className="size-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm text-foreground mb-1">Marketplace Preview</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    This is how your community will appear to potential members in the marketplace.
                  </p>
                  <button 
                    onClick={onOpenAI}
                    className="text-xs text-primary flex items-center gap-1"
                  >
                    <Sparkles className="size-3" />
                    Customize with AI
                  </button>
                </div>
              </div>
            </div>

            {/* AI Co-Pilot Card - Always Visible */}
            <div className="bg-card border-2 border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <LeapyIcon className="size-10" />
                <div className="flex-1">
                  <h3 className="text-sm mb-0.5 text-foreground">Leapy AI Co-Pilot</h3>
                  <p className="text-xs text-muted-foreground">Your AI assistant for community building</p>
                </div>
                <Badge className="bg-primary/10 text-primary text-xs border-primary/20">Online</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button 
                  onClick={onOpenAI}
                  className="bg-muted hover:bg-accent border border-border rounded-lg p-3 text-left transition-all active:scale-95"
                >
                  <Sparkles className="size-4 mb-2 text-secondary-foreground" />
                  <p className="text-xs text-foreground">Generate Content</p>
                </button>
                <button 
                  onClick={onOpenAI}
                  className="bg-muted hover:bg-accent border border-border rounded-lg p-3 text-left transition-all active:scale-95"
                >
                  <BarChart3 className="size-4 mb-2 text-secondary-foreground" />
                  <p className="text-xs text-foreground">Get Insights</p>
                </button>
                <button 
                  onClick={onOpenAI}
                  className="bg-muted hover:bg-accent border border-border rounded-lg p-3 text-left transition-all active:scale-95"
                >
                  <BookOpen className="size-4 mb-2 text-secondary-foreground" />
                  <p className="text-xs text-foreground">Create Course</p>
                </button>
                <button 
                  onClick={onOpenAI}
                  className="bg-muted hover:bg-accent border border-border rounded-lg p-3 text-left transition-all active:scale-95"
                >
                  <Users className="size-4 mb-2 text-secondary-foreground" />
                  <p className="text-xs text-foreground">Grow Members</p>
                </button>
              </div>

              <button 
                onClick={onOpenAI}
                className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="size-4" />
                Open AI Hub
              </button>
            </div>

            {/* Creator Quick Actions */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm text-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <Hash className="size-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground">Add Channel</p>
                    <p className="text-xs text-muted-foreground">Create spaces</p>
                  </div>
                </button>
                
                <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <UserPlus className="size-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground">Invite Members</p>
                    <p className="text-xs text-muted-foreground">Share link</p>
                  </div>
                </button>

                <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <BookOpen className="size-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground">New Course</p>
                    <p className="text-xs text-muted-foreground">With AI</p>
                  </div>
                </button>

                <button className="flex items-center gap-2 p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left">
                  <Calendar className="size-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground">Host Event</p>
                    <p className="text-xs text-muted-foreground">Schedule</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Setup Checklist */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm text-foreground mb-3 flex items-center gap-2">
                <Target className="size-4 text-primary" />
                Setup Progress
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="size-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Basic Information</p>
                    <p className="text-xs text-muted-foreground">Name, description, and settings configured</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="size-3.5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Channels Created</p>
                    <p className="text-xs text-muted-foreground">{communityData.spaces?.length || 0} spaces ready for discussions</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="size-2 bg-muted-foreground rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Welcome Message</p>
                    <p className="text-xs text-muted-foreground">Create first post or announcement</p>
                    <button 
                      onClick={onOpenAI}
                      className="text-xs text-primary mt-1"
                    >
                      Generate with AI →
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="size-5 bg-muted rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="size-2 bg-muted-foreground rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">Community Rules</p>
                    <p className="text-xs text-muted-foreground">Set guidelines and moderation policies</p>
                    <button 
                      onClick={onOpenAI}
                      className="text-xs text-primary mt-1"
                    >
                      Generate with AI →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Channels Management */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-foreground">Channels ({communityData.spaces?.length || 0})</h3>
                <button 
                  onClick={onOpenAI}
                  className="text-xs text-primary flex items-center gap-1"
                >
                  <Plus className="size-3" />
                  Add with AI
                </button>
              </div>
              <div className="space-y-2">
                {communityData.spaces?.map(space => (
                  <div
                    key={space.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:border-primary transition-all"
                  >
                    <div className="size-10 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-foreground truncate">#{space.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{space.description || 'No description'}</p>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <Edit3 className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Monetization Preview */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="size-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm text-foreground mb-1">Ready to Monetize?</h3>
                  <p className="text-xs text-secondary-foreground mb-3">
                    Create and sell courses, host paid events, or offer premium memberships.
                  </p>
                  <button 
                    onClick={onOpenAI}
                    className="text-xs text-primary flex items-center gap-1"
                  >
                    Set up monetization
                    <ArrowUpRight className="size-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="flex gap-2">
              <Button 
                onClick={onOpenAI}
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="size-4 mr-2" />
                Ask AI
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="size-4 mr-2" />
                New Post
              </Button>
              <Button size="sm" variant="outline">
                <Filter className="size-4" />
              </Button>
            </div>

            {/* Channels */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-foreground">Channels</h3>
                <button className="text-xs text-primary">View all</button>
              </div>
              <div className="space-y-2">
                {communityData.spaces?.slice(0, 6).map(space => (
                  <button
                    key={space.id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors text-left"
                  >
                    <div className="size-10 bg-primary/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm text-foreground truncate">#{space.name}</h4>
                        <Badge className="bg-destructive/10 text-destructive text-xs">3</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{space.description || 'Channel description'}</p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="space-y-3">
              <h3 className="text-sm text-foreground">Recent Messages</h3>
              {mockMessages.map((msg) => (
                <div key={msg.id} className="bg-card border border-border rounded-xl p-4 hover:border-border transition-colors">
                  {msg.isPinned && (
                    <div className="flex items-center gap-1 text-xs text-primary mb-2">
                      <Star className="size-3 fill-primary" />
                      Pinned
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <Avatar className="size-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {msg.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm text-foreground">{msg.author}</h4>
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                        {msg.unread && (
                          <div className="size-2 bg-destructive rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-secondary-foreground mb-3">{msg.message}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                          <Heart className="size-4" />
                          <span>{msg.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                          <MessageCircleMore className="size-4" />
                          <span>{msg.replies}</span>
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Share2 className="size-4" />
                        </button>
                        <button className="ml-auto text-xs text-muted-foreground hover:text-primary transition-colors">
                          <Bookmark className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-2xl text-card-foreground">247</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-2xl text-primary">89</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-2xl text-card-foreground">12</p>
                <p className="text-xs text-muted-foreground">New</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <UserPlus className="size-4 mr-2" />
                Invite
              </Button>
              <Button size="sm" variant="outline">
                <Filter className="size-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* Top Contributors */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm text-foreground mb-3 flex items-center gap-2">
                <Award className="size-4 text-primary" />
                Top Contributors
              </h3>
              <div className="space-y-3">
                {mockMembers.slice(0, 3).map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1 size-5 bg-chart-4 rounded-full border-2 border-card flex items-center justify-center">
                          <Crown className="size-3 text-chart-4-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-foreground">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.contributions} contributions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-primary">{member.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Members */}
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm text-foreground mb-3">All Members</h3>
              <div className="space-y-3">
                {mockMembers.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-10">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                        member.status === 'online' ? 'bg-primary' : 
                        member.status === 'away' ? 'bg-chart-4' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-foreground">{member.name}</h4>
                      <p className="text-xs text-muted-foreground">{member.role} • Level {member.level}</p>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                      <MessageCircle className="size-4 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={onOpenAI}
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="size-4 mr-2" />
                Create with AI
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="size-4 mr-2" />
                New Course
              </Button>
            </div>

            {/* Active Courses */}
            <div className="space-y-3">
              <h3 className="text-sm text-foreground">Active Courses</h3>
              {activeCourses.map((course) => (
                <div key={course.id} className="bg-card border border-border rounded-xl p-4 hover:border-border transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm text-foreground mb-1">{course.title}</h4>
                      <p className="text-xs text-muted-foreground">by {course.instructor}</p>
                    </div>
                    <Badge className="bg-primary/10 text-primary text-xs">
                      {course.students} students
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-foreground">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      <span>{course.nextLesson}</span>
                    </div>
                    <button className="text-xs text-primary flex items-center gap-1">
                      View Course
                      <ArrowUpRight className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                onClick={onOpenAI}
                size="sm" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Sparkles className="size-4 mr-2" />
                Plan with AI
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="size-4 mr-2" />
                New Event
              </Button>
            </div>

            {/* Upcoming Events */}
            <div className="space-y-3">
              <h3 className="text-sm text-foreground">Upcoming Events</h3>
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-xl p-4 hover:border-border transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="size-12 bg-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm text-foreground mb-1">{event.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="size-3" />
                            {event.date}
                          </p>
                        </div>
                        <Badge className="bg-accent text-accent-foreground text-xs">{event.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{event.attendees} attending</p>
                        <button className="text-xs text-primary">Join</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calendar View Placeholder */}
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Calendar className="size-12 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-sm text-foreground mb-1">Calendar View</h4>
              <p className="text-xs text-muted-foreground">Full calendar coming soon</p>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Globe className="size-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm text-foreground">Community Info</p>
                    <p className="text-xs text-muted-foreground">Name, description, visibility</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
              
              <div className="border-t border-border" />
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm text-foreground">Moderation</p>
                    <p className="text-xs text-muted-foreground">Rules, auto-mod, filters</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
              
              <div className="border-t border-border" />
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Users className="size-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm text-foreground">Member Permissions</p>
                    <p className="text-xs text-muted-foreground">Roles, capabilities, access</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
              
              <div className="border-t border-border" />
              
              <button className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <Bell className="size-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-sm text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Alerts, emails, push</p>
                  </div>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-card border border-destructive/20 rounded-xl p-4">
              <h3 className="text-sm text-destructive mb-3 flex items-center gap-2">
                <AlertCircle className="size-4" />
                Danger Zone
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
                  Archive Community
                </button>
                <button className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-destructive/5 rounded-lg transition-colors">
                  Delete Community
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}