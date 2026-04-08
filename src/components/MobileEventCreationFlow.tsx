import { useState, useMemo, useCallback, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft, ArrowRight, Check, Sparkles, Calendar, Globe,
  Users, X, MapPin, Video, Building, Clock,
  Code, Presentation, Mic, GraduationCap, Handshake,
  DollarSign, Lock, Eye, UserPlus, CreditCard, Infinity,
  Repeat, ChevronRight, Sun, CalendarDays, Pencil, Zap,
  Loader2, PartyPopper, Palette, TicketCheck, Megaphone, Image, Circle
} from 'lucide-react';
import { EVENT_TEMPLATES, type EventTemplate } from '../data/mockEventData';
import { MobileTimePicker, TimePickerTrigger } from './MobileTimePicker';
import {
  MobileRecurrenceBuilder,
  RecurrenceTrigger,
  DEFAULT_RECURRENCE,
  getRecurrenceSummary,
  buildRRuleString,
  type RecurrenceConfig,
} from './MobileRecurrenceBuilder';

// ─── Props ───────────────────────────────────────────────────────
interface MobileEventCreationFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (eventData: EventCreationData, continueBuilding: boolean) => void;
  onSwitchToAI?: () => void;
  preselectedTemplateId?: string;
  communityId?: string;
  communityName?: string;
}

// ─── Creation Data ───────────────────────────────────────────────
export interface EventCreationData {
  title: string;
  description: string;
  category: string;
  templateId?: string;
  date: string;
  time: string;
  endTime: string;
  endDate?: string;
  timezone: string;
  durationMinutes?: number;
  isMultiDay: boolean;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceEnd?: string;
  format: 'virtual' | 'in-person' | 'hybrid';
  locationDetails: string;
  virtualLink?: string;
  capacity: number;
  visibility: 'public' | 'private';
  accessType: 'open' | 'waitlist' | 'screened' | 'paid';
  isPaid: boolean;
  price?: number;
  communityId?: string;
  communityName?: string;
  tags?: string[];
}

type Step = 1 | 2 | 3 | 'building' | 'complete';

const STEP_LABELS: { num: 1 | 2 | 3; label: string }[] = [
  { num: 1, label: 'Details' },
  { num: 2, label: 'Schedule' },
  { num: 3, label: 'Review' },
];

// Building animation steps
const BUILDING_STEPS = [
  { label: 'Setting up event page...', icon: Palette },
  { label: 'Configuring registration...', icon: TicketCheck },
  { label: 'Preparing email templates...', icon: Megaphone },
  { label: 'Finalizing details...', icon: Sparkles },
];

const CATEGORIES = [
  'Technology', 'Design', 'Business', 'Marketing',
  'Education', 'Health', 'Finance', 'Science',
  'Arts', 'Networking',
];

const TEMPLATE_ICONS: Record<string, React.ComponentType<any>> = {
  Code, Presentation, Users, Mic, GraduationCap, Handshake,
};

const CAPACITY_PRESETS = [25, 50, 100, 200, 500];

const COMMON_TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern (ET)', short: 'ET' },
  { value: 'America/Chicago', label: 'Central (CT)', short: 'CT' },
  { value: 'America/Denver', label: 'Mountain (MT)', short: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)', short: 'PT' },
  { value: 'Europe/London', label: 'GMT / London', short: 'GMT' },
  { value: 'Europe/Berlin', label: 'Central European (CET)', short: 'CET' },
  { value: 'Asia/Kolkata', label: 'India (IST)', short: 'IST' },
  { value: 'Asia/Tokyo', label: 'Japan (JST)', short: 'JST' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', short: 'AEST' },
];

