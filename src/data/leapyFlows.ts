// ═══════════════════════════════════════════════════════════════
// LEAPY FLOW ENGINE — Complete multi-turn conversation flows
// for every event action (creator + learner perspectives)
// ═══════════════════════════════════════════════════════════════

import { type RichCard } from './leapyContexts';
import { type MockEvent } from './mockEventData';

export interface FlowResponse {
  content: string;
  richCards?: RichCard[];
  suggestions?: string[];
  done?: boolean;
}

interface FlowBranch {
  match: string[]; // keyword matches (lowercase)
  response: FlowResponse | ((ctx: FlowCtx) => FlowResponse);
}

interface FlowTurn {
  branches: FlowBranch[];
  default: FlowResponse | ((ctx: FlowCtx) => FlowResponse);
}

export interface FlowCtx {
  event?: MockEvent;
  entityId?: string;
  communityName?: string;
  userInput: string;
  turnIndex: number;
  history: string[]; // all previous user messages
}

type FlowDef = FlowTurn[];

// ─── Helper: event name ──────────────────────────────────────
const en = (ctx: FlowCtx) => ctx.event?.title || 'your event';
const ac = (ctx: FlowCtx) => ctx.event?.attendeeCount || 0;
const cap = (ctx: FlowCtx) => ctx.event?.capacity || 'unlimited';

// ═══════════════════════════════════════════════════════════════
// CREATOR FLOWS
// ═══════════════════════════════════════════════════════════════

// ─── CREATE EVENT ────────────────────────────────────────────
const create_event: FlowDef = [
  // Turn 0: User describes their event
  {
    branches: [
      {
        match: ['brainstorm', 'idea', 'help', 'not sure', "don't know"],
        response: {
          content: "Let's brainstorm! Here are popular formats that work well:\n\n\u2022 **Workshop** — hands-on skill building (60-90 min)\n\u2022 **Webinar** — expert talk + Q&A (45-60 min)\n\u2022 **Meetup** — informal networking (1-2 hrs)\n\u2022 **AMA** — ask-me-anything with a guest (30-45 min)\n\u2022 **Hackathon** — collaborative building (4-8 hrs)\n\nWhat sounds closest to what you're thinking?",
          suggestions: ['Workshop on AI tools', 'Panel discussion', 'Networking mixer', 'AMA with an expert'],
        },
      },
    ],
    default: (ctx) => ({
      content: `Great idea! Here's what I've put together from "${ctx.userInput}":`,
      richCards: [{
        type: 'event_preview',
        data: {
          title: ctx.userInput.length > 50 ? ctx.userInput.substring(0, 50) + '...' : ctx.userInput,
          date: 'Friday, Mar 6, 2026',
          time: '2:00 PM EST',
          format: 'Virtual',
          capacity: 30,
          status: 'Draft',
          description: `An engaging session about ${ctx.userInput.toLowerCase()}.`,
        },
      }],
      suggestions: ['Looks good, save as draft', 'Change the date', 'Change to in-person', 'Set a different capacity'],
    }),
  },
  // Turn 1: User tweaks or saves
  {
    branches: [
      {
        match: ['looks good', 'save', 'draft', 'perfect', 'great'],
        response: {
          content: "Saved as draft! Now let's flesh it out. What do you want to work on?",
          richCards: [{
            type: 'checklist',
            data: {
              title: 'Event Setup',
              items: [
                { id: 'title', label: 'Title', done: true },
                { id: 'date', label: 'Date & Time', done: true },
                { id: 'format', label: 'Format', done: true },
                { id: 'capacity', label: 'Capacity', done: true },
                { id: 'description', label: 'Write description', done: false },
                { id: 'agenda', label: 'Build agenda', done: false },
                { id: 'speakers', label: 'Add speakers', done: false },
                { id: 'cover', label: 'Cover image', done: false },
                { id: 'registration', label: 'Registration settings', done: false },
                { id: 'tickets', label: 'Pricing / tickets', done: false },
              ],
            },
          }],
          suggestions: ['Write description', 'Build agenda', 'Add speakers', 'Set up registration'],
        },
      },
      {
        match: ['date', 'time', 'when', 'schedule'],
        response: {
          content: "When should the event be? Give me a date and time, or pick from these:",
          suggestions: ['Next Friday at 2pm', 'Saturday March 14 at 10am', 'This Thursday evening', 'Let me type a specific date'],
        },
      },
      {
        match: ['in-person', 'venue', 'location', 'physical'],
        response: {
          content: "Switching to in-person! Where will it be held?",
          suggestions: ['I have a venue', 'Need to find one', 'Make it hybrid instead'],
        },
      },
      {
        match: ['capacity', 'people', 'seats', 'limit'],
        response: {
          content: "How many people should be able to attend?",
          suggestions: ['10-15 (intimate)', '25-50 (medium)', '100+ (large)', 'No limit'],
        },
      },
    ],
    default: (ctx) => ({
      content: `Got it — I've updated that. Here's the latest:`,
      richCards: [{
        type: 'event_preview',
        data: {
          title: ctx.history[0] || 'Untitled Event',
          date: ctx.userInput.match(/\d/) ? ctx.userInput : 'Friday, Mar 6, 2026',
          time: '2:00 PM EST',
          format: 'Virtual',
          capacity: 30,
          status: 'Draft',
        },
      }],
      suggestions: ['Save as draft', 'Build agenda', 'Add speakers', 'Change something else'],
    }),
  },
  // Turn 2: Continue building or publish
  {
    branches: [
      {
        match: ['description', 'write', 'about'],
        response: {
          content: "Here's a draft description based on your event:\n\n> Join us for an engaging session where you'll learn practical skills and connect with like-minded professionals. Whether you're a beginner or experienced, you'll walk away with actionable insights you can apply immediately.\n\nWant to keep this, or should I adjust the tone?",
          suggestions: ['Keep it', 'Make it more professional', 'Make it shorter', 'I\'ll write my own'],
        },
      },
      {
        match: ['agenda', 'schedule', 'sessions'],
        response: {
          content: "Here's a suggested agenda:",
          richCards: [{
            type: 'agenda_preview',
            data: {
              sessions: [
                { time: '2:00 PM', title: 'Welcome & Introduction', duration: '10 min', type: 'intro' },
                { time: '2:10 PM', title: 'Main Presentation', duration: '35 min', type: 'talk' },
                { time: '2:45 PM', title: 'Interactive Exercise', duration: '20 min', type: 'workshop' },
                { time: '3:05 PM', title: 'Q&A Discussion', duration: '15 min', type: 'qa' },
                { time: '3:20 PM', title: 'Networking & Wrap-up', duration: '10 min', type: 'break' },
              ],
            },
          }],
          suggestions: ['Looks good!', 'Add a break', 'Change timings', 'Make it shorter'],
        },
      },
      {
        match: ['speaker', 'speakers', 'presenter'],
        response: {
          content: "Who's presenting? Give me a name (or multiple names) and I'll set up their profiles.",
          suggestions: ['I\'m the only speaker', 'Add Sarah Chen', 'Add multiple speakers', 'Skip for now'],
        },
      },
      {
        match: ['registration', 'signup', 'rsvp'],
        response: {
          content: "How should registration work?",
          richCards: [{
            type: 'choice',
            data: {
              question: 'Registration type',
              options: [
                { id: 'open', label: 'Open Registration', description: 'Anyone can register instantly' },
                { id: 'approval', label: 'Requires Approval', description: 'You review each application' },
                { id: 'invite', label: 'Invite Only', description: 'Only people you invite can attend' },
              ],
            },
          }],
          suggestions: [],
        },
      },
    ],
    default: {
      content: "Got it! What else do you want to work on? Or if you're ready, we can publish.",
      richCards: [{
        type: 'checklist',
        data: {
          title: 'Remaining Setup',
          items: [
            { id: 'description', label: 'Write description', done: false },
            { id: 'agenda', label: 'Build agenda', done: false },
            { id: 'speakers', label: 'Add speakers', done: false },
            { id: 'cover', label: 'Cover image', done: false },
          ],
        },
      }],
      suggestions: ['Write description', 'Build agenda', 'Add speakers', 'Ready to publish'],
    },
  },
  // Turn 3: Final touches or publish
  {
    branches: [
      {
        match: ['publish', 'ready', 'go live', 'launch'],
        response: (ctx) => ({
          content: `Your event is ready to go live! Here's the final version:`,
          richCards: [{
            type: 'event_preview',
            data: {
              title: ctx.history[0] || 'Untitled Event',
              date: 'Friday, Mar 6, 2026',
              time: '2:00 PM EST',
              format: 'Virtual',
              capacity: 30,
              status: 'Ready to Publish',
              description: 'An engaging session with hands-on exercises and expert insights.',
            },
          }, {
            type: 'confirmation',
            data: {
              title: 'Publish Event',
              description: 'Your event will be visible to everyone and open for registration.',
              confirmLabel: 'Publish Now',
              cancelLabel: 'Save as Draft',
              variant: 'default',
            },
          }],
          suggestions: [],
        }),
      },
      {
        match: ['keep', 'good', 'great', 'perfect', 'looks good'],
        response: {
          content: "Saved! What's next on the checklist?",
          suggestions: ['Build agenda', 'Add speakers', 'Set up tickets', 'Ready to publish'],
        },
      },
    ],
    default: {
      content: "Updated! Anything else before we publish?",
      suggestions: ['One more thing', 'Ready to publish', 'Save and come back later'],
    },
  },
  // Turn 4: Post-publish announcements
  {
    branches: [
      {
        match: ['publish', 'now', 'yes', 'confirm'],
        response: (ctx) => ({
          content: `"${ctx.history[0] || 'Your event'}" is now live! \ud83c\udf89 How do you want to spread the word?`,
          richCards: [{
            type: 'announcement_options',
            data: {
              options: [
                { id: 'community', label: 'Post in Community', icon: 'users' },
                { id: 'invite', label: 'Send Invites', icon: 'mail' },
                { id: 'link', label: 'Copy Share Link', icon: 'link' },
                { id: 'social', label: 'Draft Social Post', icon: 'twitter' },
              ],
            },
          }],
          suggestions: ['Do all of these', 'Just the link for now', 'I\'ll share later'],
        }),
      },
      {
        match: ['draft', 'save', 'later'],
        response: {
          content: "Saved as draft! You can find it in your Drafts tab anytime. Come back when you're ready to publish.",
          suggestions: [],
          done: true,
        },
      },
    ],
    default: {
      content: "All done! Your event is published and ready for attendees.",
      suggestions: [],
      done: true,
    },
  },
];

// ─── EDIT EVENT DETAILS ──────────────────────────────────────
const edit_event_details: FlowDef = [
  {
    branches: [
      {
        match: ['title', 'name'],
        response: (ctx) => ({
          content: `Current title: "${en(ctx)}"\n\nWhat should the new title be?`,
          suggestions: ['Keep current title', 'Suggest alternatives'],
        }),
      },
      {
        match: ['date', 'time', 'when'],
        response: (ctx) => ({
          content: `Current: ${ctx.event?.date || 'not set'} at ${ctx.event?.time || 'not set'}\n\nWhen should it be instead?`,
          suggestions: ['Next Friday at 2pm', 'Same time next week', 'Move to Saturday', 'Let me type a date'],
        }),
      },
      {
        match: ['capacity', 'spots', 'limit', 'people'],
        response: (ctx) => ({
          content: `Current capacity: ${cap(ctx)}. What should the new cap be?`,
          suggestions: ['25 people', '50 people', '100 people', 'Remove the cap'],
        }),
      },
      {
        match: ['format', 'virtual', 'in-person', 'hybrid', 'location'],
        response: (ctx) => ({
          content: `Currently set to: **${ctx.event?.location || 'virtual'}**. Change to:`,
          richCards: [{
            type: 'choice',
            data: {
              question: 'Event format',
              options: [
                { id: 'virtual', label: 'Virtual', description: 'Online meeting link' },
                { id: 'in-person', label: 'In Person', description: 'Physical venue' },
                { id: 'hybrid', label: 'Hybrid', description: 'Both options' },
              ],
            },
          }],
          suggestions: [],
        }),
      },
      {
        match: ['description', 'about'],
        response: (ctx) => ({
          content: ctx.event?.description
            ? `Here's the current description:\n\n> ${ctx.event.description.substring(0, 200)}${ctx.event.description.length > 200 ? '...' : ''}\n\nWhat do you want to change?`
            : "No description yet. Want me to write one based on the event title and details?",
          suggestions: ['Rewrite it', 'Make it shorter', 'Make it more engaging', 'I\'ll type my own'],
        }),
      },
    ],
    default: (ctx) => ({
      content: `I'll update that for "${en(ctx)}". What specifically do you want to change?`,
      suggestions: ['Change title', 'Change date/time', 'Change capacity', 'Change format'],
    }),
  },
  // Turn 1: Apply the change
  {
    branches: [
      {
        match: ['keep', 'never mind', 'cancel'],
        response: { content: "No changes made. Anything else?", suggestions: ['Change something else', "That's all"], done: true },
      },
    ],
    default: (ctx) => ({
      content: `Updated! Here's the change:\n\n${ctx.userInput}\n\n${ctx.event?.lifecycleStage === 'published' ? `I'll notify your ${ac(ctx)} registrants about this change.` : ''}`,
      richCards: [{
        type: 'event_preview',
        data: {
          title: en(ctx),
          date: ctx.event?.date || 'TBD',
          time: ctx.event?.time || 'TBD',
          format: ctx.event?.location || 'Virtual',
          capacity: ctx.event?.capacity,
          status: ctx.event?.lifecycleStage === 'published' ? 'Published' : 'Draft',
        },
      }],
      suggestions: ['Change something else', "That's all, thanks"],
    }),
  },
  // Turn 2: Done or continue
  {
    branches: [
      { match: ['all', 'done', 'thanks', 'that'], response: { content: "All updated! \u2705", suggestions: [], done: true } },
      { match: ['change', 'another', 'more', 'also'], response: { content: "What else do you want to change?", suggestions: ['Title', 'Date/Time', 'Capacity', 'Format', 'Description'] } },
    ],
    default: { content: "Anything else to update?", suggestions: ['Change something else', "All done"] },
  },
];

