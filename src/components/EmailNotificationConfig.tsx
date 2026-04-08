import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Mail, Bell, Users, Shield, Clock, Settings, Check,
  Calendar, MapPin, Ticket, FileText, UserPlus, AlertTriangle,
  Send, Zap, ChevronDown, ChevronRight, Info,
} from 'lucide-react';

interface EmailNotificationConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId?: string;
  eventTitle?: string;
  onSave?: (config: NotificationConfig) => void;
}

export interface NotificationConfig {
  attendeeNotifications: {
    eventUpdated: boolean;
    dateTimeChanged: boolean;
    locationChanged: boolean;
    speakerChanged: boolean;
    ticketChanged: boolean;
    eventCancelled: boolean;
    eventPostponed: boolean;
    reminderBefore24h: boolean;
    reminderBefore1h: boolean;
    recordingAvailable: boolean;
    certificateReady: boolean;
  };
  adminNotifications: {
    newRegistration: boolean;
    registrationCancelled: boolean;
    waitlistJoined: boolean;
    capacityThreshold: boolean;
    capacityThresholdPercent: number;
    speakerConfirmed: boolean;
    speakerDeclined: boolean;
    paymentReceived: boolean;
    refundRequested: boolean;
  };
  frequency: 'immediate' | 'hourly' | 'daily';
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestEnabled: boolean;
  digestTime: string;
}

const DEFAULT_CONFIG: NotificationConfig = {
  attendeeNotifications: {
    eventUpdated: true,
    dateTimeChanged: true,
    locationChanged: true,
    speakerChanged: false,
    ticketChanged: true,
    eventCancelled: true,
    eventPostponed: true,
    reminderBefore24h: true,
    reminderBefore1h: true,
    recordingAvailable: true,
    certificateReady: true,
  },
  adminNotifications: {
    newRegistration: true,
    registrationCancelled: true,
    waitlistJoined: true,
    capacityThreshold: true,
    capacityThresholdPercent: 80,
    speakerConfirmed: true,
    speakerDeclined: true,
    paymentReceived: false,
    refundRequested: true,
  },
  frequency: 'immediate',
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  digestEnabled: false,
  digestTime: '09:00',
};

interface NotificationToggleRowProps {
  icon: React.ElementType;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive';
}

