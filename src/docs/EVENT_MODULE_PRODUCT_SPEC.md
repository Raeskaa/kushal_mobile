# LeapSpace Events Module — Complete Product Specification
### Product Audit & Gap Analysis
---

## 1. USER ROLES & PERSPECTIVES

| Role | Description | Can Access |
|------|-------------|------------|
| **Creator** (Admin) | Created the event, full control | All tabs: Overview, Schedule, Attendees, Tickets, Discussion, Analytics, AI Hub, Settings |
| **Moderator** | Granted admin-level access | Same as Creator |
| **Speaker** | Invited as a speaker | Overview, Schedule, Attendees, Discussion, AI Hub |
| **Learner** (Registered) | Has registration | Overview, Agenda, Speakers, Resources, Discussion, Reviews |
| **Learner** (Post-Event) | Event has ended | Overview, Recording, Resources, Certificate, Discussion, Reviews |
| **Anonymous** (Public) | Browsing, not registered | Overview, Agenda, Speakers, Resources, Reviews (read-only) |

---

## 2. EVENT LIFECYCLE STAGES

```
skeleton --> building --> ready --> published --> live --> ended --> archived
                                       |                    |
                                       +--> cancelled <-----+
                                       +--> postponed (returns to published with new date)
```

| Stage | Status | Who Sees What |
|-------|--------|---------------|
| **Skeleton** | Draft | Creator only. Minimal data, most checklist incomplete |
| **Building** | Draft | Creator only. Actively filling checklist items |
| **Ready** | Draft | Creator only. All checklist items done, ready to publish |
| **Published** | Upcoming | Everyone. Event is live on the platform, accepting registrations |
| **Live** | Upcoming | Everyone. Event is happening RIGHT NOW |
| **Ended** | Past | Everyone. Post-event phase with recordings, certificates, reviews |
| **Archived** | Past | Creator only. Removed from public visibility |
| **Cancelled** | Cancelled | Everyone. Shows cancellation reason, no actions available |

---

## 3. FULL JOURNEY MAP — CREATOR PERSPECTIVE

### 3A. Onboarding & Empty States

| Screen/State | Current Status | What Exists | Gaps |
|---|---|---|---|
| First-time events landing (no events) | GAP | No empty state for zero events | Need: illustrated empty state with "Create your first event" CTA + Leapy prompt "Want me to help you plan your first event?" |
| Events landing (has events) | BUILT | Needs Attention carousel, 6 L2 tabs (Needs Attention, Discover, Attending, Hosting, Drafts, Past) | - |
| FAB / Create button | BUILT | "Create Event" opens Leapy with `create_event` context | No non-Leapy creation flow (form-based) |

### 3B. Creating an Event

#### With Leapy (AI-First Path)
| Step | Leapy Context | Flow | Status |
|---|---|---|---|
| 1. User taps "Create Event" | `create_event` | Multi-turn: describe event -> preview card -> save as draft | BUILT (3-turn flow) |
| 2. Brainstorm mode | `create_event` branch | "Not sure" triggers format suggestions | BUILT |
| 3. Quick create from template | - | - | GAP: No event templates (Workshop, Webinar, Meetup, etc.) |
| 4. Create within community | `create_event_in_community` | Same as create_event but pre-fills community | BUILT (alias) |
| 5. Duplicate existing | `duplicate_event` | Shows preview, asks what to change | BUILT |

#### Without Leapy (Manual Path)
| Step | UI Component | Status |
|---|---|---|
| 1. Form-based creation wizard | `MobileEventCreationFlow` | EXISTS but not connected to main flow (only Leapy path is connected) |
| 2. Step-by-step builder with form fields | - | GAP: No inline editing on event detail screens. All editing goes through Leapy |
| 3. Template picker | - | GAP: No template selection UI |

**GAP: There is NO way to manually edit event fields without going through Leapy.** Every "Edit" button opens Leapy. Users who prefer direct manipulation have no path.

### 3C. Drafting & Building Stage

