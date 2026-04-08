import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeableContentProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  canSwipeLeft?: boolean;
  canSwipeRight?: boolean;
  currentIndex?: number;
  totalItems?: number;
}

export function SwipeableContent({
  children,
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft = false,
  canSwipeRight = false,
  currentIndex = 0,
  totalItems = 0,
}: SwipeableContentProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [showLeftHint, setShowLeftHint] = useState(false);
  const [showRightHint, setShowRightHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in px) to trigger navigation
  const minSwipeDistance = 75;
  const hintThreshold = 30; // Show hint arrows when dragging past this threshold

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;
    
    setTouchEnd(currentTouch);
    
    // Apply resistance at edges
    let newOffset = -diff;
    
    // Add resistance when trying to swipe in disabled direction
    if ((newOffset > 0 && !canSwipeLeft) || (newOffset < 0 && !canSwipeRight)) {
      newOffset = newOffset * 0.3; // 30% resistance
    } else {
      // Normal movement with slight resistance
      newOffset = newOffset * 0.8;
    }
    
    setOffsetX(newOffset);

    // Show hint arrows when dragging
    if (Math.abs(diff) > hintThreshold) {
      if (diff < 0 && canSwipeLeft) {
        setShowLeftHint(true);
        setShowRightHint(false);
      } else if (diff > 0 && canSwipeRight) {
        setShowRightHint(true);
        setShowLeftHint(false);
      }
    } else {
      setShowLeftHint(false);
      setShowRightHint(false);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setOffsetX(0);
      setShowLeftHint(false);
      setShowRightHint(false);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && canSwipeRight && onSwipeRight) {
      onSwipeRight();
    }

    if (isRightSwipe && canSwipeLeft && onSwipeLeft) {
      onSwipeLeft();
    }

    // Reset states
    setIsDragging(false);
    setOffsetX(0);
    setTouchStart(null);
    setTouchEnd(null);
    setShowLeftHint(false);
    setShowRightHint(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Left hint arrow */}
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 pointer-events-none ${
          showLeftHint ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="bg-[#420D74] text-white rounded-full p-3 shadow-lg">
          <ChevronLeft className="size-6" />
        </div>
      </div>

      {/* Right hint arrow */}
      <div
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all duration-200 pointer-events-none ${
          showRightHint ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}
      >
        <div className="bg-[#420D74] text-white rounded-full p-3 shadow-lg">
          <ChevronRight className="size-6" />
        </div>
      </div>

      {/* Swipeable content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
        className="touch-pan-y"
      >
        {children}
      </div>

      {/* Page indicator dots */}
      {totalItems > 1 && (
        <div className="flex justify-center gap-1.5 py-4">
          {Array.from({ length: totalItems }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-6 bg-[#420D74]'
                  : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
