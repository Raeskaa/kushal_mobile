import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Copy, Mail, MessageCircle, Send, ExternalLink, QrCode, Code, Users } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from '../../../utils/copyToClipboard';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
  onOpenQR?: () => void;
  onOpenInvite?: () => void;
}

export function ShareSheet({ isOpen, onClose, event, onOpenQR, onOpenInvite }: ShareSheetProps) {
  const eventUrl = `leapspace.io/events/${event.id}`;

  const socialChannels = [
    { id: 'copy', label: 'Copy Link', icon: Copy, color: 'bg-accent', action: () => { copyToClipboard(eventUrl); toast.success('Link copied!'); } },
    { id: 'email', label: 'Email', icon: Mail, color: 'bg-accent', action: () => toast('Email share coming soon') },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: 'bg-primary/10', action: () => toast('WhatsApp share coming soon') },
    { id: 'telegram', label: 'Telegram', icon: Send, color: 'bg-sky-50', action: () => toast('Telegram share coming soon') },
  ];

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Share Event"
      subtitle={`${event.attendeeCount} people registered`}
    >
      <div className="space-y-5">
        {/* Link field */}
        <div className="flex gap-2">
          <Input value={eventUrl} readOnly className="text-xs bg-muted" />
          <Button variant="outline" size="sm" onClick={() => { copyToClipboard(eventUrl); toast.success('Copied!'); }} className="flex-shrink-0">
            <Copy className="size-4" />
          </Button>
        </div>

        {/* Share channels */}
        <div className="grid grid-cols-4 gap-3">
          {socialChannels.map((ch) => (
            <button
              key={ch.id}
              onClick={ch.action}
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-all"
            >
              <div className={`size-12 ${ch.color} rounded-full flex items-center justify-center`}>
                <ch.icon className="size-5 text-secondary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">{ch.label}</span>
            </button>
          ))}
        </div>

        {/* More options */}
        <div className="space-y-2">
          <button
            onClick={() => { onClose(); onOpenQR?.(); }}
            className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg active:bg-accent transition-all"
          >
            <QrCode className="size-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">QR Code</p>
              <p className="text-[10px] text-muted-foreground">Generate printable QR code</p>
            </div>
          </button>

          <button
            onClick={() => { onClose(); onOpenInvite?.(); }}
            className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg active:bg-accent transition-all"
          >
            <Users className="size-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Invite People</p>
              <p className="text-[10px] text-muted-foreground">Send direct invitations via email</p>
            </div>
          </button>

          <button
            onClick={() => toast('Embed code copied!')}
            className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg active:bg-accent transition-all"
          >
            <Code className="size-5 text-muted-foreground" />
            <div className="flex-1 text-left">
              <p className="text-sm text-card-foreground">Embed Widget</p>
              <p className="text-[10px] text-muted-foreground">Add registration to your website</p>
            </div>
          </button>
        </div>

        {/* Social stats */}
        {event.lifecycleStage === 'published' && (
          <div className="bg-muted rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground mb-2">Share Performance</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm text-card-foreground">{event.pageViews || 0}</p>
                <p className="text-[10px] text-muted-foreground">Views</p>
              </div>
              <div>
                <p className="text-sm text-card-foreground">{Math.round((event.pageViews || 0) * 0.3)}</p>
                <p className="text-[10px] text-muted-foreground">Link Clicks</p>
              </div>
              <div>
                <p className="text-sm text-card-foreground">{event.registrationRate || 0}%</p>
                <p className="text-[10px] text-muted-foreground">Conversion</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MobileActionSheet>
  );
}