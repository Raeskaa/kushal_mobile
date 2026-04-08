import { useState } from 'react';
import { X } from 'lucide-react';

interface NavigationPatternsDemoProps {
  onClose?: () => void;
}

export function NavigationPatternsDemo({ onClose }: NavigationPatternsDemoProps) {
  const [level2Active, setLevel2Active] = useState('overview');
  const [level3Active, setLevel3Active] = useState('overview');
  const [level4aActive, setLevel4aActive] = useState('all');
  const [level4bActive, setLevel4bActive] = useState('overview');

  const level2Tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
    { id: 'team', label: 'Team' },
  ];

  const level3Tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'events', label: 'Events' },
    { id: 'courses', label: 'Courses' },
    { id: 'content', label: 'Content' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  const level4Filters = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'draft', label: 'Draft' },
  ];

  const level4Segments = [
    { id: 'overview', label: 'Overview' },
    { id: 'resources', label: 'Resources' },
    { id: 'notes', label: 'Notes' },
    { id: 'discussion', label: 'Discussion' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-gray-900">Navigation Patterns</h1>
            <p className="text-xs text-gray-600 mt-1">Choose your patterns for consistency</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
            >
              <X className="size-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-8">
        {/* LEVEL 2: Page Tabs (Current) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm text-gray-900">Level 2: Page Tabs (Current)</h2>
            <p className="text-xs text-gray-600 mt-1">Used for: Home, Communities List, Courses List, etc.</p>
          </div>
          
          {/* Current horizontal tabs */}
          <div className="overflow-x-auto">
            <div className="flex border-b border-gray-200">
              {level2Tabs.map((tab) => {
                const isActive = level2Active === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setLevel2Active(tab.id)}
                    className={`flex-shrink-0 px-4 py-3 border-b-2 transition-all active:scale-95 ${
                      isActive
                        ? 'border-[#420D74] text-[#420D74]'
                        : 'border-transparent text-gray-500'
                    }`}
                  >
                    <span className="whitespace-nowrap text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-8 text-center text-gray-500 text-sm">
            Content for "{level2Active}" goes here
          </div>
        </div>

        {/* LEVEL 3: Builder Tabs (NEW - Visually Distinct) */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm text-gray-900">Level 3: Builder Tabs - Option A (Pills)</h2>
              <p className="text-xs text-gray-600 mt-1">Used for: Community Builder, Course Builder, Event Builder</p>
            </div>
            
            {/* Option A: Pill-style tabs */}
            <div className="p-3 bg-gray-50">
              <div className="overflow-x-auto">
                <div className="flex gap-2">
                  {level3Tabs.map((tab) => {
                    const isActive = level3Active === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setLevel3Active(tab.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all active:scale-95 ${
                          isActive
                            ? 'bg-[#420D74] text-white'
                            : 'bg-white text-gray-700 border border-gray-300'
                        }`}
                      >
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Builder content for "{level3Active}" goes here
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm text-gray-900">Level 3: Builder Tabs - Option B (Cards)</h2>
              <p className="text-xs text-gray-600 mt-1">Used for: Community Builder, Course Builder, Event Builder</p>
            </div>
            
            {/* Option B: Card-style tabs */}
            <div className="p-3 bg-white">
              <div className="overflow-x-auto">
                <div className="flex gap-2">
                  {level3Tabs.map((tab) => {
                    const isActive = level3Active === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setLevel3Active(tab.id)}
                        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm transition-all active:scale-95 ${
                          isActive
                            ? 'bg-[#420D74] text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Builder content for "{level3Active}" goes here
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm text-gray-900">Level 3: Builder Tabs - Option C (Compact Pills)</h2>
              <p className="text-xs text-gray-600 mt-1">Used for: Community Builder, Course Builder, Event Builder</p>
            </div>
            
            {/* Option C: Smaller, compact pills */}
            <div className="px-3 py-2 bg-white border-b border-gray-200">
              <div className="overflow-x-auto">
                <div className="flex gap-1.5">
                  {level3Tabs.map((tab) => {
                    const isActive = level3Active === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setLevel3Active(tab.id)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs transition-all active:scale-95 ${
                          isActive
                            ? 'bg-[#420D74] text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              Builder content for "{level3Active}" goes here
            </div>
          </div>
        </div>

        {/* LEVEL 4a: Filter Chips */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm text-gray-900">Level 4a: Filter Chips</h2>
            <p className="text-xs text-gray-600 mt-1">Used for: Filtering lists within builder tabs (e.g., Events, Courses)</p>
          </div>
          
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              {level4Filters.map((filter) => {
                const isActive = level4aActive === filter.id;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setLevel4aActive(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#420D74] text-white'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
            Filtered content: "{level4aActive}" items
          </div>
        </div>

        {/* LEVEL 4b: Segmented Control */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm text-gray-900">Level 4b: Segmented Control</h2>
            <p className="text-xs text-gray-600 mt-1">Used for: Content sections (e.g., Course Player tabs, Meeting sidebar)</p>
          </div>
          
          <div className="p-4">
            <div className="inline-flex bg-gray-100 rounded-lg p-1 w-full">
              {level4Segments.map((segment) => {
                const isActive = level4bActive === segment.id;
                return (
                  <button
                    key={segment.id}
                    onClick={() => setLevel4bActive(segment.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-xs transition-all active:scale-95 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    <span className="whitespace-nowrap">{segment.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
            Content section: "{level4bActive}"
          </div>
        </div>

        {/* LEVEL 4b Alternative: Segmented Control (Tight Version) */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm text-gray-900">Level 4b: Segmented Control - Tight Version</h2>
            <p className="text-xs text-gray-600 mt-1">More compact, iOS-style segmented control</p>
          </div>
          
          <div className="p-4">
            <div className="inline-flex bg-gray-100 rounded-lg p-0.5 w-full">
              {level4Segments.map((segment) => {
                const isActive = level4bActive === segment.id;
                return (
                  <button
                    key={segment.id}
                    onClick={() => setLevel4bActive(segment.id)}
                    className={`flex-1 px-2 py-1.5 rounded-md text-xs transition-all active:scale-95 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    <span className="whitespace-nowrap">{segment.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-8 text-center text-gray-500 text-sm border-t border-gray-200">
            Content section: "{level4bActive}"
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-[#420D74] text-white rounded-lg p-4">
          <h3 className="text-sm mb-3">Visual Hierarchy Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="opacity-80">Level 1: Bottom Nav</span>
              <span>Icons + Labels</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Level 2: Page Tabs</span>
              <span>Bottom Border</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Level 3: Builder Tabs</span>
              <span>Pills / Cards</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Level 4a: Filters</span>
              <span>Chips</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Level 4b: Content Sections</span>
              <span>Segmented Control</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}