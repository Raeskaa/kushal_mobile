import { useState, useRef, useEffect } from 'react';
import { Send, Mic, ThumbsUp, ThumbsDown, Share2, Sparkles, X, MoreVertical, ChevronDown, Plus, Image as ImageIcon, Paperclip, Camera } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'leapy';
  content: string;
  timestamp: Date;
  recommendations?: Recommendation[];
  suggestions?: string[];
  showFeedback?: boolean;
}

interface Recommendation {
  type: 'course' | 'event' | 'community';
  id: string;
  title: string;
  image?: string;
  rating?: number;
  price?: string;
  enrollments?: number;
  date?: string;
  location?: string;
  attendees?: number;
  members?: number;
  description?: string;
}

interface MobileLeapyProps {
  userType?: 'creator' | 'learner';
  onClose?: () => void;
  isOpen?: boolean;
}

type LeapyMode = 'build' | 'help' | 'analyze';
type FeedbackType = 'harmful' | 'inaccurate' | 'irrelevant' | 'other' | null;

export function MobileLeapy({ userType = 'learner', onClose, isOpen = false }: MobileLeapyProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'leapy',
      content: userType === 'creator' 
        ? "Hi! I'm Leapy, your AI course creation assistant. I can help you design courses, manage your community, and grow your creator business. What would you like help with today?"
        : "Hi! I'm Leapy, your learning companion. I can help you discover courses, find communities, and suggest events based on your interests. What are you looking to learn?",
      timestamp: new Date(),
      suggestions: userType === 'creator'
        ? ['Create a new course', 'Analyze my community growth', 'Event marketing tips', 'Pricing strategies']
        : ['Web development courses', 'Design communities', 'Upcoming tech events', 'Career guidance']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<LeapyMode>('help');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Leapy 3');
  const [showModelSwitcher, setShowModelSwitcher] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [feedbackSelections, setFeedbackSelections] = useState({
    harmful: false,
    inaccurate: false,
    irrelevant: false,
    other: false
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'leapy-3', name: 'Leapy 3', description: 'Balanced for all tasks' },
    { id: 'leapy-pro', name: 'Leapy Pro', description: 'Most capable model' },
    { id: 'leapy-flash', name: 'Leapy Flash', description: 'Fastest responses' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when mode changes
  useEffect(() => {
    const initialMessage = getInitialMessage(mode, userType);
    setMessages([initialMessage]);
  }, [mode, userType]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate Leapy response
    setTimeout(() => {
      const leapyResponse = getLeapyResponse(inputValue, userType);
      setMessages(prev => [...prev, leapyResponse]);
    }, 1000);

    setInputValue('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Backdrop - subtle */}
      <div 
        className="absolute inset-0 bg-black/10 pointer-events-auto"
        onClick={onClose}
      />
      
      {/* Modal - Bottom sheet style */}
      <div className="absolute bottom-0 left-0 right-0 top-48 pointer-events-auto">
        <div className="bg-white rounded-t-2xl border-t border-gray-200 flex flex-col h-full overflow-hidden">
          {/* Handle bar */}
          <div className="flex justify-center pt-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-all -ml-2"
            >
              <X className="size-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm text-gray-900">Leapy</span>
                <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">beta</span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowModeDropdown(!showModeDropdown)}
                  className="flex items-center gap-1 px-2 py-1 hover:bg-gray-50 rounded-lg active:scale-95 transition-all"
                >
                  <span className="text-xs text-gray-600 capitalize">{mode}</span>
                  <ChevronDown className="size-3 text-gray-500" />
                </button>
                
                {/* Mode Dropdown */}
                {showModeDropdown && (
                  <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg overflow-hidden z-50 min-w-[120px]">
                    <button
                      onClick={() => {
                        setMode('build');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                        mode === 'build' ? 'bg-purple-50 text-[#420D74]' : 'text-gray-900'
                      }`}
                    >
                      Build
                    </button>
                    <button
                      onClick={() => {
                        setMode('help');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                        mode === 'help' ? 'bg-purple-50 text-[#420D74]' : 'text-gray-900'
                      }`}
                    >
                      Help
                    </button>
                    <button
                      onClick={() => {
                        setMode('analyze');
                        setShowModeDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                        mode === 'analyze' ? 'bg-purple-50 text-[#420D74]' : 'text-gray-900'
                      }`}
                    >
                      Analyze
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full active:scale-95 transition-all -mr-2">
              <MoreVertical className="size-5 text-gray-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-gray-200 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%]">
                      <p className="text-sm text-gray-900">{message.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-white">
                      <p className="text-sm text-gray-900 leading-relaxed">{message.content}</p>
                    </div>

                    {/* Recommendations */}
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="space-y-2">
                        {message.recommendations.map((rec) => (
                          <RecommendationCard key={rec.id} recommendation={rec} />
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 active:scale-98 transition-all"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="flex items-center gap-4 pt-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-full active:scale-95 transition-all">
                        <ThumbsUp className="size-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => {
                          setMessages(prev => prev.map(msg => 
                            msg.id === message.id ? { ...msg, showFeedback: !msg.showFeedback } : msg
                          ));
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                      >
                        <ThumbsDown className="size-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded-full active:scale-95 transition-all">
                        <Share2 className="size-4 text-gray-500" />
                      </button>
                    </div>

                    {/* Inline Feedback Form */}
                    {message.showFeedback && (
                      <div className="bg-white border border-gray-200 rounded-xl p-4 mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs text-gray-700">Select All That Apply (optional):</h3>
                          <button
                            onClick={() => {
                              setMessages(prev => prev.map(msg => 
                                msg.id === message.id ? { ...msg, showFeedback: false } : msg
                              ));
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full active:scale-95 transition-all"
                          >
                            <X className="size-3.5 text-gray-600" />
                          </button>
                        </div>
                        
                        <div className="space-y-2.5 mb-4">
                          <label className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={feedbackSelections.harmful}
                              onChange={(e) => setFeedbackSelections(prev => ({ ...prev, harmful: e.target.checked }))}
                              className="size-4 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-900">This is harmful/unsafe</span>
                          </label>
                          <label className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={feedbackSelections.inaccurate}
                              onChange={(e) => setFeedbackSelections(prev => ({ ...prev, inaccurate: e.target.checked }))}
                              className="size-4 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-900">This is inaccurate</span>
                          </label>
                          <label className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={feedbackSelections.irrelevant}
                              onChange={(e) => setFeedbackSelections(prev => ({ ...prev, irrelevant: e.target.checked }))}
                              className="size-4 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-900">This is irrelevant</span>
                          </label>
                          <label className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={feedbackSelections.other}
                              onChange={(e) => setFeedbackSelections(prev => ({ ...prev, other: e.target.checked }))}
                              className="size-4 rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-900">Something else</span>
                          </label>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              // Submit feedback logic here
                              setMessages(prev => prev.map(msg => 
                                msg.id === message.id ? { ...msg, showFeedback: false } : msg
                              ));
                              setFeedbackSelections({ harmful: false, inaccurate: false, irrelevant: false, other: false });
                            }}
                            className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700 rounded-lg text-xs transition-colors"
                          >
                            Submit Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 space-y-2">
            {/* Model Switcher Dropdown */}
            {showModelSwitcher && (
              <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-2">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.name);
                      setShowModelSwitcher(false);
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left ${
                      selectedModel === model.name ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="size-6 rounded-full bg-[#420D74] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="size-3.5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">{model.name}</div>
                      <div className="text-xs text-gray-500">{model.description}</div>
                    </div>
                    {selectedModel === model.name && (
                      <div className="size-4 rounded-full bg-[#420D74] flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="size-2.5 text-white" fill="currentColor" viewBox="0 0 12 12">
                          <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Attachment Menu */}
            {showAttachMenu && (
              <div className="bg-white border border-gray-200 rounded-2xl p-2 mb-2">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
                  <div className="size-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="size-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-gray-900">Upload image</div>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
                  <div className="size-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Camera className="size-4 text-green-600" />
                  </div>
                  <div className="text-sm text-gray-900">Take photo</div>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left">
                  <div className="size-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Paperclip className="size-4 text-orange-600" />
                  </div>
                  <div className="text-sm text-gray-900">Attach file</div>
                </button>
              </div>
            )}

            {/* Input Container */}
            <div className="flex items-end gap-2">
              {/* Multi-line Input Field */}
              <div className="flex-1 bg-gray-50 rounded-3xl px-4 py-3 border border-gray-200">
                {/* Model Selector Row */}
                <button
                  onClick={() => {
                    setShowModelSwitcher(!showModelSwitcher);
                    setShowAttachMenu(false);
                  }}
                  className="flex items-center gap-1 mb-2 hover:opacity-70 active:opacity-50 transition-opacity"
                >
                  <span className="text-xs text-gray-600">{selectedModel}</span>
                  <ChevronDown className="size-3 text-gray-500" />
                </button>

                {/* Input Row */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask Leapy"
                    className="flex-1 bg-transparent outline-none text-sm text-gray-900 placeholder:text-gray-500"
                  />
                  
                  {/* Right Actions */}
                  <div className="flex items-center gap-1">
                    {!inputValue.trim() && (
                      <>
                        <button
                          onClick={() => {
                            setShowAttachMenu(!showAttachMenu);
                            setShowModelSwitcher(false);
                          }}
                          className="p-1.5 hover:bg-gray-200 rounded-full active:scale-95 transition-all"
                        >
                          <Plus className="size-4 text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-200 rounded-full active:scale-95 transition-all">
                          <Mic className="size-4 text-gray-600" />
                        </button>
                      </>
                    )}
                    {inputValue.trim() && (
                      <button 
                        onClick={handleSendMessage}
                        className="p-2 bg-[#420D74] rounded-full active:scale-95 transition-all"
                      >
                        <Send className="size-4 text-white" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  if (recommendation.type === 'course') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden active:scale-98 transition-all">
        <div className="flex gap-3 p-3">
          <div className="size-20 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 line-clamp-2">{recommendation.title}</h3>
            {recommendation.rating && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-yellow-600">★</span>
                <span className="text-xs text-gray-700">{recommendation.rating}</span>
                {recommendation.enrollments && (
                  <span className="text-xs text-gray-500">({recommendation.enrollments.toLocaleString()})</span>
                )}
              </div>
            )}
            {recommendation.price && (
              <p className="text-sm text-[#420D74] mt-1">{recommendation.price}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (recommendation.type === 'event') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden active:scale-98 transition-all">
        <div className="flex gap-3 p-3">
          <div className="size-20 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 line-clamp-2">{recommendation.title}</h3>
            {recommendation.date && (
              <p className="text-xs text-gray-600 mt-1">{recommendation.date}</p>
            )}
            {recommendation.location && (
              <p className="text-xs text-gray-500">{recommendation.location}</p>
            )}
            {recommendation.attendees && (
              <p className="text-xs text-gray-600 mt-1">{recommendation.attendees} attending</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (recommendation.type === 'community') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden active:scale-98 transition-all">
        <div className="flex gap-3 p-3">
          <div className="size-20 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm text-gray-900 line-clamp-2">{recommendation.title}</h3>
            {recommendation.members && (
              <p className="text-xs text-gray-600 mt-1">{recommendation.members.toLocaleString()} members</p>
            )}
            {recommendation.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{recommendation.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function getLeapyResponse(query: string, userType: 'creator' | 'learner'): Message {
  const lowerQuery = query.toLowerCase();

  // Creator-specific responses
  if (userType === 'creator') {
    // Course creation
    if (lowerQuery.includes('create') && lowerQuery.includes('course')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Great! Let's create your course. I'll help you with:\n\n1. **Define your niche** - What specific problem will your course solve?\n2. **Identify your audience** - Who is your ideal student?\n3. **Structure your content** - Break it into modules and lessons\n4. **Choose your format** - Video, text, interactive exercises?\n5. **Set pricing** - Based on value and market research\n\nWhat topic is your course about?",
        timestamp: new Date(),
        suggestions: ['Business & Marketing', 'Design & Creative', 'Technology & Dev', 'Personal Development']
      };
    }

    if (lowerQuery.includes('pricing') || lowerQuery.includes('price')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Let's optimize your pricing strategy! Here are proven approaches:\n\n**Tiered Pricing:**\n• Basic: $49 - Core content only\n• Pro: $99 - + Live Q&A sessions\n• Premium: $199 - + 1-on-1 coaching\n\n**Tips:**\n✓ Price based on transformation, not hours\n✓ Offer payment plans to increase conversions\n✓ Create urgency with limited-time offers\n✓ Test different price points\n\nWhat's your course topic? I can suggest competitive pricing.",
        timestamp: new Date(),
        suggestions: ['Market research', 'Payment plans', 'Launch discounts', 'Value calculation']
      };
    }

    if (lowerQuery.includes('marketing') || lowerQuery.includes('promote')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Here's a powerful marketing strategy for your course:\n\n**Pre-Launch (2-4 weeks):**\n• Build an email list with a free mini-course\n• Create social proof with beta testers\n• Share valuable content consistently\n\n**Launch Week:**\n• Live webinar or workshop\n• Early bird discount (20-30% off)\n• Countdown timer for urgency\n\n**Post-Launch:**\n• Student success stories\n• Referral program\n• Content marketing (blog, YouTube, podcast)\n\nWhich channel do you want to focus on first?",
        timestamp: new Date(),
        suggestions: ['Email marketing', 'Social media strategy', 'Webinar planning', 'Content ideas']
      };
    }

    if (lowerQuery.includes('community') && !lowerQuery.includes('find')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Building an engaged community is key! Here's how:\n\n**Foundation:**\n• Welcome ritual for new members\n• Clear community guidelines\n• Regular engagement prompts\n\n**Engagement Strategies:**\n• Weekly challenges or discussions\n• Member spotlight features\n• Live office hours or Q&As\n• Exclusive content drops\n\n**Tools:**\n• Discussion boards\n• Member directory\n• Private events\n• Achievement badges\n\nWhat's your biggest community challenge right now?",
        timestamp: new Date(),
        suggestions: ['Increase engagement', 'Member retention', 'Moderation tips', 'Event ideas']
      };
    }

    if (lowerQuery.includes('analytics') || lowerQuery.includes('analyze') || lowerQuery.includes('metrics')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Let's dive into your key metrics:\n\n**Course Performance:**\n📊 Completion Rate: Track who finishes\n⏱️ Average Time: How long students take\n🎯 Drop-off Points: Where students quit\n\n**Community Health:**\n💬 Daily Active Users: Engagement level\n📈 Growth Rate: New vs. churned members\n🔥 Top Contributors: Your super fans\n\n**Revenue:**\n💰 MRR (Monthly Recurring Revenue)\n📉 Churn Rate: Who's canceling?\n🎁 Lifetime Value: Per student\n\nWhich metric would you like to improve?",
        timestamp: new Date(),
        suggestions: ['Completion rates', 'Engagement metrics', 'Revenue analysis', 'Student feedback']
      };
    }

    if (lowerQuery.includes('event')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Let's create an amazing event! Here's your roadmap:\n\n**Planning (4-6 weeks out):**\n• Define event goal and format\n• Choose date/time (check timezone)\n• Create landing page with registration\n• Plan content/agenda\n\n**Promotion (2-4 weeks):**\n• Email your list (3-4 reminders)\n• Social media countdown\n• Partner with influencers\n• Create shareable graphics\n\n**Execution:**\n• Send reminders (1 week, 1 day, 1 hour)\n• Tech check 30 mins before\n• Record for replay value\n• Collect feedback after\n\nWhat type of event are you planning?",
        timestamp: new Date(),
        suggestions: ['Webinar setup', 'Workshop format', 'Networking event', 'Launch party']
      };
    }

    if (lowerQuery.includes('student') || lowerQuery.includes('engagement')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Keeping students engaged is crucial! Try these tactics:\n\n**During Course:**\n✓ Quick wins in first 15 minutes\n✓ Progress tracking and milestones\n✓ Interactive exercises, not just lectures\n✓ Real-world projects to apply learning\n\n**Community Engagement:**\n✓ Weekly discussion prompts\n✓ Student showcase opportunities\n✓ Accountability partners/groups\n✓ Live Q&A sessions\n\n**Motivation:**\n✓ Certificates and badges\n✓ Success story highlights\n✓ Personalized feedback\n✓ Clear next steps\n\nWhat's your current completion rate?",
        timestamp: new Date(),
        suggestions: ['Boost completion', 'Interactive exercises', 'Community building', 'Feedback systems']
      };
    }

    if (lowerQuery.includes('monetiz') || lowerQuery.includes('revenue') || lowerQuery.includes('money')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Let's maximize your revenue! Multiple income streams work best:\n\n**1. Course Sales** ($49-$499)\n• One-time purchase\n• Bundle deals\n• Upsells to premium tiers\n\n**2. Membership** ($29-$99/month)\n• Recurring revenue\n• Exclusive content\n• Community access\n\n**3. Coaching/Consulting** ($200-$500/hour)\n• 1-on-1 sessions\n• Group coaching\n• VIP days\n\n**4. Affiliate Partnerships** (10-30%)\n• Recommend tools you use\n• Passive income\n\nWhich model interests you most?",
        timestamp: new Date(),
        suggestions: ['Membership model', 'Coaching packages', 'Bundle strategy', 'Affiliate tips']
      };
    }

    if (lowerQuery.includes('content') || lowerQuery.includes('video') || lowerQuery.includes('recording')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Creating quality content doesn't have to be hard! Here's my advice:\n\n**Equipment (Start Simple):**\n• Smartphone camera (good enough!)\n• $50 USB microphone\n• Natural window lighting\n• Clean background\n\n**Content Structure:**\n• Hook (first 10 seconds)\n• Promise (what they'll learn)\n• Content (deliver value)\n• Call-to-action (next step)\n\n**Pro Tips:**\n✓ Script key points, don't read word-for-word\n✓ Use teleprompter apps\n✓ Record in 10-15 min chunks\n✓ Add captions for accessibility\n\nWhat type of content are you creating?",
        timestamp: new Date(),
        suggestions: ['Video tips', 'Screen recording', 'Audio quality', 'Editing tools']
      };
    }
  }

  // Learner-specific responses
  if (userType === 'learner') {
    if (lowerQuery.includes('web development') || lowerQuery.includes('web dev') || lowerQuery.includes('coding') || lowerQuery.includes('programming')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Awesome! Web development is a great skill. Here are my top recommendations:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'course',
            id: '1',
            title: 'Complete Web Development Bootcamp 2026',
            rating: 4.8,
            price: '$89.99',
            enrollments: 45230
          },
          {
            type: 'course',
            id: '2',
            title: 'Modern React & Next.js Masterclass',
            rating: 4.9,
            price: '$79.99',
            enrollments: 32150
          },
          {
            type: 'course',
            id: '3',
            title: 'Full Stack JavaScript Developer Path',
            rating: 4.7,
            price: '$99.99',
            enrollments: 28900
          }
        ],
        suggestions: ['Beginner courses', 'Free resources', 'JavaScript basics', 'Frontend vs backend']
      };
    }

    if (lowerQuery.includes('design') || lowerQuery.includes('ui') || lowerQuery.includes('ux')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Design is an exciting field! Check out these highly-rated courses:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'course',
            id: '1',
            title: 'UI/UX Design Fundamentals - Zero to Hero',
            rating: 4.9,
            price: '$69.99',
            enrollments: 38500
          },
          {
            type: 'course',
            id: '2',
            title: 'Figma Masterclass: Design System from Scratch',
            rating: 4.8,
            price: '$59.99',
            enrollments: 29300
          },
          {
            type: 'course',
            id: '3',
            title: 'Mobile App Design: iOS & Android',
            rating: 4.7,
            price: '$74.99',
            enrollments: 21400
          }
        ],
        suggestions: ['Design tools', 'Portfolio building', 'Design communities', 'Freelance tips']
      };
    }

    if (lowerQuery.includes('data') || lowerQuery.includes('analytics') || lowerQuery.includes('python')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Data science is in high demand! Here are the best courses to get started:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'course',
            id: '1',
            title: 'Python for Data Science & Machine Learning',
            rating: 4.8,
            price: '$94.99',
            enrollments: 52100
          },
          {
            type: 'course',
            id: '2',
            title: 'Complete SQL Bootcamp: From Zero to Hero',
            rating: 4.9,
            price: '$79.99',
            enrollments: 41200
          },
          {
            type: 'course',
            id: '3',
            title: 'Data Analytics with Excel, Python & Tableau',
            rating: 4.7,
            price: '$84.99',
            enrollments: 33800
          }
        ],
        suggestions: ['Beginner path', 'SQL basics', 'Machine learning', 'Data visualization']
      };
    }

    if (lowerQuery.includes('business') || lowerQuery.includes('marketing') || lowerQuery.includes('entrepreneur')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Looking to level up your business skills? Here's what I recommend:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'course',
            id: '1',
            title: 'Digital Marketing Masterclass: 23 Courses in 1',
            rating: 4.8,
            price: '$89.99',
            enrollments: 67200
          },
          {
            type: 'course',
            id: '2',
            title: 'Start Your Business: The Complete Startup Course',
            rating: 4.9,
            price: '$79.99',
            enrollments: 44100
          },
          {
            type: 'course',
            id: '3',
            title: 'MBA Essentials: Business Strategy & Leadership',
            rating: 4.7,
            price: '$99.99',
            enrollments: 38500
          }
        ],
        suggestions: ['Social media marketing', 'SEO basics', 'Startup funding', 'Business plans']
      };
    }

    if (lowerQuery.includes('community') || lowerQuery.includes('communities')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Great! Communities are the best way to learn. Here are some active ones:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'community',
            id: '1',
            title: 'Design Innovators',
            members: 12470,
            description: 'Daily design challenges, feedback sessions, and portfolio reviews'
          },
          {
            type: 'community',
            id: '2',
            title: 'Code Learners Hub',
            members: 25340,
            description: 'Beginner-friendly coding community with study groups and mentorship'
          },
          {
            type: 'community',
            id: '3',
            title: 'Product Management Network',
            members: 8230,
            description: 'Connect with PMs, share insights, and grow your career'
          }
        ],
        suggestions: ['Tech communities', 'Creative groups', 'Career networking', 'Study groups']
      };
    }

    if (lowerQuery.includes('event') || lowerQuery.includes('upcoming') || lowerQuery.includes('workshop')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Here are some exciting upcoming events you shouldn't miss:",
        timestamp: new Date(),
        recommendations: [
          {
            type: 'event',
            id: '1',
            title: 'AI & Machine Learning Summit 2026',
            date: 'Jan 18-19, 2026',
            location: 'Online',
            attendees: 1247
          },
          {
            type: 'event',
            id: '2',
            title: 'Design Systems Workshop with Figma',
            date: 'Jan 22, 2026 at 3:00 PM PST',
            location: 'Online',
            attendees: 384
          },
          {
            type: 'event',
            id: '3',
            title: 'Product Hunt Meetup - Bay Area',
            date: 'Jan 25, 2026 at 6:00 PM',
            location: 'San Francisco, CA',
            attendees: 156
          }
        ],
        suggestions: ['This week', 'Online only', 'Free events', 'Networking events']
      };
    }

    if (lowerQuery.includes('career') || lowerQuery.includes('job') || lowerQuery.includes('switch')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Thinking about your career path? Here's my advice:\n\n**For Career Switchers:**\n1. Identify transferable skills\n2. Take focused courses (3-6 months)\n3. Build a portfolio with real projects\n4. Network in your target industry\n5. Consider freelancing first\n\n**Hot Fields in 2026:**\n• AI/ML Engineering\n• Product Management\n• UX Design\n• Data Analytics\n• Cloud Architecture\n\n**Action Steps:**\n✓ Update LinkedIn profile\n✓ Join industry communities\n✓ Attend virtual meetups\n✓ Create case studies\n\nWhat field are you targeting?",
        timestamp: new Date(),
        suggestions: ['Resume tips', 'Interview prep', 'Portfolio examples', 'Salary negotiation']
      };
    }

    if (lowerQuery.includes('free') || lowerQuery.includes('budget')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Looking for affordable options? Here are some great free and low-cost resources:\n\n**Free Courses:**\n• freeCodeCamp - Web development\n• Coursera Audit Mode - University courses\n• Harvard CS50 - Computer science\n• Google Digital Garage - Marketing\n\n**Low-Cost Options:**\n• Udemy sales ($12-15)\n• Skillshare free trial (1 month)\n• YouTube Premium (ad-free learning)\n\n**Communities:**\n• Reddit learning communities\n• Discord study groups\n• LinkedIn Learning (1 month free)\n\nWhat subject are you interested in?",
        timestamp: new Date(),
        suggestions: ['Free coding courses', 'Design resources', 'YouTube channels', 'Study groups']
      };
    }

    if (lowerQuery.includes('beginner') || lowerQuery.includes('start') || lowerQuery.includes('new')) {
      return {
        id: Date.now().toString(),
        type: 'leapy',
        content: "Welcome to your learning journey! Here's how to start strong:\n\n**Beginner's Mindset:**\n✓ Start with fundamentals (don't skip!)\n✓ Practice daily (even 20 minutes)\n✓ Join beginner communities\n✓ Build small projects immediately\n✓ Don't compare your chapter 1 to someone's chapter 20\n\n**Learning Path:**\n1. Pick ONE skill to focus on\n2. Find a structured beginner course\n3. Follow along with projects\n4. Share your progress publicly\n5. Help others once you learn\n\n**Avoid These Mistakes:**\n❌ Tutorial hell (too much watching)\n❌ Jumping between topics\n❌ Waiting to be \"ready\"\n\nWhat skill do you want to learn first?",
        timestamp: new Date(),
        suggestions: ['Web development path', 'Design basics', 'Data analytics', 'Choose for me']
      };
    }
  }

  // Generic helpful responses for any user
  if (lowerQuery.includes('how') && (lowerQuery.includes('start') || lowerQuery.includes('begin'))) {
    return {
      id: Date.now().toString(),
      type: 'leapy',
      content: userType === 'creator' 
        ? "Starting your creator journey? Here's the roadmap:\n\n**Week 1-2:** Validate your idea\n• Survey your target audience\n• Check competitor offerings\n• Define your unique angle\n\n**Week 3-4:** Create MVP\n• Outline your course/community\n• Record first 3 lessons\n• Set up payment processing\n\n**Week 5-6:** Beta launch\n• Offer discounted early access\n• Get feedback and iterate\n• Build testimonials\n\n**Week 7-8:** Full launch\n• Email marketing campaign\n• Social media promotion\n• Track and optimize\n\nShall we dive deeper into any of these steps?"
        : "Here's how I'd recommend getting started:\n\n**Step 1:** Identify your goal\n• Career change?\n• Skill upgrade?\n• Side project?\n• Personal interest?\n\n**Step 2:** Choose your path\n• Self-paced courses\n• Live cohorts\n• Mentorship programs\n• Community learning\n\n**Step 3:** Commit to consistency\n• Set a daily/weekly schedule\n• Join accountability groups\n• Track your progress\n• Celebrate small wins\n\nWhat's your main learning goal?",
      timestamp: new Date(),
      suggestions: userType === 'creator' 
        ? ['Validate my idea', 'Course outline', 'Marketing plan', 'Tech setup']
        : ['Set learning goals', 'Find my path', 'Time management', 'Stay motivated']
    };
  }

  if (lowerQuery.includes('help') || lowerQuery.includes('stuck') || lowerQuery.includes('confused')) {
    return {
      id: Date.now().toString(),
      type: 'leapy',
      content: "I'm here to help! Could you tell me more about what you're working on? The more specific you are, the better I can assist.\n\nFor example:\n• What topic or project?\n• Where are you stuck?\n• What have you tried so far?\n• What's your end goal?\n\nFeel free to share as much detail as you'd like!",
      timestamp: new Date(),
      suggestions: userType === 'creator'
        ? ['Course creation', 'Technical issues', 'Marketing help', 'Pricing advice']
        : ['Course selection', 'Learning path', 'Motivation tips', 'Study strategies']
    };
  }

  if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest') || lowerQuery.includes('should i')) {
    return {
      id: Date.now().toString(),
      type: 'leapy',
      content: "I'd love to give you personalized recommendations! To help me suggest the best options, could you tell me:\n\n" + 
        (userType === 'creator' 
          ? "• What type of content do you create?\n• Who is your target audience?\n• What's your main challenge right now?\n• What are your goals for the next 3 months?"
          : "• What are you interested in learning?\n• What's your current skill level?\n• How much time can you dedicate per week?\n• Are you learning for career or personal interest?") +
        "\n\nThis will help me give you much better recommendations!",
      timestamp: new Date(),
      suggestions: userType === 'creator'
        ? ['Content strategy', 'Growth tactics', 'Monetization', 'Tools & tech']
        : ['Tech skills', 'Creative skills', 'Business skills', 'Personal development']
    };
  }

  // Thank you responses
  if (lowerQuery.includes('thank') || lowerQuery.includes('thanks') || lowerQuery.includes('appreciate')) {
    return {
      id: Date.now().toString(),
      type: 'leapy',
      content: "You're very welcome! I'm always here to help. Feel free to ask me anything else about " +
        (userType === 'creator' ? "creating, marketing, or growing your courses and community!" : "finding courses, communities, or planning your learning journey!") +
        "\n\nIs there anything else I can assist you with?",
      timestamp: new Date(),
      suggestions: userType === 'creator'
        ? ['More tips', 'Different topic', 'Show analytics', 'Marketing ideas']
        : ['More courses', 'Find events', 'Join communities', 'Learning tips']
    };
  }

  // Default response with variety
  const defaultResponses = userType === 'creator' ? [
    {
      content: "I can help you with course creation, community management, analytics, and marketing strategies. What specific area would you like assistance with?",
      suggestions: ['Create a course', 'Grow my community', 'Marketing tips', 'Analyze metrics']
    },
    {
      content: "Let's work on growing your creator business! I can help with:\n\n• Course design and curriculum\n• Pricing and monetization\n• Marketing and promotion\n• Community engagement\n• Analytics and insights\n\nWhat would you like to focus on?",
      suggestions: ['Course structure', 'Pricing strategy', 'Launch plan', 'Student retention']
    },
    {
      content: "As your AI assistant, I'm here to help you succeed as a creator! Whether you need help with content creation, audience growth, or monetization strategies, just let me know.\n\nWhat challenge are you facing right now?",
      suggestions: ['Content ideas', 'Marketing channels', 'Tech stack', 'Competition research']
    }
  ] : [
    {
      content: "I'd be happy to help! Could you tell me more about what you're interested in learning? For example, are you looking for courses, communities to join, or upcoming events?",
      suggestions: ['Browse courses', 'Find communities', 'Upcoming events', 'Career advice']
    },
    {
      content: "Welcome! I can help you discover amazing learning opportunities. What are you interested in?\n\n• Specific skills (coding, design, business)\n• Communities to join\n• Upcoming events and workshops\n• Career guidance and learning paths\n\nWhat sounds most interesting?",
      suggestions: ['Tech skills', 'Creative skills', 'Join communities', 'Career growth']
    },
    {
      content: "Let's find the perfect learning opportunity for you! I can recommend:\n\n✓ Top-rated courses in any subject\n✓ Active communities to join\n✓ Live events and workshops\n✓ Personalized learning paths\n\nWhat would you like to explore first?",
      suggestions: ['Popular courses', 'New communities', 'This week\'s events', 'Learning roadmap']
    }
  ];

  const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

  return {
    id: Date.now().toString(),
    type: 'leapy',
    content: randomResponse.content,
    timestamp: new Date(),
    suggestions: randomResponse.suggestions
  };
}

function getInitialMessage(mode: LeapyMode, userType: 'creator' | 'learner'): Message {
  if (mode === 'build') {
    return {
      id: '1',
      type: 'leapy',
      content: "I'm here to help you build amazing courses and communities! Could you tell me what you're looking to create today?\n\nYou can ask me about:\n• Course structure and curriculum design\n• Community engagement strategies\n• Event planning and promotion\n• Content creation best practices\n\nWhat would you like to build?",
      timestamp: new Date(),
      suggestions: ['Create a course outline', 'Set up a community', 'Plan an event', 'Content ideas']
    };
  }

  if (mode === 'help') {
    return {
      id: '1',
      type: 'leapy',
      content: userType === 'creator' 
        ? "I'm here to help you create and grow your online courses!\n\nCould you tell me what you're looking for today?\n\nYou can ask me about:\n• Course creation and design\n• Community management strategies\n• Event planning and marketing\n• Pricing and monetization\n• Analytics and growth insights\n\nWhat would you like to explore?"
        : "I'm here to help you discover courses, find communities, and explore events!\n\nCould you tell me what you're looking for today?\n\nYou can ask me about:\n• Specific courses you need\n• Recommendations for different categories\n• Communities to join based on interests\n• Upcoming events in your area\n• Learning path suggestions\n\nWhat would you like to explore?",
      timestamp: new Date(),
      suggestions: userType === 'creator'
        ? ['Create a new course', 'Grow my community', 'Marketing strategies', 'Analyze performance']
        : ['Web development courses', 'Design communities', 'Tech events', 'Learning paths']
    };
  }

  if (mode === 'analyze') {
    return {
      id: '1',
      type: 'leapy',
      content: "Let's dive into your data and uncover insights!\n\nCould you tell me what you'd like to analyze today?\n\nYou can ask me about:\n• Course performance metrics\n• Community engagement trends\n• Event attendance patterns\n• Revenue and pricing optimization\n• Student learning outcomes\n\nWhat insights are you looking for?",
      timestamp: new Date(),
      suggestions: ['Course engagement', 'Revenue trends', 'Community growth', 'Student feedback']
    };
  }

  return {
    id: '1',
    type: 'leapy',
    content: userType === 'creator'
      ? "I can help you with course creation, community management, analytics, and marketing strategies. What specific area would you like assistance with?"
      : "I'd be happy to help! Could you tell me more about what you're interested in learning? For example, are you looking for courses, communities to join, or upcoming events?",
    timestamp: new Date(),
    suggestions: userType === 'creator'
      ? ['Create a new course', 'Analyze my community', 'Marketing tips', 'Monetization strategies']
      : ['Browse all courses', 'Find communities', 'Upcoming events', 'Career guidance']
  };
}