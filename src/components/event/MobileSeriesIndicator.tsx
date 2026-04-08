import { Repeat, ChevronLeft, ChevronRight, Calendar, Users, TrendingUp, BarChart3, Flame } from 'lucide-react';
import { type MockEvent, getSeriesOccurrences, getOccurrenceNumber, getSeriesTotal, getSeriesStats, getLearnerSeriesAttendance } from '../../data/mockEventData';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { toast } from "sonner@2.0.3";

interface MobileSeriesIndicatorProps {
  event: MockEvent;
  /** Navigate to a sibling occurrence */
  onNavigateOccurrence?: (eventId: string) => void;
  /** Whether to show the full series card or just an inline badge */
  variant?: 'badge' | 'card' | 'admin-card' | 'learner-card';
}

export function MobileSeriesIndicator({ event, onNavigateOccurrence, variant = 'badge' }: MobileSeriesIndicatorProps) {
  if (!event.isRecurring || !event.seriesId) return null;

  const occurrences = getSeriesOccurrences(event.seriesId);
  const currentIdx = occurrences.findIndex(e => e.id === event.id);
  const occurrenceNum = getOccurrenceNumber(event);
  const seriesTotal = getSeriesTotal(event);
  const stats = getSeriesStats(event.seriesId);

  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < occurrences.length - 1;

  const prevEvent = hasPrev ? occurrences[currentIdx - 1] : null;
  const nextEvent = hasNext ? occurrences[currentIdx + 1] : null;

  // ─── Inline Badge ───
  if (variant === 'badge') {
    return (
      <Badge variant="outline" className="text-[10px] text-primary border-primary/30 gap-1">
        <Repeat className="size-2.5" />
        Session {occurrenceNum} of {seriesTotal}
      </Badge>
    );
  }

  // ─── Occurrence Navigation Card ───
  if (variant === 'card') {
    return (
      <Card className="p-3 gap-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-7 bg-primary/10 rounded-lg flex items-center justify-center">
              <Repeat className="size-3.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-card-foreground">Recurring Series</p>
              <p className="text-[10px] text-muted-foreground">{stats.recurrenceLabel}</p>
            </div>
          </div>
          <Badge className="text-[10px]">{occurrenceNum}/{seriesTotal}</Badge>
        </div>

        {/* Occurrence navigator */}
        <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-border">
          <button
            onClick={() => prevEvent && onNavigateOccurrence?.(prevEvent.id)}
            disabled={!hasPrev}
            className={`size-7 rounded-lg flex items-center justify-center border transition-all ${
              hasPrev ? 'border-border active:bg-muted' : 'border-transparent opacity-30'
            }`}
          >
            <ChevronLeft className="size-3.5 text-muted-foreground" />
          </button>

          {/* Occurrence dots */}
          <div className="flex-1 flex items-center justify-center gap-1">
            {occurrences.map((occ, idx) => {
              const num = getOccurrenceNumber(occ);
              const isCurrent = occ.id === event.id;
              const isEnded = occ.lifecycleStage === 'ended';
              return (
                <button
                  key={occ.id}
                  onClick={() => onNavigateOccurrence?.(occ.id)}
                  className={`relative transition-all ${isCurrent ? 'z-10' : ''}`}
                  title={`Session ${num} — ${occ.date}`}
                >
                  <div className={`rounded-full transition-all ${
                    isCurrent
                      ? 'size-5 bg-primary text-white flex items-center justify-center'
                      : isEnded
                        ? 'size-2.5 bg-primary/40'
                        : 'size-2.5 bg-muted-foreground/20'
                  }`}>
                    {isCurrent && <span className="text-[8px]">{num}</span>}
                  </div>
                </button>
              );
            })}
            {/* Placeholder dots for future unseen occurrences */}
            {seriesTotal > occurrences.length + (getOccurrenceNumber(occurrences[0]) - 1) && (
              <>
                <div className="size-1 bg-muted-foreground/15 rounded-full" />
                <div className="size-1 bg-muted-foreground/15 rounded-full" />
              </>
            )}
          </div>

          <button
            onClick={() => nextEvent && onNavigateOccurrence?.(nextEvent.id)}
            disabled={!hasNext}
            className={`size-7 rounded-lg flex items-center justify-center border transition-all ${
              hasNext ? 'border-border active:bg-muted' : 'border-transparent opacity-30'
            }`}
          >
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </Card>
    );
  }

  // ─── Admin Series Stats Card ───
  if (variant === 'admin-card') {
    return (
      <Card className="p-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Repeat className="size-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-card-foreground">Series Overview</p>
            <p className="text-[10px] text-muted-foreground">{stats.recurrenceLabel} · {stats.totalOccurrences} total sessions</p>
          </div>
          <Badge className="text-[10px]">{occurrenceNum}/{seriesTotal}</Badge>
        </div>

        {/* Series progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Series progress</span>
            <span>{stats.completedOccurrences} completed, {stats.upcomingOccurrences} upcoming</span>
          </div>
          <Progress value={(stats.completedOccurrences / stats.totalOccurrences) * 100} className="h-1.5" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-muted rounded-lg p-2 text-center">
            <Users className="size-3.5 text-primary mx-auto mb-0.5" />
            <p className="text-sm text-card-foreground">{stats.totalAttendees}</p>
            <p className="text-[9px] text-muted-foreground">Total RSVPs</p>
          </div>
          <div className="bg-muted rounded-lg p-2 text-center">
            <TrendingUp className="size-3.5 text-green-500 mx-auto mb-0.5" />
            <p className="text-sm text-card-foreground">{stats.avgAttendance}</p>
            <p className="text-[9px] text-muted-foreground">Avg/Session</p>
          </div>
          <div className="bg-muted rounded-lg p-2 text-center">
            <BarChart3 className="size-3.5 text-blue-500 mx-auto mb-0.5" />
            <p className="text-sm text-card-foreground">{stats.peakAttendance}</p>
            <p className="text-[9px] text-muted-foreground">Peak</p>
          </div>
        </div>

        {/* Occurrence navigator */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          <button
            onClick={() => prevEvent && onNavigateOccurrence?.(prevEvent.id)}
            disabled={!hasPrev}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all ${
              hasPrev ? 'text-primary active:bg-primary/10' : 'text-muted-foreground/30'
            }`}
          >
            <ChevronLeft className="size-3" />
            {prevEvent && <span>#{getOccurrenceNumber(prevEvent)}</span>}
          </button>

          <div className="flex-1 flex items-center justify-center gap-1">
            {occurrences.map((occ) => {
              const isCurrent = occ.id === event.id;
              const isEnded = occ.lifecycleStage === 'ended';
              return (
                <button
                  key={occ.id}
                  onClick={() => onNavigateOccurrence?.(occ.id)}
                  className="relative"
                >
                  <div className={`rounded-full transition-all ${
                    isCurrent
                      ? 'size-3 bg-primary ring-2 ring-primary/20'
                      : isEnded
                        ? 'size-2 bg-primary/40'
                        : 'size-2 bg-muted-foreground/20'
                  }`} />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => nextEvent && onNavigateOccurrence?.(nextEvent.id)}
            disabled={!hasNext}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all ${
              hasNext ? 'text-primary active:bg-primary/10' : 'text-muted-foreground/30'
            }`}
          >
            {nextEvent && <span>#{getOccurrenceNumber(nextEvent)}</span>}
            <ChevronRight className="size-3" />
          </button>
        </div>

        {/* All occurrences list */}
        <div className="space-y-1.5">
          {occurrences.map((occ) => {
            const num = getOccurrenceNumber(occ);
            const isCurrent = occ.id === event.id;
            const isEnded = occ.lifecycleStage === 'ended';
            return (
              <button
                key={occ.id}
                onClick={() => onNavigateOccurrence?.(occ.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  isCurrent ? 'bg-primary/10 border border-primary/20' : 'active:bg-muted'
                }`}
              >
                <div className={`size-6 rounded-full flex items-center justify-center text-[10px] ${
                  isCurrent ? 'bg-primary text-white' : isEnded ? 'bg-muted text-muted-foreground' : 'bg-muted text-card-foreground'
                }`}>
                  {num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                    {occ.date}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{occ.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{occ.attendeeCount} RSVPs</p>
                  <Badge variant={isEnded ? 'secondary' : isCurrent ? 'default' : 'outline'} className="text-[9px] mt-0.5">
                    {isEnded ? 'Ended' : isCurrent ? 'Current' : 'Upcoming'}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  // ─── Learner Series Card ───
  if (variant === 'learner-card') {
    const attendance = getLearnerSeriesAttendance(event.seriesId);
    const streakCount = attendance.attended; // simplified streak

    return (
      <Card className="p-4 gap-3">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Repeat className="size-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-card-foreground">Recurring Series</p>
            <p className="text-[10px] text-muted-foreground">{stats.recurrenceLabel}</p>
          </div>
        </div>

        {/* Attendance streak */}
        {attendance.attended > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 rounded-lg px-3 py-2">
            <Flame className="size-4 text-amber-500" />
            <div className="flex-1">
              <p className="text-xs text-amber-800">{streakCount} session streak!</p>
              <p className="text-[10px] text-amber-600">You've attended {attendance.attended} of {attendance.total} past sessions</p>
            </div>
          </div>
        )}

        {/* Upcoming occurrences picker */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground">All sessions in this series</p>
          {occurrences.map((occ) => {
            const num = getOccurrenceNumber(occ);
            const isCurrent = occ.id === event.id;
            const isEnded = occ.lifecycleStage === 'ended';
            const isRegistered = !!occ.userRegistration;

            return (
              <button
                key={occ.id}
                onClick={() => onNavigateOccurrence?.(occ.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                  isCurrent ? 'bg-primary/10 border border-primary/20' : 'active:bg-muted'
                }`}
              >
                <div className={`size-6 rounded-full flex items-center justify-center text-[10px] ${
                  isEnded
                    ? isRegistered ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    : isCurrent ? 'bg-primary text-white' : 'bg-muted text-card-foreground'
                }`}>
                  {isEnded && isRegistered ? '✓' : num}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${isCurrent ? 'text-primary' : 'text-card-foreground'}`}>
                    Session {num} — {occ.date}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{occ.time}</p>
                </div>
                {isRegistered && !isEnded && (
                  <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary">Registered</Badge>
                )}
                {isEnded && (
                  <Badge variant="secondary" className="text-[9px]">
                    {isRegistered ? 'Attended' : 'Missed'}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Series progress */}
        <div className="space-y-1 pt-2 border-t border-border">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Series progress</span>
            <span>{stats.completedOccurrences} of {stats.totalOccurrences} sessions</span>
          </div>
          <Progress value={(stats.completedOccurrences / stats.totalOccurrences) * 100} className="h-1.5" />
        </div>
      </Card>
    );
  }

  return null;
}