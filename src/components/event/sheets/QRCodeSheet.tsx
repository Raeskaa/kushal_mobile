import { MobileActionSheet } from '../MobileActionSheet';
import { type MockEvent } from '../../../data/mockEventData';
import { Button } from '../../ui/button';
import { Download, Share2, Copy, Printer } from 'lucide-react';
import { toast } from "sonner@2.0.3";
import { copyToClipboard } from '../../../utils/copyToClipboard';

interface QRCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: MockEvent;
}

// Simple deterministic QR-like pattern from string
function QRPattern({ value, size = 180 }: { value: string; size?: number }) {
  const cells = 21;
  const cellSize = size / cells;

  // Generate pseudo-random pattern from string
  const hash = (s: string, i: number) => {
    let h = 0;
    for (let c = 0; c < s.length; c++) {
      h = ((h << 5) - h + s.charCodeAt(c) + i * 7) | 0;
    }
    return h;
  };

  const grid: boolean[][] = [];
  for (let r = 0; r < cells; r++) {
    grid[r] = [];
    for (let c = 0; c < cells; c++) {
      // Fixed finder patterns (top-left, top-right, bottom-left)
      const inTL = r < 7 && c < 7;
      const inTR = r < 7 && c >= cells - 7;
      const inBL = r >= cells - 7 && c < 7;

      if (inTL || inTR || inBL) {
        const lr = inTL ? r : inTR ? r : r - (cells - 7);
        const lc = inTL ? c : inTR ? c - (cells - 7) : c;
        // Outer border + inner square
        const isOuter = lr === 0 || lr === 6 || lc === 0 || lc === 6;
        const isInner = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
        grid[r][c] = isOuter || isInner;
      } else {
        grid[r][c] = (hash(value, r * cells + c) & 3) === 0;
      }
    }
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((filled, c) =>
          filled ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="var(--color-primary)"
              rx={0.5}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export function QRCodeSheet({ isOpen, onClose, event }: QRCodeSheetProps) {
  const eventUrl = `leapspace.io/events/${event.id}`;

  return (
    <MobileActionSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Event QR Code"
      subtitle="Scan to register or check in"
    >
      <div className="space-y-5">
        {/* QR Code */}
        <div className="flex flex-col items-center py-4">
          <div className="bg-card p-4 rounded-2xl border border-border">
            <QRPattern value={eventUrl} size={200} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">{eventUrl}</p>
        </div>

        {/* Event info */}
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm text-card-foreground">{event.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {event.date} · {event.time}
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => toast('QR code downloaded!')} className="h-11">
            <Download className="size-4" /> Download
          </Button>
          <Button variant="outline" onClick={() => toast('Print dialog would open')} className="h-11">
            <Printer className="size-4" /> Print
          </Button>
        </div>

        <Button
          variant="outline"
          onClick={() => { copyToClipboard(eventUrl); toast.success('Link copied!'); }}
          className="w-full"
        >
          <Copy className="size-4" /> Copy Event Link
        </Button>

        {/* Use cases */}
        <div className="space-y-1.5">
          <p className="text-[10px] text-muted-foreground">Use this QR code for:</p>
          <ul className="text-xs text-secondary-foreground space-y-1 list-disc list-inside">
            <li>Event posters and flyers</li>
            <li>Name badges for check-in</li>
            <li>Slide presentations</li>
            <li>Social media posts</li>
          </ul>
        </div>
      </div>
    </MobileActionSheet>
  );
}