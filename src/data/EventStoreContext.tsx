import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import {
  mockEvents,
  createDraftEvent,
  type MockEvent,
  type EventScheduleItem,
  type EventTicket,
  type EventSpeaker,
  type EventResource,
  type EventTeamMember,
  type DiscountCode,
  type EventReview,
  type EventReviewReply,
  type CustomRegistrationField,
  type NotificationRule,
  type EventWaitlistEntry,
  type EventCustomRole,
} from './mockEventData';

// ─── Types ──────────────────────────────────────────────────────
interface EventStore {
  getEvent: (id: string) => MockEvent | undefined;
  getAllEvents: () => MockEvent[];
  getEventsForUser: (email: string) => MockEvent[];
  updateEvent: (id: string, changes: Partial<MockEvent>) => void;
  resetEvent: (id: string) => void;
  createEvent: (data: Parameters<typeof createDraftEvent>[0]) => string;
  deleteEvent: (id: string) => void;
  // ─── Schedule CRUD ───
  addSession: (eventId: string, session: EventScheduleItem) => void;
  updateSession: (eventId: string, sessionId: string, changes: Partial<EventScheduleItem>) => void;
  removeSession: (eventId: string, sessionId: string) => void;
  reorderSessions: (eventId: string, fromIndex: number, toIndex: number) => void;
  // ─── Ticket CRUD ───
  addTicket: (eventId: string, ticket: EventTicket) => void;
  updateTicket: (eventId: string, ticketId: string, changes: Partial<EventTicket>) => void;
  removeTicket: (eventId: string, ticketId: string) => void;
  // ─── Speaker CRUD ───
  addSpeaker: (eventId: string, speaker: EventSpeaker) => void;
  updateSpeaker: (eventId: string, speakerId: string, changes: Partial<EventSpeaker>) => void;
  removeSpeaker: (eventId: string, speakerId: string) => void;
  // ─── Resource CRUD ───
  addResource: (eventId: string, resource: EventResource) => void;
  removeResource: (eventId: string, resourceId: string) => void;
  // ─── Review CRUD ───
  addReview: (eventId: string, review: EventReview) => void;
  updateReview: (eventId: string, reviewId: string, changes: Partial<EventReview>) => void;
  deleteReview: (eventId: string, reviewId: string) => void;
  setReviewReply: (eventId: string, reviewId: string, reply: EventReviewReply) => void;
  removeReviewReply: (eventId: string, reviewId: string) => void;
  // ─── Registration / Rules CRUD ───
  setRegistrationFields: (eventId: string, fields: CustomRegistrationField[]) => void;
  setNotificationRules: (eventId: string, rules: NotificationRule[]) => void;
  setWaitlistEntries: (eventId: string, entries: EventWaitlistEntry[]) => void;
  setCustomRoles: (eventId: string, roles: EventCustomRole[]) => void;
  // ─── Team CRUD ───
  addTeamMember: (eventId: string, member: EventTeamMember) => void;
  removeTeamMember: (eventId: string, memberId: string) => void;
  // ─── Discount Code CRUD ───
  addDiscountCode: (eventId: string, code: DiscountCode) => void;
  removeDiscountCode: (eventId: string, codeStr: string) => void;
  // ─── Lifecycle Actions ───
  publishEvent: (eventId: string) => void;
  unpublishEvent: (eventId: string) => void;
  cancelEvent: (eventId: string, reason?: string) => void;
  duplicateEvent: (eventId: string) => string | null;
}

const EventStoreContext = createContext<EventStore | null>(null);

