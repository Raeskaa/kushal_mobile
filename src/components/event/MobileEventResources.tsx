import { useState } from 'react';
import { type MockEvent, type EventResource } from '../../data/mockEventData';
import { toast } from "sonner@2.0.3";
import {
  FileText, Link2, Video, File, Presentation, Plus, Download, Eye, EyeOff,
  Sparkles, Trash2, Upload, Search, MoreVertical, Lock, Users, Globe
} from 'lucide-react';
import { type LeapyContext } from '../../data/leapyContexts';
import { useEventStore } from '../../data/EventStoreContext';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';

interface MobileEventResourcesProps {
  event: MockEvent;
  onOpenLeapy?: (context: LeapyContext) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'PDF': return FileText;
    case 'Link': return Link2;
    case 'Video': return Video;
    case 'Slides': return Presentation;
    case 'Document': return File;
    default: return File;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'PDF': return 'bg-destructive/10 text-destructive';
    case 'Link': return 'bg-accent text-accent-foreground';
    case 'Video': return 'bg-primary/10 text-primary';
    case 'Slides': return 'bg-secondary text-secondary-foreground';
    case 'Document': return 'bg-primary/10 text-primary';
    default: return 'bg-accent text-secondary-foreground';
  }
};

const getVisibilityIcon = (visibility?: string) => {
  switch (visibility) {
    case 'public': return Globe;
    case 'registered': return Users;
    case 'post-event': return Lock;
    default: return Globe;
  }
};

const getVisibilityLabel = (visibility?: string) => {
  switch (visibility) {
    case 'public': return 'Public';
    case 'registered': return 'Registered Only';
    case 'post-event': return 'Post-Event Only';
    default: return 'Public';
  }
};

export function MobileEventResources({ event, onOpenLeapy }: MobileEventResourcesProps) {
  const { removeResource } = useEventStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resources = event.resources || [];
  const leapy = (type: string) => onOpenLeapy?.({ type, entityId: event.id, entityData: event } as LeapyContext);

  const filteredResources = resources.filter(r =>
    !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDownloads = resources.reduce((sum, r) => sum + (r.downloadCount || 0), 0);

  return (
    <div className="p-4 space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">{resources.length}</p>
          <p className="text-[10px] text-muted-foreground">Resources</p>
        </Card>
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">{totalDownloads}</p>
          <p className="text-[10px] text-muted-foreground">Downloads</p>
        </Card>
        <Card className="p-3 text-center gap-1">
          <p className="text-lg text-card-foreground">
            {resources.filter(r => r.visibility === 'public' || !r.visibility).length}
          </p>
          <p className="text-[10px] text-muted-foreground">Public</p>
        </Card>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button size="sm" onClick={() => leapy('add_resources')} className="flex-shrink-0">
          <Plus className="size-4" /> Add
        </Button>
      </div>

      {/* Upload Area */}
      <button
        onClick={() => leapy('add_resources')}
        className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 active:bg-muted transition-all"
      >
        <Upload className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Drop files or tap to upload</p>
        <p className="text-[10px] text-muted-foreground">PDF, Slides, Documents, Links</p>
      </button>

      {/* Resource List */}
      {filteredResources.length > 0 ? (
        <div className="space-y-2">
          {filteredResources.map((resource) => {
            const TypeIcon = getTypeIcon(resource.type);
            const typeColor = getTypeColor(resource.type);
            const VisIcon = getVisibilityIcon(resource.visibility);
            const isExpanded = expandedId === resource.id;

            return (
              <Card key={resource.id} className="overflow-hidden gap-0">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : resource.id)}
                  className="w-full flex items-center gap-3 p-3 active:bg-muted transition-all"
                >
                  <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
                    <TypeIcon className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm text-card-foreground truncate">{resource.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                      <span>{resource.type}</span>
                      {resource.fileSize && (
                        <>
                          <span className="text-border">·</span>
                          <span>{resource.fileSize}</span>
                        </>
                      )}
                      {resource.downloadCount !== undefined && (
                        <>
                          <span className="text-border">·</span>
                          <span>{resource.downloadCount} downloads</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Badge variant="outline" className="text-[9px] gap-0.5">
                      <VisIcon className="size-2.5" />
                      {getVisibilityLabel(resource.visibility)}
                    </Badge>
                  </div>
                </button>

                {/* Expanded Actions */}
                {isExpanded && (
                  <div className="border-t border-border px-3 py-2 bg-muted/50 flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast('Open resource')} className="flex-1 h-8 text-xs">
                      <Eye className="size-3" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => toast('Download resource')} className="flex-1 h-8 text-xs">
                      <Download className="size-3" /> Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      removeResource(event.id, resource.id);
                      toast.success('Resource removed');
                      setExpandedId(null);
                    }} className="h-8 text-xs border-destructive/30 text-destructive">
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="size-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No resources yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add slides, documents, or links for your attendees</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <Search className="size-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No results for "{searchQuery}"</p>
        </div>
      )}

      {/* AI Add Resources */}
      <Card className="p-4 gap-2 bg-primary/5 border-primary/20">
        <h3 className="text-sm text-card-foreground">AI Resource Suggestions</h3>
        <Button variant="secondary" onClick={() => leapy('add_resources')} className="w-full justify-start bg-card hover:bg-accent">
          <Sparkles className="size-4 text-primary" />
          <span className="flex-1 text-left">Generate resource list from agenda</span>
        </Button>
        <Button variant="secondary" onClick={() => leapy('smart_compose')} className="w-full justify-start bg-card hover:bg-accent">
          <Sparkles className="size-4 text-primary" />
          <span className="flex-1 text-left">Create handout from event description</span>
        </Button>
      </Card>
    </div>
  );
}