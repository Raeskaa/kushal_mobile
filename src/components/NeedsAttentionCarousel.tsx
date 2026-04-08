import { useRef, useState, useEffect, type ComponentType } from 'react';
import { motion } from 'motion/react';

interface NeedsCard {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count: number;
  status: string;
}

interface NeedsAttentionCarouselProps {
  cards: NeedsCard[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function NeedsAttentionCarousel({ cards, selectedId, onSelect }: NeedsAttentionCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(375);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isDraggingRef = useRef(false);
  const mouseDownRef = useRef(false);

  const selectedIndex = cards.findIndex(c => c.id === selectedId);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const gap = 10;
  const selectedW = containerWidth / 2.077;
  const adjacentW = containerWidth / 3.23;
  const farW = containerWidth / 4.23;

  const getCardWidth = (index: number) => {
    const dist = Math.abs(index - selectedIndex);
    if (dist === 0) return selectedW;
    if (dist === 1) return adjacentW;
    return farW;
  };

  const getTotalTrackWidth = () => {
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
      total += getCardWidth(i);
    }
    total += (cards.length - 1) * gap;
    return total;
  };

  const getTrackOffset = () => {
    let positionOfSelected = 0;
    for (let i = 0; i < selectedIndex; i++) {
      positionOfSelected += getCardWidth(i) + gap;
    }

    const centeredOffset = containerWidth / 2 - positionOfSelected - selectedW / 2;
    const edgePadding = 16;
    const totalWidth = getTotalTrackWidth();

    const maxOffset = edgePadding;
    const minOffset = containerWidth - totalWidth - edgePadding;

    return Math.min(maxOffset, Math.max(minOffset, centeredOffset));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    if (dx > dy && dx > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 35) {
      if (dx < 0 && selectedIndex < cards.length - 1) {
        onSelect(cards[selectedIndex + 1].id);
      } else if (dx > 0 && selectedIndex > 0) {
        onSelect(cards[selectedIndex - 1].id);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownRef.current = true;
    touchStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    const dx = Math.abs(e.clientX - touchStartRef.current.x);
    if (dx > 10) {
      isDraggingRef.current = true;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!mouseDownRef.current) return;
    mouseDownRef.current = false;
    const dx = e.clientX - touchStartRef.current.x;

    if (Math.abs(dx) > 35) {
      if (dx < 0 && selectedIndex < cards.length - 1) {
        onSelect(cards[selectedIndex + 1].id);
      } else if (dx > 0 && selectedIndex > 0) {
        onSelect(cards[selectedIndex - 1].id);
      }
    }
  };

  const handleMouseLeave = () => {
    mouseDownRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden py-4 select-none cursor-grab active:cursor-grabbing"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="flex items-center"
        style={{ gap: `${gap}px` }}
        animate={{ x: getTrackOffset() }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 28,
          mass: 0.8,
        }}
      >
        {cards.map((card, i) => {
          const dist = Math.abs(i - selectedIndex);
          const isSelected = dist === 0;
          const isAdjacent = dist === 1;
          const Icon = card.icon;

          return (
            <motion.button
              key={card.id}
              onClick={() => onSelect(card.id)}
              className={`flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden ${
                isSelected
                  ? 'ring-1 ring-primary/10'
                  : 'border border-border'
              }`}
              animate={{
                width: getCardWidth(i),
                height: isSelected ? 120 : 96,
                opacity: isSelected ? 1 : isAdjacent ? 0.75 : 0.45,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 28,
                mass: 0.8,
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Background for selected card */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  backgroundColor: isSelected ? 'var(--primary)' : 'var(--muted)',
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />

              {/* Card content */}
              <div className="relative z-10 flex flex-col items-center gap-2 px-3">
                <motion.div
                  animate={{
                    scale: isSelected ? 1 : 0.85,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <Icon
                    className={`${isSelected ? 'size-6' : 'size-[18px]'} ${
                      isSelected ? 'text-primary-foreground' : 'text-muted-foreground'
                    } transition-colors duration-300`}
                  />
                </motion.div>

                <span
                  className={`${isSelected ? 'text-[13px] text-primary-foreground' : 'text-[11px] text-muted-foreground'} transition-colors duration-300 whitespace-nowrap`}
                >
                  {card.label}
                </span>

                {card.count === 0 && card.status === 'new' ? (
                  // Create card — no count badge
                  isSelected ? (
                    <span className="text-[11px] text-primary-foreground/80 bg-primary-foreground/15 px-2.5 py-[3px] rounded-full whitespace-nowrap">
                      New event
                    </span>
                  ) : null
                ) : isSelected ? (
                  <span className="text-[11px] text-primary-foreground/80 bg-primary-foreground/15 px-2.5 py-[3px] rounded-full whitespace-nowrap">
                    {card.count} {card.status}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {card.count}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            className="rounded-full"
            animate={{
              width: i === selectedIndex ? 16 : 5,
              height: 5,
              backgroundColor: i === selectedIndex ? 'var(--primary)' : 'var(--border)',
            }}
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 30,
            }}
          />
        ))}
      </div>
    </div>
  );
}