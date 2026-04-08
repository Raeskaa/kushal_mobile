// Mock Event Data for Mobile Prototype
// Covers all lifecycle stages, roles, registration statuses, and payment types

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // human readable
  format?: 'virtual' | 'in-person' | 'hybrid'; // legacy alias used by some mobile views
  // ─── New temporal fields ───
  endDate?: string; // YYYY-MM-DD — for multi-day events
  endTime?: string; // human readable end time
  timezone?: string; // IANA timezone e.g. "America/New_York"
  durationMinutes?: number; // explicit duration in minutes
  isMultiDay?: boolean;
  isAllDay?: boolean; // full-day events (no specific start/end times)
  // ─── Recurrence ───
  isRecurring?: boolean;
  recurrenceRule?: string; // RFC 5545 RRule string
  recurrenceEnd?: string; // YYYY-MM-DD or "after:N"
  seriesId?: string; // groups occurrences of a recurring event
  // ─── Nesting key ───
  communityId?: string; // links event to a community
  attendeeCount: number;
  capacity?: number;
  location: 'virtual' | 'in-person' | 'hybrid';
  locationDetails: string;
  virtualLink?: string; // separate field for hybrid/virtual meeting URL
  status: 'upcoming' | 'past' | 'draft' | 'cancelled';
  isPublic: boolean;
  creatorEmail: string;
  creatorName: string;
  creatorAvatar: string; // initials
  moderators: string[];

  // Taxonomy
  visibility: 'public' | 'private' | 'global' | 'shared';
  accessType: 'open' | 'waitlist' | 'screened' | 'paid';

  // Payment
  isPaid: boolean;
  price?: number;
  currency?: string;
  tickets?: EventTicket[];
  earlyBird?: { deadline: string; discountPercent: number; active: boolean };

  // Nesting
  isStandalone: boolean;
  communityName?: string;
  courseName?: string;

  // Lifecycle
  lifecycleStage: 'skeleton' | 'building' | 'ready' | 'published' | 'live' | 'ended' | 'archived' | 'cancelled';
  completionChecklist?: {
    hasTitle: boolean;
    hasDescription: boolean;
    hasDateTime: boolean;
    hasCoverImage: boolean;
    hasAgenda: boolean;
    hasTickets: boolean;
    hasSpeakers: boolean;
    hasLocation: boolean;
    hasRegistrationForm: boolean;
    hasRegistrationConfig: boolean;
  };
  cancellationReason?: string;
  liveAttendeeCount?: number;

  // Speakers
  speakers: EventSpeaker[];

  // Schedule
  schedule: EventScheduleItem[];

  // Team
  teamMembers?: EventTeamMember[];

  // Resources (expanded)
  resources?: EventResource[];

  // Reviews, registration, and operations
  reviews?: EventReview[];
  customRegistrationFields?: CustomRegistrationField[];
  waitlistEntries?: EventWaitlistEntry[];
  customRoles?: EventCustomRole[];
  notificationRules?: NotificationRule[];

  // Post-event
  recordingUrl?: string;
  recordingDuration?: string; // e.g. "1h 23m"
  hasCertificate?: boolean;

  // Registration (current user's)
  userRegistration?: {
    status: 'confirmed' | 'waitlist' | 'cancelled' | 'applied' | 'rejected' | 'cancelled-by-user';
    waitlistPosition?: number;
    ticketTier?: string;
    rejectionReason?: string;
  };

  // User's role
  userRole: 'creator' | 'moderator' | 'speaker' | 'learner' | 'anonymous';

  // Category
  category: string;
  tags: string[];

  // Metrics (computed/mock)
  pageViews?: number;
  chatMessageCount?: number;
  healthScore?: number; // 0-100
  registrationRate?: number; // percentage

  // Discount codes
  discountCodes?: DiscountCode[];
}

export interface EventTicket {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  remaining: number;
  description: string;
  perks?: string[];
}

export interface EventSpeaker {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string; // initials
  bio?: string;
  status?: 'confirmed' | 'pending' | 'declined';
  sessionIds?: string[]; // which sessions they're assigned to
}

export interface EventScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
  duration: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'panel';
  speaker?: string;
  room?: string; // room/track name
  speakerIds?: string[]; // reference speaker IDs
}

export interface EventTeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string; // initials
  bio?: string;
  status?: 'active' | 'pending' | 'declined';
}

export interface EventResource {
  id: string;
  title: string;
  url: string;
  type: 'PDF' | 'Link' | 'Video' | 'Document' | 'Slides';
  description?: string;
  fileSize?: string; // e.g. "2.4 MB"
  downloadCount?: number;
  visibility?: 'public' | 'registered' | 'post-event';
}

export interface DiscountCode {
  code: string;
  discountType?: 'percent' | 'fixed';
  discountPercent: number;
  discountAmount?: number; // fixed dollar amount
  maxUses?: number;
  remainingUses?: number;
  usedCount?: number;
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  description?: string;
}

export interface EventReviewReply {
  authorName: string;
  authorAvatar: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EventReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  isPinned?: boolean;
  isFlagged?: boolean;
  isHidden?: boolean;
  hostReply?: EventReviewReply;
}

export type RegistrationFieldType = 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'phone' | 'url';

export interface CustomRegistrationField {
  id: string;
  type: RegistrationFieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  options?: string[];
}

export interface EventWaitlistEntry {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  priority: number;
  status: 'pending' | 'approved' | 'rejected';
}

export type EventRolePermission =
  | 'edit_event'
  | 'manage_attendees'
  | 'manage_speakers'
  | 'access_analytics'
  | 'manage_settings'
  | 'manage_resources'
  | 'moderate_discussion';

export interface EventCustomRole {
  id: string;
  name: string;
  description?: string;
  permissions: EventRolePermission[];
  color?: string;
}

export interface NotificationRule {
  id: string;
  label: string;
  trigger: string;
  channel: 'email' | 'in-app' | 'push';
  timing: string;
  audience: 'attendees' | 'admins' | 'both';
  enabled: boolean;
  messageTemplate?: string;
}

// Current user for role detection
export const CURRENT_USER = {
  email: 'sarah@leapspace.io',
  name: 'Sarah Chen',
  avatar: 'SC',
};

// ─── Event Templates ──────────────────────────────────────────────
export interface EventTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  defaultDuration: string;
  defaultDurationMinutes: number; // numeric for auto-calculation
  defaultCapacity: number;
  defaultFormat: 'virtual' | 'in-person' | 'hybrid';
  defaultCategory: string;
  isPaid: boolean;
  defaultPrice?: number;
  suggestedSchedule: Omit<EventScheduleItem, 'id'>[];
}

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    id: 'tpl-workshop',
    name: 'Workshop',
    description: 'Hands-on training with live coding and Q&A',
    icon: 'Code',
    defaultDuration: '2h',
    defaultDurationMinutes: 120,
    defaultCapacity: 50,
    defaultFormat: 'virtual',
    defaultCategory: 'Technology',
    isPaid: true,
    defaultPrice: 49,
    suggestedSchedule: [
      { time: '10:00 AM', title: 'Welcome & Setup', duration: '15 min', type: 'keynote' },
      { time: '10:15 AM', title: 'Core Concepts', duration: '30 min', type: 'session' },
      { time: '10:45 AM', title: 'Hands-on Exercise', duration: '30 min', type: 'workshop' },
      { time: '11:15 AM', title: 'Break', duration: '10 min', type: 'break' },
      { time: '11:25 AM', title: 'Advanced Topics', duration: '25 min', type: 'session' },
      { time: '11:50 AM', title: 'Q&A', duration: '10 min', type: 'session' },
    ],
  },
  {
    id: 'tpl-webinar',
    name: 'Webinar',
    description: 'Live product demo with audience interaction',
    icon: 'Presentation',
    defaultDuration: '1h',
    defaultDurationMinutes: 60,
    defaultCapacity: 200,
    defaultFormat: 'virtual',
    defaultCategory: 'Business',
    isPaid: false,
    suggestedSchedule: [
      { time: '2:00 PM', title: 'Introduction', duration: '5 min', type: 'keynote' },
      { time: '2:05 PM', title: 'Main Presentation', duration: '35 min', type: 'session' },
      { time: '2:40 PM', title: 'Live Demo', duration: '10 min', type: 'workshop' },
      { time: '2:50 PM', title: 'Q&A', duration: '10 min', type: 'session' },
    ],
  },
  {
    id: 'tpl-meetup',
    name: 'Meetup',
    description: 'Casual networking with like-minded people',
    icon: 'Users',
    defaultDuration: '1h 30m',
    defaultDurationMinutes: 90,
    defaultCapacity: 50,
    defaultFormat: 'in-person',
    defaultCategory: 'Networking',
    isPaid: false,
    suggestedSchedule: [
      { time: '6:00 PM', title: 'Doors Open & Networking', duration: '15 min', type: 'break' },
      { time: '6:15 PM', title: 'Lightning Talks', duration: '30 min', type: 'session' },
      { time: '6:45 PM', title: 'Group Discussion', duration: '20 min', type: 'workshop' },
      { time: '7:05 PM', title: 'Open Networking', duration: '25 min', type: 'break' },
    ],
  },
  {
    id: 'tpl-conference',
    name: 'Conference',
    description: 'Full-day event with multiple speakers and tracks',
    icon: 'Mic',
    defaultDuration: '8h',
    defaultDurationMinutes: 480,
    defaultCapacity: 500,
    defaultFormat: 'in-person',
    defaultCategory: 'Technology',
    isPaid: true,
    defaultPrice: 99,
    suggestedSchedule: [
      { time: '9:00 AM', title: 'Registration & Coffee', duration: '30 min', type: 'break' },
      { time: '9:30 AM', title: 'Opening Keynote', duration: '45 min', type: 'keynote' },
      { time: '10:15 AM', title: 'Track Sessions', duration: '1h 30m', type: 'session' },
      { time: '12:00 PM', title: 'Lunch', duration: '1h', type: 'break' },
      { time: '1:00 PM', title: 'Workshops', duration: '2h', type: 'workshop' },
      { time: '3:00 PM', title: 'Panel Discussion', duration: '1h', type: 'session' },
      { time: '4:00 PM', title: 'Closing & Networking', duration: '1h', type: 'break' },
    ],
  },
  {
    id: 'tpl-course-session',
    name: 'Course Session',
    description: 'Structured learning with assignments and certificates',
    icon: 'GraduationCap',
    defaultDuration: '1h 30m',
    defaultDurationMinutes: 90,
    defaultCapacity: 30,
    defaultFormat: 'virtual',
    defaultCategory: 'Education',
    isPaid: true,
    defaultPrice: 29,
    suggestedSchedule: [
      { time: '10:00 AM', title: 'Lesson Overview', duration: '10 min', type: 'keynote' },
      { time: '10:10 AM', title: 'Teaching Session', duration: '40 min', type: 'session' },
      { time: '10:50 AM', title: 'Practice Exercise', duration: '25 min', type: 'workshop' },
      { time: '11:15 AM', title: 'Review & Assignment', duration: '15 min', type: 'session' },
    ],
  },
  {
    id: 'tpl-networking',
    name: 'Networking',
    description: 'Speed networking and relationship building',
    icon: 'Handshake',
    defaultDuration: '1h',
    defaultDurationMinutes: 60,
    defaultCapacity: 40,
    defaultFormat: 'hybrid',
    defaultCategory: 'Networking',
    isPaid: false,
    suggestedSchedule: [
      { time: '5:00 PM', title: 'Welcome & Icebreaker', duration: '10 min', type: 'keynote' },
      { time: '5:10 PM', title: 'Speed Networking (Round 1)', duration: '20 min', type: 'workshop' },
      { time: '5:30 PM', title: 'Speed Networking (Round 2)', duration: '20 min', type: 'workshop' },
      { time: '5:50 PM', title: 'Open Networking', duration: '10 min', type: 'break' },
    ],
  },
];

