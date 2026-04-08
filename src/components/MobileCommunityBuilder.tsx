import { useState } from 'react';
import { MobileBuilderTabs } from './MobileBuilderTabs';
import { MobileFilterChips } from './MobileFilterChips';
import { MobileSegmentedControl } from './MobileSegmentedControl';
import { Calendar, Users, BookOpen, Plus, BarChart3, Settings, MessageSquare } from 'lucide-react';

interface MobileCommunityBuilderProps {
  activeTab: string;
}

export function MobileCommunityBuilder({ activeTab }: MobileCommunityBuilderProps) {
  // Level 3: Builder Tabs (only shown in specific L2 tabs)
  const [activeBuilderTab, setActiveBuilderTab] = useState('design');
  
  // Level 4a: Filter Chips (for Content tab)
  const [activeContentFilter, setActiveContentFilter] = useState('all');
  
  // Level 4b: Segmented Control (for Design tab)
  const [activeDesignSegment, setActiveDesignSegment] = useState('branding');
  
  // Level 4c: Filter Chips (for Monetization tab)
  const [activeMonetizationFilter, setActiveMonetizationFilter] = useState('all');

  // L3: Builder-focused tabs - tools for BUILDING the community
  const builderTabs = [
    { id: 'design', label: 'Design' },
    { id: 'content', label: 'Content' },
    { id: 'settings', label: 'Settings' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'monetization', label: 'Monetization' },
    { id: 'integrations', label: 'Integrations' },
  ];

  // L4a: Content filters
  const contentFilters = [
    { id: 'all', label: 'All' },
    { id: 'posts', label: 'Posts' },
    { id: 'channels', label: 'Channels' },
    { id: 'files', label: 'Files' },
  ];

  // L4b: Design segments
  const designSegments = [
    { id: 'branding', label: 'Branding' },
    { id: 'theme', label: 'Theme' },
    { id: 'layout', label: 'Layout' },
  ];
  
  // L4c: Monetization filters
  const monetizationFilters = [
    { id: 'all', label: 'All Plans' },
    { id: 'free', label: 'Free' },
    { id: 'paid', label: 'Paid' },
    { id: 'subscription', label: 'Subscription' },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* Level 3: Builder Tabs - Only show when in Overview tab */}
      {activeTab === 'overview' && (
        <MobileBuilderTabs
          tabs={builderTabs}
          activeTab={activeBuilderTab}
          onTabChange={setActiveBuilderTab}
        />
      )}

      {/* Content Area */}
      <div className="p-4 pb-20 space-y-6">
        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Design Tab with Segmented Control */}
            {activeBuilderTab === 'design' && (
              <div className="space-y-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <h2 className="text-base text-foreground mb-3">Community Design</h2>
                  
                  {/* Level 4b: Segmented Control */}
                  <MobileSegmentedControl
                    segments={designSegments}
                    activeSegment={activeDesignSegment}
                    onSegmentChange={setActiveDesignSegment}
                  />
                </div>

                {/* Design Content */}
                <div className="bg-card rounded-xl border border-border p-5">
                  {activeDesignSegment === 'branding' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Community Name</label>
                        <input 
                          type="text" 
                          defaultValue="Design Innovators"
                          className="w-full px-3 py-2 border border-border rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Logo</label>
                        <div className="size-20 bg-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground text-2xl">DI</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-2 block">Primary Color</label>
                        <div className="flex gap-2">
                          <div className="size-10 bg-primary rounded-lg border-2 border-foreground"></div>
                          <div className="size-10 bg-chart-1 rounded-lg"></div>
                          <div className="size-10 bg-chart-2 rounded-lg"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeDesignSegment === 'theme' && (
                    <div>
                      <h3 className="text-sm text-foreground mb-3">Theme Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-secondary-foreground">Dark Mode</span>
                          <div className="w-10 h-6 bg-muted-foreground/30 rounded-full"></div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm text-secondary-foreground">Compact View</span>
                          <div className="w-10 h-6 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 size-4 bg-primary-foreground rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeDesignSegment === 'layout' && (
                    <div>
                      <h3 className="text-sm text-foreground mb-3">Layout Options</h3>
                      <div className="space-y-2">
                        {['Card View', 'List View', 'Grid View'].map((layout, idx) => (
                          <div key={idx} className="p-3 border border-border rounded-lg flex items-center gap-3">
                            <div className={`size-4 rounded-full border-2 ${idx === 0 ? 'border-primary bg-primary' : 'border-muted-foreground/30'}`}></div>
                            <span className="text-sm text-secondary-foreground">{layout}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Content Tab with Filter Chips */}
            {activeBuilderTab === 'content' && (
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm text-foreground">Content Management</h2>
                    <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                      <Plus className="size-4" />
                      Create
                    </button>
                  </div>

                  {/* Level 4a: Filter Chips */}
                  <MobileFilterChips
                    filters={contentFilters}
                    activeFilter={activeContentFilter}
                    onFilterChange={setActiveContentFilter}
                  />
                </div>

                {/* Content List */}
                <div className="space-y-2">
                  {activeContentFilter === 'all' && (
                    <>
                      <div className="bg-card rounded-lg border border-border p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="size-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm text-foreground">Welcome Post</h3>
                            <p className="text-xs text-muted-foreground">Posted 2 days ago • 45 reactions</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-card rounded-lg border border-border p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="size-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm text-foreground">#general</h3>
                            <p className="text-xs text-muted-foreground">Channel • 127 messages</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {activeContentFilter === 'posts' && (
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="size-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm text-foreground">Welcome Post</h3>
                          <p className="text-xs text-muted-foreground">Posted 2 days ago • 45 reactions</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeContentFilter === 'channels' && (
                    <>
                      <div className="bg-card rounded-lg border border-border p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="size-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm text-foreground">#general</h3>
                            <p className="text-xs text-muted-foreground">127 messages</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-card rounded-lg border border-border p-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="size-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <h3 className="text-sm text-foreground">#announcements</h3>
                            <p className="text-xs text-muted-foreground">23 messages</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {activeContentFilter === 'files' && (
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-start gap-3">
                        <BookOpen className="size-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-sm text-foreground">Community Guidelines.pdf</h3>
                          <p className="text-xs text-muted-foreground">Uploaded 1 week ago • 2.3 MB</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Monetization Tab with Filter Chips */}
            {activeBuilderTab === 'monetization' && (
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm text-foreground">Membership Plans</h2>
                    <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                      <Plus className="size-4" />
                      New Plan
                    </button>
                  </div>

                  {/* Level 4c: Filter Chips */}
                  <MobileFilterChips
                    filters={monetizationFilters}
                    activeFilter={activeMonetizationFilter}
                    onFilterChange={setActiveMonetizationFilter}
                  />
                </div>

                {/* Plan List */}
                <div className="space-y-2">
                  {(activeMonetizationFilter === 'all' || activeMonetizationFilter === 'free') && (
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-foreground">Free Membership</h3>
                        <span className="text-xs px-2 py-1 bg-muted rounded">Free</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Access to public channels and events</p>
                      <p className="text-xs text-muted-foreground mt-2">156 members</p>
                    </div>
                  )}
                  {(activeMonetizationFilter === 'all' || activeMonetizationFilter === 'paid') && (
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-foreground">Pro Membership</h3>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">$49</span>
                      </div>
                      <p className="text-xs text-muted-foreground">One-time payment • Lifetime access</p>
                      <p className="text-xs text-muted-foreground mt-2">67 members</p>
                    </div>
                  )}
                  {(activeMonetizationFilter === 'all' || activeMonetizationFilter === 'subscription') && (
                    <div className="bg-card rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm text-foreground">Premium</h3>
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">$19/mo</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Monthly subscription • Cancel anytime</p>
                      <p className="text-xs text-muted-foreground mt-2">24 active subscribers</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeBuilderTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <h2 className="text-sm text-foreground mb-3">Community Settings</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm text-foreground">Public Community</h3>
                        <p className="text-xs text-muted-foreground">Anyone can discover and join</p>
                      </div>
                      <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 size-4 bg-primary-foreground rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm text-foreground">Require Approval</h3>
                        <p className="text-xs text-muted-foreground">Manually approve new members</p>
                      </div>
                      <div className="w-10 h-6 bg-muted-foreground/30 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm text-foreground">Email Notifications</h3>
                        <p className="text-xs text-muted-foreground">Send updates to members</p>
                      </div>
                      <div className="w-10 h-6 bg-primary rounded-full relative">
                        <div className="absolute right-1 top-1 size-4 bg-primary-foreground rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Tab */}
            {activeBuilderTab === 'permissions' && (
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <h2 className="text-sm text-foreground mb-3">Member Roles</h2>
                  <div className="space-y-2">
                    {[
                      { role: 'Admin', count: 3, color: 'bg-destructive/10 text-destructive' },
                      { role: 'Moderator', count: 8, color: 'bg-accent text-accent-foreground' },
                      { role: 'Member', count: 236, color: 'bg-muted text-secondary-foreground' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs px-2 py-1 rounded ${item.color}`}>{item.role}</span>
                          <span className="text-sm text-foreground">{item.count} members</span>
                        </div>
                        <button className="text-xs text-primary">Edit</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Integrations Tab */}
            {activeBuilderTab === 'integrations' && (
              <div className="space-y-4">
                <div className="bg-card rounded-lg border border-border p-4">
                  <h2 className="text-sm text-foreground mb-3">Connected Apps</h2>
                  <div className="space-y-2">
                    {[
                      { app: 'Slack', status: 'Connected', active: true },
                      { app: 'Discord', status: 'Not Connected', active: false },
                      { app: 'Zoom', status: 'Connected', active: true }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <h3 className="text-sm text-foreground">{item.app}</h3>
                          <p className="text-xs text-muted-foreground">{item.status}</p>
                        </div>
                        <button className={`text-xs px-3 py-1.5 rounded ${item.active ? 'bg-destructive/10 text-destructive' : 'bg-primary text-primary-foreground'}`}>
                          {item.active ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Members L2 Tab Content */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm text-foreground">Members (247)</h2>
                <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                  <Plus className="size-4" />
                  Invite
                </button>
              </div>

              <div className="space-y-3">
                {['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Park', 'Lisa Anderson'].map((name, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm text-primary">{name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-foreground">{name}</h3>
                      <p className="text-xs text-muted-foreground">{idx === 0 ? 'Admin' : 'Member'}</p>
                    </div>
                    <div className="size-2 bg-primary rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events L2 Tab Content */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm text-foreground">Upcoming Events</h2>
                <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                  <Plus className="size-4" />
                  New Event
                </button>
              </div>

              <div className="space-y-2">
                {['UX Workshop', 'Design Review', 'Coffee Chat', 'Sprint Planning'].map((event, idx) => (
                  <div key={idx} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm text-foreground">{event}</h3>
                        <p className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Courses L2 Tab Content */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm text-foreground">All Courses</h2>
                <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                  <Plus className="size-4" />
                  New Course
                </button>
              </div>

              <div className="space-y-2">
                {['Advanced Product Design', 'UX Research Fundamentals', 'Design Systems Mastery', 'Prototyping Essentials'].map((course, idx) => (
                  <div key={idx} className="bg-card rounded-lg border border-border p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm text-foreground">{course}</h3>
                        <p className="text-xs text-muted-foreground">{45 + idx * 5} students • {68 - idx * 3}% completed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics L2 Tab Content */}
        {activeTab === 'analytics' && (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="size-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <BarChart3 className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm text-foreground mb-1">Analytics</h3>
            <p className="text-xs text-muted-foreground">Community analytics coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
