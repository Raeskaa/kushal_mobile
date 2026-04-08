import { useState } from 'react';
import {
  History, Calendar, MapPin, FileText, Users, Ticket,
  ArrowRight, Clock, ChevronDown, ChevronUp, Mail,
  AlertTriangle, Shield, UserPlus, Settings, Video,
  Filter, Sparkles,
} from 'lucide-react';
import { type MockEvent } from '../../data/mockEventData';
import { type LeapyContext } from '../../data/leapyContexts';

// ─── Types ──────────────────────────────────────────────────────

interface ChangeLogEntry {
  id: string;
  timestamp: string;
  user: {
    name: string;
    initials: string;
    role: 'creator' | 'admin' | 'moderator' | 'editor' | 'ai';
  };
  field: string;
  oldValue: string;
  newValue: string;
  impactLevel: 'low' | 'medium' | 'high';
  notifiedAttendees: boolean;
  attendeesNotifiedCount: number;
}

interface MobileEventChangeLogsProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

// ─── Constants ──────────────────────────────────────────────────

const FIELD_ICONS: Record<string, React.ElementType> = {
  'Title': FileText,
  'Description': FileText,
  'Date & Time': Calendar,
  'Start Time': Clock,
  'End Time': Clock,
  'Start Date': Calendar,
  'End Date': Calendar,
  'Location': MapPin,
  'Format': Video,
  'Capacity': Users,
  'Speakers': UserPlus,
  'Tickets': Ticket,
  'Visibility': Shield,
  'Settings': Settings,
  'Tags': FileText,
};