// ─── EDIT COVER ──────────────────────────────────────────────
const edit_event_cover: FlowDef = [
  {
    branches: [
      {
        match: ['generate', 'ai', 'create', 'make'],
        response: (ctx) => ({
          content: `I've generated 3 cover options based on "${en(ctx)}". Pick your favorite:`,
          richCards: [{
            type: 'choice',
            data: {
              question: 'Choose a cover',
              options: [
                { id: 'a', label: 'Option A — Modern Abstract', description: 'Purple geometric pattern with bold typography' },
                { id: 'b', label: 'Option B — Clean Minimal', description: 'White background with centered title and accent line' },
                { id: 'c', label: 'Option C — Dark Professional', description: 'Dark gradient with event details overlay' },
              ],
            },
          }],
          suggestions: ['Regenerate all', 'I\'ll upload my own instead'],
        }),
      },
      {
        match: ['upload', 'own', 'my'],
        response: { content: "Upload your cover image and I'll attach it to the event.", suggestions: ['Actually, generate one instead', 'Skip for now'] },
      },
      {
        match: ['stock', 'photo', 'unsplash'],
        response: (ctx) => ({
          content: `I found some stock photos that match "${en(ctx)}". Here are the top picks:`,
          richCards: [{
            type: 'choice',
            data: {
              question: 'Choose a stock photo',
              options: [
                { id: 's1', label: 'Conference room with people collaborating' },
                { id: 's2', label: 'Laptop screen with code and coffee' },
                { id: 's3', label: 'Diverse team in brainstorming session' },
              ],
            },
          }],
          suggestions: ['Show more options', 'Search for something specific'],
        }),
      },
      {
        match: ['skip', 'later', 'not now'],
        response: { content: "No problem! You can add a cover anytime from the event overview.", suggestions: [], done: true },
      },
    ],
    default: { content: "Want me to generate a cover based on the event theme, or do you have one to upload?", suggestions: ['Generate for me', 'I\'ll upload', 'Use a stock photo', 'Skip'] },
  },
  // Turn 1: After selection
  {
    branches: [],
    default: (ctx) => ({
      content: `Cover image updated! \u2705 It'll be the first thing attendees see on your event page.`,
      richCards: [{
        type: 'event_preview',
        data: { title: en(ctx), date: ctx.event?.date, time: ctx.event?.time, format: ctx.event?.location, status: 'Cover Updated' },
      }],
      suggestions: ['Looks great!', 'Try a different one'],
      done: true,
    }),
  },
];

// ─── EDIT DESCRIPTION ────────────────────────────────────────
const edit_event_description: FlowDef = [
  {
    branches: [
      {
        match: ['write', 'draft', 'create', 'for me', 'generate'],
        response: (ctx) => ({
          content: `Here's a compelling description for "${en(ctx)}":\n\n> **What you'll learn:**\n> \u2022 Practical, hands-on skills you can use immediately\n> \u2022 Industry insights from experienced practitioners\n> \u2022 Networking with like-minded professionals\n>\n> **Who is this for?**\n> Anyone interested in leveling up their skills, from beginners to intermediate practitioners.\n>\n> **Format:** Interactive session with presentation, exercises, and Q&A.\n\nWant to use this, or should I adjust it?`,
          suggestions: ['Use this', 'Make it shorter', 'More technical tone', 'I\'ll write my own'],
        }),
      },
      {
        match: ['rewrite', 'change', 'adjust', 'different'],
        response: (ctx) => ({
          content: "What tone are you going for?",
          richCards: [{
            type: 'choice',
            data: {
              question: 'Description style',
              options: [
                { id: 'casual', label: 'Casual & Friendly', description: 'Conversational, approachable' },
                { id: 'professional', label: 'Professional', description: 'Polished, business-focused' },
                { id: 'exciting', label: 'Exciting & Urgent', description: 'High energy, FOMO-inducing' },
                { id: 'minimal', label: 'Short & Sweet', description: 'Just the essentials, 2-3 sentences' },
              ],
            },
          }],
          suggestions: [],
        }),
      },
      {
        match: ['shorter', 'short', 'brief', 'concise'],
        response: (ctx) => ({
          content: `Here's a shorter version:\n\n> Join us for a hands-on session on ${en(ctx).toLowerCase()}. You'll walk away with practical skills and new connections. All experience levels welcome.\n\nUse this?`,
          suggestions: ['Use this', 'Even shorter', 'Add more detail', 'I\'ll write my own'],
        }),
      },
    ],
    default: (ctx) => ({
      content: "Tell me the key points and I'll draft a description. What should attendees know?",
      suggestions: ['Write it for me', 'Make it professional', 'Keep it short', 'I\'ll type my own'],
    }),
  },
  {
    branches: [
      { match: ['use', 'keep', 'good', 'perfect', 'great', 'yes'], response: { content: "Description saved! \u2705", suggestions: [], done: true } },
    ],
    default: (ctx) => ({
      content: `Updated:\n\n> ${ctx.userInput.length > 20 ? ctx.userInput : 'A compelling event description that captures your vision.'}\n\nLook good?`,
      suggestions: ['Perfect!', 'Tweak it more', 'Start over'],
    }),
  },
  {
    branches: [],
    default: { content: "Description saved! \u2705 It's live on your event page.", suggestions: [], done: true },
  },
];

// ─── ADD/EDIT SPEAKERS ───────────────────────────────────────
const add_speakers: FlowDef = [
  {
    branches: [
      {
        match: ["i'm", 'only speaker', 'just me', 'myself'],
        response: {
          content: "Got it — you're listed as the speaker! Want to customize your speaker bio?",
          richCards: [{
            type: 'speaker_list',
            data: { speakers: [{ name: 'You (Organizer)', role: 'Speaker & Host', bio: 'Event organizer' }] },
          }],
          suggestions: ['Add a bio', 'Looks good', 'Add a co-speaker too'],
        },
      },
      {
        match: ['multiple', 'several', 'panel', 'few'],
        response: {
          content: "Give me all the names and I'll set up profiles for each. You can list them all at once!",
          suggestions: ['Sarah Chen, Marcus Rivera', 'List 3 speakers'],
        },
      },
      {
        match: ['find', 'suggest', 'recommend', 'help'],
        response: {
          content: "I can help find speakers! What topic or expertise are you looking for?",
          suggestions: ['AI/ML experts', 'Design leaders', 'Startup founders', 'Community builders'],
        },
      },
    ],
    default: (ctx) => {
      const name = ctx.userInput.replace(/^add\s+/i, '').replace(/^speaker:?\s*/i, '').trim();
      const names = name.split(/,|and/).map(n => n.trim()).filter(n => n.length > 2);
      if (names.length > 1) {
        return {
          content: `Added ${names.length} speakers! Let me set up their profiles:`,
          richCards: [{
            type: 'speaker_list',
            data: { speakers: names.map(n => ({ name: n, role: 'Speaker', bio: 'Bio not set' })) },
          }],
          suggestions: ['Add bios for all', 'Add another speaker', 'That\'s everyone'],
        };
      }
      return {
        content: `Added ${name || 'the speaker'}! What's their title/role?`,
        suggestions: ['CEO / Founder', 'Senior Engineer', 'Design Lead', 'Skip — add bio later'],
      };
    },
  },
  // Turn 1: Bio/role
  {
    branches: [
      {
        match: ['skip', 'later', 'that\'s', 'everyone', 'done', 'good'],
        response: (ctx) => ({
          content: `Speakers saved! \u2705 They'll appear on the event page.`,
          richCards: [{
            type: 'speaker_list',
            data: { speakers: [{ name: ctx.history[0] || 'Speaker', role: 'Speaker', bio: '' }, ...(ctx.event?.speakers || [])] },
          }],
          suggestions: ['Add another speaker', 'That\'s all'],
          done: true,
        }),
      },
      {
        match: ['another', 'more', 'add'],
        response: { content: "Who's next? Give me a name.", suggestions: [] },
      },
    ],
    default: (ctx) => ({
      content: `Updated their profile. Want to add a short bio too? (1-2 sentences about their expertise)`,
      suggestions: ['Add a bio', 'Skip bio', 'Add another speaker'],
    }),
  },
  // Turn 2: Final
  {
    branches: [],
    default: (ctx) => ({
      content: "Speaker profiles updated! \u2705",
      richCards: [{
        type: 'speaker_list',
        data: { speakers: [{ name: ctx.history[0] || 'Speaker', role: ctx.history[1] || 'Speaker', bio: ctx.userInput.length > 10 ? ctx.userInput : '' }] },
      }],
      suggestions: ['Add another speaker', 'All done'],
      done: true,
    }),
  },
];

// Re-use for edit_speakers
const edit_speakers = add_speakers;

// ─── BUILD AGENDA ────────────────────────────────────────────
const build_agenda: FlowDef = [
  {
    branches: [
      {
        match: ['generate', 'create', 'suggest', 'for me', 'auto'],
        response: (ctx) => ({
          content: `Here's a suggested agenda for "${en(ctx)}":`,
          richCards: [{
            type: 'agenda_preview',
            data: {
              sessions: [
                { time: '2:00 PM', title: 'Welcome & Introductions', duration: '10 min', type: 'intro' },
                { time: '2:10 PM', title: 'Keynote Presentation', duration: '30 min', type: 'talk' },
                { time: '2:40 PM', title: 'Interactive Workshop', duration: '25 min', type: 'workshop' },
                { time: '3:05 PM', title: 'Break', duration: '10 min', type: 'break' },
                { time: '3:15 PM', title: 'Group Discussion & Q&A', duration: '20 min', type: 'qa' },
                { time: '3:35 PM', title: 'Closing & Next Steps', duration: '10 min', type: 'intro' },
              ],
            },
          }],
          suggestions: ['Looks perfect!', 'Remove the break', 'Make it shorter', 'Add another session'],
        }),
      },
      {
        match: ['intro', 'talk', 'q&a', 'workshop'],
        response: {
          content: "Building that out:",
          richCards: [{
            type: 'agenda_preview',
            data: {
              sessions: [
                { time: '2:00 PM', title: 'Welcome & Introduction', duration: '15 min', type: 'intro' },
                { time: '2:15 PM', title: 'Main Presentation', duration: '40 min', type: 'talk' },
                { time: '2:55 PM', title: 'Hands-on Exercise', duration: '20 min', type: 'workshop' },
                { time: '3:15 PM', title: 'Q&A & Discussion', duration: '15 min', type: 'qa' },
              ],
            },
          }],
          suggestions: ['Looks good!', 'Add a networking session', 'Change timings', 'Add speakers to sessions'],
        },
      },
    ],
    default: {
      content: "Walk me through the rough flow. For example: \"Intro, main talk, hands-on exercise, Q&A\"\n\nOr I can generate an agenda based on the event type. What do you prefer?",
      suggestions: ['Generate for me', 'Intro → Talk → Q&A', 'Multi-session conference', 'Workshop format'],
    },
  },
  // Turn 1: Tweak
  {
    branches: [
      {
        match: ['good', 'perfect', 'great', 'looks', 'keep', 'done'],
        response: { content: "Agenda saved! \u2705 It's now visible on your event page.", suggestions: ['Add speakers to sessions', 'All done'], done: true },
      },
      {
        match: ['add', 'another', 'more', 'session', 'insert'],
        response: {
          content: "What session do you want to add? Give me a title and approximate duration.",
          suggestions: ['10-min networking break', 'Lightning talks (20 min)', 'Panel discussion (30 min)'],
        },
      },
      {
        match: ['remove', 'delete', 'cut'],
        response: {
          content: "Which session should I remove?",
          suggestions: ['The break', 'The workshop', 'The last session'],
        },
      },
      {
        match: ['shorter', 'less time', 'condense'],
        response: {
          content: "Here's a condensed version:",
          richCards: [{
            type: 'agenda_preview',
            data: {
              sessions: [
                { time: '2:00 PM', title: 'Welcome', duration: '5 min', type: 'intro' },
                { time: '2:05 PM', title: 'Main Presentation', duration: '30 min', type: 'talk' },
                { time: '2:35 PM', title: 'Q&A', duration: '15 min', type: 'qa' },
              ],
            },
          }],
          suggestions: ['Use this', 'Too short, add more', 'Perfect!'],
        },
      },
      {
        match: ['speaker', 'assign'],
        response: {
          content: "Which session should I assign a speaker to? And who's presenting?",
          suggestions: ['Assign to all sessions', 'Just the keynote'],
        },
      },
    ],
    default: {
      content: "Updated the agenda. Anything else to adjust?",
      suggestions: ['Add a session', 'Change timings', 'Looks good!'],
    },
  },
  // Turn 2
  {
    branches: [],
    default: { content: "Agenda finalized! \u2705 Your attendees will see this on the event page.", suggestions: [], done: true },
  },
];

