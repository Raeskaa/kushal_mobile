import { useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type MockEvent } from '../data/mockEventData';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface MobileEventsCalendarProps {
  events: MockEvent[];
  onEventClick: (eventId: string) => void;
}

function toDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function MobileEventsCalendar({ events, onEventClick }: MobileEventsCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const date = toDate(event.date);
      return date.getFullYear() === visibleMonth.getFullYear() && date.getMonth() === visibleMonth.getMonth();
    });
  }, [events, visibleMonth]);

  const calendarDays = useMemo(() => {
    const first = startOfMonth(visibleMonth);
    const leading = first.getDay();
    const start = new Date(first);
    start.setDate(first.getDate() - leading);

    return Array.from({ length: 35 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const selectedEvents = selectedDate
    ? monthEvents.filter((event) => sameDay(toDate(event.date), selectedDate))
    : [];

  return (
    <div className="space-y-4">
      <Card className="p-4 gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-card-foreground">Calendar View</h3>
            <p className="text-xs text-muted-foreground">Month view for all visible events</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base text-card-foreground">
            {visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setVisibleMonth(startOfMonth(new Date()))}>
            Today
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => <span key={day}>{day}</span>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
            const eventsForDay = monthEvents.filter((event) => sameDay(toDate(event.date), day));
            const isSelected = !!selectedDate && sameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[56px] rounded-xl border p-2 text-left transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card'} ${!isCurrentMonth ? 'opacity-40' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-card-foreground">{day.getDate()}</span>
                  {eventsForDay.length > 0 && (
                    <span className="text-[10px] text-primary">{eventsForDay.length}</span>
                  )}
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {eventsForDay.slice(0, 3).map((event) => (
                    <span key={event.id} className="size-1.5 rounded-full bg-primary" />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-4 gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm text-card-foreground">
              {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Select a day'}
            </h3>
            <p className="text-xs text-muted-foreground">{selectedEvents.length} event{selectedEvents.length === 1 ? '' : 's'}</p>
          </div>
          <Badge variant="outline" className="text-[10px]">Month</Badge>
        </div>

        {selectedEvents.length > 0 ? (
          selectedEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => onEventClick(event.id)}
              className="w-full text-left rounded-xl border border-border p-3 active:scale-[0.99] transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-card-foreground truncate">{event.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="size-3" /> {event.time}
                    </span>
                    <Badge variant="outline" className="text-[9px] capitalize">{event.location}</Badge>
                    {event.userRole === 'creator' && <Badge variant="outline" className="text-[9px]">Hosting</Badge>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast.success('Add to calendar options coming next'); }}>
                    <Download className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-10">
            <CalendarDays className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No events on this day</p>
          </div>
        )}
      </Card>
    </div>
  );
}