function NotificationToggleRow({ icon: Icon, label, description, checked, onCheckedChange, badge, badgeVariant = 'secondary' }: NotificationToggleRowProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="size-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-card-foreground">{label}</span>
          {badge && <Badge variant={badgeVariant} className="text-[10px] py-0">{badge}</Badge>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function EmailNotificationConfig({ open, onOpenChange, eventTitle, onSave }: EmailNotificationConfigProps) {
  const [config, setConfig] = useState<NotificationConfig>(DEFAULT_CONFIG);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateAttendee = (key: keyof NotificationConfig['attendeeNotifications'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      attendeeNotifications: { ...prev.attendeeNotifications, [key]: value },
    }));
  };

  const updateAdmin = (key: keyof NotificationConfig['adminNotifications'], value: boolean | number) => {
    setConfig(prev => ({
      ...prev,
      adminNotifications: { ...prev.adminNotifications, [key]: value },
    }));
  };

  const handleSave = () => {
    onSave?.(config);
    onOpenChange(false);
  };

  const enabledAttendeeCount = Object.values(config.attendeeNotifications).filter(Boolean).length;
  const enabledAdminCount = Object.values(config.adminNotifications).filter(v => typeof v === 'boolean' && v).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="size-5 text-primary" />
            Email Notifications
          </DialogTitle>
          <DialogDescription>
            {eventTitle
              ? <>Configure which changes to <span className="text-card-foreground">{eventTitle}</span> trigger email notifications.</>
              : 'Configure granular email notification rules for this event.'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="attendees" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="attendees" className="gap-1.5">
              <Users className="size-3.5" />
              Attendees
              <Badge variant="secondary" className="text-[10px] ml-1 py-0">{enabledAttendeeCount}</Badge>
            </TabsTrigger>
            <TabsTrigger value="admins" className="gap-1.5">
              <Shield className="size-3.5" />
              Admins
              <Badge variant="secondary" className="text-[10px] ml-1 py-0">{enabledAdminCount}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Attendee Notifications */}
          <TabsContent value="attendees" className="space-y-1 mt-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
              <Info className="size-3" />
              Emails sent to registered attendees when these changes occur
            </div>

            <div className="space-y-0 divide-y divide-border">
              <NotificationToggleRow
                icon={FileText}
                label="Event details updated"
                description="Title, description, or general info changed"
                checked={config.attendeeNotifications.eventUpdated}
                onCheckedChange={(v) => updateAttendee('eventUpdated', v)}
              />
              <NotificationToggleRow
                icon={Calendar}
                label="Date & time changed"
                description="Start time, end time, or date modified"
                checked={config.attendeeNotifications.dateTimeChanged}
                onCheckedChange={(v) => updateAttendee('dateTimeChanged', v)}
                badge="Critical"
                badgeVariant="destructive"
              />
              <NotificationToggleRow
                icon={MapPin}
                label="Location changed"
                description="Venue, meeting link, or format updated"
                checked={config.attendeeNotifications.locationChanged}
                onCheckedChange={(v) => updateAttendee('locationChanged', v)}
                badge="Critical"
                badgeVariant="destructive"
              />
              <NotificationToggleRow
                icon={Users}
                label="Speaker changes"
                description="New speaker added or speaker lineup changed"
                checked={config.attendeeNotifications.speakerChanged}
                onCheckedChange={(v) => updateAttendee('speakerChanged', v)}
              />
              <NotificationToggleRow
                icon={Ticket}
                label="Ticket / pricing changes"
                description="Price updates, new tiers, or availability changes"
                checked={config.attendeeNotifications.ticketChanged}
                onCheckedChange={(v) => updateAttendee('ticketChanged', v)}
              />
              <NotificationToggleRow
                icon={AlertTriangle}
                label="Event cancelled"
                description="Notify when event is cancelled or suspended"
                checked={config.attendeeNotifications.eventCancelled}
                onCheckedChange={(v) => updateAttendee('eventCancelled', v)}
                badge="Required"
              />
              <NotificationToggleRow
                icon={Clock}
                label="Event postponed"
                description="Notify when event is rescheduled"
                checked={config.attendeeNotifications.eventPostponed}
                onCheckedChange={(v) => updateAttendee('eventPostponed', v)}
                badge="Required"
              />

              <Separator className="my-2" />

              <div className="text-xs text-muted-foreground pt-3 pb-1">Automated</div>

              <NotificationToggleRow
                icon={Bell}
                label="24-hour reminder"
                description="Automated reminder sent 24 hours before event"
                checked={config.attendeeNotifications.reminderBefore24h}
                onCheckedChange={(v) => updateAttendee('reminderBefore24h', v)}
                badge="Auto"
              />
              <NotificationToggleRow
                icon={Bell}
                label="1-hour reminder"
                description="Automated reminder sent 1 hour before event"
                checked={config.attendeeNotifications.reminderBefore1h}
                onCheckedChange={(v) => updateAttendee('reminderBefore1h', v)}
                badge="Auto"
              />
              <NotificationToggleRow
                icon={Send}
                label="Recording available"
                description="Notify when event recording is uploaded"
                checked={config.attendeeNotifications.recordingAvailable}
                onCheckedChange={(v) => updateAttendee('recordingAvailable', v)}
              />
              <NotificationToggleRow
                icon={Check}
                label="Certificate ready"
                description="Notify when attendance certificate is generated"
                checked={config.attendeeNotifications.certificateReady}
                onCheckedChange={(v) => updateAttendee('certificateReady', v)}
              />
            </div>
          </TabsContent>

          {/* Admin Notifications */}
          <TabsContent value="admins" className="space-y-1 mt-3">
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
              <Info className="size-3" />
              Emails sent to you and your team when these things happen
            </div>

            <div className="space-y-0 divide-y divide-border">
              <NotificationToggleRow
                icon={UserPlus}
                label="New registration"
                description="Someone registers for this event"
                checked={config.adminNotifications.newRegistration}
                onCheckedChange={(v) => updateAdmin('newRegistration', v)}
              />
              <NotificationToggleRow
                icon={AlertTriangle}
                label="Registration cancelled"
                description="An attendee cancels their registration"
                checked={config.adminNotifications.registrationCancelled}
                onCheckedChange={(v) => updateAdmin('registrationCancelled', v)}
              />
              <NotificationToggleRow
                icon={Clock}
                label="Waitlist joined"
                description="Someone joins the waitlist"
                checked={config.adminNotifications.waitlistJoined}
                onCheckedChange={(v) => updateAdmin('waitlistJoined', v)}
              />
              <NotificationToggleRow
                icon={Users}
                label="Capacity threshold"
                description={`Alert when ${config.adminNotifications.capacityThresholdPercent}% capacity reached`}
                checked={config.adminNotifications.capacityThreshold}
                onCheckedChange={(v) => updateAdmin('capacityThreshold', v)}
                badge={`${config.adminNotifications.capacityThresholdPercent}%`}
              />
              <NotificationToggleRow
                icon={Check}
                label="Speaker confirmed"
                description="A speaker accepts their invitation"
                checked={config.adminNotifications.speakerConfirmed}
                onCheckedChange={(v) => updateAdmin('speakerConfirmed', v)}
              />
              <NotificationToggleRow
                icon={AlertTriangle}
                label="Speaker declined"
                description="A speaker declines their invitation"
                checked={config.adminNotifications.speakerDeclined}
                onCheckedChange={(v) => updateAdmin('speakerDeclined', v)}
              />
              <NotificationToggleRow
                icon={Ticket}
                label="Payment received"
                description="A paid ticket purchase is completed"
                checked={config.adminNotifications.paymentReceived}
                onCheckedChange={(v) => updateAdmin('paymentReceived', v)}
              />
              <NotificationToggleRow
                icon={AlertTriangle}
                label="Refund requested"
                description="An attendee requests a refund"
                checked={config.adminNotifications.refundRequested}
                onCheckedChange={(v) => updateAdmin('refundRequested', v)}
                badge="Action"
                badgeVariant="destructive"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Advanced Settings */}
        <div className="border border-border rounded-lg">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm text-card-foreground hover:bg-muted/50 transition-colors rounded-lg"
          >
            <span className="flex items-center gap-2">
              <Settings className="size-4 text-muted-foreground" />
              Delivery Settings
            </span>
            {showAdvanced ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
          </button>

          {showAdvanced && (
            <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
              {/* Frequency */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Delivery Frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {(['immediate', 'hourly', 'daily'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setConfig(prev => ({ ...prev, frequency: freq }))}
                      className={`px-3 py-2 rounded-md border text-xs text-center transition-all ${
                        config.frequency === freq
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {freq === 'immediate' && <Zap className="size-3 mx-auto mb-1" />}
                      {freq === 'hourly' && <Clock className="size-3 mx-auto mb-1" />}
                      {freq === 'daily' && <Calendar className="size-3 mx-auto mb-1" />}
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-card-foreground">Quiet Hours</p>
                  <p className="text-xs text-muted-foreground">
                    Hold emails between {config.quietHoursStart} — {config.quietHoursEnd}
                  </p>
                </div>
                <Switch
                  checked={config.quietHoursEnabled}
                  onCheckedChange={(v) => setConfig(prev => ({ ...prev, quietHoursEnabled: v }))}
                />
              </div>

              {/* Daily Digest */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-card-foreground">Daily Digest</p>
                  <p className="text-xs text-muted-foreground">
                    Bundle non-critical emails into a daily summary at {config.digestTime}
                  </p>
                </div>
                <Switch
                  checked={config.digestEnabled}
                  onCheckedChange={(v) => setConfig(prev => ({ ...prev, digestEnabled: v }))}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Check className="size-4 mr-1.5" />
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