#### Checklist System (Admin Overview)
| Checklist Item | Leapy Context | Regular Edit Path | Status |
|---|---|---|---|
| Add event title | `edit_event_details` | None (Leapy only) | BUILT Leapy / GAP regular |
| Add description | `edit_event_description` | None | BUILT Leapy / GAP regular |
| Set date & time | `edit_event_details` | None | BUILT Leapy / GAP regular |
| Upload cover image | `edit_event_cover` | None | BUILT Leapy / GAP regular |
| Create agenda | `build_agenda` | None | BUILT Leapy / GAP regular |
| Set up tickets | `set_tickets` | None | BUILT Leapy / GAP regular |
| Add speakers | `add_speakers` | None | BUILT Leapy / GAP regular |
| Set location | `set_location` | None | BUILT Leapy / GAP regular |
| Configure registration | `set_registration` | None | BUILT Leapy / GAP regular |

**Batch completion**: `review_checklist` — Leapy walks through all remaining items

#### Draft Quick Actions
| Action | Leapy | Regular | Status |
|---|---|---|---|
| Share draft for preview | `share_event` | - | BUILT Leapy / GAP: no preview link generation without Leapy |
| Generate QR code | `generate_qr` | - | BUILT Leapy only |
| Duplicate event | `duplicate_event` | - | BUILT Leapy only |
| Edit details | `edit_event_details` | - | BUILT Leapy only |
| Add co-host | `add_cohost` | - | BUILT Leapy only |
| Add resources | `add_resources` | - | BUILT Leapy only |
| Publish event | `publish_event` | - | BUILT Leapy only (multi-turn: review -> confirm) |

### 3D. Publishing

| Action | Leapy Context | Flow Description | Status |
|---|---|---|---|
| Review & Publish | `publish_event` | 3-turn: preview -> readiness check -> confirm publish | BUILT |
| Publish with announcement | - | - | GAP: no option to combine publish + send announcement in one flow |
| Schedule publish for later | - | - | GAP: no scheduled publishing |
| Publish to specific audiences | - | - | GAP: no audience targeting on publish |

### 3E. Published / Pre-Event Management

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Send update to attendees | `send_update` | - | BUILT Leapy / GAP regular |
| Close registration | `close_registration` | - | BUILT Leapy / GAP regular |
| Postpone event | `postpone_event` | - | BUILT Leapy / GAP regular |
| Cancel event | `cancel_event` | - | BUILT Leapy (destructive confirmation card) / GAP regular |
| Edit speakers | `edit_speakers` | - | BUILT Leapy / GAP regular |
| Increase capacity | `increase_capacity` | - | BUILT Leapy / GAP regular |
| Edit published event | `edit_event_details` | - | BUILT Leapy / GAP regular |
| Manage waitlist | `manage_waitlist` | - | BUILT Leapy / GAP regular |

### 3F. Inviting People & Marketing

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Share event link | `share_event` | Copy link button | BUILT both |
| Generate QR code | `generate_qr` | - | BUILT Leapy only |
| Generate social media post | - | - | GAP: no social post generation |
| Email invite list | - | - | GAP: no bulk email invite from contact list |
| Embed widget for website | - | - | GAP: no embeddable registration widget |
| Referral/affiliate tracking | - | - | GAP: no referral system |
| UTM tracking for links | - | - | GAP: no UTM parameter management |
| Create early bird discount | (in set_tickets) | - | Display exists, creation is GAP |
| Create discount codes | (in set_tickets) | - | Display exists, creation is GAP |

### 3G. Hosting / Live Event (Admin)

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Share join link | `share_join_link` | - | BUILT Leapy only |
| Check in attendees | `check_in_attendees` | - | BUILT Leapy only |
| Send live announcement | `send_live_announcement` | - | BUILT Leapy only |
| Share live resource | `share_live_resource` | - | BUILT Leapy only |
| Manage Q&A | `manage_qa` | - | BUILT Leapy only |
| Extend time | `extend_time` | - | BUILT Leapy only |
| End event | `end_event` | - | BUILT Leapy only |
| Live attendee counter | - | Display only | BUILT (display) |
| Live polling | - | - | GAP: no live polls feature |
| Breakout rooms | - | - | GAP: no breakout room management |
| Screen sharing controls | - | - | GAP: no AV controls |
| Backstage / green room | - | - | GAP: no pre-show staging area |
| Live streaming integration | - | - | GAP: no streaming to YouTube/Twitch |
| "Join Now" button | - | Toast only | GAP: no actual meeting room / video integration |

