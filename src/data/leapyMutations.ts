// ═══════════════════════════════════════════════════════════════
// LEAPY MUTATIONS — Maps each completed flow to concrete event
// state changes that update the UI
// ═══════════════════════════════════════════════════════════════

import { type MockEvent } from './mockEventData';

/**
 * Given a completed Leapy flow context type, return the Partial<MockEvent>
 * changes that should be applied to the event in the store.
 * Returns null if no UI-visible mutation is needed (informational flows).
 */
export function getMutationForFlow(
  contextType: string,
  event?: MockEvent,
): Partial<MockEvent> | null {
  switch (contextType) {
    // ─── LIFECYCLE TRANSITIONS ─────────────────────────────────
    case 'publish_event':
      return {
        status: 'upcoming',
        lifecycleStage: 'published',
      };

    case 'cancel_event':
      return {
        status: 'cancelled',
        lifecycleStage: 'cancelled',
        cancellationReason: 'Cancelled by organizer via Leapy',
      };

    case 'end_event':
      return {
        status: 'past',
        lifecycleStage: 'ended',
        liveAttendeeCount: 0,
      };

    case 'postpone_event':
      return {
        date: '2026-04-15',
        time: 'TBD — Check back soon',
      };

    case 'archive_event':
      return {
        lifecycleStage: 'archived',
      };

    case 'unpublish_event':
      return {
        status: 'draft',
        lifecycleStage: 'building',
      };

    case 'go_live':
      return {
        status: 'upcoming',
        lifecycleStage: 'live',
        liveAttendeeCount: event?.attendeeCount || 0,
      };

    case 'reopen_registration':
      return {
        accessType: 'open' as const,
      };

    // ─── SERIES / RECURRING ─────────────────────────────────────
    case 'skip_occurrence':
      return {
        lifecycleStage: 'cancelled',
        status: 'cancelled',
        cancellationReason: 'This occurrence was skipped',
      };

    case 'cancel_series':
      return {
        lifecycleStage: 'cancelled',
        status: 'cancelled',
        cancellationReason: 'Entire series cancelled by organizer',
      };

    case 'edit_series':
      return null; // Informational — changes apply to future occurrences

    // ─── SPEAKER ACTIONS ────────────────────────────────────────
    case 'manage_speaker_session':
    case 'update_speaker_bio':
      return null; // Speaker profile changes

    // ─── DRAFT BUILDING ────────────────────────────────────────
    case 'edit_event_details':
    case 'edit_published_event':
      return {
        title: event?.title ? event.title : 'Updated Event',
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasTitle: true, hasDateTime: true }
          : undefined,
      };

    case 'edit_event_description':
      return {
        description: event?.description
          ? event.description
          : 'A comprehensive event covering key topics with expert speakers and interactive sessions.',
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasDescription: true }
          : undefined,
      };

    case 'edit_event_cover':
      return {
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasCoverImage: true }
          : undefined,
      };

    case 'build_agenda':
    case 'edit_agenda':
      return {
        schedule: event?.schedule?.length
          ? event.schedule
          : [
              { id: 'sch-new-1', title: 'Welcome & Introduction', time: '9:00 AM', duration: '15 min', type: 'keynote' as const, speaker: event?.speakers?.[0]?.name || 'Host' },
              { id: 'sch-new-2', title: 'Main Presentation', time: '9:15 AM', duration: '45 min', type: 'session' as const, speaker: event?.speakers?.[0]?.name || 'Speaker' },
              { id: 'sch-new-3', title: 'Interactive Workshop', time: '10:00 AM', duration: '30 min', type: 'workshop' as const },
              { id: 'sch-new-4', title: 'Break', time: '10:30 AM', duration: '10 min', type: 'break' as const },
              { id: 'sch-new-5', title: 'Q&A Session', time: '10:40 AM', duration: '20 min', type: 'session' as const },
            ],
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasAgenda: true }
          : undefined,
      };

    case 'add_speakers':
    case 'edit_speakers':
      return {
        speakers: [
          ...(event?.speakers || []),
          ...(event?.speakers?.length === 0
            ? [{
                id: `spk-new-${Date.now()}`,
                name: 'New Speaker',
                email: 'speaker@example.com',
                role: 'Speaker' as const,
                avatar: 'NS',
                bio: 'Expert in the field',
              }]
            : []),
        ],
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasSpeakers: true }
          : undefined,
      };

    case 'set_tickets':
      return {
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasTickets: true }
          : undefined,
      };

    case 'set_location':
      return {
        locationDetails: event?.locationDetails || 'Updated location details provided',
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasLocation: true }
          : undefined,
      };

    case 'set_registration':
      return {
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasRegistrationForm: true }
          : undefined,
      };

    case 'set_registration_config':
      return {
        completionChecklist: event?.completionChecklist
          ? { ...event.completionChecklist, hasRegistrationConfig: true }
          : undefined,
      };

    case 'review_checklist':
      // Mark all items as done
      return {
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
      };

    // ─── PUBLISHED MANAGEMENT ──────────────────────────────────
    case 'close_registration':
      return {
        accessType: 'paid' as const, // Effectively closes open registration
      };

    case 'increase_capacity':
      return {
        capacity: (event?.capacity || 100) + 50,
      };

    // ─── LIVE EVENT ────────────────────────────────────────────
    case 'extend_time':
      return {
        time: event?.time ? event.time.replace(/(\d+:\d+)/, '$1 (Extended)') : 'Extended',
      };

    // ─── POST-EVENT ADMIN ──────────────────────────────────────
    case 'upload_recording':
      return {
        recordingUrl: 'https://recordings.leapspace.ai/event-recording.mp4',
      };

    case 'share_recording':
      return null; // Informational — no state change

    case 'create_feedback_survey':
      return null; // External action — toast is enough

    case 'create_recap_post':
      return null; // Creates a post elsewhere

    case 'summarize_feedback':
      return null; // Read-only analysis

    case 'send_followup':
      return null; // Email sent — no event state change

    // ─── LEARNER REGISTRATION ──────────────────────────────────
    case 'register_event':
      return {
        userRegistration: { status: 'confirmed' as const },
        attendeeCount: (event?.attendeeCount || 0) + 1,
      };

    case 'join_waitlist':
      return {
        userRegistration: { status: 'waitlist' as const, waitlistPosition: 12 },
      };

    case 'cancel_registration':
      return {
        userRegistration: { status: 'cancelled-by-user' as const },
        attendeeCount: Math.max((event?.attendeeCount || 1) - 1, 0),
      };

    case 'update_registration':
      return null; // Informational update

    // ─── LEARNER POST-EVENT ────────────────────────────────────
    case 'submit_feedback':
    case 'rate_event':
      return null; // Feedback submitted — no event change

    case 'get_certificate':
    case 'download_recording':
      return null; // Download triggered — no event change

    // ─── SOCIAL/SHARING ────────────────────────────────────────
    case 'share_event':
    case 'generate_qr':
    case 'share_attending':
    case 'share_recap':
    case 'share_join_link':
    case 'invite_friend':
    case 'connect_speaker':
    case 'connect_attendees':
    case 'find_similar':
    case 'send_update':
    case 'send_live_announcement':
    case 'share_live_resource':
    case 'check_in_attendees':
    case 'manage_qa':
    case 'message_attendees':
    case 'message_individual':
    case 'manage_waitlist':
    case 'download_attendees':
    case 'add_to_calendar':
    case 'set_reminder':
    case 'set_reminders':
    case 'ask_about_event':
    case 'ask_question_live':
    case 'take_notes':
    case 'report_issue':
    case 'add_cohost':
    case 'add_resources':
    case 'duplicate_event':
      return null; // These are informational/external — no direct event mutation

    default:
      return null;
  }
}

