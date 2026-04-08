import { toast } from 'sonner@2.0.3';
import { useState, useCallback, useMemo, ReactNode } from 'react';
import { Home, FileText, Users, Calendar, BookOpen, Menu, X, ChevronDown, Search, Bell, Settings, Plus, Command, Mail, Video, Copy, LayoutTemplate, AlertTriangle } from 'lucide-react';
import TrueLeapLogo from '../imports/Frame315115';
import { CopilotPanel } from './CopilotPanel';
import { CopilotProvider, useCopilot } from '../contexts/CopilotContext';
import LeapyLogo from '../imports/Button';
import { EventCreationDialog } from './EventCreationDialog';
import { EmailNotificationConfig } from './EmailNotificationConfig';
import { CreditUsageWidget } from './CreditUsageTracker';
import { PostPublicationWarning, type EditChange } from './PostPublicationWarning';
import { InstantMeet } from './InstantMeet';
import { EventDuplicationTemplates, type CustomTemplate } from './EventDuplicationTemplates';
import { useEventStore } from '../data/EventStoreContext';
import { type MockEvent } from '../data/mockEventData';

interface AppLayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'drafts' | 'communities' | 'events' | 'courses';
  showBanner?: boolean;
  onNewClick?: () => void;
  copilotOpenByDefault?: boolean;
  copilotContext?: 'course' | 'community' | 'general';
}

