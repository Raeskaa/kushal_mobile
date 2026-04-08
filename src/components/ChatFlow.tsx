import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, ArrowLeft, ChevronDown, Palette, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Conversation, Message, CourseData, CommunityData, ThinkingStep, AppVersion } from '../types';
import { ChatMessage } from './ChatMessage';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import LeapyLogo from '../imports/Button';
import { CommunityGenerationPreview } from './CommunityGenerationPreview';

interface ChatFlowProps {
  conversation: Conversation;
  onUpdateConversation: (conversation: Conversation) => void;
  onCourseComplete: (courseData: Partial<CourseData>) => void;
  onCommunityComplete: (communityData: Partial<CommunityData>) => void;
  contentType?: 'course' | 'community';
  appVersion?: AppVersion;
  onVersionChange?: (version: AppVersion) => void;
  userMode?: 'creator' | 'learner';
  onModeChange?: (mode: 'creator' | 'learner') => void;
}

const versionDescriptions: Record<AppVersion, string> = {
  v1: 'Intent Detection',
  v2: 'Dual-Pane',
  v3: 'Smart Toggle',
  v4: 'Context Menu',
  v5: 'Tab-Based',
  v6: 'Command Palette',
  v7: 'Persona Selection',
  v8: 'Action Cards',
};

