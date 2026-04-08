import { useState } from 'react';
import { MobileBuilderTabs } from '../MobileBuilderTabs';
import { MobileSegmentedControl } from '../MobileSegmentedControl';
import { TrendingUp, Zap, Target, MessageSquare } from 'lucide-react';

interface MobileCommunityAIHubProps {
  communityId: string;
}

export function MobileCommunityAIHub({ communityId }: MobileCommunityAIHubProps) {
  const [activeTab, setActiveTab] = useState('insights');
  const [activeContentType, setActiveContentType] = useState('announcements');

  const tabs = [
    { id: 'insights', label: 'Insights' },
    { id: 'generator', label: 'Generator' },
    { id: 'auto-mod', label: 'Auto-Mod' },
  ];

  const contentTypes = [
    { id: 'announcements', label: 'Announcements' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
    { id: 'discussions', label: 'Discussions' },
  ];

  const suggestedPrompts = [
    'Analyze member engagement this week',
    'Create announcement for upcoming event',
    'Generate event ideas for next month',
    'Review community health metrics',
  ];

  return (
    <div>
      {/* L3: Builder Tabs */}
      <MobileBuilderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-5 text-[#420D74]" />
              <h3 className="text-base text-gray-900">AI-Powered Insights</h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  title: 'Engagement Spike Detected',
                  description: 'Member activity increased 45% this week. Most active time: 2-4 PM.',
                  type: 'positive',
                },
                {
                  title: 'Content Opportunity',
                  description: 'Members are asking about "design systems". Consider creating content on this topic.',
                  type: 'info',
                },
                {
                  title: 'At-Risk Members',
                  description: '12 members haven\'t been active in 30 days. Consider reaching out.',
                  type: 'warning',
                },
              ].map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    insight.type === 'positive'
                      ? 'bg-green-50 border-green-200'
                      : insight.type === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h4 className="text-sm text-gray-900 mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generator Tab */}
      {activeTab === 'generator' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-[#420D74]" />
              <h3 className="text-sm text-gray-900">Content Generator</h3>
            </div>

            {/* L4: Segmented Control */}
            <div className="mb-4">
              <MobileSegmentedControl
                segments={contentTypes}
                activeSegment={activeContentType}
                onSegmentChange={setActiveContentType}
              />
            </div>

            {/* Generation Options */}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Topic</label>
                <input
                  type="text"
                  placeholder="e.g., New design workshop"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#420D74]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Tone</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#420D74]">
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Formal</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600 mb-2 block">Length</label>
                <div className="flex gap-2">
                  {['Short', 'Medium', 'Long'].map((length) => (
                    <button
                      key={length}
                      className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 active:scale-95 transition-all"
                    >
                      {length}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-[#420D74] text-white rounded-lg active:scale-95 transition-all">
                Generate Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Mod Tab */}
      {activeTab === 'auto-mod' && (
        <div className="p-4 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="size-5 text-[#420D74]" />
              <h3 className="text-sm text-gray-900">Auto-Moderation</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-900">AI Auto-Moderation</h4>
                  <p className="text-xs text-gray-600">Automatically flag inappropriate content</p>
                </div>
                <div className="w-10 h-6 bg-[#420D74] rounded-full relative">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-900">Spam Detection</h4>
                  <p className="text-xs text-gray-600">Filter spam and promotional content</p>
                </div>
                <div className="w-10 h-6 bg-[#420D74] rounded-full relative">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm text-gray-900">Toxicity Threshold</h4>
                  <p className="text-xs text-gray-600">Set sensitivity level</p>
                </div>
                <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="size-4 text-[#420D74]" />
                <h4 className="text-sm text-gray-900">Flagged Content (3)</h4>
              </div>
              <p className="text-xs text-gray-600">3 items need your review</p>
              <button className="mt-2 text-xs text-[#420D74]">Review Now →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}