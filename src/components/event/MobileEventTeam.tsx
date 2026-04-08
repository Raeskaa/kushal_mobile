import { useState } from 'react';
import { type MockEvent, type EventTeamMember, type EventSpeaker } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  UserPlus, Users, Shield, Headphones, Mic, Crown, Sparkles, Mail,
  MoreVertical, Trash2, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface MobileEventTeamProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Co-host': return Crown;
    case 'Moderator': return Shield;
    case 'Speaker Manager': return Headphones;
    case 'Support': return Users;
    case 'Host': return Crown;
    case 'Speaker': return Mic;
    case 'Panelist': return Mic;
    default: return Users;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'Co-host': return 'bg-primary/10 text-primary';
    case 'Host': return 'bg-primary/10 text-primary';
    case 'Moderator': return 'bg-accent text-accent-foreground';
    case 'Speaker Manager': return 'bg-secondary text-secondary-foreground';
    case 'Support': return 'bg-primary/10 text-primary';
    case 'Speaker': return 'bg-primary/5 text-primary';
    case 'Panelist': return 'bg-primary/5 text-primary';
    default: return 'bg-accent text-secondary-foreground';
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case 'active': case 'confirmed': return <CheckCircle className="size-3.5 text-primary" />;
    case 'pending': return <Clock className="size-3.5 text-secondary-foreground" />;
    case 'declined': return <XCircle className="size-3.5 text-destructive" />;
    default: return <CheckCircle className="size-3.5 text-primary" />;
  }
};

