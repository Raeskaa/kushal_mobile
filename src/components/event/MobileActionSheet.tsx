import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function MobileActionSheet({ isOpen, onClose, title, subtitle, children }: MobileActionSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      {/* Sheet */}
      <div className="absolute inset-x-0 bottom-0 bg-card rounded-t-2xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Handle */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 pt-1 border-b border-border">
          <div className="flex-1 min-w-0">
            <h3 className="text-base text-card-foreground">{title}</h3>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          <Button variant="ghost" size="icon" className="size-8 flex-shrink-0" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
