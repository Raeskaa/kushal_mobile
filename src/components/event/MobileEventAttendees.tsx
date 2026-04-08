import { type MockEvent, type EventSpeaker, type EventTeamMember, type EventCustomRole } from '../../data/mockEventData';
import { useState, useMemo } from 'react';
import { toast } from "sonner@2.0.3";
import {
  Users, Search, Download, Mail, CircleCheck, Clock, XCircle, UserPlus,
  Sparkles, CheckCircle, AlertCircle, FileText, Upload,
  Mic, Shield, Crown, Headphones, Trash2, RefreshCw,
  ChevronDown, ChevronUp, MoreVertical, Ticket
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { MobileWaitlistManager } from './MobileWaitlistManager';
import { MobileRegistrationFormBuilder } from './MobileRegistrationFormBuilder';

// ─── Types ───────────────────────────────────────────────────────
interface MobileEventAttendeesProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

type SubTab = 'attendees' | 'waitlist' | 'speakers' | 'registration-form';

interface MockAttendee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'confirmed' | 'waitlist' | 'applied' | 'cancelled' | 'checked-in';
  registeredAt: string;
  tier: string;
  checkedIn?: boolean;
  applicationStatus: 'Processed' | 'Needs Review' | 'Rejected';
  source: 'Event Page' | 'Manual Add' | 'Referral' | 'CSV Import';
  note?: string;
  application?: {
    reason: string;
    linkedin?: string;
    role?: string;
  };
}

// ─── Mock Data ───────────────────────────────────────────────────
const mockAttendees: MockAttendee[] = [
  { id: 'a1', name: 'Alex Johnson', email: 'alex@example.com', avatar: 'AJ', status: 'confirmed', registeredAt: '2026-02-15', tier: 'General', applicationStatus: 'Processed', source: 'Event Page' },
  { id: 'a2', name: 'Maria Garcia', email: 'maria@example.com', avatar: 'MG', status: 'confirmed', registeredAt: '2026-02-16', tier: 'VIP', checkedIn: true, applicationStatus: 'Processed', source: 'Referral', note: 'Already checked in on arrival' },
  { id: 'a3', name: 'James Lee', email: 'james@example.com', avatar: 'JL', status: 'waitlist', registeredAt: '2026-02-17', tier: 'General', applicationStatus: 'Needs Review', source: 'Event Page' },
  { id: 'a4', name: 'Priya Patel', email: 'priya@example.com', avatar: 'PP', status: 'confirmed', registeredAt: '2026-02-18', tier: 'General', checkedIn: true, applicationStatus: 'Processed', source: 'Manual Add' },
  { id: 'a5', name: 'Chris Brown', email: 'chris@example.com', avatar: 'CB', status: 'cancelled', registeredAt: '2026-02-14', tier: 'General', applicationStatus: 'Rejected', source: 'CSV Import', note: 'Duplicate registration removed' },
  { id: 'a6', name: 'Aisha Khan', email: 'aisha@example.com', avatar: 'AK', status: 'confirmed', registeredAt: '2026-02-19', tier: 'VIP', applicationStatus: 'Processed', source: 'Referral' },
  {
    id: 'a7', name: 'Tom Wilson', email: 'tom@example.com', avatar: 'TW', status: 'applied', registeredAt: '2026-02-19', tier: 'General',
    applicationStatus: 'Needs Review', source: 'Event Page',
    application: { reason: 'I am very interested in learning more about this topic to apply it in my current role.', linkedin: 'https://linkedin.com/in/tomwilson', role: 'Developer' },
  },
  { id: 'a8', name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED', status: 'confirmed', registeredAt: '2026-02-20', tier: 'General', checkedIn: true, applicationStatus: 'Processed', source: 'Event Page' },
  {
    id: 'a9', name: 'Ryan Kim', email: 'ryan@example.com', avatar: 'RK', status: 'applied', registeredAt: '2026-02-20', tier: 'General',
    applicationStatus: 'Needs Review', source: 'Event Page',
    application: { reason: 'Looking to connect with industry leaders and expand my network in this space.', linkedin: 'https://linkedin.com/in/ryankim', role: 'Product Manager' },
  },
  { id: 'a10', name: 'Sarah Miller', email: 'sarah@example.com', avatar: 'SM', status: 'waitlist', registeredAt: '2026-02-21', tier: 'General', applicationStatus: 'Needs Review', source: 'Event Page' },
];

const seedAttendees = (event: MockEvent) => {
  if (event.attendeeCount <= 0) return [];

  if (event.attendeeCount <= 2) {
    return [
      {
        ...mockAttendees[0],
        status: 'confirmed',
        checkedIn: false,
        applicationStatus: 'Processed',
      },
      {
        ...mockAttendees[1],
        status: 'confirmed',
        checkedIn: false,
        applicationStatus: 'Processed',
      },
    ];
  }

  return mockAttendees.filter((attendee) => attendee.status !== 'waitlist');
};

const getApplicationLabel = (attendee: MockAttendee) => {
  if (attendee.status === 'applied') return 'Awaiting Review';
  if (attendee.status === 'cancelled') return 'Rejected';
  return attendee.applicationStatus;
};

const getEntryMethodLabel = (attendee: MockAttendee) => {
  if (attendee.status === 'applied' || attendee.application?.reason) return 'Direct application';
  if (attendee.source === 'Referral') return 'Invited';
  if (attendee.source === 'Manual Add') return 'Added by admin';
  if (attendee.source === 'CSV Import') return 'Imported';
  return 'Direct signup';
};

const getDecisionLabel = (attendee: MockAttendee) => {
  if (attendee.checkedIn) return 'Checked in';
  if (attendee.status === 'applied') return 'Needs review';
  if (attendee.status === 'confirmed') return 'Approved';
  if (attendee.status === 'cancelled') return 'Rejected';
  if (attendee.status === 'waitlist') return 'Waitlist';
  return 'Registered';
};

const getDecisionBadgeClasses = (attendee: MockAttendee) => {
  if (attendee.checkedIn) return 'border-primary/20 bg-primary/10 text-primary';
  if (attendee.status === 'applied') return 'border-amber-200 bg-amber-50 text-amber-700';
  if (attendee.status === 'confirmed') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (attendee.status === 'cancelled') return 'border-rose-200 bg-rose-50 text-rose-700';
  return 'border-border bg-muted text-muted-foreground';
};

const getCardToneClasses = (attendee: MockAttendee) => {
  if (attendee.status === 'applied') return 'border-amber-200/80 bg-amber-50/30';
  if (attendee.status === 'cancelled') return 'border-rose-200/80 bg-rose-50/20';
  return 'border-border bg-card';
};

function ApplicationStatusBadge({ attendee }: { attendee: MockAttendee }) {
  const label = getApplicationLabel(attendee);
  const className =
    label === 'Processed'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : label === 'Awaiting Review' || label === 'Needs Review'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-rose-200 bg-rose-50 text-rose-700';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] ${className}`}>
      {label}
    </span>
  );
}

