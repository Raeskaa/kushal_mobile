the full gap analysis and execution plan for both creation flows. No code — just planning.

Current State Summary
Component	What it does today	Problems
ManualEventCreateModal	Single flat dialog — title, format, date, time, end time, location, description, capacity	No stepper, no templates, no recurrence, no multi-day, no timezone, no community context, raw <input type="time">
EventSetupSteps (Leapy)	3-step conversational flow — title → date/time/type → description	Same time picker issues, no recurrence, no template suggestions, no community pre-fill, no multi-day
EventTemplatesLibrary	Standalone modal with 6+ templates (Workshop, Webinar, Networking, etc.)	Completely disconnected — neither creation flow surfaces it
Event data model	Single date, time, no recurrence fields	No rrule, no endDate, no isMultiDay, no recurrenceRule, no seriesId
EventsListView	Shows events, has empty state via SectionEmptyState	Generic empty state — not tailored for first-time creator with Leapy prompt
Gap 1: First-Time Events Landing (No Events)
What's missing: When a creator with zero events lands on the Events section, they see a generic SectionEmptyState. No Leapy prompt, no template cards, no guided path.

Plan:

In EventsListView, detect myEvents.length === 0 for the current user
Show a dedicated first-time empty state with:
Illustration (use existing SectionEmptyState pattern but enhanced)
"Create your first event" primary CTA
"Or let Leapy help you plan one" secondary CTA (opens AI flow with create_event context)
3-4 popular template cards inline (pulled from EventTemplatesLibrary data) so they can one-click start from a template
Brief explainer: "Events can be virtual, in-person, or hybrid. Free or paid."
Files: EventsListView.tsx

Gap 2: Quick Create from Template
What's missing: Templates exist in EventTemplatesLibrary but aren't surfaced during creation. Neither flow offers "Start from template".

Plan:

Add a "Start from template" option at the top of both flows:
Manual flow (Step 0): Before the stepper, show a choice card: "Start from scratch" vs "Start from template". Selecting a template pre-fills Step 1 + Step 2 fields and jumps straight in.
Leapy flow: When the user says "Create event" and hasn't typed anything yet, Leapy offers: "Want to start from a template? Here are popular ones:" with 4-5 template suggestion cards (same card pattern as name suggestions — 5 per batch, thumbs-down feedback).
Template selection pre-fills: title placeholder, description, duration, capacity, format, pricing, suggested schedule items, registration fields.
User can still override everything.
Files: ManualEventCreateModal.tsx (or its replacement), EventSetupSteps.tsx, shared template data from EventTemplatesLibrary.tsx

Gap 3: Create Within Community
What's missing: No way to pre-fill community context when creating an event from within a community.

Plan:

When user clicks "Create Event" from inside a community view, pass communityId + communityName as props to both creation flows.
Both flows show a non-editable "Community: [name]" chip at the top, and the event is auto-linked (parentCommunityId set, isStandalone: false).
In Leapy flow: Leapy acknowledges the community context — "Creating an event for [Community Name]. What kind of event are you thinking?"
In manual flow: Community field is pre-filled and locked (with "Change" link if needed).
If creating standalone (not from community), show an optional "Link to community" dropdown in Step 1.
Files: Both creation flows, App.tsx (routing the community context through)

Gap 4: Duplicate Existing Event
What's missing: No UI to clone an event. It's specced in the cancelled state but never built.

Plan:

Add "Duplicate" option in:
Event card "..." menu in EventsListView
Builder header "..." menu in EventBuilderViewV2
Post-event / ended state actions
Cancelled state actions (already specced)
On click: Opens the manual creation stepper pre-filled with all data from the original event, except:
Date/time cleared (must pick new ones)
Status reset to draft
Registration/attendee data cleared
Title prefixed with "Copy of " (editable)
Toast: "Event duplicated as draft — update the date and publish when ready."
Files: EventsListView.tsx, EventBuilderViewV2.tsx, manual creation flow

Gap 5: Manual Creation Flow — Proper Stepper
Current: Single flat dialog with everything crammed in.

Proposed 3-step stepper:

Step 1: "What" — Name & Details
Event name (required)
Description (optional, expandable textarea)
Category/topic selector (chip grid: Technology, Design, Business, Marketing, etc.)
Template quick-pick strip (horizontal scroll of 5-6 template cards — selecting one pre-fills everything)
Optional: Link to community dropdown
Step 2: "When" — Timeline & Schedule
Single event vs Multi-day vs Recurring toggle (3 options)
Single event: Date picker + improved time picker (see Gap 6)
Multi-day: Start date + End date + daily start/end times
Recurring: Frequency (Daily/Weekly/Monthly), interval, day-of-week checkboxes (rrule pattern), count or until-date, generates preview list of occurrences (like the rrule demo screenshot)
Timezone selector (default to browser timezone, dropdown to change)
Format: Virtual / In-Person / Hybrid (already exists)
Location (conditional, already exists)
Step 3: "How" — Access & Capacity
Capacity (already exists)
Visibility: Public / Private
Access: Open / Waitlist / Screened / Paid
If Paid: Quick price input (detailed tiers configured in builder later)
"Create Event" → lands in builder
Navigation: Back/Next buttons, step indicator dots, can click completed steps to go back.

Gap 6: Better Time Selection (Both Flows)
Current: Raw <input type="time"> — functional but ugly, no timezone, no smart defaults, no duration display.

Proposed time picker UX:

Visual time selector — Instead of raw <input type="time">, use a custom dropdown with:

Pre-set time slots in 15-min increments (9:00 AM, 9:15 AM, 9:30 AM...)
Searchable/filterable
Grouped by Morning / Afternoon / Evening
Common times highlighted (9 AM, 10 AM, 12 PM, 2 PM, 6 PM)
Duration display — When both start and end time are set, show calculated duration: "2h 30m"

Smart defaults:

Start time: 10:00 AM (most common event start)
End time: auto-set to +1h when start is picked
If template selected, use template's default duration
Timezone: Show browser timezone with option to change. Display: "10:00 AM EST (your timezone)" with a dropdown for other zones.

Recurring event controls (rrule-based):

Frequency: Daily / Weekly / Monthly / Yearly radio
Interval: "Every [1] week(s)"
Day-of-week: Mon-Sun checkboxes (for weekly)
End: "After [X] occurrences" or "Until [date]"
Preview: "Every Wednesday for 30 weeks" with expandable list of all dates
Under the hood: generates an rrule string stored in the data model
Data model additions needed:

isMultiDay?: boolean;
endDate?: string;           // for multi-day events
recurrenceRule?: string;    // rrule string e.g. "FREQ=WEEKLY;COUNT=30;WKST=MO"
seriesId?: string;          // links recurring instances
isRecurring?: boolean;
occurrences?: string[];     // generated date list for display
timezone?: string;          // e.g. "America/New_York"
Gap 7: Leapy Flow — Additional Gaps
Beyond the 4 you listed, here's what else is missing in the Leapy (AI) creation flow:

Gap	What's missing
No template suggestions	Leapy never offers "Start from a template?"
No timezone awareness	Leapy doesn't ask about or suggest timezones
No recurrence in conversation	"Make this a weekly event" isn't handled
No multi-day support	"This is a 3-day conference" can't be expressed
No audience targeting	Leapy doesn't ask "Who is this for?" to tailor suggestions
No duration intelligence	If user says "workshop" Leapy should default to 2h, not ask
No conflict checking	Leapy doesn't warn "You have another event on this date"
No capacity suggestion	Leapy doesn't suggest capacity based on event type
No cover image during creation	Only happens in builder — Leapy could offer to generate one
No "Switch to manual"	Can't bail from Leapy into the form-based stepper mid-flow
Gap 8: Manual Flow — Additional Gaps
Gap	What's missing
No category/topic selection	Creator picks format but not what the event is about
No suggested description	Manual flow has zero AI assistance — could offer "Help me write this" link that sends to Leapy
No cover image	Only in builder
No "Switch to Leapy"	Can't jump to AI flow mid-creation
No estimated duration	No visual feedback on how long the event is
No conflict detection	No warning about scheduling conflicts
Proposed Execution Order
#	Task	Effort	Dependencies
A	Data model: add recurrence/multi-day/timezone fields to Event interface	Small	None
B	Shared TimeSelector component (visual time picker + timezone + duration)	Medium	None
C	Shared RecurrenceEditor component (rrule UI + preview)	Medium	A
D	Rewrite ManualEventCreateModal → EventCreationStepper (3 steps)	Large	A, B, C
E	Template integration into both flows	Medium	D
F	First-time empty state in EventsListView	Small	None
G	Duplicate event flow	Small	D
H	Create-within-community context passing	Small	D
I	Upgrade EventSetupSteps Step 2 with new TimeSelector + RecurrenceEditor + timezone	Medium	A, B, C
J	Leapy template suggestions in EventSetupSteps Step 1	Small	E
K	"Switch to Leapy" / "Switch to manual" cross-links	Small	D, I
Suggested order: F → A → B → C → D → E → G → H → I → J → K

F is standalone and quick. A-C are foundations. D is the big one. Everything else layers on.