const DEFAULT_CUSTOM_ROLES: EventCustomRole[] = [
  {
    id: 'role-community-ops',
    name: 'Community Ops',
    description: 'Handles attendee experience and event logistics.',
    permissions: ['manage_attendees', 'manage_resources', 'moderate_discussion'],
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    id: 'role-program-lead',
    name: 'Program Lead',
    description: 'Owns agenda, speakers, and operational updates.',
    permissions: ['edit_event', 'manage_speakers', 'manage_settings', 'access_analytics'],
    color: 'bg-secondary text-secondary-foreground border-border',
  },
];

const DEFAULT_REGISTRATION_FIELDS: CustomRegistrationField[] = [
  {
    id: 'field-name',
    type: 'text',
    label: 'Full name',
    placeholder: 'Your full name',
    required: true,
  },
  {
    id: 'field-email',
    type: 'email',
    label: 'Email',
    placeholder: 'you@example.com',
    required: true,
  },
  {
    id: 'field-role',
    type: 'select',
    label: 'Current role',
    placeholder: 'Select one',
    required: true,
    options: ['Designer', 'Developer', 'Founder', 'Marketer', 'Student'],
  },
  {
    id: 'field-goal',
    type: 'textarea',
    label: 'What do you want to learn?',
    placeholder: 'Tell us what would make this event valuable for you',
    required: false,
  },
  {
    id: 'field-updates',
    type: 'checkbox',
    label: 'Send me future event updates',
    description: 'We occasionally share related event recommendations.',
    required: false,
  },
];

const DEFAULT_NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: 'rule-registration-confirmed',
    label: 'Registration Confirmed',
    trigger: 'registration_confirmed',
    channel: 'email',
    timing: 'Immediately',
    audience: 'attendees',
    enabled: true,
    messageTemplate: 'You are confirmed for {{eventTitle}} on {{eventDate}}.',
  },
  {
    id: 'rule-event-reminder',
    label: '24h Reminder',
    trigger: 'event_reminder',
    channel: 'email',
    timing: '24 hours before',
    audience: 'attendees',
    enabled: true,
    messageTemplate: 'Reminder: {{eventTitle}} starts tomorrow.',
  },
  {
    id: 'rule-waitlist-joined',
    label: 'Waitlist Joined',
    trigger: 'waitlist_joined',
    channel: 'in-app',
    timing: 'Immediately',
    audience: 'admins',
    enabled: true,
    messageTemplate: '{{attendeeName}} joined the waitlist for {{eventTitle}}.',
  },
  {
    id: 'rule-event-updated',
    label: 'Event Updated',
    trigger: 'event_updated',
    channel: 'push',
    timing: 'Immediately',
    audience: 'both',
    enabled: false,
    messageTemplate: '{{eventTitle}} has new details. Open the app to see what changed.',
  },
];

const DEFAULT_WAITLIST_ENTRIES: EventWaitlistEntry[] = [
  { id: 'wl-1', name: 'Avery Brooks', email: 'avery@example.com', avatar: 'AB', joinedAt: '2026-03-01', priority: 1, status: 'pending' },
  { id: 'wl-2', name: 'Nina Patel', email: 'nina@example.com', avatar: 'NP', joinedAt: '2026-03-02', priority: 2, status: 'pending' },
  { id: 'wl-3', name: 'Chris Osei', email: 'chris@example.com', avatar: 'CO', joinedAt: '2026-03-03', priority: 3, status: 'pending' },
];

const DEFAULT_REVIEWS: EventReview[] = [
  {
    id: 'rev-1',
    author: 'Alex J.',
    avatar: 'AJ',
    rating: 5,
    comment: 'Incredible event! The workshops were hands-on and practical. Learned so much about the latest techniques.',
    createdAt: '2026-03-17T09:00:00',
    helpfulCount: 12,
    isPinned: true,
    hostReply: {
      authorName: 'Sarah Chen',
      authorAvatar: 'SC',
      comment: 'Thanks Alex. We are expanding the workshop segment next time based on feedback like yours.',
      createdAt: '2026-03-17T12:15:00',
    },
  },
  {
    id: 'rev-2',
    author: 'Priya P.',
    avatar: 'PP',
    rating: 4,
    comment: 'Great content and speakers. Would love more networking time next time. The Q&A sessions were especially valuable.',
    createdAt: '2026-03-16T14:25:00',
    helpfulCount: 8,
  },
  {
    id: 'rev-3',
    author: 'Marcus W.',
    avatar: 'MW',
    rating: 5,
    comment: 'Best event I have attended this year. The organization was flawless and the speakers were top-notch.',
    createdAt: '2026-03-15T18:10:00',
    helpfulCount: 15,
    isFlagged: true,
  },
  {
    id: 'rev-4',
    author: 'Lin Z.',
    avatar: 'LZ',
    rating: 3,
    comment: 'Good overall but the virtual experience could be improved. Audio quality varied between sessions.',
    createdAt: '2026-03-15T20:30:00',
    helpfulCount: 4,
    isHidden: true,
    hostReply: {
      authorName: 'Sarah Chen',
      authorAvatar: 'SC',
      comment: 'Fair call. We are changing our live production setup for the next run.',
      createdAt: '2026-03-16T09:45:00',
    },
  },
];

// ─── Helper to create a new draft event from partial data ─────────
export function createDraftEvent(data: {
  title: string;
  description?: string;
  date?: string;
  time?: string;
  endDate?: string;
  endTime?: string;
  timezone?: string;
  durationMinutes?: number;
  isMultiDay?: boolean;
  isAllDay?: boolean;
  isRecurring?: boolean;
  recurrenceRule?: string;
  recurrenceEnd?: string;
  format?: 'virtual' | 'in-person' | 'hybrid';
  locationDetails?: string;
  virtualLink?: string; // separate field for hybrid events
  capacity?: number;
  visibility?: 'public' | 'private';
  accessType?: 'open' | 'waitlist' | 'screened' | 'paid';
  isPaid?: boolean;
  price?: number;
  category?: string;
  templateId?: string;
  creatorEmail?: string;
  creatorName?: string;
  communityId?: string;
  communityName?: string;
  tags?: string[];
}): MockEvent {
  const id = `evt-new-${Date.now()}`;
  const template = data.templateId ? EVENT_TEMPLATES.find(t => t.id === data.templateId) : undefined;

  // Build location details for hybrid (combines venue + virtual link)
  let locationDetails = data.locationDetails || '';
  if (data.format === 'hybrid' && data.virtualLink) {
    locationDetails = locationDetails ? `${locationDetails} + ${data.virtualLink}` : data.virtualLink;
  } else if (!locationDetails && data.format === 'virtual') {
    locationDetails = 'Zoom';
  }

  return {
    id,
    title: data.title,
    description: data.description || template?.description || '',
    date: data.date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: data.time || '10:00 AM EST',
    endDate: data.endDate,
    endTime: data.endTime,
    timezone: data.timezone || 'America/New_York',
    durationMinutes: data.durationMinutes || template?.defaultDurationMinutes,
    isMultiDay: data.isMultiDay || false,
    isAllDay: data.isAllDay || false,
    isRecurring: data.isRecurring || false,
    recurrenceRule: data.recurrenceRule,
    recurrenceEnd: data.recurrenceEnd,
    communityId: data.communityId,
    attendeeCount: 0,
    capacity: data.capacity || template?.defaultCapacity || 100,
    location: data.format || template?.defaultFormat || 'virtual',
    locationDetails,
    virtualLink: data.virtualLink,
    status: 'draft',
    isPublic: data.visibility !== 'private',
    creatorEmail: data.creatorEmail || 'empty@email.com',
    creatorName: data.creatorName || 'New User',
    creatorAvatar: 'NU',
    moderators: [],
    visibility: data.visibility || 'public',
    accessType: data.accessType || 'open',
    isPaid: data.isPaid || template?.isPaid || false,
    price: data.price || template?.defaultPrice,
    format: data.format || template?.defaultFormat || 'virtual',
    isStandalone: !data.communityId,
    communityName: data.communityName,
    lifecycleStage: 'skeleton',
    completionChecklist: {
      hasTitle: !!data.title,
      hasDescription: !!(data.description || template?.description),
      hasDateTime: !!(data.date && data.time),
      hasCoverImage: false,
      hasAgenda: !!template,
      hasTickets: false,
      hasSpeakers: false,
      hasLocation: !!locationDetails,
      hasRegistrationForm: false,
      hasRegistrationConfig: false,
    },
    speakers: [],
    schedule: template
      ? template.suggestedSchedule.map((s, i) => ({ ...s, id: `sch-${id}-${i}` }))
      : [],
    reviews: [],
    customRegistrationFields: DEFAULT_REGISTRATION_FIELDS,
    waitlistEntries: [],
    customRoles: DEFAULT_CUSTOM_ROLES,
    notificationRules: DEFAULT_NOTIFICATION_RULES,
    userRole: 'creator',
    category: data.category || template?.defaultCategory || 'General',
    tags: data.tags || [],
  };
}