const edit_agenda = build_agenda;

// ─── REGISTRATION / TICKETS / LOCATION ────────────────────
const set_registration: FlowDef = [
  {
    branches: [
      { match: ['open', 'anyone', 'public', 'free'], response: { content: "Open registration it is! Anyone can register instantly. Want to add any registration questions?", suggestions: ['No questions needed', 'Ask experience level', 'Ask what they want to learn', 'Custom question'] } },
      { match: ['invite', 'only', 'private'], response: { content: "Invite-only! Only people you explicitly invite can register. Want to send invites now?", suggestions: ['Send invites now', 'I\'ll invite later', 'Change to approval-based'] } },
      { match: ['approval', 'review', 'screen'], response: { content: "Approval-based registration. You'll review each application before accepting. Want to add screening questions?", richCards: [{ type: 'choice', data: { question: 'Screening questions', options: [{ id: 'exp', label: 'Experience level', description: 'Beginner/Intermediate/Advanced' }, { id: 'why', label: 'Why do you want to attend?', description: 'Short text answer' }, { id: 'role', label: 'Your role', description: 'Designer/Developer/PM/Other' }, { id: 'custom', label: 'Custom question', description: 'Write your own' }] } }], suggestions: [] } },
      { match: ['question', 'ask', 'form'], response: { content: "What do you want to ask registrants?", suggestions: ['Experience level', 'What they want to learn', 'Their role/title', 'Custom question'] } },
    ],
    default: { content: "How should registration work?", richCards: [{ type: 'choice', data: { question: 'Registration type', options: [{ id: 'open', label: 'Open Registration', description: 'Anyone can sign up' }, { id: 'approval', label: 'Requires Approval', description: 'You review applications' }, { id: 'invite', label: 'Invite Only', description: 'Only invited people' }] } }], suggestions: [] },
  },
  {
    branches: [],
    default: { content: "Registration settings saved! \u2705 Attendees will see this when they register.", suggestions: ['Add registration questions', 'Set a deadline', 'All done'], done: true },
  },
];

const set_tickets: FlowDef = [
  {
    branches: [
      { match: ['free'], response: { content: "Free event! No payment required. Attendees just register. Want to set a donation option?", suggestions: ['No, keep it free', 'Add optional donation', 'Actually, make it paid'] } },
      { match: ['single', 'one tier', 'one price', 'simple'], response: { content: "What price? I'll set up a single ticket tier.", suggestions: ['$15', '$25', '$49', '$99'] } },
      { match: ['multiple', 'tiers', 'vip', 'basic'], response: { content: "Here's a suggested tier structure:", richCards: [{ type: 'choice', data: { question: 'Ticket tiers', options: [{ id: 'basic', label: 'General — $25', description: 'Standard access to the event' }, { id: 'vip', label: 'VIP — $49', description: 'Priority seating + networking hour' }, { id: 'premium', label: 'Premium — $99', description: 'VIP + 1-on-1 session with speaker' }] } }], suggestions: ['Use these tiers', 'Adjust prices', 'Add early bird'] } },
      { match: ['early', 'bird', 'discount'], response: { content: "Great idea! Early bird pricing drives registrations. Set the details:", suggestions: ['20% off first 50 tickets', '30% off until March 1', '$10 off first week', 'Custom'] } },
    ],
    default: { content: "Is this a free or paid event?", richCards: [{ type: 'choice', data: { question: 'Pricing', options: [{ id: 'free', label: 'Free Event' }, { id: 'single', label: 'Single Price', description: 'One ticket tier' }, { id: 'multi', label: 'Multiple Tiers', description: 'General, VIP, Premium, etc.' }] } }], suggestions: [] },
  },
  {
    branches: [],
    default: { content: "Ticket setup complete! \u2705 Attendees can now purchase tickets.", suggestions: ['Add early bird pricing', 'Add discount codes', 'All done'], done: true },
  },
];

const set_location: FlowDef = [
  {
    branches: [
      { match: ['virtual', 'online', 'zoom', 'meet', 'teams'], response: { content: "Virtual event! Want me to generate a meeting link, or do you have one?", suggestions: ['Generate a Zoom link', 'Generate a Google Meet link', 'I\'ll paste my own link'] } },
      { match: ['in-person', 'physical', 'venue'], response: { content: "Where's it happening? Give me the venue name and address.", suggestions: ['I have a venue', 'Help me find a venue', 'TBD — decide later'] } },
      { match: ['hybrid', 'both'], response: { content: "Hybrid it is! I'll set up both a virtual link and a physical location. Let's start with the venue — where's the in-person portion?", suggestions: ['I have a venue', 'Virtual link first'] } },
    ],
    default: { content: "Where is this happening?", richCards: [{ type: 'choice', data: { question: 'Event format', options: [{ id: 'virtual', label: 'Virtual', description: 'Online meeting link' }, { id: 'in-person', label: 'In Person', description: 'Physical venue' }, { id: 'hybrid', label: 'Hybrid', description: 'Both virtual & physical' }] } }], suggestions: [] },
  },
  {
    branches: [],
    default: { content: "Location set! \u2705 Attendees will see this on the event page.", suggestions: [], done: true },
  },
];

// ─── PRE-PUBLISH ─────────────────────────────────────────────
const review_checklist: FlowDef = [
  {
    branches: [
      { match: ['fix', 'help', 'complete', 'finish'], response: (ctx) => ({ content: "Let's knock these out one at a time. Which item first?", suggestions: ['Description', 'Cover image', 'Agenda', 'Speakers'] }) },
      { match: ['publish', 'anyway', 'skip', 'as-is'], response: (ctx) => ({ content: `Publish "${en(ctx)}" with incomplete items? Your event will still work, but completing the checklist helps attract more attendees.`, richCards: [{ type: 'confirmation', data: { title: 'Publish Anyway?', description: 'Some setup items are incomplete.', confirmLabel: 'Publish Now', cancelLabel: 'Fix Items First', variant: 'warning' } }], suggestions: [] }) },
    ],
    default: (ctx) => ({ content: "Let me help with the remaining items. What should we tackle first?", suggestions: ['Description', 'Cover image', 'Agenda', 'Speakers', 'Skip — publish now'] }),
  },
  {
    branches: [],
    default: { content: "Done! Want to move on to the next item, or are you ready to publish?", suggestions: ['Next item', 'Ready to publish'] },
  },
];

const publish_event: FlowDef = [
  {
    branches: [
      {
        match: ['publish', 'now', 'yes', 'go', 'launch', 'confirm'],
        response: (ctx) => ({
          content: `"${en(ctx)}" is now live! \ud83c\udf89\n\nYour event page is public and open for registration. How do you want to spread the word?`,
          richCards: [{
            type: 'announcement_options',
            data: {
              options: [
                { id: 'community', label: 'Post in Community' },
                { id: 'invite', label: 'Send Invites to Specific People' },
                { id: 'link', label: 'Copy Share Link' },
                { id: 'social', label: 'Draft a Social Media Post' },
                { id: 'email', label: 'Draft an Email Blast' },
              ],
            },
          }],
          suggestions: ['Do all of these', 'Just copy the link', 'I\'ll share later'],
        }),
      },
      {
        match: ['review', 'preview', 'check', 'first'],
        response: (ctx) => ({
          content: "Here's exactly how attendees will see it:",
          richCards: [{
            type: 'event_preview',
            data: {
              title: en(ctx),
              date: ctx.event?.date || 'TBD',
              time: ctx.event?.time || 'TBD',
              format: ctx.event?.location || 'Virtual',
              capacity: ctx.event?.capacity,
              description: ctx.event?.description,
              status: 'Preview',
            },
          }],
          suggestions: ['Publish now', 'Change something first', 'Save as draft'],
        }),
      },
      {
        match: ['fix', 'missing', 'incomplete'],
        response: { content: "What do you want to fix before publishing?", suggestions: ['Add description', 'Add cover image', 'Add speakers', 'Add agenda'] },
      },
    ],
    default: (ctx) => ({
      content: `Ready to publish "${en(ctx)}"? Here's a final look:`,
      richCards: [{
        type: 'event_preview',
        data: { title: en(ctx), date: ctx.event?.date, time: ctx.event?.time, format: ctx.event?.location, capacity: ctx.event?.capacity, status: 'Ready' },
      }],
      suggestions: ['Publish now!', 'Let me review first', 'Save as draft'],
    }),
  },
  // Turn 1: Announcement selection
  {
    branches: [
      { match: ['all', 'everything', 'do all'], response: (ctx) => ({ content: `On it! I'll:\n\n\u2705 Post in your community\n\u2705 Generate a share link\n\u2705 Draft a social media post\n\nHere's the share link: \`leapspace.io/event/${ctx.entityId || 'new'}\`\n\nAnd here's a tweet-length post:\n\n> Excited to announce "${en(ctx)}"! Join us on ${ctx.event?.date || 'TBD'}. Register now: leapspace.io/event/${ctx.entityId || 'new'}`, suggestions: ['Post to community too', 'Draft an email version', 'That\'s enough!'], done: true }) },
      { match: ['link', 'copy', 'share'], response: (ctx) => ({ content: `Here's your share link:\n\n\`leapspace.io/event/${ctx.entityId || 'new'}\`\n\nCopied to clipboard! \u2705`, suggestions: ['Draft a social post too', 'Send email invites', 'All done'], done: true }) },
      { match: ['later', 'skip', 'done'], response: { content: "No problem! Your event is live. You can share it anytime from the event page.", suggestions: [], done: true } },
      { match: ['social', 'tweet', 'post'], response: (ctx) => ({ content: `Here's a social post:\n\n**Twitter/X:**\n> \ud83d\udce3 "${en(ctx)}" — join us ${ctx.event?.date || 'soon'}! Register free: leapspace.io/event\n\n**LinkedIn:**\n> I'm hosting "${en(ctx)}" — a session on [topic]. Join ${ac(ctx)} others who've already signed up. Link in comments.\n\nWant me to adjust either version?`, suggestions: ['Copy Twitter version', 'Copy LinkedIn version', 'Edit them', 'All done'] }) },
    ],
    default: { content: "Event is live! Anything else you need?", suggestions: [], done: true },
  },
];

// ─── PUBLISHED EVENT MANAGEMENT ─────────────────────────────
const edit_published_event = edit_event_details; // Same flow but with notification warning

const send_update: FlowDef = [
  {
    branches: [
      { match: ['reminder', 'remind'], response: (ctx) => ({ content: `Here's a reminder message for your ${ac(ctx)} registrants:`, richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `Reminder: "${en(ctx)}" is coming up!`, content: `Hi there!\n\nJust a friendly reminder that "${en(ctx)}" is happening on ${ctx.event?.date || 'soon'} at ${ctx.event?.time || 'TBD'}.\n\n${ctx.event?.location === 'virtual' ? '📹 Join link: [link will be shared 30 min before]' : '📍 Venue: ' + (ctx.event?.locationDetails || 'TBD')}\n\nSee you there!` } }], suggestions: ['Send this', 'Edit the message', 'Add join link', 'Cancel'] }) },
      { match: ['venue', 'location', 'place'], response: (ctx) => ({ content: "What's the venue change? I'll draft a notification.", suggestions: ['New venue address', 'Changed to virtual', 'Changed to hybrid'] }) },
      { match: ['agenda', 'schedule'], response: (ctx) => ({ content: "What changed in the agenda? I'll notify attendees.", suggestions: ['New speaker added', 'Time shifted', 'Session added', 'Session removed'] }) },
      { match: ['general', 'announce', 'custom'], response: { content: "What do you want to tell your attendees? I'll draft the message.", suggestions: [] } },
    ],
    default: (ctx) => ({ content: `What do you want to tell your ${ac(ctx)} registered attendees?`, suggestions: ['Send a reminder', 'Venue change', 'Agenda update', 'Custom message'] }),
  },
  {
    branches: [
      { match: ['send', 'yes', 'confirm', 'go'], response: (ctx) => ({ content: `Message sent to ${ac(ctx)} attendees! \u2705 They'll get an email and in-app notification.`, suggestions: [], done: true }) },
      { match: ['edit', 'change', 'adjust'], response: { content: "What should I change in the message?", suggestions: ['Make it shorter', 'Add more detail', 'Change the tone'] } },
      { match: ['cancel', 'nevermind', 'don\'t'], response: { content: "Message cancelled. No one was notified.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({
      content: "Here's the drafted message:",
      richCards: [{ type: 'message_draft', data: { platform: 'Notification', subject: `Update about "${en(ctx)}"`, content: ctx.userInput } }],
      suggestions: ['Send this', 'Edit message', 'Cancel'],
    }),
  },
  {
    branches: [],
    default: (ctx) => ({ content: `Sent! \u2705 ${ac(ctx)} attendees notified.`, suggestions: [], done: true }),
  },
];