const LEAPSPACE_USERS = [
  { id: 'lu1', name: 'Priya Sharma', email: 'priya@leapspace.ai' },
  { id: 'lu2', name: 'Alex Rivera', email: 'alex.r@leapspace.ai' },
  { id: 'lu3', name: 'Jordan Kim', email: 'jordan.k@leapspace.ai' },
  { id: 'lu4', name: 'Sam Okafor', email: 'sam.o@leapspace.ai' },
  { id: 'lu5', name: 'Maya Chen', email: 'maya.c@leapspace.ai' },
  { id: 'lu6', name: 'Diego Fernandez', email: 'diego.f@leapspace.ai' },
];

// ─── Role / Status Config ────────────────────────────────────────
type TeamRole = 'Speaker' | 'Co-host' | 'Moderator' | 'Tech Support' | 'Panelist' | 'Host' | 'Speaker Manager' | 'Support';

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Mic; colors: string }> = {
  Speaker: { label: 'Speaker', icon: Mic, colors: 'bg-primary/10 text-primary border-primary/20' },
  Host: { label: 'Host', icon: Crown, colors: 'bg-primary/10 text-primary border-primary/20' },
  'Co-host': { label: 'Co-host', icon: Crown, colors: 'bg-primary/10 text-primary border-primary/20' },
  Moderator: { label: 'Moderator', icon: Shield, colors: 'bg-secondary text-secondary-foreground border-border' },
  'Speaker Manager': { label: 'Speaker Mgr', icon: Headphones, colors: 'bg-secondary text-secondary-foreground border-border' },
  'Tech Support': { label: 'Tech Support', icon: Headphones, colors: 'bg-secondary text-secondary-foreground border-border' },
  Support: { label: 'Support', icon: Users, colors: 'bg-muted text-muted-foreground border-border' },
  Panelist: { label: 'Panelist', icon: Mic, colors: 'bg-primary/10 text-primary border-primary/20' },
};

const getInitials = (name: string) =>
  name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

// ─── Attendee Status Badge ──────────────────────────────────────
function AttendeeStatusBadge({ status, checkedIn }: { status: string; checkedIn?: boolean }) {
  if (checkedIn) {
    return (
      <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 gap-1">
        <CheckCircle className="size-3" /> Checked In
      </Badge>
    );
  }
  switch (status) {
    case 'confirmed':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 gap-1">
          <CircleCheck className="size-3" /> Confirmed
        </Badge>
      );
    case 'waitlist':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border gap-1">
          <Clock className="size-3" /> Waitlist
        </Badge>
      );
    case 'applied':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border gap-1">
          <AlertCircle className="size-3" /> Applied
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 gap-1">
          <XCircle className="size-3" /> Cancelled
        </Badge>
      );
    default:
      return null;
  }
}

// ─── Team Status Badge ──────────────────────────────────────────
function TeamStatusBadge({ status }: { status?: string }) {
  switch (status) {
    case 'confirmed': case 'active': case 'accepted':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 gap-1">
          <CheckCircle className="size-3" /> Accepted
        </Badge>
      );
    case 'pending': case 'invited':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border gap-1">
          <Clock className="size-3" /> Invited
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20 gap-1">
          <XCircle className="size-3" /> Declined
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-[10px] px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 gap-1">
          <CheckCircle className="size-3" /> Active
        </Badge>
      );
  }
}

