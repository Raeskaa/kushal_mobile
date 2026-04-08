import { useState } from 'react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  Calendar, MapPin, Globe, Lock, Palette, ChevronRight, AlertTriangle,
  Trash2, Sparkles, Bell, Users, Ticket, Mail, Shield, Eye, Link2,
  Clock, RefreshCw, MessageSquare
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';
import { MobileRegistrationFormBuilder } from './MobileRegistrationFormBuilder';
import { MobileNotificationRules } from './MobileNotificationRules';

interface MobileEventSettingsProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function MobileEventSettings({ event, onOpenLeapy }: MobileEventSettingsProps) {
  const { updateEvent } = useEventStore();
  const [showDangerZone, setShowDangerZone] = useState(false);

  // Local toggle states (for demonstration)
  const [allowWaitlist, setAllowWaitlist] = useState(event.accessType === 'waitlist');
  const [allowDiscussion, setAllowDiscussion] = useState(true);
  const [autoReminders, setAutoReminders] = useState(true);
  const [requireApproval, setRequireApproval] = useState(event.accessType === 'screened');
  const [showAttendeeList, setShowAttendeeList] = useState(true);

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  return (
    <div className="p-4 space-y-4">
      {/* General Settings */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">General</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={Calendar}
            label="Event Title"
            value={event.title}
            onClick={() => leapy('edit_event_details')}
          />
          <SettingsRow
            icon={Calendar}
            label="Description"
            value={event.description ? 'Set' : 'Not set'}
            onClick={() => leapy('edit_event_description')}
          />
          <SettingsRow
            icon={Calendar}
            label="Category"
            value={event.category}
            onClick={() => leapy('edit_event_details')}
          />
        </div>
      </Card>

      {/* Date & Time */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Date & Time</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={Calendar}
            label="Date"
            value={event.date}
            onClick={() => leapy('edit_event_details')}
          />
          <SettingsRow
            icon={Clock}
            label="Start Time"
            value={event.time || 'Not set'}
            onClick={() => leapy('edit_event_details')}
          />
          {event.endTime && (
            <SettingsRow
              icon={Clock}
              label="End Time"
              value={event.endTime}
              onClick={() => leapy('edit_event_details')}
            />
          )}
          {event.timezone && (
            <SettingsRow
              icon={Globe}
              label="Timezone"
              value={event.timezone}
              onClick={() => leapy('edit_event_details')}
            />
          )}
        </div>
      </Card>

      {/* Location */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Location</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={MapPin}
            label="Format"
            value={event.location}
            onClick={() => leapy('set_location')}
          />
          <SettingsRow
            icon={MapPin}
            label="Details"
            value={event.locationDetails || 'Not set'}
            onClick={() => leapy('set_location')}
          />
          {event.virtualLink && (
            <SettingsRow
              icon={Link2}
              label="Virtual Link"
              value="Configured"
              onClick={() => leapy('set_location')}
            />
          )}
        </div>
      </Card>

      {/* Visibility & Access */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Visibility & Access</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={event.visibility === 'public' ? Globe : Lock}
            label="Visibility"
            value={event.visibility}
            onClick={() => leapy('edit_event_details')}
          />
          <SettingsRow
            icon={Lock}
            label="Access Type"
            value={event.accessType}
            onClick={() => leapy('set_registration')}
          />
        </div>
      </Card>

      {/* Registration Settings (toggles) */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Registration</h3>
        </div>
        <div className="divide-y divide-border">
          <ToggleRow
            icon={Users}
            label="Enable Waitlist"
            description="Allow people to join waitlist when full"
            checked={allowWaitlist}
            onChange={(v) => { setAllowWaitlist(v); toast.success(v ? 'Waitlist enabled' : 'Waitlist disabled'); }}
          />
          <ToggleRow
            icon={Shield}
            label="Require Approval"
            description="Manually approve each registration"
            checked={requireApproval}
            onChange={(v) => { setRequireApproval(v); toast.success(v ? 'Approval required' : 'Open registration'); }}
          />
          <ToggleRow
            icon={Eye}
            label="Show Attendee List"
            description="Let attendees see who else is coming"
            checked={showAttendeeList}
            onChange={(v) => { setShowAttendeeList(v); toast.success(v ? 'Attendee list visible' : 'Attendee list hidden'); }}
          />
          <SettingsRow
            icon={Ticket}
            label="Registration Form"
            value="Configure"
            onClick={() => leapy('set_registration')}
          />
        </div>
      </Card>

      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Registration Form Builder</h3>
        </div>
        <MobileRegistrationFormBuilder event={event} />
      </Card>

      {/* Notifications */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Notifications</h3>
        </div>
        <div className="divide-y divide-border">
          <ToggleRow
            icon={Bell}
            label="Auto Reminders"
            description="Send reminders 24h and 1h before"
            checked={autoReminders}
            onChange={(v) => { setAutoReminders(v); toast.success(v ? 'Reminders enabled' : 'Reminders disabled'); }}
          />
          <ToggleRow
            icon={MessageSquare}
            label="Discussion"
            description="Enable event discussion/chat"
            checked={allowDiscussion}
            onChange={(v) => { setAllowDiscussion(v); toast.success(v ? 'Discussion enabled' : 'Discussion disabled'); }}
          />
          <SettingsRow
            icon={Mail}
            label="Email Templates"
            value="Customize"
            onClick={() => leapy('compose_email')}
          />
        </div>
      </Card>

      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Notification Rules</h3>
        </div>
        <MobileNotificationRules event={event} />
      </Card>

      {/* Branding */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Branding</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={Palette}
            label="Cover Image"
            value={event.completionChecklist?.hasCoverImage ? 'Set' : 'Not set'}
            onClick={() => leapy('edit_event_cover')}
          />
          <SettingsRow
            icon={Palette}
            label="Custom Theme"
            value="Default"
            onClick={() => toast('Theme customization coming soon')}
          />
        </div>
      </Card>

      {/* Integrations stub */}
      <Card className="overflow-hidden gap-0">
        <div className="px-4 py-3 bg-muted border-b border-border">
          <h3 className="text-sm text-card-foreground">Integrations</h3>
        </div>
        <div className="divide-y divide-border">
          <SettingsRow
            icon={Link2}
            label="Zoom"
            value={event.virtualLink ? 'Connected' : 'Not connected'}
            onClick={() => toast('Zoom integration coming soon')}
          />
          <SettingsRow
            icon={Mail}
            label="Mailchimp"
            value="Not connected"
            onClick={() => toast('Mailchimp integration coming soon')}
          />
          <SettingsRow
            icon={RefreshCw}
            label="Zapier"
            value="Not connected"
            onClick={() => toast('Zapier integration coming soon')}
          />
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="overflow-hidden border-destructive/30 gap-0">
        <button
          onClick={() => setShowDangerZone(!showDangerZone)}
          className="w-full flex items-center justify-between px-4 py-3 bg-destructive/5"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-destructive" />
            <span className="text-sm text-destructive">Danger Zone</span>
          </div>
          <ChevronRight className={`size-4 text-destructive/60 transition-transform ${showDangerZone ? 'rotate-90' : ''}`} />
        </button>

        {showDangerZone && (
          <div className="p-4 space-y-3">
            {event.lifecycleStage === 'published' && (
              <Button
                variant="outline"
                onClick={() => leapy('close_registration')}
                className="w-full justify-start border-secondary text-foreground hover:bg-secondary"
              >
                <Lock className="size-4 text-secondary-foreground" />
                <div className="text-left">
                  <p className="text-sm">Close Registration</p>
                  <p className="text-[10px] text-muted-foreground">Stop accepting new registrations</p>
                </div>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => leapy('cancel_event')}
              className="w-full justify-start border-secondary text-foreground hover:bg-secondary"
            >
              <Sparkles className="size-4 text-primary" />
              <div className="text-left">
                <p className="text-sm">Cancel Event</p>
                <p className="text-[10px] text-muted-foreground">Notify attendees and issue refunds</p>
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => leapy('archive_event')}
              className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="size-4" />
              <div className="text-left">
                <p className="text-sm">Delete Event</p>
                <p className="text-[10px] text-muted-foreground">This action cannot be undone</p>
              </div>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Reusable Setting Rows ──────────────────────────────────────

function SettingsRow({ icon: Icon, label, value, onClick }: {
  icon: React.ElementType;
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 active:bg-muted transition-all"
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4 text-muted-foreground" />
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground capitalize truncate max-w-[140px]">{value}</span>
        <ChevronRight className="size-3.5 text-muted-foreground/50" />
      </div>
    </button>
  );
}

function ToggleRow({ icon: Icon, label, description, checked, onChange }: {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon className="size-4 text-muted-foreground flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-foreground">{label}</p>
          <p className="text-[10px] text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="flex-shrink-0" />
    </div>
  );
}
