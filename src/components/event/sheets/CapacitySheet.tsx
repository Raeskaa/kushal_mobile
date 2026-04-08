import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Progress } from '../../ui/progress';
import { Users, Plus, Minus, AlertTriangle, CircleCheck, TrendingUp } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface CapacitySheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onUpdateCapacity: (newCapacity: number) => void;
}

export function CapacitySheet({ isOpen, onClose, event, onUpdateCapacity }: CapacitySheetProps) {
  const currentCapacity = event.capacity || 100;
  const [newCapacity, setNewCapacity] = useState(currentCapacity);
  const [isUpdating, setIsUpdating] = useState(false);

  const capacityPercent = (event.attendeeCount / newCapacity) * 100;
  const increase = newCapacity - currentCapacity;
  const waitlisted = event.waitlistCount || 0;

  const presets = [25, 50, 100, 250, 500];

  const handleUpdate = () => {
    if (newCapacity < event.attendeeCount) {
      toast.error('Capacity cannot be less than current registrations');
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateCapacity(newCapacity);
      toast.success(`Capacity updated to ${newCapacity}`);
      setIsUpdating(false);
      onClose();
    }, 600);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Adjust Capacity"
      subtitle="Change maximum attendee limit"
    >
      <div className="space-y-4">
        {/* Current status */}
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{event.attendeeCount} registered</span>
            <span className="text-xs text-muted-foreground">{currentCapacity} current capacity</span>
          </div>
          <Progress value={(event.attendeeCount / currentCapacity) * 100} className="h-2" />
        </div>

        {/* Capacity input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">New capacity</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="size-10 flex-shrink-0"
              onClick={() => setNewCapacity(Math.max(event.attendeeCount, newCapacity - 10))}
            >
              <Minus className="size-4" />
            </Button>
            <Input
              type="number"
              value={newCapacity}
              onChange={(e) => setNewCapacity(Math.max(1, parseInt(e.target.value) || 0))}
              className="text-center text-lg"
            />
            <Button
              variant="outline"
              size="icon"
              className="size-10 flex-shrink-0"
              onClick={() => setNewCapacity(newCapacity + 10)}
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex gap-2 flex-wrap">
          {presets.map((p) => (
            <Button
              key={p}
              variant={newCapacity === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setNewCapacity(p)}
              className="flex-1 min-w-0"
            >
              {p}
            </Button>
          ))}
        </div>

        {/* Preview */}
        <div className="bg-muted rounded-lg p-3 space-y-2">
          <p className="text-[10px] text-muted-foreground">After update</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{event.attendeeCount} registered</span>
            <span className="text-xs text-muted-foreground">{newCapacity} capacity</span>
          </div>
          <Progress
            value={capacityPercent}
            className={`h-2 ${capacityPercent >= 90 ? '[&>[data-slot=progress-indicator]]:bg-secondary-foreground' : ''}`}
          />
          <p className="text-xs text-secondary-foreground">
            {newCapacity - event.attendeeCount} spots available
          </p>
        </div>

        {/* Info: waitlist auto-promote */}
        {increase > 0 && waitlisted > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-start gap-2">
            <CircleCheck className="size-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary">
              {Math.min(increase, waitlisted)} waitlisted {Math.min(increase, waitlisted) === 1 ? 'person' : 'people'} can be auto-promoted
            </p>
          </div>
        )}

        {/* Warning: below current */}
        {newCapacity < event.attendeeCount && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="size-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">
              Cannot set capacity below current registrations ({event.attendeeCount})
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={handleUpdate}
            disabled={newCapacity === currentCapacity || newCapacity < event.attendeeCount || isUpdating}
            className="w-full"
          >
            {isUpdating ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </span>
            ) : (
              <>
                <Users className="size-4" />
                {increase > 0 ? `Increase by ${increase}` : increase < 0 ? `Decrease by ${Math.abs(increase)}` : 'No Change'}
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