const message_attendees = send_update;

const manage_waitlist: FlowDef = [
  {
    branches: [
      { match: ['approve all', 'all', 'everyone'], response: (ctx) => ({ content: "All waitlisted people approved! \u2705 They'll receive confirmation emails.", suggestions: [], done: true }) },
      { match: ['one by one', 'individually', 'one'], response: { content: "Here's the waitlist:", richCards: [{ type: 'attendee_list', data: { attendees: [{ name: 'James Lee', position: 1 }, { name: 'Sofia Rodriguez', position: 2 }] } }], suggestions: ['Approve James', 'Approve Sofia', 'Approve both', 'Message waitlist'] } },
      { match: ['message', 'notify', 'email'], response: { content: "What do you want to tell the waitlisted people?", suggestions: ['We\'ll have more spots soon', 'Sorry, event is full', 'Custom message'] } },
      { match: ['increase', 'capacity', 'more spots'], response: (ctx) => ({ content: `Current cap: ${cap(ctx)}. How many more spots?`, suggestions: ['Add 5 more', 'Add 10 more', 'Remove cap entirely'] }) },
    ],
    default: { content: "You have people on the waitlist. What do you want to do?", suggestions: ['Approve all', 'Review one by one', 'Message waitlist', 'Increase capacity instead'] },
  },
  {
    branches: [],
    default: { content: "Waitlist updated! \u2705 Approved attendees have been notified.", suggestions: [], done: true },
  },
];

const increase_capacity: FlowDef = [
  {
    branches: [
      { match: ['10', 'ten'], response: (ctx) => ({ content: `Capacity increased from ${ctx.event?.capacity} to ${(ctx.event?.capacity || 0) + 10}! \u2705 ${ctx.event?.capacity ? '' : 'Waitlisted people auto-approved.'}`, suggestions: [], done: true }) },
      { match: ['25', 'twenty'], response: (ctx) => ({ content: `Capacity increased by 25! \u2705`, suggestions: [], done: true }) },
      { match: ['remove', 'unlimited', 'no cap', 'no limit'], response: { content: "Capacity limit removed! \u2705 Unlimited registrations allowed. All waitlisted people have been auto-approved.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({
      content: `Got it — capacity updated! \u2705`,
      suggestions: [],
      done: true,
    }),
  },
];

const close_registration: FlowDef = [
  {
    branches: [
      { match: ['yes', 'close', 'confirm'], response: (ctx) => ({ content: `Registration closed for "${en(ctx)}". \u2705 No new registrations will be accepted. Existing ${ac(ctx)} registrants are unaffected.`, suggestions: [], done: true }) },
      { match: ['no', 'keep', 'wait', 'not yet'], response: { content: "Registration stays open. Let me know if you change your mind.", suggestions: [], done: true } },
    ],
    default: { content: "Close registration or keep it open?", richCards: [{ type: 'confirmation', data: { title: 'Close Registration', description: 'No new people will be able to register.', confirmLabel: 'Close Now', cancelLabel: 'Keep Open', variant: 'warning' } }], suggestions: [] },
  },
];

const share_event: FlowDef = [
  {
    branches: [
      { match: ['link', 'copy'], response: (ctx) => ({ content: `Link copied! \u2705\n\n\`leapspace.io/event/${ctx.entityId || 'abc'}\``, suggestions: ['Format for Slack', 'Draft a tweet', 'Draft for LinkedIn', 'That\'s all'] }) },
      { match: ['slack'], response: (ctx) => ({ content: "Here's a Slack-formatted message:", richCards: [{ type: 'message_draft', data: { platform: 'Slack', content: `📣 *${en(ctx)}*\n📅 ${ctx.event?.date || 'TBD'} · ${ctx.event?.time || 'TBD'}\n📍 ${ctx.event?.location || 'Virtual'}\n👥 ${ac(ctx)} registered\n🔗 Register: leapspace.io/event/${ctx.entityId || 'abc'}` } }], suggestions: ['Copy this', 'Make it shorter', 'Format for another platform'] }) },
      { match: ['twitter', 'tweet', 'x'], response: (ctx) => ({ content: "Here's a tweet:", richCards: [{ type: 'message_draft', data: { platform: 'Twitter/X', content: `📣 Join us for "${en(ctx)}"!\n\n📅 ${ctx.event?.date || 'TBD'}\n${ctx.event?.isPaid ? '💰 ' + (ctx.event.price ? '$' + ctx.event.price : 'Paid') : '🆓 Free'}\n\nRegister → leapspace.io/event/${ctx.entityId || 'abc'}` } }], suggestions: ['Copy', 'Shorter version', 'LinkedIn version', 'Done'] }) },
      { match: ['linkedin'], response: (ctx) => ({ content: "Here's a LinkedIn post:", richCards: [{ type: 'message_draft', data: { platform: 'LinkedIn', content: `Excited to announce: "${en(ctx)}"\n\n${ctx.event?.description?.substring(0, 150) || 'An upcoming event you won\'t want to miss.'}\n\n📅 ${ctx.event?.date || 'TBD'} at ${ctx.event?.time || 'TBD'}\n📍 ${ctx.event?.location || 'Virtual'}\n\nRegister here: leapspace.io/event/${ctx.entityId || 'abc'}\n\n#event #community` } }], suggestions: ['Copy', 'Adjust tone', 'Twitter version', 'Done'] }) },
      { match: ['email'], response: (ctx) => ({ content: "Here's a draft email:", richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `You're invited: ${en(ctx)}`, content: `Hi there!\n\nI'd love for you to join us at "${en(ctx)}".\n\n📅 When: ${ctx.event?.date || 'TBD'} at ${ctx.event?.time || 'TBD'}\n📍 Where: ${ctx.event?.location || 'Virtual'}\n💰 Price: ${ctx.event?.isPaid ? '$' + (ctx.event?.price || 0) : 'Free'}\n\nRegister here: leapspace.io/event/${ctx.entityId || 'abc'}\n\nHope to see you there!` } }], suggestions: ['Send this', 'Edit message', 'Copy text'] }) },
    ],
    default: (ctx) => ({
      content: `Share "${en(ctx)}" — pick a format:`,
      richCards: [{
        type: 'announcement_options',
        data: { options: [{ id: 'link', label: 'Copy Share Link' }, { id: 'slack', label: 'Format for Slack' }, { id: 'twitter', label: 'Format for Twitter/X' }, { id: 'linkedin', label: 'Format for LinkedIn' }, { id: 'email', label: 'Draft an Email' }] },
      }],
      suggestions: [],
    }),
  },
  {
    branches: [
      { match: ['copy', 'done', 'thanks', 'all'], response: { content: "Copied! \u2705", suggestions: [], done: true } },
    ],
    default: { content: "Anything else to share?", suggestions: ['Another platform', 'That\'s all'], done: true },
  },
];

const generate_qr: FlowDef = [
  {
    branches: [
      { match: ['event', 'page', 'registration'], response: (ctx) => ({ content: `QR code generated for "${en(ctx)}"! \u2705\n\n[QR Code Image]\n\nScanning this takes people to your event registration page.`, suggestions: ['Download QR', 'Generate check-in QR too', 'Done'] }) },
      { match: ['check-in', 'checkin', 'attendance'], response: { content: "Check-in QR generated! \u2705 Attendees scan this to mark themselves present at the venue.", suggestions: ['Download QR', 'Generate event page QR too', 'Done'] } },
      { match: ['all', 'both'], response: (ctx) => ({ content: `Both QR codes generated! \u2705\n\n1. **Registration QR** — links to event page\n2. **Check-in QR** — marks attendance at venue\n\nBoth ready for download.`, suggestions: ['Download both', 'Done'], done: true }) },
    ],
    default: { content: "What QR code do you need?", richCards: [{ type: 'choice', data: { question: 'QR Code type', options: [{ id: 'reg', label: 'Registration Link', description: 'Takes people to event page' }, { id: 'checkin', label: 'Check-in Code', description: 'For marking attendance' }, { id: 'both', label: 'Both', description: 'Generate all QR codes' }] } }], suggestions: [] },
  },
  { branches: [], default: { content: "QR codes ready! \u2705", suggestions: [], done: true } },
];

const postpone_event: FlowDef = [
  {
    branches: [
      { match: ['next week', 'week'], response: (ctx) => ({ content: `Move to next week (same time)? That would be ${ctx.event?.time || 'TBD'}. I'll notify all ${ac(ctx)} registrants.`, richCards: [{ type: 'confirmation', data: { title: 'Postpone Event', description: `All ${ac(ctx)} registrants will be notified of the date change.`, confirmLabel: 'Confirm New Date', cancelLabel: 'Pick Different Date', variant: 'warning' } }], suggestions: [] }) },
      { match: ['next month', 'month'], response: (ctx) => ({ content: `Move to next month, same day of week and time? I'll notify all ${ac(ctx)} registrants.`, richCards: [{ type: 'confirmation', data: { title: 'Postpone Event', description: `All ${ac(ctx)} registrants will be notified.`, confirmLabel: 'Confirm', cancelLabel: 'Different Date', variant: 'warning' } }], suggestions: [] }) },
      { match: ['cancel', 'instead', 'actually'], response: (ctx) => ({ content: `Cancel "${en(ctx)}" instead? This will notify all ${ac(ctx)} registrants and can't be undone.`, richCards: [{ type: 'confirmation', data: { title: 'Cancel Event', description: 'All registrants will be notified. This cannot be undone.', confirmLabel: 'Cancel Event', cancelLabel: 'Keep Event', variant: 'destructive' } }], suggestions: [] }) },
    ],
    default: (ctx) => ({ content: `When should "${en(ctx)}" be moved to?`, suggestions: ['Next week, same time', 'Next month', 'Let me pick a date', 'Actually, cancel instead'] }),
  },
  {
    branches: [
      { match: ['confirm', 'yes'], response: (ctx) => ({ content: `Event postponed! \u2705 All ${ac(ctx)} registrants have been notified via email and in-app notification with the new date.`, suggestions: [], done: true }) },
    ],
    default: { content: "Date updated and registrants notified! \u2705", suggestions: [], done: true },
  },
];

const cancel_event: FlowDef = [
  {
    branches: [
      { match: ['scheduling', 'conflict', 'busy'], response: (ctx) => ({ content: `I'll cancel "${en(ctx)}" with reason: "Due to a scheduling conflict." Draft notification:`, richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `"${en(ctx)}" has been cancelled`, content: `We're sorry to let you know that "${en(ctx)}" has been cancelled due to a scheduling conflict.\n\nWe apologize for the inconvenience and hope to see you at a future event.` } }], suggestions: ['Send cancellation', 'Edit the message', 'Offer to reschedule instead'] }) },
      { match: ['low', 'registration', 'turnout', 'not enough'], response: (ctx) => ({ content: `I'll cancel with reason: "Insufficient registrations." Draft:`, richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `"${en(ctx)}" — Event Update`, content: `Unfortunately, "${en(ctx)}" has been cancelled due to low registration numbers.\n\nWe'll try to reschedule in the future. Thank you for your interest!` } }], suggestions: ['Send cancellation', 'Edit message', 'Reschedule instead'] }) },
      { match: ['speaker', 'unavailable'], response: (ctx) => ({ content: `Cancelling due to speaker unavailability. Draft:`, richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `"${en(ctx)}" — Cancelled`, content: `We regret to inform you that "${en(ctx)}" has been cancelled as our speaker is no longer available.\n\nWe're working on rescheduling. We'll keep you posted!` } }], suggestions: ['Send cancellation', 'Edit', 'Find replacement speaker instead'] }) },
    ],
    default: (ctx) => ({ content: `This will cancel "${en(ctx)}" and notify ${ac(ctx)} people. What's the reason?`, suggestions: ['Scheduling conflict', 'Low registration', 'Speaker unavailable', 'Custom reason'] }),
  },
  {
    branches: [
      { match: ['send', 'confirm', 'cancel', 'yes'], response: (ctx) => ({ content: `"${en(ctx)}" has been cancelled. \u2705 All ${ac(ctx)} registrants have been notified.`, suggestions: [], done: true }) },
      { match: ['reschedule', 'postpone'], response: (ctx) => ({ content: "When should we reschedule to?", suggestions: ['Next week', 'Next month', 'Let me pick a date'] }) },
      { match: ['edit', 'change'], response: { content: "What should I change in the message?", suggestions: ['Softer tone', 'Add reschedule note', 'Mention refunds'] } },
    ],
    default: (ctx) => ({
      content: "Ready to send the cancellation?",
      richCards: [{ type: 'confirmation', data: { title: 'Confirm Cancellation', description: `${ac(ctx)} people will be notified. This cannot be undone.`, confirmLabel: 'Send Cancellation', cancelLabel: 'Keep Event', variant: 'destructive' } }],
      suggestions: [],
    }),
  },
  { branches: [], default: { content: "Cancellation sent. \u2705", suggestions: [], done: true } },
];

