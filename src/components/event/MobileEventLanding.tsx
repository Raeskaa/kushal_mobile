import { useState } from 'react';
import {
  Calendar, Clock, MapPin, Users, CircleCheck, AlertCircle, XCircle,
  ExternalLink, Share2, ChevronRight, ChevronDown, Star, Sparkles,
  MessageCircle, Bell, UserPlus, Globe, Bookmark, BookmarkCheck,
  Play, FileText, Download, Linkedin, Twitter, Hash, Timer, Heart,
  ThumbsUp, Lock, Repeat, Coins, ShoppingCart, Plus
} from 'lucide-react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from '../../utils/copyToClipboard';
import { type LeapyContext } from '../../data/leapyContexts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { MobileSeriesIndicator } from './MobileSeriesIndicator';
import { MobileEventReviews } from './MobileEventReviews';
import { MobileResourceList } from './MobileResourceList';
import { MobileAddToCalendarSheet } from './MobileAddToCalendarSheet';
import { MobileEventCheckoutSheet } from './MobileEventCheckoutSheet';
import { useCredits, usdToCredits, formatCredits, CREDIT_PACKS } from '../../data/CreditContext';

interface MobileEventLandingProps {
  event: MockEvent;
  activeSection: string;
  onOpenLeapy?: (context: LeapyContext) => void;
  onNavigateEvent?: (eventId: string) => void;
}

