import { Bell, Mail, Smartphone } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type MockEvent, type NotificationRule } from '../../data/mockEventData';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';

interface MobileNotificationRulesProps {
  event: MockEvent;
}

function getChannelIcon(channel: NotificationRule['channel']) {
  switch (channel) {
    case 'push': return Smartphone;
    case 'in-app': return Bell;
    case 'email':
    default:
      return Mail;
  }
}

export function MobileNotificationRules({ event }: MobileNotificationRulesProps) {
  const { setNotificationRules } = useEventStore();
  const rules = event.notificationRules || [];

  const updateRule = (ruleId: string, changes: Partial<NotificationRule>) => {
    setNotificationRules(event.id, rules.map((rule) => rule.id === ruleId ? { ...rule, ...changes } : rule));
  };

  return (
    <div className="p-4 space-y-4">
      {rules.map((rule) => {
        const ChannelIcon = getChannelIcon(rule.channel);
        return (
          <Card key={rule.id} className="p-4 gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  <ChannelIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-card-foreground">{rule.label}</p>
                  <p className="text-[11px] text-muted-foreground">{rule.channel} • {rule.timing} • {rule.audience}</p>
                </div>
              </div>
              <Switch checked={rule.enabled} onCheckedChange={(next) => updateRule(rule.id, { enabled: next })} />
            </div>

            <div className="rounded-xl bg-muted p-3">
              <p className="text-[10px] text-muted-foreground uppercase mb-1">Template</p>
              <p className="text-[12px] text-secondary-foreground">{rule.messageTemplate}</p>
            </div>

            <Button variant="outline" size="sm" onClick={() => toast('Message template editing coming next')} className="w-full">
              Edit Template
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
