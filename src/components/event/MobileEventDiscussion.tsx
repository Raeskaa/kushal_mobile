import { useState } from 'react';
import { Send, Image, Smile, MoreHorizontal, ThumbsUp, MessageSquare, Sparkles, StickyNote, Flag, HelpCircle } from 'lucide-react';
import { type MockEvent } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import { type LeapyContext } from '../../data/leapyContexts';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface MobileEventDiscussionProps {
  event: MockEvent;
  isAdmin?: boolean;
  onOpenLeapy?: (context: LeapyContext) => void;
}

interface ChatMessage {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  likes: number;
  replies: number;
  isHost?: boolean;
  liked?: boolean;
}

const initialMessages: ChatMessage[] = [
  { id: 'm1', author: 'Alex Johnson', avatar: 'AJ', content: 'Really excited about the workshop! Is there any pre-reading material we should go through before the event?', time: '2h ago', likes: 4, replies: 2 },
  { id: 'm2', author: 'Mahesh Kumar', avatar: 'MK', content: 'Great question! I\'ll share a prep guide with everyone registered by this weekend.', time: '1h ago', likes: 8, replies: 0, isHost: true },
  { id: 'm3', author: 'Priya Patel', avatar: 'PP', content: 'Will the sessions be recorded for those who might miss parts of it?', time: '45m ago', likes: 12, replies: 1 },
  { id: 'm4', author: 'Chris Brown', avatar: 'CB', content: 'Looking forward to the networking session. Anyone from the Bay Area attending in person?', time: '30m ago', likes: 3, replies: 5 },
];

export function MobileEventDiscussion({ event, isAdmin, onOpenLeapy }: MobileEventDiscussionProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      author: 'You',
      avatar: 'SC',
      content: message.trim(),
      time: 'Just now',
      likes: 0,
      replies: 0,
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLike = (msgId: string) => {
    setMessages(prev => prev.map(m =>
      m.id === msgId
        ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 }
        : m
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      {/* Leapy Action Bar */}
      <div className="px-4 py-2 border-b border-border bg-card flex items-center gap-2 overflow-x-auto no-scrollbar">
        {isAdmin ? (
          <>
            <Button variant="secondary" size="sm" onClick={() => leapy('manage_qa')} className="bg-primary/10 text-primary hover:bg-primary/15 flex-shrink-0 rounded-full">
              <Sparkles className="size-3" />
              Manage Q&A
            </Button>
            <Button variant="secondary" size="sm" onClick={() => leapy('send_live_announcement')} className="bg-primary/10 text-primary hover:bg-primary/15 flex-shrink-0 rounded-full">
              <Sparkles className="size-3" />
              Announce
            </Button>
            <Button variant="secondary" size="sm" onClick={() => leapy('share_live_resource')} className="flex-shrink-0 rounded-full">
              <Sparkles className="size-3 text-primary" />
              Share File
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={() => leapy('ask_question_live')} className="bg-primary/10 text-primary hover:bg-primary/15 flex-shrink-0 rounded-full">
              <Sparkles className="size-3" />
              Ask a Question
            </Button>
            <Button variant="secondary" size="sm" onClick={() => leapy('take_notes')} className="flex-shrink-0 rounded-full">
              <StickyNote className="size-3 text-primary" />
              Notes
            </Button>
            <Button variant="secondary" size="sm" onClick={() => leapy('report_issue')} className="flex-shrink-0 rounded-full">
              <Flag className="size-3 text-primary" />
              Report
            </Button>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2.5">
            <Avatar className="size-8 flex-shrink-0">
              <AvatarFallback className={`text-[10px] ${msg.isHost ? 'bg-primary text-primary-foreground' : ''}`}>
                {msg.avatar}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-card-foreground">{msg.author}</span>
                {msg.isHost && (
                  <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">Host</Badge>
                )}
                <span className="text-[10px] text-muted-foreground">{msg.time}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>

              <div className="flex items-center gap-4 mt-1.5">
                <button
                  onClick={() => handleLike(msg.id)}
                  className={`flex items-center gap-1 text-[10px] active:scale-95 transition-all ${
                    msg.liked ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <ThumbsUp className="size-3" />
                  {msg.likes}
                </button>
                <button
                  onClick={() => toast('Reply thread coming soon')}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground active:scale-95 transition-all"
                >
                  <MessageSquare className="size-3" />
                  {msg.replies > 0 ? `${msg.replies} replies` : 'Reply'}
                </button>
                <button
                  onClick={() => toast('Message options coming soon')}
                  className="text-[10px] text-muted-foreground active:scale-95 transition-all"
                >
                  <MoreHorizontal className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card p-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 bg-muted rounded-xl border border-border px-3 py-2.5 flex items-end gap-2">
            <input
              type="text"
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={() => toast('Emoji picker coming soon')} className="p-1 active:scale-95 transition-all">
                <Smile className="size-4 text-muted-foreground" />
              </button>
              <button onClick={() => toast('Image upload coming soon')} className="p-1 active:scale-95 transition-all">
                <Image className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            className={`rounded-full ${message.trim() ? '' : 'bg-secondary text-muted-foreground hover:bg-secondary'}`}
            disabled={!message.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
