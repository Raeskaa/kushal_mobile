import { useState, useMemo } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import {
  Copy, Search, Calendar, Users, Video, Building2, Monitor,
  Clock, MapPin, Check, ChevronRight, Plus, Sparkles,
  BookmarkPlus, LayoutTemplate, FileText, Trash2, Star,
  Download, ArrowRight, Zap, BookOpen, Code, Presentation,
  Mic, GraduationCap, Handshake, Tag,
} from 'lucide-react';
import { EVENT_TEMPLATES, type EventTemplate, type MockEvent } from '../data/mockEventData';
import { toast } from 'sonner@2.0.3';

interface EventDuplicationTemplatesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: MockEvent[];
  onDuplicate: (eventId: string) => string | null;
  onCreateFromTemplate: (templateId: string) => void;
  onCreateFromCustomTemplate: (template: CustomTemplate) => void;
}

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  sourceEventTitle: string;
  createdAt: string;
  config: {
    format: 'virtual' | 'in-person' | 'hybrid';
    capacity: number;
    category: string;
    isPaid: boolean;
    price?: number;
    durationMinutes?: number;
    tags: string[];
    hasSchedule: boolean;
    hasSpeakers: boolean;
    scheduleItemCount: number;
    speakerCount: number;
  };
}

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  Code, Presentation, Users, Mic, GraduationCap, Handshake,
};

const FORMAT_ICON: Record<string, React.ElementType> = {
  virtual: Video,
  'in-person': Building2,
  hybrid: Monitor,
};

// Mock saved custom templates
const INITIAL_CUSTOM_TEMPLATES: CustomTemplate[] = [
  {
    id: 'ct-1',
    name: 'My Workshop Format',
    description: 'Hands-on workshop with live coding, Q&A, and certificate',
    sourceEventTitle: 'React 18 Deep Dive Workshop',
    createdAt: '2026-03-05',
    config: {
      format: 'virtual',
      capacity: 100,
      category: 'Technology',
      isPaid: false,
      durationMinutes: 120,
      tags: ['Workshop', 'Hands-on'],
      hasSchedule: true,
      hasSpeakers: true,
      scheduleItemCount: 4,
      speakerCount: 2,
    },
  },
  {
    id: 'ct-2',
    name: 'Community Meetup',
    description: 'Casual networking with lightning talks and open discussion',
    sourceEventTitle: 'Monthly Tech Meetup',
    createdAt: '2026-02-20',
    config: {
      format: 'hybrid',
      capacity: 50,
      category: 'Networking',
      isPaid: false,
      durationMinutes: 90,
      tags: ['Networking', 'Meetup'],
      hasSchedule: true,
      hasSpeakers: false,
      scheduleItemCount: 3,
      speakerCount: 0,
    },
  },
];