function AppLayoutInner({ 
  children, 
  currentPage = 'communities', 
  showBanner = true, 
  onNewClick, 
  copilotOpenByDefault = false,
  copilotContext = 'general'
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCommunitiesDropdown, setShowCommunitiesDropdown] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(copilotOpenByDefault);
  const [showEventCreation, setShowEventCreation] = useState(false);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showInstantMeet, setShowInstantMeet] = useState(false);
  const [showDuplicationTemplates, setShowDuplicationTemplates] = useState(false);
  const [activeEventId, setActiveEventId] = useState<string>('evt-1'); // default to first published event
  const [pendingEdits, setPendingEdits] = useState<Partial<MockEvent>>({});
  const { currentFocus, applySuggestion } = useCopilot();

  // ─── EventStore Integration ───────────────────────────────────
  const store = useEventStore();
  const allEvents = store.getAllEvents();
  const activeEvent = store.getEvent(activeEventId);

  // Compute real field diffs for Post-Publication Warning
  const computeEditChanges = useCallback((eventId: string, edits: Partial<MockEvent>): EditChange[] => {
    const event = store.getEvent(eventId);
    if (!event) return [];
    const changes: EditChange[] = [];

    if (edits.date && edits.date !== event.date) {
      const oldDate = new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const newDate = new Date(edits.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      changes.push({
        field: 'Date & Time',
        label: 'Date & Time',
        oldValue: `${oldDate}, ${event.time}`,
        newValue: `${newDate}, ${edits.time || event.time}`,
        impactLevel: 'high',
      });
    } else if (edits.time && edits.time !== event.time) {
      changes.push({
        field: 'Date & Time',
        label: 'Time',
        oldValue: event.time,
        newValue: edits.time,
        impactLevel: 'high',
      });
    }

    if (edits.locationDetails && edits.locationDetails !== event.locationDetails) {
      changes.push({
        field: 'Location',
        label: 'Location',
        oldValue: event.locationDetails,
        newValue: edits.locationDetails,
        impactLevel: 'high',
      });
    }

    if (edits.location && edits.location !== event.location) {
      changes.push({
        field: 'Location',
        label: 'Format',
        oldValue: event.location,
        newValue: edits.location,
        impactLevel: 'medium',
      });
    }

    if (edits.title && edits.title !== event.title) {
      changes.push({
        field: 'Title',
        label: 'Event Title',
        oldValue: event.title,
        newValue: edits.title,
        impactLevel: 'medium',
      });
    }

    if (edits.description && edits.description !== event.description) {
      changes.push({
        field: 'Description',
        label: 'Description',
        oldValue: event.description.slice(0, 40) + '...',
        newValue: edits.description.slice(0, 40) + '...',
        impactLevel: 'low',
      });
    }

    if (edits.capacity && edits.capacity !== event.capacity) {
      changes.push({
        field: 'Capacity',
        label: 'Capacity',
        oldValue: String(event.capacity),
        newValue: String(edits.capacity),
        impactLevel: event.attendeeCount > (edits.capacity || 0) ? 'high' : 'low',
      });
    }

    return changes;
  }, [store]);

  // Handler: attempt to edit a published event → show warning if published
  const handleEditPublishedEvent = useCallback((eventId: string, edits: Partial<MockEvent>) => {
    const event = store.getEvent(eventId);
    if (!event) return;

    if (event.lifecycleStage === 'published' || event.lifecycleStage === 'live') {
      setActiveEventId(eventId);
      setPendingEdits(edits);
      setShowEditWarning(true);
    } else {
      // Draft events can be edited directly
      store.updateEvent(eventId, edits);
      toast.success('Event updated', { description: `"${event.title}" has been saved.` });
    }
  }, [store]);

  // Handler: confirm edit after warning
  const handleConfirmEdit = useCallback((notifyAttendees: boolean) => {
    const event = store.getEvent(activeEventId);
    if (!event) return;
    store.updateEvent(activeEventId, pendingEdits);
    if (notifyAttendees) {
      toast.success('Event updated & attendees notified', {
        description: `${event.attendeeCount} attendees will receive an email about the changes.`,
      });
    } else {
      toast.success('Event updated silently', {
        description: 'Changes saved — no notifications sent.',
      });
    }
    setPendingEdits({});
  }, [store, activeEventId, pendingEdits]);

  // Handler: EventCreationDialog → store.createEvent
  const handleEventCreated = useCallback((data: import('./EventCreationDialog').EventCreationData, continueBuilding: boolean) => {
    const newId = store.createEvent({
      title: data.title,
      description: data.description,
      date: data.date,
      time: data.time,
      format: data.format,
      locationDetails: data.locationDetails,
      capacity: data.capacity,
      category: data.category,
      templateId: data.templateId,
      isPaid: data.isPaid,
      price: data.price,
    });
    if (continueBuilding) {
      setActiveEventId(newId);
      toast('Opening event builder...', { description: `Taking you to "${data.title}" editor. (ID: ${newId.slice(0, 12)}...)` });
    } else {
      toast('Event created!', { description: `"${data.title}" saved as draft. Find it in your events.` });
    }
  }, [store]);

  // Handler: InstantMeet → store.createEvent with live status
  const handleInstantMeetCreated = useCallback((meetData: import('./InstantMeet').InstantMeetData) => {
    const now = new Date();
    const newId = store.createEvent({
      title: meetData.title,
      description: `Instant meeting started at ${now.toLocaleTimeString()}`,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      format: 'virtual',
      locationDetails: meetData.meetingLink,
      capacity: meetData.capacity,
      category: 'Meeting',
      visibility: meetData.isPrivate ? 'private' : 'public',
    });
    // Immediately set to live stage
    store.updateEvent(newId, {
      lifecycleStage: 'live',
      status: 'upcoming',
      virtualLink: meetData.meetingLink,
    });
    setActiveEventId(newId);
    toast.success('Meeting is live!', {
      description: `"${meetData.title}" created and link ready. (Event ID: ${newId.slice(0, 12)}...)`,
    });
  }, [store]);

  // Handler: Duplicate event via store
  const handleDuplicateEvent = useCallback((eventId: string): string | null => {
    const newId = store.duplicateEvent(eventId);
    if (newId) {
      const original = store.getEvent(eventId);
      toast.success('Event duplicated!', {
        description: `A draft copy of "${original?.title}" has been created. (ID: ${newId.slice(0, 12)}...)`,
      });
    }
    return newId;
  }, [store]);

  // Handler: Email config save → per-event
  const handleEmailConfigSave = useCallback(() => {
    const event = store.getEvent(activeEventId);
    toast.success('Notification settings saved', {
      description: `Email rules updated for "${event?.title || 'event'}".`,
    });
  }, [store, activeEventId]);

  // Demo trigger: simulate pending edits for the active published event
  const handleTriggerEditWarningDemo = useCallback(() => {
    const event = store.getEvent(activeEventId);
    if (!event) {
      toast.error('No active event selected');
      return;
    }
    // Simulate some edits
    const demoEdits: Partial<MockEvent> = {
      date: '2026-03-22',
      time: '3:00 PM EST',
      locationDetails: event.location === 'virtual' ? 'Google Meet' : 'New Venue, Downtown',
      description: 'Updated: ' + event.description.slice(0, 60),
    };
    if (event.lifecycleStage === 'published' || event.lifecycleStage === 'live') {
      setPendingEdits(demoEdits);
      setShowEditWarning(true);
    } else {
      // For drafts, show the warning anyway as a demo
      setPendingEdits(demoEdits);
      setShowEditWarning(true);
    }
  }, [store, activeEventId]);

  // Compute current edit changes for warning modal
  const currentEditChanges = useMemo(() => {
    return computeEditChanges(activeEventId, pendingEdits);
  }, [computeEditChanges, activeEventId, pendingEdits]);

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home', active: currentPage === 'home' },
    { id: 'drafts', icon: FileText, label: 'Drafts', active: currentPage === 'drafts' },
    { id: 'communities', icon: Users, label: 'Communities', active: currentPage === 'communities', hasDropdown: true },
    { id: 'events', icon: Calendar, label: 'Events', active: currentPage === 'events' },
    { id: 'courses', icon: BookOpen, label: 'Courses', active: currentPage === 'courses' },
  ];

  const draftCommunities = [
    { id: 1, name: 'Design Masters', emoji: '🎨', members: 0, status: 'draft' },
    { id: 2, name: 'Tech Innovators', emoji: '💡', members: 0, status: 'draft' },
    { id: 3, name: 'Marketing Pros', emoji: '📱', members: 0, status: 'draft' },
  ];

  return (
    <div className="h-screen bg-muted flex flex-col">
      {/* Top Banner */}
      {showBanner && (
        <div className="bg-primary h-[33px] flex items-center justify-between px-5 relative flex-shrink-0">
          <p className="text-primary-foreground text-sm tracking-tight">
            Leaper V2.1 available, You can now create automations around for events to better organize, manage, train and execute
          </p>
          <button className="text-primary-foreground hover:opacity-80 transition-opacity">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-50 flex-shrink-0">
        <div className="h-[73px] px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              <Menu className="size-5 text-secondary-foreground" />
            </button>
            <div className="w-[98px] h-[40px]">
              <TrueLeapLogo />
            </div>
          </div>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 h-9 pl-9 pr-16 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 bg-card border border-border rounded">
                  <Command className="size-2.5" />
                  <span className="text-xs text-foreground">K</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-2 px-3 h-9 bg-muted border border-border rounded-lg">
              <Calendar className="size-4 text-primary" />
              <div className="flex items-center gap-1 text-sm">
                <span className="text-foreground">{allEvents.filter(e => e.lifecycleStage === 'published' || e.lifecycleStage === 'live').length}</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{allEvents.length}</span>
              </div>
              <button onClick={() => setShowEventCreation(true)} className="text-primary text-base hover:opacity-70">+</button>
            </div>

            {/* Credit Usage Widget */}
            <CreditUsageWidget />

            {/* Email Notifications Config */}
            <button
              onClick={() => setShowEmailConfig(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              title="Email Notification Settings"
            >
              <Mail className="size-5 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
              <Bell className="size-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full"></span>
            </button>

            {/* User Avatar / Copilot Toggle */}
            <button 
              onClick={() => setCopilotOpen(!copilotOpen)}
              className="size-9 flex items-center justify-center hover:opacity-80 transition-opacity"
              title="Toggle Leapy Copilot"
            >
              <LeapyLogo />
            </button>

            {/* Sign In */}
            <button className="px-4 h-9 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors">
              Sign-in
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <div
          className={`bg-card border-r border-border transition-all duration-300 flex flex-col flex-shrink-0 h-full ${
            sidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          {/* Main Navigation */}
          <div className="flex-1 p-3 space-y-1">
            {/* Create New Button */}
            {sidebarOpen && (
              <button 
                onClick={onNewClick}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-4"
              >
                <Plus className="size-4" />
                <span className="text-sm">New</span>
              </button>
            )}

            {!sidebarOpen && (
              <button 
                onClick={onNewClick}
                className="w-full flex items-center justify-center p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors mb-4"
              >
                <Plus className="size-4" />
              </button>
            )}

            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => {
                    if (item.hasDropdown) {
                      setShowCommunitiesDropdown(!showCommunitiesDropdown);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    item.active
                      ? 'bg-primary/10 text-primary'
                      : 'text-secondary-foreground hover:bg-muted'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                  title={!sidebarOpen ? item.label : ''}
                >
                  <item.icon className={`size-[18px] ${item.active ? 'text-primary' : 'text-muted-foreground'}`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      {item.hasDropdown && (
                        <ChevronDown className={`size-4 transition-transform ${showCommunitiesDropdown ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </button>

                {/* Communities Dropdown */}
                {item.hasDropdown && showCommunitiesDropdown && sidebarOpen && (
                  <div className="mt-1 ml-6 space-y-1 border-l-2 border-border pl-3">
                    <div className="text-xs text-muted-foreground uppercase tracking-wide py-1">
                      Draft Communities
                    </div>
                    {draftCommunities.map((community) => (
                      <button
                        key={community.id}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-secondary-foreground hover:bg-muted transition-colors"
                      >
                        <span className="text-base">{community.emoji}</span>
                        <span className="flex-1 text-left truncate">{community.name}</span>
                        <span className="text-xs text-muted-foreground">{community.members}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-border p-3 space-y-1">
            {/* Quick Create Event */}
            {sidebarOpen && (
              <button
                onClick={() => setShowEventCreation(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <Calendar className="size-[18px] text-muted-foreground" />
                <span className="flex-1 text-left text-sm">Create Event</span>
                <Plus className="size-3.5 text-muted-foreground" />
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setShowEventCreation(true)}
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                title="Create Event"
              >
                <Calendar className="size-[18px] text-muted-foreground" />
              </button>
            )}

            {/* Instant Meet */}
            {sidebarOpen && (
              <button
                onClick={() => setShowInstantMeet(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <Video className="size-[18px] text-muted-foreground" />
                <span className="flex-1 text-left text-sm">Instant Meet</span>
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setShowInstantMeet(true)}
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                title="Instant Meet"
              >
                <Video className="size-[18px] text-muted-foreground" />
              </button>
            )}

            {/* Duplicate / Templates */}
            {sidebarOpen && (
              <button
                onClick={() => setShowDuplicationTemplates(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <LayoutTemplate className="size-[18px] text-muted-foreground" />
                <span className="flex-1 text-left text-sm">Templates</span>
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={() => setShowDuplicationTemplates(true)}
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                title="Duplicate & Templates"
              >
                <LayoutTemplate className="size-[18px] text-muted-foreground" />
              </button>
            )}

            {/* Edit Warning Demo */}
            {sidebarOpen && (
              <button
                onClick={handleTriggerEditWarningDemo}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
              >
                <AlertTriangle className="size-[18px] text-muted-foreground" />
                <span className="flex-1 text-left text-sm">Edit Warning</span>
              </button>
            )}
            {!sidebarOpen && (
              <button
                onClick={handleTriggerEditWarningDemo}
                className="w-full flex items-center justify-center p-2.5 rounded-lg text-secondary-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                title="Edit Warning Demo"
              >
                <AlertTriangle className="size-[18px] text-muted-foreground" />
              </button>
            )}

            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-foreground hover:bg-muted transition-colors ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Settings' : ''}
            >
              <Settings className="size-[18px] text-muted-foreground" />
              {sidebarOpen && <span className="flex-1 text-left text-sm">Settings</span>}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto transition-all duration-300">
          {children}
        </div>

        {/* Universal Copilot Panel - Pushes from right */}
        <div className={`transition-all duration-300 flex-shrink-0 h-full ${copilotOpen ? 'w-[400px]' : 'w-0'} overflow-hidden`}>
          <CopilotPanel 
            isOpen={copilotOpen}
            onClose={() => setCopilotOpen(false)}
            userRole="admin"
            context={copilotContext}
            currentFocus={currentFocus}
            onApplySuggestion={applySuggestion}
          />
        </div>
      </div>

      {/* Event Creation Dialog */}
      <EventCreationDialog
        open={showEventCreation}
        onOpenChange={setShowEventCreation}
        onEventCreated={handleEventCreated}
      />

      {/* Email Notification Config Dialog */}
      <EmailNotificationConfig
        open={showEmailConfig}
        onOpenChange={setShowEmailConfig}
        eventId={activeEventId}
        eventTitle={activeEvent?.title || 'Event'}
        onSave={handleEmailConfigSave}
      />

      {/* Post-Publication Edit Warning Modal */}
      <PostPublicationWarning
        open={showEditWarning}
        onOpenChange={setShowEditWarning}
        eventTitle={activeEvent?.title || 'Event'}
        eventStatus={activeEvent?.lifecycleStage || 'draft'}
        attendeeCount={activeEvent?.attendeeCount || 0}
        changes={currentEditChanges}
        onConfirmEdit={handleConfirmEdit}
        onCancel={() => {
          toast('Edit cancelled', { description: 'No changes were made.' });
        }}
      />

      {/* Instant Meet Dialog */}
      <InstantMeet
        open={showInstantMeet}
        onOpenChange={setShowInstantMeet}
        onMeetCreated={handleInstantMeetCreated}
      />

      {/* Event Duplication & Templates Dialog */}
      <EventDuplicationTemplates
        open={showDuplicationTemplates}
        onOpenChange={setShowDuplicationTemplates}
        events={allEvents}
        onDuplicate={handleDuplicateEvent}
        onCreateFromTemplate={(templateId) => {
          setShowDuplicationTemplates(false);
          setShowEventCreation(true);
          toast('Template loaded', { description: 'Fill in the details and create your event.' });
        }}
        onCreateFromCustomTemplate={(template) => {
          setShowDuplicationTemplates(false);
          setShowEventCreation(true);
          toast('Custom template loaded', { description: `Using "${template.name}" — fill in the details.` });
        }}
      />
    </div>
  );
}

export function AppLayout({ 
  children, 
  currentPage = 'communities', 
  showBanner = true, 
  onNewClick, 
  copilotOpenByDefault = false,
  copilotContext = 'general'
}: AppLayoutProps) {
  return (
    <CopilotProvider>
      <AppLayoutInner
        children={children}
        currentPage={currentPage}
        showBanner={showBanner}
        onNewClick={onNewClick}
        copilotOpenByDefault={copilotOpenByDefault}
        copilotContext={copilotContext}
      />
    </CopilotProvider>
  );
}