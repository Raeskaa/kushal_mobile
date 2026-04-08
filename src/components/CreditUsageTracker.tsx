import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Coins, TrendingUp, TrendingDown, Zap, Mail, Users, Calendar,
  ArrowUpRight, BarChart3, Clock, Sparkles, Info, ExternalLink,
  MessageSquare, Image, FileText, Video, ChevronRight,
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

// ─── Credit System Data ────────────────────────────────────────
export interface CreditPlan {
  name: string;
  totalCredits: number;
  usedCredits: number;
  resetDate: string;
  pricePerMonth: number;
}

export interface CreditAction {
  id: string;
  action: string;
  category: 'ai' | 'email' | 'event' | 'media' | 'automation';
  cost: number;
  icon: React.ElementType;
  description: string;
}

export interface CreditUsageEntry {
  id: string;
  action: string;
  cost: number;
  timestamp: string;
  eventName?: string;
  category: 'ai' | 'email' | 'event' | 'media' | 'automation';
}

const MOCK_PLAN: CreditPlan = {
  name: 'Pro',
  totalCredits: 5000,
  usedCredits: 3247,
  resetDate: '2026-04-01',
  pricePerMonth: 49,
};

const CREDIT_ACTIONS: CreditAction[] = [
  { id: 'ai-chat', action: 'AI Chat Message', category: 'ai', cost: 1, icon: MessageSquare, description: 'Each message sent to Leapy' },
  { id: 'ai-generate', action: 'AI Content Generation', category: 'ai', cost: 5, icon: Sparkles, description: 'Generate event descriptions, emails, etc.' },
  { id: 'ai-image', action: 'AI Image Generation', category: 'media', cost: 10, icon: Image, description: 'Generate cover images or banners' },
  { id: 'email-single', action: 'Single Email', category: 'email', cost: 1, icon: Mail, description: 'Send one transactional email' },
  { id: 'email-blast', action: 'Email Blast (per 100)', category: 'email', cost: 5, icon: Mail, description: 'Bulk email to attendees per 100 recipients' },
  { id: 'event-publish', action: 'Publish Event', category: 'event', cost: 10, icon: Calendar, description: 'Make an event live and public' },
  { id: 'event-duplicate', action: 'Duplicate Event', category: 'event', cost: 3, icon: FileText, description: 'Clone an existing event' },
  { id: 'recording', action: 'Recording Processing', category: 'media', cost: 20, icon: Video, description: 'Process and host event recordings' },
  { id: 'automation', action: 'Automation Run', category: 'automation', cost: 2, icon: Zap, description: 'Each automation workflow execution' },
];

const MOCK_USAGE_HISTORY: CreditUsageEntry[] = [
  { id: 'u1', action: 'AI Content Generation', cost: 5, timestamp: '2026-03-11T10:30:00', eventName: 'React Workshop', category: 'ai' },
  { id: 'u2', action: 'Email Blast (142 recipients)', cost: 10, timestamp: '2026-03-11T09:15:00', eventName: 'React Workshop', category: 'email' },
  { id: 'u3', action: 'Publish Event', cost: 10, timestamp: '2026-03-10T16:45:00', eventName: 'Design Masterclass', category: 'event' },
  { id: 'u4', action: 'AI Chat Message', cost: 1, timestamp: '2026-03-10T15:20:00', category: 'ai' },
  { id: 'u5', action: 'AI Image Generation', cost: 10, timestamp: '2026-03-10T14:00:00', eventName: 'PM Summit', category: 'media' },
  { id: 'u6', action: 'AI Chat Message', cost: 1, timestamp: '2026-03-10T13:50:00', category: 'ai' },
  { id: 'u7', action: 'Automation Run', cost: 2, timestamp: '2026-03-10T12:00:00', eventName: 'React Workshop', category: 'automation' },
  { id: 'u8', action: 'Duplicate Event', cost: 3, timestamp: '2026-03-09T11:30:00', eventName: 'API Masterclass', category: 'event' },
  { id: 'u9', action: 'Email Blast (87 recipients)', cost: 5, timestamp: '2026-03-09T10:00:00', eventName: 'Growth Bootcamp', category: 'email' },
  { id: 'u10', action: 'Recording Processing', cost: 20, timestamp: '2026-03-08T18:00:00', eventName: 'Startup Pitch Night', category: 'media' },
];

