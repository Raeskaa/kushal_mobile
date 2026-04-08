import { useState } from 'react';
import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { UserPlus, Mail, Send, X, Sparkles, Users, Upload } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { type LeapyContext } from '../../../data/leapyContexts';

interface InviteSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function InviteSheet({ isOpen, onClose, event, onOpenLeapy }: InviteSheetProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const addEmail = () => {
    const trimmed = currentEmail.trim();
    if (trimmed && trimmed.includes('@') && !emails.includes(trimmed)) {
      setEmails([...emails, trimmed]);
      setCurrentEmail('');
    }
  };

  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  const handleSend = () => {
    if (emails.length === 0) {
      toast.error('Add at least one email');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      toast.success(`Invitations sent to ${emails.length} people!`);
      setIsSending(false);
      setEmails([]);
      setPersonalMessage('');
      onClose();
    }, 1000);
  };

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Invite People"
      subtitle="Send email invitations directly"
    >
      <div className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Email addresses</label>
          <div className="flex gap-2">
            <Input
              placeholder="name@example.com"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEmail(); } }}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={addEmail} className="flex-shrink-0">
              <UserPlus className="size-4" />
            </Button>
          </div>
        </div>

        {/* Email chips */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="pl-2 pr-1 py-1 gap-1">
                <span className="text-xs">{email}</span>
                <button onClick={() => removeEmail(email)} className="p-0.5 rounded hover:bg-foreground/10">
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Bulk import */}
        <button
          onClick={() => toast('CSV import coming soon')}
          className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg active:bg-accent transition-all"
        >
          <Upload className="size-4 text-muted-foreground" />
          <div className="text-left">
            <p className="text-sm text-card-foreground">Import from CSV</p>
            <p className="text-[10px] text-muted-foreground">Bulk invite from a spreadsheet</p>
          </div>
        </button>

        {/* Personal message */}
        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Personal message (optional)</label>
          <Textarea
            placeholder="Hey! I'd love for you to join this event..."
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>

        {/* AI compose */}
        <Button
          variant="secondary"
          onClick={() => onOpenLeapy?.({ type: 'compose_email', entityId: event.id, entityData: event })}
          className="w-full justify-start bg-primary/5 hover:bg-primary/10"
        >
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm flex-1 text-left">Let AI write the invitation</span>
        </Button>

        {/* Summary */}
        {emails.length > 0 && (
          <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-xs text-secondary-foreground">
              {emails.length} invitation{emails.length > 1 ? 's' : ''} will be sent for "{event.title}"
            </span>
          </div>
        )}

        {/* Send */}
        <Button onClick={handleSend} disabled={emails.length === 0 || isSending} className="w-full">
          {isSending ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </span>
          ) : (
            <>
              <Send className="size-4" /> Send {emails.length > 0 ? `${emails.length} ` : ''}Invitation{emails.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </div>
    </MobileActionSheet>
  );
}
