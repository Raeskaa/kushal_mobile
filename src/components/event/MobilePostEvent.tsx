import { useState } from 'react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  Users, CircleCheck, BarChart3, Star, Play, FileText, ExternalLink,
  Download, Award, Sparkles, UserPlus, Search, ThumbsUp, Share2,
  Clock, TrendingUp, MessageCircle, Calendar, ChevronRight, Heart, Bell
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { MobileEventReviews } from './MobileEventReviews';
import { MobileResourceList } from './MobileResourceList';

interface MobilePostEventProps {
  event: MockEvent;
  section: 'overview' | 'recording' | 'resources' | 'certificate' | 'reviews';
  onOpenLeapy?: (context: LeapyContext) => void;
}

export function MobilePostEvent({ event, section, onOpenLeapy }: MobilePostEventProps) {
  const [userReview, setUserReview] = useState({ rating: 0, comment: '', submitted: false });
  const [hoverRating, setHoverRating] = useState(0);

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  if (section === 'overview') {
    const attended = Math.round(event.attendeeCount * 0.78);
    const peakConcurrent = Math.round(event.attendeeCount * 0.65);

    return (
      <div className="p-4 space-y-4">
        {/* Event Summary */}
        <Card className="p-4 gap-2">
          <Badge variant="secondary" className="text-[10px] w-fit">Event Ended</Badge>
          <h2 className="text-base text-card-foreground">{event.title}</h2>
          <p className="text-xs text-muted-foreground">Ended on {event.date}</p>
          <p className="text-sm text-secondary-foreground leading-relaxed">{event.description}</p>
        </Card>

        {/* Attendance Report */}
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">Attendance Report</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Registered', value: event.attendeeCount, icon: Users, color: 'text-primary' },
              { label: 'Attended', value: attended, icon: CircleCheck, color: 'text-primary' },
              { label: 'Peak Concurrent', value: peakConcurrent, icon: TrendingUp, color: 'text-primary' },
              { label: 'Engagement', value: '84%', icon: Heart, color: 'text-primary' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <stat.icon className={`size-3.5 ${stat.color}`} />
                  <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-lg text-card-foreground">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
              </div>
            ))}
          </div>
          {/* Attendance rate bar */}
          <div className="space-y-1 mt-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Attendance rate</span>
              <span>{Math.round((attended / event.attendeeCount) * 100)}%</span>
            </div>
            <Progress value={(attended / event.attendeeCount) * 100} className="h-1.5" />
          </div>
        </Card>

        {/* Quick Access */}
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">Quick Access</h3>
          <div className="space-y-2">
            {event.recordingUrl && (
              <Button variant="secondary" onClick={() => leapy('download_recording')} className="w-full justify-start bg-primary/10 text-primary hover:bg-primary/15">
                <Play className="size-4" />
                <span className="flex-1 text-left">Watch Recording</span>
                <Sparkles className="size-3" />
              </Button>
            )}
            {event.resources && event.resources.length > 0 && (
              <Button variant="secondary" onClick={() => toast('Resources browser coming soon')} className="w-full justify-start bg-accent text-accent-foreground">
                <FileText className="size-4" />
                <span className="flex-1 text-left">{event.resources.length} Resources Available</span>
                <Download className="size-3 text-accent-foreground" />
              </Button>
            )}
            {event.hasCertificate && (
              <Button variant="secondary" onClick={() => leapy('get_certificate')} className="w-full justify-start bg-secondary text-secondary-foreground">
                <Award className="size-4" />
                <span className="flex-1 text-left">Download Certificate</span>
                <Sparkles className="size-3 text-primary" />
              </Button>
            )}
          </div>
        </Card>

        {/* Feedback CTA */}
        <Card className="p-4 text-center bg-primary/5 border-primary/20 gap-2">
          <Star className="size-8 text-primary mx-auto" />
          <p className="text-sm text-card-foreground">How was the event?</p>
          <p className="text-xs text-muted-foreground">Your feedback helps organizers improve</p>
          <Button onClick={() => leapy('submit_feedback')} className="mx-auto">
            <Sparkles className="size-4" />
            Leave a Review
          </Button>
        </Card>

        {/* Post-Event Leapy Actions */}
        <Card className="p-4 gap-3">
          <h3 className="text-sm text-card-foreground">More Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Share2, label: 'Share Recap', ctx: 'share_recap', sparkle: true },
              { icon: MessageCircle, label: 'Speaker Q&A', ctx: 'connect_speaker', sparkle: true },
              { icon: UserPlus, label: 'Connect', ctx: 'connect_attendees', sparkle: true },
              { icon: Search, label: 'Similar Events', ctx: 'find_similar', sparkle: true },
              ...(event.hasCertificate ? [{ icon: Award, label: 'Certificate', ctx: 'get_certificate', sparkle: true }] : []),
              ...(event.recordingUrl ? [{ icon: Download, label: 'Recording', ctx: 'download_recording', sparkle: true }] : []),
            ].map((action) => (
              <Button
                key={action.ctx}
                variant="secondary"
                onClick={() => leapy(action.ctx)}
                className="justify-start"
              >
                <action.icon className="size-4 text-muted-foreground" />
                <span className="flex-1 text-left text-xs">{action.label}</span>
                <Sparkles className="size-3 text-primary ml-auto" />
              </Button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (section === 'recording') {
    return (
      <div className="p-4 space-y-4">
        {event.recordingUrl ? (
          <>
            {/* Video player placeholder */}
            <div className="bg-foreground rounded-xl h-52 flex items-center justify-center relative overflow-hidden">
              <button className="size-14 bg-background/20 rounded-full flex items-center justify-center active:scale-95 transition-all z-10">
                <Play className="size-6 text-primary-foreground ml-0.5" />
              </button>
              {/* Duration badge */}
              <div className="absolute bottom-3 right-3 bg-foreground/80 text-white text-[10px] px-2 py-0.5 rounded">
                1:42:30
              </div>
            </div>

            <Card className="p-4 gap-2">
              <h3 className="text-sm text-card-foreground">{event.title}</h3>
              <p className="text-xs text-muted-foreground">Recorded on {event.date}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Play className="size-3" /> 234 views
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="size-3" /> 1h 42m
                </div>
              </div>
            </Card>

            {/* Chapters */}
            <Card className="p-4 gap-3">
              <h3 className="text-sm text-card-foreground">Chapters</h3>
              <div className="space-y-2">
                {[
                  { time: '0:00', title: 'Introduction & Welcome', dur: '8 min' },
                  { time: '8:12', title: 'Keynote: Future of AI', dur: '35 min' },
                  { time: '43:00', title: 'Panel Discussion', dur: '25 min' },
                  { time: '1:08:00', title: 'Q&A Session', dur: '20 min' },
                  { time: '1:28:00', title: 'Closing Remarks', dur: '14 min' },
                ].map((ch, idx) => (
                  <button key={idx} onClick={() => toast(`Jump to ${ch.time}`)} className="w-full flex items-center gap-3 p-2 rounded-lg active:bg-muted transition-all text-left">
                    <span className="text-xs text-primary w-12 flex-shrink-0">{ch.time}</span>
                    <span className="text-sm text-card-foreground flex-1">{ch.title}</span>
                    <span className="text-[10px] text-muted-foreground">{ch.dur}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.success('Download started')} className="flex-1">
                <Download className="size-4" /> Download
              </Button>
              <Button variant="outline" onClick={() => leapy('share_recap')} className="flex-1">
                <Share2 className="size-4" /> Share
                <Sparkles className="size-3 text-primary ml-auto" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Play className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Recording not yet available</p>
            <p className="text-xs text-muted-foreground mt-1">The organizer will upload the recording soon</p>
            <Button variant="outline" onClick={() => leapy('set_reminder')} className="mt-4">
              <Bell className="size-4" /> Notify Me
              <Sparkles className="size-3 text-primary ml-1" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (section === 'resources') {
    const resources = event.resources || [];

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base text-card-foreground">Event Resources</h2>
          {resources.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => toast.success('Downloading all resources...')} className="text-xs h-7">
              <Download className="size-3" /> Download All
            </Button>
          )}
        </div>

        {resources.length > 0 ? (
          <MobileResourceList
            resources={resources}
            canAccess={() => true}
            isPostEventUnlocked={true}
          />
        ) : (
          <div className="text-center py-16">
            <FileText className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Resources coming soon</p>
            <p className="text-xs text-muted-foreground mt-1">The organizer will share materials soon</p>
          </div>
        )}
      </div>
    );
  }

  if (section === 'certificate') {
    return (
      <div className="p-4 space-y-4">
        {event.hasCertificate ? (
          <>
            <Card className="p-6 text-center border-2 border-primary gap-0">
              <div className="border border-border rounded-lg p-6">
                <Award className="size-10 text-primary mx-auto mb-3" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Certificate of Attendance</p>
                <p className="text-lg text-card-foreground mb-1">Sarah Chen</p>
                <p className="text-xs text-muted-foreground mb-3">has successfully attended</p>
                <p className="text-sm text-primary mb-3">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => toast.success('Certificate downloaded!')}>
                <Download className="size-4" /> Download PDF
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => leapy('share_recap')}>
                <Share2 className="size-4" /> Share
                <Sparkles className="size-3 text-primary ml-1" />
              </Button>
            </div>

            {/* Add to LinkedIn */}
            <Button variant="outline" onClick={() => toast('Adding to LinkedIn profile...')} className="w-full">
              Add to LinkedIn Profile
            </Button>
          </>
        ) : (
          <div className="text-center py-16">
            <Award className="size-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Certificate not yet issued</p>
            <p className="text-xs text-muted-foreground mt-1">The organizer will issue certificates soon</p>
          </div>
        )}
      </div>
    );
  }

  if (section === 'reviews') {
    return <MobileEventReviews event={event} mode="learner" />;
  }

  return null;
}