### 3H. Post-Event (Admin)

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Upload recording | `upload_recording` | - | BUILT Leapy / GAP regular upload |
| Share recording | `share_recording` | - | BUILT Leapy only |
| Send follow-up email | `send_followup` | - | BUILT Leapy only |
| Create feedback survey | `create_feedback_survey` | - | BUILT Leapy only |
| Summarize feedback (AI) | `summarize_feedback` | - | BUILT Leapy only |
| Create recap post | `create_recap_post` | - | BUILT Leapy only |
| Export attendee data | `download_attendees` | - | BUILT Leapy only |
| Archive event | `archive_event` | - | BUILT Leapy only |
| Issue certificates | - | - | GAP: no certificate generation/issuance UI for admin |
| Revenue report / payout | - | - | GAP: no financial reporting |
| Attendee engagement report | - | - | GAP: only mock data in analytics, no real engagement tracking |

---

## 4. FULL JOURNEY MAP — LEARNER PERSPECTIVE

### 4A. Discovery & Browsing

| Screen/Action | Status | Notes |
|---|---|---|
| Events landing — Discover tab | BUILT | Filters: Free, Paid, Virtual, In-Person, Hybrid |
| Event card with role badges | BUILT | Shows: Hosting, Speaking, Attending, Waitlisted, Applied, Draft, Cancelled, Live |
| Event card CTA buttons | BUILT | Context-aware: Register, Get Ticket, Apply, Join Waitlist, Join Now, View Ticket, etc. |
| Search events | BUILT | Global search page exists |
| Category/tag browsing | GAP | Tags display on event cards but no category filter page |
| Recommended events | GAP | No AI-powered event recommendations |
| "Events near me" (location-based) | GAP | No geolocation filtering |
| Calendar view of events | GAP | No calendar/timeline view, only list view |

### 4B. Registration

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Register (free, open) | `register_event` | Fallback toast | BUILT both |
| Register (paid) | `register_event` | Toast "Checkout coming soon" | BUILT Leapy / GAP: no checkout UI |
| Apply (screened) | `register_event` | Fallback toast | BUILT Leapy / GAP: no application form |
| Join waitlist | `join_waitlist` | Fallback toast | BUILT both |
| Cancel registration | `cancel_registration` | - | BUILT Leapy only |
| Update registration | `update_registration` | - | BUILT Leapy only |
| Add to calendar | `add_to_calendar` | - | BUILT Leapy only (should be direct .ics download) |
| Set reminder | `set_reminder` | - | BUILT Leapy only |
| View ticket/confirmation | - | - | GAP: no ticket view / e-ticket / QR pass |
| Transfer ticket | - | - | GAP |
| Request refund | - | - | GAP |

### 4C. Pre-Event (Registered Learner)

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Ask about event | `ask_about_event` | - | BUILT Leapy only |
| Invite a friend | `invite_friend` | - | BUILT Leapy only |
| Share "I'm attending" | `share_attending` | - | BUILT Leapy only |
| View agenda | - | Agenda section | BUILT |
| View speakers | - | Speakers section | BUILT |
| View resources | - | Resources section | BUILT (empty state: "available after event") |
| Join discussion | - | Discussion tab | BUILT |
| Pre-event networking | - | - | GAP: no attendee directory / matching |
| Dietary/accessibility preferences | - | - | GAP: no preference collection |

### 4D. During Live Event (Learner)

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Join live session | - | "Join Now" button | GAP: toast only, no actual video |
| Ask question via Q&A | `ask_question_live` | - | BUILT Leapy only |
| Take notes | `take_notes` | - | BUILT Leapy only (should have standalone notes UI) |
| Report issue | `report_issue` | - | BUILT Leapy only |
| React/emoji during session | - | - | GAP: no live reactions |
| Vote on polls | - | - | GAP: no polling feature |
| Raise hand | - | - | GAP |
| Download shared resources | - | - | GAP: no real-time resource push to learner |

