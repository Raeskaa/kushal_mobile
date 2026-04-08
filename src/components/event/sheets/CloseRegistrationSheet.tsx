import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Lock, Users, Clock, AlertTriangle, CircleCheck } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface CloseRegistrationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onConfirmClose: () => void;
}

export function CloseRegistrationSheet({ isOpen, onClose, event, onConfirmClose }: CloseRegistrationSheetProps) {
  const [enableWaitlist, setEnableWaitlist] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const waitlisted = event.waitlistCount || 0;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirmClose();
      toast.success('Registration closed');
      setIsClosing(false);
      onClose();
    }, 600);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Close Registration"
      subtitle="Stop accepting new sign-ups"
    >
      <div className="space-y-4">
        {/* Current stats */}
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <p className="text-[10px] text-muted-foreground">Current Status</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-sm text-card-foreground">{event.attendeeCount}</p>
              <p className="text-[10px] text-muted-foreground">Registered</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground">{event.capacity || '∞'}</p>
              <p className="text-[10px] text-muted-foreground">Capacity</p>
            </div>
            <div>
              <p className="text-sm text-card-foreground">{waitlisted}</p>
              <p className="text-[10px] text-muted-foreground">Waitlisted</p>
            </div>
          </div>
        </div>

        {/* What happens */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">What happens when you close registration:</p>
          <div className="space-y-2">
            {[
              'New visitors will see "Registration Closed"',
              'Existing registrations are unaffected',
              'You can still manually add attendees',
              'You can reopen registration at any time',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CircleCheck className="size-3.5 text-primary flex-shrink-0" />
                <span className="text-xs text-secondary-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Waitlist option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-lg">
          <input
            type="checkbox"
            checked={enableWaitlist}
            onChange={(e) => setEnableWaitlist(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          <div>
            <p className="text-sm text-card-foreground">Keep waitlist open</p>
            <p className="text-[10px] text-muted-foreground">
              Allow people to join the waitlist even after registration closes
            </p>
          </div>
        </label>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button onClick={handleClose} disabled={isClosing} className="w-full">
            {isClosing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Closing...
              </span>
            ) : (
              <>
                <Lock className="size-4" /> Close Registration
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Keep Open
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}