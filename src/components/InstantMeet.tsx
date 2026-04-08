import { useState, useEffect, useCallback } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import {
  Video, Zap, Copy, Check, Users, Clock, Link2, Loader2,
  Sparkles, Shield, Globe, Lock, Mic, MicOff, VideoOff,
  MonitorUp, MessageSquare, ArrowRight, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface InstantMeetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetCreated: (meetData: InstantMeetData) => void;
}

export interface InstantMeetData {
  title: string;
  meetingLink: string;
  capacity: number;
  isPrivate: boolean;
}

type MeetStep = 'setup' | 'creating' | 'ready';

const MEETING_PREFIXES = [
  'Quick Sync',
  'Team Huddle',
  'Instant Chat',
  'Live Session',
  'Open Room',
];

function generateMeetingId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const seg = (len: number) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${seg(3)}-${seg(4)}-${seg(3)}`;
}

export function InstantMeet({ open, onOpenChange, onMeetCreated }: InstantMeetProps) {
  const [step, setStep] = useState<MeetStep>('setup');
  const [title, setTitle] = useState('');
  const [capacity, setCapacity] = useState(25);
  const [isPrivate, setIsPrivate] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);

  // Mic/camera preview state
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const resetForm = useCallback(() => {
    setStep('setup');
    setTitle('');
    setCapacity(25);
    setIsPrivate(false);
    setWaitingRoom(false);
    setMeetingLink('');
    setCopied(false);
    setBuildProgress(0);
    setMicOn(true);
    setCameraOn(true);
  }, []);

  // Suggest a random name on open
  useEffect(() => {
    if (open && !title) {
      const prefix = MEETING_PREFIXES[Math.floor(Math.random() * MEETING_PREFIXES.length)];
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      setTitle(`${prefix} — ${timeStr}`);
    }
  }, [open, title]);

  // Building animation
  useEffect(() => {
    if (step !== 'creating') return;

    const duration = 1800;
    const interval = 30;
    const progressTimer = setInterval(() => {
      setBuildProgress(prev => {
        const next = prev + (100 / (duration / interval));
        return next >= 100 ? 100 : next;
      });
    }, interval);

    const completeTimer = setTimeout(() => {
      const link = `https://meet.leapspace.io/${generateMeetingId()}`;
      setMeetingLink(link);
      setStep('ready');
    }, duration + 200);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [step]);

  const handleCreate = () => {
    setStep('creating');
    setBuildProgress(0);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink).catch(() => {});
    setCopied(true);
    toast.success('Meeting link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinMeeting = () => {
    onMeetCreated({
      title: title || 'Instant Meeting',
      meetingLink,
      capacity,
      isPrivate,
    });
    resetForm();
    onOpenChange(false);
  };

  const handleClose = (newOpen: boolean) => {
    if (step === 'creating') return;
    if (!newOpen) resetForm();
    onOpenChange(newOpen);
  };

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* Setup Step */}
        {step === 'setup' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="size-4 text-primary" />
                </div>
                Instant Meet
              </DialogTitle>
              <DialogDescription>
                Start a live meeting right now. Share the link and go.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <div className="size-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary">Starting now</span>
                <span className="text-xs text-muted-foreground ml-auto">{dateString} · {timeString}</span>
              </div>

              {/* Meeting Title */}
              <div>
                <Label htmlFor="meet-title">Meeting Name</Label>
                <Input
                  id="meet-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Quick team sync..."
                  className="mt-1.5"
                />
              </div>

              {/* Quick Settings Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="meet-cap">Max Participants</Label>
                  <Input
                    id="meet-cap"
                    type="number"
                    min={2}
                    max={500}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="mt-1.5"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between h-9 px-3 rounded-md border border-border bg-card">
                    <div className="flex items-center gap-1.5">
                      {isPrivate ? <Lock className="size-3 text-muted-foreground" /> : <Globe className="size-3 text-muted-foreground" />}
                      <span className="text-xs">{isPrivate ? 'Private' : 'Open'}</span>
                    </div>
                    <Switch
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                  </div>
                </div>
              </div>

              {/* Waiting Room Toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-card-foreground">Waiting Room</p>
                    <p className="text-[11px] text-muted-foreground">Admit participants manually</p>
                  </div>
                </div>
                <Switch checked={waitingRoom} onCheckedChange={setWaitingRoom} />
              </div>

              <Separator />

              {/* Device Preview */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Your devices</p>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="size-16 rounded-lg bg-muted flex items-center justify-center">
                    {cameraOn ? (
                      <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="size-5 text-primary" />
                      </div>
                    ) : (
                      <VideoOff className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setMicOn(!micOn)}
                      className={`size-9 rounded-full flex items-center justify-center border transition-colors ${
                        micOn ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {micOn ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                    </button>
                    <button
                      onClick={() => setCameraOn(!cameraOn)}
                      className={`size-9 rounded-full flex items-center justify-center border transition-colors ${
                        cameraOn ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'
                      }`}
                    >
                      {cameraOn ? <Video className="size-4" /> : <VideoOff className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
                <Zap className="size-4 mr-1.5" />
                Start Meeting
              </Button>
            </DialogFooter>
          </>
        )}

        {/* Creating Step */}
        {step === 'creating' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-6">
            <div className="relative">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="size-8 text-primary animate-spin" />
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
                <Video className="size-3 text-primary-foreground" />
              </div>
            </div>
            <div className="text-center space-y-1.5">
              <h3 className="text-card-foreground">Setting up your meeting</h3>
              <p className="text-sm text-muted-foreground">
                Preparing &quot;{title || 'Instant Meeting'}&quot;...
              </p>
            </div>
            <div className="w-full max-w-xs space-y-3">
              <Progress value={buildProgress} className="h-2" />
              <div className="space-y-2">
                {[
                  { label: 'Reserving meeting room...', done: buildProgress > 25 },
                  { label: 'Generating secure link...', done: buildProgress > 55 },
                  { label: 'Preparing audio/video...', done: buildProgress > 85 },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                      s.done ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`size-4 rounded-full flex items-center justify-center ${
                      s.done ? 'bg-primary/15' : 'bg-muted'
                    }`}>
                      {s.done ? <Check className="size-2.5 text-primary" /> : <div className="size-1.5 rounded-full bg-muted-foreground/40" />}
                    </div>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ready Step */}
        {step === 'ready' && (
          <>
            <div className="flex flex-col items-center justify-center py-6 space-y-5">
              <div className="relative">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="size-8 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="size-3 text-primary-foreground" />
                </div>
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="text-card-foreground">Meeting Ready!</h3>
                <p className="text-sm text-muted-foreground">
                  &quot;{title || 'Instant Meeting'}&quot; is live and waiting.
                </p>
              </div>

              {/* Meeting Link */}
              <div className="w-full p-3 rounded-lg border border-border bg-muted/30 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Link2 className="size-4 text-primary flex-shrink-0" />
                  <span className="text-xs text-card-foreground truncate flex-1 font-mono">
                    {meetingLink}
                  </span>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-card border border-border hover:bg-muted transition-colors"
                  >
                    {copied ? <Check className="size-3 text-primary" /> : <Copy className="size-3 text-muted-foreground" />}
                    <span className="text-[11px] text-muted-foreground">{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> Started {timeString}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3" /> 0 / {capacity}
                  </span>
                  {isPrivate && (
                    <span className="flex items-center gap-1">
                      <Lock className="size-3" /> Private
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Features */}
              <div className="w-full grid grid-cols-3 gap-2">
                {[
                  { icon: MonitorUp, label: 'Screen Share' },
                  { icon: MessageSquare, label: 'Chat' },
                  { icon: Users, label: 'Breakout' },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-card">
                    <f.icon className="size-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col w-full gap-2.5">
              <Button onClick={handleJoinMeeting} className="w-full bg-primary hover:bg-primary/90">
                <Video className="size-4 mr-1.5" />
                Join Meeting
                <ArrowRight className="size-4 ml-1.5" />
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopyLink} className="flex-1">
                  <Copy className="size-4 mr-1.5" />
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
                <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
