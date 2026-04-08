import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Calendar, Clock, MapPin, Video, Building, Globe,
  X, Sparkles, Eye, Lock, Users, UserPlus, CreditCard,
  DollarSign, Infinity, Save
} from 'lucide-react';
import { type MockEvent } from '../data/mockEventData';
import { type LeapyContext } from '../data/leapyContexts';

export type InlineEditField =
  | 'title'
  | 'description'
  | 'datetime'
  | 'location'
  | 'capacity'
  | 'visibility'
  | 'access';

interface MobileInlineEditSheetProps {
  open: boolean;
  field: InlineEditField | null;
  event: MockEvent;
  onClose: () => void;
  onSave: (eventId: string, changes: Partial<MockEvent>) => void;
  onSwitchToLeapy?: (context: LeapyContext) => void;
}

const FIELD_LABELS: Record<InlineEditField, string> = {
  title: 'Event Title',
  description: 'Description',
  datetime: 'Date & Time',
  location: 'Location',
  capacity: 'Capacity',
  visibility: 'Visibility',
  access: 'Access Type',
};

const LEAPY_CONTEXTS: Record<InlineEditField, string> = {
  title: 'edit_event_details',
  description: 'edit_event_description',
  datetime: 'edit_event_details',
  location: 'set_location',
  capacity: 'edit_event_details',
  visibility: 'edit_event_details',
  access: 'set_registration',
};

const TIME_SLOTS = (() => {
  const slots: string[] = [];
  for (let h = 6; h < 23; h++) {
    for (let m = 0; m < 60; m += 15) {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const minStr = m.toString().padStart(2, '0');
      slots.push(`${hour12}:${minStr} ${ampm}`);
    }
  }
  return slots;
})();

const CAPACITY_PRESETS = [25, 50, 100, 200, 500];

