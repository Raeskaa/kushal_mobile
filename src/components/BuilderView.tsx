import { useState } from 'react';
import { Sparkles, Edit2, RotateCcw, Plus, Trash2, Check, Send, ChevronDown, ChevronUp, Loader2, Wand2, Mic, Paperclip, StopCircle, Zap, Clock, Settings, Star, ThumbsUp, ThumbsDown, Copy, RotateCw, FileText, Tag, TrendingUp, DollarSign, AlertCircle, ChevronRight, History, BookOpen, Users as UsersIcon, Target, X, Sparkle, Download, MoreVertical, Info, Palette, GraduationCap } from 'lucide-react';
import { CourseData, Conversation, Message, AppVersion } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { EmptyState } from './EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface BuilderViewProps {
  conversation: Conversation;
  onUpdateMessages: (messages: Message[]) => void;
  courseData: Partial<CourseData>;
  onBack: () => void;
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

export function BuilderView({ 
  courseData, 
  onBack,
  appVersion = 'v1',
  onVersionChange,
  userMode = 'creator',
  onModeChange
}: BuilderViewProps) {
  const [courseTitle, setCourseTitle] = useState(courseData.title || '');
  const [description, setDescription] = useState(courseData.description || '');
  const [targetAudience, setTargetAudience] = useState(courseData.targetAudience || '');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(courseData.learningOutcomes || []);
  const [editingOutcome, setEditingOutcome] = useState<number | null>(null);
  const [newOutcome, setNewOutcome] = useState('');
  
  // Enhanced Chat State
  const [chatInput, setChatInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [credits, setCredits] = useState(2847);
  const [isRecording, setIsRecording] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [botStatus, setBotStatus] = useState<'online' | 'thinking' | 'idle'>('online');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  
  const [chatMessages, setChatMessages] = useState<Array<{ 
    role: 'user' | 'assistant'; 
    content: string; 
    timestamp: Date; 
    thinking?: boolean;
    rating?: 'good' | 'bad' | null;
    tokens?: number;
    cost?: number;
  }>>([
    {
      role: 'assistant',
      content: `Perfect! I've generated your course structure. You can edit anything below or ask me to generate modules.`,
      timestamp: new Date(),
      thinking: true,
      tokens: 245,
      cost: 0.02
    }
  ]);
  const [showThinking, setShowThinking] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Prompt templates
  const promptTemplates = [
    { category: 'Modules', prompts: ['Generate 5 modules', 'Add quiz to Module 3', 'Expand Module 2 content'] },
    { category: 'Content', prompts: ['Improve SEO', 'Create lesson plan', 'Generate quiz questions'] },
    { category: 'Marketing', prompts: ['Write course description', 'Create promotional copy', 'Generate landing page'] },
  ];

  // Quick suggestions
  const quickSuggestions = [
    'Generate module outline',
    'Create quiz',
    'Improve description',
    'Add learning outcomes',
  ];

  // Prompt history
  const promptHistory = [
    'Generate 5 modules for web development',
    'Create quiz for Module 1',
    'Improve course description',
  ];

  // Token counter
  const tokenCount = Math.ceil(chatInput.length / 4);
  const estimatedCost = (tokenCount * 0.00003).toFixed(4);

  const handlePromptClick = (prompt: string) => {
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: prompt, timestamp: new Date() }
    ]);
    setIsGenerating(true);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I'm working on generating those modules for you!", 
          timestamp: new Date(),
          thinking: true
        }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleRegenerateField = (field: string) => {
    setIsGenerating(true);
    setTimeout(() => {
      if (field === 'description') {
        setDescription('[Updated] Master the fundamentals and advanced concepts. This comprehensive course will take you from beginner to expert.');
      } else if (field === 'targetAudience') {
        setTargetAudience('[Updated] Perfect for motivated learners at any level who want to gain practical skills');
      } else if (field === 'learningOutcomes') {
        setLearningOutcomes([
          '[Updated] Build production-ready projects from scratch',
          '[Updated] Master industry best practices and standards',
        ]);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setLearningOutcomes([...learningOutcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { role: 'user', content: chatInput, timestamp: new Date() }
    ]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "I understand your request. I'll help you with that!", 
          timestamp: new Date(),
          thinking: true
        }
      ]);
    }, 1000);
  };

  return (
    <TooltipProvider>
    <div className="h-screen flex flex-col bg-muted">
      {/* Top Navigation Bar */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-foreground">Course Builder</h1>
              <p className="text-muted-foreground text-xs">Courses / {courseTitle || 'Untitled'} / Content</p>
            </div>
          </div>
        </div>
        <Button>
          Publish Course
        </Button>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Course Builder */}
        <div className="flex-1 overflow-hidden bg-card border-r border-border">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-4xl mx-auto space-y-8">
              {/* Overview Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-foreground">Overview</h2>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                    <Edit2 className="size-3 mr-1" />
                    Edit
                  </Button>
                </div>

                {/* Course Title */}
                <div className="space-y-2">
                  <label className="text-secondary-foreground">Course Title</label>
                  <Input
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-secondary-foreground">Description</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateField('description')}
                      className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                    >
                      <Wand2 className="size-3 mr-1" />
                      Regenerate
                    </Button>
                  </div>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="size-3 text-primary" />
                    <span>SEO optimized</span>
                    <span className="text-border">•</span>
                    <span>{description.length} characters</span>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-secondary-foreground">Target Audience</label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerateField('targetAudience')}
                        className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                      >
                        <RotateCcw className="size-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>

                {/* Learning Outcomes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-secondary-foreground">Learning Outcomes</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateField('learningOutcomes')}
                      className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                    >
                      <Wand2 className="size-3 mr-1" />
                      Regenerate All
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex gap-2 items-start group/outcome p-2 rounded-lg hover:bg-muted">
                        {editingOutcome === idx ? (
                          <div className="flex-1 flex gap-2">
                            <Input
                              value={outcome}
                              onChange={(e) => {
                                const updated = [...learningOutcomes];
                                updated[idx] = e.target.value;
                                setLearningOutcomes(updated);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  setEditingOutcome(null);
                                }
                              }}
                              className="flex-1"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingOutcome(null)}
                              className="h-9 px-2"
                            >
                              <Check className="size-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Check className="size-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="flex-1 text-foreground">{outcome}</span>
                            <div className="flex gap-1 opacity-0 group-hover/outcome:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingOutcome(idx)}
                                className="h-6 w-6 p-0"
                              >
                                <Edit2 className="size-3 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveOutcome(idx)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="size-3 text-destructive" />
                              </Button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Input
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddOutcome();
                        }
                      }}
                      placeholder="Add new learning outcome..."
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddOutcome}
                      disabled={!newOutcome.trim()}
                    >
                      <Plus className="size-3 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Modules Section with Empty State */}
              <div className="pt-6 border-t border-border">
                <h2 className="text-foreground mb-4">Modules & Lessons</h2>
                <EmptyState
                  title="No modules yet"
                  description="Get started by creating your first module or let AI help you build a complete course structure"
                  type="modules"
                  prompts={[
                    "Generate 5 modules for a beginner web development course",
                    "Create a module outline for an advanced React course",
                    "Build a comprehensive Python programming curriculum",
                  ]}
                  onPromptClick={handlePromptClick}
                />
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Advanced AI Chat */}
        <div className="w-[500px] bg-card flex flex-col border-l border-border">
          {/* Enhanced Chat Header */}
          <div className="border-b border-border">
            {/* Top Row - Model & Credits */}
            <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                {/* Model Selector */}
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="h-7 w-32 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="gpt-3.5">GPT-3.5</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Bot Status */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 border border-primary/10">
                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary capitalize">{botStatus}</span>
                </div>
              </div>

              {/* Credits */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-primary/5">
                    <DollarSign className="size-3 mr-1 text-primary" />
                    <span className="text-primary">{credits.toLocaleString()}</span>
                    <span className="text-muted-foreground ml-1">credits</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Available Credits</span>
                      <span className="text-foreground">{credits.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Used this month</span>
                      <span className="text-foreground">1,153</span>
                    </div>
                    <div className="pt-2 border-t">
                      <Button size="sm" className="w-full h-7 text-xs">
                        Buy More Credits
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Second Row - AI Info & Actions */}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center relative">
                    <Sparkles className="size-4 text-white" />
                    {isGenerating && (
                      <div className="absolute -inset-1 rounded-full border-2 border-green-400 animate-ping" />
                    )}
                  </div>
                  <div>
                    <p className="text-foreground text-sm">Leapy AI</p>
                    <p className="text-xs text-muted-foreground">Course creation specialist</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Context Panel */}
                  <Popover open={showContext} onOpenChange={setShowContext}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="View course context">
                        <Tag className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="end">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-foreground">Course Context</p>
                          <Badge variant="secondary" className="text-xs">3 items</Badge>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-accent border border-accent">
                            <BookOpen className="size-3 text-accent-foreground mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground truncate">{courseTitle || 'Untitled Course'}</p>
                              <p className="text-accent-foreground">Course Title</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                            <UsersIcon className="size-3 text-primary mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground truncate">{targetAudience || 'Not set'}</p>
                              <p className="text-primary">Target Audience</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 p-2 rounded-lg bg-primary/10 border border-primary/20">
                            <Target className="size-3 text-primary mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground">{learningOutcomes.length} outcomes</p>
                              <p className="text-primary">Learning Goals</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* History */}
                  <Popover open={showHistory} onOpenChange={setShowHistory}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Recent prompt history">
                        <History className="size-3.5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-3" align="end">
                      <div className="space-y-2">
                        <p className="text-sm text-foreground mb-2">Recent Prompts</p>
                        {promptHistory.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setChatInput(prompt);
                              setShowHistory(false);
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-muted border border-border transition-colors"
                          >
                            <p className="text-xs text-foreground truncate">{prompt}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Click to reuse</p>
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Settings */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Settings className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>AI settings & preferences</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="size-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="size-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    {msg.thinking && msg.role === 'assistant' && (
                      <button
                        onClick={() => setShowThinking(!showThinking)}
                        className="flex items-center gap-2 text-xs text-primary hover:text-primary mb-2"
                      >
                        <Loader2 className="size-3 animate-spin" />
                        <span>Thinking process</span>
                        {showThinking ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                      </button>
                    )}
                    {showThinking && msg.thinking && (
                      <div className="bg-primary/5 rounded-lg p-3 mb-2 space-y-1">
                        <div className="flex items-start gap-2 text-xs text-primary">
                          <div className="size-1.5 rounded-full bg-primary mt-1.5" />
                          <span>Analyzing your course requirements...</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-primary">
                          <div className="size-1.5 rounded-full bg-primary mt-1.5" />
                          <span>Generating optimized content...</span>
                        </div>
                      </div>
                    )}
                    <div className={`rounded-lg p-4 ${
                      msg.role === 'user' 
                        ? 'bg-primary/10 ml-auto max-w-[80%]' 
                        : 'bg-muted'
                    }`}>
                      <p className="text-foreground text-sm">{msg.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="size-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-secondary-foreground">U</span>
                    </div>
                  )}
                </div>
              ))}
              {isGenerating && (
                <div className="flex gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Advanced Chat Input Area */}
          <div className="border-t border-border">
            {/* Attached Files */}
            {attachedFiles.length > 0 && (
              <div className="px-4 pt-3 pb-2 border-b border-border">
                <div className="flex flex-wrap gap-2">
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-accent border border-accent rounded-lg text-xs">
                      <FileText className="size-3 text-accent-foreground" />
                      <span className="text-foreground">{file}</span>
                      <button
                        onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                        className="hover:bg-accent/80 rounded p-0.5"
                      >
                        <X className="size-3 text-accent-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Suggestions */}
            <div className="px-4 py-2 border-b border-border bg-muted">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Zap className="size-3 text-primary flex-shrink-0" />
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(suggestion)}
                    className="px-2 py-1 text-xs bg-card border border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-colors whitespace-nowrap"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Input Area */}
            <div className="p-4">
              <div className="relative">
                {/* Textarea with auto-resize */}
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Describe what you want to create... (Press / for commands)"
                  className="resize-none pr-24 min-h-[80px] max-h-[200px]"
                  rows={3}
                />
                
                {/* Send/Stop Button */}
                <div className="absolute bottom-2 right-2">
                  {isGenerating ? (
                    <Button
                      size="sm"
                      onClick={() => setIsGenerating(false)}
                      className="bg-destructive hover:bg-destructive/90 h-8 w-8 p-0"
                    >
                      <StopCircle className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Send className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Bottom Toolbar */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* Voice Input */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsRecording(!isRecording)}
                        className={`h-7 w-7 p-0 ${isRecording ? 'bg-destructive/10 text-destructive' : ''}`}
                      >
                        <Mic className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>{isRecording ? 'Stop recording' : 'Voice input'}</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Attach Files */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttachedFiles([...attachedFiles, 'example.pdf'])}
                        className="h-7 w-7 p-0"
                      >
                        <Paperclip className="size-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>Attach files or documents</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Templates Popover */}
                  <Popover open={showTemplates} onOpenChange={setShowTemplates}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Browse prompt templates">
                        <Sparkle className="size-3 mr-1" />
                        Templates
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-3" align="start">
                      <div className="space-y-3">
                        <p className="text-sm text-foreground">Prompt Templates</p>
                        {promptTemplates.map((category, idx) => (
                          <div key={idx} className="space-y-1">
                            <p className="text-xs text-muted-foreground mb-1">{category.category}</p>
                            {category.prompts.map((prompt, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => {
                                  setChatInput(prompt);
                                  setShowTemplates(false);
                                }}
                                className="w-full text-left p-2 rounded-lg hover:bg-muted border border-border text-xs text-foreground transition-colors"
                              >
                                {prompt}
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Prompt Enhancement */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                      >
                        <Wand2 className="size-3 mr-1" />
                        Enhance
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>AI will improve your prompt</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {/* Token Counter & Cost */}
                <div className="flex items-center gap-3 text-xs">
                  {chatInput && (
                    <>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <span>{tokenCount} tokens</span>
                      </div>
                      <div className="flex items-center gap-1 text-primary">
                        <DollarSign className="size-3" />
                        <span>~${estimatedCost}</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">↵</kbd>
                  </div>
                </div>
              </div>

              {/* Learning Tip */}
              {chatInput.length > 0 && chatInput.length < 20 && (
                <div className="mt-2 flex items-start gap-2 p-2 bg-accent border border-accent rounded-lg">
                  <AlertCircle className="size-3 text-accent-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-foreground">
                    💡 <span className="text-accent-foreground">Tip:</span> Be specific about what you want. Example: "Generate 5 modules for a Python course targeting beginners"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </TooltipProvider>
  );
}