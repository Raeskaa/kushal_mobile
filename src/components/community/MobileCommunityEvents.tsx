import { useState } from 'react';
import { MobileBuilderTabs } from '../MobileBuilderTabs';
import { MobileFilterChips } from '../MobileFilterChips';
import { Calendar, Clock, MapPin, Users, Plus } from 'lucide-react';

interface MobileCommunityEventsProps {
  communityId: string;
}

export function MobileCommunityEvents({ communityId }: MobileCommunityEventsProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeFilter, setActiveFilter] = useState('all');

  const tabs = [
    { id: 'calendar', label: 'Calendar' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'drafts', label: 'Drafts' },
  ];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'rsvpd', label: 'RSVP\'d' },
  ];

  const events = [
    {
      id: '1',
      title: 'UX Workshop: Advanced Prototyping',
      date: 'Tomorrow',
      time: '2:00 PM - 4:00 PM',
      location: 'Virtual (Zoom)',
      attendees: 23,
      capacity: 30,
      type: 'Workshop',
      rsvp: true,
    },
    {
      id: '2',
      title: 'Design Review Session',
      date: 'Friday, Jan 10',
      time: '10:00 AM - 11:30 AM',
      location: 'Office - Room 3B',
      attendees: 12,
      capacity: 15,
      type: 'Meeting',
      rsvp: false,
    },
    {
      id: '3',
      title: 'Coffee & Design Chat',
      date: 'Monday, Jan 13',
      time: '4:30 PM - 5:30 PM',
      location: 'Virtual (Google Meet)',
      attendees: 18,
      capacity: 25,
      type: 'Social',
      rsvp: true,
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

      {/* Upcoming Events */}
      {activeTab === 'upcoming' && (
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
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="size-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="size-6 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{event.type}</span>
                      <h3 className="text-sm text-gray-900 mt-2">{event.title}</h3>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="size-4" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="size-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="size-4" />
                      <span>{event.attendees}/{event.capacity} attending</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.rsvp ? (
                      <button className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        ✓ Going
                      </button>
                    ) : (
                      <button className="flex-1 px-4 py-2.5 bg-[#420D74] text-white rounded-lg text-sm active:scale-95 transition-all">
                        RSVP
                      </button>
                    )}
                    <button className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm active:scale-95 transition-all hover:border-gray-300">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Create Event Button */}
            <button className="w-full bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 active:scale-98 transition-all hover:border-gray-400">
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Plus className="size-5" />
                <span className="text-sm">Create New Event</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {activeTab === 'calendar' && (
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Calendar className="size-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm text-gray-900 mb-1">Calendar View</h3>
            <p className="text-xs text-gray-600">Full calendar integration coming soon</p>
          </div>
        </div>
      )}

      {/* Past Events */}
      {activeTab === 'past' && (
        <div className="p-4 space-y-3">
          {[
            { title: 'Design System Workshop', date: 'Dec 15, 2024', attendees: 28 },
            { title: 'Year-End Networking', date: 'Dec 20, 2024', attendees: 45 },
          ].map((event, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm text-gray-900 mb-2">{event.title}</h3>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{event.date}</span>
                <span>{event.attendees} attended</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drafts */}
      {activeTab === 'drafts' && (
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Calendar className="size-16 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm text-gray-900 mb-1">No Draft Events</h3>
            <p className="text-xs text-gray-600">Draft events will appear here</p>
          </div>
        </div>
      )}
    </div>
  );
}