// ─── LIVE EVENT ──────────────────────────────────────────────
const share_join_link: FlowDef = [
  {
    branches: [
      { match: ['copy', 'link'], response: { content: "Join link copied! \u2705", suggestions: ['Message absent attendees', 'Post in community', 'Done'] } },
      { match: ['message', 'absent', 'missing', 'haven\'t'], response: (ctx) => ({ content: `3 people haven't joined yet. Send them a nudge?\n\n> "Hey! We're live at "${en(ctx)}" — join us now: [link]"`, richCards: [{ type: 'message_draft', data: { platform: 'Push Notification', content: `"${en(ctx)}" is live now! Join: [link]` } }], suggestions: ['Send nudge', 'Edit message', 'Skip'] }) },
    ],
    default: { content: "Here's the join link. Want to message the people who haven't joined yet?", suggestions: ['Copy link', 'Message absent attendees', 'Post in community'] },
  },
  { branches: [], default: { content: "Done! \u2705", suggestions: [], done: true } },
];

const check_in_attendees: FlowDef = [
  {
    branches: [
      { match: ['mark', 'manual', 'present'], response: { content: "Who should I mark as present? Search by name:", suggestions: ['Mark all present', 'Show absent list'] } },
      { match: ['message', 'late', 'missing'], response: (ctx) => ({ content: "Sending a nudge to late arrivals:", richCards: [{ type: 'message_draft', data: { platform: 'Push', content: `We've started! Join "${en(ctx)}" now — you're missing out! 🔴` } }], suggestions: ['Send this', 'Edit', 'Skip'] }) },
      { match: ['all', 'everyone', 'auto'], response: (ctx) => ({ content: `All ${ac(ctx)} registered attendees marked as present! \u2705`, suggestions: [], done: true }) },
    ],
    default: (ctx) => ({ content: `${Math.round(ac(ctx) * 0.85)} checked in out of ${ac(ctx)} registered. What do you need?`, suggestions: ['Mark someone present', 'Message late arrivals', 'Auto check-in all', 'View attendance list'] }),
  },
  { branches: [], default: { content: "Attendance updated! \u2705", suggestions: [], done: true } },
];

const send_live_announcement: FlowDef = [
  {
    branches: [
      { match: ['start', 'we\'re', 'beginning'], response: { content: "Announcement sent to all attendees: \"We're starting now!\" \u2705", suggestions: ['Send another', 'Done'], done: true } },
      { match: ['break', 'pause', '5 min', '10 min'], response: { content: "Announcement sent: \"Taking a short break — we'll be back in a few minutes!\" \u2705", suggestions: ['Send another', 'Done'], done: true } },
      { match: ['link', 'doc', 'resource', 'slide'], response: { content: "Drop the link and I'll share it with all attendees:", suggestions: [] } },
    ],
    default: { content: "Type your announcement and I'll push it to all attendees right now.", suggestions: ['We\'re starting!', 'Taking a 5-min break', 'Link to shared doc', 'Custom announcement'] },
  },
  { branches: [], default: (ctx) => ({ content: `Announcement sent to all attendees! \u2705\n\n> "${ctx.userInput}"`, suggestions: ['Send another', 'Done'], done: true }) },
];

const share_live_resource: FlowDef = [
  {
    branches: [
      { match: ['link', 'url'], response: { content: "Paste the link and I'll share it instantly:", suggestions: [] } },
      { match: ['upload', 'file'], response: { content: "Upload the file and I'll share it with all attendees.", suggestions: [] } },
      { match: ['slide', 'deck', 'presentation'], response: { content: "Paste the link to your slides:", suggestions: [] } },
    ],
    default: { content: "What do you want to share with attendees?", suggestions: ['Share a link', 'Upload a file', 'Share slides', 'Share a poll'] },
  },
  { branches: [], default: { content: "Resource shared with all attendees! \u2705 They can see it in their event view.", suggestions: [], done: true } },
];

const manage_qa: FlowDef = [
  {
    branches: [
      { match: ['show', 'all', 'list', 'see'], response: { content: "Here are the queued questions:\n\n1. **\"How do we handle edge cases?\"** — Alex J. (\u2b06 12 votes)\n2. **\"Can you share the repo?\"** — Maria G. (\u2b06 8 votes)\n3. **\"What about performance?\"** — Chris B. (\u2b06 6 votes)\n4. **\"Is this approach production-ready?\"** — Priya P. (\u2b06 4 votes)\n5. **\"Any recommended resources?\"** — Tom W. (\u2b06 3 votes)", suggestions: ['Answer #1', 'Answer top 3', 'Mark all answered', 'Pin a question'] } },
      { match: ['top', 'voted', 'popular'], response: { content: "Top voted question:\n\n**\"How do we handle edge cases?\"** — Alex J. (\u2b06 12 votes)\n\nMark this as answered?", suggestions: ['Mark answered', 'Skip to next', 'Answer with text'] } },
      { match: ['answer', 'mark', 'answered'], response: { content: "Marked as answered! \u2705 Next question:\n\n**\"Can you share the repo?\"** — Maria G. (\u2b06 8 votes)", suggestions: ['Mark answered', 'Skip', 'Pin this one'] } },
      { match: ['clear', 'reset'], response: { content: "All questions cleared! \u2705 New questions can still be submitted.", suggestions: [], done: true } },
    ],
    default: { content: "You have 5 questions queued from attendees. What do you want to do?", suggestions: ['Show all questions', 'Top voted first', 'Mark all answered', 'Clear queue'] },
  },
  { branches: [], default: { content: "Q&A updated! \u2705", suggestions: ['Next question', 'Done with Q&A'] } },
];

const extend_time: FlowDef = [
  {
    branches: [
      { match: ['15', 'fifteen'], response: { content: "Extended by 15 minutes! \u2705 Attendees have been notified.", suggestions: [], done: true } },
      { match: ['30', 'thirty', 'half'], response: { content: "Extended by 30 minutes! \u2705 Attendees notified.", suggestions: [], done: true } },
      { match: ['hour', '60', 'one'], response: { content: "Extended by 1 hour! \u2705 Attendees notified.", suggestions: [], done: true } },
    ],
    default: { content: "How much extra time do you need?", suggestions: ['15 more minutes', '30 more minutes', '1 more hour'] },
  },
];

const end_event: FlowDef = [
  {
    branches: [
      { match: ['end', 'yes', 'confirm', 'follow'], response: (ctx) => ({ content: `"${en(ctx)}" has ended! \u2705\n\nPost-event actions available:`, richCards: [{ type: 'checklist', data: { title: 'Post-Event Checklist', items: [{ id: 'recording', label: 'Upload recording', done: false }, { id: 'followup', label: 'Send follow-up email', done: false }, { id: 'feedback', label: 'Send feedback survey', done: false }, { id: 'recap', label: 'Create recap post', done: false }, { id: 'certificate', label: 'Issue certificates', done: false }] } }], suggestions: ['Upload recording', 'Send follow-up', 'Create feedback survey', 'I\'ll do this later'] }) },
      { match: ['not yet', 'keep', 'no'], response: { content: "Keeping the event live! Let me know when you're ready to wrap up.", suggestions: [], done: true } },
      { match: ['quietly', 'quiet', 'silent'], response: (ctx) => ({ content: `Event ended quietly. \u2705 No automatic follow-ups sent. You can send them manually anytime.`, suggestions: [], done: true }) },
    ],
    default: { content: "End the event? I can start the post-event flow automatically.", richCards: [{ type: 'confirmation', data: { title: 'End Event', description: 'Close the live session for all attendees.', confirmLabel: 'End & Follow Up', cancelLabel: 'Keep Going', variant: 'warning' } }], suggestions: ['End quietly (no follow-up)'] },
  },
  {
    branches: [
      { match: ['later', 'skip'], response: { content: "No problem! You can handle post-event tasks anytime from the event page.", suggestions: [], done: true } },
    ],
    default: { content: "What post-event task do you want to handle first?", suggestions: ['Upload recording', 'Send follow-up', 'Create feedback survey'] },
  },
];

// ─── POST EVENT ──────────────────────────────────────────────
const upload_recording: FlowDef = [
  {
    branches: [
      { match: ['youtube', 'link', 'url', 'vimeo', 'paste'], response: { content: "Paste the recording URL:", suggestions: [] } },
      { match: ['upload', 'file'], response: { content: "Upload your recording file and I'll process it.", suggestions: [] } },
      { match: ['no', 'none', 'skip'], response: { content: "No recording to share. Attendees will be notified there's no recording.", suggestions: [], done: true } },
    ],
    default: { content: "How are you sharing the recording?", suggestions: ['Paste a YouTube link', 'Paste a Vimeo link', 'Upload file', 'No recording'] },
  },
  {
    branches: [],
    default: (ctx) => ({
      content: "Recording attached! \u2705 Share it with attendees now?",
      richCards: [{ type: 'confirmation', data: { title: 'Share Recording', description: `Send the recording to all ${ac(ctx)} attendees?`, confirmLabel: 'Share Now', cancelLabel: 'Just Save', variant: 'default' } }],
      suggestions: [],
    }),
  },
  { branches: [], default: (ctx) => ({ content: `Recording shared with ${ac(ctx)} attendees! \u2705`, suggestions: [], done: true }) },
];

const share_recording: FlowDef = [
  {
    branches: [
      { match: ['attendees', 'registered', 'only'], response: (ctx) => ({ content: `Recording shared with ${ac(ctx)} registered attendees! \u2705`, suggestions: [], done: true }) },
      { match: ['everyone', 'public', 'all'], response: { content: "Recording is now public! \u2705 Anyone with the link can watch it.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({ content: `Share the recording with all ${ac(ctx)} attendees? Or make it public?`, suggestions: ['Attendees only', 'Make it public', 'Select specific people'] }),
  },
];

const send_followup: FlowDef = [
  {
    branches: [
      { match: ['draft', 'for me', 'thank', 'recording', 'write'], response: (ctx) => ({ content: "Here's a draft follow-up:", richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `Thank you for attending "${en(ctx)}"!`, content: `Hi there!\n\nThank you for joining us at "${en(ctx)}". We hope you found it valuable!\n\n📹 **Recording:** Available on the event page\n📄 **Resources:** Slides and materials are attached\n📝 **Feedback:** We'd love to hear your thoughts — click here to fill out a quick survey\n\n🗓️ **What's Next:** Stay tuned for our next event!\n\nThanks again for being part of our community. See you next time!` } }], suggestions: ['Send this', 'Edit message', 'Add recording link', 'Add next event info'] }) },
      { match: ['custom', 'write', 'own'], response: { content: "What do you want to say? I'll format it nicely.", suggestions: [] } },
    ],
    default: (ctx) => ({ content: `What should the follow-up for "${en(ctx)}" include?`, suggestions: ['Thank you + recording', 'Thank you + feedback survey', 'Draft it for me', 'Custom message'] }),
  },
  {
    branches: [
      { match: ['send', 'yes', 'go', 'confirm'], response: (ctx) => ({ content: `Follow-up sent to ${ac(ctx)} attendees! \u2705`, suggestions: [], done: true }) },
      { match: ['edit', 'change', 'add', 'adjust'], response: { content: "What should I change?", suggestions: ['Add recording link', 'Add next event', 'Shorter version', 'Change tone'] } },
    ],
    default: (ctx) => ({
      content: "Here's the message. Ready to send?",
      richCards: [{ type: 'message_draft', data: { platform: 'Email', subject: `Follow-up: "${en(ctx)}"`, content: ctx.userInput } }],
      suggestions: ['Send it', 'Edit more'],
    }),
  },
  { branches: [], default: (ctx) => ({ content: `Sent! \u2705 ${ac(ctx)} attendees notified.`, suggestions: [], done: true }) },
];

