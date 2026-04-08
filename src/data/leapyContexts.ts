// Leapy Context System
// Defines what Leapy says and suggests for every action across the app

import { type MockEvent } from './mockEventData';

// ─── Context Types ───────────────────────────────────────────────
export type LeapyContextType =
  // Event Creation
  | 'create_event'
  | 'create_event_in_community'
  | 'duplicate_event'
  // Event Draft Building
  | 'edit_event_details'
  | 'edit_event_cover'
  | 'edit_event_description'
  | 'add_speakers'
  | 'edit_speakers'
  | 'build_agenda'
  | 'edit_agenda'
  | 'set_registration'
  | 'set_registration_config'
  | 'set_tickets'
  | 'set_location'
  | 'set_reminders'
  | 'add_cohost'
  | 'add_resources'
  | 'generate_agenda'
  | 'generate_social_post'
  | 'compose_email'
  | 'smart_compose'
  // Pre-Publish
  | 'review_checklist'
  | 'publish_event'
  // Published Event Management
  | 'unpublish_event'
  | 'edit_published_event'
  | 'send_update'
  | 'message_attendees'
  | 'message_individual'
  | 'manage_waitlist'
  | 'increase_capacity'
  | 'close_registration'
  | 'reopen_registration'
  | 'share_event'
  | 'generate_qr'
  | 'postpone_event'
  | 'cancel_event'
  // Live Event
  | 'go_live'
  | 'share_join_link'
  | 'check_in_attendees'
  | 'send_live_announcement'
  | 'share_live_resource'
  | 'manage_qa'
  | 'extend_time'
  | 'end_event'
  // Post Event
  | 'upload_recording'
  | 'share_recording'
  | 'send_followup'
  | 'create_feedback_survey'
  | 'summarize_feedback'
  | 'create_recap_post'
  | 'download_attendees'
  | 'archive_event'
  // Learner Actions
  | 'register_event'
  | 'join_waitlist'
  | 'cancel_registration'
  | 'update_registration'
  | 'add_to_calendar'
  | 'set_reminder'
  | 'ask_about_event'
  | 'invite_friend'
  | 'share_attending'
  | 'ask_question_live'
  | 'take_notes'
  | 'report_issue'
  | 'submit_feedback'
  | 'rate_event'
  | 'share_recap'
  | 'connect_speaker'
  | 'connect_attendees'
  | 'get_certificate'
  | 'find_similar'
  | 'download_recording'
  // Speaker Actions
  | 'manage_speaker_session'
  | 'update_speaker_bio'
  // Series / Recurring
  | 'edit_series'
  | 'skip_occurrence'
  | 'cancel_series'
  // General
  | 'general';

export interface LeapyContext {
  type: LeapyContextType;
  entityId?: string;
  entityData?: MockEvent;
  communityName?: string;
  extra?: Record<string, any>;
}

// ─── Rich Card Types ─────────────────────────────────────────────
export type RichCardType =
  | 'event_preview'
  | 'checklist'
  | 'choice'
  | 'form_fields'
  | 'message_draft'
  | 'confirmation'
  | 'attendee_list'
  | 'agenda_preview'
  | 'speaker_list'
  | 'summary'
  | 'announcement_options';

export interface RichCard {
  type: RichCardType;
  data: Record<string, any>;
}

export interface LeapyMessage {
  id: string;
  role: 'leapy' | 'user';
  content: string;
  timestamp: Date;
  richCards?: RichCard[];
  suggestions?: string[];
  isTyping?: boolean;
}

// ─── Context Configurations ──────────────────────────────────────
interface ContextConfig {
  openingMessage: string | ((ctx: LeapyContext) => string);
  suggestions?: string[] | ((ctx: LeapyContext) => string[]);
  initialCards?: RichCard[] | ((ctx: LeapyContext) => RichCard[]);
}

const eventName = (ctx: LeapyContext) => ctx.entityData?.title || 'your event';
const attendeeCount = (ctx: LeapyContext) => ctx.entityData?.attendeeCount || 0;

