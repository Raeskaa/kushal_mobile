import { useState, useCallback, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Calendar, Clock, MapPin, Users, Video, Building2, Monitor,
  Check, Circle, ArrowRight, ArrowLeft, Sparkles, Code, Presentation,
  Mic, GraduationCap, Handshake, Zap, ChevronRight, Loader2, PartyPopper,
  Palette, TicketCheck, Image, Megaphone, Plus,
} from 'lucide-react';
import { EVENT_TEMPLATES, type EventTemplate } from '../data/mockEventData';

interface EventCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: (eventData: EventCreationData, continueBuilding: boolean) => void;
}

export interface EventCreationData {
  title: string;
  description: string;
  date: string;
  time: string;
  format: 'virtual' | 'in-person' | 'hybrid';
  locationDetails: string;
  capacity: number;
  category: string;
  templateId?: string;
  isPaid: boolean;
  price?: number;
}

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  Code, Presentation, Users, Mic, GraduationCap, Handshake,
};

const FORMAT_OPTIONS = [
  { id: 'virtual' as const, label: 'Virtual', icon: Video, desc: 'Online via Zoom, Meet, etc.' },
  { id: 'in-person' as const, label: 'In Person', icon: Building2, desc: 'Physical venue' },
  { id: 'hybrid' as const, label: 'Hybrid', icon: Monitor, desc: 'Both virtual & in-person' },
];

type Step = 'template' | 'details' | 'review' | 'building' | 'complete';

// Building steps that animate through
const BUILDING_STEPS = [
  { label: 'Setting up event page...', icon: Palette },
  { label: 'Configuring registration...', icon: TicketCheck },
  { label: 'Preparing email templates...', icon: Megaphone },
  { label: 'Finalizing details...', icon: Sparkles },
];

