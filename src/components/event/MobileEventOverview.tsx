import { useState } from 'react';
import {
  Calendar, Clock, MapPin, Users, Eye, Share2, QrCode, Pencil, CircleCheck, Sparkles,
  Copy, UserPlus, FileText, Link2, Mic, BarChart3, Timer, StopCircle, Upload, Mail,
  ClipboardList, Megaphone, ScrollText, Rocket, AlertCircle, XCircle, CheckCircle,
  RefreshCw, Trash2, DollarSign, Activity, Target, Bell, TrendingUp, Brain, Wand2,
  Ticket, Play, MessageSquare, Award, Repeat
} from 'lucide-react';
import { type MockEvent, getChecklistProgress, getMissingChecklistItems, isEventSoldOut, getEventWaitlistCount } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from '../../utils/copyToClipboard';
import { type LeapyContext } from '../../data/leapyContexts';
import { type InlineEditField } from '../MobileInlineEditSheet';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MobileSeriesIndicator } from './MobileSeriesIndicator';

interface MobileEventOverviewProps {
  event: MockEvent;
  role: 'admin' | 'speaker';
  onOpenLeapy?: (context: LeapyContext) => void;
  onInlineEdit?: (field: InlineEditField) => void;
  onNavigateTab?: (tabId: string) => void;
  onNavigateEvent?: (eventId: string) => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onCancel?: () => void;
  onDuplicate?: () => void;
}