### 4E. Post-Event (Learner)

| Action | Leapy | Regular | Status |
|---|---|---|---|
| Watch recording | `download_recording` | Play button (display only) | BUILT Leapy / GAP: no actual video player |
| Download recording | `download_recording` | - | BUILT Leapy only |
| Download resources | - | Download button per resource | BUILT (toast only) |
| Get certificate | `get_certificate` | Download button | BUILT both (Leapy + display) |
| Submit feedback/review | `submit_feedback` | - | BUILT Leapy only |
| Read reviews | - | Reviews section | BUILT |
| Share recap | `share_recap` | - | BUILT Leapy only |
| Connect with speaker | `connect_speaker` | - | BUILT Leapy only |
| Connect with attendees | `connect_attendees` | - | BUILT Leapy only |
| Find similar events | `find_similar` | - | BUILT Leapy only |

---

## 5. CONTEXTUAL LEAPY ENHANCEMENT MAP

### By Screen — What Leapy Can Do

| Screen | Admin Leapy Actions | Learner Leapy Actions |
|---|---|---|
| **Events Landing** | `create_event` | - |
| **Event Overview (Draft)** | `edit_event_cover`, `edit_event_details`, `edit_event_description`, `add_speakers`, `build_agenda`, `set_tickets`, `set_location`, `set_registration`, `review_checklist`, `publish_event`, `share_event`, `generate_qr`, `duplicate_event`, `add_cohost`, `add_resources` | - |
| **Event Overview (Published)** | `send_update`, `close_registration`, `postpone_event`, `cancel_event`, `share_event`, `generate_qr`, `edit_event_details`, `edit_speakers`, `increase_capacity`, `duplicate_event`, `add_cohost`, `add_resources` | `register_event`, `join_waitlist`, `add_to_calendar`, `update_registration`, `cancel_registration`, `ask_about_event`, `invite_friend`, `set_reminder`, `share_attending`, `share_event` |
| **Event Overview (Live)** | `share_join_link`, `check_in_attendees`, `send_live_announcement`, `share_live_resource`, `manage_qa`, `extend_time`, `end_event` | `ask_question_live`, `take_notes`, `report_issue` |
| **Event Overview (Ended)** | `upload_recording`, `send_followup`, `create_feedback_survey`, `summarize_feedback`, `create_recap_post`, `share_recording` | `download_recording`, `get_certificate`, `submit_feedback`, `share_recap`, `connect_speaker`, `connect_attendees`, `find_similar` |
| **Schedule** | `edit_agenda`, `build_agenda` | (read-only) |
| **Attendees** | `download_attendees`, `message_attendees`, `manage_waitlist`, `message_individual` | - |
| **Tickets** | `set_tickets` (add tier, add discount code) | - |
| **Discussion** | `manage_qa`, `send_live_announcement`, `share_live_resource` | `ask_question_live`, `take_notes`, `report_issue` |
| **Analytics** | `summarize_feedback`, `download_attendees`, `create_recap_post` | - |
| **Settings** | `edit_event_details`, `cancel_event`, `archive_event` | - |

### Leapy Enhancement Quality Assessment

| Context | Turns | Has Rich Cards | Has Branching | Has Done+Mutation | Quality |
|---|---|---|---|---|---|
| `create_event` | 3 | Preview, Checklist | Yes (brainstorm, date, capacity) | Partial | HIGH |
| `publish_event` | 3 | Preview, Confirmation | Yes | Yes (lifecycle change) | HIGH |
| `build_agenda` | 3 | Agenda Preview | Yes (formats) | Yes | HIGH |
| `add_speakers` | 3 | Speaker List | Yes | Yes | HIGH |
| `cancel_event` | 3 | Confirmation (destructive) | Yes | Yes | HIGH |
| `send_followup` | 3 | Message Draft | Yes (tone, channel) | No mutation (external) | HIGH |
| `submit_feedback` | 3 | Choice cards | Yes (rating, aspects) | No mutation (external) | MEDIUM |
| `edit_event_details` | 3 | Preview | Yes | Yes | MEDIUM |
| `register_event` | 2 | Preview | Yes (free/paid/screened) | Yes | MEDIUM |
| `set_tickets` | 2 | - | Yes | Yes (checklist) | LOW — needs ticket builder cards |
| `set_registration` | 2 | - | Yes | Yes (checklist) | LOW — needs form builder |
| `set_location` | 2 | - | Yes | Yes (checklist) | LOW — needs map/venue cards |
| `generate_qr` | 1 | - | No | No | LOW — should render actual QR |
| `download_attendees` | 1 | - | No | No | LOW — should show format options |
| `take_notes` | 2 | - | Yes | No | LOW — needs note editor card |
| `message_individual` | 2 | Message Draft | Yes | No | MEDIUM |