export function MobileInlineEditSheet({
  open,
  field,
  event,
  onClose,
  onSave,
  onSwitchToLeapy,
}: MobileInlineEditSheetProps) {
  // Title
  const [title, setTitle] = useState(event.title);
  // Description
  const [description, setDescription] = useState(event.description);
  // DateTime
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time || '10:00 AM');
  const [showTimePicker, setShowTimePicker] = useState(false);
  // Location
  const [format, setFormat] = useState<'virtual' | 'in-person' | 'hybrid'>(event.location as any || 'virtual');
  const [locationDetails, setLocationDetails] = useState(event.locationDetails || '');
  // Capacity
  const [capacity, setCapacity] = useState(event.capacity || 100);
  const [customCapacity, setCustomCapacity] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  // Visibility
  const [visibility, setVisibility] = useState<'public' | 'private'>(event.visibility || 'public');
  // Access
  const [accessType, setAccessType] = useState<'open' | 'waitlist' | 'screened' | 'paid'>(event.accessType || 'open');
  const [price, setPrice] = useState(event.price?.toString() || '');

  // Reset form when event or field changes
  useEffect(() => {
    if (open) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(event.date);
      setTime(event.time || '10:00 AM');
      setFormat((event.location as any) || 'virtual');
      setLocationDetails(event.locationDetails || '');
      setCapacity(event.capacity || 100);
      setCustomCapacity('');
      setIsUnlimited(false);
      setVisibility(event.visibility || 'public');
      setAccessType(event.accessType || 'open');
      setPrice(event.price?.toString() || '');
      setShowTimePicker(false);
    }
  }, [open, event.id, field]);

  const handleSave = () => {
    if (!field) return;

    let changes: Partial<MockEvent> = {};

    switch (field) {
      case 'title':
        changes = {
          title,
          completionChecklist: event.completionChecklist
            ? { ...event.completionChecklist, hasTitle: !!title.trim() }
            : undefined,
        };
        break;
      case 'description':
        changes = {
          description,
          completionChecklist: event.completionChecklist
            ? { ...event.completionChecklist, hasDescription: !!description.trim() }
            : undefined,
        };
        break;
      case 'datetime':
        changes = {
          date,
          time,
          completionChecklist: event.completionChecklist
            ? { ...event.completionChecklist, hasDateTime: !!(date && time) }
            : undefined,
        };
        break;
      case 'location':
        changes = {
          location: format,
          locationDetails,
          completionChecklist: event.completionChecklist
            ? { ...event.completionChecklist, hasLocation: true }
            : undefined,
        };
        break;
      case 'capacity':
        changes = {
          capacity: isUnlimited ? 9999 : (customCapacity ? parseInt(customCapacity) : capacity),
        };
        break;
      case 'visibility':
        changes = {
          visibility,
          isPublic: visibility === 'public',
        };
        break;
      case 'access':
        changes = {
          accessType,
          isPaid: accessType === 'paid',
          price: accessType === 'paid' ? parseFloat(price) || 0 : event.price,
        };
        break;
    }

    onSave(event.id, changes);
    onClose();
  };

  const handleLeapySwitch = () => {
    if (!field || !onSwitchToLeapy) return;
    onClose();
    setTimeout(() => {
      onSwitchToLeapy({
        type: LEAPY_CONTEXTS[field] as any,
        entityId: event.id,
        entityData: event,
      });
    }, 300);
  };

  if (!field) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl p-0 flex flex-col max-h-[80vh]">
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[16px]">
              Edit {FIELD_LABELS[field]}
            </SheetTitle>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
              <X className="size-5 text-muted-foreground" />
            </button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* ═══ TITLE ═══ */}
          {field === 'title' && (
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event name"
                className="text-[16px]"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                {title.length}/120 characters
              </p>
            </div>
          )}

          {/* ═══ DESCRIPTION ═══ */}
          {field === 'description' && (
            <div className="space-y-3">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                className="text-[14px] min-h-[150px] resize-none"
                autoFocus
              />
              <p className="text-[11px] text-muted-foreground">
                {description.length} characters
              </p>
            </div>
          )}

          {/* ═══ DATE & TIME ═══ */}
          {field === 'datetime' && (
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-foreground mb-1.5 block">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-md border border-input bg-input-background text-[14px] text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-[13px] text-foreground mb-1.5 block">Time</label>
                <div className="relative">
                  <button
                    onClick={() => setShowTimePicker(!showTimePicker)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-input-background text-[14px] text-foreground text-left flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      <span>{time}</span>
                    </div>
                  </button>
                  {showTimePicker && (
                    <div className="absolute z-50 top-12 left-0 right-0 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => {
                            setTime(slot);
                            setShowTimePicker(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-[13px] hover:bg-muted transition-colors ${
                            time === slot ? 'bg-primary/10 text-primary' : 'text-foreground'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═══ LOCATION ═══ */}
          {field === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="text-[13px] text-foreground mb-2 block">Format</label>
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
              <div>
                <label className="text-[13px] text-foreground mb-1.5 block">
                  {format === 'virtual' ? 'Meeting link' : format === 'hybrid' ? 'Venue & meeting link' : 'Venue / Address'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <Input
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder={format === 'virtual' ? 'Zoom, Meet, or custom link' : 'Venue name or address'}
                    className="pl-10 text-[14px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ═══ CAPACITY ═══ */}
          {field === 'capacity' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {CAPACITY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setCapacity(preset);
                      setCustomCapacity('');
                      setIsUnlimited(false);
                    }}
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
                  onClick={() => {
                    setIsUnlimited(!isUnlimited);
                    setCustomCapacity('');
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-all active:scale-95 flex items-center gap-1 ${
                    isUnlimited ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-card text-muted-foreground'
                  }`}
                >
                  <Infinity className="size-3" />
                  Unlimited
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
              <p className="text-[11px] text-muted-foreground">
                Currently {event.attendeeCount} registered out of {event.capacity || '—'}
              </p>
            </div>
          )}

          {/* ═══ VISIBILITY ═══ */}
          {field === 'visibility' && (
            <div className="space-y-3">
              {[
                { id: 'public' as const, icon: Eye, label: 'Public', desc: 'Anyone can find and view this event' },
                { id: 'private' as const, icon: Lock, label: 'Private', desc: 'Only people with the link can access' },
              ].map((option) => {
                const isSelected = visibility === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setVisibility(option.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all active:scale-[0.97] ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary/15' : 'bg-muted'
                    }`}>
                      <Icon className={`size-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-left flex-1">
                      <p className={`text-[13px] ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>{option.label}</p>
                      <p className="text-[11px] text-muted-foreground">{option.desc}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="size-2.5 bg-primary rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* ═══ ACCESS TYPE ═══ */}
          {field === 'access' && (
            <div className="space-y-3">
              {[
                { id: 'open' as const, icon: Users, label: 'Open Registration', desc: 'Anyone can register instantly' },
                { id: 'screened' as const, icon: UserPlus, label: 'Apply to Join', desc: 'Review applications before accepting' },
                { id: 'waitlist' as const, icon: Clock, label: 'Waitlist', desc: 'Queue-based registration' },
                { id: 'paid' as const, icon: CreditCard, label: 'Paid Access', desc: 'Require payment to register' },
              ].map((option) => {
                const isSelected = accessType === option.id;
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => setAccessType(option.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all active:scale-[0.97] ${
                      isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'
                    }`}
                  >
                    <div className={`size-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'bg-primary/15' : 'bg-muted'
                    }`}>
                      <Icon className={`size-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className={`text-[12px] ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>{option.label}</p>
                      <p className="text-[10px] text-muted-foreground">{option.desc}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <div className="size-2.5 bg-primary rounded-full" />}
                    </div>
                  </button>
                );
              })}

              {accessType === 'paid' && (
                <div className="mt-3">
                  <label className="text-[13px] text-foreground mb-1.5 block">Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="pl-10 text-[14px]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-border bg-card flex-shrink-0 space-y-2">
          {/* Leapy cross-link */}
          {onSwitchToLeapy && (
            <button
              onClick={handleLeapySwitch}
              className="w-full flex items-center justify-center gap-1.5 text-[12px] text-primary py-1.5"
            >
              <Sparkles className="size-3.5" />
              Or let Leapy help with this
            </button>
          )}
          <div className="flex gap-2">
            <Button onClick={onClose} variant="outline" size="lg" className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} size="lg" className="flex-1 bg-primary text-primary-foreground">
              <Save className="size-4 mr-1.5" />
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
