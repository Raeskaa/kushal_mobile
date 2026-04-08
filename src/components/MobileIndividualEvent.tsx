import { Button } from './ui/button';
import { useState } from 'react';
import { type MockEvent } from '../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  ArrowLeft, Calendar, Home, Users, Ticket,
  MessageSquare, BarChart3, Sparkles, Settings, Play, FileText,
  Award, Star, Share2, Eye, MoreVertical, Copy, RefreshCw, XCircle,
  UserPlus, Rocket, Shield, CalendarClock, Lock, Maximize2, Archive, QrCode, Trash2,
  Pencil, Menu, History, AlertTriangle, Mail
} from 'lucide-react';
import { MobileEventOverview } from './event/MobileEventOverview';
import { MobileEventSchedule } from './event/MobileEventSchedule';
import { MobileEventAttendees } from './event/MobileEventAttendees';
import { MobileEventTickets } from './event/MobileEventTickets';
import { MobileEventDiscussion } from './event/MobileEventDiscussion';
import { MobileEventAnalytics } from './event/MobileEventAnalytics';
import { MobileEventSettings } from './event/MobileEventSettings';
import { MobileEventLanding } from './event/MobileEventLanding';
import { MobilePostEvent } from './event/MobilePostEvent';
import { MobileEventStatusBanner } from './event/MobileEventStatusBanner';
import { MobileEventResources } from './event/MobileEventResources';
import { MobileSpeakerOverview } from './event/MobileSpeakerOverview';
import { MobileInlineEditSheet, type InlineEditField } from './MobileInlineEditSheet';
import { MobileEventReviews } from './event/MobileEventReviews';
import { type LeapyContext } from '../data/leapyContexts';
import { useEventStore } from '../data/EventStoreContext';
import { copyToClipboard } from '../utils/copyToClipboard';
import { PublishSheet } from './event/sheets/PublishSheet';
import { ShareSheet } from './event/sheets/ShareSheet';
import { QRCodeSheet } from './event/sheets/QRCodeSheet';
import { InviteSheet } from './event/sheets/InviteSheet';
import { CancelEventSheet } from './event/sheets/CancelEventSheet';
import { PostponeSheet } from './event/sheets/PostponeSheet';
import { CloseRegistrationSheet } from './event/sheets/CloseRegistrationSheet';
import { CapacitySheet } from './event/sheets/CapacitySheet';
import { ArchiveSheet } from './event/sheets/ArchiveSheet';
import { TicketEditSheet } from './event/sheets/TicketEditSheet';
import { MobileEventChangeLogs } from './event/MobileEventChangeLogs';

interface MobileIndividualEventProps {
  eventId: string;
  onBack: () => void;
  onOpenLeapy?: (context: LeapyContext) => void;
  onNavigateEvent?: (eventId: string) => void;
  onJoinWaitingRoom?: (eventId: string) => void;
  onJoinMeetingRoom?: (eventId: string) => void;
}

