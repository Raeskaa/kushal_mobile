import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  X, Send, Mic, Camera, Image as ImageIcon, Sparkles, 
  Zap, TrendingUp, Users, BookOpen, Lightbulb, 
  ChevronDown, MoreVertical, Clock, CheckCircle2,
  Copy, ThumbsUp, ThumbsDown, RefreshCw, Volume2
} from 'lucide-react';
import { LeapyIcon } from './LeapyIcon';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  actions?: Array<{ label: string; icon: any; onClick: () => void }>;
}

interface MobileEnhancedAIProps {
  open: boolean;
  onClose: () => void;
  context?: 'community' | 'course' | 'event' | 'general';
  contextData?: {
    title?: string;
    type?: string;
  };
}

export function MobileEnhancedAI({ open, onClose, context = 'general', contextData }: MobileEnhancedAIProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getContextualGreeting(context, contextData),
      timestamp: new Date(),
      suggestions: getContextualSuggestions(context),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function getContextualGreeting(ctx: string, data?: any) {
    switch (ctx) {
      case 'community':
        return data?.title 
          ? `Hey! I'm here to help you manage **${data.title}**. What would you like to work on?`
          : "Hi! Let's build an amazing community together. What's your vision?";
      case 'course':
        return data?.title
          ? `Ready to work on **${data.title}**? I can help with curriculum, content, or student engagement!`
          : "Let's create an incredible learning experience! What kind of course are you building?";
      case 'event':
        return "Planning an event? I can help with everything from agenda to promotion!";
      default:
        return "Hi! I'm Leapy, your AI assistant. I'm here to help you create, manage, and grow your learning communities. What would you like to do today?";
    }
  }

  function getContextualSuggestions(ctx: string) {
    switch (ctx) {
      case 'community':
        return [
          'Analyze member engagement',
          'Suggest new channels',
          'Create welcome message',
          'Review moderation needs',
        ];
      case 'course':
        return [
          'Generate curriculum outline',
          'Create quiz questions',
          'Write lesson descriptions',
          'Suggest assignments',
        ];
      case 'event':
        return [
          'Create event agenda',
          'Write invitation copy',
          'Suggest discussion topics',
          'Plan follow-up actions',
        ];
      default:
        return [
          'Create a new community',
          'Build a course',
          'Import from Slack',
          'Show me examples',
        ];
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setShowQuickActions(false);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSmartResponse(input, context),
        timestamp: new Date(),
        suggestions: getFollowUpSuggestions(input, context),
        actions: getContextualActions(input, context),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  function getSmartResponse(msg: string, ctx: string) {
    const lower = msg.toLowerCase();
    
    if (lower.includes('member') || lower.includes('engagement')) {
      return "I analyzed your community and found:\n\n• **68% engagement rate** (↑5% from last week)\n• **Top contributors**: Sarah, Mike, Emma\n• **Peak activity**: Weekdays 2-4 PM\n\n**Recommendations:**\n1. Create a 'Community Champions' program for top contributors\n2. Schedule events during peak hours\n3. Add a #wins channel for member celebrations\n\nWant me to set any of these up?";
    }
    
    if (lower.includes('course') || lower.includes('curriculum')) {
      return "I can help you create a structured course! Here's a suggested outline:\n\n**Module 1: Foundations** (Week 1-2)\n• Introduction & Overview\n• Core Concepts\n• Hands-on Exercise\n\n**Module 2: Deep Dive** (Week 3-4)\n• Advanced Techniques\n• Case Studies\n• Group Project\n\n**Module 3: Application** (Week 5-6)\n• Real-world Practice\n• Final Project\n• Assessment\n\nShall I create the full curriculum with lesson plans?";
    }
    
    if (lower.includes('content') || lower.includes('post')) {
      return "I can generate engaging content for you! What type:\n\n📝 **Announcements** - Important updates\n💬 **Discussion starters** - Spark conversations\n🎓 **Educational posts** - Share knowledge\n🎉 **Celebration posts** - Recognize achievements\n\nWhich would you like me to write?";
    }
    
    return "I understand you want to work on that. Let me help you create something amazing! Could you tell me a bit more about:\n\n• What's the main goal?\n• Who's your target audience?\n• Any specific requirements?\n\nThis will help me give you the best recommendations!";
  }

  function getFollowUpSuggestions(msg: string, ctx: string) {
    return [
      'Show me more details',
      'Create this for me',
      'Suggest alternatives',
      'Export as document',
    ];
  }

  function getContextualActions(msg: string, ctx: string) {
    return [
      { label: 'Create Channel', icon: Zap, onClick: () => {} },
      { label: 'Generate Post', icon: Sparkles, onClick: () => {} },
      { label: 'View Analytics', icon: TrendingUp, onClick: () => {} },
    ];
  }

  const quickActions = [
    { icon: Zap, label: 'Quick Analysis', desc: 'Get instant insights', color: 'purple' },
    { icon: Sparkles, label: 'Generate Content', desc: 'AI-written posts & materials', color: 'blue' },
    { icon: Users, label: 'Member Insights', desc: 'Understand your audience', color: 'green' },
    { icon: BookOpen, label: 'Course Builder', desc: 'Create curriculum', color: 'orange' },
  ];

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl p-0 flex flex-col">
        {/* Enhanced Header */}
        <SheetHeader className="px-4 py-4 border-b border-border flex-shrink-0 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <LeapyIcon className="size-12" />
                <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-card animate-pulse" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <SheetTitle className="text-lg">Leapy AI</SheetTitle>
                  <Badge className="bg-primary/10 text-primary text-xs border-primary/20">
                    <div className="size-1.5 bg-primary rounded-full mr-1.5" />
                    Online
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="size-3" />
                  {context === 'community' && 'Community Assistant'}
                  {context === 'course' && 'Course Builder'}
                  {context === 'event' && 'Event Planner'}
                  {context === 'general' && 'Your AI Learning Partner'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <MoreVertical className="size-5 text-muted-foreground" />
              </button>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="size-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Context Badge */}
          {contextData?.title && (
            <div className="mt-3 px-3 py-2 bg-card rounded-lg border border-primary/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  {context === 'community' && <Users className="size-4 text-primary" />}
                  {context === 'course' && <BookOpen className="size-4 text-primary" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Working on</p>
                  <p className="text-sm text-card-foreground">{contextData.title}</p>
                </div>
              </div>
              <button className="text-xs text-primary">Switch</button>
            </div>
          )}
        </SheetHeader>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.role === 'assistant' && (
                <LeapyIcon className="size-8 flex-shrink-0" />
              )}

              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div
                  className={`inline-block max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                      : 'bg-card border border-border rounded-2xl rounded-tl-sm'
                  } px-4 py-3`}
                >
                  <p className={`text-sm whitespace-pre-line ${
                    message.role === 'user' ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {message.content}
                  </p>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group">
                        <Copy className="size-3.5 text-muted-foreground group-hover:text-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-muted rounded-lg transition-colors group">
                        <Volume2 className="size-3.5 text-muted-foreground group-hover:text-foreground" />
                      </button>
                      <button className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors group">
                        <ThumbsUp className="size-3.5 text-muted-foreground group-hover:text-primary" />
                      </button>
                      <button className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors group">
                        <ThumbsDown className="size-3.5 text-muted-foreground group-hover:text-destructive" />
                      </button>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Suggested actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(suggestion)}
                          className="px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg text-xs text-primary hover:bg-primary/10 active:scale-95 transition-all"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {message.actions.map((action, idx) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={idx}
                          onClick={action.onClick}
                          className="flex flex-col items-center gap-1.5 p-3 bg-card border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 active:scale-95 transition-all"
                        >
                          <Icon className="size-5 text-primary" />
                          <span className="text-xs text-secondary-foreground">{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <LeapyIcon className="size-8 flex-shrink-0" />
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Grid */}
          {showQuickActions && messages.length === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="size-4 text-primary" />
                Quick Actions
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setInput(action.label)}
                      className={`p-4 bg-primary/5 border border-primary/20 rounded-xl text-left active:scale-95 transition-all`}
                    >
                      <Icon className={`size-6 text-primary mb-2`} />
                      <p className="text-sm text-card-foreground mb-1">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input Area */}
        <div className="flex-shrink-0 border-t border-border bg-card p-4 safe-area-inset-bottom">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-muted border border-border rounded-2xl p-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything..."
                className="w-full bg-transparent resize-none text-sm text-foreground placeholder-muted-foreground focus:outline-none max-h-32"
                rows={1}
                style={{ minHeight: '24px' }}
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <Mic className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <Camera className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                  <ImageIcon className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            
            <Button
              onClick={handleSend}
              disabled={!input.trim()}
              className="size-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="size-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}