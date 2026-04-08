import {
  Rocket, AlertCircle, CheckCircle, XCircle, Clock, Users, Play
} from 'lucide-react';
import { type MockEvent, getChecklistProgress, getMissingChecklistItems, getLifecycleBannerType, isEventSoldOut, getEventWaitlistCount } from '../../data/mockEventData';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

interface MobileEventStatusBannerProps {
  event: MockEvent;
  onPublish?: () => void;
  onJoinRoom?: () => void;
  onEndEvent?: () => void;
  onClone?: () => void;
  onDelete?: () => void;
  onIncreaseCapacity?: () => void;
  onManageWaitlist?: () => void;
}

export function MobileEventStatusBanner({ event, onPublish, onJoinRoom, onEndEvent, onClone, onDelete, onIncreaseCapacity, onManageWaitlist }: MobileEventStatusBannerProps) {
  const bannerType = getLifecycleBannerType(event);
  if (bannerType === 'none') return null;

  const checklistProgress = getChecklistProgress(event.completionChecklist);
  const progressPercent = checklistProgress.total > 0 ? Math.round((checklistProgress.done / checklistProgress.total) * 100) : 0;
  const missingItems = getMissingChecklistItems(event.completionChecklist);

  switch (bannerType) {
    case 'skeleton':
      return (
        <div className="mx-4 mt-2 bg-muted border border-border rounded-xl p-3 flex items-center gap-3">
          <Rocket className="size-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-card-foreground">Getting Started</p>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={progressPercent} className="h-1.5 flex-1" />
              <span className="text-[10px] text-muted-foreground">{checklistProgress.done}/{checklistProgress.total}</span>
            </div>
          </div>
        </div>
      );

    case 'building':
      return (
        <div className="mx-4 mt-2 bg-secondary border border-border rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-4 text-secondary-foreground flex-shrink-0" />
            <p className="text-xs text-foreground">Issues to resolve</p>
            <span className="text-[10px] text-secondary-foreground ml-auto">{progressPercent}% complete</span>
          </div>
          {missingItems.length > 0 && (
            <p className="text-[10px] text-secondary-foreground pl-6">
              Missing: {missingItems.slice(0, 3).join(', ')}{missingItems.length > 3 ? ` +${missingItems.length - 3} more` : ''}
            </p>
          )}
          <Progress value={progressPercent} className="h-1.5" />
        </div>
      );

    case 'ready':
      return (
        <div className="mx-4 mt-2 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <CheckCircle className="size-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary">All set — your event is ready to publish</p>
          </div>
          <Button size="sm" onClick={onPublish} className="h-7 text-xs flex-shrink-0">
            Publish
          </Button>
        </div>
      );

    case 'live':
      return (
        <div className="mx-4 mt-2 bg-destructive/5 border border-destructive/20 rounded-xl p-3 flex items-center gap-3">
          <span className="relative flex size-2.5 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2.5 bg-destructive"></span>
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-destructive">LIVE NOW · {event.liveAttendeeCount || 0} watching</p>
            <p className="text-[10px] text-destructive/70">Started at {event.time}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onJoinRoom} className="h-7 text-xs border-destructive text-destructive flex-shrink-0">
            <Play className="size-3" /> Enter
          </Button>
        </div>
      );

    case 'ended':
      return (
        <div className="mx-4 mt-2 bg-muted border border-border rounded-xl p-3 flex items-center gap-3">
          <Clock className="size-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-card-foreground">Event ended</p>
            <p className="text-[10px] text-muted-foreground">{Math.round(event.attendeeCount * 0.85)} attended · {event.attendeeCount} registered</p>
          </div>
        </div>
      );

    case 'cancelled':
      return (
        <div className="mx-4 mt-2 bg-muted border border-border rounded-xl p-3 flex items-center gap-3">
          <XCircle className="size-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-card-foreground">Cancelled</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={onClone} className="h-7 text-xs">
              Clone
            </Button>
          </div>
        </div>
      );

    case 'sold-out':
      return (
        <div className="mx-4 mt-2 bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center gap-3">
          <Users className="size-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-card-foreground">At capacity</p>
            <p className="text-[10px] text-muted-foreground">{event.attendeeCount}/{event.capacity} · {getEventWaitlistCount(event)} on waitlist</p>
          </div>
          <div className="flex gap-1.5 flex-shrink-0">
            <Button size="sm" variant="outline" onClick={onIncreaseCapacity} className="h-7 text-xs">
              + Capacity
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
}