import { Calendar, Copy, Download, Mail, Share2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type MockEvent } from '../../data/mockEventData';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';

interface MobileAddToCalendarSheetProps {
  open: boolean;
  onClose: () => void;
  event: MockEvent;
}

export function MobileAddToCalendarSheet({ open, onClose, event }: MobileAddToCalendarSheetProps) {
  const actions = [
    { id: 'google', label: 'Google Calendar', subtitle: 'Open in browser', icon: Calendar },
    { id: 'apple', label: 'Apple Calendar', subtitle: 'Download .ics file', icon: Download },
    { id: 'outlook', label: 'Outlook', subtitle: 'Export .ics file', icon: Download },
    { id: 'copy', label: 'Copy Event Link', subtitle: 'Share event URL', icon: Copy },
    { id: 'email', label: 'Email Invite', subtitle: 'Send event details', icon: Mail },
  ];

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="text-[17px]">Add to Calendar</SheetTitle>
          <p className="text-[12px] text-muted-foreground">Save or share {event.title}</p>
        </SheetHeader>

        <div className="p-4 space-y-2">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                toast.success(`${action.label} ready`);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-border text-left active:scale-[0.99] transition-all"
            >
              <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <action.icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground">{action.label}</p>
                <p className="text-[11px] text-muted-foreground">{action.subtitle}</p>
              </div>
              <Share2 className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="p-4 pt-0">
          <Button variant="outline" onClick={onClose} className="w-full">Close</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
