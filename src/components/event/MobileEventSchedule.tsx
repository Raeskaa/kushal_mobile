import { useState } from 'react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  Plus, Clock, Mic, MonitorPlay, BookOpen, Coffee, User, Sparkles, Pencil,
  Trash2, Play, ChevronDown, ChevronUp, Users as UsersIcon, LayoutGrid
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

interface MobileEventScheduleProps {
  event: MockEvent;
  isAdmin: boolean;
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function MobileEventSchedule({ event, isAdmin, onOpenLeapy }: MobileEventScheduleProps) {
  const { removeSession } = useEventStore();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'keynote': return Mic;
      case 'session': return MonitorPlay;
      case 'workshop': return BookOpen;
      case 'break': return Coffee;
      case 'panel': return UsersIcon;
      default: return Clock;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'keynote': return { label: 'Keynote', color: 'bg-primary/10 text-primary' };
      case 'session': return { label: 'Session', color: 'bg-accent text-accent-foreground' };
      case 'workshop': return { label: 'Workshop', color: 'bg-primary/10 text-primary' };
      case 'break': return { label: 'Break', color: 'bg-accent text-secondary-foreground' };
      case 'panel': return { label: 'Panel', color: 'bg-primary/10 text-primary' };
      default: return { label: type, color: 'bg-accent text-secondary-foreground' };
    }
  };

  // For live events, determine which session is "now playing"
  const isLive = event.lifecycleStage === 'live';
  const nowPlayingIdx = isLive && event.schedule.length > 1 ? 1 : (isLive ? 0 : -1);

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base text-card-foreground">Schedule</h2>
          <p className="text-xs text-muted-foreground">{event.schedule.length} session{event.schedule.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenLeapy?.({ type: 'build_agenda', entityId: event.id, entityData: event })}
            >
              <Plus className="size-3.5" />
              Add
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenLeapy?.({ type: 'edit_agenda', entityId: event.id, entityData: event })}
              className="bg-primary/10 text-primary hover:bg-primary/15"
            >
              <Sparkles className="size-3.5" />
              AI Edit
            </Button>
          </div>
        )}
      </div>

      {/* Duration Summary */}
      {event.schedule.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{event.schedule.filter(s => s.type !== 'break').length} sessions</span>
          <span className="text-border">·</span>
          <span>{event.schedule.filter(s => s.type === 'break').length} break{event.schedule.filter(s => s.type === 'break').length !== 1 ? 's' : ''}</span>
          {event.durationMinutes && (
            <>
              <span className="text-border">·</span>
              <span>{Math.floor(event.durationMinutes / 60)}h {event.durationMinutes % 60}m total</span>
            </>
          )}
        </div>
      )}

      {event.schedule.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No schedule yet</p>
          {isAdmin && (
            <p className="text-xs text-muted-foreground mt-1">Add sessions to build your event agenda</p>
          )}
        </div>
      ) : (
        <div className="space-y-0">
          {event.schedule.map((item, idx) => {
            const TypeIcon = getTypeIcon(item.type);
            const badge = getTypeBadge(item.type);
            const isLast = idx === event.schedule.length - 1;
            const isNowPlaying = idx === nowPlayingIdx;
            const isExpanded = expandedSession === item.id;

            return (
              <div key={item.id} className="flex gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`size-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isNowPlaying ? 'bg-destructive/10 ring-2 ring-destructive/30' :
                    item.type === 'break' ? 'bg-accent' : 'bg-primary/10'
                  }`}>
                    {isNowPlaying ? (
                      <Play className="size-4 text-destructive" />
                    ) : (
                      <TypeIcon className={`size-4 ${item.type === 'break' ? 'text-muted-foreground' : 'text-primary'}`} />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-px flex-1 my-1 ${isNowPlaying ? 'bg-destructive/30' : 'bg-border'}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-4">
                  <Card className={`overflow-hidden gap-0 ${isNowPlaying ? 'border-destructive/30' : ''}`}>
                    <button
                      onClick={() => setExpandedSession(isExpanded ? null : item.id)}
                      className="w-full p-3 text-left active:bg-muted transition-all"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          {isNowPlaying && (
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="relative flex size-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
                              </span>
                              <span className="text-[10px] text-destructive">Now Playing</span>
                            </div>
                          )}
                          <h3 className="text-sm text-card-foreground">{item.title}</h3>
                        </div>
                        <Badge variant="secondary" className={`text-[10px] flex-shrink-0 ${badge.color}`}>
                          {badge.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{item.time}</span>
                        </div>
                        <span className="text-border">·</span>
                        <span>{item.duration}</span>
                        {item.room && (
                          <>
                            <span className="text-border">·</span>
                            <div className="flex items-center gap-1">
                              <LayoutGrid className="size-3" />
                              <span>{item.room}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {item.speaker && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <User className="size-3 text-muted-foreground" />
                          <span className="text-xs text-secondary-foreground">{item.speaker}</span>
                        </div>
                      )}
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-border px-3 py-2 space-y-2">
                        {item.description && (
                          <p className="text-xs text-secondary-foreground">{item.description}</p>
                        )}

                        {isAdmin && (
                          <div className="flex items-center gap-2 pt-1">
                            <Button variant="outline" size="sm" onClick={() => onOpenLeapy?.({ type: 'edit_agenda', entityId: event.id, entityData: event, extra: { sessionId: item.id } })} className="flex-1 h-7 text-xs">
                              <Pencil className="size-3" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onOpenLeapy?.({ type: 'edit_agenda', entityId: event.id, entityData: event, extra: { sessionId: item.id } })} className="flex-1 h-7 text-xs">
                              <Sparkles className="size-3 text-primary" /> AI Rewrite
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                removeSession(event.id, item.id);
                                toast.success('Session removed');
                                setExpandedSession(null);
                              }}
                              className="h-7 text-xs border-destructive/30 text-destructive"
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                        )}

                        {isNowPlaying && (
                          <div className="pt-1">
                            <div className="flex items-center gap-2">
                              <Progress value={71} className="h-1.5 flex-1" />
                              <span className="text-[10px] text-muted-foreground">32 min elapsed</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Generate option for admin (empty state) */}
      {isAdmin && event.schedule.length === 0 && (
        <Card
          className="p-4 text-center bg-primary/5 border-primary/20 cursor-pointer active:scale-[0.98] transition-all gap-1"
          onClick={() => onOpenLeapy?.({ type: 'build_agenda', entityId: event.id, entityData: event })}
        >
          <Sparkles className="size-5 text-primary mx-auto" />
          <p className="text-sm text-primary">Auto-generate schedule</p>
          <p className="text-[10px] text-muted-foreground">Let Leapy create a schedule based on your event details</p>
        </Card>
      )}

      {/* AI Suggestions (when schedule exists) */}
      {isAdmin && event.schedule.length > 0 && (
        <Card className="p-4 gap-2 bg-primary/5 border-primary/20">
          <h3 className="text-sm text-card-foreground">AI Schedule Actions</h3>
          <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'generate_agenda', entityId: event.id, entityData: event })} className="w-full justify-start bg-card hover:bg-accent">
            <Sparkles className="size-4 text-primary" />
            <span className="flex-1 text-left">Add more sessions</span>
          </Button>
          <Button variant="secondary" onClick={() => onOpenLeapy?.({ type: 'edit_agenda', entityId: event.id, entityData: event })} className="w-full justify-start bg-card hover:bg-accent">
            <Sparkles className="size-4 text-primary" />
            <span className="flex-1 text-left">Optimize timing & flow</span>
          </Button>
        </Card>
      )}
    </div>
  );
}