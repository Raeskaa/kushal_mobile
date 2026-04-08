import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Calendar, Clock, Users, Mail, AlertTriangle, Sparkles } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { type LeapyContext } from '../../../data/leapyContexts';

interface PostponeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onConfirmPostpone: (newDate: string, newTime: string, reason: string) => void;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function PostponeSheet({ isOpen, onClose, event, onConfirmPostpone, onOpenLeapy }: PostponeSheetProps) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');
  const [notifyAttendees, setNotifyAttendees] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!newDate) {
      toast.error('Please select a new date');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirmPostpone(newDate, newTime, reason);
      toast.success('Event rescheduled! Attendees have been notified.');
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Event"
      subtitle="Change the date or time of your event"
    >
      <div className="space-y-4">
        {/* Current date */}
        <div className="bg-muted rounded-lg p-3">
          <p className="text-[10px] text-muted-foreground mb-1">Current Date & Time</p>
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-muted-foreground" />
            <span className="text-sm text-card-foreground">{event.date}</span>
            <span className="text-border">·</span>
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-sm text-card-foreground">{event.time || 'TBD'}</span>
          </div>
        </div>

        {/* New date/time */}
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">New date</label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">New time</label>
            <Input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Reason (optional)</label>
          <Textarea
            placeholder="Let attendees know why you're rescheduling..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[70px] resize-none"
          />
        </div>

        {/* AI draft */}
        <Button
          variant="secondary"
          onClick={() => onOpenLeapy?.({ type: 'compose_email', entityId: event.id, entityData: event })}
          className="w-full justify-start bg-primary/5 hover:bg-primary/10"
        >
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm flex-1 text-left">Let AI write the reschedule notice</span>
        </Button>

        {/* Notify option */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notifyAttendees}
            onChange={(e) => setNotifyAttendees(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          <div>
            <p className="text-sm text-card-foreground">Notify attendees</p>
            <p className="text-[10px] text-muted-foreground">
              Email {event.attendeeCount} registered attendees about the change
            </p>
          </div>
        </label>

        {/* Impact note */}
        <div className="bg-secondary border border-border rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="size-4 text-secondary-foreground flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Rescheduling may lead to some cancellations. Consider offering additional incentives.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleSubmit} disabled={!newDate || isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Rescheduling...
              </span>
            ) : (
              <>
                <Calendar className="size-4" /> Reschedule Event
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}