import { useState } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { MobileFilterChips } from './MobileFilterChips';
import { MobileEventsFilterDrawer } from './MobileEventsFilterDrawer';
import { NeedsAttentionCarousel } from './NeedsAttentionCarousel';
import { MobileEventsCalendar } from './MobileEventsCalendar';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, Clock, Users, Video,
  Bookmark, FileText, Ticket, ChevronRight,
  Plus, Sparkles, Code, Presentation, Mic,
  GraduationCap, Handshake, Zap
} from 'lucide-react';
import { getChecklistProgress, EVENT_TEMPLATES, type MockEvent } from '../data/mockEventData';
import { type LeapyContext } from '../data/leapyContexts';
import { useEventStore } from '../data/EventStoreContext';
import { Button } from './ui/button';

interface MobileEventsLandingProps {
  onEventClick: (eventId: string) => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onLeapspaceClick?: () => void;
  onCreateEvent?: () => void;
  onCreateManually?: (templateId?: string) => void;
  onOpenLeapy?: (context: LeapyContext) => void;
  currentLeapspace?: string;
  userEmail?: string;
}

// Map template icon strings to actual components
const TEMPLATE_ICONS: Record<string, React.ComponentType<any>> = {
  Code, Presentation, Users, Mic, GraduationCap, Handshake,
};

