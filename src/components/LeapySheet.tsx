import { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Mic, Plus, ChevronDown, Sparkles,
  ThumbsUp, ThumbsDown, Check, AlertTriangle, Trash2,
  Image as ImageIcon, Paperclip, Camera
} from 'lucide-react';
import { LeapyIcon } from './LeapyIcon';
import { motion, AnimatePresence } from 'motion/react';
import {
  type LeapyContext,
  type LeapyMessage,
  type RichCard,
  getLeapyConfig,
} from '../data/leapyContexts';
import { resolveFlow } from '../data/leapyFlows';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface LeapySheetProps {
  isOpen: boolean;
  context: LeapyContext | null;
  onClose: () => void;
  onComplete?: (result: any) => void;
}

// ─── Rich Card Components ─────────────────────────────────────
function EventPreviewCard({ data }: { data: Record<string, any> }) {
  const statusColors: Record<string, string> = {
    Draft: 'bg-secondary text-secondary-foreground',
    Published: 'bg-primary/10 text-primary',
    Registered: 'bg-primary/10 text-primary',
    'Ready to Publish': 'bg-accent text-accent-foreground',
    Ready: 'bg-accent text-accent-foreground',
    Preview: 'bg-muted text-secondary-foreground',
    'Cover Updated': 'bg-primary/10 text-primary',
    Live: 'bg-destructive/10 text-destructive',
    Completed: 'bg-muted text-secondary-foreground',
  };
  return (
    <Card className="overflow-hidden p-4 gap-3">
      <div className="flex items-start justify-between">
        <h4 className="text-[15px] text-card-foreground flex-1 pr-2">{data.title}</h4>
        {data.status && (
          <Badge variant="secondary" className={`text-[10px] ${statusColors[data.status] || 'bg-muted text-secondary-foreground'}`}>
            {data.status}
          </Badge>
        )}
      </div>
      <div className="space-y-1.5">
        {data.date && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="text-border">📅</span><span>{data.date}</span></div>}
        {data.time && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="text-border">🕐</span><span>{data.time}</span></div>}
        {data.format && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="text-border">📍</span><span className="capitalize">{data.format}</span></div>}
        {data.capacity && <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="text-border">👥</span><span>Up to {data.capacity} people</span></div>}
      </div>
      {data.description && <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-2">{data.description}</p>}
    </Card>
  );
}

function ChecklistCard({ data }: { data: Record<string, any> }) {
  const items = data.items || [];
  const done = items.filter((i: any) => i.done).length;
  const percent = items.length > 0 ? (done / items.length) * 100 : 0;
  return (
    <Card className="p-4 gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-card-foreground">{data.title || 'Checklist'}</h4>
        <span className="text-xs text-muted-foreground">{done}/{items.length}</span>
      </div>
      <Progress value={percent} className="h-1.5" />
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-2.5">
            <div className={`size-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-primary' : 'border-2 border-border'}`}>
              {item.done && <Check className="size-2.5 text-primary-foreground" />}
            </div>
            <span className={`text-sm ${item.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{item.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ChoiceCard({ data, onChoice }: { data: Record<string, any>; onChoice: (id: string, label: string) => void }) {
  return (
    <Card className="p-4 gap-3">
      {data.question && <h4 className="text-sm text-card-foreground">{data.question}</h4>}
      <div className="space-y-2">
        {(data.options || []).map((opt: any) => (
          <button key={opt.id} onClick={() => onChoice(opt.id, opt.label)} className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg text-left active:scale-[0.98] transition-all hover:bg-accent">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{opt.label}</p>
              {opt.description && <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function MessageDraftCard({ data }: { data: Record<string, any> }) {
  return (
    <Card className="p-4 gap-2">
      <Badge variant="secondary" className="w-fit text-[10px]">{data.platform || 'Draft'}</Badge>
      {data.subject && <p className="text-sm text-card-foreground">{data.subject}</p>}
      <div className="bg-muted rounded-lg p-3">
        <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{data.content}</p>
      </div>
    </Card>
  );
}

function ConfirmationCard({ data, onConfirm, onCancel }: { data: Record<string, any>; onConfirm: () => void; onCancel: () => void }) {
  const isDestructive = data.variant === 'destructive';
  return (
    <Card className={`p-4 gap-4 ${isDestructive ? 'border-destructive/30' : data.variant === 'warning' ? 'border-secondary' : ''}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`size-5 flex-shrink-0 mt-0.5 ${isDestructive ? 'text-destructive' : data.variant === 'warning' ? 'text-secondary-foreground' : 'text-primary'}`} />
        <div>
          <h4 className="text-sm text-card-foreground">{data.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="secondary" onClick={onCancel} className="flex-1">{data.cancelLabel || 'Cancel'}</Button>
        <Button variant={isDestructive ? 'destructive' : 'default'} onClick={onConfirm} className="flex-1">{data.confirmLabel || 'Confirm'}</Button>
      </div>
    </Card>
  );
}

function AnnouncementOptionsCard({ data, onSelect }: { data: Record<string, any>; onSelect: (id: string, label: string) => void }) {
  return (
    <Card className="p-4 gap-2">
      {(data.options || []).map((opt: any) => (
        <button key={opt.id} onClick={() => onSelect(opt.id, opt.label)} className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg text-left active:scale-[0.98] transition-all hover:bg-accent">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Sparkles className="size-4 text-primary" /></div>
          <span className="text-sm text-card-foreground">{opt.label}</span>
        </button>
      ))}
    </Card>
  );
}

function AgendaPreviewCard({ data }: { data: Record<string, any> }) {
  const typeColors: Record<string, string> = { intro: 'bg-accent text-accent-foreground', talk: 'bg-primary/10 text-primary', workshop: 'bg-primary/5 text-primary', qa: 'bg-secondary text-secondary-foreground', break: 'bg-muted text-muted-foreground' };
  return (
    <Card className="p-4 gap-3">
      <h4 className="text-sm text-card-foreground">Agenda</h4>
      <div className="space-y-2">
        {(data.sessions || []).map((session: any, idx: number) => (
          <div key={idx} className="flex items-start gap-3 py-2 border-b border-muted last:border-0">
            <span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5">{session.time}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{session.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{session.duration}</span>
                <Badge variant="secondary" className={`text-[10px] ${typeColors[session.type] || 'bg-muted text-muted-foreground'}`}>{session.type}</Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function SpeakerListCard({ data }: { data: Record<string, any> }) {
  return (
    <Card className="p-4 gap-3">
      <h4 className="text-sm text-card-foreground">Speakers</h4>
      <div className="space-y-3">
        {(data.speakers || []).map((speaker: any, idx: number) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-secondary-foreground">{speaker.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground">{speaker.name}</p>
              <p className="text-xs text-muted-foreground">{speaker.role || speaker.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function RichCardRenderer({ card, onAction }: { card: RichCard; onAction: (action: string) => void }) {
  switch (card.type) {
    case 'event_preview': return <EventPreviewCard data={card.data} />;
    case 'checklist': return <ChecklistCard data={card.data} />;
    case 'choice': return <ChoiceCard data={card.data} onChoice={(id, label) => onAction(label)} />;
    case 'message_draft': return <MessageDraftCard data={card.data} />;
    case 'confirmation': return <ConfirmationCard data={card.data} onConfirm={() => onAction(card.data.confirmLabel || 'Confirmed')} onCancel={() => onAction(card.data.cancelLabel || 'Cancelled')} />;
    case 'announcement_options': return <AnnouncementOptionsCard data={card.data} onSelect={(id, label) => onAction(label)} />;
    case 'agenda_preview': return <AgendaPreviewCard data={card.data} />;
    case 'speaker_list': return <SpeakerListCard data={card.data} />;
    default: return null;
  }
}

// ─── Main LeapySheet Component ────────────────────────────────
export function LeapySheet({ isOpen, context, onClose, onComplete }: LeapySheetProps) {
  const [messages, setMessages] = useState<LeapyMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages when context changes
  useEffect(() => {
    if (isOpen && context) {
      const config = getLeapyConfig(context);
      const initialMessage: LeapyMessage = {
        id: 'initial',
        role: 'leapy',
        content: config.openingMessage,
        timestamp: new Date(),
        richCards: config.initialCards.length > 0 ? config.initialCards : undefined,
        suggestions: config.suggestions.length > 0 ? config.suggestions : undefined,
      };
      setMessages([initialMessage]);
      setInputValue('');
      setIsTyping(false);
      setUserTurnCount(0);
      setUserHistory([]);
    }
  }, [isOpen, context?.type, context?.entityId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback((text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const currentTurn = userTurnCount;
    const currentHistory = [...userHistory, messageText];

    // Add user message
    const userMsg: LeapyMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setShowAttachMenu(false);
    setUserTurnCount(prev => prev + 1);
    setUserHistory(currentHistory);

    // Resolve flow response
    setTimeout(() => {
      const response = resolveFlow(
        context?.type || 'general',
        messageText,
        currentTurn,
        currentHistory,
        context?.entityData,
        context?.entityId,
      );

      const leapyMsg: LeapyMessage = {
        id: `leapy-${Date.now()}`,
        role: 'leapy',
        content: response.content,
        timestamp: new Date(),
        richCards: response.richCards,
        suggestions: response.suggestions,
      };
      setMessages(prev => [...prev, leapyMsg]);
      setIsTyping(false);

      // If flow is done, optionally call onComplete
      if (response.done && onComplete) {
        // Small delay so user sees the final message
        setTimeout(() => onComplete({ contextType: context?.type, result: 'completed' }), 2000);
      }
    }, 600 + Math.random() * 500);
  }, [inputValue, context, userTurnCount, userHistory, onComplete]);

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleCardAction = (action: string) => {
    handleSend(action);
  };

  if (!isOpen) return null;

  // Get display label for context
  const getContextLabel = () => {
    if (!context) return 'Chat';
    const labels: Partial<Record<string, string>> = {
      create_event: 'Create Event',
      create_event_in_community: 'Create Event',
      duplicate_event: 'Duplicate Event',
      edit_event_details: 'Edit Event',
      edit_event_cover: 'Cover Image',
      edit_event_description: 'Description',
      add_speakers: 'Add Speakers',
      edit_speakers: 'Edit Speakers',
      build_agenda: 'Build Agenda',
      edit_agenda: 'Edit Agenda',
      set_registration: 'Registration',
      set_tickets: 'Tickets',
      set_location: 'Location',
      set_reminders: 'Reminders',
      add_cohost: 'Co-hosts',
      add_resources: 'Resources',
      review_checklist: 'Checklist',
      publish_event: 'Publish',
      edit_published_event: 'Edit Event',
      send_update: 'Send Update',
      message_attendees: 'Message All',
      message_individual: 'Message',
      manage_waitlist: 'Waitlist',
      increase_capacity: 'Capacity',
      close_registration: 'Registration',
      share_event: 'Share Event',
      generate_qr: 'QR Code',
      postpone_event: 'Postpone',
      cancel_event: 'Cancel Event',
      share_join_link: 'Join Link',
      check_in_attendees: 'Check-in',
      send_live_announcement: 'Announce',
      share_live_resource: 'Share Resource',
      manage_qa: 'Q&A',
      extend_time: 'Extend Time',
      end_event: 'End Event',
      upload_recording: 'Recording',
      share_recording: 'Share Recording',
      send_followup: 'Follow-up',
      create_feedback_survey: 'Feedback Survey',
      summarize_feedback: 'Feedback Summary',
      create_recap_post: 'Recap Post',
      download_attendees: 'Export',
      archive_event: 'Archive',
      register_event: 'Register',
      join_waitlist: 'Waitlist',
      cancel_registration: 'Cancel',
      update_registration: 'Update',
      add_to_calendar: 'Calendar',
      set_reminder: 'Reminder',
      ask_about_event: 'Ask Leapy',
      invite_friend: 'Invite',
      share_attending: 'Share',
      ask_question_live: 'Q&A',
      take_notes: 'Notes',
      report_issue: 'Report Issue',
      submit_feedback: 'Feedback',
      rate_event: 'Rate',
      share_recap: 'Share Recap',
      connect_speaker: 'Connect',
      connect_attendees: 'Connect',
      get_certificate: 'Certificate',
      find_similar: 'Find Events',
      download_recording: 'Download',
    };
    return labels[context.type] || 'Leapy';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-foreground/20"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 top-16 flex flex-col"
          >
            <div className="bg-card rounded-t-2xl border-t border-border flex flex-col h-full overflow-hidden">
              {/* Handle bar */}
              <div className="flex justify-center pt-2 pb-1">
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full active:scale-95 transition-all -ml-2"
                >
                  <X className="size-5 text-secondary-foreground" />
                </button>
                <div className="flex items-center gap-2">
                  <LeapyIcon className="size-5" />
                  <span className="text-sm text-card-foreground">Leapy</span>
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">
                    {getContextLabel()}
                  </Badge>
                </div>
                <div className="w-9" />
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id}>
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="bg-primary rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                          <p className="text-sm text-primary-foreground">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Leapy avatar + message */}
                        <div className="flex items-start gap-2.5">
                          <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <LeapyIcon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-card-foreground leading-relaxed whitespace-pre-line">
                              {message.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={i} className="text-card-foreground">{part.slice(2, -2)}</strong>;
                                }
                                return <span key={i}>{part}</span>;
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Rich Cards */}
                        {message.richCards && message.richCards.length > 0 && (
                          <div className="ml-9 space-y-2">
                            {message.richCards.map((card, idx) => (
                              <RichCardRenderer
                                key={idx}
                                card={card}
                                onAction={handleCardAction}
                              />
                            ))}
                          </div>
                        )}

                        {/* Suggestion chips */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="ml-9 flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3.5 py-2 bg-primary/10 text-primary rounded-full text-xs active:scale-[0.97] transition-all"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-start gap-2.5">
                    <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <LeapyIcon className="size-4" />
                    </div>
                    <div className="flex items-center gap-1 py-2">
                      <div className="size-2 bg-border rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="size-2 bg-border rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="size-2 bg-border rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attach Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="px-4 py-2 flex gap-4">
                      <button className="flex flex-col items-center gap-1 py-2 px-3">
                        <div className="size-10 rounded-full bg-accent flex items-center justify-center">
                          <ImageIcon className="size-5 text-accent-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">Image</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 py-2 px-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Camera className="size-5 text-primary" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">Camera</span>
                      </button>
                      <button className="flex flex-col items-center gap-1 py-2 px-3">
                        <div className="size-10 rounded-full bg-secondary flex items-center justify-center">
                          <Paperclip className="size-5 text-secondary-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">File</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input Bar */}
              <div className="bg-card border-t border-border px-4 py-3 pb-6">
                <div className="flex items-end gap-2">
                  <div className="flex-1 bg-muted rounded-2xl px-4 py-3 border border-border">
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tell Leapy what you need..."
                        className="flex-1 bg-transparent outline-none text-sm text-card-foreground placeholder:text-muted-foreground"
                      />
                      <div className="flex items-center gap-1">
                        {!inputValue.trim() && (
                          <>
                            <button
                              onClick={() => setShowAttachMenu(!showAttachMenu)}
                              className="p-1.5 hover:bg-secondary rounded-full active:scale-95 transition-all"
                            >
                              <Plus className="size-4 text-muted-foreground" />
                            </button>
                            <button className="p-1.5 hover:bg-secondary rounded-full active:scale-95 transition-all">
                              <Mic className="size-4 text-muted-foreground" />
                            </button>
                          </>
                        )}
                        {inputValue.trim() && (
                          <button
                            onClick={() => handleSend()}
                            className="p-2 bg-primary rounded-full active:scale-95 transition-all"
                          >
                            <Send className="size-3.5 text-primary-foreground" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}