// ─── Helpers ─────────────────────────────────────────────────────
function parseTime(t: string): number {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const ampm = match[3].toUpperCase();
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function formatTime(totalMinutes: number): string {
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 > 12 ? h24 - 12 : h24 === 0 ? 12 : h24;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function calculateDuration(start: string, end: string): string {
  const diff = parseTime(end) - parseTime(start);
  if (diff <= 0) return '';
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h`;
  return `${mins}m`;
}

function getQuickDates(): { label: string; value: string }[] {
  const today = new Date();
  const dates: { label: string; value: string }[] = [];
  const seen = new Set<string>();

  const addDate = (label: string, d: Date) => {
    const value = d.toISOString().split('T')[0];
    if (!seen.has(value)) {
      seen.add(value);
      dates.push({ label, value });
    }
  };

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  addDate('Tomorrow', tomorrow);

  const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSat);
  addDate('This Saturday', saturday);

  const daysUntilFri = (5 - today.getDay() + 7) % 7 || 7;
  const nextFri = new Date(today);
  nextFri.setDate(today.getDate() + daysUntilFri);
  if (nextFri.toISOString().split('T')[0] === saturday.toISOString().split('T')[0]) {
    nextFri.setDate(nextFri.getDate() + 7);
  }
  addDate('Next Friday', nextFri);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  addDate('Next week', nextWeek);

  return dates;
}

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <div className="flex items-center gap-2 pt-2 pb-1">
      <Icon className="size-3.5 text-primary" />
      <span className="text-[11px] text-primary tracking-wide uppercase">{label}</span>
      <div className="flex-1 h-px bg-primary/10" />
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────
export function MobileEventCreationFlow({
  open,
  onClose,
  onComplete,
  onSwitchToAI,
  preselectedTemplateId,
  communityId,
  communityName,
}: MobileEventCreationFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [animDir, setAnimDir] = useState<'forward' | 'back'>('forward');

  // Step 1: What
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(preselectedTemplateId);

  // Step 2: When & Where
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [endDate, setEndDate] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [isMultiDay, setIsMultiDay] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceConfig>(DEFAULT_RECURRENCE);
  const [format, setFormat] = useState<'virtual' | 'in-person' | 'hybrid'>('virtual');
  const [venueAddress, setVenueAddress] = useState('');
  const [virtualLink, setVirtualLink] = useState('');
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  // Time picker sheets
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showRecurrenceBuilder, setShowRecurrenceBuilder] = useState(false);

  // Capacity
  const [capacity, setCapacity] = useState(100);
  const [customCapacity, setCustomCapacity] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);

  // Defaults for data output
  const [visibility] = useState<'public' | 'private'>('public');
  const [accessType] = useState<'open' | 'waitlist' | 'screened' | 'paid'>('open');

  // Post-creation (building animation)
  const [buildingStepIndex, setBuildingStepIndex] = useState(0);
  const [buildingProgress, setBuildingProgress] = useState(0);

  // Template application
  const applyTemplate = useCallback((template: EventTemplate) => {
    setSelectedTemplateId(template.id);
    setDescription(template.description);
    setCategory(template.defaultCategory);
    setFormat(template.defaultFormat);
    setCapacity(template.defaultCapacity);
    const startMinutes = parseTime(time);
    const endMinutes = startMinutes + template.defaultDurationMinutes;
    setEndTime(formatTime(endMinutes));
  }, [time]);

  useMemo(() => {
    if (preselectedTemplateId && open) {
      const t = EVENT_TEMPLATES.find(t => t.id === preselectedTemplateId);
      if (t) applyTemplate(t);
    }
  }, [preselectedTemplateId, open]);

  const handleStartTimeChange = useCallback((newTime: string) => {
    setTime(newTime);
    const template = selectedTemplateId ? EVENT_TEMPLATES.find(t => t.id === selectedTemplateId) : null;
    if (template) {
      const startMin = parseTime(newTime);
      setEndTime(formatTime(startMin + template.defaultDurationMinutes));
    } else {
      const oldStart = parseTime(time);
      const oldEnd = parseTime(endTime);
      const gap = oldEnd - oldStart;
      if (gap > 0) {
        const newStart = parseTime(newTime);
        setEndTime(formatTime(newStart + gap));
      }
    }
  }, [time, endTime, selectedTemplateId]);

  const duration = calculateDuration(time, endTime);
  const durationMinutes = parseTime(endTime) - parseTime(time);

  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const computedLocationDetails = useMemo(() => {
    if (format === 'virtual') return virtualLink || 'Zoom';
    if (format === 'in-person') return venueAddress;
    const parts: string[] = [];
    if (venueAddress) parts.push(venueAddress);
    if (virtualLink) parts.push(virtualLink);
    return parts.join(' + ') || '';
  }, [format, venueAddress, virtualLink]);

  const canProceedStep1 = title.trim().length > 0;
  const canProceedStep2 = date.length > 0 && (!isMultiDay || endDate.length > 0);
  const endTimeError = !isAllDay && durationMinutes <= 0 && !isMultiDay;

  const selectedTemplate = selectedTemplateId ? EVENT_TEMPLATES.find(t => t.id === selectedTemplateId) : null;
  const currentTz = COMMON_TIMEZONES.find(tz => tz.value === timezone);
  const quickDates = useMemo(() => getQuickDates(), []);

  const goTo = (target: Step) => {
    setAnimDir(target > step ? 'forward' : 'back');
    setStep(target);
  };

  const handleComplete = () => {
    setStep('building');
    setBuildingStepIndex(0);
    setBuildingProgress(0);
  };

  // Building animation effect
  useEffect(() => {
    if (step !== 'building') return;

    const totalDuration = 2800;
    const stepDuration = totalDuration / BUILDING_STEPS.length;
    const progressInterval = 30;

    const progressTimer = setInterval(() => {
      setBuildingProgress(prev => {
        const next = prev + (100 / (totalDuration / progressInterval));
        return next >= 100 ? 100 : next;
      });
    }, progressInterval);

    const stepTimers = BUILDING_STEPS.map((_, i) =>
      setTimeout(() => setBuildingStepIndex(i), i * stepDuration)
    );

    const completeTimer = setTimeout(() => {
      setStep('complete');
    }, totalDuration + 200);

    return () => {
      clearInterval(progressTimer);
      stepTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [step]);

  const buildEventData = () => {
    const rruleString = recurrence.frequency !== 'none' ? buildRRuleString(recurrence, date) : undefined;
    return {
      title,
      description,
      category,
      templateId: selectedTemplateId,
      date: date || getTomorrowDate(),
      time: isAllDay ? '' : time,
      endTime: isAllDay ? '' : endTime,
      endDate: isMultiDay ? endDate : undefined,
      timezone,
      durationMinutes: isAllDay ? undefined : (durationMinutes > 0 ? durationMinutes : undefined),
      isMultiDay,
      isAllDay,
      isRecurring: recurrence.frequency !== 'none',
      recurrenceRule: rruleString,
      recurrenceEnd: recurrence.endType === 'on_date' ? recurrence.endOnDate : undefined,
      format,
      locationDetails: computedLocationDetails,
      virtualLink: (format === 'virtual' || format === 'hybrid') ? virtualLink : undefined,
      capacity: isUnlimited ? 9999 : (customCapacity ? parseInt(customCapacity) : capacity),
      visibility,
      accessType,
      isPaid: false as const,
      communityId,
      communityName,
    };
  };

  const handleContinueBuilding = () => {
    onComplete(buildEventData(), true);
    resetAndClose();
  };

  const handleDoItLater = () => {
    onComplete(buildEventData(), false);
    resetAndClose();
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setBuildingStepIndex(0);
      setBuildingProgress(0);
      setTitle(''); setDescription(''); setCategory(''); setSelectedTemplateId(undefined);
      setDate(''); setTime('10:00 AM'); setEndTime('11:00 AM'); setEndDate('');
      setTimezone('America/New_York'); setIsMultiDay(false); setIsAllDay(false);
      setRecurrence(DEFAULT_RECURRENCE);
      setFormat('virtual'); setVenueAddress(''); setVirtualLink('');
      setCapacity(100); setCustomCapacity(''); setIsUnlimited(false);
    }, 300);
  };

  const handleClose = () => {
    if (step === 'building') return; // prevent closing during build animation
    if (step === 'complete') {
      onComplete(buildEventData(), false);
    }
    resetAndClose();
  };

  // ─── Step progress bar ─────────────────────────────────────────
  const StepProgress = () => (
    <div className="px-4 pt-4 pb-2">
      {/* Progress bar */}
      <div className="flex gap-1.5 mb-3">
        {STEP_LABELS.map(({ num }) => (
          <div
            key={num}
            className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{
              backgroundColor: num <= step ? 'var(--primary)' : 'var(--muted)',
              opacity: num <= step ? (num === step ? 1 : 0.4) : 1,
            }}
          />
        ))}
      </div>
      {/* Labels */}
      <div className="flex justify-between">
        {STEP_LABELS.map(({ num, label }) => (
          <button
            key={num}
            onClick={() => num < step && goTo(num)}
            disabled={num > step}
            className="flex items-center gap-1.5"
          >
            <div className={`size-5 rounded-full flex items-center justify-center text-[9px] transition-all duration-300 ${
              num === step
                ? 'bg-primary text-primary-foreground'
                : num < step
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {num < step ? <Check className="size-2.5" /> : num}
            </div>
            <span className={`text-[11px] transition-colors ${
              num === step ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── Review Row ────────────────────────────────────────────────
  const ReviewRow = ({
    icon: Icon,
    label,
    value,
    subValue,
    editStep,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    subValue?: string;
    editStep: Step;
  }) => (
    <div className="flex items-start gap-3 p-3.5 group">
      <div className="size-8 rounded-lg bg-primary/8 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className="text-[13px] text-foreground mt-0.5">{value}</p>
        {subValue && <p className="text-[11px] text-muted-foreground mt-0.5">{subValue}</p>}
      </div>
      <button
        onClick={() => goTo(editStep)}
        className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 opacity-0 group-hover:opacity-100 active:opacity-100 transition-all flex-shrink-0 mt-0.5"
      >
        <Pencil className="size-3" />
      </button>
    </div>
  );

  return (
    <>
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[92vh] rounded-t-3xl p-0 flex flex-col">
        {/* Header — hidden during building/complete */}
        {step !== 'building' && step !== 'complete' && (
          <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-[17px]">
                  Create Event
                  {communityName && (
                    <span className="text-[13px] text-muted-foreground ml-1.5">in {communityName}</span>
                  )}
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {step === 1 ? 'Name and describe your event'
                    : step === 2 ? 'Schedule, location & capacity'
                    : 'Review and create your event'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onSwitchToAI && (
                  <button
                    onClick={() => { handleClose(); setTimeout(() => onSwitchToAI?.(), 350); }}
                    className="flex items-center gap-1.5 text-[12px] text-primary px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 active:scale-95 transition-all"
                  >
                    <Sparkles className="size-3.5" />
                    Use AI
                  </button>
                )}
                <button onClick={handleClose} className="p-2 hover:bg-muted rounded-lg active:scale-95 transition-all">
                  <X className="size-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          </SheetHeader>
        )}

        {step !== 'building' && step !== 'complete' && <StepProgress />}

        {/* Content — with step transition */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div
            key={step}
            className="animate-in fade-in duration-200"
            style={{ animationFillMode: 'backwards', animationDelay: '50ms' }}
          >

          {/* ═══ STEP 1: DETAILS ═══ */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Template picker */}
              <div>
                <h4 className="text-[12px] text-secondary-foreground tracking-wide uppercase mb-3">
                  Start from template
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {EVENT_TEMPLATES.map((template) => {
                    const IconComp = TEMPLATE_ICONS[template.icon] || Calendar;
                    const isSelected = selectedTemplateId === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => isSelected ? setSelectedTemplateId(undefined) : applyTemplate(template)}
                        className={`flex flex-col items-start p-3 rounded-xl border transition-all active:scale-[0.97] ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                        }`}
                      >
                        <div className={`size-8 rounded-lg flex items-center justify-center mb-2 ${
                          isSelected ? 'bg-primary/15' : 'bg-muted'
                        }`}>
                          <IconComp className={`size-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <span className="text-[12px] text-card-foreground">{template.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {template.defaultDuration} · {template.isPaid ? `$${template.defaultPrice}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Applied template indicator */}
              {selectedTemplate && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/15">
                  <Zap className="size-3.5 text-primary flex-shrink-0" />
                  <p className="text-[12px] text-primary flex-1">
                    <span className="text-primary">{selectedTemplate.name}</span> template applied — fields auto-filled
                  </p>
                  <button
                    onClick={() => { setSelectedTemplateId(undefined); setDescription(''); setCategory(''); }}
                    className="text-primary/60 hover:text-primary"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[11px] text-muted-foreground">or start from scratch</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Event Name */}
              <div>
                <label className="text-[13px] text-foreground mb-1.5 block">
                  Event name <span className="text-destructive">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Product Launch Meetup"
                  className="text-[15px]"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[13px] text-foreground mb-1.5 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this event about? (optional)"
                  className="text-[14px] resize-none"
                  rows={3}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-[13px] text-foreground mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(category === cat ? '' : cat)}
                      className={`px-3 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 ${
                        category === cat
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 2: SCHEDULE, LOCATION & CAPACITY ═══ */}
          {step === 2 && (
            <div className="space-y-5">

              {/* ── Section: Date & Time ── */}
              <SectionHeader icon={Calendar} label="Date & Time" />

              {/* Quick Date Chips */}
              <div>
                <label className="text-[13px] text-foreground mb-2 block">
                  Date <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2 mb-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {quickDates.map((qd) => (
                    <button
                      key={qd.value}
                      onClick={() => setDate(qd.value)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 ${
                        date === qd.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {qd.label}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={getTomorrowDate()}
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-input-background text-[14px] text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                {date && (
                  <p className="text-[12px] text-muted-foreground mt-1">{formatDateForDisplay(date)}</p>
                )}
              </div>

              {/* Toggle row: Multi-day + All-day */}
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-[13px] text-card-foreground">Multi-day event</p>
                      <p className="text-[11px] text-muted-foreground">Spans multiple days</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMultiDay(!isMultiDay)}
                    className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${
                      isMultiDay ? 'bg-primary justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <div className="size-5 rounded-full bg-white transition-all" />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <Sun className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-[13px] text-card-foreground">All-day event</p>
                      <p className="text-[11px] text-muted-foreground">No specific start/end time</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAllDay(!isAllDay)}
                    className={`w-10 h-6 rounded-full transition-all flex items-center px-0.5 ${
                      isAllDay ? 'bg-primary justify-end' : 'bg-muted justify-start'
                    }`}
                  >
                    <div className="size-5 rounded-full bg-white transition-all" />
                  </button>
                </div>
              </div>

              {/* End Date (if multi-day) */}
              {isMultiDay && (
                <div>
                  <label className="text-[13px] text-foreground mb-1.5 block">
                    End date <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={date || getTomorrowDate()}
                      className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-input-background text-[14px] text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  {endDate && (
                    <p className="text-[12px] text-muted-foreground mt-1">{formatDateForDisplay(endDate)}</p>
                  )}
                </div>
              )}

              {/* Time Selection */}
              {!isAllDay && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[13px] text-foreground mb-1.5 block">Start time</label>
                      <TimePickerTrigger
                        value={time}
                        onClick={() => setShowStartTimePicker(true)}
                      />
                    </div>
                    <div>
                      <label className="text-[13px] text-foreground mb-1.5 block">End time</label>
                      <TimePickerTrigger
                        value={endTime}
                        onClick={() => setShowEndTimePicker(true)}
                      />
                    </div>
                  </div>

                  {duration && !endTimeError && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5">
                      <Clock className="size-3.5 text-primary" />
                      <span className="text-[12px] text-primary">Duration: {duration}</span>
                      {selectedTemplate && (
                        <span className="text-[11px] text-muted-foreground">
                          ({selectedTemplate.defaultDuration} from template)
                        </span>
                      )}
                    </div>
                  )}
                  {endTimeError && !isMultiDay && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/5">
                      <Clock className="size-3.5 text-destructive" />
                      <span className="text-[12px] text-destructive">End time must be after start time</span>
                    </div>
                  )}
                </>
              )}

              {/* Timezone + Recurrence in a compact row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[13px] text-foreground mb-1.5 block">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none z-10" />
                    <button
                      onClick={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
                      className="w-full h-10 pl-10 pr-2 rounded-md border border-input bg-input-background text-[13px] text-foreground text-left flex items-center justify-between"
                    >
                      <span className="truncate">{currentTz?.short || 'ET'}</span>
                      <ChevronRight className={`size-3.5 text-muted-foreground transition-transform flex-shrink-0 ${showTimezoneDropdown ? 'rotate-90' : ''}`} />
                    </button>
                    {showTimezoneDropdown && (
                      <div className="absolute z-50 top-12 left-0 right-0 bg-popover border border-border rounded-lg max-h-48 overflow-y-auto">
                        {COMMON_TIMEZONES.map((tz) => (
                          <button
                            key={tz.value}
                            onClick={() => { setTimezone(tz.value); setShowTimezoneDropdown(false); }}
                            className={`w-full px-3 py-2.5 text-left text-[13px] hover:bg-muted transition-colors flex items-center justify-between ${
                              timezone === tz.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                            }`}
                          >
                            <span>{tz.label}</span>
                            {timezone === tz.value && <Check className="size-3.5 text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[13px] text-foreground mb-1.5 block">Repeat</label>
                  <RecurrenceTrigger
                    config={recurrence}
                    onClick={() => setShowRecurrenceBuilder(true)}
                  />
                </div>
              </div>

              {/* ── Section: Location ── */}
              <SectionHeader icon={MapPin} label="Location" />

              {/* Format */}
              <div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'virtual' as const, icon: Video, label: 'Virtual' },
                    { id: 'in-person' as const, icon: Building, label: 'In-Person' },
                    { id: 'hybrid' as const, icon: Globe, label: 'Hybrid' },
                  ].map((option) => {
                    const isSelected = format === option.id;
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => setFormat(option.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all active:scale-[0.97] ${
                          isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                        }`}
                      >
                        <Icon className={`size-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-[12px] ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location Fields */}
              {(format === 'in-person' || format === 'hybrid') && (
                <div>
                  <label className="text-[13px] text-foreground mb-1.5 block">Venue / Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      value={venueAddress}
                      onChange={(e) => setVenueAddress(e.target.value)}
                      placeholder="Venue name or address"
                      className="pl-10 text-[14px]"
                    />
                  </div>
                </div>
              )}

              {(format === 'virtual' || format === 'hybrid') && (
                <div>
                  <label className="text-[13px] text-foreground mb-1.5 block">Meeting link</label>
                  <div className="relative">
                    <Video className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      value={virtualLink}
                      onChange={(e) => setVirtualLink(e.target.value)}
                      placeholder="Zoom, Meet, or other link"
                      className="pl-10 text-[14px]"
                    />
                  </div>
                </div>
              )}

              {/* ── Section: Capacity ── */}
              <SectionHeader icon={Users} label="Capacity" />

              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {CAPACITY_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      onClick={() => { setCapacity(preset); setCustomCapacity(''); setIsUnlimited(false); }}
                      className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 ${
                        capacity === preset && !isUnlimited && !customCapacity
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-card text-muted-foreground'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <button
                    onClick={() => { setIsUnlimited(!isUnlimited); setCustomCapacity(''); }}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 flex items-center gap-1 ${
                      isUnlimited ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'
                    }`}
                  >
                    <Infinity className="size-3" /> Unlimited
                  </button>
                </div>
                {!isUnlimited && (
                  <Input
                    type="number"
                    value={customCapacity || capacity.toString()}
                    onChange={(e) => setCustomCapacity(e.target.value)}
                    placeholder="Custom capacity"
                    className="text-[14px]"
                  />
                )}
              </div>
            </div>
          )}

          {/* ═══ STEP 3: REVIEW ═══ */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Event title hero */}
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-4 pt-4 pb-3 border-b border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[18px] text-foreground">{title}</h3>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {category && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">
                            {category}
                          </span>
                        )}
                        {selectedTemplate && (
                          <span className="inline-block px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px]">
                            {selectedTemplate.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => goTo(1)}
                      className="size-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex-shrink-0 ml-2"
                    >
                      <Pencil className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="divide-y divide-border">
                  <ReviewRow
                    icon={Calendar}
                    label="Date & Time"
                    value={
                      `${formatDateForDisplay(date || getTomorrowDate())}${isMultiDay && endDate ? ` — ${formatDateForDisplay(endDate)}` : ''}`
                    }
                    subValue={
                      isAllDay
                        ? 'All day'
                        : `${time} — ${endTime}${duration ? ` (${duration})` : ''} · ${currentTz?.short || 'ET'}`
                    }
                    editStep={2}
                  />

                  {recurrence.frequency !== 'none' && (
                    <ReviewRow
                      icon={Repeat}
                      label="Recurrence"
                      value={getRecurrenceSummary(recurrence)}
                      editStep={2}
                    />
                  )}

                  <ReviewRow
                    icon={format === 'virtual' ? Video : format === 'in-person' ? MapPin : Globe}
                    label="Format & Location"
                    value={format === 'virtual' ? 'Virtual' : format === 'in-person' ? 'In-Person' : 'Hybrid'}
                    subValue={computedLocationDetails || undefined}
                    editStep={2}
                  />

                  <ReviewRow
                    icon={Users}
                    label="Capacity"
                    value={isUnlimited ? 'Unlimited capacity' : `${customCapacity || capacity} attendees`}
                    editStep={2}
                  />

                  {communityName && (
                    <ReviewRow
                      icon={Building}
                      label="Community"
                      value={communityName}
                      editStep={1}
                    />
                  )}
                </div>
              </div>

              {/* Description Preview */}
              {description && (
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Description</p>
                    <button
                      onClick={() => goTo(1)}
                      className="size-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all -mt-0.5 -mr-1"
                    >
                      <Pencil className="size-3" />
                    </button>
                  </div>
                  <p className="text-[13px] text-foreground whitespace-pre-wrap line-clamp-4">{description}</p>
                </div>
              )}

              {/* What's next hint */}
              <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 flex gap-3">
                <Sparkles className="size-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] text-foreground mb-0.5">What happens next?</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Your event will be saved as a draft. You can then add a cover image, build an agenda, invite speakers, and configure tickets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══ BUILDING ANIMATION ═══ */}
          {step === 'building' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-8">
              {/* Spinner */}
              <div className="relative">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="size-10 text-primary animate-spin" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="size-3.5 text-primary-foreground" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-1.5">
                <h3 className="text-[17px] text-foreground">Building your event</h3>
                <p className="text-[13px] text-muted-foreground">
                  Setting up "<span className="text-foreground">{title}</span>" for you...
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs space-y-4">
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-100"
                    style={{ width: `${buildingProgress}%` }}
                  />
                </div>

                {/* Step list */}
                <div className="space-y-2.5">
                  {BUILDING_STEPS.map((s, i) => {
                    const StepIcon = s.icon;
                    const isDone = i < buildingStepIndex;
                    const isCurrent = i === buildingStepIndex;
                    return (
                      <div
                        key={s.label}
                        className={`flex items-center gap-3 text-[13px] transition-all duration-300 ${
                          isDone ? 'text-primary' : isCurrent ? 'text-foreground' : 'text-muted-foreground/40'
                        }`}
                      >
                        <div className={`size-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isDone ? 'bg-primary/15' : isCurrent ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                          {isDone ? (
                            <Check className="size-3.5 text-primary" />
                          ) : isCurrent ? (
                            <StepIcon className="size-3.5 text-primary animate-pulse" />
                          ) : (
                            <Circle className="size-3" />
                          )}
                        </div>
                        <span>{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ═══ COMPLETION / CONFIRMATION ═══ */}
          {step === 'complete' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6">
              {/* Success icon */}
              <div className="relative">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <PartyPopper className="size-10 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-primary flex items-center justify-center">
                  <Check className="size-3.5 text-primary-foreground" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center space-y-1.5">
                <h3 className="text-[17px] text-foreground">Event Created!</h3>
                <p className="text-[13px] text-muted-foreground max-w-[280px]">
                  "<span className="text-foreground">{title}</span>" has been set up. You can continue building it now or come back later.
                </p>
              </div>

              {/* What you can still add */}
              <div className="w-full rounded-xl border border-border bg-card p-4 space-y-3">
                <p className="text-[12px] text-muted-foreground">You can still add:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Users, label: 'Speakers & hosts' },
                    { icon: Image, label: 'Cover image' },
                    { icon: TicketCheck, label: 'Tickets & pricing' },
                    { icon: Calendar, label: 'Detailed schedule' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <item.icon className="size-3.5 text-primary" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col w-full gap-2.5">
                <Button onClick={handleContinueBuilding} className="w-full bg-primary text-primary-foreground" size="lg">
                  <Sparkles className="size-4 mr-1.5" />
                  Continue Building
                </Button>
                <Button variant="outline" onClick={handleDoItLater} className="w-full" size="lg">
                  I'll do it later
                </Button>
              </div>
            </div>
          )}

          </div>
        </div>

        {/* Bottom navigation — hidden during building/complete */}
        {step !== 'building' && step !== 'complete' && (
          <div className="px-4 py-4 border-t border-border bg-card flex-shrink-0">
            <div className="flex gap-2">
              {step > 1 ? (
                <Button
                  onClick={() => goTo((step - 1) as Step)}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <ArrowLeft className="size-4 mr-1.5" />
                  Back
                </Button>
              ) : (
                <Button onClick={handleClose} variant="outline" size="lg" className="flex-1">
                  Cancel
                </Button>
              )}

              {step < 3 ? (
                <Button
                  onClick={() => goTo((step + 1) as Step)}
                  disabled={
                    (step === 1 && !canProceedStep1) ||
                    (step === 2 && (!canProceedStep2 || endTimeError))
                  }
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  {step === 2 ? 'Review' : 'Next'}
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  size="lg"
                  className="flex-1 bg-primary text-primary-foreground"
                >
                  <Check className="size-4 mr-1.5" />
                  Create Event
                </Button>
              )}
            </div>
          </div>
        )}
      </SheetContent>

      {/* Sub-sheets */}
      <MobileTimePicker
        open={showStartTimePicker}
        onClose={() => setShowStartTimePicker(false)}
        value={time}
        onChange={handleStartTimeChange}
        label="Start Time"
      />
      <MobileTimePicker
        open={showEndTimePicker}
        onClose={() => setShowEndTimePicker(false)}
        value={endTime}
        onChange={setEndTime}
        label="End Time"
        minTime={time}
      />
      <MobileRecurrenceBuilder
        open={showRecurrenceBuilder}
        onClose={() => setShowRecurrenceBuilder(false)}
        value={recurrence}
        onChange={setRecurrence}
        eventStartDate={date}
      />
    </Sheet>
    </>
  );
}