export function MobileEventsLanding({
  onEventClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onLeapspaceClick,
  onCreateEvent,
  onCreateManually,
  onOpenLeapy,
  userEmail,
}: MobileEventsLandingProps) {
  const { getEventsForUser } = useEventStore();
  const allStoreEvents = getEventsForUser(userEmail || 'sarah@leapspace.io');

  const [activeL2Tab, setActiveL2Tab] = useState('needs-attention');
  const [activeFilter, setActiveFilter] = useState('all');
  const [discoverView, setDiscoverView] = useState<'list' | 'calendar'>('list');
  const [drawerFilters, setDrawerFilters] = useState<string[]>([]);
  const [selectedNeedsCard, setSelectedNeedsCard] = useState('upcoming-events');

  // Check if this is an empty user (no events at all)
  const isEmptyUser = false; // Always show populated state

  // L2 Tabs
  const l2Tabs = [
    { id: 'needs-attention', label: 'Needs Attention' },
    { id: 'discover', label: 'Discover' },
    { id: 'attending', label: 'Attending' },
    { id: 'hosting', label: 'Hosting' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'past', label: 'Past' },
  ];

  // Needs Attention cards
  const needsCards = [
    { id: 'create-event', label: 'Create', icon: Plus, count: 0, status: 'new' },
    { id: 'upcoming-events', label: 'Upcoming', icon: Calendar, count: 4, status: 'soon' },
    { id: 'live-now', label: 'Live Now', icon: Video, count: 1, status: 'active' },
    { id: 'pending', label: 'Pending', icon: Clock, count: 2, status: 'review' },
    { id: 'rsvp', label: 'RSVP', icon: Ticket, count: 3, status: 'needed' },
    { id: 'saved', label: 'Saved', icon: Bookmark, count: 5, status: 'items' },
    { id: 'drafts-needs', label: 'Drafts', icon: FileText, count: 2, status: 'incomplete' },
  ];

  // Filter chips per tab
  const getFilters = () => {
    switch (activeL2Tab) {
      case 'discover':
        return [
          { id: 'all', label: 'All' },
          { id: 'calendar', label: 'Calendar' },
          { id: 'free', label: 'Free' },
          { id: 'paid', label: 'Paid' },
          { id: 'virtual', label: 'Virtual' },
          { id: 'in-person', label: 'In-Person' },
          { id: 'hybrid', label: 'Hybrid' },
        ];
      case 'attending':
        return [
          { id: 'all', label: 'All' },
          { id: 'confirmed', label: 'Confirmed' },
          { id: 'waitlist', label: 'Waitlisted' },
          { id: 'applied', label: 'Applied' },
        ];
      case 'hosting':
        return [
          { id: 'all', label: 'All' },
          { id: 'published', label: 'Published' },
          { id: 'live', label: 'Live' },
          { id: 'speaker', label: 'Speaking At' },
        ];
      case 'past':
        return [
          { id: 'all', label: 'All' },
          { id: 'attended', label: 'Attended' },
          { id: 'hosted', label: 'Hosted' },
          { id: 'cancelled', label: 'Cancelled' },
        ];
      default:
        return [];
    }
  };

  // Get events for current tab (reads from store)
  const getEventsByTabFromStore = (events: MockEvent[], tab: string): MockEvent[] => {
    switch (tab) {
      case 'discover':
        return events.filter(e =>
          e.isPublic && e.status !== 'draft' && e.status !== 'cancelled' &&
          (e.lifecycleStage === 'published' || e.lifecycleStage === 'live')
        );
      case 'attending':
        return events.filter(e =>
          e.userRegistration && e.userRole !== 'creator' && e.userRole !== 'speaker' &&
          e.status !== 'cancelled'
        );
      case 'hosting':
        return events.filter(e =>
          (e.userRole === 'creator' || e.userRole === 'speaker') &&
          e.status !== 'past' && e.status !== 'cancelled'
        );
      case 'drafts':
        return events.filter(e =>
          e.status === 'draft' && e.userRole === 'creator'
        );
      case 'past':
        return events.filter(e =>
          e.status === 'past' || e.lifecycleStage === 'ended' || e.status === 'cancelled'
        );
      default:
        return events;
    }
  };

  // Get events for current tab
  const getFilteredEvents = (): MockEvent[] => {
    let result = getEventsByTabFromStore(allStoreEvents, activeL2Tab);

    if (activeL2Tab === 'discover' && activeFilter === 'calendar') {
      result = getEventsByTabFromStore(allStoreEvents, activeL2Tab);
      return result;
    }

    if (activeFilter !== 'all') {
      switch (activeL2Tab) {
        case 'discover':
          if (activeFilter === 'free') result = result.filter(e => !e.isPaid);
          if (activeFilter === 'paid') result = result.filter(e => e.isPaid);
          if (activeFilter === 'virtual') result = result.filter(e => e.location === 'virtual');
          if (activeFilter === 'in-person') result = result.filter(e => e.location === 'in-person');
          if (activeFilter === 'hybrid') result = result.filter(e => e.location === 'hybrid');
          break;
        case 'attending':
          if (activeFilter === 'confirmed') result = result.filter(e => e.userRegistration?.status === 'confirmed');
          if (activeFilter === 'waitlist') result = result.filter(e => e.userRegistration?.status === 'waitlist');
          if (activeFilter === 'applied') result = result.filter(e => e.userRegistration?.status === 'applied');
          break;
        case 'hosting':
          if (activeFilter === 'published') result = result.filter(e => e.lifecycleStage === 'published' && e.userRole === 'creator');
          if (activeFilter === 'live') result = result.filter(e => e.lifecycleStage === 'live');
          if (activeFilter === 'speaker') result = result.filter(e => e.userRole === 'speaker');
          break;
        case 'past':
          if (activeFilter === 'cancelled') result = result.filter(e => e.status === 'cancelled');
          if (activeFilter === 'attended') result = result.filter(e => e.userRegistration && e.userRole === 'learner');
          if (activeFilter === 'hosted') result = result.filter(e => e.userRole === 'creator' || e.userRole === 'speaker');
          break;
      }
    }

    if (activeL2Tab === 'discover' && drawerFilters.length > 0) {
      result = result.filter(e => {
        // Delivery Format
        const hasDelivery = drawerFilters.includes('virtual') || drawerFilters.includes('in-person') || drawerFilters.includes('hybrid');
        if (hasDelivery && !drawerFilters.includes(e.location)) return false;

        // Visibility
        const hasVisibility = drawerFilters.includes('public') || drawerFilters.includes('private') || drawerFilters.includes('global') || drawerFilters.includes('shared');
        if (hasVisibility && !drawerFilters.includes(e.visibility)) return false;

        // Access Type ('open', 'waitlist', 'apply', 'paid-access')
        const hasAccess = drawerFilters.includes('open') || drawerFilters.includes('waitlist') || drawerFilters.includes('apply') || drawerFilters.includes('paid-access');
        if (hasAccess) {
          const mappedAccess = {
            'open': 'open',
            'waitlist': 'waitlist',
            'screened': 'apply',
            'paid': 'paid-access'
          }[e.accessType];
          if (!mappedAccess || !drawerFilters.includes(mappedAccess)) return false;
        }

        // Price
        const hasPrice = drawerFilters.includes('free') || drawerFilters.includes('paid');
        if (hasPrice) {
          if (drawerFilters.includes('free') && e.isPaid) return false;
          if (drawerFilters.includes('paid') && !e.isPaid) return false;
        }

        // Nested
        const hasNested = drawerFilters.includes('standalone') || drawerFilters.includes('inside-community');
        if (hasNested) {
          if (drawerFilters.includes('standalone') && e.communityId) return false;
          if (drawerFilters.includes('inside-community') && !e.communityId) return false;
        }

        return true;
      });
    }

    return result;
  };

  // Needs attention content based on selected card
  const getNeedsAttentionEvents = (): MockEvent[] => {
    switch (selectedNeedsCard) {
      case 'upcoming-events':
        return allStoreEvents.filter(e => e.status === 'upcoming' && (e.userRegistration || e.userRole === 'creator'));
      case 'live-now':
        return allStoreEvents.filter(e => e.lifecycleStage === 'live');
      case 'pending':
        return allStoreEvents.filter(e => e.userRegistration?.status === 'applied' || e.userRegistration?.status === 'waitlist');
      case 'rsvp':
        return allStoreEvents.filter(e =>
          e.status === 'upcoming' && e.isPublic && !e.userRegistration && e.userRole === 'learner'
        );
      case 'saved':
        return allStoreEvents.filter(e => e.id === 'evt-4' || e.id === 'evt-15');
      case 'drafts-needs':
        return allStoreEvents.filter(e => e.status === 'draft' && e.userRole === 'creator');
      default:
        return [];
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { month: months[date.getMonth()], day: date.getDate() };
  };

  // Get role badge
  const getRoleBadge = (event: MockEvent) => {
    if (event.userRole === 'creator') return { label: 'Hosting', color: 'bg-primary text-primary-foreground' };
    if (event.userRole === 'speaker') return { label: 'Speaking', color: 'bg-primary/10 text-primary' };
    if (event.userRegistration?.status === 'confirmed') return { label: 'Attending', color: 'bg-green-50 text-green-700' };
    if (event.userRegistration?.status === 'waitlist') return { label: 'Waitlisted', color: 'bg-amber-50 text-amber-700' };
    if (event.userRegistration?.status === 'applied') return { label: 'Applied', color: 'bg-blue-50 text-blue-700' };
    if (event.userRegistration?.status === 'rejected') return { label: 'Not Accepted', color: 'bg-destructive/10 text-destructive' };
    if (event.lifecycleStage === 'live') return { label: 'Live', color: 'bg-destructive text-destructive-foreground' };
    if (event.status === 'draft') return { label: 'Draft', color: 'bg-accent text-secondary-foreground' };
    if (event.status === 'cancelled') return { label: 'Cancelled', color: 'bg-destructive/10 text-destructive' };
    return null;
  };

  // Get CTA button
  const getCTA = (event: MockEvent) => {
    if (event.userRole === 'creator' && event.status === 'draft') {
      const progress = getChecklistProgress(event.completionChecklist);
      return { label: progress.done >= 7 ? 'Review & Publish' : 'Continue Building', style: 'bg-primary text-primary-foreground' };
    }
    if (event.userRole === 'creator' && event.lifecycleStage === 'live') return { label: 'Live Dashboard', style: 'bg-destructive text-destructive-foreground' };
    if (event.userRole === 'creator') return { label: 'Edit', style: 'bg-secondary text-foreground' };
    if (event.userRole === 'speaker') return { label: 'View Event', style: 'bg-secondary text-foreground' };
    if (event.status === 'cancelled') return { label: 'Cancelled', style: 'bg-secondary text-muted-foreground' };
    if (event.userRegistration?.status === 'rejected') return { label: 'Not Accepted', style: 'bg-secondary text-muted-foreground' };
    if (event.userRegistration?.status === 'applied') return { label: 'Pending', style: 'bg-blue-50 text-blue-600' };
    if (event.userRegistration?.status === 'confirmed' && event.lifecycleStage === 'live') return { label: 'Join Now', style: 'bg-destructive text-destructive-foreground' };
    if (event.userRegistration?.status === 'confirmed') return { label: 'View Ticket', style: 'bg-green-50 text-green-700' };
    if (event.userRegistration?.status === 'waitlist') return { label: 'On Waitlist', style: 'bg-amber-50 text-amber-700' };
    if (event.lifecycleStage === 'ended' && event.recordingUrl) return { label: 'Recording', style: 'bg-secondary text-foreground' };
    if (event.lifecycleStage === 'ended' && event.hasCertificate) return { label: 'Certificate', style: 'bg-primary/10 text-primary' };
    if (event.capacity && event.attendeeCount >= event.capacity) {
      return event.accessType === 'waitlist'
        ? { label: 'Join Waitlist', style: 'bg-amber-50 text-amber-700' }
        : { label: 'Sold Out', style: 'bg-secondary text-muted-foreground' };
    }
    if (event.accessType === 'screened') return { label: 'Apply', style: 'bg-primary text-primary-foreground' };
    if (event.isPaid) return { label: event.tickets && event.tickets.length > 1 ? 'Get Tickets' : 'Buy Ticket', style: 'bg-primary text-primary-foreground' };
    if (event.lifecycleStage === 'live') return { label: 'Join Live', style: 'bg-destructive text-destructive-foreground' };
    return { label: 'Register', style: 'bg-primary text-primary-foreground' };
  };

  // Event card component — clean, spacious design
  const EventCard = ({ event }: { event: MockEvent }) => {
    const dateInfo = formatDate(event.date);
    const roleBadge = getRoleBadge(event);
    const cta = getCTA(event);
    const capacityPercent = event.capacity ? Math.min((event.attendeeCount / event.capacity) * 100, 100) : 0;
    const isSoldOut = event.capacity ? event.attendeeCount >= event.capacity : false;

    // Get primary meta info (price or free)
    const priceLabel = event.isPaid
      ? (event.tickets && event.tickets.length > 1
          ? `From $${Math.min(...event.tickets.map(t => t.price))}`
          : `$${event.price}`)
      : 'Free';

    return (
      <button
        onClick={() => onEventClick(event.id)}
        className="w-full text-left active:scale-[0.98] transition-all"
      >
        <div className="bg-card rounded-2xl border border-border p-5">
          {/* Top row: Role badge */}
          {roleBadge && (
            <div className="mb-3">
              <span className={`text-xs px-2.5 py-1 rounded-full ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-[15px] text-card-foreground line-clamp-2 mb-2">{event.title}</h3>

          {/* Recurring badge */}
          {event.isRecurring && (
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 2.1l4 4-4 4"/><path d="M3 12.2v-2a4 4 0 0 1 4-4h12.8M7 21.9l-4-4 4-4"/><path d="M21 11.8v2a4 4 0 0 1-4 4H4.2"/></svg>
                Recurring
              </span>
            </div>
          )}

          {/* Live indicator */}
          {event.lifecycleStage === 'live' && (
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
              </span>
              <span className="text-xs text-destructive">LIVE · {event.liveAttendeeCount} watching</span>
            </div>
          )}

          {/* Date · Time · Location row */}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-3">
            <span>{dateInfo.month} {dateInfo.day}</span>
            <span className="text-border">·</span>
            <span>{event.time}</span>
            <span className="text-border">·</span>
            <span className="capitalize">{event.location}</span>
          </div>

          {/* Compact info row: price + community + scarcity */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full ${
              event.isPaid ? 'bg-muted text-foreground' : 'bg-green-50 text-green-700'
            }`}>
              {priceLabel}
            </span>

            {event.earlyBird?.active && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
                {event.earlyBird.discountPercent}% off
              </span>
            )}

            {event.communityName && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                {event.communityName}
              </span>
            )}

            {isSoldOut && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-destructive/10 text-destructive">
                Sold Out
              </span>
            )}
          </div>

          {/* Draft progress bar */}
          {event.status === 'draft' && event.completionChecklist && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Setup progress</span>
                <span className="text-xs text-primary">
                  {getChecklistProgress(event.completionChecklist).done}/{getChecklistProgress(event.completionChecklist).total}
                </span>
              </div>
              <div className="h-1.5 bg-accent rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${(getChecklistProgress(event.completionChecklist).done / getChecklistProgress(event.completionChecklist).total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Cancelled reason */}
          {event.status === 'cancelled' && event.cancellationReason && (
            <p className="text-xs text-destructive mb-3 line-clamp-1">{event.cancellationReason}</p>
          )}

          {/* Bottom row: capacity/speakers + CTA */}
          <div className="flex items-center justify-between pt-1 border-t border-muted">
            <div className="flex items-center gap-3 pt-3">
              {/* Capacity */}
              {event.capacity && event.status !== 'draft' && event.status !== 'cancelled' && (
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {event.attendeeCount}/{event.capacity}
                  </span>
                  <div className="w-14 h-1.5 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Speaker avatars */}
              {event.speakers.length > 0 && !event.capacity && (
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1.5">
                    {event.speakers.slice(0, 2).map((s) => (
                      <div key={s.id} className="size-6 bg-accent rounded-full flex items-center justify-center border-2 border-card">
                        <span className="text-[9px] text-secondary-foreground">{s.avatar}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{event.speakers[0]?.name}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2 pt-3">
              <span className={`text-xs px-4 py-1.5 rounded-lg ${cta.style}`}>
                {cta.label}
              </span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </button>
    );
  };

  // ─── EMPTY STATE ────────────────────────────────────────────────
  if (isEmptyUser) {
    const featuredTemplates = EVENT_TEMPLATES.slice(0, 3); // Workshop, Webinar, Meetup

    return (
      <div className="min-h-screen bg-muted">
        {/* Top Navigation Bar */}
        <MobileTopBar
          title="Events"
          onSearchClick={onSearchClick}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onLeapspaceClick={onLeapspaceClick}
        />

        {/* L2 Tabs (still show for navigation awareness) */}
        <div className="bg-card border-b border-border">
          <div className="flex overflow-x-auto no-scrollbar px-5">
            {['Discover', 'Attending', 'Hosting', 'Drafts'].map((tab) => (
              <button
                key={tab}
                className="flex-shrink-0 px-4 py-3.5 border-b-2 border-transparent text-muted-foreground"
                disabled
              >
                <span className="whitespace-nowrap text-[13px]">{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty state content */}
        <div className="px-5 py-10 flex flex-col items-center">
          {/* Illustration */}
          <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
            <Calendar className="size-10 text-primary/40" />
          </div>

          {/* Heading */}
          <h2 className="text-[18px] text-card-foreground text-center mb-2">
            Create your first event
          </h2>
          <p className="text-[13px] text-muted-foreground text-center max-w-[280px] mb-8">
            Host virtual, in-person, or hybrid events. Manage registrations, tickets, and schedules all in one place.
          </p>

          {/* Popular Templates */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] text-secondary-foreground tracking-wide uppercase">Popular Templates</h3>
              <button className="text-[12px] text-primary" onClick={() => onCreateManually?.()}>
                Browse all templates
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5 pb-1">
              {featuredTemplates.map((template) => {
                const IconComp = TEMPLATE_ICONS[template.icon] || Calendar;
                return (
                  <button
                    key={template.id}
                    onClick={() => onCreateManually?.(template.id)}
                    className="flex-shrink-0 w-[140px] bg-card border border-border rounded-xl p-4 text-left active:scale-[0.97] transition-all"
                  >
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <IconComp className="size-5 text-primary" />
                    </div>
                    <p className="text-[13px] text-card-foreground mb-1">{template.name}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">{template.description}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {template.defaultDuration} · {template.defaultCapacity} seats · {template.isPaid ? `$${template.defaultPrice}` : 'Free'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] text-muted-foreground">or start from scratch</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Dual CTA */}
          <div className="w-full space-y-3 mb-6">
            <Button
              onClick={() => onOpenLeapy?.({ type: 'create_event' })}
              className="w-full bg-primary text-primary-foreground"
              size="lg"
            >
              <Sparkles className="size-4 mr-2" />
              Create with AI
            </Button>
            <Button
              onClick={() => onCreateManually?.()}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Plus className="size-4 mr-2" />
              Create Manually
            </Button>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-muted-foreground text-center">
            Events can be free or paid, one-time or recurring.
          </p>
        </div>
      </div>
    );
  }

  // ─── POPULATED STATE ────────────────────────────────────────────
  const filters = getFilters();
  const events = activeL2Tab === 'needs-attention' ? getNeedsAttentionEvents() : getFilteredEvents();

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Navigation Bar */}
      <MobileTopBar
        title="Events"
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
                onClick={() => {
                  setActiveL2Tab(tab.id);
                  setActiveFilter('all');
                }}
                className={`flex-shrink-0 px-4 py-3.5 border-b-2 transition-all active:scale-95 ${
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

      {/* Needs Attention Tab Content */}
      {activeL2Tab === 'needs-attention' && (
        <div className="pb-24">
          {/* Spotlight Carousel */}
          <NeedsAttentionCarousel
            cards={needsCards}
            selectedId={selectedNeedsCard}
            onSelect={setSelectedNeedsCard}
          />

          {/* Crossfade content below carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedNeedsCard}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="px-5 space-y-3"
            >
              {/* ─── CREATE PANEL ─── */}
              {selectedNeedsCard === 'create-event' ? (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-[15px] text-card-foreground mb-1">Create an Event</h3>
                    <p className="text-[13px] text-muted-foreground">
                      Pick a template to get started quickly, or build from scratch.
                    </p>
                  </div>

                  {/* Dual CTA - Top */}
                  <div className="space-y-2.5">
                    <Button
                      onClick={() => onOpenLeapy?.({ type: 'create_event' })}
                      className="w-full bg-primary text-primary-foreground"
                      size="lg"
                    >
                      <Sparkles className="size-4 mr-2" />
                      Create with AI
                    </Button>
                    <Button
                      onClick={() => onCreateManually?.()}
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Plus className="size-4 mr-2" />
                      Create Manually
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[11px] text-muted-foreground">or pick a template</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Template Cards */}
                  <div>
                    <h4 className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-3">
                      Templates
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {EVENT_TEMPLATES.map((template) => {
                        const IconComp = TEMPLATE_ICONS[template.icon] || Calendar;
                        return (
                          <button
                            key={template.id}
                            onClick={() => onCreateManually?.(template.id)}
                            className="bg-card border border-border rounded-xl p-4 text-left active:scale-[0.97] transition-all"
                          >
                            <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center mb-2.5">
                              <IconComp className="size-4.5 text-primary" />
                            </div>
                            <p className="text-[13px] text-card-foreground mb-0.5">{template.name}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {template.defaultDuration} · {template.isPaid ? `$${template.defaultPrice}` : 'Free'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground text-center pb-4">
                    Events can be free or paid, one-time or recurring.
                  </p>
                </div>
              ) : (
                /* ─── NORMAL EVENT LIST ─── */
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[15px] text-card-foreground">
                      {needsCards.find(c => c.id === selectedNeedsCard)?.label}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {events.length} item{events.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.id} event={event} />)
                  ) : (
                    <div className="text-center py-16">
                      <Calendar className="size-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-[15px] text-muted-foreground">No items here</p>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* List tabs (Discover, Attending, Hosting, Drafts, Past) */}
      {activeL2Tab !== 'needs-attention' && (
        <div className="pb-24">
          {/* Filter chips */}
          {filters.length > 0 && (
            <div className="py-3.5 flex items-center justify-between gap-3 px-5">
              <div className="flex-1 overflow-x-auto no-scrollbar -ml-1 pl-1">
                <MobileFilterChips
                  filters={filters}
                  activeFilter={activeFilter}
                  onFilterChange={(nextFilter) => {
                    setActiveFilter(nextFilter);
                    if (activeL2Tab === 'discover') {
                      setDiscoverView(nextFilter === 'calendar' ? 'calendar' : 'list');
                    }
                  }}
                />
              </div>
              {activeL2Tab === 'discover' && (
                <div className="flex-shrink-0">
                  <MobileEventsFilterDrawer 
                    selectedFilters={drawerFilters}
                    onApplyFilters={setDrawerFilters}
                  />
                </div>
              )}
            </div>
          )}

          {/* Event list */}
          <div className="px-5 py-5 space-y-3">
            {activeL2Tab === 'discover' && discoverView === 'calendar' ? (
              <MobileEventsCalendar events={events} onEventClick={onEventClick} />
            ) : events.length > 0 ? (
              events.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="text-center py-20">
                <Calendar className="size-14 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-[15px] text-muted-foreground mb-1">No events found</p>
                <p className="text-[13px] text-muted-foreground/50">Try a different filter</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
