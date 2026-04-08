import { User, Sparkles, ThumbsUp, ThumbsDown, Wand2, Copy, Edit2, RotateCcw, Check, X, Loader2, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { Message, CourseData, CommunityData, ThinkingStep } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import LeapyLogo from '../imports/Button';
import { CommunitySetupSteps } from './CommunitySetupSteps';
import { copyToClipboard } from '../utils/copyToClipboard';

interface ChatMessageProps {
  message: Message;
  onPrototype?: () => void;
  onCourseDataSubmit?: (data: Partial<CourseData>) => void;
  onCommunityDataSubmit?: (data: Partial<CommunityData>) => void;
  onGenerateWithAI?: (type: string, field?: string) => void;
  onApproveOutline?: () => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onCopyMessage?: (content: string) => void;
}

export function ChatMessage({ 
  message, 
  onPrototype, 
  onCourseDataSubmit,
  onCommunityDataSubmit,
  onGenerateWithAI, 
  onApproveOutline,
  onEditMessage,
  onRegenerateMessage,
  onCopyMessage
}: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [courseTitle, setCourseTitle] = useState('');
  const [courseTitleSuggestion, setCourseTitleSuggestion] = useState('');
  const [courseDescription, setCourseDescription] = useState(message.courseData?.description || '');
  const [targetAudience, setTargetAudience] = useState(message.courseData?.targetAudience || '');
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(message.courseData?.learningOutcomes || []);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [showThinking, setShowThinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Individual edit states
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingAudience, setEditingAudience] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState<number | null>(null);
  const [newOutcome, setNewOutcome] = useState('');

  // AI autosuggest simulation
  useEffect(() => {
    if (courseTitle.length > 3) {
      const timer = setTimeout(() => {
        const suggestions = [
          'Complete Web Development Bootcamp',
          'Master Data Science with Python',
          'Advanced React Development Course',
          'Digital Marketing Masterclass',
          'UI/UX Design Fundamentals'
        ];
        const match = suggestions.find(s => 
          s.toLowerCase().includes(courseTitle.toLowerCase())
        );
        if (match && match.toLowerCase() !== courseTitle.toLowerCase()) {
          setCourseTitleSuggestion(match);
        } else {
          setCourseTitleSuggestion('');
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setCourseTitleSuggestion('');
    }
  }, [courseTitle]);

  const handleTitleSubmit = () => {
    if (courseTitle.trim()) {
      if (message.interactiveType === 'community-title') {
        onCommunityDataSubmit?.({ title: courseTitle });
      } else {
        onCourseDataSubmit?.({ title: courseTitle });
      }
    }
  };

  const acceptSuggestion = () => {
    if (courseTitleSuggestion) {
      setCourseTitle(courseTitleSuggestion);
      setCourseTitleSuggestion('');
    }
  };

  const handleGenerateMetadata = () => {
    onGenerateWithAI?.('metadata');
  };

  const handleRegenerateField = (field: string) => {
    onGenerateWithAI?.('metadata', field);
  };

  const handleApproveMetadata = () => {
    onCourseDataSubmit?.({ 
      description: courseDescription,
      targetAudience: targetAudience,
      learningOutcomes: learningOutcomes
    });
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

  const handleUpdateOutcome = (index: number, value: string) => {
    const updated = [...learningOutcomes];
    updated[index] = value;
    setLearningOutcomes(updated);
    setEditingOutcome(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() !== message.content) {
      onEditMessage?.(message.id, editedContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleCopy = () => {
    copyToClipboard(message.content);
    onCopyMessage?.(message.content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleRegenerate = () => {
    onRegenerateMessage?.(message.id);
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedbackGiven(type);
  };

  return (
    <div 
      className={`flex gap-4 group ${isUser ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="size-9 flex-shrink-0">
          <LeapyLogo />
        </div>
      )}
      <div className={`${isUser ? 'max-w-[70%]' : 'flex-1 min-w-0'}`}>
        <div className={`rounded-2xl transition-all duration-200 ${ 
          isUser ? 'bg-primary text-primary-foreground p-4' : 'bg-card border border-border p-6'
        }`}>
          {/* Thinking Process */}
          {!isUser && message.thinkingSteps && message.thinkingSteps.length > 0 && (
            <div className="mb-4 border-l-2 border-primary pl-4 bg-primary/5 rounded-r-lg py-2 pr-4">
              <button
                onClick={() => setShowThinking(!showThinking)}
                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors w-full"
              >
                <Loader2 className="size-3 animate-spin" />
                <span>Thinking process</span>
                {showThinking ? (
                  <ChevronUp className="size-3 ml-auto" />
                ) : (
                  <ChevronDown className="size-3 ml-auto" />
                )}
              </button>
              {showThinking && (
                <div className="mt-3 space-y-2">
                  {message.thinkingSteps.map((step, idx) => (
                    <div key={step.id} className="flex items-start gap-2">
                      <div className={`mt-1 size-1.5 rounded-full flex-shrink-0 ${
                        step.status === 'complete' ? 'bg-primary' :
                        step.status === 'active' ? 'bg-primary animate-pulse' :
                        'bg-border'
                      }`} />
                      <p className="text-xs text-muted-foreground flex-1">{step.step}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Status Badge */}
          {!isUser && message.status === 'generating' && (
            <div className="mb-3">
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="size-3 mr-1 animate-spin" />
                Generating...
              </Badge>
            </div>
          )}

          {/* Message Content */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px] resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="size-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={!editedContent.trim()}
                >
                  <Check className="size-3 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className={`whitespace-pre-wrap leading-relaxed ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>{message.content}</p>
          )}
          
          {/* Community Setup Steps (Description, Name, Vibe) */}
          {(message.interactiveType === 'community-description' || 
            message.interactiveType === 'community-name' || 
            message.interactiveType === 'community-vibe') && (
            <CommunitySetupSteps
              interactiveType={message.interactiveType}
              communityData={message.communityData}
              onSubmit={(data) => onCommunityDataSubmit?.(data)}
            />
          )}

          {/* Community Title Input (Legacy - keeping for backward compatibility) */}
          {message.interactiveType === 'community-title' && (
            <div className="mt-6 space-y-4">
              <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 transition-all duration-200 hover:border-primary/50">
                <label className="block text-secondary-foreground mb-2">
                  Community Name <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Design Professionals Hub"
                    className="mb-3 relative z-10 bg-card"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSubmit();
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={handleTitleSubmit}
                  disabled={!courseTitle.trim()}
                  className="w-full"
                >
                  Continue
                  <Sparkles className="size-3 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Course Title Input with AI Autosuggest */}
          {message.interactiveType === 'course-title' && (
            <div className="mt-6 space-y-4">
              <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 transition-all duration-200 hover:border-primary/50">
                <label className="block text-secondary-foreground mb-2">
                  Course Title <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <Input
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="mb-3 relative z-10 bg-card"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTitleSubmit();
                      } else if (e.key === 'Tab' && courseTitleSuggestion) {
                        e.preventDefault();
                        acceptSuggestion();
                      }
                    }}
                  />
                  {courseTitleSuggestion && courseTitle && (
                    <div className="absolute top-0 left-0 right-0 pointer-events-none">
                      <div className="px-3 py-2 text-muted-foreground">
                        <span className="invisible">{courseTitle}</span>
                        <span className="text-muted-foreground">{courseTitleSuggestion.slice(courseTitle.length)}</span>
                      </div>
                    </div>
                  )}
                </div>
                {courseTitleSuggestion && (
                  <div className="mb-3 text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="size-3" />
                    Press <kbd className="px-1.5 py-0.5 bg-card border border-border rounded text-xs">Tab</kbd> to accept suggestion
                  </div>
                )}
                <Button
                  onClick={handleTitleSubmit}
                  disabled={!courseTitle.trim()}
                  className="w-full"
                >
                  Continue
                  <Sparkles className="size-3 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Course Metadata (AI Generated) - Enhanced with Individual Controls */}
          {message.interactiveType === 'course-metadata' && message.courseData && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="size-3 mr-1" />
                  AI Generated
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateMetadata}
                  className="text-primary hover:text-primary hover:bg-primary/5"
                >
                  <Wand2 className="size-3 mr-1" />
                  Regenerate All
                </Button>
              </div>

              <div className="space-y-4">
                {/* Description - Editable with individual regenerate */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-secondary-foreground">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRegenerateField('description')}
                        className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                      >
                        <RotateCcw className="size-3 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    rows={4}
                    className="resize-none"
                    placeholder="Course description..."
                  />
                </div>

                {/* Target Audience - Now Editable */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-secondary-foreground">Target Audience</label>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingAudience(!editingAudience)}
                        className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Edit2 className="size-3 mr-1" />
                        {editingAudience ? 'Done' : 'Edit'}
                      </Button>
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
                  {editingAudience ? (
                    <Textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      rows={2}
                      className="resize-none"
                      placeholder="Target audience..."
                    />
                  ) : (
                    <p className="text-foreground">{targetAudience}</p>
                  )}
                </div>

                {/* Learning Outcomes - Fully Editable */}
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-secondary-foreground">Learning Outcomes</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRegenerateField('learningOutcomes')}
                      className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/5"
                    >
                      <RotateCcw className="size-3 mr-1" />
                      Regenerate All
                    </Button>
                  </div>
                  <ul className="space-y-2 mb-3">
                    {learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex gap-2 items-start group/outcome">
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

                <div className="flex gap-2 justify-end pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handleGenerateMetadata}
                  >
                    <Wand2 className="size-3 mr-2" />
                    Regenerate All
                  </Button>
                  <Button
                    onClick={handleApproveMetadata}
                    className="bg-primary hover:bg-primary/5"
                  >
                    <Check className="size-3 mr-2" />
                    Looks Good, Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Course Outline */}
          {message.interactiveType === 'course-outline' && message.courseData?.outline && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="size-3 mr-1" />
                  AI Generated Course Outline
                </Badge>
              </div>

              <div className="space-y-3">
                {message.courseData.outline.map((module, idx) => (
                  <div key={idx} className="border border-border rounded-lg overflow-hidden transition-all duration-200 hover:border-border">
                    <div className="bg-muted px-4 py-3 border-b border-border">
                      <p className="text-foreground">Module {idx + 1}: {module.title}</p>
                    </div>
                    <div className="p-4 space-y-2 bg-card">
                      {module.lessons.map((lesson, lessonIdx) => (
                        <div key={lessonIdx} className="flex gap-2 text-secondary-foreground text-sm hover:text-foreground transition-colors">
                          <span className="text-muted-foreground">{lessonIdx + 1}.</span>
                          {lesson}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 justify-end pt-6 border-t border-border mt-6">
                <Button
                  variant="outline"
                  onClick={() => onGenerateWithAI?.('outline')}
                >
                  <RotateCcw className="size-3 mr-2" />
                  Regenerate Outline
                </Button>
                <Button
                  onClick={onApproveOutline}
                  className="bg-primary hover:bg-primary/5"
                >
                  <Sparkles className="size-3 mr-2" />
                  Start Building Course
                </Button>
              </div>
            </div>
          )}

          {/* Proposed Plan (Original) */}
          {message.proposedPlan && (
            <div className="mt-8 space-y-8">
              {/* Features */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-muted-foreground uppercase text-xs tracking-wider">Features</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3">
                  {message.proposedPlan.features.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex gap-3 p-4 rounded-lg border border-border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="size-5 rounded-full border-2 border-border flex items-center justify-center">
                          <div className="size-2 rounded-full bg-muted-foreground" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground mb-1">{feature.title}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Guidelines */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-muted-foreground uppercase text-xs tracking-wider">Style Guidelines</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3">
                  {message.proposedPlan.styleGuidelines.map((guideline, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-border bg-muted/50"
                    >
                      <div className="flex items-start gap-3">
                        <div className="size-2 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-foreground">{guideline.category}:</span>
                          <span className="text-muted-foreground"> {guideline.description}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <h3 className="text-muted-foreground uppercase text-xs tracking-wider">Stack</h3>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="grid gap-3">
                  <div className="p-4 rounded-lg border border-border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-secondary-foreground">AI:</span>
                        <span className="text-foreground ml-2">{message.proposedPlan.stack.ai}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="size-4 border-2 border-border rounded flex-shrink-0" />
                      <div className="flex-1">
                        <span className="text-secondary-foreground">UI:</span>
                        <span className="text-foreground ml-2">{message.proposedPlan.stack.ui}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button
                  onClick={onPrototype}
                  size="lg"
                >
                  Prototype this App
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Action Bar and Timestamp */}
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground text-xs">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            {message.editHistory && message.editHistory.length > 0 && (
              <Badge variant="outline" className="text-xs h-5">
                Edited
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className={`flex items-center gap-1 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
              title="Copy message"
            >
              {copySuccess ? (
                <Check className="size-3 text-primary" />
              ) : (
                <Copy className="size-3" />
              )}
            </Button>
            
            {isUser && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                onClick={handleEdit}
                title="Edit message"
              >
                <Edit2 className="size-3" />
              </Button>
            )}
            
            {!isUser && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                  onClick={handleRegenerate}
                  title="Regenerate response"
                >
                  <RotateCcw className="size-3" />
                </Button>
                
                <div className="h-4 w-px bg-border mx-1" />
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 hover:bg-muted rounded transition-colors ${
                    feedbackGiven === 'up' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleFeedback('up')}
                  title="Helpful"
                >
                  <ThumbsUp className="size-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-7 px-2 hover:bg-muted rounded transition-colors ${
                    feedbackGiven === 'down' ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => handleFeedback('down')}
                  title="Not helpful"
                >
                  <ThumbsDown className="size-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}