export function MobileEventTeam({ event, onOpenLeapy }: MobileEventTeamProps) {
  const { removeTeamMember, removeSpeaker } = useEventStore();
  const [expandedSection, setExpandedSection] = useState<'team' | 'speakers' | null>('team');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const teamMembers = event.teamMembers || [];
  const speakers = event.speakers || [];
  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  // Creator info
  const creator = {
    name: event.creatorName,
    email: event.creatorEmail,
    avatar: event.creatorAvatar,
    role: 'Creator',
  };

  return (
    <div className="p-4 space-y-4">
      {/* Team Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">{1 + teamMembers.length}</p>
          <p className="text-[10px] text-muted-foreground">Team</p>
        </Card>
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">{speakers.length}</p>
          <p className="text-[10px] text-muted-foreground">Speakers</p>
        </Card>
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">
            {teamMembers.filter(m => m.status === 'pending').length + speakers.filter(s => s.status === 'pending').length}
          </p>
          <p className="text-[10px] text-muted-foreground">Pending</p>
        </Card>
      </div>

      {/* Add Team Member */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => leapy('add_cohost')} className="flex-1">
          <UserPlus className="size-4 text-muted-foreground" /> Add Co-host
          <Sparkles className="size-3 text-primary ml-auto" />
        </Button>
        <Button variant="outline" onClick={() => leapy('add_speakers')} className="flex-1">
          <Mic className="size-4 text-muted-foreground" /> Add Speaker
          <Sparkles className="size-3 text-primary ml-auto" />
        </Button>
      </div>

      {/* ═══ Team Members Section ═══ */}
      <Card className="overflow-hidden gap-0">
        <button
          onClick={() => setExpandedSection(expandedSection === 'team' ? null : 'team')}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Users className="size-4 text-muted-foreground" />
            <h3 className="text-sm text-card-foreground">Team ({1 + teamMembers.length})</h3>
          </div>
          {expandedSection === 'team' ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {expandedSection === 'team' && (
          <div className="divide-y divide-border">
            {/* Creator (always first, non-removable) */}
            <div className="flex items-center gap-3 px-4 py-3">
              <Avatar className="size-10">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">{creator.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-card-foreground">{creator.name}</span>
                  <CheckCircle className="size-3.5 text-primary" />
                </div>
                <p className="text-[10px] text-muted-foreground">{creator.email}</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px]">
                <Crown className="size-2.5" /> Creator
              </Badge>
            </div>

            {/* Team Members */}
            {teamMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              const isExpanded = expandedMember === member.id;

              return (
                <div key={member.id}>
                  <button
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-muted transition-all"
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-card-foreground">{member.name}</span>
                        {getStatusIcon(member.status)}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="secondary" className={`text-[10px] ${getRoleBadgeColor(member.role)}`}>
                      <RoleIcon className="size-2.5" /> {member.role}
                    </Badge>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => toast(`Message ${member.name}`)} className="flex-1 h-8 text-xs">
                        <Mail className="size-3" /> Message
                      </Button>
                      {member.status === 'pending' && (
                        <Button variant="outline" size="sm" onClick={() => toast(`Resend invite to ${member.name}`)} className="flex-1 h-8 text-xs">
                          <Mail className="size-3" /> Resend
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          removeTeamMember(event.id, member.id);
                          toast.success(`${member.name} removed`);
                          setExpandedMember(null);
                        }}
                        className="h-8 text-xs border-destructive/30 text-destructive"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {teamMembers.length === 0 && (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-muted-foreground">No team members yet</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ═══ Speakers Section ═══ */}
      <Card className="overflow-hidden gap-0">
        <button
          onClick={() => setExpandedSection(expandedSection === 'speakers' ? null : 'speakers')}
          className="w-full flex items-center justify-between px-4 py-3 bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Mic className="size-4 text-muted-foreground" />
            <h3 className="text-sm text-card-foreground">Speakers ({speakers.length})</h3>
          </div>
          {expandedSection === 'speakers' ? (
            <ChevronUp className="size-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="size-4 text-muted-foreground" />
          )}
        </button>

        {expandedSection === 'speakers' && (
          <div className="divide-y divide-border">
            {speakers.map((speaker) => {
              const RoleIcon = getRoleIcon(speaker.role);
              const isExpanded = expandedMember === `spk-${speaker.id}`;

              return (
                <div key={speaker.id}>
                  <button
                    onClick={() => setExpandedMember(isExpanded ? null : `spk-${speaker.id}`)}
                    className="w-full flex items-center gap-3 px-4 py-3 active:bg-muted transition-all"
                  >
                    <Avatar className="size-10">
                      <AvatarFallback className="text-xs">{speaker.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-card-foreground">{speaker.name}</span>
                        {getStatusIcon(speaker.status)}
                      </div>
                      {speaker.bio && (
                        <p className="text-[10px] text-muted-foreground truncate">{speaker.bio}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className={`text-[10px] ${getRoleBadgeColor(speaker.role)}`}>
                      <RoleIcon className="size-2.5" /> {speaker.role}
                    </Badge>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 space-y-2">
                      <p className="text-xs text-muted-foreground">{speaker.email}</p>
                      {speaker.bio && <p className="text-xs text-secondary-foreground">{speaker.bio}</p>}

                      {/* Assigned Sessions */}
                      {event.schedule.filter(s => s.speaker === speaker.name).length > 0 && (
                        <div className="bg-muted rounded-lg p-2">
                          <p className="text-[10px] text-muted-foreground mb-1">Assigned Sessions:</p>
                          {event.schedule
                            .filter(s => s.speaker === speaker.name)
                            .map(s => (
                              <p key={s.id} className="text-xs text-foreground">
                                {s.time} — {s.title}
                              </p>
                            ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => toast(`Message ${speaker.name}`)} className="flex-1 h-8 text-xs">
                          <Mail className="size-3" /> Message
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => leapy('edit_speakers')} className="flex-1 h-8 text-xs">
                          <Sparkles className="size-3 text-primary" /> Edit
                        </Button>
                        {speaker.role !== 'Host' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              removeSpeaker(event.id, speaker.id);
                              toast.success(`${speaker.name} removed`);
                              setExpandedMember(null);
                            }}
                            className="h-8 text-xs border-destructive/30 text-destructive"
                          >
                            <Trash2 className="size-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {speakers.length === 0 && (
              <div className="px-4 py-6 text-center">
                <Mic className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No speakers yet</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* AI Suggestions */}
      <Card className="p-4 gap-2 bg-primary/5 border-primary/20">
        <h3 className="text-sm text-card-foreground">AI Team Actions</h3>
        <Button variant="secondary" onClick={() => leapy('add_speakers')} className="w-full justify-start bg-card hover:bg-accent">
          <Sparkles className="size-4 text-primary" />
          <span className="flex-1 text-left">Find speakers for this topic</span>
        </Button>
        <Button variant="secondary" onClick={() => leapy('compose_email')} className="w-full justify-start bg-card hover:bg-accent">
          <Sparkles className="size-4 text-primary" />
          <span className="flex-1 text-left">Draft speaker invitation email</span>
        </Button>
      </Card>
    </div>
  );
}