// ═══════════════════════════════════════════════════════════════════
// ═══ MAIN COMPONENT ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
export function MobileEventAttendees({ event, onOpenLeapy }: MobileEventAttendeesProps) {
  const [subTab, setSubTab] = useState<SubTab>('attendees');
  const isCreatorView = event.userRole === 'creator' || event.userRole === 'moderator';
  const tabs = isCreatorView
    ? [
        { id: 'attendees' as SubTab, label: 'Attendees' },
        { id: 'waitlist' as SubTab, label: 'Waitlist' },
        { id: 'speakers' as SubTab, label: 'Speakers & Team' },
        { id: 'registration-form' as SubTab, label: 'Registration Form' },
      ]
    : [
        { id: 'attendees' as SubTab, label: 'Attendees' },
        { id: 'speakers' as SubTab, label: 'Speakers & Team' },
      ];

  return (
    <div className="flex flex-col">
      <div className="px-4 pt-3 pb-1">
        <div className="overflow-x-auto">
          <div className="inline-flex min-w-full gap-1 rounded-[24px] border border-border bg-muted/60 p-1">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSubTab(id)}
                className={`rounded-[18px] px-4 py-2.5 text-[13px] whitespace-nowrap transition-all ${
                  subTab === id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {subTab === 'attendees' && (
        <AttendeesTab event={event} onOpenLeapy={onOpenLeapy} isCreatorView={isCreatorView} />
      )}
      {subTab === 'waitlist' && isCreatorView && (
        <WaitlistTab event={event} onOpenLeapy={onOpenLeapy} />
      )}
      {subTab === 'speakers' && (
        <SpeakersTeamTab event={event} onOpenLeapy={onOpenLeapy} />
      )}
      {subTab === 'registration-form' && isCreatorView && (
        <RegistrationFormTab event={event} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ═══ ATTENDEES TAB ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
function AttendeesTab({ event, onOpenLeapy, isCreatorView }: MobileEventAttendeesProps & { isCreatorView: boolean }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState<MockAttendee[]>(() => seedAttendees(event));
  const [expandedAttendeeIds, setExpandedAttendeeIds] = useState<string[]>([]);

  const attendeeRows = attendees.filter((attendee) => attendee.status !== 'waitlist');
  const approvedCount = attendeeRows.filter((attendee) => attendee.status === 'confirmed' || attendee.checkedIn).length;
  const pendingReviewCount = attendeeRows.filter((attendee) => attendee.status === 'applied').length;
  const rejectedCount = attendeeRows.filter((attendee) => attendee.status === 'cancelled').length;
  const displayedCapacity = event.capacity ?? 100;
  const filters = [
    { id: 'all', label: 'All', count: attendeeRows.length },
    { id: 'pending-review', label: 'Pending Review', count: pendingReviewCount },
    { id: 'approved', label: 'Approved', count: approvedCount },
    { id: 'rejected', label: 'Rejected', count: rejectedCount },
  ];

  const filteredAttendees = attendeeRows
    .filter((attendee) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'pending-review') return attendee.status === 'applied';
      if (activeFilter === 'approved') return attendee.status === 'confirmed' || attendee.checkedIn;
      return attendee.status === 'cancelled';
    })
    .filter(a => !searchQuery || a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.email.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleApprove = (id: string) => {
    setAttendees(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmed' as const, checkedIn: false, applicationStatus: 'Processed' as const } : a));
    toast.success('Attendee approved');
  };

  const handleReject = (id: string) => {
    setAttendees(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' as const, checkedIn: false, applicationStatus: 'Rejected' as const } : a));
    toast.success('Attendee rejected');
  };

  const handleAddApplicant = () => {
    const newId = `a${Date.now()}`;
    setAttendees(prev => [{
      id: newId,
      name: 'New Applicant',
      email: 'applicant@example.com',
      avatar: 'NA',
      status: 'confirmed' as const,
      registeredAt: new Date().toISOString().split('T')[0],
      tier: 'General',
      applicationStatus: 'Processed' as const,
      source: 'Manual Add' as const,
      note: 'Added by organizer from creator view',
      application: { reason: 'I am very interested in learning more about this topic.', role: 'Developer' },
    }, ...prev]);
    toast.success('Attendee added');
  };

  const handleExport = () => {
    const csv = ['Name,Email,Status,Tier,Checked In']
      .concat(attendees.map(a => `${a.name},${a.email},${a.status},${a.tier},${a.checkedIn ? 'Yes' : 'No'}`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'attendees.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  const handleRowAction = (action: string, attendee: MockAttendee) => {
    if (action === 'message') {
      leapy('message_individual');
      return;
    }
    if (action === 'ticket') {
      toast.success(`Ticket resent to ${attendee.email}`);
      return;
    }
    if (action === 'approve') {
      handleApprove(attendee.id);
      return;
    }
    if (action === 'reject') {
      handleReject(attendee.id);
      return;
    }
    if (action === 'checkin') {
      setAttendees(prev => prev.map(a => a.id === attendee.id ? { ...a, checkedIn: true } : a));
      toast.success(`${attendee.name} checked in`);
      return;
    }
    if (action === 'revoke') {
      setAttendees(prev => prev.map(a => a.id === attendee.id ? { ...a, status: 'cancelled' as const, applicationStatus: 'Rejected' as const } : a));
      toast.success(`${attendee.name} access revoked`);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedAttendeeIds((prev) =>
      prev.includes(id) ? prev.filter((currentId) => currentId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <Card className="rounded-[28px] border-border p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Attendee management</p>
            <h3 className="text-[22px] leading-7 text-foreground">Attendees</h3>
            <p className="text-[14px] text-muted-foreground">
              {approvedCount} of {displayedCapacity} confirmed, {pendingReviewCount} awaiting review
            </p>
          </div>
          <Badge variant="secondary" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">
            Registration Open
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-[20px] bg-muted/70 px-3 py-3">
            <p className="text-[11px] text-muted-foreground">Total</p>
            <p className="mt-1 text-[18px] leading-none text-foreground">{attendeeRows.length}</p>
          </div>
          <div className="rounded-[20px] bg-primary/10 px-3 py-3">
            <p className="text-[11px] text-primary/80">Approved</p>
            <p className="mt-1 text-[18px] leading-none text-foreground">{approvedCount}</p>
          </div>
          <div className="rounded-[20px] bg-amber-50 px-3 py-3">
            <p className="text-[11px] text-amber-700">Pending</p>
            <p className="mt-1 text-[18px] leading-none text-foreground">{pendingReviewCount}</p>
          </div>
        </div>

        {isCreatorView && (
          <div className="mt-4 space-y-3">
            <Button onClick={handleAddApplicant} className="h-12 w-full justify-center rounded-2xl bg-primary text-[13px] text-primary-foreground hover:bg-primary/90">
              <UserPlus className="size-4" />
              Add Attendee
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleExport} className="h-11 justify-center rounded-2xl border-border bg-card text-[13px]">
                <Download className="size-4" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => toast.success('Bulk import coming soon')} className="h-11 justify-center rounded-2xl border-border bg-card text-[13px]">
                <Upload className="size-4" />
                Bulk Import
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="rounded-[28px] border-border p-4 shadow-sm">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search attendees"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-2xl border-transparent bg-muted pl-10 text-[14px] shadow-none"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => leapy('message_attendees')} className="h-11 w-11 rounded-2xl border-border bg-card">
            <Users className="size-4.5" />
          </Button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <div className="inline-flex min-w-full gap-2 rounded-[22px] bg-muted/60 p-1">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 rounded-[18px] px-3 py-2 text-[13px] whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span>{filter.label}</span>
                  {filter.id !== 'all' && (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-card text-muted-foreground'
                    }`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {filteredAttendees.length > 0 ? (
        <div className="space-y-3">
          {filteredAttendees.map((attendee) => {
            const isExpanded = expandedAttendeeIds.includes(attendee.id);
            const needsReview = attendee.status === 'applied';
            const canCheckIn = attendee.status === 'confirmed' && event.lifecycleStage === 'live' && !attendee.checkedIn;

            return (
              <Card key={attendee.id} className={`rounded-[26px] p-4 shadow-sm ${getCardToneClasses(attendee)}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="size-11 flex-shrink-0 border border-border bg-muted">
                    <AvatarFallback className="bg-transparent text-[16px] text-foreground">
                      {attendee.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[16px] leading-5 text-foreground">{attendee.name}</p>
                        <p className="mt-1 truncate text-[13px] text-muted-foreground">{attendee.email}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleExpanded(attendee.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                          aria-label={isExpanded ? 'Collapse attendee details' : 'Expand attendee details'}
                        >
                          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 rounded-full">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRowAction('message', attendee)}>
                              <Mail className="size-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRowAction('ticket', attendee)}>
                              <Ticket className="size-4" />
                              Resend Ticket
                            </DropdownMenuItem>
                            {needsReview && (
                              <>
                                <DropdownMenuItem onClick={() => handleRowAction('approve', attendee)}>
                                  <CheckCircle className="size-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRowAction('reject', attendee)}>
                                  <XCircle className="size-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {canCheckIn && (
                              <DropdownMenuItem onClick={() => handleRowAction('checkin', attendee)}>
                                <CircleCheck className="size-4" />
                                Check In
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => handleRowAction('revoke', attendee)}>
                              <XCircle className="size-4" />
                              Revoke Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {(needsReview || canCheckIn) && (
                      <div className="mt-3 flex gap-2">
                        {needsReview && (
                          <>
                            <Button size="sm" onClick={() => handleRowAction('approve', attendee)} className="h-10 flex-1 rounded-xl bg-primary text-[12px] text-primary-foreground hover:bg-primary/90">
                              Approve request
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRowAction('reject', attendee)} className="h-10 flex-1 rounded-xl border-border bg-card text-[12px]">
                              Reject
                            </Button>
                          </>
                        )}
                        {canCheckIn && (
                          <Button size="sm" onClick={() => handleRowAction('checkin', attendee)} className="h-10 flex-1 rounded-xl bg-primary text-[12px] text-primary-foreground hover:bg-primary/90">
                            Mark as checked in
                          </Button>
                        )}
                      </div>
                    )}

                    {isExpanded && (
                      <div className="mt-3 space-y-3 rounded-[20px] border border-border bg-card px-3 py-3 text-[12px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-medium ${getDecisionBadgeClasses(attendee)}`}>
                            {getDecisionLabel(attendee)}
                          </span>
                          <ApplicationStatusBadge attendee={attendee} />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Ticket</p>
                            <p className="mt-1 text-foreground">{attendee.tier}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Entry</p>
                            <p className="mt-1 text-foreground">{getEntryMethodLabel(attendee)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Source</p>
                            <p className="mt-1 text-foreground">{attendee.source}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Joined</p>
                            <p className="mt-1 text-foreground">{attendee.registeredAt}</p>
                          </div>
                        </div>

                        <div className="space-y-2 rounded-[16px] bg-muted/45 px-3 py-3">
                          <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Why they want to join</p>
                          <p className="text-[13px] leading-5 text-foreground">
                            {attendee.application?.reason || attendee.note || 'No additional context was provided with this registration.'}
                          </p>
                          {attendee.application?.role && (
                            <p className="text-[12px] text-muted-foreground">Current role: {attendee.application.role}</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Attendance status</p>
                          <div className="mt-1"><AttendeeStatusBadge status={attendee.status} checkedIn={attendee.checkedIn} /></div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.08em] text-muted-foreground">Decision state</p>
                          <p className="mt-1 text-foreground">{getDecisionLabel(attendee)}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button size="sm" variant="outline" onClick={() => handleRowAction('message', attendee)} className="h-9 rounded-xl border-border bg-card text-[12px]">
                            <Mail className="size-3.5" />
                            Email attendee
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleRowAction('ticket', attendee)} className="h-9 rounded-xl border-border bg-card text-[12px]">
                            <Ticket className="size-3.5" />
                            Resend ticket
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-[28px] border border-border bg-card shadow-sm">
            <Users className="size-12 text-muted-foreground" />
          </div>
          <h4 className="text-[18px] text-foreground">No Attendees Yet</h4>
          <p className="mt-2 max-w-xs text-[15px] text-muted-foreground">
            Share your event with your community to start collecting registrations.
          </p>
          {isCreatorView && (
            <Button variant="outline" onClick={() => leapy('message_attendees')} className="mt-5 rounded-2xl border-border">
              <Mail className="size-4" />
              Invite attendees
            </Button>
          )}
        </div>
      )}

    </div>
  );
}

function WaitlistTab({ event, onOpenLeapy }: MobileEventAttendeesProps) {
  const pendingWaitlist = (event.waitlistEntries || []).filter((entry) => entry.status === 'pending');
  const filledSpots = event.attendeeCount;
  const capacity = event.capacity ?? 100;
  const remainingSpots = Math.max(capacity - filledSpots, 0);
  const fillPercent = Math.min((filledSpots / capacity) * 100, 100);

  return (
    <div className="space-y-4 px-4 py-4">
      <Card className="rounded-[28px] border-border p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] text-foreground">Capacity & Waitlist</h3>
            <p className="mt-1 text-[15px] text-muted-foreground">{filledSpots} / {capacity} spots filled</p>
          </div>
          <Badge variant="secondary" className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700">
            Spots Available
          </Badge>
        </div>
        <div className="mt-5 h-4 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-foreground" style={{ width: `${Math.max(fillPercent, 2)}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-[13px] text-muted-foreground">
          <span>{remainingSpots} spots remaining</span>
          <span>{pendingWaitlist.length} on waitlist</span>
        </div>
      </Card>

      {pendingWaitlist.length > 0 ? (
        <Card className="rounded-[28px] border-border p-0 shadow-sm">
          <div className="border-b border-border px-4 py-4">
            <h4 className="text-[16px] text-foreground">Waitlist Queue</h4>
            <p className="mt-1 text-[13px] text-muted-foreground">Review and approve people as spots open up.</p>
          </div>
          <MobileWaitlistManager event={event} />
        </Card>
      ) : (
        <div className="flex flex-col items-center px-6 py-12 text-center">
          <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-[28px] border border-dashed border-border bg-card">
            <Clock className="size-12 text-muted-foreground" />
          </div>
          <h4 className="text-[18px] text-foreground">No one on the waitlist</h4>
          <p className="mt-2 max-w-xs text-[15px] text-muted-foreground">
            Enable waitlist to let people register when your event is full.
          </p>
          <Button
            variant="outline"
            onClick={() => onOpenLeapy?.({ type: 'manage_waitlist', entityId: event.id, entityData: event } as LeapyContext)}
            className="mt-5 rounded-2xl border-border"
          >
            <Sparkles className="size-4 text-primary" />
            Manage waitlist rules
          </Button>
        </div>
      )}
    </div>
  );
}

function RegistrationFormTab({ event }: { event: MockEvent }) {
  return (
    <div className="space-y-4 px-4 py-4">
      <div className="space-y-1">
        <h3 className="text-[18px] text-foreground">Registration Form</h3>
        <p className="text-[15px] text-muted-foreground">Review and update the attendee intake experience.</p>
      </div>

      <Card className="rounded-[28px] border-border p-0 shadow-sm">
        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-muted">
              <FileText className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[14px] text-card-foreground">Current Form Setup</p>
              <p className="text-[12px] text-muted-foreground">
                {event.completionChecklist?.hasRegistrationForm ? 'Custom fields are live for registrants' : 'Using the default name and email flow'}
              </p>
            </div>
          </div>
        </div>
        <MobileRegistrationFormBuilder event={event} />
      </Card>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ═══ SPEAKERS & TEAM TAB ═════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
function SpeakersTeamTab({ event, onOpenLeapy }: MobileEventAttendeesProps) {
  const { removeTeamMember, removeSpeaker, addSpeaker, addTeamMember, setCustomRoles } = useEventStore();
  const [roleFilter, setRoleFilter] = useState('all');
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  const speakers = event.speakers || [];
  const teamMembers = event.teamMembers || [];
  const customRoles = event.customRoles || [];

  // Unify into one list for display
  type UnifiedMember = {
    id: string;
    type: 'speaker' | 'team' | 'creator';
    name: string;
    email: string;
    avatar: string;
    role: string;
    status?: string;
    bio?: string;
    invitedAt?: string;
  };

  const unifiedMembers = useMemo((): UnifiedMember[] => {
    const members: UnifiedMember[] = [];

    // Creator always first
    members.push({
      id: 'creator',
      type: 'creator',
      name: event.creatorName,
      email: event.creatorEmail,
      avatar: event.creatorAvatar,
      role: 'Host',
      status: 'confirmed',
    });

    // Speakers
    speakers.forEach(s => {
      members.push({
        id: `spk-${s.id}`,
        type: 'speaker',
        name: s.name,
        email: s.email,
        avatar: s.avatar,
        role: s.role,
        status: s.status || 'confirmed',
        bio: s.bio,
      });
    });

    // Team members
    teamMembers.forEach(m => {
      members.push({
        id: `tm-${m.id}`,
        type: 'team',
        name: m.name,
        email: m.email,
        avatar: m.avatar,
        role: m.role,
        status: m.status || 'active',
        bio: m.bio,
      });
    });

    return members;
  }, [speakers, teamMembers, event.creatorName, event.creatorEmail, event.creatorAvatar]);

  // Role filter options with counts
  const roleFilters = useMemo(() => {
    const roleCounts: Record<string, number> = {};
    unifiedMembers.forEach(m => {
      const key = m.role;
      roleCounts[key] = (roleCounts[key] || 0) + 1;
    });

    const filters = [{ id: 'all', label: 'All', count: unifiedMembers.length }];
    // Add roles that exist
    const seen = new Set<string>();
    unifiedMembers.forEach(m => {
      if (!seen.has(m.role)) {
        seen.add(m.role);
        const config = ROLE_CONFIG[m.role];
        filters.push({
          id: m.role,
          label: config?.label || m.role,
          count: roleCounts[m.role] || 0,
        });
      }
    });
    return filters;
  }, [unifiedMembers]);

  const filteredMembers = roleFilter === 'all'
    ? unifiedMembers
    : unifiedMembers.filter(m => m.role === roleFilter);

  const acceptedCount = unifiedMembers.filter(m => ['confirmed', 'active', 'accepted'].includes(m.status || '')).length;
  const pendingCount = unifiedMembers.filter(m => ['pending', 'invited'].includes(m.status || '')).length;

  const handleRemove = (member: UnifiedMember) => {
    if (member.type === 'speaker') {
      const realId = member.id.replace('spk-', '');
      removeSpeaker(event.id, realId);
      toast.success(`${member.name} removed`);
    } else if (member.type === 'team') {
      const realId = member.id.replace('tm-', '');
      removeTeamMember(event.id, realId);
      toast.success(`${member.name} removed`);
    }
  };

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  const handleMemberAction = (action: string, member: UnifiedMember) => {
    if (action === 'message') {
      toast(`Message ${member.name}`);
      return;
    }
    if (action === 'resend') {
      toast.success(`Invite resent to ${member.email}`);
      return;
    }
    if (action === 'remove') {
      handleRemove(member);
    }
  };

  return (
    <>
      <div className="space-y-4 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] text-foreground">Speakers & Team</h3>
            <p className="text-[15px] text-muted-foreground">{acceptedCount} confirmed, {pendingCount} pending</p>
          </div>
          <Button onClick={() => setShowInviteSheet(true)} className="h-12 rounded-2xl bg-foreground px-4 text-[13px] text-background hover:bg-foreground/90">
            <UserPlus className="size-4" /> Invite
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
            <div className="bg-muted rounded-lg p-2.5 text-center">
              <div className="text-lg text-card-foreground">{unifiedMembers.length}</div>
              <div className="text-[10px] text-muted-foreground">Total</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-2.5 text-center">
              <div className="text-lg text-card-foreground">{speakers.length}</div>
              <div className="text-[10px] text-muted-foreground">Speakers</div>
            </div>
            <div className="bg-secondary rounded-lg p-2.5 text-center">
              <div className="text-lg text-card-foreground">{pendingCount}</div>
              <div className="text-[10px] text-muted-foreground">Pending</div>
            </div>
          </div>

        <div className="overflow-x-auto">
          <div className="flex gap-2 pb-1">
            {roleFilters.map((filter) => {
              const isActive = roleFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setRoleFilter(filter.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 flex items-center gap-1 ${
                    isActive
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-muted-foreground border-border'
                  }`}
                >
                  {filter.label}
                  {filter.id !== 'all' && (
                    <span className={`text-[10px] ${isActive ? 'opacity-70' : 'opacity-60'}`}>
                      {filter.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Card className="p-3.5 gap-3 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[13px] text-card-foreground">Custom Roles</p>
                <p className="text-[11px] text-muted-foreground">Create reusable roles with permission summaries</p>
              </div>
              <span className="text-[11px] text-primary">{customRoles.length} role{customRoles.length === 1 ? '' : 's'}</span>
            </div>
            {customRoles.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customRoles.map((role) => (
                  <div key={role.id} className="rounded-xl border border-border bg-card px-3 py-2">
                    <p className="text-[12px] text-card-foreground">{role.name}</p>
                    <p className="text-[10px] text-muted-foreground">{role.permissions.length} permissions</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="New custom role" />
              <Button
                onClick={() => {
                  const trimmed = newRoleName.trim();
                  if (!trimmed) return;
                  setCustomRoles(event.id, [
                    ...customRoles,
                    {
                      id: `role-${Date.now()}`,
                      name: trimmed,
                      permissions: ['edit_event', 'manage_attendees'],
                      description: 'Custom event role',
                    },
                  ]);
                  setNewRoleName('');
                  toast.success('Custom role created');
                }}
              >
                Add
              </Button>
            </div>
          </Card>

        {filteredMembers.length > 0 && (
          <Card className="overflow-hidden rounded-[28px] border-border p-0 shadow-sm">
            <div className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_44px] items-center gap-3 border-b border-border bg-muted/40 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              <span>Person</span>
              <span>Role & Status</span>
              <span className="text-right">Actions</span>
            </div>
            <div>
              {filteredMembers.map((member) => {
                const roleConfig = ROLE_CONFIG[member.role];
                const RoleIcon = roleConfig?.icon || Users;
                const isCreator = member.type === 'creator';
                const sessions = member.type === 'speaker'
                  ? event.schedule.filter((scheduleItem) => scheduleItem.speaker === member.name)
                  : [];

                return (
                  <div key={member.id} className="grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_44px] gap-3 border-b border-border px-4 py-4 last:border-b-0">
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <Avatar className="size-11 flex-shrink-0 border border-border bg-muted">
                          <AvatarFallback className="bg-transparent text-[16px] text-foreground">
                            {member.avatar || getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="truncate text-[15px] leading-5 text-foreground">{member.name}</p>
                            {isCreator && <Crown className="size-3.5 flex-shrink-0 text-primary" />}
                          </div>
                          <p className="truncate text-[12px] text-muted-foreground">{member.email}</p>
                          {member.bio && (
                            <p className="mt-1 line-clamp-2 text-[10px] text-muted-foreground">{member.bio}</p>
                          )}
                          {sessions.length > 0 && (
                            <p className="mt-1 text-[10px] text-muted-foreground">{sessions.length} assigned session{sessions.length === 1 ? '' : 's'}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="min-w-0 space-y-2">
                      <Badge variant="secondary" className={`max-w-full gap-1 truncate text-[10px] ${roleConfig?.colors || 'bg-muted text-muted-foreground'}`}>
                        <RoleIcon className="size-3" /> {roleConfig?.label || member.role}
                      </Badge>
                      <TeamStatusBadge status={member.status} />
                      {member.invitedAt && <p className="text-[10px] text-muted-foreground">Invited {member.invitedAt}</p>}
                    </div>

                    <div className="flex justify-end">
                      {!isCreator ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-52 rounded-2xl p-2">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleMemberAction('message', member)}>
                              <Mail className="size-4" />
                              Message
                            </DropdownMenuItem>
                            {(member.status === 'pending' || member.status === 'invited') && (
                              <DropdownMenuItem onClick={() => handleMemberAction('resend', member)}>
                                <RefreshCw className="size-4" />
                                Resend Invite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive" onClick={() => handleMemberAction('remove', member)}>
                              <Trash2 className="size-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60">
                          <Crown className="size-4 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No team members in this filter</p>
            <Button variant="outline" size="sm" onClick={() => setShowInviteSheet(true)} className="mt-3 border-border">
              <UserPlus className="size-3.5 mr-1.5" /> Invite Someone
            </Button>
          </div>
        )}

        <Card className="p-3.5 gap-2 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="size-3.5 text-primary" />
              <h3 className="text-[13px] text-card-foreground">AI Team Actions</h3>
            </div>
            <Button variant="secondary" size="sm" onClick={() => leapy('add_speakers')} className="w-full justify-start bg-card hover:bg-accent text-xs h-8">
              <Sparkles className="size-3.5 text-primary" />
              <span className="flex-1 text-left">Find speakers for this topic</span>
            </Button>
            <Button variant="secondary" size="sm" onClick={() => leapy('compose_email')} className="w-full justify-start bg-card hover:bg-accent text-xs h-8">
              <Sparkles className="size-3.5 text-primary" />
              <span className="flex-1 text-left">Draft speaker invitation email</span>
            </Button>
          </Card>
      </div>

      {/* Invite Sheet */}
      <InviteTeamSheet
        open={showInviteSheet}
        onClose={() => setShowInviteSheet(false)}
        event={event}
        existingEmails={unifiedMembers.map(m => m.email)}
        onInviteSpeaker={(speaker) => {
          addSpeaker(event.id, speaker);
          toast.success(`Invitation sent to ${speaker.name}`);
        }}
        onInviteTeam={(member) => {
          addTeamMember(event.id, member);
          toast.success(`Invitation sent to ${member.name}`);
        }}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ═══ INVITE TEAM SHEET ═══════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
function InviteTeamSheet({
  open,
  onClose,
  event,
  existingEmails,
  onInviteSpeaker,
  onInviteTeam,
}: {
  open: boolean;
  onClose: () => void;
  event: MockEvent;
  existingEmails: string[];
  onInviteSpeaker: (speaker: EventSpeaker) => void;
  onInviteTeam: (member: EventTeamMember) => void;
}) {
  const [inviteMode, setInviteMode] = useState<'leapspace' | 'email'>('leapspace');
  const [selectedRole, setSelectedRole] = useState<string>('Speaker');
  const [searchQuery, setSearchQuery] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');

  const inviteRoles = [
    { id: 'Speaker', label: 'Speaker' },
    { id: 'Co-host', label: 'Co-host' },
    { id: 'Moderator', label: 'Moderator' },
    { id: 'Support', label: 'Support' },
  ];

  const filteredUsers = LEAPSPACE_USERS.filter(u =>
    !existingEmails.includes(u.email) &&
    (u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInviteUser = (user: { id: string; name: string; email: string }) => {
    const initials = getInitials(user.name);
    if (selectedRole === 'Speaker' || selectedRole === 'Panelist') {
      onInviteSpeaker({
        id: `spk-${Date.now()}`,
        name: user.name,
        email: user.email,
        role: selectedRole as EventSpeaker['role'],
        avatar: initials,
        status: 'pending',
      });
    } else {
      onInviteTeam({
        id: `tm-${Date.now()}`,
        name: user.name,
        email: user.email,
        role: selectedRole as EventTeamMember['role'],
        avatar: initials,
        status: 'pending',
      });
    }
    onClose();
    resetForm();
  };

  const handleInviteByEmail = () => {
    if (!emailAddress) return;
    const name = emailName || emailAddress.split('@')[0];
    handleInviteUser({ id: `email-${Date.now()}`, name, email: emailAddress });
  };

  const resetForm = () => {
    setSearchQuery('');
    setEmailName('');
    setEmailAddress('');
    setSelectedRole('Speaker');
    setInviteMode('leapspace');
  };

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) { onClose(); resetForm(); } }}>
      <SheetContent side="bottom" className="h-[75vh] rounded-t-3xl p-0 flex flex-col" aria-describedby={undefined}>
        <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <SheetTitle className="text-[17px]">Invite Team Member</SheetTitle>
          <p className="text-[11px] text-muted-foreground">Search your LeapSpace contacts or invite by email.</p>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Mode switcher */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setInviteMode('leapspace')}
              className={`flex-1 px-4 py-2 text-[13px] transition-colors ${
                inviteMode === 'leapspace'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              LeapSpace Users
            </button>
            <button
              onClick={() => setInviteMode('email')}
              className={`flex-1 px-4 py-2 text-[13px] border-l border-border transition-colors ${
                inviteMode === 'email'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground'
              }`}
            >
              Invite by Email
            </button>
          </div>

          {/* Role selector */}
          <div>
            <label className="text-[12px] text-muted-foreground mb-2 block">Role</label>
            <div className="flex gap-2 flex-wrap">
              {inviteRoles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`px-3 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* LeapSpace mode */}
          {inviteMode === 'leapspace' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="border border-border rounded-lg overflow-hidden divide-y divide-border max-h-[280px] overflow-y-auto">
                {filteredUsers.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No users found</p>
                    <button
                      onClick={() => setInviteMode('email')}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Try inviting by email instead
                    </button>
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Avatar className="size-8 flex-shrink-0">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary border border-primary/10">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground truncate">{user.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInviteUser(user)}
                        className="h-7 text-xs border-primary/20 text-primary flex-shrink-0 ml-2"
                      >
                        Invite
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Email mode */}
          {inviteMode === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="text-[12px] text-muted-foreground mb-1.5 block">Full Name</label>
                <Input
                  value={emailName}
                  onChange={(e) => setEmailName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                />
              </div>
              <div>
                <label className="text-[12px] text-muted-foreground mb-1.5 block">Email Address</label>
                <Input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="e.g. alex@example.com"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {inviteMode === 'email' && (
          <div className="px-4 py-4 border-t border-border bg-card flex-shrink-0 flex gap-2">
            <Button variant="outline" onClick={() => { onClose(); resetForm(); }} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleInviteByEmail}
              disabled={!emailAddress}
              className="flex-1 bg-primary text-primary-foreground"
            >
              <Mail className="size-3.5 mr-1.5" /> Send Invitation
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