const IMPACT_STYLES = {
  low: {
    dot: 'bg-muted-foreground',
    label: 'Minor',
    bg: 'bg-muted',
    border: 'border-border',
  },
  medium: {
    dot: 'bg-amber-500',
    label: 'Moderate',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  high: {
    dot: 'bg-destructive',
    label: 'Critical',
    bg: 'bg-destructive/5',
    border: 'border-destructive/20',
  },
};

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  creator: { bg: 'bg-primary/10', text: 'text-primary', label: 'Creator' },
  admin: { bg: 'bg-primary/10', text: 'text-primary', label: 'Admin' },
  moderator: { bg: 'bg-blue-50', text: 'text-blue-600', label: 'Moderator' },
  editor: { bg: 'bg-green-50', text: 'text-green-600', label: 'Editor' },
  ai: { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Leapy AI' },
};

// ─── Generate mock logs based on actual event data ──────────────

function generateMockLogs(event: MockEvent): ChangeLogEntry[] {
  const logs: ChangeLogEntry[] = [
    {
      id: 'cl-1',
      timestamp: '2026-03-11T14:23:00',
      user: { name: 'Sarah Chen', initials: 'SC', role: 'creator' },
      field: 'Date & Time',
      oldValue: 'Mar 15, 2026 · 2:00 PM',
      newValue: `${event.date} · ${event.time}`,
      impactLevel: 'high',
      notifiedAttendees: true,
      attendeesNotifiedCount: event.attendeeCount || 45,
    },
    {
      id: 'cl-2',
      timestamp: '2026-03-11T14:23:00',
      user: { name: 'Sarah Chen', initials: 'SC', role: 'creator' },
      field: 'Location',
      oldValue: 'TBD',
      newValue: event.location || event.locationDetails || 'Zoom Meeting',
      impactLevel: 'high',
      notifiedAttendees: true,
      attendeesNotifiedCount: event.attendeeCount || 45,
    },
    {
      id: 'cl-3',
      timestamp: '2026-03-10T11:05:00',
      user: { name: 'Leapy AI', initials: 'AI', role: 'ai' },
      field: 'Description',
      oldValue: 'A hands-on session covering the basics...',
      newValue: event.description.length > 50 ? event.description.slice(0, 50) + '...' : event.description,
      impactLevel: 'low',
      notifiedAttendees: false,
      attendeesNotifiedCount: 0,
    },
    {
      id: 'cl-4',
      timestamp: '2026-03-09T16:42:00',
      user: { name: 'Mike Johnson', initials: 'MJ', role: 'admin' },
      field: 'Capacity',
      oldValue: '30',
      newValue: String(event.capacity),
      impactLevel: 'medium',
      notifiedAttendees: false,
      attendeesNotifiedCount: 0,
    },
    {
      id: 'cl-5',
      timestamp: '2026-03-08T09:30:00',
      user: { name: 'Sarah Chen', initials: 'SC', role: 'creator' },
      field: 'Title',
      oldValue: 'Untitled Event',
      newValue: event.title,
      impactLevel: 'medium',
      notifiedAttendees: false,
      attendeesNotifiedCount: 0,
    },
  ];

  // Add speaker change if event has speakers
  if (event.speakers && event.speakers.length > 0) {
    logs.splice(3, 0, {
      id: 'cl-speakers',
      timestamp: '2026-03-09T18:10:00',
      user: { name: 'Sarah Chen', initials: 'SC', role: 'creator' },
      field: 'Speakers',
      oldValue: `${event.speakers.length - 1} speakers`,
      newValue: `${event.speakers.length} speakers (added ${event.speakers[event.speakers.length - 1]?.name || 'speaker'})`,
      impactLevel: 'medium',
      notifiedAttendees: false,
      attendeesNotifiedCount: 0,
    });
  }

  // Add ticket change if paid
  if (event.isPaid) {
    logs.push({
      id: 'cl-tickets',
      timestamp: '2026-03-07T14:00:00',
      user: { name: 'Emily Rodriguez', initials: 'ER', role: 'moderator' },
      field: 'Tickets',
      oldValue: 'Free',
      newValue: `Early Bird $${(event.price || 29) - 10}, Regular $${event.price || 29}`,
      impactLevel: 'medium',
      notifiedAttendees: true,
      attendeesNotifiedCount: 22,
    });
  }

  // Add format change
  logs.push({
    id: 'cl-format',
    timestamp: '2026-03-06T10:15:00',
    user: { name: 'Sarah Chen', initials: 'SC', role: 'creator' },
    field: 'Format',
    oldValue: 'In-Person',
    newValue: event.format || 'virtual',
    impactLevel: 'low',
    notifiedAttendees: false,
    attendeesNotifiedCount: 0,
  });

  // Add visibility change
  logs.push({
    id: 'cl-visibility',
    timestamp: '2026-03-05T08:45:00',
    user: { name: 'Leapy AI', initials: 'AI', role: 'ai' },
    field: 'Visibility',
    oldValue: 'Private',
    newValue: event.isPublic ? 'Public' : 'Private',
    impactLevel: 'low',
    notifiedAttendees: false,
    attendeesNotifiedCount: 0,
  });

  // Sort by timestamp descending
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ─── Component ──────────────────────────────────────────────────

export function MobileEventChangeLogs({ event, onOpenLeapy }: MobileEventChangeLogsProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'notified'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const allLogs = generateMockLogs(event);

  const filteredLogs = allLogs.filter((log) => {
    if (filter === 'critical') return log.impactLevel === 'high';
    if (filter === 'notified') return log.notifiedAttendees;
    return true;
  });

  // Group by date
  const grouped = filteredLogs.reduce<Record<string, ChangeLogEntry[]>>((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(log);
    return acc;
  }, {});

  const totalHigh = allLogs.filter(l => l.impactLevel === 'high').length;
  const totalNotified = allLogs.filter(l => l.notifiedAttendees).length;

  return (
    <div className="p-4 space-y-4">
      {/* Summary Bar */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center">
            <History className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-[14px] text-card-foreground">Change History</p>
            <p className="text-[12px] text-muted-foreground">{allLogs.length} changes recorded</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted rounded-lg p-2.5 text-center">
            <p className="text-[16px] text-card-foreground tabular-nums">{allLogs.length}</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
          <div className="bg-destructive/5 rounded-lg p-2.5 text-center">
            <p className="text-[16px] text-destructive tabular-nums">{totalHigh}</p>
            <p className="text-[10px] text-muted-foreground">Critical</p>
          </div>
          <div className="bg-primary/5 rounded-lg p-2.5 text-center">
            <p className="text-[16px] text-primary tabular-nums">{totalNotified}</p>
            <p className="text-[10px] text-muted-foreground">Notified</p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2">
        {[
          { id: 'all' as const, label: 'All Changes' },
          { id: 'critical' as const, label: `Critical (${totalHigh})` },
          { id: 'notified' as const, label: `Notified (${totalNotified})` },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
              filter === id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-muted-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grouped Log Entries */}
      {Object.entries(grouped).map(([date, logs]) => (
        <div key={date}>
          {/* Date Header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider px-2">{date}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Entries */}
          <div className="space-y-2">
            {logs.map((log) => {
              const FieldIcon = FIELD_ICONS[log.field] || FileText;
              const impact = IMPACT_STYLES[log.impactLevel];
              const role = ROLE_STYLES[log.user.role];
              const isExpanded = expandedId === log.id;
              const time = new Date(log.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <button
                  key={log.id}
                  onClick={() => setExpandedId(isExpanded ? null : log.id)}
                  className={`w-full text-left bg-card border rounded-xl p-3.5 transition-all active:scale-[0.99] ${impact.border}`}
                >
                  {/* Top row: icon + field + impact + time */}
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="size-9 bg-muted rounded-lg flex items-center justify-center">
                        <FieldIcon className="size-4 text-muted-foreground" />
                      </div>
                      <span className={`absolute -top-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-card ${impact.dot}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Field name + badges */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] text-card-foreground">{log.field}</span>
                        {log.notifiedAttendees && (
                          <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">
                            <Mail className="size-2.5" />
                            {log.attendeesNotifiedCount}
                          </span>
                        )}
                      </div>

                      {/* Who changed it */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`inline-flex items-center text-[10px] px-1.5 py-0.5 rounded ${role.bg} ${role.text}`}>
                          {log.user.initials}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{log.user.name}</span>
                        <span className="text-[10px] text-muted-foreground/60">·</span>
                        <span className="text-[10px] text-muted-foreground/60">{time}</span>
                      </div>

                      {/* Preview of change (collapsed) */}
                      {!isExpanded && (
                        <p className="text-[11px] text-muted-foreground truncate">
                          {log.oldValue} → {log.newValue}
                        </p>
                      )}

                      {/* Expanded: full diff */}
                      {isExpanded && (
                        <div className="mt-2 space-y-2">
                          <div className="bg-destructive/5 rounded-lg p-2.5">
                            <p className="text-[10px] text-destructive/60 mb-0.5">Before</p>
                            <p className="text-[12px] text-muted-foreground line-through">{log.oldValue}</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-2.5">
                            <p className="text-[10px] text-green-600/60 mb-0.5">After</p>
                            <p className="text-[12px] text-card-foreground">{log.newValue}</p>
                          </div>
                          <div className="flex items-center gap-3 pt-1">
                            <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded ${impact.bg} ${impact.border} border`}>
                              <span className={`size-1.5 rounded-full ${impact.dot}`} />
                              {impact.label} change
                            </span>
                            {log.notifiedAttendees && (
                              <span className="text-[10px] text-muted-foreground">
                                {log.attendeesNotifiedCount} attendees emailed
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <History className="size-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-[13px] text-muted-foreground">No changes match this filter</p>
          <button
            onClick={() => setFilter('all')}
            className="text-[12px] text-primary mt-2"
          >
            View all changes
          </button>
        </div>
      )}

      {/* Info footer */}
      <div className="bg-muted rounded-xl p-3.5 flex items-start gap-3">
        <AlertTriangle className="size-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[12px] text-card-foreground mb-0.5">Changes are published immediately</p>
          <p className="text-[11px] text-muted-foreground">
            Any edit to a published event goes live right away. Attendees may be notified based on your notification settings.
          </p>
        </div>
      </div>
    </div>
  );
}
