import { TrendingUp, Users, DollarSign, BarChart3, Eye, Sparkles, Globe, Clock, Share2, MapPin } from 'lucide-react';
import { type MockEvent } from '../../data/mockEventData';
import { type LeapyContext } from '../../data/leapyContexts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

interface MobileEventAnalyticsProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function MobileEventAnalytics({ event, onOpenLeapy }: MobileEventAnalyticsProps) {
  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);
  const capacityPercent = event.capacity ? Math.min((event.attendeeCount / event.capacity) * 100, 100) : 0;
  const pageViews = event.pageViews || Math.round(event.attendeeCount * 3.2);
  const conversionRate = event.registrationRate || (pageViews > 0 ? Math.round((event.attendeeCount / pageViews) * 100) : 0);
  const revenue = event.isPaid
    ? (event.tickets || []).reduce((sum, t) => sum + (t.quantity - t.remaining) * t.price, 0) || event.attendeeCount * (event.price || 0)
    : 0;

  const dailyData = [
    { day: 'Mon', value: 12 },
    { day: 'Tue', value: 18 },
    { day: 'Wed', value: 8 },
    { day: 'Thu', value: 24 },
    { day: 'Fri', value: 32 },
    { day: 'Sat', value: 15 },
    { day: 'Sun', value: 21 },
  ];
  const maxValue = Math.max(...dailyData.map(d => d.value));

  // Mock traffic sources
  const trafficSources = [
    { source: 'Direct Link', percent: 42 },
    { source: 'Social Media', percent: 28 },
    { source: 'Email', percent: 18 },
    { source: 'Community', percent: 12 },
  ];

  // Mock geographic data
  const topLocations = [
    { city: 'New York', count: Math.round(event.attendeeCount * 0.22) },
    { city: 'San Francisco', count: Math.round(event.attendeeCount * 0.18) },
    { city: 'London', count: Math.round(event.attendeeCount * 0.14) },
    { city: 'Berlin', count: Math.round(event.attendeeCount * 0.09) },
    { city: 'Other', count: Math.round(event.attendeeCount * 0.37) },
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Users, label: 'Registrations', value: event.attendeeCount.toString(), change: '+12%', color: 'bg-primary/10' },
          { icon: DollarSign, label: 'Revenue', value: `$${revenue.toLocaleString()}`, change: event.isPaid ? '+8%' : 'N/A', color: 'bg-primary/10' },
          { icon: Eye, label: 'Page Views', value: pageViews.toLocaleString(), change: '+23%', color: 'bg-accent' },
          { icon: TrendingUp, label: 'Conversion', value: `${conversionRate}%`, change: '+2.1%', color: 'bg-secondary' },
        ].map((metric, idx) => (
          <Card key={idx} className="p-3.5 gap-2">
            <div className="flex items-center gap-2">
              <div className={`size-7 ${metric.color} rounded-lg flex items-center justify-center`}>
                <metric.icon className="size-3.5 text-secondary-foreground" />
              </div>
              <span className="text-[10px] text-muted-foreground">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg text-card-foreground">{metric.value}</span>
              {metric.change !== 'N/A' && (
                <span className="text-[10px] text-primary">{metric.change}</span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Registration Trend */}
      <Card className="p-4 gap-4">
        <h3 className="text-sm text-card-foreground">Registration Trend</h3>
        <div className="flex items-end justify-between gap-2 h-28">
          {dailyData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: '80px' }}>
                <div
                  className="w-full max-w-[24px] bg-primary rounded-t"
                  style={{ height: `${(d.value / maxValue) * 100}%`, minHeight: '4px' }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Traffic Sources */}
      <Card className="p-4 gap-3">
        <h3 className="text-sm text-card-foreground">Traffic Sources</h3>
        <div className="space-y-2.5">
          {trafficSources.map((source, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-foreground">{source.source}</span>
                <span className="text-xs text-muted-foreground">{source.percent}%</span>
              </div>
              <Progress value={source.percent} className="h-1.5" />
            </div>
          ))}
        </div>
      </Card>

      {/* Geographic Distribution */}
      <Card className="p-4 gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <h3 className="text-sm text-card-foreground">Top Locations</h3>
        </div>
        <div className="space-y-2">
          {topLocations.map((loc, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-xs text-foreground">{loc.city}</span>
              <div className="flex items-center gap-2">
                <Progress value={(loc.count / event.attendeeCount) * 100} className="w-20 h-1.5" />
                <span className="text-xs text-muted-foreground w-8 text-right">{loc.count}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Capacity */}
      {event.capacity && (
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">Capacity</h3>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{event.attendeeCount} registered</span>
            <span className="text-xs text-muted-foreground">{event.capacity} total</span>
          </div>
          <Progress value={capacityPercent} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {capacityPercent >= 100
              ? 'Event is at full capacity'
              : `${Math.round(100 - capacityPercent)}% capacity remaining`
            }
          </p>
        </Card>
      )}

      {/* Ticket Distribution */}
      {event.tickets && event.tickets.length > 0 && (
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">Ticket Distribution</h3>
          <div className="space-y-3">
            {event.tickets.map((ticket) => {
              const sold = ticket.quantity - ticket.remaining;
              const percent = (sold / ticket.quantity) * 100;
              return (
                <div key={ticket.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-foreground">{ticket.name}</span>
                    <span className="text-xs text-muted-foreground">{sold}/{ticket.quantity}</span>
                  </div>
                  <Progress value={percent} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Engagement Metrics */}
      <Card className="p-4 gap-3">
        <h3 className="text-sm text-card-foreground">Engagement</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Discussion Posts', value: String(event.chatMessageCount || 47) },
            { label: 'Avg. Session Time', value: '8m 32s' },
            { label: 'Resource Downloads', value: String((event.resources || []).reduce((s, r) => s + (r.downloadCount || 0), 0) || 124) },
            { label: 'Health Score', value: `${event.healthScore || 82}/100` },
          ].map((item, idx) => (
            <div key={idx} className="p-2.5 bg-muted rounded-lg">
              <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
              <p className="text-sm text-card-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Insights */}
      <Card className="p-4 gap-3 bg-primary/5 border-primary/20">
        <h3 className="text-sm text-card-foreground">AI Insights</h3>
        <div className="space-y-2">
          {[
            { label: 'Summarize Feedback', ctx: 'summarize_feedback' },
            { label: 'Export Attendee Data', ctx: 'download_attendees' },
            { label: 'Draft Recap Post', ctx: 'create_recap_post' },
            { label: 'Generate Social Post', ctx: 'generate_social_post' },
          ].map((action) => (
            <Button
              key={action.ctx}
              variant="secondary"
              onClick={() => leapy(action.ctx)}
              className="w-full justify-start bg-card hover:bg-accent"
            >
              <Sparkles className="size-4 text-primary" />
              <span className="flex-1 text-left">{action.label}</span>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
}