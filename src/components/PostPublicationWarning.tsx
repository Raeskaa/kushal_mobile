import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  AlertTriangle, Users, Mail, Clock, Calendar, MapPin, FileText,
  Shield, ChevronRight, Info, History, Check, X, Pencil,
} from 'lucide-react';

export interface EditChange {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
  impactLevel: 'low' | 'medium' | 'high';
}

interface PostPublicationWarningProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventTitle: string;
  eventStatus: string;
  attendeeCount: number;
  changes: EditChange[];
  onConfirmEdit: (notifyAttendees: boolean) => void;
  onCancel: () => void;
}

const IMPACT_ICONS: Record<string, React.ElementType> = {
  'Date & Time': Calendar,
  'Location': MapPin,
  'Capacity': Users,
  'Title': FileText,
  'Description': FileText,
  'Tickets': FileText,
  'Speakers': Users,
};

const IMPACT_COLORS = {
  low: 'text-muted-foreground',
  medium: 'text-amber-600',
  high: 'text-destructive',
};

const IMPACT_BG = {
  low: 'bg-muted',
  medium: 'bg-amber-50 border-amber-200',
  high: 'bg-destructive/5 border-destructive/20',
};

export function PostPublicationWarning({
  open,
  onOpenChange,
  eventTitle,
  eventStatus,
  attendeeCount,
  changes,
  onConfirmEdit,
  onCancel,
}: PostPublicationWarningProps) {
  const [notifyAttendees, setNotifyAttendees] = useState(true);
  const [showVersionNote, setShowVersionNote] = useState(false);

  const highImpactChanges = changes.filter(c => c.impactLevel === 'high');
  const mediumImpactChanges = changes.filter(c => c.impactLevel === 'medium');
  const lowImpactChanges = changes.filter(c => c.impactLevel === 'low');

  const hasHighImpact = highImpactChanges.length > 0;
  const overallImpact = hasHighImpact ? 'high' : mediumImpactChanges.length > 0 ? 'medium' : 'low';

  const handleConfirm = () => {
    onConfirmEdit(notifyAttendees);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`size-8 rounded-full flex items-center justify-center ${
              hasHighImpact ? 'bg-destructive/10' : 'bg-amber-100'
            }`}>
              <AlertTriangle className={`size-4 ${hasHighImpact ? 'text-destructive' : 'text-amber-600'}`} />
            </div>
            Edit Published Event
          </DialogTitle>
          <DialogDescription>
            Changes to &quot;{eventTitle}&quot; may affect {attendeeCount} registered attendee{attendeeCount !== 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        {/* Impact Summary */}
        <div className={`p-3 rounded-lg border ${
          overallImpact === 'high'
            ? 'bg-destructive/5 border-destructive/20'
            : overallImpact === 'medium'
              ? 'bg-amber-50 border-amber-200'
              : 'bg-muted border-border'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={overallImpact === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
              {overallImpact === 'high' ? 'High Impact' : overallImpact === 'medium' ? 'Medium Impact' : 'Low Impact'}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {changes.length} change{changes.length !== 1 ? 's' : ''} detected
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {overallImpact === 'high'
              ? 'Critical changes like date, time, or location may cause confusion. Attendees should be notified immediately.'
              : overallImpact === 'medium'
                ? 'These changes are notable and attendees may want to know about them.'
                : 'Minor changes that are unlikely to impact attendees significantly.'}
          </p>
        </div>

        {/* Changes List */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <p className="text-xs text-muted-foreground">Changes being made:</p>
          {changes.map((change, i) => {
            const Icon = IMPACT_ICONS[change.field] || FileText;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 p-2.5 rounded-lg border ${IMPACT_BG[change.impactLevel]}`}
              >
                <div className={`size-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                  change.impactLevel === 'high' ? 'bg-destructive/10' : change.impactLevel === 'medium' ? 'bg-amber-100' : 'bg-muted'
                }`}>
                  <Icon className={`size-3.5 ${IMPACT_COLORS[change.impactLevel]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-card-foreground">{change.label}</span>
                    {change.impactLevel === 'high' && (
                      <Badge variant="destructive" className="text-[9px] py-0 px-1">Critical</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                    <span className="text-muted-foreground line-through truncate max-w-[120px]">{change.oldValue}</span>
                    <ChevronRight className="size-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-card-foreground truncate max-w-[120px]">{change.newValue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Notification Settings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-primary" />
              <Label htmlFor="notify-attendees" className="text-sm cursor-pointer">
                Notify attendees of changes
              </Label>
            </div>
            <Switch
              id="notify-attendees"
              checked={notifyAttendees}
              onCheckedChange={setNotifyAttendees}
            />
          </div>
          {notifyAttendees && (
            <div className="ml-6 p-2.5 rounded-md bg-primary/5 border border-primary/10">
              <p className="text-[11px] text-muted-foreground">
                An email will be sent to all {attendeeCount} attendees notifying them about the changes.
                {hasHighImpact && ' Date/time and location changes are marked as urgent.'}
              </p>
            </div>
          )}
          {!notifyAttendees && hasHighImpact && (
            <div className="ml-6 p-2.5 rounded-md bg-destructive/5 border border-destructive/10">
              <p className="text-[11px] text-destructive flex items-start gap-1.5">
                <AlertTriangle className="size-3 mt-0.5 flex-shrink-0" />
                Not recommended for high-impact changes. Attendees may miss critical updates.
              </p>
            </div>
          )}
        </div>

        {/* Version History Teaser */}
        <button
          onClick={() => setShowVersionNote(!showVersionNote)}
          className="flex items-center gap-2 w-full p-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
        >
          <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <History className="size-3.5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-card-foreground">Version History</p>
            <p className="text-[11px] text-muted-foreground">Changes are tracked for your records</p>
          </div>
          <ChevronRight className={`size-4 text-muted-foreground transition-transform ${showVersionNote ? 'rotate-90' : ''}`} />
        </button>
        {showVersionNote && (
          <div className="p-3 rounded-lg bg-muted/50 border border-border space-y-2 -mt-1">
            <p className="text-[11px] text-muted-foreground">
              This edit will be saved as <span className="text-card-foreground">Version {Math.floor(Math.random() * 5) + 2}</span>.
              You&apos;ll be able to review and revert changes from the event&apos;s history tab.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="size-3" /> Auto-saved</span>
              <span className="flex items-center gap-1"><Shield className="size-3" /> Audit-logged</span>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center gap-2 sm:gap-2">
          <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
            <X className="size-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className={`flex-1 sm:flex-none ${hasHighImpact ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'}`}
          >
            <Pencil className="size-4 mr-1.5" />
            {hasHighImpact ? 'Edit Anyway' : 'Confirm Edit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}