const create_feedback_survey: FlowDef = [
  {
    branches: [
      { match: ['standard', 'default', 'quick'], response: { content: "Here's a standard feedback survey:", richCards: [{ type: 'checklist', data: { title: 'Feedback Questions', items: [{ id: 'q1', label: 'Overall rating (1-5 stars)', done: true }, { id: 'q2', label: 'Content quality rating', done: true }, { id: 'q3', label: 'Speaker rating', done: true }, { id: 'q4', label: 'Would you recommend? (NPS)', done: true }, { id: 'q5', label: 'What did you enjoy most?', done: true }, { id: 'q6', label: 'What could be improved?', done: true }] } }], suggestions: ['Send this survey', 'Add more questions', 'Remove a question', 'Custom questions'] } },
      { match: ['custom', 'own', 'specific'], response: { content: "What questions do you want to ask?", suggestions: ['Add rating question', 'Add text question', 'Add multiple choice'] } },
      { match: ['skip', 'no', 'none'], response: { content: "No feedback survey. You can always create one later from the event page.", suggestions: [], done: true } },
    ],
    default: { content: "Create a feedback survey for your attendees?", suggestions: ['Standard survey (6 questions)', 'Custom questions', 'Quick 1-question poll', 'Skip'] },
  },
  {
    branches: [
      { match: ['send', 'go', 'yes'], response: (ctx) => ({ content: `Feedback survey sent to ${ac(ctx)} attendees! \u2705 I'll summarize the results as they come in.`, suggestions: [], done: true }) },
    ],
    default: { content: "Survey ready! Send it now?", suggestions: ['Send now', 'Add another question', 'Preview first'] },
  },
];

const summarize_feedback: FlowDef = [
  {
    branches: [
      { match: ['top', 'best', 'compliment'], response: { content: "**Top Compliments:**\n\n\u2022 \"Incredible hands-on exercises\" (mentioned 8 times)\n\u2022 \"Speaker was engaging and knowledgeable\" (6 times)\n\u2022 \"Great networking opportunities\" (4 times)\n\u2022 \"Well-organized and on-time\" (3 times)", suggestions: ['Areas to improve', 'Interesting quotes', 'Full summary'] } },
      { match: ['improve', 'better', 'negative', 'issue'], response: { content: "**Areas for Improvement:**\n\n\u2022 \"Would love more hands-on time\" (5 mentions)\n\u2022 \"Audio quality could be better\" (3 mentions)\n\u2022 \"More breaks between sessions\" (2 mentions)\n\u2022 \"Slides were hard to read\" (1 mention)", suggestions: ['Top compliments', 'Full summary', 'Interesting quotes'] } },
      { match: ['quote', 'interesting'], response: { content: "**Notable Quotes:**\n\n> \"This was the best event I've attended this year. The workshop section alone was worth the time.\"\n> — Alex J.\n\n> \"Really appreciated the practical examples. Would attend again in a heartbeat.\"\n> — Maria G.\n\n> \"Loved the format. More events like this please!\"\n> — Priya P.", suggestions: ['Top compliments', 'Areas to improve', 'Full summary'] } },
    ],
    default: (ctx) => ({
      content: `**Feedback Summary for "${en(ctx)}"**\n\n⭐ **Average Rating:** 4.3/5 (${Math.round(ac(ctx) * 0.7)} responses)\n\n**Quick Take:**\nAttendees loved the hands-on exercises and speaker quality. Main improvement: more time for networking and better audio setup.\n\n**Breakdown:**\n\u2022 Content Quality: 4.5/5\n\u2022 Speaker Rating: 4.6/5\n\u2022 Organization: 4.2/5\n\u2022 Would Recommend (NPS): 72`,
      suggestions: ['Top compliments', 'Areas to improve', 'Interesting quotes', 'Export raw data'],
    }),
  },
  { branches: [], default: { content: "That's the full feedback analysis! Let me know if you need anything else.", suggestions: [], done: true } },
];

const create_recap_post: FlowDef = [
  {
    branches: [
      { match: ['full', 'highlight', 'complete'], response: (ctx) => ({ content: "Here's a full recap post:", richCards: [{ type: 'message_draft', data: { platform: 'Community Post', subject: `Recap: "${en(ctx)}"`, content: `🎉 What an amazing event!\n\n"${en(ctx)}" brought together ${ac(ctx)} attendees for an incredible session.\n\n**Key Takeaways:**\n• Practical, hands-on skills everyone can apply immediately\n• Expert insights from our speakers\n• Great discussions and networking\n\n**By the Numbers:**\n• ${ac(ctx)} registered | ${Math.round(ac(ctx) * 0.85)} attended\n• 4.3/5 average rating\n• 5 questions answered in live Q&A\n\n📹 Recording is now available on the event page.\n\nThank you to everyone who joined! Stay tuned for our next event. 🚀` } }], suggestions: ['Post this', 'Edit it', 'Shorter version', 'Add photos'] }) },
      { match: ['quick', 'short', 'brief'], response: (ctx) => ({ content: "Quick recap:", richCards: [{ type: 'message_draft', data: { platform: 'Community Post', content: `Thanks to everyone who joined "${en(ctx)}"! 🎉\n\n${ac(ctx)} attendees, great Q&A, and amazing energy. Recording is now available.\n\nSee you at the next one! 🚀` } }], suggestions: ['Post this', 'Add more detail', 'Edit'] }) },
    ],
    default: (ctx) => ({ content: `Draft a recap for "${en(ctx)}"?`, suggestions: ['Full recap with highlights', 'Quick summary', 'Photo gallery post', 'Draft for social media'] }),
  },
  {
    branches: [
      { match: ['post', 'publish', 'send', 'yes'], response: { content: "Recap posted to your community! \u2705", suggestions: [], done: true } },
    ],
    default: { content: "Ready to post?", suggestions: ['Post it!', 'Edit more', 'Share on social instead'] },
  },
];

const download_attendees: FlowDef = [
  {
    branches: [
      { match: ['csv', 'email', 'simple', 'names'], response: (ctx) => ({ content: `Exporting ${ac(ctx)} attendees as CSV with names and emails. Download starting... \u2705`, suggestions: [], done: true }) },
      { match: ['full', 'everything', 'all data', 'answers'], response: (ctx) => ({ content: `Full export with registration answers for ${ac(ctx)} attendees. Download starting... \u2705`, suggestions: [], done: true }) },
    ],
    default: { content: "What data do you need?", suggestions: ['Just names & emails (CSV)', 'Full export with registration answers', 'Attendance data only'] },
  },
];

