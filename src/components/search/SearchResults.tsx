import { Hash, BookOpen, Calendar, Star, MapPin, Users as UsersIcon } from 'lucide-react';
import { SearchTab, CommunityResult, CourseResult, EventResult, ResultCounts } from '../../hooks/useSearch';

interface SearchResultsProps {
  activeTab: SearchTab;
  onTabChange: (tab: SearchTab) => void;
  results: {
    communities: CommunityResult[];
    courses: CourseResult[];
    events: EventResult[];
  };
  resultCounts: ResultCounts;
  searchQuery: string;
  onResultClick?: (type: string, id: number) => void;
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text;
  
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200 text-gray-900">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

function CommunityCard({ community, searchQuery, onClick }: { community: CommunityResult; searchQuery: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:border-[#420D74]/50 hover:bg-gray-50 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="size-4 text-gray-500" />
            <h4 className="font-medium text-gray-900">
              {highlightText(community.name, searchQuery)}
            </h4>
            {community.badges.map((badge, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {highlightText(community.description, searchQuery)}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              {community.members} members
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="size-3.5" />
              {community.courses} courses
            </span>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#420D74] text-white text-sm rounded-lg hover:bg-[#420D74]/90 transition-all ml-4">
          Join
        </button>
      </div>
    </div>
  );
}

function CourseCard({ course, searchQuery, onClick }: { course: CourseResult; searchQuery: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:border-[#420D74]/50 hover:bg-gray-50 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="size-4 text-gray-500" />
            <h4 className="font-medium text-gray-900">
              {highlightText(course.name, searchQuery)}
            </h4>
            {course.badges.map((badge, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {highlightText(course.description, searchQuery)}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              {course.enrolled} enrolled
            </span>
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              {course.rating}
            </span>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#420D74] text-white text-sm rounded-lg hover:bg-[#420D74]/90 transition-all ml-4">
          Enroll
        </button>
      </div>
    </div>
  );
}

function EventCard({ event, searchQuery, onClick }: { event: EventResult; searchQuery: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:border-[#420D74]/50 hover:bg-gray-50 transition-all group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="size-4 text-gray-500" />
            <h4 className="font-medium text-gray-900">
              {highlightText(event.name, searchQuery)}
            </h4>
            {event.badges.map((badge, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                {badge}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {highlightText(event.description, searchQuery)}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3.5" />
              {event.attending} attending
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" />
              {event.location}
            </span>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-[#420D74] text-white text-sm rounded-lg hover:bg-[#420D74]/90 transition-all ml-4">
          RSVP
        </button>
      </div>
    </div>
  );
}

export function SearchResults({
  activeTab,
  onTabChange,
  results,
  resultCounts,
  searchQuery,
  onResultClick,
}: SearchResultsProps) {
  const tabs = [
    { id: 'all' as const, label: 'All', count: resultCounts.all },
    { id: 'communities' as const, label: 'Communities', count: resultCounts.communities },
    { id: 'events' as const, label: 'Events', count: resultCounts.events },
    { id: 'courses' as const, label: 'Courses', count: resultCounts.courses },
    { id: 'people' as const, label: 'People', count: resultCounts.people },
  ];

  const hasResults = resultCounts.all > 0;

  return (
    <div className="bg-white">
      {/* Debug */}
      <div className="p-4 bg-blue-100 text-xs">
        <div>SearchResults component rendering!</div>
        <div>hasResults: {hasResults ? 'YES' : 'NO'}</div>
        <div>activeTab: {activeTab}</div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 px-4 bg-white">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 border-b-2 transition-colors whitespace-nowrap text-sm ${
                activeTab === tab.id
                  ? 'border-[#420D74] text-[#420D74] font-medium'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} <span className="text-xs text-gray-500">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="py-6 px-4 overflow-y-auto">
        {!hasResults ? (
          <div className="py-12 text-center">
            <BookOpen className="size-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-900 mb-2">No results found for "{searchQuery}"</h3>
            <p className="text-sm text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Communities Section */}
            {(activeTab === 'all' || activeTab === 'communities') && results.communities.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Communities</h3>
                <div className="space-y-2">
                  {results.communities.map((community) => (
                    <CommunityCard
                      key={community.id}
                      community={community}
                      searchQuery={searchQuery}
                      onClick={() => onResultClick?.('community', community.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Courses Section */}
            {(activeTab === 'all' || activeTab === 'courses') && results.courses.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Courses</h3>
                <div className="space-y-2">
                  {results.courses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      searchQuery={searchQuery}
                      onClick={() => onResultClick?.('course', course.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Events Section */}
            {(activeTab === 'all' || activeTab === 'events') && results.events.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Events</h3>
                <div className="space-y-2">
                  {results.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      searchQuery={searchQuery}
                      onClick={() => onResultClick?.('event', event.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}