---

## 6. COMPLETE ACTION REGISTRY

### All Actions: Regular vs Leapy

| # | Action | Regular UI | Leapy AI | Both? | Notes |
|---|---|---|---|---|---|
| | **CREATION** | | | | |
| 1 | Create event from scratch | GAP | BUILT | Leapy only | Need form-based alternative |
| 2 | Create from template | GAP | GAP | Neither | Need template library |
| 3 | Duplicate existing event | - | BUILT | Leapy only | |
| 4 | Import event (from URL, calendar) | GAP | GAP | Neither | Nice-to-have |
| | **DRAFT BUILDING** | | | | |
| 5 | Edit title | GAP | BUILT | Leapy only | Need inline edit |
| 6 | Edit description | GAP | BUILT | Leapy only | Need rich text editor |
| 7 | Set date & time | GAP | BUILT | Leapy only | Need date picker |
| 8 | Upload cover image | GAP | BUILT | Leapy only | Need image upload UI |
| 9 | Build agenda/schedule | GAP | BUILT | Leapy only | Need drag-drop agenda builder |
| 10 | Add/edit speakers | GAP | BUILT | Leapy only | Need speaker management UI |
| 11 | Set location/venue | GAP | BUILT | Leapy only | Need location picker |
| 12 | Configure registration form | GAP | BUILT | Leapy only | Need form builder UI |
| 13 | Set up tickets/pricing | GAP | BUILT | Leapy only | Need ticket tier builder |
| 14 | Review readiness checklist | - | BUILT | Leapy only | Visual checklist exists, taps open Leapy |
| | **PUBLISHING** | | | | |
| 15 | Publish event | GAP | BUILT | Leapy only | Need "Publish" button with confirmation dialog |
| 16 | Schedule publish | GAP | GAP | Neither | |
| | **MARKETING & SHARING** | | | | |
| 17 | Share link | BUILT (copy) | BUILT | Both | |
| 18 | Generate QR code | GAP | BUILT | Leapy only | Should also have direct generation |
| 19 | Share on social | GAP | GAP | Neither | |
| 20 | Email invite list | GAP | GAP | Neither | |
| 21 | Create discount code | Display only | Partially (set_tickets) | Leapy only | Codes display but can't be created manually |
| | **PUBLISHED MANAGEMENT** | | | | |
| 22 | Send update to attendees | GAP | BUILT | Leapy only | Need message composer UI |
| 23 | Close/reopen registration | GAP | BUILT | Leapy only | Need toggle switch |
| 24 | Increase capacity | GAP | BUILT | Leapy only | Need number input |
| 25 | Postpone event | GAP | BUILT | Leapy only | Need date picker dialog |
| 26 | Cancel event | GAP | BUILT | Leapy only | Need confirmation dialog |
| 27 | Add co-host | GAP | BUILT | Leapy only | Need user search/invite UI |
| 28 | Add resources | GAP | BUILT | Leapy only | Need file upload UI |
| 29 | Manage waitlist | GAP | BUILT | Leapy only | Need admit/reject UI |
| | **ATTENDEE MANAGEMENT** | | | | |
| 30 | View attendee list | BUILT | - | Regular only | |
| 31 | Search attendees | BUILT | - | Regular only | |
| 32 | Filter attendees | BUILT | - | Regular only | |
| 33 | Export attendee data | GAP | BUILT | Leapy only | |
| 34 | Message all attendees | GAP | BUILT | Leapy only | |
| 35 | Message individual | GAP | BUILT | Leapy only | |
| | **LIVE EVENT (ADMIN)** | | | | |
| 36 | Share join link | GAP | BUILT | Leapy only | |
| 37 | Check in attendees | GAP | BUILT | Leapy only | Need QR scanner / manual check-in |
| 38 | Send live announcement | GAP | BUILT | Leapy only | |
| 39 | Share resource during event | GAP | BUILT | Leapy only | |
| 40 | Manage Q&A | GAP | BUILT | Leapy only | Need Q&A moderation UI |
| 41 | Extend time | GAP | BUILT | Leapy only | |
| 42 | End event | GAP | BUILT | Leapy only | Need button with confirmation |
| | **LIVE EVENT (LEARNER)** | | | | |
| 43 | Join live session | GAP (toast) | - | Neither works | No video/meeting integration |
| 44 | Ask question (Q&A) | GAP | BUILT | Leapy only | Should also work via Discussion |
| 45 | Take notes | GAP | BUILT | Leapy only | Need standalone notes editor |
| 46 | Report issue | GAP | BUILT | Leapy only | |
| | **POST-EVENT (ADMIN)** | | | | |
| 47 | Upload recording | GAP | BUILT | Leapy only | Need file upload UI |
| 48 | Share recording | GAP | BUILT | Leapy only | |
| 49 | Send follow-up email | GAP | BUILT | Leapy only | |
| 50 | Create feedback survey | GAP | BUILT | Leapy only | |
| 51 | Summarize feedback (AI) | - | BUILT | Leapy only | AI-native, no regular equivalent |
| 52 | Create recap post | GAP | BUILT | Leapy only | |
| 53 | Archive event | GAP | BUILT | Leapy only | Need archive button |
| | **POST-EVENT (LEARNER)** | | | | |
| 54 | Watch recording | Display only | BUILT | Partial | No video player |
| 55 | Download recording | GAP | BUILT | Leapy only | |
| 56 | Download resources | BUILT (toast) | - | Partial | Downloads don't actually work |
| 57 | Get certificate | BUILT (display) | BUILT | Both | Display + Leapy |
| 58 | Submit review/feedback | GAP | BUILT | Leapy only | Need rating form UI |
| 59 | Read reviews | BUILT | - | Regular only | |
| 60 | Share recap | GAP | BUILT | Leapy only | |
| 61 | Connect with speaker | GAP | BUILT | Leapy only | |
| 62 | Connect with attendees | GAP | BUILT | Leapy only | |
| 63 | Find similar events | GAP | BUILT | Leapy only | |
| | **REGISTRATION (LEARNER)** | | | | |
| 64 | Register (free) | Fallback toast | BUILT | Both (partial) | Need proper confirmation screen |
| 65 | Register (paid) | Toast only | BUILT | Leapy only | Need checkout/payment UI |
| 66 | Apply (screened) | Toast only | BUILT | Leapy only | Need application form |
| 67 | Join waitlist | Toast only | BUILT | Both (partial) | |
| 68 | Cancel registration | GAP | BUILT | Leapy only | |
| 69 | Update registration | GAP | BUILT | Leapy only | |
| 70 | Add to calendar | GAP | BUILT | Leapy only | Should be direct .ics download |

