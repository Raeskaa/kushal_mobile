# Events Module — Mobile Build TODO

## Phase 1-5: BUILD ✅ COMPLETE

## Phase 6: AUDIT & FIX — Event Dead Buttons

### MobileApp.tsx
- [x] Cleaned 12 dead imports (MobileLayout, MobileSearchPage, MobileSecondaryNav, MobileCommunitiesPage, MobileEventsPage, CommunityBuilderDemo, MobileCommunityBuilder, MobileResetPassword, MobileAccountMerge, MobileExpiredMagicLink, MobileSocialConnecting, unused lucide icons)
- [x] Created MobileNotifications component + wired handleNotificationClick
- [x] Added showNotifications state
- [x] Fixed tab-switching bug — selectedCommunityId/selectedEventId now clear when switching pages

### MobileIndividualEvent.tsx
- [x] Search button → toast
- [x] Bell button → toast  
- [x] "Join Live Room" drawer button → toast

### MobileEventOverview.tsx
- [x] "Change Cover" → toast
- [x] "Edit" pencil → toast
- [x] Quick Actions (Preview, Share, QR Code, Edit) → all toast

### MobileEventSchedule.tsx
- [x] "Add Session" → toast
- [x] "Auto-generate schedule" → toast

### MobileEventAttendees.tsx
- [x] "Export CSV" → toast.success
- [x] "Send Email" → toast
- [x] Attendee cards → clickable with toast showing details

### MobileEventTickets.tsx
- [x] "Add Tier" → toast
- [x] "Add Code" → toast

### MobileEventDiscussion.tsx
- [x] Send button → actually adds message to list
- [x] Enter key → submits message
- [x] Like button → toggles like state
- [x] Reply button → toast
- [x] More button → toast
- [x] Emoji button → toast
- [x] Image button → toast
- [x] Send button color changes based on input state

### MobileEventSettings.tsx
- [x] All settings items → toast showing current value
- [x] "Cancel Event" → toast
- [x] "Delete Event" → toast

### MobileEventLanding.tsx (learner)
- [x] Register/Apply/Join Waitlist/Get Ticket → handleRegister with toast + state change
- [x] "Add to Calendar" → toast.success
- [x] "Join Now" (live) → toast
- [x] Share button → copies link + toast.success
- [x] Community nesting card → clickable with toast

### MobilePostEvent.tsx
- [x] "Watch Recording" → toast
- [x] Play button in video → toast
- [x] Resource downloads → toast.success
- [x] "Download Certificate" → toast.success
- [x] "Leave a Review" → toast
- [x] "Write a Review" → toast

### MobileNotifications.tsx (NEW)
- [x] Created full notifications page with 7 mock notifications
- [x] Bell icon on ALL pages now opens this
- [x] Unread indicators, "Mark all read" button
- [x] Notification items are clickable

## Still TODO (Community & Global — next phase)
- [ ] Fix gradient violations in community components
- [ ] Wire community dead buttons
- [ ] Build Courses landing (same pattern as Communities/Events)
- [ ] Build Home dashboard content
