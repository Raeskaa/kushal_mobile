import { Download, ExternalLink, File, FileText, Globe, Link2, Lock, Play, Presentation, Users, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { type EventResource } from '../../data/mockEventData';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface MobileResourceListProps {
  resources: EventResource[];
  canAccess: (resource: EventResource) => boolean;
  showSectionLabels?: boolean;
  isPostEventUnlocked?: boolean;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'PDF': return FileText;
    case 'Link': return Link2;
    case 'Video': return Video;
    case 'Slides': return Presentation;
    case 'Document':
    default:
      return File;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'PDF': return 'bg-destructive/10 text-destructive';
    case 'Link': return 'bg-primary/10 text-primary';
    case 'Video': return 'bg-accent text-accent-foreground';
    case 'Slides': return 'bg-secondary text-secondary-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getVisibilityMeta(visibility?: string) {
  switch (visibility) {
    case 'registered':
      return { icon: Users, label: 'Registered Only' };
    case 'post-event':
      return { icon: Lock, label: 'Post-Event Only' };
    case 'public':
    default:
      return { icon: Globe, label: 'Public' };
  }
}

export function MobileResourceList({ resources, canAccess, showSectionLabels = true, isPostEventUnlocked = false }: MobileResourceListProps) {
  const availableNow = resources.filter((resource) => resource.visibility !== 'post-event');
  const postEventOnly = resources.filter((resource) => resource.visibility === 'post-event');

  const renderGroup = (label: string, items: EventResource[], dimmed = false) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-2">
        {showSectionLabels && <p className="text-xs text-muted-foreground">{label}</p>}
        {items.map((resource) => {
          const TypeIcon = getTypeIcon(resource.type);
          const typeColor = getTypeColor(resource.type);
          const visibility = getVisibilityMeta(resource.visibility);
          const VisibilityIcon = visibility.icon;
          const accessible = canAccess(resource) && (!dimmed || isPostEventUnlocked);

          return (
            <Card key={resource.id} className={`p-3 flex-row items-center gap-3 ${dimmed && !isPostEventUnlocked ? 'opacity-60' : ''}`}>
              <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColor}`}>
                <TypeIcon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-card-foreground truncate">{resource.title}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className="text-[9px]">{resource.type}</Badge>
                  {resource.fileSize && <span className="text-[10px] text-muted-foreground">{resource.fileSize}</span>}
                  {resource.downloadCount !== undefined && <span className="text-[10px] text-muted-foreground">{resource.downloadCount} downloads</span>}
                  <Badge variant="outline" className="text-[9px] gap-1">
                    <VisibilityIcon className="size-2.5" />
                    {visibility.label}
                  </Badge>
                </div>
                {resource.description && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>}
              </div>

              {accessible ? (
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => toast.success(`Opening ${resource.title}`)}>
                    {resource.type === 'Link' ? <ExternalLink className="size-4 text-muted-foreground" /> : <Download className="size-4 text-muted-foreground" />}
                  </Button>
                </div>
              ) : (
                <Lock className="size-4 text-muted-foreground/50 flex-shrink-0" />
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderGroup('Available Now', availableNow)}
      {renderGroup(isPostEventUnlocked ? 'Post-Event Materials' : 'Available After Event', postEventOnly, true)}
    </div>
  );
}
