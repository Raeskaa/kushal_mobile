import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Clock, Sun, Sunset, Moon, ChevronUp, ChevronDown } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────
interface MobileTimePickerProps {
  open: boolean;
  onClose: () => void;
  value: string; // "10:00 AM"
  onChange: (time: string) => void;
  label?: string;
  minTime?: string; // optional minimum (for end time validation)
}

// ─── Time Groups ─────────────────────────────────────────────────
type TimeGroup = 'morning' | 'afternoon' | 'evening';

const TIME_GROUPS: { id: TimeGroup; label: string; icon: typeof Sun; range: string; startHour: number; endHour: number }[] = [
  { id: 'morning', label: 'Morning', icon: Sun, range: '6 AM – 12 PM', startHour: 6, endHour: 12 },
  { id: 'afternoon', label: 'Afternoon', icon: Sunset, range: '12 PM – 5 PM', startHour: 12, endHour: 17 },
  { id: 'evening', label: 'Evening', icon: Moon, range: '5 PM – 11 PM', startHour: 17, endHour: 23 },
];

// ─── Helpers ─────────────────────────────────────────────────────
function parseTime(t: string): { hour: number; minute: number } {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return { hour: 10, minute: 0 };
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return { hour: h, minute: m };
}

function formatTime(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`;
}

function getGroupForHour(hour: number): TimeGroup {
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function timeToMinutes(t: string): number {
  const { hour, minute } = parseTime(t);
  return hour * 60 + minute;
}

// ─── Quick Duration Chips ────────────────────────────────────────
const QUICK_DURATIONS = [
  { label: '30 min', minutes: 30 },
  { label: '1 hour', minutes: 60 },
  { label: '1.5 hours', minutes: 90 },
  { label: '2 hours', minutes: 120 },
  { label: '3 hours', minutes: 180 },
];

// ─── Component ───────────────────────────────────────────────────
export function MobileTimePicker({
  open,
  onClose,
  value,
  onChange,
  label = 'Select Time',
  minTime,
}: MobileTimePickerProps) {
  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [activeGroup, setActiveGroup] = useState<TimeGroup>(getGroupForHour(parsed.hour));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync with external value
  useEffect(() => {
    if (open) {
      const p = parseTime(value);
      setSelectedHour(p.hour);
      setSelectedMinute(p.minute);
      setActiveGroup(getGroupForHour(p.hour));
    }
  }, [open, value]);

  const minMinutes = minTime ? timeToMinutes(minTime) : -1;

  const isDisabled = (h: number, m: number) => {
    if (minMinutes < 0) return false;
    return h * 60 + m <= minMinutes;
  };

  const handleConfirm = () => {
    onChange(formatTime(selectedHour, selectedMinute));
    onClose();
  };

  const currentGroup = TIME_GROUPS.find(g => g.id === activeGroup)!;

  // Generate hour slots for active group
  const hourSlots: number[] = [];
  for (let h = currentGroup.startHour; h < currentGroup.endHour; h++) {
    hourSlots.push(h);
  }

  // Minute options
  const MINUTES = [0, 15, 30, 45];

  const preview = formatTime(selectedHour, selectedMinute);

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 flex flex-col max-h-[70vh]">
        <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[15px]">{label}</SheetTitle>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10">
              <Clock className="size-3.5 text-primary" />
              <span className="text-[13px] text-primary">{preview}</span>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5" ref={scrollRef}>
          {/* ─── Time of Day Tabs ─── */}
          <div className="grid grid-cols-3 gap-2">
            {TIME_GROUPS.map((group) => {
              const Icon = group.icon;
              const isActive = activeGroup === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all active:scale-[0.97] ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <Icon className={`size-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`text-[12px] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {group.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{group.range}</span>
                </button>
              );
            })}
          </div>

          {/* ─── Hour Grid ─── */}
          <div>
            <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">Hour</p>
            <div className="grid grid-cols-4 gap-2">
              {hourSlots.map((h) => {
                const isSelected = selectedHour === h;
                const allDisabled = MINUTES.every(m => isDisabled(h, m));
                const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
                const ampm = h >= 12 ? 'PM' : 'AM';
                return (
                  <button
                    key={h}
                    onClick={() => {
                      if (!allDisabled) {
                        setSelectedHour(h);
                        // If current minute is disabled at this hour, pick first available
                        if (isDisabled(h, selectedMinute)) {
                          const firstAvailable = MINUTES.find(m => !isDisabled(h, m));
                          if (firstAvailable !== undefined) setSelectedMinute(firstAvailable);
                        }
                      }
                    }}
                    disabled={allDisabled}
                    className={`py-2.5 rounded-lg border text-[13px] transition-all active:scale-95 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : allDisabled
                          ? 'border-border bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                          : 'border-border bg-card text-foreground'
                    }`}
                  >
                    {displayH} {ampm}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── Minute Selector ─── */}
          <div>
            <p className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-2">Minutes</p>
            <div className="grid grid-cols-4 gap-2">
              {MINUTES.map((m) => {
                const isSelected = selectedMinute === m;
                const disabled = isDisabled(selectedHour, m);
                return (
                  <button
                    key={m}
                    onClick={() => !disabled && setSelectedMinute(m)}
                    disabled={disabled}
                    className={`py-2.5 rounded-lg border text-[13px] transition-all active:scale-95 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary'
                        : disabled
                          ? 'border-border bg-muted/50 text-muted-foreground/40 cursor-not-allowed'
                          : 'border-border bg-card text-foreground'
                    }`}
                  >
                    :{m.toString().padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </div>
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
              Set {preview}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Inline Time Display (for use in forms) ─────────────────────
export function TimePickerTrigger({
  value,
  onClick,
  label,
  disabled,
}: {
  value: string;
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-10 px-3 rounded-md border border-input bg-input-background text-[14px] text-foreground text-left flex items-center justify-between disabled:opacity-50"
    >
      <span>{value || label || 'Select time'}</span>
      <Clock className="size-4 text-muted-foreground" />
    </button>
  );
}
