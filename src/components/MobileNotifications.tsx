import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  MessageSquare,
  Ticket,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface MobileNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

type NotificationTone = 'default' | 'social' | 'urgent' | 'success' | 'summary';
type NotificationRole = 'Attending' | 'Hosting' | 'Speaking';
type NotificationFilter = 'all' | 'unread' | 'hosting' | 'attending';
type NotificationKind = 'invite' | 'request' | 'confirmation' | 'update' | 'reminder' | 'social' | 'critical' | 'summary';

interface NotificationAction {
  label: string;
  variant?: 'primary' | 'secondary';
}

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  icon: LucideIcon;
  role: NotificationRole;
  tone: NotificationTone;
  kind: NotificationKind;
  meta?: string;
  actions?: NotificationAction[];
  statusLabel?: string;
  actor?: {
    initials: string;
  };
  media?: {
    label: string;
    tone?: 'primary' | 'neutral' | 'urgent' | 'success';
  };
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'You are invited to AI Summit',
    desc: 'Amit selected 1 Pro Pass for you',
    time: '2m ago',
    read: false,
    icon: Ticket,
    role: 'Attending',
    tone: 'default',
    kind: 'invite',
    meta: 'Tue, 7:00 PM • Pro Pass',
    actions: [
      { label: 'Review invite', variant: 'primary' },
      { label: 'Decline', variant: 'secondary' },
    ],
    media: { label: 'AI', tone: 'primary' },
  },
  {
    id: '2',
    title: 'New join request',
    desc: 'Leo wants to join Product Leaders Roundtable',
    time: '8m ago',
    read: false,
    icon: UserPlus,
    role: 'Hosting',
    tone: 'social',
    kind: 'request',
    meta: 'Private event',
    actions: [
      { label: 'Review', variant: 'primary' },
      { label: 'Dismiss', variant: 'secondary' },
    ],
    actor: {
      initials: 'LE',
    },
  },
  {
    id: '3',
    title: 'Registration confirmed',
    desc: 'Your seat for React Summit 2026 is booked',
    time: '21m ago',
    read: false,
    icon: Calendar,
    role: 'Attending',
    tone: 'success',
    kind: 'confirmation',
    meta: 'Online event',
    media: { label: 'RS', tone: 'success' },
  },
  {
    id: '4',
    title: 'Event details changed',
    desc: 'Design Sprint now starts at 6:30 PM',
    time: '47m ago',
    read: false,
    icon: Calendar,
    role: 'Attending',
    tone: 'default',
    kind: 'update',
    meta: 'Today',
  },
  {
    id: '5',
    title: 'Starting in 1 hour',
    desc: 'Community Builders opens at 6:00 PM',
    time: '1h ago',
    read: true,
    icon: Clock3,
    role: 'Hosting',
    tone: 'default',
    kind: 'reminder',
    meta: 'Host tools ready',
    actions: [{ label: 'Open host tools', variant: 'primary' }],
    media: { label: 'CB', tone: 'primary' },
  },
  {
    id: '6',
    title: 'Riya asked a question',
    desc: 'Will the workshop recording be shared later?',
    time: '2h ago',
    read: true,
    icon: MessageSquare,
    role: 'Hosting',
    tone: 'social',
    kind: 'social',
    meta: 'Growth Sprint',
    actor: {
      initials: 'RI',
    },
  },
  {
    id: '7',
    title: 'Payment failed',
    desc: 'Complete payment to keep your seat for UX Bootcamp',
    time: '3h ago',
    read: true,
    icon: CircleAlert,
    role: 'Attending',
    tone: 'urgent',
    kind: 'critical',
    meta: 'Seat reserved for 10m',
    statusLabel: 'Needs action',
    actions: [
      { label: 'Retry payment', variant: 'primary' },
      { label: 'Support', variant: 'secondary' },
    ],
    media: { label: 'Pay', tone: 'urgent' },
  },
  {
    id: '8',
    title: 'Event cancelled',
    desc: 'Growth Workshop has been cancelled by the host',
    time: '5h ago',
    read: true,
    icon: CircleAlert,
    role: 'Attending',
    tone: 'urgent',
    kind: 'critical',
    meta: 'Refund in progress',
    statusLabel: 'Cancelled',
  },
  {
    id: '9',
    title: 'Your certificate is ready',
    desc: 'Download your certificate for Data Foundations',
    time: '1d ago',
    read: true,
    icon: FileText,
    role: 'Attending',
    tone: 'summary',
    kind: 'summary',
    meta: 'Completed',
    media: { label: 'PDF', tone: 'neutral' },
  },
  {
    id: '10',
    title: 'VIP tickets sold out',
    desc: 'All VIP passes for Growth Summit are gone',
    time: '1d ago',
    read: true,
    icon: Users,
    role: 'Hosting',
    tone: 'urgent',
    kind: 'critical',
    meta: '92 attendees',
  },
];

const toneStyles: Record<NotificationTone, { iconWrap: string; iconFg: string; accent: string; rowBg: string }> = {
  default: {
    iconWrap: 'bg-primary/10',
    iconFg: 'text-primary',
    accent: 'bg-primary',
    rowBg: 'bg-card',
  },
  social: {
    iconWrap: 'bg-primary/10',
    iconFg: 'text-primary',
    accent: 'bg-primary',
    rowBg: 'bg-card',
  },
  urgent: {
    iconWrap: 'bg-destructive/10',
    iconFg: 'text-destructive',
    accent: 'bg-destructive',
    rowBg: 'bg-card',
  },
  success: {
    iconWrap: 'bg-primary/10',
    iconFg: 'text-primary',
    accent: 'bg-green-500',
    rowBg: 'bg-card',
  },
  summary: {
    iconWrap: 'bg-secondary',
    iconFg: 'text-secondary-foreground',
    accent: 'bg-muted-foreground',
    rowBg: 'bg-card',
  },
};

