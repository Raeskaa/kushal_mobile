import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { AlertTriangle, Users, DollarSign, Mail, CircleCheck, Sparkles } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { type LeapyContext } from '../../../data/leapyContexts';

interface CancelEventSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onConfirmCancel: (reason: string) => void;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function CancelEventSheet({ isOpen, onClose, event, onConfirmCancel, onOpenLeapy }: CancelEventSheetProps) {
  const [reason, setReason] = useState('');
  const [notifyAttendees, setNotifyAttendees] = useState(true);
  const [issueRefunds, setIssueRefunds] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const revenue = event.isPaid
    ? (event.tickets || []).reduce((sum, t) => sum + (t.quantity - t.remaining) * t.price, 0) || event.attendeeCount * (event.price || 0)
    : 0;

  const handleCancel = () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    setIsCancelling(true);
    setTimeout(() => {
      onConfirmCancel(reason);
      setIsCancelling(false);
      setConfirmed(false);
      onClose();
    }, 1000);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel Event"
      subtitle="This action cannot be undone"
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-destructive">Are you sure?</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Cancelling will notify all attendees and cannot be reversed.
            </p>
          </div>
        </div>

        {/* Impact summary */}
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <p className="text-xs text-muted-foreground">Impact</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-sm text-card-foreground">{event.attendeeCount} attendees</span>
            </div>
            {event.isPaid && (
              <div className="flex items-center gap-2">
                <DollarSign className="size-4 text-muted-foreground" />
                <span className="text-sm text-card-foreground">${revenue.toLocaleString()} revenue</span>
              </div>
            )}
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Cancellation reason</label>
          <Textarea
            placeholder="Tell attendees why the event is being cancelled..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* AI draft reason */}
        <Button
          variant="secondary"
          onClick={() => onOpenLeapy?.({ type: 'cancel_event', entityId: event.id, entityData: event })}
          className="w-full justify-start bg-primary/5 hover:bg-primary/10"
        >
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm flex-1 text-left">Let AI draft the cancellation notice</span>
        </Button>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyAttendees}
              onChange={(e) => setNotifyAttendees(e.target.checked)}
              className="size-4 rounded border-border accent-primary"
            />
            <div>
              <p className="text-sm text-card-foreground">Notify all attendees</p>
              <p className="text-[10px] text-muted-foreground">Send cancellation email to {event.attendeeCount} people</p>
            </div>
          </label>

          {event.isPaid && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={issueRefunds}
                onChange={(e) => setIssueRefunds(e.target.checked)}
                className="size-4 rounded border-border accent-primary"
              />
              <div>
                <p className="text-sm text-card-foreground">Issue full refunds</p>
                <p className="text-[10px] text-muted-foreground">Refund ${revenue.toLocaleString()} to all ticket holders</p>
              </div>
            </label>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            Keep Event
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isCancelling}
            className="w-full"
          >
            {isCancelling ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Cancelling...
              </span>
            ) : confirmed ? (
              'Confirm Cancel — This is permanent'
            ) : (
              <>
                <AlertTriangle className="size-4" /> Cancel Event
              </>
            )}
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}
