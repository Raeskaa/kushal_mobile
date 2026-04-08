import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent, getChecklistProgress } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import {
  Rocket, CircleCheck, Circle, AlertTriangle, Calendar, MapPin, Clock,
  Users, Ticket, Globe, Eye, Sparkles, ChevronRight
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface PublishSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onPublish: () => void;
  onPreview: () => void;
}

export function PublishSheet({ isOpen, onClose, event, onPublish, onPreview }: PublishSheetProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  const checklist = event.completionChecklist;
  const progress = checklist ? getChecklistProgress(checklist) : { completed: 0, total: 0, percent: 0 };
  const isReady = event.lifecycleStage === 'ready' || (progress.percent >= 80);

  const criticalItems = [
    { label: 'Title set', done: !!event.title, required: true },
    { label: 'Date configured', done: !!event.date, required: true },
    { label: 'Location set', done: !!event.location, required: true },
    { label: 'Description added', done: checklist?.hasDescription ?? false, required: true },
    { label: 'Cover image', done: checklist?.hasCoverImage ?? false, required: false },
    { label: 'Schedule added', done: event.schedule.length > 0, required: false },
    { label: 'Tickets configured', done: checklist?.hasTickets ?? !event.isPaid, required: event.isPaid },
    { label: 'Speakers added', done: (event.speakers?.length ?? 0) > 0, required: false },
  ];

  const missingRequired = criticalItems.filter(i => i.required && !i.done);

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      onPublish();
      setIsPublishing(false);
      onClose();
    }, 800);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Publish Event"
      subtitle={isReady ? 'Your event is ready to go live' : 'Review before publishing'}
    >
      <div className="space-y-4">
        {/* Event Preview Card */}
        <div className="bg-muted rounded-xl p-3 flex items-center gap-3">
          <div className="size-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="size-6 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-card-foreground truncate">{event.title}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
              <span>{event.date}</span>
              <span className="text-border">·</span>
              <span className="capitalize">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-card-foreground">Readiness Check</span>
            <span className="text-xs text-muted-foreground">{progress.completed}/{progress.total}</span>
          </div>
          <Progress value={progress.percent} className={`h-2 ${progress.percent >= 80 ? '' : '[&>[data-slot=progress-indicator]]:bg-secondary-foreground'}`} />
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {criticalItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 py-1.5">
              {item.done ? (
                <CircleCheck className="size-4 text-primary flex-shrink-0" />
              ) : (
                <Circle className={`size-4 flex-shrink-0 ${item.required ? 'text-destructive' : 'text-muted-foreground/40'}`} />
              )}
              <span className={`text-sm ${item.done ? 'text-muted-foreground' : 'text-card-foreground'}`}>
                {item.label}
              </span>
              {item.required && !item.done && (
                <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[9px] ml-auto">
                  Required
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Warning */}
        {missingRequired.length > 0 && (
          <div className="bg-secondary border border-border rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="size-4 text-secondary-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-foreground">
                {missingRequired.length} required item{missingRequired.length > 1 ? 's' : ''} missing.
                You can still publish, but some features won't be available.
              </p>
            </div>
          </div>
        )}

        {/* Visibility Info */}
        <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          <span className="text-xs text-secondary-foreground">
            This event will be {event.visibility === 'public' ? 'publicly discoverable' : 'visible only via link'}
          </span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button variant="outline" onClick={onPreview} className="w-full">
            <Eye className="size-4" /> Preview Landing Page
          </Button>
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="w-full"
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </span>
            ) : (
              <>
                <Rocket className="size-4" /> Publish Now
              </>
            )}
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}