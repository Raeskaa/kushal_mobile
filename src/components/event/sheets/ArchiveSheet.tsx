import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Archive, AlertTriangle, Download, CircleCheck, Trash2 } from 'lucide-react';
import { toast } from "sonner@2.0.3";

interface ArchiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onConfirmArchive: () => void;
  onConfirmDelete: () => void;
}

export function ArchiveSheet({ isOpen, onClose, event, onConfirmArchive, onConfirmDelete }: ArchiveSheetProps) {
  const [action, setAction] = useState<'archive' | 'delete'>('archive');
  const [exportData, setExportData] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (action === 'archive') {
        onConfirmArchive();
        toast.success('Event archived');
      } else {
        onConfirmDelete();
        toast.success('Event permanently deleted');
      }
      setIsProcessing(false);
      setConfirmed(false);
      onClose();
    }, 800);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Archive or Delete"
      subtitle={event.title}
    >
      <div className="space-y-4">
        {/* Action choice */}
        <div className="space-y-2">
          <button
            onClick={() => { setAction('archive'); setConfirmed(false); }}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
              action === 'archive' ? 'border-primary bg-primary/5' : 'border-border'
            }`}
          >
            <Archive className={`size-5 mt-0.5 ${action === 'archive' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="text-left">
              <p className="text-sm text-card-foreground">Archive</p>
              <p className="text-xs text-muted-foreground">
                Hide from active events. Data is preserved and can be restored later.
              </p>
            </div>
          </button>

          <button
            onClick={() => { setAction('delete'); setConfirmed(false); }}
            className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
              action === 'delete' ? 'border-destructive bg-destructive/5' : 'border-border'
            }`}
          >
            <Trash2 className={`size-5 mt-0.5 ${action === 'delete' ? 'text-destructive' : 'text-muted-foreground'}`} />
            <div className="text-left">
              <p className="text-sm text-card-foreground">Permanently Delete</p>
              <p className="text-xs text-muted-foreground">
                Remove all event data including attendees, analytics, and discussions. Cannot be undone.
              </p>
            </div>
          </button>
        </div>

        {/* What's preserved (archive) */}
        {action === 'archive' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">What's preserved:</p>
            {[
              'Attendee list and registrations',
              'Analytics and performance data',
              'Discussion threads',
              'Resources and recordings',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CircleCheck className="size-3.5 text-primary flex-shrink-0" />
                <span className="text-xs text-secondary-foreground">{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Delete warning */}
        {action === 'delete' && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="size-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-destructive">Permanent deletion</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All event data will be permanently removed. This includes {event.attendeeCount} attendee records,
                {event.schedule.length} schedule items, and all analytics data.
              </p>
            </div>
          </div>
        )}

        {/* Export option */}
        <label className="flex items-center gap-3 cursor-pointer p-3 bg-muted rounded-lg">
          <input
            type="checkbox"
            checked={exportData}
            onChange={(e) => setExportData(e.target.checked)}
            className="size-4 rounded border-border accent-primary"
          />
          <div className="flex-1">
            <p className="text-sm text-card-foreground">Export data first</p>
            <p className="text-[10px] text-muted-foreground">Download attendees, analytics, and content as CSV</p>
          </div>
          <Download className="size-4 text-muted-foreground" />
        </label>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            Cancel
          </Button>
          <Button
            variant={action === 'delete' ? 'destructive' : 'default'}
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {action === 'archive' ? 'Archiving...' : 'Deleting...'}
              </span>
            ) : confirmed ? (
              `Confirm ${action === 'archive' ? 'Archive' : 'Delete'} — Are you sure?`
            ) : (
              <>
                {action === 'archive' ? <Archive className="size-4" /> : <Trash2 className="size-4" />}
                {action === 'archive' ? 'Archive Event' : 'Delete Permanently'}
              </>
            )}
          </Button>
        </div>
      </div>
    </MobileActionSheet>
  );
}