export function MobileIndividualEvent({ eventId, onBack, onOpenLeapy, onNavigateEvent, onJoinWaitingRoom, onJoinMeetingRoom }: MobileIndividualEventProps) {
  const { getEvent, updateEvent, publishEvent, unpublishEvent, cancelEvent, duplicateEvent, deleteEvent } = useEventStore();
  const event = getEvent(eventId);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [inlineEditField, setInlineEditField] = useState<InlineEditField | null>(null);
  const [showInlineEdit, setShowInlineEdit] = useState(false);

  // ─── Action Sheet States ───
  const [showPublishSheet, setShowPublishSheet] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showQRSheet, setShowQRSheet] = useState(false);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showCancelSheet, setShowCancelSheet] = useState(false);
  const [showPostponeSheet, setShowPostponeSheet] = useState(false);
  const [showCloseRegSheet, setShowCloseRegSheet] = useState(false);
  const [showCapacitySheet, setShowCapacitySheet] = useState(false);
  const [showArchiveSheet, setShowArchiveSheet] = useState(false);
  const [showTicketEditSheet, setShowTicketEditSheet] = useState(false);

  // ─── Publish Edit Warning State ───
  const [showPublishWarning, setShowPublishWarning] = useState(false);
  const [pendingEditChanges, setPendingEditChanges] = useState<Partial<MockEvent>>({});
  const [pendingEditField, setPendingEditField] = useState<string>('');

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  // Determine which view/tabs to show based on role & lifecycle
  const isAdmin = event.userRole === 'creator' || event.userRole === 'moderator';
  const isSpeaker = event.userRole === 'speaker';
  const isPostEvent = event.lifecycleStage === 'ended' && !isAdmin;
  const isCancelled = event.lifecycleStage === 'cancelled' && !isAdmin;
  const isLearner = event.userRole === 'learner' || event.userRole === 'anonymous';

  // Tab configs by role
  const getTabConfig = () => {
    if (isAdmin) {
      return [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'attendees', label: 'Attendees', icon: Users },
        { id: 'tickets', label: 'Tickets', icon: Ticket },
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'discussion', label: 'Discussion', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'change-logs', label: 'Change Logs', icon: History },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];
    }
    if (isSpeaker) {
      return [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'schedule', label: 'Schedule', icon: Calendar },
        { id: 'attendees', label: 'Attendees', icon: Users },
        { id: 'discussion', label: 'Discussion', icon: MessageSquare },
        { id: 'ai-hub', label: 'AI & Automations', icon: Sparkles },
      ];
    }
    if (isPostEvent) {
      return [
        { id: 'overview', label: 'Overview', icon: Home },
        { id: 'recording', label: 'Recording', icon: Play },
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'certificate', label: 'Certificate', icon: Award },
        { id: 'discussion', label: 'Discussion', icon: MessageSquare },
        { id: 'reviews', label: 'Reviews', icon: Star },
      ];
    }
    // Learner or public
    return [
      { id: 'overview', label: 'Overview', icon: Home },
      { id: 'agenda', label: 'Agenda', icon: Calendar },
      { id: 'speakers', label: 'Speakers', icon: Users },
      { id: 'resources', label: 'Resources', icon: FileText },
      { id: 'discussion', label: 'Chat', icon: MessageSquare },
      { id: 'reviews', label: 'Reviews', icon: Star },
    ];
  };

  const tabs = getTabConfig();

  // Status badge for header
  const getStatusBadge = () => {
    if (event.lifecycleStage === 'live') return { label: 'LIVE', color: 'bg-destructive text-destructive-foreground' };
    if (event.lifecycleStage === 'ended') return { label: 'Ended', color: 'bg-accent text-secondary-foreground' };
    if (event.lifecycleStage === 'cancelled') return { label: 'Cancelled', color: 'bg-destructive/10 text-destructive' };
    if (event.lifecycleStage === 'ready') return { label: 'Ready', color: 'bg-primary/10 text-primary' };
    if (event.lifecycleStage === 'published') return { label: 'Published', color: 'bg-primary/10 text-primary' };
    if (event.lifecycleStage === 'building') return { label: 'Building', color: 'bg-accent text-accent-foreground' };
    if (event.lifecycleStage === 'skeleton') return { label: 'Draft', color: 'bg-secondary text-secondary-foreground' };
    if (event.status === 'draft') return { label: 'Draft', color: 'bg-secondary text-secondary-foreground' };
    return null;
  };

  const statusBadge = getStatusBadge();

  // ─── Header Action Handlers ───
  const handlePublish = () => {
    publishEvent(event.id);
    toast.success('Event published!');
  };
  const handleUnpublish = () => {
    unpublishEvent(event.id);
    toast.success('Event unpublished — back to draft.');
  };
  const handleCancel = () => {
    cancelEvent(event.id, 'Cancelled by organizer');
    toast.success('Event cancelled.');
  };
  const handleDuplicate = () => {
    const newId = duplicateEvent(event.id);
    if (newId) toast.success('Event duplicated!');
  };
  const handleShare = () => {
    copyToClipboard(`leapspace.io/events/${event.id}`);
    toast.success('Event link copied!');
  };

  // Render content based on active tab and role
  const renderContent = () => {
    // Admin/Speaker views
    if (isAdmin || isSpeaker) {
      switch (activeTab) {
        case 'overview':
          if (isSpeaker) {
            return (
              <MobileSpeakerOverview
                event={event}
                onOpenLeapy={onOpenLeapy}
                onNavigateTab={(tabId) => setActiveTab(tabId)}
              />
            );
          }
          return (
            <MobileEventOverview
              event={event}
              role={'admin'}
              onOpenLeapy={onOpenLeapy}
              onInlineEdit={(field) => { setInlineEditField(field); setShowInlineEdit(true); }}
              onNavigateTab={(tabId) => setActiveTab(tabId)}
              onNavigateEvent={onNavigateEvent}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onCancel={handleCancel}
              onDuplicate={handleDuplicate}
            />
          );
        case 'schedule': return <MobileEventSchedule event={event} isAdmin={isAdmin} onOpenLeapy={onOpenLeapy} />;
        case 'attendees': return <MobileEventAttendees event={event} onOpenLeapy={onOpenLeapy} />;
        case 'tickets': return isAdmin ? <MobileEventTickets event={event} onOpenLeapy={onOpenLeapy} /> : null;
        case 'resources': return <MobileEventResources event={event} onOpenLeapy={onOpenLeapy} />;
        case 'discussion': return <MobileEventDiscussion event={event} isAdmin={isAdmin} onOpenLeapy={onOpenLeapy} />;
        case 'reviews': return isAdmin ? <MobileEventReviews event={event} mode="admin" /> : null;
        case 'analytics': return isAdmin ? <MobileEventAnalytics event={event} onOpenLeapy={onOpenLeapy} /> : null;
        case 'change-logs': return isAdmin ? <MobileEventChangeLogs event={event} onOpenLeapy={onOpenLeapy} /> : null;
        case 'ai-hub':
          return (
            <div className="p-4 text-center py-16">
              <Sparkles className="size-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">AI & Automations</p>
              <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
            </div>
          );
        case 'settings': return isAdmin ? <MobileEventSettings event={event} onOpenLeapy={onOpenLeapy} /> : null;
        default: return null;
      }
    }

    // Post-event views
    if (isPostEvent) {
      switch (activeTab) {
        case 'overview': return <MobilePostEvent event={event} section="overview" onOpenLeapy={onOpenLeapy} />;
        case 'recording': return <MobilePostEvent event={event} section="recording" onOpenLeapy={onOpenLeapy} />;
        case 'resources': return <MobilePostEvent event={event} section="resources" onOpenLeapy={onOpenLeapy} />;
        case 'certificate': return <MobilePostEvent event={event} section="certificate" onOpenLeapy={onOpenLeapy} />;
        case 'discussion': return <MobileEventDiscussion event={event} onOpenLeapy={onOpenLeapy} />;
        case 'reviews': return <MobilePostEvent event={event} section="reviews" onOpenLeapy={onOpenLeapy} />;
        default: return null;
      }
    }

    // Learner / Public / Cancelled
    switch (activeTab) {
      case 'discussion': return <MobileEventDiscussion event={event} onOpenLeapy={onOpenLeapy} />;
      case 'overview': return <MobileEventLanding event={event} activeSection="overview" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
      case 'agenda': return <MobileEventLanding event={event} activeSection="agenda" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
      case 'speakers': return <MobileEventLanding event={event} activeSection="speakers" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
      case 'resources': return <MobileEventLanding event={event} activeSection="resources" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
      case 'reviews': return <MobileEventLanding event={event} activeSection="reviews" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
      default: return <MobileEventLanding event={event} activeSection="overview" onOpenLeapy={onOpenLeapy} onNavigateEvent={onNavigateEvent} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* ── Slim Top Bar ── */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button onClick={onBack} className="p-1.5 -ml-1 active:scale-95 transition-all">
            <ArrowLeft className="size-5 text-card-foreground" />
          </button>

          <div className="flex-1 min-w-0 flex items-center gap-2">
            <h1 className="text-[15px] text-card-foreground truncate">{event.title}</h1>
            {statusBadge && (
              <span className={`inline-flex items-center h-5 px-1.5 rounded text-[10px] flex-shrink-0 ${statusBadge.color}`}>
                {event.lifecycleStage === 'live' && (
                  <span className="size-1.5 bg-current rounded-full mr-1 animate-pulse" />
                )}
                {statusBadge.label}
              </span>
            )}
          </div>

          {/* Single primary CTA when critical */}
          {isAdmin && event.lifecycleStage === 'ready' && (
            <Button size="sm" onClick={() => setShowPublishSheet(true)} className="h-7 text-[12px] px-3">
              <Rocket className="size-3" /> Publish
            </Button>
          )}
          {isAdmin && event.lifecycleStage === 'live' && (
            <Button size="sm" variant="outline" onClick={() => onJoinMeetingRoom?.(event.id)} className="h-7 text-[12px] px-3 border-destructive text-destructive">
              <Play className="size-3" /> Join
            </Button>
          )}

          {/* Overflow menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="p-1.5 active:scale-95 transition-all"
            >
              <MoreVertical className="size-5 text-muted-foreground" />
            </button>

            {showMoreActions && (
              <>
                <div className="fixed inset-0 z-50" onClick={() => setShowMoreActions(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl py-1 w-52" onClick={() => setShowMoreActions(false)}>
                  {/* Common actions */}
                  <button onClick={() => setShowShareSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                    <Share2 className="size-4 text-muted-foreground" /> Share Event
                  </button>
                  <button onClick={() => { copyToClipboard(`leapspace.io/events/${event.id}`); toast.success('Link copied!'); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                    <Copy className="size-4 text-muted-foreground" /> Copy Link
                  </button>
                  {isAdmin && (
                    <>
                      <button onClick={() => toast('Preview coming soon')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                        <Eye className="size-4 text-muted-foreground" /> Preview
                      </button>
                      <button onClick={() => setShowQRSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                        <QrCode className="size-4 text-muted-foreground" /> QR Code
                      </button>
                      <button onClick={() => setShowInviteSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                        <UserPlus className="size-4 text-muted-foreground" /> Invite People
                      </button>
                      <button onClick={handleDuplicate} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                        <RefreshCw className="size-4 text-muted-foreground" /> Duplicate
                      </button>

                      {event.isRecurring && event.lifecycleStage === 'published' && (
                        <>
                          <div className="border-t border-border my-1" />
                          <div className="px-3 py-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Series</span>
                          </div>
                          <button onClick={() => toast.success('This occurrence will be skipped.')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                            <CalendarClock className="size-4 text-muted-foreground" /> Skip Occurrence
                          </button>
                          <button onClick={() => toast('Edit scope coming soon')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                            <Pencil className="size-4 text-muted-foreground" /> Edit All Future
                          </button>
                          <button onClick={() => toast.error('Series cancelled.')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                            <XCircle className="size-4" /> Cancel Series
                          </button>
                        </>
                      )}

                      {event.lifecycleStage === 'published' && (
                        <>
                          <div className="border-t border-border my-1" />
                          <button onClick={() => setShowPostponeSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                            <CalendarClock className="size-4 text-muted-foreground" /> Reschedule
                          </button>
                          <button onClick={() => setShowCloseRegSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                            <Lock className="size-4 text-muted-foreground" /> Close Registration
                          </button>
                          <button onClick={() => setShowCapacitySheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                            <Maximize2 className="size-4 text-muted-foreground" /> Adjust Capacity
                          </button>
                          <div className="border-t border-border my-1" />
                          <button onClick={handleUnpublish} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-secondary-foreground hover:bg-muted">
                            <XCircle className="size-4" /> Unpublish
                          </button>
                          <button onClick={() => setShowCancelSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                            <XCircle className="size-4" /> Cancel Event
                          </button>
                        </>
                      )}

                      {(event.lifecycleStage === 'ended' || event.lifecycleStage === 'cancelled') && (
                        <>
                          <div className="border-t border-border my-1" />
                          <button onClick={() => setShowArchiveSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                            <Archive className="size-4" /> Archive / Delete
                          </button>
                        </>
                      )}

                      {(event.status === 'draft' || event.lifecycleStage === 'skeleton' || event.lifecycleStage === 'building') && (
                        <>
                          <div className="border-t border-border my-1" />
                          <button onClick={() => setShowArchiveSheet(true)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-muted">
                            <Trash2 className="size-4" /> Delete Draft
                          </button>
                        </>
                      )}
                    </>
                  )}

                  {isSpeaker && event.lifecycleStage === 'live' && (
                    <>
                      <div className="border-t border-border my-1" />
                      <button onClick={() => toast('Backstage coming soon')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground hover:bg-muted">
                        <Play className="size-4 text-muted-foreground" /> Enter Backstage
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Menu drawer toggle */}
          <button onClick={() => setShowDrawer(true)} className="p-1.5 active:scale-95 transition-all">
            <Menu className="size-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Status Banner (Admin only) */}
      {isAdmin && (
        <MobileEventStatusBanner
          event={event}
          onPublish={handlePublish}
          onJoinRoom={() => onJoinMeetingRoom?.(event.id)}
          onEndEvent={() => onOpenLeapy?.({ type: 'end_event', entityId: event.id, entityData: event })}
          onClone={handleDuplicate}
          onDelete={() => toast('Delete event coming soon')}
          onIncreaseCapacity={() => onOpenLeapy?.({ type: 'increase_capacity', entityId: event.id, entityData: event })}
          onManageWaitlist={() => onOpenLeapy?.({ type: 'manage_waitlist', entityId: event.id, entityData: event })}
        />
      )}

      {/* Tab Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Right-side Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 z-50" onClick={() => setShowDrawer(false)}>
          <div className="absolute inset-0 bg-foreground/40" />
          <div
            className="absolute right-0 top-0 bottom-0 w-64 bg-card flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Event Header in Drawer */}
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="size-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[15px] text-card-foreground truncate">{event.title}</h2>
                  <p className="text-[13px] text-muted-foreground">{event.attendeeCount} attendees</p>
                </div>
              </div>
            </div>

            {/* Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                <div className="space-y-0.5">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    const hasBadge = tab.id === 'discussion';
                    const hasNewBadge = tab.id === 'ai-hub';

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setShowDrawer(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all active:scale-[0.98] ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-secondary-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="size-[18px] flex-shrink-0" />
                        <span className="text-[14px] flex-1 text-left">{tab.label}</span>
                        {hasBadge && (
                          <span className="size-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">5</span>
                        )}
                        {hasNewBadge && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Pro</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live event quick action */}
              {event.lifecycleStage === 'live' && (
                <div className="p-3 border-t border-border">
                  <Button variant="outline" onClick={() => onJoinMeetingRoom?.(event.id)} className="w-full justify-start border-destructive/30 text-destructive">
                    <div className="relative">
                      <span className="absolute -top-0.5 -right-0.5 flex size-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                        <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
                      </span>
                      <Play className="size-4" />
                    </div>
                    <span className="text-sm">Join Live Room</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Inline Edit Sheet */}
      <MobileInlineEditSheet
        open={showInlineEdit}
        field={inlineEditField}
        event={event}
        onClose={() => {
          setShowInlineEdit(false);
          setInlineEditField(null);
        }}
        onSave={(id, changes) => {
          const isPublished = event.lifecycleStage === 'published' || event.lifecycleStage === 'live';
          if (isPublished) {
            // Intercept: show warning popup instead of saving directly
            setPendingEditChanges(changes);
            setPendingEditField(inlineEditField || 'details');
            setShowInlineEdit(false);
            setInlineEditField(null);
            setShowPublishWarning(true);
          } else {
            updateEvent(id, changes);
            toast.success('Changes saved');
          }
        }}
        onSwitchToLeapy={onOpenLeapy}
      />

      {/* ─── Published Edit Warning Popup ─── */}
      {showPublishWarning && (
        <div className="fixed inset-0 z-[60] flex flex-col">
          <div className="absolute inset-0 bg-black/50" onClick={() => {
            setShowPublishWarning(false);
            setPendingEditChanges({});
          }} />

          <div className="mt-auto relative bg-card rounded-t-2xl animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-5 pb-6">
              {/* Warning Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="size-11 bg-amber-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="size-5.5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[16px] text-card-foreground">This event is live</h2>
                  <p className="text-[12px] text-muted-foreground">Changes will be published immediately</p>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
                <p className="text-[13px] text-amber-800 mb-1">
                  You're editing a published event with <span className="text-amber-900">{event.attendeeCount || 0} attendees</span>
                </p>
                <p className="text-[12px] text-amber-700">
                  Any changes you confirm will go live right away. Attendees may receive notifications about this update.
                </p>
              </div>

              {/* What's changing */}
              <div className="bg-muted border border-border rounded-xl p-3 mb-4">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">What's changing</p>
                <div className="flex items-center gap-2">
                  <Pencil className="size-4 text-primary" />
                  <span className="text-[13px] text-card-foreground capitalize">{pendingEditField.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              </div>

              {/* Change history note */}
              <div className="flex items-center gap-2 mb-5 px-1">
                <History className="size-3.5 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">This change will be logged in Change History</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPublishWarning(false);
                    setPendingEditChanges({});
                    setPendingEditField('');
                    toast('Edit cancelled');
                  }}
                  className="flex-1 h-12 rounded-xl border border-border text-[14px] text-card-foreground active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateEvent(event.id, pendingEditChanges);
                    setShowPublishWarning(false);
                    setPendingEditChanges({});
                    setPendingEditField('');
                    toast.success('Changes published', {
                      description: `${event.attendeeCount || 0} attendees may be notified`,
                    });
                  }}
                  className="flex-1 h-12 bg-amber-500 text-white rounded-xl text-[14px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  <AlertTriangle className="size-4" />
                  Publish Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Sheets */}
      <PublishSheet
        isOpen={showPublishSheet}
        onClose={() => setShowPublishSheet(false)}
        event={event}
        onPublish={handlePublish}
        onPreview={() => toast('Preview coming soon')}
      />
      <ShareSheet
        isOpen={showShareSheet}
        onClose={() => setShowShareSheet(false)}
        event={event}
        onOpenQR={() => setShowQRSheet(true)}
        onOpenInvite={() => setShowInviteSheet(true)}
      />
      <QRCodeSheet
        isOpen={showQRSheet}
        onClose={() => setShowQRSheet(false)}
        event={event}
      />
      <InviteSheet
        isOpen={showInviteSheet}
        onClose={() => setShowInviteSheet(false)}
        event={event}
        onOpenLeapy={onOpenLeapy}
      />
      <CancelEventSheet
        isOpen={showCancelSheet}
        onClose={() => setShowCancelSheet(false)}
        event={event}
        onConfirmCancel={(reason) => {
          cancelEvent(event.id, reason);
          toast.success('Event cancelled.');
        }}
        onOpenLeapy={onOpenLeapy}
      />
      <PostponeSheet
        isOpen={showPostponeSheet}
        onClose={() => setShowPostponeSheet(false)}
        event={event}
        onConfirmPostpone={(newDate, newTime, reason) => {
          updateEvent(event.id, { date: newDate, time: newTime });
        }}
        onOpenLeapy={onOpenLeapy}
      />
      <CloseRegistrationSheet
        isOpen={showCloseRegSheet}
        onClose={() => setShowCloseRegSheet(false)}
        event={event}
        onConfirmClose={() => {
          updateEvent(event.id, { accessType: 'closed' });
          toast.success('Registration closed');
        }}
      />
      <CapacitySheet
        isOpen={showCapacitySheet}
        onClose={() => setShowCapacitySheet(false)}
        event={event}
        onUpdateCapacity={(newCapacity) => {
          updateEvent(event.id, { capacity: newCapacity });
        }}
      />
      <ArchiveSheet
        isOpen={showArchiveSheet}
        onClose={() => setShowArchiveSheet(false)}
        event={event}
        onConfirmArchive={() => {
          updateEvent(event.id, { lifecycleStage: 'archived' });
          onBack();
        }}
        onConfirmDelete={() => {
          deleteEvent(event.id);
          onBack();
        }}
      />
      <TicketEditSheet
        isOpen={showTicketEditSheet}
        onClose={() => setShowTicketEditSheet(false)}
        event={event}
        onOpenLeapy={onOpenLeapy}
      />
    </div>
  );
}
