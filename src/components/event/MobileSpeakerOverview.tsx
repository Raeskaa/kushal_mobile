import { useState } from 'react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  Calendar, Clock, MapPin, Users, CircleCheck, Circle, Play, FileText,
  Upload, Sparkles, Monitor, Mic, Video, Wifi, AlertTriangle,
  MessageCircle, ChevronRight, ExternalLink, Download, Bell
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';

interface MobileSpeakerOverviewProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
  onNavigateTab?: (tabId: string) => void;
}

export function MobileSpeakerOverview({ event, onOpenLeapy, onNavigateTab }: MobileSpeakerOverviewProps) {
  const [techCheckDone, setTechCheckDone] = useState(false);

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  // Find speaker's own sessions
  const mySessions = event.schedule.filter(s =>
    s.speaker?.toLowerCase().includes('sarah') || // Mock: use current user's name
    s.speaker?.toLowerCase().includes('you') ||
    event.speakers.some(sp => sp.name && s.speaker?.includes(sp.name.split(' ')[0]))
  );

  // If we can't find specific sessions, use first non-break sessions as speaker's
  const speakerSessions = mySessions.length > 0
    ? mySessions
    : event.schedule.filter(s => s.type !== 'break').slice(0, 2);

  // Prep checklist
  const prepItems = [
    { id: 'slides', label: 'Upload presentation slides', done: true },
    { id: 'bio', label: 'Speaker bio confirmed', done: true },
    { id: 'tech', label: 'Tech check completed', done: techCheckDone },
    { id: 'qa', label: 'Review audience questions', done: false },
  ];
  const prepProgress = (prepItems.filter(p => p.done).length / prepItems.length) * 100;

  const isLive = event.lifecycleStage === 'live';
  const isEnded = event.lifecycleStage === 'ended';

  return (
    <div className="p-4 space-y-4">
      {/* Live Banner */}
      {isLive && (
        <Card className="p-4 border-destructive/30 bg-destructive/5 gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2.5 bg-destructive"></span>
            </span>
            <span className="text-sm text-destructive">Event is LIVE</span>
            <span className="text-xs text-muted-foreground ml-auto">{event.liveAttendeeCount} watching</span>
          </div>
          <Button variant="destructive" onClick={() => toast('Entering backstage...')} className="w-full">
            <Play className="size-4" /> Enter Backstage
          </Button>
        </Card>
      )}

      {/* My Sessions */}
      <Card className="p-4 gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-card-foreground">Your Sessions</h3>
          <Badge variant="secondary" className="text-[10px]">
            {speakerSessions.length} session{speakerSessions.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        <div className="space-y-2">
          {speakerSessions.map((session) => {
            const isNow = isLive && speakerSessions.indexOf(session) === 0;
            return (
              <div
                key={session.id}
                className={`rounded-xl border p-3 ${
                  isNow ? 'border-destructive/30 bg-destructive/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      {isNow && (
                        <span className="relative flex size-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive/60 opacity-75"></span>
                          <span className="relative inline-flex rounded-full size-2 bg-destructive"></span>
                        </span>
                      )}
                      <p className="text-sm text-card-foreground">{session.title}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3" /> {session.time}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="size-3" /> {session.duration}
                      </div>
                    </div>
                  </div>
                  {session.type && (
                    <Badge variant="secondary" className="text-[10px] capitalize">{session.type}</Badge>
                  )}
                </div>

                {isNow && (
                  <Button size="sm" variant="destructive" onClick={() => toast('Go live!')} className="w-full mt-2 text-xs h-8">
                    <Mic className="size-3" /> Go Live Now
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onNavigateTab?.('schedule')}
          className="w-full flex items-center justify-center gap-1 text-xs text-primary py-1 active:opacity-70"
        >
          View Full Schedule <ChevronRight className="size-3" />
        </button>
      </Card>

      {/* Preparation Checklist */}
      {!isEnded && (
        <Card className="p-4 gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-card-foreground">Prep Checklist</h3>
            <span className="text-xs text-muted-foreground">{prepItems.filter(p => p.done).length}/{prepItems.length}</span>
          </div>
          <Progress value={prepProgress} className="h-2" />

          <div className="space-y-2">
            {prepItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2.5 py-1">
                {item.done ? (
                  <CircleCheck className="size-4 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="size-4 text-muted-foreground/40 flex-shrink-0" />
                )}
                <span className={`text-sm flex-1 ${item.done ? 'text-muted-foreground line-through' : 'text-card-foreground'}`}>
                  {item.label}
                </span>
                {!item.done && item.id === 'tech' && (
                  <Button size="sm" variant="outline" onClick={() => { setTechCheckDone(true); toast.success('Tech check complete!'); }} className="text-[10px] h-6">
                    Start
                  </Button>
                )}
                {!item.done && item.id === 'qa' && (
                  <Button size="sm" variant="outline" onClick={() => leapy('ask_about_event')} className="text-[10px] h-6">
                    <Sparkles className="size-3 text-primary" /> Review
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-4 gap-3">
        <h3 className="text-sm text-card-foreground">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => toast('Upload slides coming soon')} className="justify-start">
            <Upload className="size-4 text-muted-foreground" />
            <span className="text-xs">Upload Slides</span>
          </Button>
          <Button variant="secondary" onClick={() => leapy('ask_about_event')} className="justify-start bg-primary/10 text-primary hover:bg-primary/15">
            <Sparkles className="size-4" />
            <span className="text-xs">Ask Leapy</span>
          </Button>
          <Button variant="secondary" onClick={() => onNavigateTab?.('discussion')} className="justify-start">
            <MessageCircle className="size-4 text-muted-foreground" />
            <span className="text-xs">Discussion</span>
          </Button>
          <Button variant="secondary" onClick={() => onNavigateTab?.('attendees')} className="justify-start">
            <Users className="size-4 text-muted-foreground" />
            <span className="text-xs">Attendees</span>
          </Button>
        </div>
      </Card>

      {/* Tech Check */}
      {!isEnded && !techCheckDone && (
        <Card className="p-4 gap-3 border-secondary bg-secondary">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-secondary-foreground" />
            <h3 className="text-sm text-foreground">Complete Your Tech Check</h3>
          </div>
          <p className="text-xs text-secondary-foreground">Ensure your setup is ready before the event.</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Mic, label: 'Audio', status: 'pending' },
              { icon: Video, label: 'Camera', status: 'pending' },
              { icon: Wifi, label: 'Network', status: 'pending' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 p-2 bg-card rounded-lg">
                <item.icon className="size-5 text-secondary-foreground" />
                <span className="text-[10px] text-secondary-foreground">{item.label}</span>
              </div>
            ))}
          </div>
          <Button
            onClick={() => { setTechCheckDone(true); toast.success('Tech check complete!'); }}
            className="w-full"
          >
            <Monitor className="size-4" /> Run Tech Check
          </Button>
        </Card>
      )}

      {techCheckDone && !isEnded && (
        <Card className="p-3 border-primary/20 bg-primary/5 flex-row items-center gap-2">
          <CircleCheck className="size-4 text-primary flex-shrink-0" />
          <span className="text-xs text-primary">Tech check passed — you're all set!</span>
        </Card>
      )}

      {/* Event Info */}
      <Card className="p-4 gap-2">
        <h3 className="text-sm text-card-foreground">Event Details</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-secondary-foreground">
            <Calendar className="size-3.5 text-muted-foreground" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary-foreground">
            <MapPin className="size-3.5 text-muted-foreground" />
            <span className="capitalize">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-secondary-foreground">
            <Users className="size-3.5 text-muted-foreground" />
            <span>{event.attendeeCount} registered</span>
          </div>
        </div>
      </Card>

      {/* Audience Preview */}
      <Card className="p-4 gap-3">
        <h3 className="text-sm text-card-foreground">Audience Preview</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted rounded-lg p-2">
            <p className="text-lg text-card-foreground">{event.attendeeCount}</p>
            <p className="text-[10px] text-muted-foreground">Expected</p>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <p className="text-lg text-card-foreground">{Math.round(event.attendeeCount * 0.3)}</p>
            <p className="text-[10px] text-muted-foreground">Questions</p>
          </div>
          <div className="bg-muted rounded-lg p-2">
            <p className="text-lg text-card-foreground">{event.speakers.length}</p>
            <p className="text-[10px] text-muted-foreground">Co-speakers</p>
          </div>
        </div>

        {/* Pre-submitted questions */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground">Top audience questions</p>
          {[
            'What tools do you recommend for beginners?',
            'How does this integrate with existing workflows?',
            'Can you share real-world case studies?',
          ].map((q, idx) => (
            <div key={idx} className="bg-muted rounded-lg px-3 py-2 flex items-center gap-2">
              <MessageCircle className="size-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-secondary-foreground flex-1">{q}</span>
            </div>
          ))}
        </div>

        <Button variant="secondary" onClick={() => leapy('ask_about_event')} className="w-full bg-primary/10 text-primary hover:bg-primary/15">
          <Sparkles className="size-4" /> Prepare Answers with AI
        </Button>
      </Card>

      {/* Post-event (for ended events) */}
      {isEnded && (
        <Card className="p-4 gap-3 border-primary/20 bg-primary/5">
          <h3 className="text-sm text-card-foreground">Post-Event Actions</h3>
          <div className="space-y-2">
            <Button variant="secondary" onClick={() => leapy('share_recap')} className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/15">
              <Sparkles className="size-4" />
              <span className="flex-1 text-left text-xs">Generate Session Recap</span>
            </Button>
            <Button variant="secondary" onClick={() => toast('Download attendee feedback')} className="w-full justify-start">
              <Download className="size-4 text-muted-foreground" />
              <span className="flex-1 text-left text-xs">Download Feedback Report</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}