---

## 7. FEATURE COMPLETENESS SCORECARD

### By Category

| Category | Total Actions | Leapy Built | Regular Built | Both Built | Neither | Score |
|---|---|---|---|---|---|---|
| Creation | 4 | 2 | 0 | 0 | 2 | 50% |
| Draft Building | 10 | 10 | 0 | 0 | 0 | 100% Leapy / 0% Regular |
| Publishing | 2 | 1 | 0 | 0 | 1 | 50% |
| Marketing | 5 | 2 | 1 | 1 | 2 | 60% |
| Published Mgmt | 8 | 8 | 0 | 0 | 0 | 100% Leapy / 0% Regular |
| Attendee Mgmt | 6 | 3 | 3 | 0 | 0 | 100% split |
| Live (Admin) | 7 | 7 | 0 | 0 | 0 | 100% Leapy / 0% Regular |
| Live (Learner) | 4 | 3 | 0 | 0 | 1 | 75% Leapy |
| Post-Event (Admin) | 7 | 7 | 0 | 0 | 0 | 100% Leapy / 0% Regular |
| Post-Event (Learner) | 10 | 8 | 2 | 2 | 0 | 100% |
| Registration | 7 | 7 | 2 | 2 | 0 | 100% Leapy |
| **TOTAL** | **70** | **58** | **8** | **5** | **6** | **83% Leapy / 11% Regular** |