export function MobileEventLanding({ event, activeSection, onOpenLeapy, onNavigateEvent }: MobileEventLandingProps) {
  const [isRegistered, setIsRegistered] = useState(!!event.userRegistration);
  const [bookmarkedSessions, setBookmarkedSessions] = useState<Set<string>>(new Set());
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [expandedSpeaker, setExpandedSpeaker] = useState<string | null>(null);
  const [showRegistrationSheet, setShowRegistrationSheet] = useState(false);
  const [showAddToCalendar, setShowAddToCalendar] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  // Credit system
  const credits = useCredits();

  const capacityPercent = event.capacity ? Math.min((event.attendeeCount / event.capacity) * 100, 100) : 0;
  const isSoldOut = event.capacity ? event.attendeeCount >= event.capacity : false;

  // Countdown calculation
  const getCountdown = () => {
    // Mock — in real app, calculate from event.date
    const daysLeft = Math.floor(Math.random() * 14) + 1;
    if (daysLeft <= 1) return { text: 'Starts tomorrow!', urgent: true };
    if (daysLeft <= 3) return { text: `${daysLeft} days left`, urgent: true };
    if (daysLeft <= 7) return { text: `${daysLeft} days away`, urgent: false };
    return { text: `In ${daysLeft} days`, urgent: false };
  };
  const countdown = getCountdown();

  const handleRegister = () => {
    if (onOpenLeapy) {
      if (event.accessType === 'waitlist' && isSoldOut) {
        onOpenLeapy({ type: 'join_waitlist', entityId: event.id, entityData: event });
      } else {
        onOpenLeapy({ type: 'register_event', entityId: event.id, entityData: event });
      }
      return;
    }
    if (event.isPaid) {
      setShowCheckout(true);
    } else if (event.accessType === 'screened') {
      toast.success('Application submitted! The organizer will review it.');
    } else if (event.accessType === 'waitlist' && isSoldOut) {
      toast.success('Added to waitlist!');
    } else {
      toast.success('Registered successfully!');
    }
    setIsRegistered(true);
  };

  const toggleBookmark = (sessionId: string) => {
    setBookmarkedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
        toast('Session removed from your schedule');
      } else {
        next.add(sessionId);
        toast.success('Session saved to your schedule');
      }
      return next;
    });
  };

  const toggleSessionExpand = (sessionId: string) => {
    setExpandedSessions(prev => {
      const next = new Set(prev);
      if (next.has(sessionId)) next.delete(sessionId);
      else next.add(sessionId);
      return next;
    });
  };

  // ─── Compact Registration Banner ───
  const renderCompactRegistration = () => {
    const reg = event.userRegistration;

    if (event.lifecycleStage === 'cancelled') {
      return (
        <div className="mx-4 mt-3 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex items-center gap-2">
          <XCircle className="size-4 text-destructive flex-shrink-0" />
          <span className="text-xs text-destructive">This event has been cancelled</span>
        </div>
      );
    }

    if (reg?.status === 'confirmed' || (isRegistered && !reg)) {
      return (
        <div className="mx-4 mt-3 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 flex items-center gap-2">
          <CircleCheck className="size-4 text-primary flex-shrink-0" />
          <span className="text-xs text-primary flex-1">You're registered</span>
          {event.lifecycleStage === 'live' && (
            <Button size="sm" variant="destructive" onClick={() => toast('Live meeting room coming soon')} className="text-[10px] h-6 px-2">
              Join Now
            </Button>
          )}
        </div>
      );
    }

    if (!isRegistered) {
      const creditPrice = event.isPaid && event.price ? usdToCredits(event.price) : 0;
      return (
        <div className="mx-4 mt-3 bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-secondary-foreground flex-1">
            {event.isPaid ? (
              <span className="inline-flex items-center gap-1">
                <Coins className="size-3 text-amber-500" />
                {creditPrice.toLocaleString()} credits
              </span>
            ) : 'Free'} · {event.capacity ? `${event.capacity - event.attendeeCount} spots left` : 'Open'}
          </span>
          <Button size="sm" onClick={handleRegister} className="text-[10px] h-6 px-3">
            {event.accessType === 'screened' ? 'Apply' :
             event.isPaid ? 'Get Ticket' : 'Register'}
          </Button>
        </div>
      );
    }

    return null;
  };

  // ─── Full Registration CTA ───
  const renderRegistrationCTA = () => {
    const reg = event.userRegistration;

    if (event.lifecycleStage === 'cancelled') {
      return (
        <Card className="p-4 border-destructive/30 gap-0">
          <div className="flex items-start gap-3">
            <XCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive mb-1">This event has been cancelled</p>
              <p className="text-xs text-secondary-foreground">{event.cancellationReason}</p>
            </div>
          </div>
        </Card>
      );
    }

    if (reg?.status === 'confirmed' || (isRegistered && !reg)) {
      return (
        <Card className="p-4 border-primary/20 bg-primary/5 gap-0">
          <div className="flex items-start gap-3">
            <CircleCheck className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-primary mb-1">You're registered!</p>
              <p className="text-xs text-secondary-foreground">
                {reg?.ticketTier && `Ticket: ${reg.ticketTier}`}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => setShowAddToCalendar(true)} className="text-xs h-7 text-primary">
                  <Sparkles className="size-3" /> Calendar
                </Button>
                <Button variant="outline" size="sm" onClick={() => onOpenLeapy?.({ type: 'update_registration', entityId: event.id, entityData: event })} className="text-xs h-7 text-primary">
                  <Sparkles className="size-3" /> Update
                </Button>
                <Button variant="outline" size="sm" onClick={() => onOpenLeapy?.({ type: 'cancel_registration', entityId: event.id, entityData: event })} className="text-xs h-7 text-destructive">
                  Cancel
                </Button>
                {event.lifecycleStage === 'live' && (
                  <Button size="sm" variant="destructive" onClick={() => toast('Live meeting room coming soon')} className="text-xs h-7">
                    Join Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      );
    }

    if (reg?.status === 'waitlist') {
      return (
        <Card className="p-4 border-secondary bg-secondary gap-0">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-secondary-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-secondary-foreground mb-1">You're on the waitlist</p>
              <p className="text-xs text-secondary-foreground">
                Position #{reg.waitlistPosition} · We'll notify you when a spot opens up
              </p>
            </div>
          </div>
        </Card>
      );
    }

    if (reg?.status === 'applied') {
      return (
        <Card className="p-4 border-accent bg-accent gap-0">
          <div className="flex items-start gap-3">
            <Clock className="size-5 text-accent-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-accent-foreground mb-1">Application under review</p>
              <p className="text-xs text-secondary-foreground">The organizer will review your application soon</p>
            </div>
          </div>
        </Card>
      );
    }

    if (reg?.status === 'rejected') {
      return (
        <Card className="p-4 border-destructive/30 bg-destructive/10 gap-0">
          <div className="flex items-start gap-3">
            <XCircle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive mb-1">Application not accepted</p>
              {reg.rejectionReason && (
                <p className="text-xs text-secondary-foreground">{reg.rejectionReason}</p>
              )}
            </div>
          </div>
        </Card>
      );
    }

    // Not registered — ticket selection (learners see CREDITS only)
    return (
      <Card className="p-4 gap-3">
        {/* Credit Balance (learner) */}
        {credits && event.isPaid && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-amber-500" />
              <div>
                <p className="text-[12px] text-amber-800">Your Balance</p>
                <p className="text-[14px] text-amber-900 tabular-nums">{credits.userBalance.toLocaleString()} credits</p>
              </div>
            </div>
            <button
              onClick={() => setShowBuyCredits(true)}
              className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-100 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all"
            >
              <Plus className="size-3" /> Buy Credits
            </button>
          </div>
        )}

        {/* Ticket tiers */}
        {event.tickets && event.tickets.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Select a ticket</p>
            {event.tickets.map((ticket) => {
              const soldOut = ticket.remaining <= 0;
              const isSelected = selectedTicketId === ticket.id;
              const ticketCredits = usdToCredits(ticket.price);
              const canAffordTicket = credits ? credits.canAfford(ticketCredits) : true;
              return (
                <button
                  key={ticket.id}
                  onClick={() => !soldOut && setSelectedTicketId(ticket.id)}
                  disabled={soldOut}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border'
                  } ${soldOut ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.99]'}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-card-foreground">{ticket.name}</p>
                      {ticket.description && (
                        <p className="text-[10px] text-muted-foreground mt-0.5">{ticket.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {ticket.price === 0 ? (
                        <p className="text-sm text-card-foreground">Free</p>
                      ) : (
                        <div className="flex items-center gap-1.5 justify-end">
                          <Coins className="size-3.5 text-amber-500" />
                          <p className="text-sm text-amber-700">{ticketCredits.toLocaleString()}</p>
                        </div>
                      )}
                      {soldOut ? (
                        <p className="text-[10px] text-destructive">Sold out</p>
                      ) : !canAffordTicket && ticket.price > 0 ? (
                        <p className="text-[10px] text-destructive">Not enough credits</p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">{ticket.remaining} left</p>
                      )}
                    </div>
                  </div>
                  {ticket.perks && ticket.perks.length > 0 && isSelected && (
                    <div className="mt-2 pt-2 border-t border-border space-y-1">
                      {ticket.perks.map((perk, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <CircleCheck className="size-3 text-primary flex-shrink-0" />
                          <span className="text-[10px] text-secondary-foreground">{perk}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              {event.isPaid && event.price ? (
                <div className="flex items-center gap-1.5">
                  <Coins className="size-4 text-amber-500" />
                  <p className="text-sm text-amber-700">{usdToCredits(event.price).toLocaleString()} credits</p>
                </div>
              ) : (
                <p className="text-sm text-card-foreground">Free</p>
              )}
              {event.earlyBird?.active && (
                <p className="text-[10px] text-secondary-foreground">
                  {event.earlyBird.discountPercent}% early bird discount
                </p>
              )}
            </div>
            {event.capacity && (
              <p className="text-xs text-muted-foreground">
                {event.capacity - event.attendeeCount} spots left
              </p>
            )}
          </div>
        )}

        {/* Insufficient credits warning */}
        {credits && event.isPaid && (() => {
          const selectedTicket = event.tickets?.find(t => t.id === selectedTicketId);
          const requiredCredits = selectedTicket ? usdToCredits(selectedTicket.price) : (event.price ? usdToCredits(event.price) : 0);
          if (requiredCredits > 0 && !credits.canAfford(requiredCredits)) {
            return (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
                <Coins className="size-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-[12px] text-destructive">
                    You need {(requiredCredits - credits.userBalance).toLocaleString()} more credits
                  </p>
                  <button
                    onClick={() => setShowBuyCredits(true)}
                    className="text-[11px] text-primary mt-1"
                  >
                    Buy credits to continue →
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        <Button onClick={handleRegister} className="w-full">
          <Sparkles className="size-4" />
          {event.accessType === 'screened' ? 'Apply to Join' :
           event.accessType === 'waitlist' && isSoldOut ? 'Join Waitlist' :
           event.isPaid ? 'Get Ticket' : 'Register'}
        </Button>
      </Card>
    );
  };

  // ===== OVERVIEW SECTION =====
  if (activeSection === 'overview') {
    // Social proof data
    const socialProof = [
      { avatar: 'JC', name: 'Jessica C.' },
      { avatar: 'AK', name: 'Amit K.' },
      { avatar: 'ML', name: 'Maria L.' },
    ];

    return (
      <>
      <div className="space-y-4">
        {/* Cover Image */}
        <div className="bg-accent h-44 flex items-center justify-center relative">
          <Calendar className="size-12 text-muted-foreground/40" />
          {/* Countdown overlay */}
          {event.lifecycleStage !== 'live' && event.lifecycleStage !== 'ended' && event.lifecycleStage !== 'cancelled' && (
            <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full ${
              countdown.urgent ? 'bg-destructive text-white' : 'bg-foreground/60 text-white'
            }`}>
              <div className="flex items-center gap-1">
                <Timer className="size-3" />
                <span className="text-[10px]">{countdown.text}</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 space-y-4">
          {/* Live indicator */}
          {event.lifecycleStage === 'live' && (
            <div className="flex items-center gap-2 py-2">
              <span className="relative flex size-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2.5 bg-destructive"></span>
              </span>
              <span className="text-sm text-destructive">
                LIVE NOW · {event.liveAttendeeCount} watching
              </span>
            </div>
          )}

          {/* Title & Type Badge */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="outline" className="text-[10px] text-muted-foreground capitalize">{event.category}</Badge>
              <Badge variant="outline" className="text-[10px] text-muted-foreground capitalize">{event.location}</Badge>
              {!event.isPublic && (
                <Badge variant="outline" className="text-[10px] text-muted-foreground">
                  <Lock className="size-2.5 mr-0.5" /> Invite Only
                </Badge>
              )}
              {event.isRecurring && (
                <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                  <Repeat className="size-2.5 mr-0.5" /> Recurring
                </Badge>
              )}
            </div>
            <h1 className="text-xl text-card-foreground">{event.title}</h1>
          </div>

          {/* Host info */}
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarFallback className="text-sm">{event.creatorAvatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-card-foreground">{event.creatorName}</p>
              <p className="text-xs text-muted-foreground">Organizer</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => onOpenLeapy?.({ type: 'share_event', entityId: event.id, entityData: event })} className="ml-auto">
              <Sparkles className="size-4 text-primary" />
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 py-2">
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

          {/* Social proof */}
          {event.attendeeCount > 5 && (
            <div className="flex items-center gap-2 py-1">
              <div className="flex -space-x-2">
                {socialProof.map((p, i) => (
                  <Avatar key={i} className="size-6 border-2 border-card">
                    <AvatarFallback className="text-[8px]">{p.avatar}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {socialProof[0].name} and {event.attendeeCount - 1} others are attending
              </span>
            </div>
          )}

          {/* Registration CTA */}
          {renderRegistrationCTA()}

          {/* Recurring Series Card (learner) */}
          {event.isRecurring && event.seriesId && (
            <MobileSeriesIndicator
              event={event}
              variant="learner-card"
              onNavigateOccurrence={onNavigateEvent}
            />
          )}

          {/* Learner Quick Actions */}
          {(event.userRegistration?.status === 'confirmed' || isRegistered) && (
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Your Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'ask_about_event', entityId: event.id, entityData: event })} className="bg-primary/10 text-primary hover:bg-primary/15">
                  <Sparkles className="size-4" />
                  Ask Leapy
                </Button>
                <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'invite_friend', entityId: event.id, entityData: event })}>
                  <UserPlus className="size-4 text-muted-foreground" />
                  Invite
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
                <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'set_reminder', entityId: event.id, entityData: event })}>
                  <Bell className="size-4 text-muted-foreground" />
                  Remind
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
                <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'share_attending', entityId: event.id, entityData: event })}>
                  <Share2 className="size-4 text-muted-foreground" />
                  Share
                  <Sparkles className="size-3 text-primary ml-auto" />
                </Button>
              </div>
            </Card>
          )}

          {/* About */}
          <Card className="p-4 gap-2">
            <h3 className="text-sm text-card-foreground">About This Event</h3>
            <p className="text-sm text-secondary-foreground leading-relaxed">
              {event.description || 'No description available.'}
            </p>
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {event.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-[10px] text-muted-foreground">
                    <Hash className="size-2.5 mr-0.5" />{tag}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Agenda preview */}
          {event.schedule.length > 0 && (
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Agenda</h3>
              <div className="space-y-2.5">
                {event.schedule.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="text-right w-16 flex-shrink-0">
                      <p className="text-xs text-card-foreground">{item.time}</p>
                      <p className="text-[10px] text-muted-foreground">{item.duration}</p>
                    </div>
                    <div className="w-px bg-border" />
                    <div className="flex-1">
                      <p className="text-sm text-card-foreground">{item.title}</p>
                      {item.speaker && <p className="text-xs text-muted-foreground mt-0.5">{item.speaker}</p>}
                    </div>
                  </div>
                ))}
                {event.schedule.length > 3 && (
                  <p className="text-xs text-primary text-center pt-1">
                    +{event.schedule.length - 3} more sessions
                  </p>
                )}
              </div>
            </Card>
          )}

          {/* Speakers preview */}
          {event.speakers.length > 0 && (
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Speakers</h3>
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
            <h3 className="text-sm text-card-foreground">Location</h3>
            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-card-foreground capitalize">{event.location}</p>
                <p className="text-xs text-muted-foreground">
                  {event.locationDetails || 'Details will be shared after registration'}
                </p>
              </div>
              {event.location === 'virtual' && (
                <Badge variant="secondary" className="text-[10px]">
                  <Globe className="size-3 mr-0.5" /> Online
                </Badge>
              )}
            </div>
            {/* Map placeholder for in-person */}
            {event.location !== 'virtual' && (
              <div className="bg-muted rounded-lg h-24 mt-2 flex items-center justify-center">
                <MapPin className="size-6 text-muted-foreground/30" />
              </div>
            )}
          </Card>

          {/* Community nesting */}
          {event.communityName && (
            <Card className="p-4 gap-2 active:bg-muted transition-all cursor-pointer" onClick={() => toast(`Navigate to ${event.communityName} community`)}>
              <h3 className="text-sm text-card-foreground">Part of</h3>
              <div className="flex items-center gap-3">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground">{event.communityName}</p>
                  <p className="text-xs text-muted-foreground">Community</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </Card>
          )}

          {/* Capacity */}
          {event.capacity && (
            <Card className="p-4 gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-card-foreground">Capacity</h3>
                <span className="text-xs text-muted-foreground">{event.attendeeCount}/{event.capacity}</span>
              </div>
              <Progress value={capacityPercent} className={`h-2 ${capacityPercent >= 90 ? '[&>[data-slot=progress-indicator]]:bg-secondary-foreground' : ''}`} />
              {isSoldOut && <p className="text-xs text-destructive mt-1.5">This event is sold out</p>}
              {!isSoldOut && capacityPercent >= 80 && (
                <p className="text-xs text-secondary-foreground mt-1.5">Almost full — {event.capacity! - event.attendeeCount} spots remaining</p>
              )}
            </Card>
          )}

          <div className="h-4" />
        </div>
      </div>
      <MobileAddToCalendarSheet open={showAddToCalendar} onClose={() => setShowAddToCalendar(false)} event={event} />
      <MobileEventCheckoutSheet
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        event={event}
        initialTicketId={selectedTicketId}
        onComplete={() => setIsRegistered(true)}
      />
      </>
    );
  }

  // ===== AGENDA SECTION =====
  if (activeSection === 'agenda') {
    const sessionTypes: Record<string, { color: string; label: string }> = {
      keynote: { color: 'bg-primary/10 border-primary/20', label: 'Keynote' },
      workshop: { color: 'bg-accent border-accent', label: 'Workshop' },
      panel: { color: 'bg-primary/5 border-primary/20', label: 'Panel' },
      break: { color: 'bg-muted border-border', label: 'Break' },
      networking: { color: 'bg-primary/10 border-primary/20', label: 'Networking' },
    };

    return (
      <div>
        {renderCompactRegistration()}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base text-card-foreground">Full Agenda</h2>
              <p className="text-xs text-muted-foreground">{event.date} · {event.time}</p>
            </div>
            {bookmarkedSessions.size > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                <BookmarkCheck className="size-3 mr-0.5" /> {bookmarkedSessions.size} saved
              </Badge>
            )}
          </div>

          {/* Session type legend */}
          {event.schedule.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {Object.entries(sessionTypes).map(([type, config]) => {
                const count = event.schedule.filter(s => s.type === type).length;
                if (count === 0) return null;
                return (
                  <Badge key={type} variant="outline" className="text-[10px] flex-shrink-0">
                    {config.label} ({count})
                  </Badge>
                );
              })}
            </div>
          )}

          {event.schedule.length > 0 ? (
            <div className="space-y-0">
              {event.schedule.map((item, idx) => {
                const isBreak = item.type === 'break';
                const typeStyle = sessionTypes[item.type || 'keynote'] || sessionTypes.keynote;
                const isExpanded = expandedSessions.has(item.id);
                const isBookmarked = bookmarkedSessions.has(item.id);
                const isLive = event.lifecycleStage === 'live' && idx === 0; // Mock first as live

                return (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex flex-col items-center w-16 flex-shrink-0">
                      <p className="text-xs text-card-foreground">{item.time}</p>
                      <p className="text-[10px] text-muted-foreground">{item.duration}</p>
                      {idx < event.schedule.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-1" />
                      )}
                    </div>

                    <div className={`flex-1 mb-3 rounded-xl border p-3 transition-all ${typeStyle.color} ${isLive ? 'ring-1 ring-destructive/30' : ''}`}>
                      <button
                        onClick={() => !isBreak && toggleSessionExpand(item.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              {isLive && (
                                <span className="relative flex size-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
                                </span>
                              )}
                              <p className="text-sm text-card-foreground">{item.title}</p>
                            </div>
                            {item.speaker && (
                              <p className="text-xs text-muted-foreground mt-0.5">{item.speaker}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant="secondary" className="text-[10px]">{typeStyle.label}</Badge>
                            {!isBreak && (
                              <ChevronDown className={`size-3.5 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      {isExpanded && !isBreak && (
                        <div className="mt-2 pt-2 border-t border-border/50 space-y-2">
                          {item.description && (
                            <p className="text-xs text-secondary-foreground">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Button
                              variant={isBookmarked ? 'default' : 'outline'}
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                              className="text-[10px] h-6"
                            >
                              {isBookmarked ? <BookmarkCheck className="size-3" /> : <Bookmark className="size-3" />}
                              {isBookmarked ? 'Saved' : 'Save'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); onOpenLeapy?.({ type: 'ask_about_event', entityId: event.id, entityData: event }); }}
                              className="text-[10px] h-6"
                            >
                              <Sparkles className="size-3 text-primary" /> Ask about this
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No agenda published yet</p>
              <p className="text-xs text-muted-foreground mt-1">Check back closer to the event date</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== SPEAKERS SECTION =====
  if (activeSection === 'speakers') {
    return (
      <div>
        {renderCompactRegistration()}
        <div className="px-4 py-4 space-y-4">
          <h2 className="text-base text-card-foreground">Speakers</h2>
          <p className="text-xs text-muted-foreground">{event.speakers.length} speaker{event.speakers.length !== 1 ? 's' : ''}</p>

          {event.speakers.length > 0 ? (
            <div className="space-y-3">
              {event.speakers.map((speaker) => {
                const isExpanded = expandedSpeaker === speaker.id;
                // Find sessions for this speaker
                const speakerSessions = event.schedule.filter(s =>
                  s.speaker?.toLowerCase().includes(speaker.name.split(' ')[0].toLowerCase())
                );

                return (
                  <Card key={speaker.id} className="p-0 gap-0 overflow-hidden">
                    <button
                      onClick={() => setExpandedSpeaker(isExpanded ? null : speaker.id)}
                      className="w-full p-4 flex items-center gap-4 text-left active:bg-muted/50 transition-all"
                    >
                      <Avatar className="size-14 flex-shrink-0">
                        <AvatarFallback className="text-sm">{speaker.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-card-foreground">{speaker.name}</p>
                        <p className="text-xs text-primary mt-0.5">{speaker.role}</p>
                        {speaker.bio && !isExpanded && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{speaker.bio}</p>
                        )}
                      </div>
                      <ChevronDown className={`size-4 text-muted-foreground flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
                        {/* Full bio */}
                        {speaker.bio && (
                          <p className="text-xs text-secondary-foreground leading-relaxed">{speaker.bio}</p>
                        )}

                        {/* Social links */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => toast('LinkedIn profile')} className="text-[10px] h-7">
                            <Linkedin className="size-3" /> LinkedIn
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toast('Twitter profile')} className="text-[10px] h-7">
                            <Twitter className="size-3" /> Twitter
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => onOpenLeapy?.({ type: 'ask_about_event', entityId: event.id, entityData: { ...event, speakerFocus: speaker.name } })} className="text-[10px] h-7">
                            <Sparkles className="size-3 text-primary" /> Ask Leapy
                          </Button>
                        </div>

                        {/* Sessions by this speaker */}
                        {speakerSessions.length > 0 && (
                          <div>
                            <p className="text-[10px] text-muted-foreground mb-1.5">Sessions</p>
                            <div className="space-y-1.5">
                              {speakerSessions.map((session) => (
                                <div key={session.id} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
                                  <Clock className="size-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs text-card-foreground flex-1">{session.title}</span>
                                  <span className="text-[10px] text-muted-foreground">{session.time}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No speakers announced yet</p>
              <p className="text-xs text-muted-foreground mt-1">Speaker lineup coming soon</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== RESOURCES SECTION =====
  if (activeSection === 'resources') {
    const resources = event.resources || [];
    const isRegisteredUser = !!event.userRegistration || isRegistered;
    const isEnded = event.lifecycleStage === 'ended';

    return (
      <div>
        {renderCompactRegistration()}
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base text-card-foreground">Resources</h2>
            {resources.length > 0 && (
              <Badge variant="secondary" className="text-[10px]">{resources.length} files</Badge>
            )}
          </div>

          {resources.length > 0 ? (
            <div className="space-y-4">
              <MobileResourceList
                resources={resources}
                canAccess={(resource) => {
                  if (resource.visibility === 'public' || !resource.visibility) return true;
                  if (resource.visibility === 'registered') return isRegisteredUser;
                  if (resource.visibility === 'post-event') return isRegisteredUser && isEnded;
                  return false;
                }}
                isPostEventUnlocked={isEnded}
              />

              {/* Not registered notice */}
              {!isRegisteredUser && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
                  <Lock className="size-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-card-foreground">Register to access resources</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Some materials require registration to download</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="size-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No resources shared yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                {event.lifecycleStage === 'ended'
                  ? 'The organizer hasn\'t uploaded materials for this event'
                  : 'Resources will be available closer to or after the event'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== REVIEWS SECTION =====
  if (activeSection === 'reviews') {
    return (
      <div>
        {renderCompactRegistration()}
        <MobileEventReviews event={event} mode="learner" />
      </div>
    );
  }

  // ─── Buy Credits Bottom Sheet ───
  if (showBuyCredits && credits) {
    return (
      <div className="fixed inset-0 z-[60] flex flex-col">
        <div className="absolute inset-0 bg-black/50" onClick={() => setShowBuyCredits(false)} />
        <div className="mt-auto relative bg-card rounded-t-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] overflow-y-auto">
          <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-card">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          <div className="px-5 pb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 bg-amber-50 rounded-full flex items-center justify-center">
                <Coins className="size-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-[16px] text-card-foreground">Buy Credits</h2>
                <p className="text-[12px] text-muted-foreground">Current balance: {credits.userBalance.toLocaleString()} credits</p>
              </div>
            </div>

            {/* Credit Packs */}
            <div className="space-y-2.5">
              {CREDIT_PACKS.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => {
                    credits!.purchasePack(pack.id);
                    toast.success(`${pack.label} Pack purchased! +${(pack.credits + pack.bonus).toLocaleString()} credits`);
                    setShowBuyCredits(false);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all active:scale-[0.98] ${
                    pack.popular ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] text-card-foreground">{pack.label}</p>
                        {pack.popular && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded">Most Popular</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Coins className="size-3.5 text-amber-500" />
                        <span className="text-[13px] text-amber-700">{pack.credits.toLocaleString()} credits</span>
                        {pack.bonus > 0 && (
                          <span className="text-[11px] text-primary">+{pack.bonus} bonus</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] text-card-foreground">${pack.price}</p>
                      <p className="text-[10px] text-muted-foreground">
                        ${(pack.price / (pack.credits + pack.bonus) * 60).toFixed(2)}/60cr
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Info */}
            <div className="mt-4 bg-muted rounded-lg p-3 flex items-start gap-2">
              <Coins className="size-3.5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground">
                Credits are used to purchase event tickets. Unused credits never expire and can be used across all LeapSpace events.
              </p>
            </div>

            <button
              onClick={() => setShowBuyCredits(false)}
              className="w-full mt-4 h-11 rounded-xl border border-border text-[14px] text-card-foreground active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
