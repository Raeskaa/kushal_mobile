LeapSpace Events Module — Complete Product AuditProduct Audit & Gap Analysis1. USER ROLES & PERSPECTIVES
Role
Description
Can Access
Creator (Admin)
Created the event, full control
All tabs: Overview, Schedule, Attendees, Tickets, Discussion, Analytics, AI Hub, Settings
Moderator
Granted admin-level access (from setting)
Same as Creator
Speaker
Invited as a speaker
Overview, Schedule, Attendees, Discussion, AI Hub
Learner (Registered)
Has registration
Overview, Agenda, Speakers, Resources, Discussion, Reviews
Learner (Post-Event)
Event has ended
Overview, Recording, Resources, Certificate, Discussion, Reviews
Anonymous (Public)
Browsing, not registered
Overview, Agenda, Speakers, Resources, Reviews (read-only)

2. EVENT LIFECYCLE STAGES
skeleton --> building --> ready --> published --> live --> ended --> archived
|                                                                    |
+--> cancelled <-----+  +--> postponed (returns to published with new date)

Stage
Status
Who Sees What
Skeleton
 Draft
Creator only. Minimal data, most checklist incomplete
Building
 Draft
Creator only. Actively filling checklist items
Ready
 Draft
Creator only. All checklist items done, ready to publish
Published
 Upcoming
Everyone. Event is live on the platform, accepting registrations
Live
 Upcoming
Everyone. Event is happening RIGHT NOW
Ended
 Past
Everyone. Post-event phase with recordings, certificates, reviews
Archived
 Past
Creator only. Removed from public visibility
Cancelled
 Cancelled
Everyone. Shows cancellation reason, no actions available



3. FULL JOURNEY MAP — CREATOR PERSPECTIVE3A. Onboarding & Empty States
Screen/State
Current Status
What Exists
Gaps
First-time events landing (no events)
 GAP
No empty state for zero events
Need: illustrated empty state with "Create your first event" CTA + Leapy prompt "Want me to help you plan your first event?"
Events landing (has events)
 BUILT
Needs Attention carousel, 6 L2 tabs (Needs Attention, Discover, Attending, Hosting, Drafts, Past)
-
FAB / Create button
 BUILT
"Create Event" opens Leapy with create_event context
No non-Leapy creation flow (form-based)

3B. Creating an Event

With Leapy (AI-First Path)
Step
Leapy Context
Flow
Status
1. User taps "Create Event"
create_event
Multi-turn: describe event -> preview card -> save as draft
 BUILT (3-turn flow)
2. Brainstorm mode
create_event branch
"Not sure" triggers format suggestions
 BUILT
3. Quick create from template
-
-
 GAP: No event templates (Workshop, Webinar, Meetup, etc.)
4. Create within community
create_event_in_community
Same as create_event but pre-fills community
 BUILT (alias)
5. Duplicate existing
duplicate_event
Shows preview, asks what to change
 BUILT

Without Leapy (Manual Path)
Step
UI Component
Status
1. Form-based creation wizard
MobileEventCreationFlow
EXISTS but not connected to main flow (only Leapy path is connected)
2. Step-by-step builder with form fields
-
GAP: No inline editing on event detail screens. All editing goes through Leapy
3. Template picker
-
GAP: No template selection UI
GAP: There is NO way to manually edit event fields without going through Leapy. Every "Edit" button opens Leapy. Users who prefer direct manipulation have no path.





3C. Drafting & Building Stage

Checklist System (Admin Overview)
Checklist Item
Leapy Context
Regular Edit Path
Status
Add event title
edit_event_details
None (Leapy only)
BUILT Leapy / GAP regular
Add description
edit_event_description
None
BUILT Leapy / GAP regular
Set date & time
edit_event_details
None
BUILT Leapy / GAP regular
Upload cover image
edit_event_cover
None
BUILT Leapy / GAP regular
Create agenda
build_agenda
None
BUILT Leapy / GAP regular
Set up tickets
set_tickets
None
BUILT Leapy / GAP regular
Add speakers
add_speakers
None
BUILT Leapy / GAP regular
Set location
set_location
None
BUILT Leapy / GAP regular
Configure registration
set_registration
None
BUILT Leapy / GAP regular
Batch completion: review_checklist — Leapy walks through all remaining items









Draft Quick Actions
Action
Leapy
Regular
Status
Share draft for preview
share_event
 -
 BUILT Leapy / GAP: no preview link generation without Leapy
Generate QR code
generate_qr
 -
 BUILT Leapy only
Duplicate event
duplicate_event
 -
 BUILT Leapy only
Edit details
edit_event_details
 -
 BUILT Leapy only
Add co-host
add_cohost
 -
 BUILT Leapy only
Add resources
add_resources
 -
 BUILT Leapy only
Publish event
publish_event
 -
 BUILT Leapy only (multi-turn: review -> confirm)


