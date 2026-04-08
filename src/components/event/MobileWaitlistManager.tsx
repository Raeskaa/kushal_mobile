import { useMemo, useState } from 'react';
import { CheckCircle, Clock, Search, UserX, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type MockEvent } from '../../data/mockEventData';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface MobileWaitlistManagerProps {
  event: MockEvent;
}

export function MobileWaitlistManager({ event }: MobileWaitlistManagerProps) {
  const { setWaitlistEntries } = useEventStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const entries = event.waitlistEntries || [];
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => !searchQuery || entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || entry.email.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.priority - b.priority);
  }, [entries, searchQuery]);

  const updateStatus = (ids: string[], status: 'approved' | 'rejected') => {
    setWaitlistEntries(event.id, entries.map((entry) => ids.includes(entry.id) ? { ...entry, status } : entry));
    setSelectedIds([]);
    toast.success(`${ids.length} waitlist entr${ids.length === 1 ? 'y' : 'ies'} updated`);
  };

  return (
    <div className="p-4 space-y-4">
      <Card className="p-4 gap-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Pending', value: entries.filter((entry) => entry.status === 'pending').length },
            { label: 'Approved', value: entries.filter((entry) => entry.status === 'approved').length },
            { label: 'Rejected', value: entries.filter((entry) => entry.status === 'rejected').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted rounded-lg p-3 text-center">
              <p className="text-lg text-card-foreground">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" placeholder="Search waitlist..." />
      </div>

      {selectedIds.length > 0 && (
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => updateStatus(selectedIds, 'approved')}>
            <CheckCircle className="size-4" /> Approve Selected
          </Button>
          <Button variant="outline" className="flex-1 border-destructive/30 text-destructive" onClick={() => updateStatus(selectedIds, 'rejected')}>
            <UserX className="size-4" /> Reject
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {filteredEntries.map((entry) => {
          const selected = selectedIds.includes(entry.id);
          return (
            <Card key={entry.id} className="p-3 gap-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setSelectedIds((prev) => selected ? prev.filter((id) => id !== entry.id) : [...prev, entry.id])}
                  className={`size-5 rounded border mt-1 ${selected ? 'bg-primary border-primary' : 'border-border bg-card'}`}
                />
                <Avatar className="size-10">
                  <AvatarFallback className="text-xs">{entry.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-card-foreground">{entry.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{entry.email}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground">#{entry.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="size-3" /> Joined {entry.joinedAt}
                    </span>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">{entry.status}</span>
                  </div>
                </div>
              </div>

              {entry.status === 'pending' && (
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => updateStatus([entry.id], 'approved')}>
                    <CheckCircle className="size-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-destructive/30 text-destructive" onClick={() => updateStatus([entry.id], 'rejected')}>
                    <UserX className="size-3.5" /> Reject
                  </Button>
                </div>
              )}
            </Card>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <Users className="size-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No waitlist entries found</p>
          </div>
        )}
      </div>
    </div>
  );
}
