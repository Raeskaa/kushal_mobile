import { useState } from 'react';
import { MobileHorizontalTabs } from './MobileHorizontalTabs';
import { MobileFilterChips } from './MobileFilterChips';
import { MobileSegmentedControl } from './MobileSegmentedControl';
import { MobileBuilderTabs } from './MobileBuilderTabs';
import { MobileTopBar } from './MobileTopBar';
import { NeedsAttentionCarousel } from './NeedsAttentionCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Calendar, BookOpen, TrendingUp, Clock, AlertCircle, Zap, Activity, Plus, MessageSquare, Video, Bookmark, FileText } from 'lucide-react';

interface MobileCommunitiesLandingProps {
  onCommunityClick: (communityId: string) => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLeapspaceClick?: () => void;
  currentLeapspace?: string; // New prop to determine chip context
}

export function MobileCommunitiesLanding({ 
  onCommunityClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onLeapspaceClick,
  currentLeapspace = 'trueleap',
}: MobileCommunitiesLandingProps) {
  // Determine leapspace context for filter chips
  const mockLeapspaces = [
    { id: 'trueleap', name: 'Trueleap', role: 'creator' },
    { id: 'design-academy', name: 'Design Academy', role: 'creator' },
    { id: 'marketing-hub', name: 'Marketing Hub', role: 'member' },
    { id: 'dev-community', name: 'Dev Community', role: 'member' },
    { id: 'product-school', name: 'Product School', role: 'creator' },
  ];

  const getLeapspaceContext = (): 'all' | 'creator' | 'member' => {
    if (currentLeapspace === 'all') return 'all';
    const leapspace = mockLeapspaces.find(ls => ls.id === currentLeapspace);
    return leapspace?.role === 'creator' ? 'creator' : 'member';
  };

  const leapspaceContext = getLeapspaceContext();

  // L2: Main tabs
  const [activeL2Tab, setActiveL2Tab] = useState('needs-attention');
  
  // L3: Communities filter
  const [activeCommunityFilter, setActiveCommunityFilter] = useState('all');
  
  // Needs Attention: Selected card
  const [selectedNeedsCard, setSelectedNeedsCard] = useState('threads');

  const l2Tabs = [
    { id: 'needs-attention', label: 'Needs Attention' },
    { id: 'communities', label: 'Communities' },
    { id: 'my-communities', label: 'My Communities' },
  ];

  const communityFilters = [
    { id: 'all', label: 'All' },
    { id: 'my', label: 'My Communities' },
    { id: 'member', label: 'Member Of' },
    { id: 'moderator', label: 'Moderator Of' },
    { id: 'admin', label: 'Admin' },
    { id: 'drafts', label: 'Drafts' },
  ];

  // Needs Attention Cards (Slack-style)
  const needsCards = [
    { id: 'threads', label: 'Threads', icon: MessageSquare, count: 12, status: 'new' },
    { id: 'meetings', label: 'Meetings', icon: Video, count: 3, status: 'pending' },
    { id: 'courses', label: 'Courses', icon: BookOpen, count: 5, status: 'review' },
    { id: 'events', label: 'Events', icon: Calendar, count: 2, status: 'upcoming' },
    { id: 'saved', label: 'Saved', icon: Bookmark, count: 8, status: 'items' },
    { id: 'drafts', label: 'Drafts', icon: FileText, count: 4, status: 'items' },
  ];

  // Mock community data
  const communities = [
    { id: '1', name: 'Design Innovators', members: 247, role: 'Admin', avatar: 'DI', unread: 12 },
    { id: '2', name: 'Product Leaders', members: 532, role: 'Moderator', avatar: 'PL', unread: 5 },
    { id: '3', name: 'UX Research Hub', members: 189, role: 'Member', avatar: 'UX', unread: 0 },
    { id: '4', name: 'Startup Founders', members: 421, role: 'Member', avatar: 'SF', unread: 23 },
    { id: '5', name: 'AI Enthusiasts', members: 678, role: 'Admin', avatar: 'AI', unread: 7 },
  ];

  const filteredCommunities = communities.filter(c => {
    if (activeCommunityFilter === 'all') return true;
    if (activeCommunityFilter === 'my') return c.role === 'Admin';
    if (activeCommunityFilter === 'admin') return c.role === 'Admin';
    if (activeCommunityFilter === 'moderator') return c.role === 'Moderator';
    if (activeCommunityFilter === 'member') return c.role === 'Member';
    return true;
  });

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navigation Bar */}
      <MobileTopBar
        title="Communities"
        onSearchClick={onSearchClick}
        onNotificationClick={onNotificationClick}
        onProfileClick={onProfileClick}
        onLeapspaceClick={onLeapspaceClick}
      />

      {/* L2: Horizontal Tabs */}
      <div className="bg-card border-b border-border">
        <div className="flex overflow-x-auto no-scrollbar px-5">
          {l2Tabs.map((tab) => {
            const isActive = activeL2Tab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveL2Tab(tab.id)}
                className={`flex-shrink-0 px-4 py-3.5 border-b-2 transition-smooth active:scale-95 ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground'
                }`}
              >
                <span className="whitespace-nowrap text-[13px]">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Communities Tab Content */}
      {activeL2Tab === 'communities' && (
        <div className="pb-20">
          {/* L3: Filter Chips */}
          <div className="bg-card border-b border-border px-5 py-3.5">
            <MobileFilterChips
              filters={communityFilters}
              activeFilter={activeCommunityFilter}
              onFilterChange={setActiveCommunityFilter}
              leapspaceContext={leapspaceContext}
            />
          </div>

          {/* Community List */}
          <div className="px-5 py-5 space-y-3">
            {filteredCommunities.map((community) => (
              <button
                key={community.id}
                onClick={() => onCommunityClick(community.id)}
                className="w-full bg-card rounded-2xl border border-border p-5 active:scale-[0.98] transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="size-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-muted-foreground text-[15px]">{community.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] text-card-foreground line-clamp-1">{community.name}</h3>
                      {community.unread > 0 && (
                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full flex-shrink-0">
                          {community.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        <span>{community.members.toLocaleString()}</span>
                      </div>
                      <span className="text-border">·</span>
                      <span className="text-primary">{community.role}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {/* Create New Community */}
            <button className="w-full bg-card rounded-2xl border-2 border-dashed border-border p-6 active:scale-[0.98] transition-all">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Plus className="size-5" />
                <span className="text-[13px]">Create New Community</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* My Communities Tab */}
      {activeL2Tab === 'my-communities' && (
        <div className="px-5 py-5 space-y-3 pb-24">
          {filteredCommunities.map((community) => (
            <button
              key={community.id}
              onClick={() => onCommunityClick(community.id)}
              className="w-full bg-card rounded-2xl border border-border p-5 active:scale-[0.98] transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="size-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-muted-foreground text-[15px]">{community.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] text-card-foreground line-clamp-1">{community.name}</h3>
                    {community.unread > 0 && (
                      <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full flex-shrink-0">
                        {community.unread}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      <span>{community.members.toLocaleString()}</span>
                    </div>
                    <span className="text-border">·</span>
                    <span className="text-primary">{community.role}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {/* Create New Community */}
          <button className="w-full bg-card rounded-2xl border-2 border-dashed border-border p-6 active:scale-[0.98] transition-all">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Plus className="size-5" />
              <span className="text-[13px]">Create New Community</span>
            </div>
          </button>
        </div>
      )}

      {/* Needs Attention Tab Content */}
      {activeL2Tab === 'needs-attention' && (
        <div className="pb-24">
          {/* Spotlight Carousel */}
          <div className="bg-card border-b border-border">
            <NeedsAttentionCarousel
              cards={needsCards}
              selectedId={selectedNeedsCard}
              onSelect={setSelectedNeedsCard}
            />
          </div>

          {/* Content Area with Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNeedsCard}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="p-5 space-y-3"
            >
            {/* Threads */}
            {selectedNeedsCard === 'threads' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Unread Threads (12)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        user: 'Sarah Chen', 
                        message: '@you mentioned in Design Review discussion', 
                        community: 'Design Innovators',
                        time: '10 min ago',
                        replies: 5
                      },
                      { 
                        user: 'Michael Rodriguez', 
                        message: 'Replied to your comment on Product Roadmap', 
                        community: 'Product Leaders',
                        time: '1 hour ago',
                        replies: 12
                      },
                      { 
                        user: 'Emily Watson', 
                        message: 'Started a new thread in UX Research', 
                        community: 'UX Research Hub',
                        time: '2 hours ago',
                        replies: 3
                      },
                    ].map((thread, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl active:bg-muted transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{thread.user}</p>
                            <p className="text-[13px] text-muted-foreground mt-1">{thread.message}</p>
                          </div>
                          <span className="text-xs text-muted-foreground ml-2">{thread.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="text-primary">{thread.community}</span>
                          <span>·</span>
                          <MessageSquare className="size-3" />
                          <span>{thread.replies} replies</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Meetings */}
            {selectedNeedsCard === 'meetings' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Pending Meetings (3)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        title: 'Design Review Meeting', 
                        status: 'Needs confirmation', 
                        time: 'Tomorrow, 10:00 AM',
                        community: 'Design Innovators',
                        attendees: 8
                      },
                      { 
                        title: 'Weekly Standup', 
                        status: 'Needs agenda', 
                        time: 'Jan 5, 9:30 AM',
                        community: 'Product Leaders',
                        attendees: 12
                      },
                      { 
                        title: '1-on-1 with Sarah', 
                        status: 'Awaiting response', 
                        time: 'Jan 6, 2:00 PM',
                        community: 'UX Research Hub',
                        attendees: 2
                      },
                    ].map((meeting, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl active:bg-muted transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{meeting.title}</p>
                            <p className="text-[13px] text-muted-foreground mt-1">{meeting.status}</p>
                          </div>
                          <Video className="size-4 text-muted-foreground/50" />
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-muted-foreground mt-2">
                          <Clock className="size-3" />
                          <span>{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-1.5">
                          <span className="text-primary">{meeting.community}</span>
                          <span className="text-border">·</span>
                          <span className="text-muted-foreground">{meeting.attendees} attendees</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Courses */}
            {selectedNeedsCard === 'courses' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Pending Reviews (5)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        title: 'Module 3: Advanced Design Patterns', 
                        type: 'Student Assignment', 
                        student: 'Alex Johnson',
                        community: 'Design Innovators',
                        submitted: '2 hours ago'
                      },
                      { 
                        title: 'Product Strategy Lesson 5', 
                        type: 'Draft Lesson Review', 
                        student: 'Content Team',
                        community: 'Product Leaders',
                        submitted: '1 day ago'
                      },
                      { 
                        title: 'UX Fundamentals Quiz', 
                        type: 'Quiz Answers', 
                        student: 'Maria Garcia',
                        community: 'UX Research Hub',
                        submitted: '3 hours ago'
                      },
                    ].map((course, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl active:bg-muted transition-all">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{course.title}</p>
                            <p className="text-[13px] text-muted-foreground mt-1">{course.type}</p>
                          </div>
                          <BookOpen className="size-4 text-muted-foreground/50" />
                        </div>
                        <div className="flex items-center gap-3 text-[13px] text-muted-foreground mt-2">
                          <span>by {course.student}</span>
                          <span>·</span>
                          <span>{course.submitted}</span>
                        </div>
                        <div className="text-xs mt-1.5 text-primary">{course.community}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Events */}
            {selectedNeedsCard === 'events' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Upcoming Events (2)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        title: 'UX Workshop: Design Thinking', 
                        date: 'Jan 5, 2026', 
                        time: '2:00 PM - 4:00 PM',
                        community: 'UX Research Hub',
                        registered: 45,
                        capacity: 50
                      },
                      { 
                        title: 'Product Launch Webinar', 
                        date: 'Jan 8, 2026', 
                        time: '11:00 AM - 12:00 PM',
                        community: 'Product Leaders',
                        registered: 89,
                        capacity: 100
                      },
                    ].map((event, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{event.title}</p>
                            <div className="flex items-center gap-2 mt-2 text-[13px] text-muted-foreground">
                              <Calendar className="size-3" />
                              <span>{event.date}</span>
                              <span>·</span>
                              <Clock className="size-3" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-xs">
                          <span className="text-primary">{event.community}</span>
                          <span className="text-muted-foreground">{event.registered}/{event.capacity} registered</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Saved */}
            {selectedNeedsCard === 'saved' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Saved Items (8)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        title: 'Design System Best Practices', 
                        type: 'Post', 
                        author: 'Sarah Chen',
                        community: 'Design Innovators',
                        saved: '2 days ago'
                      },
                      { 
                        title: 'Product Roadmap Template', 
                        type: 'Resource', 
                        author: 'Michael Rodriguez',
                        community: 'Product Leaders',
                        saved: '1 week ago'
                      },
                      { 
                        title: 'User Research Checklist', 
                        type: 'Document', 
                        author: 'Emily Watson',
                        community: 'UX Research Hub',
                        saved: '3 days ago'
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{item.title}</p>
                            <p className="text-[13px] text-muted-foreground mt-1">by {item.author}</p>
                          </div>
                          <Bookmark className="size-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-2">
                          <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded">{item.type}</span>
                          <span className="text-primary">{item.community}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1.5">Saved {item.saved}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Drafts */}
            {selectedNeedsCard === 'drafts' && (
              <>
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h3 className="text-[15px] text-card-foreground mb-4">Draft Items (4)</h3>
                  <div className="space-y-3">
                    {[
                      { 
                        title: 'Untitled Post', 
                        type: 'Post Draft', 
                        community: 'Design Innovators',
                        lastEdited: '1 hour ago',
                        completion: 45
                      },
                      { 
                        title: 'New Course: Advanced Product Strategy', 
                        type: 'Course Draft', 
                        community: 'Product Leaders',
                        lastEdited: '2 days ago',
                        completion: 78
                      },
                      { 
                        title: 'Community Event Proposal', 
                        type: 'Event Draft', 
                        community: 'UX Research Hub',
                        lastEdited: '5 hours ago',
                        completion: 62
                      },
                    ].map((draft, idx) => (
                      <div key={idx} className="p-4 border border-border rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-[14px] text-card-foreground">{draft.title}</p>
                            <p className="text-[13px] text-muted-foreground mt-1">{draft.type}</p>
                          </div>
                          <FileText className="size-4 text-muted-foreground/50" />
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span>Completion</span>
                            <span>{draft.completion}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all" 
                              style={{ width: `${draft.completion}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs mt-2">
                          <span className="text-primary">{draft.community}</span>
                          <span className="text-border">·</span>
                          <span className="text-muted-foreground">Edited {draft.lastEdited}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}