const MOCK_CONVERSION_METRICS = {
  creditsPerRegistration: 2.4,
  creditsPerAttendee: 3.8,
  roi: 12.5,
  topSpendCategory: 'AI' as const,
  monthlyTrend: -8, // percent change
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: 'text-primary bg-primary/10',
  email: 'text-chart-2 bg-chart-2/10',
  event: 'text-chart-1 bg-chart-1/10',
  media: 'text-chart-5 bg-chart-5/10',
  automation: 'text-chart-4 bg-chart-4/10',
};

const CATEGORY_LABELS: Record<string, string> = {
  ai: 'AI',
  email: 'Email',
  event: 'Events',
  media: 'Media',
  automation: 'Automation',
};

// ─── Header Widget (always visible) ────────────────────────────
export function CreditUsageWidget() {
  const [detailOpen, setDetailOpen] = useState(false);
  const plan = MOCK_PLAN;
  const remaining = plan.totalCredits - plan.usedCredits;
  const usagePercent = Math.round((plan.usedCredits / plan.totalCredits) * 100);
  const isLow = remaining < plan.totalCredits * 0.2;
  const isCritical = remaining < plan.totalCredits * 0.05;

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <button className={`flex items-center gap-2 px-3 h-9 rounded-lg border transition-colors ${
            isCritical ? 'bg-destructive/10 border-destructive/30 text-destructive' :
            isLow ? 'bg-primary/5 border-primary/20 text-primary' :
            'bg-muted border-border text-card-foreground'
          }`}>
            <Coins className={`size-4 ${isCritical ? 'text-destructive' : isLow ? 'text-primary' : 'text-primary'}`} />
            <div className="flex items-center gap-1.5 text-sm">
              <span>{remaining.toLocaleString()}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{plan.totalCredits.toLocaleString()}</span>
            </div>
            {isCritical && <Badge variant="destructive" className="text-[9px] py-0 px-1">Low</Badge>}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="size-4 text-primary" />
                <span className="text-sm text-card-foreground">Credits</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">{plan.name} Plan</Badge>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">{plan.usedCredits.toLocaleString()} used</span>
                <span className={isCritical ? 'text-destructive' : 'text-primary'}>{remaining.toLocaleString()} remaining</span>
              </div>
              <Progress value={usagePercent} className={`h-2 ${isCritical ? '[&>[data-slot=progress-indicator]]:bg-destructive' : ''}`} />
            </div>

            <div className="text-xs text-muted-foreground">
              Resets {new Date(plan.resetDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>

            {/* Quick Action Cost Preview */}
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Action Costs</p>
              <div className="space-y-1.5">
                {CREDIT_ACTIONS.slice(0, 4).map((action) => (
                  <div key={action.id} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-card-foreground">
                      <action.icon className="size-3 text-muted-foreground" />
                      {action.action}
                    </span>
                    <span className="text-primary">{action.cost} cr</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => setDetailOpen(true)}
            >
              <BarChart3 className="size-3 mr-1.5" />
              View Full Usage
              <ChevronRight className="size-3 ml-auto" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <CreditUsageDetailDialog open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}

// ─── Full Detail Dialog ────────────────────────────────────────
function CreditUsageDetailDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const plan = MOCK_PLAN;
  const remaining = plan.totalCredits - plan.usedCredits;
  const usagePercent = Math.round((plan.usedCredits / plan.totalCredits) * 100);

  // Compute category breakdown
  const categoryBreakdown = MOCK_USAGE_HISTORY.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.cost;
    return acc;
  }, {} as Record<string, number>);

  const totalInHistory = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Credit Usage & Analytics
          </DialogTitle>
          <DialogDescription>
            Track your credit consumption, view cost breakdowns, and monitor conversion metrics.
          </DialogDescription>
        </DialogHeader>

        {/* Usage Overview */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Coins className="size-3" /> Remaining
            </div>
            <p className="text-xl text-card-foreground">{remaining.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">of {plan.totalCredits.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <TrendingUp className="size-3" /> This Period
            </div>
            <p className="text-xl text-card-foreground">{plan.usedCredits.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs mt-0.5">
              {MOCK_CONVERSION_METRICS.monthlyTrend < 0 ? (
                <><TrendingDown className="size-3 text-primary" /><span className="text-primary">{Math.abs(MOCK_CONVERSION_METRICS.monthlyTrend)}% less</span></>
              ) : (
                <><TrendingUp className="size-3 text-destructive" /><span className="text-destructive">{MOCK_CONVERSION_METRICS.monthlyTrend}% more</span></>
              )}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-border bg-card">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Clock className="size-3" /> Resets In
            </div>
            <p className="text-xl text-card-foreground">
              {Math.ceil((new Date(plan.resetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(plan.resetDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usage</span>
            <span className="text-card-foreground">{usagePercent}%</span>
          </div>
          <Progress value={usagePercent} className="h-2.5" />
        </div>

        <Tabs defaultValue="breakdown" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="breakdown" className="text-xs">Breakdown</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
          </TabsList>

          {/* Category Breakdown */}
          <TabsContent value="breakdown" className="mt-3 space-y-3">
            <div className="space-y-2">
              {Object.entries(categoryBreakdown)
                .sort(([,a], [,b]) => b - a)
                .map(([cat, amount]) => {
                  const pct = totalInHistory > 0 ? Math.round((amount / totalInHistory) * 100) : 0;
                  const colorClass = CATEGORY_COLORS[cat] || 'text-muted-foreground bg-muted';
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div className={`size-8 rounded-md flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <span className="text-xs">{CATEGORY_LABELS[cat]?.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-card-foreground">{CATEGORY_LABELS[cat] || cat}</span>
                          <span className="text-xs text-muted-foreground">{amount} credits ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>

            {/* All Action Costs */}
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">All Action Costs</p>
              <div className="grid grid-cols-1 gap-1.5">
                {CREDIT_ACTIONS.map((action) => (
                  <div key={action.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <div className={`size-7 rounded flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[action.category]}`}>
                      <action.icon className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-card-foreground">{action.action}</p>
                      <p className="text-[10px] text-muted-foreground">{action.description}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] py-0 flex-shrink-0">{action.cost} cr</Badge>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Usage History */}
          <TabsContent value="history" className="mt-3">
            <div className="space-y-1">
              {MOCK_USAGE_HISTORY.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors">
                  <div className={`size-8 rounded-md flex items-center justify-center flex-shrink-0 ${CATEGORY_COLORS[entry.category]}`}>
                    <Zap className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground">{entry.action}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      {entry.eventName && (
                        <>
                          <span className="text-border">|</span>
                          <span className="truncate">{entry.eventName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs py-0 flex-shrink-0">-{entry.cost}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Conversion Metrics */}
          <TabsContent value="metrics" className="mt-3 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Users className="size-3" />
                  Credits per Registration
                </div>
                <p className="text-xl text-card-foreground">{MOCK_CONVERSION_METRICS.creditsPerRegistration}</p>
                <p className="text-xs text-muted-foreground mt-0.5">avg across all events</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Users className="size-3" />
                  Credits per Attendee
                </div>
                <p className="text-xl text-card-foreground">{MOCK_CONVERSION_METRICS.creditsPerAttendee}</p>
                <p className="text-xs text-muted-foreground mt-0.5">actual attendees</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <ArrowUpRight className="size-3" />
                  ROI Multiplier
                </div>
                <p className="text-xl text-primary">{MOCK_CONVERSION_METRICS.roi}x</p>
                <p className="text-xs text-muted-foreground mt-0.5">return on credit spend</p>
              </div>
              <div className="p-3 rounded-lg border border-border bg-card">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                  <Sparkles className="size-3" />
                  Top Spend
                </div>
                <p className="text-xl text-card-foreground">{MOCK_CONVERSION_METRICS.topSpendCategory}</p>
                <p className="text-xs text-muted-foreground mt-0.5">highest credit category</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2">
                <Info className="size-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-card-foreground">Optimization Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your AI usage accounts for 40% of spend. Consider using templates more often to reduce
                    AI content generation costs. Events created from templates use ~60% fewer credits on average.
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" className="w-full text-xs">
              <ExternalLink className="size-3 mr-1.5" />
              Upgrade Plan for More Credits
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
