import { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Lightbulb, BarChart3, Rocket, Brain, RefreshCw, Command, Check } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import LeapyLogo from '../imports/Button';

interface CopilotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'admin' | 'moderator' | 'member';
  context?: 'course' | 'community' | 'general';
  currentFocus?: {
    type: 'field' | 'section' | 'page';
    name: string;
    value?: string;
  };
  onApplySuggestion?: (suggestion: any) => void;
}

type AIModeType = 'builder' | 'helper' | 'analyst';

interface Suggestion {
  id: string;
  title: string;
  preview: string;
  impact?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const modes = [
  { id: 'builder' as AIModeType, label: 'Build', icon: Rocket },
  { id: 'helper' as AIModeType, label: 'Help', icon: Lightbulb },
  { id: 'analyst' as AIModeType, label: 'Analyze', icon: BarChart3 },
];

export function CopilotPanel({ 
  isOpen, 
  onClose, 
  userRole = 'admin', 
  context = 'general',
  currentFocus,
  onApplySuggestion 
}: CopilotPanelProps) {
  const [aiMode, setAiMode] = useState<AIModeType>('builder');
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simplified, contextual suggestions
  const getContextualSuggestions = (): Suggestion[] => {
    if (aiMode !== 'builder') return [];
    
    if (context === 'community') {
      if (currentFocus?.name === 'Community Name') {
        return [
          {
            id: '1',
            title: 'AI Innovators Hub',
            preview: 'Professional community for tech leaders and AI enthusiasts',
            impact: '32% higher engagement'
          },
          {
            id: '2',
            title: 'Creative Studio Collective',
            preview: 'Where designers, artists, and creators collaborate',
            impact: '28% better retention'
          }
        ];
      } else if (currentFocus?.name === 'Description') {
        return [
          {
            id: '3',
            title: 'Engaging Introduction',
            preview: 'Join a vibrant community of innovators shaping the future. Share knowledge, collaborate on projects, and grow together with peers who inspire you.',
            impact: '45% conversion boost'
          }
        ];
      }
    }
    
    return [];
  };

  const suggestions = getContextualSuggestions();

  const handleSend = () => {
    if (!chatInput.trim() || isGenerating) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsGenerating(true);
    setChatInput('');
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getSmartResponse(chatInput),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsGenerating(false);
    }, 1200);
  };

  const getSmartResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('channel')) {
      return "Start with #announcements, #general, and #help. These three channels cover most community needs. Add more as your community grows.";
    } else if (lower.includes('engage')) {
      return "Focus on consistency. Post 3-5 times weekly and respond within 2 hours. Recognition goes a long way—celebrate member wins publicly.";
    }
    return "I can help with that. What specific aspect would you like guidance on?";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
    const message: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Applied: ${suggestion.title}`,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, message]);
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden" style={{ width: '420px' }}>
      {/* Minimal Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-8">
              <LeapyLogo />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Leapy</p>
              <p className="text-xs text-gray-500">AI Assistant</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="size-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="size-4 text-gray-500" />
          </button>
        </div>

        {/* Switcher Style Mode Selector */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {modes.map((mode) => {
            const Icon = mode.icon;
            const isActive = aiMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setAiMode(mode.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-all ${
                  isActive 
                    ? 'bg-white text-purple-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="size-4" />
                <span className="text-xs font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Context Indicator - Subtle */}
      {currentFocus && aiMode === 'builder' && (
        <div className="px-6 py-3 bg-purple-50 border-b border-purple-100">
          <p className="text-xs text-purple-600">Editing: <span className="font-medium">{currentFocus.name}</span></p>
        </div>
      )}

      {/* Main Content - Lots of breathing room */}
      <ScrollArea className="flex-1 px-6 py-6" ref={scrollRef}>
        <div className="space-y-8">
          
          {/* BUILDER MODE - Clean Suggestions */}
          {aiMode === 'builder' && (
            <div className="space-y-6">
              {suggestions.length > 0 ? (
                <>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                      Suggestions
                    </p>
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id}
                          onMouseEnter={() => setHoveredSuggestion(suggestion.id)}
                          onMouseLeave={() => setHoveredSuggestion(null)}
                          className="group relative"
                        >
                          <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 bg-white transition-all cursor-pointer">
                            <p className="font-medium text-gray-900 mb-2">{suggestion.title}</p>
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{suggestion.preview}</p>
                            
                            {suggestion.impact && (
                              <p className="text-xs text-green-600 font-medium">{suggestion.impact}</p>
                            )}

                            {hoveredSuggestion === suggestion.id && (
                              <button
                                onClick={() => handleApplySuggestion(suggestion)}
                                className="absolute top-4 right-4 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                              >
                                <Check className="size-3" />
                                Apply
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="size-12 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                    <Sparkles className="size-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Ready to help you build</p>
                  <p className="text-xs text-gray-400">Focus on a field to see suggestions</p>
                </div>
              )}
            </div>
          )}

          {/* HELPER MODE - Clean Chat */}
          {aiMode === 'helper' && (
            <div className="space-y-6">
              {chatHistory.length === 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-8">
                    <div className="size-12 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                      <Lightbulb className="size-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">How can I help?</p>
                    <p className="text-xs text-gray-400">Ask me anything</p>
                  </div>

                  {/* Quick Topics - Minimal */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                      Quick Help
                    </p>
                    {[
                      'How to increase engagement?',
                      'Best practices for growth',
                      'Setting up guidelines'
                    ].map((topic, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChatInput(topic)}
                        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm text-gray-700"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {chatHistory.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="size-8 flex-shrink-0 mt-1">
                          <LeapyLogo />
                        </div>
                      )}
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
                        <div className={`inline-block px-4 py-3 rounded-2xl ${
                          message.role === 'user' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isGenerating && (
                    <div className="flex gap-3">
                      <div className="size-8 flex-shrink-0 mt-1">
                        <LeapyLogo />
                      </div>
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ANALYST MODE - Clean Metrics */}
          {aiMode === 'analyst' && userRole === 'admin' && (
            <div className="space-y-6">
              {/* Health Score */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Community Health
                </p>
                <div className="p-6 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-purple-50">
                  <div className="flex items-end gap-2 mb-4">
                    <p className="text-5xl font-bold text-purple-600">73</p>
                    <p className="text-lg text-gray-400 mb-2">/ 100</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full bg-purple-600 transition-all" 
                      style={{ width: '73%' }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Good health overall. Room for improvement.</p>
                </div>
              </div>

              {/* Key Metrics - Simplified */}
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
                  Key Metrics
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Growth', value: '+23%', subtext: 'This month', color: 'text-green-600' },
                    { label: 'Engagement', value: '67%', subtext: 'Active rate', color: 'text-blue-600' },
                    { label: 'Members', value: '247', subtext: '+12 this week', color: 'text-purple-600' }
                  ].map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{metric.label}</p>
                        <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                      </div>
                      <p className="text-xs text-gray-400">{metric.subtext}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single Insight */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  💡 Peak activity is weekdays 2-4 PM. Schedule your posts during this window for maximum engagement.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Clean Input Area */}
      <div className="px-6 py-5 border-t border-gray-100">
        <div className="relative">
          <Textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="resize-none text-sm bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all pr-12 rounded-xl"
            rows={3}
          />
          <button 
            onClick={handleSend}
            disabled={!chatInput.trim() || isGenerating}
            className="absolute bottom-3 right-3 size-9 rounded-lg flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <RefreshCw className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>
        
        {/* Minimal Hint */}
        <p className="text-xs text-gray-400 mt-3 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono">Enter</kbd> to send
        </p>
      </div>
    </div>
  );
}