export function EventDuplicationTemplates({
  open,
  onOpenChange,
  events,
  onDuplicate,
  onCreateFromTemplate,
  onCreateFromCustomTemplate,
}: EventDuplicationTemplatesProps) {
  const [activeTab, setActiveTab] = useState('duplicate');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>(INITIAL_CUSTOM_TEMPLATES);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState('');
  const [saveTemplateDesc, setSaveTemplateDesc] = useState('');
  const [savingEventId, setSavingEventId] = useState<string | null>(null);

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [events, searchQuery]);

  const selectedEvent = selectedEventId ? events.find(e => e.id === selectedEventId) : null;

  const handleDuplicate = () => {
    if (!selectedEventId) return;
    const newId = onDuplicate(selectedEventId);
    if (newId) {
      toast.success('Event duplicated!', {
        description: `A draft copy of "${selectedEvent?.title}" has been created.`,
      });
      setSelectedEventId(null);
      onOpenChange(false);
    }
  };

  const handleSaveAsTemplate = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    setSavingEventId(eventId);
    setSaveTemplateName(`${event.title} Template`);
    setSaveTemplateDesc(event.description.slice(0, 100));
    setShowSaveDialog(true);
  };

  const confirmSaveTemplate = () => {
    const event = events.find(e => e.id === savingEventId);
    if (!event || !saveTemplateName.trim()) return;

    const newTemplate: CustomTemplate = {
      id: `ct-${Date.now()}`,
      name: saveTemplateName,
      description: saveTemplateDesc,
      sourceEventTitle: event.title,
      createdAt: new Date().toISOString().split('T')[0],
      config: {
        format: event.location,
        capacity: event.capacity || 100,
        category: event.category,
        isPaid: event.isPaid,
        price: event.price,
        durationMinutes: event.durationMinutes,
        tags: event.tags,
        hasSchedule: event.schedule.length > 0,
        hasSpeakers: event.speakers.length > 0,
        scheduleItemCount: event.schedule.length,
        speakerCount: event.speakers.length,
      },
    };

    setCustomTemplates(prev => [newTemplate, ...prev]);
    setShowSaveDialog(false);
    setSavingEventId(null);
    setSaveTemplateName('');
    setSaveTemplateDesc('');
    toast.success('Template saved!', { description: `"${saveTemplateName}" is now available in your templates.` });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== templateId));
    toast.success('Template removed');
  };

  const handleUseBuiltInTemplate = (templateId: string) => {
    onCreateFromTemplate(templateId);
    onOpenChange(false);
  };

  const handleUseCustomTemplate = (template: CustomTemplate) => {
    onCreateFromCustomTemplate(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
              <LayoutTemplate className="size-4 text-primary" />
            </div>
            Duplicate & Templates
          </DialogTitle>
          <DialogDescription>
            Duplicate an existing event or use a template to get started fast.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="duplicate" className="text-xs">
              <Copy className="size-3.5 mr-1.5" />
              Duplicate
            </TabsTrigger>
            <TabsTrigger value="my-templates" className="text-xs">
              <Star className="size-3.5 mr-1.5" />
              My Templates
              {customTemplates.length > 0 && (
                <Badge variant="secondary" className="ml-1.5 text-[9px] py-0 px-1">{customTemplates.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="built-in" className="text-xs">
              <Zap className="size-3.5 mr-1.5" />
              Built-in
            </TabsTrigger>
          </TabsList>

          {/* ─── Duplicate Tab ─── */}
          <TabsContent value="duplicate" className="space-y-4 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search events to duplicate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Events List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No events found</p>
                </div>
              ) : (
                filteredEvents.map((event) => {
                  const FormatIcon = FORMAT_ICON[event.location] || Video;
                  const isSelected = selectedEventId === event.id;
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedEventId(isSelected ? null : event.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/30'
                      }`}
                    >
                      <div className={`size-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-primary/15' : 'bg-muted'
                      }`}>
                        {isSelected ? <Check className="size-4 text-primary" /> : <Calendar className="size-4 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-card-foreground truncate">{event.title}</span>
                          <Badge variant="secondary" className="text-[9px] py-0 flex-shrink-0">
                            {event.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="size-3" />
                            {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <FormatIcon className="size-3" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {event.attendeeCount}/{event.capacity}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-1.5">
                          {event.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[9px] py-0">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveAsTemplate(event.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors flex-shrink-0"
                        title="Save as template"
                      >
                        <BookmarkPlus className="size-4 text-muted-foreground" />
                      </button>
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected Event Preview */}
            {selectedEvent && (
              <>
                <Separator />
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary">Duplicating:</span>
                    <Badge variant="secondary" className="text-[10px]">{selectedEvent.category}</Badge>
                  </div>
                  <p className="text-sm text-card-foreground">{selectedEvent.title}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-3" /> Date will be cleared</span>
                    <span className="flex items-center gap-1"><Users className="size-3" /> {selectedEvent.capacity} capacity</span>
                    <span className="flex items-center gap-1"><FileText className="size-3" /> {selectedEvent.schedule.length} schedule items</span>
                    <span className="flex items-center gap-1"><Users className="size-3" /> {selectedEvent.speakers.length} speakers</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    The copy will be created as a draft. Attendee counts and registrations will be reset.
                  </p>
                </div>
              </>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button
                onClick={handleDuplicate}
                disabled={!selectedEventId}
                className="bg-primary hover:bg-primary/90"
              >
                <Copy className="size-4 mr-1.5" />
                Duplicate Event
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* ─── My Templates Tab ─── */}
          <TabsContent value="my-templates" className="space-y-4 mt-4">
            {customTemplates.length === 0 ? (
              <div className="text-center py-10">
                <Star className="size-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-card-foreground mb-1">No custom templates yet</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  Save any event as a template from the Duplicate tab, or use a built-in template to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {customTemplates.map((tpl) => {
                  const FormatIcon = FORMAT_ICON[tpl.config.format] || Video;
                  return (
                    <div
                      key={tpl.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
                    >
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Star className="size-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-card-foreground">{tpl.name}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{tpl.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FormatIcon className="size-3" />
                            {tpl.config.format}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" />
                            {tpl.config.capacity}
                          </span>
                          {tpl.config.hasSchedule && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {tpl.config.scheduleItemCount} items
                            </span>
                          )}
                          {tpl.config.isPaid && (
                            <Badge variant="secondary" className="text-[9px] py-0">${tpl.config.price}</Badge>
                          )}
                        </div>
                        <div className="flex gap-1 mt-1.5">
                          {tpl.config.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-[9px] py-0">{tag}</Badge>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          From: {tpl.sourceEventTitle} · Saved {new Date(tpl.createdAt + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleUseCustomTemplate(tpl)}
                          className="h-7 text-[11px] bg-primary hover:bg-primary/90"
                        >
                          Use
                          <ArrowRight className="size-3 ml-1" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteTemplate(tpl.id)}
                          className="h-7 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/5"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* ─── Built-in Templates Tab ─── */}
          <TabsContent value="built-in" className="space-y-4 mt-4">
            <p className="text-xs text-muted-foreground">
              Pre-configured templates with schedules, capacities, and best-practice defaults.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {EVENT_TEMPLATES.map((tpl) => {
                const IconComp = TEMPLATE_ICONS[tpl.icon] || Calendar;
                const FormatIcon = FORMAT_ICON[tpl.defaultFormat] || Video;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleUseBuiltInTemplate(tpl.id)}
                    className="group relative flex flex-col items-start gap-2.5 p-4 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <IconComp className="size-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-card-foreground">{tpl.name}</p>
                        <p className="text-[11px] text-muted-foreground">{tpl.defaultDuration}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{tpl.description}</p>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary" className="text-[9px] py-0">
                        <FormatIcon className="size-2.5 mr-0.5" />
                        {tpl.defaultFormat}
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] py-0">
                        <Users className="size-2.5 mr-0.5" />
                        {tpl.defaultCapacity}
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] py-0">
                        <Clock className="size-2.5 mr-0.5" />
                        {tpl.suggestedSchedule.length} items
                      </Badge>
                      {tpl.isPaid && (
                        <Badge variant="secondary" className="text-[9px] py-0">${tpl.defaultPrice}</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Save as Template Sub-Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
            <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm space-y-4 mx-4">
              <div className="flex items-center gap-2">
                <BookmarkPlus className="size-5 text-primary" />
                <h3 className="text-card-foreground">Save as Template</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Save this event&apos;s configuration as a reusable template.
              </p>
              <div>
                <Label htmlFor="tpl-name">Template Name *</Label>
                <Input
                  id="tpl-name"
                  value={saveTemplateName}
                  onChange={(e) => setSaveTemplateName(e.target.value)}
                  placeholder="My Workshop Template"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="tpl-desc">Description</Label>
                <Input
                  id="tpl-desc"
                  value={saveTemplateDesc}
                  onChange={(e) => setSaveTemplateDesc(e.target.value)}
                  placeholder="Brief description..."
                  className="mt-1.5"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={confirmSaveTemplate}
                  disabled={!saveTemplateName.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <BookmarkPlus className="size-3.5 mr-1" />
                  Save Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}