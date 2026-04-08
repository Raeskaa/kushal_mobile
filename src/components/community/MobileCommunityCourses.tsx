import { useState } from 'react';
import { MobileBuilderTabs } from '../MobileBuilderTabs';
import { BookOpen, Play, Users, Clock, Plus } from 'lucide-react';
import { MobileFilterChips } from '../MobileFilterChips';

interface MobileCommunityCoursesProps {
  communityId: string;
}

export function MobileCommunityCourses({ communityId }: MobileCommunityCoursesProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Courses' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
    { id: 'drafts', label: 'Drafts' },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'Design' },
    { id: 'development', label: 'Development' },
    { id: 'marketing', label: 'Marketing' },
  ];

  const courses = [
    {
      id: '1',
      title: 'Advanced Product Design',
      instructor: 'Sarah Johnson',
      students: 45,
      duration: '8 weeks',
      progress: 68,
      modules: 12,
      status: 'active',
    },
    {
      id: '2',
      title: 'UX Research Fundamentals',
      instructor: 'Mike Chen',
      students: 32,
      duration: '6 weeks',
      progress: 45,
      modules: 10,
      status: 'active',
    },
    {
      id: '3',
      title: 'Design Systems Mastery',
      instructor: 'Emma Wilson',
      students: 28,
      duration: '10 weeks',
      progress: 0,
      modules: 15,
      status: 'new',
    },
  ];

  return (
    <div>
      {/* L3: Builder Tabs */}
      <MobileBuilderTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* All Courses Tab */}
      {activeTab === 'all' && (
        <div>
          {/* L4: Filter Chips */}
          <div className="bg-white border-b border-gray-200 px-4 py-4">
            <MobileFilterChips
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className="p-4 space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Course Header */}
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="size-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="size-6 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-xs text-gray-600">by {course.instructor}</p>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <Users className="size-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">{course.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <BookOpen className="size-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">{course.modules}</div>
                      <div className="text-xs text-gray-500">Modules</div>
                    </div>
                    <div className="text-center">
                      <Clock className="size-4 text-gray-400 mx-auto mb-1" />
                      <div className="text-xs text-gray-600">{course.duration}</div>
                      <div className="text-xs text-gray-500">Duration</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {course.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-600">Your Progress</span>
                        <span className="text-xs text-gray-900">{course.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#420D74] rounded-full" 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-4 py-2.5 bg-[#420D74] text-white rounded-lg text-sm active:scale-95 transition-all flex items-center justify-center gap-2">
                      <Play className="size-4" />
                      {course.progress > 0 ? 'Continue' : 'Start Course'}
                    </button>
                    <button className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm active:scale-95 transition-all hover:border-gray-300">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create Course Button */}
            <button className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 active:scale-98 transition-all hover:border-gray-400">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Plus className="size-5" />
                <span className="text-sm">Create New Course</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Active Courses */}
      {activeTab === 'active' && (
        <div className="p-4 space-y-3">
          {courses.filter(c => c.status === 'active').map((course) => (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm text-gray-900 mb-2">{course.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                <span>{course.students} students</span>
                <span>{course.progress}% complete</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#420D74] rounded-full" 
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completed Courses */}
      {activeTab === 'completed' && (
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BookOpen className="size-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm text-gray-900 mb-1">No Completed Courses</h3>
            <p className="text-xs text-gray-600">Completed courses will appear here</p>
          </div>
        </div>
      )}

      {/* Drafts */}
      {activeTab === 'drafts' && (
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <BookOpen className="size-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm text-gray-900 mb-1">No Draft Courses</h3>
            <p className="text-xs text-gray-600">Draft courses will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}