export const mockEvents: MockEvent[] = [
  // 1. Creator's own event — Published, Virtual, Free
  {
    id: 'evt-1',
    title: 'React 18 Deep Dive Workshop',
    description: 'A hands-on workshop covering React 18 features including concurrent rendering, Suspense, and server components.',
    date: '2026-03-15',
    time: '2:00 PM EST',
    attendeeCount: 87,
    capacity: 100,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    format: 'virtual',
    isStandalone: false,
    communityName: 'React Developers Hub',
    lifecycleStage: 'published',
    speakers: [
      { id: 's1', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Senior React Engineer' },
      { id: 's2', name: 'Dan Abramov', email: 'dan@react.dev', role: 'Speaker', avatar: 'DA', bio: 'React Core Team' },
    ],
    schedule: [
      { id: 'sch1', time: '2:00 PM', title: 'Welcome & Introduction', duration: '15 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch2', time: '2:15 PM', title: 'Concurrent Rendering Deep Dive', duration: '45 min', type: 'session', speaker: 'Dan Abramov' },
      { id: 'sch3', time: '3:00 PM', title: 'Break', duration: '10 min', type: 'break' },
      { id: 'sch4', time: '3:10 PM', title: 'Hands-on Workshop', duration: '50 min', type: 'workshop', speaker: 'Sarah Chen' },
    ],
    customRegistrationFields: DEFAULT_REGISTRATION_FIELDS,
    customRoles: DEFAULT_CUSTOM_ROLES,
    notificationRules: DEFAULT_NOTIFICATION_RULES,
    reviews: DEFAULT_REVIEWS,
    userRole: 'creator',
    category: 'Technology',
    tags: ['React', 'Frontend', 'Workshop'],
    healthScore: 92,
    registrationRate: 87,
    pageViews: 1240,
    chatMessageCount: 34,
  },

  // 2. Attending — Confirmed, Paid, Community event
  {
    id: 'evt-2',
    title: 'Design System Masterclass',
    description: 'Learn how to build and maintain a scalable design system from scratch. Covers tokens, components, documentation, and governance.',
    date: '2026-03-20',
    time: '10:00 AM PST',
    attendeeCount: 156,
    capacity: 150,
    location: 'virtual',
    locationDetails: 'Google Meet',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'mahesh@leapspace.io',
    creatorName: 'Mahesh Kumar',
    creatorAvatar: 'MK',
    moderators: [],
    visibility: 'public',
    accessType: 'waitlist',
    isPaid: true,
    price: 29,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's3', name: 'Mahesh Kumar', email: 'mahesh@leapspace.io', role: 'Host', avatar: 'MK' },
    ],
    schedule: [
      { id: 'sch5', time: '10:00 AM', title: 'Design Tokens Foundation', duration: '30 min', type: 'keynote' },
      { id: 'sch6', time: '10:30 AM', title: 'Component Architecture', duration: '45 min', type: 'session' },
      { id: 'sch7', time: '11:15 AM', title: 'Break', duration: '15 min', type: 'break' },
      { id: 'sch8', time: '11:30 AM', title: 'Documentation & Governance', duration: '30 min', type: 'workshop' },
    ],
    userRegistration: { status: 'confirmed', ticketTier: 'General' },
    userRole: 'learner',
    category: 'Design',
    tags: ['Design System', 'UI', 'Components'],
    healthScore: 88,
    registrationRate: 104,
    pageViews: 3200,
    chatMessageCount: 12,
  },

  // 3. Hosting — Draft, Building stage with partial checklist
  {
    id: 'evt-3',
    title: 'Product Management Summit 2026',
    description: 'Annual summit bringing together product leaders to discuss trends, frameworks, and career growth.',
    date: '2026-04-10',
    time: '9:00 AM EST',
    attendeeCount: 0,
    capacity: 200,
    location: 'hybrid',
    locationDetails: 'TechHub, New York + Virtual',
    status: 'draft',
    isPublic: false,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['alex@leapspace.io'],
    visibility: 'private',
    accessType: 'screened',
    isPaid: true,
    price: 149,
    currency: 'USD',
    tickets: [
      { id: 't1', name: 'Early Bird', price: 99, currency: 'USD', quantity: 50, remaining: 50, description: 'Discounted early access', perks: ['All sessions', 'Networking lunch'] },
      { id: 't2', name: 'General', price: 149, currency: 'USD', quantity: 100, remaining: 100, description: 'Standard admission', perks: ['All sessions', 'Networking lunch', 'Workshop access'] },
      { id: 't3', name: 'VIP', price: 299, currency: 'USD', quantity: 20, remaining: 20, description: 'Premium experience', perks: ['All sessions', 'VIP dinner', 'Workshop access', '1:1 mentoring'] },
    ],
    earlyBird: { deadline: '2026-03-15', discountPercent: 20, active: true },
    isStandalone: true,
    lifecycleStage: 'building',
    completionChecklist: {
      hasTitle: true,
      hasDescription: true,
      hasDateTime: true,
      hasCoverImage: false,
      hasAgenda: false,
      hasTickets: true,
      hasSpeakers: false,
      hasLocation: true,
      hasRegistrationForm: false,
      hasRegistrationConfig: false,
    },
    speakers: [],
    schedule: [],
    userRole: 'creator',
    category: 'Business',
    tags: ['Product Management', 'Leadership', 'Summit'],
  },

  // 4. Discover — Open, Free, In-person
  {
    id: 'evt-4',
    title: 'AI/ML Networking Mixer',
    description: 'Casual networking event for AI and ML practitioners. Share ideas, find collaborators, and enjoy good conversation.',
    date: '2026-03-25',
    time: '6:00 PM PST',
    attendeeCount: 45,
    capacity: 60,
    location: 'in-person',
    locationDetails: 'WeWork, San Francisco',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'james@leapspace.io',
    creatorName: 'James Wilson',
    creatorAvatar: 'JW',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's4', name: 'James Wilson', email: 'james@leapspace.io', role: 'Host', avatar: 'JW' },
    ],
    schedule: [
      { id: 'sch9', time: '6:00 PM', title: 'Doors Open & Welcome', duration: '30 min', type: 'break' },
      { id: 'sch10', time: '6:30 PM', title: 'Lightning Talks', duration: '45 min', type: 'session' },
      { id: 'sch11', time: '7:15 PM', title: 'Open Networking', duration: '90 min', type: 'break' },
    ],
    userRole: 'learner',
    category: 'Technology',
    tags: ['AI', 'ML', 'Networking'],
    healthScore: 78,
    registrationRate: 64,
    pageViews: 890,
  },

  // 5. Past event — With recording + resources
  {
    id: 'evt-5',
    title: 'Startup Pitch Night',
    description: 'Watch 10 early-stage startups pitch to a panel of investors and industry experts.',
    date: '2026-01-20',
    time: '7:00 PM EST',
    attendeeCount: 120,
    capacity: 150,
    location: 'hybrid',
    locationDetails: 'Innovation Center, NYC + Livestream',
    status: 'past',
    isPublic: true,
    creatorEmail: 'mahesh@leapspace.io',
    creatorName: 'Mahesh Kumar',
    creatorAvatar: 'MK',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    format: 'hybrid',
    isStandalone: true,
    lifecycleStage: 'ended',
    speakers: [
      { id: 's5', name: 'Mahesh Kumar', email: 'mahesh@leapspace.io', role: 'Host', avatar: 'MK' },
      { id: 's6', name: 'Lisa Park', email: 'lisa@vc.com', role: 'Speaker', avatar: 'LP' },
    ],
    schedule: [],
    recordingUrl: 'https://example.com/recording',
    recordingDuration: '1h 23m',
    resources: [
      { id: 'r1', title: 'Pitch Deck Template', url: '#', type: 'PDF' },
      { id: 'r2', title: 'Investor Contacts', url: '#', type: 'Link' },
    ],
    reviews: DEFAULT_REVIEWS,
    hasCertificate: true,
    userRegistration: { status: 'confirmed' },
    userRole: 'learner',
    category: 'Business',
    tags: ['Startups', 'Pitch', 'Investors'],
    healthScore: 95,
    registrationRate: 100,
    pageViews: 4500,
    chatMessageCount: 78,
  },

  // 6. Applied — Screened access, pending review
  {
    id: 'evt-6',
    title: 'SEO & Content Marketing Workshop',
    description: 'Advanced SEO strategies and content marketing tactics for growth-stage companies.',
    date: '2026-04-05',
    time: '1:00 PM EST',
    attendeeCount: 34,
    capacity: 40,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'emma@leapspace.io',
    creatorName: 'Emma Rodriguez',
    creatorAvatar: 'ER',
    moderators: [],
    visibility: 'public',
    accessType: 'screened',
    isPaid: false,
    format: 'virtual',
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's7', name: 'Emma Rodriguez', email: 'emma@leapspace.io', role: 'Host', avatar: 'ER' },
    ],
    schedule: [],
    userRegistration: { status: 'applied' },
    userRole: 'learner',
    category: 'Marketing',
    tags: ['SEO', 'Content Marketing'],
  },

  // 7. Waitlisted
  {
    id: 'evt-7',
    title: 'API Design Masterclass',
    description: 'Comprehensive guide to designing RESTful and GraphQL APIs that developers love.',
    date: '2026-04-12',
    time: '11:00 AM PST',
    attendeeCount: 80,
    capacity: 80,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'mahesh@leapspace.io',
    creatorName: 'Mahesh Kumar',
    creatorAvatar: 'MK',
    moderators: [],
    visibility: 'public',
    accessType: 'waitlist',
    isPaid: true,
    price: 39,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's8', name: 'Mahesh Kumar', email: 'mahesh@leapspace.io', role: 'Host', avatar: 'MK' },
    ],
    schedule: [],
    userRegistration: { status: 'waitlist', waitlistPosition: 3 },
    userRole: 'learner',
    category: 'Technology',
    tags: ['API', 'REST', 'GraphQL'],
  },

  // 8. LIVE event
  {
    id: 'evt-8',
    title: 'React Summit 2026',
    description: 'The biggest React conference of the year, featuring talks from core team members and community leaders.',
    date: '2026-02-19',
    time: '9:00 AM EST',
    attendeeCount: 312,
    capacity: 500,
    location: 'virtual',
    locationDetails: 'Livestream',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'alex@leapspace.io',
    creatorName: 'Alex Thompson',
    creatorAvatar: 'AT',
    moderators: [],
    visibility: 'global',
    accessType: 'open',
    isPaid: false,
    isStandalone: true,
    lifecycleStage: 'live',
    liveAttendeeCount: 312,
    speakers: [
      { id: 's9', name: 'Alex Thompson', email: 'alex@leapspace.io', role: 'Host', avatar: 'AT' },
      { id: 's10', name: 'Sophie Miller', email: 'sophie@react.dev', role: 'Speaker', avatar: 'SM' },
    ],
    schedule: [
      { id: 'sch12', time: '9:00 AM', title: 'Opening Keynote', duration: '30 min', type: 'keynote', speaker: 'Alex Thompson' },
      { id: 'sch13', time: '9:30 AM', title: 'React Server Components', duration: '45 min', type: 'session', speaker: 'Sophie Miller' },
      { id: 'sch14', time: '10:15 AM', title: 'Break', duration: '15 min', type: 'break' },
      { id: 'sch15', time: '10:30 AM', title: 'State Management in 2026', duration: '45 min', type: 'session' },
    ],
    userRegistration: { status: 'confirmed' },
    userRole: 'learner',
    category: 'Technology',
    tags: ['React', 'Conference', 'Frontend'],
    healthScore: 97,
    registrationRate: 78,
    pageViews: 8900,
    chatMessageCount: 245,
  },

  // 9. Rejected
  {
    id: 'evt-9',
    title: 'Leadership Retreat 2026',
    description: 'Exclusive retreat for senior leaders to discuss strategy, innovation, and organizational growth.',
    date: '2026-05-01',
    time: '10:00 AM EST',
    attendeeCount: 25,
    capacity: 30,
    location: 'in-person',
    locationDetails: 'Mountain Resort, Colorado',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'james@leapspace.io',
    creatorName: 'James Wilson',
    creatorAvatar: 'JW',
    moderators: [],
    visibility: 'public',
    accessType: 'screened',
    isPaid: true,
    price: 499,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's11', name: 'James Wilson', email: 'james@leapspace.io', role: 'Host', avatar: 'JW' },
    ],
    schedule: [],
    userRegistration: { status: 'rejected', rejectionReason: 'This event is limited to VP-level and above.' },
    userRole: 'learner',
    category: 'Business',
    tags: ['Leadership', 'Retreat'],
  },

  // 10. Cancelled event
  {
    id: 'evt-10',
    title: 'Growth Hacking Bootcamp',
    description: 'Intensive 2-day bootcamp on growth hacking strategies for SaaS companies.',
    date: '2026-03-28',
    time: '9:00 AM PST',
    attendeeCount: 42,
    capacity: 60,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'cancelled',
    isPublic: true,
    creatorEmail: 'emma@leapspace.io',
    creatorName: 'Emma Rodriguez',
    creatorAvatar: 'ER',
    moderators: [],
    visibility: 'public',
    accessType: 'paid',
    isPaid: true,
    price: 79,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'cancelled',
    cancellationReason: 'Speaker unavailable due to scheduling conflict. Full refunds have been issued.',
    speakers: [],
    schedule: [],
    userRegistration: { status: 'confirmed' },
    userRole: 'learner',
    category: 'Marketing',
    tags: ['Growth Hacking', 'SaaS'],
  },

  // 11. Speaker role (not creator)
  {
    id: 'evt-11',
    title: 'DevOps Pipeline Workshop',
    description: 'Build CI/CD pipelines from scratch using GitHub Actions, Docker, and Kubernetes.',
    date: '2026-04-18',
    time: '3:00 PM EST',
    attendeeCount: 56,
    capacity: 75,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'alex@leapspace.io',
    creatorName: 'Alex Thompson',
    creatorAvatar: 'AT',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'DevOps Community',
    lifecycleStage: 'published',
    speakers: [
      { id: 's12', name: 'Alex Thompson', email: 'alex@leapspace.io', role: 'Host', avatar: 'AT' },
      { id: 's13', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Speaker', avatar: 'SC', bio: 'DevOps Specialist' },
    ],
    schedule: [
      { id: 'sch16', time: '3:00 PM', title: 'Intro to CI/CD', duration: '20 min', type: 'keynote', speaker: 'Alex Thompson' },
      { id: 'sch17', time: '3:20 PM', title: 'GitHub Actions Deep Dive', duration: '40 min', type: 'workshop', speaker: 'Sarah Chen' },
      { id: 'sch18', time: '4:00 PM', title: 'Docker & K8s Pipeline', duration: '40 min', type: 'session', speaker: 'Sarah Chen' },
    ],
    userRole: 'speaker',
    category: 'Technology',
    tags: ['DevOps', 'CI/CD', 'Docker'],
    healthScore: 85,
    registrationRate: 72,
    pageViews: 1560,
    chatMessageCount: 19,
  },

  // 12. Skeleton draft — very early stage
  {
    id: 'evt-12',
    title: 'Intro to Product Thinking',
    description: '',
    date: '2026-05-10',
    time: '',
    attendeeCount: 0,
    location: 'virtual',
    locationDetails: '',
    status: 'draft',
    isPublic: false,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'private',
    accessType: 'open',
    isPaid: false,
    isStandalone: true,
    lifecycleStage: 'skeleton',
    completionChecklist: {
      hasTitle: true,
      hasDescription: false,
      hasDateTime: false,
      hasCoverImage: false,
      hasAgenda: false,
      hasTickets: false,
      hasSpeakers: false,
      hasLocation: false,
      hasRegistrationForm: false,
      hasRegistrationConfig: false,
    },
    speakers: [],
    schedule: [],
    userRole: 'creator',
    category: 'Business',
    tags: ['Product'],
  },

  // 13. Sold out event with active waitlist
  {
    id: 'evt-13',
    title: 'Full-Stack AI Bootcamp',
    description: 'Build production-ready AI applications using Python, TensorFlow, and React. Includes hands-on projects.',
    date: '2026-04-22',
    time: '10:00 AM EST',
    attendeeCount: 63,
    capacity: 60,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'mahesh@leapspace.io',
    creatorName: 'Mahesh Kumar',
    creatorAvatar: 'MK',
    moderators: [],
    visibility: 'public',
    accessType: 'waitlist',
    isPaid: true,
    price: 99,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's14', name: 'Mahesh Kumar', email: 'mahesh@leapspace.io', role: 'Host', avatar: 'MK' },
    ],
    schedule: [],
    userRole: 'learner',
    category: 'Technology',
    tags: ['AI', 'Full-Stack', 'Bootcamp'],
  },

  // 14. Just ended — no materials yet
  {
    id: 'evt-14',
    title: 'ML Workshop: Data to Deployment',
    description: 'End-to-end ML workflow from data preparation to model deployment in production.',
    date: '2026-02-18',
    time: '2:00 PM PST',
    attendeeCount: 78,
    capacity: 100,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'past',
    isPublic: true,
    creatorEmail: 'james@leapspace.io',
    creatorName: 'James Wilson',
    creatorAvatar: 'JW',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: true,
    lifecycleStage: 'ended',
    speakers: [
      { id: 's15', name: 'James Wilson', email: 'james@leapspace.io', role: 'Host', avatar: 'JW' },
    ],
    schedule: [],
    userRegistration: { status: 'confirmed' },
    userRole: 'learner',
    category: 'Technology',
    tags: ['ML', 'Data Science'],
    healthScore: 91,
    registrationRate: 88,
    pageViews: 2100,
    chatMessageCount: 56,
    recordingDuration: '1h 45m',
  },

  // 15. Multi-ticket event with early bird + discount
  {
    id: 'evt-15',
    title: 'Data Science Bootcamp',
    description: 'Comprehensive bootcamp covering statistics, Python, SQL, and machine learning fundamentals.',
    date: '2026-04-28',
    time: '9:00 AM EST',
    attendeeCount: 120,
    capacity: 200,
    location: 'hybrid',
    locationDetails: 'Tech Campus, Austin + Virtual',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'emma@leapspace.io',
    creatorName: 'Emma Rodriguez',
    creatorAvatar: 'ER',
    moderators: [],
    visibility: 'public',
    accessType: 'paid',
    isPaid: true,
    price: 79,
    currency: 'USD',
    tickets: [
      { id: 't4', name: 'Virtual', price: 49, currency: 'USD', quantity: 100, remaining: 62, description: 'Virtual access', perks: ['All sessions', 'Recording access'] },
      { id: 't5', name: 'In-Person', price: 149, currency: 'USD', quantity: 80, remaining: 35, description: 'In-person + virtual', perks: ['All sessions', 'Lunch', 'Swag bag', 'Networking'] },
      { id: 't6', name: 'VIP', price: 299, currency: 'USD', quantity: 20, remaining: 5, description: 'Premium all-access', perks: ['Everything in In-Person', '1:1 mentoring', 'Priority seating', 'After-party'] },
    ],
    earlyBird: { deadline: '2026-03-28', discountPercent: 25, active: true },
    isStandalone: true,
    lifecycleStage: 'published',
    speakers: [
      { id: 's16', name: 'Emma Rodriguez', email: 'emma@leapspace.io', role: 'Host', avatar: 'ER' },
      { id: 's17', name: 'David Kim', email: 'david@data.io', role: 'Speaker', avatar: 'DK' },
    ],
    schedule: [
      { id: 'sch19', time: '9:00 AM', title: 'Opening & Orientation', duration: '30 min', type: 'keynote' },
      { id: 'sch20', time: '9:30 AM', title: 'Python for Data Science', duration: '60 min', type: 'workshop' },
      { id: 'sch21', time: '10:30 AM', title: 'Break', duration: '15 min', type: 'break' },
      { id: 'sch22', time: '10:45 AM', title: 'SQL Fundamentals', duration: '45 min', type: 'session' },
      { id: 'sch23', time: '11:30 AM', title: 'ML Hands-on Lab', duration: '60 min', type: 'workshop' },
    ],
    userRole: 'learner',
    category: 'Technology',
    tags: ['Data Science', 'Python', 'ML'],
    healthScore: 82,
    registrationRate: 95,
    pageViews: 1870,
    chatMessageCount: 42,
  },

  // 16. Ready-to-publish draft (admin) — all checklist items complete
  {
    id: 'evt-16',
    title: 'TypeScript Advanced Patterns Workshop',
    description: 'Master advanced TypeScript patterns including conditional types, mapped types, template literals, and type-safe API design.',
    date: '2026-05-20',
    time: '11:00 AM EST',
    endTime: '1:00 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 120,
    attendeeCount: 0,
    capacity: 60,
    location: 'virtual',
    locationDetails: 'Zoom',
    virtualLink: 'https://zoom.us/j/typescript-patterns',
    status: 'draft',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'public',
    accessType: 'paid',
    isPaid: true,
    price: 49,
    currency: 'USD',
    format: 'virtual',
    tickets: [
      { id: 't7', name: 'General', price: 49, currency: 'USD', quantity: 60, remaining: 60, description: 'Full workshop access', perks: ['Live coding', 'Recording', 'GitHub repo'] },
    ],
    isStandalone: false,
    communityName: 'React Developers Hub',
    lifecycleStage: 'ready',
    completionChecklist: {
      hasTitle: true,
      hasDescription: true,
      hasDateTime: true,
      hasCoverImage: true,
      hasAgenda: true,
      hasTickets: true,
      hasSpeakers: true,
      hasLocation: true,
      hasRegistrationForm: true,
      hasRegistrationConfig: true,
    },
    speakers: [
      { id: 's18', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Senior TypeScript Engineer' },
    ],
    schedule: [
      { id: 'sch24', time: '11:00 AM', title: 'Welcome & Setup', description: 'Ensure everyone has the repo cloned', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch25', time: '11:10 AM', title: 'Conditional & Mapped Types', description: 'Deep dive into advanced type system features', duration: '40 min', type: 'session', speaker: 'Sarah Chen' },
      { id: 'sch26', time: '11:50 AM', title: 'Break', duration: '10 min', type: 'break' },
      { id: 'sch27', time: '12:00 PM', title: 'Type-Safe API Design', description: 'Build fully typed REST and GraphQL clients', duration: '40 min', type: 'workshop', speaker: 'Sarah Chen' },
      { id: 'sch28', time: '12:40 PM', title: 'Q&A & Wrap-up', duration: '20 min', type: 'session', speaker: 'Sarah Chen' },
    ],
    resources: [
      { id: 'r3', title: 'Workshop Repo (GitHub)', url: '#', type: 'Link' },
      { id: 'r4', title: 'TypeScript Cheat Sheet.pdf', url: '#', type: 'PDF' },
    ],
    teamMembers: [
      { id: 'tm1', name: 'Marcus Johnson', email: 'marcus@leapspace.io', role: 'Support', avatar: 'MJ', bio: 'Community moderator' },
    ],
    customRegistrationFields: DEFAULT_REGISTRATION_FIELDS,
    customRoles: DEFAULT_CUSTOM_ROLES,
    notificationRules: DEFAULT_NOTIFICATION_RULES,
    discountCodes: [
      { code: 'EARLYBIRD', discountPercent: 20, maxUses: 20, remainingUses: 20, description: 'Early bird 20% off' },
    ],
    userRole: 'creator',
    category: 'Technology',
    tags: ['TypeScript', 'Advanced', 'Workshop'],
    healthScore: 92,
  },

  // 17. Admin-owned LIVE event (creator is current user)
  {
    id: 'evt-17',
    title: 'LeapSpace Community Town Hall',
    description: 'Monthly town hall for the LeapSpace community. Product updates, Q&A with the team, and open discussion.',
    date: '2026-02-26',
    time: '3:00 PM EST',
    endTime: '4:30 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 90,
    attendeeCount: 145,
    capacity: 300,
    location: 'virtual',
    locationDetails: 'Zoom Webinar',
    virtualLink: 'https://zoom.us/j/leapspace-townhall',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['alex@leapspace.io'],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: true,
    lifecycleStage: 'live',
    liveAttendeeCount: 89,
    chatMessageCount: 47,
    speakers: [
      { id: 's19', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Product Lead' },
      { id: 's20', name: 'Alex Thompson', email: 'alex@leapspace.io', role: 'Speaker', avatar: 'AT', bio: 'Engineering Lead' },
    ],
    schedule: [
      { id: 'sch29', time: '3:00 PM', title: 'Welcome & Introductions', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch30', time: '3:10 PM', title: 'Product Roadmap Update', description: 'What we shipped this month and what\'s coming next', duration: '25 min', type: 'session', speaker: 'Sarah Chen' },
      { id: 'sch31', time: '3:35 PM', title: 'Engineering Deep Dive', description: 'Behind the scenes of our latest features', duration: '20 min', type: 'session', speaker: 'Alex Thompson' },
      { id: 'sch32', time: '3:55 PM', title: 'Open Q&A', duration: '30 min', type: 'workshop' },
      { id: 'sch33', time: '4:25 PM', title: 'Wrap-up & Next Steps', duration: '5 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    userRole: 'creator',
    category: 'Business',
    tags: ['Town Hall', 'Community', 'Product Updates'],
    pageViews: 423,
    registrationRate: 48,
    healthScore: 85,
  },

  // 18. Admin-owned ended event (post-event admin view)
  {
    id: 'evt-18',
    title: 'Frontend Architecture Workshop',
    description: 'Deep dive into modern frontend architecture patterns including micro-frontends, module federation, and monorepo strategies.',
    date: '2026-02-10',
    time: '10:00 AM EST',
    endTime: '12:00 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 120,
    attendeeCount: 67,
    capacity: 80,
    location: 'virtual',
    locationDetails: 'Google Meet',
    status: 'past',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'React Developers Hub',
    lifecycleStage: 'ended',
    speakers: [
      { id: 's21', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Frontend Architect' },
      { id: 's22', name: 'Priya Sharma', email: 'priya@frontend.io', role: 'Speaker', avatar: 'PS', bio: 'Micro-frontend specialist' },
    ],
    schedule: [
      { id: 'sch34', time: '10:00 AM', title: 'Welcome', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch35', time: '10:10 AM', title: 'Architecture Patterns Overview', duration: '40 min', type: 'session', speaker: 'Priya Sharma' },
      { id: 'sch36', time: '10:50 AM', title: 'Break', duration: '10 min', type: 'break' },
      { id: 'sch37', time: '11:00 AM', title: 'Hands-on: Module Federation', duration: '50 min', type: 'workshop', speaker: 'Sarah Chen' },
    ],
    recordingUrl: 'https://example.com/frontend-arch-recording',
    recordingDuration: '1h 52m',
    resources: [
      { id: 'r5', title: 'Architecture Decision Records.pdf', url: '#', type: 'PDF' },
      { id: 'r6', title: 'Workshop Code Repo', url: '#', type: 'Link' },
      { id: 'r7', title: 'Slide Deck', url: '#', type: 'Document' },
    ],
    hasCertificate: true,
    userRole: 'creator',
    category: 'Technology',
    tags: ['Frontend', 'Architecture', 'Workshop'],
    pageViews: 312,
    registrationRate: 84,
    healthScore: 91,
  },

  // 19. Admin-owned cancelled event
  {
    id: 'evt-19',
    title: 'Advanced CSS Animations Workshop',
    description: 'Learn to create stunning CSS animations and transitions. From basics to GPU-accelerated 3D transforms.',
    date: '2026-03-05',
    time: '2:00 PM EST',
    attendeeCount: 38,
    capacity: 50,
    location: 'virtual',
    locationDetails: 'Zoom',
    status: 'cancelled',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'public',
    accessType: 'paid',
    isPaid: true,
    price: 39,
    currency: 'USD',
    isStandalone: true,
    lifecycleStage: 'cancelled',
    cancellationReason: 'Rescheduling to accommodate a larger venue. All ticket holders will receive a full refund and priority access to the rescheduled date.',
    speakers: [
      { id: 's23', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC' },
    ],
    schedule: [],
    userRole: 'creator',
    category: 'Design',
    tags: ['CSS', 'Animations', 'Frontend'],
  },

  // ═══════════════════════════════════════════════════════════════════
  // RECURRING EVENTS — Admin-owned series: "Frontend Office Hours"
  // ═══════════════════════════════════════════════════════════════════

  // 20. Recurring — Past occurrence (ended, occurrence 4 of 12)
  {
    id: 'evt-20',
    title: 'Frontend Office Hours',
    description: 'Weekly drop-in session for frontend developers. Bring your questions, code reviews, and debugging challenges. Open to all skill levels.',
    date: '2026-02-18',
    time: '4:00 PM EST',
    endTime: '5:00 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 60,
    isRecurring: true,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;COUNT=12',
    recurrenceEnd: 'after:12',
    seriesId: 'series-frontend-oh',
    attendeeCount: 34,
    capacity: 50,
    location: 'virtual',
    locationDetails: 'Google Meet',
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    status: 'past',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['alex@leapspace.io'],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'React Developers Hub',
    communityId: 'comm-react',
    lifecycleStage: 'ended',
    speakers: [
      { id: 's-oh1', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Senior Frontend Engineer' },
    ],
    schedule: [
      { id: 'sch-oh1', time: '4:00 PM', title: 'Welcome & Announcements', duration: '5 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch-oh2', time: '4:05 PM', title: 'Code Review Slot', duration: '20 min', type: 'workshop' },
      { id: 'sch-oh3', time: '4:25 PM', title: 'Open Q&A', duration: '25 min', type: 'session' },
      { id: 'sch-oh4', time: '4:50 PM', title: 'Wrap-up & Next Week Preview', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    userRole: 'creator',
    category: 'Technology',
    tags: ['Frontend', 'Office Hours', 'Weekly', 'Q&A'],
    pageViews: 189,
    registrationRate: 68,
    healthScore: 78,
    recordingUrl: 'https://example.com/recording-oh4',
    recordingDuration: '58m',
  },

  // 21. Recurring — Next upcoming occurrence (published, occurrence 5 of 12)
  {
    id: 'evt-21',
    title: 'Frontend Office Hours',
    description: 'Weekly drop-in session for frontend developers. Bring your questions, code reviews, and debugging challenges. Open to all skill levels.',
    date: '2026-02-25',
    time: '4:00 PM EST',
    endTime: '5:00 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 60,
    isRecurring: true,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;COUNT=12',
    recurrenceEnd: 'after:12',
    seriesId: 'series-frontend-oh',
    attendeeCount: 41,
    capacity: 50,
    location: 'virtual',
    locationDetails: 'Google Meet',
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['alex@leapspace.io'],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'React Developers Hub',
    communityId: 'comm-react',
    lifecycleStage: 'published',
    speakers: [
      { id: 's-oh1b', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Senior Frontend Engineer' },
    ],
    schedule: [
      { id: 'sch-oh5', time: '4:00 PM', title: 'Welcome & Announcements', duration: '5 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch-oh6', time: '4:05 PM', title: 'Code Review Slot', duration: '20 min', type: 'workshop' },
      { id: 'sch-oh7', time: '4:25 PM', title: 'Open Q&A', duration: '25 min', type: 'session' },
      { id: 'sch-oh8', time: '4:50 PM', title: 'Wrap-up & Next Week Preview', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    userRole: 'creator',
    category: 'Technology',
    tags: ['Frontend', 'Office Hours', 'Weekly', 'Q&A'],
    pageViews: 156,
    registrationRate: 82,
    healthScore: 88,
  },

  // 22. Recurring — Future occurrence (published, occurrence 6 of 12)
  {
    id: 'evt-22',
    title: 'Frontend Office Hours',
    description: 'Weekly drop-in session for frontend developers. Bring your questions, code reviews, and debugging challenges. Open to all skill levels.',
    date: '2026-03-04',
    time: '4:00 PM EST',
    endTime: '5:00 PM EST',
    timezone: 'America/New_York',
    durationMinutes: 60,
    isRecurring: true,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE;COUNT=12',
    recurrenceEnd: 'after:12',
    seriesId: 'series-frontend-oh',
    attendeeCount: 28,
    capacity: 50,
    location: 'virtual',
    locationDetails: 'Google Meet',
    virtualLink: 'https://meet.google.com/abc-defg-hij',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['alex@leapspace.io'],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'React Developers Hub',
    communityId: 'comm-react',
    lifecycleStage: 'published',
    speakers: [
      { id: 's-oh1c', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'Senior Frontend Engineer' },
    ],
    schedule: [
      { id: 'sch-oh9', time: '4:00 PM', title: 'Welcome & Announcements', duration: '5 min', type: 'keynote', speaker: 'Sarah Chen' },
      { id: 'sch-oh10', time: '4:05 PM', title: 'Code Review Slot', duration: '20 min', type: 'workshop' },
      { id: 'sch-oh11', time: '4:25 PM', title: 'Open Q&A', duration: '25 min', type: 'session' },
      { id: 'sch-oh12', time: '4:50 PM', title: 'Wrap-up & Next Week Preview', duration: '10 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    userRole: 'creator',
    category: 'Technology',
    tags: ['Frontend', 'Office Hours', 'Weekly', 'Q&A'],
    pageViews: 67,
    registrationRate: 56,
    healthScore: 80,
  },

  // ═══════════════════════════════════════════════════════════════════
  // RECURRING EVENTS — Learner-attending series: "Data Science Study Group"
  // ═══════════════════════════════════════════════════════════════════

  // 23. Recurring learner — Past occurrence attended (occurrence 3 of 8)
  {
    id: 'evt-23',
    title: 'Data Science Study Group',
    description: 'Bi-weekly study group covering data science fundamentals. Each session focuses on a different topic with hands-on exercises and peer discussion.',
    date: '2026-02-12',
    time: '6:00 PM PST',
    endTime: '7:30 PM PST',
    timezone: 'America/Los_Angeles',
    durationMinutes: 90,
    isRecurring: true,
    recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH;COUNT=8',
    recurrenceEnd: 'after:8',
    seriesId: 'series-ds-study',
    attendeeCount: 24,
    capacity: 30,
    location: 'virtual',
    locationDetails: 'Zoom',
    virtualLink: 'https://zoom.us/j/ds-study-group',
    status: 'past',
    isPublic: true,
    creatorEmail: 'maria@datacamp.io',
    creatorName: 'Maria Gonzalez',
    creatorAvatar: 'MG',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'Data Science Collective',
    communityId: 'comm-ds',
    lifecycleStage: 'ended',
    speakers: [
      { id: 's-ds1', name: 'Maria Gonzalez', email: 'maria@datacamp.io', role: 'Host', avatar: 'MG', bio: 'Data Science Lead @ DataCamp' },
      { id: 's-ds2', name: 'Raj Patel', email: 'raj@ml.io', role: 'Speaker', avatar: 'RP', bio: 'ML Engineer' },
    ],
    schedule: [
      { id: 'sch-ds1', time: '6:00 PM', title: 'Recap & Check-in', duration: '10 min', type: 'keynote', speaker: 'Maria Gonzalez' },
      { id: 'sch-ds2', time: '6:10 PM', title: 'Topic Deep Dive: Feature Engineering', duration: '30 min', type: 'session', speaker: 'Raj Patel' },
      { id: 'sch-ds3', time: '6:40 PM', title: 'Hands-on Exercise', duration: '30 min', type: 'workshop' },
      { id: 'sch-ds4', time: '7:10 PM', title: 'Peer Discussion & Q&A', duration: '20 min', type: 'panel' },
    ],
    userRole: 'learner',
    userRegistration: { status: 'confirmed', ticketTier: 'Free' },
    category: 'Data Science',
    tags: ['Data Science', 'Study Group', 'Bi-weekly'],
    recordingUrl: 'https://example.com/recording-ds3',
    recordingDuration: '1h 28m',
    resources: [
      { id: 'res-ds1', title: 'Feature Engineering Notebook', url: '#', type: 'Document', downloadCount: 18, visibility: 'registered' },
      { id: 'res-ds2', title: 'Dataset: House Prices', url: '#', type: 'Link', downloadCount: 22, visibility: 'registered' },
    ],
  },

  // 24. Recurring learner — Next upcoming occurrence (occurrence 4 of 8)
  {
    id: 'evt-24',
    title: 'Data Science Study Group',
    description: 'Bi-weekly study group covering data science fundamentals. Each session focuses on a different topic with hands-on exercises and peer discussion.',
    date: '2026-02-26',
    time: '6:00 PM PST',
    endTime: '7:30 PM PST',
    timezone: 'America/Los_Angeles',
    durationMinutes: 90,
    isRecurring: true,
    recurrenceRule: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=TH;COUNT=8',
    recurrenceEnd: 'after:8',
    seriesId: 'series-ds-study',
    attendeeCount: 22,
    capacity: 30,
    location: 'virtual',
    locationDetails: 'Zoom',
    virtualLink: 'https://zoom.us/j/ds-study-group',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'maria@datacamp.io',
    creatorName: 'Maria Gonzalez',
    creatorAvatar: 'MG',
    moderators: [],
    visibility: 'public',
    accessType: 'open',
    isPaid: false,
    isStandalone: false,
    communityName: 'Data Science Collective',
    communityId: 'comm-ds',
    lifecycleStage: 'published',
    speakers: [
      { id: 's-ds1b', name: 'Maria Gonzalez', email: 'maria@datacamp.io', role: 'Host', avatar: 'MG', bio: 'Data Science Lead @ DataCamp' },
      { id: 's-ds3', name: 'Aisha Khan', email: 'aisha@ml.io', role: 'Speaker', avatar: 'AK', bio: 'NLP Researcher' },
    ],
    schedule: [
      { id: 'sch-ds5', time: '6:00 PM', title: 'Recap & Check-in', duration: '10 min', type: 'keynote', speaker: 'Maria Gonzalez' },
      { id: 'sch-ds6', time: '6:10 PM', title: 'Topic Deep Dive: NLP Basics', duration: '30 min', type: 'session', speaker: 'Aisha Khan' },
      { id: 'sch-ds7', time: '6:40 PM', title: 'Hands-on Exercise', duration: '30 min', type: 'workshop' },
      { id: 'sch-ds8', time: '7:10 PM', title: 'Peer Discussion & Q&A', duration: '20 min', type: 'panel' },
    ],
    userRole: 'learner',
    userRegistration: { status: 'confirmed', ticketTier: 'Free' },
    category: 'Data Science',
    tags: ['Data Science', 'Study Group', 'Bi-weekly', 'NLP'],
  },

  // ── Archived event — past with full data ──
  {
    id: 'evt-25',
    title: 'GraphQL Summit 2025',
    description: 'Annual GraphQL conference covering federation, schema design, and performance optimization. Packed with workshops and hands-on labs.',
    date: '2025-11-15',
    time: '9:00 AM EST',
    endTime: '5:00 PM EST',
    durationMinutes: 480,
    attendeeCount: 342,
    capacity: 400,
    location: 'hybrid',
    locationDetails: 'Convention Center, Austin TX + Zoom',
    virtualLink: 'https://zoom.us/j/graphql-summit',
    status: 'past',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: ['james@leapspace.io'],
    visibility: 'public',
    accessType: 'paid',
    isPaid: true,
    price: 149,
    currency: 'USD',
    tickets: [
      { id: 'tk-gql1', name: 'In-Person', price: 149, currency: 'USD', quantity: 300, remaining: 0, description: 'Full conference access + lunch', perks: ['Lunch included', 'Networking reception', 'Swag bag'] },
      { id: 'tk-gql2', name: 'Virtual', price: 49, currency: 'USD', quantity: 200, remaining: 42, description: 'Live stream + recordings', perks: ['Live stream', '30-day replay'] },
    ],
    isStandalone: true,
    lifecycleStage: 'archived',
    completionChecklist: {
      hasTitle: true,
      hasDescription: true,
      hasDateTime: true,
      hasCoverImage: true,
      hasAgenda: true,
      hasTickets: true,
      hasSpeakers: true,
      hasLocation: true,
      hasRegistrationForm: true,
      hasRegistrationConfig: true,
    },
    speakers: [
      { id: 's-gql1', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'GraphQL advocate & community builder', status: 'confirmed' },
      { id: 's-gql2', name: 'Lee Byron', email: 'lee@graphql.org', role: 'Speaker', avatar: 'LB', bio: 'GraphQL co-creator', status: 'confirmed' },
      { id: 's-gql3', name: 'Sasha Solomon', email: 'sasha@netflix.com', role: 'Speaker', avatar: 'SS', bio: 'Staff Engineer @ Netflix', status: 'confirmed' },
    ],
    schedule: [
      { id: 'sch-gql1', time: '9:00 AM', title: 'Registration & Coffee', duration: '30 min', type: 'break' },
      { id: 'sch-gql2', time: '9:30 AM', title: 'Opening Keynote: The Future of GraphQL', duration: '45 min', type: 'keynote', speaker: 'Lee Byron' },
      { id: 'sch-gql3', time: '10:15 AM', title: 'Federation at Scale', duration: '45 min', type: 'session', speaker: 'Sasha Solomon' },
      { id: 'sch-gql4', time: '11:00 AM', title: 'Break', duration: '15 min', type: 'break' },
      { id: 'sch-gql5', time: '11:15 AM', title: 'Schema Design Workshop', duration: '1h 30m', type: 'workshop', speaker: 'Sarah Chen' },
      { id: 'sch-gql6', time: '12:45 PM', title: 'Lunch & Networking', duration: '1h', type: 'break' },
      { id: 'sch-gql7', time: '1:45 PM', title: 'Performance Deep Dive', duration: '45 min', type: 'session', speaker: 'Sasha Solomon' },
      { id: 'sch-gql8', time: '2:30 PM', title: 'Hands-on Labs', duration: '2h', type: 'workshop' },
      { id: 'sch-gql9', time: '4:30 PM', title: 'Closing & Awards', duration: '30 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    teamMembers: [
      { id: 'tm-gql1', name: 'James Park', email: 'james@leapspace.io', role: 'Co-host', avatar: 'JP', status: 'active' },
      { id: 'tm-gql2', name: 'Emily Zhang', email: 'emily@leapspace.io', role: 'Speaker Manager', avatar: 'EZ', status: 'active' },
    ],
    resources: [
      { id: 'res-gql1', title: 'Conference Slides Bundle', url: '#', type: 'Slides', fileSize: '24 MB', downloadCount: 189, visibility: 'registered' },
      { id: 'res-gql2', title: 'Workshop Lab Instructions', url: '#', type: 'PDF', fileSize: '3.2 MB', downloadCount: 156, visibility: 'registered' },
      { id: 'res-gql3', title: 'GraphQL Best Practices Guide', url: '#', type: 'Document', fileSize: '1.8 MB', downloadCount: 234, visibility: 'post-event' },
    ],
    recordingUrl: 'https://youtube.com/watch?v=graphql-summit-2025',
    recordingDuration: '6h 30m',
    hasCertificate: true,
    userRole: 'creator',
    category: 'Technology',
    tags: ['GraphQL', 'API', 'Conference', 'Federation'],
    healthScore: 96,
    registrationRate: 86,
    pageViews: 12400,
    chatMessageCount: 523,
  },

  // ── Sold-out event — at capacity with waitlist ──
  {
    id: 'evt-26',
    title: 'Exclusive AI Leadership Dinner',
    description: 'An intimate dinner for AI leaders to discuss responsible AI adoption, workforce impact, and emerging regulation. Limited to 20 seats.',
    date: '2026-04-10',
    time: '7:00 PM EST',
    endTime: '10:00 PM EST',
    durationMinutes: 180,
    attendeeCount: 20,
    capacity: 20,
    location: 'in-person',
    locationDetails: 'The Capital Grille, NYC',
    status: 'upcoming',
    isPublic: true,
    creatorEmail: 'sarah@leapspace.io',
    creatorName: 'Sarah Chen',
    creatorAvatar: 'SC',
    moderators: [],
    visibility: 'public',
    accessType: 'screened',
    isPaid: true,
    format: 'in-person',
    price: 250,
    currency: 'USD',
    tickets: [
      { id: 'tk-aid1', name: 'Dinner Seat', price: 250, currency: 'USD', quantity: 20, remaining: 0, description: 'Full dinner + networking', perks: ['3-course dinner', 'Curated networking', 'Gift bag'] },
    ],
    isStandalone: true,
    lifecycleStage: 'published',
    completionChecklist: {
      hasTitle: true,
      hasDescription: true,
      hasDateTime: true,
      hasCoverImage: true,
      hasAgenda: true,
      hasTickets: true,
      hasSpeakers: true,
      hasLocation: true,
      hasRegistrationForm: true,
      hasRegistrationConfig: true,
    },
    speakers: [
      { id: 's-aid1', name: 'Sarah Chen', email: 'sarah@leapspace.io', role: 'Host', avatar: 'SC', bio: 'AI Community Leader', status: 'confirmed' },
      { id: 's-aid2', name: 'Dr. Fei-Fei Li', email: 'feifei@stanford.edu', role: 'Speaker', avatar: 'FL', bio: 'Stanford HAI Director', status: 'confirmed' },
    ],
    schedule: [
      { id: 'sch-aid1', time: '7:00 PM', title: 'Cocktail Reception', duration: '30 min', type: 'break' },
      { id: 'sch-aid2', time: '7:30 PM', title: 'Fireside Chat: AI in 2026', duration: '45 min', type: 'keynote', speaker: 'Dr. Fei-Fei Li' },
      { id: 'sch-aid3', time: '8:15 PM', title: 'Dinner & Roundtable', duration: '1h 30m', type: 'panel' },
      { id: 'sch-aid4', time: '9:45 PM', title: 'Closing Remarks', duration: '15 min', type: 'keynote', speaker: 'Sarah Chen' },
    ],
    customRegistrationFields: DEFAULT_REGISTRATION_FIELDS,
    customRoles: DEFAULT_CUSTOM_ROLES,
    notificationRules: DEFAULT_NOTIFICATION_RULES,
    waitlistEntries: DEFAULT_WAITLIST_ENTRIES,
    reviews: DEFAULT_REVIEWS,
    userRole: 'creator',
    category: 'Leadership',
    tags: ['AI', 'Leadership', 'Dinner', 'Exclusive'],
    healthScore: 100,
    registrationRate: 100,
    pageViews: 6200,
    chatMessageCount: 8,
  },
];

// Helper functions
export function getEventsByTab(tab: string): MockEvent[] {
  switch (tab) {
    case 'discover':
      return mockEvents.filter(e =>
        e.isPublic && e.status !== 'draft' && e.status !== 'cancelled' &&
        (e.lifecycleStage === 'published' || e.lifecycleStage === 'live')
      );
    case 'attending':
      return mockEvents.filter(e =>
        e.userRegistration && e.userRole !== 'creator' && e.userRole !== 'speaker' &&
        e.status !== 'cancelled'
      );
    case 'hosting':
      return mockEvents.filter(e =>
        (e.userRole === 'creator' || e.userRole === 'speaker') &&
        e.status !== 'past' && e.status !== 'cancelled'
      );
    case 'drafts':
      return mockEvents.filter(e =>
        e.status === 'draft' && e.userRole === 'creator'
      );
    case 'past':
      return mockEvents.filter(e =>
        e.status === 'past' || e.lifecycleStage === 'ended' || e.status === 'cancelled'
      );
    default:
      return mockEvents;
  }
}

export function getEventById(id: string): MockEvent | undefined {
  return mockEvents.find(e => e.id === id);
}

export function getChecklistProgress(checklist: MockEvent['completionChecklist']): { done: number; total: number } {
  if (!checklist) return { done: 0, total: 10 };
  const values = Object.values(checklist);
  return { done: values.filter(Boolean).length, total: values.length };
}

// ─── Lifecycle Helpers ────────────────────────────────────────────
export type LifecycleBannerType = 'skeleton' | 'building' | 'ready' | 'published' | 'live' | 'ended' | 'cancelled' | 'sold-out' | 'none';

export function getLifecycleBannerType(event: MockEvent): LifecycleBannerType {
  if (event.lifecycleStage === 'cancelled') return 'cancelled';
  if (event.lifecycleStage === 'live') return 'live';
  if (event.lifecycleStage === 'ended') return 'ended';
  // Sold out check
  if (event.capacity && event.attendeeCount >= event.capacity && event.lifecycleStage === 'published') return 'sold-out';
  if (event.lifecycleStage === 'published') return 'none'; // No banner for published
  // Draft stages
  if (event.lifecycleStage === 'skeleton') return 'skeleton';
  if (event.lifecycleStage === 'ready') return 'ready';
  if (event.lifecycleStage === 'building') return 'building';
  return 'none';
}

export function getMissingChecklistItems(checklist: MockEvent['completionChecklist']): string[] {
  if (!checklist) return [];
  const labels: Record<string, string> = {
    hasTitle: 'Event title',
    hasDescription: 'Description',
    hasDateTime: 'Date & time',
    hasCoverImage: 'Cover image',
    hasAgenda: 'Agenda / schedule',
    hasTickets: 'Tickets / pricing',
    hasSpeakers: 'Speakers',
    hasLocation: 'Location details',
    hasRegistrationForm: 'Registration form',
    hasRegistrationConfig: 'Registration settings',
  };
  return Object.entries(checklist)
    .filter(([, done]) => !done)
    .map(([key]) => labels[key] || key);
}

export function isEventSoldOut(event: MockEvent): boolean {
  return !!(event.capacity && event.attendeeCount >= event.capacity);
}

export function getEventWaitlistCount(event: MockEvent): number {
  if (!isEventSoldOut(event)) return 0;
  return Math.max(0, event.attendeeCount - (event.capacity || 0));
}

// ─── Recurring / Series Helpers ──────────────────────────────────

export function getSeriesOccurrences(seriesId: string): MockEvent[] {
  return mockEvents
    .filter(e => e.seriesId === seriesId)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getOccurrenceIndex(event: MockEvent): number {
  if (!event.seriesId) return 0;
  const occurrences = getSeriesOccurrences(event.seriesId);
  return occurrences.findIndex(e => e.id === event.id);
}

export function getSeriesTotal(event: MockEvent): number {
  if (!event.recurrenceEnd) return 0;
  const match = event.recurrenceEnd.match(/after:(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

/** Returns the first occurrence index in our data for this series (may not start at 1 in data) */
export function getOccurrenceNumber(event: MockEvent): number {
  if (!event.seriesId) return 1;
  // For the admin "Frontend Office Hours" series, data starts at occurrence 4
  const seriesOffsets: Record<string, number> = {
    'series-frontend-oh': 4,
    'series-ds-study': 3,
  };
  const offset = seriesOffsets[event.seriesId] || 1;
  const idx = getOccurrenceIndex(event);
  return offset + idx;
}

export interface SeriesStats {
  totalOccurrences: number;
  completedOccurrences: number;
  upcomingOccurrences: number;
  totalAttendees: number;
  avgAttendance: number;
  peakAttendance: number;
  seriesTitle: string;
  recurrenceRule: string;
  recurrenceLabel: string;
}

export function getSeriesStats(seriesId: string): SeriesStats {
  const occurrences = getSeriesOccurrences(seriesId);
  if (occurrences.length === 0) {
    return { totalOccurrences: 0, completedOccurrences: 0, upcomingOccurrences: 0, totalAttendees: 0, avgAttendance: 0, peakAttendance: 0, seriesTitle: '', recurrenceRule: '', recurrenceLabel: '' };
  }
  const completed = occurrences.filter(e => e.lifecycleStage === 'ended');
  const upcoming = occurrences.filter(e => e.lifecycleStage !== 'ended' && e.lifecycleStage !== 'cancelled');
  const totalAttendees = occurrences.reduce((sum, e) => sum + e.attendeeCount, 0);
  const avgAttendance = occurrences.length > 0 ? Math.round(totalAttendees / occurrences.length) : 0;
  const peakAttendance = Math.max(...occurrences.map(e => e.attendeeCount));
  const total = getSeriesTotal(occurrences[0]);

  // Parse recurrence rule to human label
  const rule = occurrences[0].recurrenceRule || '';
  let recurrenceLabel = 'Recurring';
  if (rule.includes('FREQ=WEEKLY') && !rule.includes('INTERVAL=')) recurrenceLabel = 'Every week';
  else if (rule.includes('FREQ=WEEKLY;INTERVAL=2')) recurrenceLabel = 'Every 2 weeks';
  else if (rule.includes('FREQ=MONTHLY')) recurrenceLabel = 'Monthly';
  else if (rule.includes('FREQ=DAILY')) recurrenceLabel = 'Daily';

  // Add day
  const dayMatch = rule.match(/BYDAY=(\w{2})/);
  if (dayMatch) {
    const days: Record<string, string> = { MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday', FR: 'Friday', SA: 'Saturday', SU: 'Sunday' };
    recurrenceLabel += ` on ${days[dayMatch[1]] || dayMatch[1]}`;
  }

  return {
    totalOccurrences: total || occurrences.length,
    completedOccurrences: completed.length,
    upcomingOccurrences: upcoming.length,
    totalAttendees,
    avgAttendance,
    peakAttendance,
    seriesTitle: occurrences[0].title,
    recurrenceRule: rule,
    recurrenceLabel,
  };
}

export function getLearnerSeriesAttendance(seriesId: string): { attended: number; total: number } {
  const occurrences = getSeriesOccurrences(seriesId);
  const ended = occurrences.filter(e => e.lifecycleStage === 'ended');
  // Mock: learner attended all ended occurrences that have userRegistration
  const attended = ended.filter(e => e.userRegistration?.status === 'confirmed').length;
  return { attended, total: ended.length };
}

// ─── Lifecycle Action Helpers (6.5) ──────────────────────────────

export interface HeaderAction {
  id: string;
  label: string;
  icon: string; // lucide icon name
  variant: 'default' | 'primary' | 'destructive' | 'outline';
  leapyContext?: LeapyContextType;
}

// Import type only — actual icons resolved at component level
type LeapyContextType = import('./leapyContexts').LeapyContextType;

/**
 * Returns the contextual banner config for a given lifecycle stage.
 * Components render the banner using this data rather than hardcoding.
 */
export function getLifecycleBanner(event: MockEvent): {
  type: LifecycleBannerType;
  label: string;
  description: string;
  color: string; // tailwind color token
  icon: string; // lucide icon name
  actions: HeaderAction[];
} | null {
  const stage = getLifecycleBannerType(event);
  const checklist = event.completionChecklist;
  const progress = getChecklistProgress(checklist);

  switch (stage) {
    case 'skeleton':
      return {
        type: 'skeleton',
        label: 'Getting Started',
        description: `${progress.done}/${progress.total} setup items complete. Let\u2019s fill in the basics.`,
        color: 'primary',
        icon: 'Sparkles',
        actions: [
          { id: 'continue', label: 'Continue Setup', icon: 'ArrowRight', variant: 'primary', leapyContext: 'edit_event_details' },
        ],
      };
    case 'building':
      return {
        type: 'building',
        label: 'Draft \u2014 In Progress',
        description: `${progress.done}/${progress.total} items complete. ${getMissingChecklistItems(checklist).slice(0, 2).join(', ')} still needed.`,
        color: 'amber',
        icon: 'Pencil',
        actions: [
          { id: 'review', label: 'Review Checklist', icon: 'ClipboardList', variant: 'outline', leapyContext: 'review_checklist' },
          { id: 'publish', label: 'Publish', icon: 'Rocket', variant: 'primary', leapyContext: 'publish_event' },
        ],
      };
    case 'ready':
      return {
        type: 'ready',
        label: 'Ready to Publish',
        description: 'All checklist items are complete. Your event is ready to go live!',
        color: 'green',
        icon: 'CheckCircle',
        actions: [
          { id: 'publish', label: 'Publish Now', icon: 'Rocket', variant: 'primary', leapyContext: 'publish_event' },
          { id: 'preview', label: 'Preview', icon: 'Eye', variant: 'outline' },
        ],
      };
    case 'sold-out':
      return {
        type: 'sold-out',
        label: 'Sold Out',
        description: `${event.attendeeCount}/${event.capacity} spots filled. ${getEventWaitlistCount(event)} on waitlist.`,
        color: 'destructive',
        icon: 'AlertCircle',
        actions: [
          { id: 'increase', label: 'Add Spots', icon: 'Plus', variant: 'outline', leapyContext: 'increase_capacity' },
          { id: 'waitlist', label: 'Manage Waitlist', icon: 'Users', variant: 'outline', leapyContext: 'manage_waitlist' },
        ],
      };
    case 'live':
      return {
        type: 'live',
        label: 'LIVE NOW',
        description: `${event.liveAttendeeCount || 0} watching \u00b7 ${event.attendeeCount} registered`,
        color: 'destructive',
        icon: 'Radio',
        actions: [
          { id: 'share-link', label: 'Share Join Link', icon: 'Link2', variant: 'outline', leapyContext: 'share_join_link' },
          { id: 'end', label: 'End Event', icon: 'StopCircle', variant: 'destructive', leapyContext: 'end_event' },
        ],
      };
    case 'ended':
      return {
        type: 'ended',
        label: 'Event Ended',
        description: `${event.attendeeCount} attended${event.recordingUrl ? ' \u00b7 Recording available' : ''}`,
        color: 'muted',
        icon: 'CheckCircle',
        actions: [
          { id: 'followup', label: 'Send Follow-up', icon: 'Mail', variant: 'primary', leapyContext: 'send_followup' },
          { id: 'archive', label: 'Archive', icon: 'Archive', variant: 'outline', leapyContext: 'archive_event' },
        ],
      };
    case 'cancelled':
      return {
        type: 'cancelled',
        label: 'Cancelled',
        description: event.cancellationReason || 'This event has been cancelled.',
        color: 'destructive',
        icon: 'XCircle',
        actions: [
          { id: 'duplicate', label: 'Reschedule as New', icon: 'RefreshCw', variant: 'outline', leapyContext: 'duplicate_event' },
        ],
      };
    default:
      return null;
  }
}

/**
 * Returns the header quick-actions for a given event based on lifecycle + role.
 */
export function getHeaderActions(event: MockEvent, role: 'admin' | 'speaker' | 'learner'): HeaderAction[] {
  if (role === 'learner') {
    switch (event.lifecycleStage) {
      case 'published':
        if (event.userRegistration?.status === 'confirmed') {
          return [
            { id: 'calendar', label: 'Add to Calendar', icon: 'Calendar', variant: 'outline', leapyContext: 'add_to_calendar' },
            { id: 'share', label: 'Share', icon: 'Share2', variant: 'outline', leapyContext: 'share_attending' },
            { id: 'cancel-reg', label: 'Cancel Registration', icon: 'XCircle', variant: 'outline', leapyContext: 'cancel_registration' },
          ];
        }
        if (isEventSoldOut(event)) {
          return [
            { id: 'waitlist', label: 'Join Waitlist', icon: 'Clock', variant: 'primary', leapyContext: 'join_waitlist' },
          ];
        }
        return [
          { id: 'register', label: event.isPaid ? 'Get Ticket' : 'Register', icon: 'Ticket', variant: 'primary', leapyContext: 'register_event' },
        ];
      case 'live':
        return [
          { id: 'join', label: 'Join Now', icon: 'Play', variant: 'primary' },
          { id: 'qa', label: 'Ask Question', icon: 'MessageSquare', variant: 'outline', leapyContext: 'ask_question_live' },
        ];
      case 'ended':
        const actions: HeaderAction[] = [];
        if (event.recordingUrl) actions.push({ id: 'recording', label: 'Watch Recording', icon: 'Play', variant: 'primary', leapyContext: 'download_recording' });
        if (event.hasCertificate) actions.push({ id: 'cert', label: 'Get Certificate', icon: 'Award', variant: 'outline', leapyContext: 'get_certificate' });
        actions.push({ id: 'feedback', label: 'Leave Feedback', icon: 'Star', variant: 'outline', leapyContext: 'submit_feedback' });
        return actions;
      default:
        return [];
    }
  }

  if (role === 'speaker') {
    switch (event.lifecycleStage) {
      case 'published':
        return [
          { id: 'preview', label: 'Preview Event', icon: 'Eye', variant: 'outline' },
          { id: 'share', label: 'Share', icon: 'Share2', variant: 'outline', leapyContext: 'share_event' },
        ];
      case 'live':
        return [
          { id: 'join', label: 'Join as Speaker', icon: 'Mic', variant: 'primary' },
          { id: 'resources', label: 'Share Resource', icon: 'FileText', variant: 'outline', leapyContext: 'share_live_resource' },
        ];
      default:
        return [];
    }
  }

  // Admin actions
  switch (event.lifecycleStage) {
    case 'skeleton':
    case 'building':
      return [
        { id: 'edit', label: 'Continue Building', icon: 'Pencil', variant: 'primary', leapyContext: 'edit_event_details' },
        { id: 'preview', label: 'Preview', icon: 'Eye', variant: 'outline' },
      ];
    case 'ready':
      return [
        { id: 'publish', label: 'Publish', icon: 'Rocket', variant: 'primary', leapyContext: 'publish_event' },
        { id: 'preview', label: 'Preview', icon: 'Eye', variant: 'outline' },
      ];
    case 'published':
      return [
        { id: 'share', label: 'Share', icon: 'Share2', variant: 'outline', leapyContext: 'share_event' },
        { id: 'edit', label: 'Edit', icon: 'Pencil', variant: 'outline', leapyContext: 'edit_published_event' },
        { id: 'message', label: 'Message', icon: 'Mail', variant: 'outline', leapyContext: 'message_attendees' },
      ];
    case 'live':
      return [
        { id: 'share-link', label: 'Share Link', icon: 'Link2', variant: 'outline', leapyContext: 'share_join_link' },
        { id: 'announce', label: 'Announce', icon: 'Megaphone', variant: 'outline', leapyContext: 'send_live_announcement' },
        { id: 'end', label: 'End', icon: 'StopCircle', variant: 'destructive', leapyContext: 'end_event' },
      ];
    case 'ended':
      return [
        { id: 'followup', label: 'Follow-up', icon: 'Mail', variant: 'primary', leapyContext: 'send_followup' },
        { id: 'recap', label: 'Recap', icon: 'FileText', variant: 'outline', leapyContext: 'create_recap_post' },
        { id: 'archive', label: 'Archive', icon: 'Archive', variant: 'outline', leapyContext: 'archive_event' },
      ];
    case 'archived':
      return [
        { id: 'duplicate', label: 'Run Again', icon: 'RefreshCw', variant: 'outline', leapyContext: 'duplicate_event' },
        { id: 'export', label: 'Export Data', icon: 'Download', variant: 'outline', leapyContext: 'download_attendees' },
      ];
    case 'cancelled':
      return [
        { id: 'duplicate', label: 'Reschedule', icon: 'RefreshCw', variant: 'outline', leapyContext: 'duplicate_event' },
      ];
    default:
      return [];
  }
}

/**
 * Returns the available tabs for the individual event view based on lifecycle + role.
 */
export type EventTabId = 'overview' | 'schedule' | 'attendees' | 'tickets' | 'discussion' | 'analytics' | 'settings' | 'landing' | 'post-event' | 'resources' | 'team';

export function getAvailableTabs(event: MockEvent, role: 'admin' | 'speaker' | 'learner'): EventTabId[] {
  if (role === 'learner') {
    switch (event.lifecycleStage) {
      case 'published':
        return ['landing', 'schedule', 'discussion'];
      case 'live':
        return ['landing', 'schedule', 'discussion', 'resources'];
      case 'ended':
        return ['landing', 'schedule', 'discussion', 'resources', 'post-event'];
      default:
        return ['landing'];
    }
  }

  if (role === 'speaker') {
    switch (event.lifecycleStage) {
      case 'published':
      case 'live':
        return ['overview', 'schedule', 'resources'];
      case 'ended':
        return ['overview', 'schedule', 'resources', 'analytics'];
      default:
        return ['overview'];
    }
  }

  // Admin gets all tabs, but some differ by stage
  switch (event.lifecycleStage) {
    case 'skeleton':
    case 'building':
      return ['overview', 'schedule', 'tickets', 'settings'];
    case 'ready':
      return ['overview', 'schedule', 'tickets', 'settings', 'landing'];
    case 'published':
      return ['overview', 'schedule', 'attendees', 'tickets', 'discussion', 'analytics', 'settings', 'landing', 'resources', 'team'];
    case 'live':
      return ['overview', 'schedule', 'attendees', 'discussion', 'analytics', 'resources'];
    case 'ended':
      return ['overview', 'schedule', 'attendees', 'analytics', 'post-event', 'resources', 'team'];
    case 'archived':
      return ['overview', 'attendees', 'analytics', 'post-event', 'resources'];
    case 'cancelled':
      return ['overview', 'attendees', 'analytics'];
    default:
      return ['overview', 'schedule', 'attendees', 'tickets', 'discussion', 'analytics', 'settings', 'landing', 'resources', 'team'];
  }
}