---

## 8. CRITICAL GAPS (Priority Ordered)

### P0 — Blocking / Core Experience Broken

| # | Gap | Impact | Recommendation |
|---|---|---|---|
| 1 | **No manual editing path** — Every edit goes through Leapy chat | Users who want to quickly change a date/time must have a 2-turn conversation instead of tapping a field | Add inline edit modals (tap field -> edit sheet) as primary path, keep Leapy as "smart" alternative |
| 2 | **No video/meeting room integration** | "Join Now" is a dead-end toast. Live events are the core promise | Need WebRTC or 3rd-party embed (Zoom, Meet, Jitsi) |
| 3 | **No payment/checkout flow** | Paid events can't actually collect money | Need Stripe integration with checkout sheet |
| 4 | **No actual file upload** | Cover images, recordings, resources all go through Leapy chat which can't actually receive files | Need file picker / camera integration with actual upload |

### P1 — Major Feature Gaps

| # | Gap | Impact | Recommendation |
|---|---|---|---|
| 5 | **No event templates** | First-time creators have no starting point | Template library: Workshop, Webinar, Meetup, AMA, Hackathon, Conference |
| 6 | **No application/screening form** | Screened events have no way to collect applications | Form builder or at minimum a text-area application |
| 7 | **No Q&A moderation UI** | Admin "Manage Q&A" only works through Leapy | Need upvote-based Q&A list with approve/dismiss actions |
| 8 | **No notes editor** | Learner "Take Notes" only works through chat | Need standalone notes panel that persists |
| 9 | **No actual certificate generation** | Admin can't issue certificates; display is hardcoded "Sarah Chen" | Need certificate template + batch issuance |
| 10 | **No notification system for events** | No reminders, no "event starting in 15min" push | Need event-specific notification preferences & triggers |
| 11 | **No attendee check-in system** | QR check-in is Leapy-chat only | Need QR scanner component + manual check-in toggle |

### P2 — Nice-to-Have / Enhancement

| # | Gap | Impact | Recommendation |
|---|---|---|---|
| 12 | No calendar view | Users can't see events on a timeline | Add calendar/agenda view tab |
| 13 | No event recommendations | No AI discovery beyond search | Leapy "Find Similar" exists but no passive recommendations |
| 14 | No live polling | Live events lack interactivity | Add poll creation + voting UI |
| 15 | No breakout rooms | Large events can't split into groups | Lower priority |
| 16 | No referral tracking | Can't measure word-of-mouth | UTM + referral codes |
| 17 | No social media post generation | Marketing requires external tools | Leapy could generate social cards |
| 18 | No embeddable registration widget | Can't promote on external websites | Embed code generator |
| 19 | No revenue/payout dashboard | Paid event creators can't track earnings | Financial analytics tab |
| 20 | No email invite from contacts | Must share link manually | Contact picker + bulk invite |
| 21 | No attendee networking/matching | Pre-event connections are impossible | Attendee directory with interest matching |
| 22 | No scheduled publishing | Must publish manually in real-time | Schedule future publish date |

---

## 9. ARCHITECTURAL OBSERVATIONS

### What's Working Well
- **AI-first architecture** is consistent — Leapy is available at every touchpoint
- **Context-aware flows** — 58 unique context types with multi-turn conversations
- **Rich card system** — Preview, checklist, choice, confirmation, message draft, agenda, speaker cards
- **Lifecycle-aware UI** — Tabs, actions, and badges all change per lifecycle stage
- **Role-based access** — Creator/Speaker/Learner see different tabs and actions
- **State mutations on completion** — EventStoreContext properly updates UI after Leapy flows

