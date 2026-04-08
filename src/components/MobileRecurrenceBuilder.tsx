import { useState, useEffect, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Repeat, Calendar, X, Check } from 'lucide-react';
import { RRule } from 'rrule';

// ─── Types ───────────────────────────────────────────────────────
export interface RecurrenceConfig {
  frequency: 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly';
  interval: number; // every N (weeks/days/months)
  weekdays: number[]; // 0=Mon, 1=Tue, ... 6=Sun (RRule weekday indices)
  endType: 'never' | 'after' | 'on_date';
  endAfterCount: number;
  endOnDate: string; // YYYY-MM-DD
}

interface MobileRecurrenceBuilderProps {
  open: boolean;
  onClose: () => void;
  value: RecurrenceConfig;
  onChange: (config: RecurrenceConfig) => void;
  eventStartDate?: string; // YYYY-MM-DD for rrule DTSTART
}

// ─── Defaults ────────────────────────────────────────────────────
export const DEFAULT_RECURRENCE: RecurrenceConfig = {
  frequency: 'none',
  interval: 1,
  weekdays: [],
  endType: 'never',
  endAfterCount: 10,
  endOnDate: '',
};

// ─── Frequency options ───────────────────────────────────────────
const FREQUENCIES = [
  { id: 'none' as const, label: 'One-time', desc: 'Single occurrence' },
  { id: 'daily' as const, label: 'Daily', desc: 'Every day' },
  { id: 'weekly' as const, label: 'Weekly', desc: 'Same day each week' },
  { id: 'biweekly' as const, label: 'Biweekly', desc: 'Every 2 weeks' },
  { id: 'monthly' as const, label: 'Monthly', desc: 'Same date each month' },
];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const RRULE_WEEKDAYS = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];

// ─── Build RRule string from config ──────────────────────────────
export function buildRRuleString(config: RecurrenceConfig, startDate?: string): string {
  if (config.frequency === 'none') return '';

  const freqMap: Record<string, number> = {
    daily: RRule.DAILY,
    weekly: RRule.WEEKLY,
    biweekly: RRule.WEEKLY,
    monthly: RRule.MONTHLY,
  };

  const options: Partial<ConstructorParameters<typeof RRule>[0]> = {
    freq: freqMap[config.frequency],
    interval: config.frequency === 'biweekly' ? 2 : config.interval,
  };

  if ((config.frequency === 'weekly' || config.frequency === 'biweekly') && config.weekdays.length > 0) {
    options.byweekday = config.weekdays.map(d => RRULE_WEEKDAYS[d]);
  }

  if (config.endType === 'after') {
    options.count = config.endAfterCount;
  } else if (config.endType === 'on_date' && config.endOnDate) {
    options.until = new Date(config.endOnDate + 'T23:59:59');
  }

  if (startDate) {
    options.dtstart = new Date(startDate + 'T00:00:00');
  }

  const rule = new RRule(options as any);
  return rule.toString();
}

