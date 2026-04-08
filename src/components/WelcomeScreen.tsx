import { Sparkles, Search, BookOpen, Users, Calendar, ChevronDown, TrendingUp, Zap, Target, HelpCircle, Plus, DollarSign, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';
import { AppVersion } from '../types';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { imgGroup } from '../imports/svg-qpgp8';
import { ImportCommunityDialog } from './ImportCommunityDialog';

interface WelcomeScreenProps {
  onStart: (prompt: string, mode?: 'creator' | 'learner', type?: 'course' | 'community') => void;
  onVersionChange: (version: AppVersion) => void;
  currentVersion: AppVersion;
  userMode: 'creator' | 'learner';
  onModeChange: (mode: 'creator' | 'learner') => void;
  onImportCommunity?: (communityData: any) => void;
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

export function WelcomeScreen({ onStart, onVersionChange, currentVersion, onImportCommunity }: WelcomeScreenProps) {
  const [prompt, setPrompt] = useState('');
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      const lowerPrompt = prompt.toLowerCase();
      const isCommunity = lowerPrompt.includes('community') || lowerPrompt.includes('build a community');
      const isCourse = lowerPrompt.includes('course') && !isCommunity;
      
      const type = isCommunity ? 'community' : (isCourse ? 'course' : undefined);
      onStart(prompt, undefined, type);
    }
  };

  const handleImportComplete = (communityData: any) => {
    setShowImportDialog(false);
    if (onImportCommunity) {
      onImportCommunity(communityData);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Actions Bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center justify-end gap-3">
          {/* Version Switcher */}
          <Popover open={showVersionMenu} onOpenChange={setShowVersionMenu}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-gray-300">
                <Badge variant="secondary" className="text-xs bg-purple-100 text-[#420D74] border-0">
                  {currentVersion.toUpperCase()}
                </Badge>
                <ChevronDown className="size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-2" align="end">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 px-2 py-1 font-medium">Switch UX Approach</p>
                {(Object.keys(versionDescriptions) as AppVersion[]).map((version) => (
                  <button
                    key={version}
                    onClick={() => {
                      onVersionChange(version);
                      setShowVersionMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors ${
                      currentVersion === version ? 'bg-purple-50 border border-purple-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={currentVersion === version ? "default" : "secondary"} 
                          className={`text-xs ${currentVersion === version ? 'bg-[#420D74]' : ''}`}
                        >
                          {version.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-900">{versionDescriptions[version]}</span>
                      </div>
                      {currentVersion === version && (
                        <div className="size-2 rounded-full bg-[#420D74]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Leapy AI Button */}
          <Button variant="outline" size="sm" className="gap-2 border-gray-300">
            <img src={imgGroup} alt="" className="size-4" />
            <span className="text-sm">Leapy AI</span>
          </Button>

          {/* Sign In Button */}
          <Button className="bg-[#420D74] hover:bg-[#5a1293] text-white shadow-sm">
            Sign in
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-6 py-16">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gradient-to-r from-[#420D74]/10 to-blue-100/50 rounded-full border border-[#420D74]/20">
              <img src={imgGroup} alt="" className="size-4" />
              <span className="text-sm text-[#420D74] font-medium">Leapy V2.1 available now</span>
            </div>
            <h1 className="text-[48px] font-bold text-gray-900 mb-4 tracking-tight leading-tight">
              Create communities, manage your
              <br />
              courses, events and a lot more
            </h1>
            <p className="text-lg text-gray-600">
              Join <span className="font-semibold text-[#420D74]">10,000+</span> educators building engaging learning communities 🚀
            </p>
          </div>

          <div className="mb-10">
            <form onSubmit={handleSubmit}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#420D74] to-blue-600 rounded-2xl opacity-10 blur-lg group-hover:opacity-20 transition-opacity" />
                <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200/80 p-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Launch a business which can sell courses"
                        className="w-full px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none text-base"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Popover open={showAttachmentMenu} onOpenChange={setShowAttachmentMenu}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Add attachment"
                          >
                            <svg className="size-5" fill="none" viewBox="0 0 20 20">
                              <path d="M10 5v10m-5-5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-gray-600" />
                            </svg>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" align="end">
                          <div className="space-y-1">
                            <button
                              onClick={() => {
                                setShowAttachmentMenu(false);
                                // Handle file attachment
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-3"
                            >
                              <Plus className="size-4 text-gray-600" />
                              <div>
                                <p className="text-sm text-gray-900">Add file or image</p>
                                <p className="text-xs text-gray-500">Upload from your device</p>
                              </div>
                            </button>
                            <button
                              onClick={() => {
                                setShowAttachmentMenu(false);
                                setShowImportDialog(true);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-3 border-t border-gray-100 pt-2 mt-2"
                            >
                              <Upload className="size-4 text-[#420D74]" />
                              <div>
                                <p className="text-sm text-gray-900">Import existing community</p>
                                <p className="text-xs text-gray-500">From Slack, WhatsApp, Discord...</p>
                              </div>
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <button
                        type="button"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Templates"
                      >
                        <div className="size-5 flex items-center justify-center text-gray-600 font-medium text-xs">
                          |||
                        </div>
                      </button>
                      <Button
                        type="submit"
                        disabled={!prompt.trim()}
                        className="bg-[#420D74] hover:bg-[#5a1293] text-white px-6 shadow-lg shadow-[#420D74]/20"
                      >
                        <Sparkles className="size-4 mr-2" />
                        Go
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-100 mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAttachmentMenu(true)}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                      <Plus className="size-3" />
                      Add attachment
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                      <div className="size-3 flex items-center justify-center text-gray-600 font-medium text-xs">
                        |||
                      </div>
                      Templates
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Quick Actions */}
          <div>
            <p className="text-sm text-gray-600 mb-4 text-center">Quick actions to get started:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => onStart('Create my course', 'creator', 'course')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <BookOpen className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Create my course
              </button>
              <button
                onClick={() => onStart('Build a community', 'creator', 'community')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Users className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Build a community
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Upload className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Import community
              </button>
              <button
                onClick={() => onStart('I already use other tools', 'creator')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Target className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                I already use other tools
              </button>
              <button
                onClick={() => onStart('How are you different?', 'creator')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <HelpCircle className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                How are you different?
              </button>
              <button
                onClick={() => onStart('Help me make more money', 'learner')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <DollarSign className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Help me make more money
              </button>
              <button
                onClick={() => onStart('Event management', 'learner')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Calendar className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Event management
              </button>
              <button
                onClick={() => onStart('Content creation', 'learner')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Zap className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Content creation
              </button>
              <button
                onClick={() => onStart('Analytics & insights', 'learner')}
                className="group relative bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200/80 hover:border-[#420D74]/30 rounded-full px-5 py-2.5 text-sm text-gray-700 hover:text-[#420D74] transition-all shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <TrendingUp className="size-3.5 text-gray-500 group-hover:text-[#420D74] transition-colors" />
                Analytics & insights
              </button>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="grid grid-cols-2 gap-6 mt-16">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 border border-purple-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`size-1.5 rounded-full ${i <= 3 ? 'bg-gray-400' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Title 1</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create courses in minutes with intelligent content generation and curriculum planning
                  </p>
                </div>
                <button className="text-[#420D74] hover:text-[#5a1293] flex items-center gap-1 text-sm font-medium">
                  CTA 1 →
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-200/50">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`size-1.5 rounded-full ${i <= 3 ? 'bg-gray-400' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Title 2</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Create courses in minutes with intelligent content generation and curriculum planning
                  </p>
                </div>
                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium">
                  CTA 2 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ImportCommunityDialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onComplete={handleImportComplete}
      />
    </div>
  );
}