export function EventCreationDialog({ open, onOpenChange, onEventCreated }: EventCreationDialogProps) {
  const [step, setStep] = useState<Step>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<EventTemplate | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [format, setFormat] = useState<'virtual' | 'in-person' | 'hybrid'>('virtual');
  const [locationDetails, setLocationDetails] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [category, setCategory] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState<number>(0);
  const [buildingStepIndex, setBuildingStepIndex] = useState(0);
  const [buildingProgress, setBuildingProgress] = useState(0);
  const [createdEventData, setCreatedEventData] = useState<EventCreationData | null>(null);

  const resetForm = useCallback(() => {
    setStep('template');
    setSelectedTemplate(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('10:00');
    setFormat('virtual');
    setLocationDetails('');
    setCapacity(100);
    setCategory('');
    setIsPaid(false);
    setPrice(0);
    setBuildingStepIndex(0);
    setBuildingProgress(0);
    setCreatedEventData(null);
  }, []);

  const handleTemplateSelect = (template: EventTemplate) => {
    setSelectedTemplate(template);
    setFormat(template.defaultFormat);
    setCapacity(template.defaultCapacity);
    setCategory(template.defaultCategory);
    setIsPaid(template.isPaid);
    setPrice(template.defaultPrice || 0);
    if (template.defaultFormat === 'virtual') setLocationDetails('Zoom');
    setStep('details');
  };

  const handleSkipTemplate = () => {
    setStep('details');
  };

  // Completion checklist
  const checklistItems = [
    { key: 'title', label: 'Event title', done: title.trim().length > 0 },
    { key: 'description', label: 'Description', done: description.trim().length > 0 },
    { key: 'date', label: 'Date & time', done: date.length > 0 },
    { key: 'format', label: 'Format', done: true },
    { key: 'location', label: 'Location details', done: locationDetails.trim().length > 0 },
    { key: 'capacity', label: 'Capacity set', done: capacity > 0 },
  ];
  const completedCount = checklistItems.filter(i => i.done).length;
  const completionPercent = Math.round((completedCount / checklistItems.length) * 100);

  const canProceedToReview = title.trim().length > 0 && date.length > 0;

  const handleCreate = () => {
    const eventData: EventCreationData = {
      title,
      description,
      date,
      time,
      format,
      locationDetails,
      capacity,
      category: category || selectedTemplate?.defaultCategory || 'General',
      templateId: selectedTemplate?.id,
      isPaid,
      price: isPaid ? price : undefined,
    };
    setCreatedEventData(eventData);
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

  const handleContinueBuilding = () => {
    if (createdEventData) onEventCreated(createdEventData, true);
    resetForm();
    onOpenChange(false);
  };

  const handleDoItLater = () => {
    if (createdEventData) onEventCreated(createdEventData, false);
    resetForm();
    onOpenChange(false);
  };

  const handleClose = (newOpen: boolean) => {
    if (!newOpen && step !== 'building') {
      if (step === 'complete' && createdEventData) {
        onEventCreated(createdEventData, false);
      }
      resetForm();
    }
    if (step === 'building') return; // prevent closing during build
    onOpenChange(newOpen);
  };

  const stepIndex = step === 'template' ? 0 : step === 'details' ? 1 : 2;
  const stepLabels = ['Choose Type', 'Event Details', 'Review'];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${step === 'building' || step === 'complete' ? 'hidden' : ''}`}>
            <Calendar className="size-5 text-primary" />
            Create New Event
          </DialogTitle>
          <DialogDescription className={step === 'building' || step === 'complete' ? 'hidden' : ''}>
            {step === 'template' && 'Pick a template to get started quickly, or start from scratch.'}
            {step === 'details' && 'Fill in the essential details for your event.'}
            {step === 'review' && 'Review your event before creating it.'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className={`flex items-center gap-2 py-2 ${step === 'building' || step === 'complete' ? 'hidden' : ''}`}>
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${i <= stepIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`size-6 rounded-full flex items-center justify-center text-xs ${
                  i < stepIndex ? 'bg-primary text-primary-foreground' : i === stepIndex ? 'bg-primary/15 text-primary border border-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {i < stepIndex ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span className="text-xs hidden sm:inline">{label}</span>
              </div>
              {i < stepLabels.length - 1 && (
                <div className={`flex-1 h-px ${i < stepIndex ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Template Selection */}
        {step === 'template' && (
          <div className="space-y-4">
            {/* Top CTAs */}
            <div className="flex flex-col gap-2.5">
              <Button className="w-full bg-primary hover:bg-primary/90 h-11">
                <Sparkles className="size-4 mr-2" />
                Create with AI
              </Button>
              <Button variant="outline" onClick={handleSkipTemplate} className="w-full h-11">
                <Plus className="size-4 mr-2" />
                Create Manually
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or pick a template</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-3">
              {EVENT_TEMPLATES.map((tpl) => {
                const IconComp = TEMPLATE_ICONS[tpl.icon] || Calendar;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleTemplateSelect(tpl)}
                    className="group relative flex flex-col items-start gap-2 p-4 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <IconComp className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground">{tpl.name}</p>
                        <p className="text-xs text-muted-foreground">{tpl.defaultDuration}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tpl.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {tpl.defaultFormat}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] py-0">
                        {tpl.defaultCapacity} cap
                      </Badge>
                      {tpl.isPaid && (
                        <Badge variant="secondary" className="text-[10px] py-0">
                          ${tpl.defaultPrice}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Details Form */}
        {step === 'details' && (
          <div className="space-y-4">
            {/* Completion Checklist Bar */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/60 border border-border">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">Completion</span>
                  <span className="text-xs text-primary">{completedCount}/{checklistItems.length}</span>
                </div>
                <Progress value={completionPercent} className="h-1.5" />
              </div>
              <div className="flex gap-1">
                {checklistItems.map((item) => (
                  <div
                    key={item.key}
                    title={item.label}
                    className={`size-5 rounded-full flex items-center justify-center ${
                      item.done ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {item.done ? <Check className="size-3" /> : <Circle className="size-3" />}
                  </div>
                ))}
              </div>
            </div>

            {selectedTemplate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 rounded-md">
                <Zap className="size-3 text-primary" />
                Using <span className="text-card-foreground">{selectedTemplate.name}</span> template
                <button onClick={() => { setSelectedTemplate(null); setStep('template'); }} className="ml-auto text-primary hover:underline">Change</button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="event-title">Event Title *</Label>
                <Input
                  id="event-title"
                  placeholder="e.g. React Workshop 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="event-desc">Description</Label>
                <Textarea
                  id="event-desc"
                  placeholder="What is this event about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 min-h-[72px]"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-date">Date *</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Format Selector */}
              <div>
                <Label>Format</Label>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setFormat(opt.id);
                        if (opt.id === 'virtual') setLocationDetails('Zoom');
                        else setLocationDetails('');
                      }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                        format === opt.id ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <opt.icon className="size-4" />
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="event-location">
                    {format === 'virtual' ? 'Platform' : format === 'hybrid' ? 'Venue + Link' : 'Venue'}
                  </Label>
                  <Input
                    id="event-location"
                    placeholder={format === 'virtual' ? 'Zoom, Meet, etc.' : 'Venue name & address'}
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="event-capacity">Capacity</Label>
                  <Input
                    id="event-capacity"
                    type="number"
                    min={1}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            {/* Completion Summary */}
            <div className="p-4 rounded-lg border border-border bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Event Readiness</span>
                <Badge variant={completionPercent === 100 ? 'default' : 'secondary'} className={completionPercent === 100 ? 'bg-primary' : ''}>
                  {completionPercent}%
                </Badge>
              </div>
              <Progress value={completionPercent} className="h-2" />
              <div className="grid grid-cols-2 gap-2">
                {checklistItems.map((item) => (
                  <div key={item.key} className="flex items-center gap-2 text-xs">
                    {item.done ? (
                      <Check className="size-3.5 text-primary" />
                    ) : (
                      <Circle className="size-3.5 text-muted-foreground" />
                    )}
                    <span className={item.done ? 'text-card-foreground' : 'text-muted-foreground'}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Preview Card */}
            <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
              <h3 className="text-card-foreground">{title || 'Untitled Event'}</h3>
              {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                {date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" /> {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
                {time && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> {time}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  {format === 'virtual' ? <Video className="size-3" /> : format === 'in-person' ? <Building2 className="size-3" /> : <Monitor className="size-3" />}
                  {format.charAt(0).toUpperCase() + format.slice(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" /> {capacity} seats
                </span>
                {locationDetails && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {locationDetails}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedTemplate && (
                  <Badge variant="secondary" className="text-[10px]">{selectedTemplate.name}</Badge>
                )}
                <Badge variant="secondary" className="text-[10px]">{category || 'General'}</Badge>
                {isPaid && <Badge variant="secondary" className="text-[10px]">${price}</Badge>}
              </div>
            </div>

            {/* Continue Building CTA */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground">
              <Sparkles className="size-4 text-primary flex-shrink-0" />
              <p>
                After creating, you can <span className="text-primary">continue building</span> by adding speakers, schedule, tickets, cover image, and more.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Building Animation */}
        {step === 'building' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="relative">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
                <Sparkles className="size-3 text-primary-foreground" />
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-card-foreground">Building your event</h3>
              <p className="text-sm text-muted-foreground">
                Setting up "<span className="text-card-foreground">{title}</span>" for you...
              </p>
            </div>

            <div className="w-full max-w-xs space-y-3">
              <Progress value={buildingProgress} className="h-2" />
              <div className="space-y-2">
                {BUILDING_STEPS.map((s, i) => {
                  const StepIcon = s.icon;
                  const isDone = i < buildingStepIndex;
                  const isCurrent = i === buildingStepIndex;
                  return (
                    <div
                      key={s.label}
                      className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                        isDone ? 'text-primary' : isCurrent ? 'text-card-foreground' : 'text-muted-foreground/40'
                      }`}
                    >
                      <div className={`size-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDone ? 'bg-primary/15' : isCurrent ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        {isDone ? (
                          <Check className="size-3 text-primary" />
                        ) : isCurrent ? (
                          <StepIcon className="size-3 text-primary animate-pulse" />
                        ) : (
                          <Circle className="size-2.5" />
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

        {/* Step 5: Completion / Confirmation */}
        {step === 'complete' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            <div className="relative">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <PartyPopper className="size-8 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="size-3 text-primary-foreground" />
              </div>
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-card-foreground">Event Created!</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                "<span className="text-card-foreground">{title}</span>" has been set up. You can continue building it now or come back later.
              </p>
            </div>

            {/* What you can still add */}
            <div className="w-full max-w-sm p-3 rounded-lg bg-muted/50 border border-border space-y-2">
              <p className="text-xs text-muted-foreground">You can still add:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { icon: Users, label: 'Speakers & hosts' },
                  { icon: Image, label: 'Cover image' },
                  { icon: TicketCheck, label: 'Tickets & pricing' },
                  { icon: Calendar, label: 'Detailed schedule' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <item.icon className="size-3 text-primary" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col w-full max-w-sm gap-2.5">
              <Button onClick={handleContinueBuilding} className="w-full bg-primary hover:bg-primary/90">
                <Sparkles className="size-4 mr-1.5" />
                Continue Building
              </Button>
              <Button variant="outline" onClick={handleDoItLater} className="w-full">
                I'll do it later
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <DialogFooter className={`flex items-center gap-2 ${step === 'building' || step === 'complete' ? 'hidden' : ''}`}>
          {step !== 'template' && (
            <Button
              variant="ghost"
              onClick={() => setStep(step === 'review' ? 'details' : 'template')}
              className="mr-auto"
            >
              <ArrowLeft className="size-4 mr-1.5" />
              Back
            </Button>
          )}

          {step === 'details' && (
            <Button
              onClick={() => setStep('review')}
              disabled={!canProceedToReview}
            >
              Review
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          )}

          {step === 'review' && (
            <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
              <Sparkles className="size-4 mr-1.5" />
              Create Event
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}