const archive_event: FlowDef = [
  {
    branches: [
      { match: ['yes', 'archive', 'confirm'], response: (ctx) => ({ content: `"${en(ctx)}" archived! \u2705 You can find it in your archive anytime.`, suggestions: [], done: true }) },
      { match: ['no', 'not yet', 'keep'], response: { content: "Keeping it active. You can archive later.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({ content: `Archive "${en(ctx)}"?`, richCards: [{ type: 'confirmation', data: { title: 'Archive Event', description: 'Moves to your archive. Still accessible but hidden from active list.', confirmLabel: 'Archive', cancelLabel: 'Keep Active', variant: 'default' } }], suggestions: [] }),
  },
];

const duplicate_event: FlowDef = [
  {
    branches: [
      { match: ['next week', 'week'], response: (ctx) => ({ content: `Duplicated! "${en(ctx)}" cloned for next week. Everything copied — title, description, agenda, speakers, settings.\n\nOpened as a new draft. Want to change anything?`, richCards: [{ type: 'event_preview', data: { title: en(ctx), date: 'Next week', time: ctx.event?.time, format: ctx.event?.location, capacity: ctx.event?.capacity, status: 'Draft' } }], suggestions: ['Change the title', 'Update the date', 'Looks perfect', 'Change speakers'] }) },
      { match: ['next month', 'month'], response: (ctx) => ({ content: `Duplicated for next month! \u2705 Everything copied.`, richCards: [{ type: 'event_preview', data: { title: en(ctx), date: 'Next month', time: ctx.event?.time, format: ctx.event?.location, status: 'Draft' } }], suggestions: ['Change title', 'Update speakers', 'Publish now', 'Just save as draft'] }) },
      { match: ['change', 'few things', 'also', 'tweak'], response: { content: "What do you want to change from the original?", suggestions: ['Change title', 'Different speakers', 'Different date', 'Change capacity'] } },
    ],
    default: (ctx) => ({ content: `Cloning "${en(ctx)}". When's the new date?`, suggestions: ['Same time next week', 'Same time next month', 'Let me pick a date', 'Change a few things too'] }),
  },
  { branches: [], default: { content: "Event duplicated and saved as draft! \u2705 Edit it anytime from your Drafts tab.", suggestions: [], done: true } },
];

// ═══════════════════════════════════════════════════════════════
// LEARNER FLOWS
// ═══════════════════════════════════════════════════════════════

const register_event: FlowDef = [
  {
    branches: [
      { match: ['yes', 'register', 'sign up', 'join', 'in'], response: (ctx) => ({ content: `You're registered for "${en(ctx)}"! \ud83c\udf89\n\nI've set reminders for 24 hours and 1 hour before.`, richCards: [{ type: 'event_preview', data: { title: en(ctx), date: ctx.event?.date, time: ctx.event?.time, format: ctx.event?.location, status: 'Registered', badge: 'confirmed' } }], suggestions: ['Add to calendar', 'Invite a friend', 'Thanks!'] }) },
      { match: ['tell me', 'more', 'about', 'what'], response: (ctx) => ({ content: `Here's what to expect:\n\n**${en(ctx)}**\n\u2022 ${ctx.event?.description?.substring(0, 200) || 'An engaging session'}\n\u2022 ${ctx.event?.speakers.length || 0} speakers\n\u2022 ${ctx.event?.schedule.length || 0} sessions in the agenda\n\u2022 ${ctx.event?.location || 'Virtual'} format\n\nWant to register?`, suggestions: ['Yes, register me!', 'Show the agenda', 'Who are the speakers?', 'Not now'] }) },
      { match: ['calendar', 'check', 'busy', 'schedule'], response: (ctx) => ({ content: `The event is on ${ctx.event?.date || 'TBD'} at ${ctx.event?.time || 'TBD'}. I checked — you don't have any conflicts! Want to register?`, suggestions: ['Yes, register me!', 'Not now'] }) },
      { match: ['not now', 'later', 'no', 'maybe'], response: { content: "No problem! You can register anytime from the event page. Want me to remind you later?", suggestions: ['Remind me tomorrow', 'Remind me in an hour', 'No thanks'], done: true } },
    ],
    default: (ctx) => ({ content: `Registering you for "${en(ctx)}"...`, richCards: [{ type: 'event_preview', data: { title: en(ctx), date: ctx.event?.date, time: ctx.event?.time, format: ctx.event?.location, status: 'Registered' } }], suggestions: ['Add to calendar', 'Invite a friend', 'Thanks!'] }),
  },
  {
    branches: [
      { match: ['calendar'], response: { content: "Added to your calendar! \u2705 You'll get a notification when it starts.", richCards: [{ type: 'choice', data: { question: 'Calendar app', options: [{ id: 'google', label: 'Google Calendar' }, { id: 'apple', label: 'Apple Calendar' }, { id: 'outlook', label: 'Outlook' }] } }], suggestions: [] } },
      { match: ['invite', 'friend', 'share'], response: (ctx) => ({ content: `Share "${en(ctx)}" with a friend? I'll draft a message:`, richCards: [{ type: 'message_draft', data: { platform: 'Message', content: `Hey! I just registered for "${en(ctx)}" on ${ctx.event?.date}. You should check it out! leapspace.io/event/${ctx.entityId}` } }], suggestions: ['Send this', 'Edit', 'Copy text'] }) },
      { match: ['thanks', 'done', 'good', 'great'], response: { content: "See you there! \ud83d\udc4b", suggestions: [], done: true } },
    ],
    default: { content: "All set! Anything else?", suggestions: ['Add to calendar', 'Invite a friend', 'That\'s all'], done: true },
  },
];

const join_waitlist: FlowDef = [
  {
    branches: [
      { match: ['yes', 'add', 'join', 'please'], response: (ctx) => ({ content: `You're on the waitlist! \u2705 Position #${Math.floor(Math.random() * 5) + 1}. I'll notify you instantly if a spot opens.`, suggestions: ['Set reminder', 'Find similar events', 'Thanks'] }) },
      { match: ['notify', 'alert'], response: { content: "I'll alert you if a spot opens up, even if you're not on the waitlist. \u2705", suggestions: [], done: true } },
      { match: ['similar', 'alternative', 'find'], response: { content: "Let me find similar events with open spots...", suggestions: ['Same topic', 'Same time slot', 'Any upcoming events'] } },
    ],
    default: { content: "This event is full. Want to join the waitlist?", suggestions: ['Yes, add me', 'Just notify me if spots open', 'Find similar events'] },
  },
  { branches: [], default: { content: "You're all set! I'll keep you posted. \ud83d\udc4d", suggestions: [], done: true } },
];

const cancel_registration: FlowDef = [
  {
    branches: [
      { match: ['yes', 'cancel', 'confirm'], response: (ctx) => ({ content: `Registration cancelled for "${en(ctx)}". \u2705 Your spot has been released.\n\nWant to find a similar event?`, suggestions: ['Find similar events', 'No thanks'] }) },
      { match: ['keep', 'no', 'wait', 'nevermind'], response: { content: "Keeping your registration! \u2705 See you there.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({ content: `Cancel registration for "${en(ctx)}"? Your spot will be released.`, richCards: [{ type: 'confirmation', data: { title: 'Cancel Registration', description: 'Your spot will be released to the next person on the waitlist.', confirmLabel: 'Yes, Cancel', cancelLabel: 'Keep My Spot', variant: 'warning' } }], suggestions: [] }),
  },
  { branches: [], default: { content: "Done! Let me know if you need anything else.", suggestions: [], done: true } },
];

const add_to_calendar: FlowDef = [
  {
    branches: [
      { match: ['google'], response: (ctx) => ({ content: `Added to Google Calendar! \u2705\n\n📅 ${en(ctx)}\n📅 ${ctx.event?.date} at ${ctx.event?.time}\n\nYou'll get a Google Calendar reminder too.`, suggestions: [], done: true }) },
      { match: ['apple'], response: { content: "Added to Apple Calendar! \u2705 You'll get a notification before the event.", suggestions: [], done: true } },
      { match: ['outlook'], response: { content: "Added to Outlook! \u2705", suggestions: [], done: true } },
      { match: ['ics', 'download', 'file'], response: { content: "Downloading .ics file... \u2705 Open it to add to any calendar app.", suggestions: [], done: true } },
    ],
    default: { content: "Which calendar?", richCards: [{ type: 'choice', data: { question: 'Add to calendar', options: [{ id: 'google', label: 'Google Calendar' }, { id: 'apple', label: 'Apple Calendar' }, { id: 'outlook', label: 'Outlook' }, { id: 'ics', label: 'Download .ics file' }] } }], suggestions: [] },
  },
];

const set_reminder: FlowDef = [
  {
    branches: [
      { match: ['1 day', '24', 'day before'], response: { content: "Reminder set for 1 day before! \u2705 I'll ping you.", suggestions: [], done: true } },
      { match: ['2 hour', '2h', 'hours before'], response: { content: "Reminder set for 2 hours before! \u2705", suggestions: [], done: true } },
      { match: ['30 min', '30m', 'half hour'], response: { content: "Reminder set for 30 minutes before! \u2705", suggestions: [], done: true } },
      { match: ['custom'], response: { content: "When should I remind you? Give me a time like '3 hours before' or 'the morning of'.", suggestions: [] } },
    ],
    default: { content: "When should I remind you?", richCards: [{ type: 'choice', data: { question: 'Remind me', options: [{ id: '1d', label: '1 day before' }, { id: '2h', label: '2 hours before' }, { id: '30m', label: '30 minutes before' }, { id: 'custom', label: 'Custom time' }] } }], suggestions: [] },
  },
  { branches: [], default: { content: "Reminder set! \u2705", suggestions: [], done: true } },
];

const ask_about_event: FlowDef = [
  {
    branches: [
      { match: ['learn', 'get', 'takeaway', 'benefit'], response: (ctx) => ({ content: `Based on the event details, here's what you'll get from "${en(ctx)}":\n\n\u2022 **Practical skills** you can apply right away\n\u2022 **Expert insights** from the speakers\n\u2022 **Networking** with ${ac(ctx)} other attendees\n\u2022 **Resources** and materials shared after the event\n\nAnything specific you want to know?`, suggestions: ['Is it beginner friendly?', 'Will there be a recording?', 'Ask the organizer'] }) },
      { match: ['beginner', 'experience', 'level', 'prerequisite'], response: { content: "Based on the event description and tags, this event appears suitable for **all experience levels**. The format includes both introductory content and deeper dives.\n\nIf you're unsure, you can always ask the organizer directly!", suggestions: ['Ask the organizer', 'Register anyway', 'Show the agenda'] } },
      { match: ['recording', 'replay', 'watch later'], response: { content: "That depends on the organizer! Most events on LeapSpace share recordings afterward. I'd suggest registering either way — registered attendees are always first to get the recording.", suggestions: ['Register me', 'Ask the organizer'] } },
      { match: ['ask', 'organizer', 'message', 'question for'], response: (ctx) => ({ content: "What do you want to ask the organizer? I'll send your question.", suggestions: ['Will there be a recording?', 'Is there a prerequisite?', 'Can I get a certificate?', 'I\'ll type my question'] }) },
    ],
    default: (ctx) => ({ content: `What would you like to know about "${en(ctx)}"?`, suggestions: ['What will I learn?', 'Is it beginner friendly?', 'Will there be a recording?', 'Ask the organizer'] }),
  },
  {
    branches: [
      { match: ['organizer'], response: (ctx) => ({ content: `Question sent to the organizer of "${en(ctx)}"! \u2705 You'll get a notification when they respond.`, suggestions: [], done: true }) },
    ],
    default: { content: "Hope that helps! Anything else?", suggestions: ['Register now', 'Ask another question', 'That\'s all'], done: true },
  },
];

const invite_friend: FlowDef = [
  {
    branches: [
      { match: ['link', 'share', 'copy'], response: (ctx) => ({ content: `Here's the event link:\n\n\`leapspace.io/event/${ctx.entityId || 'abc'}\`\n\nCopied! \u2705`, suggestions: ['Draft a message too', 'That\'s all'], done: true }) },
      { match: ['message', 'send', 'friend', 'draft'], response: (ctx) => ({ content: "Here's a message to share:", richCards: [{ type: 'message_draft', data: { platform: 'Message', content: `Hey! I'm going to "${en(ctx)}" on ${ctx.event?.date} and thought you'd enjoy it too.\n\nIt's ${ctx.event?.isPaid ? '$' + ctx.event?.price : 'free'} and ${ctx.event?.location}.\n\nRegister here: leapspace.io/event/${ctx.entityId || 'abc'}` } }], suggestions: ['Send this', 'Edit message', 'Just copy link'] }) },
    ],
    default: { content: "How do you want to invite them?", suggestions: ['Share a link', 'Draft a message', 'Post in my community'] },
  },
  { branches: [], default: { content: "Invite sent! \u2705", suggestions: [], done: true } },
];

const share_attending: FlowDef = [
  {
    branches: [
      { match: ['post', 'as-is', 'yes', 'default'], response: { content: "Posted! \u2705 Your network can see you're attending.", suggestions: [], done: true } },
      { match: ['custom', 'edit', 'change'], response: { content: "What do you want to say? I'll format it as a post.", suggestions: [] } },
      { match: ['copy', 'text'], response: (ctx) => ({ content: `Copied to clipboard! \u2705\n\n"Excited to attend ${en(ctx)}! \ud83d\ude80"`, suggestions: [], done: true }) },
      { match: ['linkedin'], response: (ctx) => ({ content: "LinkedIn post:", richCards: [{ type: 'message_draft', data: { platform: 'LinkedIn', content: `Excited to be attending "${en(ctx)}"! Looking forward to learning and connecting with fellow professionals.\n\n#learning #community #events` } }], suggestions: ['Post this', 'Edit', 'Copy text'] }) },
    ],
    default: (ctx) => ({ content: `I'll draft a post for you:\n\n> "Excited to attend ${en(ctx)}! \ud83d\ude80"\n\nPost as-is, or customize?`, suggestions: ['Post as-is', 'Customize it', 'Copy text', 'Share on LinkedIn'] }),
  },
  { branches: [], default: { content: "Shared! \u2705", suggestions: [], done: true } },
];

const ask_question_live: FlowDef = [
  {
    branches: [],
    default: (ctx) => ({
      content: `Your question has been added to the Q&A queue! \u2705\n\n> "${ctx.userInput}"\n\nThe host will see it and answer during the Q&A segment. Other attendees can upvote it too.`,
      suggestions: ['Ask another question', 'Done'],
      done: true,
    }),
  },
];

const take_notes: FlowDef = [
  {
    branches: [
      { match: ['start', 'begin', 'note', 'go'], response: { content: "Note-taking mode activated! \ud83d\udcdd Just type your thoughts and I'll save them. I'll also organize them by session if there's an agenda.", suggestions: ['Got it', 'Remind me after each session'] } },
      { match: ['remind', 'prompt', 'session'], response: { content: "I'll prompt you at the end of each agenda session to capture key takeaways. \u2705", suggestions: ['Sounds good'], done: true } },
    ],
    default: { content: "Ready to help you capture notes! Type your thoughts as you go, or want me to prompt you after each session?", suggestions: ['Start noting freely', 'Prompt me after each session', 'Just let me type'] },
  },
  { branches: [], default: (ctx) => ({ content: `Note saved! \ud83d\udcdd\n\n> "${ctx.userInput}"\n\nKeep going — I'm organizing everything for you.`, suggestions: ['Add more notes'], done: false }) },
];

const report_issue: FlowDef = [
  {
    branches: [
      { match: ['audio', 'sound', 'hear', 'mic'], response: { content: "Audio issue reported! \u2705 I've notified the organizer. In the meantime, try:\n\n\u2022 Refresh the page\n\u2022 Check your speaker volume\n\u2022 Try switching audio output\n\nIs the issue resolved?", suggestions: ['Still having issues', 'It\'s working now', 'Thanks'] } },
      { match: ['video', 'screen', 'see', 'display'], response: { content: "Video issue reported! \u2705 Organizer notified. Try refreshing or switching to a different browser.", suggestions: ['Still an issue', 'Fixed now'] } },
      { match: ['content', 'inappropriate', 'offensive'], response: { content: "Thank you for reporting this. \u2705 Our moderation team has been alerted and will review the content immediately.", suggestions: [], done: true } },
      { match: ['access', 'can\'t', 'join', 'enter'], response: { content: "Access issue reported! \u2705 I've pinged the organizer. Try these:\n\n\u2022 Make sure you're logged in\n\u2022 Check if registration is confirmed\n\u2022 Try the join link again", suggestions: ['Still can\'t access', 'It\'s working now'] } },
    ],
    default: { content: "What's the issue?", richCards: [{ type: 'choice', data: { question: "What's wrong?", options: [{ id: 'audio', label: 'Audio issues' }, { id: 'video', label: 'Video/screen issues' }, { id: 'content', label: 'Inappropriate content' }, { id: 'access', label: "Can't access event" }, { id: 'other', label: 'Something else' }] } }], suggestions: [] },
  },
  { branches: [], default: { content: "Issue reported and organizer notified! \u2705 Thanks for letting us know.", suggestions: [], done: true } },
];

const submit_feedback: FlowDef = [
  {
    branches: [
      { match: ['great', 'loved', 'amazing', 'excellent', 'good', 'awesome'], response: { content: "Glad you enjoyed it! \ud83c\udf89 Quick follow-ups:\n\n1. What was the most valuable part?\n2. Would you recommend this to a colleague?", suggestions: ['The hands-on exercises', 'The speaker', 'Networking', 'Everything was great'] } },
      { match: ['okay', 'fine', 'decent', 'alright'], response: { content: "Thanks for the honest feedback! What could have been better?", suggestions: ['Too long', 'Too short', 'Needed more depth', 'Audio/video quality'] } },
      { match: ['bad', 'disappointing', 'not good', 'waste'], response: { content: "I'm sorry to hear that. Your feedback helps improve future events. What was the main issue?", suggestions: ['Content wasn\'t what I expected', 'Technical issues', 'Speaker wasn\'t engaging', 'Poor organization'] } },
      { match: ['skip', 'no', 'later'], response: { content: "No problem! You can always leave feedback later from the event page.", suggestions: [], done: true } },
    ],
    default: (ctx) => ({ content: `How was "${en(ctx)}"? Give me your overall impression.`, suggestions: ['It was great!', 'It was okay', 'Some issues to share', 'Skip feedback'] }),
  },
  {
    branches: [],
    default: (ctx) => ({
      content: "Thanks for sharing! One last thing — rate the event:\n\n\u2b50\u2b50\u2b50\u2b50\u2b50",
      richCards: [{ type: 'choice', data: { question: 'Your rating', options: [{ id: '5', label: '\u2b50\u2b50\u2b50\u2b50\u2b50 Excellent' }, { id: '4', label: '\u2b50\u2b50\u2b50\u2b50 Great' }, { id: '3', label: '\u2b50\u2b50\u2b50 Good' }, { id: '2', label: '\u2b50\u2b50 Fair' }, { id: '1', label: '\u2b50 Poor' }] } }],
      suggestions: [],
    }),
  },
  {
    branches: [],
    default: { content: "Feedback submitted! \u2705 Thank you — the organizer will see your review. This helps them make future events even better.", suggestions: [], done: true },
  },
];

const rate_event = submit_feedback;

const share_recap: FlowDef = [
  {
    branches: [
      { match: ['draft', 'post', 'write'], response: (ctx) => ({ content: "Here's your takeaway post:", richCards: [{ type: 'message_draft', data: { platform: 'Community Post', content: `Just attended "${en(ctx)}" and it was \ud83d\udd25!\n\nMy key takeaways:\n• [Your takeaway 1]\n• [Your takeaway 2]\n• [Your takeaway 3]\n\nHighly recommend checking out the recording if you missed it!` } }], suggestions: ['Post this', 'Customize', 'Share on LinkedIn instead'] }) },
      { match: ['recording', 'link'], response: (ctx) => ({ content: `Here's the recording link for "${en(ctx)}": leapspace.io/event/${ctx.entityId}/recording\n\nCopied! \u2705`, suggestions: [], done: true }) },
    ],
    default: { content: "Want to share your takeaways? I'll help draft a post.", suggestions: ['Draft a post', 'Just share the recording', 'Share key quotes'] },
  },
  { branches: [], default: { content: "Shared! \u2705 Thanks for spreading the word.", suggestions: [], done: true } },
];

const connect_speaker: FlowDef = [
  {
    branches: [],
    default: (ctx) => {
      const speakers = ctx.event?.speakers || [];
      if (speakers.length <= 1) {
        const name = speakers[0]?.name || 'the speaker';
        return {
          content: `Sending a connection request to ${name}:`,
          richCards: [{ type: 'message_draft', data: { platform: 'Connection Request', content: `Hi ${name}! I attended "${en(ctx)}" and really enjoyed your session. Would love to connect and learn more about your work.` } }],
          suggestions: ['Send this', 'Customize message', 'Skip'],
        };
      }
      return {
        content: "Which speaker do you want to connect with?",
        richCards: [{ type: 'choice', data: { question: 'Connect with', options: speakers.map(s => ({ id: s.id, label: s.name, description: s.role })) } }],
        suggestions: [],
      };
    },
  },
  { branches: [], default: { content: "Connection request sent! \u2705 They'll get a notification.", suggestions: [], done: true } },
];

const connect_attendees: FlowDef = [
  {
    branches: [
      { match: ['show', 'list', 'see', 'all'], response: { content: "Here are some attendees who were at the event:\n\n\u2022 **Alex J.** — Software Engineer\n\u2022 **Maria G.** — Product Manager\n\u2022 **Priya P.** — UX Designer\n\u2022 **Tom W.** — Data Scientist\n\nWant to connect with any of them?", suggestions: ['Connect with all', 'Connect with Alex', 'Connect with Maria'] } },
      { match: ['similar', 'interest', 'like me'], response: { content: "People with similar interests who attended:\n\n\u2022 **Alex J.** — also attended 3 similar events\n\u2022 **Priya P.** — member of the same community\n\nWant to connect?", suggestions: ['Connect with both', 'Just Alex', 'Just Priya'] } },
    ],
    default: { content: "Want to connect with other attendees?", suggestions: ['Show attendee list', 'Find similar interests', 'Connect with all'] },
  },
  { branches: [], default: { content: "Connection requests sent! \u2705", suggestions: [], done: true } },
];

const get_certificate: FlowDef = [
  {
    branches: [
      { match: ['generate', 'yes', 'download', 'get'], response: (ctx) => ({ content: `Your certificate of attendance for "${en(ctx)}" is ready! \u2705\n\n\ud83c\udfc6 Certificate of Attendance\nName: Sarah Chen\nEvent: ${en(ctx)}\nDate: ${ctx.event?.date || 'TBD'}\n\nDownloading as PDF...`, suggestions: ['Share on LinkedIn', 'Download again', 'Thanks!'] }) },
      { match: ['linkedin'], response: { content: "Sharing your certificate on LinkedIn! I'll format it as a professional post. \u2705", suggestions: [], done: true } },
    ],
    default: (ctx) => ({ content: `Generate your attendance certificate for "${en(ctx)}"?`, suggestions: ['Yes, generate it', 'Share on LinkedIn', 'Download PDF'] }),
  },
  { branches: [], default: { content: "Certificate ready! \u2705", suggestions: [], done: true } },
];

const find_similar: FlowDef = [
  {
    branches: [
      { match: ['topic', 'same', 'similar'], response: { content: "Here are upcoming events on the same topic:\n\n1. **Advanced Workshop: Deep Dive** — Mar 20, Virtual, Free\n2. **Hands-on Lab: Practical Skills** — Mar 27, Virtual, $15\n3. **Community Meetup: Q&A** — Apr 3, Hybrid, Free", suggestions: ['Register for #1', 'Tell me about #2', 'Show more'] } },
      { match: ['organizer', 'host', 'creator'], response: { content: "More events by this organizer:\n\n1. **Monthly Community Meetup** — Mar 15, Virtual, Free\n2. **Advanced Masterclass** — Apr 1, Virtual, $25", suggestions: ['Register for #1', 'Tell me more', 'Show all'] } },
      { match: ['surprise', 'any', 'recommend'], response: { content: "Based on your interests, you might enjoy:\n\n1. **Design Systems Workshop** — Mar 18, Virtual\n2. **AI Tools for Productivity** — Mar 22, Hybrid\n3. **Leadership Roundtable** — Mar 25, In-person", suggestions: ['Register for #1', '#2 looks good', 'Show me more'] } },
    ],
    default: { content: "What kind of events are you looking for?", suggestions: ['Same topic', 'Same organizer', 'Same community', 'Surprise me'] },
  },
  { branches: [], default: { content: "Happy exploring! \ud83d\ude80", suggestions: [], done: true } },
];

const download_recording: FlowDef = [
  {
    branches: [
      { match: ['full', 'everything', 'all'], response: { content: "Downloading the full recording... \u2705 It'll be in your downloads folder.", suggestions: [], done: true } },
      { match: ['specific', 'session', 'part'], response: { content: "Which sessions do you want?\n\n1. Welcome & Intro (10 min)\n2. Main Presentation (35 min)\n3. Workshop (20 min)\n4. Q&A (15 min)", suggestions: ['Just #2', 'Just #2 and #3', 'All of them'] } },
      { match: ['audio', 'podcast', 'mp3'], response: { content: "Extracting audio-only version... \u2705 Downloading as MP3.", suggestions: [], done: true } },
    ],
    default: { content: "Download the recording?", suggestions: ['Full recording', 'Specific sessions', 'Audio only'] },
  },
];

const update_registration: FlowDef = [
  {
    branches: [
      { match: ['answer', 'question', 'response'], response: { content: "Which registration answer do you want to update?", suggestions: ['Experience level', 'What I want to learn', 'My role'] } },
      { match: ['ticket', 'tier', 'upgrade'], response: { content: "Want to upgrade your ticket? Current tier: General", richCards: [{ type: 'choice', data: { question: 'Upgrade to', options: [{ id: 'vip', label: 'VIP — $49', description: 'Priority seating + networking' }, { id: 'premium', label: 'Premium — $99', description: 'VIP + 1-on-1 with speaker' }] } }], suggestions: [] } },
    ],
    default: { content: "What do you want to change about your registration?", suggestions: ['Update my answers', 'Upgrade ticket tier', 'Change my info'] },
  },
  { branches: [], default: { content: "Registration updated! \u2705", suggestions: [], done: true } },
];

const message_individual: FlowDef = [
  {
    branches: [
      { match: ['search', 'find', 'name'], response: { content: "Search for a person:", suggestions: [] } },
      { match: ['speaker'], response: (ctx) => ({ content: "Which speaker?", richCards: [{ type: 'choice', data: { question: 'Message speaker', options: (ctx.event?.speakers || []).map(s => ({ id: s.id, label: s.name, description: s.role })) } }], suggestions: [] }) },
    ],
    default: { content: "Who do you want to message?", suggestions: ['Search by name', 'Message a speaker', 'Message a waitlisted person'] },
  },
  {
    branches: [],
    default: { content: "What do you want to say? I'll draft the message.", suggestions: [] },
  },
  {
    branches: [],
    default: (ctx) => ({
      content: "Message sent! \u2705",
      richCards: [{ type: 'message_draft', data: { platform: 'Direct Message', content: ctx.userInput } }],
      suggestions: [],
      done: true,
    }),
  },
];

// Remaining simple flows
const set_reminders: FlowDef = set_reminder;
const add_cohost: FlowDef = [
  {
    branches: [
      { match: ['search', 'name'], response: { content: "Search for a co-host by name:", suggestions: [] } },
      { match: ['email', 'invite'], response: { content: "Enter their email and I'll send an invite:", suggestions: [] } },
      { match: ['community', 'member'], response: { content: "Pick from your community members:", suggestions: ['Show members list'] } },
      { match: ['skip', 'later'], response: { content: "You can add co-hosts later. Solo hosting it is!", suggestions: [], done: true } },
    ],
    default: { content: "Who do you want to co-host with?", suggestions: ['Search by name', 'Invite by email', 'From my community', 'Skip for now'] },
  },
  { branches: [], default: { content: "Co-host added! \u2705 They'll get an invite to manage the event with you.", suggestions: ['Add another co-host', 'All done'], done: true } },
];

const add_resources: FlowDef = [
  {
    branches: [
      { match: ['link', 'url', 'slide', 'deck'], response: { content: "Paste the link:", suggestions: [] } },
      { match: ['file', 'upload', 'pdf', 'document'], response: { content: "Upload the file and I'll attach it.", suggestions: [] } },
      { match: ['pre-reading', 'before', 'prerequisite'], response: { content: "Paste the pre-reading link. I'll label it as required reading before the event.", suggestions: [] } },
    ],
    default: { content: "What resources do you want to share with attendees?", suggestions: ['Add a slide deck link', 'Upload a file', 'Add pre-reading material', 'Skip for now'] },
  },
  { branches: [], default: { content: "Resource added! \u2705 Attendees can access it from the event page.", suggestions: ['Add another resource', 'All done'], done: true } },
];

// ═══════════════════════════════════════════════════════════════
// FLOW REGISTRY
// ═══════════════════════════════════════════════════════════════

const flowRegistry: Record<string, FlowDef> = {
  create_event, create_event_in_community: create_event, duplicate_event,
  edit_event_details, edit_event_cover, edit_event_description,
  add_speakers, edit_speakers,
  build_agenda, edit_agenda,
  set_registration, set_tickets, set_location, set_reminders, add_cohost, add_resources,
  review_checklist, publish_event,
  edit_published_event, send_update, message_attendees, message_individual, manage_waitlist,
  increase_capacity, close_registration, share_event, generate_qr,
  postpone_event, cancel_event,
  share_join_link, check_in_attendees, send_live_announcement, share_live_resource,
  manage_qa, extend_time, end_event,
  upload_recording, share_recording, send_followup, create_feedback_survey,
  summarize_feedback, create_recap_post, download_attendees, archive_event,
  register_event, join_waitlist, cancel_registration, update_registration,
  add_to_calendar, set_reminder,
  ask_about_event, invite_friend, share_attending,
  ask_question_live, take_notes, report_issue,
  submit_feedback, rate_event, share_recap,
  connect_speaker, connect_attendees, get_certificate, find_similar, download_recording,
};

// ═══════════════════════════════════════════════════════════════
// FLOW ENGINE — Main resolver
// ═══════════════════════════════════════════════════════════════

export function resolveFlow(
  contextType: string,
  userInput: string,
  turnIndex: number,
  history: string[],
  event?: MockEvent,
  entityId?: string,
): FlowResponse {
  const flow = flowRegistry[contextType];
  if (!flow) {
    const lower = userInput.toLowerCase();
    if (lower.includes('event') || lower.includes('create') || lower.includes('help')) {
      return { content: "I can help you with events! What do you need?", suggestions: ['Create an event', 'Find events', 'My upcoming events', 'Something else'] };
    }
    return { content: `Got it — "${userInput}". Let me help with that. What would you like to do?`, suggestions: ['Tell me more', 'Start over'] };
  }

  // Clamp turn to available steps
  const stepIdx = Math.min(turnIndex, flow.length - 1);
  const step = flow[stepIdx];
  const lower = userInput.toLowerCase();

  const ctx: FlowCtx = { event, entityId, userInput, turnIndex, history };

  // Check branches
  for (const branch of step.branches) {
    if (branch.match.some(kw => lower.includes(kw))) {
      return typeof branch.response === 'function' ? branch.response(ctx) : branch.response;
    }
  }

  // Default
  return typeof step.default === 'function' ? step.default(ctx) : step.default;
}
