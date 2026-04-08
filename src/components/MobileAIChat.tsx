import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Sparkles, Mic, Send, X, Zap, Users, BookOpen, TrendingUp, Camera } from 'lucide-react';
import { imgGroup } from '../imports/svg-qpgp8';
import { Badge } from './ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface MobileAIChatProps {
  open: boolean;
  onClose: () => void;
  context?: 'community' | 'course' | 'general';
}

export function MobileAIChat({ open, onClose, context = 'general' }: MobileAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: context === 'community' 
        ? "Hi! I'm Leapy AI 👋 I can help you build an amazing community. What would you like to create?"
        : context === 'course'
        ? "Hi! I'm Leapy AI 👋 I can help you create engaging courses. What topic are you thinking about?"
        : "Hi! I'm Leapy AI 👋 How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickPrompts = context === 'community' ? [
    { icon: Users, text: 'Build a community', color: 'purple' },
    { icon: Zap, text: 'Import from Slack', color: 'blue' },
    { icon: TrendingUp, text: 'Grow my audience', color: 'green' },
    { icon: BookOpen, text: 'Create a course', color: 'orange' },
  ] : [
    { icon: BookOpen, text: 'Create course outline', color: 'purple' },
    { icon: Users, text: 'Build community', color: 'blue' },
    { icon: Zap, text: 'Content ideas', color: 'green' },
    { icon: TrendingUp, text: 'Marketing tips', color: 'orange' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Great! I can help you with that. Let's start by understanding your goals. ${input.toLowerCase().includes('community') ? 'What type of community do you want to build?' : input.toLowerCase().includes('course') ? 'What topic will your course cover?' : 'Can you tell me more about what you need?'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickPrompt = (text: string) => {
    setInput(text);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="px-4 py-4 border-b border-border flex-shrink-0 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-11 bg-primary rounded-full flex items-center justify-center ring-4 ring-primary/10">
                <img src={imgGroup} alt="Leapy" className="size-6" />
              </div>
              <div>
                <SheetTitle className="text-lg flex items-center gap-2">
                  Leapy AI
                  <Badge className="bg-primary/10 text-primary text-xs border-primary/20">Online</Badge>
                </SheetTitle>
                <p className="text-xs text-muted-foreground">Your AI assistant • Always here to help</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="size-5" />
            </button>
          </div>
        </SheetHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="size-8 bg-primary rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Sparkles className="size-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center mr-2">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          {messages.length === 1 && !isTyping && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground mb-3">Quick prompts:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickPrompts.map((prompt, idx) => {
                  const Icon = prompt.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="p-3 bg-card border border-border rounded-xl hover:border-primary active:scale-95 transition-all text-left"
                    >
                      <Icon className={`size-5 text-${prompt.color}-600 mb-1`} />
                      <p className="text-xs text-foreground">{prompt.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-4 py-4 border-t border-border bg-card flex-shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-muted rounded-2xl px-4 py-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask Leapy anything..."
                className="w-full bg-transparent resize-none focus:outline-none text-sm text-foreground placeholder-muted-foreground max-h-24"
                rows={1}
              />
              <div className="flex items-center gap-2 mt-2">
                <button className="p-1.5 hover:bg-secondary rounded-lg">
                  <Mic className="size-4 text-muted-foreground" />
                </button>
                <button className="p-1.5 hover:bg-secondary rounded-lg">
                  <Camera className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="size-12 bg-primary rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform flex-shrink-0"
            >
              <Send className="size-5 text-white" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}