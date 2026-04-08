import { useState } from 'react';
import { MobileBuilderTabs } from './MobileBuilderTabs';
import { MobileFilterChips } from './MobileFilterChips';
import { MobileSegmentedControl } from './MobileSegmentedControl';
import { Calendar, Users, BookOpen, Plus, Filter } from 'lucide-react';

export function CommunityBuilderDemo() {
  const [activeBuilderTab, setActiveBuilderTab] = useState('overview');
  const [activeEventFilter, setActiveEventFilter] = useState('all');
  const [activeSegment, setActiveSegment] = useState('overview');

  const builderTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
    { id: 'content', label: 'Content' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const eventFilters = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'draft', label: 'Draft' },
  ];

  const courseSegments = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources' },
    { id: 'notes', label: 'Notes' },
    { id: 'discussion', label: 'Discussion' },
  ];

  return (
    <div className="min-h-screen bg-muted">
      {/* DEMO BANNER */}
      <div className="bg-primary text-primary-foreground text-center py-3 px-4 sticky top-0 z-50">
        <div className="text-sm">✨ Navigation Components Demo</div>
        <div className="text-xs opacity-90">Level 3: Builder Tabs • Level 4a: Filter Chips • Level 4b: Segmented Control</div>
      </div>

      {/* Top Bar */}
      <div className="bg-card border-b border-border px-4 py-3 sticky top-[60px] z-20">
        <h1 className="text-lg text-foreground">Design Community</h1>
        <p className="text-xs text-muted-foreground">Community Builder</p>
      </div>

      {/* LEVEL 3 LABEL */}
      <div className="bg-primary/10 border-l-4 border-primary px-4 py-2 m-4 rounded">
        <div className="text-xs text-primary">LEVEL 3: Builder Tabs (Card Style)</div>
        <div className="text-xs text-primary/70">Swipeable horizontal card-style pills for builder sections</div>
      </div>

      {/* Level 3: Builder Tabs */}
      <MobileBuilderTabs
        tabs={builderTabs}
        activeTab={activeBuilderTab}
        onTabChange={setActiveBuilderTab}
      />

      {/* Content Area */}
      <div className="p-4 pb-20 space-y-6">
        {/* Overview Tab */}
        {activeBuilderTab === 'overview' && (
          <div className="space-y-4">
            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="text-sm text-foreground mb-2">Community Stats</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl text-foreground">247</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-foreground">12</div>
                  <div className="text-xs text-muted-foreground">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl text-foreground">8</div>
                  <div className="text-xs text-muted-foreground">Courses</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="text-sm text-foreground mb-3">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-secondary-foreground active:scale-95 transition-all">
                  <Users className="size-4" />
                  Invite Members
                </button>
                <button className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-secondary-foreground active:scale-95 transition-all">
                  <Calendar className="size-4" />
                  Create Event
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Events Tab with Filter Chips */}
        {activeBuilderTab === 'events' && (
          <div className="space-y-4">
            {/* LEVEL 4a LABEL */}
            <div className="bg-accent border-l-4 border-accent-foreground px-4 py-2 rounded">
              <div className="text-xs text-accent-foreground">LEVEL 4a: Filter Chips</div>
              <div className="text-xs text-accent-foreground/70">Horizontal scrollable filter chips for list filtering</div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm text-foreground">Events</h2>
                <button className="flex items-center gap-1 text-xs text-primary active:scale-95 transition-all">
                  <Plus className="size-4" />
                  New Event
                </button>
              </div>

              <MobileFilterChips
                filters={eventFilters}
                activeFilter={activeEventFilter}
                onFilterChange={setActiveEventFilter}
              />
            </div>

            {/* Event List */}
            <div className="space-y-2">
              {['UX Workshop', 'Design Review', 'Coffee Chat'].map((event, idx) => (
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
        )}

        {/* Courses Tab with Segmented Control */}
        {activeBuilderTab === 'courses' && (
          <div className="space-y-4">
            {/* LEVEL 4b LABEL */}
            <div className="bg-secondary border-l-4 border-secondary-foreground px-4 py-2 rounded">
              <div className="text-xs text-secondary-foreground">LEVEL 4b: Segmented Control (Tight)</div>
              <div className="text-xs text-secondary-foreground/70">Tight segmented control for course players and meeting rooms</div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4">
              <h2 className="text-sm text-foreground mb-3">Course Player Example</h2>
              <MobileSegmentedControl
                segments={courseSegments}
                activeSegment={activeSegment}
                onSegmentChange={setActiveSegment}
              />
            </div>

            {/* Segment Content */}
            <div className="bg-card rounded-lg border border-border p-4">
              {activeSegment === 'overview' && (
                <div>
                  <h3 className="text-sm text-foreground mb-2">Course Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    This section shows the course introduction and key information.
                  </p>
                </div>
              )}
              {activeSegment === 'resources' && (
                <div>
                  <h3 className="text-sm text-foreground mb-2">Resources</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <BookOpen className="size-4 text-muted-foreground" />
                      <span className="text-sm text-secondary-foreground">Course Slides.pdf</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                      <BookOpen className="size-4 text-muted-foreground" />
                      <span className="text-sm text-secondary-foreground">Reading Material.pdf</span>
                    </div>
                  </div>
                </div>
              )}
              {activeSegment === 'notes' && (
                <div>
                  <h3 className="text-sm text-foreground mb-2">My Notes</h3>
                  <p className="text-sm text-muted-foreground">Your personal notes will appear here.</p>
                </div>
              )}
              {activeSegment === 'discussion' && (
                <div>
                  <h3 className="text-sm text-foreground mb-2">Discussion</h3>
                  <p className="text-sm text-muted-foreground">Join the course discussion with other students.</p>
                </div>
              )}
            </div>

            {/* Course List */}
            <div className="space-y-2">
              <h3 className="text-xs text-muted-foreground px-1">All Courses</h3>
              {['Advanced Product Design', 'UX Research Fundamentals', 'Design Systems Mastery'].map((course, idx) => (
                <div key={idx} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-foreground">{course}</h3>
                      <p className="text-xs text-muted-foreground">45 students • 68% completed</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeBuilderTab === 'members' && (
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
                {['Sarah Johnson', 'Mike Chen', 'Emma Wilson'].map((name, idx) => (
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

        {/* Other Tabs */}
        {['content', 'analytics', 'settings'].includes(activeBuilderTab) && (
          <div className="bg-card rounded-lg border border-border p-8 text-center">
            <div className="size-16 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
              <Filter className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-sm text-foreground mb-1 capitalize">{activeBuilderTab}</h3>
            <p className="text-xs text-muted-foreground">Content for this section coming soon</p>
          </div>
        )}
      </div>

      {/* Info Card at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="bg-primary text-primary-foreground rounded-lg p-3 text-xs">
          <div className="mb-1">✨ Navigation Pattern Applied</div>
          <div className="opacity-90">
            <div>• L3: Builder Tabs (Card Style)</div>
            <div>• L4a: Filter Chips (Events)</div>
            <div>• L4b: Segmented Control (Courses)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