/**
 * Get a human-readable toast message for a completed flow.
 */
export function getCompletionToast(contextType: string): string | null {
  const toasts: Record<string, string> = {
    publish_event: 'Event published successfully!',
    cancel_event: 'Event has been cancelled',
    end_event: 'Event ended — great session!',
    postpone_event: 'Event postponed — attendees will be notified',
    archive_event: 'Event archived',
    edit_event_details: 'Event details updated',
    edit_event_description: 'Description updated',
    edit_event_cover: 'Cover image updated',
    build_agenda: 'Agenda created',
    edit_agenda: 'Agenda updated',
    add_speakers: 'Speaker added',
    edit_speakers: 'Speakers updated',
    set_tickets: 'Tickets configured',
    set_location: 'Location updated',
    set_registration: 'Registration settings saved',
    review_checklist: 'All checklist items completed!',
    close_registration: 'Registration closed',
    increase_capacity: 'Capacity increased',
    extend_time: 'Event time extended',
    upload_recording: 'Recording uploaded',
    share_recording: 'Recording shared with attendees',
    send_followup: 'Follow-up email sent',
    create_feedback_survey: 'Feedback survey created & sent',
    create_recap_post: 'Recap post drafted',
    summarize_feedback: 'Feedback summary generated',
    register_event: 'You\'re registered!',
    join_waitlist: 'Added to waitlist',
    cancel_registration: 'Registration cancelled',
    update_registration: 'Registration updated',
    share_event: 'Event shared',
    generate_qr: 'QR code generated',
    send_update: 'Update sent to all attendees',
    send_live_announcement: 'Announcement sent',
    share_live_resource: 'Resource shared with attendees',
    check_in_attendees: 'Check-in started',
    manage_qa: 'Q&A updated',
    duplicate_event: 'Event duplicated as new draft',
    add_cohost: 'Co-host invitation sent',
    add_resources: 'Resources added',
    submit_feedback: 'Thanks for your feedback!',
    get_certificate: 'Certificate downloaded',
    download_recording: 'Recording download started',
    unpublish_event: 'Event unpublished — moved back to draft',
    go_live: 'You\u2019re live! Event is now streaming',
    reopen_registration: 'Registration reopened',
    skip_occurrence: 'This occurrence has been skipped',
    cancel_series: 'Entire series cancelled',
    edit_series: 'Series settings updated',
    manage_speaker_session: 'Session updated',
    update_speaker_bio: 'Bio updated',
  };
  return toasts[contextType] || null;
}