// ─── Provider ───────────────────────────────────────────────────
export function EventStoreProvider({ children }: { children: ReactNode }) {
  // Overrides keyed by event ID — merged on top of the base mockEvents
  const [overrides, setOverrides] = useState<Record<string, Partial<MockEvent>>>({});
  // User-created events (not in mockEvents)
  const [addedEvents, setAddedEvents] = useState<MockEvent[]>([]);

  const mergeEvent = useCallback((base: MockEvent): MockEvent => {
    const o = overrides[base.id];
    if (!o) return base;
    return {
      ...base,
      ...o,
      // Deep-merge nested objects
      completionChecklist: o.completionChecklist
        ? { ...base.completionChecklist, ...o.completionChecklist } as MockEvent['completionChecklist']
        : base.completionChecklist,
      userRegistration: o.userRegistration !== undefined
        ? o.userRegistration
        : base.userRegistration,
      speakers: o.speakers ?? base.speakers,
      schedule: o.schedule ?? base.schedule,
      tickets: o.tickets ?? base.tickets,
      resources: o.resources ?? base.resources,
      reviews: o.reviews ?? base.reviews,
      customRegistrationFields: o.customRegistrationFields ?? base.customRegistrationFields,
      waitlistEntries: o.waitlistEntries ?? base.waitlistEntries,
      customRoles: o.customRoles ?? base.customRoles,
      notificationRules: o.notificationRules ?? base.notificationRules,
      teamMembers: o.teamMembers ?? base.teamMembers,
      discountCodes: o.discountCodes ?? base.discountCodes,
      tags: o.tags ?? base.tags,
    };
  }, [overrides]);

  const getEvent = useCallback((id: string): MockEvent | undefined => {
    // Check added events first
    const added = addedEvents.find(e => e.id === id);
    if (added) return mergeEvent(added);
    // Then check mock events
    const base = mockEvents.find(e => e.id === id);
    if (!base) return undefined;
    return mergeEvent(base);
  }, [mergeEvent, addedEvents]);

  const getAllEvents = useCallback((): MockEvent[] => {
    return [...mockEvents, ...addedEvents].map(mergeEvent);
  }, [mergeEvent, addedEvents]);

  // For empty@email.com, only return user-created events
  // For everyone else, return all events (mock + added)
  const getEventsForUser = useCallback((email: string): MockEvent[] => {
    if (email === 'empty@email.com') {
      return addedEvents.map(mergeEvent);
    }
    return [...mockEvents, ...addedEvents].map(mergeEvent);
  }, [mergeEvent, addedEvents]);

  const updateEvent = useCallback((id: string, changes: Partial<MockEvent>) => {
    setOverrides(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...changes },
    }));
  }, []);

  const resetEvent = useCallback((id: string) => {
    setOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const createEvent = useCallback((data: Parameters<typeof createDraftEvent>[0]): string => {
    const newEvent = createDraftEvent(data);
    setAddedEvents(prev => [...prev, newEvent]);
    return newEvent.id;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setAddedEvents(prev => prev.filter(e => e.id !== id));
    setOverrides(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const addSession = useCallback((eventId: string, session: EventScheduleItem) => {
    updateEvent(eventId, {
      schedule: [...(getEvent(eventId)?.schedule || []), session],
    });
  }, [updateEvent, getEvent]);

  const updateSession = useCallback((eventId: string, sessionId: string, changes: Partial<EventScheduleItem>) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newSchedule = event.schedule.map(s => s.id === sessionId ? { ...s, ...changes } : s);
    updateEvent(eventId, { schedule: newSchedule });
  }, [updateEvent, getEvent]);

  const removeSession = useCallback((eventId: string, sessionId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newSchedule = event.schedule.filter(s => s.id !== sessionId);
    updateEvent(eventId, { schedule: newSchedule });
  }, [updateEvent, getEvent]);

  const reorderSessions = useCallback((eventId: string, fromIndex: number, toIndex: number) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newSchedule = [...event.schedule];
    const [moved] = newSchedule.splice(fromIndex, 1);
    newSchedule.splice(toIndex, 0, moved);
    updateEvent(eventId, { schedule: newSchedule });
  }, [updateEvent, getEvent]);

  const addTicket = useCallback((eventId: string, ticket: EventTicket) => {
    updateEvent(eventId, {
      tickets: [...(getEvent(eventId)?.tickets || []), ticket],
    });
  }, [updateEvent, getEvent]);

  const updateTicket = useCallback((eventId: string, ticketId: string, changes: Partial<EventTicket>) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newTickets = (event.tickets || []).map(t => t.id === ticketId ? { ...t, ...changes } : t);
    updateEvent(eventId, { tickets: newTickets });
  }, [updateEvent, getEvent]);

  const removeTicket = useCallback((eventId: string, ticketId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newTickets = (event.tickets || []).filter(t => t.id !== ticketId);
    updateEvent(eventId, { tickets: newTickets });
  }, [updateEvent, getEvent]);

  const addSpeaker = useCallback((eventId: string, speaker: EventSpeaker) => {
    updateEvent(eventId, {
      speakers: [...(getEvent(eventId)?.speakers || []), speaker],
    });
  }, [updateEvent, getEvent]);

  const updateSpeaker = useCallback((eventId: string, speakerId: string, changes: Partial<EventSpeaker>) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newSpeakers = event.speakers.map(s => s.id === speakerId ? { ...s, ...changes } : s);
    updateEvent(eventId, { speakers: newSpeakers });
  }, [updateEvent, getEvent]);

  const removeSpeaker = useCallback((eventId: string, speakerId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newSpeakers = event.speakers.filter(s => s.id !== speakerId);
    updateEvent(eventId, { speakers: newSpeakers });
  }, [updateEvent, getEvent]);

  const addResource = useCallback((eventId: string, resource: EventResource) => {
    updateEvent(eventId, {
      resources: [...(getEvent(eventId)?.resources || []), resource],
    });
  }, [updateEvent, getEvent]);

  const removeResource = useCallback((eventId: string, resourceId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newResources = (event.resources || []).filter(r => r.id !== resourceId);
    updateEvent(eventId, { resources: newResources });
  }, [updateEvent, getEvent]);

  const addReview = useCallback((eventId: string, review: EventReview) => {
    updateEvent(eventId, {
      reviews: [...(getEvent(eventId)?.reviews || []), review],
    });
  }, [updateEvent, getEvent]);

  const updateReview = useCallback((eventId: string, reviewId: string, changes: Partial<EventReview>) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newReviews = (event.reviews || []).map(review => review.id === reviewId ? { ...review, ...changes } : review);
    updateEvent(eventId, { reviews: newReviews });
  }, [updateEvent, getEvent]);

  const deleteReview = useCallback((eventId: string, reviewId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    updateEvent(eventId, { reviews: (event.reviews || []).filter(review => review.id !== reviewId) });
  }, [updateEvent, getEvent]);

  const setReviewReply = useCallback((eventId: string, reviewId: string, reply: EventReviewReply) => {
    const event = getEvent(eventId);
    if (!event) return;
    updateEvent(eventId, {
      reviews: (event.reviews || []).map(review => review.id === reviewId ? { ...review, hostReply: reply } : review),
    });
  }, [updateEvent, getEvent]);

  const removeReviewReply = useCallback((eventId: string, reviewId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    updateEvent(eventId, {
      reviews: (event.reviews || []).map(review => review.id === reviewId ? { ...review, hostReply: undefined } : review),
    });
  }, [updateEvent, getEvent]);

  const setRegistrationFields = useCallback((eventId: string, fields: CustomRegistrationField[]) => {
    updateEvent(eventId, { customRegistrationFields: fields });
  }, [updateEvent]);

  const setNotificationRules = useCallback((eventId: string, rules: NotificationRule[]) => {
    updateEvent(eventId, { notificationRules: rules });
  }, [updateEvent]);

  const setWaitlistEntries = useCallback((eventId: string, entries: EventWaitlistEntry[]) => {
    updateEvent(eventId, { waitlistEntries: entries });
  }, [updateEvent]);

  const setCustomRoles = useCallback((eventId: string, roles: EventCustomRole[]) => {
    updateEvent(eventId, { customRoles: roles });
  }, [updateEvent]);

  const addTeamMember = useCallback((eventId: string, member: EventTeamMember) => {
    updateEvent(eventId, {
      teamMembers: [...(getEvent(eventId)?.teamMembers || []), member],
    });
  }, [updateEvent, getEvent]);

  const removeTeamMember = useCallback((eventId: string, memberId: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newTeam = (event.teamMembers || []).filter(m => m.id !== memberId);
    updateEvent(eventId, { teamMembers: newTeam });
  }, [updateEvent, getEvent]);

  const addDiscountCode = useCallback((eventId: string, code: DiscountCode) => {
    updateEvent(eventId, {
      discountCodes: [...(getEvent(eventId)?.discountCodes || []), code],
    });
  }, [updateEvent, getEvent]);

  const removeDiscountCode = useCallback((eventId: string, codeStr: string) => {
    const event = getEvent(eventId);
    if (!event) return;
    const newCodes = (event.discountCodes || []).filter(c => c.code !== codeStr);
    updateEvent(eventId, { discountCodes: newCodes });
  }, [updateEvent, getEvent]);

  const publishEvent = useCallback((eventId: string) => {
    updateEvent(eventId, {
      lifecycleStage: 'published',
      status: 'upcoming',
      isPublic: true,
    });
  }, [updateEvent]);

  const unpublishEvent = useCallback((eventId: string) => {
    updateEvent(eventId, {
      lifecycleStage: 'building',
      status: 'draft',
    });
  }, [updateEvent]);

  const cancelEvent = useCallback((eventId: string, reason?: string) => {
    updateEvent(eventId, {
      lifecycleStage: 'cancelled',
      status: 'cancelled',
      cancellationReason: reason,
    });
  }, [updateEvent]);

  const duplicateEvent = useCallback((eventId: string): string | null => {
    const event = getEvent(eventId);
    if (!event) return null;
    const newId = `evt-dup-${Date.now()}`;
    const newEvent: MockEvent = {
      ...event,
      id: newId,
      title: `${event.title} (Copy)`,
      status: 'draft',
      lifecycleStage: 'building',
      attendeeCount: 0,
      liveAttendeeCount: undefined,
      userRegistration: undefined,
      cancellationReason: undefined,
    };
    setAddedEvents(prev => [...prev, newEvent]);
    return newId;
  }, [getEvent]);

  return (
    <EventStoreContext.Provider value={{ getEvent, getAllEvents, getEventsForUser, updateEvent, resetEvent, createEvent, deleteEvent, addSession, updateSession, removeSession, reorderSessions, addTicket, updateTicket, removeTicket, addSpeaker, updateSpeaker, removeSpeaker, addResource, removeResource, addReview, updateReview, deleteReview, setReviewReply, removeReviewReply, setRegistrationFields, setNotificationRules, setWaitlistEntries, setCustomRoles, addTeamMember, removeTeamMember, addDiscountCode, removeDiscountCode, publishEvent, unpublishEvent, cancelEvent, duplicateEvent }}>
      {children}
    </EventStoreContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────
export function useEventStore(): EventStore {
  const store = useContext(EventStoreContext);
  if (!store) {
    throw new Error('useEventStore must be used within an EventStoreProvider');
  }
  return store;
}