### What Needs Rethinking
1. **Leapy is a bottleneck, not an enhancement** — For simple actions (change date, toggle registration), forcing a multi-turn conversation is friction, not value. Leapy should ENHANCE, not REPLACE.
2. **No progressive disclosure** — First-time user sees the same complex UI as a power user
3. **Discussion tab is identical for all lifecycle stages** — Should be "Pre-event chat" -> "Live Q&A" -> "Post-event discussion" with different UIs
4. **AI Hub tab is empty** — Placeholder "Coming soon". Should showcase automation recipes.
5. **No real-time features** — Live indicators are hardcoded, no WebSocket/SSE for live updates
6. **Analytics is all mock** — No actual data pipeline, just hardcoded numbers

---

## 10. RECOMMENDED NEXT PRIORITIES

### Sprint 1: Foundation (Fix P0s)
1. Add inline edit sheets for all event fields (title, date, description, location, capacity)
2. Build form-based event creation wizard as alternative to Leapy
3. Add proper confirmation dialogs for destructive actions (cancel, archive) without requiring Leapy

### Sprint 2: Registration & Tickets
4. Build checkout/payment flow for paid events
5. Build registration confirmation screen with e-ticket
6. Build application form for screened events
7. Add "Add to Calendar" as direct .ics download

### Sprint 3: Live Event Core
8. Integrate video meeting (Jitsi/Daily.co embed)
9. Build Q&A moderation UI (upvote, pin, dismiss)
10. Build live polling feature
11. Add real-time attendee count via WebSocket

### Sprint 4: Post-Event & Polish
12. Build actual file upload for recordings and resources
13. Build certificate template system
14. Build review/feedback form UI (star rating + text)
15. Add event templates library

### Sprint 5: Marketing & Growth
16. Social share card generation
17. Email invite system
18. Calendar view
19. Event recommendations

---

## 11. LEAPY FLOW QUALITY AUDIT

### Flows That Need Enrichment

| Flow | Current Quality | What's Missing |
|---|---|---|
| `set_tickets` | LOW | No ticket builder card. Should show tier config form inline |
| `set_registration` | LOW | No form field selector. Should show toggle options |
| `set_location` | LOW | No map/venue picker. Should show location cards |
| `generate_qr` | LOW | Doesn't render actual QR. Should show inline QR image |
| `download_attendees` | LOW | No format selection. Should offer CSV/PDF/Excel choice |
| `take_notes` | LOW | Notes disappear after closing. Should persist |
| `report_issue` | LOW | Generic response. Should show issue categories and track |
| `add_to_calendar` | LOW | Should directly trigger .ics download, not chat about it |
| `get_certificate` | LOW | Should directly trigger PDF download |
| `download_recording` | LOW | Should directly trigger download |

### Flows That Are Solid

| Flow | Why It Works |
|---|---|
| `create_event` | Multi-turn, brainstorm branch, preview card, saves to checklist |
| `publish_event` | Review -> readiness check -> confirmation with preview |
| `build_agenda` | Format options, preview card, session-by-session |
| `cancel_event` | Destructive confirmation, reason collection, notification |
| `send_followup` | Tone selection, message draft preview, channel choice |
| `add_speakers` | Search, preview card, role assignment |

---

## 12. SUMMARY METRICS

| Metric | Count |
|---|---|
| Total unique screens | 12 (Landing, Individual Event x 4 role views, 9 sub-tabs) |
| Total user actions identified | 70 |
| Actions with Leapy flow | 58 (83%) |
| Actions with regular UI | 8 (11%) |
| Actions with both paths | 5 (7%) |
| Actions with neither (gaps) | 6 (9%) |
| Leapy flow definitions | 58 unique + 6 aliases = 64 total |
| Leapy UI trigger points | 72 buttons across 9 component files |
| High-quality Leapy flows | ~20 (with rich cards + branching) |
| Low-quality Leapy flows | ~15 (1-2 turns, no cards, generic) |
| P0 gaps | 4 |
| P1 gaps | 7 |
| P2 gaps | 11 |