export const leapyContextConfigs: Record<LeapyContextType, ContextConfig> = {
  // ─── EVENT CREATION ──────────────────────────────────────────
  create_event: {
    openingMessage: "Let's create an event! Tell me what you have in mind \u2014 a topic, a date, a vibe, even just a rough idea. I'll shape it from there.",
    suggestions: [
      'Workshop on AI tools',
      'Community meetup this Friday',
      'Webinar series on design',
      'Help me brainstorm ideas',
    ],
  },

  create_event_in_community: {
    openingMessage: (ctx) =>
      `Creating an event for ${ctx.communityName || 'your community'}. What's it about?`,
    suggestions: [
      'Workshop for members',
      'Guest speaker session',
      'Monthly meetup',
      'AMA with an expert',
    ],
  },

  duplicate_event: {
    openingMessage: (ctx) =>
      `I'll copy everything from "${eventName(ctx)}". Just give me the new date and I'll clone it.`,
    suggestions: ['Same time next week', 'Same time next month', 'Let me pick a date', 'Change a few things too'],
  },

  // ─── DRAFT BUILDING ──────────────────────────────────────────
  edit_event_details: {
    openingMessage: (ctx) =>
      `What would you like to change about "${eventName(ctx)}"?`,
    suggestions: ['Change the title', 'Update date & time', 'Change the format', 'Update capacity'],
  },

  edit_event_cover: {
    openingMessage: "Let's set a cover image. Want me to generate one based on the event theme, or do you have one to upload?",
    suggestions: ['Generate a cover for me', 'I\'ll upload my own', 'Use a stock photo', 'Skip for now'],
  },

  edit_event_description: {
    openingMessage: (ctx) =>
      ctx.entityData?.description
        ? `Here's the current description. Want me to rewrite it, make it shorter, or adjust the tone?`
        : `Let's write a description. Tell me the key points and I'll draft something compelling.`,
    suggestions: ['Write it for me', 'Make it more casual', 'Add key takeaways', 'Keep it short'],
  },

  add_speakers: {
    openingMessage: (ctx) =>
      `Let's add speakers to "${eventName(ctx)}". Who's presenting? Give me names and I'll set up their profiles.`,
    suggestions: ['Add one speaker', 'Add multiple speakers', 'I\'m the only speaker', 'Help me find speakers'],
  },

  edit_speakers: {
    openingMessage: (ctx) => {
      const speakers = ctx.entityData?.speakers || [];
      if (speakers.length === 0) return "No speakers added yet. Who's presenting?";
      const names = speakers.map(s => s.name).join(', ');
      return `Current speakers: ${names}. Add, remove, or update someone?`;
    },
    suggestions: ['Add another speaker', 'Update a bio', 'Remove a speaker', 'Reorder speakers'],
  },

  build_agenda: {
    openingMessage: (ctx) =>
      `Let's build the agenda for "${eventName(ctx)}". Walk me through the flow, or give me a rough idea and I'll structure it.`,
    suggestions: [
      'Intro \u2192 Main Talk \u2192 Q&A',
      'Multi-track conference',
      'Workshop with exercises',
      'Generate an agenda for me',
    ],
  },

  edit_agenda: {
    openingMessage: (ctx) => {
      const schedule = ctx.entityData?.schedule || [];
      return schedule.length > 0
        ? `Your agenda has ${schedule.length} sessions. What do you want to change?`
        : "No agenda yet. Want me to build one?";
    },
    suggestions: ['Add a session', 'Change timing', 'Reorder sessions', 'Remove a session'],
  },

  set_registration: {
    openingMessage: "How should registration work? I can set it up however you need.",
    suggestions: ['Open to everyone', 'Invite only', 'Requires approval', 'Add registration questions'],
    initialCards: [
      {
        type: 'choice',
        data: {
          question: 'Registration type',
          options: [
            { id: 'open', label: 'Open', description: 'Anyone can register' },
            { id: 'invite', label: 'Invite Only', description: 'Only invited people' },
            { id: 'screened', label: 'Approval Required', description: 'You review applications' },
          ],
        },
      },
    ],
  },

  set_registration_config: {
    openingMessage: "Configure registration settings. What do you need?",
    suggestions: ['Add questions', 'Set limits', 'Enable payment', 'Customize form'],
    initialCards: [
      {
        type: 'form_fields',
        data: {
          title: 'Registration Form',
          fields: [
            { id: 'name', label: 'Name', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'phone', label: 'Phone', type: 'tel' },
            { id: 'company', label: 'Company', type: 'text' },
            { id: 'job_title', label: 'Job Title', type: 'text' },
            { id: 'industry', label: 'Industry', type: 'text' },
            { id: 'country', label: 'Country', type: 'text' },
            { id: 'comments', label: 'Comments', type: 'textarea' },
          ],
        },
      },
    ],
  },

  set_tickets: {
    openingMessage: "Let's set up ticketing. Is this a free or paid event?",
    suggestions: ['Free event', 'Single ticket tier', 'Multiple tiers (Basic, VIP)', 'Early bird pricing'],
  },

  set_location: {
    openingMessage: "Where is this happening?",
    suggestions: ['Virtual (Zoom)', 'Virtual (Google Meet)', 'In-person', 'Hybrid (both)'],
    initialCards: [
      {
        type: 'choice',
        data: {
          question: 'Event format',
          options: [
            { id: 'virtual', label: 'Virtual', description: 'Online meeting link' },
            { id: 'in-person', label: 'In Person', description: 'Physical venue' },
            { id: 'hybrid', label: 'Hybrid', description: 'Both virtual & in-person' },
          ],
        },
      },
    ],
  },

  set_reminders: {
    openingMessage: "I can send automated reminders to registrants. What schedule works?",
    suggestions: ['24h + 1h before', '1 week + 1 day before', 'Custom schedule', 'No reminders'],
  },

  add_cohost: {
    openingMessage: "Who do you want to co-host with? Give me a name and I'll invite them.",
    suggestions: ['Search by name', 'Search by email', 'From my community', 'Skip for now'],
  },

  add_resources: {
    openingMessage: "What resources do you want to share? I can attach files, links, or documents.",
    suggestions: ['Add a slide deck', 'Add a link', 'Add pre-reading', 'Upload a file'],
  },

  generate_agenda: {
    openingMessage: "I can generate a sample agenda for you. What type of event is this?",
    suggestions: ['Conference', 'Workshop', 'Webinar', 'Meetup'],
    initialCards: [
      {
        type: 'choice',
        data: {
          question: 'Event Type',
          options: [
            { id: 'conference', label: 'Conference' },
            { id: 'workshop', label: 'Workshop' },
            { id: 'webinar', label: 'Webinar' },
            { id: 'meetup', label: 'Meetup' },
          ],
        },
      },
    ],
  },

  generate_social_post: {
    openingMessage: "I can draft a social media post for your event. What platform are you targeting?",
    suggestions: ['Twitter/X', 'LinkedIn', 'Facebook', 'Instagram'],
    initialCards: [
      {
        type: 'choice',
        data: {
          question: 'Platform',
          options: [
            { id: 'twitter', label: 'Twitter/X' },
            { id: 'linkedin', label: 'LinkedIn' },
            { id: 'facebook', label: 'Facebook' },
            { id: 'instagram', label: 'Instagram' },
          ],
        },
      },
    ],
  },

  compose_email: {
    openingMessage: "I can help you draft an email. What's the purpose?",
    suggestions: ['Registration reminder', 'Event update', 'Follow-up', 'Custom message'],
    initialCards: [
      {
        type: 'message_draft',
        data: {
          subject: 'Your Event Reminder',
          body: 'Hello,\n\nJust a friendly reminder that your event is coming up soon. Make sure to check your calendar and prepare for a great experience!\n\nBest regards,\n[Your Name]',
        },
      },
    ],
  },

  smart_compose: {
    openingMessage: "I can help you draft a message. What's the purpose?",
    suggestions: ['Registration reminder', 'Event update', 'Follow-up', 'Custom message'],
    initialCards: [
      {
        type: 'message_draft',
        data: {
          subject: 'Your Event Reminder',
          body: 'Hello,\n\nJust a friendly reminder that your event is coming up soon. Make sure to check your calendar and prepare for a great experience!\n\nBest regards,\n[Your Name]',
        },
      },
    ],
  },

  // ─── PRE-PUBLISH ─────────────────────────────────────────────
  review_checklist: {
    openingMessage: (ctx) => {
      const cl = ctx.entityData?.completionChecklist;
      if (!cl) return "Let me check if your event is ready to publish...";
      const items = Object.entries(cl);
      const done = items.filter(([, v]) => v).length;
      const missing = items.filter(([, v]) => !v).map(([k]) => k);
      if (missing.length === 0) return "Everything looks good! Your event is ready to publish.";
      return `Almost there! ${done}/${items.length} items complete. Let me help you with the rest.`;
    },
    initialCards: (ctx) => {
      const cl = ctx.entityData?.completionChecklist;
      if (!cl) return [];
      return [{
        type: 'checklist',
        data: {
          title: 'Publishing Checklist',
          items: Object.entries(cl).map(([key, done]) => ({
            id: key,
            label: checklistLabels[key] || key,
            done,
          })),
        },
      }];
    },
  },

  publish_event: {
    openingMessage: (ctx) => {
      const cl = ctx.entityData?.completionChecklist;
      if (cl) {
        const missing = Object.entries(cl).filter(([, v]) => !v);
        if (missing.length > 0) {
          return `Hold on \u2014 your event has ${missing.length} incomplete items. Want to fix them first, or publish anyway?`;
        }
      }
      return `Ready to publish "${eventName(ctx)}"? Here's a final preview.`;
    },
    suggestions: ['Publish now', 'Let me review first', 'Fix missing items', 'Save and come back later'],
  },

  // ─── PUBLISHED EVENT MANAGEMENT ──────────────────────────────
  unpublish_event: {
    openingMessage: (ctx) =>
      `Unpublish "${eventName(ctx)}"? It'll be removed from public view but stay accessible.`,
    suggestions: ['Yes, unpublish it', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Unpublish Event',
        description: 'The event will be removed from public view.',
        confirmLabel: 'Unpublish',
        cancelLabel: 'Keep Published',
        variant: 'default',
      },
    }],
  },

  edit_published_event: {
    openingMessage: (ctx) =>
      `This event is live with ${attendeeCount(ctx)} registrants. What do you want to update? I'll notify attendees of any date/time/location changes.`,
    suggestions: ['Update description', 'Change date/time', 'Update speakers', 'Change capacity'],
  },

  send_update: {
    openingMessage: (ctx) =>
      `What do you want to tell your ${attendeeCount(ctx)} registered attendees?`,
    suggestions: [
      'Venue change notification',
      'Agenda update',
      'Reminder with key info',
      'General announcement',
    ],
  },

  message_attendees: {
    openingMessage: (ctx) =>
      `You have ${attendeeCount(ctx)} registrants. What message do you want to send?`,
    suggestions: ['Send a reminder', 'Share a resource', 'Ask a question', 'Custom message'],
  },

  message_individual: {
    openingMessage: "Who do you want to reach?",
    suggestions: ['Search by name', 'Message a speaker', 'Message a waitlisted person'],
  },

  manage_waitlist: {
    openingMessage: (ctx) =>
      `You have people on the waitlist. Want to approve them, message them, or adjust capacity?`,
    suggestions: ['Approve all', 'Approve one by one', 'Message waitlist', 'Increase capacity instead'],
  },

  increase_capacity: {
    openingMessage: (ctx) =>
      `Current capacity is ${ctx.entityData?.capacity || 'unlimited'}. What should the new cap be?`,
    suggestions: ['Add 10 more spots', 'Add 25 more spots', 'Remove cap entirely', 'Custom number'],
  },

  close_registration: {
    openingMessage: (ctx) =>
      `Close registration for "${eventName(ctx)}"? No new registrations will be accepted.`,
    suggestions: ['Yes, close it', 'Close and notify waitlist', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Close Registration',
        description: 'No new people will be able to register.',
        confirmLabel: 'Close Registration',
        cancelLabel: 'Keep Open',
        variant: 'warning',
      },
    }],
  },

  reopen_registration: {
    openingMessage: (ctx) =>
      `Reopen registration for "${eventName(ctx)}"? New people will be able to register.`,
    suggestions: ['Yes, reopen it', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Reopen Registration',
        description: 'New people will be able to register.',
        confirmLabel: 'Reopen Registration',
        cancelLabel: 'Keep Closed',
        variant: 'default',
      },
    }],
  },

  share_event: {
    openingMessage: (ctx) =>
      `Share "${eventName(ctx)}". Where are you sharing?`,
    suggestions: ['Copy link', 'Draft for Slack', 'Draft for Twitter/X', 'Draft for LinkedIn'],
    initialCards: [{
      type: 'announcement_options',
      data: {
        options: [
          { id: 'link', label: 'Copy Share Link', icon: 'link' },
          { id: 'slack', label: 'Format for Slack', icon: 'message' },
          { id: 'twitter', label: 'Format for Twitter/X', icon: 'twitter' },
          { id: 'linkedin', label: 'Format for LinkedIn', icon: 'linkedin' },
          { id: 'email', label: 'Draft an Email', icon: 'email' },
        ],
      },
    }],
  },

  generate_qr: {
    openingMessage: (ctx) =>
      `I'll generate a QR code for "${eventName(ctx)}". Want it for the event page, or a specific registration link?`,
    suggestions: ['Event page QR', 'Registration link QR', 'Check-in QR', 'Download all'],
  },

  postpone_event: {
    openingMessage: (ctx) =>
      `When should I move "${eventName(ctx)}" to? I'll notify all ${attendeeCount(ctx)} registrants.`,
    suggestions: ['Next week, same time', 'Next month', 'Let me pick a date', 'Actually, cancel instead'],
  },

  cancel_event: {
    openingMessage: (ctx) =>
      `This will cancel "${eventName(ctx)}" and notify ${attendeeCount(ctx)} people. Want to include a reason?`,
    suggestions: ['Scheduling conflict', 'Low registration', 'Speaker unavailable', 'Custom reason'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Cancel Event',
        description: `This will notify all registrants and cannot be undone.`,
        confirmLabel: 'Cancel Event',
        cancelLabel: 'Keep Event',
        variant: 'destructive',
      },
    }],
  },

  // ─── LIVE EVENT ──────────────────────────────────────────────
  go_live: {
    openingMessage: "Ready to go live? I'll start the live session.",
    suggestions: ['Start now', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Go Live',
        description: 'This will start the live session for all attendees.',
        confirmLabel: 'Go Live',
        cancelLabel: 'Wait',
        variant: 'warning',
      },
    }],
  },

  share_join_link: {
    openingMessage: (ctx) =>
      `Here's the join link. Want me to message the people who haven't joined yet?`,
    suggestions: ['Copy link', 'Message absent attendees', 'Post in community', 'Share on social'],
  },

  check_in_attendees: {
    openingMessage: (ctx) =>
      `${ctx.extra?.checkedIn || 0} checked in out of ${attendeeCount(ctx)} registered. Want to mark someone manually or message missing ones?`,
    suggestions: ['Mark someone present', 'Message late arrivals', 'View full list', 'Auto check-in all'],
  },

  send_live_announcement: {
    openingMessage: "What do you want to share with everyone right now?",
    suggestions: ['We\'re starting!', 'Taking a 5-min break', 'Link to shared doc', 'Custom message'],
  },

  share_live_resource: {
    openingMessage: "Drop a link or file and I'll share it with all attendees right now.",
    suggestions: ['Share a link', 'Upload a file', 'Share slide deck', 'Share a poll'],
  },

  manage_qa: {
    openingMessage: (ctx) =>
      `You have questions queued up. Want to see them and pick which to answer?`,
    suggestions: ['Show all questions', 'Top voted first', 'Mark one as answered', 'Clear all'],
  },

  extend_time: {
    openingMessage: "Running long? How much extra time do you need?",
    suggestions: ['15 more minutes', '30 more minutes', '1 more hour', 'Custom'],
  },

  end_event: {
    openingMessage: "End the event now? I'll start the post-event flow \u2014 recording, feedback, follow-up.",
    suggestions: ['End and send follow-up', 'End quietly', 'Not yet, keep going'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'End Event',
        description: 'This will close the live session for all attendees.',
        confirmLabel: 'End Event',
        cancelLabel: 'Keep Going',
        variant: 'warning',
      },
    }],
  },

  // ─── POST EVENT ──────────────────────────────────────────────
  upload_recording: {
    openingMessage: "Drop the recording link or upload a file. I'll attach it to the event.",
    suggestions: ['Paste a YouTube link', 'Paste a Vimeo link', 'Upload video file', 'No recording'],
  },

  share_recording: {
    openingMessage: (ctx) =>
      `Share the recording with all ${attendeeCount(ctx)} attendees? Want to include people who missed it too?`,
    suggestions: ['Attendees only', 'Everyone who registered', 'Post publicly', 'Custom audience'],
  },

  send_followup: {
    openingMessage: (ctx) =>
      `Let me draft a follow-up for your ${attendeeCount(ctx)} attendees. Want to include the recording, resources, or next steps?`,
    suggestions: ['Thank you + recording', 'Thank you + next event', 'Custom message', 'Draft it for me'],
  },

  create_feedback_survey: {
    openingMessage: "I'll set up a feedback form. Standard questions or custom?",
    suggestions: ['Standard (quality, rating, NPS)', 'Custom questions', 'Quick 1-question poll', 'Skip feedback'],
  },

  summarize_feedback: {
    openingMessage: "Let me read through all the feedback and give you the key takeaways...",
    suggestions: ['Top compliments', 'Areas to improve', 'Interesting quotes', 'Full summary'],
  },

  create_recap_post: {
    openingMessage: (ctx) =>
      `I'll draft a recap post for "${eventName(ctx)}". Want to include key takeaways, photos, or the recording?`,
    suggestions: ['Full recap with highlights', 'Quick summary', 'Photo gallery post', 'Draft for social media'],
  },

  download_attendees: {
    openingMessage: "Export the attendee list. What format and what data?",
    suggestions: ['CSV with emails', 'CSV with registration answers', 'Just names & emails', 'Full export'],
  },

  archive_event: {
    openingMessage: (ctx) =>
      `Archive "${eventName(ctx)}"? It'll move out of your active list but stay accessible.`,
    suggestions: ['Yes, archive it', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Archive Event',
        description: 'The event will be moved to your archive.',
        confirmLabel: 'Archive',
        cancelLabel: 'Keep Active',
        variant: 'default',
      },
    }],
  },

  // ─── LEARNER ACTIONS ─────────────────────────────────────────
  register_event: {
    openingMessage: (ctx) => {
      const e = ctx.entityData;
      if (!e) return "Let me register you for this event.";
      const price = e.isPaid ? `$${e.price}` : 'Free';
      const date = e.date;
      return `Register for "${e.title}" on ${date}? It's ${price}.`;
    },
    suggestions: ['Yes, register me', 'Tell me more first', 'Check my calendar', 'Not now'],
  },

  join_waitlist: {
    openingMessage: (ctx) =>
      `This event is full. Want me to add you to the waitlist? I'll notify you if a spot opens.`,
    suggestions: ['Yes, add me', 'Notify me if spots open', 'Find similar events instead'],
  },

  cancel_registration: {
    openingMessage: (ctx) =>
      `Cancel your registration for "${eventName(ctx)}"? Your spot will be released.`,
    suggestions: ['Yes, cancel', 'Keep my registration'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Cancel Registration',
        description: 'Your spot will be released to the waitlist.',
        confirmLabel: 'Cancel Registration',
        cancelLabel: 'Keep It',
        variant: 'warning',
      },
    }],
  },

  update_registration: {
    openingMessage: "What do you want to change about your registration?",
    suggestions: ['Update my answers', 'Change ticket tier', 'Update my info'],
  },

  add_to_calendar: {
    openingMessage: (ctx) =>
      `Add "${eventName(ctx)}" to your calendar?`,
    suggestions: ['Google Calendar', 'Apple Calendar', 'Download .ics file', 'Outlook'],
    initialCards: [{
      type: 'choice',
      data: {
        question: 'Add to calendar',
        options: [
          { id: 'google', label: 'Google Calendar' },
          { id: 'apple', label: 'Apple Calendar' },
          { id: 'outlook', label: 'Outlook' },
          { id: 'ics', label: 'Download .ics' },
        ],
      },
    }],
  },

  set_reminder: {
    openingMessage: "When should I remind you?",
    suggestions: ['1 day before', '2 hours before', '30 minutes before', 'Custom time'],
    initialCards: [{
      type: 'choice',
      data: {
        question: 'Remind me',
        options: [
          { id: '1d', label: '1 day before' },
          { id: '2h', label: '2 hours before' },
          { id: '30m', label: '30 minutes before' },
          { id: 'custom', label: 'Custom time' },
        ],
      },
    }],
  },

  ask_about_event: {
    openingMessage: (ctx) =>
      `What would you like to know about "${eventName(ctx)}"? I can answer from the event details or pass your question to the organizer.`,
    suggestions: ['What will I learn?', 'Is it beginner friendly?', 'Will there be a recording?', 'Ask the organizer'],
  },

  invite_friend: {
    openingMessage: "Who do you want to invite? I'll send them the event details.",
    suggestions: ['Share a link', 'Send to a friend', 'Post in my community'],
  },

  share_attending: {
    openingMessage: (ctx) =>
      `I'll draft a post: "Excited to attend ${eventName(ctx)}!" Want to customize it?`,
    suggestions: ['Post as-is', 'Customize it', 'Just copy text', 'Share on LinkedIn'],
  },

  ask_question_live: {
    openingMessage: "What's your question? I'll add it to the Q&A queue.",
    suggestions: [],
  },

  take_notes: {
    openingMessage: "I'll help you capture notes. Tell me key points as you hear them, or I'll prompt you at the end of each session.",
    suggestions: ['Start noting', 'Remind me after each session', 'Just let me type freely'],
  },

  report_issue: {
    openingMessage: "What's the issue?",
    suggestions: ['Audio not working', 'Can\'t see screen', 'Inappropriate content', 'Other issue'],
    initialCards: [{
      type: 'choice',
      data: {
        question: "What's wrong?",
        options: [
          { id: 'audio', label: 'Audio issues' },
          { id: 'video', label: 'Video/screen issues' },
          { id: 'content', label: 'Inappropriate content' },
          { id: 'access', label: 'Can\'t access event' },
          { id: 'other', label: 'Something else' },
        ],
      },
    }],
  },

  submit_feedback: {
    openingMessage: (ctx) =>
      `How was "${eventName(ctx)}"? Let's go through a few quick questions.`,
    suggestions: ['It was great!', 'It was okay', 'Some feedback to share', 'Skip feedback'],
  },

  rate_event: {
    openingMessage: "How would you rate this event?",
    suggestions: [],
    initialCards: [{
      type: 'choice',
      data: {
        question: 'Your rating',
        options: [
          { id: '5', label: '\u2B50\u2B50\u2B50\u2B50\u2B50 Excellent' },
          { id: '4', label: '\u2B50\u2B50\u2B50\u2B50 Great' },
          { id: '3', label: '\u2B50\u2B50\u2B50 Good' },
          { id: '2', label: '\u2B50\u2B50 Fair' },
          { id: '1', label: '\u2B50 Poor' },
        ],
      },
    }],
  },

  share_recap: {
    openingMessage: "Want to share your takeaways? I'll help draft a post.",
    suggestions: ['Draft a post for me', 'Just share the recording', 'Share key quotes'],
  },

  connect_speaker: {
    openingMessage: (ctx) => {
      const speakers = ctx.entityData?.speakers || [];
      if (speakers.length === 0) return "Want to connect with the presenter?";
      if (speakers.length === 1) return `Want to send ${speakers[0].name} a connection request?`;
      return `Which speaker do you want to connect with?`;
    },
    suggestions: (ctx) => {
      const speakers = ctx.entityData?.speakers || [];
      return speakers.length > 0
        ? speakers.map(s => s.name)
        : ['Send a message', 'Connection request'];
    },
  },

  connect_attendees: {
    openingMessage: "Want to connect with other attendees? Here are people who attended.",
    suggestions: ['Show attendee list', 'Find people with similar interests', 'Connect with all'],
  },

  get_certificate: {
    openingMessage: (ctx) =>
      `I'll generate your attendance certificate for "${eventName(ctx)}".`,
    suggestions: ['Generate certificate', 'Download PDF', 'Share on LinkedIn'],
  },

  find_similar: {
    openingMessage: "Looking for more like this? Let me find upcoming events that match your interests.",
    suggestions: ['Same topic', 'Same organizer', 'Same community', 'Surprise me'],
  },

  download_recording: {
    openingMessage: "Download the full recording or specific sessions?",
    suggestions: ['Full recording', 'Specific sessions', 'Audio only'],
  },

  // ─── SPEAKER ACTIONS ─────────────────────────────────────────
  manage_speaker_session: {
    openingMessage: "What do you want to manage about your session?",
    suggestions: ['Edit session details', 'Add resources', 'Manage Q&A'],
  },

  update_speaker_bio: {
    openingMessage: "Update your bio. What do you want to change?",
    suggestions: ['Add a photo', 'Update bio text', 'Add links'],
  },

  // ─── SERIES / RECURRING ──────────────────────────────────────
  edit_series: {
    openingMessage: "Edit the series settings. What do you want to change?",
    suggestions: ['Change frequency', 'Update template', 'Add new occurrences'],
  },

  skip_occurrence: {
    openingMessage: "Skip this occurrence? It'll be removed from the series.",
    suggestions: ['Yes, skip it', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Skip Occurrence',
        description: 'This occurrence will be removed from the series.',
        confirmLabel: 'Skip Occurrence',
        cancelLabel: 'Keep It',
        variant: 'warning',
      },
    }],
  },

  cancel_series: {
    openingMessage: "Cancel the entire series? It'll be removed from the calendar.",
    suggestions: ['Yes, cancel it', 'Not yet'],
    initialCards: [{
      type: 'confirmation',
      data: {
        title: 'Cancel Series',
        description: 'The entire series will be removed from the calendar.',
        confirmLabel: 'Cancel Series',
        cancelLabel: 'Keep It',
        variant: 'destructive',
      },
    }],
  },

  // ─── GENERAL ─────────────────────────────────────────────────
  general: {
    openingMessage: "Hey! What can I help you with?",
    suggestions: ['Create something', 'Help me find events', 'Check my schedule', 'What\'s new?'],
  },
};

// Helper labels for checklist items
const checklistLabels: Record<string, string> = {
  hasTitle: 'Event title',
  hasDescription: 'Description',
  hasDateTime: 'Date & time',
  hasCoverImage: 'Cover image',
  hasAgenda: 'Agenda / schedule',
  hasTickets: 'Tickets / pricing',
  hasSpeakers: 'Speakers',
  hasLocation: 'Location details',
  hasRegistrationForm: 'Registration settings',
  hasRegistrationConfig: 'Registration configuration',
};

// ─── Helper to get config ────────────────────────────────────────
export function getLeapyConfig(context: LeapyContext) {
  const config = leapyContextConfigs[context.type] || leapyContextConfigs.general;

  const openingMessage = typeof config.openingMessage === 'function'
    ? config.openingMessage(context)
    : config.openingMessage;

  const suggestions = typeof config.suggestions === 'function'
    ? config.suggestions(context)
    : config.suggestions || [];

  const initialCards = typeof config.initialCards === 'function'
    ? config.initialCards(context)
    : config.initialCards || [];

  return { openingMessage, suggestions, initialCards };
}