export function MobileEventOverview({ event, role, onOpenLeapy, onInlineEdit, onNavigateTab, onNavigateEvent, onPublish, onUnpublish, onCancel, onDuplicate }: MobileEventOverviewProps) {
  const isAdmin = role === 'admin';
  const isSpeaker = role === 'speaker';
  const checklistProgress = getChecklistProgress(event.completionChecklist);
  const progressPercent = checklistProgress.total > 0 
    ? Math.round((checklistProgress.done / checklistProgress.total) * 100) 
    : 0;

  const isDraft = event.lifecycleStage === 'skeleton' || event.lifecycleStage === 'building' || event.lifecycleStage === 'ready';
  const isPublished = event.lifecycleStage === 'published';
  const isLive = event.lifecycleStage === 'live';
  const isEnded = event.lifecycleStage === 'ended';
  const isCancelled = event.lifecycleStage === 'cancelled';
  const isSoldOut = isEventSoldOut(event);

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  // ─── Speaker View ───────────────────────────────────────────────
  if (isSpeaker) {
    return (
      <div className="space-y-4">
        {/* Cover Image */}
        <div className="bg-accent h-36 flex items-center justify-center">
          <Calendar className="size-10 text-muted-foreground/40" />
        </div>
        <div className="px-4 space-y-4">
          {/* Role Card */}
          <Card className="p-4 gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary">Your Role: Speaker</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Event by {event.creatorName}</p>
          </Card>

          {/* Your Sessions */}
          <Card className="p-4 gap-3">
            <h3 className="text-sm text-card-foreground">Your Session(s)</h3>
            {event.schedule.filter(s => s.speaker === 'Sarah Chen' || s.speakerIds?.includes('current')).length > 0 ? (
              event.schedule
                .filter(s => s.speaker === 'Sarah Chen' || s.speakerIds?.includes('current'))
                .map(session => (
                  <div key={session.id} className="border border-border rounded-xl p-3 space-y-1">
                    <p className="text-sm text-card-foreground">{session.title}</p>
                    <p className="text-xs text-muted-foreground">{session.time} - {session.duration}</p>
                    {session.description && (
                      <p className="text-xs text-secondary-foreground">{session.description}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                      <Button variant="outline" size="sm" onClick={() => toast('Edit session description coming soon')}>
                        <Pencil className="size-3" /> Edit Description
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => toast('Replace slides coming soon')}>
                        <FileText className="size-3" /> Replace Slides
                      </Button>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-xs text-muted-foreground py-4 text-center">No sessions assigned to you yet.</p>
            )}
          </Card>

          {/* Event Summary (read-only) */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center gap-1">
              <Users className="size-3.5 text-muted-foreground mx-auto" />
              <p className="text-lg text-card-foreground">{event.attendeeCount}</p>
              <p className="text-[10px] text-muted-foreground">Registered</p>
            </Card>
            <Card className="p-3 text-center gap-1">
              <Calendar className="size-3.5 text-muted-foreground mx-auto" />
              <p className="text-lg text-card-foreground">{event.schedule.length}</p>
              <p className="text-[10px] text-muted-foreground">Sessions</p>
            </Card>
            <Card className="p-3 text-center gap-1">
              <MapPin className="size-3.5 text-muted-foreground mx-auto" />
              <p className="text-sm text-card-foreground capitalize">{event.location}</p>
              <p className="text-[10px] text-muted-foreground">Format</p>
            </Card>
          </div>

          <div className="h-4" />
        </div>
      </div>
    );
  }

  // ─── Admin View ─────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Cover Image Area */}
      <div className="bg-accent h-44 flex items-center justify-center relative">
        <Calendar className="size-12 text-muted-foreground/40" />
        {isAdmin && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInlineEdit?.('title')}
              className="bg-card/90"
            >
              <Pencil className="size-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => leapy('edit_event_cover')}
              className="bg-card/90"
            >
              <Sparkles className="size-3 text-primary" />
              AI Cover
            </Button>
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {/* Live indicator */}
        {isLive && (
          <div className="flex items-center gap-2 py-2">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-destructive"></span>
            </span>
            <span className="text-sm text-destructive">
              LIVE NOW · {event.liveAttendeeCount || 0} watching
            </span>
          </div>
        )}

        {/* Title & Edit */}
        <div className="flex items-start gap-3">
          <h1 className="text-xl text-card-foreground flex-1">{event.title}</h1>
          {isAdmin && (
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => onInlineEdit?.('title')}>
                <Pencil className="size-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => leapy('edit_event_details')}>
                <Sparkles className="size-4 text-primary" />
              </Button>
            </div>
          )}
        </div>

        {/* Quick Info Row */}
        <div className="flex items-center gap-4 py-1">
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-secondary-foreground">
            <MapPin className="size-3.5 text-muted-foreground" />
            <span className="capitalize">{event.location}</span>
          </div>
        </div>

        {/* ═══════ RECURRING SERIES (admin) ═══════ */}
        {event.isRecurring && event.seriesId && (
          <MobileSeriesIndicator
            event={event}
            variant="admin-card"
            onNavigateOccurrence={onNavigateEvent}
          />
        )}

        {/* ═══════ PUBLISHED STATE ═══════ */}
        {isPublished && (
          <>
            {/* Published Status Card */}
            <Card className="p-4 gap-3 border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-card-foreground">Event Published</p>
                  <p className="text-xs text-muted-foreground">Accepting registrations</p>
                </div>
                <Badge className="bg-primary/10 text-primary text-[10px]">Live</Badge>
              </div>
              <div className="flex items-center gap-2 px-1">
                <div className="flex-1 text-xs text-muted-foreground truncate">
                  leapspace.io/events/{event.id}
                </div>
                <Button variant="outline" size="sm" onClick={() => { copyToClipboard(`leapspace.io/events/${event.id}`); toast.success('Link copied!'); }}>
                  <Copy className="size-3" /> Copy
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toast('View public page')}>
                  <Eye className="size-3" /> View Page
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => leapy('share_event')}>
                  <Share2 className="size-3" /> Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => leapy('message_attendees')}>
                  <Mail className="size-3" /> Invite
                </Button>
              </div>
            </Card>

            {/* Edit Warning */}
            <div className="flex items-start gap-2 bg-secondary border border-border rounded-xl p-3">
              <AlertCircle className="size-4 text-secondary-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-secondary-foreground">This event is published. Changes will be visible immediately to registrants.</p>
            </div>

            {/* Registration Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center gap-1">
                <Users className="size-3.5 text-muted-foreground mx-auto" />
                <p className="text-lg text-card-foreground">{event.attendeeCount}{event.capacity ? `/${event.capacity}` : ''}</p>
                <p className="text-[10px] text-muted-foreground">Registered</p>
              </Card>
              <Card className="p-3 text-center gap-1">
                <Eye className="size-3.5 text-muted-foreground mx-auto" />
                <p className="text-lg text-card-foreground">{event.pageViews || Math.round(event.attendeeCount * 3.2)}</p>
                <p className="text-[10px] text-muted-foreground">Page Views</p>
              </Card>
              <Card className="p-3 text-center gap-1">
                <TrendingUp className="size-3.5 text-muted-foreground mx-auto" />
                <p className="text-lg text-card-foreground">{event.registrationRate || Math.round((event.attendeeCount / Math.max(event.pageViews || event.attendeeCount * 3.2, 1)) * 100)}%</p>
                <p className="text-[10px] text-muted-foreground">Conversion</p>
              </Card>
            </div>

            {/* Published AI Suggestions */}
            <Card className="p-4 gap-2">
              <h3 className="text-sm text-card-foreground">AI Suggestions</h3>
              <Button variant="secondary" onClick={() => leapy('generate_social_post')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                <TrendingUp className="size-4" />
                <span className="flex-1 text-left">Share on social media</span>
                <Sparkles className="size-3" />
              </Button>
              {event.isPaid && (
                <Button variant="secondary" onClick={() => leapy('send_update')} className="w-full justify-start">
                  <Bell className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-left">Send early bird reminder</span>
                  <Sparkles className="size-3 text-primary" />
                </Button>
              )}
            </Card>
          </>
        )}

        {/* ═══════ LIVE DASHBOARD ═══════ */}
        {isLive && (
          <>
            {/* Live Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center gap-1 border-destructive/20">
                <Eye className="size-3.5 text-destructive mx-auto" />
                <p className="text-lg text-card-foreground">{event.liveAttendeeCount || 0}</p>
                <p className="text-[10px] text-muted-foreground">Watching Now</p>
              </Card>
              <Card className="p-3 text-center gap-1">
                <Users className="size-3.5 text-muted-foreground mx-auto" />
                <p className="text-lg text-card-foreground">{event.attendeeCount}</p>
                <p className="text-[10px] text-muted-foreground">Registered</p>
              </Card>
              <Card className="p-3 text-center gap-1">
                <MessageSquare className="size-3.5 text-muted-foreground mx-auto" />
                <p className="text-lg text-card-foreground">{event.chatMessageCount || 0}</p>
                <p className="text-[10px] text-muted-foreground">Chat Msgs</p>
              </Card>
            </div>

            {/* Current Session Card */}
            {event.schedule.length > 0 && (() => {
              const currentSession = event.schedule[1] || event.schedule[0];
              const elapsed = 32;
              const totalMin = parseInt(currentSession.duration) || 45;
              return (
                <Card className="p-4 gap-2 border-destructive/20">
                  <div className="flex items-center gap-2">
                    <Play className="size-3.5 text-destructive" />
                    <span className="text-xs text-destructive">Now Playing</span>
                  </div>
                  <p className="text-sm text-card-foreground">{currentSession.title}</p>
                  {currentSession.speaker && (
                    <p className="text-xs text-muted-foreground">{currentSession.speaker}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <Progress value={(elapsed / totalMin) * 100} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground">{elapsed} min / {totalMin} min</span>
                  </div>
                </Card>
              );
            })()}

            {/* Live Action Buttons */}
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Live Controls</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => leapy('share_join_link')} className="justify-start border-destructive/30 text-destructive">
                  <Link2 className="size-4" /> Join Link
                </Button>
                <Button variant="outline" onClick={() => leapy('check_in_attendees')} className="justify-start border-primary/20 text-primary">
                  <CircleCheck className="size-4" /> Check-in
                </Button>
                <Button variant="secondary" onClick={() => leapy('send_live_announcement')} className="justify-start bg-primary/10 text-primary">
                  <Megaphone className="size-4" /> Announce
                </Button>
                <Button variant="outline" onClick={() => leapy('share_live_resource')} className="justify-start">
                  <FileText className="size-4 text-muted-foreground" /> Share File
                </Button>
                <Button variant="secondary" onClick={() => leapy('manage_qa')} className="justify-start">
                  <Mic className="size-4 text-muted-foreground" /> Q&A
                </Button>
                <Button variant="secondary" onClick={() => leapy('extend_time')} className="justify-start">
                  <Timer className="size-4 text-muted-foreground" /> Extend
                </Button>
              </div>
              <Button onClick={() => leapy('end_event')} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive/10">
                <StopCircle className="size-4" /> End Event
              </Button>
            </Card>
          </>
        )}

        {/* ═══════ DRAFT STATES (skeleton / building / ready) ═══════ */}
        {isDraft && isAdmin && (
          <>
            {/* Stats (always show in draft) */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Users, value: event.attendeeCount, label: 'Registered' },
                { icon: Eye, value: event.pageViews || 0, label: 'Page Views' },
                { icon: Share2, value: 0, label: 'Shares' },
              ].map((stat, idx) => (
                <Card key={idx} className="p-3 text-center gap-1">
                  <stat.icon className="size-3.5 text-muted-foreground mx-auto" />
                  <p className="text-lg text-card-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </Card>
              ))}
            </div>

            {/* Setup Checklist (10 items) */}
            {event.completionChecklist && (
              <Card className="p-4 gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm text-card-foreground">Setup Checklist</h3>
                  <span className="text-xs text-muted-foreground">{checklistProgress.done}/{checklistProgress.total}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="space-y-0.5">
                  {Object.entries(event.completionChecklist).map(([key, done]) => {
                    const labels: Record<string, string> = {
                      hasTitle: 'Add event title',
                      hasDescription: 'Add description',
                      hasDateTime: 'Set date & time',
                      hasCoverImage: 'Upload cover image',
                      hasAgenda: 'Create agenda',
                      hasTickets: 'Set up tickets',
                      hasSpeakers: 'Add speakers',
                      hasLocation: 'Set location',
                      hasRegistrationForm: 'Build registration form',
                      hasRegistrationConfig: 'Configure registration settings',
                    };
                    const contextMap: Record<string, string> = {
                      hasTitle: 'edit_event_details',
                      hasDescription: 'edit_event_description',
                      hasDateTime: 'edit_event_details',
                      hasCoverImage: 'edit_event_cover',
                      hasAgenda: 'build_agenda',
                      hasTickets: 'set_tickets',
                      hasSpeakers: 'add_speakers',
                      hasLocation: 'set_location',
                      hasRegistrationForm: 'set_registration',
                      hasRegistrationConfig: 'set_registration_config',
                    };
                    const tabNavMap: Record<string, string> = {
                      hasAgenda: 'schedule',
                      hasTickets: 'tickets',
                      hasSpeakers: 'attendees',
                      hasRegistrationForm: 'attendees',
                    };
                    const inlineEditMap: Record<string, InlineEditField> = {
                      hasTitle: 'title',
                      hasDescription: 'description',
                      hasDateTime: 'datetime',
                      hasLocation: 'location',
                    };
                    const inlineField = inlineEditMap[key];
                    const isInlineEditable = !!inlineField && !!onInlineEdit;
                    const tabNav = tabNavMap[key];

                    const handlePrimaryAction = () => {
                      if (done) return;
                      if (isInlineEditable) {
                        onInlineEdit!(inlineField);
                      } else if (tabNav && onNavigateTab) {
                        onNavigateTab(tabNav);
                      } else {
                        leapy(contextMap[key]);
                      }
                    };

                    const handleAIAction = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      leapy(contextMap[key]);
                    };

                    return (
                      <button
                        key={key}
                        onClick={handlePrimaryAction}
                        className={`w-full flex items-center gap-2.5 py-2 px-1 rounded-lg transition-all group ${done ? '' : 'active:bg-muted'}`}
                      >
                        <CircleCheck className={`size-4 flex-shrink-0 ${done ? 'text-primary' : 'text-border'}`} />
                        <span className={`text-sm flex-1 text-left ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {labels[key] || key}
                        </span>
                        {!done && (
                          <div className="flex items-center gap-1">
                            {isInlineEditable && (
                              <Pencil className="size-3.5 text-foreground/60" />
                            )}
                            <button
                              onClick={handleAIAction}
                              className="p-0.5 rounded hover:bg-primary/10 transition-colors"
                              title="Edit with AI"
                            >
                              <Sparkles className="size-3.5 text-primary/50 group-hover:text-primary" />
                            </button>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {checklistProgress.done < checklistProgress.total && (
                  <Button
                    variant="secondary"
                    onClick={() => leapy('review_checklist')}
                    className="w-full bg-primary/10 text-primary hover:bg-primary/15"
                  >
                    <Sparkles className="size-3.5" />
                    Help me complete remaining items
                  </Button>
                )}
              </Card>
            )}

            {/* AI Suggestions Card (skeleton/building) */}
            {(event.lifecycleStage === 'skeleton' || event.lifecycleStage === 'building') && (
              <Card className="p-4 gap-2">
                <h3 className="text-sm text-card-foreground">AI Suggestions</h3>
                {event.lifecycleStage === 'skeleton' && (
                  <>
                    <Button variant="secondary" onClick={() => leapy('generate_agenda')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                      <Brain className="size-4" />
                      <span className="flex-1 text-left">Generate Agenda</span>
                      <Sparkles className="size-3" />
                    </Button>
                    <Button variant="secondary" onClick={() => { onNavigateTab?.('attendees'); }} className="w-full justify-start">
                      <UserPlus className="size-4 text-muted-foreground" />
                      <span className="flex-1 text-left">Add Speaker</span>
                    </Button>
                  </>
                )}
                {event.lifecycleStage === 'building' && (
                  <>
                    {event.schedule.length < 4 && (
                      <Button variant="secondary" onClick={() => leapy('generate_agenda')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                        <Brain className="size-4" />
                        <span className="flex-1 text-left">Generate More Sessions</span>
                        <Sparkles className="size-3" />
                      </Button>
                    )}
                    {event.isPaid && (!event.tickets || event.tickets.length <= 1) && (
                      <Button variant="secondary" onClick={() => onNavigateTab?.('tickets')} className="w-full justify-start">
                        <Ticket className="size-4 text-muted-foreground" />
                        <span className="flex-1 text-left">Add VIP Tier</span>
                      </Button>
                    )}
                  </>
                )}
              </Card>
            )}

            {/* Ready-to-Publish Card */}
            {event.lifecycleStage === 'ready' && (
              <Card className="p-4 gap-3 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-5 text-primary" />
                  <h3 className="text-sm text-card-foreground">Ready to Publish!</h3>
                </div>
                <div className="space-y-1.5 pl-7">
                  <p className="text-xs text-secondary-foreground flex items-center gap-1.5"><CheckCircle className="size-3 text-primary" />Event visible on explore page</p>
                  <p className="text-xs text-secondary-foreground flex items-center gap-1.5"><CheckCircle className="size-3 text-primary" />Registration opens for attendees</p>
                  <p className="text-xs text-secondary-foreground flex items-center gap-1.5"><CheckCircle className="size-3 text-primary" />{event.location === 'virtual' || event.location === 'hybrid' ? 'Meeting room created automatically' : 'Event page goes live'}</p>
                  {event.isPaid && <p className="text-xs text-secondary-foreground flex items-center gap-1.5"><CheckCircle className="size-3 text-primary" />Ticket sales begin at ${event.price}</p>}
                </div>
                <div className="flex gap-2">
                  <Button onClick={onPublish} className="flex-1">
                    <Rocket className="size-4" /> Publish Now
                  </Button>
                  <Button variant="outline" onClick={() => toast('Schedule publish coming soon')} className="flex-1">
                    <Clock className="size-4 text-muted-foreground" /> Schedule
                  </Button>
                </div>
              </Card>
            )}

            {/* Pre-Launch AI Suggestions (ready stage) */}
            {event.lifecycleStage === 'ready' && (
              <Card className="p-4 gap-2">
                <h3 className="text-sm text-card-foreground">Pre-Launch Actions</h3>
                <Button variant="secondary" onClick={() => leapy('compose_email')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                  <Mail className="size-4" />
                  <span className="flex-1 text-left">Draft Announcement Email</span>
                  <Sparkles className="size-3" />
                </Button>
                <Button variant="secondary" onClick={() => leapy('generate_social_post')} className="w-full justify-start">
                  <Share2 className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-left">Generate Social Pack</span>
                  <Sparkles className="size-3 text-primary" />
                </Button>
                <Button variant="secondary" onClick={() => toast('Preview coming soon')} className="w-full justify-start">
                  <Eye className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-left">Preview Public Page</span>
                </Button>
              </Card>
            )}

            {/* Draft Quick Actions (6-button grid) */}
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => { copyToClipboard(`leapspace.io/events/${event.id}/preview`); toast.success('Draft preview link copied!'); }} className="justify-start gap-2">
                  <Share2 className="size-4 text-muted-foreground" /> Share Preview
                </Button>
                <Button variant="secondary" onClick={() => leapy('generate_qr')} className="justify-start gap-2">
                  <QrCode className="size-4 text-muted-foreground" /> QR Code
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
                <Button variant="secondary" onClick={onDuplicate} className="justify-start gap-2">
                  <Copy className="size-4 text-muted-foreground" /> Duplicate
                </Button>
                <Button variant="secondary" onClick={() => onInlineEdit?.('title')} className="justify-start gap-2">
                  <Pencil className="size-4 text-muted-foreground" /> Edit Details
                </Button>
                <Button variant="secondary" onClick={() => leapy('add_cohost')} className="justify-start gap-2">
                  <UserPlus className="size-4 text-muted-foreground" /> Add Co-host
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
                <Button variant="secondary" onClick={() => leapy('add_resources')} className="justify-start gap-2">
                  <FileText className="size-4 text-muted-foreground" /> Resources
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
              </div>

              {/* Publish CTA for skeleton/building */}
              {event.lifecycleStage !== 'ready' && (
                <Button
                  onClick={() => {
                    if (event.lifecycleStage === 'skeleton') {
                      toast.error(`Complete more setup items first (${checklistProgress.done}/${checklistProgress.total})`);
                    } else {
                      leapy('publish_event');
                    }
                  }}
                  disabled={event.lifecycleStage === 'skeleton'}
                  className="w-full"
                >
                  <Sparkles className="size-4" />
                  Publish Event
                  {event.lifecycleStage === 'building' && (
                    <AlertCircle className="size-3.5 ml-1 text-primary-foreground/70" />
                  )}
                </Button>
              )}
            </Card>
          </>
        )}

        {/* ═══════ PUBLISHED/LIVE Quick Actions ═══════ */}
        {(isPublished || isLive) && isAdmin && (
          <Card className="p-4 gap-3">
            <h3 className="text-sm text-card-foreground">Management</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => leapy('send_update')} className="justify-start bg-primary/10 text-primary hover:bg-primary/15">
                <Mail className="size-4" /> Send Update
                <Sparkles className="size-3 ml-auto" />
              </Button>
              <Button variant="secondary" onClick={() => leapy('close_registration')} className="justify-start">
                <XCircle className="size-4 text-muted-foreground" /> Close Reg.
              </Button>
              {!isLive && (
                <>
                  <Button variant="outline" onClick={() => leapy('postpone_event')} className="justify-start border-secondary text-secondary-foreground">
                    <Clock className="size-4" /> Postpone
                  </Button>
                  <Button variant="outline" onClick={onCancel} className="justify-start border-destructive/30 text-destructive">
                    <XCircle className="size-4" /> Cancel
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}

        {/* ═══════ POST-EVENT ADMIN ═══════ */}
        {isEnded && isAdmin && (
          <>
            {/* Post-Event Header + Attendance Report */}
            <div className="grid grid-cols-4 gap-2">
              <Card className="p-2.5 text-center gap-0.5">
                <p className="text-lg text-card-foreground">{event.attendeeCount}</p>
                <p className="text-[9px] text-muted-foreground">Registered</p>
              </Card>
              <Card className="p-2.5 text-center gap-0.5">
                <p className="text-lg text-card-foreground">{Math.round(event.attendeeCount * 0.85)}</p>
                <p className="text-[9px] text-muted-foreground">Attended</p>
              </Card>
              <Card className="p-2.5 text-center gap-0.5">
                <p className="text-lg text-card-foreground">85%</p>
                <p className="text-[9px] text-muted-foreground">Show Rate</p>
              </Card>
              <Card className="p-2.5 text-center gap-0.5">
                <p className="text-lg text-card-foreground">{event.healthScore || 82}</p>
                <p className="text-[9px] text-muted-foreground">Score /100</p>
              </Card>
            </div>

            {/* Post-Event Checklist */}
            <PostEventChecklist event={event} onOpenLeapy={onOpenLeapy} />

            {/* Post-Event AI Suggestions */}
            <Card className="p-4 gap-2">
              <h3 className="text-sm text-card-foreground">AI Suggestions</h3>
              <Button variant="secondary" onClick={() => leapy('send_followup')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                <Mail className="size-4" />
                <span className="flex-1 text-left">Draft follow-up email</span>
                <Sparkles className="size-3" />
              </Button>
              <Button variant="secondary" onClick={() => leapy('create_feedback_survey')} className="w-full justify-start">
                <Target className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left">Generate feedback survey</span>
                <Sparkles className="size-3 text-primary" />
              </Button>
              <Button variant="secondary" onClick={() => leapy('summarize_feedback')} className="w-full justify-start">
                <Activity className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left">View engagement tips</span>
                <Sparkles className="size-3 text-primary" />
              </Button>
            </Card>

            {/* Run Again */}
            <Button variant="outline" onClick={onDuplicate} className="w-full">
              <RefreshCw className="size-4" /> Run Again (Duplicate Event)
            </Button>
          </>
        )}

        {/* ═══════ CANCELLED ═══════ */}
        {isCancelled && isAdmin && (
          <>
            {/* Cancellation Details */}
            <Card className="p-4 gap-2 border-destructive/20">
              <div className="flex items-center gap-2">
                <XCircle className="size-5 text-destructive" />
                <h3 className="text-sm text-card-foreground">Event Cancelled</h3>
              </div>
              {event.cancellationReason && (
                <p className="text-xs text-secondary-foreground pl-7">{event.cancellationReason}</p>
              )}
            </Card>

            {/* Refund Status (if paid) */}
            {event.isPaid && (
              <Card className="p-4 gap-2">
                <h3 className="text-sm text-card-foreground">Refund Status</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{event.attendeeCount} attendees notified</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">${Math.round(event.attendeeCount * (event.price || 0) * 0.78)} / ${event.attendeeCount * (event.price || 0)} refunded</span>
                  <span className="text-secondary-foreground">3 processing</span>
                </div>
              </Card>
            )}

            {/* Cancelled Actions */}
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Actions</h3>
              {event.isPaid && (
                <Button variant="outline" onClick={() => toast('View refund details coming soon')} className="w-full justify-start">
                  <DollarSign className="size-4 text-muted-foreground" /> View Refund Details
                </Button>
              )}
              <Button variant="outline" onClick={onDuplicate} className="w-full justify-start">
                <RefreshCw className="size-4 text-muted-foreground" /> Clone as New Event
              </Button>
              <Button variant="outline" onClick={() => toast('Delete event coming soon')} className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10">
                <Trash2 className="size-4" /> Delete Event
              </Button>
            </Card>

            {/* Cancelled AI Suggestions */}
            <Card className="p-4 gap-2">
              <h3 className="text-sm text-card-foreground">AI Suggestions</h3>
              <Button variant="secondary" onClick={() => leapy('duplicate_event')} className="w-full justify-start bg-primary/5 text-primary hover:bg-primary/10">
                <RefreshCw className="size-4" />
                <span className="flex-1 text-left">Clone & Reschedule</span>
                <Sparkles className="size-3" />
              </Button>
              {event.attendeeCount > 0 && (
                <Button variant="secondary" onClick={() => leapy('compose_email')} className="w-full justify-start">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="flex-1 text-left">Draft Cancellation Notice</span>
                  <Sparkles className="size-3 text-primary" />
                </Button>
              )}
            </Card>
          </>
        )}

        {/* ═══════ ALWAYS: Description ═══════ */}
        <Card className="p-4 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-card-foreground">About This Event</h3>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onInlineEdit?.('description')} className="h-auto p-1">
                  <Pencil className="size-3 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => leapy('edit_event_description')} className="h-auto p-1">
                  <Wand2 className="size-3 text-primary" />
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-secondary-foreground leading-relaxed">
            {event.description || 'No description added yet.'}
          </p>
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {event.tags.map((tag, idx) => (
                <Badge key={idx} variant="outline" className="text-[10px] text-muted-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        {/* Speakers Preview */}
        {event.speakers.length > 0 && (
          <Card className="p-4 gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-card-foreground">Speakers</h3>
              {isAdmin && (
                <Button variant="link" size="sm" onClick={() => leapy('edit_speakers')} className="text-primary h-auto p-0">
                  <Sparkles className="size-3" />
                  Edit
                </Button>
              )}
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {event.speakers.map((speaker) => (
                <div key={speaker.id} className="flex flex-col items-center gap-1.5 flex-shrink-0 w-16">
                  <Avatar className="size-12">
                    <AvatarFallback className="text-xs">{speaker.avatar}</AvatarFallback>
                  </Avatar>
                  <p className="text-[10px] text-card-foreground text-center leading-tight">{speaker.name}</p>
                  <p className="text-[10px] text-muted-foreground text-center leading-tight">{speaker.role}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Location */}
        <Card className="p-4 gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-card-foreground">Location</h3>
            {isAdmin && (
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onInlineEdit?.('location')} className="h-auto p-1">
                  <Pencil className="size-3 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => leapy('set_location')} className="h-auto p-1">
                  <Wand2 className="size-3 text-primary" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-card-foreground capitalize">{event.location}</p>
              <p className="text-xs text-muted-foreground">
                {event.locationDetails || 'Details will be shared after registration'}
              </p>
            </div>
          </div>
        </Card>

        {/* Capacity */}
        {event.capacity && (
          <Card className="p-4 gap-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-card-foreground">Capacity</h3>
              <span className="text-xs text-muted-foreground">{event.attendeeCount}/{event.capacity}</span>
            </div>
            <Progress value={Math.min((event.attendeeCount / event.capacity) * 100, 100)} className="h-2" />
            {isSoldOut && (
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-destructive">At capacity · {getEventWaitlistCount(event)} on waitlist</p>
                {isAdmin && (
                  <Button variant="link" size="sm" onClick={() => leapy('increase_capacity')} className="text-primary h-auto p-0">
                    <Sparkles className="size-3" />
                    Increase
                  </Button>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Community nesting */}
        {event.communityName && (
          <button
            onClick={() => toast(`Navigate to ${event.communityName} community`)}
            className="w-full"
          >
            <Card className="p-4 gap-2 active:bg-muted transition-all">
              <h3 className="text-sm text-card-foreground">Part of</h3>
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm text-card-foreground">{event.communityName}</p>
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
              </div>
            </Card>
          </button>
        )}

        <div className="h-4" />
      </div>
    </div>
  );
}

// ─── Post-Event Checklist Sub-component ──────────────────────────
function PostEventChecklist({ event, onOpenLeapy }: { event: MockEvent; onOpenLeapy?: (ctx: LeapyContext) => void }) {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  const items = [
    { id: 'recording', label: 'Upload recording', action: 'Upload', ctx: 'upload_recording' },
    { id: 'followup', label: 'Send follow-up email', action: 'Compose', ctx: 'send_followup' },
    { id: 'resources', label: 'Publish resources & slides', action: 'Upload', ctx: 'add_resources' },
    { id: 'certificates', label: 'Configure certificates', action: 'Set Up', ctx: 'general' },
    { id: 'survey', label: 'Send feedback survey', action: 'Create', ctx: 'create_feedback_survey' },
  ];

  const doneCount = Object.values(completed).filter(Boolean).length;

  return (
    <Card className="p-4 gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm text-card-foreground">Post-Event Checklist</h3>
        <span className="text-xs text-muted-foreground">{doneCount}/{items.length}</span>
      </div>
      <Progress value={(doneCount / items.length) * 100} className="h-2" />
      <div className="space-y-1">
        {items.map(item => {
          const isDone = completed[item.id];
          return (
            <div key={item.id} className="flex items-center gap-2.5 py-1.5">
              <button onClick={() => setCompleted(p => ({ ...p, [item.id]: !p[item.id] }))}>
                <CircleCheck className={`size-4 ${isDone ? 'text-primary' : 'text-border'}`} />
              </button>
              <span className={`text-sm flex-1 ${isDone ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {item.label}
              </span>
              {!isDone && (
                <Button variant="outline" size="sm" onClick={() => leapy(item.ctx)} className="h-7 text-xs">
                  {item.action}
                  <Sparkles className="size-2.5 text-primary ml-1" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}