export function ChatFlow({ 
  conversation, 
  onUpdateConversation, 
  onCourseComplete,
  onCommunityComplete,
  contentType = 'course',
  appVersion = 'v1',
  onVersionChange,
  userMode = 'creator',
  onModeChange
}: ChatFlowProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseData, setCourseData] = useState<Partial<CourseData>>({});
  const [communityData, setCommunityData] = useState<Partial<CommunityData>>({});
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const onUpdateMessages = (messages: Message[]) => {
    onUpdateConversation({ messages });
  };

  // Auto-respond to first message from welcome screen
  useEffect(() => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    // If there's only one message and it's from the user, ask for course title
    if (conversation.messages.length === 1 && lastMessage?.role === 'user' && !isLoading) {
      setIsLoading(true);
      
      // Simulate thinking process
      const thinkingSteps: ThinkingStep[] = contentType === 'community' ? [
        { id: '1', step: 'Analyzing your community creation request...', status: 'complete', timestamp: new Date() },
        { id: '2', step: 'Determining community archetype...', status: 'complete', timestamp: new Date() },
        { id: '3', step: 'Ready to help you build your community!', status: 'complete', timestamp: new Date() },
      ] : [
        { id: '1', step: 'Analyzing your course creation request...', status: 'complete', timestamp: new Date() },
        { id: '2', step: 'Preparing course structure template...', status: 'complete', timestamp: new Date() },
        { id: '3', step: 'Ready to help you create your course!', status: 'complete', timestamp: new Date() },
      ];
      
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: contentType === 'community' 
            ? "Great! Let's build an amazing community together. First, who do you want to bring together? Share a few words about your community's purpose."
            : "Great! Let's create an amazing course together. First, what would you like to name your course?",
          timestamp: new Date(),
          interactiveType: contentType === 'community' ? 'community-description' : 'course-title',
          thinkingSteps: thinkingSteps,
          status: 'complete',
        };

        onUpdateMessages([...conversation.messages, aiMessage]);
        setIsLoading(false);
      }, 1000);
    }
  }, [conversation.messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [conversation.messages]);

  const handleCourseDataSubmit = (data: Partial<CourseData>) => {
    const updatedCourseData = { ...courseData, ...data };
    setCourseData(updatedCourseData);

    // User submitted the title
    if (data.title && !courseData.title) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: data.title,
        timestamp: new Date(),
        status: 'complete',
      };

      const messages = [...conversation.messages, userMessage];
      onUpdateMessages(messages);
      setIsLoading(true);

      // Simulate thinking and generation
      const thinkingSteps: ThinkingStep[] = [
        { id: '1', step: 'Understanding your course topic...', status: 'complete', timestamp: new Date() },
        { id: '2', step: 'Generating compelling course description...', status: 'complete', timestamp: new Date() },
        { id: '3', step: 'Identifying target audience...', status: 'complete', timestamp: new Date() },
        { id: '4', step: 'Creating learning outcomes...', status: 'complete', timestamp: new Date() },
      ];

      // Generate metadata with AI
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Perfect! I've generated a course description and learning outcomes for "${data.title}". Feel free to edit anything below:`,
          timestamp: new Date(),
          interactiveType: 'course-metadata',
          thinkingSteps: thinkingSteps,
          status: 'complete',
          courseData: {
            title: data.title,
            description: `Master the fundamentals and advanced concepts of ${data.title.toLowerCase()}. This comprehensive course will take you from beginner to expert through hands-on projects and real-world examples.`,
            targetAudience: 'Beginners to intermediate learners looking to master this topic',
            learningOutcomes: [
              `Understand core concepts and principles of ${data.title.toLowerCase()}`,
              'Apply knowledge through practical, hands-on projects',
              'Build real-world applications with confidence',
              'Master advanced techniques and best practices',
            ],
          },
        };

        onUpdateMessages([...messages, aiMessage]);
        setIsLoading(false);
      }, 1500);
    }
    // User approved metadata
    else if (data.description && courseData.title) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: 'Looks good! Continue',
        timestamp: new Date(),
        status: 'complete',
      };

      const messages = [...conversation.messages, userMessage];
      onUpdateMessages(messages);
      setIsLoading(true);

      const thinkingSteps: ThinkingStep[] = [
        { id: '1', step: 'Analyzing course requirements...', status: 'complete', timestamp: new Date() },
        { id: '2', step: 'Structuring curriculum modules...', status: 'complete', timestamp: new Date() },
        { id: '3', step: 'Balancing difficulty progression...', status: 'complete', timestamp: new Date() },
        { id: '4', step: 'Creating comprehensive outline...', status: 'complete', timestamp: new Date() },
      ];

      // Generate course outline
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Excellent! I've created a comprehensive course outline for "${courseData.title}". This structure will help students learn progressively:`,
          timestamp: new Date(),
          interactiveType: 'course-outline',
          thinkingSteps: thinkingSteps,
          status: 'complete',
          courseData: {
            ...updatedCourseData,
            outline: [
              {
                title: 'Introduction & Fundamentals',
                lessons: [
                  'Welcome and Course Overview',
                  'Setting Up Your Environment',
                  'Core Concepts and Terminology',
                  'Your First Project',
                ],
              },
              {
                title: 'Intermediate Concepts',
                lessons: [
                  'Advanced Techniques',
                  'Best Practices and Patterns',
                  'Common Pitfalls to Avoid',
                  'Project: Building a Real Application',
                ],
              },
              {
                title: 'Advanced Topics',
                lessons: [
                  'Professional Workflows',
                  'Optimization and Performance',
                  'Deployment Strategies',
                  'Final Capstone Project',
                ],
              },
            ],
          },
        };

        onUpdateMessages([...messages, aiMessage]);
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleCommunityDataSubmit = (data: Partial<CommunityData>) => {
    const updatedCommunityData = { ...communityData, ...data };
    setCommunityData(updatedCommunityData);

    // Step 1: User submitted the community description/purpose
    if (data.description && !communityData.description) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: data.description,
        timestamp: new Date(),
        status: 'complete',
      };

      const messages = [...conversation.messages, userMessage];
      onUpdateMessages(messages);
      setIsLoading(true);

      // AI asks for name suggestions
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Perfect! Based on your community purpose, I've generated some name suggestions. Pick one you like or create your own:`,
          timestamp: new Date(),
          interactiveType: 'community-name',
          status: 'complete',
          communityData: {
            description: data.description,
          },
        };

        onUpdateMessages([...messages, aiMessage]);
        setIsLoading(false);
      }, 1000);
    }
    // Step 2: User selected/entered a name
    else if (data.title && !communityData.title) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: data.title,
        timestamp: new Date(),
        status: 'complete',
      };

      const messages = [...conversation.messages, userMessage];
      onUpdateMessages(messages);
      setIsLoading(true);

      // AI asks for brand identity/vibe
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Great choice! Now let's set the vibe for "${data.title}". Choose a brand identity that resonates:`,
          timestamp: new Date(),
          interactiveType: 'community-vibe',
          status: 'complete',
          communityData: {
            ...updatedCommunityData,
            title: data.title,
          },
        };

        onUpdateMessages([...messages, aiMessage]);
        setIsLoading(false);
      }, 1000);
    }
    // Step 3: User selected brand identity - complete setup
    else if (data.vibe && communityData.title && communityData.description) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: data.vibe,
        timestamp: new Date(),
        status: 'complete',
      };

      const messages = [...conversation.messages, userMessage];
      onUpdateMessages(messages);
      
      // Trigger the community builder view with all data
      setTimeout(() => {
        onCommunityComplete({
          ...updatedCommunityData,
          vibe: data.vibe,
        });
      }, 500);
    }
  };

  const handleGenerateWithAI = (type: string, field?: string) => {
    setIsLoading(true);
    
    // Find the last metadata message
    const lastMetadataMessage = conversation.messages
      .slice()
      .reverse()
      .find(m => m.interactiveType === 'course-metadata');
    
    if (field && lastMetadataMessage) {
      // Regenerate specific field
      setTimeout(() => {
        const updatedMessage: Message = {
          ...lastMetadataMessage,
          courseData: {
            ...lastMetadataMessage.courseData,
            // Simulate field-specific regeneration
            ...(field === 'description' && {
              description: `[Updated] Master the fundamentals and advanced concepts. This comprehensive course will take you from beginner to expert through innovative teaching methods and real-world applications.`
            }),
            ...(field === 'targetAudience' && {
              targetAudience: `[Updated] Perfect for motivated learners at any level who want to gain practical, job-ready skills in this field`
            }),
            ...(field === 'learningOutcomes' && {
              learningOutcomes: [
                '[Updated] Build production-ready projects from scratch',
                '[Updated] Master industry best practices and standards',
                '[Updated] Develop problem-solving skills for complex challenges',
                '[Updated] Gain confidence to work on professional projects',
              ]
            }),
          }
        };
        
        const updatedMessages = conversation.messages.map(m => 
          m.id === lastMetadataMessage.id ? updatedMessage : m
        );
        onUpdateMessages(updatedMessages);
        setIsLoading(false);
      }, 1500);
    } else {
      // Regenerate all (existing behavior)
      setTimeout(() => {
        setIsLoading(false);
        // In a real app, this would update the message with new data
      }, 1500);
    }
  };

  const handleApproveOutline = () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'Start building the course',
      timestamp: new Date(),
      status: 'complete',
    };

    const messages = [...conversation.messages, userMessage];
    onUpdateMessages(messages);
    
    // Trigger the builder view
    setTimeout(() => {
      onCourseComplete(courseData);
    }, 500);
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    const updatedMessages = conversation.messages.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          content: newContent,
          editHistory: [
            ...(msg.editHistory || []),
            {
              id: Date.now().toString(),
              previousContent: msg.content,
              newContent: newContent,
              timestamp: new Date(),
            }
          ]
        };
      }
      return msg;
    });
    onUpdateMessages(updatedMessages);
    
    // If user edited their message, trigger AI response
    const editedMessage = conversation.messages.find(m => m.id === messageId);
    if (editedMessage?.role === 'user') {
      setIsLoading(true);
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I understand you've updated your request. How would you like me to help you with that?",
          timestamp: new Date(),
          status: 'complete',
        };
        onUpdateMessages([...updatedMessages, aiMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleRegenerateMessage = (messageId: string) => {
    setIsLoading(true);
    
    // Find the message index
    const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
    
    setTimeout(() => {
      const regeneratedMessage: Message = {
        ...conversation.messages[messageIndex],
        content: conversation.messages[messageIndex].content + ' [Regenerated with different approach]',
        editHistory: [
          ...(conversation.messages[messageIndex].editHistory || []),
          {
            id: Date.now().toString(),
            previousContent: conversation.messages[messageIndex].content,
            newContent: conversation.messages[messageIndex].content + ' [Regenerated]',
            timestamp: new Date(),
          }
        ]
      };
      
      const updatedMessages = [...conversation.messages];
      updatedMessages[messageIndex] = regeneratedMessage;
      onUpdateMessages(updatedMessages);
      setIsLoading(false);
    }, 1500);
  };

  const handleCopyMessage = (content: string) => {
    // Analytics or feedback can be tracked here
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'complete',
    };

    const updatedMessages = [...conversation.messages, userMessage];
    onUpdateMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay with thinking
    const thinkingSteps: ThinkingStep[] = [
      { id: '1', step: 'Processing your request...', status: 'complete', timestamp: new Date() },
      { id: '2', step: 'Formulating response...', status: 'complete', timestamp: new Date() },
    ];

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm here to help! Could you provide more details about what you'd like to do?",
        timestamp: new Date(),
        thinkingSteps: thinkingSteps,
        status: 'complete',
      };

      onUpdateMessages([...updatedMessages, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-card min-h-screen">
      {/* Header with Version Switcher & Mode Toggle */}
      <div className="border-b border-border px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9">
              <LeapyLogo />
            </div>
            <div>
              <h1 className="text-foreground">Leapy AI</h1>
              <p className="text-muted-foreground text-xs">
                {userMode === 'creator' ? 'Create and sell courses, communities & events' : 'Explore and join courses, communities & events'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            {onModeChange && (
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => onModeChange('creator')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                    userMode === 'creator'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Palette className="size-3" />
                  Creator
                </button>
                <button
                  onClick={() => onModeChange('learner')}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
                    userMode === 'learner'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <GraduationCap className="size-3" />
                  Learner
                </button>
              </div>
            )}

            {/* Version Switcher */}
            {onVersionChange && (
              <Popover open={showVersionMenu} onOpenChange={setShowVersionMenu}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Badge variant="secondary" className="text-xs">{appVersion.toUpperCase()}</Badge>
                    <ChevronDown className="size-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2" align="end">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground px-2 py-1">Switch UX Version</p>
                    {(Object.keys(versionDescriptions) as AppVersion[]).map((version) => (
                      <button
                        key={version}
                        onClick={() => {
                          onVersionChange(version);
                          setShowVersionMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors ${
                          appVersion === version ? 'bg-primary/5 border border-primary/20' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={appVersion === version ? "default" : "secondary"} 
                              className="text-xs"
                            >
                              {version.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-foreground">{versionDescriptions[version]}</span>
                          </div>
                          {appVersion === version && (
                            <div className="size-2 rounded-full bg-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden" ref={scrollRef}>
        <ScrollArea className="h-full p-6">
          {conversation.messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="inline-flex p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                  <Sparkles className="size-8 text-white" />
                </div>
                <h2 className="text-foreground mb-2">
                  {contentType === 'community' ? 'Start Building Your Community' : 'Start Creating Your Course'}
                </h2>
                <p className="text-muted-foreground">
                  {contentType === 'community' 
                    ? "I'll help you build a thriving community where people connect and grow together. Let's get started!"
                    : "I'll help you create a professional course that you can sell online. Let's get started!"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {conversation.messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  onCourseDataSubmit={handleCourseDataSubmit}
                  onCommunityDataSubmit={handleCommunityDataSubmit}
                  onGenerateWithAI={handleGenerateWithAI}
                  onApproveOutline={handleApproveOutline}
                  onEditMessage={handleEditMessage}
                  onRegenerateMessage={handleRegenerateMessage}
                  onCopyMessage={handleCopyMessage}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="size-9">
                    <LeapyLogo />
                  </div>
                  <div className="flex-1 bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="resize-none"
              rows={1}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="lg"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}