const mediaStyles: Record<NonNullable<NotificationItem['media']>['tone'], string> = {
  primary: 'bg-primary/10 text-primary border border-primary/15',
  neutral: 'bg-muted text-secondary-foreground border border-border',
  urgent: 'bg-destructive/10 text-destructive border border-destructive/15',
  success: 'bg-green-500/10 text-green-700 border border-green-500/15',
};

function NotificationFilterTabs({
  activeFilter,
  unreadCount,
  onChange,
}: {
  activeFilter: NotificationFilter;
  unreadCount: number;
  onChange: (value: NotificationFilter) => void;
}) {
  const filters: Array<{ id: NotificationFilter; label: string; count?: number }> = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'hosting', label: 'Hosting' },
    { id: 'attending', label: 'Attending' },
  ];

  return (
    <div className="border-b border-border bg-card px-4 py-3">
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter;

          return (
            <Button
              key={filter.id}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => onChange(filter.id)}
              className={[
                'h-8 rounded-full px-3 text-[12px] whitespace-nowrap',
                !isActive ? 'border-border bg-card text-muted-foreground hover:bg-accent' : 'bg-primary text-primary-foreground',
              ].join(' ')}
            >
              <span>{filter.label}</span>
              {typeof filter.count === 'number' && filter.count > 0 && (
                <span className={[
                  'min-w-5 rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none',
                  isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground',
                ].join(' ')}>
                  {filter.count}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function NotificationSection({ title, items }: { title: string; items: NotificationItem[] }) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="px-4 pb-2 pt-1">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{title}</p>
      </div>
      <div className="divide-y divide-border overflow-hidden border-y border-border bg-card">
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function NotificationRow({ item }: { item: NotificationItem }) {
  const hasActions = Boolean(item.actions?.length);
  const isPriorityRow = item.kind === 'invite' || item.kind === 'request' || item.kind === 'critical';
  const styles = toneStyles[item.tone];

  return (
    <div
      className={[
        styles.rowBg,
        'relative px-4 py-4',
        !item.read && isPriorityRow ? 'bg-primary/[0.03]' : '',
        item.tone === 'urgent' ? 'bg-destructive/[0.02]' : '',
      ].join(' ')}
    >
      {!item.read && <span className="absolute left-4 top-6 size-2 rounded-full bg-primary" />}

      <div className="flex items-start gap-3 pl-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[15px] leading-[1.32] text-card-foreground font-medium">{item.title}</p>
              <p className="mt-1 text-[13px] leading-[1.45] text-muted-foreground line-clamp-2">{item.desc}</p>
            </div>

            {!hasActions && <ChevronRight className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-secondary-foreground border-transparent">
              {item.role}
            </Badge>
            {item.meta && <p className="text-[12px] text-muted-foreground">{item.meta}</p>}
            {item.statusLabel && (
              <Badge
                variant="outline"
                className={[
                  'rounded-md px-2 py-0.5 text-[10px]',
                  item.tone === 'urgent'
                    ? 'border-destructive/20 bg-destructive/10 text-destructive'
                    : 'border-primary/20 bg-primary/10 text-primary',
                ].join(' ')}
              >
                {item.statusLabel}
              </Badge>
            )}
          </div>

          {item.actions && item.actions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.actions.map((action) => (
                <Button
                  key={action.label}
                  type="button"
                  size="sm"
                  variant={action.variant === 'primary' ? 'default' : 'outline'}
                  className={[
                    'h-8 rounded-xl px-3 text-[12px]',
                    action.variant === 'secondary' ? 'border-border bg-card text-card-foreground' : '',
                  ].join(' ')}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          <p className="mt-2.5 text-[12px] text-muted-foreground">{item.time}</p>
        </div>
      </div>
    </div>
  );
}

export function MobileNotifications({ isOpen, onClose }: MobileNotificationsProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');

  const unread = notifications.filter((item) => !item.read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'unread') return !item.read;
      if (activeFilter === 'hosting') return item.role === 'Hosting';
      if (activeFilter === 'attending') return item.role === 'Attending';
      return true;
    });
  }, [activeFilter, notifications]);

  const todayItems = filteredNotifications.filter((item) => !item.read);
  const earlierItems = filteredNotifications.filter((item) => item.read);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-card">
      <div className="border-b border-border bg-card px-4 pt-3 pb-3">
        <div className="flex min-w-0 items-center gap-3">
            <button onClick={onClose} className="p-1 active:scale-95 transition-all">
              <ArrowLeft className="size-5 text-card-foreground" />
            </button>
          <div className="min-w-0">
            <h1 className="text-[17px] font-medium text-card-foreground">Notifications</h1>
            <p className="mt-0.5 text-[12px] text-muted-foreground">You have {unread} unread notifications.</p>
          </div>
        </div>
      </div>

      <NotificationFilterTabs
        activeFilter={activeFilter}
        unreadCount={unread}
        onChange={setActiveFilter}
      />

      <div className="min-h-0 flex-1 overflow-y-auto bg-muted/50 py-4">
        <div className="space-y-5">
          {activeFilter === 'unread' ? (
            <NotificationSection title="Today" items={filteredNotifications} />
          ) : (
            <>
              <NotificationSection title="Today" items={todayItems} />
              <NotificationSection title="Earlier" items={earlierItems} />
            </>
          )}

          {filteredNotifications.length === 0 && (
            <div className="mx-4 rounded-2xl border border-border bg-card px-5 py-6 text-center">
              <p className="text-[14px] font-medium text-card-foreground">No notifications here</p>
              <p className="mt-1 text-[12px] text-muted-foreground">Switch filters to view other activity.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