// ─── Human-readable summary ──────────────────────────────────────
export function getRecurrenceSummary(config: RecurrenceConfig): string {
  if (config.frequency === 'none') return 'One-time event';

  let text = '';
  switch (config.frequency) {
    case 'daily':
      text = config.interval > 1 ? `Every ${config.interval} days` : 'Every day';
      break;
    case 'weekly':
      text = config.interval > 1 ? `Every ${config.interval} weeks` : 'Every week';
      break;
    case 'biweekly':
      text = 'Every 2 weeks';
      break;
    case 'monthly':
      text = config.interval > 1 ? `Every ${config.interval} months` : 'Every month';
      break;
  }

  if ((config.frequency === 'weekly' || config.frequency === 'biweekly') && config.weekdays.length > 0) {
    const dayNames = config.weekdays.sort().map(d => WEEKDAY_LABELS[d]);
    text += ` on ${dayNames.join(', ')}`;
  }

  if (config.endType === 'after') {
    text += ` (${config.endAfterCount} times)`;
  } else if (config.endType === 'on_date' && config.endOnDate) {
    const d = new Date(config.endOnDate + 'T00:00:00');
    text += ` until ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  return text;
}

// ─── Get upcoming dates preview ──────────────────────────────────
function getPreviewDates(config: RecurrenceConfig, startDate?: string, count = 5): Date[] {
  if (config.frequency === 'none') return [];

  try {
    const rruleStr = buildRRuleString(config, startDate);
    if (!rruleStr) return [];
    const rule = RRule.fromString(rruleStr);
    return rule.all((_, i) => i < count);
  } catch {
    return [];
  }
}

// ─── Component ───────────────────────────────────────────────────
export function MobileRecurrenceBuilder({
  open,
  onClose,
  value,
  onChange,
  eventStartDate,
}: MobileRecurrenceBuilderProps) {
  const [config, setConfig] = useState<RecurrenceConfig>(value);

  useEffect(() => {
    if (open) setConfig(value);
  }, [open, value]);

  const updateConfig = (patch: Partial<RecurrenceConfig>) => {
    setConfig(prev => ({ ...prev, ...patch }));
  };

  const handleConfirm = () => {
    onChange(config);
    onClose();
  };

  const summary = getRecurrenceSummary(config);
  const previewDates = useMemo(
    () => getPreviewDates(config, eventStartDate),
    [config, eventStartDate]
  );

  const showWeekdays = config.frequency === 'weekly' || config.frequency === 'biweekly';
  const showInterval = config.frequency === 'daily' || config.frequency === 'weekly' || config.frequency === 'monthly';
  const showEndOptions = config.frequency !== 'none';

  const getThreeMonthsOut = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().split('T')[0];
  };

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 flex flex-col max-h-[85vh]">
        <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-[15px]">Recurrence</SheetTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">{summary}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* ─── Frequency ─── */}
          <div>
            <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">Frequency</p>
            <div className="space-y-2">
              {FREQUENCIES.map((freq) => {
                const isSelected = config.frequency === freq.id;
                return (
                  <button
                    key={freq.id}
                    onClick={() => {
                      updateConfig({
                        frequency: freq.id,
                        interval: freq.id === 'biweekly' ? 2 : 1,
                        weekdays: freq.id === 'none' ? [] : config.weekdays,
                      });
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="size-2.5 bg-primary rounded-full" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-[13px] ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>
                        {freq.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{freq.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Custom Interval ─── */}
          {showInterval && config.frequency !== 'biweekly' && (
            <div>
              <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">
                Repeat every
              </p>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={52}
                  value={config.interval}
                  onChange={(e) => updateConfig({ interval: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-20 text-center text-[14px]"
                />
                <span className="text-[13px] text-muted-foreground">
                  {config.frequency === 'daily' ? 'day(s)' : config.frequency === 'weekly' ? 'week(s)' : 'month(s)'}
                </span>
              </div>
            </div>
          )}

          {/* ─── Weekday Picker ─── */}
          {showWeekdays && (
            <div>
              <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">
                On these days
              </p>
              <div className="flex gap-1.5">
                {WEEKDAY_LABELS.map((day, idx) => {
                  const isSelected = config.weekdays.includes(idx);
                  return (
                    <button
                      key={day}
                      onClick={() => {
                        const next = isSelected
                          ? config.weekdays.filter(d => d !== idx)
                          : [...config.weekdays, idx];
                        updateConfig({ weekdays: next });
                      }}
                      className={`flex-1 py-2.5 rounded-lg text-[12px] border transition-all active:scale-95 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── End Condition ─── */}
          {showEndOptions && (
            <div>
              <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">Ends</p>
              <div className="space-y-2">
                {/* Never */}
                <button
                  onClick={() => updateConfig({ endType: 'never' })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    config.endType === 'never' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                    config.endType === 'never' ? 'border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {config.endType === 'never' && <div className="size-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className={`text-[13px] ${config.endType === 'never' ? 'text-primary' : 'text-card-foreground'}`}>
                    Never
                  </span>
                </button>

                {/* After N occurrences */}
                <button
                  onClick={() => updateConfig({ endType: 'after' })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    config.endType === 'after' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                    config.endType === 'after' ? 'border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {config.endType === 'after' && <div className="size-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className={`text-[13px] ${config.endType === 'after' ? 'text-primary' : 'text-card-foreground'}`}>
                    After
                  </span>
                  {config.endType === 'after' && (
                    <div className="flex items-center gap-2 ml-auto">
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={config.endAfterCount}
                        onChange={(e) => updateConfig({ endAfterCount: Math.max(1, parseInt(e.target.value) || 1) })}
                        onClick={(e) => e.stopPropagation()}
                        className="w-16 text-center text-[13px] h-8"
                      />
                      <span className="text-[12px] text-muted-foreground">times</span>
                    </div>
                  )}
                </button>

                {/* On specific date */}
                <button
                  onClick={() => updateConfig({ endType: 'on_date', endOnDate: config.endOnDate || getThreeMonthsOut() })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    config.endType === 'on_date' ? 'border-primary bg-primary/5' : 'border-border bg-card'
                  }`}
                >
                  <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                    config.endType === 'on_date' ? 'border-primary' : 'border-muted-foreground/30'
                  }`}>
                    {config.endType === 'on_date' && <div className="size-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className={`text-[13px] ${config.endType === 'on_date' ? 'text-primary' : 'text-card-foreground'}`}>
                    On date
                  </span>
                  {config.endType === 'on_date' && (
                    <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="date"
                        value={config.endOnDate}
                        onChange={(e) => updateConfig({ endOnDate: e.target.value })}
                        className="h-8 px-2 rounded-md border border-input bg-input-background text-[12px] text-foreground"
                      />
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ─── Preview Dates ─── */}
          {previewDates.length > 0 && (
            <div>
              <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">
                Upcoming occurrences
              </p>
              <div className="rounded-xl border border-border bg-card p-3 space-y-2">
                {previewDates.map((date, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-primary">{idx + 1}</span>
                    </div>
                    <span className="text-[13px] text-foreground">
                      {date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                ))}
                {config.endType === 'never' && (
                  <p className="text-[11px] text-muted-foreground pl-8">...and more</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="px-4 py-4 border-t border-border bg-card flex-shrink-0">
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-primary text-primary-foreground"
              onClick={handleConfirm}
            >
              <Check className="size-4 mr-1.5" />
              {config.frequency === 'none' ? 'Set as One-time' : 'Set Recurrence'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Compact Trigger for forms ───────────────────────────────────
export function RecurrenceTrigger({
  config,
  onClick,
}: {
  config: RecurrenceConfig;
  onClick: () => void;
}) {
  const summary = getRecurrenceSummary(config);
  const isRecurring = config.frequency !== 'none';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.98] ${
        isRecurring ? 'border-primary bg-primary/5' : 'border-border bg-card'
      }`}
    >
      <div className={`size-8 rounded-lg flex items-center justify-center ${
        isRecurring ? 'bg-primary/15' : 'bg-muted'
      }`}>
        <Repeat className={`size-4 ${isRecurring ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div className="text-left flex-1 min-w-0">
        <p className={`text-[13px] ${isRecurring ? 'text-primary' : 'text-card-foreground'}`}>
          {isRecurring ? 'Recurring Event' : 'One-time Event'}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">{summary}</p>
      </div>
    </button>
  );
}
