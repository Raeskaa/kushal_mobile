import { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, Edit2, Clock, Target, AlertCircle, CheckCircle2, TrendingUp, DollarSign, Users, BarChart, Lightbulb, Zap, FileText, PlayCircle, Lock } from 'lucide-react';
import { CourseData } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

interface CourseBuilderProps {
  courseData: Partial<CourseData>;
  showPreview: boolean;
  activeSection: string;
}

export function CourseBuilder({ courseData, showPreview, activeSection }: CourseBuilderProps) {
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleModule = (index: number) => {
    if (expandedModules.includes(index)) {
      setExpandedModules(expandedModules.filter(i => i !== index));
    } else {
      setExpandedModules([...expandedModules, index]);
    }
  };

  if (activeSection === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Projected Students</span>
              <TrendingUp className="size-4 text-green-600" />
            </div>
            <p className="text-gray-900 text-2xl">2,450</p>
            <p className="text-green-600 text-xs mt-1">+12% from avg</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Est. Revenue</span>
              <DollarSign className="size-4 text-blue-600" />
            </div>
            <p className="text-gray-900 text-2xl">$24.5K</p>
            <p className="text-blue-600 text-xs mt-1">Based on $99 price</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Completion Rate</span>
              <BarChart className="size-4 text-purple-600" />
            </div>
            <p className="text-gray-900 text-2xl">68%</p>
            <p className="text-purple-600 text-xs mt-1">Industry avg: 45%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Content Quality</span>
              <Lightbulb className="size-4 text-orange-600" />
            </div>
            <p className="text-gray-900 text-2xl">8.4/10</p>
            <p className="text-orange-600 text-xs mt-1">AI Score</p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="size-4 text-blue-600" />
            <h3 className="text-gray-900">AI-Powered Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="p-1 bg-blue-600 rounded h-fit">
                <Lightbulb className="size-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm mb-1">Add interactive quizzes to Module 2</p>
                <p className="text-gray-600 text-xs mb-2">Students retain 34% more when quizzes are added after each lesson</p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700">Apply Suggestion</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Dismiss</Button>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="p-1 bg-orange-600 rounded h-fit">
                <AlertCircle className="size-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-sm mb-1">SEO optimization needed</p>
                <p className="text-gray-600 text-xs mb-2">Add 3-5 more keywords to improve discoverability by 28%</p>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 text-xs bg-orange-600 hover:bg-orange-700">Optimize Now</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs">Later</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-gray-900 mb-4">Content Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Modules</span>
                <span className="text-gray-900">{courseData.outline?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Lessons</span>
                <span className="text-gray-900">{courseData.outline?.reduce((acc, m) => acc + m.lessons.length, 0) || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Duration</span>
                <span className="text-gray-900">4h 32min</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Difficulty Level</span>
                <Badge variant="secondary" className="text-xs">Intermediate</Badge>
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-gray-900 mb-4">Accessibility Score</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Readability</span>
                  <span className="text-green-600">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Alt Text Coverage</span>
                  <span className="text-orange-600">67%</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Caption Quality</span>
                  <span className="text-green-600">88%</span>
                </div>
                <Progress value={88} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSection === 'content') {
    return (
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start border-b-0 bg-transparent h-12 px-6">
              <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="modules" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                Modules & Lessons
              </TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                Resources
              </TabsTrigger>
              <TabsTrigger value="assessments" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
                Assessments
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="max-w-4xl space-y-6">
              {/* Course Info */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Course Information</h3>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="size-3 mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Course Title</label>
                    <Input value={courseData.title} className="bg-gray-50" readOnly />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Description</label>
                    <Textarea value={courseData.description} className="bg-gray-50 resize-none" rows={4} readOnly />
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <CheckCircle2 className="size-3 text-green-600" />
                      <span className="text-green-600">SEO Optimized</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">156 characters</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Target Audience</label>
                    <Input value={courseData.targetAudience} className="bg-gray-50" readOnly />
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-900">Learning Outcomes</h3>
                  <Button variant="ghost" size="sm">
                    <Plus className="size-3 mr-1" />
                    Add Outcome
                  </Button>
                </div>
                <div className="space-y-2">
                  {courseData.learningOutcomes?.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <Target className="size-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-900 text-sm flex-1">{outcome}</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit2 className="size-3 text-gray-400" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Metadata */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-gray-900 mb-4">Course Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Difficulty Level</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>Beginner</option>
                      <option selected>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Category</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>Technology</option>
                      <option>Business</option>
                      <option>Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Price (USD)</label>
                    <Input type="number" defaultValue="99" className="bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">Language</label>
                    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="max-w-4xl space-y-4">
              {/* Module Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">Course Modules</h3>
                  <Badge variant="secondary" className="text-xs">{courseData.outline?.length || 0} Modules</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExpandedModules(courseData.outline?.map((_, i) => i) || [])}>
                    <ChevronDown className="size-3 mr-1" />
                    Expand All
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setExpandedModules([])}>
                    <ChevronUp className="size-3 mr-1" />
                    Collapse All
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="size-3 mr-1" />
                    Add Module
                  </Button>
                </div>
              </div>

              {/* Modules List */}
              <div className="space-y-3">
                {courseData.outline?.map((module, idx) => {
                  const isExpanded = expandedModules.includes(idx);
                  const totalLessons = module.lessons.length;
                  const completedLessons = 0;
                  
                  return (
                    <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      {/* Module Header */}
                      <div className="bg-gray-50 border-b border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab">
                            <GripVertical className="size-4 text-gray-400" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-sm text-gray-600">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900">{module.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-xs text-gray-500">{totalLessons} lessons</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">~45 min</span>
                                <span className="text-gray-300">•</span>
                                <Badge variant="secondary" className="text-xs">Draft</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-auto">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit2 className="size-3 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 className="size-3 text-gray-500" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => toggleModule(idx)}
                            >
                              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </Button>
                          </div>
                        </div>
                        <div className="mt-3 ml-11">
                          <Progress value={(completedLessons / totalLessons) * 100} className="h-1" />
                        </div>
                      </div>

                      {/* Lessons */}
                      {isExpanded && (
                        <div className="p-4">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIdx) => (
                              <div 
                                key={lessonIdx} 
                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                              >
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab opacity-0 group-hover:opacity-100">
                                  <GripVertical className="size-3 text-gray-400" />
                                </Button>
                                <div className="size-5 rounded border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                                  <PlayCircle className="size-3 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-gray-900 text-sm">{lesson}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="size-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">5 min</span>
                                    <span className="text-gray-300">•</span>
                                    <FileText className="size-3 text-gray-400" />
                                    <span className="text-xs text-gray-500">Video + Text</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Edit2 className="size-3 text-gray-500" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <Trash2 className="size-3 text-gray-500" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            <Plus className="size-3 mr-1" />
                            Add Lesson
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h3 className="text-gray-900 mb-2">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h3>
        <p className="text-gray-500">This section is under construction</p>
      </div>
    </div>
  );
}