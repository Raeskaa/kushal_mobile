import { Maximize2, Mic, PhoneOff, Video } from 'lucide-react';

interface MobileMinimizedMeetWindowProps {
  visible: boolean;
  onRestore: () => void;
  onLeave: () => void;
}

export function MobileMinimizedMeetWindow({ visible, onRestore, onLeave }: MobileMinimizedMeetWindowProps) {
  if (!visible) return null;

  return (
    <div className="fixed right-4 bottom-24 z-[60] w-40 rounded-2xl bg-zinc-900 text-white shadow-xl border border-white/10 overflow-hidden">
      <button onClick={onRestore} className="w-full h-24 bg-zinc-800 flex items-center justify-center">
        <Video className="size-8 text-white/40" />
      </button>
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-white/80">Meeting active</span>
          <button onClick={onRestore}><Maximize2 className="size-3.5 text-white/60" /></button>
        </div>
        <div className="flex items-center justify-between">
          <button className="size-8 rounded-full bg-white/10 flex items-center justify-center"><Mic className="size-4" /></button>
          <button className="size-8 rounded-full bg-white/10 flex items-center justify-center"><Video className="size-4" /></button>
          <button onClick={onLeave} className="size-8 rounded-full bg-destructive/80 flex items-center justify-center"><PhoneOff className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
